import { MainLayout } from "@/components/main-layout";
import { Navigation } from "@/components/nav";
import { PrintForm } from "@/components/print-form";
import { Label } from "@/components/ui/label";

import db from "@/db";
import { getEid } from "@/db/actions/signals";
import { labels as labelsTable, printers as printersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface SearchParams {
	eid: string;
}

export default async function Print({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	if (!searchParams.eid) redirect("/");

	const labels = await db
		.select()
		.from(labelsTable)
		.leftJoin(printersTable, eq(printersTable.id, labelsTable.designedForId));

	const data = await getEid(searchParams.eid);

	return (
		<MainLayout>
			<Navigation />
			<div className="flex flex-col gap-2 items-center">
				<Label>
					eid: <strong>{searchParams.eid}</strong>
				</Label>
				<PrintForm
					labels={labels.map(({ labels: label, printers: printer }) => ({
						...label,
						printer: printer!,
					}))}
					data={data}
				/>
			</div>
		</MainLayout>
	);
}