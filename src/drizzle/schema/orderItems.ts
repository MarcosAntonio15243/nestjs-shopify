import { bigint, integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  idShopify: bigint({ mode: "number" }).notNull(),
  productId: bigint({ mode: "number" }).notNull(),
  variantId: bigint({ mode: "number" }).notNull(),
  name: text().notNull(),
  sku: text(),
  quantity: integer(),
  price: numeric(),
  orderId: uuid()
    .references(() => orders.id)
    .notNull()
});