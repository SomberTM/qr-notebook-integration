CREATE TABLE IF NOT EXISTS "printers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ip" text NOT NULL,
	"dpi" integer DEFAULT 203 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labels" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designed_for_id" text NOT NULL,
	"data" varchar DEFAULT ,
	"width_in" real NOT NULL,
	"length_in" real NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_designed_for_id_printers_id_fk" FOREIGN KEY ("designed_for_id") REFERENCES "printers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
