import preview from "#.storybook/preview";
import { expect, waitFor } from "storybook/test";
import { getMatchCentre } from "@/data/matches";
import { MatchView } from "./MatchView";

const meta = preview.meta({
  title: "Pages/Match",
  component: MatchView,
  parameters: { layout: "fullscreen" },
  args: { data: getMatchCentre("r13-farol-gaivotas")! },
});

export const Live = meta.story({});

/** Click a key player to open their profile, then close it. */
export const OpenPlayerDetails = meta.story({
  play: async ({ canvas, userEvent, step }) => {
    const name = "Duarte Valadares";
    await step("Open the dialog", async () => {
      await userEvent.click(canvas.getByRole("button", { name }));
      const dialog = await canvas.findByRole("dialog", { name });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveTextContent("Appearances");
    });
    await step("Close it", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Close" }));
      await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
    });
  },
});

export const HalfTime = meta.story({ args: { data: getMatchCentre("r13-cabo-pinhal")! } });

export const FullTime = meta.story({ args: { data: getMatchCentre("r13-ribeira-marsalgado")! } });

export const Upcoming = meta.story({ args: { data: getMatchCentre("r14-gaivotas-cabo")! } });

export const Postponed = meta.story({ args: { data: getMatchCentre("r13-penedo-lobos")! } });

export const Mobile = meta.story({
  globals: { viewport: { value: "mobile", isRotated: false } },
});
