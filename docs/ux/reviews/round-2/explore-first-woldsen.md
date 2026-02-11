# Review: "Explore First" Design — Dr. Jenny Woldsen

**Date:** February 10, 2026
**Persona:** Dr. Jenny Woldsen, Business School, AI-Curious
**Focus:** Welcome experience for newcomers to research computing

---

## First Impression: Finally, Something for People Like Me

When I first saw the "or explore first" section on the welcome page, I actually felt relieved. For weeks, I've been avoiding this tool because the wizard felt intimidating — like I needed to know what I was doing before I could ask questions. But this approach says, "Hey, figure it out first, then plan." That's my style.

The four options (Estimate Needs, Browse Services, Check Your Tier, Learn the Terms) feel inviting and don't assume I know anything. I can see myself clicking "Estimate Needs" to figure out storage for AI research without committing to the full wizard yet.

---

## What Works: Lowering the Entry Barrier

**The Calculators Are Perfect for Me**

"How much storage?" "How many GPU hours?" These are exactly the questions I'm asking myself. The example showing microscopy estimates with real numbers (3.2 TB current, 9.2 TB after 1 year) makes sense. As someone who's done 15 years of Excel forecasting, seeing the math laid out — "2048×2048×2 bytes×4 channels..." — actually *reassures* me because I can verify it.

The "carry forward" feature is smart. I can estimate 25 TB for my AI datasets, then jump into the wizard with that value pre-filled. One less decision to make from scratch.

**Browse Services Demystifies the Tier Matrix**

This is huge for me. I can see that HPC GPU is available at L1/L2 but requires approval at L3 (✓, ✓, ⚠, ✗). That's a better way to understand the landscape than flipping between questions in a wizard. The service detail modal with actual examples (A100, V100 GPUs, $0.50/GPU-hour) makes it concrete.

**The Glossary Solves My Embarrassment Problem**

One of your persona quotes really hit home: *"Oh, there's a help tooltip that explains GPU vs CPU in normal words! I've been too embarrassed to ask anyone."* This glossary section — before I'm deep in the wizard — gives me permission to learn terminology on my own. SU, PHI, HIPAA, DMP... I can read these without feeling dumb.

---

## Where I'm Confused: Still Some Jargon Gaps

**"Check Your Tier" Is Still Abstract**

The questionnaire flow in the design makes sense, but I'm skimming the example and I still don't have a good intuitive sense of what L1 vs L2 vs L3 actually *means* in business terms. The phrase "Protected Health Information (PHI)" tells me it's regulated, but I'm not storing health data — I'm storing competitive business strategy research and student project data. How do I know if I'm L2 or L3?

I'd benefit from a **glossary entry specifically for each tier** before the questionnaire. Something like:

> **L2 (Internal):** Your research is valuable to your institution, but not public. Examples: proprietary analysis, student work, draft manuscripts. Cost: $5/TB/month.

> **L3 (Protected):** Your data involves identifiable information (names, faces, behavior patterns). Examples: student survey responses, client information. Cost: Approved services only.

Without these quick summaries, I'll probably still open the questionnaire and feel uncertain answering "Does your research involve human subjects?" (Yes, I interview executives, but it's not *human subjects research* like medical studies, right?)

**The Calculator Entry Points Are Discipline-Heavy**

I see options for Microscopy, Genomics, ML Training, Video, Simulation, and Custom. I'm doing business research with AI — does that fit "ML Training"? Or "Custom"? I'd need tooltips or better naming. Maybe organize by **research type** instead of **data type**? Like "AI & Machine Learning," "Data Analysis," "Simulations," "Other"?

---

## Grant Writer Export: Great, But Incomplete

The "Export for Grant Proposal" feature directly addresses something I need. I'm writing an NSF proposal this spring, and yes, I need cost numbers for my budget justification. The idea of exporting a Markdown table with services, quantities, and annual costs is exactly what I'd paste into my proposal.

But I have two questions:

1. **Where does the DMP boilerplate come from?** The design says it uses templates from `config/dmp-templates/`, but I'm wondering if business research even *needs* a DMP. Data Management Plans are more common in STEM. Will the tool let me skip DMP text if it's not relevant?

2. **What about indirect costs?** My grants always include F&A (facilities and administration). If I'm estimating $2,400/year in compute costs, my proposal budget is really $2,400 × 1.35 = $3,240. Can the tool account for institutional overhead rates, or is it just the direct cost?

---

## Would I Use This Alone? (Honestly...)

**Before talking to IT:** Yes. I'd absolutely use Estimate Needs and Learn the Terms to get oriented.

**To pick services without IT help:** I'm still uncertain. Even with Browse Services, I'd probably want to talk to someone before committing. Maybe L1/L2 services, I'd feel okay requesting on my own. But L3 approval? I'd definitely call rc-help@university.edu first.

This is fine — the tool isn't supposed to replace IT. But I wonder if the "Explore First" section could include a **"Ready to Request?"** checklist:

> - ☑ I've estimated my needs
> - ☑ I know my security tier
> - ☑ I've checked service availability
> - ☐ I've talked to my IT person (optional but recommended for L3)
> - [Submit or Talk to IT]

---

## The Big Question: Cost Transparency Works

The one thing that genuinely excites me is seeing costs upfront. $5/TB/month, $0.01/SU, $0.50/GPU-hour — this directly addresses one of my earlier frustrations with CloudAI pricing pages. If I can estimate my annual cost in 5 minutes, that's valuable. Even if I end up talking to IT anyway, I'll do so with realistic expectations instead of guessing.

---

## Summary

**What I love:** The exploration approach removes the "I don't even know what questions to ask" barrier. Calculators, glossary, and service browsing feel like exploration, not planning. Low-pressure.

**What I'm uncertain about:** Tier classification still feels abstract. Business-research terminology gaps. Grant-specific features (DMP relevance, indirect costs) need clarity.

**What I'd do next:** Use Explore First to learn and estimate, then talk to an IT person before submitting. I don't think I'd build a slate entirely on my own, but I'd be informed and confident when I call.

**The Missing Piece:** A business-school-friendly version or at least better onboarding for non-STEM researchers. This tool feels STEM-centric (microscopy, genomics, HPC). Business research has different data concerns.

Overall: You've made it significantly more approachable. I'm no longer afraid to click in and explore. That's the win here.

---

*Generated as part of Explore First UX review, Round 2*
