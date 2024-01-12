export async function POST(request: Request) {
  const { eid } = await request.json();
  return Response.json(eid); 
}