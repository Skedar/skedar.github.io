/**
 * SKEDAR_ // HUD MANAGER
 * Gerencia o HUD inferior e indicadores.
 */

export class HUD {
    constructor() {
        this.clockElement = document.getElementById('clock');
        this.memoryElement = document.getElementById('hud-memory');
        this.fpsElement = document.getElementById('hud-fps');
        this.pingElement = document.getElementById('hud-ping');
        this.uptimeElement = document.getElementById('hud-uptime');
        this.sessionElement = document.getElementById('hud-session');
        this.statusElement = document.getElementById('sys-status');
        this.activityContainer = document.getElementById('hud-activity');
        this.startTime = Date.now();
        this.sessionId = this.generateSessionId();
        this.frames = 0;
        this.lastFrameTime = performance.now();
        this.fps = 0;
        this.intervals = [];
        this.animationFrameId = 0;

        this.init();
    }

    init() {
        this.startClock();
        this.startMemoryMonitor();
        this.startFPSCounter();
        this.startPingSimulation();
        this.startUptimeCounter();
        this.startActivityIndicator();
        this.observeNetworkStatus();
        this.setSessionInfo();
    }

    registerInterval(callback, delay) {
        const intervalId = window.setInterval(callback, delay);
        this.intervals.push(intervalId);
    }

    startClock() {
        const updateClock = () => {
            if (!this.clockElement) return;
            this.clockElement.textContent = new Date().toLocaleTimeString('pt-BR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        };

        updateClock();
        this.registerInterval(updateClock, 1000);
    }

    startMemoryMonitor() {
        const updateMemory = () => {
            if (!this.memoryElement) return;
            const browserMemory = performance.memory?.usedJSHeapSize;
            this.memoryElement.textContent = browserMemory
                ? `${Math.round(browserMemory / 1048576)}MB`
                : 'N/D';
        };

        updateMemory();
        this.registerInterval(updateMemory, 3000);
    }

    startFPSCounter() {
        const updateFPS = () => {
            this.frames += 1;
            const now = performance.now();
            const deltaTime = now - this.lastFrameTime;

            if (deltaTime >= 1000) {
                this.fps = Math.round((this.frames * 1000) / deltaTime);
                this.frames = 0;
                this.lastFrameTime = now;

                if (this.fpsElement) {
                    this.fpsElement.textContent = `${this.fps}`;
                    this.fpsElement.style.color = this.fps >= 50
                        ? 'var(--accent-green)'
                        : this.fps >= 30
                            ? 'var(--accent-yellow)'
                            : 'var(--accent-red)';
                }
            }

            this.animationFrameId = requestAnimationFrame(updateFPS);
        };

        this.animationFrameId = requestAnimationFrame(updateFPS);
    }

    startPingSimulation() {
        if (this.pingElement) {
            this.pingElement.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
            this.pingElement.style.color = navigator.onLine
                ? 'var(--accent-green)'
                : 'var(--accent-red)';
        }
    }

    startUptimeCounter() {
        const updateUptime = () => {
            if (!this.uptimeElement) return;
            const elapsed = Date.now() - this.startTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.uptimeElement.textContent = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        };

        updateUptime();
        this.registerInterval(updateUptime, 1000);
    }

    startActivityIndicator() {
        if (!this.activityContainer) return;
        const blocks = this.activityContainer.querySelectorAll('.activity-block');
        if (blocks.length === 0) return;

        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            blocks.forEach((block, index) => {
                block.classList.toggle('active', index === 0);
                if (block instanceof HTMLElement) block.style.height = '4px';
            });
            return;
        }

        this.registerInterval(() => {
            blocks.forEach((block) => {
                block.classList.remove('active');
                if (block instanceof HTMLElement) block.style.height = '4px';
            });

            const numActive = 1 + Math.floor(Math.random() * 3);
            for (let index = 0; index < numActive; index += 1) {
                const block = blocks[Math.floor(Math.random() * blocks.length)];
                if (block instanceof HTMLElement) {
                    block.classList.add('active');
                    block.style.height = `${4 + Math.random() * 8}px`;
                }
            }
        }, 200);
    }

    observeNetworkStatus() {
        if (!this.statusElement) return;
        const dot = this.statusElement.querySelector('.indicator-dot');
        if (!dot) return;

        const updateStatus = () => {
            dot.classList.toggle('online', navigator.onLine);
            this.statusElement.title = navigator.onLine ? 'Sistema online' : 'Sistema offline';
            if (this.pingElement) {
                this.pingElement.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
                this.pingElement.style.color = navigator.onLine
                    ? 'var(--accent-green)'
                    : 'var(--accent-red)';
            }
        };

        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
    }

    setSessionInfo() {
        if (this.sessionElement) this.sessionElement.textContent = this.sessionId;
    }

    getStatus() {
        const elapsed = Date.now() - this.startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        return {
            session: this.sessionId,
            uptime: `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`,
            fps: this.fps,
            online: navigator.onLine,
        };
    }

    generateSessionId() {
        const chars = '0123456789ABCDEF';
        let id = '';
        for (let index = 0; index < 8; index += 1) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return id;
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }

    destroy() {
        this.intervals.forEach((intervalId) => clearInterval(intervalId));
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
}
