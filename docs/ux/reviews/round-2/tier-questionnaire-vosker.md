# Review: tier-questionnaire.yaml
## Dr. Lin Vosker | ECE Professor, Export-Controlled Research

**Date:** 2026-02-10
**Status:** Configuration File Review
**Confidence:** High — This is my domain

---

## Executive Summary

I deal with ITAR, CUI, and classified research every day. The tier questionnaire gets the basic structure right but has significant gaps in export control nuance that could lead researchers astray — or worse, lead them to think they're compliant when they're not.

The good news: it short-circuits to L4 correctly for CUI and export controls. The bad news: the export control guidance is oversimplified, and it completely ignores classified research.

---

## 1. L4 Path Accuracy: Mostly Correct, Some Concerns

**The Good:**

The CUI path works correctly. If I answer:
- "Government funded?" -> "Yes - DoD/defense-related"
- "Does your contract specify CUI?" -> "Yes"

I get L4 with `cui` and `nist_800_171` flags. That's right. The short-circuit is appropriate — once you have CUI, you need L4, period.

The export control path also short-circuits correctly:
- "Export-controlled technology?" -> "Yes - ITAR" or "Yes - EAR"

Both route to L4 immediately. Correct.

**The Problems:**

1. **CUI check only appears for DoD contracts.** The questionnaire routes to `cui_check` only if you select "Yes - DoD/defense-related." But CUI can appear in contracts with DOE, DHS, NASA, and other agencies. The help text mentions "DoD, DoE, NASA" but the flow only triggers CUI check for DoD. Someone with a DOE contract containing CUI would bypass the CUI check entirely and might end up at L1 or L2.

2. **The "No / Not sure" option for CUI routes to export_control.** This is correct, but the help text should be stronger. "Check your contract" is vague. Researchers should know that CUI marking is often buried in attachments, SOWs, or CDRLs — not always in the main contract body.

3. **No distinction between CUI categories.** CUI isn't monolithic. There's CUI Basic and CUI Specified, and the handling requirements differ. The questionnaire treats all CUI the same. For a planning tool, this might be acceptable, but the "Learn More" content should mention that CUI categories exist.

**Grade:** B for flow logic, C+ for completeness.

---

## 2. Export Control Questions: Technically Accurate, Practically Incomplete

**What's Right:**

The "Learn More" content correctly states:
- ITAR covers defense articles and technical data
- EAR covers dual-use commercial items
- Export control applies to verbal discussions, not just physical exports
- ITAR is "US persons only"

These are accurate and important.

**What's Wrong or Missing:**

1. **ITAR vs. EAR is not binary.** The questionnaire offers three options: No, ITAR, or EAR. But what about research that involves *both*? I've had projects where the underlying technology was EAR-controlled but the defense application made certain aspects ITAR. The questionnaire doesn't allow selecting both.

2. **EAR doesn't automatically mean L4.** Here's the problem: EAR has many categories. Some EAR99 items have minimal restrictions and could potentially work at L2 or L3 with proper access controls. The questionnaire treats all EAR as L4. This is conservative (which is good), but the guidance should explain that EAR classification varies and consultation will determine actual requirements.

3. **No mention of ECCN.** For EAR items, the Export Control Classification Number (ECCN) determines the restrictions. A researcher with an EAR item should know they need their ECCN. The "Learn More" content doesn't mention this.

4. **"US persons only" needs clarification for ITAR.** The learn_more says ITAR is "US persons only" but doesn't define "US person." It includes US citizens, permanent residents (green card holders), and protected individuals. This matters because many of my students are permanent residents who *can* work on ITAR projects. The current text might make PIs think all international students are excluded even if they have green cards.

5. **Fundamental Research Exclusion is missing.** This is a significant gap. Many university research projects qualify for the Fundamental Research Exclusion (FRE) under both ITAR and EAR, which means export controls don't apply if the research is publicly available. The questionnaire doesn't ask about this. A researcher doing unclassified, publishable research on dual-use technology might select "Yes - EAR" and get routed to L4 when they might actually qualify for FRE and need L2.

