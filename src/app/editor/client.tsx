"use client";

import LabelEditor from "@/components/editor";
import { LabelEditorSidebar } from "@/components/editor/sidebar";
import Toolbar from "@/components/editor/toolbar";
import { CanvasElement } from "@/components/editor/utils";
import { Form, FormField } from "@/components/ui/form";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { createLabelTemplate, updateLabelTemplate } from "@/db/actions/labels";
import {
	CreateLabelSchema,
	Label,
	Printer,
	UpdateLabelSchema,
	createLabelSchema,
} from "@/db/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClientLayoutProps {
	printers: Printer[];
	labels: Label[];
}

export function ClientLayout({ printers, labels }: ClientLayoutProps) {
	const [width, setWidth] = useState(400);
	const [length, setLength] = useState(600);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const form = useForm<CreateLabelSchema>({
		resolver: zodResolver(createLabelSchema),
		defaultValues: {
			data: [],
		},
	});

	async function onSubmit(values: CreateLabelSchema) {
		let result;
		const value = { ...values, data: JSON.stringify(values.data ?? []) };
		const isUpdate = !!value.id;

		if (isUpdate)
			result = await updateLabelTemplate(value as UpdateLabelSchema);
		else result = await createLabelTemplate(value as CreateLabelSchema);

		if (result.success) {
			if (isUpdate) toast("Label template successfully updated!");
			else toast("New label template successfully created!");
		} else {
			toast("Failed to save label template. Please try again later");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<ResizablePanelGroup direction="horizontal" className="min-h-[100dvh]">
					<ResizablePanel
						defaultSize={30}
						maxSize={30}
						minSize={10}
						collapsible
						collapsedSize={0}
						className={cn(
							!isSidebarCollapsed && "p-8",
							isSidebarCollapsed && "p-2"
						)}
						onCollapse={() => setIsSidebarCollapsed(true)}
						onExpand={() => setIsSidebarCollapsed(false)}
					>
						<LabelEditorSidebar
							printers={printers}
							labels={labels}
							collapsed={isSidebarCollapsed}
							onWidthChange={(_, width) => setWidth(width)}
							onLengthChange={(_, length) => setLength(length)}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel
						defaultSize={70}
						className="p-32 grid place-items-center z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
					>
						<FormField
							control={form.control}
							name="data"
							render={({ field }) => (
								<LabelEditor
									data={
										field.value && typeof field.value === "string"
											? JSON.parse(field.value)
											: field.value
									}
									onDataChange={field.onChange}
								>
									<LabelEditor.Toolbar />
									<LabelEditor.Canvas width={width} length={length} />
								</LabelEditor>
							)}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</form>
		</Form>
	);
}
