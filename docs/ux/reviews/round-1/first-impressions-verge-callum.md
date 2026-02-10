# First Impressions: Dr. Dorn Pallish

**Date:** February 5, 2026
**Persona:** Dr. Dorn Pallish, Digital Humanities
**Context:** Writing NEH grant for manuscript analysis + need to figure out oral history storage
**Tech Level:** Low-Medium ("I'm a historian, not a programmer")

---

## Initial Reaction

So IT sent around an email about this new "data planning tool" and honestly, I almost deleted it. But my grad student Sarah mentioned it might actually be useful for the NEH grant I'm writing, and she's usually right about these things.

I'm reading this at 11 PM with a cup of tea because I have 15,000 words about manuscript transmission networks due on Friday and I need to add a data management section. I have no idea what to put in there. My collaborator at Stanford keeps using phrases like "computational pipeline" and I just nod politely.

## Reading the User Guide

### What immediately stands out

**"5-10 minutes to complete"** - Okay, that's doable. I can spare 10 minutes if it means I don't have to figure this out from scratch.

**"Select the right services based on your data's security requirements"** - Wait, I have security requirements? I mean, I guess the oral history interviews are private... but I didn't think that was a "security" thing. That's just... being respectful to my interview subjects?

**"Your progress is saved automatically"** - Thank goodness. I will 100% get distracted by email or a question from a student.

### The security tier table

| Tier | Use when your data... |
|------|----------------------|
| **Low** | Is publicly releasable, has no restrictions |
| **Medium** | Has some restrictions (proprietary, unpublished) but isn't regulated |
| **High** | Contains PHI, HIPAA data, or other regulated information |

