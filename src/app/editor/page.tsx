import LabelEditor from "@/components/editor";
import db from "@/db";
import { printers as printersTable } from "@/db/schema";

import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { LabelEditorSidebar } from "@/components/editor/sidebar";

export default async function Editor() {
	const printers = await db.select().from(printersTable);

	return (
		<ResizablePanelGroup direction="horizontal" className="min-h-[100dvh]">
			<ResizablePanel
				defaultSize={20}
				maxSize={30}
				minSize={10}
				collapsible
				collapsedSize={0}
				className="p-8"
			>
				<LabelEditorSidebar printers={printers} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel className="p-32 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
				<LabelEditor width="100%" height="50dvh" />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
