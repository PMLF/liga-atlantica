import { getMatchCentre } from "@/data/matches";

export async function GET(_request: Request, { params }: RouteContext<"/api/matches/[id]">) {
  const { id } = await params;
  const data = getMatchCentre(id);
  if (!data) return Response.json({ error: "Match not found" }, { status: 404 });
  return Response.json(data);
}
