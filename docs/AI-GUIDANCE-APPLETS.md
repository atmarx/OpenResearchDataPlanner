# AI Guidance Applets — Specification

**Status:** Revised after Round 2 expert review
**Target:** `/ai` self-service guide at Northwinds University
**Audience:** All faculty and students using generative AI in research and teaching

---

## Scope: Generative AI

This guide focuses on **generative AI** — large language models (ChatGPT, Claude, Gemini), image generators (DALL-E, Midjourney), and similar tools that produce text, code, images, or other content from prompts.

**This guide does NOT cover:**
- Training custom machine learning models
- Physics-informed neural networks
- Scientific computing with ML components
- Computer vision for experimental data processing
- Reinforcement learning for control systems

Those use cases involve fundamentally different workflows, validation requirements, and expertise. A companion "Research ML Guide" may address these in a future phase. If your work involves training models on your own data rather than prompting existing models, consult with Research Computing directly.

---

## Overview

This document specifies **17 decision-support applets** to help faculty and students responsibly incorporate generative AI into their academic work. Each applet is:

- **Standalone** — usable independently
- **Linkable** — can connect to others in a flow
- **Actionable** — ends with clear guidance, not just information
- **Ratable** — users can upvote/downvote helpfulness after completing

---

## Applet 1: Stakes Assessment

**Core Question:** "What happens if AI gets this wrong?"

**Why First:** Stakes can veto everything downstream. Per Dr. Khandari: "Stakes can veto task fit, but task fit cannot veto stakes." If you're doing something for a clinical trial or regulatory submission, you need to know that *before* evaluating whether AI is a good fit.

### Stakes Levels

| Level | Description | Examples | Implication |
|-------|-------------|----------|-------------|
| **Low** | Embarrassment, minor rework | Internal brainstorming, personal notes, first drafts | Proceed with basic review |
| **Medium** | Professional reputation, wasted effort | Conference submissions, grant drafts, published writing | Proceed with thorough verification |
| **High** | Career impact, institutional liability | Journal publications, regulatory submissions, official communications | Proceed with independent verification |
| **Critical** | Safety, legal, or severe harm | Clinical decisions, legal advice, safety-critical systems | AI may not be appropriate |

### Decision Points

1. **Who will see this output?**
   - Just you → Lower stakes
   - Collaborators/lab → Medium stakes
   - Public/publication → Higher stakes
   - Patients/students/public safety → Critical stakes

2. **What decisions will be made based on this?**
   - No decisions (just exploration) → Lower stakes
   - Research direction → Medium stakes
   - Resource allocation → Medium-high stakes
   - Health/safety/legal → Critical stakes

3. **Can errors be caught later?**
   - Yes, easily → Lower stakes
   - Maybe, with effort → Medium stakes
   - Difficult or impossible → Higher stakes

4. **What's the correction cost if wrong?**
   - Trivial rework → Lower stakes
   - Significant rework → Medium stakes
   - Retraction/reputation damage → High stakes
   - Harm to others → Critical stakes

### Outputs

- Stakes level: `low` | `medium` | `high` | `critical`
- If `critical`: Strong recommendation to reconsider AI use entirely
- Required verification rigor for this stakes level

### Links To

- **Data Check** (next step)
- If `critical` + clinical/regulatory → **IRB/Human Subjects Workflow**

---

## Applet 2: Data Check

**Core Question:** "What kind of data will touch this AI tool?"

**Why Important:** Data sensitivity determines which tools you can use and what compliance requirements apply.

### Decision Points

1. **Will you input any data into the AI tool?**
   - No (just prompts/questions) → Low risk, proceed to Tool Picker
   - Yes → Continue

2. **What type of data?**
   - Public/published data only → Low sensitivity
   - Synthetic/generated data → Low sensitivity
   - Your own unpublished work (drafts, code, ideas) → Medium sensitivity (IP concerns)
   - Data under NDA or industry agreement → Medium-High sensitivity
   - Student records (FERPA) → High sensitivity → Branch to FERPA considerations
   - Health information (HIPAA/PHI) → High sensitivity → Branch to HIPAA considerations
   - Export controlled (ITAR/EAR/CUI) → Restricted
   - Human subjects research data → Branch to IRB/Human Subjects Workflow

3. **Is the data de-identified?** (For health/education data)
   - De-identification is NOT binary — see sub-workflow below
   - HIPAA Safe Harbor has specific requirements
   - Expert determination requires documentation
   - Warning: AI tools may re-identify through pattern matching

4. **What are your data use agreements?**
   - Some grants/contracts prohibit sharing with third parties
   - Check your IRB protocol, grant terms, NDAs

### De-identification Sub-workflow (HIPAA/FERPA)

For health or education data, additional questions:

1. **What de-identification method was used?**
   - HIPAA Safe Harbor (18 identifiers removed) → Document method
   - Expert determination → Have documentation ready
   - "We removed names" → Insufficient; consult privacy office

2. **Could the AI re-identify through pattern matching?**
   - Free-text clinical notes → High re-identification risk even if "de-identified"
   - Structured data with rare combinations → Medium risk
   - Aggregated statistics only → Lower risk

3. **What's the re-identification harm potential?**
   - Individual health conditions exposed → High harm
   - General patterns revealed → Lower harm

### Outputs

- Data sensitivity level: `public` | `internal` | `confidential` | `restricted`
- Flags: `hipaa` | `ferpa` | `export_control` | `nda` | `irb` | `ip_sensitive`
- Recommendation: Proceed / Proceed with caution / Consult before proceeding / Do not use cloud AI
- If `irb` flag → Link to IRB/Human Subjects Workflow

### Links To

- **IRB/Human Subjects Workflow** (if human subjects data)
- **Tool Picker** (primary next step)

---

## Applet 3: IRB/Human Subjects Workflow

**Core Question:** "Does my IRB protocol cover AI-assisted analysis?"

**Why Critical:** Per Dr. Okonkwo: "The IRB dimension is often the primary determinant of what you can do. Many researchers discover mid-project that their consent forms say nothing about AI."

### Decision Points

1. **Does your IRB protocol mention AI or machine learning tools?**
   - Yes, explicitly permits → Document which tools are covered
   - Yes, explicitly prohibits → Do not use AI; consider protocol amendment
   - No mention → Continue to assess

2. **Were participants consented for AI-assisted analysis?**
   - Consent mentions AI/ML → May proceed with documented tools
   - Consent mentions "computational analysis" broadly → Gray area; consult IRB
   - Consent silent on analysis methods → May need amendment or determination

3. **Does use of cloud AI tools constitute "data sharing" under your protocol?**
   - Sending data to OpenAI/Anthropic = sharing with third party
   - Check: Does protocol allow third-party data processors?
   - Check: Does consent cover sharing for "analysis purposes"?

