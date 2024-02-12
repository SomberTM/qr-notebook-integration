"use client";

import { Label, Printer } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { ChevronLeft, PlusIcon, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from "../ui/dialog";
import { PrinterForm } from "../printer-form";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";

// Converting label size to pixels
// different printers have different DPI (dots per inch)
// we ask for this value when a user creates a printer.
// Get width and length of label in inches from user.
// multiply by values by selected printers dpi and
// henceforth 1px = 1dot

// may also want to introduce some sort of ui scaling feature
// since smaller labels will appear very tiny

function filterLabelsBySize(
	labels: Label[],
	widthIn?: number | string,
	lengthIn?: number | string
): Label[] {
	let width = Number(widthIn);
	let length = Number(lengthIn);
	return labels.filter((label) => {
		if (!width && !length) return true;

		if (width && length && width == label.widthIn && length == label.lengthIn)
			return true;
		if (width && width == label.widthIn) return true;
		if (length && length == label.lengthIn) return true;

		return false;
	});
}

interface LabelEditorSidebarProps {
	printers: Printer[];
	labels: Label[];
	collapsed?: boolean;
	onWidthChange?(widthPx?: number): void;
	onLengthChange?(lengthPx?: number): void;
}

export function LabelEditorSidebar({
	printers,
	labels,
	collapsed,
	onLengthChange,
	onWidthChange,
}: LabelEditorSidebarProps) {
	const form = useFormContext<Partial<Label>>();
	const { id, widthIn, lengthIn, designedForId } = form.watch();

	const getPrinter = useCallback(
		(id: string | null | undefined) =>
			printers.find((printer) => printer.id === id),
		[printers]
	);

	const printer = useMemo(() => {
		return getPrinter(designedForId);
	}, [designedForId, getPrinter]);

	function selectExistingLabel(id?: string) {
		if (!printer) return;
		if (!id) {
			form.reset({
				designedForId: printer.id,
				data: [],
				id: "",
				name: "",
				// @ts-expect-error passing an empty string is the only way to "zero" out the field
				widthIn: "",
				// @ts-expect-error passing an empty string is the only way to "zero" out the field
				lengthIn: "",
			});

			onWidthChange?.(undefined);
			onLengthChange?.(undefined);

			return;
		}

		const label = labels.find((label) => label.id === id);
		if (!label) return;

		form.setValue("name", label.name);
		form.setValue("widthIn", label.widthIn);
		form.setValue("lengthIn", label.lengthIn);
		form.setValue("data", label.data);

		onWidthChange?.(label.widthIn * printer.dpi);
		onLengthChange?.(label.lengthIn * printer.dpi);
	}

	const [isCreatePrinterDialogOpen, setIsCreatePrinterDialogOpen] =
		useState(false);

	if (collapsed) return null;

	return (
		<Dialog
			open={isCreatePrinterDialogOpen}
			onOpenChange={setIsCreatePrinterDialogOpen}
		>
			<div className="flex flex-col gap-8 h-full">
				<Link
					href="/"
					className="text-xl border-b cursor-pointer group relative flex items-center text-black no-underline"
				>
					<span className="group-hover:opacity-100 opacity-0 transition-all duration-300 absolute -left-6">
						<ChevronLeft />
					</span>
					Label Editor
				</Link>
				<div className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="designedForId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Printer</FormLabel>
								<div className="grid grid-cols-5 gap-x-2 items-center">
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="col-start-1 col-end-4">
											<SelectValue placeholder="Select a printer" />
										</SelectTrigger>
										<SelectContent>
											{printers.map((printer) => (
												<SelectItem key={printer.id} value={printer.id}>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger className="w-full">
																{printer.name}
															</TooltipTrigger>
															<TooltipContent>{printer.ip}</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<DialogTrigger asChild className="aspect-square">
										<Button className="p-1 aspect-square">
											<PlusIcon size={16} />
										</Button>
									</DialogTrigger>

									{!!field.value && (
										<span className="text-xs justify-self-end">
											{getPrinter(field.value)!.dpi} DPI
										</span>
									)}
								</div>
								<FormDescription>
									Select a printer so that we can get your label settings just
									right
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				{printer && (
					<div className="flex flex-col gap-2">
						<FormField
							control={form.control}
							name="widthIn"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Label Width (in)</FormLabel>
										<FormControl>
											<div className="grid grid-cols-2 items-center">
												<Input
													placeholder="1.5"
													className="col-span-1"
													{...field}
													onChange={(event) => {
														field.onChange(event);
														const width = Number(event.target.value);
														onWidthChange?.(width * printer.dpi);
													}}
												/>
												{printer && !!field.value && !isNaN(field.value) && (
													<span className="col-span-1 text-xs justify-self-end">
														{(field.value * printer.dpi).toFixed(2)}px
													</span>
												)}
											</div>
										</FormControl>
										<FormDescription>
											Width of the target label in inches
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="lengthIn"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Label Length (in)</FormLabel>
										<FormControl>
											<div className="grid grid-cols-2 items-center">
												<Input
													placeholder="2.0"
													className="col-span-1"
													{...field}
													onChange={(event) => {
														field.onChange(event);
														const length = Number(event.target.value);
														onLengthChange?.(length * printer.dpi);
													}}
												/>
												{printer && !!field.value && !isNaN(field.value) && (
													<span className="col-span-1 text-xs justify-self-end">
														{(field.value * printer.dpi).toFixed(2)}px
													</span>
												)}
											</div>
										</FormControl>
										<FormDescription>
											Length of the target label in inches
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="id"
							render={({ field }) => {
								const filteredLabels = !id
									? filterLabelsBySize(labels, widthIn, lengthIn)
									: labels;

								let placeholder = "Select an existing label";
								if (widthIn || lengthIn)
									placeholder = `${filteredLabels.length} label(s) found with above dimensions`;
								if (filteredLabels.length === 0)
									placeholder = "No labels found";

								return (
									<FormItem>
										<FormLabel>Existing Label</FormLabel>
										<FormControl>
											<div className="flex gap-2">
												<Select
													value={field.value}
													onValueChange={(value) => {
														selectExistingLabel(value);
														field.onChange(value);
													}}
													disabled={filteredLabels.length === 0}
												>
													<SelectTrigger>
														<SelectValue placeholder={placeholder} />
													</SelectTrigger>
													<SelectContent>
														{filteredLabels.map((label) => (
															<SelectItem key={label.id} value={label.id}>
																<TooltipProvider>
																	<Tooltip>
																		<TooltipTrigger>
																			{label.name}
																		</TooltipTrigger>
																		<TooltipContent>
																			Width: {label.widthIn} (in), Length:{" "}
																			{label.lengthIn} (in)
																		</TooltipContent>
																	</Tooltip>
																</TooltipProvider>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<Button
													disabled={!id}
													className="p-1 aspect-square"
													onClick={() => selectExistingLabel(undefined)}
												>
													<X size={16} />
												</Button>
											</div>
										</FormControl>
										<FormDescription>
											Select an existing label. If no label is selected and a
											width or length are provided above, labels will be
											filtered based on those values
										</FormDescription>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Label Name</FormLabel>
										<FormControl>
											<Input placeholder="My Label" {...field} />
										</FormControl>
										<FormDescription>
											{!id && "Assign a descriptive name to this label"}
											{id && "Update the currently selected labels name"}
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</div>
				)}
				<Button type="submit" disabled={!designedForId}>
					Save
				</Button>
			</div>
			{/* 
				Dialog content needs to be out here since it contains a form. 
				If it were placed as a descendant of the above from the two forms
				(above and printer form) would clash.
			*/}
			<DialogContent>
				<DialogHeader>Create Printer</DialogHeader>
				<DialogDescription>
					Create a new printer to start designing labels for it
				</DialogDescription>
				<PrinterForm
					onCreate={(printer) =>
						// theres some jank state updating going on
						// but waiting 500ms seems to solve it
						setTimeout(() => {
							form.setValue("designedForId", printer.id);
							setIsCreatePrinterDialogOpen(false);
						}, 500)
					}
				/>
			</DialogContent>
		</Dialog>
	);
}
