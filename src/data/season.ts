import { clubs } from "./clubs";
import type { Result, StandingRow } from "./types";

export interface PlayedMatch {
  round: number;
  homeId: string;
  awayId: string;
  homeScore: number;
  awayScore: number;
}

const strength: Record<string, number> = {
  farol: 0.82,
  cabo: 0.78,
  gaivotas: 0.7,
  ribeira: 0.64,
  pinhal: 0.55,
  marsalgado: 0.5,
  penedo: 0.42,
  lobos: 0.34,
};

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function poisson(lambda: number, rand: () => number) {
  const limit = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rand();
  } while (p > limit);
  return k - 1;
}

function roundRobin(ids: string[]): Array<Array<[string, string]>> {
  const rotating = ids.slice(1);
  const rounds: Array<Array<[string, string]>> = [];
  for (let r = 0; r < ids.length - 1; r++) {
    const order = [ids[0], ...rotating];
    const fixtures: Array<[string, string]> = [];
    for (let i = 0; i < order.length / 2; i++) {
      const a = order[i];
      const b = order[order.length - 1 - i];
      fixtures.push((r + i) % 2 === 0 ? [a, b] : [b, a]);
    }
    rounds.push(fixtures);
    rotating.unshift(rotating.pop()!);
  }
  return rounds;
}

export const ROUNDS_PLAYED = 12;

const firstHalf = roundRobin(clubs.map((c) => c.id));
const schedule = [...firstHalf, ...firstHalf.map((round) => round.map(([h, a]) => [a, h] as [string, string]))];

const rand = mulberry32(2026);

export const results: PlayedMatch[] = schedule.slice(0, ROUNDS_PLAYED).flatMap((fixtures, r) =>
  fixtures.map(([homeId, awayId]) => {
    const diff = strength[homeId] - strength[awayId];
    return {
      round: r + 1,
      homeId,
      awayId,
      homeScore: poisson(Math.max(0.35, 1.45 + diff * 1.6), rand),
      awayScore: poisson(Math.max(0.3, 1.1 - diff * 1.6), rand),
    };
  }),
);

function outcome(goalsFor: number, goalsAgainst: number): Result {
  return goalsFor > goalsAgainst ? "W" : goalsFor === goalsAgainst ? "D" : "L";
}

export function computeStandings(played: PlayedMatch[]): StandingRow[] {
  const rows = new Map<string, StandingRow>(
    clubs.map((c) => [
      c.id,
      { position: 0, clubId: c.id, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, form: [] },
    ]),
  );

  for (const m of [...played].sort((a, b) => a.round - b.round)) {
    for (const [id, gf, ga] of [
      [m.homeId, m.homeScore, m.awayScore],
      [m.awayId, m.awayScore, m.homeScore],
    ] as const) {
      const row = rows.get(id)!;
      const res = outcome(gf, ga);
      row.played++;
      row.goalsFor += gf;
      row.goalsAgainst += ga;
      if (res === "W") row.won++;
      if (res === "D") row.drawn++;
      if (res === "L") row.lost++;
      row.points = row.won * 3 + row.drawn;
      row.form = [...row.form, res].slice(-5);
    }
  }

  return [...rows.values()]
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
        b.goalsFor - a.goalsFor ||
        a.clubId.localeCompare(b.clubId),
    )
    .map((row, i) => ({ ...row, position: i + 1 }));
}

export const standings = computeStandings(results);

export function formFor(clubId: string): Result[] {
  return standings.find((s) => s.clubId === clubId)?.form ?? [];
}
