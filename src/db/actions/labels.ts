"use server";

import { eq } from "drizzle-orm";
import { ActionResponse } from ".";
import db from "..";
import { CreateLabelSchema, Label, UpdateLabelSchema, labels } from "../schema";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";

export async function createLabelTemplate({
	name,
	designedForId,
	widthIn,
	lengthIn,
	data,
}: CreateLabelSchema): Promise<ActionResponse<string>> {
	try {
		const id = uuid();
		await db.insert(labels).values({
			id,
			name,
			designedForId,
			widthIn,
			lengthIn,
			data,
		});

		revalidatePath("/editor");
		return { success: true, data: id };
	} catch (error: any) {
		return { success: false, message: (error as Error).message };
	}
}

export async function updateLabelTemplate({
	id,
	name,
	designedForId,
	widthIn,
	lengthIn,
	data,
}: UpdateLabelSchema): Promise<ActionResponse<string>> {
	try {
		await db
			.update(labels)
			.set({
				name,
				designedForId,
				widthIn,
				lengthIn,
				data,
			})
			.where(eq(labels.id, id));

		revalidatePath("/editor");
		return { success: true, data: id };
	} catch (error: any) {
		return { success: false, message: (error as Error).message };
	}
}
