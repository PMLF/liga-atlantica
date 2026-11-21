import preview from "#.storybook/preview";
import { expect } from "storybook/test";
import { clubsById, getClub } from "@/data/clubs";
import { getMatch } from "@/data/matches";
import { FixtureCard } from "./FixtureCard";

const fixture = (id: string) => {
  const match = getMatch(id)!;
  return { match, home: getClub(match.homeId), away: getClub(match.awayId) };
};

const meta = preview.meta({
  title: "Components/FixtureCard",
  component: FixtureCard,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    home: { control: "select", options: Object.keys(clubsById), mapping: clubsById },
    away: { control: "select", options: Object.keys(clubsById), mapping: clubsById },
    match: { control: "object" },
    className: { table: { disable: true } },
  },
  args: fixture("r13-farol-gaivotas"),
});

export const Live = meta.story({});

export const HalfTime = meta.story({ args: fixture("r13-cabo-pinhal") });

export const ScoreDraw = meta.story({ args: fixture("r13-ribeira-marsalgado") });

export const Upcoming = meta.story({ args: fixture("r14-gaivotas-cabo") });

export const Postponed = meta.story({ args: fixture("r13-penedo-lobos") });

/** With `href`, the whole card is one link whose name includes both clubs for screen readers. */
export const AsLink = meta.story({
  args: { href: "/match/r13-farol-gaivotas" },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: /Farol Atlântico FC v Gaivotas de Vila Serena/ });
    await expect(link).toHaveAttribute("href", "/match/r13-farol-gaivotas");
  },
});
