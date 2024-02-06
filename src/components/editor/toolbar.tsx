"use client";

import React from "react";
import { Button } from "../ui/button";
import { Bold, Italic, Type, Underline } from "lucide-react";
import { useCanvasContext } from "./context";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function Toolbar() {
	const { state, actions } = useCanvasContext();
	const toolbarDisabled = state.activeSelection.size === 0;

	return (
		<div
			className="flex items-center p-2 rounded-lg shadow-sm shadow-black gap-4 bg-primary"
			onMouseEnter={() => actions.setIsToolbarHovered(true)}
			onMouseLeave={() => actions.setIsToolbarHovered(false)}
		>
			<Button
				className="p-1 aspect-square"
				variant="secondary"
				onClick={() => actions.addElement("TEXT")}
			>
				<Type size={16} />
			</Button>
			<ToggleGroup
				type="multiple"
				disabled={toolbarDisabled}
				className="flex rounded-lg gap-0 bg-secondary"
			>
				<ToggleGroupItem
					className="p-1 aspect-square rounded-r-none hover:bg-muted"
					value="bold"
					aria-label="Toggle bold"
				>
					<Bold size={16} />
				</ToggleGroupItem>
				<ToggleGroupItem
					className="p-1 aspect-square rounded-none"
					value="italic"
					aria-label="Toggle italic"
				>
					<Italic size={16} />
				</ToggleGroupItem>
				<ToggleGroupItem
					className="p-1 aspect-square rounded-l-none"
					value="underline"
					aria-label="Toggle underline"
				>
					<Underline size={16} />
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}
