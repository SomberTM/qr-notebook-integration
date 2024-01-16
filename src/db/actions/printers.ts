"use server";

import { revalidatePath } from "next/cache";
import { FormActionResponse } from ".";
import db from "..";
import { CreatePrinterSchema, Printer, printers } from "../schema";

export async function createPrinterAction({
	name,
	ip,
}: CreatePrinterSchema): Promise<FormActionResponse<Printer>> {
	try {
		const [printer] = await db
			.insert(printers)
			.values({
				name,
				ip,
			})
			.returning();

		revalidatePath("/printers");
		return { success: true, data: printer };
	} catch (error: any) {
		return { success: false, message: (error as Error).message };
	}
}
