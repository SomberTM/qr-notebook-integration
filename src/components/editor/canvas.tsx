import { Stage, Layer } from "react-konva";
import { getComponent } from "./elements";
import { useEditorContext } from "./context";
import Konva from "konva";

interface CanvasProps {
	width: number;
	length: number;
}

export function Canvas({ width, length }: CanvasProps) {
	const { state, actions } = useEditorContext();

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
			width={length}
			height={width}
			onMouseDown={checkDeselectAll}
			onTouchStart={checkDeselectAll}
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
