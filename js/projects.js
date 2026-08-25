/**
 * SKEDAR_ // PROJECT MANAGER
 * Carrega, filtra e apresenta o catálogo de projetos.
 */

import { createGlitchFrame } from './glitch-core.js';

const cardGlitchTimers = new WeakMap();

/**
 * Sanitiza URLs usadas especificamente pelos projetos.
 * Aceita URLs internas e externas, desde que sejam HTTP ou HTTPS.
 */
function sanitizeProjectUrl(value, base = window.location.href) {
    if (typeof value !== 'string') return null;

    const trimmed = value.trim();

    if (!trimmed || trimmed.startsWith('//')) {
        return null;
    }

    try {
        const resolved = new URL(trimmed, base);

        if (
            resolved.protocol !== 'http:'
            && resolved.protocol !== 'https:'
        ) {
            return null;
        }

        if (resolved.username || resolved.password) {
            return null;
        }

        return resolved.href;
    } catch {
        return null;
    }
}

export class ProjectManager {
    constructor() {
        this.grid = document.getElementById('projects-grid');
        this.loadingState = document.getElementById('loading-state');
        this.errorState = document.getElementById('error-state');
        this.emptyState = document.getElementById('empty-state');
        this.countElement = document.getElementById('project-count');
        this.filterSelect = document.getElementById('project-filter');
        this.mainInterface = document.getElementById('main-interface');
        this.modal = document.getElementById('project-modal');

        this.projects = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.previouslyFocusedElement = null;
        this.modalFrameId = null;
        this.modalFocusTimer = null;

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

        document
            .getElementById('modal-close')
            ?.addEventListener('click', () => this.closeModal());

        this.modal?.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        this.modal?.addEventListener(
            'keydown',
            (event) => this.handleModalKeydown(event)
        );

        document
            .getElementById('btn-retry')
            ?.addEventListener('click', () => this.loadProjects());
    }

    async loadProjects() {
        try {
            this.showLoading();

            const response = await fetch(
                'projects/projects.json',
                { cache: 'no-cache' }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data || !Array.isArray(data.projects)) {
                throw new Error('Formato de catálogo inválido');
            }

            this.projects = this.validateProjectCollection(data.projects);

            this.renderProjects();
            this.hideLoading();
        } catch (error) {
            console.error('[PROJECTS] Load error:', error);
            this.showError(error);
        }
    }

    isValidProject(project) {
        const isNonEmptyString = (
            value,
            maxLength = 2000
        ) =>
            typeof value === 'string'
            && value.trim().length > 0
            && value.length <= maxLength;

        const base = document.baseURI || window.location.href;

        const isSafeProjectUrl = (value) =>
            sanitizeProjectUrl(value, base) !== null;

        const hasSafeLiveUrl =
            isNonEmptyString(project?.liveUrl)
            && isSafeProjectUrl(project.liveUrl);

        const hasSafeRepoUrl =
            project?.repoUrl === ''
            || (
                isNonEmptyString(project?.repoUrl)
                && isSafeProjectUrl(project.repoUrl)
            );

        const isValidTerminalFile = (value) =>
            typeof value === 'string'
            && /^[a-z0-9][a-z0-9._-]*\.sh$/.test(value);

        return Boolean(
            project
            && isNonEmptyString(project.id, 64)
            && isNonEmptyString(project.title, 160)
            && isNonEmptyString(project.description, 500)
            && isNonEmptyString(project.fullDescription, 4000)

            && ['active', 'development', 'archived']
                .includes(project.status)

            && ['web', 'game', 'tool', 'experiment']
                .includes(project.category)

            && Array.isArray(project.technologies)
            && project.technologies.length > 0
            && project.technologies.length <= 12

            && project.technologies.every(
                (technology) =>
                    isNonEmptyString(technology, 64)
            )

            && isNonEmptyString(project.lastUpdated)
            && !Number.isNaN(
                Date.parse(project.lastUpdated)
            )

            && hasSafeLiveUrl
            && hasSafeRepoUrl

            && isValidTerminalFile(
                project.terminalFile
            )
        );
    }

