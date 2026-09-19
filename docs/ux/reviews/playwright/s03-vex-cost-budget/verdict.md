# Verdict — s03-vex-cost-budget

> Scored after the run. Schema owned by @piper (PLAYWRIGHT-PERSONA-SESSIONS.md).

**Persona:** 01-vex-torben
**Run:** 2026-07-09 — live exploratory walk on the merged build (`cb5948c` + in-flight column work), fresh Playwright contexts, state traces archived
**Analyst:** piper-nakamoto

## Correction (2026-07-22) — added after the fixes landed

Reconciled against live re-probes on the fixed build (`20fa893`, `5b49196` on `feat/fre-exception-branch`). Two of this run's three defects were real and are fixed; the third was **not a real bug**.

- **Stall #1 / empty handoff — CONFIRMED, FIXED.** The blank `<main>` was a layout-shell bug: a per-route `<Suspense>` around views that have no async setup, plus `<Transition mode="out-in">` with no stable root element to track, dropped the enter on *every* same-layout client nav (the reshoot only caught two seams because it navigates via full reloads). Every client-side nav renders now, transition kept. `20fa893`.
- **Stall #2 / "the grant Continue that eats your answer" — WITHDRAWN (probe artifact).** Under a *normal* click the inline Continue advances and preserves the tier, and the wiring has no Continue→backward path at all. My Jul 9 trace used **forced coordinate clicks**, which punched through the sticky slate bar (`z-40`) overlapping the inline button and landed on its **Back** → `previousStep`. Not user-reachable. The real thing underneath was the tier-step *jiggle* (below), which made the button genuinely hard to hit — a better explanation for the operator's Jun 22 "stuck between risk tiers" than a wiring fault.
- **The jiggle — CONFIRMED, FIXED.** The header collapsed on a single scroll threshold and the collapse dragged the scroll back across it — an endless wobble on the tier step (Reg's "element is not stable"). Hysteresis fixes it; geometry now settles. `5b49196`.

The cost-audit findings (stall #3 — invisible banding, the "from $0.04/SU" catalog card) **stand unchanged** and remain board task **#1458**. The scoring below is the Jul 9 record as written; read stall #2 through this correction.

## Success criteria

- [x] Produces a credible total cost estimate (compute + storage) for the alloy project that he'd put in a grant budget
      - Result: **PASS** — Monthly $3,226 / grant-period (36 mo) **$116,145**, itemized per service (HPC Compute $3,200/mo, NorthStar $26/mo), with Markdown + JSON export. The math is *correct*: 50,000 SU/mo prices as marginal bands (10k × $0.08 + 40k × $0.06 = $3,200), and 8 TB NorthStar prices net of the 500 GB free floor (7.5 × $3.50 = $26.25). Verified by hand against `services.yaml`.
      - Evidence: narration `[05:20]`, results screenshot; config cross-check.

- [x] Reaches a medium-tier determination for the unpublished/patent-sensitive work without over-classifying it
      - Result: **PASS** — `human_subjects:No → biological_samples:No → government_data:NSF → export_control:No → proprietary_check:NDA` lands **L2 — Medium** in five questions / six clicks. No over-classification pressure at any point, and the summary explicitly frames itself as "classification guidance, not a final determination." The strongest part of the tool for this persona.
      - Evidence: narration `[00:45]`–`[02:10]`, `#q-proprietary_check`, questionnaire-result screenshot.

- [ ] The cost figure is itemized enough that a skeptic can sanity-check it (not just one opaque number)
      - Result: **PARTIAL FAIL** — Per-service itemization exists (good), but the tiered-band math is invisible: the results table shows $3,200 with no per-band lines and no effective rate, while the catalog card advertised "Tiered pricing **from $0.04/SU**" — the *cheapest* band (`ServiceSelectStep.vue:244` renders `tiers[last].price`). 50,000 × $0.04 = $2,000 ≠ $3,200, and nothing on any screen reconciles the two. The free-allocation split ("0.5 TB included free / 7.5 TB billable") shows in the slate but not in this results table. The engine already returns the breakdown (`computeServiceCost().breakdown`, `freeUnits`, `billable`) — it just isn't rendered here.
      - Evidence: narration `[04:25]`, `[05:40]`; `band detail visible: False`, `free allocation shown: False` on `/` results. Directly feeds board task **#1458** (pricing-values review).

- [ ] He gets to a usable number with minimal click-through — narrate if it feels padded
      - Result: **PARTIAL FAIL** — The designed path is genuinely lean (~14 real actions landing→number; presets everywhere; software step doesn't argue; zero fluff questions). But two traps inflate the real path: **(1)** the questionnaire→wizard handoff renders a blank page (forced refresh), and **(2)** the grant step's in-card Continue silently navigates *backward and clears the tier*, looping the user until they discover the other Continue. Neither is padding — both are defects — but the effect on click count and trust is the same.
      - Evidence: narration `[02:20]`, `[03:00]`–`[03:40]`; stall table below.

- [ ] Does not abandon the tool out of impatience before reaching a budget figure
      - Result: **FAIL (conditional)** — Vex-the-persona finished, because a greybeard reflexively refreshes blank pages and will try the second identical button out of spite. But the grant-step loop ("I answer, it un-answers") is a precision match for this persona's walk-in prior — *"every wizard IT has shown me wasted my time"* — and for the operator's own Jun 22 demo failure ("stuck in between risk tiers"). For the real skeptics this brief represents, abandonment at the loop is the expected outcome until the two defects land fixes.
      - Evidence: narration `[03:20]`, `[07:00]`; xram board report >>01KVRTTA5J5HK27VW6Q5T5B19E (Jun 22).

## Where they stalled

| # | Node / route | What confused them | Severity |
|---|--------------|--------------------|----------|
| 1 | `/tier-check` summary → `/` (handoff) | "Continue to Service Selection" client-nav renders an **empty view** (hero + footer only). Hard reload of the same URL renders fine, with tier + step intact. Reproduced 3/3 in fresh contexts across a dev-server restart. Same fingerprint as the `/ai` applet-card mount bug (filed Jul 9) — **the empty-view family is not limited to the AI catalog.** | Critical |
| 2 | Wizard `/`, Grant Period step | Dual nav renders two Continue buttons; the **in-card** Continue fires the backward-navigation path: state trace shows `current_step grant-period → tier-select`, `completed_steps` drops `tier-select`, **`tier: medium → null`** (back-nav's clear-downstream-data behavior). The slate-bar Continue advances correctly. The in-card Back is a no-op on this step. Users loop tier↔grant losing their answer each pass. | Critical |
| 3 | `/` results (Budget tab) | Tiered-band math invisible: $3,200/mo not reconcilable from the advertised "from $0.04/SU" without reading `services.yaml`. No per-band lines, no effective rate, no free-floor split in the breakdown table (slate has it; results doesn't). A skeptic cannot defend the number to a program officer from this screen. | High |
| 4 | Services step | Defaults to the **Use Bundles** tab (curated, "Recommended" chips); the raw catalog is one tab away. Selection control is an unlabeled circle-plus (first click landed on "View requirements"). Minor friction, but it reads as novice-first to an expert. | Low |
| 5 | `#q-export_control` | "No / Not sure" is a single option on the clean-exit path. For export control, *not sure* is not *no* — the unsure researcher arguably belongs in the new FRE sub-branch, not waved through. (Design note for @nora's lane.) | Low |

## Top 3 friction moments (ranked)

1. **The grant-step Continue that eats your answer** — Two visually identical Continue buttons; the in-card one navigates backward and clears the tier (data loss, silent). This is the loop that matches xram's Jun 22 "stuck between risk tiers" demo report. It hits every user who clicks the button nearest their last action — i.e., most of them. Fix shape: the in-card nav's wiring on Grant Period (and audit the other steps' in-card pairs); or drop the dual nav.

2. **Blank page at the handoff** — The tool's best moment (questionnaire nails the tier, offers to carry it forward) ends in an empty view. State survives; render doesn't; reload recovers. Confirms the client-nav empty-view bug extends beyond `/ai` applet cards to at least `tier-check → wizard`. Every path a demo actually takes crosses one of these two seams.

3. **The unauditable $3,200** — The cost engine is *more correct* than what it replaced (marginal banding), but the UI presents a conclusion without its work. For the persona whose whole brief is "I don't believe this number," rendering the existing `breakdown` (bands × rate, free floor, effective rate) converts the tool's biggest credibility risk into its best proof of honesty. Also: stop advertising the cheapest band as "from $X" on the catalog card.

## What genuinely worked (worth protecting)

- **Five questions to L2, no over-classification** — the proprietary/NDA path is exactly right for patent-sensitive-but-unregulated work, and the "guidance, not a determination" framing is on the summary where it belongs.
- **Period-first grant step** ("you usually won't know exact dates until the award is made") — written by someone who has met a grant.
- **Real units, presets, honest defaults** — SU/month with Light/Moderate/Heavy, TB with project-size presets, archive auto-suggested at 70% and editable.
- **The overhead JIT explainer on the results page** — the F&A question answered plainly, with a worked who-pays-what table. Landed with this persona harder than any other single line of copy.
- **Exports + disclaimer** — Markdown/JSON out; "planning estimates, not a quote" under the total.

## One-line summary

Vex got a defensible **$116,145** and — grudgingly — respected the math behind it; but he had to refresh through a blank handoff, discover which of two identical Continue buttons doesn't erase his tier, and take the banded compute total on faith, and the persona this brief represents abandons at the second trap.
