# Round 2: Explore-First + Tier Questionnaire Review

**Date:** 2026-02-10

**Reviewed By:** 5 personas (AI-simulated, returning from Round 1)

**Materials Reviewed:**
- Explore-First design document (`docs/EXPLORE-FIRST.md`)
- Tier questionnaire config (`config/tier-questionnaire.yaml`)
- Tier workflow config (`config/tier-workflow.yaml`)

---

## Purpose

Round 2 targeted two specific additions: the Explore-First architecture (calculators, service matrix, glossary, standalone tier questionnaire) and the tier classification questionnaire. The same personas from Round 1 returned to measure improvement and surface new concerns.

---

## Personas Reviewed

| # | Persona | Department | Tech Level | Focus | Reviews |
|---|---------|------------|------------|-------|---------|
| 1 | Dr. Torben Vex | Physics | High | Explore-First design | [explore-first](explore-first-vex.md) |
| 2 | Dr. Sela Frindt | Biomedical Engineering | Medium | Explore-First + Tier Questionnaire | [explore-first](explore-first-frindt.md) / [tier-questionnaire](tier-questionnaire-frindt.md) |
| 3 | Dr. Lin Vosker | ECE | High | Explore-First + Tier Questionnaire | [explore-first](explore-first-vosker.md) / [tier-questionnaire](tier-questionnaire-vosker.md) |
| 4 | Dr. Jenny Woldsen | Business School | Low-Medium | Explore-First design | [explore-first](explore-first-woldsen.md) |
| 5 | Dr. Marge Tonsley | History | Very Low | Explore-First + Tier Questionnaire | [explore-first](explore-first-tonsley.md) / [tier-questionnaire](tier-questionnaire-tonsley.md) |

---

## Key Themes

### What Improved from Round 1

- **Explore-First is working** — All five personas found the "explore before committing" approach less intimidating than the wizard-only entry point. Woldsen: "I'm no longer afraid to click in and explore. That's the win." Tonsley: "The idea is perfect for someone like me." Even Vex (the skeptic) approved of the architecture.
- **Calculators reduce estimation friction** — The "carry forward" behavior (estimates seed the wizard) was praised across the board. Having math visible (Woldsen: "I can verify it") builds confidence for data-literate users who distrust black boxes.
- **Glossary solves the embarrassment barrier** — Users who wouldn't ask IT about basic terminology can now learn on their own terms. Woldsen explicitly named this.
- **HIPAA pathway is structurally correct** (Frindt) — Safe Harbor de-identification, the three-way identifiability split, and L3 assignment are accurate. The detail invested in tier-workflow.yaml is noticed.
- **Tier questionnaire tone lands well** — Even Tonsley (Very Low tech comfort) found the questionnaire's framing non-condescending.

### Compliance Signaling Gap (L3/L4)

The service matrix shows availability (✓ ⚠ ✗) but not *why* something is available or what compliance overhead it carries. Frindt and Vosker both hit this wall independently:

- Which services have BAAs pre-approved?
- How long does approval actually take for L3 vs. "requires review" vs. L4 consultation?
- What training or documentation does IT need *before* I submit?

Frindt's recommendation: compliance legend in the service matrix footer + a "Compliance Status" section in service detail modals. Vosker: L4 cost estimates should be flagged as provisional pending security review. Frindt also flagged a submission-side gap — L3 slates should include a compliance checklist step (data custodian, IRB protocol, HIPAA training date) to prevent downstream email back-and-forth.

### STEM-Centric Calculator Framing

Woldsen (Business School) and Tonsley (History) both hit the same wall: calculator options are Microscopy, Genomics, ML Training, Simulation. Neither of their projects maps cleanly to these categories.

- Woldsen: Organize by **research type** (AI & Machine Learning, Data Analysis) rather than **data type** (ML Training, Genomics). Add a clear entry point for business/social science AI work.
- Tonsley: Simple inputs ("number of images") must be the primary path, with technical inputs (bit depth, channels) secondary or hidden. She specifically asked: will she have to know pixel depth?

### Talk-to-Human Prominence (Tonsley)

The escape hatch exists but isn't prominent enough for the lowest-tech users. Tonsley's request from Round 1 was "prominent on every confusing page." The design addresses it in a few places, but she's uncertain she'd see it. Critical consideration: if it routes to an email queue rather than a real-time option, it loses its value for this persona.

### Tier Questionnaire: Missing Pathways

Three distinct gaps identified:

1. **Humanities funding** (Tonsley) — NEH, NEA, and other non-science federal agencies aren't mentioned. Only NSF/NIH appear in examples. Researchers guessing whether NEH qualifies as a "standard federal grant" shouldn't have to guess.

2. **FDA/GxP regulatory research** (Frindt) — Computational simulation for FDA 510(k) submissions has no pathway. The questionnaire would classify it as L1 or L2 (no human subjects, no export controls), but FDA 21 CFR Part 11 requires L3-level controls for audit trails and validation. A post-human-subjects branch for "FDA-regulated research" is needed.

3. **Export control scope too narrow** (Vosker) — CUI check only triggers on DoD selection; DOE, DHS, and NASA contracts can also carry CUI. ITAR and EAR aren't binary — some projects involve both. No pathway for classified research at all.

### Indirect Costs / F&A Rates (Woldsen)

Grant budgets include F&A (facilities and administration overhead). A $2,400/year estimate becomes ~$3,240 with a standard overhead rate. The tool currently exports direct costs only. Non-STEM researchers writing NSF proposals specifically called this out as missing.

### Non-STEM DMP Relevance (Woldsen)

Business researchers writing NSF social science proposals questioned whether a DMP is required for their work. The tool should allow DMP generation to be skipped or marked optional when the researcher's discipline doesn't require one.

### Minor/Technical Findings

- **PHI flag logic** (Frindt): `phi` flag is set when health data is confirmed, then cleared if fully de-identified — works but is confusing mid-questionnaire. Should only be set after identifiability is confirmed.
- **`hipaa_limited_dataset` flag missing** (Frindt): Limited datasets under a DUA have distinct handling requirements; current flow doesn't distinguish them from full PHI.
- **ITAR/EAR multi-select** (Vosker): Some projects are subject to both; questionnaire treats them as mutually exclusive.
- **Inline glossary > standalone** (Tonsley, Woldsen): Terms like "SU" in the footer should open a tooltip inline, not require navigating to the Glossary browser.

---

## Methodology

Returning personas reviewed two specific design documents in character. Each persona brought:
- Their Round 1 context (existing frustrations, prior experience with the tool)
- Their research projects and compliance obligations
- Domain expertise where applicable (Frindt on FDA/HIPAA, Vosker on export controls)

Reviews were written as authentic first-person critiques, not structured rubrics.

---

## Next Steps

1. Add compliance badges + pre-approval status to service matrix and detail modals (L3/L4)
2. Add compliance checklist step before L3 slate submission
3. Reorganize calculator entry points by research type, with simpler input paths for non-technical users
4. Expand tier questionnaire: humanities funding examples, FDA/GxP branch, DOE/DHS CUI path, ITAR+EAR multi-select
5. Surface inline glossary on terms within the slate footer and calculator results
6. Add F&A rate option to export/cost summary
7. Make Talk-to-Human escape hatch visible on calculator results and tier questionnaire outcome screens
