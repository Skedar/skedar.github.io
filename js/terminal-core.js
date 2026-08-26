/**
 * SKEDAR_ // TERMINAL CORE
 * Lógica pura do terminal, sem dependências de DOM.
 * Reutilizável em Node (testes) e no navegador.
 */

/** Comprimento máximo aceito para uma linha de comando. */
export const MAX_INPUT_LENGTH = 256;

/** Nomes de comando reconhecidos pelo terminal. */
export const COMMAND_NAMES = Object.freeze([
    '/help',
    '/h',
    'pwd',
    'ls',
    'cd',
    '..',
    'clear',
    'search',
    'run',
    'open',
    'status',
    'about',
    'projects',
    'archive',
    'home',
]);

/**
 * Árvore de arquivos virtual confinada em /home.
 * Os projetos (.sh) são dinâmicos e não aparecem como nós estáticos.
 */
const VFS_NODES = {
    home: { name: 'home', path: '/home', parent: null, children: ['about', 'archive', 'projects'] },
    about: {
        name: 'about',
        path: '/home/about',
        parent: 'home',
        children: [],
        section: 'about',
    },
    archive: {
        name: 'archive',
        path: '/home/archive',
        parent: 'home',
        children: [],
        section: 'archive',
    },
    projects: {
        name: 'projects',
        path: '/home/projects',
        parent: 'home',
        children: [],
        section: 'projects',
    },
};

/** Caminho canônico do diretório inicial. */
export const HOME_PATH = VFS_NODES.home.path;

/** Caminho canônico do diretório de projetos. */
export const PROJECTS_PATH = VFS_NODES.projects.path;

/** Caminho canônico do arquivo morto. */
export const ARCHIVE_PATH = VFS_NODES.archive.path;

/** Mapa caminho -> chave de nó, para resolução rápida. */
const PATH_TO_KEY = new Map(
    Object.entries(VFS_NODES).map(([key, node]) => [node.path, key]),
);

function stripTrailingSlash(value) {
    return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
}

function nodeByPath(path) {
    if (typeof path !== 'string') return null;
    const key = PATH_TO_KEY.get(stripTrailingSlash(path.trim()));
    return key ? VFS_NODES[key] : null;
}

/**
 * Normaliza o nome de um comando: minúsculas e sem ponto final opcional.
 * Ex.: "/help." -> "/help", "/H." -> "/h".
 */
export function normalizeCommandName(raw) {
    if (typeof raw !== 'string') return '';
    return raw.trim().toLowerCase().replace(/([^.])\.+$/, '$1');
}

/**
 * Divide uma linha de entrada em comando e argumentos, sem jamais avaliar
 * o conteúdo. Rejeita entradas excessivamente longas.
 * @returns {{ command: string, args: string[], rawArgs: string }}
 */
export function parseCommand(raw) {
    if (typeof raw !== 'string') {
        throw new TypeError('Comando inválido');
    }
    if (raw.length > MAX_INPUT_LENGTH) {
        throw new RangeError('Comando muito longo');
    }

    const trimmed = raw.trim();
    if (!trimmed) {
        return { command: '', args: [], rawArgs: '' };
    }

    const firstSpace = trimmed.search(/\s/);
    let commandToken;
    let rawArgs;
    if (firstSpace === -1) {
        commandToken = trimmed;
        rawArgs = '';
    } else {
        commandToken = trimmed.slice(0, firstSpace);
        rawArgs = trimmed.slice(firstSpace + 1).trim();
    }

    const command = normalizeCommandName(commandToken);
    const args = rawArgs ? rawArgs.split(/\s+/) : [];
    return { command, args, rawArgs };
}

/**
 * Resolve um segmento de caminho relativo a partir de uma base, dentro da
 * árvore virtual confinada. Aceita segmentos compostos e caminhos absolutos
 * iniciados em /home. Retorna o caminho canônico ou null.
 */
