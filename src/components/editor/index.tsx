"use client";

/**
 * This editor is taken from the following code sandbox
 * https://codesandbox.io/p/sandbox/react-canvas-editor-1qrj5?file=%2Fsrc%2FCanvasContainer.tsx%3A130%2C31
 */

import React, { useCallback, useRef, useState } from "react";
import CanvasComponent from "./canvas-component";
import Toolbar from "./toolbar";

export const CanvasContext = React.createContext<ICanvasContext>({});

export interface ICanvasData {
	component?: string;
	id?: string;
	position?: { top: number; left: number };
	dimension?: { width: string; height: string };
	content?: string;
	type: string;
}

export interface ICanvasComponent {
	position?: { top: number; left: number };
	dimension?: { width: string; height: string };
	content?: string;
	id?: string;
	type: string;
	isReadOnly?: boolean;
}

export interface ICanvasContext {
	state?: {
		canvasData: ICanvasData[];
		activeSelection: Set<string>;
		enableQuillToolbar: boolean;
	};
	actions?: {
		setCanvasData: React.Dispatch<React.SetStateAction<ICanvasData[]>>;
		setActiveSelection: React.Dispatch<React.SetStateAction<Set<string>>>;
		updateCanvasData: (data: Partial<ICanvasComponent>) => void;
		addElement: (type: string) => void;
		setEnableQuillToolbar: (state: boolean) => void;
	};
}

const getInitialData = (data: any[], type: string = "TEXT") => {
	return {
		type: type,
		id: `${type}__${Date.now()}__${data.length}`,
		position: {
			top: 100,
			left: 100,
		},
		dimension: {
			width: "150",
			height: type === "TEXT" ? "50" : "150",
		},
		content: type === "TEXT" ? "Sample Text" : "",
	};
};

interface LabelEditorProps {
	width: React.CSSProperties["width"];
	height: React.CSSProperties["height"];
}

function LabelEditor({
	width,
	height,
	...props
}: LabelEditorProps & React.ComponentPropsWithoutRef<"div">) {
	const [canvasData, setCanvasData] = useState<ICanvasData[]>([]);
	const [activeSelection, setActiveSelection] = useState<Set<string>>(
		new Set()
	);
	const [enableQuillToolbar, setEnableQuillToolbar] = useState<boolean>(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const isSelectAll = useRef<boolean>(false);

	const updateCanvasData = (data: Partial<ICanvasComponent>) => {
		const currentDataIndex =
			canvasData.findIndex((canvas) => canvas.id === data.id) ?? -1;
		const updatedData = { ...canvasData?.[currentDataIndex], ...data };
		canvasData.splice(currentDataIndex, 1, updatedData);
		setCanvasData([...(canvasData || [])]);
	};

	const addElement = (type: string) => {
		const defaultData = getInitialData(canvasData, type);
		setCanvasData((data) => [
			...data,
			{ ...defaultData, type: type ?? "TEXT" },
		]);
		activeSelection.clear();
		activeSelection.add(defaultData.id);
		setActiveSelection(new Set(activeSelection));
	};

	const deleteSelectedElements = useCallback(() => {
		setCanvasData([
			...canvasData.filter((data) => {
				if (data.id && activeSelection.has(data.id)) {
					activeSelection.delete(data.id);
					return false;
				}
				return true;
			}),
		]);
		setActiveSelection(new Set(activeSelection));
	}, [activeSelection, canvasData]);

	const selectAllElements = useCallback(() => {
		isSelectAll.current = true;
		for (const data of canvasData) activeSelection.add(data.id || "");
		setActiveSelection(new Set(activeSelection));
	}, [activeSelection, canvasData]);

	const context: ICanvasContext = {
		actions: {
			setCanvasData,
			setActiveSelection,
			updateCanvasData,
			addElement,
			setEnableQuillToolbar,
		},
		state: {
			canvasData,
			activeSelection,
			enableQuillToolbar,
		},
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Delete") {
				deleteSelectedElements();
			} else if (["a", "A"].includes(event.key) && event.ctrlKey) {
				event.preventDefault();
				selectAllElements();
			}
		},
		[deleteSelectedElements, selectAllElements]
	);

	const outSideClickHandler = () => {
		isSelectAll.current = false;
		setActiveSelection(new Set());
	};

	const handleMouseDown = useCallback((event: any) => {
		if (!isSelectAll.current) {
			return;
		}

		outSideClickHandler();
		isSelectAll.current = false;
	}, []);

	React.useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleMouseDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleMouseDown);
		};
	}, [handleKeyDown, handleMouseDown]);

	return (
		<div ref={containerRef} {...props}>
			<CanvasContext.Provider value={context}>
				<Toolbar isEditEnable={enableQuillToolbar} />
				<div
					className="relative shadow-border shadow-lg bg-white"
					style={{ width, height }}
				>
					{canvasData.map((data, idx) => {
						return <CanvasComponent key={idx} {...data} />;
					})}
				</div>
			</CanvasContext.Provider>
		</div>
	);
}

export default LabelEditor;
