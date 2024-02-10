export async function GET(request: Request) {
	const { eid } = await request.json();

	// eid for testing
	if (eid === "xyz") {
	}

	// const data = await fetch(`/signals/${eid}`);
	// save to db with user
}
