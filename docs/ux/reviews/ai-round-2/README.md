# AI Guidance Applets — Round 2 Expert Review Summary

**Document Reviewed:** [AI-GUIDANCE-APPLETS.md](../../../AI-GUIDANCE-APPLETS.md)
**Date:** February 2026
**Reviewers:** 4 AI-specialized faculty personas

---

## Consensus Points

All four experts agreed on several fundamentals:

1. **Verification-first philosophy is correct** — The Verification Gate as a hard requirement (not recommendation) is exactly right
2. **Data Check as entry point is sound** — Starting with data sensitivity is the correct branching criterion
3. **Tool Picker tiering is accurate** — Consumer/enterprise/institutional/local categories with sensitivity-based routing reflects reality
4. **Documentation Guide aligns with reproducibility standards** — Timestamp, version, prompt logging requirements are appropriate
5. **Overall architecture is solid** — The 12-applet structure is logical and more comprehensive than most institutional guidance

---

## Critical Gaps Identified

### Missing Applets (Priority Order)

| Proposed Applet | Advocate | Rationale |
|-----------------|----------|-----------|
| **IRB/Human Subjects Workflow** | Okonkwo | "Massive gap" — IRB dimension often determines what's permissible; consent forms rarely mention AI |
| **Scientific Computing AI Assessment** | Nordvik | Spec assumes LLMs for text; misses physics-constrained ML, validation against ground truth, numerical stability |
| **Reproducibility Checkpoint** | Khandari | LLM versions change; outputs non-deterministic; need model versioning discipline |
| **Pipeline Integration Check** | Khandari | Production systems have automated prompts, batch processing, quality monitoring — none addressed |
| **Regulatory Pathway Assessment** | Okonkwo | FDA/510(k) requirements for clinical AI; "AI as medical device" determination |
| **Model Selection Guide** | Transom | Choosing between Llama/Mistral/Gemma matters for local deployment; currently tribal knowledge |
| **Prompt Engineering Basics** | Transom | Reproducible outputs, prompt injection avoidance, temperature/sampling parameters |

### Applet Expansions Needed

| Applet | Issue | Proposed Fix |
|--------|-------|--------------|
| **Data Check** | De-identification treated as binary | Add de-identification sub-workflow for health/education data (Okonkwo) |
| **Tool Picker** | Missing BAA specifics | Explicitly mention HIPAA Business Associate Agreements, not just "enterprise agreements" (Okonkwo) |
| **Tool Picker** | No "data can't move" path | Add explicit guidance for federated learning / data-that-cannot-move scenarios (Okonkwo) |
| **Task Fit** | Too text-focused | Add scientific computing tasks: surrogate modeling, simulation acceleration, numerical solver replacement (Nordvik) |
| **Task Fit** | Code generation undersold | Change "Good" to "Moderate" — requires adversarial testing beyond standard unit tests (Transom) |
| **Verification Gate** | Code verification incomplete | Add: "deliberately attempt to break assumptions with adversarial inputs" (Transom) |
| **Pitfall Checklist** | No automated/pipeline section | Add checkpoints for rate limits, output validation at scale, prompt versioning (Khandari) |
| **Pitfall Checklist** | Code section insufficient | Add: malformed inputs, array boundaries, numerical precision, memory profiling (Transom) |
| **Compute Estimator** | Missing latency dimension | Add: batch (hours), interactive (seconds), real-time (sub-second) (Khandari) |
| **Compute Estimator** | Vague resource estimates | Add LoRA/QLoRA row; specify 8xA100 for 70B full fine-tuning vs single A100 for PEFT (Transom) |
| **Bias Assessment** | Too demographic-focused | Add "Not Applicable" path for physical sciences; irrelevant for crystal structure analysis (Khandari) |

---

## Sequencing Changes

### Stakes Before Task Fit

**Advocate:** Khandari
**Rationale:** "Stakes can veto task fit, but task fit cannot veto stakes."

If stakes are critical (patient safety, legal, regulatory), AI may be inappropriate regardless of task fit. Current sequence risks someone deciding "AI is moderate fit for literature review" before realizing it's for a clinical trial protocol.

**Proposed change:** Reorder Phase 1:
1. Data Check
2. Tool Picker
3. **Stakes Assessment** ← moved up
4. Task Fit
5. Verification Gate

### Bias Assessment Earlier

