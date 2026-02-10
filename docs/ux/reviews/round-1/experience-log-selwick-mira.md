# Experience Log - Dr. Mira Selwick

**Date:** February 5, 2026
**Reviewer:** Dr. Mira Selwick, Associate Professor, Chemistry
**Session Duration:** ~45 minutes (walked through all three projects)

---

## Project 1: Catalytic Reaction Pathway Modeling (Medium Tier)

**Context:** Industry collaboration under NDA, 3-year grant, compute-heavy DFT calculations

### Step-by-Step Experience

**Welcome Screen**
- Clean, professional. "Get Started" button is obvious.
- I like that it mentions "saved automatically" upfront. I'm paranoid about losing work.

**Data Classification (Step 2)**
- Selected "Medium" for industry NDA work.
- The tier table is helpful. "Proprietary, unpublished" - yes, that's me.
- **Question:** The description says "but isn't regulated." My industry partner has specific data handling requirements in the contract. Does that count as "regulated"? Or is "regulated" only for HIPAA/FISMA/etc.?
- **Suggestion:** Add an example like "industry collaborations under NDA" explicitly to the Medium tier row.

**Grant Period (Step 3)**
- Clicked "3 years" preset. Start date defaulted to today, which is fine.
- End date auto-calculated. Easy.
- **Friction point:** I actually need to budget for 3 years + 3 months of no-cost extension, but that's not a standard option. Used "Custom" but it felt like I was doing something wrong.

**Data Retention (Step 4)**
- Selected "3 years after grant end" for NIH compliance.
- The table showing funder requirements is GREAT. I'm showing this to my grad students.
- **Archive ratio slider:** Set to 70%. Honestly guessing. I'll keep input files and final outputs, delete intermediate SCF iterations. Would love validation that 70% is reasonable for computational chemistry.

**Select Services (Step 5)**

*Started with Bundles tab:*
- Looked at "Simulation & FEA" - says GPU-accelerated, V100s. My DFT is CPU-bound, not GPU. Doesn't fit.
- Looked at "Collaborative Project" - NWFiles + Azure compute. Too vague.
- **Gave up on bundles, switched to "Browse Services."**

*Browse Services:*
- Found "HPC Cluster (SLURM)" - this is what I need. Selected it.
  - Indicator showed "Green - Recommended" for Medium tier. Good.
- Found "Research Storage (GPFS)" - yes, for input/output files. Selected.
  - Also recommended. Makes sense.
- Looked for Gaussian license option. Not there.
- **Searched for "software," "license," "Gaussian."** Nothing.
- **Frustration building.** How do I budget for the software I actually run on the HPC?

**Usage Estimates (Step 6)**

*HPC Cluster:*
- Prompt: "How many CPU-core-hours per month?"
- I run ~30,000 SU/month sustained. Clicked "Moderate" preset (10,000), then manually adjusted to 30,000.
- **Friction:** The presets are helpful but none match my actual usage. Had to type.
- Saw tiered pricing kick in: 10K @ $0.10, next 20K @ $0.08. Okay, that makes sense.
- Scavenger partition subsidy: "Free for preemptible workloads." My industry partner wouldn't like preemption, so I didn't check it.

*Research Storage:*
- Prompt: "How much active storage?"
- I need ~4TB. Clicked "Medium project" (10TB) by accident, had to backspace and type 4.
- **Suggestion:** The presets jump from 1TB to 10TB. Need something at 3-5TB.
- Base allocation auto-applied (first 500GB free). Nice.
- Archive storage appeared: "At grant end, 70% of 4TB = 2.8TB will archive at $0.50/TB."
- **This is excellent.** I've never had a tool calculate archive costs for me before.

*Still looking for software licenses...*
- Scrolled through all services again. Checked "API" category (just Azure OpenAI), "Support" (just RC Consultation).
- **No software anywhere.**

**Results (Step 7)**

*Budget Estimate tab:*
- Monthly: ~$2,500 (mostly HPC compute)
- 3-year total: ~$90,000
- Archive (3 years post-grant): ~$50
- **This breakdown is exactly what I need for the budget justification.**
- **But it's incomplete without software costs.** I know Gaussian is at least $1,000/year. Where do I add that?

*Data Management Plan tab:*
- Generated text mentions HPC for compute-intensive workflows, GPFS for active data, cold archive for retention.
- Mentions Medium tier security controls.
- **This is actually usable.** I could paste this into my NSF proposal with minor edits.
- **Missing:** No mention of the software I'll be running. The DMP should say "Gaussian 16 for DFT calculations" but the tool doesn't know I'm using Gaussian.

### Summary for Project 1

**What Worked:**
- Tier selection was clear
- Retention/archive calculation is brilliant
- Cost breakdown is transparent
- DMP text is solid

**What Didn't Work:**
- No software/license budgeting
- Bundles didn't fit my use case
- Usage presets required manual adjustment

**Emotional State:** Frustrated but hopeful. The tool does 80% of what I need, but the missing 20% (software) is critical.

---

## Project 2: Published Benchmark Dataset Repository (Low Tier)

**Context:** Open data for computational chemistry community, 5-year project, storage-only

### Step-by-Step Experience

**Data Classification**
- Selected "Low" tier. "Publicly releasable, no restrictions" - yes, that's the whole point.
- Easy decision.

**Grant Period**
- 5 years. Clicked preset, done.

**Data Retention**
- "3 years after project end" for NSF.
- Archive ratio: 100%. I want to keep everything permanently for reproducibility.
- **Question:** If this is meant to be a permanent public dataset, should I even be using "archive" storage? Or should I plan for active storage indefinitely?

