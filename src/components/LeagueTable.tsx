"use client";

import { useState } from "react";
import { clubsById } from "@/data/clubs";
import type { StandingRow } from "@/data/types";
import { cn } from "@/lib/cn";
import { Crest } from "./Crest";
import { FormGuide } from "./FormGuide";

export type SortKey = "position" | "club" | "played" | "won" | "drawn" | "lost" | "goalsFor" | "goalsAgainst" | "goalDifference" | "points";

export interface LeagueTableProps {
  standings: StandingRow[];
  /** The user's club. Its row is highlighted wherever the table is sorted. */
  favouriteClubId?: string;
  /** Number of places at the top that qualify for the Champions League. */
  championsLeagueSpots?: number;
  /** Number of places at the bottom that are relegated. */
  relegationSpots?: number;
  /** Initial sort column. */
  initialSort?: SortKey;
  showForm?: boolean;
  caption?: string;
  className?: string;
}

const gd = (r: StandingRow) => r.goalsFor - r.goalsAgainst;

const columns: Array<{ key: SortKey; label: string; title: string; className?: string; descFirst?: boolean }> = [
  { key: "played", label: "P", title: "Played" },
  { key: "won", label: "W", title: "Won", className: "hidden sm:table-cell", descFirst: true },
  { key: "drawn", label: "D", title: "Drawn", className: "hidden sm:table-cell", descFirst: true },
  { key: "lost", label: "L", title: "Lost", className: "hidden sm:table-cell" },
  { key: "goalsFor", label: "GF", title: "Goals for", className: "hidden md:table-cell", descFirst: true },
  { key: "goalsAgainst", label: "GA", title: "Goals against", className: "hidden md:table-cell" },
  { key: "goalDifference", label: "GD", title: "Goal difference", descFirst: true },
  { key: "points", label: "Pts", title: "Points", descFirst: true },
];

function value(row: StandingRow, key: SortKey): number | string {
  if (key === "club") return clubsById[row.clubId]?.name ?? row.clubId;
  if (key === "goalDifference") return gd(row);
  return row[key];
}

/**
 * Sortable league standings with form, qualification zones and a highlighted favourite club.
 *
 * @import import { LeagueTable } from "@/components/LeagueTable";
 */
export function LeagueTable({
  standings,
  favouriteClubId,
  championsLeagueSpots = 2,
  relegationSpots = 2,
  initialSort = "position",
  showForm = true,
  caption = "Liga Atlântica standings",
  className,
}: LeagueTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: initialSort,
    dir: columns.find((c) => c.key === initialSort)?.descFirst ? "desc" : "asc",
  });

  const total = standings.length;
  const rows = [...standings].sort((a, b) => {
    const av = value(a, sort.key);
    const bv = value(b, sort.key);
    const cmp = typeof av === "string" ? av.localeCompare(String(bv)) : av - (bv as number);
    return (sort.dir === "asc" ? cmp : -cmp) || a.position - b.position;
  });

  function toggle(key: SortKey, descFirst = false) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: descFirst ? "desc" : "asc" },
    );
  }

  function header(key: SortKey, label: string, title: string, descFirst?: boolean, align: "left" | "center" = "center") {
    const active = sort.key === key;
    return (
      <button
        type="button"
        onClick={() => toggle(key, descFirst)}
        title={`Sort by ${title.toLowerCase()}`}
        className={cn(
          "inline-flex h-10 w-full items-center gap-0.5 rounded uppercase outline-none focus-visible:ring-2 focus-visible:ring-accent",
          align === "center" ? "justify-center" : "justify-start",
          active ? "text-ink" : "hover:text-ink",
        )}
      >
        <abbr title={title} className="no-underline">
          {label}
        </abbr>
        <span aria-hidden className={cn("w-2 text-[0.5rem]", !active && "invisible")}>
          {sort.dir === "asc" ? "▲" : "▼"}
        </span>
      </button>
    );
  }

  const ariaSort = (key: SortKey) =>
    sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-surface", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm tabular-nums">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted">
              <th scope="col" aria-sort={ariaSort("position")} className="w-12 pl-2">
                {header("position", "#", "Position")}
              </th>
              <th scope="col" aria-sort={ariaSort("club")} className="pl-1 text-left">
                {header("club", "Club", "Club", false, "left")}
              </th>
              {columns.map((c) => (
                <th key={c.key} scope="col" aria-sort={ariaSort(c.key)} className={cn("w-11", c.className)}>
                  {header(c.key, c.label, c.title, c.descFirst)}
                </th>
              ))}
              {showForm && (
                <th scope="col" className="hidden w-36 pr-4 text-left lg:table-cell">
                  Form
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const club = clubsById[row.clubId];
              const favourite = row.clubId === favouriteClubId;
              const zone =
                row.position <= championsLeagueSpots ? "cl" : row.position > total - relegationSpots ? "rel" : null;
              return (
                <tr
                  key={row.clubId}
                  data-club={row.clubId}
                  className={cn("h-12 border-t border-line", favourite && "bg-accent-soft")}
                >
                  <td className="relative pl-2 pt-1 text-center font-semibold text-ink">
                    {zone && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-y-2 left-0 w-1 rounded-r",
                          zone === "cl" ? "bg-champions" : "bg-loss",
                        )}
                      />
                    )}
                    {row.position}
                  </td>
                  <th scope="row" className="pl-1 pr-3 text-left font-medium text-ink">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Crest club={club} size={22} />
                      <span className="truncate">
                        <span className="sm:hidden">{club.shortName}</span>
                        <span className="hidden sm:inline">{club.name}</span>
                      </span>
                      {favourite && (
                        <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-surface">
                          Your club
                        </span>
                      )}
                      {zone && (
                        <span className="sr-only">
                          {zone === "cl" ? "(Champions League place)" : "(relegation place)"}
                        </span>
                      )}
                    </span>
                  </th>
                  {columns.map((c) => {
                    const v = value(row, c.key) as number;
                    return (
                      <td
                        key={c.key}
                        className={cn(
                          "text-center",
                          c.key === "points" ? "font-bold text-ink" : "text-muted",
                          c.className,
                        )}
                      >
                        {c.key === "goalDifference" && v > 0 ? `+${v}` : v}
                      </td>
                    );
                  })}
                  {showForm && (
                    <td className="hidden pr-4 lg:table-cell">
                      <FormGuide results={row.form} size="sm" />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-3 text-xs text-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-1 rounded bg-champions" />
          Champions League
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-1 rounded bg-loss" />
          Relegation
        </li>
        {favouriteClubId && (
          <li className="flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-sm border border-accent bg-accent-soft" />
            Your club
          </li>
        )}
      </ul>
    </div>
  );
}
