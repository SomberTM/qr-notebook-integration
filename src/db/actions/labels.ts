"use server";

import { eq } from "drizzle-orm";
import { FormActionResponse } from ".";
import db from "..";
import { CreateLabelSchema, Label, UpdateLabelSchema, labels } from "../schema";

export async function createLabelTemplate({
	name,
	designedForId,
	widthIn,
	lengthIn,
	data,
}: CreateLabelSchema): Promise<FormActionResponse<Label>> {
	try {
		const [label] = await db
			.insert(labels)
			.values({
				name,
				designedForId,
				widthIn,
				lengthIn,
				data,
			})
			.returning();
		return { success: true, data: label };
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
}: UpdateLabelSchema): Promise<FormActionResponse<Label>> {
	try {
		const [label] = await db
			.update(labels)
			.set({
				name,
				designedForId,
				widthIn,
				lengthIn,
				data,
			})
			.where(eq(labels.id, id))
			.returning();
		return { success: true, data: label };
	} catch (error: any) {
		return { success: false, message: (error as Error).message };
	}
}
