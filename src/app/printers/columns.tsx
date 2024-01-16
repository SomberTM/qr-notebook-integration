"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Printer } from "@/db/schema/printers";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Printer>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "ip",
		header: "IP Address",
	},
];
