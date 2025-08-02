import { z } from 'zod';

export const customerSchema = z.object({
  id: z.coerce.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string(),
});

export type CustomerDTO = z.infer<typeof customerSchema>;
