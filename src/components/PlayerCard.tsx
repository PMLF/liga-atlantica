"use client";

import Image from "next/image";
import { getClub } from "@/data/clubs";
import type { Club, Player, PlayerStats, PlayerStatus, Position } from "@/data/types";
import { cn } from "@/lib/cn";
import { readableOn, shade } from "@/lib/color";
import { countryName, flagEmoji } from "@/lib/country";
import { positionLabels } from "@/lib/positions";
import { Crest } from "./Crest";
import { KitPreview } from "./KitPreview";

export interface PlayerCardProps {
  name: string;
  number: number;
  position: Position;
  /** ISO 3166-1 alpha-2 country code, rendered as a flag emoji. */
  nationality: string;
  club: Club;
  /** When missing, the card falls back to the club shirt with the player's number. */
  photoUrl?: string;
  isCaptain?: boolean;
  status?: PlayerStatus;
  /** Short context for injuries and suspensions, e.g. "Hamstring · back mid-December". */
  statusNote?: string;
  /** Average match rating, 0–10. */
  rating?: number;
  stats: PlayerStats;
  /** Makes the card interactive. The player's name becomes a button covering the card. */
  onSelect?: () => void;
  className?: string;
}

export function playerCardProps(player: Player): PlayerCardProps {
  return {
    name: player.name,
    number: player.number,
    position: player.position,
    nationality: player.nationality,
    club: getClub(player.clubId),
    photoUrl: player.photoUrl,
    isCaptain: player.isCaptain,
    status: player.status,
    statusNote: player.statusNote,
    rating: player.rating,
    stats: player.stats,
  };
}

function statCells(position: Position, stats: PlayerStats) {
  if (position === "GK") {
    return [
      { label: "Apps", value: stats.appearances },
      { label: "Shutouts", value: stats.cleanSheets ?? 0 },
      { label: "Conceded", value: stats.conceded ?? 0 },
    ];
  }
  return [
    { label: "Apps", value: stats.appearances },
    { label: "Goals", value: stats.goals },
    { label: "Assists", value: stats.assists },
  ];
}

const statusStyles: Record<Exclude<PlayerStatus, "available">, { badge: string; note: string; label: string }> = {
  injured: { badge: "bg-[#b42318] text-white", note: "bg-danger-soft text-danger", label: "Injured" },
  suspended: { badge: "bg-[#f5b301] text-[#1a1406]", note: "bg-warning-soft text-warning", label: "Suspended" },
};

export function PlayerCard({
  name,
  number,
  position,
  nationality,
  club,
  photoUrl,
  isCaptain = false,
  status = "available",
  statusNote,
  rating,
  stats,
  onSelect,
  className,
}: PlayerCardProps) {
  const { primary, secondary, pattern } = club.kit;
  const unavailable = status === "available" ? null : statusStyles[status];
  const hasPhoto = Boolean(photoUrl);

  return (
    <article
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface",
        "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.22)]",
        onSelect &&
          "transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgb(0_0_0/0.06),0_18px_40px_-16px_rgb(0_0_0/0.3)] has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-accent has-[button:focus-visible]:ring-offset-2 has-[button:focus-visible]:ring-offset-canvas",
        className,
      )}
    >
      <div
        className={cn("relative aspect-[4/3] overflow-hidden", !hasPhoto && "bg-surface-2")}
        style={hasPhoto ? { background: `linear-gradient(155deg, ${shade(primary, 0.12)} 0%, ${shade(primary, -0.4)} 100%)` } : undefined}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-5 -right-1 select-none font-display text-[8rem] font-extrabold leading-none tracking-tight"
          style={{ color: hasPhoto ? readableOn(primary) : "var(--ink)", opacity: hasPhoto ? 0.16 : 0.06 }}
        >
          {number}
        </span>

        {hasPhoto ? (
          <Image
            src={photoUrl!}
            alt=""
            fill
            unoptimized
            sizes="320px"
            className={cn("object-contain object-bottom", status === "injured" && "grayscale")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pt-1">
            <KitPreview
              primary={primary}
              secondary={secondary}
              pattern={pattern}
              number={number}
              size={128}
              label={`${club.shortName} shirt, number ${number}. No photo available.`}
            />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {isCaptain && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-2.5 text-xs font-semibold text-[#101813] shadow-sm">
              <span className="grid size-5 place-items-center rounded-full bg-[#101813] font-display text-[0.8rem] font-bold text-white">
                C
              </span>
              Captain
            </span>
          )}
          {unavailable && (
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm", unavailable.badge)}>
              {unavailable.label}
            </span>
          )}
        </div>

        <Crest club={club} size={30} className="absolute right-3 top-3 drop-shadow" />

        {rating !== undefined && (
          <span className="absolute bottom-3 left-3 inline-flex items-baseline gap-1 rounded-md bg-black/60 px-2 py-1 text-white backdrop-blur-sm">
            <span className="font-display text-base font-bold tabular-nums leading-none">{rating.toFixed(1)}</span>
            <span className="text-[0.625rem] font-medium uppercase tracking-wider text-white/80">avg</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <p className="truncate text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {club.name} · #{number}
          </p>
          <h3 className="line-clamp-2 break-words font-display text-[1.375rem] font-bold uppercase leading-[1.05] tracking-wide text-ink" title={name}>
            {onSelect ? (
              <button
                type="button"
                onClick={onSelect}
                className="text-left uppercase outline-none after:absolute after:inset-0 after:content-['']"
              >
                {name}
              </button>
            ) : (
              name
            )}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <span role="img" aria-label={countryName(nationality)}>
              {flagEmoji(nationality)}
            </span>
            <span>{positionLabels[position]}</span>
          </p>
        </div>

        {unavailable && statusNote && (
          <p className={cn("rounded-lg px-3 py-2 text-xs font-medium", unavailable.note)}>{statusNote}</p>
        )}

        <dl className="mt-auto grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface-2">
          {statCells(position, stats).map((cell) => (
            <div key={cell.label} className="flex flex-col items-center gap-0.5 py-2.5">
              <dt className="order-2 text-[0.6875rem] font-medium uppercase tracking-wide text-muted">{cell.label}</dt>
              <dd className="font-display text-xl font-bold tabular-nums leading-tight text-ink">{cell.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
