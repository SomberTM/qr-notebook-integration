"use client";

/**
 * This editor is taken from the following code sandbox
 * https://codesandbox.io/p/sandbox/react-canvas-editor-1qrj5?file=%2Fsrc%2FCanvasContainer.tsx%3A130%2C31
 */

import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import Toolbar from "./toolbar";

import { Stage, Layer, Arrow } from "react-konva";
import { CanvasElement, ElementType, getInitialData } from "./utils";
import { CanvasContext } from "./context";
import { getComponent } from "./elements";

interface LabelEditorProps {
	width: number;
	length: number;
	onDataChange?: (data: CanvasElement[]) => void;
}

function LabelEditor({
	width,
	length,
	onDataChange,
	...props
}: LabelEditorProps & React.ComponentPropsWithoutRef<"div">) {
	const [canvasData, setCanvasData] = useState<CanvasElement[]>([]);
	const [activeSelection, setActiveSelection] = useState<Set<string>>(
		new Set()
	);

	useEffect(() => {
		onDataChange?.(canvasData);
	}, [onDataChange, canvasData]);

	const containerRef = useRef<HTMLDivElement>(null);
	const isSelectAll = useRef<boolean>(false);

	const [isToolbarHovered, setIsToolbarHovered] = useState(false);

	const updateCanvasData = (data: Partial<CanvasElement>) => {
		setCanvasData((previousData) => {
			const currentDataIndex =
				previousData.findIndex((canvas) => canvas.id === data.id) ?? -1;
			const updatedData = { ...previousData?.[currentDataIndex], ...data };
			previousData.splice(currentDataIndex, 1, updatedData as CanvasElement);

			const newData = [...(previousData || [])];
			return newData;
		});
	};

	const addElement = (type: ElementType) => {
		const defaultData = getInitialData(canvasData, type);
		setCanvasData((data) => [...data, defaultData]);
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

	const context: CanvasContext = {
		actions: {
			setIsToolbarHovered,
			setCanvasData,
			setActiveSelection,
			updateCanvasData,
			addElement,
		},
		state: {
			isToolbarHovered,
			canvasData,
			activeSelection,
		},
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// if (event.key === "Delete") {
			// 	deleteSelectedElements();
			// } else
			if (["a", "A"].includes(event.key) && event.ctrlKey) {
				event.preventDefault();
				selectAllElements();
			}
		},
		[/*deleteSelectedElements,*/ selectAllElements]
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
		<div className="flex flex-col gap-2" ref={containerRef} {...props}>
			<CanvasContext.Provider value={context}>
				<Toolbar />
				<Stage
					className="relative shadow-border shadow-xl bg-white"
					width={length}
					height={width}
				>
					<Layer>
						{canvasData.map((data, idx) => {
							const Component = getComponent(data.type);
							return <Component key={idx} {...data} />;
						})}
					</Layer>
				</Stage>
			</CanvasContext.Provider>
		</div>
	);
}

export default LabelEditor;
