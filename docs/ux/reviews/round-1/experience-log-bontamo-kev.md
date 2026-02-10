# Experience Log: Dr. Kev Bontamo

**Persona:** Materials Science Professor, 22 years experience, FORTRAN veteran
**Date:** February 5, 2026
**Project:** NSF CAREER Grant Renewal - Multiscale Modeling
**Goal:** Generate budget estimate and DMP text for 5-year grant proposal

---

## Session Start: 14:23

Grant proposal due in two weeks. Need computational resource budget and DMP section.

Opening OpenResearchDataPlanner. Let's time this.

---

## Step 1: Welcome (14:23:15)

"Get Started" button. Click.

**Time:** 5 seconds. Fine.

---

## Step 2: Data Classification (14:23:20)

| Tier | Use when your data... |
|------|----------------------|
| Low | Is publicly releasable |
| Medium | Has some restrictions (proprietary, unpublished) |
| High | Contains PHI, HIPAA data |
| Restricted | Requires special handling (FISMA, CUI) |

**Selection:** Medium

**Reasoning:** Pre-publication research. Competitive field. Don't need encryption, just don't want to share before I publish.

No tooltip appeared. No explanation I didn't ask for. Good.

**Time:** 10 seconds total

---

## Step 3: Grant Period (14:23:30)

Preset durations: 1, 2, 3, 5 years

**Selection:** 5 years

**Start date:** July 1, 2026 (standard NSF CAREER start)

End date auto-calculates to June 30, 2031. Correct.

**Time:** 15 seconds total

---

## Step 4: Data Retention (14:23:45)

Common requirements table shows:
- NSF: 3 years after project end

**Selection:** 3 years post-grant

Archive ratio slider appears. Default 70%. I usually keep about 60% (delete intermediate meshes, keep final results).

**Adjusted to:** 60%

**Observation:** The UI shows "3.6TB will be archived" (calculated from... I haven't specified storage yet. Confusing. Maybe it's a preview?)

Actually, on re-read of the guide, this must calculate later based on my storage estimates. That makes sense.

**Time:** 30 seconds total

---

## Step 5: Select Services (14:24:15)

### First View: Bundles Tab

Bundles displayed:
- Storage Only
- Genomics Pipeline
- ML/AI Training (Cloud)
- **Simulation & FEA** ← This one
- Clinical/IRB Data
- Collaborative Project
- ... others

**Clicked:** "Simulation & FEA"

Bundle description:
> "GPU-accelerated computing for finite element analysis, CFD, molecular dynamics, and similar compute-intensive simulations."

Services included:
- GPU Cluster (500 GPU-hours)
- Research Storage (50TB)
- RC Consultation (1 hour free)

**Reaction:** Close to what I need. But 50TB is way too much. And I don't need consultation.

**Clicked:** "Apply Bundle"

Services added to my selection. Good.

**Now what?** Can I modify these? Let me check the Browse Services tab.

### Browse Services Tab

Services listed by category:
- **Compute:** HPC Cluster, GPU Cluster, AWS Compute, Azure Compute, K8s Cluster
- **Storage:** Research Storage, NWFiles, OneDrive, LabArchives, Globus Transfer, Cold Archive
- **Environment:** Secure Enclave, Research VDI (Silver/Gold/Platinum), Web Hosting
- **API:** Azure OpenAI
- **Support:** RC Consultation

**Observation:** GPU Cluster already has a checkmark (from bundle). Research Storage has a checkmark.

Can I add HPC SLURM cluster too? My multiscale modeling uses both GPU for FEA and CPU cluster for parameter sweeps.

**Clicked:** HPC Cluster (SLURM)

Checkmark appears. Good. I now have:
- HPC Cluster ✓
- GPU Cluster ✓
- Research Storage ✓
- RC Consultation ✓

Wait, do I actually want RC Consultation? Let me uncheck it.

**Clicked:** RC Consultation checkbox

Unchecked. Good. Tool doesn't force bundle selections to be permanent.

**Time:** 90 seconds total

---

## Step 6: Usage Estimates (14:25:45)

### Service 1: HPC Cluster (SLURM)

**Prompt:** "How many CPU-core-hours do you expect per month?"

**Presets:**
- Light: 1,000 SU
- Moderate: 10,000 SU
- Heavy: 100,000 SU
- Very Heavy: 500,000 SU

