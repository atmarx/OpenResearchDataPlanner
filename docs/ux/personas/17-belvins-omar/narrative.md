# Dr. Omar Belvins

> *"I'm a statistician. I know R inside and out. But every time someone says 'cluster,' I zone out."*

## At a Glance

| | |
|---|---|
| **Department** | Psychology |
| **Specialty** | Quantitative methods, large-scale surveys |
| **Tech Level** | Low-Medium |
| **Lab Size** | 4 students |
| **Archetype** | Stats Specialist |

## Background

Omar Belvins is one of the best quantitative psychologists in the department. His methodological expertise is respected across the social sciences. He runs surveys with 50,000+ respondents and conducts complex statistical analyses that inform education policy.

The problem is: he runs everything on his laptop, in R, and analyses that should take minutes take hours. He knows there's something called "the cluster" that could help, but every time he asks, people start talking about "SLURM jobs" and "module loads" and his eyes glaze over.

He also has FERPA-covered student data from his longitudinal education studies. He takes this seriously but isn't sure he's handling it correctly. The security requirements feel like they were written by lawyers, not humans.

## A Day in Their Life

**8:30 AM** — Starts a regression analysis in R. Goes to get coffee while it runs.

**9:30 AM** — Analysis still running. Checks email. Student wants to know about data access.

**10:30 AM** — Analysis finished. Results look good. Starts the next one.

**11:30 AM** — Next analysis still running. Goes to lunch.

**1:00 PM** — Teaching. Research methods seminar. A student asks about "big data." Omar redirects to statistical principles.

**3:00 PM** — Afternoon analysis. Another hour of waiting.

**4:30 PM** — Tries to understand a document about "HPC resources." Gives up after page 2.

**5:30 PM** — Goes home. Leaves analysis running overnight.

## Current Workarounds

- **Laptop computing**: Everything runs locally. Slowly.
- **Qualtrics for surveys**: At least that part is managed.
- **OneDrive storage**: Files live on university cloud. He hopes that's secure enough.

## Their Projects

### Project 1: Large-Scale Survey Study (L2 Medium)
Survey of 50,000 respondents about educational experiences. Contains demographic data.

**Why Medium tier:** Demographic data requires reasonable protection, though not regulated.

### Project 2: Longitudinal Student Outcomes Study (L3 High) — Storage Only
Following student educational outcomes over time. FERPA applies.

**Why High tier:** FERPA-covered student educational records.

### Project 3: Meta-Analysis Archive (L1 Low) — Storage Only
Archive of effect sizes from published literature.

**Why Low tier:** All published data, no sensitivity.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| PhD | Maria Gonzalez | Quantitative methods |
| PhD | James Thompson | Education policy |
| Masters | Priya Sharma | Thesis on survey methodology |
| Undergrad | Alex Kim | Summer research assistant |

**Tech person:** Nobody. Omar handles R. Anything beyond R is a mystery.

## Using OpenResearchDataPlanner

### What would make him happy?
- **Plain language about compute**: Explain why HPC might help him, without jargon.
- **FERPA clarity**: Simple explanation of what High tier means for student data.
- **Minimal compute focus**: His main needs are storage and basic analysis, not massive simulations.
- **"Is this right?" validation**: Confirmation that he's handling things correctly.

### What would frustrate him?
- **Compute-heavy assumptions**: His survey data doesn't need 100,000 core-hours.
- **Jargon overload**: "Submit a job to the queue" — what queue?
- **Overcomplicating storage**: He just needs a place to put files safely.
- **Assuming he wants to learn HPC**: He doesn't. He wants his analyses to be faster.

### Key test scenarios
- **Low compute needs**: Does the tool handle modest compute requirements gracefully?
- **FERPA explanation**: Does he understand what High tier means for his student data?
- **Minimal jargon**: Can he complete the wizard without learning new vocabulary?
- **Speed optimization framing**: Does the tool help him understand that HPC = faster R?

## Quotes

> *"I don't need a petabyte of storage. I need a safe place for my FERPA data and something that makes my R code run faster."*

> *"Wait, I can run R on the cluster? And it will be faster? Why didn't anyone tell me this in normal words?"*

> *"The High tier explanation actually makes sense. This is for student records, these are the requirements, done."*
