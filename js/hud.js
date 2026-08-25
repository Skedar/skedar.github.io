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
        this.netElement = document.getElementById('hud-net');
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
        this.startPingMeasurement();
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
            if (browserMemory) {
                this.memoryElement.textContent = `${Math.round(browserMemory / 1048576)}MB`;
            } else {
                // Fallback estável quando a API de heap não está disponível.
                const cores = navigator.hardwareConcurrency ?? 4;
                const estimatedHeap = Math.min(96, Math.max(32, cores * 8));
                this.memoryElement.textContent = `${estimatedHeap}MB`;
            }
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

    /**
     * Measures round-trip latency with a HEAD request and updates hud-ping
     * with a numeric millisecond value. Falls back to a stable estimate.
     */
    startPingMeasurement() {
        const measurePing = () => {
            if (!this.pingElement) return;
            if (!navigator.onLine) {
                this.pingElement.textContent = '---ms';
                return;
            }
            const start = performance.now();
            fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
                .then(() => {
                    const ms = Math.round(performance.now() - start);
                    if (this.pingElement) this.pingElement.textContent = `${ms}ms`;
                })
                .catch(() => {
                    const connectionRtt = Number(navigator.connection?.rtt);
                    const fallbackMs = Number.isFinite(connectionRtt) && connectionRtt > 0
                        ? Math.round(connectionRtt)
                        : 24;
                    if (this.pingElement) this.pingElement.textContent = `${fallbackMs}ms`;
                });
        };

        measurePing();
        this.registerInterval(measurePing, 15000);
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
        const updateNetStatus = () => {
            const online = navigator.onLine;

            if (this.statusElement) {
                const dot = this.statusElement.querySelector('.indicator-dot');
                if (dot) dot.classList.toggle('online', online);
                this.statusElement.title = online ? 'Sistema online' : 'Sistema offline';
            }

            if (this.netElement) {
                this.netElement.textContent = online ? 'ONLINE' : 'OFFLINE';
                this.netElement.style.color = online
                    ? 'var(--accent-green)'
                    : 'var(--accent-red)';
            }

            if (!online && this.pingElement) {
                this.pingElement.textContent = '---ms';
            }
        };

        updateNetStatus();
        window.addEventListener('online', updateNetStatus);
        window.addEventListener('offline', updateNetStatus);
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
