(function () {
	function getParam(name) {
		const p = new URLSearchParams(window.location.search);
		return p.get(name);
	}

	function formatDate(dateStr) {
		try {
			const d = new Date(dateStr);
			return d.toLocaleDateString('pt-BR', { month: 'short', day: '2-digit', year: 'numeric' });
		} catch (e) {
			return dateStr;
		}
	}

	async function fetchPost(slug) {
		const res = await fetch('content/posts/index.json', { cache: 'no-store' });
		const data = await res.json();
		const list = Array.isArray(data) ? data : (data.posts || []);
		const meta = list.find((p) => p.slug === slug);
		if (!meta) throw new Error('Post not found');
		const mdRes = await fetch(`content/posts/${slug}.md`, { cache: 'no-store' });
		const markdown = await mdRes.text();
		return { meta, markdown };
	}

	function markdownToHtml(md) {
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
				'<h6 class="mono-heading mb-0">Posted by:</h6>' +
				`<p>${meta.author || 'admin'}</p>` +
			'</div>' +
			'<div class="col-12 col-xl-4">' +
				'<h6 class="mono-heading mb-0">Category:</h6>' +
				`<p>${(meta.categories && meta.categories.join(', ')) || meta.category || ''}</p>` +
			'</div>' +
			'<div class="col-12 col-xl-4">' +
				'<h6 class="mono-heading mb-0">Posted on:</h6>' +
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
					`<a class="lightbox-image-box border-radius" href="${meta.image}">` +
						`<img src="${meta.image}" alt="">` +
						'<i class="bi bi-arrows-fullscreen"></i>' +
					'</a>' +
				'</div>'
			);
		}
		rows.push(`<div class="col-12">${bodyHtml}</div>`);
		contentEl.innerHTML = rows.join('');

		if (meta.tags && meta.tags.length) {
			tagsEl.innerHTML = meta.tags.map((t) => `<li><a href="#">#${t}</a></li>`).join('');
		}
	}

	function renderList(posts, title) {
		const headerEl = document.getElementById('post-header');
		const contentEl = document.getElementById('post-content');
		const metaEl = document.getElementById('post-meta');
		const tagsEl = document.getElementById('post-tags');
		if (metaEl) metaEl.innerHTML = '';
		if (tagsEl) tagsEl.innerHTML = '';
		if (headerEl) headerEl.innerHTML = `<h1>${title}</h1>`;
		function renderCard(post) {
			const category = Array.isArray(post.categories) ? post.categories[0] : (post.category || 'Blog');
			const dateText = post.date ? formatDate(post.date) : '';
			const href = `blog.html?slug=${encodeURIComponent(post.slug)}`;
			const image = post.image || 'assets/images/blog-post-img.jpg';
			return (
				'<div class="blog-post-box">' +
					'<div class="blog-post-img">' +
						`<a href="${href}">` +
							`<img src="${image}" alt="">` +
						'</a>' +
						'<div class="blog-post-category">' +
							`<a href="#">${category}</a>` +
						'</div>' +
					'</div>' +
					'<div class="blog-post-caption">' +
						(dateText ? `<p class="mb-2">Publicado em ${dateText}</p>` : '') +
						`<h2><a class="link-decoration" href="${href}">${post.title}</a></h2>` +
						`<a class="button button-sm button-outline mt-2" href="${href}">Ler mais</a>` +
					'</div>' +
				'</div>'
			);
		}
		if (contentEl) {
			const html = posts.map(renderCard).join('') || '<div class="col-12"><p>Nenhuma postagem encontrada.</p></div>';
			contentEl.innerHTML = html;
		}
	}

	async function init() {
	const slug = getParam('slug');
	const archive = getParam('archive'); // YYYY-MM
	const tag = getParam('tag');
	// If no slug, still render archives and tags only, and optionally filtered list
		try {
		// load index for archives and tags
		const res = await fetch('content/posts/index.json', { cache: 'no-store' });
		const data = await res.json();
		const posts = Array.isArray(data) ? data : (data.posts || []);
		// Archives (YYYY-MM)
		const archives = posts.reduce((acc, p) => {
			if (!p.date) return acc;
			const d = new Date(p.date);
			if (isNaN(d)) return acc;
			const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		}, {});
		const archivesList = document.getElementById('archives-list');
		if (archivesList) {
			const monthNames = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
			const items = Object.keys(archives)
				.sort((a,b)=>b.localeCompare(a))
				.map(k => {
					const [y,m] = k.split('-');
					const monthIndex = Math.max(0, Math.min(11, parseInt(m,10)-1));
					const label = `${y} - ${monthNames[monthIndex]}`;
					return `<li><a class="mono-heading link-decoration" href="?archive=${k}">${label} (${archives[k]})</a></li>`;
				}).join('');
			archivesList.innerHTML = items || '<li>Sem arquivos</li>';
		}
		// Tag cloud
		const tagSet = new Set();
		posts.forEach(p => Array.isArray(p.tags) && p.tags.forEach(t => tagSet.add(t)));
		const tagCloud = document.getElementById('tag-cloud');
		if (tagCloud) {
			tagCloud.innerHTML = Array.from(tagSet).sort().map(t => `<li><a href="?tag=${encodeURIComponent(t)}">#${t}</a></li>`).join('') || '<li>#sem-tags</li>';
		}
		if (slug) {
			const { meta, markdown } = await fetchPost(slug);
			render(meta, markdown);
		} else if (archive) {
			const filtered = posts.filter(p => {
				if (!p.date) return false;
				const d = new Date(p.date);
				if (isNaN(d)) return false;
				const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
				return key === archive;
			}).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
			const [y,m] = archive.split('-');
			renderList(filtered, `Arquivo ${m}/${y}`);
		} else if (tag) {
			const filtered = posts.filter(p => Array.isArray(p.tags) && p.tags.includes(tag)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
			renderList(filtered, `Tag #${tag}`);
		} else {
			// Default: latest 12 posts
			const latest = posts
				.slice()
				.sort((a,b)=>(b.date||'').localeCompare(a.date||''))
				.slice(0,12);
			renderList(latest, 'Últimos Posts');
		}
		} catch (e) {
			console.error(e);
			const contentEl = document.getElementById('post-content');
			if (contentEl) {
				contentEl.innerHTML = '<div class="col-12"><p>Unable to load this post. Ensure the markdown file exists and slug matches.</p></div>';
			}
		}
	}

	document.addEventListener('DOMContentLoaded', init);
})();


