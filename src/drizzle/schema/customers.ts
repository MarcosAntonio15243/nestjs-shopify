import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  idShopify: bigint({ mode: "number" }).notNull(),
  email: text().notNull(),
  firstName: text(),
  lastName: text(),
  phone: text(),
});