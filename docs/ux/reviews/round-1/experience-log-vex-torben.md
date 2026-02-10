# Experience Log: Dr. Torben Vex

## Project 1: Novel High-Entropy Alloy Simulations (Medium Tier)

**What I'm trying to accomplish:**
Get budget numbers for a 3-year NSF proposal. Need compute (50K SU/month sustained), active storage (8TB), and archive storage (5TB for 3 years post-grant). This is my crown jewel project with potential patent implications, so it's Medium tier.

**Step-by-step experience:**

### Welcome Step
Clicked "Get Started." Fine. No tutorial video popping up - good start.

### Tier Selection
Selected "Medium" - unpublished research with potential IP. The description matched my use case perfectly. No friction here.

### Grant Period
This is where I got annoyed. I don't care about specific dates. I care about duration. I selected "3 years" but then it wanted a start date. I picked "today" but that's not accurate - my grant won't start for 8 months if funded. Does this matter for the calculation? It shouldn't, but I'm not sure.

**Friction:** Why force me to pick a start date when it's irrelevant to the cost calculation? Just let me say "3 years" and be done with it.

### Data Retention
Selected "3 years after grant end" per NSF requirements. This is standard.

The "archive ratio slider" appeared. It defaulted to 70%. I need 5TB archived out of 8TB active, which is 62.5%. Close enough? No - I changed it. But the slider moved in weird increments. I wanted 62.5%, it snapped to 60% or 65%. Minor annoyance, but I care about the exact archive size.

**Friction:** Let me type in exact TB for archive, not fiddle with a percentage slider.

### Service Selection
Clicked "Browse Services" immediately. I don't need a bundle - I know what I need.

Found "HPC Cluster (SLURM)" - perfect. Added it.
Found "Research Storage (GPFS)" - added it.

The interface showed these as "Recommended" for Medium tier with a green indicator. Fine.

Looked for archive option... "Cold Archive Storage" was listed but grayed out. Clicked it - tooltip said "This is an archive tier, automatically added when needed." Okay, so I don't manually add this? Confusing UI pattern, but I trust it'll figure itself out.

**Pleasant surprise:** Services I added appeared in a side panel immediately. No page reload, instant feedback.

### Usage Estimates

**HPC SLURM:**
Input field asked for "CPU-core-hours per month." I typed 50000.

It showed tiered pricing:
- First 10,000 SU at $0.10
- Next 40,000 SU at $0.08
- Monthly cost: $4,200

Math check: (10000 × 0.10) + (40000 × 0.08) = 1000 + 3200 = $4,200. Correct.

There was a checkbox for "Scavenger Partition" subsidy - free tier for preemptible jobs. I don't use scavenger - my runs are too long. Didn't check it.

Presets showed "Heavy (large-scale)" at 100,000 SU. That's close but not exact. I kept my 50,000.

**Research Storage:**
Input field asked for TB. I typed 8.

It showed $5/TB/month, with "Base Allocation" of 500GB free auto-applied.
Monthly cost: 8TB - 0.5TB = 7.5TB × $5 = $37.50.

Archive section appeared below: "Archive estimate: 4.8 TB" (60% of 8TB - I had adjusted the slider)
Archive cost: 4.8TB × $0.50/month = $2.40/month over 3 years post-grant.

Wait - I want 5TB archived, not 4.8TB. How do I change this?

Found an override field: "Archive TB (overrides ratio)". Typed 5. Archive cost recalculated to $2.50/month.

**Pleasant surprise:** The override feature exists. Thank god.

**Friction:** Why make me use a percentage slider in the first place if I can just type TB? Skip the slider, let me type numbers.

### Results

**Budget Estimate tab:**
- Monthly: $4,237.50
- Grant period (36 months): $152,550
- Archive (36 months post-grant): $90
- **Grand total: $152,640**

My mental math earlier was ~$145K. The tool got $152K. Difference is because I underestimated the exact tiered pricing impact and forgot the subsidy offset. The tool is correct.

**Cost breakdown table:**
Showed line items for HPC SLURM ($151,200 over grant), Research Storage ($1,350 over grant after subsidy), and Cold Archive ($90 post-grant).

Numbers look right.

**Export buttons:**
Clicked "Export Budget (Markdown)." Got a clean Markdown table. Pasted into my proposal draft - formatting held up. Nice.

**Data Management Plan tab:**
Clicked over. Saw generated text:

