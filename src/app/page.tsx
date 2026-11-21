import Link from "next/link";
import { Crest } from "@/components/Crest";
import { KitPreview } from "@/components/KitPreview";
import { clubs } from "@/data/clubs";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Época 2026/27</p>
        <h1 className="font-display text-5xl font-extrabold uppercase tracking-tight text-ink">Liga Atlântica</h1>
        <p className="max-w-xl text-muted">Eight invented clubs, one fictional league. A playground for Storybook and Chromatic.</p>
        <Link
          href="/match/r13-farol-gaivotas"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-canvas hover:opacity-90"
        >
          Live: Farol vs Gaivotas →
        </Link>
      </header>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {clubs.map((club) => (
          <li key={club.id} className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-5">
            <KitPreview {...club.kit} size={128} label={`${club.name} home kit`} />
            <div className="flex w-full items-center gap-3 border-t border-line pt-4">
              <Crest club={club} size={28} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{club.name}</p>
                <p className="text-xs text-muted">
                  {club.city} · {club.founded}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
