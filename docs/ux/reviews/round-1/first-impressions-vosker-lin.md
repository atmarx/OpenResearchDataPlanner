# First Impressions: Dr. Lin Vosker
## Electrical and Computer Engineering | License Server Wrangler

**Date:** 2026-02-05
**Persona:** Dr. Lin Vosker - ECE Professor with ITAR and classified research
**Context:** Three active projects at L2, L3, and L4 tiers

---

## Initial Reaction

Finally. A tool that acknowledges L4 Restricted exists.

I've been through enough "data management planning" exercises to know when something is going to waste my time. Usually these tools are built for bio folks doing clinical trials or social scientists worried about IRB. Nothing for defense research. Nothing for export controls. Definitely nothing for classified work.

But this one... the User Guide literally says "Restricted" tier triggers a consultation workflow. That's actually correct. I can't just click through a web form for my DARPA project. I need to talk to the security team. The fact that this tool knows that is already better than the last three "solutions" I was offered.

---

## What Caught My Eye

### The Good

**1. L4 Restricted tier is real**

Not just a checkbox they added to look comprehensive. The tier definition says "Classified research, Defense contractor projects, CUI" - that's my DARPA project. And it explicitly says consultation required. That's honest. That's useful.

**2. Differentiation between L3 and L4**

My ITAR project (L3 High) and my DARPA project (L4 Restricted) have completely different requirements. Export controls are not the same as classified research. The tool seems to understand this. L3 has specific services. L4 routes to consultation. Correct.

**3. Services that actually exist**

I see HPC/SLURM, GPU cluster, research storage, cloud compute. These are real services I use. Not some fantasy infrastructure that doesn't exist yet. The GPU cluster description even says "V100" - that's what we actually have. The note about considering cloud for ML training is accurate. Our V100s are fine for my FEA work but I wouldn't use them for cutting-edge ML.

**4. No HPC for L3 High**

I noticed HPC/SLURM is only available for L1 Low and L2 Medium. Not L3. The mappings file confirms this. That's... actually correct policy, even if it's frustrating. ITAR data shouldn't be on shared HPC. The fact that cloud compute IS available for L3 with additional requirements - that's the right tradeoff.

### The Concerns

**1. Where are my licenses?**

I don't see Cadence. I don't see Synopsys. I don't see Mentor Graphics. I don't see ANY EDA tools. The services list has MATLAB, ANSYS in the institutional context notes, but where are the chip design tools? Do I need to bring my own license? Is there FlexLM server support?

The User Guide mentions "Custom FlexLM licenses CAN be hosted by RC if purchased" - okay, but that's buried in institutional context. I need to know if you can host my Cadence license server. And more importantly, if you can keep it from crashing every week.

**2. What happens when I select L4?**

The User Guide says "For restricted-tier data, you'll be directed to the security team automatically." Okay. But what does that look like? Do I get a contact email? A form to fill out? A 6-month waiting list? The tier definition says consultation is required and gives "security@northwinds.edu" as the contact. But what's the actual process? What information do they need from me?

**3. The DARPA project timeline**

The mappings file says secure enclaves have "4-8 weeks lead time for setup." That's... optimistic. But okay, if you can actually deliver a secure enclave in 2 months, that would be incredible. My bigger question: can I use this tool to PLAN for that, or does it just tell me "contact security" and stop?

**4. Bundle gaps**

I looked at the bundles. Genomics Pipeline. ML Training. Clinical Data. Web Applications. Nothing for chip design. Nothing for export-controlled research. Nothing that says "FEA and simulation with ITAR compliance." I'd have to build it manually from Browse Services, which is fine, but it means this tool wasn't built with defense research in mind.

---

## The Three-Project Test

I have three projects:

1. **Next-Gen FPGA Architecture (L2 Medium)** - Standard academic research with industry partners
2. **ITAR Radar Chip (L3 High)** - Export controlled, defense application
3. **DARPA Secure Enclave (L4 Restricted)** - Classified, requires consultation

Can this tool handle all three?

### Project 1: FPGA (L2) - Probably Yes

HPC/SLURM is available at L2. GPU cluster is available at L2. Research storage is available at L2. I can estimate costs, generate a DMP, done. This should work fine.

### Project 2: ITAR (L3) - Maybe

HPC is NOT available at L3 - that's a problem because I need compute. The mapping says to use cloud compute instead (Azure/AWS at L3 with "dedicated VPC with no internet gateway" and other requirements). Okay. That might work. But it's going to be expensive compared to HPC, and I need to understand the approval process ("requires review" with cloud-team@northwinds.edu).

GPU cluster IS available at L3 with review and additional requirements. Research storage IS available at L3 with review. So the services exist, but they all require approval. Does this tool help me with that approval process, or just tell me it's required?

### Project 3: DARPA (L4) - Unknown

Secure enclave exists and is mapped to L4 Restricted with consultation approval. The cost model says "consultation" with contact security@northwinds.edu and a note that pricing is $5K-$50K/year depending on scale. Okay. But what happens in the tool? Do I select L4, get a message saying "contact security@northwinds.edu," and that's it? Or is there a way to document my requirements so when I DO contact security, I'm not starting from zero?

---

## What I Need to Know

Before I actually try to use this tool for my grants, I need answers:

1. **EDA tool licensing**: Can RC host FlexLM for Cadence, Synopsys, Mentor? Is that a service I can add, or do I handle it separately?

2. **L3 approval workflow**: When services say "requires review," what's the timeline? What information do I need to provide? Can I start that process through this tool or is it external?

3. **L4 consultation process**: If I select L4 Restricted, what actually happens? Do I get routed to a form? Do I get contact info and have to email separately? Can I save my project parameters to share with security?

4. **Multi-tier support**: Can I run through this tool three times for three different projects? Or is there a way to manage multiple projects with different tiers in one session?

5. **Export control documentation**: For my L3 ITAR project, does the DMP output help with export control compliance? Does it reference ITAR requirements, or is it generic?

---

## Bottom Line

This is the first data management planning tool I've seen that acknowledges defense research exists. The fact that L4 Restricted is a real tier with a consultation pathway is already more useful than anything else I've been handed.

But I'm skeptical. I've been promised "solutions" before. I need to see what actually happens when I select L4. I need to know if the L3 review process is 2 weeks or 6 months. And I really need to know about license servers.

If this tool can:
- Route me to the right security contact for L4 with clear expectations
- Handle the L3 approval workflow without 18 months of paperwork
- At least acknowledge that EDA tools exist even if they're "bring your own license"

...then I'll use it. Otherwise it's another tool built for bioinformatics that sort of works for engineering if you squint.

Let's see how it actually performs.

---

## Expectations vs Reality

**What I expect will work:**
- L2 Medium project (FPGA) - standard research, should be straightforward
- Basic cost estimation for compute and storage
- DMP generation for the L2 project

**What I expect will be problematic:**
- L3 High project (ITAR) - approval workflows, export control compliance
- L4 Restricted project (DARPA) - probably just a "contact security" dead end
- License management - probably not mentioned at all

**What would surprise me (in a good way):**
- L4 actually provides useful guidance, not just a contact email
- L3 approval process is integrated into the tool somehow
- Someone thought about engineering workloads beyond "run Python on HPC"

I'll run through all three projects and report back.
