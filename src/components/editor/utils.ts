export type ElementType = "TEXT" | "QR_CODE";

interface Content {
	placeholder: string;
	value: string;
}

interface CanvasElementBase<E extends ElementType> {
	position: { top: number; left: number };
	dimension: { width: number; height: number };
	id: string;
	content: Content;
	type: E;
}

export interface TextModifiers {
	fontFamily: string;
	fontSize: number;
	fontStyle: string;
	textDecoration: string;
	align: "left" | "center" | "right";
}

export interface TextElement extends CanvasElementBase<"TEXT"> {
	modifiers: TextModifiers;
}

export interface QrElement extends CanvasElementBase<"QR_CODE"> {}

export type CanvasElement = TextElement | QrElement;

export type ElementOf<T extends ElementType> = {
	TEXT: TextElement;
	QR_CODE: QrElement;
}[T];

function getInitialTextModifiers(): TextModifiers {
	return {
		fontFamily: "Arial",
		fontSize: 12,
		fontStyle: "normal",
		textDecoration: "",
		align: "left",
	};
}

function getInitialContent(elementType: ElementType): Content {
	if (elementType === "TEXT")
		return { placeholder: "Double click to edit...", value: "" };

	// if (elementType === "QR_CODE") return { placeholder: "", value: "" };

	return { placeholder: "", value: "" };
}

export function getInitialData<E extends ElementType>(
	data: any[],
	elementType: E
): ElementOf<E> {
	if (elementType === "TEXT") {
		return {
			type: elementType,
			id: `${elementType}__${Date.now()}__${data.length}`,
			position: {
				top: 100,
				left: 100,
			},
			dimension: {
				width: 150,
				height: 50,
			},
			content: getInitialContent(elementType),
			modifiers: getInitialTextModifiers(),
		} as ElementOf<E>;
	}

	return {
		type: elementType,
		id: `${elementType}__${Date.now()}__${data.length}`,
		position: {
			top: 100,
			left: 100,
		},
		dimension: {
			width: 150,
			height: 50,
		},
		content: getInitialContent(elementType),
	} as ElementOf<E>;
}
