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
});
