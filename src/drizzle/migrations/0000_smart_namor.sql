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
	"tags" text
);
--> statement-breakpoint
CREATE TABLE "store" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"accessToken" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