4. **Is the AI tool a covered entity or business associate?**
   - For HIPAA-covered data: Tool provider must have BAA
   - Consumer tools (ChatGPT Free, Claude Free) → No BAA available → Cannot use

5. **What analysis will AI perform?**
   - Transcription/coding of interviews → Document in protocol
   - Pattern identification in sensitive data → Higher scrutiny
   - Any analysis affecting participant welfare → Consult IRB

### When to Consult Your IRB

- Protocol silent on AI and you want to use cloud tools
- Consent forms don't mention AI-assisted analysis
- You're uncertain whether AI use constitutes a protocol change
- AI will analyze data that could affect participant welfare

### Outputs

- IRB readiness: `covered` | `amendment_needed` | `consult_irb` | `prohibited`
- Checklist of documentation needed
- Sample protocol amendment language (if applicable)
- Contact: [Institution IRB office link]

### Links To

- **Tool Picker** (with IRB constraints applied)
- **Documentation Guide** (IRB requires audit trail)

---

## Applet 4: Tool Picker

**Core Question:** "Which AI tools can I use for this data sensitivity level?"

**Why Important:** Not all AI tools are equivalent. Consumer tools, enterprise tools, and local models have different data handling policies and compliance capabilities.

### Inputs

- Data sensitivity level (from Data Check)
- IRB constraints (if applicable)
- Task type (optional, for recommendations)

### Tool Categories

| Category | Examples | Data Policy | Compliance | Best For |
|----------|----------|-------------|------------|----------|
| **Consumer Cloud** | ChatGPT Free, Claude Free, Gemini | Data may be used for training; stored on third-party servers | No BAA available; no enterprise agreements | Public data, brainstorming, learning |
| **Enterprise Cloud** | ChatGPT Enterprise, Claude for Enterprise, Azure OpenAI | Data not used for training; **BAA available** for HIPAA | Enterprise agreements; audit logs | Internal/confidential with institutional agreement |
| **Institutionally Hosted** | Northwinds AI Portal (if exists) | Data stays within institution; institutional policies apply | May satisfy IRB "no external sharing" | Confidential data, student work, research data |
| **Local Models** | Llama, Mistral via Ollama | Data never leaves your machine | Full control; no external dependencies | Sensitive data, offline work, export controlled |
| **Specialized Research** | AlphaFold, ESMFold, domain-specific | Varies by tool | Check each tool's policies | Domain-specific tasks |

### Decision Logic

```
IF sensitivity = public:
  → All tools available, consumer is fine

IF sensitivity = internal (IP-sensitive):
  → Enterprise or local preferred
  → Consumer with caution (read ToS on data retention)

IF sensitivity = confidential (NDA, pre-publication):
  → Enterprise with proper agreement OR local only
  → Consumer tools NOT recommended

IF sensitivity = high (HIPAA, FERPA):
  → Requires BAA (Business Associate Agreement) for HIPAA
  → Enterprise tools with BAA OR institutionally hosted OR local
  → Consumer tools PROHIBITED

IF sensitivity = restricted (export control):
  → Local models only OR air-gapped systems
  → Consult security office before ANY AI use

IF IRB = "no external sharing":
  → Institutionally hosted OR local only
  → Cloud tools may violate protocol
```

### Federated / Data-Cannot-Move Scenarios

For data that cannot leave its current location (multi-site studies, hospital systems, regulatory restrictions):

- Cloud AI tools are not an option regardless of BAAs
- Local models must run where data resides
- Consider: Can you bring the model to the data?
- Consult Research Computing for federated approaches

### Outputs

- List of appropriate tools for this sensitivity level
- Specific warnings for each tool category
- BAA status for enterprise tools (if known)
- Links to institutional agreements/policies

### Links To

- **Task Fit** (is AI right for this task?)
- **Model Selection Guide** (if choosing local models)

---

## Applet 5: Task Fit

**Core Question:** "Is AI the right approach for this task?"

**Why Important:** AI isn't always the answer. Sometimes it adds complexity without benefit, or introduces risks that outweigh efficiency gains.

### Task Categories with AI Fit Assessment

| Task Type | AI Fit | Notes |
|-----------|--------|-------|
| **Brainstorming/ideation** | Good | Use as thought partner, not oracle |
| **First draft generation** | Good | Treat as raw material, not finished work |
| **Explaining concepts** | Good | Verify against authoritative sources |
| **Code scaffolding** | Moderate | Requires adversarial testing beyond standard unit tests; AI-generated code often contains subtle bugs at boundaries |
| **Literature discovery** | Moderate | Will hallucinate citations; verify all |
| **Summarization** | Moderate | May conflate sources; verify key claims |
| **Data cleaning/formatting** | Moderate | Good for transformations; verify edge cases |
| **Data analysis** | Caution | May produce plausible but wrong analysis |
| **Statistical work** | Caution | Requires domain expertise to validate |
| **Factual research** | Poor | High hallucination risk for specifics |
| **Citation generation** | Poor | Will fabricate plausible-looking citations |
| **Legal/compliance text** | Poor | Requires expert review regardless |
| **Clinical decisions** | Requires FDA pathway | See Regulatory considerations; not "No" but heavily governed |

### Decision Points

1. **What are you trying to accomplish?**
   - Map to task category above

2. **Do you have the expertise to evaluate the output?**
   - Yes → Proceed with appropriate verification
   - No → AI may not be appropriate; consider alternatives

3. **What's your time budget for verification?**
   - If verification takes as long as doing it yourself → questionable value
   - AI saves time on generation, but verification is non-negotiable

4. **Is there a non-AI approach that's simpler?**
   - Sometimes the answer is "just do it yourself"

### Outputs

- Fit assessment: `good` | `moderate` | `caution` | `poor`
- Recommended approach for this task type
- Verification requirements for this task
- Alternative approaches if AI is poor fit

### Links To

- **Verification Gate** (before you start)
- **Pitfall Checklist** (task-specific warnings)

---

## Applet 6: Verification Gate

**Core Question:** "Can I actually verify the output?"

**Why Critical:** Per Dr. Okonkwo: "If you cannot verify it, you cannot use it." This is a hard gate, not a soft recommendation.

### The Verification Requirement

AI tools do not know when they are wrong. They produce confident output regardless of accuracy. Human verification by someone with relevant expertise is essential. Some verification can be automated (running tests, checking DOIs), but human judgment remains non-negotiable.

### Decision Points

1. **Do you have the domain expertise to evaluate this output?**
   - Yes → You can verify; proceed
   - Partially → You can verify some aspects; flag gaps
   - No → You cannot responsibly use AI for this task

2. **Can you access authoritative sources to check against?**
   - For citations: Can you look up the actual papers?
   - For facts: Can you check primary sources?
   - For code: Can you test and review?
   - For analysis: Can you validate methodology?

3. **Do you have time allocated for verification?**
   - Verification is not optional
   - Budget time accordingly (often 30-50% of time "saved")

