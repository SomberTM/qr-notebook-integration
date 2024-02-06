"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "react-konva";
import { Html } from "react-konva-utils";
import { TextElement } from "../utils";
import { useCanvasContext } from "../context";

const TextElement = (props: TextElement) => {
	const { content, position, dimension, modifiers, id } = props;
	const { state, actions } = useCanvasContext();

	const textareaRef = useRef<React.ComponentRef<typeof Textarea>>(null);

	useEffect(() => {
		if (!state.activeSelection.has(id) || !textareaRef.current) return;
		textareaRef.current.focus();
	}, [state, id]);

	if (state.activeSelection.has(id))
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

						actions.setActiveSelection((previousSelection) => {
							previousSelection.delete(id);
							return new Set(previousSelection);
						});
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
			draggable
			onDragMove={(event) => {
				actions.updateCanvasData({
					id,
					position: { left: event.target.x(), top: event.target.y() },
				});
			}}
			onDblClick={() => {
				actions.setActiveSelection((previousSelection) => {
					previousSelection.add(id);
					return new Set(previousSelection);
				});
			}}
		/>
	);
};

export default TextElement;
