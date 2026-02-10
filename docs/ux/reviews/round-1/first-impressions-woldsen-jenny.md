# First Impressions - Dr. Jenny Woldsen

**Persona:** Associate Professor, Business School
**Tech Level:** Low
**Archetype:** AI Curious
**Date:** 2026-02-05

---

## Initial Reaction

I came to this tool because I'm finally taking the plunge and exploring AI for my business strategy research. I've been running Monte Carlo simulations in Excel for years, but everyone keeps saying I need to look at LLMs and machine learning. I don't even know what a GPU really is versus a CPU, so I was honestly nervous opening this tool.

**First impression: This feels like it was made for someone who already knows what they're doing.**

---

## What Worked

### The Tier Selection Was Clear
I appreciated the straightforward table in Step 2. My simulation methodology is proprietary (competitive advantage research for corporations), so "Medium" tier made sense immediately. No confusion there.

### The LLM Bundle Exists!
I was thrilled to see "LLM/Chatbot Application" as a bundle option. That's exactly what I want to explore! Having Azure OpenAI listed gave me confidence that the university already has this set up.

### The User Guide Is Comprehensive
I read through the whole guide before starting. It's well-organized and covers all the steps. I felt prepared.

---

## What Confused Me

### GPU Cluster vs. Azure OpenAI - Which Do I Need?

Here's where I got completely lost. The tool shows me:
- **GPU Cluster** (on-premises, V100 GPUs)
- **Azure OpenAI Service** (API for GPT-4)
- **AWS Compute** (cloud computing)
- **Azure Compute** (cloud computing)

**I genuinely don't know which one I need for AI work.**

The user guide says:
> "**ML/AI Training (Cloud)** — GPU-heavy machine learning"

But then there's also:
> "**LLM/Chatbot Application** — Build a chatbot, RAG system..."

Are these the same thing? Am I training a model or using a pre-trained one? What's the difference?

### What Does "Training" Mean?

I saw "ML/AI Model Training" bundles, but I don't understand what "training" means in this context. Am I training ChatGPT? (That can't be right, that seems expensive.) Or am I training my own model? Do I need to train anything to explore AI for business case analysis?

**I feel like I'm missing fundamental knowledge here.**

### GPU Hours vs. Tokens - Help!

The GPU Cluster says:
> "How many GPU-hours per month do you estimate?"

Azure OpenAI says:
> "Estimated token usage per month?"

I don't know how to estimate either of these. What's a token? How many tokens does it take to analyze a business case study? How do I know if I need GPU hours or tokens or both?

The presets say things like "Prototype/testing: 1M tokens" but that's meaningless to me. Is that a lot? A little?

### The V100 GPU Note Worried Me

The GPU Cluster description says:
> "While the V100 architecture supports machine learning, researchers with heavy ML/AI training workloads should consider cloud GPU options (Azure/AWS) for access to newer architectures."

This made me panic. Does this mean the on-campus GPU cluster isn't good enough for AI? Should I be using Azure instead? But then why is there an on-campus GPU cluster at all?

I'm trying to learn AI, and now I'm worried I'll pick the wrong infrastructure and waste grant money.

---

## What's Missing (For Me)

### An "AI Newcomer" Pathway

I wish there was a clear path for someone like me who is:
- Interested in exploring LLMs
- Has zero AI background
- Doesn't know technical jargon
- Just wants to try some experiments

Something like:
> "New to AI? Start here: Most business researchers exploring LLMs for text analysis should begin with Azure OpenAI (pay-per-use) rather than GPU compute. You'll only need GPU clusters if you're training custom models from scratch, which is uncommon for initial exploration."

### Educational Content About GPU vs. CPU

The user guide mentions "GPU-heavy machine learning" but never explains *why* GPUs matter or what they do differently. I know my laptop has a CPU. I've heard GPUs are for graphics. But why do I need graphics processors for AI?

**Can someone just explain this in normal words?**

I would have loved a tooltip or help icon that said something like:
> "GPUs (Graphics Processing Units) can perform many calculations simultaneously, making them much faster than CPUs for AI model training. However, for using pre-trained models like GPT-4 via API, you don't need GPUs at all - you're just sending text and getting responses back."

### Cost Context for AI Exploration

I saw the Azure OpenAI presets:
- Prototype/testing: 1M tokens
- Production chatbot: 10M tokens
- Batch processing: 100M tokens

But what does this mean in real terms? How much does it cost to:
- Ask GPT-4 to analyze 100 business case studies?
- Run a chatbot for a semester of students?
- Process a year's worth of earnings call transcripts?

