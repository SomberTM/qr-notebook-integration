"use client";

import { CreateLabelSchema, Printer, createLabelSchema } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { PlusIcon } from "lucide-react";
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
	const form = useForm<CreateLabelSchema>({
		resolver: zodResolver(createLabelSchema),
	});
	const values = form.watch();

	const getPrinter = useCallback(
		(id: string | null | undefined) =>
			props.printers.find((printer) => printer.id === id),
		[props.printers]
	);

	const [isCreatePrinterDialogOpen, setIsCreatePrinterDialogOpen] =
		useState(false);

	async function onSubmit(values: CreateLabelSchema) {}

	return (
		<Dialog
			open={isCreatePrinterDialogOpen}
			onOpenChange={setIsCreatePrinterDialogOpen}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-8"
				>
					<h1 className="text-xl border-b">Label Editor</h1>
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
												{props.printers.map((printer) => (
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
								const printerId = values.designedForId;
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
								const printerId = values.designedForId;
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
				</form>
			</Form>
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
