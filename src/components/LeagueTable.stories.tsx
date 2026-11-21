import preview from "#.storybook/preview";
import { expect, within } from "storybook/test";
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

/** Click "Pts" twice: first sort is highest-first, the second click flips it. */
export const SortByPoints = meta.story({
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const firstClub = () => canvasElement.querySelector("tbody tr")?.getAttribute("data-club");
    const pts = canvas.getByRole("button", { name: "Pts" });

    await step("Highest points first", async () => {
      await userEvent.click(pts);
      await expect(pts.closest("th")).toHaveAttribute("aria-sort", "descending");
      await expect(firstClub()).toBe("gaivotas");
    });

    await step("Click again for lowest first", async () => {
      await userEvent.click(pts);
      await expect(pts.closest("th")).toHaveAttribute("aria-sort", "ascending");
      await expect(firstClub()).toBe("marsalgado");
    });

    await step("Favourite stays highlighted after sorting", async () => {
      const table = within(canvas.getByRole("table"));
      await expect(table.getByText("Your club").closest("tr")).toHaveAttribute("data-club", "farol");
    });
  },
});

/** Sort alphabetically by club name with the keyboard only. */
export const SortByClubWithKeyboard = meta.story({
  play: async ({ canvas, canvasElement, userEvent }) => {
    canvas.getByRole("button", { name: "Club" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvasElement.querySelector("tbody tr")).toHaveAttribute("data-club", "cabo");
  },
});

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
