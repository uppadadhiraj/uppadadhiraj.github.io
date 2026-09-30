import { getCollection, type CollectionEntry } from 'astro:content';

/** Prefix an internal path with the site's base (works for any repo name). */
export function link(path: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** All posts, newest first. Drafts only show up in `npm run dev`. */
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog', ({ data }) =>
		import.meta.env.PROD ? !data.draft : true,
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 2026-09-30 */
export function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/** "4.2K" style file size of the raw Markdown. */
export function fileSize(body = ''): string {
	const bytes = new TextEncoder().encode(body).length;
	return bytes < 1024 ? `${bytes}B` : `${(bytes / 1024).toFixed(1)}K`;
}

/** Rough reading time in minutes. */
export function readMinutes(body = ''): number {
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
