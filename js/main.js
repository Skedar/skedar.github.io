/**
 * SKEDAR_ // MAIN APPLICATION
 * Ponto de entrada da aplicação.
 */

import { createGlitchFrame } from './glitch-core.js';
import { HUD } from './hud.js';
import { ProjectManager } from './projects.js';
import { Terminal } from './terminal.js';

const glitchTimers = new WeakMap();

const GLYPH_FRAMES = [
    ' /\\\n/__\\',
    '/||\n\\||',
    ' __\n|__|',
    '|/|\n|/|',
    '\\|/\n/|\\',
    ' ()\n/__\\',
];

class SkedarApp {
    constructor() {
        this.bootScreen = document.getElementById('boot-screen');
        this.mainInterface = document.getElementById('main-interface');
        this.hud = null;
        this.projectManager = null;
        this.terminal = null;
        this.isInitialized = false;
        this.glyphFrameIndex = 0;
        this.isMaterializing = false;

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
     * com Enter, Y ou YES. NO ou entrada inválida mantém a espera.
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
     * Materializes the interface with a Matrix/glitch effect then settles.
     * Reduced-motion skips the animation.
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

    /**
     * Replays the Matrix materialization effect on demand (logo click).
     * Does not re-run boot confirmation. No-op under reduced motion.
     */
    async replayMaterialization() {
        if (this.prefersReducedMotion() || this.isMaterializing) return;
        const overlay = document.getElementById('materialize-overlay');
        if (!overlay) return;
        this.isMaterializing = true;
        this.clearElement(overlay);
        overlay.classList.remove('settling');
        overlay.hidden = false;
        this.buildMatrixColumns(overlay);
        this.mainInterface?.classList.add('materializing');
        try {
            await this.sleep(1300);
            overlay.classList.add('settling');
            this.mainInterface?.classList.remove('materializing');
            await this.sleep(400);
            overlay.hidden = true;
            overlay.classList.remove('settling');
            this.clearElement(overlay);
        } finally {
            this.mainInterface?.classList.remove('materializing');
            this.isMaterializing = false;
        }
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
        this.setupLogoInteraction();
        this.setupSystemGlyph();
        this.setupAmbientGlitches();
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

    /** Navigates to a known section (used by the terminal). */
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

            if (!isTyping && ['1', '2', '3', '4'].includes(event.key)) {
                const sectionNames = { 1: 'terminal', 2: 'projects', 3: 'about', 4: 'archive' };
                document.querySelector(`[data-section="${sectionNames[event.key]}"]`)?.click();
            }
        });
    }

    /** Wires the site-logo button to replay the materialization effect. */
    setupLogoInteraction() {
        const logo = document.getElementById('site-logo');
        if (!(logo instanceof HTMLElement)) return;
        logo.addEventListener('click', () => {
            this.triggerGlitchEffect(logo);
            this.replayMaterialization();
        });
    }

    /** Starts the autonomous 3D ASCII system glyph animation. No-op under reduced motion. */
    setupSystemGlyph() {
        if (this.prefersReducedMotion()) return;
        const glyphEl = document.querySelector('.system-glyph-lines');
        if (!glyphEl) return;

        const rotateGlyph = () => {
            if (this.prefersReducedMotion()) return;
            this.glyphFrameIndex = (this.glyphFrameIndex + 1) % GLYPH_FRAMES.length;
            glyphEl.textContent = GLYPH_FRAMES[this.glyphFrameIndex];
        };

        window.setInterval(rotateGlyph, 350);

        const scheduleGlyphGlitch = () => {
            window.setTimeout(() => {
                if (this.prefersReducedMotion()) return;
                const container = document.getElementById('system-glyph');
                if (container) {
                    container.classList.add('glitching');
                    window.setTimeout(() => container.classList.remove('glitching'), 250);
                }
                scheduleGlyphGlitch();
            }, 3000 + Math.random() * 9000);
        };

        scheduleGlyphGlitch();
    }

    /**
     * Sets up ambient random glitch effects on nav links and the brand logo.
     * No-op under reduced motion.
     */
    setupAmbientGlitches() {
        const hoverTargets = [
            ...document.querySelectorAll('.nav-link'),
            document.getElementById('site-logo'),
        ].filter(Boolean);
        hoverTargets.forEach((target) => {
            target.addEventListener('mouseenter', () => this.triggerGlitchEffect(target));
        });

        if (this.prefersReducedMotion()) return;

        const scheduleNext = () => {
            window.setTimeout(() => {
                if (this.prefersReducedMotion()) return;

                const targets = [
                    ...document.querySelectorAll('.nav-link'),
                    document.getElementById('site-logo'),
                ].filter(Boolean);
                const target = targets[Math.floor(Math.random() * targets.length)];
                if (target) this.triggerGlitchEffect(target);

                scheduleNext();
            }, 2500 + Math.random() * 7500);
        };

        scheduleNext();
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

        // Character-scramble animation on any .glitch-label children (pure text only)
        const labels = element.classList.contains('glitch-label')
            ? [element]
            : Array.from(element.querySelectorAll('.glitch-label'));
        for (const label of labels) {
            this.scrambleGlitchLabel(label);
        }
    }

    scrambleGlitchLabel(label) {
        if (label.childElementCount > 0) return; // preserve nested markup
        const existing = glitchTimers.get(label);
        if (existing) {
            window.clearTimeout(existing.timerId);
            label.textContent = existing.original;
        }
        const original = label.dataset.glitchText || label.textContent;
        if (!original) return;
        label.dataset.glitchText = original;

        let frame = 0;
        const TOTAL_FRAMES = 4;
        const state = { timerId: null, original };
        glitchTimers.set(label, state);

        const step = () => {
            if (this.prefersReducedMotion() || frame >= TOTAL_FRAMES) {
                label.textContent = original;
                glitchTimers.delete(label);
                return;
            }
            const intensity = (TOTAL_FRAMES - frame) / TOTAL_FRAMES;
            label.textContent = createGlitchFrame(original, intensity, Math.random);
            frame += 1;
            state.timerId = window.setTimeout(step, 50);
        };

        step();
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
