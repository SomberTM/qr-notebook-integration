import { jsonb, pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { printers } from ".";

export const labels = pgTable("labels", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	designedForId: uuid("designed_for_id").references(() => printers.id),
	data: jsonb("data").default({}),
	widthIn: real("width_in").notNull(),
	heightIn: real("height_in").notNull(),
});

export type Label = typeof labels.$inferSelect;

export const createLabelSchema = createInsertSchema(labels, {
	name: (schema) => schema.name.min(1).max(64),
	widthIn: (schema) => schema.widthIn.positive(),
	heightIn: (schema) => schema.heightIn.positive(),
});
export type CreateLabelSchema = z.infer<typeof createLabelSchema>;
