# Dr. Andras Volgin

> *"My agent-based model runs for 72 hours on my desktop. I know this is wrong. I just don't know what right looks like."*

## At a Glance

| | |
|---|---|
| **Department** | Economics |
| **Specialty** | Agent-based modeling, policy analysis |
| **Tech Level** | Medium |
| **Lab Size** | 5 students |
| **Archetype** | Excel Escapee |

## Background

Andras Volgin is a policy economist whose models inform real decisions. His agent-based simulations predict how markets respond to regulatory changes. The Federal Reserve has cited his work. He's genuinely impactful.

The problem is: his code runs forever. His Stata scripts take 72 hours on his desktop. His Excel macros crash with large datasets. He knows there's a better way — everyone keeps mentioning "the cluster" and "parallel computing" — but he's been using Stata for 20 years and doesn't have time to become a programmer.

One of his PhD students "knows Python" and has started helping. But Andras suspects he's just scratching the surface of what's possible.

## A Day in Their Life

**7:00 AM** — Checks if the overnight Stata job finished. It didn't. Still running.

**9:00 AM** — Policy meeting. Federal Reserve collaborators want updated projections. Andras explains the computational bottleneck.

**11:00 AM** — Teaching. Graduate econometrics. Students ask about computational methods. Andras points them to Li, the student who knows Python.

**1:00 PM** — Research time. Reviews results from three days ago. Adjusts parameters. Starts another 72-hour job.

**3:00 PM** — Meets with Li about parallelizing the code. Understands conceptually but not practically.

**5:00 PM** — Goes home. The simulation keeps running.

## Current Workarounds

- **Patience**: Waiting 72 hours for results is his primary strategy.
- **Li's help**: PhD student who knows Python and is slowly modernizing the code.
- **Smaller experiments**: Running simplified versions to iterate faster.

## Their Projects

### Project 1: Agent-Based Market Simulation (L2 Medium)
Large-scale agent-based models of market dynamics.

**Why Medium tier:** Proprietary economic models that inform policy.

### Project 2: Fed Reserve Collaboration (L2 Medium)
Joint research with Federal Reserve economists.

**Why Medium tier:** Pre-publication data with market-sensitive timing.

### Project 3: Public Policy Impact Dataset (L1 Low) — Storage Only
Collection of government policy data for research.

**Why Low tier:** Public government records, no sensitivity.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| PhD | Li Chen | "Knows Python," everyone's lifeline |
| PhD | Maria Santos | Labor economics |
| PhD | James O'Brien | Macro policy |
| Masters | Tyler Brooks | Thesis on market simulation |
| Undergrad | Priya Sharma | Data collection |

**Tech person:** Li Chen, by default. Everyone asks Li when code breaks.

## Using OpenResearchDataPlanner

### What would make him happy?
- **Performance framing**: "Your 72-hour job could take 2 hours" — that's motivating.
- **Stata/economics awareness**: Recognition that economists have specific tools and workflows.
- **Gradual transition**: He doesn't want to rewrite everything. Can he run existing code faster?
- **Cost-benefit clarity**: Is the time savings worth the complexity?

### What would frustrate him?
- **Programmer assumptions**: "Write a SLURM batch script" — he doesn't write scripts.
- **Ignoring existing tools**: He uses Stata. Can Stata run on the cluster or not?
- **Overselling**: If HPC won't actually help his workflow, don't pretend it will.
- **No economics context**: His models have specific characteristics. Generic advice doesn't help.

### Key test scenarios
- **Performance focus**: Does the tool frame HPC as "faster results"?
- **Existing workflow support**: Can he run Stata on the cluster?
- **Transition guidance**: Is there help for moving from desktop to cluster?
- **Realistic expectations**: Does the tool set accurate expectations about speedup?

## Quotes

> *"I've been running Stata on my desktop for 20 years. Can the cluster actually run Stata or do I have to learn something new?"*

> *"Wait, I can run the same code on the cluster and it will be 10x faster? Why didn't anyone explain it that way before?"*

> *"The cost is... actually reasonable for what I'd save in time. I spend more on coffee while waiting for results."*
