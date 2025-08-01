import { z } from 'zod';

export const authValidator = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8, 'Password must be at least 8 characters long'),
});

export type AuthDTO = z.infer<typeof authValidator>;

export const loginSchema = z.object({
  body: authValidator,
});

export const signUpSchema = z.object({
  body: authValidator,
});
