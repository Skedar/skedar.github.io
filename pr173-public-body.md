# Wave 173 — mirror de site/dist (canônico) → site público (GitHub Pages)

## Conteúdo

- `assets/index-Cpkv1jao.js` (novo bundle da build de onda 173)
- `covers/senster-1970-README.md` (novo)
- `index.html` atualizado para o novo bundle (assets/index-Cpkv1jao.js)
- Remoção de hashes obsoletos: `assets/index--tbIEX5x.js`, `covers/The_Peripheral_title_card.jpg`,
  `covers/nycc_moretz.jpg`, `covers/the-terminal-man-1972.jpg`

## Validação

- Canônico: CI `Validate Cyberpunk Archive` = **success** (merge `d2b24cc`).
- `npm run build` OK; `npm test` 15/15; `npm run typecheck` OK.
- `python3 scripts/validate_archive.py` → **PASS** (`works=417, verified=414, reference=3`).
- Mirror: `python3 /opt/data/cache/scratch/wave173_mirror.py` → 3 novos/modificados, 4 removidos, sem hash deletado de source.

## Público

- Site: `skedar.github.io/projects/cyberpunk-archive` (GitHub Pages).
- Branch: `editorial/wave173-2026-11-02-public` (worktree isolado).
- Merge a `main` do repositório público.