**My need:** 60,000 SU/month (for CAREER project)

No preset matches exactly. Input field shows 10,000 (probably from clicking area).

**Typed:** 60000

Field accepts it. No error. No warning. Good.

**Subsidy checkbox:** "Scavenger Partition - Free tier for preemptible workloads"

**Decision:** Don't check it. Grant-funded work needs reliability.

**Cost preview:** Shows $0.08/SU (volume tier, since 60k is > 10k). Math: 60,000 × $0.08 = $4,800/month.

That's correct.

---

### Service 2: GPU Cluster

**Prompt:** "How many GPU-hours per month do you estimate?"

**Presets:**
- Light (FEA prototyping): 100 GPU-hr
- Moderate (Production FEA): 500 GPU-hr
- Heavy (Large-scale simulation): 2,000 GPU-hr

**My need:** 500 GPU-hr/month is about right

**Clicked:** "Moderate (Production FEA)" preset

Value set to 500. Good.

**Subsidy:** "GPU Scavenger Queue - Free preemptible GPU access when capacity available"

Auto-applied subsidy: 500 free units per month, max.

Wait. That means my first 500 GPU-hours are FREE on scavenger?

**Reaction:** That's... actually really good. If I can tolerate occasional preemption for some jobs, that's $250/month saved.

But no. Grant budget needs to assume I'm paying full price. Can't rely on free tier availability in a 5-year proposal.

**Question:** Can I disable this auto-applied subsidy?

Looking at the UI... doesn't seem like there's a checkbox. It says "auto-applied."

**Concern:** If this is auto-applied and reduces my budget estimate, but the free tier isn't guaranteed, my budget will be wrong.

**Workaround thought:** Maybe the budget shows both with and without subsidies? I'll see in Results.

**Cost preview:** $0.50/GPU-hr for first 1000 hours (standard tier). Wait, but subsidy is 500 free units...

Actually, re-reading: "Free preemptible GPU access when capacity available." Maybe this is a separate scavenger queue, not a discount on paid jobs?

**Confusion:** This subsidy language isn't clear. Is it 500 free GPU-hours on scavenger queue (separate from paid usage)? Or 500 units off my paid allocation?

**Note to self:** Check the budget breakdown in Results to understand this.

---

### Service 3: Research Storage

**Prompt:** "How much active storage do you need?"

**Presets:**
- Small project: 1 TB
- Medium project: 10 TB
- Data-intensive: 100 TB
- Large-scale: 500 TB

**My need:** 8 TB for multiscale modeling project

Bundle default was 50TB. Way too high.

**Typed:** 8

Unit shows "TB". Good.

**First 500GB free:** Shows as auto-applied subsidy. Fine. That's standard.

**Archive estimate:** Shows "Archive: 4.8 TB at $0.50/TB/month"

**Math check:** 8TB × 60% retention ratio = 4.8TB. Correct.

**Cost preview:**
- Active: 8TB × $5/TB = $40/month (minus 0.5TB free = 7.5TB × $5 = $37.50/month)
- Archive: 4.8TB × $0.50 = $2.40/month during retention period

Looks right.

**Time:** 3 minutes total (some confusion on GPU subsidy)

---

## Step 7: Results (14:28:45)

### Budget Estimate Tab

**Summary Cards:**

| Monthly Cost | Grant Period | Archive (3 years) | Grand Total |
|--------------|--------------|-------------------|-------------|
| $5,037.50 | $302,250.00 | $259.20 | $302,509.20 |

**Initial reaction:** That's... higher than I expected. Let me check the breakdown.

**Cost Breakdown Table:**

| Service | Monthly | Grant Period (5yr) | Archive | Total |
|---------|---------|-------------------|---------|-------|
| HPC Cluster (SLURM) | $4,800.00 | $288,000.00 | - | $288,000.00 |
| GPU Cluster | $200.00 | $12,000.00 | - | $12,000.00 |
| Research Storage | $37.50 | $2,250.00 | $259.20 | $2,509.20 |
| **Total** | **$5,037.50** | **$302,250.00** | **$259.20** | **$302,509.20** |

**Wait.** GPU Cluster shows $200/month, not $250.

