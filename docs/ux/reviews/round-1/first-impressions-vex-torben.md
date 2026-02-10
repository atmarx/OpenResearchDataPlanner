# First Impressions: Dr. Torben Vex

## 1. My Situation

I'm Dr. Torben Vex, Physics professor, 18 years at Northwinds. I run a computational materials lab doing discrete atomic modeling with LAMMPS. I have three projects that need budget numbers for grant proposals:

1. **Novel High-Entropy Alloy Simulations** (Medium tier) - My main research. 50K SU/month sustained, 8TB active + 5TB archive. Unpublished work with potential patent implications. 3-year NSF proposal.

2. **PHYS 480 Computational Lab Archive** (Low tier) - Teaching materials, nothing fancy. 2TB active + 2TB archive. Just needs a home for a year.

3. **OpenKIM Interatomic Potential Validation** (Low tier) - Open science collaboration. 10K SU/month bursty, 1TB active + 1TB archive. Everything goes public anyway. 2-year project.

I've been burned by too many "helpful" IT systems that waste my time. I know what SLURM is. I know what I need. I just need accurate budget numbers and maybe some DMP text I can paste into my proposals without rewriting the whole thing.

## 2. Reading the User Guide

**What made sense:**
- Time estimate up front (5-10 minutes) - appreciate the honesty
- Clear tier descriptions with concrete examples
- Step-by-step breakdown without condescension
- Keyboard navigation section at the end (finally someone gets it)
- The disclaimer about costs being estimates (better honest than misleading)

**What confused me:**
- "Archive ratio slider" - I don't think in percentages, I think in TB. If I have 8TB active and need 5TB archived, that's what I need. The percentage is meaningless to me.
- "Service Units" terminology - our cluster calls them core-hours in some contexts, SUs in others. Hope this tool is consistent.
- The bundle descriptions are vague. "Genomics Pipeline" - okay, but what does that actually include? I had to mentally note to check the actual services.

**Did I feel like the target audience?**
Sort of. The guide doesn't over-explain, which is good. But it also doesn't acknowledge that some users (like me) already know exactly what they need and just want to punch in numbers. The whole "bundles" concept seems aimed at people who don't know what services they need. I already know I need HPC SLURM, research storage, and probably cold archive.

**Minor irritations:**
- Why do I need to set dates? I'm budgeting for a proposal, not booking a hotel. I know it's a 3-year grant. Just multiply by 36.
- "When in doubt, choose the higher tier" - Sure, but that's CYA advice that inflates costs. My OpenKIM project is definitionally Low tier. Period.

## 3. Scanning the Services

**What's there:**
Good coverage of the basics:
- HPC SLURM with tiered pricing (smart - I'll hit the volume discount)
- Research Storage (GPFS) at $5/TB/month
- Cold Archive at $0.50/TB/month (reasonable)
- GPU Cluster with V100s (I don't need this, but good to know)
- Azure/AWS compute (don't need cloud, but okay)
- Globus transfer (actually useful - forgot about this)
- Research VDI tiers (overkill for me, but useful for students)
- OneDrive (with dire warnings - appropriate)
- LabArchives (with storage limits - good they're honest)

**What's missing:**
- **ACCESS Program** - This is huge. I could offload some of my OpenKIM work to ACCESS for free with just a one-page project description. Why isn't this mentioned anywhere? Our campus has a champion, generous free tier, and it's NSF-funded. This should be shouting from the rooftops.
- **Campus software licenses** - ANSYS, MATLAB, Mathematica are already covered by campus licenses. Should be listed as $0 cost items or at least mentioned in consultation services.
- **Custom FlexLM hosting** - RC can host custom license servers. Not in the list.
- **Tape backup** - Different from cold archive. Maybe that's what cold archive is? Unclear.

**What surprised me:**
- Azure OpenAI service is listed. Didn't know we had that. Interesting, though not relevant to me.
- Kubernetes cluster in beta - I know some postdocs who would use this. Welk might be interested.
- Research Computing Consultation at $150/hour with first hour free - this is actually reasonable and worth knowing about.
- Web hosting with CI/CD pipeline support - honestly impressive. Didn't know RC did this.

**Pricing check (mental math):**
- My alloy project: 50K SU/month = $0.08/SU after volume tier = $4,000/month compute = $144K over 3 years. Plus 8TB storage = $40/month = $1,440 over 3 years. Archive 5TB for 3 years post-grant = $90 total. So roughly $145K+ total. Will need to see if the tool gets this right.

## 4. The Bundles

**Which caught my eye:**
- "Simulation & FEA" - This should be my bundle, right? But it defaults to GPU cluster, which I don't primarily need. I need CPU compute first, GPUs occasionally.
- "Storage Only" - Too simple for me, but I see the use case.
- "Genomics Pipeline" - Not my field, but the structure makes sense.

**Poorly named or confusing:**
- "ML/AI Training (On-Prem)" vs "ML/AI Training (Cloud)" - The naming suggests these are equivalent options, but the description for on-prem says "V100 GPUs - good for simulation, modest for heavy ML training." So... is this for ML or simulation? Pick a lane.
- "Collaborative Research Project" - Way too generic. What does this mean? Multi-institution? Just file sharing? The description doesn't clarify much.
- "Simulation & FEA" - FEA is just one type of simulation. I do molecular dynamics. Does this bundle apply to me? Unclear.

**Bundles I wouldn't use:**
Most of them. I'm a power user. I know my service units, my storage needs, my archive requirements. Bundles are for people who don't know what they need yet. But I can see how a new PI or someone from an experimental background would find them useful.

**What I wish existed:**
- "Computational Physics / Materials Science" bundle - HPC CPU compute (not GPU-first), high-capacity storage, archive option, maybe Globus
- "Teaching / Course Archive" bundle - Just cheap storage for course materials

## 5. Overall First Impression

**Likelihood to continue (1-5 scale):** 3.5

**Why I'd continue:**
- If this actually generates accurate budget numbers for my NSF proposals, that's worth 10 minutes
- The tool seems honest about limitations (OneDrive warnings, LabArchives caps)
- Keyboard navigation promise is appealing
- Auto-save means I won't lose work if I get interrupted

**Why I'd quit:**
- If the wizard has too many unnecessary questions
- If it doesn't handle my "power user" needs (I know exact SU counts, exact storage needs)
- If the DMP output is generic garbage that I have to completely rewrite
- If there's no way to adjust the defaults quickly
- If it doesn't mention ACCESS or other free/subsidized options

**What would make me quit immediately:**
- Loading spinners between every step
- "Helpful" tooltips that pop up and block the interface
- No way to override bundle defaults
- Asking me to explain *why* I need compute resources (I don't need to justify myself to a web form)
- Generated DMP that uses buzzwords instead of technical accuracy

**The real test:**
Can I complete all three of my projects in under 15 minutes total and get usable budget numbers? If yes, I'll recommend this to my department. If no, I'll keep using my spreadsheet.

**One thing that would win me over:**
If the tool explicitly tells me about ACCESS eligibility for my OpenKIM project, showing me I could save $20K+ by using free national resources. That would demonstrate it's actually trying to help me, not just sell me on university services.
