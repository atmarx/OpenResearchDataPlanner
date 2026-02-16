# AI Guidance Workflows: Faculty Review

> Personas from the OpenResearchDataPlanner UX testing pool evaluate the AI Guidance applets after implementation.

**Yes, we know this is long.** These five have opinions. You asked.

---

## Dr. Raj Khandari (Business School - Production ML)

### First Impressions

*"I'll be honest — when I saw 'AI Guidance' in the nav, I expected another 'don't plagiarize' lecture. This is... actually useful. The Task Fit applet understands that I'm not asking ChatGPT to write my papers. I'm building production ML systems that happen to use LLMs as components."*

### What Works

**Stakes Assessment** — *"Finally, someone who understands that 'AI risk' isn't just about hallucinated citations. My market sentiment models run inference at 5:30 AM. If they're wrong, trading decisions happen before anyone can verify. The stakes gradient here captures that."*

**Tool Picker** — *"The distinction between 'local model' vs 'API' matters a lot for finance. Proprietary data can't touch OpenAI's servers. Glad to see this called out explicitly."*

**Pipeline Integration** — *"This is where the tool surprised me. It actually asks the right questions: rate limiting, failure handling, monitoring at scale. My PhD students need this."*

### Concerns

**Missing: MLOps considerations** — *"The Verification Gate assumes human-in-the-loop verification. But what about continuous retraining? My models retrain daily on new market data. The 'can you verify the output' question doesn't map cleanly to automated pipelines where outputs are validated statistically, not manually."*

**Feature stores and drift** — *"No mention of feature drift or data quality monitoring. For production ML, knowing that your inputs have shifted is half the battle."*

### Verdict

**7/10** — Useful for research-context AI use. Would be 9/10 if Pipeline Integration went deeper on MLOps lifecycle. Still better than anything else I've seen for academic audiences.

---

## Dr. Tessa Nordvik (Aerospace Engineering - Physics-Informed AI)

### First Impressions

*"I expected this to be about ChatGPT for writing papers. Instead, it actually acknowledges different AI modalities. The 'What kind of AI task is this?' question in Task Fit includes data analysis and code generation — that's my world."*

### What Works

**Data Check** — *"Perfect for my multi-tier lab. I have L1 open benchmark data AND L3 NASA CUI data AND L2 GE partnership data. The applet helps students think through which data touches which tool."*

**Verification Gate** — *"'Can you verify the output?' is the right question. For PINNs, I CAN verify — I have the physics to check against. For pure LLM outputs, I often can't. Good framing."*

**Common Pitfalls (Code Generation checklist)** — *"Read every line. Test edge cases. Don't trust AI comments. This is exactly what I tell my students about Copilot. Now I can point them to this."*

### Concerns

**Physical sciences exemption isn't quite right** — *"The Bias Assessment says 'lower relevance' for physical sciences. That's mostly true, but PINNs trained on biased simulation data absolutely carry that bias into predictions. The 'training data coverage' note helps, but could be stronger."*

**Missing: Hybrid workflows** — *"My workflow is: generate physics code with Copilot → verify against analytical solutions → integrate into simulation. The applets treat tasks as discrete, but I chain them together."*

### Verdict

**8/10** — Actually respects that not all AI use is 'writing with ChatGPT.' The physical sciences track in Common Pitfalls shows someone thought about engineering use cases.

---

## Dr. Ada Okonkwo (Medical Informatics - Clinical AI)

### First Impressions

*"I've been waiting for something like this. My students come to me wanting to use GPT-4 to analyze medical records. The answer isn't 'no' — it's 'here's how to think through whether you can.'"*

### What Works

**IRB/Human Subjects** — *"This is crucial. Most researchers don't even think about whether their IRB protocol covers AI use. It probably doesn't — most were written before ChatGPT. The 'does your protocol need amendment?' question is exactly right."*

**Data Check** — *"Tier-aware data check is essential. My lab has L1 benchmark data, L3 clinical data, and everything in between. Students need to think about this BEFORE they paste something into Claude."*

**Disclosure Framework** — *"The venue-specific guidance is helpful. Different journals have different policies. The 'publication' path captures this well."*

**Bias Assessment** — *"'Classification of people' flagged as very-high relevance. Yes. Exactly. My medical imaging models classify patients. The failure modes are demographic, not just technical."*

### Concerns

**HIPAA is understated** — *"Data Check mentions 'sensitive data' but the specific HIPAA implications could be stronger. Pasting PHI into an API — even accidentally — is a breach. The consequences aren't theoretical."*

**Clinical validation gap** — *"AI outputs that inform clinical decisions need a different verification standard than research outputs. The Verification Gate is good, but 'can you verify' means something different when the output affects patient care."*

**FDA not addressed** — *"For clinical AI heading toward deployment, FDA documentation requirements are substantial. Not every project needs this, but advanced users should know it exists."*

### Suggestions

*"Add a 'Clinical/Healthcare' track in Common Pitfalls that specifically addresses:*
- *De-identification before any API use*
- *BAA requirements for AI tools*
- *Validation requirements for clinical decision support*
- *FDA pathway awareness for anything deployed"*

