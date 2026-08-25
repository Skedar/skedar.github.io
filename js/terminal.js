/**
 * SKEDAR_ // TERMINAL
 * Controlador de DOM do terminal interativo. Toda a saída dinâmica usa
 * textContent; a entrada nunca é avaliada nem injetada como HTML.
 */

import {
    COMMAND_NAMES,
    HOME_PATH,
    PROJECTS_PATH,
    completeToken,
    listVirtualChildren,
    normalizeVirtualExecutablePath,
    normalizeVirtualPath,
    parseCommand,
    resolveVirtualTargetUrl,
    sanitizeNavigationUrl,
} from './terminal-core.js';

const MAX_HISTORY = 50;
const MAX_OUTPUT_LINES = 200;

/** Intro imersiva. A última linha precisa ser exatamente esta string. */
const INTRO_LINES = [
    'SKEDAR_SHELL // secure session established',
    'decrypting node graph .... [OK]',
    'mounting /home ................ [OK]',
    'shell@project:/home$ auth --token •••••••• granted',
    '',
    'Bem-vindo ao console Skedar_. Ambiente somente-leitura, sem rastreamento.',
    'Type /help. or /h. for the command list',
];

export class Terminal {
    /**
     * @param {object} deps
     * @param {import('./projects.js').ProjectManager} [deps.projectManager]
     * @param {{ getStatus?: () => object }} [deps.hud]
     * @param {(section: string) => void} [deps.navigate]
     */
    constructor({ projectManager = null, hud = null, navigate = null } = {}) {
        this.projectManager = projectManager;
        this.hud = hud;
        this.navigate = typeof navigate === 'function' ? navigate : () => {};

        this.panel = document.getElementById('terminal');
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.form = document.getElementById('terminal-form');
        this.promptPath = document.getElementById('terminal-path');

        this.cwd = HOME_PATH;
        this.history = [];
        this.historyIndex = 0;
        this.historyDraft = '';

        this.commands = this.buildCommandTable();

        if (this.output && this.input && this.form) {
            this.attach();
        }
    }