4. **What's your verification plan?**
   - Explicit plan before using AI output
   - Not "I'll check it later" — specific steps

### Verification Methods by Output Type

| Output Type | Verification Method |
|-------------|---------------------|
| **Citations** | Look up every citation in actual databases |
| **Facts/claims** | Check against primary/authoritative sources |
| **Code** | Read every line; test with edge cases; **deliberately attempt to break assumptions with adversarial inputs** |
| **Analysis** | Validate methodology; check calculations manually |
| **Summaries** | Read the original sources |
| **Writing** | Ensure you can defend every claim |

### Code Verification Expanded (per Dr. Transom)

AI-generated code often looks correct, passes basic tests, and has subtle bugs that experienced developers miss. Required:

- [ ] Test with intentionally malformed inputs
- [ ] Verify behavior at array boundaries (empty, single element, maximum size)
- [ ] Check numerical precision for any floating-point operations
- [ ] Profile memory usage for large inputs
- [ ] Do not assume AI-generated tests are sufficient
- [ ] Do not trust AI comments — they may describe wrong behavior

### Outputs

- Verification capability: `full` | `partial` | `none`
- If `none`: Strong recommendation not to proceed
- If `partial`: List of gaps; consider alternatives for those aspects
- Verification checklist for this task type

### Links To

- **Pitfall Checklist** (task-specific warnings)
- **Documentation Guide** (record your verification)

---

## Applet 7: Pitfall Checklist

**Core Question:** "What should I watch for with [task type]?"

**Why Important:** Different AI use cases have different failure modes. Generic warnings aren't as useful as specific, contextual guidance.

### Checklists by Task Type

#### Writing & Text Generation
- [ ] AI will sound confident even when wrong — in high-stakes contexts like clinical AI, confident-but-wrong outputs can cause serious harm
- [ ] Check all factual claims against sources
- [ ] Verify all citations exist and say what AI claims
- [ ] Watch for generic/vague framing (sign of AI filler)
- [ ] Ensure you can defend every sentence if asked
- [ ] Check for subtle bias in framing or word choice

#### Code Generation
- [ ] Read and understand every line
- [ ] Test with normal inputs AND edge cases
- [ ] Test with intentionally malformed inputs
- [ ] Verify behavior at array boundaries
- [ ] Check numerical precision for floating-point operations
- [ ] Check for security vulnerabilities (injection, etc.)
- [ ] Verify error handling is appropriate
- [ ] Don't trust AI comments — they may describe wrong behavior
- [ ] Run linters and static analysis
- [ ] Do not assume AI-generated tests are sufficient

#### Literature Review & Research
- [ ] Every citation must be verified to exist
- [ ] Check that citations actually support the claims made
- [ ] Watch for conflation of different papers' findings
- [ ] Be skeptical of "comprehensive" claims
- [ ] AI cannot access recent papers (training cutoff)

#### Data Analysis
- [ ] Validate methodology is appropriate for your data
- [ ] Check all calculations independently
- [ ] Verify statistical tests are correctly applied
- [ ] Don't trust AI interpretation of results
- [ ] Watch for plausible-sounding but wrong analysis

#### Brainstorming & Ideation
- [ ] Use as starting point, not endpoint
- [ ] AI will generate conventional ideas (training bias)
- [ ] Your unique expertise is the value-add
- [ ] Don't let AI narrow your thinking prematurely

#### Automated/Pipeline Usage (per Dr. Khandari)
When AI is part of an automated system rather than interactive use:
- [ ] How will you monitor output quality over time?
- [ ] What happens when the API fails or rate-limits?
- [ ] How do you validate outputs at scale (spot-checking, automated checks)?
- [ ] What is your alerting strategy for unexpected outputs?
- [ ] How do you version your prompts alongside your code?
- [ ] Have you budgeted for API costs at scale?

### Outputs

- Task-specific checklist
- Most common pitfalls for this task type
- Red flags to watch for

### Links To

- **Documentation Guide** (what to save)
- **Reproducibility Checkpoint** (for research use)

---

## Applet 8: Documentation Guide

**Core Question:** "What do I need to save/record?"

**Why Important:** Per Dr. Khandari: "If you can't reproduce a result, it didn't happen." AI-assisted work requires documentation for reproducibility and accountability.

### What to Document

| Element | Why | How |
|---------|-----|-----|
| **Tool used** | Different tools produce different outputs | Full model ID string (e.g., "claude-3-5-sonnet-20241022") — note: providers deploy silent updates |
| **Date of use** | Models change over time | Timestamp |
| **Prompts used** | Same prompt can give different results | Save full prompt text |
| **Parameters** | Temperature, sampling affect outputs | Document settings used |
| **Outputs received** | For verification and reproducibility | Save full response |
| **Modifications made** | Track human contribution | Version history or diff |
| **Verification performed** | Evidence of due diligence | Checklist or notes |

### Why Outputs Vary

LLMs are stochastic systems with temperature-based sampling. Even the same model with temperature=0 can produce different outputs due to batching and numerical precision. Document parameters, not just prompts.

### Documentation Levels by Context

| Context | Minimum Documentation | Recommended |
|---------|----------------------|-------------|
| **Personal exploration** | None required | Tool + date for your records |
| **Lab/team work** | Tool + prompts | Full conversation logs in version control |
| **Grant applications** | Tool + what was AI-assisted | Detailed prompts and outputs |
| **Publications** | Per journal policy | Full audit trail |
| **Regulatory submissions** | Complete audit trail | Everything, timestamped |

### Storage Recommendations

- Save conversations as markdown or PDF
- Include in project documentation
- **Use version control for prompts** (like code) — per Dr. Khandari's lab practice
- Retention: At least as long as the project/publication

### Outputs

- Documentation checklist for your context
- Template for AI interaction logging
- Storage recommendations

### Links To

- **Reproducibility Checkpoint** (for research)
- **Disclosure Wizard** (what to report publicly)

---

## Applet 9: Reproducibility Checkpoint

**Core Question:** "Can you reproduce this AI-assisted analysis in six months?"

**Why Critical:** Per Dr. Khandari: LLM outputs are non-deterministic and model versions change. If you used Claude 3.5 Sonnet in January and reviewers ask questions in June, you may get different outputs from a newer version.

### The Reproducibility Problem

Unlike traditional software, LLMs:
- Produce different outputs from the same prompt
- Are updated by providers without notice
- May be deprecated or replaced entirely
- Don't have semantic versioning you can pin

### Reproducibility Checklist

1. **Did you save the exact model version?**
   - Model ID string, not just "ChatGPT" or "Claude"
   - Date of use (models update without version changes)

2. **Did you save your prompts verbatim?**
   - Full prompt text, not paraphrased
   - Including system prompts if applicable

3. **Did you save the raw outputs before modification?**
   - Complete AI response, not just what you kept
   - Enables verification of what AI contributed