> "Data will be stored on the university's Research Storage system, a high-performance GPFS-based filesystem with automated snapshots and backups. Compute analysis will be performed on the HPC Cluster using SLURM job scheduling. Following the grant period, data will be migrated to Cold Archive Storage for long-term retention in compliance with NSF requirements."

It's... fine. Generic but accurate. I'll need to add project-specific details (LAMMPS, trajectory files, etc.), but this is a solid skeleton. Beats starting from scratch.

**Pleasant surprise:** The DMP text actually mentions SLURM and GPFS by name. Shows technical literacy.

**Suggestions:**
1. Let me skip date selection - just ask for duration
2. Archive storage: let me type TB directly, skip the percentage slider dance
3. Show me ACCESS eligibility for compute-heavy Low-tier projects (more relevant to my other projects, but still)

---

## Project 2: PHYS 480 Computational Lab Archive (Low Tier)

**What I'm trying to accomplish:**
Simple storage budget for teaching materials. 2TB active, 2TB archive, 1 year duration. This should be trivial.

**Step-by-step experience:**

### Welcome Step
Clicked "Start Over" button. It warned me I'd lose my previous session. Clicked "Export Session (JSON)" first, just in case. Smart.

Started fresh.

### Tier Selection
Selected "Low" - educational materials, no IP concerns.

### Grant Period
Selected "1 year." Start date: today. Whatever.

### Data Retention
Selected "3 years after grant end" (federal grant standard).

Archive ratio slider appeared. 2TB active → 2TB archive = 100%. Adjusted slider to 100%.

### Service Selection
Browsed services. Added "Research Storage (GPFS)."

That's it. No compute needed.

### Usage Estimates

**Research Storage:**
Typed 2 TB.

Monthly cost: (2TB - 0.5TB free) × $5 = $7.50/month.

Archive: 2TB × $0.50/month = $1.00/month over 3 years post-grant.

### Results

**Budget:**
- Monthly: $7.50
- Grant period (12 months): $90
- Archive (36 months): $36
- **Grand total: $126**

Perfect. That's nothing. I can fold this into my startup funds or department allocation.

**DMP text:**
Basic but fine. Mentions GPFS, snapshots, cold archive. I'll add "student assignments and computational physics course materials" and call it done.

**Friction point:**
For a storage-only project, the wizard still made me go through all the steps (tier, dates, retention). I get why, but it felt like overkill for something this simple.

**Time elapsed:** Maybe 3 minutes total. Fast.

---

## Project 3: OpenKIM Interatomic Potential Validation (Low Tier)

**What I'm trying to accomplish:**
Budget for an open science collaboration. 10K SU/month bursty, 1TB active + 1TB archive, 2 years. All data goes public, so definitionally Low tier.

**Step-by-step experience:**

### Setup (Tier, Grant Period, Retention)
Low tier, 2 years, 3 years post-grant retention. Clicked through quickly - I know the drill now.

Archive ratio: 100% (1TB → 1TB).

### Service Selection
Added:
- HPC Cluster (SLURM)
- Research Storage (GPFS)

### Usage Estimates

**HPC SLURM:**
Typed 10000 SU/month.

Monthly cost: 10,000 × $0.10 = $1,000/month (all within first tier).

The "Scavenger Partition" subsidy was available. This project is actually perfect for scavenger - short runs, fault-tolerant, and I'm budget-constrained. Checked it.

