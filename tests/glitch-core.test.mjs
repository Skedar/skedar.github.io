import test from 'node:test';
import assert from 'node:assert/strict';
import { createGlitchFrame } from '../js/glitch-core.js';

test('creates a same-length corrupted frame while preserving whitespace', () => {
    const source = 'SYSTEM ERROR';
    const frame = createGlitchFrame(source, 1, () => 0);
    assert.equal(frame.length, source.length);
    assert.equal(frame[6], ' ');
    assert.notEqual(frame, source);
});

test('returns the original text when corruption intensity is zero', () => {
    assert.equal(createGlitchFrame('PROJETOS', 0, () => 0), 'PROJETOS');
});

test('handles non-string and empty labels safely', () => {
    assert.equal(createGlitchFrame('', 1, () => 0), '');
    assert.equal(createGlitchFrame(null, 1, () => 0), '');
});
