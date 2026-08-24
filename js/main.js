/**
 * ===================================
 * SKEDAR_ // MAIN APPLICATION
 * Ponto de entrada da aplicação
 * ===================================
 */

// Import modules
import { HUD } from './hud.js';
import { ProjectManager } from './projects.js';

// ===================================
// TYPES (JSDoc)
// ===================================

/**
 * @typedef {Object} ProjectData
 * @property {string} id - Unique identifier
 * @property {string} title - Project title
 * @property {string} description - Short description
 * @property {string} fullDescription - Detailed description
 * @property {string} status - active | development | archived
 * @property {string} category - web | game | tool | experiment
 * @property {string[]} technologies - List of technologies
 * @property {string} liveUrl - URL to live version
 * @property {string} repoUrl - URL to repository
 * @property {string} lastUpdated - ISO date string
 */

// ===================================
// APPLICATION CLASS
// ===================================

class SkedarApp {
    constructor() {
        /** @type {HTMLElement | null} */
        this.bootScreen = document.getElementById('boot-screen');

        /** @type {HTMLElement | null} */
        this.mainInterface = document.getElementById('main-interface');

        /** @type {HUD | null} */
        this.hud = null;

        /** @type {ProjectManager | null} */
        this.projectManager = null;

        /** @type {boolean} */
        this.isInitialized = false;

        this.init();
    }

    /**
     * Initialize the application
     */
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

