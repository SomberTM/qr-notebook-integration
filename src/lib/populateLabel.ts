import { CanvasElement } from "@/components/editor/utils";
import { FormattedSignalsResponse } from "@/db/actions/signals";
import { Label } from "@/db/schema";

export function populateLabels(
	labelData: Label["data"],
	data: FormattedSignalsResponse
): CanvasElement[][] {
	let canvasData: CanvasElement[][] = [];

	for (const row of data) {
		// deep clone required
		const template = JSON.parse(JSON.stringify(labelData)) as CanvasElement[];
		const output: CanvasElement[] = [];

		for (const entity of template) {
			if (entity.type !== "TEXT") {
				output.push(entity);
				continue;
			}

			const copiedEntity = { ...entity };
			const keys = Object.keys(row);

			for (const key of keys) {
				if (copiedEntity.content.value.includes(`{{${key}}}`)) {
					console.log(`Found match for ${key}`);
					copiedEntity.content.value = copiedEntity.content.value.replaceAll(
						`{{${key}}}`,
						row[key] as any
					);
				}
			}

			output.push(copiedEntity);
		}

		canvasData.push(output);
	}

	return canvasData;
}
