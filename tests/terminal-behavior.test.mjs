import test from 'node:test';
import assert from 'node:assert/strict';
import { HOME_PATH, PROJECTS_PATH } from '../js/terminal-core.js';
import { Terminal } from '../js/terminal.js';

function createTerminal(overrides = {}) {
    const output = [];
    const terminal = Object.assign(Object.create(Terminal.prototype), {
        cwd: HOME_PATH,
        input: { value: '', focus() {} },
        navigateCalls: [],
        projectManager: null,
        updatePrompt() {},
        print(text) { output.push(text); },
        printMuted(text) { output.push(text); },
        printError(text) { output.push(`ERROR:${text}`); },
        navigate(section) { this.navigateCalls.push(section); },
    }, overrides);
    return { terminal, output };
}

test('cd changes only the virtual shell directory and never changes site tabs', () => {
    const { terminal } = createTerminal();
    terminal.runCd(['/home/projects']);
    assert.equal(terminal.cwd, PROJECTS_PATH);
    assert.deepEqual(terminal.navigateCalls, []);

    terminal.runCd(['..']);
    assert.equal(terminal.cwd, HOME_PATH);
    assert.deepEqual(terminal.navigateCalls, []);
});

test('the standalone .. command returns to the parent directory', () => {
    const { terminal } = createTerminal({ cwd: PROJECTS_PATH });
    terminal.commands = terminal.buildCommandTable();
    terminal.commands['..']();
    assert.equal(terminal.cwd, HOME_PATH);
});

test('ls in projects exposes editable project entries as fictitious shell files', () => {
    const { terminal, output } = createTerminal({
        projectManager: {
            getProjects: () => [
                { id: 'PRJ-001', terminalFile: 'cyberpunk-archive.sh' },
                { id: 'PRJ-002', terminalFile: 'project-two.sh' },
            ],
        },
    });
    terminal.runLs(['/home/projects']);
    assert.deepEqual(output, ['cyberpunk-archive.sh  project-two.sh']);
});

test('run resolves a project shell file and opens its existing project modal', () => {
    const opened = [];
    const { terminal, output } = createTerminal({
        projectManager: {
            getProjects: () => [
                { id: 'PRJ-001', terminalFile: 'cyberpunk-archive.sh' },
            ],
            openProjectById: (id, source) => {
                opened.push({ id, source });
                return true;
            },
        },
    });

    terminal.runRun(['projects/cyberpunk-archive.sh']);

    assert.equal(opened.length, 1);
    assert.equal(opened[0].id, 'PRJ-001');
    assert.equal(opened[0].source, terminal.input);
    assert.match(output[0], /cyberpunk-archive\.sh/);
    assert.deepEqual(terminal.navigateCalls, []);
});

test('run rejects traversal and unknown fictitious executables', () => {
    const { terminal, output } = createTerminal({
        projectManager: { getProjects: () => [] },
    });
    terminal.runRun(['../../etc/evil.sh']);
    terminal.runRun(['projects/missing.sh']);
    assert.equal(output.filter((line) => line.startsWith('ERROR:')).length, 2);
});
