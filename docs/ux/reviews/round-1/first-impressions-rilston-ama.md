# First Impressions: Dr. Ama Rilston

**Persona:** Dr. Ama Rilston, Professor of Genetics
**Date:** 2026-02-05
**Reviewing:** User Guide, Services, Bundles

---

## Initial Reactions

Finally. A tool that acknowledges data classification isn't one-size-fits-all.

I run a genomics core facility. On any given day, I'm processing human cancer samples (HIPAA + NIH genomic data sharing), proprietary mouse strain data (IP-sensitive), and museum bird DNA (open science). Each requires completely different handling. I spend half my time explaining to collaborators why they can't just "put everything on the shared drive."

When I saw this tool mentions Low, Medium, High, and Restricted tiers, I thought: "Okay, let's see if they actually get the nuance right, or if this is another oversimplified 'sensitive vs. not sensitive' binary."

---

## User Guide Review

### What Works

**Tier table is actually correct** (Step 2, lines 33-38)
- Low: "publicly releasable, no restrictions" - Yes, that's my museum bird project
- Medium: "some restrictions but isn't regulated" - Yes, my mouse strain data
- High: "PHI, HIPAA, regulated information" - Yes, my cancer study

This is better than most compliance documentation I've read.

**"Choose the tier for your most sensitive data"** - Good advice. Though I need to plan three separate projects, not just one. Can I do that efficiently?

**High tier mentions IRB explicitly** - Line 44. Good. My collaborators always forget that "under IRB" usually means High tier.

**Retention section acknowledges different requirements** - Lines 72-86. NIH is 3 years, clinical trials 7+ years. This matches what I tell people.

### What's Missing or Unclear

**No mention of NIH genomic data sharing policy**
The tier table says "PHI, HIPAA" for High tier, but doesn't mention NIH genomic data sharing requirements. My cancer study has BOTH - HIPAA because it's human subjects, AND NIH genomic data sharing because it's NIH-funded genomics.

These are related but distinct compliance requirements. If someone has NIH-funded genomics without identifiable information, they might still need High tier for data sharing requirements, not just HIPAA.

**"Multiple projects" workflow unclear**
The guide assumes I'm planning one project. What if I need to estimate costs for three different projects at three different tiers? Do I:
- Run through the wizard three times?
- Export each as JSON and somehow merge them?
- Just pick one project and manually multiply?

As someone managing a core facility, this is my actual use case.

**Retention language could be more precise**
Line 79: "NIH | 3 years after final report"

That's the *base* requirement. NIH genomic data sharing policy actually says: "Data should be kept for at least 10 years after the study ends or until the data are no longer useful, whichever is shorter."

If the tool is going to guide people on retention, it needs to be right for genomics data specifically.

---

## Services Review

I'll evaluate this through the lens of my three projects:

### Human Cancer Genomics (High Tier)

**What I'd need:**
- Azure Compute (HIPAA-compliant cloud) - I see this in services.yaml
- Research Storage with audit logging - I see this
- Cold Archive for 10-year retention - I see this
- Globus for receiving data from sequencing cores - I see this

**Missing from services.yaml:**
No explicit mention of "HIPAA-compliant" in the service descriptions. The cloud compute services (azure-compute, aws-compute) just say "institutional account" but don't call out that they're BAA-covered.

For High tier, I need to know: Is there a Business Associate Agreement in place? The service description should say so.

### Mouse Colony Breeding (Medium Tier)

**What I'd need:**
- HPC SLURM for analysis - Available
- Research Storage - Available
- Cold Archive for standard 3-year retention - Available

This looks straightforward.

### Museum Bird DNA (Low Tier)

**What I'd need:**
- HPC SLURM - Available
- Research Storage - Available
- Maybe Globus for sharing with museum partners - Available

Also straightforward.

### Services I'm Curious About

**OneDrive and LabArchives both have acknowledgment requirements** - Good. Both have hard limits that trip people up.

**RC Consultation** - First hour free. I might actually use this for the cancer study. Setting up HIPAA-compliant analysis environments is not my expertise.

---

## Bundles Review

### Genomics Pipeline Bundle

