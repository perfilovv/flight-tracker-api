CREATE TABLE IF NOT EXISTS "airports" (
	"code" varchar(3) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"country" varchar(2) NOT NULL
);
