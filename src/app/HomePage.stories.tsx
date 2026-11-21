import preview from "#.storybook/preview";
import Home from "./page";

const meta = preview.meta({
  title: "Pages/Home",
  component: Home,
  parameters: { layout: "fullscreen" },
  tags: ["!manifest"],
});

export const Default = meta.story({});

export const Mobile = meta.story({
  globals: { viewport: { value: "mobile", isRotated: false } },
});
