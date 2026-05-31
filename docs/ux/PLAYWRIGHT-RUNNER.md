# Persona-session runner — the code half

This is the runner that drives [PLAYWRIGHT-PERSONA-SESSIONS.md](./PLAYWRIGHT-PERSONA-SESSIONS.md).
Piper's spec defines the *what* (briefs, personas, verdict schema, the
`/persona-session` skill). This is the *how*: the tooling that loads a brief,
opens the live app, records the run, and files the artifacts.

## One-time setup

```bash
npm install                    # pulls @playwright/test
npx playwright install chromium
```

## The two modes

A session is one persona + one goal + success criteria (a brief in
`docs/ux/sessions/`). The runner can drive it two ways — the same split as the
spec's two tracks.

### MCP / exploratory — "let them loose" (the default, what xram asked for)

The agent embodies the persona and drives the browser tool-by-tool, narrating
think-aloud. This catches the confusion a scripted path can't predict.

```bash
node scripts/persona-session.mjs s01-frindt-fda-dmp
```

This scaffolds `docs/ux/reviews/playwright/s01-frindt-fda-dmp/`, writes the
**session packet** (the persona prompt + goal + how to narrate + how to cite
stalls), seeds `narration.md` / `verdict.md`, and prints the exact
`@playwright/mcp` command that records video + trace into the folder. Load the
packet as context, run the browser, pursue the goal in character, and narrate
into `narration.md`. The `/persona-session` skill automates this loop.

### Scripted — regression ("does Frindt's happy path still work?")

A deterministic flow that proves the recording harness works and guards the core
affordances each brief leans on (the questionnaire starts, the node reflects to
`#q-<id>`, the "I don't understand this!" button is present, calculators load).
Not a think-aloud run — a guard.

```bash
node scripts/persona-session.mjs s01-frindt-fda-dmp --mode scripted
# or directly:
SESSION_ID=s01-frindt-fda-dmp npx playwright test
```

### Useful flags

```bash
node scripts/persona-session.mjs --list           # all briefs + their personas
node scripts/persona-session.mjs s03-vex-cost-budget --target local   # against npm run dev
node scripts/persona-session.mjs s02-... --url https://my-branch.example   # explicit target
node scripts/persona-session.mjs s01-... --mode scripted --headed         # watch it run
```

Targets: `staging` / `dev` both resolve to the Northwinds dev site
(`openresearchdataplanner.dev.xram.net`); `local` is `http://localhost:5173`.

## What lands in the review folder

`docs/ux/reviews/playwright/<session_id>/`:

| file | what | committed? |
|---|---|---|
| `session-packet.md` | the agent's brief for this run (regenerated) | no (gitignored) |
| `narration.md` | timestamped think-aloud — **the gold** | yes |
| `verdict.md` | scored against success criteria (Piper's schema) | yes |
| `video.webm` | full screen recording | no (heavy) |
| `trace.zip` | Playwright trace — `npx playwright show-trace trace.zip` | no (heavy) |

Findings (`narration.md`, `verdict.md`) are tracked so they read side-by-side
with the document-based reviews in `docs/ux/reviews/`. The heavy binaries are
regenerable, so they stay local.

## How it's wired

- `tests/persona-sessions/harness.mjs` — pure core: load + validate a brief,
  resolve its target, assemble the session packet / narration header / verdict
  scaffold. No Playwright import, so `npm test` (vitest) covers it.
- `tests/persona-sessions/harness.test.js` — unit guards on that core.
- `tests/persona-sessions/session.spec.mjs` — the scripted `@playwright/test`
  run that records video + trace and writes narration.
- `scripts/persona-session.mjs` — the CLI that ties it together.
- `playwright.config.js` — Playwright defaults (Chromium, patient timeouts for a
  live remote target). Separate from vitest; they don't overlap.

## Selector note

The app ships no `data-testid` attributes, so the scripted run uses text/role
selectors (`getByRole('button', { name: /start questionnaire/i })`) and the
`#q-<id>` hash for stall citation. If a future change needs stabler hooks for
regression, adding test ids to the questionnaire controls is the place to start.
