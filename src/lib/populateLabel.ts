import { CanvasElement } from "@/components/editor/utils";
import { FormattedSignalsResponse } from "@/db/actions/signals";
import { Label } from "@/db/schema";

export function populateLabels(
	labelTemplate: Label,
	data: FormattedSignalsResponse
): CanvasElement[][] {
	let canvasData: CanvasElement[][] = [];

	for (const row of data) {
		const template = [
			...(labelTemplate.data as Record<any, any>[]),
		] as CanvasElement[];

		const keys = Object.keys(row);
		for (const entry of template.filter((el) => el.type === "TEXT")) {
			for (const key of keys) {
				if (entry.content.value.includes(`{{${key}}}`)) {
					entry.content.value = entry.content.value.replaceAll(
						`{{${key}}}`,
						row[key] as any
					);
				}
			}
		}

		canvasData.push(template);
	}

	return canvasData;
}
