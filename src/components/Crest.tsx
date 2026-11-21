import { useId } from "react";
import type { Club } from "@/data/types";
import { contrastRatio, readableOn, shade } from "@/lib/color";

export interface CrestProps {
  /** The club whose colours, code and crest style are drawn. */
  club: Pick<Club, "name" | "code" | "kit" | "crest">;
  /** Rendered width in pixels. Height follows the 5:6 crest ratio. */
  size?: number;
  className?: string;
}

const outlines = {
  shield: "M50 4 L92 15 L92 56 C92 86 73 104 50 116 C27 104 8 86 8 56 L8 15 Z",
  heater: "M8 8 L92 8 L92 52 C92 84 72 104 50 116 C28 104 8 84 8 52 Z",
  round: "M50 12 A48 48 0 1 1 49.99 12 Z",
} as const;

function textOn(background: string, preferred: string) {
  return contrastRatio(background, preferred) >= 4.5 ? preferred : readableOn(background);
}

/**
 * A generated club crest built from the club's kit colours and short code.
 *
 * @import import { Crest } from "@/components/Crest";
 */
export function Crest({ club, size = 40, className }: CrestProps) {
  const clipId = useId();
  const { primary, secondary } = club.kit;
  const { shape, motif } = club.crest;
  const outline = outlines[shape];
  const round = shape === "round";
  const textY = motif === "chevron" ? 92 : round ? 68 : 66;
  const plateFill = motif === "band" ? secondary : primary;

  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={size * 1.2}
      role="img"
      aria-label={`${club.name} crest`}
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={outline} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="100" height="120" fill={primary} />
        {motif === "band" && <rect y={round ? 50 : 48} width="100" height="34" fill={secondary} />}
        {motif === "stripes" &&
          [14, 38, 62, 86].map((x) => <rect key={x} x={x - 6} width="12" height="120" fill={secondary} />)}
        {motif === "split" && <rect x="50" width="50" height="120" fill={secondary} />}
        {motif === "chevron" && <polygon points="0,26 50,58 100,26 100,46 50,78 0,46" fill={secondary} />}
        {(motif === "stripes" || motif === "split") && (
          <rect x="14" y={round ? 52 : 50} width="72" height="30" rx="4" fill={primary} stroke={secondary} strokeWidth="3" />
        )}
        <path d={outline} fill="none" stroke={secondary} strokeWidth="8" />
      </g>
      <path d={outline} fill="none" stroke={shade(primary, -0.45)} strokeWidth="2" />
      {motif === "band" && !round && (
        <path
          d="M50 22 l3.2 6.6 7.2 1 -5.2 5 1.3 7.2 -6.5 -3.4 -6.5 3.4 1.3 -7.2 -5.2 -5 7.2 -1 Z"
          fill={secondary}
        />
      )}
      <text
        x="50"
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="26"
        letterSpacing="1"
        fill={textOn(plateFill, motif === "band" ? primary : secondary)}
      >
        {club.code}
      </text>
    </svg>
  );
}
