# Dr. Tessa Nordvik — AI Applets Spec Review

**Persona:** Associate Professor, Aerospace Engineering (Physics-Informed Neural Networks)
**Document Reviewed:** AI-GUIDANCE-APPLETS.md (12 applet specification)

---

# Dr. Tessa Nordvik's Review of AI Guidance Applets Specification

Look, I appreciate what Northwinds is trying to do here. Researchers need guidance on AI, and the current situation is a mess of conflicting advice and vague policies. But reading through this spec, I have concerns about a fundamental blind spot: this document assumes "AI" means "large language models for text generation." That is one small corner of how AI is actually used in research.

## What is Good About This Spec

The **Data Check** applet is solid. Starting with data sensitivity is exactly right. My NASA project deals with CUI data, and I need to know immediately whether a tool is appropriate before I waste time exploring it. The sensitivity levels map reasonably well to our security tiers, which is helpful.

The **Verification Gate** concept is excellent. "If you cannot verify it, you cannot use it" is the correct framing. In engineering, we call this validation and verification, and it is non-negotiable. The idea that verification is a hard gate rather than a soft recommendation is something I wish more people understood.

**Tool Picker** correctly identifies the spectrum from consumer cloud to local models. This matters enormously. When I am working on the GE digital twin project, I cannot send proprietary engine data through ChatGPT. Having clear categories with data policy implications is genuinely useful.

## What is Wrong or Missing

Here is my core criticism: **you have a Bias Assessment applet but no Scientific Validity applet.** Bias matters, but in computational science, the bigger risk is that AI produces physically impossible or mathematically incorrect results that look plausible. My physics-informed neural networks are specifically designed to prevent this, but most researchers using AI for scientific computing do not have those safeguards.

Example: A student in my department used a language model to help with a heat transfer calculation. The output looked reasonable, had correct units, used appropriate terminology. It also violated the second law of thermodynamics. The AI was confident and wrong in a way that required domain expertise to catch. Your Pitfall Checklist mentions "plausible-sounding but wrong analysis" for data analysis, but this barely scratches the surface for computational work.

**The Compute Estimator applet is inadequate for serious AI research.** The categories jump from "local inference (small)" requiring 16-24GB GPU memory to "fine-tuning (large)" requiring 80GB+ per GPU. What about the hybrid workloads in between? My physics-informed neural network training does not fit cleanly into these boxes. I need:

- High-memory GPUs (80GB A100s) for batch sizes that maintain numerical stability
- Traditional HPC compute for physics validation runs
- Custom CUDA kernels for physics-informed loss functions
- The ability to burst to cloud for conference deadlines

None of this is captured. The applet assumes you are either using an API or fine-tuning a language model. It completely ignores scientific machine learning, computer vision for experimental data, reinforcement learning for control systems, and dozens of other legitimate research AI applications.

## Specific Edits and Additions

### Add Applet: Scientific Computing AI Assessment

This should address:
- Physics/mathematical constraints: Does your AI-generated solution respect conservation laws, boundary conditions, dimensional analysis?
- Numerical stability: Have you tested edge cases, extreme parameter ranges, out-of-distribution inputs?
- Reproducibility: Can you regenerate results with fixed random seeds? Have you documented your training/inference pipeline?
- Comparison to known solutions: Have you validated against analytical solutions, experimental data, or established numerical methods?

### Expand Task Fit for Computational Research

The current categories are too text-focused. Add:

| Task Type | AI Fit | Notes |
|-----------|--------|-------|
| Surrogate modeling | Good | When properly validated against physics |
| Experimental data processing | Good | Image analysis, signal processing |
| Simulation acceleration | Good-Moderate | Requires extensive validation |
| Scientific discovery | Caution | High false positive risk |
| Control systems | Caution | Safety-critical applications |
| Numerical solver replacement | Poor | Unless physics-constrained |

### Expand Tool Picker for Scientific AI

Add categories for:
- **Domain-specific frameworks**: JAX, PyTorch Geometric, DeepXDE (for PINNs)
- **Scientific computing platforms**: NVIDIA Modulus, SimNet
- **Hybrid HPC+AI infrastructure**: What Northwinds actually offers (or should offer)

The current Tool Picker only addresses data sensitivity for LLM use. It does not help me choose between running my neural surrogate training on the campus GPU cluster versus bursting to AWS, or whether to use PyTorch or JAX for my physics-informed loss functions.

### Add Discipline Branching

Applet 3 (Task Fit) and Applet 6 (Pitfall Checklist) should absolutely branch by discipline. The pitfalls for a sociologist using AI to analyze interview transcripts are completely different from my pitfalls when training a neural surrogate model. Generic checklists will either be too vague to be useful or will not apply to half your audience.

At minimum, branch for:
- Text/humanities applications (current focus)
- Computational/quantitative sciences
- Life sciences and clinical applications
- Engineering and design

## Concerns About Computational and Scientific AI Use

This spec reads like it was written by people who think "AI in research" means "ChatGPT for writing papers." That is a legitimate use case, but it is not the only one, and frankly it is not where the hard problems are.

In my lab, AI is the research subject. We are not using LLMs to write grant proposals; we are developing neural network architectures that can learn physical laws. The governance questions are different:

- How do I document that my trained model respects conservation of mass?
- What verification is appropriate before deploying a neural surrogate in a safety-critical digital twin?
- How do I handle IP concerns when my model architecture (not just data) is proprietary?

The Verification Gate says "Read every line; test with edge cases" for code. But a trained neural network is not code you can read. Verification requires a different approach: test suites, sensitivity analysis, comparison to ground truth, uncertainty quantification. None of this is mentioned.

## Summary

This spec is a good start for text-based AI guidance but is incomplete for research universities with significant computational science activities. You need at least one applet specifically addressing scientific and computational AI use, and several existing applets need discipline-specific branches.

The sequencing is logical. The tone is fine, neither preachy nor dismissive. But the coverage gap is significant enough that computational researchers like me will find maybe half of this relevant to our actual work. That is a missed opportunity, because we arguably face harder verification challenges than someone using ChatGPT to brainstorm, and we have fewer guardrails.