    validateProjectCollection(projects) {
        if (!Array.isArray(projects)) {
            throw new Error(
                'Catálogo de projetos inválido'
            );
        }

        const seenIds = new Set();
        const seenTerminalFiles = new Set();

        return projects.map((project, index) => {
            if (!this.isValidProject(project)) {
                throw new Error(
                    `Projeto inválido no índice ${index}`
                );
            }

            if (seenIds.has(project.id)) {
                throw new Error(
                    `ID de projeto duplicado: ${project.id}`
                );
            }

            seenIds.add(project.id);

            if (
                seenTerminalFiles.has(
                    project.terminalFile
                )
            ) {
                throw new Error(
                    `Executável duplicado: ${project.terminalFile}`
                );
            }

            seenTerminalFiles.add(
                project.terminalFile
            );

            return project;
        });
    }

    renderProjects() {
        if (!this.grid) return;

        this.grid
            .querySelectorAll('.project-card')
            .forEach((card) => card.remove());

        const filteredProjects =
            this.filterProjects(this.projects);

        if (this.countElement) {
            this.countElement.textContent =
                filteredProjects.length.toString();
        }

        if (filteredProjects.length === 0) {
            this.showEmpty();
            return;
        }

        this.hideEmpty();

        filteredProjects.forEach(
            (project, index) => {
                this.grid.appendChild(
                    this.createProjectCard(
                        project,
                        index
                    )
                );
            }
        );
    }

    filterProjects(projects) {
        return projects.filter((project) => {
            if (
                this.currentFilter !== 'all'
                && project.category
                    !== this.currentFilter
            ) {
                return false;
            }

            if (!this.currentSearch) {
                return true;
            }

            const searchableText = [
                project.title,
                project.description,
                project.technologies.join(' ')
            ]
                .join(' ')
                .toLocaleLowerCase('pt-BR');

            return searchableText.includes(
                this.currentSearch
            );
        });
    }

    /* ---- API pública (usada pelo terminal) ---- */

    setSearch(term) {
        this.currentSearch =
            typeof term === 'string'
                ? term
                    .trim()
                    .toLocaleLowerCase('pt-BR')
                : '';

        this.renderProjects();

        return this.filterProjects(
            this.projects
        ).length;
    }

    setFilter(category) {
        const allowed = [
            'all',
            'web',
            'game',
            'tool',
            'experiment'
        ];

        this.currentFilter =
            allowed.includes(category)
                ? category
                : 'all';

        if (
            this.filterSelect
            instanceof HTMLSelectElement
        ) {
            this.filterSelect.value =
                this.currentFilter;
        }

        this.renderProjects();

        return this.filterProjects(
            this.projects
        ).length;
    }

    getProjects() {
        return this.projects.slice();
    }

    openProjectById(
        id,
        sourceElement = document.activeElement
    ) {
        const project = this.projects.find(
            (item) => item.id === id
        );

        if (!project) {
            return false;
        }

        this.openModal(
            project,
            sourceElement
        );

        return true;
    }

    createProjectCard(project, index) {
        const card =
            document.createElement('article');

        card.className = 'project-card';
        card.tabIndex = 0;

        card.setAttribute(
            'role',
            'button'
        );

        card.setAttribute(
            'aria-label',
            `Ver detalhes do projeto ${project.title}`
        );

        card.style.animationDelay =
            `${index * 50}ms`;

        const header =
            document.createElement('div');

        header.className =
            'project-card-header';

        const projectId =
            document.createElement('span');

        projectId.className =
            'project-id';

        projectId.textContent =
            project.id;

        const status =
            document.createElement('span');

        status.className =
            `project-status ${project.status}`;

        status.textContent =
            project.status.toUpperCase();

        header.append(
            projectId,
            status
        );

        const title =
            document.createElement('h3');

        title.className =
            'project-title';

        title.textContent =
            project.title;

        title.dataset.glitchText =
            project.title;

        const description =
            document.createElement('p');

        description.className =
            'project-description';

        description.textContent =
            project.description;

        const tags =
            document.createElement('div');

        tags.className =
            'project-tags';

        project.technologies.forEach(
            (technology) => {
                const tag =
                    document.createElement(
                        'span'
                    );

                tag.className = 'tag';
                tag.textContent = technology;

                tags.appendChild(tag);
            }
        );

        const footer =
            document.createElement('div');

        footer.className =
            'project-footer';

        const category =
            document.createElement('span');

        category.className =
            'project-category';

        category.textContent =
            project.category;

        const openLabel =
            document.createElement('span');

        openLabel.className =
            'project-link';

        openLabel.textContent =
            'ABRIR ';

        const arrow =
            document.createElement('span');

        arrow.className =
            'project-link-icon';

        arrow.textContent = '→';

        openLabel.appendChild(arrow);

        footer.append(
            category,
            openLabel
        );

        card.append(
            header,
            title,
            description,
            tags,
            footer
        );

        card.addEventListener(
            'click',
            () => {
                this.openModal(
                    project,
                    card
                );

                this.triggerGlitchOnCard(
                    card
                );
            }
        );

        card.addEventListener(
            'keydown',
            (event) => {
                if (
                    event.key === 'Enter'
                    || event.key === ' '
                ) {
                    event.preventDefault();

                    this.openModal(
                        project,
                        card
                    );

                    this.triggerGlitchOnCard(
                        card
                    );
                }
            }
        );

        card.addEventListener(
            'mouseenter',
            () =>
                this.triggerGlitchOnCard(
                    card,
                    true
                )
        );

        return card;
    }

