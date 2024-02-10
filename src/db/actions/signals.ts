"use server";

const mockData = [
	{ id: "1a2b3c", analyst: "John Smith", contents: "Acetone" },
	{ id: "4d5e6f", analyst: "Emily Johnson", contents: "Ethanol" },
	{ id: "7g8h9i", analyst: "Michael Williams", contents: "Methanol" },
	{ id: "j1k2l3", analyst: "Jessica Brown", contents: "Benzene" },
	{ id: "4m5n6o", analyst: "David Davis", contents: "Toluene" },
	{ id: "7p8q9r", analyst: "Jennifer Miller", contents: "Xylene" },
	{ id: "s1t2u3", analyst: "Daniel Wilson", contents: "Ethylbenzene" },
	{ id: "4v5w6x", analyst: "Sarah Martinez", contents: "Styrene" },
	{
		id: "7y8z9a",
		analyst: "Robert Anderson",
		contents: "Methyl ethyl ketone",
	},
	{ id: "b1c2d3", analyst: "Amanda Taylor", contents: "Isopropanol" },
];
export type FormattedSignalsResponse<T = unknown> = Record<string, T>[];

export async function getEid(eid: string): Promise<FormattedSignalsResponse> {
	if (eid === "xyz") return mockData;
	return [];
}
