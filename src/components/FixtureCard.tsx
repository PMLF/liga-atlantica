import Link from "next/link";
import type { Club, Match } from "@/data/types";
import { cn } from "@/lib/cn";
import { formatKickoff } from "@/lib/format";
import { Crest } from "./Crest";
import { StatusPill } from "./StatusPill";

export interface FixtureCardProps {
  match: Pick<Match, "status" | "minute" | "homeScore" | "awayScore" | "kickoff" | "venue">;
  home: Club;
  away: Club;
  /** Makes the whole card a link, e.g. to the match page. */
  href?: string;
  className?: string;
}

function TeamRow({ club, score, winner }: { club: Club; score?: number; winner: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Crest club={club} size={26} />
      <span className={cn("min-w-0 flex-1 truncate text-sm", winner ? "font-semibold text-ink" : "text-ink/80")}>
        {club.name}
      </span>
      {score !== undefined && (
        <span className={cn("font-display text-xl tabular-nums", winner ? "font-extrabold text-ink" : "font-bold text-muted")}>
          {score}
        </span>
      )}
    </div>
  );
}

/**
 * A compact fixture: both clubs, the score (or kickoff time) and the match status.
 *
 * @import import { FixtureCard } from "@/components/FixtureCard";
 */
export function FixtureCard({ match, home, away, href, className }: FixtureCardProps) {
  const { date, time } = formatKickoff(match.kickoff);
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined;
  const homeWins = hasScore && match.homeScore! > match.awayScore!;
  const awayWins = hasScore && match.awayScore! > match.homeScore!;
  const title = `${home.name} v ${away.name}`;

  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4",
        href &&
          "transition motion-safe:hover:-translate-y-0.5 hover:border-ink/20 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-canvas",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2 text-xs text-muted">
        <h3 className="truncate">
          {href ? (
            <Link href={href} className="outline-none after:absolute after:inset-0 after:content-['']">
              <span className="sr-only">{title}, </span>
              {match.venue}
            </Link>
          ) : (
            <>
              <span className="sr-only">{title}, </span>
              {match.venue}
            </>
          )}
        </h3>
        <StatusPill status={match.status} minute={match.minute} />
      </header>
      <div className="flex flex-col gap-2.5">
        <TeamRow club={home} score={match.homeScore} winner={homeWins} />
        <TeamRow club={away} score={match.awayScore} winner={awayWins} />
      </div>
      {!hasScore && (
        <p className={cn("text-xs text-muted", match.status === "postponed" && "line-through")}>
          {date} · {time}
        </p>
      )}
    </article>
  );
}
