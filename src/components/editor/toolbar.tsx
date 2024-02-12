"use client";

import React, { useCallback } from "react";
import { Button } from "../ui/button";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	QrCode,
	Type,
	Underline,
} from "lucide-react";
import { useEditorContext } from "./context";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { TextAlign, TextElement, TextModifiers } from "./utils";
import { Toggle } from "../ui/toggle";

const fontSizes = [6, 7, 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

export default function Toolbar() {
	const { state, actions } = useEditorContext();

	let singleSelectedText: TextElement | undefined = undefined;
	if (state.activeSelection.size === 1 || state.editing) {
		singleSelectedText = state.data.find(
			(el) =>
				el.type === "TEXT" &&
				(el.id === Array.from(state.activeSelection).at(0) ||
					el.id === state.editing)
		) as TextElement;
	}

	/**
	 * Updates a modifier with the given value. If no value is provided
	 * it will not be updated
	 */
	const updateSelectedTextModifier = useCallback(
		<T extends keyof TextModifiers>(modifier: T, value?: TextModifiers[T]) => {
			if (!singleSelectedText || value === undefined) return;
			actions.updateCanvasData({
				id: singleSelectedText.id,
				modifiers: {
					...singleSelectedText.modifiers,
					[modifier]: value,
				},
			});
		},
		[singleSelectedText, actions]
	);

	const isToolbarDisabled = !singleSelectedText;

	return (
		<div
			className="flex items-center p-2 w-full rounded-lg shadow-sm shadow-black gap-4 bg-primary"
			onClick={() => {
				// Dont want to lose focus of text editor when clicking in toolbar
				if (!singleSelectedText) return;
				const textareaRef = document.getElementById(singleSelectedText.id);
				if (!textareaRef) return;
				textareaRef.focus();
			}}
		>
			<Button
				className="p-1 aspect-square"
				variant="secondary"
				onClick={() => actions.addElement("TEXT")}
			>
				<Type size={16} />
			</Button>
			<Button
				className="p-1 aspect-square"
				variant="secondary"
				onClick={() => actions.addElement("QR_CODE")}
			>
				<QrCode size={16} />
			</Button>
			<Select
				disabled={isToolbarDisabled}
				value={singleSelectedText?.modifiers.fontSize.toString()}
				onValueChange={(size) => {
					updateSelectedTextModifier("fontSize", Number(size));
				}}
			>
				<SelectTrigger className="w-16">
					<SelectValue placeholder="12" />
				</SelectTrigger>
				<SelectContent>
					{fontSizes.map((size) => (
						<SelectItem key={size} value={size.toString()}>
							{size}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<div className="flex items-center gap-0 bg-secondary rounded-lg">
				<Toggle
					className="p-1 aspect-square rounded-r-none hover:bg-muted data-[state=on]:text-merck"
					aria-label="Toggle bold"
					disabled={isToolbarDisabled}
					pressed={
						singleSelectedText &&
						singleSelectedText.modifiers.fontStyle.includes("bold")
					}
					onPressedChange={(pressed) => {
						if (!singleSelectedText) return;

						const fontStyleSet = new Set(
							singleSelectedText.modifiers.fontStyle.split(" ")
						);

						if (pressed) {
							fontStyleSet.delete("normal");
							fontStyleSet.add("bold");
						} else {
							fontStyleSet.delete("bold");
							if (fontStyleSet.size === 0) fontStyleSet.add("normal");
						}

						updateSelectedTextModifier(
							"fontStyle",
							Array.from(fontStyleSet).join(" ")
						);
					}}
				>
					<Bold size={16} />
				</Toggle>
				<Toggle
					className="p-1 aspect-square rounded-none data-[state=on]:text-merck"
					aria-label="Toggle italic"
					disabled={isToolbarDisabled}
					pressed={
						singleSelectedText &&
						singleSelectedText.modifiers.fontStyle.includes("italic")
					}
					onPressedChange={(pressed) => {
						if (!singleSelectedText) return;

						const fontStyleSet = new Set(
							singleSelectedText.modifiers.fontStyle.split(" ")
						);

						if (pressed) {
							fontStyleSet.delete("normal");
							fontStyleSet.add("italic");
						} else {
							fontStyleSet.delete("italic");
							if (fontStyleSet.size === 0) fontStyleSet.add("normal");
						}

						updateSelectedTextModifier(
							"fontStyle",
							Array.from(fontStyleSet).join(" ")
						);
					}}
				>
					<Italic size={16} />
				</Toggle>
				<Toggle
					className="p-1 aspect-square rounded-l-none data-[state=on]:text-merck"
					aria-label="Toggle underline"
					disabled={isToolbarDisabled}
					pressed={
						singleSelectedText &&
						singleSelectedText.modifiers.textDecoration === "underline"
					}
					onPressedChange={(pressed) => {
						if (pressed)
							updateSelectedTextModifier("textDecoration", "underline");
						else updateSelectedTextModifier("textDecoration", "");
					}}
				>
					<Underline size={16} />
				</Toggle>
			</div>
			<ToggleGroup
				type="single"
				disabled={isToolbarDisabled}
				className="flex rounded-lg gap-0 bg-secondary"
				value={singleSelectedText && singleSelectedText.modifiers.align}
				onValueChange={(value) =>
					updateSelectedTextModifier("align", value as TextAlign)
				}
			>
				<ToggleGroupItem
					className="p-1 aspect-square rounded-r-none hover:bg-muted"
					value="left"
					aria-label="Align text left"
				>
					<AlignLeft size={16} />
				</ToggleGroupItem>
				<ToggleGroupItem
					className="p-1 aspect-square rounded-none"
					value="center"
					aria-label="Align text center"
				>
					<AlignCenter size={16} />
				</ToggleGroupItem>
				<ToggleGroupItem
					className="p-1 aspect-square rounded-l-none"
					value="right"
					aria-label="Align text right"
				>
					<AlignRight size={16} />
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}
