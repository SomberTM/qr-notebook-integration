"use client";

import { Printer } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Input } from "../ui/input";

// Converting label size to pixels
// different printers have different DPI (dots per inch)
// we ask for this value when a user creates a printer.
// Get width and length of label in inches from user.
// multiply by values by selected printers dpi and
// henceforth 1px = 1dot

// may also want to introduce some sort of ui scaling feature
// since smaller labels will appear very tiny

interface LabelEditorSidebarProps {
	printers: Printer[];
}

export function LabelEditorSidebar(props: LabelEditorSidebarProps) {
	const [printer, setPrinter] = useState<Printer | undefined>(undefined);
	const [width, setWidth] = useState<number | undefined>(undefined);
	const [height, setHeight] = useState<number | undefined>(undefined);

	return (
		<div className="flex flex-col gap-8">
			<h1 className="text-xl border-b">Label Editor</h1>
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-4 gap-x-2 items-center">
					<Select
						onValueChange={(value) =>
							setPrinter(props.printers.find((printer) => printer.id === value))
						}
					>
						<SelectTrigger className="col-start-1 col-end-4">
							<SelectValue placeholder="Select a printer" />
						</SelectTrigger>
						<SelectContent>
							{props.printers.map((printer) => (
								<SelectItem key={printer.id} value={printer.id}>
									{printer.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{printer && (
						<span className="col-start-4 col-end-5 text-xs justify-self-end">
							{printer.dpi} DPI
						</span>
					)}
				</div>
				<div className="grid grid-cols-2 items-center">
					<Input
						type="number"
						value={width}
						onChange={(event) => {
							const value = event.target.valueAsNumber;
							setWidth(isNaN(value) ? undefined : value);
						}}
						placeholder="Width (in)"
						className="col-span-1"
					/>
					{printer && width && (
						<span className="col-span-1 text-xs justify-self-end">
							{width * printer.dpi}px
						</span>
					)}
				</div>
				<div className="grid grid-cols-2 items-center">
					<Input
						type="number"
						value={height}
						onChange={(event) => {
							const value = event.target.valueAsNumber;
							setHeight(isNaN(value) ? undefined : value);
						}}
						placeholder="Height (in)"
						className="col-span-1 appearance-none"
					/>
					{printer && height && (
						<span className="col-span-1 text-xs justify-self-end">
							{height * printer.dpi}px
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
