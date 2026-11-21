import { matches } from "@/data/matches";
import { MatchCentre } from "./MatchCentre";

export function generateStaticParams() {
  return matches.map((m) => ({ id: m.id }));
}

export default async function MatchPage({ params }: PageProps<"/match/[id]">) {
  const { id } = await params;
  return <MatchCentre matchId={id} />;
}
