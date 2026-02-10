# First Impressions: Dr. Cris Mellendo

**Date:** 2026-02-05
**Persona:** Dr. Cris Mellendo, Digital Media (AR/VR, 3D rendering, motion capture)
**Context:** Immersive Media Lab, 5 students, deadline-driven production work
**Archetype:** DEADLINE PANIC / BURST COMPUTE

---

## Initial Reaction

WAIT. The GPU Cluster has a scavenger queue? And it's FREE? And the tool SHOWS me this?

Okay, backing up. Let me actually read this thing properly.

## What I'm Looking At

OpenResearchDataPlanner is supposed to help me plan research infrastructure for grants. I'm supposed to pick services, estimate usage, get costs, and generate DMP text. Cool. Let me see how this handles my chaotic VR rendering nightmare.

## My Immediate Questions

Before I even open the tool:

1. **Can this handle bursty compute?** My usage pattern is: nothing, nothing, nothing, OH GOD I NEED 500 GPU-HOURS BY FRIDAY.
2. **Does it understand the scavenger queue tradeoff?** Free is amazing. Preemption is frustrating. I need both options.
3. **What about emergency burst capacity?** When the film festival deadline hits, I pay for AWS. Can I plan for that?
4. **GPU focus?** Rendering = GPUs. Does the tool get this?

## Reading the User Guide

Skimming through...

- Step 1: Welcome. Fine.
- Step 2: Data classification. My VR documentary is Medium (unreleased footage, rights issues). Got it.
- Step 3: Grant period. 2-year NEA grant. Easy.
- Step 4: Retention. 3 years post-grant. Standard.
- Step 5: Select services. BUNDLES? Let me see...

### Looking at Bundles

```
ML/AI Training (Cloud) - Cloud-based GPU for burst workloads
```

THAT'S ME. Burst workloads. That's literally my life.

But wait, also:

```
ML/AI Training (On-Prem) - GPU cluster with V100s
```

V100s are good for rendering! Not cutting-edge for ML but great for my VR work.

### Browsing Services Directly

Let me see what's actually available:

**GPU Cluster:**
- V100 GPUs
- $0.50/GPU-hour standard rate (drops to $0.30 for heavy use)
- **Scavenger queue: 500 FREE GPU-hours/month**

FIVE HUNDRED FREE HOURS. PER MONTH.

Wait, that's... that's most of my baseline needs right there.

**AWS Cloud Compute:**
- Pass-through pricing + 5% overhead
- Can apply for 50% research credits
- Burst capacity when I need it

**Azure Cloud Compute:**
- Same deal as AWS
- Integrated with campus auth

## First Impressions: The Good

1. **THE SCAVENGER QUEUE IS VISIBLE.** The tool explicitly shows me there are 500 free GPU-hours/month. That's not buried in documentation. It's RIGHT THERE.

2. **Cloud burst options are clear.** I can see AWS and Azure as options for when I need guaranteed capacity.

3. **The bundles understand my use case.** "Burst workloads" - YES. Someone gets it.

4. **V100s are good for rendering.** Not everyone realizes that. The GPU cluster description says it's optimized for "compute-intensive workloads" including simulation. Rendering fits.

5. **Research credits exist.** 50% off AWS/Azure if I plan ahead. That helps.

## First Impressions: Questions

1. **How do I plan for mixed free/paid usage?**
   - Most months: 500 hours scavenger queue (free)
   - Deadline months: 500 scavenger + 1000 paid GPU-hours
   - Can I model that?

2. **What about the preemption tradeoff?**
   - Does the tool explain that scavenger queue jobs can get killed?
   - Can I see the cost difference between preemptible and guaranteed?

3. **Emergency capacity?**
   - When I need compute NOW, what's the fastest path?
   - Is there a "pay more, get it immediately" option shown?

4. **GPU vs. CPU clarity?**
   - The HPC cluster uses "Service Units" where GPU-hours are weighted
   - The GPU cluster uses "GPU-hours" directly
   - Is this confusing or helpful?

5. **Archive costs for video?**
   - 8TB of active VR footage
   - Retention requirements mean archive storage
   - Cold archive at $0.50/TB/month - that's actually very reasonable

## What Would Make This Perfect

### Show me the tradeoff explicitly:
```
Scavenger Queue: FREE (500 hrs/month)
  - Jobs may be preempted
  - Best effort, no guarantees

Standard Queue: $0.50/GPU-hour
  - Guaranteed completion
  - Use for deadlines
```

### Let me plan for spiky usage:
```
Baseline: 500 GPU-hours/month (scavenger)
Peak months (4x/year): +1000 GPU-hours (paid)
```

### Emergency capacity indicator:
```
Need compute NOW?
  - Cloud GPU instances (AWS/Azure)
  - Available immediately
  - $2-4/GPU-hour
  - No queue wait
```

## Bottom Line

I'm EXTREMELY interested. The fact that the scavenger queue shows up as a subsidy with 500 free GPU-hours is HUGE. That alone makes this tool valuable to me.

If it can help me:
- Budget for mixed scavenger/paid usage
- Understand when to use cloud vs. on-prem
- Plan for deadline burst capacity

...then this tool is exactly what I need.

But I need to actually USE it to see if it handles my bursty, chaotic, deadline-driven workflow.

## Key Test: Can I model my real VR project?

**VR Documentary project:**
- 2-year NEA grant
- Medium security tier (unreleased footage)
- Usage pattern:
  - Most months: 500 GPU-hours (scavenger)
  - Deadline months (4x/year): 2000 GPU-hours (scavenger + paid + maybe cloud burst)
- 8TB active storage
- 5TB archive storage for retention

Let's see if the tool can handle this...

---

**Confidence Level:** Cautiously optimistic (85%)

**Blocker Questions:**
- Can I model variable monthly usage?
- Is the scavenger queue preemption explained?
- Can I plan for deadline burst capacity?

**If these work:** This tool is PERFECT for me.
**If these don't work:** It's still useful but missing my core use case.
