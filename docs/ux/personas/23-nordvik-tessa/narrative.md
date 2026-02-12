# Dr. Tessa Nordvik

> *"A traditional CFD simulation takes 3 weeks. My neural surrogate does it in 30 seconds with the same accuracy. But I need GPUs to train it, and everyone keeps asking why an engineer needs 'AI hardware.'"*

## At a Glance

| | |
|---|---|
| **Department** | Aerospace Engineering |
| **Specialty** | Physics-Informed Neural Networks, Digital Twins |
| **Tech Level** | High |
| **Lab Size** | 9 members |
| **Archetype** | AI-Engineering Hybrid |

## Background

Tessa Nordvik is part of a new generation of engineers who blur the line between traditional simulation and machine learning. Her PhD was in computational fluid dynamics; her postdoc was in deep learning. Now she combines both: physics-informed neural networks (PINNs) that learn the underlying physics while being constrained by fundamental laws.

Her work has real impact. Traditional CFD simulations for aircraft design take weeks. Her neural surrogates achieve similar accuracy in seconds, enabling real-time optimization and digital twins. Industry partners like GE and Boeing are very interested.

The challenge is that her work doesn't fit neatly into traditional categories. HPC administrators see "neural network" and point her to the GPU cluster. ML researchers see "Navier-Stokes equations" and get confused. She needs both: massive parallelism for physics AND GPU acceleration for gradients.

## A Day in Their Life

**7:00 AM** — Checks overnight training run. The PINN is learning the turbulence statistics, but boundary conditions are still off. Adjusts physics loss weighting.

**9:00 AM** — Graduate fluids class. Derives the incompressible Navier-Stokes equations on the board. A student asks if ChatGPT can solve these. Tessa laughs.

**11:00 AM** — Meeting with GE Aviation. They're excited about the digital twin prototype but worried about IP protection. Tessa explains the tier system.

**1:00 PM** — Lab meeting. Students present results. Postdoc Dr. Huang shows new architecture for learning conservation laws. PhD student Kai reports the 4-GPU workstation ran out of memory again.

**3:00 PM** — Debugging CUDA code. Custom kernel for the physics-informed loss function has a race condition. This is what happens when you need both ML frameworks AND custom physics.

**5:00 PM** — Grant proposal for NASA. Trying to explain why autonomous flight control needs "machine learning infrastructure." It's not autonomous cars — it's aerospace, with different safety requirements.

**7:00 PM** — Deadline crunch. Paper due next week, need more training runs. The under-desk workstation is maxed out. Considers asking IT about cloud burst.

## Current Workarounds

- **Under-desk GPU workstation**: 4x A6000 GPUs that "don't officially exist." Bought with equipment funds.
- **Custom CUDA kernels**: Physics-informed loss functions don't exist in PyTorch. Had to write them.
- **Cloud for deadlines**: Personal AWS account for conference crunches. Not sustainable.
- **Hybrid scheduling**: Some jobs on HPC cluster (physics), some on local GPUs (ML), manual coordination.

## Their Projects

### Project 1: Physics-Informed Neural Networks for Turbulence (L1 Low)
Developing PINNs that can predict turbulent flow behavior while respecting conservation laws. Open research, benchmarking against classical methods.

**Why Low tier:** Explicitly open research. Publishing methods and releasing benchmark data.

### Project 2: Real-time Digital Twin for Aircraft Engines (L2 Medium)
Industry partnership with GE Aviation. Building neural surrogates of engine components for real-time monitoring and predictive maintenance.

**Why Medium tier:** Proprietary engine data under strict NDA. GE's IP concerns are serious.

### Project 3: ML-based Flight Control for Autonomous Vehicles (L3 High)
NASA SBIR subcontract developing ML-based flight control systems. Some data classified as CUI (Controlled Unclassified Information).

**Why High tier:** NASA contract with CUI data. Export control considerations for autonomous flight.

### Project 4: CFD Surrogate Models Benchmark (L1 Low)
Community benchmark suite for comparing neural surrogate models against traditional CFD.

**Why Low tier:** Explicitly public. Reproducibility and comparison are the whole point.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| Postdoc | Dr. Lin Huang | Physics-informed learning theory |
| Postdoc | Dr. James Morrison | Traditional CFD, validation expert |
| PhD | Kai Tanaka | Lab GPU wizard, built custom infrastructure |
| PhD | Sarah Ahmed | Digital twin architectures |
| PhD | Alex Rivera | Autonomous systems, NASA project lead |
| PhD | Maria Santos | Turbulence modeling |
| Masters | Tyler Chen | CFD benchmark implementation |
| Masters | Jordan Park | Model compression for edge deployment |
| Undergrad | Emily Watson | Summer research, data pipeline |

**Tech person:** Kai Tanaka is the unofficial lab sysadmin. Built the under-desk GPU cluster, writes CUDA kernels, manages experiment tracking.

## Using OpenResearchDataPlanner

### What would make her happy?
- **Understanding hybrid workloads**: Physics + ML, not just one or the other.
- **High-memory GPU options**: PINNs need massive batch sizes for stability.
- **Cloud burst capability**: Conference deadlines are real. Need to scale up temporarily.
- **Clear tier guidance**: She has projects at L1, L2, and L3. Help her navigate.
- **Respect for engineering AI**: This isn't "CS playing with toys" — it's real aerospace research.

### What would frustrate her?
- **ML vs HPC false dichotomy**: She needs both. Don't make her choose.
- **Small GPU memory assumptions**: 16GB GPUs aren't enough. Show the big options.
- **No burst capability**: "Fill out a form and wait 3 months" doesn't work for deadlines.
- **CUI confusion**: Her NASA project is L3. Make the requirements clear, don't make her guess.

### Key test scenarios
- **Multi-tier lab**: Projects at L1, L2, and L3 simultaneously. Different handling for each.
- **High GPU memory**: Needs 80GB A100s, not consumer GPUs.
- **Industry + federal**: Both corporate NDA and NASA CUI in the same lab.
- **Burst compute**: Can she request temporary cloud access for a deadline?

## Quotes

> *"Everyone thinks aerospace is aluminum and rivets. My lab is PyTorch and CUDA."*

> *"The tool actually understands that I need BOTH physics simulation AND neural network training. Most people look confused when I explain this."*

> *"L3 High tier for the NASA project? Perfect. Now I can stop guessing what 'CUI handling' means."*

> *"Wait, there's a burst compute option for conference deadlines? This would have saved me $3,000 last month."*
