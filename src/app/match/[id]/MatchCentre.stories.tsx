import preview from "#.storybook/preview";
import { delay, http, HttpResponse } from "msw";
import { expect, waitFor } from "storybook/test";
import { getMatchCentre } from "@/data/matches";
import { MatchCentre } from "./MatchCentre";

const MATCH_ID = "r13-farol-gaivotas";
const url = `/api/matches/${MATCH_ID}`;
const data = getMatchCentre(MATCH_ID)!;

/**
 * The match page's data lifecycle. Each story stubs `GET /api/matches/:id` with MSW,
 * so the real fetch, retry and polling code runs against a fake network.
 */
const meta = preview.meta({
  title: "Pages/Match Centre (network)",
  component: MatchCentre,
  parameters: { layout: "fullscreen" },
  argTypes: { initialData: { control: false } },
  args: { matchId: MATCH_ID },
});

export const Success = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(url, () => HttpResponse.json(data)));
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("heading", { name: "Key players" })).toBeVisible();
  },
});

export const Loading = meta.story({
  beforeEach({ msw }) {
    msw.use(
      http.get(url, async () => {
        await delay("infinite");
        return HttpResponse.json(data);
      }),
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Loading match")).toBeInTheDocument();
  },
});

export const NetworkFailure = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(url, () => HttpResponse.error()));
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Check your connection");
  },
});

export const ServerError = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(url, () => new HttpResponse(null, { status: 500 })));
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Request failed (500)");
  },
});

export const NotFound = meta.story({
  args: { matchId: "r99-nowhere" },
  beforeEach({ msw }) {
    msw.use(http.get("/api/matches/:id", () => HttpResponse.json({ error: "Match not found" }, { status: 404 })));
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("alert")).toHaveTextContent("couldn't find that match");
  },
});

export const EmptyStandings = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(url, () => HttpResponse.json({ ...data, standings: [] })));
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/No standings yet/)).toBeVisible();
  },
});

/** Fails once, then succeeds when the user clicks "Try again". */
export const RetryAfterError = meta.story({
  beforeEach({ msw }) {
    msw.use(
      http.get(url, () => new HttpResponse(null, { status: 503 }), { once: true }),
      http.get(url, () => HttpResponse.json(data)),
    );
  },
  play: async ({ canvas, userEvent, step }) => {
    await step("First request fails", async () => {
      await expect(await canvas.findByRole("alert")).toBeVisible();
    });
    await step("Retry recovers", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
      await waitFor(() => expect(canvas.queryByRole("alert")).not.toBeInTheDocument());
      await expect(await canvas.findByRole("heading", { name: "Key players" })).toBeVisible();
    });
  },
});

/** Requests seen by the live-update story, so its play function can check that polling stops. */
let liveRequests = 0;

/**
 * Server-rendered data shows instantly; while the match is in play the page polls for updates.
 * The stubbed server answers with the final whistle, so polling stops after one request
 * (which also keeps Chromatic's snapshot deterministic).
 */
export const LiveScoreUpdate = meta.story({
  args: { initialData: data, refreshIntervalMs: 300 },
  beforeEach({ msw }) {
    liveRequests = 0;
    const equaliser = { clubId: "gaivotas", player: "Kaito Morishima", minute: 88 };
    msw.use(
      http.get(url, () => {
        liveRequests++;
        return HttpResponse.json({
          ...data,
          match: {
            ...data.match,
            status: "full-time",
            minute: undefined,
            awayScore: 2,
            goals: [...data.match.goals, equaliser],
          },
        });
      }),
    );
  },
  play: async ({ canvas, step }) => {
    await step("Server-rendered score, no loading state", async () => {
      await expect(canvas.getByLabelText("Farol 2, Gaivotas 1")).toBeVisible();
    });
    await step("A poll brings in the late equaliser and the final whistle", async () => {
      await expect(await canvas.findByLabelText("Farol 2, Gaivotas 2", {}, { timeout: 3000 })).toBeVisible();
      await expect(canvas.getByText("Full-time")).toBeVisible();
    });
    await step("Polling stops once the match is over", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await expect(liveRequests).toBe(1);
    });
  },
});