4. **Can you regenerate *similar* (not identical) outputs if challenged?**
   - Same prompt should produce outputs in the same ballpark
   - If wildly different, document why

5. **What's your fallback if the model no longer exists?**
   - Saved outputs are your primary record
   - Consider: Would a different model suffice for verification?

### For Production/Pipeline Systems

- Version your prompts in git alongside code
- Log model responses with timestamps
- Implement regression tests for prompt changes
- Monitor for output quality drift over time

### Outputs

- Reproducibility readiness: `full` | `partial` | `insufficient`
- Gaps to address
- Recommendations for improving reproducibility

### Links To

- **Documentation Guide** (what to save)
- **Pipeline Integration Check** (for automated systems)

---

## Applet 10: Pipeline Integration Check

**Core Question:** "I'm building a system that calls an LLM API. What are the additional considerations?"

**Why Important:** Per Dr. Khandari: Production systems with automated AI calls have different risk profiles than interactive use. There's no human sitting at a chat interface.

### When This Applies

You're building or using:
- Automated prompt generation
- Batch processing of inputs through LLMs
- Downstream systems consuming LLM outputs
- Scheduled or triggered AI analysis
- Any system where AI runs without human review of each interaction

### Integration Checklist

#### Reliability
- [ ] What happens when the API fails? (retry logic, fallback)
- [ ] What happens when you hit rate limits?
- [ ] Do you have timeout handling?
- [ ] Is there graceful degradation if AI is unavailable?

#### Quality Monitoring
- [ ] How will you detect output quality degradation over time?
- [ ] Do you have sample outputs to compare against?
- [ ] What automated checks validate outputs are reasonable?
- [ ] Who reviews samples periodically?

#### Alerting
- [ ] What triggers an alert for unexpected outputs?
- [ ] How quickly can you stop the pipeline if something goes wrong?
- [ ] Who is responsible for responding to alerts?

#### Versioning
- [ ] Are prompts version-controlled like code?
- [ ] Do you log which prompt version produced each output?
- [ ] Can you reproduce historical runs?

#### Cost Control
- [ ] Do you have budget limits/alerts set?
- [ ] Do you understand cost per API call at your volume?
- [ ] What happens if costs spike unexpectedly?

### Outputs

- Pipeline readiness assessment
- Gaps requiring attention before production
- Recommended monitoring dashboard components

### Links To

- **Reproducibility Checkpoint** (pipeline versioning)
- **Documentation Guide** (logging requirements)

---

## Applet 11: Disclosure Wizard

**Core Question:** "Do I need to disclose AI use? How?"

**Why Important:** Norms and requirements for AI disclosure vary by context. Some venues require it; others prohibit AI use entirely.

### Disclosure Requirements by Context

| Context | Typical Requirement | Check |
|---------|---------------------|-------|
| **Course assignments** | Per instructor/syllabus | Ask instructor if unclear |
| **Thesis/dissertation** | Per institution/department | Check graduate school policy |
| **Conference papers** | Per venue policy | Check submission guidelines |
| **Journal articles** | Per journal policy | Check author guidelines |
| **Grant proposals** | Emerging norms; check sponsor | Check RFP and sponsor policies |
| **Internal documents** | Generally not required | Consider team norms |
| **Public communications** | Recommended for transparency | Institution may have policy |

### Decision Points

1. **Does your venue have an explicit AI policy?**
   - Yes, prohibits → Do not use AI
   - Yes, requires disclosure → Follow specified format
   - Yes, permits without disclosure → Document anyway (best practice)
   - No policy → Default to disclosure for transparency

2. **What was AI's role?**
   - Brainstorming/ideation → May not require disclosure
   - Drafting text → Usually requires disclosure
   - Editing/polishing → Gray area; err toward disclosure
   - Analysis/results → Definitely requires disclosure
   - Figures/visualizations → Usually requires disclosure

3. **How to disclose?**
   - Methods section (for research)
   - Acknowledgments (for writing assistance)
   - Author note (for transparency)
   - Per venue's specified format

### Sample Disclosure Language

> "The authors used [Tool Name, version/date] for [specific purpose, e.g., initial draft generation, code scaffolding, literature organization]. All AI-generated content was reviewed, verified, and substantially revised by the authors, who take full responsibility for the final work."

### Outputs

- Disclosure requirement: `required` | `recommended` | `optional` | `not_applicable`
- Suggested disclosure format for this context
- Template language

### Links To

- Institutional policy links (if available)

---

## Applet 12: Model Selection Guide

**Core Question:** "Which local model should I use?"

**Why Important:** Per Dr. Transom: "Choosing between Llama, Mistral, Gemma, etc. matters. Different architectures have different strengths, licensing implications, and resource requirements. Currently this is tribal knowledge."

### When This Applies

You've decided to run models locally (via Tool Picker) and need to choose which model.

### Key Selection Criteria

| Criterion | Considerations |
|-----------|---------------|
| **Task type** | Code generation, general text, instruction following, specialized domains |
| **Model size** | Larger = better quality, more resources needed |
| **Licensing** | Some restrict commercial use; check before deploying |
| **Quantization** | Smaller versions (4-bit, 8-bit) trade quality for speed |
| **Context length** | How much text can the model consider at once? |
| **Fine-tuning** | Do you need to adapt it to your domain? |

### Common Model Families (as of early 2025)

| Family | Strengths | Sizes | License Notes |
|--------|-----------|-------|---------------|
| **Llama 3** | General quality, good instruction following | 8B, 70B, 405B | Meta license (check terms) |
| **Mistral** | Efficient, good code | 7B, 8x7B (Mixtral) | Apache 2.0 for base models |
| **Gemma** | Google's open weights | 2B, 7B | Permissive for research |
| **Qwen** | Multilingual, long context | Various | Check license per version |
| **DeepSeek** | Strong reasoning | Various | Check license |

*Note: This landscape changes rapidly. Check current benchmarks and releases.*

### Resource Requirements Quick Reference

| Model Size | VRAM Needed (FP16) | VRAM (Quantized) | Hardware |
|------------|-------------------|------------------|----------|
| 7-8B | ~16GB | ~6-8GB (4-bit) | Consumer GPU |
| 13B | ~26GB | ~10GB (4-bit) | Workstation GPU |
| 70B | ~140GB | ~40GB (4-bit) | A100 80GB or multi-GPU |

### Running Locally

Common tools for local inference:
- **Ollama**: Easiest setup, Mac/Linux/Windows
- **llama.cpp**: Efficient CPU/GPU inference
- **vLLM**: High-throughput serving
- **text-generation-webui**: GUI for experimentation

### Outputs

- Recommended models for your use case
- Resource requirements summary
- Setup guidance links
- License considerations

### Links To

- **Prompt Engineering Basics** (getting good outputs)

---

