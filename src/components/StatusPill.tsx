import type { MatchStatus } from "@/data/types";
import { cn } from "@/lib/cn";

export interface StatusPillProps {
  status: MatchStatus;
  /** Current minute, shown while the match is live. */
  minute?: number;
  className?: string;
}

const styles: Record<MatchStatus, { label: (minute?: number) => string; className: string }> = {
  live: { label: (minute) => `Live · ${minute ?? 0}'`, className: "bg-loss text-white" },
  "half-time": { label: () => "Half-time", className: "bg-warning-soft text-warning" },
  "full-time": { label: () => "Full-time", className: "bg-surface-2 text-ink" },
  scheduled: { label: () => "Upcoming", className: "bg-accent-soft text-accent" },
  postponed: { label: () => "Postponed", className: "bg-danger-soft text-danger" },
};

/**
 * A match's state at a glance: live minute, half-time, full-time, upcoming or postponed.
 *
 * @import import { StatusPill } from "@/components/StatusPill";
 */
export function StatusPill({ status, minute, className }: StatusPillProps) {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        s.className,
        className,
      )}
    >
      {status === "live" && <span aria-hidden className="size-1.5 rounded-full bg-white motion-safe:animate-pulse" />}
      {s.label(minute)}
    </span>
  );
}
