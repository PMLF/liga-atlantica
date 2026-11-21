import preview from "#.storybook/preview";
import { StatusPill } from "./StatusPill";

const meta = preview.meta({
  title: "Components/StatusPill",
  component: StatusPill,
  argTypes: {
    status: { control: "inline-radio", options: ["live", "half-time", "full-time", "scheduled", "postponed"] },
    minute: { control: { type: "number", min: 0, max: 120 } },
    className: { table: { disable: true } },
  },
  args: { status: "live" as const, minute: 67 },
});

export const Live = meta.story({});

export const HalfTime = meta.story({ args: { status: "half-time" } });

export const FullTime = meta.story({ args: { status: "full-time" } });

export const Upcoming = meta.story({ args: { status: "scheduled" } });

export const Postponed = meta.story({ args: { status: "postponed" } });
