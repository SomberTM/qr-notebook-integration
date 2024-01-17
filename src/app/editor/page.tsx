import LabelEditor from "@/components/editor";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Editor() {
	return (
		<ResizablePanelGroup direction="horizontal" className="min-h-[100dvh]">
			<ResizablePanel defaultSize={20} className="border flex flex-col gap-8">
				<header className="p-4">
					<nav>
						<Link href="/" className="flex gap-2">
							<ArrowLeft /> Home
						</Link>
					</nav>
				</header>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel className="p-32 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
				<LabelEditor width="100%" height="50dvh" />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
