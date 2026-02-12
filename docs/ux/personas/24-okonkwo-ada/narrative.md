# Dr. Ada Okonkwo

> *"My model achieves state-of-the-art accuracy on the public benchmark. But deploying it in a hospital? That's another 18 months of FDA documentation, clinical validation, and bias auditing."*

## At a Glance

| | |
|---|---|
| **Department** | Medical Informatics |
| **Specialty** | Clinical ML, Medical Imaging AI, Federated Learning |
| **Tech Level** | High |
| **Lab Size** | 8 members |
| **Archetype** | AI in Regulated Environment |

## Background

Ada Okonkwo has published in both NeurIPS and JAMA. That rare combination — deep technical ML expertise and genuine clinical credibility — is why hospitals want to partner with her. Before academia, she spent four years at a medical AI startup that actually got FDA clearance. She knows what it takes.

Most ML researchers think healthcare AI is about algorithms. Ada knows it's about compliance, de-identification, validation, and deployment. Her students learn PyTorch AND HIPAA. They can train a transformer AND explain the statistical rigor required for a 510(k) submission. This makes them unusually employable.

Her biggest challenge is managing data at multiple sensitivity levels. Public benchmarks for papers, de-identified data for development, fully identified data for clinical validation — each needs different infrastructure, different access controls, different retention policies. And they all need GPUs.

## A Day in Their Life

**7:30 AM** — Reviews de-identification pipeline output. One batch failed — a clinician's note mentioned a patient's employer by name. Flags for manual review.

**9:00 AM** — IRB meeting. Explaining why the new federated learning protocol doesn't require individual patient consent (data never leaves hospitals). Committee is skeptical.

**11:00 AM** — Lab meeting. PhD student presents chest X-ray model results. AUC is 0.94 on the benchmark. Ada asks about performance on underrepresented demographics.

**12:30 PM** — Lunch with radiologist collaborator. He's frustrated that the hospital's "AI strategy" is all PowerPoints and no implementation. Ada explains FDA timelines. Again.

**2:00 PM** — Call with FDA. Pre-submission meeting for the 510(k). Discussing clinical performance requirements and statistical analysis plan.

**4:00 PM** — Debugging federated learning infrastructure. Hospital A's firewall is blocking the gradient updates. Network team says it's "for security." Ada sighs.

**6:00 PM** — Writing NIH proposal. Trying to explain why clinical AI needs both L1 benchmark work AND L3 clinical validation. It's not either/or.

**8:00 PM** — Reviewing de-identification failures. Two images had patient names burned into the pixels. OCR-based scrubbing needed.

## Current Workarounds

- **Completely separate environments**: Physical separation between de-identified and identified data workflows.
- **Hospital partner infrastructure**: Uses partner hospital's secure enclave for identified data — university doesn't have equivalent.
- **Manual de-identification review**: Human review of every de-identification before any ML work. Slow but necessary.
- **Parallel development**: Trains models on public data first, validates on private data later. Hoping they transfer.

## Their Projects

### Project 1: Deep Learning for Chest X-ray Interpretation (L3 High)
AI system for detecting pneumonia, tuberculosis, and other conditions from chest X-rays. Uses identified images from hospital partner for training.

**Why High tier:** Protected Health Information from clinical partner. HIPAA covered, requires BAA.

### Project 2: Medical Imaging Benchmark (L1 Low)
Public benchmark for comparing medical imaging AI models. Uses only de-identified, publicly available datasets.

**Why Low tier:** Explicitly public. De-identified data only. Reproducibility is the goal.

### Project 3: Federated Learning for Multi-site Clinical Models (L3 High)
Infrastructure for training models across multiple hospitals without moving data. Coordinates with five hospital systems.

**Why High tier:** Coordinates PHI across multiple institutions. Even though data doesn't move, the model learns from PHI.

### Project 4: FDA 510(k) Validation Study (L3 High)
Prospective clinical validation study for FDA regulatory submission. Requires rigorous data handling and audit trails.

**Why High tier:** Clinical trial data for regulatory submission. FDA requires comprehensive audit trails.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| Postdoc | Dr. Wei Chen | Security clearance, manages compliance infrastructure |
| Postdoc | Dr. Maria Lopez | Clinical partnerships, validation studies |
| PhD | James Osei | Chest X-ray model lead |
| PhD | Sarah Kim | Federated learning infrastructure |
| PhD | Alex Thompson | De-identification pipelines |
| Masters | Jordan Patel | Benchmark curation |
| Masters | Taylor Wong | Model bias analysis |
| Undergrad | Chris Martinez | Summer research, data annotation |

**Tech person:** Dr. Chen manages all compliance infrastructure. Has HIPAA training, security certifications, and the patience to deal with hospital IT.

## Using OpenResearchDataPlanner

### What would make her happy?
- **Clear tier separation**: L1 for benchmarks, L3 for clinical data. Show her how to manage both.
- **Understanding of regulated ML**: HIPAA, FDA, IRB — these aren't optional.
- **Federated learning support**: Her data can't move. The models need to train locally.
- **Audit trail capabilities**: FDA requires knowing exactly what happened to every piece of data.
- **De-identification infrastructure**: The hardest part of clinical AI isn't the models.

### What would frustrate her?
- **Treating HIPAA as an afterthought**: Compliance is core, not a checkbox.
- **Assuming all healthcare data is L3**: Her benchmark work is explicitly public.
- **No retention guidance for FDA**: FDA has specific data retention requirements. Help her understand them.
- **Ignoring bias requirements**: Clinical AI must be validated across demographic groups. This isn't optional.

### Key test scenarios
- **Multi-tier in same lab**: L1 benchmark AND L3 clinical data. Different handling.
- **HIPAA-specific requirements**: BAA, audit logging, retention policies.
- **FDA validation project**: Specific compliance needs for regulatory submission.
- **Hospital partnership**: Data that can't be copied — needs to stay at partner site.

## Quotes

> *"The CS researchers think I'm paranoid about de-identification. The clinicians think I'm reckless with AI. I'm trying to do both correctly."*

> *"Finally, a tool that understands I need BOTH public benchmark work AND clinical validation. They're different tiers with different requirements."*

> *"You have HIPAA-compliant retention options? And audit logging? This is exactly what I've been asking for."*

> *"My FDA submission requires documented data provenance for every training image. Can this system provide that?"*