**Advocate:** Okonkwo
**Rationale:** For human subjects/clinical/imaging work, bias auditing should happen during project design (IRB submission), not as Phase 3 polish.

**Proposed change:** Move to Phase 1 for biomedical/social science tracks; keep Phase 3 for general use.

### Compute Estimator Earlier

**Advocate:** Okonkwo
**Rationale:** Grant proposals require compute estimates upfront, during project planning.

**Proposed change:** Consider Phase 2 placement, or make available throughout flow rather than end-only.

---

## Discipline Branching Requirements

All experts agreed branching is necessary. Proposed tracks:

### Bias Assessment Tracks (Khandari)
- Human subjects / social sciences (current framing)
- Physical sciences / engineering (training data about phenomena)
- Quantitative / financial (market data, survivorship bias, look-ahead bias)
- Creative / humanities (cultural and representational biases)

### Task Fit / Pitfall Tracks (Nordvik)
- Text/humanities applications (current focus)
- Computational/quantitative sciences
- Life sciences and clinical applications
- Engineering and design

### Regulatory Tracks (Okonkwo)
- Biomedical/Health → HIPAA, FDA, human subjects pathways
- Education → FERPA-specific considerations
- Defense-funded → Export control (ITAR) dedicated treatment

---

## Fast Path Request

**Advocate:** Transom
**Use case:** Power users running local Llama for brainstorming shouldn't click through 12 applets.

**Proposed solution:** Triage applet that routes to full flow only when warranted. Answer 3 questions → "you're fine, proceed" in 30 seconds.

---

## Content Accuracy Corrections

| Location | Issue | Correction |
|----------|-------|------------|
| Task Fit: Clinical decisions | "No" is both too strong and too weak | FDA has cleared AI for clinical decision support; change to "Requires FDA pathway analysis" |
| Documentation Guide | Mentions non-determinism but doesn't explain | Add: stochastic systems with temperature-based sampling; even temp=0 varies due to batching |
| Tool Picker | "Claude 3.5 Sonnet" insufficient | Require full model ID string; note providers deploy silent updates |

---

## Tone Feedback

Generally positive:
- "Pragmatic, not preachy" (Khandari)
- "Direct without being preachy" (Okonkwo)
- "AI is a tool, not a collaborator" framing is correct — don't soften (Transom, Khandari)

One adjustment (Khandari): Verification Gate's "only way is human verification" could acknowledge automated verification tooling (unit tests, DOI checks) while maintaining human judgment as essential.

---

## Summary of Required Changes

### New Applets to Add (7)
1. IRB/Human Subjects Workflow (Phase 1)
2. Scientific Computing AI Assessment (Phase 1 for STEM)
3. Reproducibility Checkpoint (Phase 1)
4. Pipeline Integration Check (Phase 2)
5. Regulatory Pathway Assessment (Phase 2, biomedical track)
6. Model Selection Guide (Phase 2)
7. Prompt Engineering Basics (Phase 2)

### Applet Modifications (6)
1. Data Check — add de-identification sub-workflow
2. Tool Picker — add BAA requirements, data-can't-move path
3. Task Fit — add scientific computing tasks, downgrade code generation
4. Verification Gate — expand code verification requirements
5. Pitfall Checklist — add pipeline usage section, expand code checks
6. Compute Estimator — add latency dimension, PEFT methods, specific estimates

### Structural Changes (3)
1. Resequence: Stakes Assessment before Task Fit
2. Implement discipline branching for 3-4 tracks minimum
3. Add fast-path triage for power users

### Content Fixes (3)
1. Clinical decisions guidance
2. Non-determinism explanation
3. Model versioning requirements

---

## Expert Availability

All four experts indicated willingness to review revised versions:

- **Transom:** "Ship Phase 1, but prioritize discipline-specific branching for Phase 2"
- **Khandari:** "Fix the sequencing, add the missing applets, and branch Bias Assessment by discipline"
- **Nordvik:** Offered to help with computational/scientific AI content specifically
- **Okonkwo:** "Happy to review revised versions or consult on the biomedical/regulatory content specifically"

---

## Next Steps

1. Revise AI-GUIDANCE-APPLETS.md incorporating feedback
2. Add 7 new applet specifications
3. Design discipline branching architecture
4. Create fast-path triage logic
5. Consider Round 3 review with IT staff personas (Marco, Piper) for implementation feasibility