Okay so... my medieval manuscripts are Low (they're public domain, 700 years old). That makes sense.

But my oral history project? The elderly folks I interviewed asked me not to share recordings until after they've passed away. That's not HIPAA or IRB... is that Medium? The guide says "has some restrictions" but doesn't give examples like this. It's all science examples - clinical data, proprietary research, FISMA.

**What I need:** An example that says "interview subjects with privacy concerns = Medium tier"

### Services section

I scan through the services list and immediately my eyes glaze over:
- HPC Cluster (SLURM)
- GPFS
- Service Units
- GPU-hours
- Azure OpenAI Service
- Kubernetes

I recognize maybe 3 of these terms. I know what cloud storage is. I know what a server is (barely). But what's a "service unit"? The guide says "1 SU = 1 CPU-core-hour" which somehow makes it LESS clear. How many CPU-core-hours does text analysis take? I have genuinely no idea.

Sarah would know. I'll probably end up asking her.

### The bundles section

**This is more my speed.**

I see:
- **Storage Only** - "Just need a place for data?" - YES. This is me.
- **Collaborative Research Project** - Maybe for the Stanford collaboration?
- **LLM/Chatbot Application** - Oh! This might be relevant for the text analysis?

But I don't see a "Digital Humanities" bundle. I don't see "text analysis" or "NLP" or "corpus linguistics" mentioned anywhere. All the examples are genomics, machine learning training, clinical data, simulations.

**What I need:** Examples that speak to humanities research. Even just one.

## Looking at Available Services

I make myself actually read through the services descriptions:

### Things that make sense to me

**University File Server (NWFiles)** - Okay yes, I know what a file server is. I have a departmental file share. $3/TB/month seems... reasonable? I think? I don't know what things cost. First 100GB free is nice but I have 3TB of manuscript scans so that doesn't help much.

**OneDrive for Business** - I use OneDrive! I put my article drafts there. But there's a big warning about limitations for research data. I tried to put my manuscript corpus on OneDrive once and it just... stopped syncing. So I gave up and bought an external hard drive.

**Research Storage (GPFS)** - "High-performance parallel filesystem" - I don't know what any of those words mean in combination. $5/TB/month is more expensive than NWFiles. Why would I pick this one?

**Cold Archive Storage** - $0.50/TB/month for long-term retention. This is interesting because my grant requires me to keep data for 3 years after the project ends. Is this what I need for that?

### Things that confuse me

**HPC Cluster (SLURM)** - Sarah uses this for her NLP work. She's tried to explain SLURM to me multiple times. I still don't understand it. The pricing is in "Service Units" and there are tiers ($0.10, $0.08, $0.05 per SU) and I have absolutely no frame of reference for whether I need 1,000 or 100,000 SUs.

**Azure OpenAI Service** - "GPT-4, embeddings, and other Azure-hosted AI models" - Okay so this is the ChatGPT thing? I know what ChatGPT is! But the pricing is "$30 per million tokens" and I don't know how many tokens I need. What's a token? Is that like... words?

**GPU Cluster** - Says it's for "Finite Element Analysis, computational fluid dynamics, molecular dynamics" and then mentions machine learning as a side note. Sarah said we might need GPUs for the transformer models? I'm not sure if that's this or the HPC thing.

### Services I didn't expect

**Research Web Hosting** - "Deploy and host research web applications" - Oh! I wanted to make a public interface for the manuscript corpus where scholars could search transcriptions. Is this how I'd do that? The description talks about "CI/CD pipelines" and "Container Apps" which means nothing to me.

**Globus Data Transfer** - Free data transfer with "5PB iRODS backend" - I don't know what iRODS is but I do know my Stanford collaborator is always complaining about FTPing files. Maybe this is relevant?

## Key Questions Before I Even Start

1. **What tier is "please keep this private out of respect but it's not regulated data"?** This feels like it should be obvious but I genuinely don't know. Medium?

2. **How do I estimate how much compute my text analysis needs?** Sarah runs the scripts. I have no idea if it's expensive or cheap in computer terms. I know it takes a few hours on her laptop. What does that translate to?

3. **Is there someone I can talk to?** I'm going to get this wrong. I know I am. I need a human who can say "oh you're doing X, you need Y."

4. **Do I need to understand all of this or can I just pick bundles and trust them?** The bundles seem safe. The individual services feel like a trap where I'll pick the wrong thing.

5. **What happens to my data after my grant ends?** I have federal retention requirements. The archive storage seems related but I don't fully understand how it works.

6. **Can I use Dropbox?** I currently use personal Dropbox for most of my manuscripts. The guide doesn't mention Dropbox at all. Is that bad? Should I stop?

## Things That Would Help Right Now

**What I desperately need:**

1. **Plain language throughout** - Don't assume I know what GPFS, SLURM, iRODS, or "container orchestration" mean. Either explain them or use simpler terms.

2. **Humanities examples** - Just one example of a text analysis project. Or oral history. Or digital archive. Something that isn't genomics or ML training.

3. **A "Not sure? Start here" guide** - Like "If you're not technical, try the Storage Only bundle first and we'll help you add compute later."

4. **Clear contact information** - Put "Questions? Email help@northwinds.edu" right at the top. I need to know I can get help.

5. **Tier decision tree** - A flowchart: "Is your data public? → Low. Do people want it private? → Medium. Is it regulated (HIPAA/FERPA)? → High."

**What would make me trust this:**

- A note that says "It's okay if you don't understand everything - that's what we're here for"
- Example budgets from humanities projects
- Testimonial from another DH person saying this was helpful
- Explicit permission to start simple (storage) and add complexity later

## Overall First Impression

**The good:**
- The concept is great - I DO need to plan this and I have no idea how
- Storage Only bundle is perfect for my immediate need
- 10 minutes is a reasonable time commitment
- Auto-save means I won't lose progress

**The concerning:**
- Everything is written for scientists who understand computing
- No humanities examples anywhere
- I don't know how to estimate usage for anything that isn't storage
- Lots of jargon with limited explanation
- Not clear if my "please keep this private" data counts as Medium tier

**The intimidating:**
- Service Units, GPU-hours, tokens - these might as well be in Latin
- Feeling like I'm going to pick wrong options and waste grant money
- Worry that I need to understand more than I do
- No clear "I'm lost, help me" button

## The honest truth

I'm going to try this because I need budget numbers for my grant and I'm out of time. But I'm going to do it with Sarah sitting next to me explaining things. And I'm probably going to end up emailing someone at Research Computing anyway to make sure I didn't completely mess it up.

**What would make me feel confident enough to do this alone:**
1. A Digital Humanities example walkthrough from start to finish
2. Clear statement that "you can't break anything, this is just planning"
3. Big friendly "Get Help" button that doesn't make me feel stupid for needing it
4. Acknowledgment that not everyone using this tool is a computational scientist

I'm cautiously willing to try. But I'm not optimistic that I'll understand enough to be confident in my answers.

---

**Bottom line:** I'll use it because I have to, but I need a lot more hand-holding than this guide provides.
