# Dr. Ada Okonkwo — AI Applets Spec Review

**Persona:** Associate Professor, Medical Informatics (Clinical AI, FDA/HIPAA)
**Document Reviewed:** AI-GUIDANCE-APPLETS.md (12 applet specification)

---

## Review of AI Guidance Applets Specification

*Dr. Ada Okonkwo, Associate Professor of Medical Informatics, Northwinds University*

---

I appreciate being consulted on this specification. As someone who has spent her career at the intersection of AI capability and regulatory reality, I have thoughts — both on what this document does well and where it falls short for high-stakes research contexts.

### What This Spec Gets Right

First, the good news. The fundamental architecture here is sound. Starting with Data Check as the gateway is exactly right — I tell my students constantly that data sensitivity determines everything downstream. The verification gate concept (Applet 4) captures something essential that most AI guidance ignores: if you cannot verify it, you cannot use it. I was pleased to see that quoted in the spec. That principle alone would prevent most AI misuse in research contexts.

The Tool Picker's tiered approach — consumer, enterprise, institutional, local — reflects real-world options accurately. The explicit prohibition of consumer tools for HIPAA data is correct and non-negotiable. The Bias Assessment applet addresses something most guidance documents treat as an afterthought; putting it as a first-class applet demonstrates appropriate seriousness.

The documentation requirements in Applet 7 align well with reproducibility standards. For my FDA validation work, I need timestamped audit trails of every computational step. Seeing that level of rigor suggested even for general research use is encouraging.

### Critical Gaps

Now, the problems.

**1. No IRB/Human Subjects Workflow**

The Data Check mentions "human subjects research data — depends on IRB/consent" and then... stops. This is a massive gap. For anyone doing human subjects research, the IRB dimension is not a footnote — it is often the primary determinant of what you can do. I need an applet that walks through: Does your IRB protocol mention AI tools? Were participants consented for AI-assisted analysis? Does use of cloud AI tools constitute data sharing under your protocol?

Many researchers discover mid-project that their consent forms say nothing about AI. This creates real compliance problems. An IRB-focused applet should be in Phase 1.

**2. Insufficient Treatment of De-identification**

The spec mentions de-identification in passing but does not address its complexity. De-identification is not a binary state. HIPAA Safe Harbor has specific requirements. Expert determination requires documentation. And critically — the spec correctly warns that "AI tools may re-identify through pattern matching" but offers no guidance on what to do about this.

When I feed de-identified imaging data into a cloud AI service, am I creating re-identification risk? The answer is context-dependent and requires careful analysis. The Data Check applet should branch into a de-identification sub-workflow for health and education data.

**3. Missing Regulatory Compliance Pathways**

The spec treats HIPAA, FDA, and FERPA as flags to raise, not as regulatory frameworks with specific requirements. For clinical AI work, I need to know:

- Does using this AI tool create a "Medical Device" under FDA definitions?
- If I use AI to analyze data for a clinical study, how does this affect my 510(k) submission?
- What documentation does FDA require for AI-assisted analysis in regulatory submissions?

An additional applet — call it "Regulatory Pathway Assessment" — should exist for researchers working in FDA-regulated contexts. This is not a niche concern; AI in healthcare is a multi-billion dollar research area.

**4. Federated Learning and Data-That-Cannot-Move**

The spec assumes data can be classified and then matched to tools. But what about data that cannot be copied to any external system? My federated learning projects coordinate across five hospital systems. The data never leaves those hospitals. The models are trained in place.

The Tool Picker should explicitly address: What if the data cannot move? Local models become mandatory not by choice but by regulatory requirement. This deserves explicit treatment.

### Sequencing Issues

The Phase 3 placement of Bias Assessment troubles me. For any AI work involving human subjects, images of people, or clinical applications, bias assessment should happen early — during project design, not as a final check. In my lab, bias auditing is part of our initial IRB submission. Relegating it to Phase 3 suggests it is optional polish rather than fundamental methodology.

Similarly, the Compute Estimator's placement in Phase 3 is questionable. Grant proposals require compute estimates upfront. Researchers need this during project planning, not after they have already made tool and approach decisions.

### Content Accuracy Issues

The Task Fit table lists "Clinical decisions — No" with only "Regulatory and safety concerns" as the note. This is both too strong and too weak. FDA has cleared AI systems for clinical decision support — they exist, they are legal, they require specific validation pathways. The categorical "No" is wrong. But the regulatory framework governing clinical AI is extensive and complex. The note should be: "Requires FDA pathway analysis; see Regulatory Pathway Assessment."

The Tool Categories table should explicitly mention HIPAA Business Associate Agreements (BAAs) for enterprise tools. "Enterprise agreements" is too vague. A BAA is a specific legal instrument with specific requirements.

### Discipline-Specific Branching

Yes, absolutely. At minimum:

- **Biomedical/Health**: Must branch into HIPAA, FDA, and human subjects pathways
- **Education**: Must branch into FERPA-specific considerations
- **Defense-funded research**: Export control deserves dedicated treatment, not just a flag

The spec acknowledges export control but does not provide actionable guidance. For researchers with ITAR-controlled data, the answer is often "consult security office" — but they need to know enough to recognize when that consultation is required.

### Tone

The tone is generally appropriate. The spec is direct without being preachy. However, phrases like "AI will sound confident even when wrong" in the Pitfall Checklist could be strengthened for high-stakes contexts. In clinical AI, confident-but-wrong outputs can kill people. The seriousness of verification in healthcare contexts deserves explicit emphasis beyond the general framing.

### Missing Applet: Model Provenance and Validation

For research contexts, I need an applet addressing: What model are you using? What was it trained on? Has it been validated for your population/domain? This matters especially for medical imaging, where a model trained on one demographic may perform poorly on another. The Bias Assessment touches this but does not provide the methodological framework for model validation that regulated research requires.

### Summary of Recommended Changes

1. Add IRB/Human Subjects Applet to Phase 1
2. Expand Data Check with de-identification sub-workflow
3. Add Regulatory Pathway Assessment applet for FDA-governed work
4. Move Bias Assessment to Phase 1 or early Phase 2
5. Add explicit guidance for data-that-cannot-move scenarios
6. Include BAA requirements explicitly in Tool Picker
7. Implement discipline branching for Biomedical, Education, and Defense-funded research
8. Consider Model Provenance applet for research contexts

The foundation here is solid. With these additions, particularly the regulatory and human subjects components, this could serve researchers in high-stakes domains effectively. Without them, it risks being useful only for lower-stakes use cases where the consequences of getting it wrong are merely embarrassing rather than harmful.

---

*I am happy to review revised versions or consult on the biomedical/regulatory content specifically.*
