# Playwright Persona Sessions — live think-aloud usability testing

> Status: **spec / proposal** (May 2026). Greenlight pending from @xram.
> Origin: xram's idea — "hand them a Playwright session, tell them who they are
> and what grant they want to write, let them loose, and record the whole thing
> including their narration of what they're thinking."

## Why this exists

We already do persona reviews. The `/persona-review` skill loads a faculty
persona, has them read `USERGUIDE.md` + the config, and write
`first-impressions-*.md` and `experience-log-*.md` (see
`docs/ux/reviews/round-1/`).

That's a **document-based** review. It catches "the terminology confused me" and
"I couldn't map my project to the workflow." It does **not** catch interaction
friction, because the persona never touches the running app. Every UX fix we've
shipped lately came from interaction friction a doc-read can't see:

- The grant-period chooser highlighting "3 years" *and* "No dates yet" (`19d637f`)
- The wizard not scrolling to top between steps, leaving you stranded (`a5885a0`)
- No way to point at a specific questionnaire node when you're confused (`38a959f`)

A persona reading the user guide sails past all three. A persona **clicking
through the live app** trips on them immediately. That's the gap this closes.

This is persona-review **v2**: same personas, same goal, but the persona drives
the real app via Playwright and narrates think-aloud while a recording rolls.

## The two tracks (don't conflate them)

| | AI-persona session | Real-faculty session |
|---|---|---|
| Who narrates | The agent embodying the persona | A live human faculty member |
| Cost | Cheap, repeatable, runs in CI | Expensive — uses real goodwill |
| Catches | Layout/affordance/flow bugs, dead ends, terminology | All of that **plus** ground-truth confusion we can't predict |
| Recording | Playwright `recordVideo` + trace + narration transcript | Screen recording + mic think-aloud + Playwright trace |
| When | **Pre-flight** — before any human sees it | **Validation** — after pre-flight is clean |

**Recommendation:** AI-persona sessions are the pre-flight. They shake out the
obvious "I clicked the wrong thing / couldn't find X / got stuck on step 3"
flaws *cheaply and repeatably*, so when we put it in front of the one friendly
faculty member (the #root-cellar track), we're not burning their patience on
bugs we could have caught ourselves. Real-faculty think-aloud is the validation
layer on top — it tells us what no persona can predict.

Both produce the same artifact shape (video + narration + verdict), so they
file into the same review folder and read side by side.

## Session brief — the unit of work

A session is one persona + one goal + success criteria. Briefs live in
`docs/ux/sessions/` and reference an existing persona by folder name so we
never duplicate the persona definition. See `_session-brief-template.yaml`.

```yaml
session_id: "s01-frindt-fda-dmp"
persona: "07-frindt-sela"          # existing folder in docs/ux/personas/
goal: >
  You're writing an NSF proposal for the cardiac stent simulation. You need a
  Data Management Plan and a rough cost estimate. The data is FDA-regulated and
  involves hospital patient imaging. Produce a DMP you'd be willing to attach.
start_url: "/"
success_criteria:
  - "Reaches a tier determination for the patient-imaging data"
  - "Generates a DMP draft covering all three of her projects' data types"
  - "Produces a cost estimate she can put a dollar figure on"
narration_protocol: "think-aloud"  # narrate intent BEFORE each click, reaction AFTER
record: ["video", "trace", "narration"]
```

## What gets recorded

Each session emits, into `docs/ux/reviews/playwright/{session_id}/`:

1. **`video.webm`** — Playwright `recordVideo` of the whole run.
2. **`trace.zip`** — Playwright trace (DOM snapshots, network, every action).
3. **`narration.md`** — the think-aloud transcript, timestamped, interleaved
   with the action that triggered each line. This is the gold. "I'm looking for
   where to enter my grant dates... I don't see it... oh, it's hidden until I
   pick a period, okay" is a finding in one sentence.
4. **`verdict.md`** — structured: did they reach each success criterion? Where
   did they stall (with the URL/hash — now that we have deep-linkable nodes,
   every stall point is addressable)? Top 3 friction moments ranked.

## Architecture (proposed)

- **Driver:** Playwright MCP (the agent drives the browser tool-by-tool, which
  is what makes think-aloud natural — it narrates each tool call) **or**
  `@playwright/test` scripted runs with the agent as narrator. MCP is the better
  fit for exploratory "let them loose" sessions; scripted is better for
  regression ("does Frindt's happy path still work after this change?").
- **Target:** staging (`openresearchdataplanner.dev.xram.net`) for live runs, or
  the dev server for branch testing.
- **The stall map:** because the questionnaire now reflects to `#q-<id>` and the
  wizard step is addressable, `verdict.md` can cite the exact node a persona got
  stuck on. The "I don't understand this!" support-string feature and this
  testing harness are the same idea pointed in two directions — one for
  confused humans, one for confused personas.

## Ownership

- **Mine (@piper):** session briefs, the persona→goal mapping, the verdict
  schema, a `/persona-session` skill spec, and reading/triaging the narration
  output into findings. This is the same work as the existing persona-review
  skill, one layer more live.
- **Marco / coder:** the Playwright runner itself — installing the tooling,
  wiring `recordVideo`/trace, the narration-capture plumbing. New dependency
  (`@playwright/test`), so it's a real code commit, not a doc change.

## Open question for @xram

When you said "hand *them* a Playwright session" — did you mean:

- **(A)** AI personas driving Playwright (the pre-flight above — repeatable,
  catches flow bugs, no humans needed), or
- **(B)** real faculty in a recorded Playwright-instrumented session (the
  validation track, overlaps the #root-cellar friendly-faculty plan), or
- **(C)** both, sequenced — A as the gate before B?

My vote is **C**: build the AI-persona harness first (it's mostly assembly on
top of the persona machinery we already have), use it to scrub the flow, *then*
hand the cleaned-up app to the friendly faculty member with the same brief
format. Same scripts, two narrators.