    openModal(
        project,
        sourceElement
    ) {
        if (!this.modal) return;

        this.previouslyFocusedElement =
            sourceElement
            ?? document.activeElement;

        this.setText(
            'modal-title',
            project.title
        );

        this.setText(
            'modal-status',
            project.status.toUpperCase()
        );

        this.setText(
            'modal-category',
            project.category.toUpperCase()
        );

        this.setText(
            'modal-tech',
            project.technologies.join(', ')
        );

        this.setText(
            'modal-updated',
            this.formatDate(
                project.lastUpdated
            )
        );

        this.setText(
            'modal-description',
            project.fullDescription
        );

        this.configureModalLink(
            'modal-link-live',
            project.liveUrl
        );

        this.configureModalLink(
            'modal-link-repo',
            project.repoUrl
        );

        this.modal.hidden = false;
        this.modal.removeAttribute('inert');

        this.setBackgroundInert(true);

        document.body.style.overflow =
            'hidden';

        if (
            this.modalFrameId !== null
        ) {
            window.cancelAnimationFrame(
                this.modalFrameId
            );
        }

        if (
            this.modalFocusTimer !== null
        ) {
            window.clearTimeout(
                this.modalFocusTimer
            );
        }

        this.modalFrameId =
            window.requestAnimationFrame(
                () => {
                    this.modalFrameId =
                        null;

                    if (
                        !this.isModalOpen()
                    ) {
                        return;
                    }

                    this.modal?.classList.add(
                        'active'
                    );

                    this.modalFocusTimer =
                        window.setTimeout(
                            () => {
                                this.modalFocusTimer =
                                    null;

                                if (
                                    this.isModalOpen()
                                ) {
                                    document
                                        .getElementById(
                                            'modal-close'
                                        )
                                        ?.focus({
                                            preventScroll:
                                                true
                                        });
                                }
                            },
                            50
                        );
                }
            );
    }

    closeModal() {
        if (!this.modal) return;

        if (
            this.modalFrameId !== null
        ) {
            window.cancelAnimationFrame(
                this.modalFrameId
            );

            this.modalFrameId = null;
        }

        if (
            this.modalFocusTimer !== null
        ) {
            window.clearTimeout(
                this.modalFocusTimer
            );

            this.modalFocusTimer = null;
        }

        this.modal.classList.remove(
            'active'
        );

        this.modal.hidden = true;

        this.modal.setAttribute(
            'inert',
            ''
        );

        this.setBackgroundInert(false);

        document.body.style.overflow =
            '';

        if (
            this.previouslyFocusedElement
            instanceof HTMLElement
        ) {
            this.previouslyFocusedElement
                .focus();
        }
    }

    handleModalKeydown(event) {
        if (
            event.key !== 'Tab'
            || !this.isModalOpen()
            || !this.modal
        ) {
            return;
        }

        const focusable = Array.from(
            this.modal.querySelectorAll(
                'a[href], button, input, select, textarea'
            )
        ).filter(
            (element) =>
                element instanceof HTMLElement
                && !element.hasAttribute(
                    'hidden'
                )
                && !element.closest(
                    '[hidden]'
                )
                && !element.closest(
                    '[inert]'
                )
                && !element.hasAttribute(
                    'disabled'
                )
        );

        if (focusable.length === 0) {
            return;
        }

        const first =
            focusable[0];

        const last =
            focusable[
                focusable.length - 1
            ];

        if (
            event.shiftKey
            && document.activeElement
                === first
        ) {
            event.preventDefault();
            last.focus();
        } else if (
            !event.shiftKey
            && document.activeElement
                === last
        ) {
            event.preventDefault();
            first.focus();
        }
    }