    attach() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submitCurrentInput();
        });

        this.input.addEventListener('keydown', (event) => this.handleKeydown(event));

        this.updatePrompt();
        this.printIntro();
    }

    buildCommandTable() {
        return {
            '/help': () => this.printHelp(),
            '/h': () => this.printHelp(),
            pwd: () => this.print(this.cwd),
            ls: (args) => this.runLs(args),
            cd: (args) => this.runCd(args),
            '..': () => this.runCd(['..']),
            clear: () => this.clearOutput(),
            search: (args, rawArgs) => this.runSearch(rawArgs),
            run: (args) => this.runRun(args),
            open: (args) => this.runOpen(args),
            status: () => this.runStatus(),
            about: () => this.runAbout(),
            projects: () => this.runNavigate('projects', 'PROJETOS'),
            archive: () => this.runNavigate('archive', 'ARQUIVO'),
            home: () => this.runHome(),
        };
    }

    /* ---- entrada / histórico / autocomplete ---- */

    submitCurrentInput() {
        const raw = this.input.value;
        this.input.value = '';
        this.execute(raw);
    }

    handleKeydown(event) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.recallHistory(-1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.recallHistory(1);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            this.autocomplete();
        }
    }

    recallHistory(direction) {
        if (this.history.length === 0) return;
        if (direction < 0 && this.historyIndex === this.history.length) {
            this.historyDraft = this.input.value;
        }
        this.historyIndex = Math.min(
            this.history.length,
            Math.max(0, this.historyIndex + direction),
        );
        this.input.value = this.historyIndex === this.history.length
            ? this.historyDraft
            : (this.history[this.historyIndex] ?? '');
        const end = this.input.value.length;
        this.input.setSelectionRange(end, end);
    }

    autocomplete() {
        const value = this.input.value;
        const trimmedStart = value.replace(/^\s+/, '');
        const firstWhitespace = trimmedStart.search(/\s/);
        if (firstWhitespace === -1) {
            const matches = completeToken(trimmedStart, COMMAND_NAMES);
            this.applyCompletion(trimmedStart, matches, '');
            return;
        }

        const argumentStart = firstWhitespace
            + (trimmedStart.slice(firstWhitespace).match(/^\s+/)?.[0].length ?? 0);
        const prefixPart = `${trimmedStart.slice(0, argumentStart)}`;
        const argFragment = trimmedStart.slice(argumentStart);
        const slashIndex = argFragment.lastIndexOf('/');
        const parentFragment = slashIndex >= 0 ? argFragment.slice(0, slashIndex) : '';
        const leafFragment = slashIndex >= 0 ? argFragment.slice(slashIndex + 1) : argFragment;

        let completionBase = this.cwd;
        if (parentFragment) {
            completionBase = normalizeVirtualPath(this.cwd, parentFragment) ?? null;
        }

        let candidates;
        if (completionBase === PROJECTS_PATH) {
            const projects = this.projectManager?.getProjects?.() ?? [];
            candidates = projects.map((p) => p.terminalFile).filter(Boolean);
        } else {
            candidates = completionBase ? listVirtualChildren(completionBase) : [];
        }

        const matches = completeToken(leafFragment, candidates);
        const completedMatches = matches.map((match) => (
            parentFragment ? `${parentFragment}/${match}` : match
        ));
        this.applyCompletion(argFragment, completedMatches, prefixPart);
    }

    applyCompletion(fragment, matches, prefixPart) {
        if (matches.length === 1) {
            this.input.value = `${prefixPart}${matches[0]}`;
        } else if (matches.length > 1) {
            this.printMuted(matches.join('  '));
        }
    }

    /* ---- execução ---- */

    execute(raw) {
        let parsed;
        try {
            parsed = parseCommand(raw);
        } catch (error) {
            this.printError(error instanceof Error ? error.message : 'Erro de leitura');
            return;
        }

        this.echoPrompt(raw.trim());

        if (!parsed.command) return;
        this.pushHistory(raw.trim());

        const handler = this.commands[parsed.command];
        if (!handler) {
            this.printError(`comando não encontrado: ${parsed.command}`);
            const hint = completeToken(parsed.command, COMMAND_NAMES);
            if (hint.length > 0) this.printMuted(`sugestões: ${hint.join(', ')}`);
            else this.printMuted("digite /help ou /h para a lista de comandos");
            return;
        }

        try {
            handler(parsed.args, parsed.rawArgs);
        } catch (error) {
            this.printError(error instanceof Error ? error.message : 'Falha ao executar');
        }
    }

    pushHistory(entry) {
        if (!entry) return;
        if (this.history[this.history.length - 1] !== entry) {
            this.history.push(entry);
            if (this.history.length > MAX_HISTORY) this.history.shift();
        }
        this.historyIndex = this.history.length;
        this.historyDraft = '';
    }

    /* ---- handlers ---- */

    printHelp() {
        this.print('COMANDOS DISPONÍVEIS:');
        const descriptions = {
            '/help': 'lista de comandos (alias: /h)',
            pwd: 'mostra o diretório atual',
            ls: 'lista o conteúdo do diretório',
            cd: 'muda de diretório (ex.: cd projects)',
            '..': 'sobe para o diretório pai',
            clear: 'limpa o terminal',
            search: 'filtra projetos por termo',
            run: 'executa um projeto (ex.: run projects/cyberpunk-archive.sh)',
            open: 'abre um projeto pelo id',
            status: 'exibe métricas da sessão',
            about: 'exibe a seção Sobre',
            projects: 'vai para Projetos',
            archive: 'vai para Arquivo',
            home: 'volta para /home',
        };
        for (const [name, desc] of Object.entries(descriptions)) {
            this.print(`  ${name.padEnd(10)} ${desc}`);
        }
    }

    runLs(args) {
        const target = args?.[0] ?? null;
        const path = target ? normalizeVirtualPath(this.cwd, target) : this.cwd;

        if (!path) {
            this.printError(`ls: diretório inacessível: ${target}`);
            return;
        }

        if (path === PROJECTS_PATH) {
            const projects = this.projectManager?.getProjects?.() ?? [];
            if (projects.length === 0) {
                this.printMuted('(vazio)');
                return;
            }
            this.print(projects.map((p) => p.terminalFile).join('  '));
            return;
        }

        const children = listVirtualChildren(path);
        if (children.length === 0) {
            this.printMuted('(vazio)');
            return;
        }
        this.print(children.join('  '));
    }

    runCd(args) {
        const target = args[0] ?? '';
        if (!target || target === '~' || target === '/') {
            this.cwd = HOME_PATH;
            this.updatePrompt();
            return;
        }
        const next = normalizeVirtualPath(this.cwd, target);
        if (!next) {
            this.printError(`cd: diretório inacessível: ${target}`);
            return;
        }
        this.cwd = next;
        this.updatePrompt();
    }

    runSearch(rawArgs) {
        const term = rawArgs.trim();
        this.navigate('projects');
        if (!this.projectManager?.setSearch) {
            this.printMuted('catálogo indisponível');
            return;
        }

        this.projectManager.setSearch(term);
        if (!term) {
            this.print('busca limpa');
            return;
        }

        const lowered = term.toLocaleLowerCase('pt-BR');
        const matches = (this.projectManager.getProjects?.() ?? [])
            .filter((project) => this.matchesSearch(project, lowered));

        this.print(`busca "${term}" -> ${matches.length} resultado(s)`);
        if (matches.length === 0) {
            this.printMuted('  nenhum caminho correspondente');
            return;
        }
        matches.forEach((project) => this.print(`  ${this.projectVirtualPath(project)}`));
    }

    matchesSearch(project, loweredTerm) {
        const text = [
            project.title,
            project.description,
            Array.isArray(project.technologies) ? project.technologies.join(' ') : '',
        ].join(' ').toLocaleLowerCase('pt-BR');
        return text.includes(loweredTerm);
    }

    projectVirtualPath(project) {
        if (typeof project.terminalFile === 'string' && project.terminalFile) {
            return `${PROJECTS_PATH}/${project.terminalFile}`;
        }
        let slug = '';
        if (typeof project.liveUrl === 'string') {
            const match = project.liveUrl.match(/projects\/([^/?#]+)/);
            if (match) slug = match[1];
        }
        if (!slug) {
            slug = String(project.title ?? '')
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
        return `${PROJECTS_PATH}/${slug}`;
    }

    runRun(args) {
        const target = args[0] ?? '';
        if (!target) {
            this.printError('run: informe um destino');
            return;
        }

        // Tenta resolver como executável de projeto (.sh)
        const execPath = normalizeVirtualExecutablePath(this.cwd, target);
        if (execPath) {
            this.runProjectExecutable(execPath, target);
            return;
        }

        // Legado: tenta como caminho virtual com URL associada
        const virtualPath = normalizeVirtualPath(this.cwd, target);
        const relativeUrl = virtualPath ? resolveVirtualTargetUrl(virtualPath) : null;
        if (!relativeUrl) {
            this.printError(`run: destino não executável: ${target}`);
            return;
        }
        this.openUrl(relativeUrl, target);
    }

    runProjectExecutable(execPath, label) {
        const filename = execPath.slice(PROJECTS_PATH.length + 1);
        const projects = this.projectManager?.getProjects?.() ?? [];
        const project = projects.find((p) => p.terminalFile === filename);
        if (!project) {
            this.printError(`run: executável não encontrado: ${label}`);
            return;
        }
        this.print(`executando ${filename} ...`);
        this.projectManager.openProjectById(project.id, this.input);
    }

    runOpen(args) {
        const target = args[0] ?? '';
        if (!target) {
            this.printError('open: informe um id de projeto');
            return;
        }
        const virtualPath = normalizeVirtualPath(this.cwd, target);
        const relativeUrl = virtualPath ? resolveVirtualTargetUrl(virtualPath) : null;
        if (relativeUrl) {
            this.openUrl(relativeUrl, target);
            return;
        }
        if (this.projectManager?.openProjectById) {
            this.navigate('projects');
            const opened = this.projectManager.openProjectById(target, this.input);
            if (opened) {
                this.print(`abrindo projeto: ${target}`);
                return;
            }
        }
        this.printError(`open: projeto não encontrado: ${target}`);
    }

    runStatus() {
        const status = this.hud?.getStatus ? this.hud.getStatus() : null;
        if (!status) {
            this.printMuted('status indisponível');
            return;
        }
        this.print(`SESSÃO ...... ${status.session ?? '--'}`);
        this.print(`UPTIME ...... ${status.uptime ?? '--'}`);
        this.print(`FPS ......... ${status.fps ?? '--'}`);
        this.print(`REDE ........ ${status.online ? 'ONLINE' : 'OFFLINE'}`);
    }

    runAbout() {
        this.navigate('about');
        this.print('Skedar_ // hub central de projetos experimentais.');
        this.printMuted('Interface limpa, zero rastreamento, zero dependências.');
    }

    runNavigate(section, label) {
        this.navigate(section);
        this.print(`-> ${label}`);
    }

    runHome() {
        this.cwd = HOME_PATH;
        this.updatePrompt();
        this.navigate('terminal');
        this.print('-> /home');
    }

    openUrl(relativeUrl, label) {
        const base = document.baseURI || window.location.href;
        const safe = sanitizeNavigationUrl(relativeUrl, base);
        if (!safe) {
            this.printError(`bloqueado: URL insegura para ${label}`);
            return;
        }
        this.print(`abrindo ${label} ...`);
        window.open(safe, '_blank', 'noopener,noreferrer');
    }

    /* ---- render ---- */

    printIntro() {
        for (const line of INTRO_LINES) {
            this.print(line);
        }
    }

    echoPrompt(text) {
        const line = this.createLine('terminal-line prompt-echo');
        const path = document.createElement('span');
        path.className = 'terminal-line-path';
        path.textContent = `shell@project:${this.cwd}$`;
        const command = document.createElement('span');
        command.className = 'terminal-line-command';
        command.textContent = ` ${text}`;
        line.append(path, command);
        this.commit(line);
    }

    print(text) {
        this.commit(this.textLine(text, 'terminal-line'));
    }

    printMuted(text) {
        this.commit(this.textLine(text, 'terminal-line muted'));
    }

    printError(text) {
        const line = this.textLine(text, 'terminal-line error');
        line.setAttribute('role', 'alert');
        this.commit(line);
    }

    textLine(text, className) {
        const line = this.createLine(className);
        line.textContent = text;
        return line;
    }

    createLine(className) {
        const line = document.createElement('div');
        line.className = className;
        return line;
    }

    commit(line) {
        if (!this.output) return;
        this.output.appendChild(line);
        while (this.output.childElementCount > MAX_OUTPUT_LINES) {
            this.output.removeChild(this.output.firstElementChild);
        }
        this.output.scrollTop = this.output.scrollHeight;
    }

    clearOutput() {
        if (!this.output) return;
        while (this.output.firstChild) this.output.removeChild(this.output.firstChild);
    }

    updatePrompt() {
        if (this.promptPath) this.promptPath.textContent = `shell@project:${this.cwd}$`;
    }

    focus() {
        this.input?.focus();
    }
}