    /**
     * Run the boot sequence with fake logs
     */
    async runBootSequence() {
        const bootLog = document.getElementById('boot-log');
        const progressBar = document.getElementById('boot-progress-bar');
        const bootStatus = document.getElementById('boot-status');

        if (!bootLog || !progressBar || !bootStatus) {
            throw new Error('Boot screen elements not found');
        }

        const bootMessages = [
            { text: '[OK] CPU: Intel i7-9700K @ 3.60GHz', type: 'success' },
            { text: '[OK] Memory: 32GB DDR4 @ 3200MHz', type: 'success' },
            { text: '[..] Initializing network stack...', type: 'info' },
            { text: '[OK] Network interface eth0: 192.168.1.100', type: 'success' },
            { text: '[..] Loading module: RENDER_ENGINE v2.4.1', type: 'info' },
            { text: '[OK] Render engine loaded successfully', type: 'success' },
            { text: '[..] Mounting project database...', type: 'info' },
            { text: '[OK] Database mounted: /var/skedar/projects.db', type: 'success' },
            { text: '[..] Verifying system integrity...', type: 'info' },
            { text: '[OK] All checksums passed', type: 'success' },
            { text: '[OK] Security protocols: ENFORCED', type: 'success' },
            { text: '[..] Loading user interface components...', type: 'info' },
            { text: '[OK] UI components initialized', type: 'success' },
            { text: '', type: 'info' },
            { text: 'SYSTEM READY', type: 'success' },
        ];

        const totalSteps = bootMessages.length;
        const stepDelay = 120;

        for (let i = 0; i < totalSteps; i++) {
            const msg = bootMessages[i];
            const line = document.createElement('div');
            line.className = `boot-log-line ${msg.type}`;
            line.textContent = msg.text;
            bootLog.appendChild(line);

            // Auto-scroll
            bootLog.scrollTop = bootLog.scrollHeight;

            // Update progress
            const progress = ((i + 1) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
            bootStatus.textContent = `${Math.round(progress)}%`;

            // Wait
            await this.sleep(stepDelay);
        }

        // Final pause
        await this.sleep(400);

        // Hide boot screen
        this.bootScreen?.classList.add('hidden');
        this.mainInterface?.classList.remove('aria-hidden');
        this.mainInterface?.classList.add('visible');

        // Remove boot screen from DOM after transition
        setTimeout(() => {
            this.bootScreen?.remove();
        }, 600);
    }

    /**
     * Setup the main interface components
     */
    setupInterface() {
        // Initialize HUD
        this.hud = new HUD();

        // Initialize Project Manager
        this.projectManager = new ProjectManager();

        // Setup navigation
        this.setupNavigation();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Add scanline effect
        this.addScanlineEffect();

        // Add data stream background
        this.addDataStream();

        console.log('%c[SKEDAR] System initialized successfully', 'color: #00f3ff');
    }

    /**
     * Setup navigation between sections
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();

                const targetSection = link.getAttribute('data-section');
                if (!targetSection) return;

                // Update nav state
                navLinks.forEach((nav) => nav.classList.remove('active'));
                link.classList.add('active');

                // Remove aria-current from all
                navLinks.forEach((nav) => nav.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'page');

                // Update sections
                sections.forEach((section) => {
                    section.classList.remove('active');
                    section.hidden = true;
                });

                const target = document.getElementById(`section-${targetSection}`);
                if (target) {
                    target.classList.add('active');
                    target.hidden = false;
                }

                // Trigger glitch on nav
                this.triggerGlitchEffect(link);
            });
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Escape key - close modal
            if (event.key === 'Escape') {
                const modal = document.getElementById('project-modal');
                if (modal?.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            }

            // Number keys for navigation
            if (event.target === document.body) {
                if (event.key === '1') {
                    document.querySelector('[data-section="projects"]')?.click();
                } else if (event.key === '2') {
                    document.querySelector('[data-section="about"]')?.click();
                } else if (event.key === '3') {
                    document.querySelector('[data-section="archive"]')?.click();
                }
            }

            // Forward slash to focus search
            if (event.key === '/' && event.target === document.body) {
                event.preventDefault();
                const search = document.getElementById('project-search');
                search?.focus();
            }
        });
    }

    /**
     * Add scanline overlay effect
     */
    addScanlineEffect() {
        const scanline = document.createElement('div');
        scanline.className = 'scanline-overlay';
        scanline.setAttribute('aria-hidden', 'true');
        document.body.appendChild(scanline);
    }

    /**
     * Add data stream background elements
     */
    addDataStream() {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.setAttribute('aria-hidden', 'true');

        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
        const numLines = 15;

        for (let i = 0; i < numLines; i++) {
            const line = document.createElement('div');
            line.className = 'stream-line';

            // Random position and speed
            const left = Math.random() * 100;
            const duration = 10 + Math.random() * 20;
            const delay = Math.random() * 10;

            line.style.left = `${left}%`;
            line.style.animationDuration = `${duration}s`;
            line.style.animationDelay = `${delay}s`;

            // Random text content
            const textLength = 20 + Math.floor(Math.random() * 30);
            let text = '';
            for (let j = 0; j < textLength; j++) {
                text += characters[Math.floor(Math.random() * characters.length)];
            }
            line.textContent = text;

            stream.appendChild(line);
        }

        document.body.appendChild(stream);
    }

    /**
     * Trigger glitch effect on element
     * @param {HTMLElement} element
     */
    triggerGlitchEffect(element) {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        element.classList.add('glitching');
        setTimeout(() => {
            element.classList.remove('glitching');
        }, 300);
    }

    /**
     * Sleep utility
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Handle critical errors
     * @param {Error} error
     */
    handleCriticalError(error) {
        console.error('[SKEDAR] Critical error:', error);

        // Show error state to user
        const errorHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 2rem;
                background: #0a0e12;
                border: 1px solid #ff0055;
                color: #e0e0e0;
                font-family: monospace;
                text-align: center;
                z-index: 10000;
            ">
                <h2 style="color: #ff0055; margin-bottom: 1rem;">SYSTEM FAILURE</h2>
                <p>Erro crítico durante inicialização.</p>
                <p style="color: #666; font-size: 0.8rem; margin-top: 1rem;">
                    ${error.message}
                </p>
                <button
                    onclick="window.location.reload()"
                    style="
                        margin-top: 1.5rem;
                        padding: 0.5rem 2rem;
                        background: transparent;
                        border: 1px solid #00f3ff;
                        color: #00f3ff;
                        font-family: monospace;
                        cursor: pointer;
                    "
                >
                    REINICIAR SISTEMA
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }
}

// ===================================
// INITIALIZE APP
// ===================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SkedarApp();
    });
} else {
    new SkedarApp();
}