    setBackgroundInert(isInert) {
        if (!this.mainInterface) return;

        Array.from(
            this.mainInterface.children
        ).forEach((child) => {
            if (child === this.modal) {
                return;
            }

            if (isInert) {
                child.setAttribute(
                    'inert',
                    ''
                );
            } else {
                child.removeAttribute(
                    'inert'
                );
            }
        });
    }

    isModalOpen() {
        return Boolean(
            this.modal
            && !this.modal.hidden
        );
    }

    setText(elementId, value) {
        const element =
            document.getElementById(
                elementId
            );

        if (element) {
            element.textContent = value;
        }
    }

    configureModalLink(
        elementId,
        url
    ) {
        const link =
            document.getElementById(
                elementId
            );

        if (
            !(link instanceof
                HTMLAnchorElement)
        ) {
            return;
        }

        const base =
            document.baseURI
            || window.location.href;

        const safeUrl =
            typeof url === 'string'
            && url.length > 0
                ? sanitizeProjectUrl(
                    url,
                    base
                )
                : null;

        link.hidden = !safeUrl;

        if (safeUrl) {
            link.href = safeUrl;
            link.target = '_blank';
            link.rel =
                'noopener noreferrer';
        } else {
            link.removeAttribute(
                'href'
            );

            link.removeAttribute(
                'target'
            );

            link.removeAttribute(
                'rel'
            );
        }
    }

    triggerGlitchOnCard(
        card,
        isHover = false
    ) {
        if (
            window
                .matchMedia(
                    '(prefers-reduced-motion: reduce)'
                )
                .matches
        ) {
            return;
        }

        if (
            isHover
            && Math.random() > 0.3
        ) {
            return;
        }

        card.classList.add(
            'glitching'
        );

        window.setTimeout(
            () =>
                card.classList.remove(
                    'glitching'
                ),
            300
        );

        const title =
            card.querySelector(
                '.project-title'
            );

        if (
            title instanceof HTMLElement
        ) {
            this.scrambleCardTitle(
                title
            );
        }
    }

    scrambleCardTitle(title) {
        const existing =
            cardGlitchTimers.get(
                title
            );

        if (existing) {
            window.clearTimeout(
                existing.timerId
            );

            title.textContent =
                existing.original;
        }

        const original =
            title.dataset.glitchText
            || title.textContent;

        if (!original) return;

        title.dataset.glitchText =
            original;

        let frame = 0;

        const state = {
            timerId: null,
            original
        };

        cardGlitchTimers.set(
            title,
            state
        );

        const step = () => {
            if (
                window
                    .matchMedia(
                        '(prefers-reduced-motion: reduce)'
                    )
                    .matches
                || frame >= 4
            ) {
                title.textContent =
                    original;

                cardGlitchTimers.delete(
                    title
                );

                return;
            }

            title.textContent =
                createGlitchFrame(
                    original,
                    (4 - frame) / 4,
                    Math.random
                );

            frame += 1;

            state.timerId =
                window.setTimeout(
                    step,
                    50
                );
        };

        step();
    }

    showLoading() {
        if (this.loadingState) {
            this.loadingState.style.display =
                'flex';
        }

        if (this.errorState) {
            this.errorState.hidden =
                true;

            this.errorState.setAttribute(
                'inert',
                ''
            );
        }

        if (this.emptyState) {
            this.emptyState.hidden =
                true;
        }
    }

    hideLoading() {
        if (this.loadingState) {
            this.loadingState.style.display =
                'none';
        }
    }

    showError(error) {
        this.hideLoading();

        if (!this.errorState) {
            return;
        }

        this.errorState.hidden =
            false;

        this.errorState.removeAttribute(
            'inert'
        );

        const errorMessage =
            this.errorState.querySelector(
                '.error-message'
            );

        if (errorMessage) {
            errorMessage.textContent =
                `Erro: ${
                    error instanceof Error
                        ? error.message
                        : 'desconhecido'
                }`;
        }
    }

    showEmpty() {
        if (this.emptyState) {
            this.emptyState.hidden =
                false;
        }
    }

    hideEmpty() {
        if (this.emptyState) {
            this.emptyState.hidden =
                true;
        }
    }

    formatDate(dateString) {
        const date =
            new Date(dateString);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return dateString;
        }

        return date.toLocaleDateString(
            'pt-BR',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC'
            }
        );
    }
}
