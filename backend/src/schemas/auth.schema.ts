import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
});

export type LoginBody = z.infer<typeof loginSchema>;

export const jwtPayloadSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.enum(['admin', 'user']),
});
