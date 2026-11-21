"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Crest } from "@/components/Crest";
import { FormGuide } from "@/components/FormGuide";
import { LeagueTable } from "@/components/LeagueTable";
import { PlayerCard, playerCardProps } from "@/components/PlayerCard";
import { PlayerDialog } from "@/components/PlayerDialog";
import { FAVOURITE_CLUB_ID } from "@/data";
import type { MatchCentreData } from "@/data/matches";
import type { Club, Goal, MatchStatus, Player } from "@/data/types";
import { cn } from "@/lib/cn";
import { formatKickoff, formatMinute } from "@/lib/format";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="text-sm font-medium text-muted hover:text-ink">
          ← Liga Atlântica
        </Link>
      </nav>
      {children}
    </main>
  );
}

function StatusPill({ status, minute }: { status: MatchStatus; minute?: number }) {
  const styles: Record<MatchStatus, { label: string; className: string }> = {
    live: { label: `Live · ${minute ?? 0}'`, className: "bg-loss text-white" },
    "half-time": { label: "Half-time", className: "bg-warning-soft text-warning" },
    "full-time": { label: "Full-time", className: "bg-surface-2 text-ink" },
    scheduled: { label: "Upcoming", className: "bg-accent-soft text-accent" },
    postponed: { label: "Postponed", className: "bg-danger-soft text-danger" },
  };
  const s = styles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", s.className)}>
      {status === "live" && <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-white" />}
      {s.label}
    </span>
  );
}

function Team({ club, form }: { club: Club; form: MatchCentreData["standings"][number]["form"] }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
      <Crest club={club} size={64} />
      <p className="font-display text-lg font-bold uppercase leading-tight tracking-wide text-ink sm:text-2xl">
        <span className="sm:hidden">{club.shortName}</span>
        <span className="hidden sm:inline">{club.name}</span>
      </p>
      <FormGuide results={form} size="sm" />
    </div>
  );
}

function Scorers({ goals, align }: { goals: Goal[]; align: "left" | "right" }) {
  return (
    <ul className={cn("flex flex-col gap-1 text-sm text-muted", align === "right" ? "items-end text-right" : "items-start")}>
      {goals.map((g) => (
        <li key={`${g.player}-${g.minute}-${g.stoppage ?? 0}`}>
          <span className="text-ink">{g.player.split(" ").at(-1)}</span> {formatMinute(g.minute, g.stoppage)}
          {g.kind === "penalty" && " (pen)"}
          {g.kind === "own-goal" && " (og)"}
        </li>
      ))}
    </ul>
  );
}

export function MatchView({ data }: { data: MatchCentreData }) {
  const { match, home, away, keyPlayers, standings } = data;
  const [selected, setSelected] = useState<Player | null>(null);
  const formOf = (id: string) => standings.find((s) => s.clubId === id)?.form ?? [];
  const kickoff = formatKickoff(match.kickoff);
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined;

  return (
    <PageShell>
      <section aria-labelledby="match-title" className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 text-xs text-muted sm:px-6">
          <span>
            Round {match.round} · {match.venue}
          </span>
          <StatusPill status={match.status} minute={match.minute} />
        </div>
        <h1 id="match-title" className="sr-only">
          {home.name} vs {away.name}
        </h1>
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4 px-5 py-8 sm:px-10">
          <Team club={home} form={formOf(home.id)} />
          <div className="flex flex-col items-center gap-1 pt-4">
            {hasScore ? (
              <p className="font-display text-5xl font-extrabold tabular-nums leading-none text-ink sm:text-7xl">
                {match.homeScore}
                <span className="mx-2 text-muted sm:mx-3">–</span>
                {match.awayScore}
              </p>
            ) : (
              <p className={cn("font-display text-4xl font-bold tabular-nums leading-none text-ink sm:text-6xl", match.status === "postponed" && "text-muted line-through")}>
                {kickoff.time}
              </p>
            )}
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">{kickoff.date}</p>
          </div>
          <Team club={away} form={formOf(away.id)} />
        </div>
        {match.goals.length > 0 && (
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 border-t border-line px-5 py-4 sm:px-10">
            <Scorers goals={match.goals.filter((g) => g.clubId === home.id)} align="right" />
            <span aria-hidden className="text-muted">⚽</span>
            <Scorers goals={match.goals.filter((g) => g.clubId === away.id)} align="left" />
          </div>
        )}
      </section>

      {keyPlayers.length > 0 && (
        <section aria-labelledby="key-players" className="flex flex-col gap-4">
          <h2 id="key-players" className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Key players
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keyPlayers.map((p) => (
              <li key={p.id}>
                <PlayerCard {...playerCardProps(p)} onSelect={() => setSelected(p)} />
              </li>
            ))}
          </ul>
          <PlayerDialog player={selected} onClose={() => setSelected(null)} />
        </section>
      )}

      <section aria-labelledby="standings" className="flex flex-col gap-4">
        <h2 id="standings" className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          Standings
        </h2>
        {standings.length > 0 ? (
          <LeagueTable standings={standings} favouriteClubId={FAVOURITE_CLUB_ID} />
        ) : (
          <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
            No standings yet. The table appears after the first round.
          </p>
        )}
      </section>
    </PageShell>
  );
}
