import { MainLayout } from "@/components/main-layout";
import { Navigation } from "@/components/nav";
import { PrinterForm } from "@/components/printer-form";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/db";
import { printers } from "@/db/schema";

export default async function Printers() {
	const data = await db.select().from(printers);

	return (
		<MainLayout>
			<Navigation />
			<div className="self-center lg:w-3/4 flex flex-col gap-16">
				<Tabs defaultValue="table">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="table">Printers</TabsTrigger>
						<TabsTrigger value="create">Create</TabsTrigger>
					</TabsList>
					<TabsContent value="create">
						<PrinterForm />
					</TabsContent>
					<TabsContent value="table">
						<DataTable columns={columns} data={data} />
					</TabsContent>
				</Tabs>
			</div>
		</MainLayout>
	);
}
