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
        /<span class="logo-bracket"[^>]*>\[<\/span><span class="logo-label glitch-label"[^>]*>Skedar<\/span><span class="logo-cursor"[^>]*>_<\/span><span class="logo-bracket"[^>]*>\]<\/span>/,
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
    assert.match(html, /id="terminal-path"[^>]*>shell@project:\/home\$<\/span>/);
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

test('keeps Portuguese menu labels without numeric prefixes', async () => {
    const html = await read('index.html');
    assert.match(html, /<html lang="pt-BR">/);
    assert.doesNotMatch(html, /class="nav-index"/);
    assert.match(html, /data-section="terminal"[\s\S]*>TERMINAL<\/span>/);
    assert.match(html, /data-section="projects"[\s\S]*>PROJETOS<\/span>/);
    assert.match(html, /data-section="about"[\s\S]*>SOBRE<\/span>/);
    assert.match(html, /data-section="archive"[\s\S]*>ARQUIVO<\/span>/);
    assert.match(html, /JAVASCRIPT DESATIVADO/);
});

test('adds App and Programa filters plus a real archived-project grid', async () => {
    const html = await read('index.html');
    assert.match(html, /<option value="app">APP<\/option>/);
    assert.match(html, /<option value="program">PROGRAMA<\/option>/);
    assert.match(html, /<option value="model-3d">MODELO 3D<\/option>/);
    assert.match(html, /<option value="design">DESIGN<\/option>/);
    assert.match(html, /id="archive-count"/);
    assert.match(html, /id="archive-grid"/);
    assert.match(html, /id="archive-empty-state"/);
});

test('reserves square project media in cards and the modal', async () => {
    const [html, projects, css] = await Promise.all([
        read('index.html'),
        read('js/projects.js'),
        read('css/main.css'),
    ]);
    assert.match(html, /id="modal-project-media"/);
    assert.match(html, /id="modal-project-image"/);
    assert.match(projects, /project-card-media/);
    assert.match(projects, /objectFit|project-media-image/);
    assert.match(css, /aspect-ratio:\s*1/);
    assert.match(css, /object-fit:\s*cover/);
    assert.match(css, /@keyframes\s+projectMediaBorder/);
    assert.match(css, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(css, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(css, /\.modal-project-media\s*\{[\s\S]*width:\s*min\(180px,\s*55vw\)/);
});

test('wires the terminal module and returns home commands to Terminal', async () => {
    const [main, terminal] = await Promise.all([read('js/main.js'), read('js/terminal.js')]);
    assert.match(main, /from ['"]\.\/terminal\.js['"]/);
    assert.match(terminal, /Type \/help\. or \/h\. for the command list/);
    assert.match(terminal, /shell@project:\/home\$ auth/);
    assert.match(terminal, /this\.navigate\(['"]terminal['"]\)/);
    assert.doesNotMatch(terminal, /location\.assign/);
});

test('extends glitch effects with character scrambling and reduced-motion coverage', async () => {
    const [glitch, main, projects, html] = await Promise.all([
        read('css/glitch.css'),
        read('js/main.js'),
        read('js/projects.js'),
        read('index.html'),
    ]);
    assert.match(glitch, /\.nav-link\.glitching/);
    assert.match(glitch, /\.logo-container\.glitching/);
    assert.match(glitch, /\.system-glyph/);
    assert.match(glitch, /@keyframes\s+systemFault/);
    assert.match(glitch, /@keyframes\s+errorPulse/);
    assert.match(glitch, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.system-glyph/);
    assert.match(main, /createGlitchFrame/);
    assert.match(main, /glitchTimers/);
    assert.match(main, /dataset\.glitchText/);
    assert.match(projects, /createGlitchFrame/);
    assert.equal((html.match(/class="nav-label glitch-label"/g) ?? []).length, 4);
    assert.match(
        html,
        /<span class="logo-bracket"[^>]*>\[<\/span><span class="logo-label glitch-label"[^>]*>Skedar<\/span><span class="logo-cursor"[^>]*>_<\/span><span class="logo-bracket"[^>]*>\]<\/span>/,
    );
});

test('keeps protected project routes out of the implementation diff surface', async () => {
    const projects = JSON.parse(await read('projects/projects.json'));
    const cyberpunkArchive = projects.projects.find((project) => project.title === 'Cyberpunk Archive');
    assert.ok(cyberpunkArchive);
    assert.equal(cyberpunkArchive.liveUrl, 'https://skedar.github.io/projects/cyberpunk-archive/');
    assert.equal(cyberpunkArchive.terminalFile, 'cyberpunk-archive.sh');
});
