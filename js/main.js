/**
 * SKEDAR_ // MAIN APPLICATION
 * Ponto de entrada da aplicação.
 */

import { HUD } from './hud.js';
import { ProjectManager } from './projects.js';
import { Terminal } from './terminal.js';

class SkedarApp {
    constructor() {
        this.bootScreen = document.getElementById('boot-screen');
        this.mainInterface = document.getElementById('main-interface');
        this.hud = null;
        this.projectManager = null;
        this.terminal = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            await this.runBootSequence();
            await this.awaitBootConfirmation();
            await this.materialize();
            this.setupInterface();
            this.isInitialized = true;
        } catch (error) {
            console.error('[SKEDAR] Initialization error:', error);
            this.handleCriticalError(error);
        }
    }

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    async runBootSequence() {
        const bootLog = document.getElementById('boot-log');
        const progressBar = document.getElementById('boot-progress-bar');
        const bootStatus = document.getElementById('boot-status');

        if (!bootLog || !progressBar || !bootStatus) {
            throw new Error('Elementos da tela de inicialização não encontrados');
        }

        const bootMessages = [
            { text: '[..] Inicializando interface...', type: 'info' },
            { text: '[OK] Módulos visuais carregados', type: 'success' },
            { text: '[..] Verificando catálogo de projetos...', type: 'info' },
            { text: '[OK] Rota local: /projects/projects.json', type: 'success' },
            { text: '[..] Configurando navegação e atalhos...', type: 'info' },
            { text: '[OK] Preferências de acessibilidade detectadas', type: 'success' },
            { text: '[..] Ativando indicadores da sessão...', type: 'info' },
            { text: '[OK] Interface pronta', type: 'success' },
            { text: '', type: 'info' },
            { text: 'SYSTEM READY', type: 'success' },
        ];

        const reducedMotion = this.prefersReducedMotion();
        const stepDelay = reducedMotion ? 1 : 100;

        for (let index = 0; index < bootMessages.length; index += 1) {
            const message = bootMessages[index];
            const line = document.createElement('div');
            line.className = `boot-log-line ${message.type}`;
            line.textContent = message.text;
            bootLog.appendChild(line);
            bootLog.scrollTop = bootLog.scrollHeight;

            const progress = ((index + 1) / bootMessages.length) * 100;
            progressBar.style.width = `${progress}%`;
            bootStatus.textContent = `${Math.round(progress)}%`;
            await this.sleep(stepDelay);
        }

        await this.sleep(reducedMotion ? 1 : 200);
    }

    /**
     * Exibe o prompt de confirmação e resolve somente quando o usuário aceita
     * com Enter, Y ou YES (sem distinção de maiúsculas). NO ou entrada inválida
     * mantém a espera.
     */
    awaitBootConfirmation() {
        const form = document.getElementById('boot-confirm');
        const input = document.getElementById('boot-confirm-input');
        const hint = document.getElementById('boot-confirm-hint');
        const bootStatus = document.getElementById('boot-status');

        if (!form || !(input instanceof HTMLInputElement)) {
            return Promise.reject(new Error('Prompt de confirmação do boot não encontrado'));
        }

        form.hidden = false;
        if (bootStatus) bootStatus.textContent = 'AGUARDANDO CONFIRMAÇÃO';
        // Foco na confirmação encerra a sequência de boot (requisito).
        input.focus();

        return new Promise((resolve) => {
            const onSubmit = (event) => {
                event.preventDefault();
                const value = input.value.trim().toLowerCase();
                if (value === '' || value === 'y' || value === 'yes') {
                    form.removeEventListener('submit', onSubmit);
                    form.hidden = true;
                    resolve();
                    return;
                }
                if (hint) {
                    hint.textContent = value === 'n' || value === 'no'
                        ? 'Execução recusada. Pressione Enter, Y ou YES para iniciar.'
                        : `Entrada inválida: "${input.value.trim()}". Use Enter, Y ou YES.`;
                }
                input.value = '';
                input.focus();
            };
            form.addEventListener('submit', onSubmit);
        });
    }

    /**
     * Materializa a interface com um efeito Matrix/glitch controlado e depois
     * assenta no site corrigido. Reduced-motion pula a animação.
     */
    async materialize() {
        const reducedMotion = this.prefersReducedMotion();
        const overlay = document.getElementById('materialize-overlay');

        this.bootScreen?.classList.add('hidden');
        this.mainInterface?.removeAttribute('inert');
        this.mainInterface?.classList.add('visible');

        if (overlay && !reducedMotion) {
            overlay.hidden = false;
            this.buildMatrixColumns(overlay);
            this.mainInterface?.classList.add('materializing');
            await this.sleep(1300);
            overlay.classList.add('settling');
            this.mainInterface?.classList.remove('materializing');
            await this.sleep(400);
            overlay.hidden = true;
            overlay.classList.remove('settling');
            this.clearElement(overlay);
        }

        window.setTimeout(() => this.bootScreen?.remove(), reducedMotion ? 1 : 600);
    }

    buildMatrixColumns(overlay) {
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
        const columnCount = Math.min(48, Math.max(12, Math.floor(window.innerWidth / 22)));

        for (let index = 0; index < columnCount; index += 1) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${(index / columnCount) * 100}%`;
            column.style.animationDelay = `${Math.random() * 0.6}s`;
            column.style.animationDuration = `${0.8 + Math.random() * 0.9}s`;

            const length = 14 + Math.floor(Math.random() * 22);
            let text = '';
            for (let charIndex = 0; charIndex < length; charIndex += 1) {
                text += `${characters[Math.floor(Math.random() * characters.length)]}\n`;
            }
            column.textContent = text;
            overlay.appendChild(column);
        }
    }

    clearElement(element) {
        while (element.firstChild) element.removeChild(element.firstChild);
    }

    setupInterface() {
        this.hud = new HUD();
        this.projectManager = new ProjectManager();
        this.setupNavigation();
        this.setupKeyboardShortcuts();
        this.addScanlineEffect();
        this.addDataStream();
        this.terminal = new Terminal({
            projectManager: this.projectManager,
            hud: this.hud,
            navigate: (section) => this.navigateTo(section),
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetSection = link.getAttribute('data-section');
                if (!targetSection) return;

                navLinks.forEach((nav) => {
                    nav.classList.remove('active');
                    nav.removeAttribute('aria-current');
                });
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');

                sections.forEach((section) => {
                    section.classList.remove('active');
                    section.hidden = true;
                });

                const target = document.getElementById(`section-${targetSection}`);
                if (target) {
                    target.classList.add('active');
                    target.hidden = false;
                    target.focus({ preventScroll: true });
                }

                if (link instanceof HTMLElement) this.triggerGlitchEffect(link);
            });
        });
    }

    /** Navega para uma seção conhecida (usado pelo terminal). */
    navigateTo(section) {
        const link = document.querySelector(`.nav-link[data-section="${section}"]`);
        if (link instanceof HTMLElement) link.click();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.projectManager?.isModalOpen()) {
                this.projectManager.closeModal();
                return;
            }

            const target = event.target;
            const isTyping = target instanceof HTMLInputElement
                || target instanceof HTMLSelectElement
                || target instanceof HTMLTextAreaElement;

            if (!isTyping && ['1', '2', '3'].includes(event.key)) {
                const sectionNames = { 1: 'projects', 2: 'about', 3: 'archive' };
                document.querySelector(`[data-section="${sectionNames[event.key]}"]`)?.click();
            }
        });
    }

    addScanlineEffect() {
        const scanline = document.createElement('div');
        scanline.className = 'scanline-overlay';
        scanline.setAttribute('aria-hidden', 'true');
        document.body.appendChild(scanline);
    }

    addDataStream() {
        if (this.prefersReducedMotion()) return;

        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.setAttribute('aria-hidden', 'true');
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

        for (let index = 0; index < 15; index += 1) {
            const line = document.createElement('div');
            line.className = 'stream-line';
            line.style.left = `${Math.random() * 100}%`;
            line.style.animationDuration = `${10 + Math.random() * 20}s`;
            line.style.animationDelay = `${Math.random() * 10}s`;

            const textLength = 20 + Math.floor(Math.random() * 30);
            let text = '';
            for (let charIndex = 0; charIndex < textLength; charIndex += 1) {
                text += characters[Math.floor(Math.random() * characters.length)];
            }
            line.textContent = text;
            stream.appendChild(line);
        }

        document.body.appendChild(stream);
    }

    triggerGlitchEffect(element) {
        if (this.prefersReducedMotion()) return;
        element.classList.add('glitching');
        window.setTimeout(() => element.classList.remove('glitching'), 300);
    }

    sleep(milliseconds) {
        return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    handleCriticalError(error) {
        const container = document.createElement('div');
        container.className = 'critical-error';

        const title = document.createElement('h2');
        title.textContent = 'SYSTEM FAILURE';

        const message = document.createElement('p');
        message.textContent = 'Erro crítico durante a inicialização.';

        const detail = document.createElement('p');
        detail.className = 'critical-error-detail';
        detail.textContent = error instanceof Error ? error.message : 'Erro desconhecido';

        const reloadButton = document.createElement('button');
        reloadButton.type = 'button';
        reloadButton.textContent = 'REINICIAR SISTEMA';
        reloadButton.addEventListener('click', () => window.location.reload());

        container.append(title, message, detail, reloadButton);
        document.body.appendChild(container);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SkedarApp(), { once: true });
} else {
    new SkedarApp();
}
