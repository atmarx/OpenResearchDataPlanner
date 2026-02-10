# First Impressions: Dr. Mirk Nonanda

**Date:** 2026-02-05
**Persona:** Dr. Mirk Nonanda, Computer Science (OS/Systems)
**Archetype:** Pipeline Builder
**Tech Level:** Very High

---

## Initial Reaction

A self-service research infrastructure planning tool. My first thought: "Is this going to hide the implementation details, or will it actually show me what's happening under the hood?"

I'm skeptical of tools that try to "simplify" infrastructure. In my experience, simplification usually means abstraction, and abstraction means I can't verify assumptions or debug when things go wrong.

That said, if this tool is transparent about what it's doing and provides verifiable cost calculations, it could be useful for grant proposals. I spend too much time reverse-engineering RC's pricing models.

---

## Reading the User Guide

### Time estimate: 5-10 minutes
Realistic. I can move faster than that, but for someone less technical, this seems reasonable.

### Step 2: Data Classification
The tier descriptions are... adequate. But they're written for people who don't understand the technical controls that make these tiers meaningful.

- What filesystem is used for High tier? Is it encrypted at rest?
- What's the authentication mechanism? Kerberos? OAuth?
- For Restricted tier, it says "triggers a consultation workflow" - does that mean I can't even estimate costs without talking to someone?

The guide says "choose the higher tier when in doubt" which is operationally sound but frustrating. I'd rather see technical specifications so I can make an informed decision.

### Step 3: Grant Period
Straightforward. No issues here. The math is trivial.

### Step 4: Data Retention
This is actually useful. Federal grant retention requirements are documented clearly. The archive ratio slider is a reasonable way to model this, assuming the underlying storage system actually supports tiering.

I want to know: Is the archive tier tape? Object storage? What's the retrieval SLA?

### Step 5: Select Services - Bundles
Pre-configured bundles. I understand why this exists - most researchers probably don't know what they need. But I'm not "most researchers."

I want to browse individual services and understand what each one does. The guide mentions I can switch to "Browse Services" - good. That's what I'll use.

The "Recommended" vs "Requires review" indicators are helpful IF they're based on actual technical compatibility, not just policy.

### Step 6: Usage Estimates
Quick presets are fine for people who don't know their workload. I'll enter exact numbers.

"Subsidies" - the guide mentions auto-applied vs opt-in. That's transparent. I appreciate that.

The acknowledgment requirement for limited services (OneDrive, LabArchives) is interesting. At least they're telling you upfront that these services have hard limits. Most tools would hide that until you hit the limit.

### Step 7: Results
Two tabs: Budget and DMP.

The export options are what I care about:
- Markdown export: Useful for copy-paste into LaTeX grants
- JSON export: VERY useful. Can I script against this? Can I load a JSON file to regenerate a session?

If the JSON export includes the full calculation breakdown, I can verify the math myself. That would be refreshing.

---

## Reading services.yaml

This is where I get technical details. Let me see what they're actually offering.

### HPC Cluster (SLURM)
- Tiered pricing based on SU consumption
- 1 SU = 1 CPU-core-hour
- GPU hours use "weighted SUs" - what's the weighting? The guide doesn't say.
- Scavenger partition subsidy: 100% discount, preemptible jobs, 5000 SU/month cap

This is standard HPC fare. The pricing tiers make sense (volume discounts). The scavenger option is what I'd expect - I already use preemptible jobs for fault-tolerant builds.

**Question:** What scheduler version? What QoS policies exist? Can I see queue priority calculations?

### Research Storage (GPFS)
- $5/TB/month
- 500GB base allocation
- Archive option to cold storage

GPFS is solid. IBM Spectrum Scale, parallel filesystem, high throughput. This is appropriate for HPC workloads.

**Concern:** The long_description mentions "snapshots, quotas, and high-throughput access" but doesn't specify snapshot retention policy or IOPS guarantees. For $5/TB, what am I actually getting?

### Cold Archive Storage
- $0.50/TB/month
- "Tape-backed archival tier"
- "48-72 hour retrieval time"

Finally, technical honesty. Tape. 48-72 hours. No one calls it "nearline" or "infrequent access" - it's tape, and they're telling you upfront.

This is the kind of transparency I want to see everywhere.

### Kubernetes Cluster (Beta)
Wait. They have a K8s cluster?

- "Currently in beta with free access for qualifying projects"
- "Applicants should have experience with Helm charts or containerized workflows"
- Free during beta, future pricing TBD based on CPU/memory/storage

This is interesting. Very interesting.

I've been running my own CI infrastructure because IT's Jenkins setup is unreliable. If I could get a K8s namespace for my build farm, I could offload the hardware maintenance.

The acknowledgment requirements say:
- Experience with containerized applications required
- Helm chart knowledge required (or willingness to learn)
- Access by application only

This is reasonable gatekeeping. They don't want to support people who don't know what they're doing. I respect that.

**I'm applying for this.**

