import preview from "#.storybook/preview";
import type { Result } from "@/data/types";
import { FormGuide } from "./FormGuide";

const meta = preview.meta({
  title: "Components/FormGuide",
  component: FormGuide,
  argTypes: {
    results: { control: "object" },
    length: { control: { type: "number", min: 1, max: 10 } },
    size: { control: "inline-radio", options: ["sm", "md"] },
    className: { table: { disable: true } },
  },
  args: { results: ["W", "D", "W", "L", "W"] as Result[] },
});

export const Default = meta.story({});

export const Small = meta.story({ args: { size: "sm" } });

export const FewerThanFive = meta.story({ args: { results: ["W", "L"] } });

export const Empty = meta.story({ args: { results: [] } });

export const LongHistory = meta.story({
  args: { results: ["L", "L", "L", "W", "W", "D", "W", "W"] },
});
