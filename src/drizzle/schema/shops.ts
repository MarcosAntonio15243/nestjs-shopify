import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const shops = pgTable('shops', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text().notNull(),
  access_token: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});