export function normalizeVirtualPath(base, segment) {
    if (typeof segment !== 'string') return null;

    // Caminhos absolutos: devem estar dentro de /home
    if (segment.startsWith('/')) {
        if (!segment.startsWith('/home')) return null;
        const after = segment.slice('/home'.length);
        if (after !== '' && !after.startsWith('/')) return null;
        if (after === '' || after === '/') return HOME_PATH;
        return normalizeVirtualPath(HOME_PATH, after.slice(1));
    }

    let node = nodeByPath(base);
    if (!node) return null;

    const parts = segment.split('/').filter((part) => part.length > 0);
    for (const part of parts) {
        if (part === '.') {
            continue;
        }
        if (part === '..') {
            if (!node.parent) return null;
            node = VFS_NODES[node.parent];
            continue;
        }
        const childKey = node.children.find((key) => VFS_NODES[key]?.name === part);
        if (!childKey) return null;
        node = VFS_NODES[childKey];
    }

    return node.path;
}

/** Lista os nomes filhos de um caminho virtual (para ls e autocomplete). */
export function listVirtualChildren(path) {
    const node = nodeByPath(path);
    if (!node) return [];
    return node.children.map((key) => VFS_NODES[key].name);
}

/** Retorna a URL relativa segura associada a um caminho virtual, se houver. */
export function resolveVirtualTargetUrl(path) {
    const node = nodeByPath(path);
    return node && typeof node.url === 'string' ? node.url : null;
}

/** Retorna a seção do site associada a um caminho virtual, se houver. */
export function resolveVirtualSection(path) {
    const node = nodeByPath(path);
    return node && typeof node.section === 'string' ? node.section : null;
}

const SAFE_BASENAME_RE = /^[a-z0-9][a-z0-9._-]*\.sh$/;

/**
 * Resolve um caminho de executável de projeto (.sh) dentro de /home/projects.
 * Aceita caminhos relativos ao cwd, o prefixo projects/ e o absoluto /home/projects/.
 * Rejeita traversal e extensões que não sejam .sh.
 * @returns {string|null}
 */
export function normalizeVirtualExecutablePath(cwd, target) {
    if (typeof target !== 'string') return null;
    if (!target.endsWith('.sh')) return null;

    // Caminho absoluto: /home/projects/foo.sh
    if (target.startsWith('/')) {
        if (!target.startsWith('/home/projects/')) return null;
        const filename = target.slice('/home/projects/'.length);
        if (!filename || filename.includes('/') || !SAFE_BASENAME_RE.test(filename)) return null;
        return `${PROJECTS_PATH}/${filename}`;
    }

    // Caminho relativo: separa diretório e nome do arquivo
    const slashIdx = target.lastIndexOf('/');
    const dirPart = slashIdx >= 0 ? target.slice(0, slashIdx) : '';
    const filename = slashIdx >= 0 ? target.slice(slashIdx + 1) : target;

    if (!SAFE_BASENAME_RE.test(filename)) return null;

    const resolvedDir = dirPart
        ? normalizeVirtualPath(cwd, dirPart)
        : cwd;

    if (resolvedDir !== PROJECTS_PATH) return null;

    return `${PROJECTS_PATH}/${filename}`;
}

/**
 * Aceita apenas URLs HTTP(S) de mesma origem ou caminhos relativos de mesma
 * origem. Rejeita javascript:, data:, protocolo relativo ("//host") e
 * qualquer origem externa. Retorna a URL absoluta resolvida ou null.
 */
export function sanitizeNavigationUrl(url, base) {
    if (typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('//')) return null;

    let baseUrl;
    try {
        baseUrl = new URL(base);
    } catch {
        return null;
    }

    let resolved;
    try {
        resolved = new URL(trimmed, baseUrl);
    } catch {
        return null;
    }

    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null;
    if (resolved.username || resolved.password) return null;
    if (resolved.origin !== baseUrl.origin) return null;
    return resolved.href;
}

/**
 * Sugere completamentos por prefixo dado um conjunto de candidatos.
 * Retorna o array ordenado de correspondências.
 */
export function completeToken(prefix, candidates) {
    if (typeof prefix !== 'string') return [];
    const lower = prefix.toLowerCase();
    return candidates
        .filter((candidate) => candidate.toLowerCase().startsWith(lower))
        .sort();
}
