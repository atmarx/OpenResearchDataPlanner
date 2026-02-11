# Review: EXPLORE-FIRST.md Design
## Dr. Lin Vosker | ECE Professor, Export-Controlled Research

**Date:** 2026-02-10
**Status:** Design Document Review
**Confidence:** Moderate — Good on paper, execution matters

---

## The Promise vs. The Practice

When I read EXPLORE-FIRST.md, I had to pause three times because the team actually *thought about my use case*. The service matrix showing tier availability. The standalone tier questionnaire. The calculators that don't force you into the wizard. This is what I asked for in round 1: "Let me explore before I plan."

They delivered. Sort of. On paper.

---

## 1. L3/L4 Workflow Clarity: Better, But Still Vague

**The Good:** The tier-workflow.yaml is vastly improved from what I saw before. L4 Restricted now has:
- Explicit "Export control determination" step (3-5 business days) with actual contact: `export-control@northwinds.edu`
- Security assessment for NIST 800-171 / CMMC compliance
- Enclave provisioning (1-2 weeks)
- Clear warnings about "only US persons may access"

This is honest. I know where to go. I know roughly how long it takes.

**The Problem:** EXPLORE-FIRST talks about understanding the landscape *before* committing. But if I'm an L4 researcher, I still don't know what I need to prepare before calling security. The FAQ says "it's better to over-estimate initially" — helpful. But do I need:
- A risk assessment?
- A personnel list?
- Export control classification from legal?
- A network architecture diagram?

The tool doesn't tell me what to bring to that security consultation. It just says "you need to have one." That's more than nothing, but not enough.

**Grade:** C+ for honesty, B- for actionability.

---

## 2. tier-workflow.yaml Config: This Actually Addresses My Concerns

What surprised me most was the **FAQ section**. Someone asked "Can I start working while waiting for approval?" and gave different answers for L3 and L4. That's the kind of detail that shows someone who understands regulated research.

The L4 answer specifically: "No, you must wait for full approval before any data access. However, you can prepare analysis code on non-sensitive test data." That's *correct*. Not every tool knows that.

The multi-project nightmare I mentioned in round 1 (three projects, three tiers)? The FAQ addresses it: "Not necessarily. If you have an established relationship with Research IT and your new project is similar to previous ones, we can often streamline or skip the consultation."

The config doesn't solve the problem, but it acknowledges it and provides guidance. That's better than silence.

**Grade:** A- for completeness.

---

## 3. EDA Tools: Still Missing

I searched EXPLORE-FIRST.md for "Cadence." "Synopsys." "EDA." Nothing.

The software catalog promised in the design exists (software.yaml is mentioned), but the document shows only MATLAB, Gaussian, GROMACS, NAMD, SAS, Stata. Computational chemistry. Statistics. Nothing for chip design.

The service matrix shows "Available" or "Requires Approval" — but it doesn't show *what services are available*. The document implies services will be listed, but I have no idea if "License Server Hosting (FlexLM)" is a service I can add to my slate. If FlexLM hosting exists, it should be discoverable in Browse Services or the software catalog.

**This is a design gap, not a EXPLORE-FIRST problem per se.** But if the goal is to let defense researchers explore before planning, not showing EDA tools means I'll hit a wall when I try to actually build my project.

**Grade:** D for completeness in my domain.

---

## 4. Service Slate for Defense Research: Consumer-Oriented, But Workable

EXPLORE-FIRST describes the "Service Slate" — essentially a shopping cart that persists until you submit to IT. The design is consumer-oriented: you pick items, see prices, submit. Fundamentally solid.

**For defense research?** Mostly workable, with caveats:

**The concern:** The slate shows "Monthly: $125 / Annual: $1,500." These are estimates. For L4 Restricted, the tier-workflow says "Secure enclave: consultation" with cost range "$5K-$50K/year depending on scale."

Does the slate show this uncertainty? The design says modals have sections like "Limitations" and "Not available" states (⚠ for approval). Good. But for L4, I need the slate to *clearly mark* estimates as provisional pending security review. The design doesn't explicitly say this happens.

**The good:** The design explicitly separates "Direct Request (via Slate)" from "Grant Planning Wizard." That's smart. I can request startup funds today without writing a 3-year DMP. That's my use case for L2. The slate serves that.

**For L4?** The slate still routes to IT (email submission to `rc-requests@university.edu`), who then kicks to security. That's fine. Not ideal, but workable.

**Grade:** B for my use case. Flexible enough, but cost uncertainty not addressed for high-complexity tiers.

---

## 5. "Complete Before Export" Gating: Makes Sense for Restricted Data

This is the piece I was most skeptical about in round 1. The concern: researchers download a PDF and think they're done, when actually they need security approval.

The design says: **Gate exports on required fields.** You can't export DMP text or cost estimates without:
- Tier selection (required)
- Grant duration (for projections)

And it explicitly shows a modal: "⚠ Remember: Submit your actual service request to Research IT before your grant starts!"

**For L4 Restricted?** The gating makes sense. But I'd add one more gate: **"Before export, confirm this data classification with our security team."** The tier questionnaire helps, but it's not official. The export shouldn't generate final DMP text without explicit security review.

The design is moving in the right direction, but doesn't go quite far enough for classified research.

**Grade:** B+ for self-service tiers, C+ for restricted tiers.

---

## Overall Assessment

EXPLORE-FIRST shows genuine thought about how researchers *actually* use tools:
- Let me estimate first, plan later
- Show me what's available at my tier
- Don't force me into a wizard immediately
- Acknowledge that some research needs consultation, not just forms

The tier-workflow.yaml has concrete details that address my biggest round-1 complaints. The "Complete Before Export" gating prevents the false-completion problem I was worried about.

**What still concerns me:**

1. **No EDA tools visible** — If I can bring my own Cadence license, this tool should make that discoverable
2. **L4 preparation guidance is vague** — "Contact security" is better than nothing, but "here's what to prepare" would be better still
3. **Cost uncertainty for complex tiers** — The slate should flag estimates that depend on security review

**What I'd do next:**

Before I use this in production, I'd want to see:
- Sample output of Browse Services showing actual EDA tools (or confirmation they're not supported)
- Mock-up of the L4 consultation pathway — actual form or email template
- Real walkthrough of adding an L3 service to the slate and what happens at submission

The design is honest about its limitations. That's good. But honesty + missing features is still missing features.

**Bottom line:** This is the first tool that takes defense research seriously. The EXPLORE-FIRST approach is exactly what I need. I'm cautiously optimistic. But I won't be truly convinced until I can actually use it for my three projects and get through an L3 review and L4 consultation.

Show me the actual UI. Then I'll believe it.
