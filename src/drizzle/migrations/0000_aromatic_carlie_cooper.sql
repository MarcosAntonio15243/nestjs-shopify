CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idShopify" bigint NOT NULL,
	"email" text NOT NULL,
	"firstName" text,
	"lastName" text,
	"phone" text
);
--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idShopify" bigint NOT NULL,
	"productId" bigint NOT NULL,
	"variantId" bigint NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"quantity" integer,
	"price" numeric,
	"orderId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idShopify" bigint NOT NULL,
	"financialStatus" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"currency" text,
	"totalPrice" numeric NOT NULL,
	"subtotalPrice" numeric,
	"totalTax" numeric,
	"totalDiscounts" numeric,
	"gateway" text,
	"note" text,
	"tags" text,
	"customerId" uuid,
	"shippingFirstName" text,
	"shippingLastName" text,
	"shippingAddress1" text,
	"shippingAddress2" text,
	"shippingCity" text,
	"shippingProvince" text,
	"shippingZip" text,
	"shippingCountry" text,
	"shippingPhone" text
);
--> statement-breakpoint
CREATE TABLE "store" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"accessToken" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;