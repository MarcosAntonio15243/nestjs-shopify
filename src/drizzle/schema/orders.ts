import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  idShopify: integer().notNull(),
  financialStatus: text(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  currency: text(),
  totalPrice: numeric().notNull(),
  subtotalPrice: numeric(),
  totalTax: numeric(),
  totalDiscounts: numeric(),
  gateway: text(),
  note: text(),
  tags: text(),
  storeId: uuid()
    .references(() => stores.id)
    .notNull()
});