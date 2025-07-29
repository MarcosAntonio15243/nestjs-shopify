CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idShopify" integer NOT NULL,
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
	"storeId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;