Monthly cost dropped to: $500/month (50% of 10,000 SU covered by scavenger's 5,000 SU/month free tier).

Wait, that's not right. Let me re-read...

Oh. "Free tier for preemptible, opportunistic workloads" with "max_units_per_month: 5000" at "discount_value: 100 percent."

So first 5,000 SU are free, remaining 5,000 SU are $0.10 each = $500/month. That's correct.

**Pleasant surprise:** The subsidy math is transparent and makes sense.

**Research Storage:**
1TB → (1TB - 0.5TB free) = 0.5TB × $5 = $2.50/month.

Archive: 1TB × $0.50/month = $0.50/month post-grant.

### Results

**Budget:**
- Monthly: $502.50
- Grant period (24 months): $12,060
- Archive (36 months post-grant): $18
- **Grand total: $12,078**

Hmm. This is where I expected the tool to tell me: "Hey, this is an open science project on a Low tier. Have you considered ACCESS? You could get 10K SU/month for free with a one-page project description through our campus champion."

But... nothing. No suggestion. No mention of ACCESS anywhere.

**Friction (major):**
This is a big miss. I *know* about ACCESS because I've been here 18 years. But a junior faculty member wouldn't. The tool should be surfacing free national resources, especially for open science projects.

**DMP text:**
Generic but okay. Mentions SLURM, GPFS, cold archive. I'll add specifics about OpenKIM, open data publishing to Zenodo, etc.

**Suggestion (critical):**
Add a service for "ACCESS Program" with:
- Cost: $0
- Eligibility: Research projects (especially open science)
- Process: One-page project description via campus champion
- SU allocation: Generous
- Flag this automatically for Low-tier compute-heavy projects

---

## Overall Experience Summary

**Total time for three projects:** ~25 minutes (including breaks to think and export files)

**What worked:**
1. **Accuracy:** Cost calculations were correct, including tiered pricing and subsidies
2. **Speed:** Once I knew the pattern, each project took 5-10 minutes
3. **Transparency:** Subsidy math was clear, pricing breakdowns made sense
4. **DMP output:** Generic but technically accurate skeleton text
5. **Export options:** Markdown export worked cleanly, JSON session export for backup
6. **No BS:** No tutorial videos, no hand-holding, no unnecessary explanations

**What frustrated me:**
1. **Date selection:** Irrelevant for cost calculations, adds friction
2. **Archive percentages:** Let me type TB directly instead of slider adjustments
3. **Missing ACCESS:** Huge gap. National free resources should be prominently featured
4. **Bundle-first UI:** I had to click "Browse Services" to see individual services. Power users need a "Skip bundles" option
5. **No quick-edit:** Once I got to results, I couldn't tweak a number and see the impact. Had to go back through steps

**What surprised me (positively):**
- The tool respected my expertise - didn't over-explain
- Subsidy system actually worked and was transparent
- Research Storage's free 500GB was auto-applied correctly
- DMP text used technical terms (SLURM, GPFS) instead of dumbing down

**What surprised me (negatively):**
- No mention of ACCESS, campus licenses, or other $0 options
- Can't save multiple projects in one session (had to start over each time)
- Archive storage UX assumes I think in percentages (I don't)

---

## Services I Wish Existed

1. **ACCESS Program / National Resources**
   - Type: compute
   - Cost: $0
   - Eligibility: Research projects, especially open science
   - Process: One-page project description
   - Why: Could save researchers tens of thousands of dollars

2. **Campus Software Licenses**
   - Type: software
   - Cost: $0 (covered by campus)
   - Examples: ANSYS, MATLAB, Mathematica, NVivo
   - Why: Researchers need to know what's already free

3. **Custom FlexLM Hosting**
   - Type: support
   - Cost: TBD (consultation)
   - What: RC hosts custom license servers for research software
   - Why: Common need for specialized simulation codes

4. **NSF-Funded Repositories**
   - Type: storage
   - Cost: $0
   - Examples: Zenodo, OpenKIM, MaterialsCloud
   - Why: Open science projects should know about discipline-specific free repositories

5. **Project Templates / Quick Mode**
   - Not a service, but a feature request
   - Let power users skip straight to a form: "I need X SU, Y TB, Z years. Give me the numbers."
   - Would save 5+ minutes per project

---

## One-Sentence Quote

**Testimonial version (if they fix the ACCESS gap):**
> "Finally, a university IT tool that doesn't waste my time - gave me accurate budget numbers in 10 minutes and actually knew what SLURM was."

**Wall of shame version (if they don't):**
> "Decent calculator, but it doesn't tell you about the free national resources that could save you $20K - typical IT tunnel vision."

---

## Final Verdict

Would I use this? **Yes, reluctantly, with caveats.**

It's the best tool Northwinds IT has given me in 18 years. The math is right, the output is usable, and it doesn't insult my intelligence. But it's focused entirely on university services and misses the bigger picture of the research computing ecosystem.

If they add ACCESS integration and let me bypass the wizard for quick estimates, I'll recommend it department-wide. Until then, it's a useful calculator but not a comprehensive planning tool.

**What would make me enthusiastic instead of grudgingly accepting?**
- Proactive suggestions for free resources (ACCESS, NSF repositories, campus licenses)
- "Power user mode" that skips unnecessary steps
- Multi-project session management (compare three projects side-by-side)
- Integration with FastLane or Research.gov budget formats (NSF folks would love this)

Will I tell Welk about it? Yes.
Will I tell the department chair? Probably.
Will I call it a game-changer? Not yet.
