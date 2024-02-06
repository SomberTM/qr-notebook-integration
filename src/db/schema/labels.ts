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
});

export type Label = typeof labels.$inferSelect;

export const createLabelSchema = createInsertSchema(labels, {
	name: (schema) => schema.name.min(1).max(64),
	data: (schema) => schema.data,
	widthIn: () => z.coerce.number().positive().min(0.1).max(10.0),
	lengthIn: () => z.coerce.number().positive().min(0.1).max(10.0),
});
export type CreateLabelSchema = z.infer<typeof createLabelSchema>;

export type UpdateLabelSchema = Partial<Omit<Label, "id">> &
	Required<Pick<Label, "id">>;
