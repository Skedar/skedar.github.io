import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.document = {
    baseURI: 'https://skedar.github.io/',
    activeElement: null,
    getElementById: () => null,
};
globalThis.window = {
    location: { href: 'https://skedar.github.io/' },
};

const { ProjectManager } = await import('../js/projects.js');
const validate = ProjectManager.prototype.isValidProject;

const validProject = {
    id: 'PRJ-001',
    title: 'Cyberpunk Archive',
    description: 'Arquivo cronológico.',
    fullDescription: 'Descrição completa do arquivo.',
    status: 'active',
    category: 'web',
    technologies: ['GitHub Pages'],
    terminalFile: 'cyberpunk-archive.sh',
    liveUrl: 'projects/cyberpunk-archive/',
    repoUrl: '',
    lastUpdated: '2026-08-24T00:00:00Z',
};

test('accepts a complete project with safe same-origin URLs', () => {
    assert.equal(validate.call({}, validProject), true);
});

test('rejects empty required fields and missing or invalid dates', () => {
    assert.equal(validate.call({}, { ...validProject, title: '' }), false);
    assert.equal(validate.call({}, { ...validProject, lastUpdated: undefined }), false);
    assert.equal(validate.call({}, { ...validProject, lastUpdated: 'not-a-date' }), false);
});

test('accepts safe external HTTPS projects and rejects unsafe URL schemes', () => {
    assert.equal(validate.call({}, { ...validProject, liveUrl: 'javascript:alert(1)' }), false);
    assert.equal(validate.call({}, { ...validProject, liveUrl: 'https://example.com/project' }), true);
    assert.equal(validate.call({}, { ...validProject, repoUrl: 'data:text/html,boom' }), false);
});

test('accepts App and Programa categories', () => {
    assert.equal(validate.call({}, { ...validProject, category: 'app' }), true);
    assert.equal(validate.call({}, { ...validProject, category: 'program' }), true);
    assert.equal(validate.call({}, { ...validProject, category: 'model-3d' }), true);
    assert.equal(validate.call({}, { ...validProject, category: 'design' }), true);
});

test('accepts an optional safe image and rejects unsafe image URLs', () => {
    assert.equal(validate.call({}, { ...validProject, imageUrl: '', imageAlt: '' }), true);
    assert.equal(validate.call({}, {
        ...validProject,
        imageUrl: 'https://images.example.com/logo.png',
        imageAlt: 'Logo do projeto',
    }), true);
    assert.equal(validate.call({}, { ...validProject, imageUrl: 'javascript:alert(1)' }), false);
});

test('splits active and archived projects deterministically', () => {
    const manager = Object.create(ProjectManager.prototype);
    manager.projects = [
        validProject,
        { ...validProject, id: 'PRJ-002', terminalFile: 'archived.sh', status: 'archived' },
        { ...validProject, id: 'PRJ-003', terminalFile: 'development.sh', status: 'development' },
    ];
    assert.deepEqual(manager.getActiveProjects().map((project) => project.id), ['PRJ-001', 'PRJ-003']);
    assert.deepEqual(manager.getArchivedProjects().map((project) => project.id), ['PRJ-002']);
});

test('rejects malformed technology entries', () => {
    assert.equal(validate.call({}, { ...validProject, technologies: [''] }), false);
    assert.equal(validate.call({}, { ...validProject, technologies: [{}] }), false);
    assert.equal(validate.call({}, { ...validProject, technologies: Array(20).fill('tag') }), false);
});

test('requires a safe editable shell filename for every project', () => {
    assert.equal(validate.call({}, { ...validProject, terminalFile: undefined }), false);
    assert.equal(validate.call({}, { ...validProject, terminalFile: '../escape.sh' }), false);
    assert.equal(validate.call({}, { ...validProject, terminalFile: 'project.txt' }), false);
    assert.equal(validate.call({}, { ...validProject, terminalFile: 'project-two.sh' }), true);
});

test('rejects duplicate IDs and fails the entire malformed collection', () => {
    const manager = Object.create(ProjectManager.prototype);
    assert.throws(
        () => manager.validateProjectCollection([validProject, { ...validProject }]),
        /duplicado/i,
    );
    assert.throws(
        () => manager.validateProjectCollection([validProject, { ...validProject, id: 'PRJ-002', title: '' }]),
        /inválido/i,
    );
    assert.throws(
        () => manager.validateProjectCollection([
            validProject,
            { ...validProject, id: 'PRJ-002', terminalFile: validProject.terminalFile },
        ]),
        /executável.*duplicado/i,
    );
});
