# Dr. Yev Transom

> *"I need 100,000 GPU-hours this month. I'll take scavenger when I can, but I need guaranteed capacity for the deadline. What are my options?"*

## At a Glance

| | |
|---|---|
| **Department** | Computer Science |
| **Specialty** | Machine Learning, LLMs, GPU clusters |
| **Tech Level** | Very High |
| **Lab Size** | 8 students |
| **Archetype** | Cluster Breaker |

## Background

Yev Transom is the reason the cluster sometimes goes down. Not maliciously — he's just pushing the limits of what the infrastructure can do. His research on large language models requires massive GPU resources, and he's constantly negotiating with the scheduler, other researchers, and sometimes the laws of physics.

Yev knows more about Kubernetes than most IT staff. He's debugged job schedulers, optimized container deployments, and written custom tooling to maximize his use of the scavenger queue. When the preemptible jobs are running, his lab is burning through compute. When they're not, he's paying out of pocket for AWS.

He joined Northwinds five years ago and immediately started advocating for better GPU infrastructure. Some improvements have been made, but demand always outpaces supply.

## A Day in Their Life

**6:00 AM** — Checks overnight training run. Model collapsed at hour 4. Again. Reviews logs to diagnose.

**8:00 AM** — Lab meeting. Students present results. Yev critiques hyperparameter choices with surgical precision.

**10:00 AM** — Submits a large training job. All scavenger queue. Hopes it doesn't get preempted before convergence.

**12:00 PM** — Job got preempted. Yev curses, implements checkpointing improvements.

**2:00 PM** — Industry call. They want the recommendation model by Friday. Yev looks at the queue. Does math. Considers AWS.

**4:00 PM** — Rewrites job scheduler logic to better handle preemption.

**7:00 PM** — Pays for 8 hours of AWS P4d instances out of his discretionary budget. Grant deadline is firm.

## Current Workarounds

- **Scavenger queue optimization**: Custom scripts to maximize preemptible compute usage and handle preemption gracefully.
- **Personal AWS account**: When deadlines are non-negotiable, Yev pays out of pocket.
- **Checkpoint everything**: Every training run saves state every 30 minutes because preemption is inevitable.

## Their Projects

### Project 1: Large Language Model Training (L2 Medium)
Training custom LLMs on proprietary data. Massive compute requirements, proprietary model weights.

**Why Medium tier:** Proprietary training data and model weights. Not regulated, but definitely IP-sensitive.

### Project 2: Industry Partnership: Recommendation Systems (L2 Medium)
Building recommendation systems for an industry partner. Corporate data under NDA.

**Why Medium tier:** Industry NDA. Corporate data cannot be shared.

### Project 3: Open Benchmark Leaderboard (L1 Low)
Public benchmarks for the ML community to evaluate model performance.

**Why Low tier:** Explicitly public. The whole point is reproducibility and comparison.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| Postdoc | Dr. Amir Rostami | LLM architecture specialist |
| Postdoc | Dr. Yuki Nakamura | Optimization and efficiency |
| PhD | Sarah Chen | LLM training lead |
| PhD | Marcus Williams | Recommendation systems |
| PhD | Priya Patel | Benchmark infrastructure |
| PhD | Alex Kim | New student, learning the ropes |
| Masters | Jordan Lee | Thesis on efficient fine-tuning |
| Undergrad | Tyler Morrison | Summer research |

**Tech person:** Everyone. This is a systems-adjacent ML lab. They can all debug Kubernetes, write CUDA, and optimize job schedulers.

## Using OpenResearchDataPlanner

### What would make him happy?
- **GPU-aware pricing**: Clear breakdown of GPU vs CPU costs and availability.
- **Scavenger/preemptible options**: Understanding the cost tradeoffs between guaranteed and preemptible.
- **Burst capacity planning**: A way to plan for occasional high-priority jobs.
- **Large scale support**: 100,000 GPU-hours shouldn't break the calculator.

### What would frustrate him?
- **CPU-centric**: If the tool doesn't understand GPUs, it's useless.
- **No preemptible options**: Scavenger queue is his bread and butter.
- **Small-scale assumptions**: "10,000 SU/month" as the maximum option? Please.
- **Hiding cost tradeoffs**: He wants to see the numbers to make intelligent decisions.

### Key test scenarios
- **Large scale**: Does 100,000 GPU-hours calculate correctly?
- **Cost tradeoffs**: Can he see the difference between scavenger and guaranteed?
- **Burst planning**: How does the tool handle occasional high-priority needs?
- **Power user speed**: Can he blast through the wizard in 3 minutes?

## Quotes

> *"I don't need hand-holding. I need numbers. How much does 100K GPU-hours cost on scavenger vs guaranteed?"*

> *"Oh, there's a subsidy for preemptible compute? Why didn't anyone tell me this before?"*

> *"The cost breakdown actually shows GPU and CPU separately. Finally, a tool that understands what I'm doing."*
