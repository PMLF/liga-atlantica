import type { Result } from "@/data/types";
import { cn } from "@/lib/cn";

export interface FormGuideProps {
  /** Results, oldest first. Only the most recent `length` are shown. */
  results: Result[];
  /** Number of slots. Missing results render as empty placeholders so columns stay aligned. */
  length?: number;
  size?: "sm" | "md";
  className?: string;
}

const pill: Record<Result, { className: string; word: string }> = {
  W: { className: "bg-win text-white", word: "won" },
  D: { className: "bg-draw text-white", word: "drew" },
  L: { className: "bg-loss text-white", word: "lost" },
};

/** The last few results as W/D/L pills, oldest on the left. */
export function FormGuide({ results, length = 5, size = "md", className }: FormGuideProps) {
  const recent = results.slice(-length);
  const empty = Math.max(0, length - recent.length);
  const label =
    recent.length === 0
      ? "Form: no matches played"
      : `Form, oldest to most recent: ${recent.map((r) => pill[r].word).join(", ")}`;
  const box = size === "sm" ? "size-5 rounded text-[0.625rem]" : "size-7 rounded-md text-xs";

  return (
    <ol aria-label={label} className={cn("flex items-center", size === "sm" ? "gap-1" : "gap-1.5", className)}>
      {recent.map((r, i) => (
        <li key={i} aria-hidden className={cn("grid place-items-center font-bold leading-none", box, pill[r].className)}>
          {r}
        </li>
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <li key={`empty-${i}`} aria-hidden className={cn("border border-dashed border-line", box)} />
      ))}
    </ol>
  );
}
