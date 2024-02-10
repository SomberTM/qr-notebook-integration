import { Html } from "react-konva-utils";
import { type QrElement } from "../utils";
// import QRCode from "react-qr-code";
import QRCode from "qrcode";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Transformer } from "react-konva";
import { useEditorContext } from "../context";
import { Input } from "@/components/ui/input";

const QR_INPUT_EXTRA_WIDTH = 25;
const QR_INPUT_OFFSET_BOTTOM = 10;

export function QrElement(props: QrElement) {
	const { state, actions } = useEditorContext();

	const [image, setImage] = useState(new window.Image());

	const isSelected = state.activeSelection.has(props.id);

	const imageRef = useRef<React.ComponentRef<typeof Image>>(null);
	const transformRef = useRef<React.ComponentRef<typeof Transformer>>(null);

	useEffect(() => {
		if (isSelected && transformRef.current && imageRef.current) {
			const layer = transformRef.current.getLayer();
			if (!layer) return;
			// we need to attach transformer manually
			transformRef.current.nodes([imageRef.current]);
			layer.batchDraw();
		}
	}, [isSelected]);

	const updateQrCode = useCallback((content: string) => {
		(async function () {
			let input = content;
			if (input === "") input = "Sample contents";

			const url = await QRCode.toDataURL(input);
			const newImage = new window.Image();
			newImage.src = url;
			setImage(newImage);
		})();
	}, []);

	useEffect(() => {
		updateQrCode(props.content.value);
	}, [props.content, updateQrCode]);

	return (
		<React.Fragment>
			{/* eslint-disable-next-line jsx-a11y/alt-text */}
			<Image
				image={image}
				ref={imageRef}
				x={props.position.left}
				y={props.position.top}
				{...props.dimension}
				draggable
				onMouseDown={() => {
					actions.setEditing(undefined);
					actions.setActiveSelection(new Set([props.id]));
				}}
				onDragMove={(event) => {
					actions.updateCanvasData({
						id: props.id,
						position: { left: event.target.x(), top: event.target.y() },
					});
				}}
				onTransform={(e) => {
					const node = imageRef.current;
					if (!node) return;

					const scaleX = node.scaleX();
					const scaleY = node.scaleY();

					// we will reset it back
					node.scaleX(1);
					node.scaleY(1);
					actions.updateCanvasData({
						id: props.id,
						position: {
							left: node.x(),
							top: node.y(),
						},
						dimension: {
							width: Math.max(75, node.width() * scaleX),
							height: Math.max(75, node.height() * scaleY),
						},
					});
				}}
			/>

			{state.activeSelection.has(props.id) && (
				<React.Fragment>
					<Html>
						<Input
							className="absolute text-xs p-1 py-0"
							style={{
								left: `${props.position.left - QR_INPUT_EXTRA_WIDTH / 2}px`,
								top: `${
									props.position.top +
									props.dimension.height +
									QR_INPUT_OFFSET_BOTTOM
								}px`,
								width: `${props.dimension.width + QR_INPUT_EXTRA_WIDTH}px`,
							}}
							placeholder="Enter qr contents..."
							value={props.content.value}
							onChange={(event) =>
								actions.updateCanvasData({
									id: props.id,
									content: {
										...props.content,
										value: event.target.value,
									},
								})
							}
							onClick={() => actions.setEditing(props.id)}
							onBlur={() => actions.setEditing(undefined)}
						/>
					</Html>
					<Transformer
						ref={transformRef}
						anchorSize={8}
						rotateAnchorOffset={24}
						enabledAnchors={[
							"top-left",
							"top-right",
							"bottom-left",
							"bottom-right",
						]}
						flipEnabled={false}
						rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
						boundBoxFunc={(oldBox, newBox) => {
							// limit resize
							if (Math.abs(newBox.width) < 75 || Math.abs(newBox.height) < 75) {
								return oldBox;
							}
							return newBox;
						}}
					/>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}
