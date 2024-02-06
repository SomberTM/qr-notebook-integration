"use client";

/**
 * This editor is taken from the following code sandbox
 * https://codesandbox.io/p/sandbox/react-canvas-editor-1qrj5?file=%2Fsrc%2FCanvasContainer.tsx%3A130%2C31
 */

import React, { useRef, useState } from "react";
import Toolbar from "./toolbar";

import { Stage, Layer } from "react-konva";
import { CanvasElement, ElementType, getInitialData } from "./utils";
import { CanvasContext } from "./context";
import { getComponent } from "./elements";
import { Html } from "react-konva-utils";

interface LabelEditorProps {
	width: number;
	length: number;
	data: CanvasElement[];
	onDataChange: (data: CanvasElement[]) => void;
}

function LabelEditor({
	width,
	length,
	data,
	onDataChange,
	...props
}: LabelEditorProps & React.ComponentPropsWithoutRef<"div">) {
	const [activeSelection, setActiveSelection] = useState<Set<string>>(
		new Set()
	);

	const containerRef = useRef<HTMLDivElement>(null);

	const [isToolbarHovered, setIsToolbarHovered] = useState(false);

	const updateCanvasData = (updatingData: Partial<CanvasElement>) => {
		const currentDataIndex =
			data.findIndex((canvas) => canvas.id === updatingData.id) ?? -1;
		const updatedData = { ...data?.[currentDataIndex], ...updatingData };
		data.splice(currentDataIndex, 1, updatedData as CanvasElement);

		const newData = [...(data || [])];

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
			setIsToolbarHovered,
			setActiveSelection,
			updateCanvasData,
			addElement,
		},
		state: {
			isToolbarHovered,
			data,
			activeSelection,
		},
	};

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
						{data.map((data, idx) => {
							const Component = getComponent(data.type);
							return (
								<>
									<Component key={data.id} {...data} />
									{activeSelection.has(data.id) && (
										<Html key={data.id + "-border"}>
											<div
												className="absolute content-none border pointer-events-none -m-1 border-black -z-10"
												style={{ ...data.position, ...data.dimension }}
											></div>
										</Html>
									)}
								</>
							);
						})}
					</Layer>
				</Stage>
			</CanvasContext.Provider>
		</div>
	);
}

export default LabelEditor;
