import { z } from 'zod';

export const authValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const loginSchema = z.object({
  body: authValidator,
});

export const signUpSchema = z.object({
  body: authValidator,
});
