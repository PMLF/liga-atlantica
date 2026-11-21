# Liga Atlântica: agent guide

A fictional Portuguese football league (Next.js App Router + Storybook 10). All clubs, players
and crests are invented. Never add real club names, badges or players.

## Before you write any UI: use the Storybook MCP

Storybook runs an MCP server at `http://localhost:6006/mcp` (start it with `npm run storybook`).
It is registered for Claude Code in `.mcp.json` as `storybook`. If its tools aren't available,
start Storybook and ask the user to reconnect; don't fall back to guessing.

1. **Discover first.** Call `docs-list`, then `docs-show` for every component you might use.
   Reuse existing components (`Crest`, `KitPreview`, `PlayerCard`, `PlayerDialog`, `FormGuide`,
   `LeagueTable`) instead of writing new markup for the same thing.
2. **Only use documented props.** If `docs-show` doesn't list a prop, it doesn't exist. Say so
   rather than inventing one.
3. **Before writing stories,** call `get-storybook-story-instructions` and follow it.
4. **After any visual change,** call `stories-preview` and include the returned URLs in your reply.
5. **Validate with `test-run`** (renders, play functions and a11y). Fix failures before reporting
   done. The only expected failure is `components-kitpreview--low-contrast-nameplate`.

## Project conventions

- **Stories use CSF Factories:** `import preview from "#.storybook/preview"`, then
  `preview.meta({...})` and `meta.story({...})`. Use `as const` for string-literal args in `meta`.
- **Colours come from theme tokens** (`bg-surface`, `text-ink`, `text-muted`, `border-line`,
  `bg-accent`, `bg-win`/`bg-draw`/`bg-loss`), never raw hex values, so dark mode keeps working.
  Kit colours are the exception: they come from data.
- **Mock data lives in `src/data/`;** import from `@/data/...`. Use `playerCardProps(player)` to
  turn a `Player` into `PlayerCard` props.
- **Data-fetching components get MSW stories:** stub responses with
  `beforeEach({ msw }) { msw.use(http.get(...)) }`. See `MatchCentre.stories.tsx`.
- **Every new component needs a JSDoc description with an `@import` tag**
  (e.g. `@import import { X } from "@/components/X";`) so the manifest shows the right import line.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
