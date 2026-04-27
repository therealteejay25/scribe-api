import { z } from 'zod';

export const createArticleSchema = z.object({
  article: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    body: z.string().min(1),
    image: z.string().url().optional().or(z.literal('')),
    tagList: z.array(z.string()).optional(),
  }),
});

export const updateArticleSchema = z.object({
  article: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    image: z.string().url().optional().or(z.literal('')),
    tagList: z.array(z.string()).optional(),
  }),
});

export const createCommentSchema = z.object({
  comment: z.object({
    body: z.string().min(1),
  }),
});
