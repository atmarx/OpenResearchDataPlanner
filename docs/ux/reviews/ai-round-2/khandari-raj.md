# Dr. Raj Khandari — AI Applets Spec Review

**Persona:** Professor, Business School (Quantitative Finance, Production ML)
**Document Reviewed:** AI-GUIDANCE-APPLETS.md (12 applet specification)

---

**Review of AI Guidance Applets Specification**

Let me be direct: this spec is more thoughtful than most institutional guidance I have seen, and I have watched a lot of institutions bungle their AI policies. You have clearly done your homework. The emphasis on verification, the honest "Poor fit" ratings for citation generation, the explicit callout that consumer tools are prohibited for HIPAA data — this is refreshingly grounded in reality rather than bureaucratic liability-covering.

That said, I have concerns, and they stem from actually running production systems rather than just advising on them.

---

## What Works Well

The verification-first philosophy is correct. I quote Dr. Okonkwo in my own lab: "If you cannot verify it, you cannot use it." My PhD students hear this constantly. The Verification Gate applet (Applet 4) being a hard gate rather than a soft recommendation is the right call. Too many institutions make verification "recommended" and then act surprised when garbage propagates through the system.

The Tool Picker's decision logic (Applet 2) correctly treats data sensitivity as the branching criterion. In my lab, we have data under NDAs from hedge fund partners. If any of that touches a consumer LLM, we lose the partnership and probably face legal action. Your logic of "confidential = enterprise or local only" is sound.

The Documentation Guide (Applet 7) gets at something I care about deeply: reproducibility. You cite me — "If you can't reproduce a result, it didn't happen" — and the documentation framework follows logically. Tool version, date, prompts, outputs, modifications. This is exactly what I require from my students.

The Stakes Assessment (Applet 5) is calibrated appropriately. Low stakes for brainstorming, critical stakes for clinical decisions, clear escalation path. Good.

---

## Critical Gaps

### Missing: Model Drift and Temporal Validation Applet

This is my biggest concern. You have no applet addressing the fact that LLM outputs are non-deterministic and model versions change over time. If a researcher uses Claude 3.5 Sonnet to help analyze data in January, then goes back to "verify" their work in June, they may get different outputs from Claude 4 or whatever version is deployed by then.

In production ML, we version everything. Model weights, training data, inference code, even random seeds. The academic community using LLMs as black-box oracles has no equivalent discipline. Someone should be asking: "Can you reproduce this AI-assisted analysis in six months when reviewers ask questions?"

Add an applet — call it **Reproducibility Checkpoint** — that forces researchers to consider:
- Did you save the exact model version?
- Did you save your prompts verbatim?
- Did you save the raw outputs before modification?
- Can you regenerate similar (not identical) outputs if challenged?
- What is your fallback if the model no longer exists?

This connects to your existing Documentation Guide but goes further. Documentation is necessary but not sufficient for reproducibility.

### Missing: Workflow Integration Applet

You have Compute Estimator for people running local models, but nothing for the more common case: researchers embedding LLM calls into larger automated pipelines. My postdoc Dr. Liu runs sentiment analysis on SEC filings where the LLM is one component in a multi-stage pipeline. The pipeline runs automatically. There is no human sitting at a chat interface.

For this use case, your applets assume synchronous human-in-the-loop usage. But production systems often have:
- Automated prompt generation
- Batch processing of inputs
- Downstream systems consuming LLM outputs
- Retry logic and fallback handling
- Monitoring for output quality drift

None of your applets address: "I am building a system that calls an LLM API programmatically. What are the additional considerations?" This is where a lot of the actual risk lives in research computing.

Call it **Pipeline Integration Check** and address:
- How will you monitor output quality over time?
- What happens when the API fails or rate-limits?
- How do you validate outputs at scale (spot-checking, automated checks)?
- What is your alerting strategy for unexpected outputs?
- How do you version your prompts alongside your code?

---

## Sequencing Issues

Your suggested Phase 1 priority (Data Check, Tool Picker, Task Fit, Verification Gate, Stakes Assessment) is reasonable but I would argue that **Stakes Assessment should come before Task Fit**, not after. Here is my reasoning:

If the stakes are critical (patient safety, legal, regulatory), the answer to "Is AI the right approach?" is often "No, regardless of task fit." By putting Task Fit first, you risk someone deciding "AI is a moderate fit for literature review" before realizing they are doing literature review for a clinical trial protocol where errors could affect patient safety.

Stakes should be assessed earlier because stakes can veto task fit, but task fit cannot veto stakes.

---

## Discipline Specificity

You asked whether any applets should branch by discipline. Yes. Specifically:

**Bias Assessment (Applet 12)** needs discipline-specific tracks. The bias concerns for someone in social sciences studying human behavior are entirely different from my concerns in quantitative finance. My models are predicting equity returns, not making decisions about people. The bias framing in your current applet is heavily oriented toward demographic fairness, which is appropriate for some fields but less relevant for physical sciences, engineering, or quantitative analysis.

Add tracks for:
- Human subjects / social sciences (your current framing)
- Physical sciences / engineering (biases in training data about physical phenomena)
- Quantitative / financial (biases in market data, survivorship bias, look-ahead bias)
- Creative / humanities (cultural and representational biases)

**Compute Estimator (Applet 11)** should branch by research context. The categories you have are fine for general audience, but quantitative finance and other time-sensitive domains have different requirements. My models need to retrain on overnight market data and complete inference by 6 AM Eastern. "Batch processing" is not sufficient. I need real-time or near-real-time inference capabilities. Add a dimension for latency requirements.

---

## Tone

The tone is good — pragmatic, not preachy. The phrase "AI is a tool, not a collaborator" in Student Guidance is exactly right. Students need to understand the transactional nature of LLM interaction. It is not a thinking partner; it is a sophisticated autocomplete system that sometimes produces useful outputs and sometimes produces confident nonsense.

One adjustment: in Verification Gate, the phrase "The only way to ensure quality is human verification by someone with relevant expertise" is correct but could be softened slightly. In practice, some verification can be automated (running unit tests on generated code, checking citation DOIs against databases). The human judgment is still essential, but the spec should acknowledge that verification tooling can help.

---

## Specific Edits

1. **Applet 11 (Compute Estimator):** Add "Latency requirements" as a decision point. Options: batch (hours/days), interactive (seconds), real-time (sub-second). This changes compute recommendations significantly.

2. **Applet 6 (Pitfall Checklist):** Add a section for "Automated/Pipeline Usage" with checkpoints like: rate limit handling, output validation at scale, monitoring dashboards, prompt versioning.

3. **Applet 7 (Documentation Guide):** Add explicit guidance on storing conversation logs in version control. My lab uses Git for prompt versioning. This should be recommended practice for research teams.

4. **Applet 12 (Bias Assessment):** Add "Not Applicable" pathway for use cases where demographic bias is genuinely not the relevant concern. Currently, someone analyzing crystal structures will wonder why they are being asked about demographic disparities.

---

## Summary

This spec is solid work and better than 90% of institutional AI guidance I have encountered. The verification-first philosophy is correct. The data sensitivity tiering is correct. The honest assessment of AI task fit is refreshingly realistic.

The main gaps are around production use cases: reproducibility over time, pipeline integration, and discipline-specific branching. These are the scenarios where things actually go wrong in ways that institutional guidance rarely anticipates.

Fix the sequencing (Stakes before Task Fit), add the missing applets (Reproducibility Checkpoint, Pipeline Integration), and branch Bias Assessment by discipline. Then you will have comprehensive coverage for serious researchers, not just students using ChatGPT for homework.
