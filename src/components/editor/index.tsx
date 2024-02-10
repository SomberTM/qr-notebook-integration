"use client";

/**
 * This editor is taken from the following code sandbox
 * https://codesandbox.io/p/sandbox/react-canvas-editor-1qrj5?file=%2Fsrc%2FCanvasContainer.tsx%3A130%2C31
 */

import React, { useRef, useState } from "react";
import Toolbar from "./toolbar";

import Konva from "konva";
import { CanvasElement, ElementType, getInitialData } from "./utils";
import { CanvasContext } from "./context";
import { Canvas } from "./canvas";

interface LabelEditorProps {
	data: CanvasElement[];
	onDataChange: (data: CanvasElement[]) => void;
}

function LabelEditor({
	data,
	onDataChange,
	children,
	...props
}: React.PropsWithChildren<
	LabelEditorProps & React.ComponentPropsWithoutRef<"div">
>) {
	const [activeSelection, setActiveSelection] = useState<Set<string>>(
		new Set()
	);
	const [editing, setEditing] = useState<string | undefined>();

	const updateCanvasData = (updatingData: Partial<CanvasElement>) => {
		const currentDataIndex =
			data.findIndex((canvas) => canvas.id === updatingData.id) ?? -1;
		const updatedData = { ...data?.[currentDataIndex], ...updatingData };
		data.splice(currentDataIndex, 1, updatedData as CanvasElement);

		const newData = [...(data || [])];

		onDataChange(newData);
	};

	const deleteElement = (id: string) => {
		const newData = [...data.filter((element) => element.id !== id)];
		onDataChange(newData);
	};

	const addElement = (type: ElementType) => {
		const defaultData = getInitialData(data, type);
		onDataChange([...data, defaultData]);
		activeSelection.clear();
		activeSelection.add(defaultData.id);
		setActiveSelection(new Set(activeSelection));
	};

	const context: CanvasContext = {
		actions: {
			setActiveSelection,
			updateCanvasData,
			addElement,
			deleteElement,
			setEditing,
		},
		state: {
			editing,
			data,
			activeSelection,
		},
	};

	return (
		<div className="flex flex-col gap-2" {...props}>
			<CanvasContext.Provider value={context}>
				{children}
			</CanvasContext.Provider>
		</div>
	);
}

LabelEditor.Toolbar = Toolbar;
LabelEditor.Canvas = Canvas;
export default LabelEditor;