I need examples I can relate to, not abstract token counts.

### Bundle Recommendation Based on My Goals

When I selected "LLM/Chatbot Application" bundle, the tool gave me:
- Azure OpenAI (10M tokens estimated)
- NWFiles (1TB storage)

But I don't know if that's right for my use case. I want to:
1. Explore LLM-based text analysis for strategy research
2. Maybe build a prototype chatbot for MBA students
3. Test sentiment analysis on corporate communications

Is 10M tokens enough? Too much? What about storage - do I need 1TB or is that overkill?

---

## My Biggest Frustration

**The tool assumes I already understand the AI compute landscape.**

There's no onboarding, no "AI 101" context, no gentle introduction. It's like walking into a car dealership and the salesperson starts talking about torque ratios and transmission types when all I wanted to know was "which car is good for commuting?"

I wanted this tool to help me **learn** what I need, not just help me **select** what I already know I need.

---

## What Would Have Helped

### 1. A Pre-Selection Questionnaire

Before I even get to service selection, ask me:
- "What do you want to do with AI?"
  - Explore pre-trained models (like GPT-4)
  - Train custom models on my own data
  - Run simulations that need GPU acceleration
  - Not sure, just exploring

Then route me to appropriate bundles with explanations.

### 2. Educational Tooltips

Every technical term should have a hover tooltip:
- **GPU:** Graphics Processing Unit - hardware that accelerates parallel computations. Essential for training AI models, but not needed for using pre-trained APIs.
- **Token:** A unit of text (roughly 4 characters). GPT-4 processes ~750 words per 1,000 tokens.
- **Training:** Teaching an AI model by feeding it data. Most research uses pre-trained models, not custom training.

### 3. "AI Starter Pack" Bundle

Create a bundle specifically for AI-curious researchers:
- Azure OpenAI (small allocation for testing)
- RC Consultation (1 hour free - this already exists!)
- Documentation with business-relevant examples

Call it **"AI Exploration for Social Sciences"** or **"LLM Starter Kit"**.

### 4. Cost Examples in Real Terms

Instead of:
> "Prototype/testing: 1M tokens"

Say:
> "Prototype/testing: 1M tokens (~750,000 words, enough to analyze 100-200 documents)"

Or better yet:
> "Light exploration: ~$30/month - Enough to process 30-50 business cases or run a small chatbot for one class"

---

## The MATLAB Note I Almost Missed

I saw that MATLAB is available as a campus license. That's great! I use MATLAB occasionally for modeling. But nowhere in the tool did it suggest that MATLAB might be relevant for my Monte Carlo work.

If the tool knew I was in Business School and saw "simulation" keywords, could it surface:
> "Note: MATLAB is available campus-wide and may be suitable for Monte Carlo simulations without requiring HPC resources."

---

## The ACCESS Program Confusion

The institutional context mentions "ACCESS Program: Campus champion available." I have no idea what this is. Is it relevant to me? Should I care?

If it's important, explain it. If it's not relevant to Business School researchers, don't mention it (or explain why it might not apply).

---

## Bottom Line

**I want to explore AI. I came to this tool hoping it would guide me. Instead, I feel more confused than when I started.**

The tool is well-built and comprehensive, but it's designed for people who already speak the language of research computing. For someone like me - smart, capable, willing to learn, but starting from zero - it's intimidating and alienating.

I didn't need a simpler tool. I needed a more **educational** tool.

---

## What I'm Going to Do Next

Despite my confusion, I'm going to:
1. Select the "LLM/Chatbot Application" bundle
2. Keep the default estimates (and hope they're reasonable)
3. Book that free RC Consultation hour and ask someone to explain GPU vs. API to me
4. Submit my grant with fingers crossed that I budgeted correctly

But I really wish I didn't have to do Step 3 to understand Steps 1-2.

---

## Positive Note

I do appreciate that:
- The LLM bundle exists (shows someone thought about AI use cases)
- Azure OpenAI is available (institutional support for AI is reassuring)
- There's a free consultation (safety net for confused people like me)
- The tool saved my progress (I closed it twice while researching "what is a GPU")

This tool has **great bones**. It just needs to be more welcoming to AI newcomers.

---

## Rating: 6/10

**What it does well:** Comprehensive service catalog, clear tier selection, bundle options, good user guide structure.

**What needs work:** Educational content for non-technical users, guidance for AI newcomers, jargon explanations, relatable cost examples.

**Would I recommend it to a Business School colleague?** Only if they already know what they're looking for. If they're exploring AI for the first time (like me), I'd warn them to schedule that consultation *before* using the tool.
