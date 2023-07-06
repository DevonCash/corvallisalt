import { z, defineCollection, reference } from "astro:content";
import { DateTime } from "luxon";

const keyword = z.string().regex(/^[a-z0-9-]+$/g);

const bands = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    keywords: z.array(keyword),
    members: z.array(z.string()).optional(),
  }),
});

const venues = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    keywords: z.array(keyword),
  }),
});

const contributors = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
  }),
});

const stringToDate = z
  .string()
  .transform((arg) => DateTime.fromISO(arg).toJSDate());

const events = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string().optional(),
    description: z.string().optional(),

    performer: z.array(reference("bands")),
    location: reference("venues"),
    audience: z.string().optional(), // 21+? All ages? 18+?

    startDate: stringToDate,
    doorTime: stringToDate.optional(),
    endDate: stringToDate.optional(),

    image: z.string().url().optional(),
    cost: z
      .object({
        price: z.number().min(0),
        suggested: z.boolean().optional(),
      })
      .optional(),
    keywords: z.array(keyword),
  }),
});

export const collections = {
  events,
  bands,
  venues,
  contributors,
};