**Ah.** The subsidy IS being applied. 500 GPU-hr at $0.50 = $250, but free tier reduces it to... wait, let me recalculate.

Actually, if first 500 are free via scavenger, and I'm using exactly 500, then cost should be $0.

But it shows $200.

**Confusion intensifies.**

Let me look at the pricing structure again. Services.yaml said:
- Tiers: $0.50 (up to 1000), $0.40 (up to 5000), $0.30 (above)
- Subsidy: free_units: 500

Oh. FREE_UNITS means 500 units are free, not a discount percentage.

So: 500 GPU-hr usage - 500 free units = 0 billable hours at tier 1... should be $0.

**But it shows $200.**

**Hypothesis:** Maybe the tool is calculating 500 GPU-hr × $0.40? That would be tier 2 pricing. But I'm under 1000, so should be tier 1.

**Problem:** The numbers don't make sense. Either:
1. The subsidy isn't being applied correctly
2. The pricing tiers are calculated wrong
3. I'm misunderstanding how the subsidy works

**This is exactly what I was afraid of.** Wrong numbers kill trust.

**Action:** Let me check if there's an explanation by expanding the service detail...

(No expand option visible in the mockup/description)

**Decision:** I'll have to ask IT about this. Can't trust this estimate until I understand the GPU pricing.

---

### Subsidy Footnote

At bottom of budget table:
> *Costs shown include auto-applied subsidies. Optional subsidies (if selected) are also reflected.*

**Reaction:** Okay, so subsidies ARE included. But the math still doesn't add up for GPU cluster.

---

### Export Budget (Markdown)

**Clicked:** Export Budget button

File downloads: `budget-estimate-2026-02-05.md`

**Contents preview (from guide description):**
```markdown
# Research Computing Budget Estimate

## Summary
- Monthly: $5,037.50
- Grant Period: $302,250.00
- Archive: $259.20
- **Total: $302,509.20**

## Breakdown
[... table ...]
```

**Reaction:** Clean format. I can paste this into my budget justification. IF the numbers are right.

---

### Data Management Plan Tab

**Clicked:** DMP tab

**Preview shows:**

> ## Data Management Plan
>
> ### Computational Resources
>
> This project will utilize Northwinds University's high-performance computing infrastructure, including:
>
> **HPC Cluster (SLURM):** CPU-based computing for parameter sweeps and large-scale batch processing. We estimate 60,000 service units per month...
>
> **GPU Cluster:** NVIDIA V100 GPU resources optimized for finite element analysis and compute-intensive simulations. We estimate 500 GPU-hours per month...
>
> **Research Storage:** Active storage on GPFS parallel filesystem for simulation inputs and results. We will maintain 8 TB of active data...
>
> ### Data Retention and Archival
>
> Per NSF requirements, data will be retained for 3 years following project completion. Approximately 4.8 TB will be migrated to cold archive storage...

**Reaction:** This is... actually pretty good. It's specific. It has my numbers. It's not generic boilerplate.

The language is a bit formal but that's fine for NSF.

**Would I use this directly?** Maybe 80% as-is. I'd edit the intro paragraph to mention "multiscale modeling" and "composite materials" but the resource description is solid.

**Clicked:** Copy to Clipboard

**Clicked:** Download as Markdown

File: `dmp-2026-02-05.md`

---

## Session End: 14:32

**Total time:** 9 minutes (including time spent debugging the GPU subsidy confusion)

---

## Immediate Feedback

### What Worked

1. **Bundle system:** "Simulation & FEA" was a good starting point. Saved time vs. selecting services individually.

2. **Presets:** GPU cluster presets (Light/Moderate/Heavy) matched real-world usage patterns. Good.

3. **Auto-calculations:** Archive storage calculation (60% of 8TB = 4.8TB) worked correctly.

4. **DMP text quality:** Better than I expected. Specific enough to use with light editing.

5. **Clean interface:** No tooltips explaining what HPC is. No hand-holding. Respected my expertise.

6. **Export formats:** Markdown is perfect for proposal integration.

### What Didn't Work

1. **GPU subsidy confusion:** The pricing math doesn't add up. 500 GPU-hr with 500 free units should be $0, not $200. CRITICAL ISSUE.

2. **No multi-project workflow:** I have THREE projects to budget for this cycle. Running through this wizard three times is tedious.

