"use client";

import { CreateLabelSchema, Printer, createLabelSchema } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
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

interface LabelEditorSidebarProps {
	printers: Printer[];
	collapsed?: boolean;
	onWidthChange?(width: number, widthPx: number): void;
	onLengthChange?(height: number, widthPx: number): void;
}

export function LabelEditorSidebar({
	printers,
	collapsed,
	onLengthChange,
	onWidthChange,
}: LabelEditorSidebarProps) {
	const form = useFormContext();
	const { designedForId } = form.watch();

	const getPrinter = useCallback(
		(id: string | null | undefined) =>
			printers.find((printer) => printer.id === id),
		[printers]
	);

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
										<Button type="button" size="sm">
											<PlusIcon />
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
				<div className="flex flex-col gap-2">
					<FormField
						control={form.control}
						name="widthIn"
						render={({ field }) => {
							const printerId = designedForId;
							const printer = getPrinter(printerId);
							if (!printer) return <FormItem />;

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
													onWidthChange?.(width, width * printer.dpi);
												}}
											/>
											{printer && !!field.value && !isNaN(field.value) && (
												<span className="col-span-1 text-xs justify-self-end">
													{field.value * printer.dpi}px
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
							const printerId = designedForId;
							const printer = getPrinter(printerId);
							if (!printer) return <FormItem />;

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
													onLengthChange?.(length, length * printer.dpi);
												}}
											/>
											{printer && !!field.value && !isNaN(field.value) && (
												<span className="col-span-1 text-xs justify-self-end">
													{field.value * printer.dpi}px
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
				</div>
				<Button type="submit">Save</Button>
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
