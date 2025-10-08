(function () {
	function getParam(name) {
		const p = new URLSearchParams(window.location.search);
		return p.get(name);
	}

	async function fetchPost(slug) {
		const res = await fetch('content/posts/index.json', { cache: 'no-store' });
		const list = await res.json();
		const meta = list.find((p) => p.slug === slug);
		if (!meta) throw new Error('Post not found');
		const mdRes = await fetch(`content/posts/${slug}.md`, { cache: 'no-store' });
		const markdown = await mdRes.text();
		return { meta, markdown };
	}

	function markdownToHtml(md) {
		// ultra-light markdown renderer covering headings, paragraphs, images and links
		let html = md
			.replace(/^###\s+(.*)$/gm, '<h3 class="fw-medium">$1</h3>')
			.replace(/^##\s+(.*)$/gm, '<h4 class="fw-medium">$1</h4>')
			.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
			.replace(/^\-\s+(.*)$/gm, '<li>$1</li>')
			.replace(/!\[(.*?)\]\((.*?)\)/g, '<img class="border-radius" src="$2" alt="$1">')
			.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
			.replace(/\n{2,}/g, '</p><p>');
		html = '<p>' + html + '</p>';
		html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="list-circle">$1</ul>');
		return html;
	}

	function render(meta, markdown) {
		const metaEl = document.getElementById('post-meta');
		const headerEl = document.getElementById('post-header');
		const contentEl = document.getElementById('post-content');
		const tagsEl = document.getElementById('post-tags');

		metaEl.innerHTML =
			'<div class="col-12 col-xl-4">' +
				'<h6 class="mono-heading mb-0">Publicado por:</h6>' +
				`<p>${meta.author || 'admin'}</p>` +
			'</div>' +
			'<div class="col-12 col-xl-4">' +
				'<h6 class="mono-heading mb-0">Categoria:</h6>' +
				`<p>${(meta.categories && meta.categories.join(', ')) || meta.category || ''}</p>` +
			'</div>' +
			'<div class="col-12 col-xl-4">' +
				'<h6 class="mono-heading mb-0">Publicado em:</h6>' +
				`<p>${meta.date || ''}</p>` +
			'</div>';

		headerEl.innerHTML =
			`<h1>${meta.title}</h1>` +
			(meta.excerpt ? `<p>${meta.excerpt}</p>` : '');

		let bodyHtml = markdownToHtml(markdown.split('\n---\n').slice(-1)[0]);
		const rows = [];
		if (meta.image) {
			rows.push(
				'<div class="col-12">' +
					`<img class="border-radius" src="${meta.image}" alt="">` +
				'</div>'
			);
		}
		rows.push(`<div class="col-12">${bodyHtml}</div>`);
		contentEl.innerHTML = rows.join('');

		if (meta.tags && meta.tags.length) {
			tagsEl.innerHTML = meta.tags.map((t) => `<li><a href="#">#${t}</a></li>`).join('');
		}
	}

	async function init() {
		const slug = getParam('slug');
		if (!slug) return;
		try {
			const { meta, markdown } = await fetchPost(slug);
			render(meta, markdown);
		} catch (e) {
			console.error(e);
		}
	}

	document.addEventListener('DOMContentLoaded', init);
})();


