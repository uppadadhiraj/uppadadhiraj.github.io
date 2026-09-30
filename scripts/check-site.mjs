// Checks the built site in dist/. Run with `npm run check` (builds first).
//
//   - every page has a language, title, description, canonical URL and exactly one <h1>
//   - every internal link, image, script and stylesheet points at a file that exists
//   - ids are unique per page, images have alt text
//   - draft posts are NOT published, every published post has a page, a feed entry and a sitemap entry
//   - robots.txt and the favicon exist
//
// Pass --base=/repo-name if you build with a `base` path.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';

const DIST = 'dist';
const BLOG = 'src/content/blog';
const base = (process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? '').replace(/\/$/, '');

const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);

if (!existsSync(DIST)) {
	console.error('dist/ not found. Run `npm run build` first.');
	process.exit(1);
}

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

const rel = (p) => relative(DIST, p).split(sep).join('/');
const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));

/** Turn an internal URL into the file it should resolve to inside dist/, or null if external. */
function resolveInternal(href, fromPage) {
	if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(href) || href.startsWith('//')) return null;
	let path = href.split('#')[0].split('?')[0];
	if (path === '') return null;
	if (!path.startsWith('/')) {
		const dir = '/' + rel(fromPage).replace(/[^/]*$/, '');
		path = dir + path;
	}
	if (base) {
		if (!path.startsWith(base + '/') && path !== base) return { path, outsideBase: true };
		path = path.slice(base.length) || '/';
	}
	path = decodeURIComponent(path);
	const candidates = path.endsWith('/')
		? [join(DIST, path, 'index.html')]
		: [join(DIST, path), join(DIST, path, 'index.html'), join(DIST, path + '.html')];
	return { path, file: candidates.find((c) => existsSync(c) && statSync(c).isFile()) };
}

// ── Per-page checks ──────────────────────────────────────
for (const page of pages) {
	const name = rel(page);
	const html = readFileSync(page, 'utf8');

	if (!/<html[^>]*\slang="[a-z-]+"/i.test(html)) fail(name, 'missing <html lang>');
	if (!/<title>[^<]+<\/title>/.test(html)) fail(name, 'missing or empty <title>');
	if (!/<meta name="description" content="[^"]+"/.test(html)) fail(name, 'missing meta description');
	if (!/<link rel="canonical" href="https?:\/\//.test(html)) fail(name, 'missing absolute canonical URL');
	const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
	if (h1s !== 1) fail(name, `expected exactly 1 <h1>, found ${h1s}`);

	// duplicate ids
	const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
	for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) fail(name, `duplicate id "${id}"`);

	// images need alt text
	for (const img of html.matchAll(/<img\b[^>]*>/g)) {
		if (!/\salt=/.test(img[0])) fail(name, `<img> without alt: ${img[0].slice(0, 80)}`);
	}

	// internal links and assets
	for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
		const target = resolveInternal(m[1], page);
		if (!target) continue;
		if (target.outsideBase) fail(name, `link ignores base path "${base}": ${m[1]}`);
		else if (!target.file) fail(name, `broken internal link: ${m[1]}`);
	}

	// in-page anchors must exist
	for (const m of html.matchAll(/\shref="#([^"]+)"/g)) {
		if (!ids.includes(m[1]) && m[1] !== 'top') fail(name, `anchor #${m[1]} has no matching id`);
	}
}

// ── Posts: drafts hidden, published posts present everywhere ──
const posts = readdirSync(BLOG)
	.filter((f) => f.endsWith('.md'))
	.map((f) => {
		const src = readFileSync(join(BLOG, f), 'utf8');
		const front = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		if (!front) {
			fail(`${BLOG}/${f}`, 'missing --- frontmatter block at the top');
			return null;
		}
		for (const key of ['title', 'description', 'pubDate']) {
			if (!new RegExp(`^${key}:`, 'm').test(front[1])) fail(`${BLOG}/${f}`, `missing "${key}:" in frontmatter`);
		}
		return { slug: f.replace(/\.md$/, ''), draft: /^draft:\s*true/m.test(front[1]) };
	})
	.filter(Boolean);

const feed = existsSync(join(DIST, 'rss.xml')) ? readFileSync(join(DIST, 'rss.xml'), 'utf8') : '';
const sitemapFiles = files.filter((f) => /sitemap-\d+\.xml$/.test(f));
const sitemap = sitemapFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
if (!feed) fail('rss.xml', 'missing');
if (!sitemap) fail('sitemap', 'missing');

for (const post of posts) {
	const pageFile = join(DIST, 'blog', post.slug, 'index.html');
	const inFeed = feed.includes(`/blog/${post.slug}/`);
	const inSitemap = sitemap.includes(`/blog/${post.slug}/`);
	if (post.draft) {
		if (existsSync(pageFile)) fail(post.slug, 'is a draft but was published');
		if (inFeed) fail(post.slug, 'is a draft but appears in the RSS feed');
		if (inSitemap) fail(post.slug, 'is a draft but appears in the sitemap');
	} else {
		if (!existsSync(pageFile)) fail(post.slug, 'published post has no page');
		if (!inFeed) fail(post.slug, 'missing from the RSS feed');
		if (!inSitemap) fail(post.slug, 'missing from the sitemap');
	}
}

// ── Site-wide files ──────────────────────────────────────
for (const required of ['robots.txt', '404.html', 'index.html', 'blog/index.html', 'about/index.html']) {
	if (!existsSync(join(DIST, required))) fail(required, 'missing from dist/');
}
const home = existsSync(join(DIST, 'index.html')) ? readFileSync(join(DIST, 'index.html'), 'utf8') : '';
const icon = home.match(/<link rel="icon"[^>]*href="([^"]+)"/)?.[1];
if (!icon) fail('index.html', 'no favicon link');

// ── Report ───────────────────────────────────────────────
const published = posts.filter((p) => !p.draft).length;
console.log(
	`Checked ${pages.length} pages, ${files.length} files, ${published} published post(s), ` +
		`${posts.length - published} draft(s), ${extname(icon ?? '') || 'no'} favicon.`,
);
if (failures.length) {
	console.error(`\n${failures.length} problem(s):`);
	for (const f of failures) console.error('  x ' + f);
	process.exit(1);
}
console.log('All checks passed.');
