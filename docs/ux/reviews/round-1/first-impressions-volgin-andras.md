# First Impressions: Dr. Andras Volgin

**Persona:** Economics Professor, Agent-based modeling specialist
**Context:** Looking for compute resources to escape 72-hour Stata jobs
**Review Date:** February 2026

---

## Initial Reaction

Finally. Someone is talking about this in terms I can understand. The user guide says "5-10 minutes" and I appreciate that — I don't have hours to figure out infrastructure. I need my models to run faster, not a second PhD in computer science.

The opening is clean. "Select services, estimate costs, generate DMP text." That's what I need for my NSF grant. Li kept telling me we needed "bigger machines" but I had no idea what that meant for my budget or my proposal. This might actually help.

---

## The Data Classification Step

**Initial confusion:** I read the tier descriptions twice. My agent-based market models — are they Medium or Low?

The guide says:
- **Low:** "publicly releasable, no restrictions"
- **Medium:** "some restrictions (proprietary, unpublished)"
- **High:** PHI, HIPAA, regulated

My models are proprietary. The Fed collaboration definitely has "sensitive timing" — we can't release those projections before publication. But it's not HIPAA. So Medium? I think?

**What would help:** Examples from social sciences. Everyone talks about genomics and clinical trials. What about economic models? What about pre-publication collaboration data? I know this matters because the Fed is very particular about data handling.

The "when in doubt, choose higher" advice is good but I wish I didn't have to doubt.

---

## The Services Step

Okay, now we're getting somewhere.

### Bundles — Mixed feelings

I looked at the bundles first because that's what the guide recommends. But there's nothing for economics. I see:
- **Genomics Pipeline** — not me
- **ML/AI Training (Cloud)** — is my agent-based model "ML"? Probably not how they mean it
- **Clinical/IRB Data** — definitely not
- **Storage Only** — I need compute, not just storage

There's "Simulation & FEA" which mentions "compute-intensive simulations" — that's closer! But it's about finite element analysis and CFD. My model is agent-based. Does that count as simulation? Probably? But I don't know what FEA is.

**Missing:** Something that says "Run Stata/R/Python models that take too long on your desktop."

### Browse Services — Better

Switching to Browse Services helped. I see:
- **HPC Cluster (SLURM)** — this is what Li keeps mentioning
- **Research Storage** — okay, I need some
- **AWS/Azure Cloud Compute** — maybe? But the HPC is on-campus

**Key question I can't answer:** Can I run Stata on the HPC cluster?

The description says "genomics pipelines, simulations, ML training, and more." The "and more" is doing a lot of work there. I've been using Stata for 20 years. Can it run on the cluster or do I have to rewrite everything in Python?

Li could probably tell me but the tool can't.

---

## The Usage Estimates Step

This is where I got excited and then nervous.

### HPC Slurm presets

The presets are:
- **Light (single-node, occasional):** 1,000 SU
- **Moderate (regular multi-node):** 10,000 SU
- **Heavy (large-scale):** 100,000 SU
- **Very Heavy (dedicated allocation):** 500,000 SU

**My immediate reaction:** What the hell is an SU?

I read the description: "1 SU = 1 CPU-core-hour (GPU hours use weighted SUs)."

Okay. So if my 72-hour desktop job could parallelize across... 10 cores? Is that realistic? Then I'd need 720 SU per run. If I run this weekly, that's roughly 3,000 SU/month. So "Light"? But it doesn't feel light. It's my primary research bottleneck.

**What I actually want to know:**
- My Stata job takes 72 hours on my desktop (8-core i7). How many SUs would that be on the cluster?
- Can Stata even use multiple nodes or am I stuck with single-node?
- Is it faster just because the cluster has better CPUs, or do I need to parallelize my code?

The presets feel like they're written for people who already know the answer.

### Storage presets — Better

This made more sense:
- **Small project:** 1 TB
- **Medium project:** 10 TB
- **Data-intensive:** 100 TB

My models and data are maybe 3 TB total. I can estimate that. Good.

---

## The Cost Reveal

Let me try a realistic scenario for my Fed Reserve collaboration project:

**My selections:**
- **Tier:** Medium
- **Grant period:** 2 years
- **Retention:** 3 years after (NSF standard)
- **Services:**
  - HPC Cluster: 15,000 SU/month (I guessed high to be safe)
  - Research Storage: 4 TB

**The numbers:**

The cost breakdown would show:
- HPC at 15,000 SU/month: In the 10,000-100,000 tier, that's $0.08/SU = $1,200/month
- Storage at 4 TB, $5/TB/month: $20/month (minus 0.5 TB free = $17.50)
- **Monthly total:** ~$1,217
- **2-year grant:** ~$29,208
- **Archive (3 years post-grant):** ~$630 (Cold archive at $0.50/TB for ~4 TB)

**Grand total:** ~$29,838

**My reaction:** Is that... good? Bad? I have no reference point.

I know my time is worth something. If this cuts my iteration time from 72 hours to 7 hours (10x speedup), I could iterate weekly instead of monthly. That's probably worth $30K over two years.

But I don't know if that's a realistic speedup estimate.

---

## The DMP Preview

I clicked over to the Data Management Plan tab out of curiosity. There's text there about storage and compute plans. It looks professional and grant-ready.

**My only concern:** Does it say anything about Stata? Or does it just generically talk about "computational workflows"? Because reviewers know what Stata is and I don't want to accidentally imply I'm doing something more sophisticated than I am.

---

## What I'm Still Wondering

After going through the whole flow, I'm closer to understanding what I need — but I still have fundamental questions:

1. **Can I run Stata on the HPC cluster?**
   This is the first question and the tool doesn't answer it.

2. **Will my code actually run faster without modification?**
   Li says "it depends on the code." The tool doesn't say anything about this.

3. **Is HPC overkill for my use case?**
   Maybe I just need a beefier desktop? Or a Gold-tier VDI? Those are cheaper.

4. **Who do I talk to about translating desktop runtimes to cluster estimates?**
   The tool generates estimates but I don't trust mine.

---

## Overall Impression

**What works:**
- The step-by-step flow is clear
- Cost transparency is excellent — I can see exactly what I'd be budgeting
- The DMP generation is a huge time-saver
- The tool respects my time (5-10 minutes is accurate)

**What's missing:**
- **Domain awareness:** This tool speaks bioinformatics and ML, not economics
- **Existing workflow support:** Does it support Stata/R/MATLAB or do I need to rewrite?
- **Performance translation:** How do I map "72 hours on my desktop" to "SUs on cluster"?
- **Service guidance:** Should I use HPC or just get a better desktop?

**Would I use this for my next grant?**

Yes, with caveats. I'd need to:
1. Schedule the "RC Consultation" to ask my Stata question
2. Have Li help me estimate SUs more accurately
3. Trust that someone in research computing actually understands economics workflows

This tool gets me 70% of the way there. The last 30% requires talking to a human who knows that economists exist and have different needs than biologists.

---

## The Honest Take

I came in expecting to be told "you need to learn Python and Docker." I'm leaving with a realistic budget and a DMP draft. That's a huge improvement.

But I'm still not confident I picked the right services or estimated usage correctly. The tool assumes I understand HPC concepts like "SUs" and "multi-node jobs." I don't.

If there was a version that said, "Tell us about your workflow — what software do you use, how long do your jobs take, what are you trying to accomplish?" and then made recommendations, that would close the gap.

As it is, I'm going to export this session JSON and bring it to the RC consultation. That's probably the right workflow. But it means the tool isn't self-service for someone like me — it's a really good *pre-consultation preparation tool*.

That's still valuable. I just wish it had been advertised that way.
