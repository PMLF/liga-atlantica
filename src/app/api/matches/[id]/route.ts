import { getMatchCentre } from "@/data/matches";

/** Match ids are lowercase slugs such as `r13-farol-gaivotas`. */
const MATCH_ID = /^[a-z0-9-]{1,64}$/;

export async function GET(_request: Request, { params }: RouteContext<"/api/matches/[id]">) {
  const { id } = await params;
  if (!MATCH_ID.test(id)) return Response.json({ error: "Invalid match id" }, { status: 400 });

  const data = getMatchCentre(id);
  if (!data) return Response.json({ error: "Match not found" }, { status: 404 });

  // Live data: never let a browser or CDN serve a stale score.
  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
