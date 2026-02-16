# Multi-Regulatory Healthcare Research Guidance

**HIPAA, FDA, and Other Frameworks for Faculty and Researchers**

---

## Overview

This directory contains comprehensive guidance on **multiple regulatory frameworks** for healthcare research and AI development in cloud-first environments. The guidance addresses:

**Primary Focus**: **HIPAA Privacy Rule** (protected health information)
**Also Covers**: **FDA medical device regulations** (software and AI tools), Common Rule, GINA, Part 2

**Why Multi-Regulatory?** A single AI clinical tool may require:
- **HIPAA compliance** (for PHI used in training/deployment)
- **FDA clearance** (if it's a medical device)
- **IRB approval** (if training/validation involves human subjects research)

The guidance is tailored for **faculty spanning instructional and clinical settings**:
- **Research**: Using PHI for studies, training AI models, multi-site collaboration
- **Teaching**: Using patient cases in lectures, developing educational AI tools
- **Clinical Practice**: EHR systems, telemedicine, deploying AI clinical decision support
- **AI/ML Development**: Understanding when FDA regulates, PCCP for model updates, cloud platforms

---

## Documentation Structure

We provide a **two-tier approach** to meet different needs:

### 1. Quick Reference Guide (Start Here)

**[HIPAA Research Quick Reference Guide](HIPAA-RESEARCH-QUICK-REFERENCE.md)** (~14 pages)

**Use when**:
- Need rapid answer to "Does HIPAA apply?"
- Looking for checklists and decision flowcharts
- Planning research project (what HIPAA requirements apply?)
- Teaching HIPAA basics to students/staff

**Key Features**:
- 6 Privacy Principles with one-page summaries each
- De-identification decision tree
- Research data workflow flowcharts
- Cloud/AI safeguards checklist
- Red flags and quick wins

**Time to value**: 5-10 minutes to scan, 30 minutes to read thoroughly

---

### 2. Detailed Technical Guide (For Deep Dives)

**[HIPAA Research Detailed Technical Guide](HIPAA-RESEARCH-DETAILED-GUIDE.md)** (~80 pages)

**Use when**:
- Developing educational materials requiring regulatory grounding
- Addressing complex/non-routine situations
- Need regulatory citations (45 C.F.R. § references)
- Want comprehensive FAQ coverage from HHS guidance
- Writing institutional policies

**Key Features**:
- Complete coverage of 6 Privacy Principles
- Extensive research scenarios (AI models, multi-site studies, teaching contexts)
- Template documents (BAA, DUA, authorization forms)
- State law preemption analysis
- Expert determination methods
- Integration with OpenDataPlanner L3/L4 tiers

**Time to value**: Reference guide (search for specific topics), 3-4 hours to read thoroughly

---

## When to Use Each Guide

| Your Need | Use This |
|-----------|----------|
| **Quick decision during research planning** | Quick Reference |
| **Checklist** (de-identification, BAA, safeguards) | Quick Reference (Appendices) |
| **Flowchart** (de-identification, data workflows) | Quick Reference |
| **Is my AI tool FDA-regulated?** | Quick Reference (Multi-Regulatory section), Detailed Guide § 1.5 |
| **Regulatory citation for grant proposal** | Detailed Guide |
| **Understanding "why" behind requirements** | Detailed Guide |
| **Template documents** (BAA, DUA, authorization) | Detailed Guide (Appendix B) |
| **Specific scenario** (AI model training, multi-site study, FDA submission) | Detailed Guide (§ 9-10, § 1.5) |
| **Teaching regulations to students** | Quick Reference (overview), Detailed Guide (deep dive) |
| **Multi-regulatory compliance** (HIPAA + FDA + Common Rule) | Detailed Guide § 1.5, Quick Reference Multi-Regulatory table |

---

## Connection to OpenDataPlanner

**OpenDataPlanner** helps researchers select appropriate data infrastructure based on security tier and estimate costs for grant proposals.

**HIPAA Integration**:

### L3 Tier (Sensitive Data)
- **May involve PHI**: Decision tree determines whether HIPAA applies
- **If PHI**: Links to HIPAA Quick Reference, de-identification guidance
- **If not PHI**: Institutional policies apply (not HIPAA)

### L4 Tier (PHI/Highly Sensitive)
- **Confirmed PHI**: Full HIPAA compliance required
- **DMP Generation**: Auto-generates HIPAA-compliant data management plan text
- **Checklist**: Pre-submission checklist for HIPAA requirements (IRB, BAAs, safeguards)

### AI Guidance (Track 2: Clinical & Healthcare AI)
- **HIPAA De-identification Decision Tree**: Interactive applet guiding de-identification choices
- **IRB Amendment for AI**: Adding ML analysis to existing protocol
- **Clinical AI Validation**: Deploying models with HIPAA safeguards

See: [`docs/AI-GUIDANCE-EXPANSION.md`](../AI-GUIDANCE-EXPANSION.md) for AI guidance integration

---

## Source Materials

### HIPAA Privacy Components

This guidance synthesizes **8 HHS Privacy Components PDFs** (stored in this directory):

1. **introduction.pdf** - HIPAA framework, HIO model, business associate agreements
2. **individualchoice.pdf** - Consent, opt-in/opt-out, psychotherapy notes, minors
3. **collectionusedisclosure.pdf** - Minimum necessary, permitted uses, master patient index
4. **safeguards.pdf** - Administrative, technical, physical protections, verification
5. **accountability.pdf** - Training, sanctions, mitigation, liability
6. **correction.pdf** - Amendment rights, denial grounds, electronic advantages
7. **opennesstransparency.pdf** - Notice of Privacy Practices, transparency
8. **Guidance Regarding Methods for De-identification...pdf** - Safe Harbor, Expert Determination, Limited Data Sets

**HHS Source**: Official guidance documents from U.S. Department of Health and Human Services, Office for Civil Rights (OCR), published 2008.

### FDA Medical Device Guidance

**FDA guidance on AI/ML and Clinical Decision Support** (January 2025-2026):
- "Artificial Intelligence-Enabled Device Software Functions: Lifecycle Management and Marketing Submission Recommendations" (January 2025 draft)
- "Clinical Decision Support Software" (updated January 2026)
- "Marketing Submission Recommendations for a Predetermined Change Control Plan" (December 2024)

**FDA Database**: 1,250+ approved AI-enabled medical devices (as of July 2025)

**Note**: Our guides synthesize HHS and FDA guidance for research data management and AI development contexts.

---

## Quick Start Guide

**I'm new to HIPAA. Where do I start?**

1. **Read**: [Quick Reference Guide - Essential Concepts](HIPAA-RESEARCH-QUICK-REFERENCE.md#part-1-essential-concepts) (5 minutes)
   - What is PHI?
   - De-identification methods
   - When BAAs are needed

2. **Determine**: Does HIPAA apply to your project?
   - Use Quick Decision tree in Quick Reference

3. **If HIPAA applies**:
   - Review relevant sections in Quick Reference (6 principles)
   - Consult Detailed Guide for your specific scenario (research, teaching, clinical)

4. **Take action**:
   - Contact IRB (authorization or waiver)
   - Execute BAAs (if using cloud/vendors)
   - Complete HIPAA training
   - Implement safeguards

5. **Get help**:
   - Privacy Officer (HIPAA compliance)
   - IRB (authorization/waiver)
   - IT (cloud security, BAAs)
   - [OpenDataPlanner Talk to a Human](../TALK-TO-HUMAN.md)

---

## Frequently Asked Questions

**Q: I'm a faculty researcher. Do I need to read all 80+ pages?**

A: No. Start with the 14-page Quick Reference Guide. Consult the Detailed Guide only for topics relevant to your work (e.g., if using AI, read § 5.5; if multi-site, read § 1.4 and Scenario 2).

**Q: I'm developing educational materials on AI in healthcare. Which guide should I use?**

A: Use the Detailed Guide as your reference source (it has regulatory citations you can include in educational materials). The Quick Reference is good for quick fact-checking while writing.

**Q: Does this guidance apply to my research if I'm not at a hospital/clinic?**

A: HIPAA applies only if you receive health information **from a covered entity** (hospital, clinic, health plan). If you collect data directly from participants (not via a covered entity), HIPAA doesn't apply (but Common Rule for human subjects research likely does).

**Q: I'm using de-identified data. Do I need to follow HIPAA?**

A: No, if data is **properly de-identified** (Safe Harbor or Expert Determination), it's not PHI and HIPAA doesn't apply. But verify de-identification is correct (use checklist).

**Q: Can I use ChatGPT or free cloud AI tools with PHI?**

A: **No**. These tools don't offer BAAs and are not HIPAA-compliant. You must either:
1. De-identify data before using these tools, OR
2. Use HIPAA-compliant alternatives (AWS SageMaker, Azure ML, Google Vertex AI with institutional BAA)

**Q: I'm teaching and want to use a patient case. Can I?**

A: Yes, but **de-identify** first:
- Remove names, dates (use year only), photos (blur faces)
- Generalize rare details
- Or obtain patient authorization if you want to use identified case

**Q: What's the difference between BAA and DUA?**

A:
- **BAA** (Business Associate Agreement): For vendors providing services (cloud storage, AI platforms, data coordinating center)
- **DUA** (Data Use Agreement): For sharing limited data set (PHI with some identifiers removed but dates/geography retained)

See Detailed Guide § 2.4 for comparison table

**Q: Is my AI diagnostic tool FDA-regulated?**

A: **Depends**. Quick assessment:
- **Research tool only** (not for clinical decisions)? → No FDA regulation
- **Clinical use** + analyzes medical images (X-ray, MRI, pathology)? → **YES, FDA-regulated medical device**
- **Clinical use** + analyzes EHR data + enables **independent clinician review**? → May be **exempt CDS** (no FDA regulation)
- **Clinical use** + "black box" AI without transparency? → **YES, FDA-regulated device**

**Action**: Read Quick Reference Multi-Regulatory section, Detailed Guide § 1.5, or consult Regulatory Affairs office

**Q: Do I need both FDA clearance AND HIPAA compliance?**

A: **Possibly YES**. They are independent regulations:
- **FDA** regulates the **product** (Is the AI tool safe and effective as a medical device?)
- **HIPAA** regulates the **data** (Is PHI protected with appropriate safeguards?)
- AI clinical tool may require **both**: FDA 510(k) clearance (6-12 months, $50K+) + HIPAA compliance (BAAs, safeguards, training)

**Example**: AI tool analyzing chest X-rays for pneumonia diagnosis:
- **FDA**: Medical device (processes images) → 510(k) required
- **HIPAA**: Training data uses PHI → De-identify or IRB waiver, BAA if cloud

**Q: How long does FDA clearance take for AI tools?**

A: **Typically 6-12 months** for 510(k) pathway (most common for AI). Faster with Breakthrough Device designation, slower if FDA requests additional data. **Plan ahead** - don't promise clinical deployment in 3 months if need FDA clearance.

---

## Future Expansion

### Faculty Teaching Version (Planned)

**Audience**: Faculty developing courses, teaching health informatics, assigning student projects

**Content** (not yet implemented):
- Syllabus language for AI use policies
- Case study de-identification for classroom use
- Student research project HIPAA requirements
- Learning objectives aligned with HIPAA principles

**Status**: Not yet created. Current guides (Quick Reference and Detailed Guide) provide foundation. Dedicated teaching guide may be created based on demand.

**Note in documents**: See Quick Reference § 6 (Openness & Transparency - Teaching Context) and Detailed Guide Scenario 3 (Faculty Using PHI in Teaching)

---

### IT Staff Version (Planned)

**Audience**: IT staff supporting faculty researchers (Piper's use case from IT-WORKBENCH-CONTROL-PANEL.md)

**Content** (not yet implemented):
- Troubleshooting flowcharts for common tickets
- Copy-paste email templates for faculty questions
- Vendor BAA checklist
- System configuration guides (AWS HIPAA setup, Azure security)
- Incident response procedures

**Status**: Detailed Guide § 10.4 provides preview. Dedicated IT staff guide may be created based on demand.

**Interim**: IT staff should consult Detailed Guide § 10.4 and Quick Reference Appendix C (BAA Essentials)

---

## How These Guides Support OpenDataPlanner

OpenDataPlanner helps researchers plan data management and estimate costs for grant proposals. HIPAA guidance integrates with OpenDataPlanner in these ways:

**1. Tier Selection (L3/L4)**:
- When user selects L3 or L4 tier → OpenDataPlanner asks about PHI involvement
- If PHI → Links to HIPAA guidance to inform service selection (encryption required, BAAs needed, etc.)

**2. DMP Generation**:
- For L4 tier → OpenDataPlanner generates DMP text including HIPAA compliance statements
- Uses language from these guides (de-identification methods, safeguards, BAA requirements)

**3. AI Guidance Applets**:
- Track 2 (Clinical & Healthcare AI) includes HIPAA decision trees
- Links to Quick Reference and Detailed Guide

**4. IT Workbench**:
- IT staff supporting faculty can reference these guides when answering tickets
- FAQs in Detailed Guide § 10.4 address common scenarios

---

## Version History

**v1.0 (2026-02-13)**:
- Initial release
- Quick Reference Guide (14 pages)
- Detailed Technical Guide (80 pages)
- Synthesized from 8 HHS Privacy Components guidance documents
- Research data management focus
- Cloud-first, AI-driven environment focus
- Faculty audience (teaching, research, clinical)

**Planned Updates**:
- Annual regulatory review (check for HHS guidance updates)
- Add faculty teaching version (if demand exists)
- Add IT staff version (if demand exists)
- Expand AI-specific scenarios as technology evolves
- Incorporate team feedback from educational material development

---

## Maintenance & Updates

**Regulatory Review**: Annually check for updates to:
- HIPAA Privacy, Security, Breach Notification Rules
- HHS guidance documents
- State law changes
- Other federal laws (Common Rule, GINA, Part 2)

**Team Feedback**: As you use these guides for educational material development, submit feedback:
- What topics need more coverage?
- What examples would be helpful?
- What scenarios should be added?

**Version Control**: These documents are tracked in git:
- Commit log shows changes over time
- Can revert to prior versions if needed
- Collaborate via pull requests

---

## Getting Help

**Questions about HIPAA compliance for your research?**
- **Privacy Officer**: [Contact info per your institution]
- **IRB**: [Contact info per your institution]
- **IT Security**: [Contact info per your institution]

**Questions about OpenDataPlanner?**
- See [`docs/USERGUIDE.md`](../USERGUIDE.md)
- See [`docs/ADMIN-GUIDE/README.md`](../ADMIN-GUIDE/README.md)
- [Talk to a Human](../TALK-TO-HUMAN.md) feature in OpenDataPlanner

**Questions about these HIPAA guides?**
- Review the guides themselves (comprehensive FAQs included)
- Contact your Privacy Officer for interpretation
- Refer to original HHS source PDFs (in this directory)

**Official HHS Resources (HIPAA)**:
- HHS Office for Civil Rights: [https://www.hhs.gov/ocr/privacy](https://www.hhs.gov/ocr/privacy)
- HIPAA for Researchers: [https://privacyruleandresearch.nih.gov](https://privacyruleandresearch.nih.gov)

**Official FDA Resources (Medical Devices & AI)**:
- FDA Digital Health Center of Excellence: [https://www.fda.gov/medical-devices/digital-health-center-excellence](https://www.fda.gov/medical-devices/digital-health-center-excellence)
- FDA AI/ML-Enabled Medical Devices: [https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices)
- FDA Pre-Submission Program: [https://www.fda.gov/medical-devices/premarket-submissions-selecting-and-preparing-correct-submission/pre-submissions-also-known-pre-subs](https://www.fda.gov/medical-devices/premarket-submissions-selecting-and-preparing-correct-submission/pre-submissions-also-known-pre-subs)
- FDA Guidance on Clinical Decision Support Software (2026)
- FDA Guidance on AI-Enabled Device Software Functions (2025)

---

## Related Documentation

**OpenDataPlanner Docs**:
- [AI Guidance Expansion](../AI-GUIDANCE-EXPANSION.md) - Track 2: Clinical & Healthcare AI
- [IT Workbench Control Panel](../IT-WORKBENCH-CONTROL-PANEL.md) - IT staff support features
- [User Guide](../USERGUIDE.md) - End-user documentation
- [Talk to a Human](../TALK-TO-HUMAN.md) - Help escape hatch design

**Institutional Resources** (customize for your institution):
- Institutional HIPAA Privacy Policies
- Institutional Security Standards
- IRB SOPs for HIPAA Waivers
- IT Cloud Use Policies
- Faculty HIPAA Training Modules

---

## Document Comparison

| Document | Pages | Audience | Purpose | When to Use |
|----------|-------|----------|---------|-------------|
| **Quick Reference** | ~14 | All faculty/researchers | Rapid decision-making | Active research planning, quick lookups, training overview |
| **Detailed Guide** | ~80 | Content developers, policy writers, specialists | Comprehensive understanding | Educational material development, policy writing, complex scenarios |
| **HHS Source PDFs** | ~44 | Compliance officers, legal counsel | Official guidance | Authoritative source, regulatory interpretation, legal review |

---

## Change Log

**2026-02-13 (v1.0)**:
- Initial release of Quick Reference Guide and Detailed Technical Guide
- Synthesized 8 HHS Privacy Components guidance documents
- Added research-specific context for AI in healthcare
- Integrated with OpenDataPlanner L3/L4 tier framework
- Focused on faculty audience in cloud-first, AI-driven environments

**Future**:
- Add faculty teaching version (based on demand)
- Add IT staff version (based on demand)
- Update based on team feedback from educational material development
- Annual regulatory review

---

## Contributing & Feedback

As you use these guides for developing educational materials on AI in healthcare, please provide feedback:

**What's Working**:
- Which sections are most useful?
- Which examples are clearest?
- What questions are answered effectively?

**What's Missing**:
- What scenarios should be added?
- What topics need more detail?
- What examples would be helpful?

**Updates Needed**:
- Regulatory changes requiring updates
- New cloud/AI technologies to address
- Emerging research methods requiring HIPAA analysis

**How to Contribute**:
- Submit issues/suggestions to project maintainer
- Document updates via pull requests
- Version-controlled in git (`docs/hipaa/`)

---

## License & Disclaimer

**Source Material**: HHS Privacy Components guidance documents are public domain (U.S. government works)

**These Guides**: Synthesized for educational purposes, focused on research data management

**Disclaimer**: These guides provide general information about HIPAA Privacy Rule requirements as they apply to research. They are **not legal advice**. For specific questions about your research, consult:
- Your institutional Privacy Officer
- Your IRB
- Your institutional legal counsel

**Accuracy**: We have made every effort to accurately represent HHS guidance. However:
- Regulations may have changed since publication (check version date)
- State laws may impose more stringent requirements
- Your institution may have additional policies
- Always consult official regulations (45 C.F.R. Parts 160, 164) and HHS guidance for authoritative answers

---

## Quick Links

**Start Here**:
- [Quick Reference Guide](HIPAA-RESEARCH-QUICK-REFERENCE.md) - Rapid answers
- [Detailed Technical Guide](HIPAA-RESEARCH-DETAILED-GUIDE.md) - Comprehensive reference

**Key Topics in Quick Reference**:
- [Essential Concepts - What is PHI?](HIPAA-RESEARCH-QUICK-REFERENCE.md#what-is-phi)
- [De-identification Methods](HIPAA-RESEARCH-QUICK-REFERENCE.md#de-identification-at-a-glance)
- [Business Associate Agreements](HIPAA-RESEARCH-QUICK-REFERENCE.md#business-associate-agreements-baas)
- [The 6 Privacy Principles](HIPAA-RESEARCH-QUICK-REFERENCE.md#part-2-the-6-privacy-principles)
- [Research Data Workflows](HIPAA-RESEARCH-QUICK-REFERENCE.md#part-3-research-data-workflows)

**Key Topics in Detailed Guide**:
- [Covered Entities & Business Associates](HIPAA-RESEARCH-DETAILED-GUIDE.md#12-covered-entities--business-associates)
- [De-identification Methods](HIPAA-RESEARCH-DETAILED-GUIDE.md#section-2-de-identification-methods)
- [Authorization Waivers for Research](HIPAA-RESEARCH-DETAILED-GUIDE.md#34-authorization-waivers-for-research)
- [Cloud & AI Safeguards](HIPAA-RESEARCH-DETAILED-GUIDE.md#55-safeguards-in-cloud--ai-environments)
- [Research Scenarios](HIPAA-RESEARCH-DETAILED-GUIDE.md#section-9-research-data-management-scenarios)
- [OpenDataPlanner Integration](HIPAA-RESEARCH-DETAILED-GUIDE.md#section-10-integration-with-opendataplanner)

**OpenDataPlanner**:
- [AI Guidance Expansion](../AI-GUIDANCE-EXPANSION.md)
- [IT Workbench Control Panel](../IT-WORKBENCH-CONTROL-PANEL.md)
- [Main README](../../README.md)

---

**For Questions**: Contact your institutional Privacy Officer, IRB, or IT Security team

**For OpenDataPlanner**: See [User Guide](../USERGUIDE.md) or [Talk to a Human](../TALK-TO-HUMAN.md)
