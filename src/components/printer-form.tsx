"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	createPrinterSchema,
	type Printer,
	type CreatePrinterSchema,
} from "@/db/schema/printers";
import { SubmitButton } from "./submit-form-button";
import { createPrinterAction } from "@/db/actions/printers";
import { toast } from "sonner";

interface PrinterFormProps {
	onCreate?: (printer: Printer) => void;
}

export function PrinterForm(props: PrinterFormProps) {
	const form = useForm<CreatePrinterSchema>({
		resolver: zodResolver(createPrinterSchema),
		defaultValues: {
			dpi: 203,
		},
	});
	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(values: CreatePrinterSchema) {
		const result = await createPrinterAction(values);
		if (result.success) {
			toast("New printer successfully created!", {
				description: `Printer named "${values.name}" was created`,
			});
			props.onCreate?.(values as Printer);
		} else {
			toast("Failed to create printer. Please try again later", {
				description: result.message,
			});
		}
		form.reset({});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.stopPropagation();
					e.preventDefault();
					onSubmit(form.getValues());
				}}
				className="flex flex-col gap-6"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="flex flex-col justify-start text-left">
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="B51 - Lab 01" {...field} />
							</FormControl>
							<FormDescription>
								This is the display name of the printer that you will use to
								identify it
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="ip"
					render={({ field }) => (
						<FormItem className="flex flex-col justify-start text-left">
							<FormLabel>Ip Address</FormLabel>
							<FormControl>
								<Input placeholder="192.0.0.1" {...field} />
							</FormControl>
							<FormDescription>
								This is the ip address that we will use to communicate with the
								printer
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="dpi"
					render={({ field }) => (
						<FormItem className="flex flex-col justify-start text-left">
							<FormLabel>DPI (Dots Per Inch)</FormLabel>
							<FormControl>
								<Input
									placeholder="203"
									{...form.register("dpi", { valueAsNumber: true })}
								/>
							</FormControl>
							<FormDescription>
								This is a printer specific setting and will depend on the
								printhead in your target printer. This value is useful as we
								will use it determine label sizes in the label editor. The
								default value we provide is 203 DPI as it is a common printhead
								size.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<SubmitButton
					loading={isSubmitting}
					loadingValue="Creating printer..."
					className="mt-2"
					type="submit"
				>
					Submit
				</SubmitButton>
			</form>
		</Form>
	);
}
