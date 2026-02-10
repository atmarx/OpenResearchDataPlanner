# First Impressions: Dr. Lina Bramford

**Persona:** Associate Professor, Environmental Science
**Archetype:** Open Science Evangelist
**Date:** February 5, 2026

---

## My Situation

I'm writing a new NSF grant for our Regional Climate Downscaling Initiative, and I need to figure out the data infrastructure budget and write a Data Management Plan. I've got three active projects right now:

1. **Regional Climate Downscaling** - Open science, compute-heavy climate modeling (4-year grant)
2. **Satellite Imagery Archive** - Public domain Landsat/Sentinel data storage (5-year grant)
3. **EPA Watershed Collaboration** - Partnership data with pre-publication embargo (3-year grant)

The first two are completely open - I want that data accessible to every county planner, farmer, and emergency manager who needs it. The EPA project has a temporary restriction until their report is published, but then it goes public too.

I've been using my personal Google Drive (badly) to share data with external collaborators because we don't have good institutional tools for this. I know it's terrible. My PhD student Carlin built custom data pipelines that work great but only he understands them. When he graduates, we're in trouble.

What I need from this tool: help budgeting for 15-40 TB of active storage plus compute, guidance on making my data FAIR-compliant, and a DMP that demonstrates commitment to open science.

---

## Reading the User Guide

### Overall tone: Helpful but security-focused

The guide is clear and well-organized. I can see myself completing this in the promised 5-10 minutes. But I'm noticing something right away: the language around data tiers feels very security-centric.

**From Step 2:**
> "When in doubt, choose the higher tier."

I get why this advice exists - you're trying to prevent people from accidentally misclassifying sensitive data. But for someone like me who WANTS low-tier open data, this reads like "open science is risky" rather than "open science is the goal."

**The tier table is good:** The descriptions are clear. I know immediately that my downscaling project is Low and my EPA project is Medium.

**But there's a subtle bias:** Low tier is described as "publicly releasable" like it's the exception, not the norm. For publicly-funded science, shouldn't open data be the default we celebrate, not an edge case?

### Step 3 & 4: Grant period and retention

This is straightforward. I like that it defaults to 3 years for NIH R01s - shows you know your audience. NSF is also commonly 3 years, so that preset works for me.

The archive storage concept is good. I have to keep data for 3 years post-grant per NSF requirements, so I appreciate that you're thinking about retention costs.

**Question:** The "archive ratio slider" at 70% default - is that based on real data? I suspect my lab generates tons of intermediate model output that we don't need to archive. 50% might be more realistic for us, but I'd want to know what other climate labs do.

### Step 5: Service selection

**Bundles are smart.** I like this. I can see myself using "Storage Only" for the satellite archive and... wait, let me look at the bundles more carefully.

Looking at bundles.yaml, I don't see an obvious fit for my main downscaling project. Let me think:
- "Genomics Pipeline" - not me
- "ML/AI Training (On-Prem)" - sort of? We do model training, but climate models not ML
- "Simulation & FEA" - this might be closest? We're doing compute simulations

**Missing bundle:** "Climate/Environmental Modeling" - HPC compute + high storage + Globus transfer + optional cloud compute for burst scaling. That's my workflow.

**Green "Recommended" indicator:** I hope this doesn't only show up for higher tiers. My Low-tier data deserves good infrastructure too.

### Step 6: Usage estimates

The preset system looks helpful. "Data-intensive" at 100TB is interesting - that's bigger than my needs but reassuring to see the tool can handle it.

**Subsidies section is important.** I'll definitely check boxes for research credits. Every dollar saved is a dollar for student support or conference travel.

**OneDrive and LabArchives warnings:** These make sense. I'm glad the tool is honest about limitations. OneDrive at $40/TB beyond 1TB is absurd - that's 8x what Research Storage costs. Good to make that visible.

### Step 7: Results

The dual-tab approach (Budget + DMP) is exactly what I need. I want to export both and include them in my grant proposal.

**Key question:** Does the DMP output mention FAIR principles? Data sharing? Public accessibility? If it just says "we'll store data securely," that's not enough for NSF's open data requirements.

---

## Scanning services.yaml

Let me look at what's actually available...

### Storage options (my biggest need):

1. **Research Storage (GPFS)** - $5/TB/month, first 500GB free
   - This looks like my primary storage. 15TB = $72.50/month after the free tier.

2. **Cold Archive** - $0.50/TB/month
   - Great for retention. 10TB archive = $5/month. Very reasonable.

3. **NWFiles** - $3/TB/month, first 100GB free
   - Cheaper than Research Storage but probably slower?

4. **OneDrive** - $40/TB/month beyond 1TB
   - Hard pass. The warning is correct - this is not for research data.

