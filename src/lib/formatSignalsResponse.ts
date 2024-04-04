import { normalizeColumnName } from "./utils";

type SignalsDataType = "text" | "datetime" | "unit";

interface SignalsBasicData {
	type: string;
	id: string;
}

export interface SignalsNameCell {
	type: "text";
	content: { value: string };
}

export interface SignalsDateTimeCell {
	type: "datetime";
	content: { value: string };
}

export interface SignalsUnitCell {
	type: "unit";
	content: { display: string; value: number };
}

interface SignalsCellBase {
	key: string;
	name: string;
	type: SignalsDataType;
}

export type SignalsCell = SignalsCellBase &
	(SignalsNameCell | SignalsDateTimeCell | SignalsUnitCell);

interface SignalsLinks {
	self: string;
}

export interface SignalsRow {
	type: string;
	id: string;
	links: SignalsLinks;
	attributes: {
		id: string;
		type: string;
		cells: SignalsCell[];
	};
	relationships: {
		entity: {
			links: SignalsLinks;
			data: SignalsBasicData;
		};
		columnDefinitions: {
			data: SignalsBasicData;
		};
	};
}

interface SignalsColumnDefinitionBase {
	key: string;
	title: string;
	type: SignalsDataType;
	hidden?: boolean;
	saved?: boolean;
	created?: boolean;
	isUserColumn?: boolean;
}

interface SignalsTextColumnDefinition {
	type: "text";
	options?: string[];
}

interface SignalsDateTimeColumnDefinition {
	type: "datetime";
}

interface SignalsUnitColumnDefinition {
	type: "datetime";
	measure: string;
	defaultUnit: string;
}

type SignalsColumnDefinition = SignalsColumnDefinitionBase &
	(
		| SignalsTextColumnDefinition
		| SignalsDateTimeColumnDefinition
		| SignalsUnitColumnDefinition
	);

interface SignalsIncludedColumnDefinitions {
	type: "columnDefinitions";
	id: string;
	attributes: {
		id: string;
		type: "columnDefinitions";
		templateId: string;
		columns: SignalsColumnDefinition[];
	};
}

interface SignalsIncludedEntity {
	type: "entitiy";
	id: string;
	links: SignalsLinks;
	attributes: {
		type: "grid";
		eid: string;
		name: string;
		digest: string;
		fields: {
			Description: {
				value: string;
			};
			Name: {
				value: string;
			};
		};
	};
}

type SignalsIncluded = SignalsIncludedEntity | SignalsIncludedColumnDefinitions;

export interface SignalsResponse {
	links: SignalsLinks;
	data: SignalsRow[];
	included: SignalsIncluded[];
}

export type FormattedSignalsResponse<T = unknown> = Record<string, T>[];

function getFormattedCellValue(cell: SignalsCell) {
	if (cell.type === "unit") return cell.content.display;
	if (cell.type === "datetime")
		return new Date(cell.content.value).toLocaleDateString();

	return cell.content.value;
}

/**
 * Formats the response we get from signals to something easier to
 * interpret and work with
 * @param response
 * @returns
 */
export function formatSignalsResponse(
	response: SignalsResponse
): FormattedSignalsResponse {
	const output: FormattedSignalsResponse = [];

	for (const row of response.data) {
		const normalizedRow: Record<string, unknown> = {};
		for (const cell of row.attributes.cells)
			normalizedRow[normalizeColumnName(cell.name)] =
				getFormattedCellValue(cell);

		output.push(normalizedRow);
	}

	return output;
}
