/**
 * SKEDAR_ // PROJECT MANAGER
 * Carrega, filtra e apresenta o catálogo de projetos.
 */

export class ProjectManager {
    constructor() {
        this.grid = document.getElementById('projects-grid');
        this.loadingState = document.getElementById('loading-state');
        this.errorState = document.getElementById('error-state');
        this.emptyState = document.getElementById('empty-state');
        this.countElement = document.getElementById('project-count');
        this.filterSelect = document.getElementById('project-filter');
        this.searchInput = document.getElementById('project-search');
        this.modal = document.getElementById('project-modal');
        this.projects = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.previouslyFocusedElement = null;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadProjects();
    }

    setupEventListeners() {
        this.filterSelect?.addEventListener('change', (event) => {
            if (event.target instanceof HTMLSelectElement) {
                this.currentFilter = event.target.value;
                this.renderProjects();
            }
        });

        this.searchInput?.addEventListener('input', (event) => {
            if (event.target instanceof HTMLInputElement) {
                this.currentSearch = event.target.value.trim().toLocaleLowerCase('pt-BR');
                this.renderProjects();
            }
        });

        document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
        this.modal?.addEventListener('click', (event) => {
            if (event.target === this.modal) this.closeModal();
        });
        document.getElementById('btn-retry')?.addEventListener('click', () => this.loadProjects());
    }

    async loadProjects() {
        try {
            this.showLoading();
            const response = await fetch('projects/projects.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            if (!data || !Array.isArray(data.projects)) {
                throw new Error('Formato de catálogo inválido');
            }

            this.projects = data.projects.filter((project) => this.isValidProject(project));
            this.renderProjects();
            this.hideLoading();
        } catch (error) {
            console.error('[PROJECTS] Load error:', error);
            this.showError(error);
        }
    }

    isValidProject(project) {
        return Boolean(
            project
            && typeof project.id === 'string'
            && typeof project.title === 'string'
            && typeof project.description === 'string'
            && typeof project.fullDescription === 'string'
            && ['active', 'development', 'archived'].includes(project.status)
            && ['web', 'game', 'tool', 'experiment'].includes(project.category)
            && Array.isArray(project.technologies)
        );
    }

    renderProjects() {
        if (!this.grid) return;
        this.grid.querySelectorAll('.project-card').forEach((card) => card.remove());
        const filteredProjects = this.filterProjects(this.projects);

        if (this.countElement) this.countElement.textContent = filteredProjects.length.toString();
        if (filteredProjects.length === 0) {
            this.showEmpty();
            return;
        }

        this.hideEmpty();
        filteredProjects.forEach((project, index) => {
            this.grid.appendChild(this.createProjectCard(project, index));
        });
    }

    filterProjects(projects) {
        return projects.filter((project) => {
            if (this.currentFilter !== 'all' && project.category !== this.currentFilter) return false;
            if (!this.currentSearch) return true;

            const searchableText = [
                project.title,
                project.description,
                project.technologies.join(' '),
            ].join(' ').toLocaleLowerCase('pt-BR');

            return searchableText.includes(this.currentSearch);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver detalhes do projeto ${project.title}`);
        card.style.animationDelay = `${index * 50}ms`;

        const header = document.createElement('div');
        header.className = 'project-card-header';

        const projectId = document.createElement('span');
        projectId.className = 'project-id';
        projectId.textContent = project.id;

        const status = document.createElement('span');
        status.className = `project-status ${project.status}`;
        status.textContent = project.status.toUpperCase();
        header.append(projectId, status);

        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = project.title;

        const description = document.createElement('p');
        description.className = 'project-description';
        description.textContent = project.description;

        const tags = document.createElement('div');
        tags.className = 'project-tags';
        project.technologies.forEach((technology) => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = technology;
            tags.appendChild(tag);
        });

        const footer = document.createElement('div');
        footer.className = 'project-footer';

        const category = document.createElement('span');
        category.className = 'project-category';
        category.textContent = project.category;

        const openLabel = document.createElement('span');
        openLabel.className = 'project-link';
        openLabel.textContent = 'ABRIR ';
        const arrow = document.createElement('span');
        arrow.className = 'project-link-icon';
        arrow.textContent = '→';
        openLabel.appendChild(arrow);
        footer.append(category, openLabel);

        card.append(header, title, description, tags, footer);
        card.addEventListener('click', () => {
            this.openModal(project, card);
            this.triggerGlitchOnCard(card);
        });
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.openModal(project, card);
                this.triggerGlitchOnCard(card);
            }
        });
        card.addEventListener('mouseenter', () => this.triggerGlitchOnCard(card, true));

        return card;
    }

    openModal(project, sourceElement) {
        if (!this.modal) return;
        this.previouslyFocusedElement = sourceElement ?? document.activeElement;

        this.setText('modal-title', project.title);
        this.setText('modal-status', project.status.toUpperCase());
        this.setText('modal-category', project.category.toUpperCase());
        this.setText('modal-tech', project.technologies.join(', '));
        this.setText('modal-updated', this.formatDate(project.lastUpdated));
        this.setText('modal-description', project.fullDescription);
        this.configureModalLink('modal-link-live', project.liveUrl);
        this.configureModalLink('modal-link-repo', project.repoUrl);

        this.modal.hidden = false;
        this.modal.removeAttribute('inert');
        window.requestAnimationFrame(() => this.modal?.classList.add('active'));
        document.body.style.overflow = 'hidden';
        document.getElementById('modal-close')?.focus();
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        this.modal.hidden = true;
        this.modal.setAttribute('inert', '');
        document.body.style.overflow = '';
        if (this.previouslyFocusedElement instanceof HTMLElement) {
            this.previouslyFocusedElement.focus();
        }
    }

    isModalOpen() {
        return Boolean(this.modal && !this.modal.hidden);
    }

    setText(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value;
    }

    configureModalLink(elementId, url) {
        const link = document.getElementById(elementId);
        if (!(link instanceof HTMLAnchorElement)) return;
        const isAvailable = typeof url === 'string' && url.length > 0;
        link.hidden = !isAvailable;
        if (isAvailable) link.href = url;
        else link.removeAttribute('href');
    }

    triggerGlitchOnCard(card, isHover = false) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (isHover && Math.random() > 0.3) return;
        card.classList.add('glitching');
        window.setTimeout(() => card.classList.remove('glitching'), 300);
    }

    showLoading() {
        if (this.loadingState) this.loadingState.style.display = 'flex';
        if (this.errorState) {
            this.errorState.hidden = true;
            this.errorState.setAttribute('inert', '');
        }
        if (this.emptyState) this.emptyState.hidden = true;
    }

    hideLoading() {
        if (this.loadingState) this.loadingState.style.display = 'none';
    }

    showError(error) {
        this.hideLoading();
        if (!this.errorState) return;
        this.errorState.hidden = false;
        this.errorState.removeAttribute('inert');
        const errorMessage = this.errorState.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = `Erro: ${error instanceof Error ? error.message : 'desconhecido'}`;
        }
    }

    showEmpty() {
        if (this.emptyState) this.emptyState.hidden = false;
    }

    hideEmpty() {
        if (this.emptyState) this.emptyState.hidden = true;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
        });
    }
}
