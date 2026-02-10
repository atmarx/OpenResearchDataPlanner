# First Impressions: Dr. Omar Belvins

**Persona:** Associate Professor, Psychology
**Specialty:** Quantitative methods, large-scale surveys
**Tech Level:** Low
**Date:** 2026-02-05

---

## Initial Reaction

I opened this tool because our grants office sent out an email saying it would help with data management plans. Honestly, I was skeptical. Most "data tools" assume I want to learn how to use a supercomputer, which I don't. I'm a statistician. I run surveys. I analyze data in R. That's it.

But I have to admit - this tool is different. It didn't immediately throw jargon at me.

---

## What I Liked Right Away

### 1. The security tier page made sense
When I clicked through to read about the "High" tier, it actually explained things in plain language. "FERPA-covered student educational records" - yes, that's exactly what I have for my longitudinal student outcomes study. I didn't have to decipher legal language or guess whether I was doing it right.

### 2. Storage bundles exist
I saw "Storage Only" in the bundles list and thought "finally, someone gets it." Not everyone needs to run massive simulations. Sometimes you just need a safe place to put files.

### 3. The user guide is readable
I skimmed the user guide before starting, and it didn't make my eyes glaze over. Short sections. Clear headings. No assumptions that I know what "SLURM" or "nodes" are.

---

## What Made Me Hesitate

### 1. I still don't understand HPC
The tool mentioned "HPC Cluster (SLURM)" as an option. I know IT has told me to "use the cluster" before, but I still don't get what that means for me. Does it run R? Will it make my analyses faster? I need someone to tell me in normal words: "Omar, this will make your 6-hour regression run in 20 minutes."

### 2. Compute vs. storage confusion
I know I need storage. Do I also need "compute"? My R analyses take forever on my laptop, but I don't know if that's what "compute" means. The distinction between running analyses and storing files isn't super clear to me.

### 3. So many options
When I clicked on "Browse Services," there were a lot of options. I appreciate having choices, but I felt a little overwhelmed. Which one is actually for me? I'm not doing genomics. I'm not training ML models. I'm running regressions on survey data.

---

## The "Aha" Moments

### VDI caught my eye
I noticed something called "Research VDI - Gold" in the services list. The description said "statistical analysis" and "8 vCPU, 32GB RAM." I don't know what vCPU means, but 32GB of RAM sounds like a lot more than my laptop has. Could this be the thing that makes my analyses faster? I wish the tool had explicitly said "if your R code takes hours, this might help."

### OneDrive is in here
I saw OneDrive in the services list, and there's even a warning about its limitations. I've been storing everything on OneDrive because it's easy. The warning said it's expensive beyond 1TB and "not recommended as primary storage for grant-funded research data." Okay, so what SHOULD I use? I hope the tool guides me toward the right answer.

---

## Questions I Still Have

1. **If I'm running big surveys with demographic data, what do I actually need?**
   Storage, yes. But what else? Do I need compute? How do I know?

2. **Will this tool tell me how to make my R code run faster?**
   I don't want to learn HPC. I want my analyses to finish before lunch.

3. **What about my FERPA data?**
   The High tier explanation was good, but I need to know: which specific services are okay for student records? Can I use the VDI? Can I use research storage?

4. **What's the difference between Research Storage and NWFiles?**
   Both say "storage." One is $5/TB, one is $3/TB. Why would I pick the more expensive one?

---

## Overall Impression

**I'm cautiously optimistic.**

This tool doesn't talk down to me, and it doesn't assume I'm a computer scientist. That's huge. But I still feel like I'm missing the bridge between "I have survey data and slow analyses" and "here's what you should select in this tool."

If someone could show me a walkthrough for a quantitative researcher - storage for data, something to make R faster, and assurance that my FERPA data is handled correctly - I'd feel a lot more confident.

---

## Would I recommend this to colleagues?

**Yes, with caveats.**

I'd tell other psychology faculty to try it, especially if they have data management plan requirements for their grants. But I'd also warn them: you might need to ask the research computing folks some questions afterward to make sure you picked the right things.

I'd love to see a "Quantitative Social Science" bundle that pre-selects reasonable defaults for people like me. Something like:
- Research storage for survey data
- A VDI or compute option that runs R faster
- Guidance on FERPA compliance

That would be a home run.
