import preview from "#.storybook/preview";
import { clubs } from "@/data/clubs";
import { Crest } from "./Crest";
import { KitPreview } from "./KitPreview";

const meta = preview.meta({
  title: "Components/KitPreview",
  component: KitPreview,
  argTypes: {
    primary: { control: "color" },
    secondary: { control: "color" },
    pattern: { control: "inline-radio", options: ["plain", "stripes", "hoops", "halves"] },
    number: { control: { type: "number", min: 1, max: 99 } },
    size: { control: { type: "range", min: 80, max: 320, step: 8 } },
    label: { control: "text" },
    className: { table: { disable: true } },
  },
  args: {
    primary: "#1d3b8b",
    secondary: "#f2b705",
    pattern: "hoops" as const,
    size: 200,
  },
});

export const Plain = meta.story({
  args: { primary: "#0b7fc0", secondary: "#ffffff", pattern: "plain" },
});

export const Stripes = meta.story({
  args: { primary: "#146c3a", secondary: "#ffffff", pattern: "stripes" },
});

export const Hoops = meta.story({});

export const Halves = meta.story({
  args: { primary: "#b3261e", secondary: "#ffffff", pattern: "halves" },
});

export const WithNumberAndNameplate = meta.story({
  args: { number: 10, nameplate: "Mendiluce" },
});

/**
 * ❌ Deliberately inaccessible: white nameplate text on a yellow shirt is ~1.6:1,
 * well below WCAG AA's 4.5:1. The a11y addon flags `color-contrast` and the test fails.
 * Tagged `known-a11y-failure` so CI can skip it (see vitest.config.ts).
 */
export const LowContrastNameplate = meta.story({
  tags: ["known-a11y-failure"],
  args: { primary: "#f2c94c", secondary: "#ffffff", pattern: "plain", number: 7, nameplate: "Salgueiro" },
});

export const AllClubKits = meta.story({
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {clubs.map((club) => (
        <li key={club.id} className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-5">
          <KitPreview {...club.kit} size={128} label={`${club.name} home kit`} />
          <div className="flex w-full items-center gap-2.5 border-t border-line pt-4">
            <Crest club={club} size={24} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{club.shortName}</p>
              <p className="text-xs capitalize text-muted">{club.kit.pattern}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ),
});
