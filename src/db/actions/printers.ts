"use server";

import { revalidatePath } from "next/cache";
import { ActionResponse } from ".";
import db from "..";
import { CreatePrinterSchema, Printer, printers } from "../schema";

export async function createPrinterAction({
	name,
	ip,
	dpi,
}: CreatePrinterSchema): Promise<ActionResponse<Printer>> {
	try {
		const [printer] = await db
			.insert(printers)
			.values({
				name,
				ip,
				dpi,
			})
			.returning();

		revalidatePath("/printers");
		return { success: true, data: printer };
	} catch (error: any) {
		return { success: false, message: (error as Error).message };
	}
}
