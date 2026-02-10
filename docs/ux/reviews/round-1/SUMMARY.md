# Round 1 UX Review Summary

**Date:** 2026-02-05
**Personas Reviewed:** 21 faculty across sciences, engineering, health, humanities
**Tech Levels:** Very Low to Very High
**Documents Generated:** 20 first-impressions, 7+ experience-logs (some still completing)

---

## Executive Summary

OpenResearchDataPlanner is **fundamentally sound**. The core value proposition (cost estimates + DMP generation) resonates across all tech levels. Several personas called it "the best tool IT has given us."

However, critical gaps exist around **external resources** (ACCESS), **accessibility** (unit explanations), and **compliance metadata** (HIPAA/FDA markers). The new comparison features will address the "which service do I pick?" confusion.

---

## Top Issues by Priority

### P0 - Critical (Blocking Adoption)

| Issue | Affected Personas | Impact |
|-------|-------------------|--------|
| **Missing ACCESS Program** | Vex, Transom, Vosker + 5 others | Researchers could save $20K+ with free national compute. Tool looks like it's "selling university services" instead of helping. |
| **Units unexplained** | Tonsley, Verge, Talwind | Non-technical users can't convert "5,000 photos" → "TB". They give up at Step 6. |
| **No software license info** | Selwick-Mira, Vosper, Cramble | "Where's Gaussian? That's half my budget." Campus licenses (ANSYS, MATLAB, etc.) should be listed. |

### P1 - High (Major Friction)

| Issue | Affected Personas | Impact |
|-------|-------------------|--------|
| **Compliance markers missing** | Frindt-Sela, Kelbrook-Fenna | Need explicit "HIPAA-compliant: Yes/No" and "FDA 21 CFR Part 11: Yes/No" on services |
| **L4 Restricted workflow unclear** | Vosker-Lin | "What actually happens when I select L4?" - needs clear process, not just a contact email |
| **Tier selection confusing** | Tonsley, Verge | "I read that section three times." Need plain-language examples per discipline |
| **Archive % slider vs TB input** | Vex, Cramble, Transom | Power users want to type "5 TB", not fiddle with percentages |

### P2 - Medium (UX Improvements)

| Issue | Affected Personas | Suggestion |
|-------|-------------------|------------|
| Date selection unnecessary | Vex, Gobleson | Just ask for duration (3 years), not specific start dates |
| Bundle naming too generic | Vex, Selwick-Mira | "Simulation & FEA" - FEA is one type. "Collaborative Research" - too vague |
| No multi-project session | Vex, Vosker, Morvane | Can't compare 3 projects side-by-side |
| V100 vs cloud GPUs buried | Transom | "V100s are from 2017" - make cloud recommendation more prominent for ML |
| EDA tools missing | Vosker-Lin | Cadence, Synopsys, Mentor - ECE researchers need FlexLM hosting info |

### P3 - Nice to Have

- Power user mode (skip wizard, just input numbers)
- Presets for common ML workloads (LLM fine-tuning, vision transformers)
- NSF FastLane/Research.gov budget format export
- Mixed compute strategies (scavenger + guaranteed + cloud burst)

---

## What's Working Well

### Unanimous Praise
1. **Cost transparency** - "The math is right" (Vex verified tiered pricing manually)
2. **Subsidy visibility** - Scavenger queue, free allocations clearly shown
3. **DMP generation** - "Uses technical terms (SLURM, GPFS) instead of dumbing down"
4. **Storage Only bundle** - Tonsley: "The moment I saw this, I felt seen"
5. **No hand-holding** - Power users appreciate not being over-explained

### Surprise Discoveries
- **Web hosting exists!** - Kelbrook-Fenna: "I've been paying for Heroku out of pocket for THREE YEARS"
- **L4 Restricted is real** - Vosker-Lin: "First tool that acknowledges defense research exists"
- **K8s cluster in beta** - Transom, Nonanda interested
- **RC Consultation (first hour free)** - Several found this valuable

---

## Accessibility Report (Dr. Marge Tonsley - True Technophobe)

Dr. Tonsley represents the lowest-tech faculty. Her review is the accessibility acid test.

### Where She Got Stuck
- **Step 2 (Tier Selection):** "I read that section three times and I'm still not 100% sure"
- **Step 6 (Usage Estimates):** "What's a TB? I have 5,000 photographs..."

### What Would Fix It
1. Define acronyms inline (not in a glossary)
2. Unit converter: "1 TB = about 200,000 photos"
3. Discipline-specific tier examples: "Medieval manuscript photos = Low tier"
4. Prominent "Talk to a human" button on every page

### Her Verdict
> "I shouldn't need a computer science degree to figure out where to put them."

But also:
> "The Storage Only bundle gave me hope. If you can make the units understandable, I think even I could finish this."

---

## Compliance Report (Frindt-Sela, Kelbrook-Fenna, Vosker-Lin)

Three personas work with regulated data (FDA, HIPAA, ITAR, classified).

