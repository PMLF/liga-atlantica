"use client";

import { useEffect, useState } from "react";
import type { MatchCentreData } from "@/data/matches";
import { MatchView, PageShell } from "./MatchView";

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: MatchCentreData };

/**
 * Fetches a match from `/api/matches/:id` and renders loading, error and ready states.
 *
 * @import import { MatchCentre } from "@/app/match/[id]/MatchCentre";
 */
export function MatchCentre({ matchId }: { matchId: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/matches/${matchId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "We couldn't find that match." : `Request failed (${res.status}).`);
        return (await res.json()) as MatchCentreData;
      })
      .then((data) => !cancelled && setState({ status: "ready", data }))
      .catch((err: Error) => !cancelled && setState({ status: "error", message: err.message }));
    return () => {
      cancelled = true;
    };
  }, [matchId, attempt]);

  if (state.status === "ready") return <MatchView data={state.data} />;

  if (state.status === "error") {
    return (
      <PageShell>
        <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-bold uppercase text-ink">Match unavailable</p>
          <p className="max-w-sm text-sm text-muted">{state.message}</p>
          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((a) => a + 1);
            }}
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-canvas outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Try again
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div aria-busy="true" className="flex flex-col gap-8">
        <span className="sr-only">Loading match</span>
        <div className="h-64 animate-pulse rounded-2xl bg-surface-2" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-surface-2" />
      </div>
    </PageShell>
  );
}
