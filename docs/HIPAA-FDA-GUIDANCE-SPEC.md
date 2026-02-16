# Multi-Regulatory Guidance for Faculty: Specification

**Proposal for Faculty Committee Review**

---

**Date**: February 13, 2026
**Status**: Specification / Prototype Review
**Purpose**: Develop comprehensive regulatory guidance for faculty working on AI in healthcare educational materials

---

## Executive Summary

**The Problem**: Faculty developing educational materials around AI in healthcare need to understand multiple overlapping regulatory frameworks (HIPAA, FDA, IRB), but guidance is scattered across dense regulatory documents.

**The Solution**: Create comprehensive yet accessible multi-regulatory guidance documents tailored for faculty in research, teaching, and clinical contexts.

**The Prototype**: Three-document suite has been drafted (~128 pages total) synthesizing 8 HHS HIPAA guidance documents + recent FDA AI/ML guidance (2025-2026).

**The Ask**: Faculty committee review and decision on scope, depth, and priorities for final version.

---

## Background & Motivation

### Why We Need This

**Current Situation**:
- Team is developing educational materials on AI in healthcare
- Faculty span clinical, research, and instructional settings
- Modern environment is cloud-first, AI-driven
- **Multiple regulations apply simultaneously**: HIPAA (data privacy), FDA (medical device safety), Common Rule (human subjects research), others

**Current Challenges**:
- HHS HIPAA guidance: 8 PDFs, ~200 pages, written for Health Information Exchanges in 2008 (not AI/cloud-focused)
- FDA AI guidance: Multiple documents, technical, regulatory-focused (not research/education-focused)
- No single resource synthesizes these for faculty use cases
- Faculty may assume HIPAA is the only regulation (missing FDA, Common Rule, others)

**Impact of Not Having Guidance**:
- Educational materials may be incomplete/inaccurate (missing FDA, overstating HIPAA applicability)
- Faculty may unknowingly violate regulations (using consumer cloud for PHI, deploying AI tool without FDA clearance)
- Missed opportunities (designing AI tools that could qualify for FDA exemption)
- Time wasted reinventing the wheel (each faculty member reading dense regulations independently)

### Our Use Case

**Primary Goal**: Reference material for our team developing educational content about AI in healthcare research

**Secondary Benefits**:
- Faculty conducting research with PHI (know HIPAA requirements)
- Faculty teaching with patient cases (de-identification guidance)
- Faculty developing AI clinical tools (understand FDA + HIPAA intersection)
- IT staff supporting faculty (answer common questions about cloud, BAAs, encryption)

---

## Proposed Solution: Three-Document Suite

### Document 1: Quick Reference Guide (~18 pages)

**Purpose**: Scannable lookup for rapid decision-making

**Target Audience**: Any faculty member needing a quick answer

**Key Features**:
- Is this PHI? (3-part test)
- De-identification methods at a glance (Safe Harbor, Expert Determination, Limited Data Set)
- When do I need a BAA? (3-sentence rule)
- Is my AI tool FDA-regulated? (quick assessment table)
- 6 Privacy Principles (one-page summaries with checklists)
- Workflows (flowcharts for common scenarios)
- Red flags (when to get expert help)
- Quick wins (easy compliance strategies)

**Time to Value**: 10-30 minutes to scan for answers

---

### Document 2: Detailed Technical Guide (~100 pages)

**Purpose**: Comprehensive reference with regulatory grounding

**Target Audience**: Faculty developing educational materials, writing grant proposals, addressing complex scenarios

**Key Features**:
- Complete regulatory citations (45 C.F.R. § references)
- Comprehensive de-identification guidance (step-by-step)
- FDA medical device analysis (when is AI tool a device? CDS exemption, 510(k) pathway, PCCP)
- Multi-regulatory scenarios (AI tool requiring FDA + HIPAA + IRB)
- Faculty contexts (research, teaching, clinical)
- Cloud/AI infrastructure (AWS, Azure, BAAs, safeguards)
- Template documents (BAA, DUA, authorization forms)
- Extensive FAQs from HHS guidance
- OpenDataPlanner integration (L3/L4 tiers, AI Guidance Track 2)

