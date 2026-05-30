# Session briefs — Playwright persona sessions

Each file here is one **session brief**: one persona + one goal + checkable
success criteria, written second-person AS the instructions handed to the
persona. See [`../PLAYWRIGHT-PERSONA-SESSIONS.md`](../PLAYWRIGHT-PERSONA-SESSIONS.md)
for the design and [`_session-brief-template.yaml`](_session-brief-template.yaml)
for the format.

Briefs reference an existing persona by folder name in `../personas/` — they
never redefine the persona.

## The first three (the spread)

These deliberately probe three different failure modes, not just the happy path:

| Brief | Persona | Archetype | What it stresses |
|-------|---------|-----------|------------------|
| [`s01-frindt-fda-dmp`](s01-frindt-fda-dmp.yaml) | Dr. Sela Frindt (BME) | compliance juggler | Multi-tier, multi-compliance in one proposal. FDA + HIPAA + harmless student data. Does the tool separate them or blanket everything high? The de-identification derate. |
| [`s02-bramford-openscience-dmp`](s02-bramford-openscience-dmp.yaml) | Dr. Lina Bramford (Env Sci) | open-science evangelist | The low-tier happy path **and** cost-at-scale (~40TB). Does open science feel first-class? Does the cost estimate show the jump past free 1TB? FAIR guidance in the DMP? |
| [`s03-vex-cost-budget`](s03-vex-cost-budget.yaml) | Dr. Torben Vex (Physics) | skeptic / greybeard | The cost estimator from a hostile-but-fair angle. Itemized enough to audit? Minimal click-through to a dollar figure? Does an expert hit novice-oriented friction? |

Frindt is "I'm confused." Vex is "you're wasting my time / I don't believe this
number." Bramford is "don't over-warn me." Three different ways the app can fail
a real person — caught for free before any friendly faculty member spends their
goodwill.

## Running a session

Pending Marco's Playwright runner (the `@playwright/test` dependency + narration
plumbing). Once it exists, each brief emits into
`../reviews/playwright/{session_id}/`: `video.webm`, `trace.zip`, `narration.md`,
`verdict.md`.
