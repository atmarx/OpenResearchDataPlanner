# HIPAA/FDA Guidance Spec — Faculty Review Roster

> Which personas should review the 128-page multi-regulatory guidance suite before building?

---

## Must-Have Reviewers (Core Committee)

### 1. Dr. Ada Okonkwo (Medical Informatics) — PRIMARY CLINICAL REVIEWER

**Why she's essential:**
- **FDA expertise:** Worked at medical AI startup that got FDA 510(k) clearance. Knows the pathway firsthand.
- **HIPAA depth:** Manages L3 clinical data daily. Understands de-identification, BAAs, audit requirements.
- **IRB complexity:** Runs studies across multiple hospital sites. Navigates IRB reliance, multi-site governance.
- **Dual publication:** NeurIPS (ML conferences) AND JAMA (medical journals). Bridges technical and clinical.
- **Teaching context:** Students learn "PyTorch AND HIPAA" — exactly the educational material context.

**What she'll review:**
- **FDA sections:** Is the clinical AI device pathway accurate? CDS exemption guidance current? PCCP explanation clear?
- **HIPAA de-identification:** Sufficient depth for clinical researchers? Are the 18 identifiers explained correctly?
- **Multi-regulatory scenarios:** Do the "AI tool requiring FDA + HIPAA + IRB" examples reflect reality?
- **Clinical validation:** Are the requirements aligned with what medical journals expect?

**Her critical eye will catch:**
- Overstating FDA exemptions ("just because it's research doesn't mean FDA doesn't care")
- Understating HIPAA complexity (de-identified ≠ anonymous, linking keys matter)
- Missing bias validation requirements (FDA now requires demographic performance reporting)

**Quote that shows she needs this:**
> *"My model achieves state-of-the-art accuracy on the public benchmark. But deploying it in a hospital? That's another 18 months of FDA documentation, clinical validation, and bias auditing."*

---

### 2. Dr. Sela Frindt (Biomedical Engineering) — MULTI-REGULATORY JUGGLER

**Why she's essential:**
- **Lives the problem:** Quote: *"Monday I'm dealing with FDA requirements. Tuesday it's HIPAA. Wednesday an industry NDA. Can someone please make a chart?"*
- **Device development context:** Cardiac stent simulations for FDA 510(k). Knows the regulatory paperwork burden.
- **HIPAA + FDA simultaneously:** Hospital collaboration (HIPAA) feeding FDA submission (device regulations).
- **Compliance spreadsheet maintainer:** Tracks which project needs which framework. This guidance should replace her spreadsheet.

**What she'll review:**
- **Multi-regulatory integration:** Does the guidance show how HIPAA + FDA + IRB intersect, not just list them separately?
- **Practical checklists:** Can she use these instead of her color-coded Excel spreadsheet?
- **FDA 510(k) pathway:** Is it accurate for device submissions? Any gaps?
- **Hospital data workflows:** Does the HIPAA section address working with hospital partners?

**Her critical eye will catch:**
- Treating regulations in silos (they overlap in real projects)
- Theoretical guidance that doesn't map to real workflows
- Missing the "what do I do when FDA AND HIPAA requirements conflict?" scenarios

**Quote that shows she needs this:**
> *"I have three projects with three different compliance frameworks. Please tell me this tool understands that."*

---

### 3. Marco Delavigne (IT, 28 years) — PRACTICAL IMPLEMENTATION REVIEWER

**Why he's essential:**
- **Support burden perspective:** Will faculty actually read this, or will they still call him with questions?
- **Knows faculty workarounds:** What do faculty do vs. what they're supposed to do? Guidance should address reality.
- **Institutional context:** Does it match how Northwinds (and similar universities) actually work?
- **Enforcement lens:** Can he point faculty to specific sections when they ask questions?

