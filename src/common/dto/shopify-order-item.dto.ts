import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.coerce.number(),
  product_id: z.coerce.number(),
  variant_id: z.coerce.number(),
  name: z.string(),
  sku: z.string(),
  quantity: z.int(),
  price: z.string(),
});

export type OrderItemDTO = z.infer<typeof orderItemSchema>;
