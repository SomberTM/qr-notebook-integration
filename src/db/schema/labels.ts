import { jsonb, pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { printers } from ".";

export const labels = pgTable("labels", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	designedForId: uuid("designed_for_id")
		.references(() => printers.id)
		.notNull(),
	data: jsonb("data").default({}),
	widthIn: real("width_in").notNull(),
	lengthIn: real("length_in").notNull(),
	zpl: text("zpl"),
});

export type Label = typeof labels.$inferSelect;

export const createLabelSchema = createInsertSchema(labels, {
	name: (schema) => schema.name.min(1).max(64),
	widthIn: (schema) => schema.widthIn.positive(),
	lengthIn: (schema) => schema.lengthIn.positive(),
});
export type CreateLabelSchema = z.infer<typeof createLabelSchema>;
