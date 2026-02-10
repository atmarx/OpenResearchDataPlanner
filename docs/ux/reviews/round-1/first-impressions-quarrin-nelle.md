# First Impressions: Dr. Nelle Quarrin

**Date:** February 5, 2026
**Reviewer:** Dr. Nelle Quarrin, Neuroscience
**Context:** Clinical fMRI study - HIPAA data, need budget numbers for R01 due Friday
**Time Available:** 10 minutes (between clinic and department meeting)

---

## Initial Reaction

Okay. Deep breath. I need computing costs for this grant and I have exactly 10 minutes before I have to run to another meeting. Let me see if this actually helps.

**User Guide scan (2 minutes):**
- Says "5-10 minutes to complete" - we'll see about that
- Three things: pick services, get costs, generate DMP text
- Progress saved automatically - THANK GOD because I will definitely get interrupted

---

## Quick Scan of Services

**What I'm looking for:**
- Something HIPAA-compliant for my patient fMRI data
- Storage for ~6TB of imaging data
- Compute for analysis (currently we use... whatever Mika set up, I honestly don't know)

**Services that caught my eye:**
1. **"Clinical/IRB Data Analysis" bundle** - YES. This is what I need. Just tell me what to use.
2. Research Storage - $5/TB/month, first 500GB free
3. HPC Cluster - pricing is in "Service Units"... what's a service unit?
4. Azure Compute - listed as "HIPAA-compliant" in the bundle description

**Immediate questions:**
- Is the HPC cluster HIPAA-compliant? The bundle says "Azure compute" for clinical data
- What's the actual difference between HPC and cloud? Cost? Compliance?
- Do I need BOTH storage AND compute or does compute include storage?

---

## The "Clinical/IRB Data Analysis" Bundle

This is the one I'd click. It says:
- Azure compute ($2000/month default)
- Research storage (10TB default)
- "HIPAA-compliant Azure compute environment"

**My concerns:**
1. **$2000/month seems HIGH** - is that realistic? My current grant budget has $500/month for computing
2. **10TB default** - I need 6TB active + 6TB archive. Is that 6TB total or do I need more?
3. **What about the analysis software?** Do I need to budget for MATLAB licenses? SPM? FSL?
4. **Archive storage** - the guide mentions "archive ratio slider" but what does that mean for HIPAA data? Can I even delete PHI?

---

## Things That Would Help Right Now

**What I desperately need:**
1. **Clear HIPAA guidance** - "High tier" is mentioned in the guide but I need to know: what does this actually require? Do I need to do something special? Talk to someone?
2. **Realistic examples** - "A clinical fMRI study typically needs X TB and Y compute hours"
3. **Plain language** - "Service Units" means nothing to me. Just tell me what it costs.
4. **Archive requirements** - My IRB requires 7-year retention. What does that cost?

**What would make me trust this:**
- A note saying "This meets HIPAA requirements" explicitly
- Contact info for someone who can confirm I'm doing this right
- Example budgets from similar projects

---

## Specific Confusion Points

### Service Units vs. Dollars
The HPC cluster costs are in "SU" (Service Units). The guide says "1 SU = 1 CPU-core-hour" but that still doesn't tell me what my fMRI analysis will cost. I don't think in CPU-core-hours. I think in "I have 60 patients and each scan takes 4 hours to process."

### Cloud vs. HPC for HIPAA
The bundle uses Azure compute, but I see HPC cluster is also available. Is HPC compliant for High tier data? The services list doesn't clearly say "HIPAA: Yes/No" for each service.

### Storage Confusion
- Research Storage: $5/TB/month
- Cold Archive: $0.50/TB/month
- OneDrive: First 1TB free, then $40/TB/month

For 6TB active + 6TB archive over 4 years, what's the actual cost? Do I pick Research Storage and it automatically archives? Or do I pick two separate services?

---

## What Would Make This Actually Usable

**Critical needs:**
1. **HIPAA badge/indicator** - Show me clearly which services are HIPAA-compliant at a glance
2. **Project templates** - "Clinical fMRI study (60 subjects)" → here's typical costs
3. **Single total number** - Just tell me the yearly cost in dollars. I'll figure out the rest.
4. **IRB retention helper** - "Your IRB requires 7-year retention" → automatic archive calculation

**Nice to have:**
- Link to "talk to someone" prominently - because I will need to
- Comparison to current costs (if they're tracked)
- Warning if my estimates seem way off

---

## Bottom Line (Would I Use This?)

**Honest answer:** Maybe, but I'm nervous.

**Why I'd try it:**
- The "Clinical/IRB Data Analysis" bundle is EXACTLY what I need conceptually
- 10 minutes is doable if it actually works
- Having actual numbers would be huge for my grant

**Why I'm hesitant:**
- Too many things I don't understand (service units, archive ratios, cloud vs HPC)
- No clear "this is HIPAA-compliant" confirmation
- Worried I'll put in wrong numbers and waste the grant reviewer's time
- Need to know: does someone review this before I submit? Can I talk to a human?

**What would get me to actually use it:**
1. Big clear banner: "This tool generates HIPAA-compliant infrastructure plans"
2. Phone number or email: "Questions? Email computing@northwinds.edu"
3. One example walkthrough for a clinical imaging study
4. Assurance that I can save and come back (because I definitely will get interrupted)

---

## Time Check

This review took me 12 minutes. Which means the actual wizard will take longer than 10 minutes if I have questions.

**Reality check:** I'll probably start this, get pulled into clinic, come back to it 3 days later, forget what I was doing, and email the RC team directly like I always do.

**To make me actually complete it:**
- Save my progress (it says it does)
- Let me export partial results (so I can at least get *something* in my budget)
- Make the HIPAA stuff crystal clear (so I don't abandon out of fear)

---

**Status:** Cautiously optimistic but would definitely call the help line first.
