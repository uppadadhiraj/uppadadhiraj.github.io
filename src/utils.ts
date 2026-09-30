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
	return posts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || b.id.localeCompare(a.id),
	);
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** 2026-09-30 */
export function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/** { mon: 'SEP', day: '30', year: '2026' } (UTC, so the date never shifts by timezone) */
export function dateParts(date: Date) {
	return {
		mon: MONTHS[date.getUTCMonth()],
		day: String(date.getUTCDate()).padStart(2, '0'),
		year: String(date.getUTCFullYear()),
	};
}

/** "SEP 2026", used to group the archive. */
export function monthLabel(date: Date): string {
	const { mon, year } = dateParts(date);
	return `${mon} ${year}`;
}

/** Rough reading time in minutes. */
export function readMinutes(body = ''): number {
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
