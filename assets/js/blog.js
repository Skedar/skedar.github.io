// Minimal blog list renderer that preserves existing blog card markup
(function () {
	function formatDate(dateStr) {
		try {
			const d = new Date(dateStr);
			return d.toLocaleDateString('pt-BR', { month: 'short', day: '2-digit', year: 'numeric' });
		} catch (e) {
			return dateStr;
		}
	}

	function renderPostCard(post) {
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

	async function loadPosts() {
		const container = document.getElementById('blog-list');
		if (!container) return;
		try {
			const res = await fetch('content/posts/index.json', { cache: 'no-store' });
			if (!res.ok) throw new Error('Failed to load posts');
			const data = await res.json();
			const posts = Array.isArray(data) ? data : (data.posts || []);
			posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
			container.innerHTML = posts.map(renderPostCard).join('');
		} catch (e) {
			console.error(e);
		}
	}

	document.addEventListener('DOMContentLoaded', loadPosts);
})();


