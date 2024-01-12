import { MainLayout } from "@/components/main-layout";
import { Navigation } from "@/components/nav";
import { PrinterForm } from "@/components/printer-form";

export default function Printers() {
	return (
		<MainLayout>
			<Navigation />
			<div className="self-center lg:w-3/4 text-center">
				<PrinterForm />
			</div>
		</MainLayout>
	);
}
