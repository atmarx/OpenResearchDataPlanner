# AI Guidance Expansion Plan

> Based on faculty review feedback. Expanding AI Guidance from a single flow into specialized tracks with both interactive decision trees and narrative learning materials.

---

## The Core Insight

Faculty feedback revealed something important:

> *"This is what I would tell my students."*

We're not building a policy compliance tool. We're building **a course in responsible AI use**, delivered through workflow context. This has two implications:

1. **Decision trees for doing** — Quick triage when you have a task
2. **Narrative guides for learning** — Deep understanding for first-timers

Both formats serve different moments. A student using AI for the first time needs the narrative. A researcher checking before a deadline needs the tree.

---

## Track Structure

The current "one size fits all" flow doesn't serve everyone. Split into tracks:

### Track 1: General Research AI
**Audience:** Most researchers using commercial AI (ChatGPT, Claude, Copilot) for writing, brainstorming, code assistance.

**Current applets:** Stakes → Data Check → Task Fit → Verification Gate → Disclosure

**This is the default track.** Accessible, not overwhelming.

---

### Track 2: Clinical & Healthcare AI
**Audience:** Dr. Ada's crowd. Medical informatics, clinical research, anything touching PHI.

**Why separate:** HIPAA, FDA, IRB considerations are complex enough to warrant dedicated guidance. Mixing them into the general flow overwhelms non-clinical users.

**Applets/Guides:**

| Guide | Format | Priority |
|-------|--------|----------|
| HIPAA De-identification | Decision tree + narrative | P0 |
| IRB Amendment for AI | Decision tree + checklist | P1 |
| Clinical AI Validation | Checklist + narrative | P1 |
| FDA Awareness Primer | Narrative (short) | P2 |
| Multi-site Data Governance | Narrative + decision points | P2 |

---

### Track 3: Production ML & MLOps
**Audience:** Dr. Raj's crowd. Researchers building production systems, pipelines, automated retraining.

**Why separate:** Their concerns (drift monitoring, continuous validation, feature stores) are incomprehensible to someone asking "can I use ChatGPT for my lit review?" Different planets.

**Applets/Guides:**

| Guide | Format | Priority |
|-------|--------|----------|
| Pipeline Integration (expanded) | Decision tree + checklist | P1 |
| MLOps Lifecycle | Narrative + decision points | P1 |
| Continuous Validation | Checklist | P2 |
| Model Versioning & Reproducibility | Checklist + narrative | P2 |
| API Cost Planning | Calculator integration | P2 |

---

### Track 4: Teaching & Course Design
**Audience:** Faculty designing AI policies for courses.

**Already exists:** Teaching Policy Builder, Student Guidance

**Addition:** Syllabus language generator with copy-paste templates (already partially built)

---

## Narrative Instructional Versions

For each decision tree applet, create a corresponding narrative guide:

| Decision Tree | Narrative Version |
|---------------|-------------------|
| Stakes Assessment | "Understanding AI Risk in Research" |
| Data Check | "Before You Paste: Data Sensitivity 101" |
| Verification Gate | "Why Verification Isn't Optional" |
| Disclosure Framework | "When and How to Disclose AI Use" |
| Bias Assessment | "AI Bias: What Researchers Need to Know" |

**Format:** ~1000-word readable articles with examples. Not policy documents — teaching materials.

**Delivery:**
- Link from decision tree: "Want to understand the reasoning? Read the guide."
- Standalone browsable in /ai/learn/ or similar

---

## Piper Reviews the Workbench

Piper's enthusiasm is what we want on the Workbench page. Her perspective:

- *"Can I use this to help a confused researcher?"*
- *"Does this give me confidence without requiring expertise?"*
- *"What would I paste into a ticket response?"*

**Action:** Have Piper walk through the IT Workbench and document:
1. What makes her feel confident
2. What makes her hesitate
3. What she'd want to show researchers
4. What language resonates vs. what sounds bureaucratic

---

## Implementation Phases

### Phase A: Clinical Track Foundation
1. HIPAA De-identification Decision Tree
2. IRB Amendment Guide
3. Clinical AI Validation Checklist

### Phase B: Production ML Track
1. Expand Pipeline Integration applet
2. MLOps Lifecycle narrative guide
3. Continuous Validation checklist

### Phase C: Narrative Versions
1. Stakes Assessment narrative
2. Verification Gate narrative
3. Data Check narrative

### Phase D: Workbench Polish
1. Piper's review
2. Apply her feedback to UX
3. Add quick-reference guides for support staff

---

## File Structure Proposal

```
src/ai-guidance/
├── views/
│   └── AiGuidanceHome.vue          # Track selector
├── applets/                         # Interactive decision trees
│   ├── general/                     # Track 1
│   ├── clinical/                    # Track 2
│   │   ├── HipaaDeidentification.vue
│   │   ├── IrbAmendment.vue
│   │   └── ClinicalValidation.vue
│   ├── production-ml/               # Track 3
│   │   ├── PipelineIntegration.vue  # (moved/expanded)
│   │   └── MlopsLifecycle.vue
│   └── teaching/                    # Track 4
│       ├── TeachingPolicyBuilder.vue
│       └── StudentGuidance.vue
├── guides/                          # Narrative versions
│   ├── stakes-assessment.md
│   ├── verification-gate.md
│   ├── data-sensitivity-101.md
│   └── ...
└── components/
    └── NarrativeGuide.vue           # Renders markdown guides
```

---

## Open Questions

1. **Track detection:** Should we auto-suggest tracks based on tier? (L3 → Clinical track prompt)
2. **Cross-linking:** Can someone in Clinical track access General applets seamlessly?
3. **Versioning:** As policies evolve, how do we version the guidance?
4. **Institution customization:** Can institutions add their own applets/guides?

---

## Next Steps

1. [ ] Finalize HIPAA De-identification tree structure with Ada
2. [ ] Have Piper review Workbench, document feedback
3. [ ] Outline MLOps Lifecycle with Raj
4. [ ] Write first narrative guide (Stakes Assessment) as template
5. [ ] Propose track selector UI for AiGuidanceHome
