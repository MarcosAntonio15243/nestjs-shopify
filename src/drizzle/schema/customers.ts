import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  id_shopify: bigint({ mode: "number" }).notNull(),
  email: text().notNull(),
  first_name: text(),
  last_name: text(),
  phone: text(),
});