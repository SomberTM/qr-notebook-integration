import React from "react";
import { CanvasElement, ElementOf, ElementType } from "../utils";
import TextElement from "./text";

export function getComponent<E extends ElementType>(
	type: E
): React.ComponentType<ElementOf<E>> {
	if (type === "TEXT") return TextElement as React.ComponentType<ElementOf<E>>;

	return (props: CanvasElement) => null;
}
