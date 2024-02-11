import { Stage, Layer, Rect } from "react-konva";
import { getComponent } from "./elements";
import { useEditorContext } from "./context";
import Konva from "konva";
import React, {
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";

interface CanvasProps {
	width: number;
	length: number;
}

export const Canvas = React.forwardRef<Konva.Stage, CanvasProps>(
	function Canvas({ width, length }, ref) {
		const { state, actions } = useEditorContext();
		const stageRef = useRef<Konva.Stage>(null);

		useImperativeHandle(ref, () => stageRef.current!, []);

		const onKeyDown = useCallback(
			(event: KeyboardEvent) => {
				const isEditing = state.editing !== undefined;
				if (
					isEditing ||
					state.activeSelection.size === 0 ||
					(event.key !== "Delete" && event.key !== "Backspace")
				)
					return;

				for (const id of state.activeSelection) actions.deleteElement(id);
			},
			[state.editing, state.activeSelection, actions]
		);

		useEffect(() => {
			if (!stageRef.current) return;
			const container = stageRef.current.container();

			container.addEventListener("keydown", onKeyDown);
			return () => container.removeEventListener("keydown", onKeyDown);
		}, [onKeyDown]);

		function checkDeselectAll(
			event: Konva.KonvaEventObject<MouseEvent | TouchEvent>
		) {
			const clickedOnEmpty = event.target === event.target.getStage();
			if (clickedOnEmpty) {
				actions.setActiveSelection(new Set());
				actions.setEditing(undefined);
			}
		}

		return (
			<Stage
				className="relative shadow-border shadow-xl bg-white"
				tabIndex={1}
				width={length}
				height={width}
				onMouseDown={checkDeselectAll}
				onTouchStart={checkDeselectAll}
				ref={stageRef}
			>
				<Layer>
					{state.data.map((data, idx) => {
						const Component = getComponent(data.type);
						return <Component key={data.id} {...data} />;
					})}
				</Layer>
			</Stage>
		);
	}
);
