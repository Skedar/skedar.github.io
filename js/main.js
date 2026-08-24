/**
 * SKEDAR_ // MAIN APPLICATION
 * Ponto de entrada da aplicação.
 */

import { HUD } from './hud.js';
import { ProjectManager } from './projects.js';

class SkedarApp {
    constructor() {
        this.bootScreen = document.getElementById('boot-screen');
        this.mainInterface = document.getElementById('main-interface');
        this.hud = null;
        this.projectManager = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            await this.runBootSequence();
            this.setupInterface();
            this.isInitialized = true;
        } catch (error) {
            console.error('[SKEDAR] Initialization error:', error);
            this.handleCriticalError(error);
        }
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

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

        await this.sleep(reducedMotion ? 1 : 300);
        this.bootScreen?.classList.add('hidden');
        this.mainInterface?.removeAttribute('inert');
        this.mainInterface?.classList.add('visible');

        window.setTimeout(() => this.bootScreen?.remove(), reducedMotion ? 1 : 600);
    }

    setupInterface() {
        this.hud = new HUD();
        this.projectManager = new ProjectManager();
        this.setupNavigation();
        this.setupKeyboardShortcuts();
        this.addScanlineEffect();
        this.addDataStream();
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

            if (event.key === '/' && !isTyping) {
                event.preventDefault();
                document.getElementById('project-search')?.focus();
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
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
