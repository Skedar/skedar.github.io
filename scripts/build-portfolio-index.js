#!/usr/bin/env node
// Build content/portfolio/index.json from frontmatter of all .md portfolio items
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORTFOLIO_DIR = path.join(ROOT, 'content', 'portfolio');
const INDEX_FILE = path.join(PORTFOLIO_DIR, 'index.json');
const DEFAULT_IMAGE = 'assets/images/portfolio-img.jpg';

function parseFrontmatter(text) {
  // Expect frontmatter delimited by --- at start
  if (!text.startsWith('---')) return {};
  const end = text.indexOf('\n---', 3);
  if (end === -1) return {};
  const fm = text.substring(3, end).trim();
  const lines = fm.split(/\r?\n/);
  const data = {};
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z0-9_\-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let raw = m[2].trim();
    // Arrays like ["a", "b"] or [a, b]
    if (raw.startsWith('[') && raw.endsWith(']')) {
      const inner = raw.slice(1, -1).trim();
      const arr = inner ? inner.split(',').map(s => s.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')) : [];
      data[key] = arr;
      continue;
    }
    // Quoted string
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith('\'') && raw.endsWith('\''))) {
      data[key] = raw.slice(1, -1);
      continue;
    }
    // Unquoted
    data[key] = raw;
  }
  return data;
}

function safeRead(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
}

function isMarkdownFile(filename) {
  return filename.toLowerCase().endsWith('.md');
}

function findCoverForSlug(slug) {
  // Priority: content/portfolio/<slug>/<slug>.webp|.jpg|.jpeg
  const folder = path.join(PORTFOLIO_DIR, slug);
  const candidates = [
    path.join(folder, `${slug}.webp`),
    path.join(folder, `${slug}.jpg`),
    path.join(folder, `${slug}.jpeg`),
    path.join(folder, `${slug}.png`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      // Return path relative to site root
      return path.relative(ROOT, p).replace(/\\/g, '/');
    }
  }
  return DEFAULT_IMAGE;
}

function normalizeCategory(meta) {
  let categories = [];
  if (Array.isArray(meta.categories) && meta.categories.length > 0) {
    if (meta.categories[0].startsWith('category-')) {
      categories = meta.categories;
    } else {
      const catName = meta.categories[0];
      const catClass = 'category-' + catName.normalize('NFD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
      categories = [catClass, catName];
    }
  }
  return categories;
}

function buildIndex() {
  const dirents = fs.readdirSync(PORTFOLIO_DIR, { withFileTypes: true });
  const items = [];

  // 1) Top-level .md files (no folder) use default cover
  for (const d of dirents) {
    if (d.isFile() && isMarkdownFile(d.name)) {
      const slug = path.basename(d.name, path.extname(d.name));
      const full = path.join(PORTFOLIO_DIR, d.name);
      const content = safeRead(full);
      if (!content) continue;
      const meta = parseFrontmatter(content);
      meta.slug = meta.slug || slug;
      const categories = normalizeCategory(meta);
      items.push({
        slug: meta.slug,
        title: meta.title || slug,
        date: meta.date || '',
        categories,
        image: meta.image || DEFAULT_IMAGE,
        excerpt: meta.excerpt || '',
        client: meta.client || ''
      });
    }
  }

  // 2) Folders named by slug: expect <slug>/<slug>.md and optional cover image
  for (const d of dirents) {
    if (d.isDirectory()) {
      const slug = d.name;
      const mdPath = path.join(PORTFOLIO_DIR, slug, `${slug}.md`);
      const content = safeRead(mdPath);
      if (!content) continue;
      const meta = parseFrontmatter(content);
      meta.slug = meta.slug || slug;
      const categories = normalizeCategory(meta);
      items.push({
        slug: meta.slug,
        title: meta.title || slug,
        date: meta.date || '',
        categories,
        image: findCoverForSlug(slug),
        excerpt: meta.excerpt || '',
        client: meta.client || ''
      });
    }
  }

  // Sort by date, most recent first
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write index file
  fs.writeFileSync(INDEX_FILE, JSON.stringify({ items }, null, 2));
  console.log(`Portfolio index built successfully: ${INDEX_FILE}`);
}

buildIndex();
