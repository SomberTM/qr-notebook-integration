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
	type CreatePrinterSchema,
} from "@/db/schema/printers";
import { SubmitButton } from "./submit-form-button";
import { createPrinterAction } from "@/db/actions/printers";
import { toast } from "sonner";

export function PrinterForm() {
	const form = useForm<CreatePrinterSchema>({
		resolver: zodResolver(createPrinterSchema),
	});
	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(values: CreatePrinterSchema) {
		const result = await createPrinterAction(values);
		if (result.success) {
			toast("New printer successfully created!");
		} else {
			toast("Failed to create printer. Please try again later");
		}
		form.reset({});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
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
				<SubmitButton
					loading={isSubmitting}
					loadingValue="Creating printer..."
					className="mt-2"
				>
					Submit
				</SubmitButton>
			</form>
		</Form>
	);
}
