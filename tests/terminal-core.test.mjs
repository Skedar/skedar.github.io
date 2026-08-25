import test from 'node:test';
import assert from 'node:assert/strict';
import {
    COMMAND_NAMES,
    listVirtualChildren,
    normalizeCommandName,
    normalizeVirtualPath,
    parseCommand,
    sanitizeNavigationUrl,
} from '../js/terminal-core.js';

test('normalizes help aliases with optional trailing period', () => {
    assert.equal(normalizeCommandName('/help.'), '/help');
    assert.equal(normalizeCommandName('/H.'), '/h');
});

test('parses a command and preserves its arguments safely', () => {
    assert.deepEqual(parseCommand('  run   ~/home/projects/cyberpunk-archive  '), {
        command: 'run',
        args: ['~/home/projects/cyberpunk-archive'],
        rawArgs: '~/home/projects/cyberpunk-archive',
    });
});

test('rejects oversized terminal input', () => {
    assert.throws(() => parseCommand(`search ${'x'.repeat(300)}`), /muito longo/i);
});

test('normalizes virtual project paths without traversal outside home', () => {
    assert.equal(normalizeVirtualPath('~/home', 'projects'), '~/home/projects/');
    assert.equal(normalizeVirtualPath('~/home', 'about'), '~/home/about/');
    assert.equal(normalizeVirtualPath('~/home', 'archive'), '~/home/archive/');
    assert.equal(normalizeVirtualPath('~/home/projects/', '..'), '~/home');
    assert.equal(normalizeVirtualPath('~/home/projects/', 'cyberpunk-archive'), '~/home/projects/cyberpunk-archive');
    assert.equal(normalizeVirtualPath('~/home', '../../../../etc'), null);
});

test('lists every navigable site section from home', () => {
    assert.deepEqual(listVirtualChildren('~/home'), ['about', 'archive', 'projects']);
});

test('allows only safe HTTP(S) and same-origin relative navigation URLs', () => {
    assert.equal(
        sanitizeNavigationUrl('projects/cyberpunk-archive/', 'https://skedar.github.io/'),
        'https://skedar.github.io/projects/cyberpunk-archive/',
    );
    assert.equal(
        sanitizeNavigationUrl('https://skedar.github.io/projects/cyberpunk-archive/', 'https://skedar.github.io/'),
        'https://skedar.github.io/projects/cyberpunk-archive/',
    );
    assert.equal(sanitizeNavigationUrl('javascript:alert(1)', 'https://skedar.github.io/'), null);
    assert.equal(sanitizeNavigationUrl('data:text/html,boom', 'https://skedar.github.io/'), null);
    assert.equal(sanitizeNavigationUrl('//evil.example/path', 'https://skedar.github.io/'), null);
    assert.equal(sanitizeNavigationUrl('https://user:pass@skedar.github.io/path', 'https://skedar.github.io/'), null);
});

test('exposes the complete terminal command surface', () => {
    for (const command of [
        '/help', '/h', 'pwd', 'ls', 'cd', 'clear', 'search', 'run', 'open',
        'status', 'about', 'projects', 'archive', 'home',
    ]) {
        assert.ok(COMMAND_NAMES.includes(command), `${command} should be registered`);
    }
});
