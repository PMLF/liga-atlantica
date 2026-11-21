# Liga Atlântica

A fictional eight-club Portuguese football league, built as a hands-on playground for
**Storybook 10** and **Chromatic**. Every club, player and crest is invented.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Storybook 10.6
(`@storybook/nextjs-vite`, CSF Factories), Vitest 4 + Playwright, MSW 2, Chromatic.

## Run it

```sh
npm install
npm run dev            # the app → http://localhost:3000 (try /match/r13-farol-gaivotas)
npm run storybook      # Storybook → http://localhost:6006
npm test               # every story as a test: render + play function + a11y
npm run chromatic      # visual tests (needs CHROMATIC_PROJECT_TOKEN, see below)
```

`npm test` reports **1 failure on purpose**: `KitPreview → Low Contrast Nameplate` breaks WCAG
contrast to show the a11y addon working. CI skips it (`CI=1 npm test` to see that locally).

## What's where

| Storybook feature | Where to look |
| --- | --- |
| **CSF Factories** (`preview.meta` / `meta.story`) | Every `*.stories.tsx`; config in `.storybook/main.ts` + `preview.tsx` |
| **Args & controls**, colour pickers, `mapping` | `KitPreview`, `PlayerCard` (club select maps id → object) |
| **Decorators + globals**: light/dark toolbar | `.storybook/preview.tsx` |
| **Viewports**: presets + pinned per story | `preview.tsx`; `Mobile` stories use `globals.viewport` |
| **Play functions** | `LeagueTable → Sort By Points`, `PlayerCard → Selectable`, `Pages/Match → Open Player Details`, `Match Centre → Retry After Error` |
| **Vitest addon** | `vitest.config.ts`; run from terminal (`npm test`) or the sidebar's *Run tests* |
| **A11y addon** (`a11y.test: "error"`) | All stories pass, except the deliberate `Low Contrast Nameplate` |
| **MSW** network mocking | `Pages/Match Centre (network)`: success, loading, 500, 404, empty, retry |
| **Autodocs + MDX** | Every component's *Docs* page; `src/GettingStarted.mdx` |
| **MCP + component manifests** | `.storybook/main.ts`, `AGENTS.md`, `.mcp.json` |
| **Chromatic modes** (light + dark snapshots) | `parameters.chromatic.modes` in `preview.tsx` |

Mock data lives in `src/data/`. The season is simulated from a seeded random number
generator, so standings, form and results are identical on every run, which matters for visual tests.

## AI: Storybook MCP

With Storybook running, agents get an MCP server at `http://localhost:6006/mcp` (registered
for Claude Code in `.mcp.json`; for other agents:
`npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project`).
`AGENTS.md` tells agents to look components up (`docs-list` / `docs-show`) before writing UI,
preview changes (`stories-preview`) and validate with `test-run`.

Browse what agents see at <http://localhost:6006/manifests/components.html>.

**Compare agents with and without MCP** (fresh session each; disable `.mcp.json` for "without"):

1. *"Add a 'Top scorers' section to the match page showing the 5 leading scorers in the league."*
   Does it reuse `PlayerCard` + `playerCardProps` and theme tokens, or hand-roll markup?
2. *"Build a ClubProfile component with crest, kit, recent form and squad, plus stories."*
   Does it compose `Crest` / `KitPreview` / `FormGuide` with real props and write CSF Factories?
3. *"Make LeagueTable rows compact on mobile and add a `dense` option."*
   Does it check existing props first, then preview and run `test-run`?

## Chromatic

1. Create a project at <https://www.chromatic.com/start> and copy its project token.
2. Run locally. The token is read from the environment; never commit it:

   ```sh
   export CHROMATIC_PROJECT_TOKEN=<your token>
   npm run chromatic
   ```

3. For CI, push to GitHub and add the token as the repository secret `CHROMATIC_PROJECT_TOKEN`.
   `.github/workflows/ui-tests.yml` runs on every PR (and on `main` to update baselines):
   - **Vitest:** interaction + a11y tests in headless Chromium.
   - **Chromatic:** visual tests with **TurboSnap** (`onlyChanged`), so only stories whose files
     changed get re-snapshotted. Needs `fetch-depth: 0`.

Options live in `chromatic.config.json`:
- `onlyChanged`: turns on TurboSnap.
- `externals: public/**`: a change to static assets re-tests everything.
- Changes are auto-accepted on `main`.
- `exitZeroOnChanges`: changes are reviewed in Chromatic's UI rather than failing the CLI.

### The regression branch

`demo/visual-regression` has three deliberately subtle bugs, each one commit:

| Bug | Change | Stories that should light up |
| --- | --- | --- |
| PlayerCard padding | body `p-4` → `p-[18px]` (+2px) | all PlayerCard stories, Pages/Match |
| KitPreview hoops | hoops drawn in a slightly darker shade of the secondary colour | KitPreview Hoops, PlayerDialog (Farol), Showcase/Clubs |
| LeagueTable rows | position cell nudged 2px down, out of line with the row | all LeagueTable stories, Pages/Match |

All tests still pass on that branch: these are pixel bugs only visual testing catches.

## What to show in a 5-minute demo

1. **(0:30) The playground.** Open Storybook. *Getting started* page, flip the theme
   toolbar, open `KitPreview → Hoops` and drag the colour pickers. *"Stories are the unit:
   docs, tests and visual baselines all hang off them."*
2. **(1:00) Interaction tests.** `LeagueTable → Sort By Points`: step through the
   Interactions panel. Then hit *Run tests* in the sidebar: same tests, run by Vitest in a
   real browser. Show `npm test` in the terminal giving the same result.
3. **(0:45) Accessibility.** `Low Contrast Nameplate`: the a11y panel shows 1.58:1 vs 4.5:1.
   Tagged so CI skips it; locally it's red.
4. **(0:45) Network states.** `Match Centre (network) → Retry After Error`: MSW fails the first
   request, the play function clicks *Try again*, the real component recovers.
5. **(1:00) Visual regression.** Chromatic build for `demo/visual-regression`: three tiny diffs
   no unit test caught, in light *and* dark mode. Point out the TurboSnap count: unaffected stories
   were skipped.
6. **(1:00) AI.** Ask Claude Code *"Add a Top scorers section to the match page"*. Watch it
   call `docs-list` → `docs-show PlayerCard` → `stories-preview` → `test-run`, reusing real
   components instead of inventing props.
