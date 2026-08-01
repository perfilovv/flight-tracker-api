CREATE TYPE "public"."flight_status" AS ENUM('scheduled', 'departed', 'arrived', 'cancelled');--> statement-breakpoint
CREATE TABLE "flights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flight_number" varchar(10) NOT NULL,
	"origin" varchar(3) NOT NULL,
	"destination" varchar(3) NOT NULL,
	"departure_time" timestamp with time zone NOT NULL,
	"arrival_time" timestamp with time zone NOT NULL,
	"status" "flight_status" DEFAULT 'scheduled' NOT NULL,
	"created at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "flights_status_idx" ON "flights" USING btree ("status");--> statement-breakpoint
CREATE INDEX "flights_origin_idx" ON "flights" USING btree ("origin");