**Services included:**
- hpc-slurm: 50,000 SU (reasonable for WGS)
- research-storage: 100 TB (reasonable, ~1TB per sample)
- globus-transfer: 20 TB (good for receiving from cores)

**Recommended tiers: low, medium**

Wait. Why isn't this recommended for High tier?

My human cancer genomics study is literally a genomics pipeline. It's High tier because of HIPAA. The bundle description says "genomics and bioinformatics workflows" - that's exactly what I'm doing, but with human subjects data.

I understand that HPC SLURM might not be available for High tier (I saw that in mappings.yaml - no HPC for High tier), but then the bundle should:
1. Either be marked as available for High tier with a note that it requires cloud compute instead
2. Or there should be a separate "High-Tier Genomics Pipeline" bundle using Azure/AWS compute

As it stands, a genomics researcher with human data would look at "Genomics Pipeline" bundle, see it's not available for High tier, and think "I guess this tool isn't for me."

### Clinical/IRB Data Bundle

**Services included:**
- azure-compute: $2,000/month (HIPAA-compliant)
- research-storage: 10 TB

**Recommended tiers: high only**

This is closer to what I need for the cancer study, but:
- It's called "Clinical/IRB Data Analysis" not "Genomics"
- The storage estimate (10 TB) is way too small for genomics. I need 100+ TB.
- No Globus included for receiving sequencing data

So I have a High-tier genomics project, and neither the "Genomics Pipeline" bundle nor the "Clinical/IRB" bundle really fits.

### Storage Only Bundle

Simple. Clear. I'd use this for the mouse project. No complaints.

---

## Key Questions

1. **Can I plan multiple projects at different tiers in one session?**
   This is essential for my workflow. I need to submit grant budgets for all three projects.

2. **Is NIH genomic data sharing policy addressed anywhere?**
   It's not just HIPAA. Genomics has additional requirements.

3. **Why is the Genomics Pipeline bundle not available for High tier?**
   High-tier genomics is a real use case. Lots of it.

4. **Are the cloud compute services BAA-covered for HIPAA?**
   This needs to be explicit in service descriptions for High tier.

5. **How do I estimate costs across multiple projects?**
   Do I export JSON for each and manually sum? That feels clunky.

---

## Overall Assessment

**What's Right:**
- Tier definitions are accurate
- Acknowledgment requirements for limited services (OneDrive, LabArchives)
- Retention considerations are mentioned
- Services are comprehensive

**What Needs Work:**
- NIH genomic data sharing policy not mentioned
- Multi-project workflow unclear
- High-tier genomics use case not well supported by bundles
- HIPAA/BAA coverage not explicit in service descriptions

**My Confidence Level:**
I trust the tier logic is correct, but I'm concerned that genomics-specific compliance requirements (NIH data sharing) aren't fully captured. I'd need to verify retention requirements independently before putting this in a grant.

**Would I Use This?**
Maybe. For the mouse project (Medium tier, straightforward), yes. For the cancer study (High tier, HIPAA + NIH genomics), I'd need to talk to Research Computing first to make sure the tool's recommendations are actually compliant.

For the bird project (Low tier, open science), definitely yes.

---

## Test Plan (If I Were Actually Using This)

1. **Test 1: Museum Bird DNA (Low Tier)**
   - Expected: Smooth workflow, Genomics Pipeline bundle works
   - Success criteria: Gets me HPC + storage + Globus with correct costs

2. **Test 2: Mouse Breeding Study (Medium Tier)**
   - Expected: Smooth workflow, Genomics Pipeline or Storage Only
   - Success criteria: Correct retention (3 years standard), accurate costs

3. **Test 3: Cancer Genomics (High Tier)**
   - Expected: Some friction - Genomics bundle not available, have to pick services manually
   - Success criteria: Clear guidance on HIPAA compliance, 10-year retention for NIH genomics, BAA confirmation for cloud

4. **Test 4: Can I do all three in one session?**
   - Expected: Probably have to run the wizard three times
   - Desired: Some way to save and compare multiple project plans

---

**Bottom Line:**
This tool shows promise. The tier logic is sound. But genomics has compliance nuances (NIH data sharing, long retention, high-tier use cases) that aren't fully addressed yet. I'd use this as a starting point, then schedule that free RC consultation to verify the details.
