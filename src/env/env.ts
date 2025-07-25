import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url().startsWith('postgresql://'),
});

// Generate TypeScript type from the schema
// Equivalent to:
// 
// type Env = {
//   PORT: number;
// };
// 
export type Env = z.infer<typeof envSchema>;