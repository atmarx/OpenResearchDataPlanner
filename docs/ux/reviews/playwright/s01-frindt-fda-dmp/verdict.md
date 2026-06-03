# Verdict — s01-frindt-fda-dmp

> Scored after the run. Schema owned by @piper (PLAYWRIGHT-PERSONA-SESSIONS.md).

**Persona:** 07-frindt-sela  
**Run:** 2026-06-02 — source-walk exploratory + scripted regression 4/4 green  
**Analyst:** piper-nakamoto

## Success criteria

- [x] Reaches a defensible tier determination for the patient-imaging (hospital) data without being told the answer in advance
      - Result: **PASS** — questionnaire path `human_subjects → health_data → identifiable` correctly produces High tier. The question wording and learn_more content at `#q-identifiable` are genuinely good; the "Limited dataset" option is the right landing spot for patient imaging.
      - Evidence: narration `[01:10]`, `#q-identifiable`, result: High.

- [ ] Correctly separates the three projects into their different tiers rather than blanketing everything as high
      - Result: **PARTIAL FAIL** — Frindt CAN determine the correct tier for each project individually if she runs the questionnaire three times, but the wizard never tells her to do this. She gets High (hospital), Medium (simulation), Low (archive) separately — but the wizard is single-project. There is no multi-project DMP path, so she cannot represent three separate tiers in one output document.
      - Evidence: narration `[03:30]`–`[03:40]`, wizard step list (welcome → tier-select → grant-period → retention → service-select → estimate → results, no iteration concept).

- [ ] Generates a DMP draft that names the compliance frameworks she cares about (FDA, HIPAA/human-subjects)
      - Result: **FAIL** — Two gaps: (1) No FDA pathway in the questionnaire — simulation data (FDA 510(k)) exits at `proprietary_check` as Medium with no FDA flag set. (2) DMP generator does not consume questionnaire flags (`hipaa`, `phi`, `human_genomic`, etc.) — it uses only the tier slug. A High tier DMP says "High" but never says "HIPAA," "PHI," "IRB," or "human subjects." Unusable for IRB submissions.
      - Evidence: narration `[02:40]`–`[02:55]` (FDA gap); narration `[04:50]`–`[04:55]` (DMP output); `useDMPGenerator.js` consumes `sessionStore.selectedTier` only, no `selectedFlags`.

- [x] Produces a cost estimate she can hand to her department administrator
      - Result: **PASS** — `/calculators` is reachable, estimator works, figure appears in DMP results output. Confirmed via scripted regression.
      - Evidence: narration `[05:15]`–`[05:25]`, scripted test 4/4.

- [x] Finds the tier questionnaire understandable enough that she does not abandon it mid-flow
      - Result: **PASS** — The HIPAA pathway (`human_subjects → health_data → identifiable`) is clear and the learn_more content at `#q-identifiable` about "Identified vs. Encoded vs. De-identified" is one of the better explanations in the tool. No abandonment risk on this path. The FDA simulation path also completes, but outputs the wrong tier (Medium) — Frindt notices and is confused, but she doesn't abandon.
      - Evidence: narration `[01:00]`–`[01:35]` (hospital project, no stalls); `[02:15]`–`[02:35]` (simulation project, completes but produces wrong tier).

## Where they stalled

| # | Node / route | What confused them | Severity |
|---|--------------|--------------------|----------|
| 1 | Wizard `/` — landing | No guidance on multi-project use. Frindt has 3 projects; the wizard is 1-project. No indication to run it multiple times, no "add project" concept, no merged output. | Critical |
| 2 | `#q-export_control` / end of simulation path | No FDA regulatory pathway. Simulation data for FDA 510(k) exits as Medium (NDA/proprietary). Frindt expected High with FDA 21 CFR record-keeping requirements. | High |
| 3 | DMP results (`/results`) | DMP output names tier but not compliance frameworks. Says "High tier" but not "HIPAA," "PHI," "IRB-covered," or "human subjects." Not attachable to IRB or FDA submission without manual rewrite. | High |

## Top 3 friction moments (ranked)

1. **Multi-project / single-wizard mismatch** — The most common Frindt use case (I have a proposal that covers two or three datasets at different tiers) hits a wall immediately. The tool never surfaces the concept of running multiple sessions or merging results. This isn't a questionnaire bug — it's a product scope gap. Biomedical researchers routinely run HIPAA and non-HIPAA data in parallel. The current tool treats each session as one atomic project.

2. **FDA gap in the questionnaire** — There is no question about regulatory submission requirements (FDA, CE Mark, 21 CFR). The `government_data` question asks about funding agency but not regulatory agency. An FDA submission is not a DoD contract; it's a completely different compliance pathway. The simulation data lands at Medium/proprietary when FDA record-keeping requirements arguably push it to High. Frindt notices — she's sophisticated enough — but the tool gives her no way to represent this correctly without a manual override that produces an unexplained DMP.

3. **DMP does not consume questionnaire flags** — The questionnaire collects `hipaa`, `phi`, `human_genomic`, `ferpa`, and other flags, then silently discards them. The DMP generator uses only the tier slug. Frindt goes through five questions establishing that her data is HIPAA-covered PHI from identifiable human subjects — then gets a DMP that just says "High tier." This is the exact information her IRB reviewer and hospital compliance office will ask about.

## One-line summary

Frindt completes the HIPAA patient-imaging path cleanly (High, correct), but the tool fails her on two fronts: the wizard has no multi-project concept for her three-tier proposal, and the DMP discards the compliance-specific flags she just established — so the output can't be attached to an IRB submission or FDA documentation package without a manual rewrite.
