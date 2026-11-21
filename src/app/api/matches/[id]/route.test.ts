import { describe, expect, it } from "vitest";
import { GET } from "./route";

const call = (id: string) =>
  GET(new Request(`http://localhost/api/matches/${id}`), { params: Promise.resolve({ id }) });

describe("GET /api/matches/:id", () => {
  it("returns the match centre data, uncached", async () => {
    const res = await call("r13-farol-gaivotas");
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect((await res.json()).match.id).toBe("r13-farol-gaivotas");
  });

  it("404s for an unknown match", async () => {
    const res = await call("r99-nowhere");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Match not found" });
  });

  it("rejects malformed ids before looking anything up", async () => {
    for (const id of ["../secrets", "R13 FAROL", "a".repeat(65), ""]) {
      expect((await call(id)).status, id).toBe(400);
    }
  });
});
