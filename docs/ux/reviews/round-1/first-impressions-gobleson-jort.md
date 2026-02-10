# First Impressions: Dr. Jort Gobleson

**Date:** February 5, 2026
**Persona:** Dr. Jort Gobleson, Astronomy Professor
**Context:** Legacy data crisis (8 external drives, one recently failed)

---

## Initial Reaction

Okay, so IT finally sends me something useful instead of just "submit a ticket." A planning tool for research data infrastructure. I'll be honest - I'm skeptical. I've been doing astronomy for 15 years and every "helpful tool" the university has sent me has assumed I'm starting from scratch with good practices already in place.

But one of my external drives failed last month. Kellan needed data for his thesis defense and we couldn't get to it. So here I am, actually reading a user guide at 2 AM between observing sessions.

## Reading the User Guide

### What immediately stands out

**The archive ratio slider** - Wait, this tool actually acknowledges that I might have EXISTING data that needs to go somewhere? That's... new. Every previous conversation with IT has been about "future data management plans" while my office looks like a Western Digital graveyard.

**Storage Only bundle** - "Just need a place to store your research data?" Yes. YES. Thank you for not assuming I need a 12-service stack when what I really need is to get 30TB off dying hardware.

**Cold Archive Storage** - $0.50/TB/month for long-term retention. So for my legacy archive (30TB of historical observations from 1998-2015), that's... $15/month? $180/year? That's less than one external drive. And it's on tape that someone else maintains, not sitting on my shelf making clicking sounds.

### What worries me

The guide assumes I know things like:
- What my "grant period" is (I have three active grants with overlapping timelines)
- How to estimate "monthly compute in service units" (I run image processing pipelines whenever new transients come in - it's bursty and unpredictable)
- Whether my unpublished survey data is "Medium" or "Low" tier (competitive field, definitely don't want it public, but it's not HIPAA or anything)

The tone is professional and helpful, but I'm already feeling that familiar anxiety: am I going to fill this out wrong and look stupid?

## Looking at Available Services

I scan through `services.yaml` to see what's actually available:

### Things that make sense to me

**Research Storage (GPFS)** - $5/TB/month. I understand this. It's expensive but it's real infrastructure. First 500GB free is nice but kind of laughable when you're dealing with telescope data - that's like one night of observations.

**Cold Archive** - Already mentioned, but this is the revelation. I have decades of published data that I need to keep but rarely access. This is exactly what I need.

**HPC Cluster (SLURM)** - I already use this! I know what Service Units are! Finally something familiar. Though I have no idea if I use 10,000 or 100,000 per month - I just submit jobs until they run.

**Globus Data Transfer** - Free? And it moves data between institutions? This could help with my collaborator at McDonald Observatory who keeps asking me to FedEx hard drives.

### Things that confuse me

**OneDrive for Business** - I have this. I use it for documents. Why is it in a research data planning tool? Oh, there's a warning about limitations. Yeah, I tried to put telescope data in OneDrive once. It... did not go well.

**Azure OpenAI Service** - What? Why? I analyze stars, not text. Maybe this is for other people.

**Kubernetes Cluster (Beta)** - I recognize these words individually but have no idea what this is for. Moving on.

## Looking at Bundles

**Storage Only** - This is calling to me. It's like it was made for my exact problem.

**Genomics Pipeline** - Not relevant, but I notice it includes Globus. Interesting.

**Collaborative Research Project** - Might be useful for the citizen science project.

But here's the thing - NONE of the bundles seem designed for someone in my situation: tons of existing data in a precarious state, active research that's ongoing, and a desperate need to migrate everything to something sustainable.

Is there a "Data Refugee" bundle? A "My Office is a Fire Hazard" bundle?

## Key Questions Before I Even Start

1. **Can I plan for multiple projects at once?** I have:
   - Active transient survey (Medium tier, 12TB active + compute)
   - Legacy archive (Low tier, 30TB of old published data)
   - Citizen science project (Low tier, small, mostly public)

2. **Does this tool help me with migration, or just new projects?** The archive ratio slider suggests it thinks about existing data, but the overall flow feels future-oriented.

3. **What happens after I fill this out?** Do I get a quote? A consultation? An automatic provisioning? A ticket number and radio silence?

4. **Can I afford this?** I have grant money, but I don't know what "normal" costs are. Is $500/month for research storage a lot or a little? I genuinely don't know.

## Overall First Impression

**The good:**
- Finally, something that acknowledges archive storage as a real need
- The Storage Only bundle is perfect for my main problem
- Cold Archive pricing is shockingly reasonable
- The tool seems honest about limitations (OneDrive, LabArchives warnings)

**The concerning:**
- I'm not sure if this is for planning new grants or fixing existing messes
- Multiple projects seems complicated - do I need to run through this three times?
- I don't trust my own estimates for things like compute usage
- No clear "I have a legacy data crisis" pathway

**The verdict:**
I'm going to try it. But I'm going in with the mindset of "plan for the legacy archive first" because that's my immediate crisis. If I can figure out how to get 30TB of 1998-2015 observations into cold archive, I'll come back and plan the active research separately.

Let's see if this thing can help me or if it's just another form to fill out before nothing happens.
