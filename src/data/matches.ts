import { getClub } from "./clubs";
import { squad } from "./players";
import { standings } from "./season";
import type { Club, Match, Player, StandingRow } from "./types";

export const matches: Match[] = [
  {
    id: "r13-farol-gaivotas",
    round: 13,
    homeId: "farol",
    awayId: "gaivotas",
    kickoff: "2026-11-21T20:30:00Z",
    venue: "Estádio do Farolim",
    status: "live",
    minute: 67,
    homeScore: 2,
    awayScore: 1,
    goals: [
      { clubId: "farol", player: "Duarte Valadares", minute: 23 },
      { clubId: "gaivotas", player: "Kaito Morishima", minute: 41 },
      { clubId: "farol", player: "Ismaïla Ndour", minute: 58 },
    ],
  },
  {
    id: "r13-cabo-pinhal",
    round: 13,
    homeId: "cabo",
    awayId: "pinhal",
    kickoff: "2026-11-21T18:00:00Z",
    venue: "Estádio das Falésias",
    status: "half-time",
    minute: 45,
    homeScore: 1,
    awayScore: 0,
    goals: [{ clubId: "cabo", player: "Nicolás Ferreyra-Ibarra", minute: 38, kind: "penalty" }],
  },
  {
    id: "r13-ribeira-marsalgado",
    round: 13,
    homeId: "ribeira",
    awayId: "marsalgado",
    kickoff: "2026-11-21T15:30:00Z",
    venue: "Estádio do Moinho",
    status: "full-time",
    homeScore: 3,
    awayScore: 3,
    goals: [
      { clubId: "ribeira", player: "Tomé Barreiros", minute: 9 },
      { clubId: "marsalgado", player: "Seydou Kamissoko", minute: 27 },
      { clubId: "marsalgado", player: "Gil Sacramento", minute: 44 },
      { clubId: "ribeira", player: "Tomé Barreiros", minute: 61, kind: "penalty" },
      { clubId: "marsalgado", player: "Paulo Rebordão", minute: 78, kind: "own-goal" },
      { clubId: "ribeira", player: "Nuno Carvalhosa", minute: 90, stoppage: 4 },
    ],
  },
  {
    id: "r13-penedo-lobos",
    round: 13,
    homeId: "penedo",
    awayId: "lobos",
    kickoff: "2026-11-22T14:00:00Z",
    venue: "Estádio do Miradouro",
    status: "postponed",
    goals: [],
  },
  {
    id: "r14-gaivotas-cabo",
    round: 14,
    homeId: "gaivotas",
    awayId: "cabo",
    kickoff: "2026-11-28T20:15:00Z",
    venue: "Arena da Maré",
    status: "scheduled",
    goals: [],
  },
];

export function getMatch(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

export interface MatchCentreData {
  match: Match;
  home: Club;
  away: Club;
  keyPlayers: Player[];
  standings: StandingRow[];
}

function keyPlayers(clubId: string, count: number) {
  return squad(clubId)
    .filter((p) => p.status === "available")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
}

export function getMatchCentre(id: string): MatchCentreData | undefined {
  const match = getMatch(id);
  if (!match) return undefined;
  return {
    match,
    home: getClub(match.homeId),
    away: getClub(match.awayId),
    keyPlayers: [...keyPlayers(match.homeId, 2), ...keyPlayers(match.awayId, 2)],
    standings,
  };
}
