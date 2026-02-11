# Dr. Sela Frindt: Review of EXPLORE-FIRST.md

**Persona:** Biomedical Engineering, FDA 21 CFR Part 11 + HIPAA compliance, Medium tech level
**Projects:** Cardiac stent FDA submission (L3), hospital implant analysis (L3 HIPAA), undergraduate archive (L1)
**Date:** Review of EXPLORE-FIRST design document

---

## Executive Summary

The EXPLORE-FIRST framework is genuinely helpful for pre-wizard exploration — I can see myself using "Check Your Tier" to confirm my data classifications before submitting to IT. But the design is missing critical compliance signaling for L3/L4 projects. Right now, if I'm browsing services for my implant analysis work, I can select services that look available, then discover mid-planning that a BAA is required, or worse, that I misunderstood which services support HIPAA.

The "Submit to Research IT" flow assumes research IT will catch compliance gaps. That's a bet I can't make with regulated data.

---

## Key Findings

### 1. Compliance Markers Missing from Service Matrix

**The Problem:**
The EXPLORE-FIRST service matrix shows availability (✓ ⚠ ✗) by tier, but doesn't distinguish *why* something is available or what compliance overhead applies.

For L3 data, I need to know:
- **Is this service BAA-covered?** (OneDrive, Azure storage are; others may not be)
- **Does it require upfront security review?** (AWS compute does; VDI doesn't)
- **What training is mandatory?** (HIPAA training vs. export control training)
- **How long does approval really take?** (3 days vs. 2 weeks)

The current design shows:
```
Cloud HIPAA Storage     ✓   ✓   ✓   ⚠      [Details]
```

But what I actually need to see before selecting:
```
Cloud HIPAA Storage     ✓   ✓   ✓*  ⚠
   * BAA pre-approved, requires: [HIPAA training + compliance review (3-7 days)]
   ⚠ Not recommended for ITAR/export-controlled data
```

**Recommendation:**
Add a compliance legend to the service matrix footer:
```
Legend:
✓ Self-service         ⚠ Requires approval    ✗ Not available
🔒 BAA pre-approved    📋 IRB documentation needed    ⚠️ Security review required
```

Then badge each service:
```
VDI HIPAA              ✓   ✓   ✓ 🔒  ⚠       [Details]
```

---

### 2. "Pre-Approved Services" List Buried in tier-workflow.yaml

**The Problem:**
In tier-workflow.yaml, there's a `preapproved_services` list under L3 that names VDI HIPAA and Cloud High-Security. But this is IT documentation, not in the explorer UI.

When I use Browse Services, I don't see which services are actually pre-vetted for HIPAA. I have to infer from the "review" approval type, then guess whether that's a rubber-stamp or a weeks-long security assessment.

For my implant project, I need the answer to this question *before* I add services to my slate:
> "Which services can I use *right now* for HIPAA data without waiting for additional approval?"

**Recommendation:**
In the Service Detail Modal, add a "Compliance Status" section:

```
Compliance Status
─────────────────────────────────────────
L1 Public         ✓ Self-service
L2 Internal       ✓ Self-service
L3 PHI/HIPAA      🔒 Pre-approved
                    • BAA: In place (Microsoft Cloud Terms)
                    • Training: HIPAA annual
                    • Timeline: Same day (after training completion)
                    • Contact: rc-help@northwinds.edu
                    [View full approval process →]

L4 Export-Control ✗ Not available
                    • Recommended: Secure Enclave
```

This turns vague approvals into actionable intel.

---

### 3. L3 Workflow Matches Experience, But Timing Matters

**What Works:**
The L3 workflow in tier-workflow.yaml reflects reality:
- Research IT consultation (1-3 days)
- BAA verification (same day to 1 week)
- Environment setup (1-3 days)
- Training (30 min)
- Access granted

This tracks my hospital collaboration experience: It took a week to get started after I submitted my plan, mostly because we had to verify that the hospital's BAA covered our specific use of cloud storage.

**What's Missing:**
The EXPLORE-FIRST design doesn't explain *why* I should complete the wizard before I know my timeline constraints.

For my FDA stent work, I have a regulatory deadline. If I discover mid-wizard that HPC Standard (my first choice) requires a 3-7 day security review, I need to know that *before* I've built my entire cost estimate around it.

**Recommendation:**
In the "Check Your Tier" questionnaire result, show:
```
Your Data Classification: L3 — High

Typical Timeline
─────────────────────────────────────────
                              Days to Access
• Self-service services
  (VDI, LabArchives)         Same day (after training)

• Services requiring review
  (AWS, Cloud Compute)       3-7 days (includes security assessment)

Your deadline?               [Expedite options →]
```

If I have a grant deadline in 2 weeks, I need to know right then which services won't make the cut.

---

### 4. DMP Generation Doesn't Include Compliance Language

**The Problem:**
EXPLORE-FIRST promises "DMP draft generation," but the example in Feature 7 (Grant Writer Export) shows generic boilerplate:

```markdown
## Data Management Plan: Storage and Computing

Data will be stored on institutional research storage infrastructure
(25 TB allocation) with nightly backups and 30-day retention...
```

For my FDA submission, my DMP must address:
- **21 CFR Part 11 compliance:** How are electronic records validated? Who has audit access?
- **Retention schedule:** FDA requires stent data for 5 years post-market (different from other projects)
- **Change control:** Any modifications to the data or analysis must be documented with timestamps and user IDs
- **Data integrity:** Checksums, hashing, immutability protections

My hospital IRB asks for:
- **HIPAA safeguards:** Encryption, access controls, de-identification procedures
- **Data use restrictions:** "Data from patient cohort X may only be used for research questions Y and Z"

Right now, the tool generates text about storage duration, not compliance requirements.

**Recommendation:**
Extend DMP generation to template-in compliance language based on:

1. **Tier classification** (L3 → include regulatory language)
2. **Compliance types** (if L3, check mappings for BAA-required services)
3. **Specific regulations** (if FDA + biomedical, include 21 CFR Part 11; if HIPAA, include de-identification language)

Example DMP template for L3 FDA:
```markdown
## Regulatory Compliance

This research involves data subject to FDA 21 CFR Part 11 requirements
for electronic record validation. All data storage and analysis systems
must maintain:

• Audit trails of all data access and modifications
• User authentication and authorization controls
• Data integrity verification (checksums/hashing)
• Retention for minimum [FDA-required period]
• Annual compliance certification

Storage will use [Service Name], which provides [encryption method]
and supports audit logging required for 21 CFR Part 11 compliance.
```

Without this, my DMP is incomplete, and my IRB/FDA submissions look unprepared.

---

### 5. "Submit to Research IT" Flow Has an Assumption Problem

**The Assumption:**
The current design assumes that once I fill out the "Submit" step (funding source, contact info, timeline), everything is ready for IT to provision.

But for L3 projects, I'm not actually "ready" — I'm ready to *ask*. Research IT needs:
1. Confirmation that I understand my compliance obligations
2. Documentation of my data use agreement (if L3)
3. Evidence that my team has completed required training
4. IRB protocol number (if human subjects)

Right now, the Slate captures funding source and timeline. It doesn't capture compliance readiness.

**What Happens in Practice:**
I submit my slate for an L3 project. IT emails back: "We see you want VDI for HIPAA data. Before we provision, can you confirm: (1) Has your team completed HIPAA training? (2) Do you have IRB approval yet? (3) Who's the data custodian?"

Then I'm in email back-and-forth for 2 days. The tool didn't save me time; it just moved the friction downstream.

**Recommendation:**
For L3+ submissions, add a "Compliance Checklist" step before final submission:

```
Before Submitting Your L3 Slate
─────────────────────────────────────────
These items help Research IT provision faster. Leave blank if unsure
and we'll follow up.

☐ Data Custodian Name: [_____________________]
☐ IRB Protocol #:      [_____________________]
☐ HIPAA Training completion date: [date picker]
☐ Data Use Agreement attached: [upload or link]
☐ Regulatory notes: [text box for FDA/export control context]

[ℹ️ Why we ask: These items help us configure services correctly
   and avoid provisioning delays]
```

Then the submission email to IT includes this context, and they can start work immediately instead of waiting.

---

## What I'd Use This Tool For

1. **"Check Your Tier"** — Yes. I have three projects (L1, L3, L3) and I sometimes second-guess my classifications. A questionnaire that asks "Does this project involve patient data?" would save me a spreadsheet lookup.

2. **"Browse Services"** — Yes, but only if services show their compliance overhead clearly. Right now it looks like all L3 services are equivalent, which is wrong.

3. **"Estimate Needs"** — Maybe. The calculator examples (microscopy, genomics) don't match my work, but the idea of "what size storage do I need?" is useful. For my FDA work, I'd want a regulatory data estimator: "How many stent samples? How many parameters per sample? FDA retention period? → Total storage recommendation."

4. **Service Slate Submission** — Yes, but I'd want the compliance checklist before hitting submit. Otherwise it's just creating work for IT.

---

## The Core Issue

This tool excels at helping researchers **explore without commitment**. But for L3 projects, commitment requires compliance verification. I can't build a slate for HIPAA data without knowing:

- Which services are actually pre-approved?
- How long will approval take?
- What compliance documentation does IT need from me?
- Will my DMP satisfy my IRB/FDA reviewers?

Right now, the answers are "ask IT," which defeats the purpose of the tool.

**The fix:** Make compliance assumptions explicit in the UI. Show pre-approval status, approval timelines, and required documentation *during* exploration, not after submission.

---

## Minor Observations

- **Feature flag "explore_first":** Good. Our institution will definitely customize this (we have local validators, research security contacts). Making it toggleable is right.

- **Seeding the wizard:** The idea that I can run calculators, then jump into the wizard with my estimates pre-filled is smart. Saves me re-entering numbers.

- **"DMP boilerplate" vs. "submit to IT" separation:** I like that the tool doesn't claim to be a complete DMP. But if it generates DMP text, that text should be compliance-aware, or it shouldn't generate it at all.

- **Mobile layout:** The service matrix becoming a list with a tier filter on mobile is practical. My lab uses tablets for clinical notes, so I'll likely access this from multiple devices.

---

## Bottom Line

EXPLORE-FIRST removes friction for L1/L2 researchers and provides a solid entry point for anyone to learn about options. But for compliance professionals like me, it needs one more layer: **compliance signaling.**

I don't need the tool to do my compliance work — Research IT does that. I just need to see which services have compliance overhead *before* I commit them to my slate.

Add the three things above (compliance badges in service matrix, pre-approval status in detail modals, compliance checklist before L3 submission), and this becomes a tool I'd recommend to my team.

Until then, I'll use it for exploration, then switch back to my spreadsheet for compliance cross-checking.
