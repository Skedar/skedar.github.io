#!/usr/bin/env node
// Build content/posts/index.json from frontmatter of all .md posts
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const INDEX_FILE = path.join(POSTS_DIR, 'index.json');
const DEFAULT_IMAGE = 'assets/images/blog-post-img.jpg';

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
  // Priority: content/posts/<slug>/<slug>.webp|.jpg|.jpeg
  const folder = path.join(POSTS_DIR, slug);
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

function buildIndex() {
  const dirents = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const posts = [];

  // 1) Top-level .md files (no folder) use default cover
  for (const d of dirents) {
    if (d.isFile() && isMarkdownFile(d.name)) {
      const slug = path.basename(d.name, path.extname(d.name));
      const full = path.join(POSTS_DIR, d.name);
      const content = safeRead(full);
      if (!content) continue;
      const meta = parseFrontmatter(content);
      meta.slug = meta.slug || slug;
      if (meta.categories && !Array.isArray(meta.categories)) meta.categories = [String(meta.categories)];
      if (meta.tags && !Array.isArray(meta.tags)) meta.tags = [String(meta.tags)];
      posts.push({
        slug: meta.slug,
        title: meta.title || slug,
        date: meta.date || '',
        categories: Array.isArray(meta.categories) ? meta.categories : [],
        image: meta.image || DEFAULT_IMAGE,
        excerpt: meta.excerpt || '',
        author: meta.author || 'admin',
        tags: Array.isArray(meta.tags) ? meta.tags : []
      });
    }
  }

  // 2) Folders named by slug: expect <slug>/<slug>.md and optional cover image
  for (const d of dirents) {
    if (d.isDirectory()) {
      const slug = d.name;
      const mdPath = path.join(POSTS_DIR, slug, `${slug}.md`);
      if (!fs.existsSync(mdPath)) continue;
      const content = safeRead(mdPath);
      if (!content) continue;
      const meta = parseFrontmatter(content);
      meta.slug = meta.slug || slug;
      if (meta.categories && !Array.isArray(meta.categories)) meta.categories = [String(meta.categories)];
      if (meta.tags && !Array.isArray(meta.tags)) meta.tags = [String(meta.tags)];
      const image = meta.image || findCoverForSlug(slug);
      posts.push({
        slug: meta.slug,
        title: meta.title || slug,
        date: meta.date || '',
        categories: Array.isArray(meta.categories) ? meta.categories : [],
        image,
        excerpt: meta.excerpt || '',
        author: meta.author || 'admin',
        tags: Array.isArray(meta.tags) ? meta.tags : []
      });
    }
  }
  // Sort newest first by date string (ISO-like expected)
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const out = { posts };
  const json = JSON.stringify(out, null, '\t') + '\n';
  fs.writeFileSync(INDEX_FILE, json, 'utf8');
  console.log(`Wrote ${posts.length} posts to ${path.relative(ROOT, INDEX_FILE)}`);
}

buildIndex();


