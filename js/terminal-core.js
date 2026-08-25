/**
 * SKEDAR_ // TERMINAL CORE
 * Lógica pura do terminal, sem dependências de DOM.
 * Reutilizável em Node (testes) e no navegador.
 */

/** Comprimento máximo aceito para uma linha de comando. */
export const MAX_INPUT_LENGTH = 256;

/** Nomes de comando reconhecidos pelo terminal. */
export const COMMAND_NAMES = Object.freeze([
    '/help',
    '/h',
    'pwd',
    'ls',
    'cd',
    'clear',
    'search',
    'run',
    'open',
    'status',
    'about',
    'projects',
    'archive',
    'home',
]);

/**
 * Árvore de arquivos virtual confinada em ~/home.
 * Cada nó guarda seu caminho canônico exato (com ou sem barra final).
 */
const VFS_NODES = {
    home: { name: 'home', path: '~/home', parent: null, children: ['about', 'archive', 'projects'] },
    about: {
        name: 'about',
        path: '~/home/about/',
        parent: 'home',
        children: [],
        section: 'about',
    },
    archive: {
        name: 'archive',
        path: '~/home/archive/',
        parent: 'home',
        children: [],
        section: 'archive',
    },
    projects: {
        name: 'projects',
        path: '~/home/projects/',
        parent: 'home',
        children: ['cyberpunk-archive'],
        section: 'projects',
    },
    'cyberpunk-archive': {
        name: 'cyberpunk-archive',
        path: '~/home/projects/cyberpunk-archive',
        parent: 'projects',
        children: [],
        leaf: true,
        url: 'projects/cyberpunk-archive/',
    },
};

/** Caminho canônico do diretório inicial. */
export const HOME_PATH = VFS_NODES.home.path;

/** Mapa caminho-sem-barra-final -> chave de nó, para resolução rápida. */
const PATH_TO_KEY = new Map(
    Object.entries(VFS_NODES).map(([key, node]) => [stripTrailingSlash(node.path), key]),
);

function stripTrailingSlash(value) {
    return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
}

function nodeByPath(path) {
    if (typeof path !== 'string') return null;
    const key = PATH_TO_KEY.get(stripTrailingSlash(path.trim()));
    return key ? VFS_NODES[key] : null;
}

/**
 * Normaliza o nome de um comando: minúsculas e sem ponto final opcional.
 * Ex.: "/help." -> "/help", "/H." -> "/h".
 */
export function normalizeCommandName(raw) {
    if (typeof raw !== 'string') return '';
    return raw.trim().toLowerCase().replace(/\.+$/, '');
}

/**
 * Divide uma linha de entrada em comando e argumentos, sem jamais avaliar
 * o conteúdo. Rejeita entradas excessivamente longas.
 * @returns {{ command: string, args: string[], rawArgs: string }}
 */
export function parseCommand(raw) {
    if (typeof raw !== 'string') {
        throw new TypeError('Comando inválido');
    }
    if (raw.length > MAX_INPUT_LENGTH) {
        throw new RangeError('Comando muito longo');
    }

    const trimmed = raw.trim();
    if (!trimmed) {
        return { command: '', args: [], rawArgs: '' };
    }

    const firstSpace = trimmed.search(/\s/);
    let commandToken;
    let rawArgs;
    if (firstSpace === -1) {
        commandToken = trimmed;
        rawArgs = '';
    } else {
        commandToken = trimmed.slice(0, firstSpace);
        rawArgs = trimmed.slice(firstSpace + 1).trim();
    }

    const command = normalizeCommandName(commandToken);
    const args = rawArgs ? rawArgs.split(/\s+/) : [];
    return { command, args, rawArgs };
}

/**
 * Resolve um segmento de caminho relativo a partir de uma base, dentro da
 * árvore virtual confinada. Aceita segmentos compostos ("a/b", "..").
 * Retorna o caminho canônico do destino ou null se sair do confinamento
 * ou apontar para algo inexistente.
 */
export function normalizeVirtualPath(base, segment) {
    let node = nodeByPath(base);
    if (!node) return null;
    if (typeof segment !== 'string') return null;

    const parts = segment.split('/').filter((part) => part.length > 0);
    for (const part of parts) {
        if (part === '.') {
            continue;
        }
        if (part === '..') {
            if (!node.parent) return null; // tentativa de sair de ~/home
            node = VFS_NODES[node.parent];
            continue;
        }
        const childKey = node.children.find((key) => VFS_NODES[key]?.name === part);
        if (!childKey) return null;
        node = VFS_NODES[childKey];
    }

    return node.path;
}

/** Lista os nomes filhos de um caminho virtual (para ls e autocomplete). */
export function listVirtualChildren(path) {
    const node = nodeByPath(path);
    if (!node) return [];
    return node.children.map((key) => VFS_NODES[key].name);
}

/** Retorna a URL relativa segura associada a um caminho virtual, se houver. */
export function resolveVirtualTargetUrl(path) {
    const node = nodeByPath(path);
    return node && typeof node.url === 'string' ? node.url : null;
}

/** Retorna a seção do site associada a um caminho virtual, se houver. */
export function resolveVirtualSection(path) {
    const node = nodeByPath(path);
    return node && typeof node.section === 'string' ? node.section : null;
}

/**
 * Aceita apenas URLs HTTP(S) de mesma origem ou caminhos relativos de mesma
 * origem. Rejeita javascript:, data:, protocolo relativo ("//host") e
 * qualquer origem externa. Retorna a URL absoluta resolvida ou null.
 */
export function sanitizeNavigationUrl(url, base) {
    if (typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    // "//host/path" é relativo ao protocolo e pode apontar para outra origem.
    if (trimmed.startsWith('//')) return null;

    let baseUrl;
    try {
        baseUrl = new URL(base);
    } catch {
        return null;
    }

    let resolved;
    try {
        resolved = new URL(trimmed, baseUrl);
    } catch {
        return null;
    }

    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null;
    if (resolved.origin !== baseUrl.origin) return null;
    return resolved.href;
}

/**
 * Sugere completamentos por prefixo dado um conjunto de candidatos.
 * Retorna o array ordenado de correspondências.
 */
export function completeToken(prefix, candidates) {
    if (typeof prefix !== 'string') return [];
    const lower = prefix.toLowerCase();
    return candidates
        .filter((candidate) => candidate.toLowerCase().startsWith(lower))
        .sort();
}
