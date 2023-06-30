import { z, defineCollection, reference } from 'astro:content';

const bands = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        description: z.string(),
        url: z.string().url().optional(),
        genre: z.array(z.string()).optional(),
        members: z.array(z.string()).optional(),
    })
}
);

const venues = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        description: z.string(),
        url: z.string().url(),
        keywords: z.array(z.string()),
    })
});

const articles = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        author: z.array(reference('contributors')),
        datePublished: z.date().optional(),
        abstract: z.string().optional(),
        keywords: z.array(z.string()),
    })
});

const contributors = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
    })
});

const events = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        description: z.string(),

        performer: z.array(reference('bands')),
        location: reference('venues'),
        audience: z.string().optional(), // 21+? All ages? 18+?

        startDate: z.coerce.date(),
        endDate: z.optional(z.coerce.date()),

        image: z.string().url().optional(),

        keywords: z.array(z.string()),
    })
});

export const collections = {
    articles,
    events,
    bands,
    venues,
    contributors
}