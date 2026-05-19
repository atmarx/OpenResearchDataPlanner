# Round 1: Initial UX Review

**Date:** 2026-02-05

**Reviewed By:** 21 Faculty Personas (AI-simulated)

**Materials Reviewed:**
- User Guide (`docs/USERGUIDE.md`)
- Services Catalog (`config/services.yaml`) - 18 services
- Bundle Presets (`config/bundles.yaml`) - 11 bundles

---

## Purpose

This is the first round of persona-based UX review. Each persona reads the user guide and attempts to plan their 3 research projects using OpenResearchDataPlanner. They document:

1. **First Impressions** - Reactions to the user guide before using the tool
2. **Experience Log** - Step-by-step walkthrough attempting to configure their projects

---

## Personas Reviewed

| # | Persona | Department | Tech Level | Archetype | Reviews |
|---|---------|------------|------------|-----------|---------|
| 1 | Dr. Torben Vex | Physics | High | Skeptic | [first-impressions](first-impressions-vex-torben.md) / [experience](experience-log-vex-torben.md) |
| 2 | Dr. Harlow Plinth | Chemistry | Medium | Detail-oriented | [first-impressions](first-impressions-plinth-harlow.md) / [experience](experience-log-plinth-harlow.md) |
| 3 | Dr. Dessa Quorin | Environmental Science | Medium | Open Science Evangelist | [first-impressions](first-impressions-quorin-dessa.md) / [experience](experience-log-quorin-dessa.md) |
| 4 | Dr. Jort Gobleson | Astronomy | Medium | Legacy System | [first-impressions](first-impressions-gobleson-jort.md) / [experience](experience-log-gobleson-jort.md) |
| 5 | Dr. Sheera Mivven | Neuroscience | Low-Medium | Overwhelmed Clinician | [first-impressions](first-impressions-mivven-sheera.md) / [experience](experience-log-mivven-sheera.md) |
| 6 | Dr. Wex Cramble | Materials Science | High | FORTRAN Veteran | [first-impressions](first-impressions-cramble-wex.md) / [experience](experience-log-cramble-wex.md) |
| 7 | Dr. Fenna Kelbrook | Biomedical Engineering | Medium | Compliance Juggler | [first-impressions](first-impressions-kelbrook-fenna.md) / [experience](experience-log-kelbrook-fenna.md) |
| 8 | Dr. Dax Storno | Civil Engineering | Medium | Closet NAS Owner | [first-impressions](first-impressions-storno-dax.md) / [experience](experience-log-storno-dax.md) |
| 9 | Dr. Renna Zilph | ECE | High | License Server Wrangler | [first-impressions](first-impressions-zilph-renna.md) / [experience](experience-log-zilph-renna.md) |
| 10 | Dr. Yev Transom | CS/ML | Very High | Cluster Breaker | [first-impressions](first-impressions-transom-yev.md) / [experience](experience-log-transom-yev.md) |
| 11 | Dr. Mirk Nonanda | CS/OS | Very High | Pipeline Builder | [first-impressions](first-impressions-nonanda-mirk.md) / [experience](experience-log-nonanda-mirk.md) |
| 12 | Dr. Tanna Belwick | Information Science | High | Dashboard Publisher | [first-impressions](first-impressions-belwick-tanna.md) / [experience](experience-log-belwick-tanna.md) |
| 13 | Dr. Callum Verge | Digital Humanities | Low-Medium | Curious Humanist | [first-impressions](first-impressions-verge-callum.md) / [experience](experience-log-verge-callum.md) |
| 14 | Dr. Lissa Morvane | Genetics | Medium | Compliance Expert | [first-impressions](first-impressions-morvane-lissa.md) / [experience](experience-log-morvane-lissa.md) |
| 15 | Dr. Brinley Thane | Public Health | Medium | Careful Collaborator | [first-impressions](first-impressions-thane-brinley.md) / [experience](experience-log-thane-brinley.md) |
| 16 | Dr. Chim Vosper | Pharmacology | Medium | Industry Partner | [first-impressions](first-impressions-vosper-chim.md) / [experience](experience-log-vosper-chim.md) |
| 17 | Dr. Pavlo Grundy | Psychology | Low-Medium | Stats Specialist | [first-impressions](first-impressions-grundy-pavlo.md) / [experience](experience-log-grundy-pavlo.md) |
| 18 | Dr. Nessara Talwind | Business School | Low-Medium | AI Curious | [first-impressions](first-impressions-talwind-nessara.md) / [experience](experience-log-talwind-nessara.md) |
| 19 | Dr. Bram Kovatch | Economics | Medium | Excel Escapee | [first-impressions](first-impressions-kovatch-bram.md) / [experience](experience-log-kovatch-bram.md) |
| 20 | Dr. Zenna Flux | Digital Media | High | Deadline Panic | [first-impressions](first-impressions-flux-zenna.md) / [experience](experience-log-flux-zenna.md) |
| 21 | Dr. Marge Tonsley | History | Very Low | True Technophobe | [first-impressions](first-impressions-tonsley-marge.md) / [experience](experience-log-tonsley-marge.md) |

