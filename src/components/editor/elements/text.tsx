"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "react-konva";
import { Html } from "react-konva-utils";
import { type TextElement } from "../utils";
import { useEditorContext } from "../context";

const TextElement = (props: TextElement) => {
	const { content, position, dimension, modifiers, id } = props;
	const { state, actions } = useEditorContext();
	const [isEditing, setIsEditing] = useState(false);

	const textareaRef = useRef<React.ComponentRef<typeof Textarea>>(null);

	const addSelfToActiveSelection = useCallback(() => {
		if (state.activeSelection.has(id)) return;
		actions.setActiveSelection((previous) => {
			previous.add(id);
			return new Set(previous);
		});
	}, [id, state.activeSelection, actions]);

	const removeSelfFromActiveSelection = useCallback(() => {
		if (!state.activeSelection.has(id)) return;
		actions.setActiveSelection((previous) => {
			previous.delete(id);
			return new Set(previous);
		});
	}, [id, state.activeSelection, actions]);

	useEffect(() => {
		if (!isEditing || !textareaRef.current) return;
		textareaRef.current.focus();
	}, [state, isEditing, id]);

	if (isEditing)
		return (
			<Html>
				<Textarea
					ref={textareaRef}
					// negative margin helps align visual text vs editing text better

					className="absolute p-0 rounded-none border-none outline-none -mt-1 resize-none"
					style={{
						left: `${position.left}px`,
						top: `${position.top}px`,
						width: `${dimension.width}px`,
						height: `${dimension.height}px`,
						...modifiers,
					}}
					onBlur={(event) => {
						if (state.isToolbarHovered) {
							event.preventDefault();
							event.stopPropagation();
							return;
						}

						setIsEditing(false);
					}}
					value={content.value}
					onChange={(event) =>
						actions.updateCanvasData({
							id,
							content: { ...content, value: event.target.value },
						})
					}
				/>
			</Html>
		);

	return (
		<Text
			text={content.value === "" ? content.placeholder : content.value}
			x={position.left}
			y={position.top}
			width={dimension.width}
			height={dimension.height}
			onMouseOver={() => {
				addSelfToActiveSelection();
			}}
			onMouseOut={() => {
				console.log("leave");
				removeSelfFromActiveSelection();
			}}
			draggable
			onClick={() => {
				if (isEditing) return;
				addSelfToActiveSelection();
			}}
			onDragMove={(event) => {
				actions.updateCanvasData({
					id,
					position: { left: event.target.x(), top: event.target.y() },
				});
			}}
			onDblClick={() => {
				setIsEditing(true);
				actions.setActiveSelection(new Set());
			}}
		/>
	);
};

export default TextElement;
