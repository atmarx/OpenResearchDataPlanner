# First Impressions: Dr. Yev Transom

**Persona:** Dr. Yev Transom, Computer Science (ML)
**Date:** 2026-02-05
**Context:** Large-scale LLM training project requiring 100K GPU-hours/month

---

## Initial Reaction

Finally, a tool that speaks in actual numbers instead of hand-waving about "computational needs." I can work with this.

Spent about 8 minutes going through the whole wizard for my LLM training project. Not bad. The interface doesn't try to explain what a GPU is, which is refreshing.

---

## What Works

### 1. The bundles actually make sense
The "ML/AI Model Training (Cloud)" bundle is exactly what I'd spec myself:
- AWS compute for GPU instances
- Research storage for checkpoints
- No unnecessary bloat

Someone who knows what they're doing designed this. The note "GPU instances (p3/p4) for training; ~$3/hr per GPU" tells me they understand AWS instance families.

### 2. Cloud-first for ML is the right call
The fact that there's a separate cloud ML bundle vs on-prem tells me the tool designers get it. V100s are fine for simulation folks, but for LLM work, I need access to newer architectures. Cloud is where that lives.

### 3. Large numbers don't break it
I plugged in 100,000 SU for the HPC cluster just to see if it would choke. It didn't. The tiered pricing kicked in correctly and gave me the volume discount. This tool was designed for actual research computing, not toy projects.

### 4. Scavenger queue subsidy is visible
The HPC service has a "Scavenger Partition" subsidy option that's clearly labeled as preemptible. I can see the tradeoffs: free but may be preempted. Perfect. I live in that queue anyway.

### 5. Cost breakdown is transparent
The Results page shows me:
- Monthly costs
- Total grant period costs
- Per-service breakdown

I can make intelligent decisions with these numbers. I can see that AWS compute at $3K/month for 3 years is $108K, plus storage, and decide if I want to ask for that or try to make the on-prem cluster work.

---

## What Doesn't Work

### 1. GPU cluster description undersells cloud for ML
The GPU cluster service says:

> "While the V100 architecture supports machine learning, researchers with heavy ML/AI training workloads should consider cloud GPU options (Azure/AWS) for access to newer architectures."

This is buried in the long description. For someone less experienced, they might pick the on-prem GPU cluster because it's there and seems cheaper (first 500 GPU-hours free in scavenger).

**The problem:** V100s are from 2017. For LLM training in 2026, I need A100s or H100s. The tool should make this clearer up front, not in fine print.

### 2. No way to express "mostly scavenger + burst guaranteed"
My actual use case:
- 80% of the time: scavenger queue (free but preemptible)
- 20% of the time: guaranteed compute when deadlines loom

The tool makes me pick one or the other. I can check the scavenger subsidy box, but there's no way to say "5,000 SU scavenger + 2,000 SU guaranteed" in the same service.

Real-world ML research is bursty. I checkpoint everything specifically because I expect preemption. But when the conference deadline is 48 hours out, I pay for guaranteed.

### 3. GPU-hour vs SU conversion is opaque
The HPC service says "GPU hours use weighted SUs" but doesn't tell me the conversion factor. The ML bundle note says "1 GPU-hour = 10 SU" but that's in the bundle, not in the service itself.

If I'm trying to calculate actual GPU time, I need that number prominently displayed. Don't make me reverse-engineer it.

### 4. AWS/Azure are just "USD" buckets
Both cloud compute services are basically "estimate your monthly spend." That's fine for someone experienced, but it would be helpful to have GPU-specific presets:

- "8x A100 for 100 hours/month" = ~$2,400
- "Spot instances for LLM fine-tuning" = ~$1,200
- "On-demand H100 for deadline crunch" = ~$8,000

The presets currently are just "Light / Moderate / Heavy" with dollar amounts. I have to do my own math to figure out what that translates to in actual GPU time.

### 5. No mention of ACCESS program
I know Northwinds has an ACCESS campus champion. For compute-intensive work like mine, ACCESS allocations can provide massive free compute. The tool should at least mention this as an option, especially for the HPC cluster service.

---

## Specific Pain Points for My Use Case

### My actual project: LLM Training (Medium tier)
- **Compute:** 100,000 GPU-hours over 3 years (bursty pattern)
- **Storage:** 20TB active, 15TB archive
- **Team:** 5 people, all can debug k8s

### What I tried to specify:
1. Selected "ML/AI Model Training (Cloud)" bundle
2. Set AWS compute to $5,000/month (roughly 100 H100 hours + overhead)
3. Set research storage to 20TB
4. Added scavenger queue subsidy for the HPC cluster

### What was awkward:
- Had to manually remove the GPU cluster from the bundle because I don't actually want V100s
- Couldn't specify that I want a mix of spot and on-demand AWS instances
- No way to express that storage needs will grow over the grant period (starting at 5TB, ending at 20TB)
- Archive storage calculation assumes a fixed ratio, but I know exactly what I'm archiving (model weights = 15TB, everything else gets deleted)

---

## Missing Features

1. **Presets for common ML workloads**
   - "LLM fine-tuning (7B model)" → X GPU-hours
   - "Vision transformer training" → Y GPU-hours
   - "Stable diffusion training" → Z GPU-hours

   I don't need these, but less experienced researchers would.

2. **Spot/preemptible pricing for cloud**
   AWS and Azure both offer spot instances at ~70% discount. For fault-tolerant ML training, this is a no-brainer. The tool should make this explicit.

3. **Multi-cloud strategy**
   My real workflow: scavenger queue on HPC → spot instances on AWS → on-demand AWS for deadlines. The tool assumes I'll pick one compute service, but I actually need three with different characteristics.

4. **Kubernetes cluster mention**
   The tool has a "Kubernetes Cluster (Beta)" service, but it's not in any of the ML bundles. For anyone doing containerized ML workflows (which is most serious ML research), this should at least be offered as an option.

---

## Overall Assessment

**Would I use this for a grant?** Yes, with manual adjustments.

**Would I recommend it to my postdocs?** Yes, but I'd tell them:
- Cloud ML bundle is the right starting point
- V100s are not sufficient for heavy LLM work
- Do your own GPU-hour math for AWS/Azure
- Talk to me before submitting the budget

**What would make it great:**
- Better GPU architecture guidance (V100 vs A100 vs H100)
- Support for mixed compute strategies (scavenger + guaranteed + cloud burst)
- GPU-hour to dollar conversion helpers for cloud services
- Mention of ACCESS program for large-scale compute

---

## Speed Test

**Time to complete:** ~8 minutes from welcome screen to results

For a power user like me, that's acceptable. I know exactly what I need, so I'm just plugging in numbers.

The fact that it didn't crash on 100K SU and $5K/month cloud spend tells me it's designed for real workloads, not toy examples.

---

## Key Quote

> "I don't need hand-holding. I need numbers. How much does 100K GPU-hours cost on scavenger vs guaranteed?"

The tool gives me numbers. It doesn't give me the scavenger vs guaranteed comparison directly, but I can calculate it from the tiered pricing and the subsidy information.

That's good enough for me. I wish it were more explicit, but at least the data is there.
