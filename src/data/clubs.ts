import type { Club } from "./types";

export const clubs: Club[] = [
  {
    id: "farol",
    name: "Farol Atlântico FC",
    shortName: "Farol",
    code: "FAR",
    city: "Vila do Farol",
    founded: 1911,
    stadium: "Estádio do Farolim",
    kit: { primary: "#1d3b8b", secondary: "#f2b705", pattern: "hoops" },
    crest: { shape: "shield", motif: "band" },
  },
  {
    id: "pinhal",
    name: "CD Pinhal Alto",
    shortName: "Pinhal",
    code: "PIN",
    city: "Pinhal Alto",
    founded: 1923,
    stadium: "Campo dos Pinheiros",
    kit: { primary: "#146c3a", secondary: "#ffffff", pattern: "stripes" },
    crest: { shape: "heater", motif: "stripes" },
  },
  {
    id: "ribeira",
    name: "União da Ribeira Funda",
    shortName: "Ribeira",
    code: "RIB",
    city: "Ribeira Funda",
    founded: 1919,
    stadium: "Estádio do Moinho",
    kit: { primary: "#b3261e", secondary: "#ffffff", pattern: "halves" },
    crest: { shape: "round", motif: "split" },
  },
  {
    id: "gaivotas",
    name: "Gaivotas de Vila Serena",
    shortName: "Gaivotas",
    code: "GAI",
    city: "Vila Serena",
    founded: 1934,
    stadium: "Arena da Maré",
    kit: { primary: "#0b7fc0", secondary: "#ffffff", pattern: "plain" },
    crest: { shape: "shield", motif: "chevron" },
  },
  {
    id: "cabo",
    name: "Atlético Cabo Bravo",
    shortName: "Cabo Bravo",
    code: "CAB",
    city: "Cabo Bravo",
    founded: 1928,
    stadium: "Estádio das Falésias",
    kit: { primary: "#151515", secondary: "#f26b1d", pattern: "stripes" },
    crest: { shape: "shield", motif: "chevron" },
  },
  {
    id: "marsalgado",
    name: "SD Mar Salgado",
    shortName: "Mar Salgado",
    code: "MSA",
    city: "Mar Salgado",
    founded: 1946,
    stadium: "Parque das Salinas",
    kit: { primary: "#0d6e68", secondary: "#f6dd9a", pattern: "hoops" },
    crest: { shape: "round", motif: "band" },
  },
  {
    id: "penedo",
    name: "Cometas do Penedo",
    shortName: "Penedo",
    code: "PEN",
    city: "Penedo Grande",
    founded: 1952,
    stadium: "Estádio do Miradouro",
    kit: { primary: "#5b2bb5", secondary: "#ffffff", pattern: "plain" },
    crest: { shape: "heater", motif: "chevron" },
  },
  {
    id: "lobos",
    name: "Lobos do Vale Escuro",
    shortName: "Lobos",
    code: "LOB",
    city: "Vale Escuro",
    founded: 1907,
    stadium: "Campo da Alcateia",
    kit: { primary: "#7a1f2b", secondary: "#8fc3e8", pattern: "halves" },
    crest: { shape: "shield", motif: "split" },
  },
];

export const clubsById: Record<string, Club> = Object.fromEntries(clubs.map((c) => [c.id, c]));

export function getClub(id: string): Club {
  const club = clubsById[id];
  if (!club) throw new Error(`Unknown club: ${id}`);
  return club;
}
