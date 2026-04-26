import { z } from 'zod';

export const registerSchema = z.object({
  user: z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const updateUserSchema = z.object({
  user: z.object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    bio: z.string().optional(),
    image: z.string().url().optional().or(z.literal('')),
  }),
});
