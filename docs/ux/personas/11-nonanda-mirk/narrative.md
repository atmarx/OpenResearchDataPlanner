# Dr. Mirk Nonanda

> *"I don't want a 'managed service.' I want to know what the service is doing and have the ability to change it."*

## At a Glance

| | |
|---|---|
| **Department** | Computer Science |
| **Specialty** | Operating Systems, compilers |
| **Tech Level** | Very High |
| **Lab Size** | 6 students |
| **Archetype** | Pipeline Builder |

## Background

Mirk Nonanda is a systems legend. He's been at Northwinds for 16 years, teaching operating systems and building infrastructure that other people depend on without knowing it. His philosophy is simple: understand the machine. If you can't explain what the kernel is doing, you shouldn't be writing code that runs on it.

He runs his own build servers, maintains his own CI pipelines, and has root access on several department machines "for research purposes." When the IT-managed Jenkins server goes down, people quietly ask Mirk if they can use his setup instead.

His students leave the lab knowing how to compile kernels, debug scheduler issues, and reason about memory allocation. Many of them end up at companies like Apple, Google, and Amazon, working on operating systems and compilers.

## A Day in Their Life

**7:00 AM** — Mirk checks his build farm. 847 kernel variants compiled overnight. Three failed due to configuration issues.

**9:00 AM** — Teaching CS 450, Operating Systems. Today: process scheduling. Students implement their own scheduler in a sandbox kernel.

**11:00 AM** — Research meeting. Reviews a student's compiler optimization. The code is clever but doesn't account for cache behavior.

**1:00 PM** — Debugging session. A grad student's kernel modification causes sporadic panics. Mirk walks through the code line by line.

**3:00 PM** — Infrastructure maintenance. Updates his CI server, patches a security issue, reviews build logs.

**5:00 PM** — Code review. New kernel patch for the open source project. Mirk reads every line before approving.

## Current Workarounds

- **Personal build farm**: Several machines under his desk running continuous integration.
- **Root everywhere**: Mirk has sudo access to systems he probably shouldn't, but nobody complains because he fixes things.
- **Teaching infrastructure**: He maintains the CS 450 VM infrastructure himself because IT can't handle the unusual requirements.

## Their Projects

### Project 1: Custom Kernel Development Pipeline (L1 Low)
Open source kernel research. All code is public, all results are published.

**Why Low tier:** Open source project. Everything is meant to be public.

### Project 2: Compiler Optimization Research (L2 Medium)
Pre-publication research on novel compiler optimizations. Competitive field.

**Why Medium tier:** Pre-publication in a competitive field. Scooping is a real concern.

### Project 3: OS Course Infrastructure (CS 450) (L1 Low)
Teaching infrastructure for the operating systems course. Student VMs, kernel sandboxes.

**Why Low tier:** Teaching infrastructure. No sensitive data, no IP concerns.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| Postdoc | Dr. Alicia Reyes | Compiler optimization lead |
| PhD | Kevin Tran | Kernel scheduling research |
| PhD | Maya Johansson | Memory management |
| PhD | Dmitri Volkov | New student, compiler focus |
| Masters | Ryan O'Connor | Thesis on JIT compilation |
| Undergrad | Emma Zhang | Summer research on profiling |

**Tech person:** Mirk himself, and honestly every student in the lab. You don't survive a semester without learning systems.

## Using OpenResearchDataPlanner

### What would make him happy?
- **Transparency**: Being able to see how costs are calculated, not just the final number.
- **Infrastructure details**: What's actually running underneath? What OS? What filesystem?
- **Minimal abstraction**: Don't hide things from him that he might want to know.
- **Developer-friendly output**: Something he can integrate into his existing workflows.

### What would frustrate him?
- **Black boxes**: "We'll handle the details" — no, he wants to see the details.
- **GUI-only**: If there's no API or CLI option, he's disappointed.
- **Over-simplification**: Hiding options "to make it easier" means hiding things he might want.
- **Assuming incompetence**: "Don't worry about that technical detail" — he does worry, and for good reason.

### Key test scenarios
- **Transparency test**: Can he understand HOW the costs were calculated?
- **Technical accuracy**: Are the service descriptions technically correct?
- **Power user features**: Export to JSON? API access? CLI?
- **Respecting expertise**: Does the tool let him skip explanations he doesn't need?

## Quotes

> *"I appreciate that it's trying to help, but I already know what SLURM is. Can I skip that explanation?"*

> *"Wait, I can export the session as JSON? That's actually useful for automating my grant proposals."*

> *"The cost calculation is transparent. I can verify it myself. That's... refreshingly honest."*
