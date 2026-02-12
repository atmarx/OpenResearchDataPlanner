# AI Guidance Review — Round 1

**Date:** 2026-02-11
**Purpose:** Gather expert perspectives on what Northwinds should provide for responsible AI use in research and teaching

## Prompt

> **Context:** Northwinds University is developing a self-service guide to help faculty and students responsibly and effectively incorporate AI into their academic work. This will live at `/ai` as a standalone resource — not tied to data planning, but complementary to it.
>
> **Question:** What should Northwinds provide to ALL faculty and students — regardless of discipline or technical background — to help them effectively incorporate AI into their research and teaching workflows?

## Respondents

| Persona | Department | AI Expertise | File |
|---------|------------|--------------|------|
| Dr. Yev Transom | CS - Machine Learning | LLM training, GPU clusters, MLOps | [transom-yev.md](transom-yev.md) |
| Dr. Raj Khandari | Business School | Production ML, quant finance, NLP | [khandari-raj.md](khandari-raj.md) |
| Dr. Tessa Nordvik | Aerospace Engineering | Physics-informed neural networks, CFD surrogates | [nordvik-tessa.md](nordvik-tessa.md) |
| Dr. Ada Okonkwo | Medical Informatics | Clinical AI, FDA/HIPAA, federated learning | [okonkwo-ada.md](okonkwo-ada.md) |

## Key Themes

### Universal Agreement

1. **AI doesn't know when it's wrong** — confidence and correctness are unrelated
2. **Verification is mandatory** — not optional, not nice-to-have
3. **Data privacy awareness** — know where your data goes before you paste
4. **Discipline-specific guidance needed** — one size does not fit all
5. **Bias is fundamental** — not a bug to be patched
6. **Decision frameworks over principles** — "when to use" not just "how to use"

### Unique Perspectives

| Expert | Unique Contribution |
|--------|---------------------|
| **Transom** | Local models (Llama) as privacy option; don't ban in classrooms |
| **Khandari** | Document prompts/versions for reproducibility; "amplifier" mental model |
| **Nordvik** | Computational AI differs from text AI; physics-constrained ML; failure examples |
| **Okonkwo** | Case studies of failures teach more than successes; stakes depend on context |

### Requested Institutional Support

- Clear policies on acceptable use (specific answers, not vague guidance)
- Vetted tool recommendations by data sensitivity level
- Enterprise AI access with proper data agreements
- Discipline-specific training workshops
- Compute guidance for AI workloads
- Decision frameworks / flowcharts
- Regular updates (field moves fast)

## Next Steps

- [ ] Synthesize into draft outline for `/ai` guide
- [ ] Identify additional perspectives needed (humanities? social sciences? IT staff?)
- [ ] Draft decision tree for "Should I use AI for this task?"
- [ ] Compile anonymized failure case studies
