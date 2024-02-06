import db from "@/db";
import { printers as printersTable } from "@/db/schema";
import { ClientLayout } from "./client";

export default async function Editor() {
	const printers = await db.select().from(printersTable);

	return <ClientLayout printers={printers} />;
}
