# Dr. Yev Transom — AI Applets Spec Review

**Persona:** Associate Professor, Computer Science (Machine Learning)
**Document Reviewed:** AI-GUIDANCE-APPLETS.md (12 applet specification)

---

**Review of AI Guidance Applets Specification**
*Dr. Yev Transom, Associate Professor, Computer Science*

Let me be direct: this specification is solid work. Whoever put this together clearly talked to people who actually use these tools. The "Verification Gate" as a hard requirement rather than a suggestion is exactly right. I tell my students the same thing. If you cannot verify it, you have no business using it.

That said, I have concerns and suggestions from someone who trains these models for a living.

## What Works Well

The Data Check applet leading the flow is correct. I have seen too many researchers stumble into data governance problems because they did not think about what they were pasting into ChatGPT until after the fact. Starting with "what data touches this tool?" is the right framing.

The Tool Picker's sensitivity-based decision logic is accurate. The distinction between consumer, enterprise, and local models matters, and most people do not understand it. The export control guidance pointing to local-only or air-gapped systems is exactly right. I have colleagues working on ITAR-adjacent projects who need this spelled out.

The Compute Estimator is a nice touch. Finally acknowledging that "using AI" can mean anything from asking ChatGPT a question to needing 100,000 GPU-hours for fine-tuning. The integration with the Research Data Planner makes sense for our ecosystem.

## What Needs Work

The Task Fit applet undersells the risks for code generation. "Good fit with review every line" is insufficient guidance. Let me be specific: current LLMs generate code that looks correct, passes basic tests, and has subtle bugs that experienced developers miss on first review. Last month one of my postdocs used Claude to scaffold a data pipeline. The code looked fine. It ran fine on test data. It had an off-by-one error in the batch processing that silently corrupted results for three weeks before we caught it during model validation. Review is not enough. You need adversarial testing with edge cases specifically designed to break assumptions. The applet should say this explicitly.

The Pitfall Checklist for code needs expansion:
- [ ] Test with intentionally malformed inputs
- [ ] Verify behavior at array boundaries (empty, single element, maximum size)
- [ ] Check numerical precision for any floating-point operations
- [ ] Profile memory usage for large inputs
- [ ] Do not assume AI-generated tests are sufficient

## On the Open Questions

*Coverage gaps:* Yes. You need an applet for "AI for Research Methods" specifically addressing when AI-assisted analysis is appropriate versus when it introduces unacceptable methodological risk. The current Task Fit applet treats "data analysis" as one category. But there is a massive difference between using AI to clean and transform data (reasonable with verification) versus using AI to interpret results (dangerous). Also missing: guidance on AI for peer review. Some of my colleagues are using LLMs to draft reviews. The ethical implications are significant and unaddressed here.

*Sequencing:* The flow is logical but could use a fast path. Power users do not need to click through twelve applets. Someone like me running local Llama for brainstorming should be able to answer three questions and get a "you're fine, proceed" in 30 seconds. Consider a triage applet that routes to the full flow only when warranted.

*Content accuracy:* The Compute Estimator's resource estimates are approximately correct but could be more specific. "Multi-GPU; 80GB+ per GPU" for large model fine-tuning is vague. For a 70B parameter model with full fine-tuning, you need 8xA100 80GB minimum with gradient checkpointing. For LoRA, single A100 works. The distinction matters for grant budgeting. Add a note about QLoRA and PEFT methods that dramatically reduce requirements.

*Tone:* It is not preachy, which I appreciate. The "AI is a tool, not a collaborator" framing in Student Guidance is correct. Do not soften this. Students need to internalize that these systems do not understand anything.

*Discipline specificity:* The Bias Assessment applet needs branching. Bias concerns for NLP applications are fundamentally different from computer vision which are different from recommendation systems. The current generic treatment will not help a social scientist using text analysis catch demographic bias in their corpus versus helping a medical imaging researcher understand disparities in model accuracy across skin tones. At minimum, branch by: text/language, vision/images, tabular data/decisions, and generative versus classification tasks.

## Missing Applets

1. **Model Selection Guide**: For local deployment, choosing between Llama, Mistral, Gemma, etc. matters. Different architectures have different strengths, licensing implications, and resource requirements. Currently this is tribal knowledge among ML practitioners.

2. **Prompt Engineering Basics**: Not comprehensive training, but essential guidance on: getting reproducible outputs, avoiding prompt injection when building applications, understanding temperature and sampling parameters, and when few-shot examples help versus hurt.

3. **AI Ethics Quick Reference**: A separate applet linking to ACM/IEEE/discipline-specific ethics guidelines. This should not duplicate academic integrity content but address research ethics specific to AI development and deployment.

## Technical Concerns

The spec mentions "same prompt can give different results" in Documentation Guide but does not explain why. Users need to understand that these are stochastic systems with temperature-based sampling. Even the same model with temperature=0 can produce different outputs due to batching and numerical precision. Document the parameters, not just the prompt.

The Tool Picker should explicitly address model versioning. "Claude 3.5 Sonnet" is insufficient documentation because Anthropic deploys silent updates. Use the full model ID string where available. This matters for reproducibility.

## Specific Edit Recommendations

In Task Fit, change "Code scaffolding — Good" to "Code scaffolding — Moderate" with note: "Requires adversarial testing beyond standard unit tests. AI-generated code often contains subtle bugs at boundaries and edge cases."

In Verification Gate, add a verification method row: "Code — Read every line; test with edge cases; *deliberately attempt to break assumptions with adversarial inputs*"

In Compute Estimator, add a row for "Parameter-efficient fine-tuning (LoRA/QLoRA)" between fine-tuning small and large, noting dramatically reduced resource requirements.

Add explicit guidance somewhere about rate limits and API costs for cloud inference. Students blow through their free tier credits faster than they expect and then ask IT why the tool "stopped working."

## Summary

This is a well-structured foundation. The verification-first philosophy is correct. The gaps I have identified are addressable. My primary concern is that the spec treats AI use as more homogeneous than reality. A researcher using ChatGPT to brainstorm grant aims and a researcher fine-tuning Llama on domain-specific data are doing fundamentally different things with fundamentally different risk profiles. The applets should branch earlier to acknowledge this.

Ship Phase 1, but prioritize the discipline-specific branching for Phase 2. The generic guidance is better than nothing, but it will not change behavior without contextual specificity.
