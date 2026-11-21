export type KitPattern = "plain" | "stripes" | "hoops" | "halves";

export interface Kit {
  primary: string;
  secondary: string;
  pattern: KitPattern;
}

export type CrestShape = "shield" | "round" | "heater";
export type CrestMotif = "band" | "stripes" | "split" | "chevron";

export interface Club {
  id: string;
  name: string;
  shortName: string;
  code: string;
  city: string;
  founded: number;
  stadium: string;
  kit: Kit;
  crest: { shape: CrestShape; motif: CrestMotif };
}

export type Position = "GK" | "RB" | "CB" | "LB" | "DM" | "CM" | "AM" | "RW" | "LW" | "ST";

export type PlayerStatus = "available" | "injured" | "suspended";

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  conceded?: number;
}

export type Result = "W" | "D" | "L";

export interface StandingRow {
  position: number;
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  /** Most recent results, oldest first, at most five. */
  form: Result[];
}

export type MatchStatus = "scheduled" | "live" | "half-time" | "full-time" | "postponed";

export interface Goal {
  /** The club credited with the goal (for own goals, the club that benefits). */
  clubId: string;
  player: string;
  minute: number;
  stoppage?: number;
  kind?: "penalty" | "own-goal";
}

export interface Match {
  id: string;
  round: number;
  homeId: string;
  awayId: string;
  kickoff: string;
  venue: string;
  status: MatchStatus;
  minute?: number;
  homeScore?: number;
  awayScore?: number;
  goals: Goal[];
}

export interface Player {
  id: string;
  clubId: string;
  name: string;
  number: number;
  position: Position;
  nationality: string;
  photoUrl?: string;
  isCaptain?: boolean;
  status: PlayerStatus;
  statusNote?: string;
  rating: number;
  stats: PlayerStats;
}
