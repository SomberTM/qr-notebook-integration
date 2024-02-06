export async function POST(request: Request) {
	const { eid } = await request.json();
	const data = await fetch(`/signals/${eid}`);
	// save to db with user
}
