import { z } from 'zod';

export const WebhookSubscriptionReq = z.object({
  shop: z
    .string()
    .regex(/^[a-zA-Z0-9-]+\.myshopify\.com$/, 'Invalid shop domain'),
  code: z.string().min(1, 'Code is required'),
  state: z.string().optional(), // To check CSRF after
});

export type WebhookSubscriptionRequest = z.infer<typeof WebhookSubscriptionReq>;
