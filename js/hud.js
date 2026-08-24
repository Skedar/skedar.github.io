/**
 * ===================================
 * SKEDAR_ // HUD MANAGER
 * Gerencia o HUD inferior e indicadores
 * ===================================
 */

export class HUD {
    constructor() {
        /** @type {HTMLElement | null} */
        this.clockElement = document.getElementById('clock');

        /** @type {HTMLElement | null} */
        this.memoryElement = document.getElementById('hud-memory');

        /** @type {HTMLElement | null} */
        this.fpsElement = document.getElementById('hud-fps');

        /** @type {HTMLElement | null} */
        this.pingElement = document.getElementById('hud-ping');

        /** @type {HTMLElement | null} */
        this.uptimeElement = document.getElementById('hud-uptime');

        /** @type {HTMLElement | null} */
        this.sessionElement = document.getElementById('hud-session');

        /** @type {HTMLElement | null} */
        this.statusElement = document.getElementById('sys-status');

        /** @type {HTMLElement | null} */
        this.activityContainer = document.getElementById('hud-activity');

        /** @type {number} */
        this.startTime = Date.now();

        /** @type {number} */
        this.sessionId = this.generateSessionId();

        /** @type {number} */
        this.frames = 0;

        /** @type {number} */
        this.lastFrameTime = performance.now();

        /** @type {number} */
        this.fps = 0;

        this.init();
    }

    /**
     * Initialize HUD systems
     */
    init() {
        this.startClock();
        this.startMemoryMonitor();
        this.startFPSCounter();
        this.startPingSimulation();
        this.startUptimeCounter();
        this.startActivityIndicator();
        this.observeNetworkStatus();
        this.setSessionInfo();

        console.log('[HUD] Initialized');
    }

    /**
     * Start real-time clock
     */
    startClock() {
        const updateClock = () => {
            if (!this.clockElement) return;

            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            this.clockElement.textContent = timeString;
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    /**
     * Start memory usage monitoring (simulated)
     */
    startMemoryMonitor() {
        const updateMemory = () => {
            if (!this.memoryElement) return;

            // Simulate memory usage (in a real app, use performance.memory)
            const baseMemory = 42;
            const variation = Math.random() * 20;
            const memoryMB = Math.round(baseMemory + variation);

            this.memoryElement.textContent = `${memoryMB}MB`;
        };

        updateMemory();
        setInterval(updateMemory, 3000);
    }

    /**
     * Start FPS counter
     */
    startFPSCounter() {
        const updateFPS = () => {
            this.frames++;

            const now = performance.now();
            const deltaTime = now - this.lastFrameTime;

            if (deltaTime >= 1000) {
                this.fps = Math.round((this.frames * 1000) / deltaTime);
                this.frames = 0;
                this.lastFrameTime = now;

                if (this.fpsElement) {
                    this.fpsElement.textContent = `${this.fps}`;

                    // Color based on performance
                    if (this.fps >= 50) {
                        this.fpsElement.style.color = 'var(--accent-green)';
                    } else if (this.fps >= 30) {
                        this.fpsElement.style.color = 'var(--accent-yellow)';
                    } else {
                        this.fpsElement.style.color = 'var(--accent-red)';
                    }
                }
            }

            requestAnimationFrame(updateFPS);
        };

        requestAnimationFrame(updateFPS);
    }

    /**
     * Start ping simulation (latency indicator)
     */
    startPingSimulation() {
        const updatePing = () => {
            if (!this.pingElement) return;

            // Simulate network latency
            const basePing = 12;
            const variation = Math.random() * 30;
            const ping = Math.round(basePing + variation);

            this.pingElement.textContent = `${ping}ms`;

            // Color based on latency
            if (ping < 30) {
                this.pingElement.style.color = 'var(--accent-green)';
            } else if (ping < 60) {
                this.pingElement.style.color = 'var(--accent-yellow)';
            } else {
                this.pingElement.style.color = 'var(--accent-red)';
            }
        };

        updatePing();
        setInterval(updatePing, 2000);
    }

    /**
     * Start uptime counter
     */
    startUptimeCounter() {
        const updateUptime = () => {
            if (!this.uptimeElement) return;

            const elapsed = Date.now() - this.startTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);

            const timeString = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
            this.uptimeElement.textContent = timeString;
        };

        updateUptime();
        setInterval(updateUptime, 1000);
    }

    /**
     * Start activity indicator animation
     */
    startActivityIndicator() {
        if (!this.activityContainer) return;

        const blocks = this.activityContainer.querySelectorAll('.activity-block');
        if (blocks.length === 0) return;

        let activeIndex = 0;

        setInterval(() => {
            // Deactivate all
            blocks.forEach((block) => block.classList.remove('active'));

            // Activate random blocks to simulate activity
            const numActive = 1 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numActive; i++) {
                const randomIndex = Math.floor(Math.random() * blocks.length);
                const block = blocks[randomIndex];
                if (block instanceof HTMLElement) {
                    block.classList.add('active');
                    block.style.height = `${4 + Math.random() * 8}px`;
                }
            }
        }, 200);
    }

    /**
     * Observe network status changes
     */
    observeNetworkStatus() {
        if (!this.statusElement) return;

        const dot = this.statusElement.querySelector('.indicator-dot');
        if (!dot) return;

        const updateStatus = () => {
            if (navigator.onLine) {
                dot.classList.add('online');
                this.statusElement.title = 'Sistema online';
            } else {
                dot.classList.remove('online');
                this.statusElement.title = 'Sistema offline';
            }
        };

        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
    }

    /**
     * Set session information
     */
    setSessionInfo() {
        if (!this.sessionElement) return;

        this.sessionElement.textContent = this.sessionId;
    }

    /**
     * Generate a unique session ID
     * @returns {string}
     */
    generateSessionId() {
        const chars = '0123456789ABCDEF';
        let id = '';
        for (let i = 0; i < 8; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return id;
    }

    /**
     * Pad number with leading zero
     * @param {number} num
     * @returns {string}
     */
    pad(num) {
        return num.toString().padStart(2, '0');
    }

    /**
     * Clean up HUD resources
     */
    destroy() {
        // Clear all intervals
        // In a real implementation, store interval IDs
        console.log('[HUD] Destroyed');
    }
}