## Applet 13: Prompt Engineering Basics

**Core Question:** "How do I get consistent, useful outputs from AI?"

**Why Important:** Per Dr. Transom: Not comprehensive training, but essential guidance on reproducible outputs, prompt structure, and common parameters.

### Core Principles

1. **Be specific** — Vague prompts get vague outputs
2. **Provide context** — Tell the model what it's helping with
3. **Show examples** — Few-shot prompting improves consistency
4. **Specify format** — If you need JSON, code, or structured output, say so
5. **Iterate** — First prompt rarely optimal; refine based on outputs

### Prompt Structure Template

```
[Context/Role]
You are a [role] helping with [task].

[Task Description]
I need you to [specific action].

[Constraints]
- Requirement 1
- Requirement 2
- Format: [desired output format]

[Examples] (optional but powerful)
Input: [example input]
Output: [example output]

[Actual Input]
[Your content here]
```

### Key Parameters

| Parameter | Effect | When to Adjust |
|-----------|--------|----------------|
| **Temperature** | Higher = more creative/random; Lower = more deterministic | Lower (0-0.3) for factual tasks; Higher (0.7+) for creative |
| **Max tokens** | Limits response length | Set based on expected output size |
| **Top-p** | Nucleus sampling threshold | Usually leave at default |
| **System prompt** | Persistent instructions | Use for consistent behavior across conversations |

### Reproducibility Tips

- Save your prompts exactly as used
- Document temperature and other parameters
- Use system prompts for consistent behavior
- For APIs: use same model version string when possible
- Expect variation — same prompt won't give identical outputs

### Prompt Injection Awareness

If building applications that include user input in prompts:
- User input can override your instructions
- Never trust AI output for security decisions
- Sanitize/validate user inputs
- Consider output validation

### Outputs

- Prompt templates for common tasks
- Parameter recommendations
- Reproducibility checklist

### Links To

- **Documentation Guide** (saving prompts)
- **Reproducibility Checkpoint** (ensuring consistency)

---

## Applet 14: AI Ethics Quick Reference

**Core Question:** "What ethical guidelines apply to my AI use?"

**Why Important:** Per Dr. Transom: A reference linking to discipline-specific ethics guidelines for AI development and deployment, separate from academic integrity.

### General Principles

Across disciplines, AI ethics commonly address:

1. **Transparency** — Be clear about AI's role in your work
2. **Accountability** — Humans remain responsible for AI-assisted outputs
3. **Fairness** — Consider disparate impacts across groups
4. **Privacy** — Protect data subjects; minimize data exposure
5. **Beneficence** — AI use should aim to benefit, not harm

### Discipline-Specific Resources

| Discipline | Key Guidelines | Focus Areas |
|------------|---------------|-------------|
| **Computing** | ACM Code of Ethics, IEEE Ethically Aligned Design | Algorithmic fairness, privacy, security |
| **Medicine** | AMA AI Ethics, FDA guidance | Patient safety, clinical validation, informed consent |
| **Psychology** | APA Ethics Code adaptations | Research subjects, assessment validity |
| **Journalism** | SPJ AI guidelines | Transparency, accuracy, attribution |
| **Education** | Various emerging | Academic integrity, equitable access |
| **Law** | ABA guidance | Confidentiality, competence, supervision |

### Research Ethics Considerations

Beyond academic integrity (covered elsewhere), research ethics for AI include:

- **Dual use** — Could your AI application be misused?
- **Environmental impact** — Large model training has significant carbon footprint
- **Labor implications** — AI trained on human-created content; attribution concerns
- **Power concentration** — Who controls the AI systems you depend on?

### Red Flags for Ethical Concern

- [ ] AI making decisions that affect people's opportunities
- [ ] AI used on populations not represented in training
- [ ] AI outputs used without human review in high-stakes contexts
- [ ] AI application that concentrates power or reduces accountability
- [ ] AI use that would be controversial if publicly known

### Outputs

- Relevant ethics guidelines for your discipline
- Ethical considerations checklist for your use case
- Resources for deeper exploration

### Links To

- **Bias Assessment** (fairness considerations)
- **Stakes Assessment** (harm potential)

---

## Applet 15: Teaching Policy Builder

**Core Question:** "How should I handle AI in my course?"

**Why Important:** Faculty need to make deliberate decisions about AI use in their courses, communicate clearly to students, and align with institutional norms.

### Policy Spectrum

| Approach | Description | Best For |
|----------|-------------|----------|
| **Prohibition** | No AI use permitted | High-stakes assessment, foundational skills |
| **Restricted** | AI permitted for specific tasks only | Mixed use cases |
| **Permitted with disclosure** | AI allowed if documented | Process-focused courses |
| **Encouraged** | AI use is part of learning objectives | AI literacy courses |
| **Required** | AI use is mandatory for assignments | Teaching AI skills |

### Decision Points

1. **What are your learning objectives?**
   - If objective is skill development → AI may undermine learning
   - If objective is output quality → AI may be appropriate tool
   - If objective includes AI literacy → Incorporate deliberately

2. **How will you assess learning?**
   - If AI can do the assignment → Reconsider assignment design
   - If AI assists but human judgment is key → May be appropriate
   - Consider: What are you actually measuring?

3. **What's feasible to enforce?**
   - Prohibition is difficult to enforce
   - Detection tools have significant false positive rates
   - Consider: Design assignments AI can't easily do

4. **How will you teach AI use?**
   - If permitting, students need guidance
   - Consider: Verification skills, critical evaluation

### Policy Components to Address

- [ ] Is AI use permitted, restricted, or prohibited?
- [ ] For which assignments/activities?
- [ ] What disclosure is required?
- [ ] What documentation must students keep?
- [ ] How will AI-assisted work be evaluated?
- [ ] What are the consequences of policy violations?
- [ ] Where can students get help with AI tools?

### Outputs

- Policy framework recommendation
- Template syllabus language
- Assignment design considerations

### Links To

- **Student Guidance** (what to share with students)

---

## Applet 16: Student Guidance

**Core Question:** "How should I use AI for my coursework?"

**Why Important:** Students need clear, actionable guidance — not just rules, but understanding of why and how.

### The Student Mental Model

1. **You are responsible for your work.**
   - If you submit it, you own it
   - AI errors become your errors
   - "The AI did it" is not a defense

2. **AI is a tool, not a collaborator.**
   - Use it like a calculator, not a co-author
   - It doesn't understand your assignment
   - It doesn't know your course material
   - It doesn't know when it's wrong

3. **Learning is the point.**
   - If AI does the work, you miss the learning
   - Struggle is part of skill development
   - Consider: What am I actually learning?

### Decision Framework for Students