### GPU Cluster
- NVIDIA V100 GPUs
- Tiered pricing: $0.50/hr (standard) down to $0.30/hr (heavy use)
- Free scavenger queue for preemptible jobs (500 GPU-hours/month)

V100s are good for simulation workloads. The description specifically mentions FEA, CFD, molecular dynamics, and acknowledges that researchers with heavy ML workloads should consider cloud options for newer architectures.

This is technically honest. V100s are older, but they're still excellent for compute-intensive work. The fact that they're steering ML researchers to cloud providers with newer GPUs shows they understand the use cases.

### Research VDI (Silver/Gold/Platinum)
Azure Local cluster. Three tiers based on vCPU/RAM.

- Silver: 4 vCPU, 16GB RAM, $75/month
- Gold: 8 vCPU, 32GB RAM, $150/month
- Platinum: 16 vCPU, 64GB RAM, $300/month

All include daily backups, 30-day retention, Azure AD auth.

I don't need VDI - I have root on department machines - but for researchers who need isolated environments, this is reasonable pricing.

**Question:** What hypervisor? What's the oversubscription ratio? Are these dedicated vCPUs or shared?

### Globus Data Transfer
- Free transfer service
- 5PB iRODS backend

Globus is industry standard for large data movement. The fact that it's backed by iRODS is interesting - iRODS is good for data management and metadata, but it's complex to administer.

If they're running a 5PB iRODS deployment, that's serious infrastructure. I'm cautiously impressed.

### Research Computing Consultation
- First hour free per project
- $150/hour after that
- Available in 5-hour or 10-hour blocks

This is smart. Most researchers will use the free hour for initial consultation. If they need more, they're probably working on something complex enough to justify the cost.

I might actually use this for the K8s application - getting help with Helm chart architecture could save me time.

---

## Reading bundles.yaml

Pre-configured service bundles. Let me see if any of these match my workload.

### ML/AI Model Training (On-Prem)
- HPC SLURM (100,000 SU)
- GPU cluster (200 GPU-hours)
- Research storage (50TB)

The note says "GPU hours are weighted; 1 GPU-hour = 10 SU" - there's the weighting I was looking for. So 100,000 SU could be 10,000 GPU-hours on the HPC cluster, or 200 GPU-hours on the dedicated GPU cluster.

**This still doesn't tell me the actual GPU model on the HPC cluster.** V100s? A100s? This matters for performance estimation.

### Simulation & FEA
- GPU cluster (500 GPU-hours) - V100s, optimized for simulation
- Research storage (50TB)
- RC consultation (1 hour free)

This bundle explicitly calls out V100 optimization for simulation. Good. Clear use case alignment.

### ML/AI Model Training (Cloud)
- AWS compute ($3000/month)
- Research storage (50TB)

The note says "GPU instances (p3/p4) for training; ~$3/hr per GPU" - that's a reasonable estimate for AWS p3 instances (V100s) or p4 instances (A100s).

**But this is pass-through pricing with 5% overhead.** The services.yaml says AWS/Azure are $1.00/USD with 5% admin overhead. So if I estimate $3000/month, I'm actually paying $3150/month.

I need to remember to add 5% to my own AWS cost calculations.

---

## Overall Technical Assessment

### What This Tool Does Well

1. **Transparent cost calculations**: Tiered pricing is documented. Subsidies are explicit. The JSON export should let me verify the math.

2. **Technical honesty**: Cold archive is tape with 48-72 hour retrieval. V100s are good for simulation but older for ML. OneDrive and LabArchives have hard limits that can't be increased.

3. **Appropriate gatekeeping**: K8s cluster requires application and experience. Restricted tier triggers consultation. They're not giving root to everyone.

4. **Service diversity**: HPC, cloud, GPU, K8s, VDI, storage tiers. This is a real research computing infrastructure, not just "here's a VM."

### What This Tool Could Improve

1. **Insufficient technical specifications**: What hypervisor for VDI? What GPU models on the HPC cluster? What IOPS for GPFS? What K8s version?

2. **Hidden implementation details**: The user guide is written for people who don't understand systems. I want a technical appendix.

3. **No API or CLI option**: The guide mentions JSON export, but can I automate this? Can I script multiple scenarios?

4. **Pass-through pricing ambiguity**: AWS/Azure services are "pass-through with 5% overhead" but this isn't prominently displayed in cost summaries.

---

## The Bottom Line

This tool is better than I expected. It's not hiding costs, it's documenting technical limitations, and it's offering services I might actually use (K8s beta).

But it's still written for generalists. I want to see:
- Technical specifications for every service
- SLAs and performance guarantees
- Architecture diagrams
- The actual Ansible/Terraform that provisions this infrastructure

I'll use this tool for grant cost estimation, but I'll verify every number myself. And I'm definitely applying for the K8s beta.

**Provisional rating: 7/10**
- Would be 9/10 with technical appendix
- Would be 10/10 with API access
