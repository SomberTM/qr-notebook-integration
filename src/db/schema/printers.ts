import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

export const printers = pgTable("printers", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	ip: text("ip").notNull(),
	dpi: integer("dpi").notNull().default(203),
});

export type Printer = typeof printers.$inferSelect;

export const createPrinterSchema = createInsertSchema(printers, {
	ip: (schema) => schema.ip.ip({ version: "v4" }),
	name: (schema) => schema.name.min(1).max(64),
});
export type CreatePrinterSchema = z.infer<typeof createPrinterSchema>;