**Grade:** C for accuracy (it's not wrong, just incomplete), D for practical utility.

---

## 3. The Learn More Content: Needs Significant Expansion

**CUI Learn More:**

The current content is:

> Controlled Unclassified Information (CUI) is government-created or government-owned information that requires safeguarding. Look for: "CUI" marking, DFARS 252.204-7012, NIST SP 800-171, "Controlled Technical Information"

This is a reasonable starting point, but it should also mention:
- CUI Registry categories (the official list of what qualifies as CUI)
- That CUI markings may appear in contract attachments, not just the main document
- That CMMC (Cybersecurity Maturity Model Certification) requirements are increasingly common and related to CUI

**Export Control Learn More:**

The current content is too brief for something this complex. I'd want to see:

1. **Definition of "US person"** — citizen, permanent resident, protected individual
2. **Fundamental Research Exclusion** — when export controls don't apply to academic research
3. **ECCN and USML categories** — that items are classified and the classification determines restrictions
4. **Publication rights** — if your contract restricts publication, FRE may not apply
5. **Technology vs. technical data** — ITAR distinguishes these, and researchers often confuse them

The current "Contact our Export Control office if you're unsure" is correct advice, but the learn more should give researchers enough context to have an informed conversation with that office.

**Grade:** D+ — The basics are there but it's not enough for researchers to self-assess.

---

## 4. Missing Scenarios: Where's Classified?

This is my biggest concern. The questionnaire completely ignores classified research.

**Classified National Security Information:**

My DARPA project involves information classified at the Secret level. This requires:
- Personnel security clearances
- Facility security clearance (CAGE code, cleared facility)
- Secure facility (SCIF or equivalent)
- Completely different infrastructure than even L4

The questionnaire has no path for classified research. If I answer honestly:
- "Government funded?" -> "Yes - DoD/defense-related"
- "CUI?" -> "No" (because it's classified, not CUI — these are different things!)
- "Export-controlled?" -> "No" (classified supersedes export control)

I'd end up at L1 or L2, which is catastrophically wrong.

**The fix:** Add a question between government_data and cui_check:

> "Does your research involve classified national security information?"
>
> Help text: "Information marked Confidential, Secret, Top Secret, or any codeword classification. If you're unsure whether your project involves classified information, contact your security officer."

If yes, immediately route to L4 with a `classified` flag and a different CTA that emphasizes facility clearance requirements, not just data handling.

**NOFORN and Releasability Markings:**

CUI and classified information often have releasability markings:
- NOFORN (No Foreign Nationals)
- REL TO (Releasable to specific countries)
- ORCON (Originator Controlled)

These affect who can access the data beyond just "US persons." The questionnaire doesn't address these. For a planning tool, this might be acceptable — but the CTA for L4 should mention that releasability restrictions may further limit access.

**Foreign Government Information:**

What about research involving information from allied governments? NATO RESTRICTED, UK OFFICIAL-SENSITIVE, etc. These have their own handling requirements that may or may not align with US CUI. The questionnaire doesn't address this.

**Grade:** F for classified research, D for releasability nuances.

---

## 5. The CTA for L4: Good Start, Needs More

**Current L4 CTA:**

> Title: "Consultation required"
> Message: "Restricted data requires export control review before proceeding."
> Action: "Schedule Consultation"
> Secondary: "Continue Planning (Preliminary)"

**What's Right:**

- "Consultation required" is the correct framing — not optional
- "Continue Planning (Preliminary)" is smart — lets me budget before formal review
- "Export control review" correctly identifies what's needed

**What's Missing:**

1. **Who to contact.** The CTA says "Schedule Consultation" but doesn't say with whom. Is it the Export Control office? Research Security? IT? For ITAR, it should be the Export Control office. For CUI/NIST 800-171, it might be Research IT. For classified, it's the Facility Security Officer (FSO). The CTA should be context-aware based on the flags set.

2. **What to prepare.** Before my consultation, I should have:
   - Contract or grant document with relevant clauses highlighted
   - List of personnel who need access (with citizenship/residency status)
   - Description of data types and flows
   - For ITAR: Copy of the export license or TAA if applicable
   - For classified: Security clearance levels of personnel

   The CTA or a linked page should provide a pre-consultation checklist.

3. **Timeline expectations.** Export control determinations can take days; classified accreditation takes months. The CTA should set expectations: "Export control consultations typically take 3-5 business days. Classified research requirements vary significantly — contact your FSO for timelines."

4. **What I can do while waiting.** The secondary action "Continue Planning (Preliminary)" is good, but what does "preliminary" mean? Can I get budget estimates? Write DMP text? The CTA should clarify that preliminary planning doesn't constitute approval and estimates may change after consultation.

**Suggested Improved CTA:**

> Title: "Consultation Required Before Proceeding"
>
> Message: "Based on your answers, your research requires {CUI handling / export control review / classified facility access}. Before finalizing your plan, you'll need to consult with our {Export Control Office / Research Security team / Facility Security Officer}."
>
> Contact: {context-aware contact based on flags}
>
> Prepare for your consultation:
> - Copy of your contract or grant with relevant clauses
> - List of personnel who need access (with citizenship status)
> - Description of data types and sensitivity levels
>
> Timeline: {context-aware timeline based on flags}
>
> Action: "Schedule Consultation"
> Secondary: "Continue with Preliminary Estimates" (clearly marked as subject to change)

**Grade:** B- for honesty, C for actionability.

---

## 6. Discipline Examples: Correct for Engineering

The `examples_by_discipline` section for Engineering shows:

- L1: Published simulation results, open-source CAD models, public benchmarks
- L2: Proprietary designs before patent, industry collaboration under NDA
- L4: Defense contractor research (ITAR), CUI-marked data, export-controlled technology

These are accurate. Notably, there's no L3 example for Engineering, which is probably correct — most regulated engineering research jumps straight to L4.

**Grade:** A for my domain.

---

## Overall Assessment

The tier questionnaire is a solid first draft for general research, but it has critical gaps for defense and export-controlled research:

| Aspect | Grade | Notes |
|--------|-------|-------|
| L4 Path Logic | B | Short-circuits correctly, but CUI only triggers for DoD |
| Export Control Questions | C | Accurate but oversimplified |
| Learn More Content | D+ | Too brief for complex regulations |
| Classified Research | F | Completely missing |
| L4 CTA | C+ | Right direction, needs specificity |
| Discipline Examples | A | Engineering examples are accurate |

**What I'd Fix First:**

1. **Add classified research question** — This is a safety issue. Researchers with classified projects will get wrong guidance.

2. **Expand export control Learn More** — Add FRE, US person definition, ECCN mention.

3. **Make CUI check trigger for all federal contracts** — Not just DoD.

4. **Context-aware L4 CTA** — Different contacts and prep for CUI vs. ITAR vs. classified.

5. **Allow multiple export control selections** — Research can be both ITAR and EAR controlled.

**What I'd Accept For Now:**

The secondary action "Continue Planning (Preliminary)" is a good safety valve. Even with the gaps, researchers can get preliminary estimates and the CTA correctly tells them to consult before proceeding. The tool won't cause compliance failures if researchers follow the CTA. It just won't help them as much as it could.

**Bottom Line:**

This questionnaire is built by people who understand HIPAA and FERPA but are less familiar with defense research. That's obvious from the detail in the health data questions vs. the brevity in export control. The basic structure is right. The gaps are fixable. But right now, it's not ready for researchers like me who deal with ITAR, CUI, and classified information daily.

Get an export control officer to review this before release. They'll catch the same issues I did — and probably more.

---

*Review submitted by Dr. Lin Vosker, Professor, Electrical and Computer Engineering*
*Export control research experience: 12+ years*
*Current clearance level: Secret (facility clearance pending for DARPA project)*
