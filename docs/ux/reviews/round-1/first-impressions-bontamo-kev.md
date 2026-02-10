# First Impressions: Dr. Kev Bontamo

**Persona:** Materials Science Professor, 22 years experience, FORTRAN veteran
**Date:** February 5, 2026
**Context:** NSF CAREER grant renewal, multiscale modeling project

---

## Initial Reaction

Skeptical. Another research computing "wizard" that probably assumes I don't know what a service unit is.

But fine. Research admin wants cost estimates for the CAREER renewal. Let's see if this tool can give me accurate numbers faster than my usual method (spreadsheet I've been maintaining since 2015).

---

## Reading the User Guide

### What caught my attention

**"5-10 minutes"** — We'll see about that.

**Step 2: Data classification** — Table is clear. Medium tier for pre-publication work, yes, I know. Let's move on.

**Step 3: Grant period** — 5-year option for NSF. Good. That's what I need.

**Step 4: Retention** — "3 years after project end" for NSF. Correct. Archive storage slider is a nice touch. I usually keep 60-70% of simulation results, delete intermediate meshes.

**Step 5: Bundles** — Caught my eye. "Simulation & FEA" bundle exists. Includes GPU cluster and research storage. That's... actually exactly what I use. Didn't expect that.

**Step 6: Usage estimates** — Presets for different usage levels. "Heavy usage" shows 2000 GPU-hours. I usually run closer to 500/month for FEA. Glad there's a way to adjust.

**Step 7: Results** — Budget export to Markdown. DMP text generation. That could save time.

### What's missing

No mention of:
- SLURM partition options (standard vs. scavenger)
- Can I specify V100 vs. other GPU types?
- What about software licenses (ANSYS FlexLM server)?
- ACCESS allocation pathway?

### Concerns

- "Tips & FAQ" section seems geared toward beginners. "Can I go back and change something?" — Obviously I can click the progress bar.
- Not clear if this handles very large compute allocations (my composite project uses 80k SU/month).
- Archive storage calculation — need to verify the math is right.

---

## Bundles Review

Looked at `/config/bundles.yaml`:

### "Simulation & FEA" Bundle
```yaml
services:
  - gpu-cluster: 500 GPU-hours default
  - research-storage: 50TB default
  - rc-consultation: 1 hour free
```

**Reaction:** Close, but not quite. I need:
- 500 GPU-hours/month ✓
- 10TB storage (not 50) for CAREER project
- Don't need consultation (I know what I'm doing)

Default estimates are reasonable starting points. I can adjust. That's fine.

### Other bundles
- "Genomics Pipeline" — Not relevant
- "ML Training (Cloud)" — Why would I use cloud for simulation? V100s work fine.
- "Storage Only" — I have a validation suite project that's basically this

---

## Services Review

Looked at `/config/services.yaml`:

### HPC Cluster (SLURM)
- Tiered pricing: $0.10 → $0.08 → $0.05 per SU
- My composite project (80k SU/month) hits the volume tier
- Scavenger partition subsidy exists but requires opt-in
- **Question:** Are GPU jobs weighted differently? (Usually 1 GPU-hr = multiple SUs)

### GPU Cluster
- V100 architecture mentioned ✓
- Notes it's "optimized for simulation workloads" ✓
- FEA prototyping preset: 100 GPU-hr
- Production FEA preset: 500 GPU-hr ✓
- Tiered pricing structure

**Reaction:** Realistic. Matches what I actually use.

### Research Storage
- $5/TB/month
- First 500GB free
- Archive option points to cold storage

**Math check:**
- 10TB × $5 = $50/month
- Minus 500GB free = 9.5TB × $5 = $47.50/month
- Over 5 years × 12 months = $2,850 for active storage
- Archive: 7TB × $0.50/month × (3 years retention × 12) = $126
- **Total storage: ~$2,976**

That's... actually in the ballpark of what I budgeted last time.

### Cold Archive Storage
- $0.50/TB/month
- 48-72 hour retrieval

**Good.** That's acceptable for post-grant retention. I'll rarely need it.

### Missing Services
- No ANSYS license hosting
- No MATLAB compute licenses
- No mention of custom FlexLM server (we run our own for COMSOL)
- No ACCESS Program allocation pathway (we have a campus champion)

---

## Anticipated Issues

1. **Large compute projects:** Does the tool handle 80k SU/month gracefully? Or will it show warnings like "are you sure?"

2. **Multi-project workflow:** I need to budget THREE projects for this proposal cycle. Do I have to run through the wizard three times?

3. **Template saving:** Can I save a configuration and reuse it? I submit similar grants every few years.

4. **DMP templates:** Will they be generic ("We will use HPC resources") or specific enough to use directly?

5. **Cost escalation:** NSF grants are 5 years. Do prices stay flat or is there year-over-year increase?

---

## What Would Make This Useful

**Speed:** If I can complete this in under 3 minutes for a known configuration, I'll use it.

**Accuracy:** If the numbers match my manual calculations (within $100 or so), I'll trust it.

**Reusability:** If I can save templates, I'll use this for every grant.

**Export quality:** If the DMP text is good enough to paste directly into my proposal, that's a win.

---

## What Would Make Me Close the Tab

**Hand-holding:** Tooltips explaining what HPC is.

**Slow performance:** Any perceptible lag between steps.

**Wrong numbers:** If the budget calculation is off, I'll never trust it again.

**Can't handle large allocations:** If 80k SU/month triggers errors or warnings.

---

## Bottom Line

**Cautiously optimistic.** The bundles are well-designed. The service definitions look accurate. The math seems right.

But I need to actually USE it to know if it respects my expertise or treats me like a novice.

Let's see what happens when I actually walk through the wizard.
