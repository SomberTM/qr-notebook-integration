import React from "react";
import { CanvasElement, ElementOf, ElementType } from "../utils";
import TextElement from "./text";
import { QrElement } from "./qr-code";

export function getComponent<E extends ElementType>(
	type: E
): React.ComponentType<ElementOf<E>> {
	if (type === "TEXT") return TextElement as React.ComponentType<ElementOf<E>>;
	else if (type === "QR_CODE")
		return QrElement as React.ComponentType<ElementOf<E>>;

	return (props: CanvasElement) => null;
}
