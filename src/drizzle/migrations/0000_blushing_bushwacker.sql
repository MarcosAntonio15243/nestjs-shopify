CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_shopify" bigint NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_shopify" bigint NOT NULL,
	"product_id" bigint NOT NULL,
	"variant_id" bigint NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"quantity" integer,
	"price" numeric,
	"order_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_shopify" bigint NOT NULL,
	"financial_status" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"currency" text,
	"total_price" numeric NOT NULL,
	"subtotal_price" numeric,
	"total_tax" numeric,
	"total_discounts" numeric,
	"gateway" text,
	"note" text,
	"tags" text,
	"customer_id" uuid,
	"shipping_first_name" text,
	"shipping_last_name" text,
	"shipping_address_1" text,
	"shipping_address_2" text,
	"shipping_city" text,
	"shipping_province" text,
	"shipping_zip" text,
	"shipping_country" text,
	"shipping_phone" text
);
--> statement-breakpoint
CREATE TABLE "store" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"access_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;