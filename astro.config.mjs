// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// ─────────────────────────────────────────────────────────────
//  CHANGE THIS to your GitHub Pages address before deploying.
//
//  Repo named  yourusername.github.io  →  keep `base` commented out.
//  Repo named anything else (e.g. "blog") →  uncomment `base`
//  and set it to '/blog' (the repo name).
// ─────────────────────────────────────────────────────────────
export default defineConfig({
	site: 'https://uppadadhiraj.github.io',
	// base: '/blog',

	integrations: [sitemap()],

	markdown: {
		// No colourful syntax themes: code stays monochrome phosphor.
		syntaxHighlight: false,
	},

	// Hide Astro's floating dev toolbar so `npm run dev` looks like the real site.
	devToolbar: { enabled: false },
});