3. **No template saving:** Can't save this configuration as "CAREER Grant - Computational" and reuse it.

4. **Auto-applied subsidies concern:** If the free tier isn't guaranteed, I shouldn't rely on it in my budget. Need a way to show "full cost without subsidies."

5. **Large compute validation:** I use 80k SU/month for my composite project. Didn't test that here. Will it handle it?

6. **Missing services:** No ANSYS license hosting, no FlexLM server, no ACCESS allocation pathway.

### Critical Path Issues

**GPU pricing error:** Cannot trust this tool until the subsidy calculation is explained or fixed.

**Workaround:** I'll still use my manual spreadsheet for final budget. Maybe use this tool for DMP text only.

---

## Follow-up Questions for IT

1. How does the GPU Scavenger subsidy work? Is it 500 free units on a separate queue, or 500 units off paid usage?

2. Can I see a cost estimate WITHOUT subsidies (worst-case scenario)?

3. Is there a way to save configurations as templates?

4. Does the tool support multiple projects in one session?

5. What's the maximum compute allocation supported? (Need to test 80k SU/month)

---

## Scenarios Not Tested

### Scenario 1: Composite Project (Industry Sponsor)

**Different from CAREER:**
- 80,000 SU/month (not 60k)
- 10 TB storage (not 8)
- 3-year grant (not 5)
- Might need dedicated compute allocation

**Question:** Will 80k SU/month work in the tool?

### Scenario 2: Validation Suite (Storage Only)

**Characteristics:**
- Low tier (public data)
- 3 TB storage
- 5-year retention
- No compute

**Question:** Can I select "Storage Only" bundle and get clean estimates?

### Scenario 3: Multiple Projects Combined

**Real world:** I'd budget all three projects together on one proposal if it's an equipment grant.

**Question:** Is there a way to combine multiple project estimates?

---

## Bottom Line

**Would I use this tool?**

**For DMP text:** Yes, probably. The generated text is good enough to edit.

**For budget estimates:** Not yet. The GPU pricing error breaks my trust. I need to understand why the math is wrong.

**For efficiency:** Maybe, if template saving existed. Otherwise running through the wizard 3 times for 3 projects isn't faster than my spreadsheet.

---

## Recommendation to Colleagues

**What I'd say:**

> "There's a new planning tool. The DMP text generator is decent. But double-check the budget numbers against your own calculations. I found a pricing error with GPU subsidies that didn't make sense. Tool has potential but needs refinement."

**Who I'd recommend it to:**

- **Junior faculty** who don't have established budget templates yet
- **First-time grant writers** who need DMP language examples
- **Non-compute experts** who need guidance on service selection

**Who I'd warn away:**

- **Anyone budgeting large allocations** until I verify it handles 80k+ SU/month correctly
- **Anyone needing exact budget numbers** until the subsidy calculation is clarified
- **Power users who need templates** — the tool doesn't save configurations yet

---

## What Would Make Me Fully Adopt This

1. **Fix the GPU pricing calculation** (or explain why it's correct)

2. **Add template saving:** "Save as template" button, "Load template" option

3. **Support multiple projects:** "Add another project" workflow, combined budget view

4. **Show full cost vs. subsidized cost:** Two columns: "With subsidies" and "Full cost (worst case)"

5. **Keyboard shortcuts:** Tab navigation works, but add Ctrl+S to save, Ctrl+E to export, etc.

6. **Validation for large allocations:** If I enter 500k SU/month, don't show an error. Just calculate it.

---

## Final Verdict

**Efficiency score:** 6/10
- Faster than starting from scratch
- Slower than my existing spreadsheet (which has templates)

**Accuracy score:** 4/10
- HPC and storage calculations appear correct
- GPU pricing doesn't make sense
- Can't trust it until this is resolved

**Usefulness score:** 7/10
- DMP text generation is the killer feature
- Budget export format is clean
- Service bundles save time

**Overall:** 5.7/10

**Will I use it for this grant proposal?**

Yes, for DMP text (with editing).
No, for final budget numbers (until GPU pricing is explained).

**Time saved:** ~5 minutes on DMP writing. ~0 minutes on budget (still have to validate manually).

**Would I recommend it?** With caveats, yes. But it's not ready for power users yet.
