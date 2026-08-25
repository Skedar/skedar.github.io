import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('removes the visual project search field and adds the interactive terminal', async () => {
    const html = await read('index.html');
    assert.doesNotMatch(html, /id="project-search"/);
    assert.match(html, /id="boot-confirm-input"/);
    assert.match(html, /id="terminal-output"/);
    assert.match(html, /id="terminal-input"/);
});

test('wires the terminal module and exact immersive help hint', async () => {
    const [main, terminal] = await Promise.all([
        read('js/main.js'),
        read('js/terminal.js'),
    ]);
    assert.match(main, /from ['"]\.\/terminal\.js['"]/);
    assert.match(terminal, /Type \/help\. or \/h\. for the command list/);
    assert.doesNotMatch(terminal, /location\.assign/);
});

test('preserves the original supplied glitch stylesheet byte-for-byte', async () => {
    const glitch = await read('css/glitch.css');
    const digest = createHash('sha256').update(glitch).digest('hex');
    assert.equal(digest, '7bc4e756d9ccbbea8aefe47fd945e82fd80f888afb7e219fbf5078f6d062b05f');
});

test('keeps protected project routes out of the implementation diff surface', async () => {
    const projects = JSON.parse(await read('projects/projects.json'));
    assert.equal(projects.projects.length, 1);
    assert.equal(projects.projects[0].title, 'Cyberpunk Archive');
    assert.equal(projects.projects[0].liveUrl, 'https://skedar.github.io/projects/cyberpunk-archive/');
});
