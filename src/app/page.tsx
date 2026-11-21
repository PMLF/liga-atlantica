import type { ReactNode } from "react";
import { Crest } from "@/components/Crest";
import { FixtureCard } from "@/components/FixtureCard";
import { KitPreview } from "@/components/KitPreview";
import { LeagueTable } from "@/components/LeagueTable";
import { FAVOURITE_CLUB_ID } from "@/data";
import { clubs, getClub } from "@/data/clubs";
import { matches } from "@/data/matches";
import { ROUNDS_PLAYED, standings } from "@/data/season";

const CURRENT_ROUND = ROUNDS_PLAYED + 1;

function SectionHeading({ id, eyebrow, children }: { id: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h2 id={id} className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
        {children}
      </h2>
    </div>
  );
}

export default function Home() {
  const matchday = matches.filter((m) => m.round === CURRENT_ROUND);
  const leader = getClub(standings[0].clubId);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Época 2026/27</p>
        <h1 className="font-display text-5xl font-extrabold uppercase tracking-tight text-ink sm:text-6xl">
          Liga Atlântica
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Eight clubs on the Atlantic coast. {leader.shortName} lead after {ROUNDS_PLAYED} rounds, with matchday{" "}
          {CURRENT_ROUND} under way.
        </p>
      </header>

      <section aria-labelledby="matchday" className="flex flex-col gap-5">
        <SectionHeading id="matchday" eyebrow="Today">
          Matchday {CURRENT_ROUND}
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {matchday.map((match) => (
            <li key={match.id}>
              <FixtureCard
                match={match}
                home={getClub(match.homeId)}
                away={getClub(match.awayId)}
                href={`/match/${match.id}`}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="table" className="flex flex-col gap-5">
        <SectionHeading id="table" eyebrow={`After ${ROUNDS_PLAYED} rounds`}>
          Standings
        </SectionHeading>
        <LeagueTable standings={standings} favouriteClubId={FAVOURITE_CLUB_ID} />
      </section>

      <section aria-labelledby="clubs" className="flex flex-col gap-5">
        <SectionHeading id="clubs" eyebrow="The league">
          Clubs
        </SectionHeading>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {clubs.map((club) => (
            <li key={club.id} className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-5">
              <KitPreview {...club.kit} size={112} label={`${club.name} home kit`} />
              <div className="flex w-full items-center gap-3 border-t border-line pt-4">
                <Crest club={club} size={28} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    <span className="md:hidden">{club.shortName}</span>
                    <span className="hidden md:inline">{club.name}</span>
                  </p>
                  <p className="truncate text-xs text-muted">
                    <span className="hidden md:inline">{club.city} · </span>est. {club.founded}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-line pt-6 text-sm text-muted">
        A fictional league: every club, player and crest is invented. Built to explore Storybook and Chromatic.
      </footer>
    </main>
  );
}
