DROP INDEX "flights_status_idx";--> statement-breakpoint
CREATE INDEX "flights_departure_time_idx" ON "flights" USING btree ("departure_time");--> statement-breakpoint
CREATE INDEX "flights_destination_idx" ON "flights" USING btree ("destination");--> statement-breakpoint
CREATE INDEX "flights_origin_departure_idx" ON "flights" USING btree ("origin","departure_time");--> statement-breakpoint
CREATE INDEX "flights_status_departure_idx" ON "flights" USING btree ("status","departure_time");