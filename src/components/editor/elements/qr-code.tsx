import { Html } from "react-konva-utils";
import { type QrElement } from "../utils";
// import QRCode from "react-qr-code";
import QRCode from "qrcode";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Transformer } from "react-konva";
import { useEditorContext } from "../context";
import { Input } from "@/components/ui/input";

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
			/>

			{state.activeSelection.has(props.id) && (
				<React.Fragment>
					<Html>
						<Input
							className="absolute"
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
							style={{
								left: `${props.position.left - 12.5}px`,
								top: `${props.position.top + props.dimension.height + 25}px`,
								width: `${props.dimension.width + 25}px`,
							}}
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
							if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50) {
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
