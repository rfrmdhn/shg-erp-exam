import { z } from 'zod';

export const unitBodySchema = z.object({
  name: z
    .string()
    .min(1, 'name is required')
    .transform((s) => s.trim()),
});

export type UnitBody = z.infer<typeof unitBodySchema>;
