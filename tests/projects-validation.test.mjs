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

test('rejects unsafe, external, and malformed project URLs', () => {
    assert.equal(validate.call({}, { ...validProject, liveUrl: 'javascript:alert(1)' }), false);
    assert.equal(validate.call({}, { ...validProject, liveUrl: 'https://evil.example/project' }), false);
    assert.equal(validate.call({}, { ...validProject, repoUrl: 'data:text/html,boom' }), false);
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