**What he'll review:**
- **Quick Reference usability:** Can he paste this in ticket responses?
- **BAA section:** Does it match institutional BAA reality? (Some vendors have it, some don't)
- **Cloud guidance:** Accurate for AWS/Azure/GCP? Addresses what faculty actually use?
- **IT Staff Guide (Option B):** If pursued, he's the primary reviewer

**His critical eye will catch:**
- Guidance that's theoretically correct but institutionally impractical
- Missing edge cases that generate support tickets
- Overly simplistic "just get a BAA" advice (BAAs take months to negotiate)

**Quote that shows his perspective:**
> *"I've been explaining the tier system for fifteen years. If this wizard does it for me, I'll buy the developers dinner."*

---

## Good-to-Have Reviewers (Expand Scope)

### 4. Piper Nakamoto (IT Service Desk) — IF BUILDING IT STAFF GUIDE

**Why she's useful:**
- Represents first-line support perspective
- Knows what confuses faculty (she's confused too sometimes)
- Can identify what needs more explanation vs. what's clear
- Would be primary user of "IT Staff Quick Guide" (Option B)

**What she'd review:**
- Is the Quick Reference actually quick enough for phone support?
- Can she understand it well enough to explain to faculty?
- Which sections would she reference most?

---

### 5. Dr. Nelle Quarrin (Neuroscience) — OVERWHELMED CLINICIAN PERSPECTIVE

**Why she might be useful:**
- Represents "confused faculty" archetype
- HIPAA data but overwhelmed by compliance requirements
- Would identify what's too dense or assumes too much knowledge

**What she'd review:**
- Is the Quick Reference approachable for non-experts?
- Does it overwhelm or clarify?

**Probably skip:** She's less technical; Ada and Sela cover clinical expertise better.

---

## Recommended Review Committee

**Core 3 (Must-Have):**
1. **Dr. Ada Okonkwo** — Clinical AI + FDA + HIPAA expert
2. **Dr. Sela Frindt** — Multi-regulatory juggler, device development
3. **Marco Delavigne** — IT practical implementation

**+ Expanded (If Option B/D pursued):**
4. **Piper Nakamoto** — IT staff guide feedback

---

## Review Questions for Each

### For Dr. Ada:
- Is the FDA clinical AI pathway guidance accurate and current (2025-2026)?
- Does the HIPAA de-identification section have sufficient depth for clinical researchers?
- Are the bias validation requirements aligned with FDA expectations?
- Do the multi-regulatory scenarios reflect real clinical AI development complexity?

### For Dr. Sela:
- Does this replace your compliance spreadsheet, or is it missing something?
- Do the multi-regulatory scenarios address projects that cross FDA + HIPAA boundaries?
- Is the FDA 510(k) section sufficient for device submissions?
- Are there scenarios we're missing (industry NDA + FDA + HIPAA)?

### For Marco:
- Will faculty use this, or will they still call you?
- Can you paste sections into ticket responses?
- Does the cloud/BAA section match Northwinds' actual contracts?
- Quick Reference vs. Detailed Guide — useful split, or just two things to maintain?

---

## Format for Their Review

Given them:
1. **The spec** (this document) — context and scope options
2. **Quick Reference prototype** (18 pages) — scan in 30 min
3. **Detailed Guide selected sections** (20-30 pages relevant to their domain) — 1-2 hours
4. **Specific questions** (above) for their expertise

**Don't ask them to read all 128 pages.** Curate relevant sections per reviewer.

---

## Expected Feedback & Next Steps

**Dr. Ada will likely say:**
- "FDA section needs more on PCCP and continuous learning systems"
- "HIPAA de-identification is good, but add more on free-text clinical notes"
- "Love the multi-regulatory scenarios — add one for federated learning"

**Dr. Sela will likely say:**
- "This would have saved me SO MUCH TIME on my last FDA submission"
- "Can you add a section on industry collaborations with PHI?"
- "The chart I've been asking for? This is it."

**Marco will likely say:**
- "Quick Reference looks useful. I'll try it with the next three faculty tickets."
- "Detailed Guide is thorough. Will faculty read it? Doubtful. But good to have."
- "Cloud/BAA section is solid. Matches our vendor contracts."

---

## Use Their Feedback To:

1. **Refine scope** — Ada/Sela say "too much" or "missing X" → adjust
2. **Identify gaps** — Marco says "faculty ask about Y constantly" → add section
3. **Prioritize options** — If all three say "Quick Reference is enough," → Option C. If they say "need comprehensive," → Option A or D.
4. **Validate accuracy** — Ada catches FDA errors, Sela catches device pathway issues

---

*Recommendation: Start with core 3 reviewers (Ada, Sela, Marco). Their combined expertise covers clinical AI (Ada), device development (Sela), and practical implementation (Marco). Add Piper only if pursuing IT staff guide (Option B).*
