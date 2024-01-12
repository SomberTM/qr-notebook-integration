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
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const printerForm = z.object({
	ip: z.string().ip({ version: "v4" }),
	name: z.string().min(1).max(64),
});
type PrinterForm = z.infer<typeof printerForm>;

export function PrinterForm() {
	const form = useForm<PrinterForm>({
		resolver: zodResolver(printerForm),
	});

	function onSubmit(values: PrinterForm) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
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
				<Button className="mt-8" type="submit">
					Submit
				</Button>
			</form>
		</Form>
	);
}
