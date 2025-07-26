import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  SHOPIFY_API_KEY: z.string(),
  SHOPIFY_API_SECRET: z.string(),
  SHOPIFY_SCOPES: z.string(),
  SHOPIFY_REDIRECT_URI: z.url(),
});

// Generate TypeScript type from the schema
// Equivalent to:
// 
// type Env = {
//   PORT: number;
// };
// 
export type Env = z.infer<typeof envSchema>;