```
Before using AI, ask yourself:

1. Does my instructor's policy permit this?
   → If no or unclear: ASK FIRST

2. What am I trying to learn from this assignment?
   → If AI bypasses the learning: DON'T USE IT

3. Can I verify and understand AI's output?
   → If no: DON'T USE IT

4. Will I document my AI use?
   → If required: PREPARE TO DOCUMENT

5. Can I defend everything in my submission?
   → If no: REVISE UNTIL YOU CAN
```

### Appropriate vs. Inappropriate Use (General Guidance)

| Generally Appropriate | Generally Inappropriate |
|-----------------------|------------------------|
| Explaining concepts you're learning | Generating answers you submit |
| Debugging your code (that you wrote) | Writing code for you |
| Brainstorming ideas (that you develop) | Writing your essay |
| Checking grammar/clarity | Generating citations |
| Learning how to approach problems | Doing problem sets |

*Note: Always defer to your instructor's specific policy*

### Outputs

- Student-friendly decision framework
- Examples of appropriate/inappropriate use
- Documentation guidance for students

### Links To

- **Verification Gate** (same principles apply)
- **Disclosure Wizard** (student version)

---

## Applet 17: Bias Assessment

**Core Question:** "Could AI bias affect my results?"

**Why Important:** Per Dr. Okonkwo: "Every AI system has biases baked into its training data... This is not a bug to be fixed later. It is fundamental."

### Applicability Check

**First, is bias assessment relevant to your use case?**

| Use Case | Bias Relevance |
|----------|---------------|
| Text about/affecting people | High — proceed with full assessment |
| Image generation with people | High — proceed with full assessment |
| Classification of people | Very High — proceed with full assessment |
| Decision support about people | Very High — proceed with full assessment |
| Code generation (general) | Low-Medium — check for style/pattern biases |
| Scientific data analysis | Domain-dependent — check training data representativeness |
| Physical sciences (no human element) | Lower — may skip demographic bias focus |
| Pure math/logic tasks | Lower — may skip demographic bias focus |

**If your use case has no human element** (e.g., analyzing crystal structures, physics simulations), the demographic bias framing may not apply. However, consider: Is your training/prompt data representative of the phenomena you're studying?

### Where Bias Enters (for applicable use cases)

| Stage | Bias Source | Example |
|-------|-------------|---------|
| **Training data** | Historical patterns in data | Models reflecting societal biases |
| **Model design** | Optimization objectives | What the model learned to prioritize |
| **Deployment context** | Who uses it and how | Different accuracy across demographics |
| **User interaction** | How you prompt and interpret | Confirmation of existing assumptions |

### Bias Risk by Use Case

| Use Case | Bias Risk | Key Concerns |
|----------|-----------|--------------|
| **Text generation** | Medium-High | Gender, cultural, political bias in framing |
| **Code generation** | Medium | Perpetuating coding style biases; security patterns |
| **Analysis/summarization** | Medium | Emphasis, framing, what's included/excluded |
| **Image generation** | High | Demographics, stereotypes, representation |
| **Recommendation** | High | Filter bubbles, popularity bias |
| **Classification (people)** | Very High | Demographic disparities in accuracy |
| **Decision support** | Context-dependent | Amplifies historical decision patterns |

### Discipline-Specific Bias Concerns

| Track | Primary Bias Concerns |
|-------|----------------------|
| **Human subjects / social sciences** | Demographic representation, cultural assumptions, stereotype reinforcement |
| **Physical sciences / engineering** | Training data coverage of physical phenomena, domain shift |
| **Quantitative / financial** | Market data biases, survivorship bias, look-ahead bias |
| **Creative / humanities** | Cultural representation, Western-centric training, appropriation |

### Bias Mitigation Strategies

- [ ] Test with diverse inputs across relevant dimensions
- [ ] Disaggregate results by relevant demographics (when applicable)
- [ ] Have diverse reviewers check outputs
- [ ] Document known limitations
- [ ] Don't deploy for high-stakes decisions on people without audit
- [ ] Report bias issues you discover

### Outputs

- Bias relevance: `high` | `medium` | `low` | `not_primary_concern`
- Relevant bias concerns for this use case
- Mitigation strategies
- Documentation recommendations

### Links To

- **Verification Gate** (bias checking as verification)
- **AI Ethics Quick Reference** (broader ethical context)

---

## Implementation Notes

### Technical Approach

Each applet should be:
- **Vue component** following existing patterns
- **Config-driven** where possible (questions/options in YAML)
- **Standalone route** (`/ai/stakes`, `/ai/data-check`, etc.)
- **Linkable** with query params to pre-fill from previous applet

### State Management

- Use session storage for tracking completed applets
- Allow saving/resuming progress
- Export summary as PDF/markdown

### Feedback System

