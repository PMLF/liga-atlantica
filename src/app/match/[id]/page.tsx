import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMatchCentre, matches } from "@/data/matches";
import { MatchCentre } from "./MatchCentre";

export function generateStaticParams() {
  return matches.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/match/[id]">): Promise<Metadata> {
  const data = getMatchCentre((await params).id);
  if (!data) return { title: "Match not found · Liga Atlântica" };
  const { match, home, away } = data;
  const score =
    match.homeScore !== undefined && match.awayScore !== undefined ? `${match.homeScore}–${match.awayScore}` : "vs";
  return {
    title: `${home.shortName} ${score} ${away.shortName} · Liga Atlântica`,
    description: `Round ${match.round} at ${match.venue}: ${home.name} v ${away.name}.`,
  };
}

export default async function MatchPage({ params }: PageProps<"/match/[id]">) {
  const { id } = await params;
  const data = getMatchCentre(id);
  // Cache Components doesn't support `dynamicParams = false`; unknown ids 404 here instead.
  if (!data) notFound();
  return <MatchCentre matchId={id} initialData={data} />;
}
