import { z } from 'zod';

export const orderSchema = z.object({
  id: z.coerce.number(),
  financial_status: z.string(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
  currency: z.string(),
  total_price: z.string(),
  subtotal_price: z.string(),
  total_tax: z.string(),
  total_discounts: z.string(),
  gateway: z.string(),
  note: z.string().nullable(),
  tags: z.string(),
});

export type OrderDTO = z.infer<typeof orderSchema>;
