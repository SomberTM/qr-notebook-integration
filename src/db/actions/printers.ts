"use server";

import { revalidatePath } from "next/cache";
import { ActionResponse } from ".";
import db from "..";
import { CreatePrinterSchema, Printer, printers } from "../schema";
import { v4 as uuid } from "uuid";

export async function createPrinterAction({
	name,
	ip,
	dpi,
}: CreatePrinterSchema): Promise<ActionResponse<void>> {
	try {
		await db.insert(printers).values({
			id: uuid(),
			name,
			ip,
			dpi,
		});

		revalidatePath("/printers");
		return { success: true, data: undefined };
	} catch (error: any) {
		return { success: false, message: (error as Error).message };
	}
}
