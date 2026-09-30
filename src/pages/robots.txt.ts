import type { APIRoute } from 'astro';
import { link } from '../utils';

export const GET: APIRoute = ({ site }) => {
	const sitemap = new URL(link('/sitemap-index.xml'), site).href;
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