---

## Key Themes

### Common Pain Points

- **Estimation friction**: Researchers couldn't translate their actual workloads to TB/SU/GPU-hours. "Help Me Estimate" helps, but users wanted workload-to-resource examples inline (e.g. "1 WGS pipeline ≈ 5,000 SU", "1 TB ≈ 200,000 high-res photos").
- **Acronym soup**: Low-tech users (Tonsley, Mivven) were blocked by jargon — PHI, HIPAA, FISMA, CUI, SU, HPC, IRB. Most are now annotated via `acronyms.yaml`; check for gaps when adding new content.
- **Tier selection is abstract**: Without discipline-specific examples, users guessed. "Medieval manuscript photos = Low tier" is the kind of anchor that works. The tier questionnaire helps but isn't always reached first.
- **Archive ratio slider**: Multiple users (Vex, Selwick-Mira) said "I think in TB, not percentages." Abstract ratio input caused confusion.
- **Date-forcing**: Vex: "Why force me to pick a start date when it's irrelevant to the cost calculation?" — addressed in v1.0 with "No dates yet" option.
- **GPU/preemptible opacity**: ML-heavy users (Transom) couldn't map cloud presets to actual GPU-hours. Spot/preemptible pricing not explained.

### Positive Feedback

- **Bundles were a hit**: Users who found them stopped second-guessing service selection. Discovery is the issue — bundles need to be more prominent.
- **Tier questionnaire worked for undecided users**: Personas who didn't know their tier found the questionnaire useful once they found it.
- **DMP output was valued**: Compliance-aware researchers (Morvane, Kelbrook) appreciated having draft text to edit, not start from scratch.

### Missing Services Requested

- **Gaussian / computational chemistry** (Plinth, Selwick-Mira) — common in chem departments, often licensed centrally
- **EDA tools** (Cadence, Synopsys, Mentor) — Zilph (ECE/ITAR); FlexLM license server hosting also flagged
- **HIPAA-compliant markers** explicit on services (Frindt, Mivven) — not just implied by tier
- **BAA confirmation per service** (Frindt) — "Does Northwinds have BAAs with Azure?"

### Accessibility Concerns

- Low-tech users (Tonsley, Mivven) need unit explanations inline, not just in tooltips
- Acronym tooltips must be reachable without hover — mobile/touch users and screen readers

### Bundle Feedback

- Bundles solve the right problem but aren't visible enough early in the flow
- Names like "Genomics Starter" worked; abstract names confused users
- Users wanted a "recommend me a bundle based on my project type" path before reaching service selection

---

## Methodology

Each persona was given:
1. Their full backstory (persona.yaml + narrative.md)
2. The user guide to read with their 3 projects in mind
3. The complete services and bundles configuration
4. Institutional context (campus licenses, ACCESS availability, no competing services)

They produced authentic, in-character reviews based on their:
- Technical comfort level
- Time pressures
- Current workarounds
- Project requirements

---

## Next Steps

After analyzing round 1 feedback:
1. Identify high-priority fixes
2. Update user guide, services, or bundles as needed
3. Run round 2 with the same personas to measure improvement