5. **Globus Transfer** - FREE
   - Wait, this is free? That's amazing. We constantly transfer satellite data from USGS and collaborate with EPA. This is huge.

**Missing service I expected:** Object storage (S3-compatible) for archive data. Many climate labs are moving to object storage for long-term retention. Cold Archive is tape-backed, which is fine but slow for partial retrieval.

### Compute options:

1. **HPC Cluster (SLURM)** - $0.10/SU down to $0.05 for high volume
   - I use about 40,000 SU/month for downscaling. That's $3,200/month at standard tier, drops to $2,400 at volume tier.
   - Wait, I need to check if we have free scavenger access...
   - Yes! "Free tier for preemptible, opportunistic workloads" up to 5,000 SU/month. Some of our fault-tolerant jobs could use this.

2. **GPU Cluster** - $0.50/GPU-hour down to $0.30
   - V100s are described for "Finite Element Analysis, CFD, molecular dynamics." That's not climate modeling. Do they work for our models? Would need to test.
   - The note says "researchers with heavy ML/AI training workloads should consider cloud." Are they trying to steer people away from on-prem GPUs?

3. **AWS/Azure Compute** - Pass-through pricing + 5% overhead
   - Research credits available (50% discount). I'd apply for this.
   - Useful for burst scaling when on-prem HPC is full.

### What about data sharing?

I don't see anything explicitly about making data publicly accessible. Globus helps with transfer, but what about:
- **Public data repositories?** Integration with Zenodo, Dryad, or DataONE?
- **DOI minting** for datasets?
- **License guidance?** CC0 vs CC-BY for open data?

This is a gap for open science researchers. I want to publish my data, not just store it.

---

## Reviewing bundles.yaml

Looking at the pre-configured bundles more carefully...

### "Storage Only" - Good for my satellite archive
Simple: just Research Storage at 10TB default. I'd bump this to 25TB for Landsat/Sentinel data, but the concept works.

### "Simulation & FEA" - Closest to my climate work
This includes:
- GPU Cluster at 500 GPU-hours
- Research Storage at 50TB
- RC Consultation (1 hour free)

**Problems:**
1. I don't need GPUs - I need CPU-based HPC (SLURM)
2. 50TB is way more than my 15TB need
3. Missing Globus transfer, which I absolutely need

**What I'd want instead:** "Climate/Environmental Modeling" bundle:
- HPC SLURM (40,000 SU)
- Research Storage (15TB active + Globus)
- Optional cloud compute for scaling
- Consultation on data sharing best practices

### "Collaborative Research Project" - Interesting
This one includes:
- NWFiles at 5TB
- Azure Compute at $500

It's labeled "multi-institution collaboration." That's relevant for my EPA partnership, but it's missing the compute power (15,000 SU monthly) and uses cloud instead of HPC.

### Missing bundles for my field:
- **"Climate/Environmental Science"** - HPC + storage + Globus
- **"Open Science Data Publication"** - Storage + Globus + repository integration
- **"Satellite Data Processing"** - Storage + transfer + optional cloud processing

---

## Overall First Impression

### What works:

1. **Transparent pricing** - I can actually see what things cost. This is refreshing.
2. **Archive planning** - Shows you're thinking beyond just the grant period.
3. **Globus is free** - Huge win for data sharing.
4. **Subsidy visibility** - Love that scavenger partitions and research credits are surfaced.
5. **Service acknowledgments** - Honest about OneDrive and LabArchives limitations.

### What concerns me:

1. **Security-first framing** - Low tier feels defensive, not aspirational
2. **Missing open science guidance** - No mention of FAIR principles, repositories, DOIs, licenses
3. **Bundles don't fit my field** - Missing "Climate/Environmental Science" bundle
4. **GPU messaging unclear** - Are V100s good for climate models or not?
5. **No data publication pathway** - Tool helps me store data, not share it

### The big question:

**Will the DMP output help me demonstrate NSF compliance for open data requirements?**

If the DMP just says "we will store data on Research Storage for 3 years," that's not enough. NSF wants to know:
- How will data be shared?
- What repository will you use?
- What metadata standards?
- What license?
- Timeline for public release?

I'll find out when I walk through the actual tool, but this is my #1 concern.

---

## My Questions Going In

1. Does the Low tier feel like a good choice, or does the tool make me feel like I'm taking a risk?
2. Can I easily plan for 15-40TB of storage without sticker shock?
3. Will the tool acknowledge that some of us WANT our data to be open?
4. Does the DMP output address NSF's open data requirements?
5. Is there guidance on FAIR principles or data repositories?
6. Can I model different scenarios for my 3 projects (Low tier, Low tier, Medium tier)?

Let's find out.