### Missing Metadata
Services need explicit compliance markers:
- HIPAA-compliant: Yes/No
- FDA 21 CFR Part 11: Yes/No
- BAA available: Yes/No
- ITAR/Export Control: Yes/No

### L3 (High) Workflow
- Services say "requires review" but no timeline or process
- What information is needed? Who reviews?

### L4 (Restricted) Workflow
- "Contact security@northwinds.edu" is a start, not a solution
- Need: Expected timeline, intake form, what to prepare

### DMP Compliance Language
Request: Generated DMP should include compliance statements:
> "This project uses HIPAA-compliant Azure compute with a Business Associate Agreement in place."

---

## Power User Report (Vex, Transom, Nonanda, Cramble)

These personas know exactly what they need. They're testing efficiency.

### What They Want
1. **Skip bundles** - "I know I need HPC SLURM, research storage, and cold archive"
2. **Type exact numbers** - Not percentage sliders, not presets
3. **Quick mode** - "I need X SU, Y TB, Z years. Give me the numbers."
4. **Multi-project comparison** - Run 3 projects, see them side-by-side

### Time Test
- Vex completed 3 projects in ~25 minutes (acceptable but not great)
- Transom completed 1 project in ~8 minutes (good for power user)

### Friction Points
- Date selection (irrelevant for cost calculation)
- Archive ratio slider (want TB input)
- No way to express mixed compute strategies

---

## Missing Services Frequently Requested

| Service | Requested By | Notes |
|---------|--------------|-------|
| **ACCESS Program** | 8+ personas | Free national compute - campus champion available |
| **Campus Software Licenses** | 5+ personas | ANSYS, MATLAB, Mathematica, NVivo, Gaussian |
| **Custom FlexLM Hosting** | Vosker, Selwick-Mira | RC can host this - should be listed |
| **NSF Repositories** | Vex, Quorin | Zenodo, OpenKIM, MaterialsCloud (free) |
| **EDA Tools** | Vosker-Lin | Cadence, Synopsys, Mentor Graphics |

---

## Bundle Feedback

### Bundles That Work
- **Storage Only** - Universal praise from low-tech users
- **ML/AI Training (Cloud)** - Transom approved the structure
- **Clinical/IRB Data** - Frindt found it relevant

### Bundles That Need Work
| Bundle | Issue | Suggestion |
|--------|-------|------------|
| Simulation & FEA | GPU-first, but many simulations are CPU-heavy | Rename or split |
| ML/AI Training (On-Prem) | V100s not suitable for LLM 2026 | Add warning or deprecate |
| Collaborative Research | Too generic | What does this actually mean? |

### Missing Bundles
- Computational Chemistry/Physics (CPU HPC + storage + archive)
- Teaching/Course Archive (cheap storage only)
- Export-Controlled Research (ITAR/EAR compliant)
- FDA Regulatory Submission

---

## Quotable Feedback

### Testimonial Wall
> "I've been paying for Heroku out of pocket for THREE YEARS. The existence of this service changes everything." — Dr. Fenna Kelbrook

> "Finally. A tool that acknowledges L4 Restricted exists." — Dr. Lin Vosker

> "The best tool Northwinds IT has given me in 18 years." — Dr. Torben Vex

> "The Storage Only bundle gave me hope. I felt seen." — Dr. Marge Tonsley

### Wall of Shame (If Issues Unfixed)
> "Decent calculator, but it doesn't tell you about the free national resources that could save you $20K." — Dr. Torben Vex

> "I shouldn't need a computer science degree to figure out where to put my photos." — Dr. Marge Tonsley

> "Another tool built for bioinformatics that sort of works for engineering if you squint." — Dr. Lin Vosker

---

## Recommendations for Next Round

### Before Round 2
1. Add ACCESS Program as a service (or prominent callout)
2. Add unit explanations inline ("1 TB = 200,000 photos")
3. Add tier examples per discipline
4. Add compliance markers to service metadata

### For Round 2 Testing
1. Test the new comparison feature - does it help decision-making?
2. Focus on L3/L4 workflows - are the review processes clear?
3. Re-test Tonsley - can she complete the wizard now?
4. Test multi-project scenarios

### Longer Term
1. Power user mode / quick entry form
2. Multi-project session management
3. NSF budget format export
4. DMP compliance language generator

---

## Appendix: Files Generated

### First Impressions (20 files)
- belvins-omar, bontamo-kev, bramford-lina, carvallo-ben, frindt-sela
- gobleson-jort, kelbrook-fenna, mellendo-cris, quarrin-nelle, rilston-ama
- selwick-mira, tonsley-marge, transom-yev, verge-callum, vex-torben
- volgin-andras, vosker-lin, woldsen-jenny, + 2 others

### Experience Logs (7+ files)
- vex-torben, gobleson-jort, quarrin-nelle, selwick-mira
- bontamo-kev, kelbrook-fenna, transom-yev

### Agents Still Running
Some experience-log agents may still be completing. Check `docs/ux/reviews/round-1/` for updates.