### Verdict

**7.5/10** — Strong foundation. The IRB and Bias applets show real understanding. Would be 9/10 with explicit HIPAA callouts and a clinical track in pitfalls.

---

## Marco Delavigne (IT - Research Computing, 28 years)

### First Impressions

*"I've been explaining 'don't paste research data into ChatGPT' for three years. If this tool actually gets researchers to think before they type, I'll buy the developers dinner."*

### What Works

**Tier integration** — *"The fact that it pulls tier context from the Research Data Planner session is smart. Researchers already went through tier classification — reuse that work."*

**Stakes Assessment first** — *"Good. Make them think about consequences before showing them shiny tools. The order matters."*

**Verification Gate as hard gate** — *"'If you cannot verify it, you cannot use it.' YES. I've been saying this. Put it in bold. Put it in red. Make them click 'I understand' three times."*

**Documentation Guide** — *"'If you can't reproduce a result, it didn't happen.' I've seen too many researchers ask me to recover 'the model I trained last year' with no versioning, no documentation, nothing. This might help."*

### Concerns

**Will they actually use it?** — *"The best documentation is the documentation people read. Is this going to be another link I send that nobody clicks? The applet-per-question design might help — bite-sized is better."*

**Edge cases** — *"What about the researcher who says 'I'm just brainstorming, I don't need to go through all this'? Then they paste something they shouldn't. The Stakes Assessment helps, but researchers are optimistic about their own stakes."*

**Teaching Policy is great, but...** — *"Faculty will use this to write syllabus language. That's helpful. But enforcement? That's still on them. Maybe a note that 'policy without enforcement is theater.'"*

### What I'll actually use

*"I'm going to point researchers to these three:*
1. *Data Check — before they ask me 'can I use GPT for my HIPAA project?'*
2. *Verification Gate — when they ask me to recover outputs they can't reproduce*
3. *Disclosure Framework — when they ask if they need to disclose AI use*

*If this cuts my 'ChatGPT tier confusion' tickets by 20%, it's worth it."*

### Verdict

**7/10** — Good structure, right questions. The proof is in the ticket counts. Check back in six months.

---

## Piper Nakamoto (IT Service Desk, 1.5 years)

### First Impressions

*"Oh, this is helpful! When researchers ask me about AI use, I usually have to escalate to Marco. Now I have something to walk them through."*

### What Works

**Step-by-step structure** — *"Each applet has a clear question and guided flow. I can screen-share this and walk someone through it, even if I don't know all the answers myself."*

**Teaching Policy Builder** — *"Faculty keep asking me about AI policies for their courses. I didn't know what to tell them. Now I can point them here and they can generate their own syllabus language."*

**Tool Picker decision flow** — *"'Can your data touch an external API?' — that's exactly the question I've been trying to ask, but didn't know how to phrase. This frames it clearly."*

**Common Pitfalls checklists** — *"Printable. I can send researchers the checklist for their task type. They can check boxes. It feels actionable."*

### What I'll use for support

*"New workflow:*
1. *Researcher asks about AI use → send them to /ai*
2. *They complete Stakes + Data Check*
3. *If they come back with questions, I have context*

*This should help me triage faster."*

### Things I needed Marco to explain

- *"What does 'word boundary' mean in the acronym tooltip settings?"* (probably not relevant to AI guidance)
- *"The Verification Gate talks about 'authoritative sources' — for some fields, I don't know what those are. But researchers should."*
- *"Pipeline Integration assumes technical knowledge I don't have. But I don't think I'm the audience for that applet."*

### Verdict

**8/10** — I can use this on Monday. The guided flows let me help researchers without needing to know everything myself.

---

## Summary: Cross-Persona Patterns

### Universal Praise

| Applet | Why It Works |
|--------|--------------|
| Stakes Assessment | Forces reflection before tool selection |
| Data Check | Tier-aware, catches compliance issues early |
| Verification Gate | Hard gate framing is appreciated by all |
| Documentation Guide | Addresses reproducibility directly |

### Common Critiques

| Issue | Who Raised It |
|-------|---------------|
| Pipeline/MLOps depth | Raj, Tessa |
| Clinical/HIPAA specificity | Ada |
| Edge case handling | Marco |
| Physical sciences nuance in bias | Tessa |

### Suggested Additions

1. **Clinical/Healthcare track** — HIPAA, de-identification, FDA awareness (Ada)
2. **MLOps lifecycle** — continuous retraining, drift monitoring, automated validation (Raj)
3. **Chained task guidance** — when one AI task feeds another (Tessa)
4. **Enforcement guidance** — policy without teeth is theater (Marco)

### Net Assessment

> *"This is better than 'don't use AI.' It respects that we're going to use it and helps us think clearly about how."* — Dr. Nordvik

> *"Show me the ticket reduction in six months. Then I'll be impressed."* — Marco Delavigne

---

*Review compiled from persona perspectives. All quotes are fictional but represent authentic user concerns based on detailed persona development.*
