import { bigint, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  idShopify: bigint({ mode: "number" }).notNull(),
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
  customerId: uuid('customer_id')
    .references(() => customers.id, { onDelete: "set null" })
});