import { MainLayout } from "@/components/main-layout";
import { Navigation } from "@/components/nav";
import { PrintForm } from "@/components/print-form";
import { Label } from "@/components/ui/label";

import db from "@/db";
import { getDataFromEid } from "@/db/actions/signals";
import { labels as labelsTable, printers as printersTable } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { signIn } from "next-auth/react";
import { InitiateSignIn } from "@/components/initiate-sign-in";

interface SearchParams {
	eid: string;
}

export default async function Print({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	if (!searchParams.eid) redirect("/");

	// broken
	// const session = await getSession();
	// if (!session) return <InitiateSignIn />;

	const labels = await db
		.select()
		.from(labelsTable)
		.leftJoin(printersTable, eq(printersTable.id, labelsTable.designedForId));

	const result = await getDataFromEid(searchParams.eid);

	return (
		<MainLayout>
			<Navigation />
			{!result.success && (
				<div className="flex flex-col gap-2">
					<span className="text-xl">
						Invalid eid provided or the request failed with the given eid. Error
						message provided below.
					</span>
					<span className="text-muted-foreground">{result.message}</span>
				</div>
			)}
			{result.success && (
				<div className="flex flex-col gap-2 items-center">
					<Label>
						eid: <strong>{searchParams.eid}</strong>
					</Label>
					<PrintForm
						labels={labels.map(({ labels: label, printers: printer }) => ({
							...label,
							printer: printer!,
						}))}
						data={result.data}
					/>
				</div>
			)}
		</MainLayout>
	);
}
