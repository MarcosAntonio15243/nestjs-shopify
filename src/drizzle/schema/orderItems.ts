import { bigint, integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  id_shopify: bigint({ mode: "number" }).notNull(),
  product_id: bigint({ mode: "number" }).notNull(),
  variant_id: bigint({ mode: "number" }).notNull(),
  name: text().notNull(),
  sku: text(),
  quantity: integer(),
  price: numeric(),
  order_id: uuid()
    .references(() => orders.id)
    .notNull()
});