**Time to Value**: Reference guide (search for specific topics), 3-4 hours to read thoroughly

---

### Document 3: README Navigation (~10 pages)

**Purpose**: Help users find the right guidance and understand the ecosystem

**Key Features**:
- When to use Quick Reference vs. Detailed Guide
- Quick start for faculty new to regulations
- FAQs (common questions with pointers to relevant sections)
- Source materials (HHS PDFs, FDA guidance documents)
- Future expansion plans (faculty teaching version, IT staff version)
- Change log and version history

---

## Scope Options for Committee Decision

### Option A: Keep Prototype As-Is (Minimal Effort)

**What Exists**: ~128 pages drafted
- Quick Reference: 18 pages (core concepts, 6 principles, workflows, checklists)
- Detailed Guide: 100 pages (comprehensive coverage, FDA § 1.5, scenarios)
- README: 10 pages (navigation, FAQs)

**Work Needed**:
- Light editing (typos, formatting)
- Committee review/feedback integration (2-4 hours)

**Timeline**: Ready in 1-2 weeks

**Pros**: Fast, comprehensive, usable immediately
**Cons**: Very dense, may overwhelm some readers, some sections could be expanded with more examples

---

### Option B: Expand with Faculty-Specific Versions (Medium Effort)

**Add**:
- **Faculty Teaching Guide** (~20 pages): Focused on using PHI in classrooms, syllabus language, student projects, case de-identification
- **IT Staff Quick Guide** (~15 pages): Troubleshooting flowcharts for common tickets, copy-paste email templates, vendor evaluation

**Work Needed**:
- Write 2 additional focused guides (~35 pages total)
- Integration with existing guides (cross-references)

**Timeline**: 2-3 weeks additional effort

**Pros**: More targeted for specific audiences, easier to navigate
**Cons**: More documents to maintain, some redundancy

---

### Option C: Condensed Version (Reduced Scope)

**Reduce to**:
- Single guide (~40-50 pages) combining Quick Reference + most critical Detailed Guide sections
- Drop: Extensive scenarios, comprehensive appendices, some FAQs

**Work Needed**:
- Condense existing 128 pages to 40-50 pages
- Prioritize faculty use cases over comprehensive coverage

**Timeline**: 1-2 weeks (editing/condensing)

**Pros**: Less overwhelming, faster to read
**Cons**: Less comprehensive, may need to consult original HHS/FDA documents more often

---

### Option D: Modular Expansion (Maximum Utility)

**Keep** Quick Reference + Detailed Guide + README (~128 pages)

**Add**:
- Visual aids (flowcharts, infographics) for multi-regulatory landscape
- Faculty training slides (PowerPoint/Google Slides deck, ~30 slides)
- One-page quick cards (laminated reference cards for common scenarios)
- Video walkthrough (15-20 minute screencast explaining how to use guides)

**Work Needed**:
- Create visual materials (~40 hours)
- Record/edit video (~20 hours)

**Timeline**: 4-6 weeks

**Pros**: Multiple learning modalities, highly accessible, reusable for training
**Cons**: Most effort, most to maintain

---

## Recommended Approach (Our Suggestion)

