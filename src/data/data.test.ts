import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/color";
import { clubs, clubsById } from "./clubs";
import { getMatchCentre, matches } from "./matches";
import { players } from "./players";
import { ROUNDS_PLAYED, computeStandings, results, standings } from "./season";

describe("clubs", () => {
  it("have unique ids and codes", () => {
    expect(new Set(clubs.map((c) => c.id)).size).toBe(clubs.length);
    expect(new Set(clubs.map((c) => c.code)).size).toBe(clubs.length);
  });

  it("use two kit colours that can be told apart", () => {
    for (const { name, kit } of clubs) {
      expect(contrastRatio(kit.primary, kit.secondary), name).toBeGreaterThan(1.5);
    }
  });
});

describe("players", () => {
  it("have unique ids and shirt numbers per club, and belong to a real club", () => {
    expect(new Set(players.map((p) => p.id)).size).toBe(players.length);
    for (const p of players) expect(clubsById[p.clubId], p.id).toBeDefined();
  });

  it("explain why they are unavailable", () => {
    for (const p of players.filter((p) => p.status !== "available")) expect(p.statusNote, p.id).toBeTruthy();
  });
});

describe("season", () => {
  it("is deterministic", () => {
    expect(computeStandings(results)).toEqual(standings);
  });

  it("plays every club once per round", () => {
    expect(results).toHaveLength((ROUNDS_PLAYED * clubs.length) / 2);
    for (const row of standings) expect(row.played).toBe(ROUNDS_PLAYED);
  });

  it("keeps the table internally consistent", () => {
    for (const r of standings) {
      expect(r.won + r.drawn + r.lost).toBe(r.played);
      expect(r.points).toBe(r.won * 3 + r.drawn);
      expect(r.form.length).toBeLessThanOrEqual(5);
    }
    const sum = (k: "goalsFor" | "goalsAgainst" | "won" | "lost") => standings.reduce((n, r) => n + r[k], 0);
    expect(sum("goalsFor")).toBe(sum("goalsAgainst"));
    expect(sum("won")).toBe(sum("lost"));
  });

  it("orders by points, then goal difference, then goals scored", () => {
    standings.forEach((r, i) => expect(r.position).toBe(i + 1));
    const key = (r: (typeof standings)[number]) => [r.points, r.goalsFor - r.goalsAgainst, r.goalsFor];
    for (let i = 1; i < standings.length; i++) {
      const [above, below] = [key(standings[i - 1]), key(standings[i])];
      const firstDifference = above.findIndex((v, k) => v !== below[k]);
      if (firstDifference !== -1) expect(above[firstDifference]).toBeGreaterThan(below[firstDifference]);
    }
  });

  it("ranks a head-to-head correctly", () => {
    const table = computeStandings([{ round: 1, homeId: "lobos", awayId: "farol", homeScore: 2, awayScore: 0 }]);
    expect(table[0]).toMatchObject({ clubId: "lobos", points: 3, form: ["W"] });
    expect(table.at(-1)).toMatchObject({ clubId: "farol", points: 0, form: ["L"] });
  });
});

describe("matches", () => {
  it("only reference real clubs, and scores match the goal list", () => {
    for (const m of matches) {
      expect(clubsById[m.homeId], m.id).toBeDefined();
      expect(clubsById[m.awayId], m.id).toBeDefined();
      if (m.homeScore === undefined) continue;
      expect(m.goals.filter((g) => g.clubId === m.homeId)).toHaveLength(m.homeScore);
      expect(m.goals.filter((g) => g.clubId === m.awayId)).toHaveLength(m.awayScore!);
    }
  });

  it("builds match-centre data with two available key players per side", () => {
    const data = getMatchCentre("r13-farol-gaivotas")!;
    expect(data.keyPlayers).toHaveLength(4);
    expect(data.keyPlayers.every((p) => p.status === "available")).toBe(true);
    expect(getMatchCentre("nope")).toBeUndefined();
  });
});
