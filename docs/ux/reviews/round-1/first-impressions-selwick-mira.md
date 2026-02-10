# First Impressions - Dr. Mira Selwick

**Date:** February 5, 2026
**Reviewer:** Dr. Mira Selwick, Associate Professor, Chemistry
**Persona Type:** Detail-Oriented

---

## 1. My Situation

I'm a computational chemist in the Chemistry department, running DFT and quantum chemistry calculations for three active projects:

1. **Catalytic Reaction Pathway Modeling** - Industry collaboration under NDA, Medium tier data, compute-heavy
2. **Published Benchmark Dataset Repository** - Open data for the computational chemistry community, Low tier, storage-focused
3. **Graduate Student Training** - Teaching calculations for new students, Low tier, light compute

My biggest frustrations are license management chaos (does the university have Gaussian licenses or don't we?) and scattered data organization. I need clear budget numbers for grant proposals and something I can show collaborators when they ask about data handling.

I have 5 people in my lab, no dedicated tech support, and I rely on an understaffed Chemistry IT group that doesn't really understand computational needs.

---

## 2. Reading the User Guide

### What Made Sense

**The security tier explanations were clear.** The table in Step 2 made it immediately obvious that my industry NDA work belongs in Medium tier. I appreciated the tip about choosing the tier for your most sensitive data when you have multiple types.

**Grant period selection looks straightforward.** I appreciated that 3 years is called out as common for NIH R01s. Nice touch.

**The retention section is exactly what I need.** Funders ask about this constantly and I never have a good answer. The table showing NIH/NSF/DOE requirements is perfect. I can actually reference this when writing DMPs.

**Budget estimate + DMP generation.** This is the dream. If this actually works, it solves two major pain points: budgeting compute costs and writing the data management plan section.

### What Confused Me

**No mention of software licenses anywhere.** The guide talks about HPC, storage, cloud compute, but never mentions Gaussian, ORCA, MATLAB, etc. Are those assumed to be included? Are they separate? This is literally my #1 frustration with our current system.

**"Service indicators" need examples.** The guide says some services show "Recommended" in green, "Requires review" in yellow, etc., but I don't know what would trigger each. Would my Medium tier industry work require review? I have no idea.

**Archive ratio slider (Step 4) is abstract.** The percentages make sense in theory, but I don't know how to estimate what I'll actually archive vs. delete. Maybe some field-specific guidance? "Computational chemistry projects typically archive 70% (input files, final outputs) and delete 30% (intermediate SCF iterations)."

**"Schedule Consultation" vs. the RC Consultation service.** The guide mentions clicking "Schedule Consultation" for complex projects. Is that the same as the "Research Computing Consultation" service I see in the services list? Or something different?

---

## 3. Scanning the Services

### What's There

Good coverage of the basics I need:
- **HPC Cluster (SLURM)** - yes, this is what I use
- **Research Storage (GPFS)** - high-performance storage, makes sense
- **Cold Archive Storage** - for retention requirements, good
- **AWS/Azure Cloud Compute** - not my primary need but nice to have options
- **Globus Data Transfer** - occasionally useful for collaborations
- **Research VDI tiers** - could be useful for sensitive data access

The service descriptions are clear and link to documentation.

### What's Missing

**No software/application licenses.** Where's Gaussian? ORCA? MATLAB? Mathematica? These are major budget items for computational work. I spend hours trying to figure out if we have institutional licenses. If this tool doesn't address software, it's missing half the picture for computational researchers.

**No mention of FlexLM or custom license servers.** I know RC can host custom FlexLM servers for research groups. That should be in here.

**No ACCESS allocation information.** We have a campus champion for ACCESS/XSEDE - that's a huge free compute resource that should be highlighted. A "Compute (External)" category maybe?

### Observations

The pricing is transparent, which is great. Tiered pricing on HPC makes sense. The subsidies are clearly marked (scavenger partition, base storage allocation).

I like that services show their cost model type upfront: "unit," "tiered," "consultation." That helps me understand what I'm getting into.

The acknowledgment warnings for OneDrive and LabArchives are good - I've seen people try to use OneDrive for 10TB datasets and it's a nightmare.

---

## 4. The Bundles

### Which Caught My Eye

**"Storage Only"** - This is perfect for my benchmark dataset project. Just need a place to put the data, nothing fancy.

**"Simulation & FEA"** - The description says "GPU-accelerated computing for finite element analysis, CFD, molecular dynamics" which is close to what I do, but it's focused on V100 GPUs. My DFT work is more CPU-bound than GPU-bound. Not quite right.

**"Collaborative Research Project"** - Might work for the industry collaboration? Shared file storage + optional cloud compute.

### What I Didn't See

**"Computational Chemistry Workflow"** or similar. My use case (sustained CPU-heavy SLURM jobs + moderate storage + archive) doesn't fit neatly into "Genomics Pipeline" or "ML Training." I'd end up using "Browse Services" instead of bundles.

**"Mixed Security Levels"** bundle. I have three projects at different tiers. Do I run the tool three times? The bundles don't address multi-project researchers.

### Concerns

The "Simulation & FEA" bundle includes RC Consultation, which is smart, but it defaults to 1 hour. The free tier is 1 hour anyway, so this doesn't cost anything extra, but it's not clear why it's in the bundle versus just being universally available.

---

## 5. Overall First Impression

**Likelihood to continue: 4/5**

I'd definitely continue because:
- The cost transparency is exactly what I need for grant budgets
- The DMP generation could save me hours
- The retention guidance addresses a real gap in my current workflow
- The interface seems straightforward

But I'm hesitant because:
- **Software licenses are completely missing.** This is a dealbreaker if not addressed. I can't submit a complete budget without knowing Gaussian costs.
- I'm not sure how to handle multiple projects with different security tiers
- The bundles don't match my use case, so I'll have to custom-configure everything

**What would get me to 5/5:**
- Integration with the university's software licensing catalog (even just a link out)
- Guidance on handling multiple projects in one proposal
- A computational chemistry-specific bundle or preset
- More concrete examples in the retention/archive sections

**First reaction quote:**
> "Okay, this is promising. I can finally see what compute actually costs. But where are the software licenses? That's half my budget."
