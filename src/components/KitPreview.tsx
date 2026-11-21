import { useId } from "react";
import type { KitPattern } from "@/data/types";
import { cn } from "@/lib/cn";
import { readableOn, shade, WHITE } from "@/lib/color";

export interface KitPreviewProps {
  /** Main shirt colour. */
  primary: string;
  /** Pattern, collar and cuff colour. */
  secondary: string;
  /** How the two colours are combined on the shirt body. */
  pattern?: KitPattern;
  /** Optional shirt number printed on the front. */
  number?: number;
  /**
   * Optional nameplate shown under the shirt, printed in the kit colours exactly as given.
   * Some kit combinations are low-contrast; the a11y tests catch those (see Low Contrast Nameplate).
   */
  nameplate?: string;
  /** Rendered width of the shirt in pixels. */
  size?: number;
  /** Accessible description of the kit. Defaults to a generated summary. */
  label?: string;
  className?: string;
}

const patternNames: Record<KitPattern, string> = {
  plain: "plain",
  stripes: "striped",
  hoops: "hooped",
  halves: "halved",
};

const SHIRT =
  "M70 20 L50 26 L14 50 L28 86 L46 78 L46 182 Q100 190 154 182 L154 78 L172 86 L186 50 L150 26 L130 20 Q100 42 70 20 Z";
const LEFT_CUFF = "14,50 28,86 31.4,84.5 20.6,45.6";
const RIGHT_CUFF = "186,50 172,86 168.6,84.5 179.4,45.6";

function PatternLayer({ pattern, primary, secondary }: Required<Pick<KitPreviewProps, "pattern" | "primary" | "secondary">>) {
  switch (pattern) {
    case "stripes":
      return (
        <>
          <rect width="200" height="200" fill={primary} />
          {[-36, -4, 28, 60, 92, 124, 156, 188].map((x) => (
            <rect key={x} x={x} width="16" height="200" fill={secondary} />
          ))}
        </>
      );
    case "hoops":
      return (
        <>
          <rect width="200" height="200" fill={primary} />
          {[46, 82, 118, 154].map((y) => (
            <rect key={y} y={y} width="200" height="18" fill={secondary} />
          ))}
        </>
      );
    case "halves":
      return (
        <>
          <rect width="100" height="200" fill={primary} />
          <rect x="100" width="100" height="200" fill={secondary} />
        </>
      );
    default:
      return <rect width="200" height="200" fill={primary} />;
  }
}

/**
 * An SVG football shirt in any two colours and four classic patterns.
 *
 * @import import { KitPreview } from "@/components/KitPreview";
 */
export function KitPreview({
  primary,
  secondary,
  pattern = "plain",
  number,
  nameplate,
  size = 160,
  label,
  className,
}: KitPreviewProps) {
  const id = useId();
  const clipId = `${id}-shirt`;
  const shadeId = `${id}-shade`;
  const numberFill = readableOn(primary);
  const halves = pattern === "halves";
  const rightTrim = halves ? primary : secondary;

  return (
    <figure className={cn("inline-flex flex-col items-center gap-3", className)}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        role="img"
        aria-label={label ?? `${patternNames[pattern]} football shirt${number !== undefined ? `, number ${number}` : ""}`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={SHIRT} />
          </clipPath>
          <linearGradient id={shadeId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <PatternLayer pattern={pattern} primary={primary} secondary={secondary} />
          <polygon points={LEFT_CUFF} fill={secondary} />
          <polygon points={RIGHT_CUFF} fill={rightTrim} />
          <rect width="200" height="200" fill={`url(#${shadeId})`} />
        </g>
        <path d="M70 20 Q100 42 130 20" fill="none" stroke={halves ? shade(primary, -0.3) : secondary} strokeWidth="7" strokeLinecap="round" />
        {/* Outline follows the theme ink so dark kits stay visible on dark backgrounds. */}
        <path d={SHIRT} fill="none" stroke="var(--ink, #000)" strokeOpacity="0.3" strokeWidth="2" strokeLinejoin="round" />
        {number !== undefined && (
          <text
            x="100"
            y="122"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-display)"
            fontWeight="800"
            fontSize="60"
            fill={numberFill}
            stroke={numberFill === WHITE ? "#000" : "#fff"}
            strokeOpacity="0.35"
            strokeWidth="3"
            paintOrder="stroke"
          >
            {number}
          </text>
        )}
      </svg>
      {nameplate && (
        <figcaption
          className="rounded-md px-3 py-1 font-display text-sm font-bold uppercase tracking-[0.12em]"
          style={{ backgroundColor: primary, color: secondary }}
        >
          {nameplate}
        </figcaption>
      )}
    </figure>
  );
}
