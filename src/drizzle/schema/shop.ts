import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const stores = pgTable('store', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text().notNull(),
  accessToken: text().notNull(), // Check this after
  createdAt: timestamp().defaultNow().notNull(),
});