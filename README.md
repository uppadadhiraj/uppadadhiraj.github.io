# DHIRAJ.LOG

A simple personal blog built with [Astro](https://astro.build) and hosted free on GitHub Pages.
Posts are plain Markdown files. No database, no server, no cost.

**Live site:** https://uppadadhiraj.github.io
**Latest post:** [Learned how to find the length in array](https://uppadadhiraj.github.io/blog/java-learning/)

---

## Write a new post

1. Create a file in `src/content/blog/`, for example `my-post.md`. The file name becomes the
   URL, so this one would live at `https://uppadadhiraj.github.io/blog/my-post/`.
2. Start it with this block. The three dashes (`---`) on their own lines are required:

   ```md
   ---
   title: 'My post title'
   description: 'One line shown in the post list.'
   pubDate: '2026-10-05'
   tags: ['java', 'arrays']
   ---

   Write your post here, in Markdown.
   ```

3. Wrap code in triple backticks with the language name:

   ````md
   ```java
   System.out.println("hello");
   ```
   ````

4. Publish it:

   ```bash
   git add .
   git commit -m "new post"
   git push
   ```

5. Open the **Actions** tab of the repo. When "Deploy to GitHub Pages" shows a green tick
   (about a minute), the post is live on the site.

- `tags` are optional. They show on the post and become filter buttons on the Posts page.
- Two posts on the same day? Add a time so they sort correctly: `pubDate: '2026-10-05T18:30'`.
- Add `draft: true` to keep a post hidden from the live site. It still shows when you run the
  site on your own computer.

## Finding old posts

The **Posts** page groups everything by month and has a search box plus tag buttons, so you can
jump back to any day's notes. Code blocks in posts have a **Copy** button.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22.12 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:4321. The page reloads as you edit.

## Change the look

| File | What it controls |
|------|------------------|
| `src/consts.ts` | Blog name, tagline, your name, GitHub link |
| `src/styles/global.css` | Colours and fonts (see `:root` at the top) |
| `src/sprites.ts` | The small pixel-art computer icon |
| `src/pages/about.astro` | The About page text |
| `astro.config.mjs` | The site address (`site:`) |

The look is a 90s Windows-style desktop: teal background, a grey window with a title bar, menu bar and
address bar, a taskbar with a working Start menu and clock, a Welcome dialog on the home page and an error dialog on the 404 page.

## Publishing setup (one time)

1. In the GitHub repo, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

After that, every `git push` to `main` updates the site.

## Project layout

```
src/
├─ consts.ts            site name, author, links
├─ styles/global.css    the whole look
├─ sprites.ts           pixel icon
├─ components/          window chrome, taskbar, post list
├─ layouts/             page shell and post layout
├─ pages/               home, posts, about, 404, rss
└─ content/blog/        your posts (.md) and images/
```
