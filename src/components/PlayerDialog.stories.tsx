import preview from "#.storybook/preview";
import { expect, fn, waitFor } from "storybook/test";
import { getPlayer } from "@/data/players";
import { PlayerDialog } from "./PlayerDialog";

const meta = preview.meta({
  title: "Components/PlayerDialog",
  component: PlayerDialog,
  // A modal per story would stack up on the autodocs page, so these stories only render individually.
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: { player: { control: false } },
  args: { player: getPlayer("farol-9"), onClose: fn() },
});

export const Outfield = meta.story({
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("dialog", { name: "Duarte Valadares" })).toBeVisible();
  },
});

export const Goalkeeper = meta.story({ args: { player: getPlayer("farol-1") } });

export const Injured = meta.story({ args: { player: getPlayer("farol-17") } });

export const ClosesViaButton = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Close" }));
    // The native dialog fires `close` asynchronously, so wait for it.
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce());
  },
});
