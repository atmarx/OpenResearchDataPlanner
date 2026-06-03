# Verdict — s02-bramford-openscience-dmp

> Scored after the run. Schema owned by @piper (PLAYWRIGHT-PERSONA-SESSIONS.md).

**Persona:** 03-bramford-lina
**Run:** 2026-06-03 — source-walk exploratory
**Analyst:** piper-nakamoto

> **Recording note:** This is the exploratory source-walk half. Live `video.webm` /
> `trace.zip` from Marco's scripted runner are not in this folder yet — the
> happy-path regression for s02 should be fired (`SESSION_ID=s02-bramford-openscience-dmp`)
> to file the recording set alongside this analysis, as we did for s01.

## Success criteria

- [x] Reaches a low-tier determination for the open climate + satellite data and recognizes it as the right (light-touch) answer
      - Result: **PASS** — The questionnaire intro `audience_note` explicitly names her case ("data already publicly available," "physical phenomena without biological or human components"), and the `quick_select` button ("My data is not sensitive — use standard tier") drops her straight to **low** in one click. No over-warning. This is the inverse-failure the brief was watching for, and the tool clears it.
      - Evidence: narration `[00:30]`–`[01:00]`; `tier-questionnaire.yaml` intro `audience_note` + `quick_select.tier: low`.

- [ ] The generated DMP includes language she'd consider FAIR/open-data adequate for NSF reviewers
      - Result: **FAIL** — The storage DMP templates she actually receives (`globus-storage/default.md`, `cloud-storage/default.md`, `nwfiles/default.md`) contain **no** FAIR / findable / open-data / public-repository / data-sharing language. FAIR text exists elsewhere in the tool (clinical guidance, AI-ethics applet, acronym list) but never reaches the storage DMP output. The questionnaire also never collects an "open/public-sharing" flag, so even a FAIR-aware template would have nothing to key on. For an open-science PI this is the half of the DMP the NSF panel cares about most, and it's absent.
      - Evidence: narration `[03:30]`–`[03:50]`; `grep -i FAIR config/dmp-templates/{globus-storage,cloud-storage,nwfiles}/*.md` → no matches.

- [x] Gets a cost estimate that correctly reflects the >1TB paid storage tier (her footprint is ~40TB active)
      - Result: **PASS** — Globus-connected storage: 40TB enters cleanly (range 1–1000 TB, TB-labeled), the "Data-intensive (50TB)" preset fits her, $3.50/TB/mo with 500GB auto-free → ~$138/mo, ~$6,600 over a 48-month grant. Transfers included at no cost. A budgetable number.
      - Evidence: narration `[02:00]`–`[02:25]`; `services.yaml` globus-storage `cost_model` + `estimation` + `base-globus-allocation` subsidy.

- [ ] Understands where the free 1TB ends and paid storage begins without having to ask a human
      - Result: **PARTIAL FAIL** — The free allocation is applied silently in the cost math (`Math.max(0, estimate − 0.5)`); the estimate shows a monthly total but never a labeled "500GB included free / 39.5TB billable" line. A sophisticated user reverse-engineers it; a junior PI sees only the total. Compounding it: the free floor is *inconsistent* — 500GB (globus-storage), 100GB (nwfiles), and "1TB" in institutional messaging — which erodes trust in the number.
      - Evidence: narration `[02:40]`–`[02:55]`; `services.yaml` free_allocation values differ per service.

- [x] Comes away seeing the tool as faster/cleaner than her Google Drive workaround
      - Result: **PASS (conditional)** — For *provisioning and costing*, clearly yes; she'd return for that. For *producing the open-data DMP she can hand a reviewer*, not yet (see FAIR fail). She leaves with the cost answer in hand and the sharing-plan still on her list.
      - Evidence: narration `[04:10]`–`[04:20]`.

## Where they stalled

| # | Node / route | What confused them | Severity |
|---|--------------|--------------------|----------|
| 1 | `/results` DMP output | No FAIR / open-data / data-sharing language in the storage DMP templates. The open-science PI's core grant thesis is absent from the document she'd submit. | Critical |
| 2 | `/tier-check` intro | Open science is offered as an *exit* (quick-select "not sensitive → low"), not as a first-class *path*. No way to affirmatively document openness; low tier reads as absence-of-sensitivity, not presence-of-openness. | Medium |
| 3 | Estimate step | Free-tier boundary is computed silently, never shown as a labeled line item. Free floor also varies across services (500GB / 100GB / "1TB"), undermining trust. | Medium |

## Top 3 friction moments (ranked)

1. **DMP has no FAIR / open-data language** — Bramford's entire proposal is openness, and the generated DMP — the document NSF reviewers read for the data-sharing plan — never says "FAIR," "findable," "open data," or "public repository." She'd have to hand-write the section the tool most plausibly exists to produce. This mirrors the s01 finding from a different angle: **the DMP generator does not express the thing the questionnaire established about the data.** For Frindt it was compliance flags (HIPAA/PHI); for Bramford it's the open-data posture. Same root: the DMP output doesn't consume the semantic intent of the session, only the tier/service slugs.

2. **Open science is a skip, not a path** — The intro respectfully tells low-sensitivity researchers they can opt out (genuinely good, no over-warning). But it has no affirmative open-data branch. An evangelist wants to *make and document* the open choice, not be waved past the compliance flow. A short "My data is open/public — help me document a FAIR sharing plan" path could set an `open_data` flag that a FAIR-aware DMP template then consumes — closing finding #1 too.

3. **Free-tier boundary invisible and inconsistent** — The estimate never shows where free ends and paid begins as a line item, and the free amount differs across services (500GB vs 100GB vs the "1TB" she'd heard). Surfacing "X GB included free, Y TB billable at $Z/TB" and reconciling the free floors would make the number trustworthy at a glance.

## One-line summary

Bramford is *not* over-warned — the tier path respects open, low-sensitivity work and gives her a correct one-click low determination and a real, budgetable 40TB cost number. Where the tool fails her is the output that matters most to an open-science PI: the DMP carries zero FAIR / open-data language, because (as with Frindt's compliance flags) the generator expresses the tier and services but not the *intent* the session established — and open science is offered as an exit from the flow rather than a documented path through it.
