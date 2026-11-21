"use client";

import { useEffect, useState } from "react";
import type { MatchCentreData } from "@/data/matches";
import type { MatchStatus } from "@/data/types";
import { MatchView, PageShell } from "./MatchView";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: MatchCentreData };

/** Statuses where the score can still change, so the page keeps refreshing. */
const IN_PLAY: ReadonlySet<MatchStatus> = new Set(["live", "half-time"]);

class MatchRequestError extends Error {}

async function fetchMatch(matchId: string, signal: AbortSignal): Promise<MatchCentreData> {
  const res = await fetch(`/api/matches/${encodeURIComponent(matchId)}`, { signal, cache: "no-store" });
  if (res.status === 404) throw new MatchRequestError("We couldn't find that match.");
  if (!res.ok) throw new MatchRequestError(`Request failed (${res.status}).`);
  try {
    return (await res.json()) as MatchCentreData;
  } catch {
    throw new MatchRequestError("The server sent an unreadable response.");
  }
}

function errorMessage(err: unknown) {
  return err instanceof MatchRequestError ? err.message : "Check your connection and try again.";
}

const isAbort = (err: unknown) => err instanceof DOMException && err.name === "AbortError";

export interface MatchCentreProps {
  matchId: string;
  /** Server-rendered data. When present the page shows it immediately and only polls for updates. */
  initialData?: MatchCentreData;
  /** How often to refresh while the match is in play. */
  refreshIntervalMs?: number;
}

/**
 * The match page with its data lifecycle: shows server-rendered data straight away (or fetches
 * `/api/matches/:id` when there is none), refreshes while the match is in play, and handles
 * loading, error and retry states.
 *
 * @import import { MatchCentre } from "@/app/match/[id]/MatchCentre";
 */
export function MatchCentre({ matchId, initialData, refreshIntervalMs = 30_000 }: MatchCentreProps) {
  const [state, setState] = useState<State>(
    initialData ? { status: "ready", data: initialData } : { status: "loading" },
  );
  const needsFetch = state.status === "loading";
  const inPlay = state.status === "ready" && IN_PLAY.has(state.data.match.status);

  // Initial load, and retries: "Try again" puts the state back to loading, which re-runs this.
  useEffect(() => {
    if (!needsFetch) return;
    const controller = new AbortController();
    fetchMatch(matchId, controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((err) => !isAbort(err) && setState({ status: "error", message: errorMessage(err) }));
    return () => controller.abort();
  }, [matchId, needsFetch]);

  // Background refresh while in play. A failed refresh keeps the last good data on screen.
  useEffect(() => {
    if (!inPlay) return;
    const controller = new AbortController();
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      fetchMatch(matchId, controller.signal)
        .then((data) => setState({ status: "ready", data }))
        .catch(() => {});
    }, refreshIntervalMs);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [matchId, inPlay, refreshIntervalMs]);

  if (state.status === "ready") return <MatchView data={state.data} />;

  if (state.status === "error") {
    return (
      <PageShell>
        <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl font-bold uppercase text-ink">Match unavailable</p>
          <p className="max-w-sm text-sm text-muted">{state.message}</p>
          <button
            type="button"
            onClick={() => setState({ status: "loading" })}
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
        <span className="sr-only" role="status">
          Loading match
        </span>
        <div className="h-64 rounded-2xl bg-surface-2 motion-safe:animate-pulse" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-surface-2 motion-safe:animate-pulse" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-surface-2 motion-safe:animate-pulse" />
      </div>
    </PageShell>
  );
}
