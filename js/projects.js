/**
 * ===================================
 * SKEDAR_ // PROJECT MANAGER
 * Gerencia carregamento e exibição de projetos
 * ===================================
 */

export class ProjectManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.grid = document.getElementById('projects-grid');

        /** @type {HTMLElement | null} */
        this.loadingState = document.getElementById('loading-state');

        /** @type {HTMLElement | null} */
        this.errorState = document.getElementById('error-state');

        /** @type {HTMLElement | null} */
        this.emptyState = document.getElementById('empty-state');

        /** @type {HTMLElement | null} */
        this.countElement = document.getElementById('project-count');

        /** @type {HTMLSelectElement | null} */
        this.filterSelect = document.getElementById('project-filter');

        /** @type {HTMLInputElement | null} */
        this.searchInput = document.getElementById('project-search');

        /** @type {HTMLDivElement | null} */
        this.modal = document.getElementById('project-modal');

        /** @type {ProjectData[]} */
        this.projects = [];

        /** @type {string} */
        this.currentFilter = 'all';

        /** @type {string} */
        this.currentSearch = '';

        this.init();
    }

    /**
     * Initialize project manager
     */
    async init() {
        this.setupEventListeners();
        await this.loadProjects();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Filter change
        this.filterSelect?.addEventListener('change', (event) => {
            if (event.target instanceof HTMLSelectElement) {
                this.currentFilter = event.target.value;
                this.renderProjects();
            }
        });

        // Search input
        this.searchInput?.addEventListener('input', (event) => {
            if (event.target instanceof HTMLInputElement) {
                this.currentSearch = event.target.value.toLowerCase();
                this.renderProjects();
            }
        });

        // Modal close
        const modalClose = document.getElementById('modal-close');
        modalClose?.addEventListener('click', () => {
            this.closeModal();
        });

        // Modal overlay click to close
        this.modal?.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Retry button
        const retryButton = document.getElementById('btn-retry');
        retryButton?.addEventListener('click', () => {
            this.showLoading();
            this.loadProjects();
        });
    }

    /**
     * Load projects from local JSON or API
     */
    async loadProjects() {
        try {
            this.showLoading();

            // Try to load from local projects.json first
            const response = await fetch('projects/projects.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.projects = data.projects;

            // Simulate network delay for better UX
            await new Promise((resolve) => setTimeout(resolve, 500));

            this.renderProjects();
            this.hideLoading();
        } catch (error) {
            console.error('[PROJECTS] Load error:', error);
            this.showError(error);
        }
    }

    /**
     * Render projects to grid
     */
    renderProjects() {
        if (!this.grid) return;

        // Clear existing project cards (keep state elements)
        const existingCards = this.grid.querySelectorAll('.project-card');
        existingCards.forEach((card) => card.remove());

        // Filter projects
        const filtered = this.filterProjects(this.projects);

        // Update count
        if (this.countElement) {
            this.countElement.textContent = filtered.length.toString();
        }

        // Check if empty
        if (filtered.length === 0) {
            this.showEmpty();
            return;
        }

        this.hideEmpty();

        // Create project cards
        filtered.forEach((project, index) => {
            const card = this.createProjectCard(project, index);
            this.grid.appendChild(card);
        });
    }

    /**
     * Filter projects based on current filter and search
     * @param {ProjectData[]} projects
     * @returns {ProjectData[]}
     */
    filterProjects(projects) {
        return projects.filter((project) => {
            // Category filter
            if (this.currentFilter !== 'all' && project.category !== this.currentFilter) {
                return false;
            }

            // Search filter
            if (this.currentSearch) {
                const searchIn = [
                    project.title,
                    project.description,
                    project.technologies.join(' '),
                ]
                    .join(' ')
                    .toLowerCase();

                if (!searchIn.includes(this.currentSearch)) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Create a project card element
     * @param {ProjectData} project
     * @param {number} index
     * @returns {HTMLElement}
     */
    createProjectCard(project, index) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver detalhes do projeto ${project.title}`);

        // Add stagger animation
        card.style.animationDelay = `${index * 50}ms`;

        // Build card content
        const statusClass = project.status.toLowerCase().replace(/\s+/g, '-');
        const tagsHTML = project.technologies
            .map((tech) => `<span class="tag">${tech}</span>`)
            .join('');

        card.innerHTML = `
            <div class="project-card-header">
                <span class="project-id">${project.id}</span>
                <span class="project-status ${statusClass}">${project.status.toUpperCase()}</span>
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">${tagsHTML}</div>
            <div class="project-footer">
                <span class="project-category">${project.category}</span>
                <span class="project-link">
                    ABRIR <span class="project-link-icon">→</span>
                </span>
            </div>
        `;

        // Click handler
        card.addEventListener('click', () => {
            this.openModal(project);
            this.triggerGlitchOnCard(card);
        });

        // Keyboard handler
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.openModal(project);
                this.triggerGlitchOnCard(card);
            }
        });

        // Hover glitch effect
        card.addEventListener('mouseenter', () => {
            this.triggerGlitchOnCard(card, true);
        });

        return card;
    }

    /**
     * Open project detail modal
     * @param {ProjectData} project
     */
    openModal(project) {
        if (!this.modal) return;

        // Populate modal content
        const modalTitle = document.getElementById('modal-title');
        const modalStatus = document.getElementById('modal-status');
        const modalCategory = document.getElementById('modal-category');
        const modalTech = document.getElementById('modal-tech');
        const modalUpdated = document.getElementById('modal-updated');
        const modalDescription = document.getElementById('modal-description');
        const modalLinkLive = document.getElementById('modal-link-live');
        const modalLinkRepo = document.getElementById('modal-link-repo');

        if (modalTitle) modalTitle.textContent = project.title;
        if (modalStatus) modalStatus.textContent = project.status.toUpperCase();
        if (modalCategory) modalCategory.textContent = project.category.toUpperCase();
        if (modalTech) modalTech.textContent = project.technologies.join(', ');
        if (modalUpdated) modalUpdated.textContent = this.formatDate(project.lastUpdated);
        if (modalDescription) modalDescription.textContent = project.fullDescription;

        if (modalLinkLive) {
            modalLinkLive.href = project.liveUrl;
            modalLinkLive.style.display = project.liveUrl ? 'flex' : 'none';
        }

        if (modalLinkRepo) {
            modalLinkRepo.href = project.repoUrl;
            modalLinkRepo.style.display = project.repoUrl ? 'flex' : 'none';
        }

        // Show modal
        this.modal.classList.add('active');
        this.modal.removeAttribute('hidden');

        // Focus close button
        const closeButton = document.getElementById('modal-close');
        closeButton?.focus();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close project detail modal
     */
    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        this.modal.setAttribute('hidden', '');

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to grid
        this.grid?.focus();
    }

    /**
     * Trigger glitch effect on card
     * @param {HTMLElement} card
     * @param {boolean} isHover - Is this a hover trigger
     */
    triggerGlitchOnCard(card, isHover = false) {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        // Random glitch trigger
        if (isHover && Math.random() > 0.3) return;

        card.classList.add('glitching');

        setTimeout(() => {
            card.classList.remove('glitching');
        }, 300);
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingState) this.loadingState.style.display = 'flex';
        if (this.errorState) this.errorState.hidden = true;
        if (this.emptyState) this.emptyState.hidden = true;
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingState) this.loadingState.style.display = 'none';
    }

    /**
     * Show error state
     * @param {Error} error
     */
    showError(error) {
        this.hideLoading();
        if (this.errorState) {
            this.errorState.hidden = false;
            const errorMessage = this.errorState.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = `Erro: ${error.message}`;
            }
        }
    }

    /**
     * Show empty state
     */
    showEmpty() {
        if (this.emptyState) this.emptyState.hidden = false;
    }

    /**
     * Hide empty state
     */
    hideEmpty() {
        if (this.emptyState) this.emptyState.hidden = true;
    }

    /**
     * Format date for display
     * @param {string} dateString
     * @returns {string}
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    }
}
