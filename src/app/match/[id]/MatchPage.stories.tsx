import preview from "#.storybook/preview";
import { getMatchCentre } from "@/data/matches";
import { MatchView } from "./MatchView";

const meta = preview.meta({
  title: "Pages/Match",
  component: MatchView,
  parameters: { layout: "fullscreen" },
  args: { data: getMatchCentre("r13-farol-gaivotas")! },
});

export const Live = meta.story({});

export const HalfTime = meta.story({ args: { data: getMatchCentre("r13-cabo-pinhal")! } });

export const FullTime = meta.story({ args: { data: getMatchCentre("r13-ribeira-marsalgado")! } });

export const Upcoming = meta.story({ args: { data: getMatchCentre("r14-gaivotas-cabo")! } });

export const Postponed = meta.story({ args: { data: getMatchCentre("r13-penedo-lobos")! } });

export const Mobile = meta.story({
  globals: { viewport: { value: "mobile", isRotated: false } },
});
