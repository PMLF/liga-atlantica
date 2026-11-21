"use client";

import { useEffect, useRef } from "react";
import { getClub } from "@/data/clubs";
import type { Player } from "@/data/types";
import { countryName, flagEmoji } from "@/lib/country";
import { positionLabels } from "@/lib/positions";
import { Crest } from "./Crest";
import { KitPreview } from "./KitPreview";

export interface PlayerDialogProps {
  /** The player to show. `null` closes the dialog. */
  player: Player | null;
  onClose: () => void;
}

/** Modal with a player's full profile. Built on the native `<dialog>` element. */
export function PlayerDialog({ player, onClose }: PlayerDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (player && !dialog.open) dialog.showModal();
    if (!player && dialog.open) dialog.close();
  }, [player]);

  const club = player ? getClub(player.clubId) : null;
  const gk = player?.position === "GK";
  const stats = player
    ? [
        { label: "Appearances", value: player.stats.appearances },
        gk
          ? { label: "Clean sheets", value: player.stats.cleanSheets ?? 0 }
          : { label: "Goals", value: player.stats.goals },
        gk ? { label: "Conceded", value: player.stats.conceded ?? 0 } : { label: "Assists", value: player.stats.assists },
        { label: "Avg rating", value: player.rating.toFixed(1) },
      ]
    : [];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="player-dialog-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {player && club && (
        <div className="flex flex-col">
          <div
            className="flex items-center gap-5 px-6 pb-5 pt-6"
            style={{ background: `linear-gradient(135deg, ${club.kit.primary}22, transparent 70%)` }}
          >
            <KitPreview {...club.kit} number={player.number} size={96} />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted">
                <Crest club={club} size={18} />
                <span className="truncate">{club.name}</span>
              </span>
              <h2 id="player-dialog-title" className="font-display text-3xl font-bold uppercase leading-none">
                {player.name}
              </h2>
              <p className="text-sm text-muted">
                #{player.number} · {positionLabels[player.position]} ·{" "}
                <span aria-hidden>{flagEmoji(player.nationality)}</span> {countryName(player.nationality)}
              </p>
            </div>
          </div>

          {player.status !== "available" && player.statusNote && (
            <p className="mx-6 rounded-lg bg-warning-soft px-3 py-2 text-sm font-medium text-warning">
              {player.statusNote}
            </p>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 bg-surface px-4 py-3">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">{s.label}</dt>
                <dd className="font-display text-2xl font-bold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>

          <form method="dialog" className="flex justify-end px-6 py-4">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-canvas outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Close
            </button>
          </form>
        </div>
      )}
    </dialog>
  );
}
