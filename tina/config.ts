import { defineConfig } from "tinacms";

export default defineConfig({
	branch: process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
	clientId: process.env.TINA_CLIENT_ID,
	token: process.env.TINA_TOKEN,
	build: {
		outputFolder: "admin",
		publicFolder: ".",
	},
	search: process.env.TINA_SEARCH_TOKEN
		? {
			tina: {
				indexerToken: process.env.TINA_SEARCH_TOKEN,
				stopwordLanguages: ["por", "eng"],
			},
		}
		: undefined,
	media: {
		tina: {
			mediaRoot: "assets",
			publicFolder: ".",
		},
	},
	schema: {
		collections: [
			{
				name: "post",
				label: "Posts",
				path: "content/posts",
				format: "md",
				ui: {
					filename: {
						slugify: (values) => (values?.slug || values?.title || "post").toLowerCase().replace(/\s+/g, "-")
					},
				},
				fields: [
					{ type: "string", name: "title", label: "Title", isTitle: true, required: true },
					{ type: "string", name: "slug", label: "Slug", required: true },
					{ type: "datetime", name: "date", label: "Date" },
					{ type: "string", name: "author", label: "Author" },
					{ type: "string", name: "image", label: "Image" },
					{ type: "string", name: "excerpt", label: "Excerpt", ui: { component: "textarea" } },
					{ type: "string", name: "categories", label: "Categories", list: true },
					{ type: "string", name: "tags", label: "Tags", list: true },
					{ type: "rich-text", name: "_body", label: "Body", isBody: true },
				],
			},
			{
				name: "index",
				label: "Posts Index",
				path: "content/posts",
				format: "json",
				uI: {
					singleton: true,
				},
				match: {
					include: "index",
				},
				fields: [
					{
						type: "object",
						name: "posts",
						label: "Posts",
						list: true,
						fields: [
							{ type: "string", name: "slug", label: "Slug", required: true },
							{ type: "string", name: "title", label: "Title", required: true },
							{ type: "datetime", name: "date", label: "Date" },
							{ type: "string", name: "author", label: "Author" },
							{ type: "string", name: "image", label: "Image" },
							{ type: "string", name: "excerpt", label: "Excerpt", ui: { component: "textarea" } },
							{ type: "string", name: "categories", label: "Categories", list: true },
							{ type: "string", name: "tags", label: "Tags", list: true },
						],
					},
				],
			},
		],
	},
});