After completing each applet, users can:
- **Upvote** (this was helpful)
- **Downvote** (this wasn't helpful)
- Optional: Brief comment on why

Aggregate feedback informs future revisions and identifies applets needing improvement.

### Integration Points

- **Glossary** → AI terms in acronyms.yaml (if shared config)
- **Standalone deployment** → No dependencies on other applications

### Phase 1 (Core Flow)

1. Stakes Assessment
2. Data Check
3. IRB/Human Subjects Workflow
4. Tool Picker
5. Task Fit
6. Verification Gate

### Phase 2 (Supporting + Reference)

7. Pitfall Checklist
8. Documentation Guide
9. Reproducibility Checkpoint
10. Pipeline Integration Check
11. Disclosure Wizard
12. Model Selection Guide
13. Prompt Engineering Basics
14. AI Ethics Quick Reference

### Phase 3 (Teaching + Specialized)

15. Teaching Policy Builder
16. Student Guidance
17. Bias Assessment

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | Initial | 12 applets drafted |
| 0.2 | Post-Round 2 | Scope clarified to Generative AI; Stakes Assessment moved first; Added 6 applets (IRB/Human Subjects, Reproducibility Checkpoint, Pipeline Integration, Model Selection Guide, Prompt Engineering Basics, AI Ethics Quick Reference); Expanded code verification; Added discipline branching to Bias Assessment; Added feedback mechanism |
| 0.3 | Decoupling | Removed Compute Estimator (belongs in infrastructure planning tools); Removed all Research Data Planner dependencies; App is now fully standalone and extractable |

---

## Acknowledgments

This specification incorporates feedback from expert reviewers:
- Dr. Yev Transom (Computer Science) — code verification, model selection, prompt engineering
- Dr. Raj Khandari (Business School) — reproducibility, pipeline integration, sequencing
- Dr. Tessa Nordvik (Aerospace Engineering) — scope clarification for generative vs. research ML
- Dr. Ada Okonkwo (Medical Informatics) — IRB workflow, regulatory considerations, de-identification

---
---

# Companion Section: Research ML / Scientific Computing

**Status:** Planning
**Scope:** Training and deploying custom ML models for scientific research
**Primary audience:** Researchers using ML as a research method, not just a tool

This section addresses what the main Generative AI guide explicitly excludes: physics-informed neural networks, surrogate modeling, computer vision for experimental data, and other cases where researchers train models on their own data.

---

## Why This Needs Separate Treatment

Per Dr. Nordvik: "The spec assumes 'AI' means 'large language models for text generation.' That is one small corner of how AI is actually used in research."

Key differences from Generative AI:

| Aspect | Generative AI | Research ML |
|--------|---------------|-------------|
| **Primary activity** | Prompting existing models | Training custom models |
| **Verification** | Check outputs against sources | Validate against physics/ground truth |
| **Failure mode** | Hallucination, factual errors | Physically impossible results, numerical instability |
| **Reproducibility** | Save prompts + outputs | Save weights, seeds, hyperparameters, training data |
| **Compute** | API costs or local inference | GPU clusters for training |
| **Expertise needed** | Domain expertise to verify | ML expertise + domain expertise |

---

## Proposed Applets

### R1: Scientific Validity Check

**Core Question:** "Does my AI-generated solution respect physical/mathematical constraints?"

**Decision Points:**
- Does your model need to respect conservation laws?
- Are there known boundary conditions?
- Does dimensional analysis hold?
- Have you tested against analytical solutions where available?

**Failure Examples:**
- Heat transfer model that violates second law of thermodynamics
- Fluid simulation that doesn't conserve mass
- Predictions outside physically plausible ranges

---

### R2: Numerical Stability Assessment

**Core Question:** "Have you tested edge cases and extreme parameter ranges?"

**Checklist:**
- [ ] Tested with out-of-distribution inputs
- [ ] Verified behavior at parameter extremes
- [ ] Checked for numerical precision issues
- [ ] Tested with noisy/corrupted inputs
- [ ] Validated across different batch sizes

---

### R3: Model Validation Framework

**Core Question:** "How do you know your model works?"

**Validation Approaches:**
- Comparison to analytical solutions (where available)
- Comparison to experimental data
- Comparison to established numerical methods
- Cross-validation across datasets/conditions
- Uncertainty quantification

**Documentation Requirements:**
- Validation dataset (separate from training)
- Performance metrics with confidence intervals
- Known failure modes and limitations
- Conditions where model should NOT be used

---

### R4: Training Reproducibility

**Core Question:** "Can someone else reproduce your trained model?"

**What to Document:**
- Training data (or how to obtain it)
- Model architecture (code or specification)
- Hyperparameters (all of them)
- Random seeds
- Training environment (hardware, libraries, versions)
- Training procedure (epochs, early stopping criteria)
- Final model weights (or checkpoint)

**Version Control:**
- Code in git
- Data versioning (DVC or similar)
- Experiment tracking (MLflow, W&B, or manual logs)

---

### R5: Research ML Tool Selection

**Core Question:** "What frameworks and infrastructure do I need?"

**Framework Selection:**
| Use Case | Common Frameworks |
|----------|-------------------|
| Physics-informed NNs | DeepXDE, NVIDIA Modulus, custom PyTorch |
| Geometric deep learning | PyTorch Geometric, DGL |
| Scientific computing | JAX, Julia Flux |
| Computer vision | PyTorch, TensorFlow |
| General research | PyTorch (dominant in academia) |

**Infrastructure Considerations:**
- Local workstation vs. HPC cluster
- Cloud burst for deadlines
- Data locality constraints
- Multi-GPU training requirements

---

### R6: Deployment Considerations

**Core Question:** "How will this model be used after training?"

**Deployment Scenarios:**
- Research artifact (others reproduce/extend)
- Lab tool (internal use)
- Digital twin component (production system)
- Safety-critical application

**For Safety-Critical:**
- What verification is required before deployment?
- Who approves model for use?
- How do you monitor for drift?
- What's the rollback procedure?

---

## Implementation Notes

This section is **planned but not yet specified in detail**. Development priority is lower than the main Generative AI applets.

Recommended approach:
1. Build core Generative AI applets first
2. Return to this section with input from computational science faculty
3. Consider whether this becomes a separate app or integrated section

---
---

# Companion Section: Generative AI for Health

**Status:** Planning
**Scope:** Using generative AI in healthcare, clinical research, and FDA-regulated contexts
**Primary audience:** Medical informatics, clinical researchers, health sciences faculty

This section provides deep-dive guidance for the regulatory and compliance requirements specific to healthcare AI use.

---

## Why This Needs Separate Treatment

Per Dr. Okonkwo: "For anyone doing human subjects research, the IRB dimension is not a footnote — it is often the primary determinant of what you can do."

Healthcare AI involves overlapping regulatory frameworks that require specialized guidance:

| Framework | Governs | Key Concern |
|-----------|---------|-------------|
| **HIPAA** | Protected health information | Data privacy, BAAs, minimum necessary |
| **FDA** | Medical devices, clinical claims | When does AI become a regulated device? |
| **IRB** | Human subjects research | Consent, protocol amendments, data sharing |
| **FERPA** | Student health records (university) | Educational context health data |
| **State laws** | Varies | Additional privacy requirements |

---

## Proposed Applets

### H1: HIPAA Compliance Deep Dive

**Core Question:** "Does my AI use comply with HIPAA requirements?"

**Decision Points:**
- Is this data PHI (Protected Health Information)?
- Who is the covered entity?
- Is the AI tool provider a business associate?
- Do you have a BAA in place?
- Are you meeting minimum necessary standards?

**BAA Requirements:**
- Consumer AI tools (ChatGPT Free, Claude Free) → No BAA available → Cannot use with PHI
- Enterprise tools → BAA may be available → Verify before use
- Local models → No BAA needed (data doesn't leave your control)

**Common Mistakes:**
- Assuming de-identified data isn't covered (re-identification risk)
- Using consumer tools for "quick analysis" of patient data
- Sharing PHI with tools lacking BAAs
- Not documenting AI use in compliance records

---

### H2: De-identification Rigor

**Core Question:** "Is your data truly de-identified?"

**HIPAA De-identification Methods:**

**Safe Harbor (18 identifiers removed):**
- Names, addresses, dates (except year), phone/fax, email
- SSN, MRN, health plan numbers, account numbers
- Certificate/license numbers, vehicle IDs, device IDs
- URLs, IPs, biometric identifiers, photos, any unique identifier

**Expert Determination:**
- Statistical/scientific expert certifies low re-identification risk
- Must document methods and results
- More flexible but requires expertise

**AI-Specific Risks:**
- Free-text clinical notes may contain identifiers even after "scrubbing"
- Rare condition + demographics = potential re-identification
- AI pattern matching may re-identify from seemingly anonymous data
- Model training on identified data → model may leak information

**Recommendation by Data Type:**
| Data Type | Cloud AI Risk | Recommendation |
|-----------|---------------|----------------|
| Fully identified PHI | Prohibited | Local models only with full safeguards |
| Safe Harbor de-identified | Medium | Enterprise with BAA or local |
| Expert determination | Lower | Verify expert considered AI context |
| Aggregated statistics | Low | Generally acceptable |

---

### H3: IRB Protocol Alignment

**Core Question:** "Does your IRB protocol cover this AI use?"

*(Expanded from main Applet 3, healthcare-specific)*

**Protocol Review Checklist:**
- [ ] Protocol explicitly mentions AI/ML tools?
- [ ] Consent form addresses AI-assisted analysis?
- [ ] Data sharing with AI providers addressed?
- [ ] Specific tools named or categories permitted?
- [ ] Any prohibitions on computational analysis?

**When Amendment is Likely Needed:**
- Protocol predates widespread AI availability
- Adding cloud-based AI analysis
- AI will analyze identifiable data
- AI analysis wasn't in original research design

**Sample Amendment Language:**
> "We will use [AI tool name] with [BAA/data protection measure] for [specific analysis purpose]. Data shared with this tool will be [de-identified per Safe Harbor / limited to X fields / processed locally]. AI-generated outputs will be [verified by domain expert / used for preliminary analysis only / documented per attached protocol]."

---

### H4: FDA Regulatory Pathway

**Core Question:** "Does my AI use trigger FDA oversight?"

**When AI Becomes a Medical Device:**
The FDA regulates software as a medical device (SaMD) when it:
- Is intended to diagnose, treat, cure, or prevent disease
- Makes clinical decisions or recommendations
- Provides patient-specific analysis for clinical use

**Risk Categories:**
| Category | Description | Examples | Oversight Level |
|----------|-------------|----------|-----------------|
| **Non-device** | General wellness, administrative | Scheduling, general health info | None |
| **Class I** | Low risk | Simple calculators, logging | Minimal |
| **Class II** | Moderate risk | Clinical decision support | 510(k) clearance |
| **Class III** | High risk | Diagnostic, life-sustaining | PMA approval |

**Research vs. Clinical Use:**
- Research use only → Generally not regulated as device
- Research leading to clinical claims → Plan regulatory pathway early
- Clinical deployment → Regulatory review required

**Key Questions:**
1. Will AI outputs influence patient care decisions?
2. Are you making diagnostic or treatment claims?
3. Is this for research only or eventual clinical use?
4. What's your validation strategy for clinical context?

**When to Consult Regulatory Affairs:**
- Any AI that will touch clinical workflows
- Research intended to lead to clinical products
- Uncertainty about device classification
- Before making any clinical claims about AI capabilities

---

### H5: Clinical Validation Requirements

**Core Question:** "How do you validate AI for clinical use?"

**Validation vs. Verification:**
- **Verification:** Does the AI work correctly? (technical)
- **Validation:** Does it work for this clinical purpose? (clinical)

**Clinical Validation Elements:**
- Representative patient population
- Comparison to clinical gold standard
- Performance across demographic subgroups
- Real-world clinical conditions (not just curated data)
- Failure mode analysis

**Bias Auditing for Clinical AI:**
- Performance disaggregated by race, ethnicity, sex, age
- Analysis of patient populations in training data
- Testing on populations your institution serves
- Documentation of known disparities

**Ongoing Monitoring:**
- Performance tracking post-deployment
- Drift detection
- Adverse event reporting
- Update and revalidation procedures

---

### H6: Federated Learning & Data Locality

**Core Question:** "What if the data cannot leave its source location?"

**When Data Cannot Move:**
- Multi-site clinical studies
- Hospital system data governance
- International collaborations (GDPR, local laws)
- Institutional policy restrictions

**Federated Approaches:**
- Model training happens at each site
- Only model updates (not data) are shared
- Central aggregation of learned parameters
- Data never leaves institutional boundaries

**Implementation Considerations:**
- Requires compatible infrastructure at each site
- Coordination overhead is significant
- May need IRB approval at each site
- Privacy guarantees of aggregation method

**When to Consider:**
- Multi-institutional health research
- Sensitive populations (mental health, HIV, etc.)
- Regulatory uncertainty across jurisdictions
- Institutional policy prohibits external data sharing

---

### H7: Consent & Transparency

**Core Question:** "Do participants understand AI will analyze their data?"

**Consent Considerations:**
- Was AI analysis foreseeable when consent was obtained?
- Is "computational analysis" sufficient, or must AI be explicit?
- Do participants have option to opt out of AI analysis?
- Is consent for cloud processing vs. local different?

**Emerging Best Practices:**
- Explicit mention of AI/ML in new consent forms
- Explanation of what AI analysis means (plain language)
- Distinction between AI for research vs. AI for care
- Transparency about data sharing with AI providers

**For Existing Studies:**
- Review consent language for ambiguity
- Consider reconsent if significantly different use
- Document IRB determination if proceeding without reconsent
- Be prepared to defend decisions to participants

---

## Pathways Through Health AI Guidance

**Scenario: Using ChatGPT to analyze de-identified patient feedback**
1. H2 (De-identification Rigor) → Verify de-identification method
2. H1 (HIPAA Compliance) → Confirm no PHI, or get BAA
3. H3 (IRB Protocol) → Check if covered
4. Main Applet 4 (Tool Picker) → Select appropriate tool

**Scenario: Developing AI diagnostic tool for clinical use**
1. H4 (FDA Regulatory) → Determine device classification early
2. H5 (Clinical Validation) → Plan validation strategy
3. H3 (IRB Protocol) → Research protocol for development
4. H1 (HIPAA) → Data handling throughout development
5. Main Applet 9 (Reproducibility) → Document for regulatory submission

**Scenario: Multi-site clinical study with AI analysis**
1. H6 (Federated Learning) → Can data move, or must analysis be distributed?
2. H3 (IRB Protocol) → Approval needed at each site
3. H1 (HIPAA) → BAAs across institutions if data moves
4. H7 (Consent) → Consistent consent across sites

---

## Implementation Notes

This section is **planned but not yet specified in detail**. Development priority depends on institutional needs.

Recommended approach:
1. Build core Generative AI applets first
2. Validate Health section with compliance office and IRB
3. Consider whether this becomes a separate app for health sciences
4. May need institution-specific customization (local BAA status, IRB contacts)

---

## Cross-Reference to Main Applets

Health-specific applets supplement, not replace, main applets:

| Health Applet | Supplements Main Applet |
|---------------|------------------------|
| H1 (HIPAA) | Applet 2 (Data Check) |
| H2 (De-identification) | Applet 2 (Data Check) |
| H3 (IRB Protocol) | Applet 3 (IRB/Human Subjects) |
| H4 (FDA Regulatory) | Applet 1 (Stakes Assessment) |
| H5 (Clinical Validation) | Applet 6 (Verification Gate) |
| H6 (Federated Learning) | Applet 4 (Tool Picker) |
| H7 (Consent) | Applet 3 (IRB/Human Subjects) |
