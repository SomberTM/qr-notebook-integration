import db from "@/db";
import { labels as labelsTable, printers as printersTable } from "@/db/schema";
import { ClientLayout } from "./client";

export default async function Editor() {
	const printers = await db.select().from(printersTable);
	const labels = await db.select().from(labelsTable);

	return <ClientLayout printers={printers} labels={labels} />;
}
