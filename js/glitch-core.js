/**
 * SKEDAR_ // GLITCH CORE
 * Gerador puro de frames corrompidos para animação de glitch.
 * Sem dependências de DOM; usável em Node e no navegador.
 */

const GLITCH_CHARS = '!@#$%^&*<>[]{}|~`\\?/';

/**
 * Gera um frame de texto corrompido com comprimento idêntico ao original.
 * Espaços em branco são sempre preservados.
 *
 * @param {string} source - Texto original.
 * @param {number} intensity - Probabilidade de corrupção por caractere (0..1).
 * @param {() => number} randomFn - Fonte de aleatoriedade (Math.random ou stub).
 * @returns {string}
 */
export function createGlitchFrame(source, intensity = 0.65, randomFn = Math.random) {
    if (typeof source !== 'string' || source.length === 0) return '';
    if (intensity <= 0) return source;

    let result = '';
    for (let i = 0; i < source.length; i++) {
        const ch = source[i];
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            result += ch;
        } else if (randomFn() < intensity) {
            result += GLITCH_CHARS[Math.floor(randomFn() * GLITCH_CHARS.length)] ?? ch;
        } else {
            result += ch;
        }
    }
    return result;
}