**Phase 1** (Now): Committee review of **Option A** (existing prototype)
- Review 128-page draft
- Provide feedback on:
  - Scope (too much? too little? just right?)
  - Depth (too detailed? too superficial?)
  - Usefulness (does this meet our needs for educational material development?)
  - Gaps (what's missing?)

**Phase 2** (Based on Committee Feedback):
- **If feedback = "Too much"** → Condense (Option C)
- **If feedback = "Just right"** → Polish and publish (Option A)
- **If feedback = "Needs more X"** → Expand selectively (Option B or D)

**Phase 3**: Publication and Socialization
- Announce to faculty (email, brown bag lunch presentation)
- Link from OpenDataPlanner (L3/L4 tiers, AI Guidance)
- Annual review/update cycle

---

## Committee Review Questions

**We'd like the committee's input on**:

### 1. Scope
- [ ] Is 128 pages too much? Too little? About right?
- [ ] Should we focus only on HIPAA, or is FDA inclusion valuable?
- [ ] Should we create role-specific versions (teaching, research, IT), or keep general?

### 2. Depth
- [ ] Is Detailed Guide too technical? (Includes CFR citations, regulatory nuances)
- [ ] Is Quick Reference too superficial? (Lacks citations, simplified)
- [ ] Should we have more/fewer practical examples?

### 3. Audience
- [ ] Primary audience: Our team developing educational materials? ✓
- [ ] Secondary audience: Faculty conducting research? ✓
- [ ] Tertiary audience: IT staff? Students? Administrators?

### 4. Specific Content
- [ ] FDA coverage: About right? Too much? Too little?
- [ ] HIPAA de-identification: Comprehensive enough? Too detailed?
- [ ] Cloud/AI guidance: Modern enough? Missing anything?
- [ ] Multi-regulatory scenarios: Helpful? Confusing?

### 5. Next Steps
- [ ] Polish and publish as-is? (Option A)
- [ ] Condense to 40-50 pages? (Option C)
- [ ] Expand with teaching/IT versions? (Option B)
- [ ] Create visual aids/training materials? (Option D)
- [ ] Something else?

---

## Sample Content (for Committee Preview)

### From Quick Reference Guide

**Multi-Regulatory Quick Assessment**:

| Your Project | FDA? | HIPAA? | Common Rule? | Key Actions |
|--------------|------|--------|--------------|-------------|
| **Research-only AI** | ✗ | ✓ (if PHI) | ✓ (if human subjects) | IRB approval, de-identify or waiver |
| **Clinical AI tool** | **Maybe** | ✓ (if PHI) | ✓ (if validation research) | **Regulatory Affairs, FDA, Privacy Officer, IRB** |
| **Teaching with patient cases** | ✗ | ✓ (if PHI) | ✗ | Privacy Officer |

**Safe Harbor De-identification Checklist** (excerpt):
- [ ] Names removed
- [ ] Dates → year only, ages >89 → "90+"
- [ ] ZIP codes removed (or truncated to 3 digits if area >20K population)
- [ ] Medical record numbers removed
- [ ] Photos → faces blurred or removed
- [All 18 identifiers listed...]

---

### From Detailed Guide

**FDA Decision Tree for AI Tools**:

```
Does your AI tool diagnose, treat, or prevent disease in clinical practice?
  ↓ NO → Not a medical device (research/education = no FDA)
  ↓ YES → Does it analyze medical images?
    ↓ YES → Medical device (510(k) required)
    ↓ NO → Does it enable independent clinician review?
      ↓ YES → Exempt CDS (no FDA regulation)
      ↓ NO → Medical device (510(k) required)
```

**Case Study: Faculty Developing Sepsis Prediction Model**:
- **Phase 1 (Training)**: HIPAA (IRB waiver for PHI) + Common Rule (IRB approval) + Cloud (AWS BAA)
- **Phase 2 (Validation)**: HIPAA (access to PHI) + Common Rule (human subjects research)
- **Phase 3 (FDA Submission)**: FDA 510(k) (if determined to be device) - 6 months, $50K-$150K
- **Phase 4 (Deployment)**: FDA (post-market surveillance, PCCP) + HIPAA (safeguards, audit logs)

---

## Key Differentiators vs. Generic Guidance

**What makes this different from generic HIPAA/FDA guides**:

**1. Research-Focused**:
- Not generic HIPAA for hospitals/clinics
- Specific to research data management, AI development, educational use

**2. Multi-Regulatory**:
- Doesn't treat HIPAA in isolation
- Shows FDA + HIPAA + Common Rule intersections
- Prevents "we only thought about HIPAA" mistakes

**3. Modern Context**:
- Cloud platforms (AWS, Azure, GCP) - not just on-premise servers
- AI/ML tools - not just static databases
- Remote collaboration - not just within-institution

**4. Faculty Contexts**:
- Research scenarios (AI training, multi-site studies)
- Teaching scenarios (using PHI in lectures, student projects)
- Clinical scenarios (deploying AI tools, EHR use)

**5. Actionable**:
- Checklists you can use today
- Flowcharts for decisions
- Templates for common documents
- Step-by-step compliance guidance

---

## Resource Requirements

### If Committee Approves Option A (Polish Existing)

**Effort**: 10-20 hours
- Incorporate committee feedback
- Light editing and formatting
- Final cross-reference validation

**Timeline**: 1-2 weeks from committee decision

**Cost**: Minimal (internal time only)

---

### If Committee Approves Option B (Expand)

**Effort**: 40-60 hours
- Write faculty teaching guide (~20 pages)
- Write IT staff guide (~15 pages)
- Integration and cross-referencing

**Timeline**: 3-4 weeks from committee decision

**Cost**: Minimal (internal time only)

---

### If Committee Approves Option D (Full Suite)

**Effort**: 80-100 hours
- Polish existing guides
- Create visual aids (flowcharts, infographics)
- Develop training slides (~30 slides)
- Record video walkthrough (15-20 minutes)

**Timeline**: 6-8 weeks

**Cost**: Minimal (internal time only) + possibly video editing if professional quality desired

---

## Success Metrics

**How will we know this is useful?**

**Immediate** (within 3 months):
- [ ] Team references guides while developing AI educational materials
- [ ] At least 2 faculty use guides for research planning (check whether PHI involved, determine de-identification approach)
- [ ] IT staff use guides to answer faculty questions about cloud/BAAs

**Medium-term** (within 6 months):
- [ ] Educational materials on AI in healthcare include accurate multi-regulatory guidance (HIPAA + FDA + IRB)
- [ ] 5+ faculty have consulted guides
- [ ] Guides linked from OpenDataPlanner (L3/L4 tiers, AI Guidance Track 2)

**Long-term** (within 12 months):
- [ ] Guides become standard reference for faculty HIPAA/FDA questions
- [ ] Reduced Privacy Officer/IRB workload (faculty find answers in guides before asking)
- [ ] Faculty from other institutions request access (guides have broader utility)

---

## Alternatives Considered

### Alternative 1: Use Existing Generic Guidance Only

**Pros**: No effort required
**Cons**:
- Generic guides not tailored to faculty contexts (research, teaching, AI)
- HHS guidance is 200+ pages across 8 PDFs, not synthesized
- FDA guidance is scattered, technical
- No integration showing multi-regulatory landscape

**Decision**: Rejected (doesn't meet our needs for educational material development)

---

### Alternative 2: Brief Summary Only (5-10 pages)

**Pros**: Fast to create, easy to read
**Cons**:
- Insufficient depth for developing educational materials (need regulatory citations, detailed examples)
- Faculty would still need to consult original regulations frequently
- Wouldn't serve as comprehensive reference

**Decision**: Considered as Option C (condensed version) but not recommended as first choice

---

### Alternative 3: External Training/Consultation

**Pros**: Expert-developed, professionally designed
**Cons**:
- Cost ($5,000-$20,000 for customized training materials)
- Generic (not specific to our institution, OpenDataPlanner integration, AI guidance project)
- Ongoing cost (annual updates)

**Decision**: Rejected (cost, lack of customization)

---

## Committee Decision Points

**Question 1**: Should we proceed with developing this guidance suite?
- [ ] Yes, valuable for our educational materials development and faculty support
- [ ] No, not needed (use generic guidance instead)
- [ ] Unsure, need more information about ___________

**Question 2**: If yes, which scope?
- [ ] **Option A**: Polish existing prototype (128 pages, minimal effort, 1-2 weeks)
- [ ] **Option B**: Expand with teaching/IT versions (160+ pages, medium effort, 3-4 weeks)
- [ ] **Option C**: Condense to 40-50 pages (reduced scope, 1-2 weeks)
- [ ] **Option D**: Full suite with visual aids and training materials (high effort, 6-8 weeks)

**Question 3**: Priority topics to expand/reduce?
- [ ] More FDA coverage (medical device pathways, specific AI tool examples)
- [ ] Less FDA coverage (just basics, not comprehensive)
- [ ] More HIPAA scenarios (specific faculty use cases)
- [ ] More cloud/AI technical guidance (AWS/Azure configurations)
- [ ] Less technical detail (keep it more general)
- [ ] Other: _____________________

**Question 4**: Primary audience priority?
- [ ] Our team developing educational materials (current focus)
- [ ] Faculty conducting research
- [ ] Faculty teaching with patient data
- [ ] IT staff supporting faculty
- [ ] All of the above equally

**Question 5**: Future versions?
- [ ] Create faculty teaching-specific version after initial release
- [ ] Create IT staff-specific version after initial release
- [ ] Keep general guides only (no role-specific versions)

---

## Prototype Preview: What's Been Created

### Quick Reference Guide Structure

```
Part 1: Essential Concepts (4 pages)
- What is PHI?
- Multi-Regulatory Landscape (HIPAA + FDA + Common Rule)
- De-identification Methods (Safe Harbor, Expert Determination, Limited Data Set)
- Business Associate Agreements

Part 2: The 6 Privacy Principles (6 pages)
1. Individual Choice (authorization, consent, opt-in/opt-out)
2. Collection/Use/Disclosure Limitation (minimum necessary)
3. Safeguards (administrative, technical, physical for cloud/AI)
4. Accountability (training, sanctions, mitigation)
5. Correction (amendment rights)
6. Openness/Transparency (Notice of Privacy Practices)

Part 3: Research Data Workflows (3 pages)
- Accessing EHR Data for Research (flowchart)
- Using AI/ML with PHI (flowchart)
- Multi-Site Collaboration (flowchart)

Part 4: OpenDataPlanner Connection (1 page)
- L3 Tier (Sensitive Data)
- L4 Tier (PHI/Highly Sensitive)
- AI Guidance Integration

Part 5: Multi-Regulatory Red Flags & Quick Wins (2 pages)
- HIPAA red flags
- FDA red flags
- Quick wins for each framework

Appendices (2 pages)
- Safe Harbor Checklist (18 identifiers)
- Limited Data Set Checklist (16 identifiers)
- BAA Essentials
- Quick Scenarios
- Glossary (HIPAA, FDA, Common Rule terms)
```

---

### Detailed Guide Structure

```
Section 1: Foundation & Framework (25 pages)
- HIPAA Privacy Rule in Context
- Covered Entities & Business Associates
- What is PHI?
- Health Information Organizations in Research
- **FDA Regulation of Medical Devices, Software, and AI Tools** [NEW]
  - When is AI tool a medical device?
  - Clinical Decision Support (CDS) exemption (2026 guidance)
  - FDA regulatory pathways (510(k), De Novo, PMA)
  - Predetermined Change Control Plans (PCCP) for AI
  - AI/ML labeling requirements
  - Multi-regulatory compliance examples

Section 2: De-identification Methods (20 pages)
- Why De-identify?
- Safe Harbor Method (18 identifiers with research implications)
- Expert Determination Method (statistical disclosure control)
- Limited Data Sets (16 identifiers, Data Use Agreement)
- De-identification Decision Tree
- Re-identification Prohibition

Section 3-8: Six Privacy Principles (30 pages)
[Individual Choice, Collection/Use/Disclosure, Safeguards, Accountability, Correction, Openness]

Section 9: Research Scenarios (8 pages)
- Building AI Model for Clinical Decision Support (FDA + HIPAA + IRB)
- Multi-Site Observational Study
- Faculty Using PHI in Teaching
- Cloud-First Research Infrastructure

Section 10: OpenDataPlanner Integration (3 pages)
- L3 Tier, L4 Tier
- AI Guidance Track 2
- IT Workbench FAQs

Appendices (15 pages)
- Regulatory Citations
- Template Documents
- Checklists
- Glossary
- FAQ Compendium
- Resources & References
```

---

## Timeline for Committee Review

**Week 1**: Committee members review prototype
- Quick Reference (18 pages) - 1 hour
- Detailed Guide (skim structure, read 1-2 relevant sections) - 1-2 hours
- README (10 pages) - 30 minutes

**Week 2**: Committee meeting to discuss
- Is this valuable?
- Which scope option?
- Any specific feedback on content?

**Weeks 3-4**: Incorporate feedback, finalize

**Week 5**: Publish and announce to faculty

---

## Next Steps

**For Committee Members**:

1. **Review prototype documents** (located in `/docs/hipaa/`):
   - Start with [README](../docs/hipaa/README.md) for overview
   - Skim [Quick Reference Guide](../docs/hipaa/HIPAA-RESEARCH-QUICK-REFERENCE.md)
   - Browse [Detailed Guide](../docs/hipaa/HIPAA-RESEARCH-DETAILED-GUIDE.md) (select relevant sections for your role)

2. **Consider questions** (in Committee Decision Points section above)

3. **Provide feedback**:
   - Written comments (email, collaborative doc, GitHub issues)
   - Committee meeting discussion
   - Individual consultations

4. **Make recommendation**:
   - Approve scope option (A, B, C, or D)
   - Identify priorities for any modifications
   - Approve timeline for final version

---

## Appendix: Document Statistics

### Prototype Metrics

| Document | Pages (approx) | Lines | Size | Reading Time |
|----------|---------------|-------|------|--------------|
| **Quick Reference** | 18 | 881 | 33 KB | 30-60 min |
| **Detailed Guide** | 100 | 5,035 | 223 KB | 3-4 hours (reference, not cover-to-cover) |
| **README** | 10 | 489 | 21 KB | 20 min |
| **TOTAL** | **128** | **6,405** | **277 KB** | **4-5 hours** |

### Source Material Synthesized

- **HIPAA**: 8 HHS Privacy Components PDFs (~200 pages original)
- **FDA**: 3 recent guidance documents on AI/ML medical devices (2025-2026)
- **Plus**: Integration with OpenDataPlanner, institutional context, cloud-first infrastructure

### Content Breakdown

- **Checklists**: 15+ (de-identification, BAAs, safeguards, FDA assessment)
- **Flowcharts/Decision Trees**: 10+ (de-identification, FDA device determination, data workflows)
- **Scenarios**: 20+ (AI tools, multi-site studies, teaching, cloud, FDA submission)
- **FAQs**: 50+ (from HHS source documents plus new FDA/cloud FAQs)
- **Regulatory Citations**: 100+ (45 C.F.R. references, FD&C Act, FDA guidance)

---

## Questions for Spec Author (Before Committee Meeting)

**From Committee to Spec Author**:
- What specific educational materials are you developing that prompted this? (Context helps us evaluate scope)
- How do you envision using these guides day-to-day?
- What would happen if we don't create this (what's Plan B)?
- Are there specific faculty scenarios we should add?
- Would visual flowcharts be more useful than text-based decision trees?

---

**Prepared by**: [Your Name/Team]
**For Review by**: Faculty Committee on AI in Healthcare Education
**Review Period**: [Dates]
**Feedback Deadline**: [Date]
**Committee Meeting**: [Date/Time]

---

## Attachments

**For Committee Review**:
1. [Quick Reference Guide Prototype](../docs/hipaa/HIPAA-RESEARCH-QUICK-REFERENCE.md)
2. [Detailed Guide Prototype](../docs/hipaa/HIPAA-RESEARCH-DETAILED-GUIDE.md)
3. [README/Navigation](../docs/hipaa/README.md)

**Source Materials** (for reference, not required reading):
- `/docs/hipaa/*.pdf` (8 HHS HIPAA Privacy Components PDFs)
