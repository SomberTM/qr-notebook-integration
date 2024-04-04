import { customType, pgTable, real, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { printers } from ".";
import { CanvasElement } from "@/components/editor/utils";

const labelData = customType<{
	data: CanvasElement[];
	driverData: string;
}>({
	dataType() {
		return "varchar(65535)";
	},
	toDriver(value) {
		return JSON.stringify(value);
	},
	fromDriver(value) {
		return JSON.parse(value);
	},
});

export const labels = pgTable("labels", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	designedForId: text("designed_for_id")
		.references(() => printers.id)
		.notNull(),
	data: labelData("data").default([]),
	widthIn: real("width_in").notNull(),
	lengthIn: real("length_in").notNull(),
});

export type Label = typeof labels.$inferSelect;

export const createLabelSchema = createInsertSchema(labels, {
	id: z.string().min(0).max(0).or(z.string().uuid()),
	name: (schema) => schema.name.min(1).max(64),
	data: (schema) => schema.data,
	widthIn: () => z.coerce.number().positive().min(0.1).max(10.0),
	lengthIn: () => z.coerce.number().positive().min(0.1).max(10.0),
});
export type CreateLabelSchema = z.infer<typeof createLabelSchema>;

export type UpdateLabelSchema = Partial<Omit<Label, "id">> &
	Required<Pick<Label, "id">>;
