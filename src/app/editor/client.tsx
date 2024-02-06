"use client";

import LabelEditor from "@/components/editor";
import { LabelEditorSidebar } from "@/components/editor/sidebar";
import { Form } from "@/components/ui/form";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { CreateLabelSchema, Printer, createLabelSchema } from "@/db/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ClientLayoutProps {
	printers: Printer[];
}

export function ClientLayout({ printers }: ClientLayoutProps) {
	const [width, setWidth] = useState(400);
	const [length, setLength] = useState(600);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const form = useForm<CreateLabelSchema>({
		resolver: zodResolver(createLabelSchema),
	});

	async function onSubmit(values: CreateLabelSchema) {}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<ResizablePanelGroup direction="horizontal" className="min-h-[100dvh]">
					<ResizablePanel
						defaultSize={20}
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
							collapsed={isSidebarCollapsed}
							onWidthChange={(_, width) => setWidth(width)}
							onLengthChange={(_, length) => setLength(length)}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel
						defaultSize={80}
						className="p-32 grid place-items-center z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
					>
						<LabelEditor width={width} length={length} />
					</ResizablePanel>
				</ResizablePanelGroup>
			</form>
		</Form>
	);
}
