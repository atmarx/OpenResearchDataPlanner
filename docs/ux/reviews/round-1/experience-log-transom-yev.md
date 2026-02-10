# Experience Log: Dr. Yev Transom

**Persona:** Dr. Yev Transom, Computer Science (ML)
**Date:** 2026-02-05
**Project:** Large Language Model Training (Medium tier)
**Expected duration:** 3 years
**Expected compute:** 100,000 GPU-hours/month (bursty)
**Expected storage:** 20TB active, 15TB archive

---

## Step 0: Before Opening the Tool

**Mindset:** I need to budget for my NSF CISE grant. LLM training on proprietary corporate data (NDA). Needs compute, storage, and flexibility for deadline crunches.

**Current workflow:**
- Scavenger queue on HPC for 80% of work (free but gets preempted)
- Personal AWS account for deadline sprints (~$500/month out of pocket)
- Research storage for model checkpoints (currently exceeding my allocation)

**What I'm hoping for:**
- Clear GPU pricing
- Cloud options (AWS/Azure, not GCP since campus doesn't have it)
- Cost breakdown I can justify to NSF
- Doesn't patronize me with "what is compute?" explanations

---

## Step 1: Welcome Screen

**First impression:** Clean. No clutter. "Get Started" button is obvious.

**Thought process:** They mention "5-10 minutes" — let's see if that's realistic for a complex project.

**Action:** Click "Get Started"

**Time elapsed:** 10 seconds

---

## Step 2: Data Classification

**Screen content:** Four tiers (Low / Medium / High / Restricted) with clear descriptions.

**Thought process:**
- This is proprietary training data + model weights
- Not regulated (not HIPAA/FISMA)
- Definitely not public (our industry partner would kill me)
- Medium tier is correct

**Observation:** The tier descriptions are accurate. "Has some restrictions (proprietary, unpublished) but isn't regulated" — that's exactly my situation.

**Appreciate:** No false dichotomy. Some tools act like you're either "public" or "HIPAA." Medium tier is the right middle ground.

**Action:** Select "Medium" → Click "Next"

**Time elapsed:** 30 seconds

---

## Step 3: Grant Period

**Screen content:** Preset durations (1, 2, 3, 5 years) or custom.

**Thought process:** NSF CISE grants are typically 3 years. This is standard.

**Observation:** Start date defaults to today. That's fine, I'll adjust it later if the grant start date shifts.

**Action:** Select "3 years" → Start date defaults to today → Click "Next"

**Time elapsed:** 50 seconds

---

## Step 4: Data Retention

**Screen content:** Options for retention period + archive ratio slider.

**Thought process:**
- NSF requires 3 years after project end
- So 3-year grant + 3-year retention = 6 years total
- Archive ratio: I'll keep the model weights (15TB) but delete intermediate checkpoints

**Action:**
- Select "3 years after grant end"
- Adjust archive ratio slider to ~75% (keeping most model weights, discarding some experimental runs)

**Observation:** The slider shows TB estimates in real-time as I adjust it. Nice touch. It's currently showing estimates even though I haven't selected services yet — it must be using default values.

**Nitpick:** The archive ratio is a percentage, but what I actually know is "I'm archiving exactly 15TB of model weights." I'd rather specify the exact TB amount than a percentage. But the slider works fine for now.

**Action:** Click "Next"

**Time elapsed:** 1 min 30 sec

---

## Step 5: Select Services

**Screen content:** Two tabs: "Bundles" and "Browse Services"

**Initial view:** Bundles tab is active. I see:
- Storage Only
- Genomics Pipeline
- ML/AI Training (On-Prem)
- ML/AI Training (Cloud)  ← This one
- Clinical/IRB Data
- Collaborative Project
- Several others

**Thought process:**
- "ML/AI Training (Cloud)" is exactly what I need
- The description mentions AWS compute + research storage
- Let me see what it includes

**Action:** Click "View Details" on ML/AI Training (Cloud)

**Observation:** Popup shows:
- AWS Cloud Compute: $3,000 default
- Research Storage: 50TB default

**Immediate reaction:** Wait, the bundle includes the on-prem HPC cluster AND GPU cluster too? Let me re-read...

**Actually:** No, I misread. Let me click "Apply Bundle" and see what gets added.

**Action:** Click "Apply Bundle"

**Result:** Three services added:
1. AWS Cloud Compute
2. Research Storage
3. (Hmm, just these two? Let me check...)

**Correction:** I need to look at the services list to see what was actually added.

**Observation:** The services that were added show up below the bundles section. I see:
- AWS Cloud Compute
- Research Storage (GPFS)

**Thought process:** Good. That's clean. No bloat.

**BUT:** I also want to use the scavenger queue on the HPC cluster when I can. Let me add that manually.

**Action:**
- Switch to "Browse Services" tab
- Find "HPC Cluster (SLURM)" in the Compute category
- Click to add it

**Result:** HPC Cluster (SLURM) added to my services list.

**Observation:** It shows a green "Recommended" badge for Medium tier. Good signal.

**Additional thought:** Should I add the GPU cluster? Let me read the description...

**Action:** Click "View Details" on "GPU Cluster"

**Reading the long description:**
> "Our GPU cluster features NVIDIA V100 GPUs optimized for compute-intensive workloads like Finite Element Analysis (FEA), computational fluid dynamics, molecular dynamics, and similar simulation tasks. While the V100 architecture supports machine learning, researchers with heavy ML/AI training workloads should consider cloud GPU options (Azure/AWS) for access to newer architectures."

**Reaction:** Yeah, V100s are from 2017. For LLM training in 2026, I need A100s or H100s. Pass.

**Appreciate:** They explicitly say "heavy ML workloads should consider cloud." That's correct advice.

**BUT:** This should be more prominent. Someone less experienced might see "GPU Cluster" and "500 free GPU-hours in scavenger queue" and think that's sufficient. It's not.

**Decision:** Skip the GPU cluster. I'll use HPC cluster for CPU-bound preprocessing and AWS for actual GPU training.

**Current services:**
1. HPC Cluster (SLURM)
2. AWS Cloud Compute
3. Research Storage (GPFS)

**Thought process:** Do I need anything else?
- Globus for data transfer? Not really, I generate my training data.
- VDI? No, we all have our own machines.
- Azure OpenAI? Interesting but not for this grant.

**Decision:** These three services are sufficient.

**Action:** Click "Next"

**Time elapsed:** 4 minutes

---

## Step 6: Usage Estimates

**Screen content:** One panel for each service I selected.

### Service 1: HPC Cluster (SLURM)

**Prompt:** "How many CPU-core-hours do you expect per month?"

**Observation:** I see presets:
- Light (1,000 SU)
- Moderate (10,000 SU)
- Heavy (100,000 SU)
- Very Heavy (500,000 SU)

**Thought process:**
- I want to test large numbers: 100,000 SU/month
- This is mostly scavenger queue usage, but let me see what the tool does

**Action:** Click "Heavy (100,000 SU)" preset

**Result:** Input field shows 100,000

**Observation:** I see a subsidy checkbox: "Scavenger Partition - Free tier for preemptible, opportunistic workloads"

**Reading the condition:** "Jobs may be preempted; best for fault-tolerant workflows"

**Reaction:** Perfect. This is exactly my use case. I checkpoint every 30 minutes specifically for this.

**Action:** Check the "Scavenger Partition" subsidy box

**Observation:** Nothing visually changes in this step. I assume it'll show up in the cost breakdown later.

**Nitpick:** The subsidy says "max 5,000 SU per month" but I'm asking for 100,000 SU. So I'll get 5,000 free and pay for 95,000? The UI doesn't show me this math here. I'll check the results.

### Service 2: AWS Cloud Compute

**Prompt:** "Estimated monthly AWS spend?"

**Observation:** Presets:
- Light usage ($200)
- Moderate usage ($1,000)
- Heavy usage ($5,000)
- Enterprise scale ($15,000)

**Thought process:**
- I need about 100 H100 hours per month for deadline crunches
- H100 on AWS (p5 instances) is roughly $30-40/hour depending on region
- 100 hours × $35 = $3,500 just for GPU time
- Plus storage, egress, etc. → call it $4,500-5,000

**Caveat:** I'd actually use spot instances for 80% of this, which would cut costs by ~70%, but the tool doesn't have a way to specify that.

**Action:** Click "Heavy usage ($5,000)"

**Observation:** I see a subsidy checkbox: "AWS Research Credits - Apply for AWS research credits (subject to availability)"

**Reading the condition:** "Credits awarded competitively; apply at least 3 months before grant start"

**Thought process:**
- I should apply for this
- 50% discount would be huge
- But it's competitive, so I shouldn't rely on it in my budget

**Decision:** Check the box, but I'll note in my budget justification that this is aspirational.

**Action:** Check "AWS Research Credits"

### Service 3: Research Storage (GPFS)

**Prompt:** "How much active storage do you need?"

**Observation:** Presets:
- Small project (1TB)
- Medium project (10TB)
- Data-intensive (100TB)
- Large-scale (500TB)

**Thought process:**
- I need 20TB for active training data and model checkpoints
- The presets jump from 10TB to 100TB — big gap

**Action:** Manually type "20" in the input field

**Result:** Input shows 20 TB

**Observation:** I see "First 500 GB included at no cost per project" — auto-applied subsidy. Good.

**Archive storage section:**

**Observation:** Below the main input, I see:
- "Archive storage estimate: 15 TB"
- This is calculated from my 75% archive ratio × 20TB

**Thought process:** Actually perfect. I want to archive exactly 15TB of model weights.

**Appreciate:** The tool is showing me the archive cost separately. This is important for grant budgeting because archive storage happens after the grant ends.

**Action:** Leave archive storage at 15TB (matches my needs exactly)

**Time elapsed:** 7 minutes

**Action:** Click "Next"

---

## Step 7: Results

**Screen content:** Two tabs: "Budget Estimate" and "Data Management Plan"

### Budget Estimate Tab

**Observation:** Three summary cards at the top:
1. **Monthly Cost:** $5,805
2. **Grant Period Cost:** $208,980
3. **Archive Cost (post-grant):** $270/month

**Immediate reaction:** Let me break down where that $5,805/month comes from.

**Scrolling down:** I see a detailed cost breakdown table:

| Service | Monthly | Grant Total | Post-Grant Archive |
|---------|---------|-------------|-------------------|
| HPC Cluster (SLURM) | $7,705 | $277,380 | - |
| AWS Cloud Compute | ~$2,625 (with 50% discount) | $94,500 | - |
| Research Storage (GPFS) | $97.50 | $3,510 | $270/month |

**Wait, that doesn't match:** $7,705 + $2,625 + $97.50 = $10,427.50, not $5,805

**Confusion:** Let me recalculate...

**Ah, I see:** I checked the "Scavenger Partition" subsidy for HPC, which gives me 5,000 free SU/month. And I checked "AWS Research Credits" for 50% off.

**Let me trace the math:**

**HPC Cluster:**
- 100,000 SU/month requested
- 5,000 SU/month free (scavenger)
- 95,000 SU/month billed
- Tiered pricing:
  - First 10,000 SU at $0.10 = $1,000
  - Next 90,000 SU at $0.08 = $7,200
  - **Total: $8,200/month** (not $7,705?)

**Re-reading the cost table more carefully:**

Okay, I need to see the actual breakdown. Let me look for an export button...

**Action:** Click "Export Budget (Markdown)"

**Result:** Downloads a markdown file. Let me read it...

**Actually, let me just work with the numbers shown:**

The grand total for the grant period is $208,980. Over 36 months, that's $5,805/month average. Okay, that math checks out.

**Checking post-grant archive:**
- 15TB archive at $0.50/TB/month = $7.50/month

**Wait, the table says $270/month for archive?**

**Oh:** 15TB × 18 months (3 year retention post-grant) = $7.50/month? No, that's not right either.

**Recalculating:** 15TB × $0.50/TB = $7.50/month for archive storage.

But the UI says $270/month for "Post-Grant Archive" total? That doesn't make sense.

**Confusion:** I think there's an error in how the UI is displaying this, or I'm misunderstanding what "Post-Grant Archive" means.

**Setting that aside for now.**

**Overall budget assessment:**
- ~$210K for 3 years sounds reasonable for large-scale ML training
- Most of that is compute (HPC + AWS)
- Storage is surprisingly cheap (under $4K for 3 years)

**Thought process on whether this is accurate:**

**HPC at 100K SU/month:**
- If 1 GPU-hour = 10 SU (as the bundle notes said)
- Then 100K SU = 10,000 GPU-hours
- At $0.08/SU (volume tier) = $8,000/month
- Minus 5,000 free SU = $7,600/month
- That's ~$273K over 3 years

**AWS at $5K/month (with 50% credits):**
- $2,500/month effective cost
- $90K over 3 years

**Storage at 20TB:**
- $100/month × 36 months = $3,600

**Total: $273K + $90K + $3.6K = $366.6K**

**But the tool says $209K total?**

**Okay, I'm definitely misunderstanding something about the pricing calculation.**

**Setting this aside:** The point is, I have numbers I can work with. I can export the budget and review it more carefully offline.

**Appreciate:**
- The tool gives me a detailed breakdown
- I can see subsidies applied
- Export options (Markdown and JSON)

**Concern:**
- The math isn't immediately transparent to me
- I'd need to audit the calculations to trust them for a grant submission

---

### Data Management Plan Tab

**Action:** Click "Data Management Plan" tab

**Observation:** I see a rendered preview of DMP text with sections for:
- Data Collection
- Storage and Backup
- Compute Resources
- Data Retention
- Etc.

**Scanning the content:**

The AWS section says:
> "Compute-intensive workloads will be executed using AWS Cloud Compute, leveraging the institution's enterprise AWS agreement with 5% administrative overhead."

**Reaction:** Useful boilerplate. I can copy this into my DMP and customize it.

**The HPC section mentions:**
> "CPU-bound processing will utilize the institutional HPC Cluster (SLURM)..."

**Good:** It distinguishes between CPU (HPC) and GPU (AWS) workloads. That's accurate for my use case.

**Storage section:**
> "Active research data will be stored on Research Storage (GPFS), a high-performance parallel filesystem..."

**Appreciate:** This is grant-ready language. I don't have to translate "GPFS" into "enterprise storage solution" — the tool does it for me.

**Action:** Click "Copy to Clipboard"

**Result:** Text copied. I can paste this into my grant proposal draft.

**Overall impression of DMP:** Solid starting point. I'll need to customize it with project-specific details, but this saves me 30 minutes of writing boilerplate.

**Time elapsed:** 9 minutes

---

## Final Reflection

**Total time:** ~9 minutes from start to results

**Would I use this for my grant?** Yes, with caveats:
- I need to audit the cost calculations before submitting
- I'll customize the DMP text with project specifics
- I'll add a note about spot instance pricing for AWS

**What worked:**
- Fast workflow (under 10 minutes)
- Didn't patronize me with explanations
- Bundles are well-designed
- DMP text is grant-ready boilerplate

**What didn't work:**
- Cost math is opaque (need to export and audit)
- Can't specify mixed compute strategies (scavenger + guaranteed + cloud)
- No spot/preemptible pricing for AWS
- Archive cost display is confusing

**Would I recommend this to my postdocs?** Yes, with guidance:
- Use the cloud ML bundle
- Don't use V100s for heavy LLM training
- Double-check the cost calculations
- Talk to me before finalizing the budget

**Biggest win:** I have a defensible budget and DMP text in 10 minutes. That's a huge time saver.

**Biggest gap:** I still had to do mental math to figure out GPU-hours vs dollars. The tool should have GPU-specific presets for cloud compute.

---

## Specific Observations by Step

### Welcome (Step 1)
- ✓ Clean, no clutter
- ✓ Time estimate (5-10 min) is accurate

### Data Classification (Step 2)
- ✓ Tier descriptions are accurate
- ✓ Medium tier is correct for proprietary/NDA data
- ✓ No false dichotomies (public vs HIPAA)

### Grant Period (Step 3)
- ✓ Standard durations available (3 years is common for NSF)
- ✓ Date picker works fine

### Data Retention (Step 4)
- ✓ Retention options make sense (3 years post-grant for NSF)
- ✓ Archive ratio slider is intuitive
- ✗ Would prefer specifying exact TB instead of percentage

### Select Services (Step 5)
- ✓ ML/AI Training (Cloud) bundle is exactly what I need
- ✓ V100 description correctly steers heavy ML users to cloud
- ✗ V100 warning should be more prominent (not in fine print)
- ✓ Scavenger queue subsidy is visible

### Usage Estimates (Step 6)
- ✓ Presets are reasonable (100K SU is available)
- ✓ Subsidies are clearly labeled with conditions
- ✗ Subsidy math not shown in real-time (5K free out of 100K requested)
- ✗ AWS presets are just dollar amounts, not GPU-specific
- ✗ No way to specify spot vs on-demand pricing

### Results (Step 7)
- ✓ Budget breakdown is detailed
- ✓ DMP text is grant-ready boilerplate
- ✓ Export options available
- ✗ Cost math is not immediately transparent
- ✗ Archive cost display is confusing

---

## Bottom Line

**Time saved:** Probably 1-2 hours of budgeting and DMP writing

**Confidence level:** 80% — I trust the tool enough to use it, but I'll audit the numbers

**Recommendation:** Use this as a starting point, then validate with Research Computing before submitting your grant

**Key insight:** This tool was designed by people who actually do research computing. It shows.
