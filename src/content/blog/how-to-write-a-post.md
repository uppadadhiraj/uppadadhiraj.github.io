---
title: 'How to write a post (read me, then delete me)'
description: 'Frontmatter, Markdown, images and drafts: everything this blog supports, in one place.'
pubDate: '2026-09-29'
draft: true
---

This post is a **draft**, so it only shows up when you run `npm run dev`. It never goes live. Use it as a cheat sheet, then delete it.

## 1. Create the file

Make a new `.md` file in `src/content/blog/`. The file name becomes the URL, so `pi-vision.md` ends up at `/blog/pi-vision/`.

Start it with this block (the *frontmatter*):

```yaml
---
title: 'Running AI on a Raspberry Pi 3B'
description: 'One line that shows up in the post list.'
pubDate: '2026-10-05'          # add a time (2026-10-05T18:30) to order two posts on the same day
updatedDate: '2026-10-07'   # optional
heroImage: './images/cover.png'  # optional
tags: ['java', 'arrays']    # optional: shown on the post, used as filters on the Posts page
draft: true                 # optional: hides it from the live site
---
```

## 2. Write in Markdown

### Text

Plain paragraphs, **bold**, *italic*, `inline code` and [links](https://astro.build) all work.

### Lists

- unordered items
- look like this
  - and can nest

1. ordered items
2. get numbers
3. automatically

### Quotes

> Quotes get a cyan bar down the left side.

### Code

```java
int frames = 0;
while (camera.isOpen()) {
    frames++;
}
```

### Tables

| Model      | FPS on Pi 3B | Size   |
|------------|--------------|--------|
| MobileNet  | 4.1          | 17 MB  |
| Tiny-YOLO  | 1.8          | 34 MB  |

### Images

Put images in `src/content/blog/images/` and link them with a relative path:

```md
![Colour test card](./images/test-card.png)
```

![Colour test card](./images/test-card.png)

Images are scaled to fit the page automatically.

---

## 3. Publish

Remove `draft: true` (or set it to `false`), then:

```bash
git add .
git commit -m "new post"
git push
```

GitHub builds and publishes the site for you in about a minute.
