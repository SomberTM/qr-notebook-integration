"use client";

import { Label, Printer } from "@/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormattedSignalsResponse } from "@/db/actions/signals";
import { populateLabels } from "@/lib/populateLabel";
import { useRef, useState } from "react";
import { CanvasElement } from "./editor/utils";
import LabelEditor from "./editor";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import Konva from "konva";
import { base64ToZPL } from "@/lib/base64ToZPL";

interface PrintFormProps {
	labels: (Label & { printer: Printer })[];
	data: FormattedSignalsResponse;
}

interface PrintForm {
	label?: Label & { printer: Printer };
}

export function PrintForm({ labels, data }: PrintFormProps) {
	/**
	 * Don't necessarily need to use RHF here but it will provide
	 * nice loading state for submissions
	 */
	const form = useForm<PrintForm>();
	const { label } = form.watch();

	const [editors, setEditors] = useState<CanvasElement[][]>([]);
	const stageRefs = useRef<Array<Konva.Stage | null>>([]);

	async function executePrintJob(values: PrintForm) {
		if (!stageRefs.current) return;
		const stages = stageRefs.current.filter(
			(ref) => ref != null
		) as Konva.Stage[];
		const allZpl = stages.map((stage) => base64ToZPL(stage.toDataURL()));
		console.log(allZpl);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(executePrintJob)}
				className="flex flex-col items-center gap-2"
			>
				<div className="flex gap-2">
					<FormField
						control={form.control}
						name="label"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Select
											onValueChange={(id) => {
												const label = labels.find((label) => label.id === id);
												if (!label) return;
												const labelData = label.data as unknown[];
												setEditors(populateLabels(labelData, data));
												field.onChange(label);
											}}
										>
											<SelectTrigger className="w-96">
												<SelectValue placeholder="Select a label template" />
											</SelectTrigger>
											<SelectContent>
												{labels.map((label) => (
													<SelectItem key={label.id} value={label.id}>
														{label.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							);
						}}
					/>

					{label && (
						<Button type="submit">
							Print to <strong className="ml-4">{label.printer.name}</strong>
						</Button>
					)}
				</div>
				<div className="flex justify-center flex-wrap gap-x-4 gap-y-8">
					{label &&
						editors.length > 0 &&
						editors.map((editor, idx) => (
							<LabelEditor
								key={idx}
								data={editor}
								onDataChange={(data) => {
									setEditors((previousEditors) => {
										previousEditors.splice(idx, 1, data);
										return [...previousEditors];
									});
								}}
							>
								<LabelEditor.Toolbar />
								<LabelEditor.Canvas
									width={label.widthIn * label.printer.dpi}
									length={label.lengthIn * label.printer.dpi}
									ref={(el) => (stageRefs.current[idx] = el)}
								/>
							</LabelEditor>
						))}
				</div>
			</form>
		</Form>
	);
}
