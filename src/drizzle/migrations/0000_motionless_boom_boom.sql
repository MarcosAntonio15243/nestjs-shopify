CREATE TABLE "store" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"accessToken" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
