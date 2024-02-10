"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { type TextElement } from "../utils";
import { useEditorContext } from "../context";

const TextElement = (props: TextElement) => {
	const { content, position, dimension, modifiers, id } = props;
	const { state, actions } = useEditorContext();

	const textareaRef = useRef<React.ComponentRef<typeof Textarea>>(null);

	const textRef = useRef<React.ComponentRef<typeof Text>>(null);
	const transformRef = useRef<React.ComponentRef<typeof Transformer>>(null);

	const isSelected = state.activeSelection.has(id);
	const isEditing = state.editing === id;

	useEffect(() => {
		if (isSelected && transformRef.current && textRef.current) {
			const layer = transformRef.current.getLayer();
			if (!layer) return;
			// we need to attach transformer manually
			transformRef.current.nodes([textRef.current]);
			layer.batchDraw();
		}
	}, [isSelected]);

	useEffect(() => {
		if (!isEditing || !textareaRef.current) return;
		// focus end of text
		textareaRef.current.focus();
		textareaRef.current.setSelectionRange(-1, -1);
	}, [isEditing, id]);

	if (isEditing)
		return (
			<Html>
				<Textarea
					ref={textareaRef}
					id={id}
					className="absolute z-10 ring-1 p-0 ring-offset-2 underline-offset-2 decoration-4 decoration-zinc-500 ring-blue-400 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-none border-none resize-none min-h-0"
					spellCheck="false"
					style={{
						left: `${position.left}px`,
						top: `${position.top}px`,
						width: `${dimension.width}px`,
						height: `${dimension.height}px`,
						...modifiers,
						fontWeight: modifiers.fontStyle.includes("bold")
							? "bold"
							: "normal",
						fontStyle: modifiers.fontStyle.includes("italic")
							? "italic"
							: "normal",
						textAlign: modifiers.align,
						lineHeight: `${modifiers.fontSize}px`,
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
		<React.Fragment>
			<Text
				draggable
				ref={textRef}
				text={content.value === "" ? "Double click to edit..." : content.value}
				x={position.left}
				y={position.top}
				{...modifiers}
				{...dimension}
				onMouseDown={() => {
					if (state.editing && !isEditing) actions.setEditing(undefined);

					actions.setActiveSelection(new Set([id]));
				}}
				onDragEnd={(event) => {
					actions.updateCanvasData({
						id,
						position: { left: event.target.x(), top: event.target.y() },
					});
				}}
				onDblClick={() => {
					actions.setEditing(id);
					actions.setActiveSelection(new Set());
				}}
				onTransform={(e) => {
					const node = textRef.current;
					if (!node) return;

					const scaleX = node.scaleX();
					const scaleY = node.scaleY();

					// we will reset it back
					node.scaleX(1);
					node.scaleY(1);
					actions.updateCanvasData({
						id,
						position: {
							left: node.x(),
							top: node.y(),
						},
						dimension: {
							width: Math.max(25, node.width() * scaleX),
							height: Math.max(25, node.height() * scaleY),
						},
					});
				}}
			/>
			{state.activeSelection.has(id) && (
				<Transformer
					ref={transformRef}
					anchorSize={8}
					rotateAnchorOffset={24}
					flipEnabled={false}
					rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
					boundBoxFunc={(oldBox, newBox) => {
						// limit resize
						if (Math.abs(newBox.width) < 25 || Math.abs(newBox.height) < 25) {
							return oldBox;
						}
						return newBox;
					}}
				/>
			)}
		</React.Fragment>
	);
};

export default TextElement;
