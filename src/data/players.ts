import type { Player, PlayerStats, Position } from "./types";

/** Placeholder portraits; picked by shirt number so a player always gets the same one. */
const photo = (number: number) => `/players/silhouette-${(number % 4) + 1}.svg`;

function player(
  clubId: string,
  number: number,
  name: string,
  position: Position,
  nationality: string,
  rating: number,
  stats: PlayerStats,
  extra: Partial<Player> = {},
): Player {
  const id = `${clubId}-${number}`;
  return { id, clubId, number, name, position, nationality, rating, stats, status: "available", photoUrl: photo(number), ...extra };
}

export const players: Player[] = [
  player("farol", 1, "Rui Calado", "GK", "PT", 7.1, { appearances: 12, goals: 0, assists: 0, cleanSheets: 5, conceded: 11 }),
  player("farol", 2, "Tiago Mourisco", "RB", "PT", 6.9, { appearances: 12, goals: 1, assists: 3 }),
  player("farol", 4, "Edson Varela", "CB", "CV", 7.0, { appearances: 11, goals: 1, assists: 0 }),
  player("farol", 5, "Henrique Laborinho", "CB", "PT", 7.3, { appearances: 12, goals: 2, assists: 1 }, { isCaptain: true }),
  player("farol", 3, "Yaw Ofori-Darko", "LB", "GH", 6.8, { appearances: 10, goals: 0, assists: 4 }),
  player("farol", 6, "Mateus Gorjão", "DM", "BR", 7.0, { appearances: 12, goals: 0, assists: 2 }),
  player("farol", 8, "Lourenço Bettencourt", "CM", "PT", 7.4, { appearances: 12, goals: 3, assists: 5 }),
  player("farol", 10, "Álvaro Mendiluce", "CM", "ES", 7.6, { appearances: 11, goals: 4, assists: 6 }),
  player("farol", 7, "Rafael Soutelo", "RW", "PT", 7.2, { appearances: 12, goals: 5, assists: 3 }),
  player("farol", 11, "Ismaïla Ndour", "LW", "SN", 7.5, { appearances: 12, goals: 6, assists: 4 }),
  player("farol", 9, "Duarte Valadares", "ST", "PT", 7.8, { appearances: 12, goals: 11, assists: 2 }),
  player("farol", 17, "Wesley Caldas", "RW", "BR", 7.0, { appearances: 6, goals: 2, assists: 1 }, {
    status: "injured",
    statusNote: "Hamstring · back mid-December",
  }),
  player("farol", 15, "Cheikh Mbengue-Fall", "CB", "SN", 6.7, { appearances: 9, goals: 0, assists: 0 }, {
    status: "suspended",
    statusNote: "Red card · misses 2 matches",
  }),

  player("gaivotas", 1, "Bram Oosterveld", "GK", "NL", 6.9, { appearances: 12, goals: 0, assists: 0, cleanSheets: 3, conceded: 15 }),
  player("gaivotas", 2, "Simão Peralta", "RB", "PT", 6.8, { appearances: 11, goals: 0, assists: 2 }),
  player("gaivotas", 4, "Joaquim Ferrão", "CB", "PT", 6.9, { appearances: 12, goals: 1, assists: 0 }),
  player("gaivotas", 5, "Matías Echenagusía", "CB", "UY", 7.0, { appearances: 12, goals: 2, assists: 0 }),
  player("gaivotas", 3, "Leandro Quintas", "LB", "BR", 6.9, { appearances: 12, goals: 0, assists: 3 }),
  player("gaivotas", 6, "Afonso Brás", "DM", "PT", 7.2, { appearances: 12, goals: 1, assists: 2 }, { isCaptain: true }),
  player("gaivotas", 8, "Yusuf El Mansouri", "CM", "MA", 7.1, { appearances: 12, goals: 2, assists: 4 }),
  player("gaivotas", 10, "Kaito Morishima", "AM", "JP", 7.5, { appearances: 12, goals: 5, assists: 7 }),
  player("gaivotas", 7, "Diogo Sarmento", "RW", "PT", 7.0, { appearances: 11, goals: 3, assists: 3 }),
  player("gaivotas", 11, "Anselmo Tavares", "LW", "AO", 7.1, { appearances: 12, goals: 4, assists: 2 }),
  player("gaivotas", 9, "Mikkel Thorvaldsen", "ST", "DK", 7.4, { appearances: 12, goals: 9, assists: 1 }),

  player("pinhal", 23, "Maximiliano Bartolomeu Vasconcelos-Albuquerque", "AM", "BR", 7.3, { appearances: 12, goals: 4, assists: 5 }),
  player("ribeira", 9, "Tomé Barreiros", "ST", "PT", 7.6, { appearances: 12, goals: 10, assists: 2 }),
  player("cabo", 10, "Nicolás Ferreyra-Ibarra", "AM", "AR", 7.7, { appearances: 12, goals: 7, assists: 8 }, { isCaptain: true }),
  player("marsalgado", 9, "Seydou Kamissoko", "ST", "ML", 7.2, { appearances: 11, goals: 8, assists: 1 }),
  player("penedo", 8, "Jorge Amaral Leitão", "CM", "PT", 6.9, { appearances: 12, goals: 2, assists: 3 }),
  player("lobos", 1, "Vasco Mendanha", "GK", "PT", 6.6, { appearances: 12, goals: 0, assists: 0, cleanSheets: 2, conceded: 21 }, {
    photoUrl: undefined,
  }),
];

export const playersById: Record<string, Player> = Object.fromEntries(players.map((p) => [p.id, p]));

export function getPlayer(id: string): Player {
  const p = playersById[id];
  if (!p) throw new Error(`Unknown player: ${id}`);
  return p;
}

export function squad(clubId: string): Player[] {
  return players.filter((p) => p.clubId === clubId);
}
