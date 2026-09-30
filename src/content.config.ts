import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Every .md file in src/content/blog/ becomes a post.
	loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// draft: true → visible with `npm run dev`, hidden on the live site
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
