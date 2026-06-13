import { z } from 'zod';

export const vendorQuerySchema = z.object({
  unitId: z.coerce.number().int().positive('unitId must be a positive integer'),
});

export const vendorCreateSchema = z.object({
  vendorId: z.string().min(1, 'vendorId is required'),
  name: z.string().min(1, 'name is required'),
  address: z.string().min(1, 'address is required'),
  unitId: z.number().int().positive('unitId must be a positive integer'),
});

export const vendorUpdateSchema = z.object({
  name: z.string().min(1, 'name is required'),
  address: z.string().min(1, 'address is required'),
});

export type VendorQueryParams = z.infer<typeof vendorQuerySchema>;
export type VendorCreateBody = z.infer<typeof vendorCreateSchema>;
export type VendorUpdateBody = z.infer<typeof vendorUpdateSchema>;