**Select Services**
- Clicked "Storage Only" bundle.
- It added Research Storage (10TB default).
- **Perfect.** This is exactly what I needed. Didn't have to think.

**Usage Estimates**
- Research Storage: Adjusted from 10TB down to 2TB.
- Archive estimate: 100% of 2TB = 2TB at $0.50/TB/month.
- **Wait, that's $1,440/year for archive storage.** Over 3 years that's $4,320 just to keep the data accessible.
- **Friction:** Is there a cheaper option for permanent public datasets? Should I be looking at an external repository like Zenodo instead?

**Results**
- Monthly: $10 (active storage)
- 5-year grant: $600
- 3-year archive: $4,320
- **Total: $4,920**

**Realization:** The archive costs more than the active grant period. This feels wrong for a public dataset that should live forever.

**DMP text:** Mentions retention and archive, which is good, but doesn't address long-term public access beyond the retention period. Will the university really host this forever?

### Summary for Project 2

**What Worked:**
- "Storage Only" bundle was exactly right
- Low tier selection was obvious

**What Didn't Work:**
- Archive model doesn't fit permanent public datasets
- No guidance on external repositories (Zenodo, OSF, Dryad) as alternatives
- DMP doesn't address post-retention accessibility

**Emotional State:** Confused about the right approach for long-term public data.

---

## Project 3: Graduate Student Training Calculations (Low Tier)

**Context:** Teaching project, 1-year budget, light compute

### Step-by-Step Experience

**Data Classification**
- Low tier. Training data, nothing sensitive.

**Grant Period**
- 1 year. Quick and easy.

**Data Retention**
- "None (delete after grant)" would be my preference, but that's not an option.
- Selected "Grant period only" - I think? Actually, the minimum seems to be "3 years after grant end."
- **Friction:** For teaching/training projects, I don't need to keep the data for 3 years. Can I select zero retention?

**Select Services**
- Browsed services.
- Selected HPC SLURM (for student practice jobs).
- Selected Research Storage (minimal, just for students to learn file management).

**Usage Estimates**
- HPC: 2,000 SU/month (light usage).
- Scavenger partition: Checked the box. Students learning can tolerate preemption.
- **Nice!** The discount applied and HPC is now free up to 5,000 SU/month.
- Storage: 0.5TB.
- Base allocation covers this entirely.
- **Monthly cost: $0**

**Results**
- Monthly: $0
- Grant period: $0
- Archive: $18 (0.5TB @ $0.50 for 3 years)
- **Wait, I have to pay to archive teaching data I don't want to keep?**

### Summary for Project 3

**What Worked:**
- Subsidies (scavenger partition, base allocation) are perfect for teaching projects
- Very cheap/free for training use

**What Didn't Work:**
- Can't opt out of retention for teaching projects
- Forced to budget for archive storage I don't need

**Emotional State:** Pleasantly surprised by the free tier, annoyed by forced retention.

---

## Overall Summary

### Across All Three Projects

**Pattern I Noticed:**
- The tool assumes all data needs long-term retention. That's not always true.
- No way to handle "delete after grant" scenarios.
- No guidance on when to use external repositories vs. institutional storage.

**Workflow Friction:**
- I had to go through the wizard three separate times for three projects.
- No way to compare projects side-by-side.
- No "multi-project summary" showing total costs across all my grants.

**The Software License Elephant in the Room:**
- I need to budget for Gaussian 16, ORCA, and MATLAB across these projects.
- The tool has no way to capture this.
- I'll have to manually add thousands of dollars to the budgets after export.

### What I Appreciated

1. **Archive cost calculation.** Nobody else does this. It's a huge pain point solved.
2. **Transparent tiered pricing.** I finally know what HPC actually costs at different usage levels.
3. **DMP generation.** Even incomplete, this saves me time.
4. **Subsidies clearly marked.** The scavenger partition option is great for teaching projects.

### What Frustrated Me

1. **No software licensing integration.** Dealbreaker for computational work.
2. **One project at a time.** Need multi-project budgeting.
3. **Forced retention.** Not all data needs 3+ years of archive.
4. **No external repository guidance.** When should I use Zenodo vs. institutional storage?

---

## Services I Wish Existed

1. **"Software License Manager"** - a service that lists institutional licenses (MATLAB, Mathematica, Gaussian, ANSYS) and their costs (or "free via site license").

2. **"ACCESS Allocation Assistance"** - help applying for ACCESS credits through our campus champion. Could be listed as a free/subsidized compute option.

3. **"External Repository Integration"** - for low-tier public data, offer Zenodo/Dryad/OSF as alternatives with guidance on when to use them.

4. **"FlexLM License Server Hosting"** - I know RC can host custom FlexLM servers. That should be a service with pricing.

5. **"Multi-Project Budget Consolidation"** - a service/feature to bundle multiple projects into a single grant proposal budget.

---

## One-Sentence Quote

> "This tool finally shows me what compute and storage cost, but I can't use it for a real grant proposal until it knows about Gaussian licenses."

---

## Final Rating: 3.5/5

**Would I recommend this to a colleague?**

Yes, with caveats. For a researcher who only needs compute and storage (e.g., genomics, ML), this is fantastic. For computational chemistry where software licensing is half the budget, it's incomplete but still useful as a starting point.

**Would I use this for my next grant?**

Yes, but I'd have to manually add software costs and make notes about the retention model not fitting public datasets.

**What would make this a 5/5 tool?**

1. Software license catalog integration
2. Multi-project support
3. Optional retention (allow "delete after grant")
4. External repository guidance for public data
5. Field-specific bundles (computational chemistry, bioinformatics, etc.)
