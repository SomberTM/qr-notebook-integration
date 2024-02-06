import React, { useContext, createContext } from "react";
import { CanvasElement, ElementType } from "./utils";

export const CanvasContext = createContext<CanvasContext | null>(null);
export function useEditorContext() {
	const context = useContext(CanvasContext);
	if (!context) throw new Error("Bad");
	return context;
}

export interface CanvasContext {
	state: {
		data: CanvasElement[];
		activeSelection: Set<string>;
		isToolbarHovered: boolean;
	};
	actions: {
		setIsToolbarHovered: React.Dispatch<React.SetStateAction<boolean>>;
		setActiveSelection: React.Dispatch<React.SetStateAction<Set<string>>>;
		updateCanvasData: (data: Partial<CanvasElement>) => void;
		addElement: (type: ElementType) => void;
	};
}
