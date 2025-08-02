import { bigint, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  id_shopify: bigint({ mode: "number" }).notNull(),
  financial_status: text(),
  created_at: timestamp({ withTimezone: true }).notNull(),
  updated_at: timestamp({ withTimezone: true }).notNull(),
  currency: text(),
  total_price: numeric().notNull(),
  subtotal_price: numeric(),
  total_tax: numeric(),
  total_discounts: numeric(),
  gateway: text(),
  note: text(),
  tags: text(),
  customer_id: uuid()
    .references(() => customers.id, { onDelete: "set null" }),
  // Address info
  shipping_first_name: text(),
  shipping_last_name: text(),
  shipping_address_1: text(),
  shipping_address_2: text(),
  shipping_city: text(),
  shipping_province: text(),
  shipping_zip: text(),
  shipping_country: text(),
  shipping_phone: text() 
});
