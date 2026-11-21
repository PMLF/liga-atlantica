import preview from "#.storybook/preview";
import { clubsById } from "@/data/clubs";
import { standings } from "@/data/season";
import { LeagueTable } from "./LeagueTable";

const meta = preview.meta({
  title: "Components/LeagueTable",
  component: LeagueTable,
  parameters: { layout: "padded" },
  argTypes: {
    favouriteClubId: { control: "select", options: [undefined, ...Object.keys(clubsById)] },
    championsLeagueSpots: { control: { type: "number", min: 0, max: 4 } },
    relegationSpots: { control: { type: "number", min: 0, max: 4 } },
    initialSort: {
      control: "select",
      options: ["position", "club", "played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "goalDifference", "points"],
    },
    standings: { control: false },
    className: { table: { disable: true } },
  },
  args: { standings, favouriteClubId: "farol" },
});

export const Default = meta.story({});

export const NoFavourite = meta.story({ args: { favouriteClubId: undefined } });

export const SortedByGoalsAgainst = meta.story({ args: { initialSort: "goalsAgainst" } });

export const PreSeason = meta.story({
  args: {
    standings: standings.map((row, i) => ({
      ...row,
      position: i + 1,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
    })),
  },
});

export const Mobile = meta.story({
  globals: { viewport: { value: "mobile", isRotated: false } },
});
