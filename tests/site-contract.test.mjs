import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('uses the requested document title and clickable Skedar brand', async () => {
    const html = await read('index.html');
    assert.match(html, /<title>\[Skedar\/\/Projects\]<\/title>/);
    assert.match(html, /id="site-logo"/);
    assert.match(
        html,
        /<span class="logo-bracket"[^>]*>\[<\/span>Skedar<span class="logo-cursor"[^>]*>_<\/span><span class="logo-bracket"[^>]*>\]<\/span>/,
    );
});

test('makes Terminal the default home section and keeps the console inside it', async () => {
    const html = await read('index.html');
    assert.match(html, /data-section="terminal"[^>]*aria-current="page"/);
    assert.match(
        html,
        /<section id="section-terminal"[^>]*class="section terminal-home active"[\s\S]*\.\.Close the World, TxEn Eht NepO\.\.[\s\S]*<section class="terminal" id="terminal"/,
    );
    assert.equal((html.match(/id="terminal"/g) ?? []).length, 1);
});

test('exposes MEM, FPS, PING, and NET as separate footer indicators', async () => {
    const html = await read('index.html');
    assert.match(html, /MEM:<\/span><span class="hud-value" id="hud-memory">/);
    assert.match(html, /FPS:<\/span><span class="hud-value" id="hud-fps">/);
    assert.match(html, /PING:<\/span><span class="hud-value" id="hud-ping">/);
    assert.match(html, /NET:<\/span><span class="hud-value" id="hud-net">/);
});

test('wires logo replay, ambient glitches, and the autonomous ASCII system glyph', async () => {
    const [html, main] = await Promise.all([read('index.html'), read('js/main.js')]);
    assert.match(html, /id="system-glyph" class="system-glyph"/);
    assert.match(html, /class="system-glyph-lines"/);
    assert.match(main, /replayMaterialization/);
    assert.match(main, /setupAmbientGlitches/);
    assert.match(main, /site-logo/);
    assert.match(main, /addEventListener\(['"]mouseenter['"]/);
    assert.match(main, /prefersReducedMotion/);
});

test('preserves the established Portuguese interface outside requested exact labels', async () => {
    const html = await read('index.html');
    assert.match(html, /<html lang="pt-BR">/);
    assert.match(html, /<span class="nav-index">02<\/span> PROJETOS/);
    assert.match(html, /<span class="nav-index">03<\/span> SOBRE/);
    assert.match(html, /<span class="nav-index">04<\/span> ARQUIVO/);
    assert.match(html, /JAVASCRIPT DESATIVADO/);
});

test('wires the terminal module and returns home commands to Terminal', async () => {
    const [main, terminal] = await Promise.all([read('js/main.js'), read('js/terminal.js')]);
    assert.match(main, /from ['"]\.\/terminal\.js['"]/);
    assert.match(terminal, /Type \/help\. or \/h\. for the command list/);
    assert.match(terminal, /this\.navigate\(['"]terminal['"]\)/);
    assert.doesNotMatch(terminal, /location\.assign/);
});

test('extends glitch effects for navigation, brand, and 3D glyph with reduced-motion coverage', async () => {
    const glitch = await read('css/glitch.css');
    assert.match(glitch, /\.nav-link\.glitching/);
    assert.match(glitch, /\.logo-container\.glitching/);
    assert.match(glitch, /\.system-glyph/);
    assert.match(glitch, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.system-glyph/);
});

test('keeps protected project routes out of the implementation diff surface', async () => {
    const projects = JSON.parse(await read('projects/projects.json'));
    assert.equal(projects.projects.length, 1);
    assert.equal(projects.projects[0].title, 'Cyberpunk Archive');
    assert.equal(projects.projects[0].liveUrl, 'https://skedar.github.io/projects/cyberpunk-archive/');
});
