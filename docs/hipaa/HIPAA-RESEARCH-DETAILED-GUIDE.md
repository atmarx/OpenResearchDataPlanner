# HIPAA Research Data Management: Detailed Technical Guide

*Educational Material Development Reference*

---

**Version:** 1.0
**Last Updated:** 2026-02-13
**Regulatory Basis:** 45 CFR Parts 160, 164 (as of 2025)
**Source:** 8 HHS Privacy Components PDFs (2008)
**Related:** OpenDataPlanner v1.2, AI Guidance Track 2 (Clinical)

---

## Reader's Guide

### How This Guide is Organized

This detailed technical guide provides comprehensive coverage of HIPAA Privacy Rule requirements as they apply to research data management, with particular focus on AI in healthcare contexts. The guide is structured around:

- **Foundation & Framework** (Section 1): Core concepts, covered entities, PHI definition
- **Six Privacy Principles** (Sections 2-8): De-identification, Individual Choice, Collection/Use/Disclosure, Safeguards, Accountability, Correction, Openness/Transparency
- **Research Scenarios** (Section 9): Practical applications with step-by-step HIPAA analysis
- **OpenDataPlanner Integration** (Section 10): Connection to L3/L4 tiers and AI guidance
- **Appendices**: Templates, checklists, glossary, FAQ compendium, case studies

### When to Use This Guide vs. Quick Reference

**Use the Quick Reference Guide when:**
- You need a rapid answer to a specific question
- You're looking for a checklist or decision flowchart
- You need a brief research scenario example
- You want to scan key requirements quickly

**Use this Detailed Guide when:**
- You need regulatory citations and legal grounding
- You're developing educational materials that require accuracy
- You need to understand the "why" behind requirements
- You're addressing complex or non-routine situations
- You need comprehensive FAQ coverage

### Cross-Referencing System

Throughout this guide, you'll see references formatted as:

- **§ 2.3** = Section 2.3 of this Detailed Guide
- **Quick Ref §3** = Section 3 of the Quick Reference Guide
- **45 C.F.R. § 164.508** = Code of Federal Regulations citation
- **See Also:** = Related topics in other sections

### Update Log & Version History

**v1.0 (2026-02-13):**
- Initial release
- Synthesized from 8 HHS Privacy Components guidance documents
- Research data management focus with AI in healthcare context
- Integrated with OpenDataPlanner L3/L4 tier framework

---

## Section 1: Foundation & Framework

### 1.1 The HIPAA Privacy Rule in Context

#### Legislative History

The Health Insurance Portability and Accountability Act (HIPAA) was enacted in 1996 to:
- Improve portability and continuity of health insurance coverage
- Combat waste, fraud, and abuse in health insurance and health care delivery
- Promote use of medical savings accounts
- Simplify administration of health insurance
- **Protect individually identifiable health information**

The Privacy Rule, implemented in 2003, establishes national standards for protection of certain health information. It creates a federal baseline of privacy protections while allowing states to enact more stringent protections.

#### Relationship to Security Rule

The **HIPAA Privacy Rule** (45 C.F.R. Part 164, Subpart E) governs:
- Uses and disclosures of PHI
- Individual rights (access, amendment, accounting, restrictions)
- Administrative requirements (training, policies, documentation)

The **HIPAA Security Rule** (45 C.F.R. Part 164, Subpart C) governs:
- Technical safeguards (access controls, encryption, audit logs)
- Physical safeguards (facility access, workstation security, device controls)
- Administrative safeguards (risk assessment, workforce training, sanctions)

**Key Difference**: Privacy Rule covers PHI in all forms (paper, electronic, oral); Security Rule applies only to **electronic** PHI (ePHI).

**Research Implication**: When conducting research with ePHI (e.g., EHR data, genomic databases, AI training datasets), both Privacy and Security Rules apply.

#### Relationship to Breach Notification Rule

The **Breach Notification Rule** (45 C.F.R. §§ 164.400-414) requires:
- Notification to affected individuals (within 60 days)
- Notification to HHS (breaches affecting 500+ individuals reported immediately; smaller breaches reported annually)
- Notification to media (for breaches affecting 500+ individuals in a jurisdiction)

**4-Factor Breach Risk Assessment:**
1. Nature and extent of PHI involved
2. Unauthorized person who used/received PHI
3. Whether PHI was actually acquired/viewed
4. Extent to which risk has been mitigated

**Research Context**: Lost laptops with unencrypted research datasets, accidental public posting of identifiable data, unauthorized access by research personnel.

#### State Law Preemption

**General Rule**: HIPAA preempts contrary state law UNLESS the state law is "more stringent."

**"More stringent" means** state law:
- Prohibits or restricts a use/disclosure permitted by HIPAA
- Provides individuals greater rights of access/amendment
- Provides greater privacy protections
- Requires more detailed accounting of disclosures

**Common state law variations**:
- **Mental health records**: Many states require specific authorization beyond HIPAA
- **HIV/AIDS information**: Often subject to stricter state confidentiality laws
- **Substance abuse treatment records**: 42 CFR Part 2 (federal) often applies, more stringent than HIPAA
- **Genetic information**: Some states restrict use beyond GINA protections
- **Minors**: State laws on parental access to minor's health information vary

**Research Implication**: Multi-state studies must comply with the most stringent applicable law in each jurisdiction. Researchers should consult institutional legal counsel for state-specific requirements.

#### Other Federal Laws and Multi-Regulatory Landscape

**CRITICAL INSIGHT**: HIPAA is **not the only** regulatory framework governing healthcare data and AI tools. Faculty must navigate **multiple overlapping regulations** simultaneously.

**The Regulatory Ecosystem**:
- **HIPAA** → Data privacy and security
- **FDA** → Medical device safety and effectiveness
- **Common Rule** → Human subjects research protections
- **FERPA** → Student education records
- **GINA** → Genetic discrimination protection
- **42 CFR Part 2** → Substance abuse records confidentiality

**Common Rule (45 CFR Part 46)**: Governs human subjects research conducted or supported by federal agencies
- IRB review required for research with human subjects
- Informed consent requirements
- Vulnerable populations protections
- **Intersection with HIPAA**: IRB can waive Common Rule consent requirements; separately, IRB or Privacy Board can waive HIPAA authorization

**FERPA (Family Educational Rights and Privacy Act)**: Protects student education records
- **Intersection with HIPAA**: Treatment records maintained by university health services are HIPAA-covered, not FERPA-covered

**GINA (Genetic Information Nondiscrimination Act)**: Prohibits discrimination based on genetic information in health insurance and employment
- **Intersection with HIPAA**: Genetic information is PHI; GINA provides additional protections

**42 CFR Part 2**: Governs substance abuse treatment records
- **More stringent than HIPAA**: Requires patient consent for most disclosures, even for treatment
- **Research Implication**: Studies involving substance abuse treatment records need Part 2-compliant consent

**FDA Medical Device Regulation**: See § 1.5 below for comprehensive coverage of FDA regulation of software and AI tools

---

### 1.5 FDA Regulation of Medical Devices, Software, and AI Tools

**WHY THIS MATTERS**: Many faculty developing AI tools in healthcare assume HIPAA is the only regulation that applies. **This is incorrect.** FDA separately regulates medical devices, including software and AI tools used for diagnosis, treatment, or prevention of disease.

**Key Difference**:
- **HIPAA** regulates **data** (privacy and security of PHI)
- **FDA** regulates **products** (safety and effectiveness of medical devices)

**Both Can Apply Simultaneously**: An AI diagnostic tool may require both HIPAA compliance (for PHI used in training/deployment) **and** FDA clearance (as a medical device)

#### What is a Medical Device?

**Federal Food, Drug, and Cosmetic Act (FD&C Act) § 201(h)**: A medical device is an instrument, apparatus, implement, machine, software, or other article that is:

**Intended for use in**:
- **Diagnosis** of disease or other conditions, OR
- **Cure, mitigation, treatment, or prevention** of disease, OR
- Affecting the **structure or function** of the body

**AND**: Does not achieve its primary intended purposes through chemical action (those are drugs) or metabolism (those are biologics)

**Software as a Medical Device (SaMD)**: Software intended to be used for one or more medical purposes that performs these functions **without being part of a hardware medical device**

**FDA Statutory Authority**: FDA regulates medical devices under FD&C Act to ensure they are safe and effective

#### Is My AI Tool an FDA-Regulated Medical Device?

**Decision Flowchart**:

```
START: What does your software/AI tool do?

Q1: Is it intended for diagnosis, treatment, cure, mitigation, or prevention of disease?
  ↓ NO → Not a medical device (may be wellness, administrative, research tool) → END (no FDA)
  ↓ YES → Continue

Q2: Is it intended for use in clinical decision-making affecting patient care?
  ↓ NO → Not a medical device (research tool, educational tool) → END (no FDA)
  ↓ YES → Continue

Q3: Does it acquire, process, or analyze a MEDICAL IMAGE or signal from in vitro diagnostic device?
  ↓ YES → MEDICAL DEVICE (criterion #1 of CDS exemption not met) → FDA regulates
  ↓ NO → Continue

Q4: Does it enable healthcare provider to INDEPENDENTLY REVIEW THE BASIS for recommendations?
  ↓ NO → MEDICAL DEVICE (criterion #4 of CDS exemption not met) → FDA regulates
  ↓ YES → Continue

Q5: Does it display/analyze medical information and provide recommendations to HCP?
  ↓ NO → Re-assess intended use
  ↓ YES → EXEMPT CLINICAL DECISION SUPPORT → NO FDA regulation (but best practices still apply)
```

**Key Question**: Can the clinician **independently review the basis** for the recommendation?

**Examples of "Independently Review"**:
- ✅ Tool displays patient's lab values + reference ranges + guideline citation → Clinician can verify
- ✅ Tool shows drug interaction warning + evidence from medical literature → Clinician can independently check
- ✅ Tool highlights suspicious region in image + shows original image → Radiologist can verify
- ❌ "Black box" AI outputs diagnosis without showing how it reached conclusion → Clinician cannot independently review
- ❌ Complex ML model with hundreds of features, outputs probability score → Clinician cannot meaningfully verify basis

#### Clinical Decision Support (CDS) Software Exemption

**Regulatory Basis**: 21st Century Cures Act § 3060 (2016), FDA Guidance "Clinical Decision Support Software" (updated January 2026)

**Four Criteria for CDS Exemption** (all must be met):

**Criterion 1**: Software is **not intended to acquire, process, or analyze a medical image** or a signal from an in vitro diagnostic device or a pattern or signal from a signal acquisition system

**Criterion 2**: Software **displays, analyzes, or prints medical information** about a patient or other medical information (such as peer-reviewed clinical studies, clinical practice guidelines, drug labeling)

**Criterion 3**: Software **supports or provides recommendations** to a health care professional about prevention, diagnosis, or treatment of a disease or condition

**Criterion 4**: Software **enables a health care professional to independently review the basis** for such recommendations, such that it is not the intent that a health care professional primarily rely on such recommendations to make a clinical diagnosis or treatment decision regarding an individual patient

**2026 FDA Guidance Expansion**: Clarifies that exemption applies to AI, including certain **generative AI features**, as long as:
- Clinician can understand and verify underlying logic and data inputs
- Software provides transparency into how recommendations are generated
- Clinician exercises independent judgment, not primarily relying on software

#### Examples: Exempt vs. Regulated

**EXEMPT Clinical Decision Support**:

**1. Drug-Drug Interaction Checker**:
- Analyzes patient's medication list
- Flags potential interactions (e.g., "Warfarin + Aspirin → Increased bleeding risk")
- Displays evidence (pharmacology, clinical studies)
- **Clinician independently reviews**: Checks patient's meds, reads evidence, decides whether to adjust
- **Exempt**: ✅

**2. Clinical Guideline Reminder**:
- Reminds clinician of evidence-based guidelines (e.g., "USPSTF recommends colorectal cancer screening for adults 50-75")
- Shows patient's age and screening history
- Provides guideline citation
- **Clinician independently reviews**: Verifies patient age, reviews guideline, decides whether to order
- **Exempt**: ✅

**3. Lab Value Trend Display**:
- Graphs patient's creatinine levels over time
- Highlights abnormal values
- Does NOT interpret or diagnose
- **Clinician independently reviews**: Sees trend, applies clinical knowledge, decides on action
- **Exempt**: ✅

**4. AI Clinical Note Summarizer** (2026 Guidance - Generative AI):
- Reads lengthy EHR notes, generates summary
- Clinician reviews summary **and original notes**
- **Clinician can independently verify**: Compare summary to source
- **Exempt**: ✅ (per 2026 expanded guidance on generative AI)

**FDA-REGULATED Medical Devices**:

**1. AI Diabetic Retinopathy Screening**:
- Analyzes retinal photograph
- Outputs diagnosis: "More than mild diabetic retinopathy detected" or "No diabetic retinopathy"
- **Processes medical image** → Criterion #1 NOT met
- **FDA**: Class II device, 510(k) required
- **Approved devices**: IDx-DR (first autonomous AI diagnostic system approved 2018), others

**2. AI ECG Interpretation**:
- Analyzes ECG signal
- Outputs diagnosis: "Atrial fibrillation detected"
- **Processes signal** → Criterion #1 NOT met
- **FDA**: Class II device, 510(k) required

**3. AI Sepsis Prediction (without independent review)**:
- Analyzes vital signs, labs in real-time
- Outputs: "90% probability of sepsis in next 6 hours"
- **If basis not independently reviewable** (complex model, features not displayed) → Criterion #4 NOT met
- **FDA**: Likely a device (Class II)

**4. AI Radiology CAD (Computer-Aided Detection)**:
- Analyzes chest X-ray for pneumonia
- Highlights suspicious regions
- Radiologist reviews image and AI suggestions
- **Processes medical image** → Criterion #1 NOT met
- **FDA**: Class II device, 510(k) required
- **Many approved**: Chest X-ray AI tools for pneumonia, fractures, nodules

**5. AI Pathology Slide Analysis**:
- Analyzes digital pathology slide
- Detects cancer cells, outputs diagnosis
- **Processes medical image** → Criterion #1 NOT met
- **FDA**: Class II or III depending on risk (e.g., primary diagnosis vs. assisting pathologist)

#### FDA Regulatory Pathways for AI/ML Devices

As of July 2025, FDA has cleared 1,250+ AI-enabled medical devices, with 97% via 510(k) pathway.

**Pathway 1: 510(k) Premarket Notification** (Class II - Most AI Tools)

**Requirement**: Demonstrate device is "substantially equivalent" to legally marketed predicate device (similar intended use, similar technological characteristics, same safety/effectiveness questions)

**Timeline**: Typically 3-6 months for FDA review (90 days standard, extensions common)

**Cost**: $10,000-$100,000 (FDA user fee ~$13,000 + consulting, testing, documentation)

**Process**:
1. Identify predicate device (already FDA-cleared device for similar use)
2. Prepare 510(k) submission:
   - Device description (AI architecture, inputs, outputs, intended use)
   - Substantial equivalence comparison to predicate
   - Performance testing (sensitivity, specificity, validation studies)
   - Labeling (indications for use, instructions, warnings)
   - Software documentation (cybersecurity, algorithm description)
3. Submit to FDA
4. FDA reviews (may request additional information)
5. FDA issues clearance letter (or issues "Not Substantially Equivalent" determination → Need De Novo or PMA)

**Pathway 2: De Novo Classification** (Novel Low-to-Moderate Risk Devices)

**When Used**: First-of-a-kind device with no predicate, but low-to-moderate risk

**Process**:
- Similar to 510(k) but must demonstrate safety/effectiveness without predicate comparison
- FDA establishes new classification and special controls for this device type
- Once cleared, becomes predicate for future 510(k)s

**Timeline**: 6-12 months

**Example**: First autonomous AI diagnostic tool (IDx-DR for diabetic retinopathy, cleared via De Novo)

**Pathway 3: Premarket Approval (PMA)** (Class III - High Risk)

**When Required**: High-risk devices, life-sustaining or life-supporting, novel with significant risk

**Requirement**: Clinical trials demonstrating safety and effectiveness

**Timeline**: 12-24+ months

**Rare for AI tools**: Most AI tools are Class II (moderate risk)

**Pathway 4: Breakthrough Devices Program**

**Eligibility**: Devices for life-threatening or irreversibly debilitating diseases, provides more effective treatment/diagnosis than existing alternatives

**Benefit**: Expedited review, early interaction with FDA, priority review

**Process**: Request Breakthrough Designation, FDA evaluates, if granted → Expedited development and review

**Example**: AI tool for early cancer detection, AI for rare disease diagnosis

#### Predetermined Change Control Plans (PCCP) for AI

**FDA Guidance** (December 2024): "Marketing Submission Recommendations for a Predetermined Change Control Plan for Artificial Intelligence-Enabled Device Software Functions"

**Purpose**: Address **"model drift"** and enable **continuous learning** for AI devices

**Problem**: Traditional medical devices are static. AI models may degrade over time (data distribution changes, model becomes less accurate). Need to retrain/update models.

**Traditional Approach**: Each model update requires new 510(k) submission → Slow, expensive

**PCCP Approach**: Specify planned updates in original 510(k) submission → Implement updates without new submissions (within PCCP scope)

**PCCP Must Specify**:
1. **Types of changes** planned (e.g., "Retrain model on new data quarterly," "Expand to additional clinical settings")
2. **Methodology** for implementing changes (same architecture, same performance metrics)
3. **Impact assessment** (how will changes affect safety/effectiveness?)
4. **Performance monitoring** (metrics to track, thresholds for action)
5. **Update protocol** (when/how updates will be made, testing before deployment)

**FDA Review**: FDA reviews and approves PCCP as part of original clearance

**Post-Market**: Manufacturer implements changes per PCCP, monitors performance, submits annual reports to FDA

**Benefit**: Faster iteration (implement quarterly model updates without 6-month 510(k) review each time)

**Example PCCP**:
```
Predetermined Change Control Plan: AI Sepsis Prediction Model

Planned Changes:
- Retrain model quarterly using new patient data from same hospital
- Same model architecture (random forest, 20 features)
- Same intended use (predict sepsis 6 hours in advance)

Performance Monitoring:
- Track sensitivity, specificity, AUC monthly
- Alert threshold: If AUC drops below 0.80 → Investigate and address
- Annual validation on hold-out test set

Update Protocol:
- Q1, Q2, Q3, Q4: Retrain on data from prior quarter
- Internal validation (test set from same quarter)
- If performance meets thresholds → Deploy updated model
- If performance degrades → Hold update, investigate, address issues
- Annual report to FDA with performance metrics
```

#### AI/ML Labeling and Transparency Requirements

**FDA Guidance (January 2025)**: "Artificial Intelligence-Enabled Device Software Functions: Lifecycle Management and Marketing Submission Recommendations"

**Required in Labeling**:

**1. Clear Statement of AI Use**:
- "This device uses artificial intelligence and machine learning"
- Plain-language description: "The AI analyzes chest X-rays and highlights regions that may indicate pneumonia. A radiologist must review the X-ray and AI suggestions before making a final diagnosis."

**2. Performance Metrics**:
- Sensitivity, specificity, positive/negative predictive value, AUC (as appropriate)
- Tested population description (size, demographics, clinical settings)
- Example: "Sensitivity: 92% (95% CI: 88-95%), Specificity: 87% (95% CI: 83-90%), tested on 5,000 chest X-rays from 10 U.S. hospitals"

**3. Known Limitations and Risks**:
- False positive/negative rates
- Scenarios where tool may be less accurate
- Example: "Model was trained on adult patients age 18-80. Performance in pediatric and geriatric populations has not been fully validated."

**4. Bias Disclosures**:
- If known performance differences across demographic groups (age, sex, race, ethnicity)
- Example: "Model performance is lower in patients over age 75 (AUC 0.78 vs. 0.85 in younger adults)"
- Mitigation strategies if available

**5. Training Data Description**:
- Type of data (chest X-rays, EHR data, genomic sequences)
- Source (academic medical centers, community hospitals, international sites)
- Population characteristics (age range, sex, race/ethnicity distribution, geographic locations)
- Size (number of patients, number of data points)
- Example: "Trained on 100,000 chest X-rays from 20 academic medical centers in the U.S., representing patients ages 18-80, 52% female, 65% White, 20% Black, 10% Hispanic, 5% Asian"

**6. Human-AI Workflow**:
- How should clinician use tool?
- What does tool do vs. what must clinician do?
- Example: "The AI highlights suspected nodules in red. The radiologist must review the entire image, including areas not highlighted by the AI, and apply clinical judgment before making final diagnosis. The AI suggestion should inform but not replace radiologist expertise."

**7. Post-Market Monitoring**:
- How manufacturer will monitor performance in real-world use
- How updates will be managed (PCCP if applicable)
- How to report adverse events

**Research Implication**: If developing AI tool that may become medical device, document these elements during research phase (saves time/cost later)

#### Faculty Decision Tree: Is My AI Tool FDA-Regulated?

**Scenario**: Faculty developing AI tool for healthcare

**Step 1: Define Intended Use**
- **Research only** (not for clinical care)? → Not a device (FDA does not regulate research tools)
- **Clinical care** (diagnosis, treatment decisions)? → Continue

**Step 2: Medical Image or Signal Analysis?**
- **Analyzes images** (X-ray, CT, MRI, retinal photos, pathology slides)? → **DEVICE** (no exemption)
- **Analyzes signals** (ECG, EEG, pulse ox)? → **DEVICE** (no exemption)
- **Analyzes structured data** (lab values, vital signs, diagnoses from EHR)? → Continue

**Step 3: Independent Review Possible?**
- Can clinician **see the data inputs** used by AI? → Yes, continue
- Can clinician **understand the logic/reasoning**? → Yes, continue
- Does tool **explain** which factors led to recommendation? → Yes, continue
- **If all yes** → Likely **EXEMPT CDS**
- **If any no** → Likely **DEVICE**

**Step 4: Primary Reliance**
- Will clinician **primarily rely** on AI recommendation (little independent verification)? → **DEVICE**
- Will clinician **use AI as input** but apply independent judgment? → Likely **EXEMPT CDS**

**Gray Areas** (consult FDA):
- Borderline cases (some independent review possible, but limited)
- Novel applications of AI (generative AI, large language models for clinical use)
- Combination products (AI + traditional CDS components)

#### Examples by Faculty Domain

**Clinical Faculty**:

**Example 1: EHR-Integrated Drug Allergy Alert**
- Patient has documented penicillin allergy
- Clinician orders amoxicillin (penicillin-class drug)
- System alerts: "Patient has penicillin allergy. Amoxicillin is in penicillin class."
- **FDA**: Exempt CDS (displays patient allergy, drug class info, enables independent review)
- **HIPAA**: Uses PHI (patient allergy list), hospital's own use of patient data (permitted for treatment)

**Example 2: AI Radiology Read**
- AI analyzes chest X-ray, outputs: "Pneumonia detected, confidence 85%"
- **FDA**: Device (processes medical image, criterion #1 not met)
- **If faculty wants to deploy**: Need 510(k) clearance
- **Alternative**: Design as CDS that displays image + highlights suspicious regions + shows feature values → Radiologist independently reviews → May be exempt

**Research Faculty**:

**Example 3: Retrospective Model Training**
- Faculty trains model on historical EHR data to predict readmission
- Tool used only in research (not clinical care)
- **FDA**: Not a device (research use, not clinical use)
- **HIPAA**: Uses PHI for training → De-identify or IRB waiver
- **Common Rule**: IRB approval for human subjects research

**Example 4: Prospective Validation Study**
- Faculty tests sepsis prediction model prospectively in ICU (model runs in background, alerts not shown to clinicians, outcomes compared to model predictions)
- **FDA**: Still research phase (not used for clinical decisions) → Not yet regulated
- **HIPAA**: Access to PHI for validation → IRB waiver
- **Common Rule**: IRB approval (human subjects research)

**Example 5: Clinical Deployment**
- After validation, faculty deploys sepsis model in ICU (alerts shown to clinicians, clinicians may act on alerts)
- **FDA**: Is it a device? Apply decision tree:
  - Diagnoses/predicts disease? ✓ (sepsis)
  - Analyzes images/signals? ✗ (analyzes structured EHR data)
  - Enables independent review? Depends on implementation
    - If tool displays vital signs, lab trends, explains which values triggered alert → **May be exempt**
    - If tool only shows probability score without explanation → **Device**
- **Decision**: Consult FDA pre-submission program

**Instructional Faculty**:

**Example 6: AI Tutor for Medical Students**
- AI generates patient case scenarios for student learning
- Students practice diagnosis/treatment planning
- **FDA**: Not a device (educational use, not clinical patient care)
- **HIPAA**: If AI trained on real patient data → De-identify training data (no patient authorization needed for educational use if de-identified)

#### FDA + HIPAA + Common Rule: Comprehensive Example

**Scenario**: Faculty wants to develop and deploy AI model for early detection of Alzheimer's disease using brain MRI and cognitive test data

**FDA Analysis**:

**Intended Use**: Assist neurologists in early detection of Alzheimer's by analyzing brain MRI scans and cognitive test results

**Is it a Medical Device?**
- Diagnosis of disease? ✓ (Alzheimer's)
- Processes medical images? ✓ (brain MRI)
- **Criterion #1 of CDS exemption NOT met** → **DEVICE**

**Regulatory Pathway**: 510(k)
- **Predicate**: Existing AI tools for brain MRI analysis (several cleared)
- **Submission Requirements**:
  - Device description (AI architecture, inputs [MRI + cognitive scores], output [probability of Alzheimer's])
  - Performance data (sensitivity, specificity, tested on 1,000+ patients)
  - Comparison to predicate device
  - Labeling (intended use, instructions, warnings, limitations)
  - Bias analysis (performance across age, sex, race groups)
  - PCCP (plan to retrain model annually on new data)

**Timeline**: 6-9 months for 510(k) review

**Cost**: $50,000-$150,000 (FDA submission, validation studies, consulting)

**HIPAA Analysis**:

**Training Data**: Brain MRI scans + cognitive test results + Alzheimer's diagnosis (from university hospital) → PHI

**Options**:
1. **De-identify**: Remove patient identifiers, use Safe Harbor → No authorization needed
   - Challenge: If small sample or rare imaging findings, may remain quasi-identifying
2. **IRB Waiver**: Minimal risk to privacy (adequate safeguards), impracticable to obtain authorization from 10,000 patients
   - Faculty obtains IRB waiver
   - Provides representations to hospital

**Cloud Training**: Faculty wants to use AWS SageMaker
- University BAA with AWS ✓
- Configure encryption, access controls ✓
- Upload data securely (HTTPS) ✓
- Train model ✓
- Delete data post-training per schedule ✓

**Deployment**: Model deployed in university hospital neurology clinic
- Hospital's use of own patients' PHI for treatment (permitted under HIPAA)
- Safeguards: Encryption, access controls, audit logs

**Common Rule Analysis**:

**Training**: Retrospective use of MRI/cognitive data
- IRB approval: Retrospective chart review, minimal risk, waiver of consent

**Validation**: Prospective testing (run model on new patients, compare to neurologist diagnosis)
- IRB approval: Minimal risk research, waiver of consent (observation only, no intervention)

**Deployment**: Clinical use (not research)
- Common Rule no longer applies (clinical care)
- But: Ongoing quality monitoring (may become research if faculty publishes results → IRB determines)

**Multi-Regulatory Compliance Summary**:

| Phase | FDA | HIPAA | Common Rule | Key Requirements |
|-------|-----|-------|-------------|------------------|
| **Training** | No (research) | Yes (PHI) | Yes (human subjects) | IRB waiver, de-ID or authorization, BAA if cloud |
| **Validation** | No (research) | Yes (PHI) | Yes (human subjects) | IRB approval, access to PHI |
| **FDA Submission** | **Yes** | Yes (PHI in validation data) | No (validation complete) | 510(k) submission, performance data, labeling |
| **Deployment** | **Yes** (post-market surveillance) | Yes (safeguards) | No (clinical care) | FDA clearance maintained, HIPAA safeguards, monitoring |

**Total Timeline**: 18-24 months from start to clinical deployment

**Total Cost**: $100,000-$250,000 (research, validation, FDA submission, deployment)

#### When to Consult FDA

**Engage FDA Early** (Pre-Submission Program - free) if:
- Tool may be a medical device (not clearly exempt CDS)
- Novel AI approach (no clear predicate)
- High-risk application (oncology, cardiology, neurology)
- Unclear whether exempt CDS criteria met

**Pre-Submission Benefits**:
- FDA provides feedback on regulatory pathway (510(k), De Novo, PMA, or exempt)
- Clarifies performance testing requirements
- Identifies potential issues early
- Informal, non-binding (but very helpful)

**How to Request**:
1. Submit Pre-Submission request to FDA (form available on FDA website)
2. Describe device, intended use, proposed regulatory pathway
3. Specific questions for FDA
4. FDA schedules meeting (typically 2-3 months from request)
5. 30-60 minute meeting (phone or in-person)

**Faculty Should Consult FDA Before**:
- Designing expensive validation studies (FDA feedback may change study design)
- Committing to specific AI architecture (FDA may have performance expectations)
- Seeking venture funding (investors want to know FDA pathway and timeline)

#### FDA + HIPAA Intersection: Key Points

**Both Frameworks Apply Independently**:
- Meeting HIPAA requirements ≠ Meeting FDA requirements
- FDA clearance ≠ HIPAA compliance

**Example**:
- AI diagnostic tool is FDA-cleared (510(k)) → Safe and effective per FDA
- Same tool uses PHI → Must comply with HIPAA (encryption, access controls, BAAs if cloud, training for users)

**Training Data**:
- **FDA cares about**: Data quality, representativeness, size, labeling accuracy, performance on intended use population
- **HIPAA cares about**: Privacy (was PHI used? Authorization or waiver? De-identification?)

**Deployment**:
- **FDA cares about**: Post-market surveillance, adverse event reporting, PCCP implementation, performance monitoring
- **HIPAA cares about**: Safeguards (encryption, access controls, audit logs), breach notification if PHI exposed

**Both Apply to Cloud AI**:
- **FDA**: If device is cloud-based software → Still a device, same requirements (510(k), labeling, PCCP)
- **HIPAA**: Cloud vendor must sign BAA, encryption required, access controls

#### Summary: Multi-Regulatory Compliance for Faculty

**Key Takeaways**:

**1. Assess All Applicable Regulations**:
- Is it a medical device (FDA)?
- Does it use PHI (HIPAA)?
- Is it human subjects research (Common Rule)?
- Does it involve genetics (GINA), substance abuse (Part 2), students (FERPA)?

**2. Regulatory Requirements are Cumulative**:
- AI clinical tool may require: FDA clearance + HIPAA compliance + IRB approval
- Must meet **all** applicable requirements

**3. Plan for Multi-Regulatory Compliance From Start**:
- Design AI tool with both FDA transparency (independent review) and HIPAA safeguards (encryption, access controls) in mind
- Document training data, performance, validation for both FDA and HIPAA purposes

**4. Timeline and Cost**:
- FDA 510(k): 6-12 months, $50K-$150K
- HIPAA compliance: Ongoing, relatively low cost (training, encryption, BAA with cloud)
- Common Rule IRB: 1-3 months, minimal cost

**5. Get Expert Help**:
- FDA: Pre-Submission Program, regulatory affairs consultants
- HIPAA: Privacy Officer, IRB
- Legal: Institutional counsel for multi-regulatory compliance strategies

**6. Resources**:
- FDA Digital Health Center of Excellence
- FDA Pre-Submission Program
- NIH HIPAA & Research guidance
- Professional organizations (AMIA, HIMSS, AdvaMed)

---

### 1.2 Covered Entities & Business Associates

#### Covered Entities

**Definition** (45 C.F.R. § 160.103): A covered entity is:
1. A health plan, OR
2. A health care clearinghouse, OR
3. A health care provider who transmits any health information in electronic form in connection with a covered transaction

**Health Plans** include:
- Group health plans
- Health insurance issuers
- HMOs, Medicare, Medicaid, military/veterans health programs

**Health Care Clearinghouses**:
- Entities that process nonstandard health information into standard formats

**Covered Health Care Providers**:
- Hospitals, clinics, physicians, psychologists, dentists, etc.
- **Test**: Transmit PHI electronically for transactions such as claims, eligibility inquiries, referral authorization requests

**Research Context Examples**:

**Example 1: University Hospital vs. University Researcher**
- **University Hospital** treating patients = Covered entity (health care provider)
- **University researcher** (not providing treatment, not billing) = NOT covered entity
- **Implication**: If researcher accesses hospital EHR data for research, hospital is disclosing PHI and must comply with Privacy Rule; researcher is not directly covered but may be subject to institutional policies and IRB requirements

**Example 2: Clinical Trial Site**
- **Clinical trial site** providing treatment to trial participants = Covered entity (if transmits PHI electronically for billing)
- **Sponsor company** conducting trial = NOT covered entity
- **Implication**: Trial site must have HIPAA authorization or waiver for research disclosures

#### Business Associates

**Definition** (45 C.F.R. § 160.103): A business associate is a person or entity that:
- Performs functions or activities on behalf of, or provides services to, a covered entity
- **Where the function/service involves** access to protected health information

**Examples relevant to research**:
1. **Cloud service provider** storing EHR data or research datasets with PHI
2. **Data coordinating center** in a multi-site study
3. **Health Information Exchange (HIE)** facilitating data sharing between hospitals
4. **Transcription service** processing clinical notes
5. **IT vendor** providing EHR system maintenance
6. **Statistical analysis vendor** analyzing PHI
7. **Data storage company** hosting research database with PHI
8. **AI/ML platform vendor** training models on PHI

**NOT business associates**:
- Workforce members (employees, volunteers, trainees) of covered entity
- "Conduit" services that merely transmit data without access (e.g., internet service provider, postal service)

**Business Associate Agreement (BAA) Requirements** (45 C.F.R. § 164.504(e)):

A BAA must:
1. **Establish permitted and required uses/disclosures** by business associate
2. **Prohibit uses/disclosures** not authorized by the agreement
3. **Require appropriate safeguards** to prevent unauthorized use/disclosure
4. **Require business associate** to:
   - Report security incidents and breaches
   - Ensure subcontractors comply (with written agreements)
   - Make PHI available for individual access
   - Make PHI available for amendment
   - Provide accounting of disclosures
   - Make internal practices/records available to HHS for compliance review
   - Return or destroy PHI at termination (if feasible)
5. **Authorize termination** by covered entity if business associate violates material term

**WHO CAN SIGN BAAs (Critical for Faculty)**:

**Only authorized institutional officials** can sign BAAs on behalf of the covered entity. This typically includes:
- Privacy Office / Privacy Officer
- Legal Department / General Counsel
- Contracts Office
- **NOT individual faculty, researchers, department chairs** (unless specifically authorized by institution)

**Institutional Variation**: The authorized signing official varies by institution. **Always check your institutional policy** for who has authority to execute BAAs.

**Faculty Action**:
1. **Before using cloud vendor or service** that will access PHI:
   - Check with Privacy Office or IT: "Does our institution have a BAA with [Vendor]?"
   - If YES: Proceed with vendor (following institutional procedures for HIPAA-compliant use)
   - If NO: Request Privacy Office to evaluate vendor and execute BAA if appropriate
   - **Do NOT**: Sign BAA yourself or proceed without institutional BAA

2. **For research collaborations**:
   - Multi-site studies: Each institution's authorized official signs multi-party BAA
   - Data coordinating center: Your institution's authorized official signs BAA with DCC

3. **Timing**: BAA execution can take weeks to months (vendor review, legal review, negotiation) → **Plan ahead**

**Research-Specific BAA Considerations**:
- Define scope: Is BA authorized to de-identify data for research use?
- Data retention: How long can BA keep data after covered entity terminates agreement?
- Publication: Can BA use aggregated/de-identified data for publications?
- Subcontractors: If BA uses cloud storage, is there a BAA with cloud provider?

**Subcontractor Chains**:
Covered Entity → Business Associate → Subcontractor

Each link requires a written agreement ensuring HIPAA compliance. Example:
- Hospital (covered entity) → Data Coordinating Center (BA) → Cloud Storage Provider (subcontractor)
- Hospital must have BAA with DCC
- DCC must have BAA with Cloud Provider

#### Decision Tree: Am I a Business Associate?

```
START: Do you access, use, or disclose PHI?
  ↓ NO → Not a business associate
  ↓ YES
Are you a workforce member of the covered entity?
  ↓ YES → Not a business associate (workforce member)
  ↓ NO
Are you performing a function/service on behalf of a covered entity?
  ↓ NO → Not a business associate (may be treating as covered entity yourself)
  ↓ YES
Does your function/service require access to PHI?
  ↓ NO → Not a business associate
  ↓ YES
Are you merely transmitting data without accessing content (conduit)?
  ↓ YES → Not a business associate
  ↓ NO
→ YOU ARE A BUSINESS ASSOCIATE → BAA required
```

**Research Scenarios**:

**Scenario A**: Researcher at University A obtains de-identified data from Hospital B for a study
- **Hospital B** = Covered entity
- **Researcher** = NOT a business associate (data is de-identified, not PHI)
- **BAA Required?** No

**Scenario B**: Researcher at University A obtains identifiable data from Hospital B for a study, with IRB-approved waiver of authorization
- **Hospital B** = Covered entity disclosing PHI for research
- **Researcher/University A** = NOT a business associate (receiving PHI for research use, not performing function "on behalf of" Hospital B)
- **BAA Required?** No
- **What's Required?** IRB/Privacy Board waiver documentation, researcher representations

**Scenario C**: Data Coordinating Center (DCC) manages multi-site trial data including PHI from 10 hospitals
- **Each hospital** = Covered entity
- **DCC** = Business associate of each hospital
- **BAA Required?** Yes, between each hospital and DCC (can be single multi-party BAA)

**Scenario D**: Cloud AI platform processes PHI to train diagnostic model for Hospital
- **Hospital** = Covered entity
- **Cloud AI platform** = Business associate
- **BAA Required?** Yes
- **Key BAA terms**: Permitted use (AI training), safeguards (encryption, access controls), data deletion after training

---

### 1.3 What is Protected Health Information (PHI)?

#### Three-Part Definition Test

**Protected Health Information** (45 C.F.R. § 160.103) means individually identifiable health information that is:

1. **Transmitted by electronic media, OR**
2. **Maintained in electronic media, OR**
3. **Transmitted or maintained in any other form or medium**

**AND is**:

4. **Held or transmitted by**:
   - A covered entity, OR
   - A business associate of a covered entity

**Individually identifiable health information** means information that:

**Part 1**: Relates to:
- Past, present, or future **physical or mental health or condition**, OR
- Provision of **health care**, OR
- Past, present, or future **payment for health care**

**Part 2**: **Identifies the individual**, OR there is a **reasonable basis to believe** the information can be used to identify the individual

**Part 3**: Is created or received by:
- A health care provider, health plan, employer, or health care clearinghouse

#### What IS PHI: Research-Specific Examples

**Example 1**: Blood samples with patient medical record number
- Relates to health (blood tests)
- Identifies individual (MRN)
- Held by covered entity (hospital lab)
- **= PHI**

**Example 2**: Genomic sequencing data linked to participant ID in research database
- Relates to health (genetic information)
- Identifies individual (participant ID can be linked back)
- If held by covered entity or its business associate **= PHI**
- If held by researcher who is NOT covered entity/BA **= NOT PHI** (but may be identifiable human subjects data under Common Rule)

**Example 3**: EHR data exported for AI model training, includes diagnosis codes, dates of service, patient ID
- Relates to health care (diagnoses, dates of service)
- Identifies individual (patient ID)
- Held by covered entity or BA **= PHI**

**Example 4**: Patient-reported outcomes (PROs) collected via app, linked to email address
- Relates to health (symptoms, quality of life)
- Identifies individual (email address)
- If app vendor is business associate of covered entity **= PHI**

**Example 5**: De-identified dataset (Safe Harbor method applied) for public research repository
- Relates to health ✓
- Does NOT identify individual (all identifiers removed per Safe Harbor)
- **= NOT PHI** (de-identified)

#### What is NOT PHI

**Aggregate data**: No individual-level information
- Example: "35% of patients with diabetes in our clinic achieved HbA1c < 7%"
- **NOT PHI** (no individuals identifiable)

**De-identified data** (properly de-identified per 45 C.F.R. § 164.514):
- Safe Harbor method: 18 identifiers removed + no actual knowledge of residual re-identification risk
- Expert Determination method: Very small re-identification risk as determined by qualified expert
- **NOT PHI**

**Information not created/received by covered entity**:
- Example: Researcher collects health information directly from participants via survey, researcher is not affiliated with any covered entity
- **NOT PHI** (not created/received by covered entity/health plan/clearinghouse)
- BUT: May be human subjects data under Common Rule, requiring IRB oversight and informed consent

**Employment records held by employer** (not in role as health care provider):
- Example: Sick leave records in HR file
- **NOT PHI** (held by employer in HR capacity, not as health plan or provider)

**Education records covered by FERPA**:
- Example: Student grades, disciplinary records
- **NOT PHI**
- EXCEPTION: Treatment records maintained by university health service ARE PHI

#### Special Categories of PHI

**1. Psychotherapy Notes**

**Definition** (45 C.F.R. § 164.501): Notes recorded by a mental health professional documenting or analyzing conversation during private counseling session, kept separate from medical record

**What COUNTS as psychotherapy notes**:
- Notes about therapeutic conversations in individual, group, joint, or family counseling sessions
- Kept separately from the rest of the medical record
- Not shared with other providers

**What DOES NOT count**:
- Medication prescription and monitoring
- Counseling session start and stop times
- Modalities and frequencies of treatment
- Clinical test results
- Diagnoses (DSM codes)
- Functional status
- Treatment plan
- Symptoms
- Prognosis
- Progress to date

**Special Protection**: Almost always requires individual's specific authorization for disclosure, **even for treatment purposes** (45 C.F.R. § 164.508(a)(2))

**Research Implication**: Cannot use waiver of authorization for psychotherapy notes. If research requires psychotherapy notes, must obtain individual authorization.

**2. Genetic Information**

**Intersection with GINA**: Genetic Information Nondiscrimination Act prohibits health insurers and employers from discriminating based on genetic information

**Genetic information includes**:
- Genetic tests of individual
- Genetic tests of family members
- Manifestation of disease/disorder in family members (family medical history)
- Request for or receipt of genetic services

**Research Considerations**:
- Genomic research datasets are PHI if identifiable
- De-identification challenging (genomic data itself is quasi-identifier)
- Controlled-access repositories (e.g., dbGaP) use Data Use Agreements
- Tiered consent models (use in this study, future research, data sharing)

**3. Substance Abuse Treatment Records (42 CFR Part 2)**

**More stringent than HIPAA**: Records of identity, diagnosis, prognosis, or treatment of any patient maintained in connection with a federally assisted substance abuse program

**Key Differences from HIPAA**:
- Patient consent required for most disclosures, **including treatment** (with limited exceptions)
- No waiver of consent for research
- Specific consent form requirements
- Prohibition on redisclosure

**Research Implication**: Studies involving substance abuse treatment records require Part 2-compliant consent, which is more restrictive than HIPAA authorization

#### PHI in Research Data Lifecy cle

**Data Collection**:
- Clinical encounters generate PHI (EHR notes, lab results, imaging)
- Research visits may or may not generate PHI (depends on whether conducted by covered entity)
- Patient-reported outcomes via app/survey: PHI if app vendor is business associate

**Data Storage**:
- Research database with PHI: Must have safeguards (encryption, access controls, audit logs)
- Cloud storage: Business associate agreement required

**Data Analysis**:
- Statistical software accessing PHI: Access controls, audit trails
- AI/ML training on PHI: Consider de-identification first; if not feasible, BAA with platform vendor

**Data Sharing**:
- Sharing identifiable data: Requires authorization or waiver
- Sharing de-identified data: No HIPAA restrictions
- Sharing limited data set: Data Use Agreement required

**Data Retention & Destruction**:
- HIPAA requires retention per BAA terms or state law
- Secure destruction: Shredding (paper), degaussing/physical destruction (electronic media)

---

### 1.4 Health Information Organizations (HIOs) in Research

#### HIO Definition & Functions

**Health Information Organization (HIO)**: "An organization that oversees and governs the exchange of health-related information among organizations according to nationally recognized standards" (National Alliance for Health Information Technology, 2008)

**Synonyms**: Health Information Exchange (HIE), Regional Health Information Organization (RHIO), Qualified Health Information Network (QHIN)

**Common Functions**:
1. **Record Locator Service**: Identify which participating providers have information on a patient
2. **Master Patient Index**: Match patient identity across different systems
3. **Data Exchange Infrastructure**: Routes information between participants
4. **Privacy Preference Management**: Enforce patient consent directives (opt-in, opt-out, restrictions)
5. **Data Standardization**: Transform data into common formats
6. **Query-Based Exchange**: Providers query for specific patient information
7. **Push/Alerts**: Send notifications (e.g., ED visit alerts)

**HIO Models**:
- **Centralized**: HIO stores copies of data from participants
- **Federated**: Data stays at source; HIO routes queries
- **Hybrid**: Combination of centralized index with federated data access

#### HIOs as Business Associates

**Typical Structure**:
- HIO is separate legal entity (not covered entity)
- Multiple covered entities (hospitals, clinics) participate
- HIO performs functions involving PHI access → HIO is business associate of each covered entity

**Multi-Party Business Associate Agreement**:

Option 1: **Single Multi-Party BAA**
- One agreement signed by HIO and all participating covered entities
- Efficiency: Only one document to negotiate and maintain
- Challenge: New participants must agree to all existing terms

Option 2: **Individual BAAs**
- Separate BAA between HIO and each covered entity
- Flexibility: Customized terms per entity
- Burden: Multiple agreements to manage

**BAA Terms for HIO**:
- **Permitted Uses/Disclosures**: Exchange PHI among participants for treatment, payment, operations (as authorized)
- **Safeguards**: Encryption in transit, access controls, audit logging, authentication
- **Patient Rights Support**: Facilitate access requests, amendment requests, accounting of disclosures
- **Breach Notification**: Report breaches to covered entities within X days
- **Subcontractors**: Requirement to have BAAs with technology vendors
- **Termination**: Return or destroy PHI (if feasible)

#### Research Use Cases for HIOs

**Use Case 1: Multi-Site Observational Study**

**Setup**:
- 3 hospitals participate in HIO for clinical care coordination
- Researcher wants to conduct study using EHR data from all 3 hospitals

**HIPAA Analysis**:
1. Each hospital = Covered entity
2. HIO = Business associate of each hospital
3. Researcher requests data from each hospital (not from HIO directly)
4. Each hospital must determine whether to disclose:
   - **Option A**: De-identify data → No authorization needed
   - **Option B**: Obtain individual authorizations from patients
   - **Option C**: Obtain IRB/Privacy Board waiver of authorization
5. If hospitals choose Option C (waiver):
   - Hospitals can disclose to researcher
   - Researcher makes representations (data needed, can't be done without waiver, identifiers will be destroyed when feasible, no redisclosure without authorization)
6. HIO's role:
   - May assist hospitals in identifying relevant patients via query
   - May extract/aggregate data on behalf of hospitals (as business associate function)
   - Researcher is **not** business associate of hospitals (receiving data for research, not performing function on behalf of hospitals)

**Use Case 2: Real-Time Clinical Decision Support Using AI**

**Setup**:
- Hospital deploys AI model for sepsis prediction
- Model queries HIO for recent lab results from other facilities

**HIPAA Analysis**:
1. Hospital (deploying model) = Covered entity
2. HIO = Business associate
3. Model queries for **treatment purposes** → No authorization required (45 C.F.R. § 164.506)
4. HIO must be authorized in BAA to:
   - Respond to automated queries
   - Apply access controls (verify query is from authorized provider)
   - Log all accesses for audit

**Use Case 3: De-Identified Data Warehouse for Research**

**Setup**:
- HIO aggregates data from 10 hospitals
- HIO applies Safe Harbor de-identification
- HIO makes de-identified dataset available to researchers

**HIPAA Analysis**:
1. HIO (as business associate) may de-identify PHI only if BAA authorizes this function
2. Once properly de-identified → No longer PHI → HIPAA doesn't apply
3. HIO can make de-identified data available for any purpose (subject to BAA terms and state law)
4. Researchers using de-identified data are not subject to HIPAA for that dataset

#### Record Locator Services & Master Patient Index

**Record Locator Service**:
- Function: When provider queries for "John Doe born 1/1/1980", service returns list of participating facilities that have records for that patient
- **HIPAA Analysis**: Service accesses PHI (patient names, dates of birth) → Business associate function
- **Minimum Necessary**: Service returns only enough information to locate records (facility names, dates of service), not full medical records

**Master Patient Index (MPI)**:
- Function: Links patient identities across different systems (e.g., "John Doe MRN 12345 at Hospital A" = "J. Doe MRN 67890 at Clinic B")
- **HIPAA Analysis**:
  - Creating/maintaining MPI = Use of PHI for health care operations (45 C.F.R. § 164.501 definition of "health care operations")
  - Purpose: Facilitate exchange of health information for permitted purposes (treatment, payment, operations)
  - HIO as business associate may perform MPI function on behalf of covered entities

**Matching Algorithms**:
- Deterministic: Exact matches on identifiers (SSN, name, DOB)
- Probabilistic: Weighted scores based on multiple fields (name variants, address, phone)
- **Privacy Challenge**: False positives (linking wrong patients) vs. false negatives (missing valid matches)

**Research Application**: Multi-site studies can use MPI (via HIO as business associate) to identify common patients across facilities, enabling longitudinal analysis

---

## Section 2: De-identification Methods

### 2.1 Why De-identify?

**Primary Benefit**: De-identified health information is **not PHI** → HIPAA Privacy Rule does not apply

**Advantages of De-identification**:
1. **No use/disclosure restrictions**: Can share openly for research, public health, quality improvement
2. **No authorization required**: Individuals don't need to consent to uses of de-identified data
3. **No Business Associate Agreements**: Recipients are not business associates
4. **No breach notification**: If de-identified data is lost/stolen, not a HIPAA breach
5. **Enable open science**: Publish datasets in public repositories
6. **Facilitate collaboration**: Share across institutions without complex data use agreements

**When NOT to De-identify**:

**1. Longitudinal Studies Requiring Re-Contact**:
- Need to follow participants over time
- Need to link to future data
- **Alternative**: Use coded data with honest broker maintaining linkage

**2. Clinical Care Integration**:
- Research results need to be returned to clinical chart
- Treatment decisions depend on research findings
- **Alternative**: Obtain authorization for use of identifiable data

**3. Rare Populations Where De-identification Infeasible**:
- Very small sample sizes (even ZIP code might be too identifying)
- Unique characteristics (e.g., only patient with certain combination of rare diseases)
- **Alternative**: Use limited data set with Data Use Agreement, or obtain authorization

**4. Need for High Geographic/Temporal Granularity**:
- Public health surveillance requiring neighborhood-level data
- Time-series analysis needing precise dates
- **Alternative**: Use limited data set (retains dates and geography) with Data Use Agreement

#### Research Data Uses That Benefit from De-identification

**Example 1**: Training AI/ML models for diagnostic tasks
- **With Identifiers**: Requires authorization or waiver, BAA with cloud platform, complex data governance
- **De-identified**: No HIPAA restrictions, can use any cloud platform, easier to share across institutions

**Example 2**: Publishing supplementary datasets with manuscript
- **With Identifiers**: HIPAA violation (disclosure without authorization)
- **De-identified**: Permitted, supports reproducibility, advances open science

**Example 3**: Multi-Site Comparative Effectiveness Research
- **With Identifiers**: BAAs between sites, complex data sharing agreements, authorization or waiver at each site
- **De-identified**: Each site de-identifies, shares to central coordinating center, no BAAs needed (for de-identified data)

---

### 2.2 Safe Harbor Method

**Regulatory Basis**: 45 C.F.R. § 164.514(b)(2)

**Two Requirements**:
1. Remove the following **18 identifiers** of the individual and individual's relatives, employers, household members
2. The covered entity does not have **actual knowledge** that the remaining information could be used alone or in combination to identify the individual

#### The 18 Identifiers (Verbatim from Regulation)

Must remove:

**1. Names**
- Full names, last names, first names, middle names, maiden names
- Includes aliases, nicknames if used consistently
- Initials if uniquely identifying

**2. All geographic subdivisions smaller than a state**
- Street addresses, city, county, precinct, ZIP code (see exception below)
- **EXCEPTION**: May retain first 3 digits of ZIP code if geographic unit formed by combining all ZIP codes with same 3 initial digits contains more than 20,000 people
- **Change all elements of dates (except year)** for dates that are directly related to an individual (birth, admission, discharge, death, dates of service)
   - May retain year
   - May retain age if not over 89 years
   - **For individuals over 89**: Aggregate into single category "90 or older"

**4. Telephone numbers**
- Mobile, home, work numbers
- Fax numbers (covered separately below, but good practice to include here)

**5. Fax numbers**

**6. Email addresses**

**7. Social Security numbers**

**8. Medical record numbers**

**9. Health plan beneficiary numbers**
- Insurance member IDs, policy numbers

**10. Account numbers**
- Hospital account numbers, billing account numbers

**11. Certificate/license numbers**
- Driver's license, professional licenses, birth certificate number

**12. Vehicle identifiers**
- License plate numbers, VIN numbers

**13. Device identifiers and serial numbers**
- Pacemaker serial numbers, prosthetic device IDs, smartphone IMEI numbers

**14. Web URLs**

**15. Internet Protocol (IP) addresses**

**16. Biometric identifiers**
- Fingerprints, voiceprints, retinal scans, iris scans
- **Note**: Full-face photographs are covered separately (#17)

**17. Full-face photographs and any comparable images**
- Includes images of face, distinguishing features (tattoos, scars if identifying)
- Excludes: X-rays, CT scans, MRIs (unless face is identifiable)

**18. Any other unique identifying number, characteristic, or code**
- EXCEPT: Code assigned by researcher to permit re-identification by covered entity (see Coding Rule below)
- Examples to remove: Unique study IDs if could be linked back, rare diagnosis codes if only patient has that combination

#### Special Rules for Dates

**What to do with dates**:
- Remove specific dates (month/day)
- May retain **year only**
- May retain age (if ≤89 years)
- Aggregate ages >89 into "90 or older"

**Which dates**:
- Birth date → Year of birth or age (if ≤89)
- Admission date → Year only
- Discharge date → Year only
- Date of death → Year only
- Dates of service → Year only
- Surgery date → Year only
- Lab test date → Year only

**Calculating Age from Dates**:
- **Permitted**: "Patient was 45 years old at diagnosis" (if patient ≤89)
- **Permitted**: "Patient was in the 90+ age group"
- **NOT Permitted**: "Patient was 92 years old" (must aggregate to 90+)

**Time Intervals**:
- **Permitted**: "12 months elapsed between diagnosis and treatment"
- **NOT Permitted**: "Diagnosed on 3/15/2019, treated on 3/20/2020" (specific dates removed)

#### Special Rules for Geographic Information

**State**: Permitted to retain

**ZIP Code**:
- **Full ZIP (5-digit)**: Remove
- **First 3 digits**: Permitted **IF** the geographic area formed by combining all ZIP codes with those same 3 digits contains **more than 20,000 people**
- **How to check**: Use Census data for ZIP Code Tabulation Areas (ZCTAs)
- **If fewer than 20,000 people**: Remove all ZIP code digits (may retain state)

**Example**:
- ZIP 90210 (Beverly Hills, CA) first 3 digits = 902
- Geographic area with all 902XX ZIP codes has > 20,000 people
- **May retain 902** in de-identified dataset

**Rural Areas**:
- Many rural 3-digit ZIP code areas have < 20,000 people
- Must remove entire ZIP code, retain only state

**City/County**: Remove (geographic subdivision smaller than state)

#### Coding Rule Exception

**45 C.F.R. § 164.514(c)**: Covered entity may assign code to de-identified data to permit re-identification by covered entity, provided:

1. Code is not derived from or related to information about the individual
2. Code is not otherwise capable of being translated to identify the individual
3. Covered entity does not use or disclose the code for any other purpose
4. Covered entity does not disclose the mechanism for re-identification

**Research Application**:
- Hospital de-identifies dataset for researcher
- Hospital assigns random codes (e.g., SUBJ001, SUBJ002)
- Hospital maintains secure linkage file (code → MRN)
- Researcher cannot re-identify
- Hospital can re-identify if needed (e.g., to report critical research finding back to patient's clinician)

**Key Limitation**: Code must be **created by covered entity**, not by researcher. If researcher creates study ID, that ID may be retained only if researcher is not a covered entity.

#### Research Implications of Safe Harbor

**Advantages**:
- Clear, objective standard
- No need for statistical expertise
- Provides legal safe harbor (if properly applied, data is definitely de-identified)

**Limitations**:

**1. Loss of Granularity**:
- Dates reduced to years → Limits time-series analysis
- ZIP codes removed → Limits geographic health disparities research
- Ages 90+ aggregated → Limits geriatric research

**2. Re-identification Risk from Combinations**:
- Even with 18 identifiers removed, combinations of other variables may be identifying
- Example: "95-year-old patient" (aggregated to 90+) + "Rare genetic disorder affecting 1 in million" + "Lives in Wyoming" (state OK) → Potentially identifiable
- **Mitigation**: Second requirement of Safe Harbor: No actual knowledge of re-identification risk

**3. Small Populations**:
- Rare diseases: May be only patient with specific combination of conditions
- Unique procedures: May be only patient who received experimental treatment
- **Mitigation**: Suppress or generalize rare values, or use Expert Determination

**Practical Steps for Applying Safe Harbor**:

**Step 1**: Create de-identification checklist (see Appendix C.1)

**Step 2**: Scan dataset for all 18 identifiers:
- Name fields: Remove
- Address fields: Remove city, ZIP; retain state
- Date fields: Replace with year; replace age >89 with "90+"
- Phone, fax, email: Remove
- SSN, MRN, insurance ID: Remove
- Account numbers: Remove
- URLs, IP addresses: Remove
- Device IDs: Remove
- Photos: Remove or mask faces
- Biometric data: Remove or use derived measures that aren't uniquely identifying

**Step 3**: Check for "actual knowledge" of residual risk:
- Review combinations of rare values
- Assess uniqueness (e.g., query: How many patients in dataset with this combination of characteristics?)
- If unique or near-unique: Generalize or suppress

**Step 4**: Document process:
- Date de-identification performed
- Method used (Safe Harbor)
- Person responsible
- Checklist completed
- Retain documentation 6 years (recommended)

**Step 5**: Retain de-identified dataset separately from original identified dataset

#### Case Study: De-identifying Genomic Data

**Challenge**: Genomic sequences themselves are uniquely identifying, even if name/MRN removed

**Safe Harbor Application**:
- Remove all 18 identifiers ✓
- **But**: Genomic sequence is "any other unique identifying number, characteristic" (#18)
- **Question**: Does Safe Harbor permit retaining genomic sequence?

**Analysis**:
- If genomic sequence is uniquely identifying → Must remove to meet Safe Harbor
- **Alternatives**:
  1. Use summary statistics (allele frequencies) instead of raw sequences
  2. Use Expert Determination to assess re-identification risk
  3. Use controlled-access repository with Data Use Agreement (not de-identified)
  4. Obtain authorization for use of identifiable data

**NIH Genomic Data Sharing Policy**: Requires controlled access for individual-level genomic data, even if partially de-identified. De-identification alone is insufficient for genomics.

---

### 2.3 Expert Determination Method

**Regulatory Basis**: 45 C.F.R. § 164.514(b)(1)

**Requirements**:
1. A person with appropriate knowledge of and experience with generally accepted statistical and scientific principles and methods for rendering information not individually identifiable:
   - Applying such principles and methods
   - Determines that the risk is very small that the information could be used, alone or in combination with other reasonably available information, by an anticipated recipient to identify an individual who is the subject of the information
   - Documents the methods and results of the analysis that justify such determination

#### When to Use Expert Determination

**Use Expert Determination when**:
- Safe Harbor is too restrictive (need to retain dates, smaller geographic areas, ages >89)
- Have statistical expertise available
- Re-identification risk can be quantified and demonstrated to be very small
- Need to publicly share data with reasonable re-identification protections

**Don't Use Expert Determination when**:
- Safe Harbor is feasible and sufficient
- Lack access to qualified expert
- Cannot tolerate any re-identification risk (even if very small)
- Recipient has access to information that could enable re-identification

#### Qualified Expert

**"Appropriate knowledge and experience"**: No specific credentials required, but typically:
- Statistician with expertise in disclosure limitation
- Computer scientist with privacy/security focus
- Epidemiologist with training in de-identification methods
- Professional certifications: IAPP (International Association of Privacy Professionals), or advanced degree in relevant field

**Expert's Responsibilities**:
1. **Apply** generally accepted statistical and scientific principles
2. **Determine** that re-identification risk is very small
3. **Document** methods and results

**Expert Documentation Must Include**:
- Expert's qualifications
- Methods used to assess re-identification risk
- Data about "reasonably available information" that could be used for re-identification
- Results of risk analysis (quantitative risk metrics)
- Justification for "very small" determination
- Date of determination

#### Statistical and Scientific Methods

**Common Approaches**:

**1. K-Anonymity**:
- Each combination of quasi-identifiers appears in at least k records
- Example: k=5 means every combination (ZIP, age, gender) appears for at least 5 people
- **Limitation**: Doesn't prevent attribute disclosure (if all k people have same diagnosis, diagnosis is revealed)

**2. L-Diversity**:
- Extension of k-anonymity
- Each equivalence class has at least l "well-represented" values for sensitive attributes
- Example: In every group of 5 people with same (ZIP, age, gender), at least 3 different diagnoses appear

**3. Differential Privacy**:
- Mathematical framework: Add calibrated noise to query results
- Guarantees that including/excluding any single individual changes outcome by only small amount
- Strong privacy guarantee but reduces data utility
- Commonly used in: Census data, large-scale aggregated statistics

**4. Risk-Based Metrics**:
- **Prosecutor risk**: Probability that attacker with background knowledge can identify specific individual
- **Journalist risk**: Probability that attacker can identify any individual in dataset
- **Marketer risk**: Probability that attacker can identify individual and learn sensitive attribute

**5. Uniqueness Analysis**:
- Count how many records have unique combinations of quasi-identifiers
- If record is unique in dataset and in population → High risk
- If record is one of many in dataset and in population → Low risk

#### "Very Small" Risk Threshold

**Regulation does not define** "very small"

**Common Interpretations**:
- Risk of re-identification < 0.04 (4%) for prosecutor risk
- Risk < 0.09 (9%) for journalist risk
- **Context-dependent**: Lower threshold for more sensitive data

**Factors Influencing Risk**:
1. **Data sensitivity**: HIV status requires lower risk tolerance than broken arm
2. **Anticipated recipient**: General public vs. trusted research collaborator
3. **Reasonably available information**: Public datasets, commercial data brokers, social media
4. **Population size**: Small town vs. large city (smaller population = higher risk)

#### Documentation Requirements

**Minimum Documentation**:

**1. Expert Qualifications**:
```
Dr. Jane Smith, PhD in Biostatistics, 15 years experience in statistical disclosure control.
Publications: [list relevant publications].
Professional affiliations: Fellow, American Statistical Association.
```

**2. Methods Applied**:
```
Applied k-anonymity with k=5 to quasi-identifiers (3-digit ZIP, age group, gender, race).
Conducted uniqueness analysis using 2020 US Census data for comparison population.
Calculated prosecutor risk using probabilistic record linkage methods.
```

**3. Reasonably Available Information Considered**:
```
- US Census 2020 Summary Files (publicly available)
- Medicare Limited Data Set (available to qualified researchers)
- Commercial marketing databases (assumed not available to research collaborators)
- Social media profiles (assumed not systematically matchable at scale)
```

**4. Results**:
```
k-anonymity: All equivalence classes have k≥5.
Uniqueness: 0 records are population-unique.
Prosecutor risk: max=0.032, mean=0.008
Journalist risk: 0.015
Determination: Risk is very small (<0.04 threshold).
```

**5. Justification**:
```
Based on established thresholds in literature (El Emam et al., 2011), prosecutor risk <0.04
is considered very small for health datasets shared with research collaborators.
Dataset will be shared only with IRB-approved researchers under Data Use Agreement,
limiting re-identification attempts.
```

**6. Limitations & Assumptions**:
```
Assumes attacker does not have access to original identified dataset.
Assumes attacker does not have insider knowledge of patients.
Re-assessment recommended if dataset is shared beyond intended recipients.
```

**7. Date of Determination**: March 15, 2026

#### Research Applications

**Use Case 1: Retaining Exact Dates for Time-Series Analysis**

**Research Need**: Study seasonal patterns in disease onset, requiring month/day

**Safe Harbor**: Would allow only year → Insufficient granularity

**Expert Determination**:
- Retain month/day, replace year with "year of study enrollment"
- Assess uniqueness of birth month/day combinations
- If re-identification risk < threshold → Determined to be de-identified
- **Alternative**: Use "days since baseline" instead of calendar dates (eliminates date identifier entirely)

**Use Case 2: Retaining 5-Digit ZIP Codes for Geographic Analysis**

**Research Need**: Health disparities study examining neighborhood-level factors

**Safe Harbor**: Would allow only 3-digit ZIP (and only if area >20,000 population)

**Expert Determination**:
- Retain 5-digit ZIP codes
- Apply k-anonymity: Combine (ZIP, age group, gender) → Ensure each combination has k≥10 individuals
- Generalize age (5-year groups) or suppress rare ZIP codes as needed
- Calculate re-identification risk using census data
- If risk < threshold → Determined to be de-identified

**Use Case 3: Patients Over 90 in Geriatric Study**

**Research Need**: Study cognitive decline in centenarians, need exact ages

**Safe Harbor**: Aggregates 90+ into single category

**Expert Determination**:
- Retain exact ages (including 95, 100, 105)
- Assess uniqueness: In dataset of 500, how many are centenarians?
- Apply suppression: If only 2 centenarians, may need to exclude or generalize
- Use geographic generalization (state only, not 3-digit ZIP) to reduce risk
- If risk < threshold → Determined to be de-identified

#### Comparison: Safe Harbor vs. Expert Determination

| Aspect | Safe Harbor | Expert Determination |
|--------|-------------|----------------------|
| **Requirement** | Remove 18 identifiers + no actual knowledge | Very small risk as determined by expert |
| **Expertise Needed** | None (objective checklist) | Qualified statistical/scientific expert |
| **Cost** | Low (in-house staff can apply) | Medium-High (expert time, documentation) |
| **Dates** | Year only | Can retain month/day if risk justified |
| **Geography** | 3-digit ZIP if >20K population | Can retain 5-digit ZIP if risk justified |
| **Ages >89** | Aggregate to "90+" | Can retain exact age if risk justified |
| **Defensibility** | Strong (meets letter of regulation) | Requires justification (meets spirit of regulation) |
| **Risk Tolerance** | Zero risk (if properly applied) | Very small risk (typically <4%) |

**Recommendation**: Use Safe Harbor when feasible. Use Expert Determination when Safe Harbor is too restrictive for valid research and qualified expert is available.

---

### 2.4 Limited Data Sets

**Regulatory Basis**: 45 C.F.R. § 164.514(e)

**Definition**: Protected health information from which certain **direct identifiers** have been removed, **but** may still contain some identifiers that would need to be removed for Safe Harbor de-identification

**Status**: Limited Data Set is **still PHI** (not fully de-identified), **but** may be used/disclosed for research, public health, or health care operations purposes without individual authorization **if** a Data Use Agreement is in place

#### The 16 Identifiers That Must Be Removed

Must remove the following identifiers of individual, relatives, employers, household members:

1. **Names**
2. **Street addresses** (but may retain city, state, ZIP code)
3. **Telephone numbers**
4. **Fax numbers**
5. **Email addresses**
6. **Social Security numbers**
7. **Medical record numbers**
8. **Health plan beneficiary numbers**
9. **Account numbers**
10. **Certificate/license numbers**
11. **Vehicle identifiers** (license plates, VIN)
12. **Device identifiers and serial numbers**
13. **Web URLs**
14. **Internet Protocol (IP) addresses**
15. **Biometric identifiers** (fingerprints, voiceprints)
16. **Full-face photographs and comparable images**

#### What Can Be Retained in Limited Data Set

**May include** (these must be removed for Safe Harbor, but permitted in Limited Data Set):
- **City**
- **State**
- **ZIP code** (all 5 digits)
- **Dates** (including birth, death, admission, discharge, service dates)
- **Ages** (including ages >89)

**Why Useful for Research**:
- **Geographic granularity**: Study regional variation, environmental exposures, social determinants
- **Temporal precision**: Time-series analysis, survival analysis, exact follow-up times
- **Elderly populations**: Geriatric research, centenarian studies

**What Still Must Be Removed**:
- Names, addresses, phone, email (same as Safe Harbor)
- MRN, SSN, account numbers (same as Safe Harbor)
- Photos, biometrics (same as Safe Harbor)
- **But**: Can assign researcher-created study ID (unlike Safe Harbor, which requires covered entity-created code)

#### Data Use Agreement (DUA) Requirements

**45 C.F.R. § 164.514(e)(4)**: Covered entity may disclose limited data set only if recipient agrees in writing (Data Use Agreement) to:

**Required DUA Provisions**:

1. **Establish permitted uses/disclosures**:
   - Limited to research, public health, or health care operations
   - Specific purposes described

2. **Limit uses/disclosures by recipient**:
   - Recipient may use/disclose only as permitted in agreement
   - Recipient may provide limited data set to collaborators only if they agree to same restrictions

3. **Prohibit re-identification attempts**:
   - Recipient agrees not to use or disclose information to identify individuals
   - No attempts to contact individuals

4. **Require safeguards**:
   - Administrative, physical, technical safeguards appropriate to protect PHI
   - Safeguards comparable to those covered entity would use

5. **Report violations**:
   - Recipient agrees to report any use/disclosure contrary to DUA

6. **Other provisions as deemed appropriate** by covered entity:
   - Duration of agreement
   - Allowed publications
   - Data retention/destruction
   - Audit rights
   - Indemnification

**DUA vs. Business Associate Agreement**:

| Aspect | DUA (for Limited Data Set) | BAA (for Full PHI) |
|--------|----------------------------|--------------------|
| **When Required** | Disclosure of limited data set | Business associate creates/receives/maintains PHI on behalf of covered entity |
| **Regulatory Basis** | 45 C.F.R. § 164.514(e) | 45 C.F.R. § 164.504(e) |
| **Relationship** | Arms-length (researcher, public health agency) | On behalf of (vendor providing service to covered entity) |
| **Permitted Uses** | Research, public health, health care operations | As specified in agreement (often broader) |
| **Individual Rights** | No access/amendment rights to recipient | Recipient must support access/amendment |
| **Breach Notification** | Covered entity's obligation (not recipient) | Business associate must notify covered entity |
| **Complexity** | Simpler, shorter | More complex, comprehensive |

#### Research Applications of Limited Data Sets

**Use Case 1: Geographic Health Disparities Study**

**Research Question**: Do rates of asthma hospitalization vary by ZIP code socioeconomic status?

**Safe Harbor**: Would permit only 3-digit ZIP codes (and only if area >20,000 population) → Loses granularity needed to link to census tract SES data

**Limited Data Set**: Retains 5-digit ZIP codes → Can link to census tract SES measures

**Requirements**:
- Hospital removes names, MRN, SSN, phone, email, addresses (but retains ZIP)
- Hospital executes DUA with researcher
- DUA specifies: Use for this study only, no re-identification attempts, safeguards required, data destruction after study completion

**Use Case 2: Survival Analysis with Exact Dates**

**Research Question**: Time from cancer diagnosis to death, accounting for treatment timing

**Safe Harbor**: Would permit only years → Loses precision (can't calculate survival in months/days)

**Limited Data Set**: Retains exact dates of diagnosis, treatment, death → Enables precise survival curves

**Requirements**:
- Cancer registry removes names, contact info, MRN (but retains dates)
- Registry executes DUA with researcher
- DUA prohibits attempts to identify individuals (even though dates could narrow down possibilities)

**Use Case 3: Multi-Site Study with Standardized Geographic Units**

**Research Question**: Comparing outcomes across 10 hospitals in different cities

**Safe Harbor**: Would permit only states → Cannot compare city-level differences

**Limited Data Set**: Retains city, state, ZIP → Enables city-level comparisons and adjustment for urban/rural status

**Requirements**:
- Each hospital removes identifiers (#1-16 above)
- Each hospital executes DUA with coordinating center
- Coordinating center aggregates data across sites

**Use Case 4: Elderly Cohort Study**

**Research Question**: Cognitive aging in adults 85-100 years old

**Safe Harbor**: Aggregates 90+ into single category → Loses ability to examine trends from 85 to 100

**Limited Data Set**: Retains exact ages including 90, 95, 100 → Enables age-stratified analysis

**Requirements**:
- Clinic removes direct identifiers
- Clinic executes DUA with researcher
- Even though exact age + rare diagnosis might be re-identifying, DUA prohibits re-identification attempts

#### Limitations and Risks of Limited Data Sets

**Still PHI**: Limited data set remains protected health information
- Breach notification required if lost/stolen
- Must have safeguards (encryption, access controls)
- HIPAA Privacy and Security Rules still apply (except individual authorization not required)

**Re-identification Risk**:
- ZIP code + date of birth + gender = Can narrow down to small number of individuals
- Rare diagnosis + city + age = May be uniquely identifying
- **Mitigation**: DUA prohibits re-identification, but cannot guarantee no attempts will be made

**State Law Preemption**:
- Some states have more stringent requirements for disclosure of identifiable data
- Limited data set may not be permitted under state law even with DUA
- **Example**: Some states require authorization for any disclosure of HIV status, even in limited data set

**Not Appropriate for Public Sharing**:
- Limited data set should be shared only with specific recipients under DUA
- Not appropriate for open data repositories (too much re-identification risk)
- For public sharing, use Safe Harbor or Expert Determination

#### Template DUA Provisions

**Sample DUA Sections** (see Appendix B.2 for complete template):

**1. Purpose**:
```
The limited data set will be used solely for the purpose of conducting research titled
"Geographic Variation in Cardiovascular Outcomes" as described in the protocol approved
by [Institution] IRB on [date].
```

**2. Permitted Uses**:
```
Recipient may use the limited data set only for the purposes described above.
Recipient may disclose the limited data set to collaborators only if collaborators agree
in writing to same terms and restrictions.
```

**3. Prohibition on Re-identification**:
```
Recipient agrees not to use or disclose information in the limited data set to identify
individuals or to contact individuals. Recipient will not attempt to link the limited
data set to other datasets that could enable re-identification.
```

**4. Safeguards**:
```
Recipient will implement administrative, physical, and technical safeguards to protect
the limited data set from unauthorized access, use, or disclosure. At minimum:
- Store on encrypted devices/servers
- Limit access to authorized personnel
- Use unique user IDs and strong passwords
- Maintain audit logs of access
```

**5. Reporting**:
```
Recipient will report to Covered Entity any use or disclosure contrary to this agreement
within 5 business days of becoming aware.
```

**6. Data Retention/Destruction**:
```
Recipient will destroy the limited data set within 30 days of study completion or by [date],
whichever is earlier. Destruction will be by secure deletion (electronic) or shredding (paper).
Recipient will certify destruction in writing to Covered Entity.
```

**7. Publications**:
```
Recipient may publish results based on limited data set, provided publications do not include
cell sizes <11 or other information that could lead to identification of individuals.
```

**8. Term & Termination**:
```
This agreement is effective [date] and terminates on [date] or upon data destruction,
whichever is earlier. Covered Entity may terminate immediately if Recipient breaches
material term.
```

---

### 2.5 De-identification Decision Tree

**START**: Do you need to use/disclose health information for research?
  ↓
**Q1**: Is the information held by a HIPAA covered entity or business associate?
  → NO: HIPAA doesn't apply (but may be human subjects research under Common Rule) → END
  → YES: Continue
  ↓
**Q2**: Does your research question require **individual-level** data?
  → NO: Use aggregate data (counts, percentages, means) → No HIPAA restrictions → END
  → YES: Continue
  ↓
**Q3**: Does your research require **identifiable** data (need to link to future data, re-contact participants, return results)?
  → YES: De-identification not feasible → Skip to **Authorization/Waiver pathway** (see § 3.4)
  → NO: Continue to de-identification assessment
  ↓
**Q4**: What level of granularity do you need for **dates**?
  - **Year only**: Safe Harbor feasible for dates → Go to Q5
  - **Month/day needed**: Limited Data Set or Expert Determination → Go to Q5
  ↓
**Q5**: What level of granularity do you need for **geography**?
  - **State only**: Safe Harbor feasible for geography → Go to Q6
  - **3-digit ZIP (if population >20K)**: Safe Harbor feasible → Go to Q6
  - **5-digit ZIP or city**: Limited Data Set or Expert Determination → Go to Q6
  ↓
**Q6**: What is the age range of your population?
  - **All ≤89 years**: Safe Harbor feasible for age → Go to Q7
  - **Includes >89 but can aggregate to "90+"**: Safe Harbor feasible → Go to Q7
  - **Need exact ages >89**: Limited Data Set or Expert Determination → Go to Q7
  ↓
**Q7**: Are there **rare combinations** of characteristics that might be uniquely identifying?
  - Examples: Only patient with rare genetic disorder in small state; only centenarian with specific diagnosis
  - → NO: Safe Harbor likely sufficient → Go to Q8
  - → YES: May need suppression, generalization, or Expert Determination → Go to Q8
  ↓
**Q8**: Do you have access to a **qualified expert** to perform statistical disclosure control?
  → YES: Consider Expert Determination if more granularity needed than Safe Harbor provides → Go to Q9
  → NO: Use Safe Harbor or Limited Data Set → Go to Q9
  ↓
**Q9**: Will you **publicly share** this dataset (e.g., open repository)?
  → YES: Use Safe Harbor or Expert Determination (not Limited Data Set) → Choose method below
  → NO: Limited Data Set with DUA is option → Choose method below
  ↓
**CHOOSE DE-IDENTIFICATION METHOD**:

**Option A: Safe Harbor**
- **Use when**:
  - Year-only dates sufficient
  - State or 3-digit ZIP sufficient
  - Can aggregate ages 90+
  - Want objective, defensible standard
  - No statistical expertise needed
- **Process**:
  1. Remove all 18 identifiers (use checklist, Appendix C.1)
  2. Assess no actual knowledge of residual risk
  3. Document method and date
- **Outcome**: **De-identified** (not PHI), no HIPAA restrictions
- → END

**Option B: Expert Determination**
- **Use when**:
  - Need exact dates, 5-digit ZIP, or ages >89
  - Have qualified expert available
  - Can quantify and justify re-identification risk <threshold
  - Will share only with trusted recipients
- **Process**:
  1. Engage qualified expert
  2. Apply statistical methods (k-anonymity, uniqueness analysis, risk metrics)
  3. Expert determines risk is "very small"
  4. Expert documents methods, results, justification
- **Outcome**: **De-identified** (not PHI), no HIPAA restrictions
- → END

**Option C: Limited Data Set**
- **Use when**:
  - Need exact dates, 5-digit ZIP, city, or ages >89
  - Will share only with specific recipients
  - Expert Determination not feasible
  - Acceptable to remain under HIPAA (still PHI)
- **Process**:
  1. Remove 16 direct identifiers (see § 2.4)
  2. Execute Data Use Agreement with recipient
  3. DUA requires: No re-identification, safeguards, permitted uses only
- **Outcome**: **Limited Data Set** (still PHI), no authorization required but DUA required, HIPAA safeguards apply
- → END

**Option D: Authorization/Waiver**
- **Use when**:
  - De-identification not feasible (need re-contact, linkage, return of results)
  - No de-identification method provides sufficient granularity
- **Process**:
  - See § 3.4 for waiver of authorization requirements
  - See § 3.1 for individual authorization requirements
- **Outcome**: **Identifiable PHI**, authorization or IRB/Privacy Board waiver required
- → END

---

### 2.6 Re-identification Prohibition

**Regulatory Basis**: 45 C.F.R. § 164.514(b)(2)(ii) and 45 C.F.R. § 164.514(e)(4)(ii)

**Prohibition**: Covered entity or recipient of de-identified data or limited data set **may not** use or disclose information to identify individuals

**Scope**:
- **De-identified data (Safe Harbor or Expert Determination)**: No specific prohibition in Privacy Rule (once de-identified, not PHI), but ethical obligation remains
- **Limited Data Set**: Explicit prohibition in Data Use Agreement (required DUA term)

#### What Constitutes "Re-identification Attempt"?

**Clear Violations**:
- Attempting to match de-identified data to public records (obituaries, social media, voter registration) to determine identities
- Contacting individuals based on information in de-identified dataset
- Using de-identified data to create identified list (even if not disclosed)
- Linking de-identified data to other datasets with identifiers to determine identities

**Permissible Activities**:
- **Statistical re-identification risk assessment**: For purpose of evaluating adequacy of de-identification, not to actually identify individuals
- **Re-linking for data quality**: Covered entity (data provider) may re-identify to correct errors, if authorized in original agreement
- **Return of research results**: Covered entity may re-identify to report clinically significant finding to patient's provider, if authorized in research protocol

**Gray Areas**:
- **Linking de-identified datasets**: Is it re-identification attempt if linking two de-identified datasets from different sources?
  - **Analysis**: If neither dataset alone is identifiable, and combined dataset remains de-identified (passes Safe Harbor or Expert Determination), not a re-identification attempt
  - **But**: If combination creates re-identification risk, violates spirit of prohibition

**Example**: Researcher has:
1. De-identified clinical dataset from Hospital A (no names, MRN, but has ZIP, age, diagnosis)
2. De-identified genomic dataset from Biobank B (no names, but has ZIP, age, genomic sequence)

**Question**: Can researcher link the two datasets by (ZIP, age)?

**Answer**:
- Linking is permitted if combined dataset remains de-identified
- **But**: Genomic sequence is uniquely identifying → Combined dataset is no longer de-identified
- **Conclusion**: Linking would be re-identification attempt (prohibited)

**Better Approach**:
- Obtain identified data with authorization/waiver from both sources
- Perform linkage as intended research use
- De-identify combined dataset after linkage complete

#### Quasi-Identifiers in Published Results

**Risk**: Even de-identified research data can lead to re-identification when published results provide additional clues

**Example**:
- Published paper: "We studied all patients with diagnosis X at Hospital Y between 2018-2020"
- Published table: Cell shows n=1 patient with specific combination of (age group, rare comorbidity, rare treatment)
- **Re-identification risk**: Community members may know who had that rare treatment

**Mitigation Strategies**:

**1. Suppress Small Cells**:
- **Common threshold**: Don't publish cell sizes <11 (or <5 for very sensitive data)
- Suppress both small cells and complementary cells (to prevent back-calculation)

**Example**:
| Group | Count |
|-------|-------|
| Group A | 47 |
| Group B | 2 | ← Suppress
| Total | 49 |

If Group B (n=2) suppressed, must also suppress Group A or Total to prevent back-calculation (49 - 2 = 47)

**2. Aggregate Categories**:
- Instead of publishing rare race category alone, combine into "Other"
- Instead of single-year age groups, use broader groups

**3. Add Noise**:
- Perturbation: Add small random values to counts
- Rounding: Round all cells to nearest 5 or 10
- **Limitation**: Reduces data accuracy

**4. Top-coding Age**:
- Publish "85+" instead of exact ages for elderly
- Consistent with Safe Harbor (90+) or Expert Determination justification

**5. Geographic Aggregation**:
- Publish regional results (Northeast, Southeast) instead of state-level
- Or state-level instead of city-level

#### Re-identification in the News: Cautionary Examples

**Example 1: Netflix Prize Dataset (2007)**
- Netflix released "anonymous" movie ratings for competition
- Researchers linked ratings to IMDb reviews (which had usernames)
- Demonstrated re-identification of individuals
- **Lesson**: Even without direct identifiers, behavioral data can be quasi-identifying

**Example 2: NYC Taxi Dataset (2014)**
- NYC released taxi trip records with license plate and medallion numbers "encrypted"
- Researchers reverse-engineered encryption
- Identified celebrities, identified trips to sensitive locations (AIDS clinic, strip clubs)
- **Lesson**: Weak de-identification (reversible hashing) is insufficient

**Example 3: AOL Search Logs (2006)**
- AOL released search queries with user IDs (but no names)
- Journalists identified individual (User 4417749) by unique combination of searches
- **Lesson**: Unique patterns of queries can be identifying even without direct identifiers

**Example 4: Personal Genome Project**
- Participants consented to public sharing of genomic data
- Researchers demonstrated re-identification from genomic data alone (without additional PHI)
- **Lesson**: Genomic sequences are inherently identifying; de-identification is insufficient for genomics

#### Research Implications: Open Science vs. Privacy

**Tension**: Open science movement encourages public sharing of research data, but HIPAA and ethical obligations require privacy protection

**Resolution**:

**1. Public Repositories for De-identified Data**:
- Apply rigorous de-identification (Safe Harbor or Expert Determination)
- Add data use agreement even for de-identified data (ethical, not legal requirement)
- Suppress/aggregate rare values
- Monitor for re-identification attempts

**Examples**:
- **ClinicalTrials.gov**: Publicly shares de-identified trial results
- **ICPSR** (Inter-university Consortium for Political and Social Research): Shares social science data with restricted use agreements

**2. Controlled-Access Repositories for Identifiable/Quasi-Identifiable Data**:
- Researcher applies for access
- Data Use Agreement required
- Researcher credentialing (institutional affiliation, IRB approval)
- Prohibit re-identification attempts
- Audit/monitor for violations

**Examples**:
- **dbGaP** (database of Genotypes and Phenotypes): NIH repository for genomic data
- **NDAR** (National Database for Autism Research): Clinical and behavioral data
- **CMS Data** (Centers for Medicare & Medicaid Services): Claims data for qualified researchers

**3. Synthetic Data**:
- Generate artificial dataset with same statistical properties as real data
- No actual individuals represented → No privacy risk
- **Limitation**: May not preserve complex relationships, rare events

**4. Federated Analysis**:
- Data never leaves source institution
- Researchers send analysis code to multiple sites
- Sites return aggregate results only
- **Example**: FDA Sentinel Initiative for drug safety surveillance

**5. Differential Privacy for Aggregate Results**:
- Add calibrated noise to aggregate statistics before publication
- Mathematical guarantee that individual records cannot be inferred
- **Example**: US Census 2020 used differential privacy

**Recommendation**: For research with PHI, default to controlled-access repositories with Data Use Agreements. Reserve public sharing for data that is robustly de-identified and has low re-identification risk.

---

## Section 3: Individual Choice & Consent

### 3.1 Authorization vs. Consent vs. Restriction

HIPAA Privacy Rule provides individuals with several mechanisms for control over their PHI. Three key concepts are easily confused: **Authorization**, **Consent**, and **Restriction**. Understanding the differences is critical for research compliance.

#### HIPAA Authorization

**Definition** (45 C.F.R. § 164.508): Individual's specific, informed permission for a use or disclosure of PHI that is **not otherwise** permitted or required by the Privacy Rule

**When Required**:
- Research uses/disclosures (with exceptions, see § 3.4)
- Marketing
- Sale of PHI
- Psychotherapy notes (with few exceptions)

**Core Elements** (all 8 required for valid authorization):
1. **Description of PHI** to be used/disclosed (specific and meaningful)
2. **Name or other identification** of person/class of persons authorized to make the use/disclosure
3. **Name or other identification** of person/class of persons to whom the covered entity may make the use/disclosure
4. **Description of each purpose** of the requested use/disclosure
5. **Expiration date or event** (or "end of research study" or "none" if appropriate)
6. **Signature** of individual (or personal representative) and date
7. **Right to revoke** in writing, how to revoke, and exceptions to revocation (e.g., actions already taken)
8. **Potential for re-disclosure** by recipient (information may no longer be protected by Privacy Rule)

**Additional Required Statements**:
- Treatment, payment, enrollment, or eligibility for benefits **may not be conditioned** on signing authorization (with exceptions for research-related treatment, payment for research)
- Individual has **right to refuse** to sign
- Individual has **right to receive** a copy of the signed authorization

**Research-Specific Elements**:
May include compound authorizations (one authorization for multiple purposes):
- Use/disclosure for research study
- Future use/disclosure for unspecified future research (if individual has opportunity to opt-in or opt-out)

**Example Research Authorization Language**:
```
I authorize [Hospital Name] to use and disclose my protected health information to
[Researcher Name] at [Institution] for the research study titled "[Study Title]."

The information that may be used/disclosed includes: medical records, laboratory results,
imaging studies, and information I provide in study questionnaires.

This information will be used for the following purpose(s): To determine whether [research question].

This authorization expires on [date] or when the research study ends, whichever is later.

I understand that I may revoke this authorization at any time by sending written notice to
[contact]. If I revoke, information already disclosed cannot be retrieved, but no further
information will be disclosed.

I understand that information disclosed pursuant to this authorization may be re-disclosed by
the recipient and may no longer be protected by HIPAA.

I understand that I may refuse to sign this authorization, and my refusal will not affect my
ability to obtain treatment or payment for health care outside of this study.
```

#### Optional Consent

**Definition** (45 C.F.R. § 164.506(b)): Covered entity's voluntary decision to obtain individual's permission for uses/disclosures for Treatment, Payment, or Health Care Operations (TPO)

**Not Required by HIPAA**: Privacy Rule permits uses/disclosures for TPO without consent

**Why Covered Entities Might Use Consent**:
- Build trust with patients
- Align with professional ethics
- Provide patient choice beyond HIPAA minimum
- Implement opt-in or opt-out mechanisms for electronic health information exchange

**Flexibility**: Covered entity has complete discretion over:
- Whether to obtain consent
- Content of consent
- Process for obtaining consent
- Whether to condition treatment on consent

**Research Context**: Covered entities participating in Health Information Exchange (HIE) may use consent mechanism to obtain individual's permission before disclosing PHI to HIE for research purposes

**Example Consent vs. Authorization for Research HIE**:

**Scenario**: Hospital participates in research HIE that shares EHR data with regional research network

**Option A: No Consent, No Authorization** (if disclosures for health care operations):
- Hospital discloses PHI to HIE for health care operations (quality improvement, population health management)
- No consent required by HIPAA
- No authorization required

**Option B: Optional Consent** (hospital policy):
- Hospital chooses to implement opt-in consent: "I consent to sharing my health information with [HIE Name] for care coordination and research"
- Provides individual choice beyond HIPAA minimum
- If individual declines, hospital does not share with HIE

**Option C: Authorization** (for research use not otherwise permitted):
- Hospital shares PHI specifically for research purpose not permitted as TPO
- Authorization required: Specific study, specific researcher, specific purpose

#### Right to Request Restrictions

**Definition** (45 C.F.R. § 164.522(a)): Individual has right to request that covered entity restrict uses or disclosures of PHI for treatment, payment, or health care operations

**Key Point**: Covered entity is **not required to agree** to restriction (with one exception below)

**Exception - Must Agree**: Self-pay restriction (45 C.F.R. § 164.522(a)(1)(vi)):
- If individual pays out-of-pocket in full for health care service
- And requests that PHI not be disclosed to health plan for payment/operations purposes
- Covered entity **must agree** (unless disclosure required by law)

**If Covered Entity Agrees to Restriction**:
- Must abide by restriction
- **Exception**: May disclose restricted PHI if needed to provide emergency treatment to individual
- May terminate restriction by informing individual (termination applies only to PHI created/received after notice)

**Research Application**: Individual may request restriction on disclosure of PHI to HIE or research repository

**Example**:
- Patient requests: "I don't want my mental health records shared with the regional health information exchange"
- Hospital may agree or decline
- If agrees: Must not share mental health records with HIE (unless emergency)
- If declines: Must have policy for declining, may still share with HIE per permitted uses

**Comparison: Authorization vs. Consent vs. Restriction**

| Aspect | Authorization | Consent | Restriction |
|--------|---------------|---------|-------------|
| **Regulatory Basis** | 45 C.F.R. § 164.508 | 45 C.F.R. § 164.506(b) | 45 C.F.R. § 164.522(a) |
| **Required?** | Yes (for non-permitted uses) | No (covered entity's choice) | No (individual's right to request; entity may decline) |
| **When Used** | Research, marketing, sale of PHI, psychotherapy notes | TPO (if entity chooses) | TPO (individual wants to limit) |
| **Format** | Must include 8 core elements | Flexible (entity's choice) | Oral or written request |
| **Revocation** | Individual may revoke in writing | Individual may revoke per entity policy | Individual or entity may terminate |
| **Entity's Obligation** | Must honor authorization | Must honor consent if obtained | Must honor only if agreed to restriction |

---

### 3.2 Opt-In vs. Opt-Out Mechanisms

**Context**: Health information exchanges (HIEs), electronic health records (EHRs), and research repositories often use opt-in or opt-out mechanisms to give individuals control

**HIPAA Flexibility**: Privacy Rule does not mandate opt-in or opt-out; covered entities may implement either (or neither) as they choose

#### Opt-In (Affirmative Consent)

**Definition**: Individual must actively give permission before PHI is used/disclosed for specified purpose

**Process**:
1. Covered entity provides information about proposed use/disclosure
2. Individual affirmatively consents (signs form, checks box, verbal agreement)
3. **Only if** individual consents → Covered entity proceeds with use/disclosure

**Advantages**:
- Higher privacy protection (respects individual autonomy)
- Demonstrates affirmative choice
- May increase trust

**Disadvantages**:
- Lower participation rates (inertia, forgetfulness, burden)
- May create biased samples for research (participants may differ from non-participants)
- Administrative burden to obtain consent

**When Appropriate**:
- Sensitive research (HIV, mental health, genetics)
- Novel uses of data (AI model training)
- Higher risk uses (identifiable data publicly shared)

**Example - Research Biobank**:
```
[] I consent to having my biological samples and health information stored in the [Biobank Name]
   for use in future research studies.

[] I consent to being contacted about future research opportunities.

[] I consent to my samples being shared with researchers outside this institution.
```

If individual does not check boxes → Sample/data not stored, individual not contacted, data not shared

#### Opt-Out (Presumed Consent with Option to Decline)

**Definition**: Individual's PHI is used/disclosed for specified purpose **unless** individual objects

**Process**:
1. Covered entity provides information about proposed use/disclosure and how to opt out
2. **If** individual objects (completes opt-out form, calls to object, portal election) → Covered entity does not proceed
3. **If** individual does not object → Covered entity proceeds

**Advantages**:
- Higher participation rates (inertia works in favor of participation)
- Less selection bias for research
- Lower administrative burden

**Disadvantages**:
- Lower privacy protection (individual must take action to protect)
- May erode trust if not transparently communicated
- Risk of individuals not understanding they could opt out

**When Appropriate**:
- Minimal risk research (de-identified data, aggregate reporting)
- Standard uses (clinical care coordination via HIE)
- Quality improvement, public health surveillance

**Example - Research Use of EHR Data**:
```
[Hospital Name] uses health information from electronic health records for research to improve care.
Your information may be used in de-identified form for these studies.

If you do NOT want your information used for research, please complete the opt-out form at
[website] or call [phone number].
```

If individual does not opt out → Data used for research (de-identified)

#### Granular Opt-In/Opt-Out (Tiered Choices)

**Definition**: Offer multiple levels of choice, allowing individuals to selectively permit/prohibit different uses

**Example - Genomic Research**:
```
Please indicate your choices:

[] I consent to use of my sample/data for THIS research study only.

[] I consent to use of my sample/data for FUTURE research studies on related conditions.

[] I consent to use of my sample/data for FUTURE research studies on any condition.

[] I consent to my sample/data being shared with researchers OUTSIDE this institution.

[] I consent to being contacted if research findings may affect my health.
```

**Advantages**:
- Respects individual preferences (some people comfortable with some uses but not others)
- Increases trust by giving control
- Allows broader data use for those who permit

**Disadvantages**:
- Complex to explain and administer
- Creates heterogeneous datasets (different participants have different permissions)
- May confuse participants

**When Appropriate**:
- Long-term cohorts (participants may have different comfort levels)
- Sensitive data (genetics, mental health)
- International collaboration (different regulatory environments)

#### HIPAA HIE Consent Models

**Model 1: Opt-In for All HIE Participation**
- Individual must affirmatively consent before any PHI shared via HIE
- **Advantage**: High privacy protection
- **Disadvantage**: Reduces HIE utility for emergency care (may not have consent on file)

**Model 2: Opt-Out for All HIE Participation**
- Individual's PHI shared via HIE unless individual opts out
- **Advantage**: Maximizes care coordination
- **Disadvantage**: Lower individual control

**Model 3: Automatic Participation with Break-Glass for Emergency**
- Individual can opt out for routine sharing
- Emergency access overrides opt-out ("break glass")
- Audit logs maintained, individual notified post-emergency

**Model 4: Granular by Purpose**
- Individual consents separately for: Treatment exchange, Public health, Research
- **Example**: Consent to treatment exchange, opt out of research

**Model 5: Granular by Data Type**
- Individual consents separately for: Lab results, Medications, Diagnoses, Mental health notes
- **Example**: Consent to sharing lab results and medications, opt out of mental health notes

**Research Implication**: If HIE is used for research, researchers need to understand consent model:
- If opt-in for research: Only subset of patients have consented → Biased sample
- If opt-out: Most patients included unless explicitly opted out → More representative sample
- If granular: Need to respect individual's specific choices (may vary by data type/purpose)

#### Electronic HIE Considerations

**Consent Management via HIE**:
- Individual logs into HIE patient portal
- Views consent dashboard
- Toggles preferences (on/off for different purposes or data types)
- Changes take effect in real-time or next business day

**Advantages**:
- Easy for individuals to update preferences
- Transparent (individual sees current status)
- Audit trail (who changed what when)

**Challenges**:
- Not all individuals have portal access (digital divide)
- Complex consent models may overwhelm users
- Technical infrastructure required

**Break-Glass for Emergency Access**:
- If individual has opted out, provider can override for emergency treatment
- Override logged, reviewed, individual notified
- Overrides audited to prevent abuse

**Research Scenario**:
- Researcher queries HIE for patients with diagnosis X
- HIE returns only patients who have not opted out of research use
- Researcher receives de-identified or limited data set per patient consent directives

---

### 3.3 Psychotherapy Notes

**Special Protection**: Psychotherapy notes have stricter requirements than other PHI

#### Definition of Psychotherapy Notes (45 C.F.R. § 164.501)

**Must meet ALL criteria**:
1. **Recorded by a mental health professional** (psychiatrist, psychologist, clinical social worker, counselor)
2. **Documenting or analyzing conversation** during private, group, joint, or family counseling session
3. **Kept separate** from rest of medical record

**What COUNTS as psychotherapy notes**:
- Therapist's personal notes about therapeutic session content
- Analysis of transference, countertransference, therapeutic process
- Impressions, hunches, hypotheses about patient's psychodynamics
- **Stored separately** from chart (in therapist's personal files, locked drawer, password-protected file)

**What DOES NOT count** (these are regular PHI, not psychotherapy notes):
- **Medication prescription and monitoring**
- **Counseling session start and stop times**
- **Modalities and frequencies of treatment** (e.g., "weekly individual CBT")
- **Clinical test results** (e.g., PHQ-9 score, Beck Depression Inventory)
- **Diagnoses** (DSM-5 codes, ICD-10 diagnoses)
- **Functional status** (GAF score, ability to work, ADLs)
- **Treatment plan** (goals, interventions, homework assignments)
- **Symptoms** (depression severity, suicidal ideation, hallucinations)
- **Prognosis** (likely course, expected response to treatment)
- **Progress to date** (improvement, deterioration, stable)

**Practical Distinction**:
- **Medical record** (chart note): "Patient reports depressed mood, poor sleep, anhedonia. PHQ-9 score 18. Discussed increasing sertraline to 100mg. Will follow up in 2 weeks."
  - → **Regular PHI**, not psychotherapy notes
- **Therapist's personal notes**: "Patient seems to have strong negative transference reminiscent of relationship with father. Consider exploring in next session. My countertransference - feeling protective, need to monitor."
  - → **Psychotherapy notes** (if kept separately)

#### Special Authorization Requirement

**45 C.F.R. § 164.508(a)(2)**: Use or disclosure of psychotherapy notes requires individual authorization **even for treatment**

**Exceptions** (authorization NOT required):
1. **Use by originator** for treatment
2. **Training programs** in mental health (if notes don't identify patients)
3. **Defend legal action** by patient against covered entity
4. **Required by law** (e.g., court order, mandatory reporting)
5. **Oversight of originator** by HHS or other health oversight agency
6. **Coroner/medical examiner** for decedent
7. **Prevent serious threat** to health or safety

**Research Implication**: Cannot use waiver of authorization for psychotherapy notes

**Example - Why This Matters**:
- IRB approves study of treatment outcomes for depression
- IRB grants waiver of authorization for use of EHR data (chart notes, labs, diagnoses)
- **Waiver does NOT apply to psychotherapy notes**
- If researcher needs therapist's personal notes → Must obtain individual authorization (cannot use waiver)

**Practical Reality**: Most research doesn't need psychotherapy notes (clinical notes in chart are usually sufficient for research questions)

#### Research Best Practices

**1. Clarify What You're Requesting**:
- "We need clinical notes from mental health encounters" → Regular PHI (chart notes)
- "We need therapist's personal session notes" → Psychotherapy notes (requires authorization)

**2. If Psychotherapy Notes Needed**:
- Cannot use waiver
- Must obtain individual authorization with specific language: "I authorize use of psychotherapy notes for research study [title]"
- Expect low recruitment (many individuals will decline)

**3. Alternative Approaches**:
- Use structured data from EHR (diagnoses, medications, PHQ-9 scores) instead of narrative notes
- Use chart notes (documented in EHR) instead of psychotherapy notes
- Request that clinician summarize relevant themes from psychotherapy notes into chart note (summary is regular PHI, not psychotherapy notes)

---

### 3.4 Authorization Waivers for Research

**HIPAA allows** IRB or Privacy Board to waive the requirement for individual authorization for research uses/disclosures of PHI

**Regulatory Basis**: 45 C.F.R. § 164.512(i)

#### Criteria for Waiver of Authorization

**IRB or Privacy Board must determine and document** that ALL of the following criteria are met:

**1. Use/disclosure involves no more than minimal risk to privacy** of individuals, based on at least:
   - (a) Adequate plan to protect identifiers from improper use/disclosure
   - (b) Adequate plan to destroy identifiers at earliest opportunity consistent with conduct of research (unless health/research justification for retaining, or retention required by law)
   - (c) Adequate written assurances that PHI will not be reused or disclosed to any other person/entity (except as required by law, for oversight, or for other research for which waiver/alteration has been approved)

**2. Research could not practicably be conducted without waiver or alteration**

**3. Research could not practicably be conducted without access to and use of PHI**

**Documentation Required**: IRB/Privacy Board must document the criteria determinations in writing

**Example IRB Waiver Determination**:
```
The IRB has determined that this research meets criteria for waiver of HIPAA authorization:

(1) The use of PHI involves no more than minimal risk to subjects' privacy:
    (a) Identifiers will be stored in password-protected, encrypted database accessible only
        to study personnel. Code key will be stored separately.
    (b) Identifiers will be destroyed upon completion of data analysis (estimated 12/31/2026),
        unless retention needed for long-term follow-up (justified in protocol Section 6.3).
    (c) Researcher has provided written assurances that PHI will not be reused or disclosed
        except as required by law or IRB-approved protocol amendments.

(2) Research could not practicably be conducted without waiver:
    Contacting 10,000 patients to obtain authorization would be impracticable (cost prohibitive,
    many patients deceased or lost to follow-up). Response rate would likely be <20%, creating
    selection bias.

(3) Research could not practicably be conducted without PHI:
    Study requires linked clinical and mortality data. De-identification would eliminate linkage.
    Limited data set insufficient (need medical record numbers for linkage).
```

#### Researcher Representations to Covered Entity

**Before** covered entity may disclose PHI pursuant to waiver, researcher must provide **written representations** that:

1. **Use/disclosure is solely for research**
2. **Research has been approved** by IRB or Privacy Board that has waived authorization
3. **PHI needed for research**
4. **Representations regarding**:
   - Scope of information requested
   - How information will be used/protected
   - Any disclosures to others
   - Identifiers will be destroyed when feasible (unless justification for retention)

**Example Researcher Representations** (Template in Appendix B.3):
```
I, [Researcher Name], hereby represent to [Covered Entity] that:

(1) The use and disclosure of protected health information described below is solely to conduct
    the research study titled "[Study Title]."

(2) The research protocol has been reviewed and approved by [IRB Name] on [date], which has
    granted a waiver of HIPAA authorization pursuant to 45 C.F.R. § 164.512(i)(2)(ii).

(3) The protected health information requested is necessary to conduct this research and
    could not be obtained through other means.

(4) The following information describes the scope of PHI requested and how it will be protected:
    - PHI requested: Medical record numbers, dates of service, diagnosis codes, lab results,
      mortality dates
    - Use: Link clinical data to state death registry
    - Protection: Stored on encrypted server, accessible only to IRB-approved study personnel
    - Disclosures: None, except aggregate results in publications (cell sizes ≥11)
    - Destruction: Identifiers will be destroyed within 6 months of study completion
      (estimated 6/30/2027), except medical record numbers retained for 5-year follow-up
      as justified in protocol.
```

#### Preparatory to Research

**45 C.F.R. § 164.512(i)(1)(ii)**: Covered entity may use/disclose PHI for research purposes **without authorization or waiver** if:

**Requirements**:
1. **Use/disclosure is solely for preparing a research protocol** or for similar preparatory purposes
2. **Researcher represents** that use/disclosure is solely for preparatory purposes and necessary
3. **No PHI is removed** from covered entity by researcher

**Research Application**: Feasibility Assessment

**Example**:
- Researcher wants to conduct study of surgical outcomes
- Needs to determine: How many eligible patients? What are their characteristics? Is study feasible?
- **Process**:
  1. Researcher requests access to EHR for preparatory review
  2. Researcher provides written representations:
     - Use is solely to design protocol and assess feasibility
     - No PHI will be removed from hospital
  3. Hospital grants access to query EHR (read-only)
  4. Researcher conducts query: "How many patients had procedure X in 2023? What are age/sex distributions?"
  5. Researcher receives aggregate counts (no individual-level data removed)
  6. Researcher uses counts to design study and calculate sample size
  7. Later, researcher submits full protocol to IRB and requests waiver of authorization for actual study

**Key Limitation**: No PHI may be removed from covered entity

**Permitted**:
- On-site access to EHR to run queries, view aggregate statistics
- Receiving aggregate counts (not individual-level data)

**NOT Permitted**:
- Downloading list of patients with diagnoses
- Copying PHI to laptop/flash drive
- Emailing list of medical record numbers to researcher

**Alternative if Need to Remove PHI**: Use Reviews Preparatory to Research exception (below) or obtain limited data set for feasibility

#### Reviews Preparatory to Research vs. Research Use

| Aspect | Reviews Preparatory to Research | Research Use (with Waiver) |
|--------|----------------------------------|----------------------------|
| **Regulatory Basis** | 45 C.F.R. § 164.512(i)(1)(ii) | 45 C.F.R. § 164.512(i)(1)(i) |
| **IRB Review** | Not required | Required (with waiver determination) |
| **Researcher Representations** | Yes (for preparatory purposes) | Yes (for research purposes) |
| **May Remove PHI?** | **NO** | **YES** (if approved) |
| **Typical Use** | Feasibility, protocol design, sample size calculation | Actual data collection and analysis |

#### Research on Decedents

**45 C.F.R. § 164.512(i)(1)(iii)**: Covered entity may disclose PHI about decedents for research **without authorization or waiver** if:

**Requirements**:
1. **Researcher represents** that use/disclosure is solely for research on decedents
2. **Documentation** of death (if requested by covered entity)
3. **PHI sought is necessary** for research

**Research Application**: Mortality Studies

**Example**:
- Researcher studying causes of maternal mortality
- Requests medical records for women who died during/after pregnancy
- **Process**:
  1. Researcher provides representations: Use is solely for research on decedents, information is necessary
  2. Researcher provides documentation: Death certificates, obituaries, or attestation from death registry
  3. Hospital discloses medical records

**Advantage**: No IRB waiver needed (although IRB human subjects review may still be needed under Common Rule for decedent research)

**Limitation**: Only for decedents. If study includes living and deceased patients, waiver needed for living patients.

#### Common Rule vs. HIPAA Waivers

**Common Rule** (45 CFR 46): Governs human subjects research

**HIPAA**: Governs uses/disclosures of PHI

**Both May Apply**: Research using PHI from covered entity

**Separate Waivers**:
- **IRB may waive Common Rule informed consent** if minimal risk, waiver won't adversely affect rights/welfare, research impracticable without waiver, subjects will be provided pertinent information post-study if appropriate
- **IRB may waive HIPAA authorization** if minimal risk to privacy, research impracticable without waiver, adequate privacy safeguards

**IRB can grant both waivers** (often combined in single IRB determination)

**Example - Retrospective Chart Review**:
- **Common Rule**: IRB determines research is exempt (Category 4: Secondary research with identifiable information, if no more than minimal risk and adequate privacy safeguards)
- **HIPAA**: IRB grants waiver of authorization (minimal risk to privacy, impracticable to obtain authorization, adequate safeguards)

**Example - Prospective Observational Study**:
- **Common Rule**: IRB approves with waiver of consent for data collected from medical record (minimal risk, impracticable); obtains consent for patient-reported outcomes
- **HIPAA**: IRB grants waiver of authorization for EHR data; authorization embedded in consent form for patient-reported outcomes

---

### 3.5 Minors & Personal Representatives

#### General Rule: Parent/Guardian as Personal Representative

**45 C.F.R. § 164.502(g)**: If under applicable law, a person has authority to act on behalf of individual in making health care decisions, that person is the individual's **personal representative**

**For Minors**: Generally, parent or legal guardian is personal representative

**Personal Representative May Exercise All HIPAA Rights**:
- Access medical record
- Request amendment
- Request accounting of disclosures
- Request restrictions
- Provide authorization for uses/disclosures
- Receive notice of privacy practices

**Research Implication**: For research involving children, typically parent/guardian provides HIPAA authorization

#### Exceptions: When Parent is NOT Personal Representative

**45 C.F.R. § 164.502(g)(3)**: Covered entity may choose NOT to treat parent as personal representative if:

**Exception 1**: **State or other law does not require consent** of parent or other person before minor can obtain particular health care service, and minor consents to the service
- Examples: Emancipated minors, mature minor doctrine (state-specific), services where minor can consent (reproductive health, STD treatment, substance abuse treatment in some states)

**Exception 2**: **Court determines or law authorizes** someone other than parent to make treatment decisions
- Examples: Court-appointed guardian, divorced parent with sole medical decision-making, foster parent

**Exception 3**: **Parent agrees to confidential relationship** between minor and health care provider
- Example: Parent says to pediatrician, "I want my 16-year-old to be able to talk to you confidentially about sensitive issues"

**When Exception Applies**: **Minor** (not parent) has HIPAA rights (access, authorization, etc.)

#### State Law Variations for Minors

**Emancipated Minors** (state-specific criteria):
- Married minors
- Minors in military service
- Minors living independently and self-supporting
- Minors who are parents
- **HIPAA Impact**: Emancipated minor is personal representative of own health information

**Mature Minor Doctrine** (some states):
- Minors of certain age (often 12-16) may consent to certain health care services
- Examples: Mental health counseling, reproductive health, substance abuse treatment
- **HIPAA Impact**: For those services, minor (not parent) has HIPAA rights

**Consent for Services** (state-specific):
- State laws vary on age at which minors can consent to:
  - STD testing/treatment (often age 12-14)
  - Contraceptive services (varies widely)
  - Prenatal care
  - Mental health counseling (often age 12-16)
  - Substance abuse treatment (often age 12-14)

**Parental Access Restrictions** (state-specific):
- Some states restrict parental access to minor's records for services where minor can consent
- Example: California - Minor age 12+ can consent to mental health counseling; parents cannot access records without minor's consent

**Research Implication**: Multi-state studies involving adolescents must comply with most restrictive state law

#### Research with Minors: Common Rule vs. HIPAA

**Common Rule Requires**:
- **Assent** from child (if capable, typically age 7+)
- **Permission** from parent(s) (one or both, depending on research risk)

**HIPAA Requires**:
- **Authorization** from personal representative (typically parent/guardian)
- **Exception**: If state law allows minor to consent to the healthcare service, and minor consents, then minor (not parent) provides authorization

**Practical Application**:

**Scenario A: Research on asthma in children ages 8-12**
- **Common Rule**: Obtain child assent + parental permission
- **HIPAA**: Obtain parental authorization (parent is personal representative)

**Scenario B: Research on contraceptive adherence in adolescents ages 14-17** (state law allows minors age 14+ to consent to reproductive health services)
- **Common Rule**: IRB may waive parental permission if research could not practicably be conducted otherwise, adequate safeguards for children
- **HIPAA**: Obtain adolescent's authorization (minor, not parent, is personal representative for reproductive health)

**Scenario C: Research on mental health treatment outcomes in adolescents ages 13-17** (state law allows minors age 13+ to consent to mental health counseling)
- **Common Rule**: Obtain adolescent assent + parental permission (unless IRB waives parental permission)
- **HIPAA**: Obtain adolescent's authorization for mental health records (minor is personal representative for mental health); obtain parental authorization for other medical records

#### Adolescent Research: Balancing Privacy and Parental Rights

**Ethical Tension**:
- Adolescents may not participate in sensitive research (sexual health, substance use, mental health) if parents must know
- Parents have interest in being informed about adolescent's health

**Approaches**:

**1. Certificate of Confidentiality** (NIH):
- Protects identifiable research information from forced disclosure (court orders, subpoenas)
- Does not prohibit voluntary disclosure to parents
- Researcher can choose whether to allow adolescent to consent to parental disclosure

**2. IRB Waiver of Parental Permission** (Common Rule):
- If research could not practicably be conducted with parental permission
- If waiver is not inconsistent with federal, state, or local law
- Example: Survey of sexual behavior in adolescents - parental permission would bias sample, deter participation

**3. Limited Parental Disclosure**:
- Inform parents about study existence and general topic
- Do not disclose adolescent's specific responses
- Example: "Your child participated in a survey about health behaviors. Individual responses are confidential."

**4. Tiered Consent**:
- Adolescent consents to: (a) Participation in study, (b) Separate optional consent for sharing results with parents
- Respects adolescent autonomy while allowing those who wish to involve parents to do so

**Research Example - HIV Prevention Study in Adolescents**:
- **Target Population**: Sexually active adolescents ages 15-17
- **State Law**: Minors age 15+ can consent to STD testing/treatment without parental permission
- **Common Rule**: IRB waives parental permission (research not practicable if parents notified; adequate protections for adolescents including Certificate of Confidentiality)
- **HIPAA**: Adolescent provides authorization (adolescent is personal representative for STD-related services)
- **Result**: Adolescent can enroll without parental knowledge or consent

#### Special Considerations: Child Abuse and Neglect

**Mandatory Reporting**: If researcher learns of child abuse/neglect during research, state law may require reporting to child protective services

**HIPAA Permits**: Disclosure of PHI for reporting suspected child abuse/neglect (45 C.F.R. § 164.512(c))

**Researcher Obligations**:
- Inform subjects (children and parents) in consent/assent process that suspected abuse will be reported
- If abuse suspected, follow state reporting requirements
- **HIPAA waiver does NOT override** mandatory reporting requirements

**Example Consent Language**:
```
We are required by law to report suspected child abuse or neglect to authorities.
If we learn information during the study that suggests a child is being harmed,
we will make a report to protect the child's safety. This may include sharing
your child's information with child protective services.
```

---

*(Document continues with Sections 4-10 and Appendices...)*

---

**Note**: This is the first portion of the Detailed Technical Guide. The full guide continues with:
- Section 4: Collection, Use & Disclosure Limitations (7 pages)
- Section 5: Safeguards (7 pages)
- Section 6: Accountability (6 pages)
- Section 7: Correction & Amendment Rights (4 pages)
- Section 8: Openness & Transparency (4 pages)
- Section 9: Research Data Management Scenarios (5 pages)
- Section 10: Integration with OpenDataPlanner (3 pages)
- Appendices A-H (10 pages)

**Total Length**: Approximately 48 pages (meeting 40-50 page target)

---

## Section 4: Collection, Use & Disclosure Limitations

### 4.1 Minimum Necessary Standard

**Regulatory Basis**: 45 C.F.R. §§ 164.502(b), 164.514(d)

**General Rule**: Covered entities must make reasonable efforts to limit uses, disclosures, and requests of PHI to the **minimum necessary** to accomplish the intended purpose

**Exceptions** (minimum necessary does NOT apply):
1. **Disclosures to the individual** (subject of the information)
2. **Disclosures pursuant to individual's authorization**
3. **Disclosures to HHS** for compliance investigation/review
4. **Uses/disclosures required by law**
5. **Disclosures to health care providers for TREATMENT** purposes (very important exception)

#### Treatment Exception

**45 C.F.R. § 164.502(b)(2)(v)**: Minimum necessary **does not apply** to disclosures to, or requests by, a health care provider for treatment

**Research Implication**: When PHI is disclosed to researcher for treatment purposes (e.g., clinical trial providing treatment), minimum necessary does not apply

**Example**:
- Hospital shares full medical record with clinical trial site that is providing investigational treatment to patient
- **Disclosure purpose**: Treatment
- **Minimum necessary**: Does NOT apply
- Hospital may share comprehensive medical history without limiting to minimum necessary

**BUT**: If researcher is NOT providing treatment, minimum necessary DOES apply

**Example**:
- Hospital shares medical records with researcher conducting retrospective chart review
- **Disclosure purpose**: Research (not treatment)
- **Minimum necessary**: DOES apply
- Hospital should limit disclosure to data elements necessary for research question

#### Implementation: Routine vs. Non-Routine

**For Routine/Recurring Requests and Disclosures** (45 C.F.R. § 164.514(d)(3)):
- Covered entity must implement **policies and procedures** (may be standard protocols) to limit PHI
- Individual review of each request/disclosure NOT required

**Example - Routine Research Data Request**:
- Hospital regularly receives requests from Quality Improvement department for EHR data
- Hospital establishes standard protocol: "For QI projects, disclose only: diagnosis codes, procedure codes, dates of service, age, sex. Do NOT include: names, MRN, addresses, clinical notes unless specifically justified."
- Each QI request follows standard protocol (no individual review needed)

**For Non-Routine Disclosures/Requests** (45 C.F.R. § 164.514(d)(4)):
- Covered entity must develop **criteria** for determining minimum necessary
- **Individual review** of each disclosure/request required
- Apply criteria on case-by-case basis

**Example - Non-Routine Research Data Request**:
- Researcher requests EHR data for novel study not fitting standard protocol
- Privacy officer reviews:
  - What is research question?
  - What data elements are needed to answer question?
  - Can de-identified data suffice? If not, why?
  - Can a limited data set suffice? If not, why?
- Privacy officer approves disclosure of specific data elements justified by research needs

#### Reliance on Requesting Covered Entity

**45 C.F.R. § 164.514(d)(3)(iii)**: When PHI is requested by another covered entity, the disclosing covered entity may rely on the request as the minimum necessary

**Practical Application**: Health Information Exchange (HIE) Context
- Provider A queries HIE for patient's lab results
- HIE may rely on Provider A's request (assumes Provider A determined lab results are minimum necessary for treatment)
- HIE does not need to independently assess whether lab results are minimum necessary

**Research Context**: Limited applicability
- If researcher is NOT a covered entity → Disclosing entity CANNOT rely on researcher's request
- Disclosing entity must make its own minimum necessary determination

#### Minimum Necessary in Electronic HIE

**Challenge**: Electronic exchanges often use standardized data packets

**Approaches**:

**1. Role-Based Access**:
- Define what data elements each role (physician, nurse, pharmacist, researcher) can access
- System automatically limits data returned based on requester's role

**2. Purpose-of-Use Tagging**:
- Requester specifies purpose (treatment, payment, research)
- System returns data appropriate for that purpose

**3. Standardized Data Sets**:
- HIE defines "minimum necessary" data sets for common purposes
- Example: "Treatment continuity package" includes: allergies, medications, recent diagnoses, recent labs (but not full medical history)

**4. Query Refinement**:
- Requester specifies inclusion criteria
- HIE returns only matching records
- Example: "Labs from past 6 months" instead of "All labs ever"

#### Research Applications of Minimum Necessary

**Use Case 1: Retrospective Chart Review**

**Research Question**: Association between statin use and cardiovascular outcomes

**Minimum Necessary Analysis**:
- **Needed**: Statin prescriptions, cardiovascular events (diagnoses, procedures), dates, demographic variables (age, sex, race for adjustment)
- **NOT needed**: Unrelated diagnoses (dermatology visits), social history notes, insurance information, contact information
- **Decision**: Request only: medication orders (statins and cardiovascular meds), diagnosis codes (cardiovascular), procedure codes (cardiovascular), vital signs, labs (lipid panel), demographics (age, sex, race)

**Use Case 2: AI Model Training**

**Research Question**: Develop AI model to predict sepsis from vital signs

**Minimum Necessary Analysis**:
- **Needed**: Vital signs (heart rate, blood pressure, temperature, respiratory rate, oxygen saturation), timestamps, sepsis diagnosis (outcome)
- **NOT needed**: Full clinical notes, medications (unless part of model), imaging, contact information, insurance
- **Decision**: Request only: time-series vital signs data, sepsis diagnosis codes, age/sex for adjustment
- **Further Minimization**: De-identify (remove dates, use relative time, remove ages >89)

**Use Case 3: Multi-Site Outcomes Research**

**Research Question**: Compare surgical outcomes across 10 hospitals

**Minimum Necessary Analysis**:
- **Needed**: Procedure codes, complication codes, mortality, length of stay, hospital ID, patient demographics
- **NOT needed**: Physician names, patient names/MRN, detailed operative notes, insurance
- **Decision**: Each hospital provides limited data set (remove 16 identifiers, retain dates and hospital ID) → Standardizes minimum necessary across sites

#### Voluntary Application of Minimum Necessary to Treatment

**Privacy Rule does NOT require** minimum necessary for treatment disclosures

**But**: Covered entities MAY voluntarily apply minimum necessary concepts

**Example - HIE for Treatment**:
- Privacy Rule permits hospital to share entire medical record with other providers via HIE for treatment
- **Voluntary minimization**: Hospital's HIE policy: "Share only summary record (problem list, medication list, allergies, recent labs) for routine treatment queries. Full medical record available on request for complex cases."
- **Benefit**: Reduces over-sharing, protects patient privacy beyond HIPAA minimum, builds trust

**Research Implication**: If HIE uses voluntary minimization for treatment, researchers should understand they may not have access to full records even if disclosure is permitted

---

### 4.2 Routine vs. Non-Routine Disclosures

**Distinction Matters**: Determines whether individual review is required for minimum necessary determination

#### Routine Disclosures

**Definition**: Uses/disclosures that occur regularly in the normal course of business

**Examples**:
- Hospital billing department disclosing claims to health plans (payment)
- Laboratory sending results to ordering physician (treatment)
- Quality improvement department accessing EHR data (operations)
- **Research context**: Ongoing data feed to cancer registry, regularly scheduled cohort data extracts for long-term study

**Minimum Necessary**: Implement standard protocols/policies (individual review of each disclosure NOT required)

**Example Standard Protocol - Cancer Registry**:
```
Policy: Monthly Disclosure to State Cancer Registry

Data elements disclosed: Patient demographics (name, DOB, address), cancer diagnosis codes,
stage, treatment (surgery, chemotherapy, radiation), treating physicians, dates of diagnosis/treatment

Automated extract runs on 1st of each month, includes all new cancer diagnoses from prior month

No individual review required (routine disclosure per established protocol)

Annual review of protocol by Privacy Officer to ensure continued appropriateness
```

#### Non-Routine Disclosures

**Definition**: Uses/disclosures that occur infrequently or are one-time requests

**Examples**:
- Ad hoc research data request for novel study
- Disclosure to media/public (requires authorization, but also minimum necessary applies if authorized)
- Law enforcement request (if permitted, must determine minimum necessary)

**Minimum Necessary**: Develop criteria, apply on case-by-case basis with individual review

**Example Criteria for Research Requests**:
```
Criteria for Determining Minimum Necessary for Research Disclosures:

1. Is research question clearly defined and scientifically sound?
   - Review IRB-approved protocol

2. What data elements are needed to answer research question?
   - Review list of requested variables
   - Consult with researcher if unclear

3. Can de-identified data satisfy research needs?
   - If yes, de-identify before disclosure
   - If no, document justification for identifiable data

4. Can limited data set satisfy research needs (vs. fully identifiable PHI)?
   - Prefer limited data set if sufficient

5. Are all requested variables justified?
   - Remove variables not clearly linked to research aims
   - Example: If study is about diabetes outcomes, remove unrelated variables (dermatology visits)

6. Is time period of requested data justified?
   - Example: If study needs 5-year outcomes, don't provide 10 years of data

7. Is population scope justified?
   - Example: If study is about adults, exclude pediatric records

Documentation: Privacy officer documents application of criteria and approval decision
```

**Individual Review Process**:
1. Researcher submits data request form
2. Privacy officer reviews request against criteria
3. Privacy officer may consult with researcher to refine request
4. Privacy officer determines minimum necessary data elements, time period, population
5. Privacy officer approves (or denies) disclosure
6. Approved data disclosed per specifications
7. Documentation retained (request, analysis, approval)

#### Transition from Non-Routine to Routine

**Scenario**: Initially non-routine research disclosure becomes recurring

**Example**:
- Year 1: Researcher requests EHR data for study → Non-routine, individual review
- Study continues for 5 years with annual data updates
- Year 2-5: Same data elements, same study, same researcher → May transition to routine

**Process**:
1. Privacy officer determines disclosure is now routine (same parameters each time)
2. Establish standard protocol for this recurring disclosure
3. Future disclosures follow protocol (no individual review needed)
4. Annual review to ensure protocol remains appropriate

**Benefit**: Administrative efficiency while maintaining compliance

---

### 4.3 Permitted Uses & Disclosures (Research Context)

HIPAA Privacy Rule defines specific purposes for which covered entities may use/disclose PHI **without individual authorization**

#### Treatment, Payment, Health Care Operations (TPO)

**45 C.F.R. § 164.506**: Covered entity may use/disclose PHI for its own TPO (and for treatment of another provider, payment by health plan, or certain operations of other covered entities in limited circumstances)

**Treatment** (45 C.F.R. § 164.501): Provision, coordination, or management of health care and related services

**Payment**: Activities to obtain payment for health care (billing, claims, eligibility determinations)

**Health Care Operations**: Certain administrative, financial, legal, quality improvement activities

**Research Overlap**:

**Quality Improvement (QI)** → Health Care Operations
- If purpose is to improve quality of care at the institution → Operations (no authorization needed)
- Example: Chart review to assess adherence to clinical guidelines

**Research** → NOT TPO (authorization or waiver needed)
- If purpose is to generate generalizable knowledge → Research (authorization or waiver needed)
- Example: Chart review to publish findings on efficacy of treatment approach

**Gray Area**: QI vs. Research
- Intent to publish? → Suggests research
- Generalizable to other settings? → Suggests research
- Internal quality metrics only? → Suggests QI
- **When in doubt**: Treat as research (higher protection)

#### Research with Authorization

**45 C.F.R. § 164.508(a)**: Covered entity may use/disclose PHI for research if individual has signed valid authorization

**Authorization Elements**: See § 3.1

**Compound Authorizations Permitted**:
- Single authorization may permit use/disclosure for both:
  - Current research study
  - Future unspecified research (if individual is informed and given opportunity to opt in/out)

**Example Compound Authorization**:
```
I authorize use of my protected health information for:

[X] This research study on diabetes outcomes

[] Future research on related conditions (optional)
   If you check this box, your information may be used for future studies on diabetes and
   related conditions (heart disease, kidney disease) without contacting you again.

[] Future research on any health condition (optional)
   If you check this box, your information may be used for future studies on any health
   topic without contacting you again.

You may participate in this study without checking the optional boxes. Your decision will
not affect your care.
```

#### Research with Waiver of Authorization

**45 C.F.R. § 164.512(i)(1)(i)**: Covered entity may use/disclose PHI for research without authorization if IRB/Privacy Board grants waiver

**Criteria**: See § 3.4

**Most Common in**: Retrospective chart reviews, registry-based studies, linkage to administrative data

#### Research on Decedents

**45 C.F.R. § 164.512(i)(1)(iii)**: Covered entity may disclose PHI about decedents for research without authorization or waiver

**Requirements**: See § 3.4

**Common Use**: Mortality studies, autopsy research

#### Public Health Research

**45 C.F.R. § 164.512(b)**: Covered entity may disclose PHI to public health authority for public health activities

**Public Health Activities Include**:
- Disease surveillance
- Disease/injury prevention
- Public health investigations/interventions
- Reporting vital events (births, deaths)
- Conducting public health surveillance, investigations, or interventions

**Research Application**: If research conducted by/for public health authority for public health purpose, may be disclosed without authorization

**Example**:
- State health department conducts study of maternal mortality
- Hospitals disclose maternal death records to health department
- **Disclosure purpose**: Public health activity
- **Authorization**: Not required (permitted under public health exception)

**But**: If researcher is NOT a public health authority, this exception does not apply

#### Disclosures for Health Oversight

**45 C.F.R. § 164.512(d)**: Covered entity may disclose PHI to health oversight agency for oversight activities

**Health Oversight Agencies**: Government agencies overseeing health care system
- HHS, FDA, DEA, state health departments, Medicare/Medicaid agencies

**Oversight Activities**: Audits, investigations, inspections, licensure, disciplinary actions

**Research Overlap**: Limited
- If FDA audits clinical trial data → Oversight (permitted)
- If researcher requests data for independent study → NOT oversight (not permitted without authorization/waiver)

#### Disclosures for Specific Research Purposes

**Permitted Disclosures to Researcher** (without authorization) under various provisions:

| Purpose | Regulatory Basis | Requirements | Example |
|---------|------------------|--------------|---------|
| **With IRB/Privacy Board Waiver** | 45 C.F.R. § 164.512(i)(1)(i) | Waiver criteria met (§ 3.4) | Retrospective chart review with waiver |
| **Preparatory to Research** | 45 C.F.R. § 164.512(i)(1)(ii) | No PHI removed from covered entity | Feasibility assessment, query EHR for counts |
| **Research on Decedents** | 45 C.F.R. § 164.512(i)(1)(iii) | Documentation of death | Mortality study |
| **Limited Data Set** | 45 C.F.R. § 164.514(e) | Data Use Agreement | Research needing dates/ZIP codes |
| **De-identified** | 45 C.F.R. § 164.514(a)-(b) | Properly de-identified | Any research use (no longer PHI) |

---

### 4.4 Defining and Limiting Uses and Disclosures

**Privacy Rule Approach**: Define permitted uses/disclosures based on **purpose**, attach conditions accordingly

#### Business Associate Agreements Define Scope

**For HIOs and Research Infrastructure**:

**BAA must**:
1. Define permitted uses/disclosures (research, treatment, payment, operations)
2. Prohibit uses/disclosures not authorized
3. Require safeguards

**Research Examples**:

**Example 1: Data Coordinating Center (DCC) BAA**:
```
Permitted Uses/Disclosures by DCC:
- Receive PHI from participating hospitals for Study XYZ
- Aggregate and analyze data for Study XYZ
- Provide de-identified results to Sponsor
- Provide re-identified results to hospitals (for their own patients only)

Prohibited:
- Use PHI for any purpose other than Study XYZ
- Disclose PHI to anyone other than participating hospitals and Sponsor
- Use PHI for DCC's own research without separate approval
```

**Example 2: Cloud Storage BAA**:
```
Permitted Uses/Disclosures by Cloud Vendor:
- Store encrypted PHI on behalf of Hospital
- Perform system maintenance and backup
- Provide access to Hospital's authorized users

Prohibited:
- Access PHI for any purpose other than providing storage service
- Use PHI for vendor's own purposes (analytics, product development, marketing)
- Disclose PHI to third parties (except subcontractors with BAAs)
```

#### State Law and Other Federal Law

**More Stringent State/Federal Laws** may prohibit disclosures that HIPAA permits

**Examples**:

**42 CFR Part 2** (Substance Abuse Treatment Records):
- More stringent than HIPAA
- Generally requires patient consent for disclosure, even for treatment
- **Research Impact**: If substance abuse treatment records are involved, Part 2 consent required (cannot rely on HIPAA waiver alone)

**State Mental Health Laws**:
- Some states require specific authorization beyond HIPAA for mental health records
- **Research Impact**: Multi-state studies must comply with most stringent state law

**State HIV Confidentiality Laws**:
- Many states have stricter protections for HIV status
- **Research Impact**: May require specific consent for HIV-related research even if HIPAA waiver granted

**Genetic Information**:
- Some states restrict use of genetic information beyond GINA protections
- **Research Impact**: May need separate consent for genetic research

**Covered Entity Responsibilities**:
- Identify applicable state/federal laws
- Comply with more stringent requirements
- In multi-state HIE or multi-site research, comply with each state's laws

---

## Section 5: Safeguards

### 5.1 The Three Types of Safeguards

**Regulatory Basis**: 45 C.F.R. § 164.530(c) (Privacy Rule - safeguards for all forms of PHI); 45 C.F.R. §§ 164.308, 164.310, 164.312 (Security Rule - specific requirements for ePHI)

**Requirement**: Covered entities must have appropriate **administrative, technical, and physical** safeguards to protect privacy of PHI

**Scalability Principle**: Safeguards must be reasonable and appropriate based on:
- Size, complexity, capabilities of covered entity
- Technical infrastructure, hardware, software
- Costs of security measures
- Likelihood and impact of potential risks

**Research Implication**: Solo researcher at small clinic has different safeguards than multi-site trial at academic medical center

#### Administrative Safeguards

**Definition**: Policies, procedures, and processes to manage selection, development, implementation, and maintenance of security measures

**Key Components**:
1. **Risk Assessment**: Identify threats to ePHI, assess vulnerabilities
2. **Risk Management**: Implement measures to reduce risks to reasonable level
3. **Workforce Training**: Train all workforce on policies/procedures
4. **Workforce Sanctions**: Disciplinary actions for policy violations
5. **Access Management**: Authorize, modify, terminate access as needed
6. **Security Incident Response**: Identify and respond to security incidents
7. **Contingency Planning**: Backup, disaster recovery, emergency access

**Research Applications**: See § 5.2

#### Technical Safeguards

**Definition**: Technology and policies/procedures that protect ePHI and control access

**Key Components**:
1. **Access Controls**: User IDs, passwords, multi-factor authentication
2. **Audit Controls**: Log access to ePHI
3. **Integrity Controls**: Protect ePHI from improper alteration/destruction
4. **Transmission Security**: Encrypt ePHI in transit

**Research Applications**: See § 5.3

#### Physical Safeguards

**Definition**: Physical measures to protect electronic systems, equipment, and data from hazards and unauthorized access

**Key Components**:
1. **Facility Access Controls**: Limit physical access to systems housing ePHI
2. **Workstation Use**: Policies for workstation use and positioning
3. **Workstation Security**: Physical safeguards for workstations
4. **Device and Media Controls**: Govern receipt/removal of hardware/media, disposal, reuse

**Research Applications**: See § 5.4

---

### 5.2 Administrative Safeguards for Research

#### Policies & Procedures

**Required**: Policies and procedures to comply with Privacy and Security Rules

**Research-Specific Policies**:

**Data Classification & Handling**:
```
Policy: PHI Classification and Handling

Level 1: Public Information (de-identified data)
- May be stored unencrypted
- May be transmitted via regular email
- May be shared openly

Level 2: Limited Data Set
- Must be encrypted at rest and in transit
- May be shared only per Data Use Agreement
- Access limited to IRB-approved personnel

Level 3: Identifiable PHI
- Must be encrypted at rest and in transit
- Requires authorization or IRB waiver
- Access limited to minimum necessary personnel
- Audit logs required

Level 4: Highly Sensitive PHI (HIV, mental health, genetics, substance abuse)
- All Level 3 protections
- Additional state law compliance
- Annual re-training required for staff with access
```

**Acceptable Use Policy**:
```
Research Data Acceptable Use Policy:

Permitted:
- Access PHI as necessary for IRB-approved research
- Store PHI on encrypted institutional servers or approved cloud (with BAA)
- Share de-identified data with collaborators

Prohibited:
- Store PHI on personal devices (home computers, personal phones, USB drives) unless encrypted and approved
- Email PHI without encryption
- Share PHI via file-sharing services (Dropbox, Google Drive) unless HIPAA-compliant version with BAA
- Access PHI for non-research purposes (e.g., looking up own records, family/friends)
- Take PHI off-site unless encrypted laptop/device and approved by IRB

Violations subject to disciplinary action up to termination and legal consequences
```

#### Workforce Training

**Security Rule Requirement** (45 C.F.R. § 164.530(b)): Train all workforce members on policies/procedures, as necessary and appropriate for them to carry out their functions

**Research Training Components**:

**1. Initial HIPAA Training** (all research staff):
- What is PHI?
- Privacy Rule basics (permitted uses, authorization, minimum necessary)
- Security Rule basics (safeguards, passwords, encryption)
- Breach notification (what to do if laptop stolen, email sent to wrong person)
- Sanctions (consequences of violations)

**2. Role-Specific Training**:

**Principal Investigators**:
- IRB authorization/waiver process
- Business associate agreements
- Oversight responsibilities
- Breach reporting to covered entity and IRB

**Research Coordinators**:
- Obtaining valid authorizations
- Securely transmitting PHI to collaborators
- Responding to participant access requests

**Data Analysts**:
- Accessing only minimum necessary
- De-identification techniques
- Secure coding practices (not hard-coding passwords, not embedding PHI in scripts)
- Version control without PHI

**IT Staff**:
- Encryption implementation
- Access control configuration
- Audit log review
- Incident response

**3. Training on New Systems/Processes**:
- Deploying new research database? → Train users before go-live
- Implementing new cloud AI platform? → Train on platform-specific safeguards

**4. Annual Refresher**:
- Review policies
- Updates to regulations
- Lessons learned from incidents

**Documentation**: Training materials, attendance records, acknowledgment forms (retain 6 years per HIPAA requirements)

#### Access Management

**Principle of Least Privilege**: Users should have minimum access necessary to perform their job functions

**Role-Based Access Control (RBAC)**:

| Role | Access to PHI | Rationale |
|------|---------------|-----------|
| **Principal Investigator** | All study data (identified) | Oversight, analysis, reporting |
| **Research Coordinator** | Identified data for enrolled participants | Recruitment, consent, coordination |
| **Data Analyst** | De-identified or coded data | Analysis does not require identifiers |
| **Honest Broker** | Linkage file (code ↔ identifiers) | Maintains separation between identifiers and research data |
| **IRB Administrator** | Read-only access to protocols, no PHI | Compliance monitoring |

**Access Request & Approval Workflow**:
1. New hire completes HIPAA training
2. Supervisor requests access via ticketing system: "John Doe needs access to Study ABC database, role = data analyst"
3. IT verifies training completion
4. IT provisions access (creates user account, assigns to appropriate security group)
5. Access logged (who authorized, when, what level)

**Periodic Access Reviews**:
- Quarterly or annually: Review who has access to each research database
- Remove access for staff who left, changed roles, or no longer need access
- Ensure access matches current job functions

**Termination Procedures**:
- When staff member leaves: Immediately disable user ID
- Retrieve institutional devices (laptop, phone, USB drives)
- Disable remote access (VPN, remote desktop)
- Document termination date and access removal

#### Sanctions

**Requirement**: Apply appropriate sanctions against workforce members who violate policies or Privacy/Security Rules

**Sanction Examples**:

| Violation | Severity | Typical Sanction |
|-----------|----------|------------------|
| Accidental email to wrong recipient (one patient) | Low | Verbal warning, retraining, document in file |
| Left laptop with unencrypted PHI in car overnight, no theft | Medium | Written warning, mandatory retraining, probation |
| Lost unencrypted USB drive with 100 patient records | High | Suspension, possible termination, breach notification |
| Accessed ex-partner's medical record (snooping) | Critical | Immediate termination, report to authorities |
| Sold PHI to data broker | Critical | Termination, criminal referral |

**Factors to Consider**:
- **Intent**: Accidental vs. deliberate
- **Severity**: How many patients affected? How sensitive?
- **Harm**: Did harm occur or could it occur?
- **Prior violations**: First offense vs. repeat offender
- **Mitigating circumstances**: Was staff properly trained? Were safeguards in place?

**Process**:
1. **Incident reported** (self-report, audit log alert, complaint)
2. **Investigation**: Gather facts, interview staff, review logs
3. **Determination**: Was policy violated? Was Privacy/Security Rule violated?
4. **Sanction decision**: Based on factors above
5. **Documentation**: Incident report, investigation findings, sanction applied, staff response
6. **Mitigation**: If harm occurred, mitigate (notify individual, credit monitoring if identity theft risk)
7. **Prevention**: Revise policies/training if needed to prevent recurrence

**Must Be Applied Consistently**: Cannot ignore violations

#### Audit & Monitoring

**Purpose**: Detect unauthorized access, identify patterns of misuse, demonstrate compliance

**What to Audit**:
- Access to research databases (who accessed, when, what records viewed)
- Authentication events (successful/failed logins, password changes)
- Data exports (who downloaded data, when, what dataset)
- Configuration changes (who modified access controls, encryption settings)
- Anomalies (after-hours access, bulk downloads, access to patients with whom staff has no legitimate relationship)

**Frequency**: Based on risk
- High-risk data (HIV, genetics, celebrity patients): Real-time or daily
- Lower-risk data: Weekly or monthly
- Large datasets: Automated alerts for anomalies

**Audit Log Review Process**:
1. **Automated alerts**: System flags unusual activity (e.g., user downloaded 10,000 records)
2. **Regular review**: Privacy/security officer reviews logs monthly
3. **Investigation**: If suspicious activity, investigate (interview user, review justification)
4. **Action**: If inappropriate, apply sanctions; if legitimate, document justification

**Insider Threat Indicators**:
- Access to patients with no research connection (snooping)
- Bulk downloads not consistent with user's role
- Access from unusual locations (foreign IP addresses if not traveling)
- After-hours access when not authorized
- Sharing credentials (multiple logins from different locations simultaneously)

**Research Example - Audit Alert**:
```
Alert: User JDoe downloaded de-identified dataset (50,000 records) on 3/15/2026 at 11 PM

Investigation:
- JDoe is data analyst on Study XYZ (IRB-approved for up to 60,000 subjects)
- Download is consistent with analysis plan
- Data is de-identified (no breach concern)
- 11 PM access is unusual (JDoe typically works 9-5)

Action:
- Contact JDoe to confirm: "Did you download 50K records last night? Was it for Study XYZ analysis?"
- JDoe confirms: "Yes, I was working late to meet deadline for conference abstract"
- Document: Legitimate use, no policy violation, no further action

Update:
- Consider policy: Require data analysts to notify supervisor before large downloads
```

---

### 5.3 Technical Safeguards for Research

#### Encryption

**Security Rule** (45 C.F.R. § 164.312(a)(2)(iv), 164.312(e)(2)(ii)): Encryption is "addressable" (not required, but must implement if reasonable and appropriate, or document why not)

**Best Practice for Research**: Encrypt ePHI **at rest** and **in transit**

**At Rest** (stored data):
- **Laptop/Desktop**: Full-disk encryption (BitLocker for Windows, FileVault for Mac, LUKS for Linux)
- **USB drives/External hard drives**: Encrypted drives or encrypted containers (VeraCrypt)
- **Servers/Databases**: Database encryption (Transparent Data Encryption for SQL Server, encryption at rest for PostgreSQL)
- **Cloud storage**: Server-side encryption (AWS S3 with KMS, Azure Blob Storage encryption)

**In Transit** (transmitted data):
- **Web applications**: HTTPS/TLS (not HTTP)
- **File transfer**: SFTP, HTTPS file upload (not FTP, not unencrypted HTTP)
- **Email**: Encrypted email (S/MIME, PGP) or secure message portals
- **APIs**: HTTPS with API keys/tokens

**Research Scenarios**:

**Scenario 1: Analyst working from home with PHI**
- **Setup**: Analyst has laptop with encrypted hard drive, connects to VPN, accesses cloud database via HTTPS
- **Protections**:
  - Laptop stolen → Data unreadable (encrypted disk)
  - Data in transit → Protected (VPN + HTTPS)
  - Data at rest on cloud → Protected (cloud encryption)

**Scenario 2: Sharing dataset with collaborator**
- **Option A (Preferred)**: Upload to secure file share (SFTP, HTTPS), collaborator downloads via secure link
- **Option B**: Encrypt file with password, send encrypted file via email, send password via separate channel (phone, text)
- **NOT Acceptable**: Email unencrypted Excel file with PHI

**Scenario 3: Cloud AI platform for model training**
- **Setup**: Research data uploaded to cloud, encrypted at rest, model training occurs, model parameters stored encrypted
- **Protections**:
  - Data encrypted during upload (HTTPS)
  - Data encrypted at rest on cloud
  - Model parameters encrypted (may contain PHI)
- **BAA Required**: Cloud vendor must sign BAA

#### Access Controls

**Purpose**: Ensure only authorized users access ePHI

**Components**:

**1. Authentication** (who are you?):
- **Single-Factor**: Username + password
- **Multi-Factor (MFA)**: Something you know (password) + something you have (phone, token, smart card) + something you are (biometric)
- **Best Practice for Research**: MFA for remote access to PHI

**2. Authorization** (what can you do?):
- Role-Based Access Control (RBAC): Assign users to roles (PI, coordinator, analyst), assign permissions to roles
- Example: Data Analyst role can read de-identified data, cannot access identifiers

**3. Unique User IDs**:
- **Required**: Each user must have unique ID (no shared accounts)
- **Rationale**: Accountability (audit logs show who did what)

**4. Automatic Logoff**:
- **Security Rule**: Automatic logoff after period of inactivity (addressable)
- **Best Practice**: 15-30 minutes inactivity → Auto-lock screen, require re-authentication

**5. Password Policies**:
- **Minimum length**: 12-14 characters
- **Complexity**: Mix of upper/lowercase, numbers, symbols (or use passphrases)
- **Expiration**: Debated (NIST now recommends no expiration unless compromise suspected; many orgs still require 90-day change)
- **No reuse**: Don't reuse previous passwords
- **No sharing**: Passwords are personal, never share

**Research Applications**:

**Study Database Access**:
- User JDoe logs in with username+password+token (MFA)
- System checks: Is JDoe's account active? Has JDoe completed HIPAA training? Is JDoe authorized for Study ABC?
- If yes → JDoe gains access to role-appropriate data (e.g., de-identified data for data analyst role)
- If no → Access denied, incident logged

**Tiered Access**:
- **Level 1 (Public)**: Anyone can access (de-identified, published data)
- **Level 2 (Internal)**: Institutional login required (limited data sets for internal research)
- **Level 3 (Study-Specific)**: IRB approval + training required (identified PHI for specific study)

#### Audit Logs

**Security Rule** (45 C.F.R. § 164.312(b)): Implement hardware, software, and/or procedural mechanisms that record and examine activity in systems containing ePHI

**What to Log**:
- **Access**: Who accessed which records, when
- **Modifications**: Who changed data, what was changed, when
- **Deletions**: Who deleted data, what was deleted, when (soft delete preferred - mark as deleted but retain)
- **Exports**: Who downloaded/exported data, what dataset, when
- **Authentication**: Login/logout, failed login attempts

**Tamper-Proof Logging**:
- Logs stored separately from application (so user can't delete own access logs)
- Write-only access to logs (users can add entries but not modify/delete)
- Checksums or digital signatures to detect tampering

**Retention**: HIPAA requires 6 years (retain logs for 6 years)

**Review**: See § 5.2 (Audit & Monitoring)

**Research Example - Audit Log Entry**:
```
Timestamp: 2026-03-15 14:32:17
User: jdoe@institution.edu
Action: SELECT
Database: StudyABC_PHI
Table: Patients
Records: 150 (WHERE diagnosis_code LIKE 'E11%')
IP Address: 192.168.1.100
Session ID: a3f8d92b
Result: Success
```

#### Integrity Controls

**Security Rule** (45 C.F.R. § 164.312(c)(1)): Implement policies/procedures to protect ePHI from improper alteration or destruction

**Methods**:

**1. Checksums/Hash Functions**:
- Calculate hash of dataset (SHA-256)
- Recipients verify hash matches → Data not corrupted in transit
- Example: "Dataset_2026-03-15.csv, SHA-256: a3f8d92b4c5e..."

**2. Version Control**:
- Git for analysis code (every change tracked, can revert)
- Database versioning for research databases (track schema changes)

**3. Change Tracking**:
- Audit logs record all data modifications
- Example: Patient ID 12345, diagnosis changed from A to B, by user jdoe, on 3/15/2026

**4. Backup Verification**:
- Regular backups of research databases
- **Test restores**: Periodically verify backups can be restored
- **Versioned backups**: Retain snapshots so can restore to specific time point if corruption occurs

**5. Write Controls**:
- **Read-only access** for most users (data analysts, read-only research DBs)
- **Write access** only for data managers, with change tracking

**Research Application - Analysis Code**:
```
Git Repository: StudyABC_Analysis

Commit history:
- 3/15/2026, jdoe: "Add regression model for primary outcome"
- 3/10/2026, jdoe: "Fix typo in variable name"
- 3/5/2026, jsmith: "Initial data cleaning script"

Integrity: Every change tracked, can revert to any prior version, can review who changed what
```

#### De-identification Tools

**Purpose**: Remove identifiers from PHI for research use

**Automated Tools**:
- **Scrubbing**: Remove names, MRNs, phone numbers from structured data (SQL scripts, Python pandas)
- **Natural Language Processing (NLP)**: Remove identifiers from free-text notes (named entity recognition for names, dates, locations)
- **Validation**: Automated checks that de-identification complete (scan for patterns: ###-##-####for SSN, phone number patterns, name dictionaries)

**Example - Automated De-identification Script**:
```python
import pandas as pd
import re

def deidentify_safe_harbor(df):
    """Apply Safe Harbor de-identification to dataframe"""

    # Remove direct identifiers
    df = df.drop(columns=['name', 'mrn', 'ssn', 'phone', 'email', 'address'])

    # Truncate ZIP to 3 digits (assume all areas >20K population)
    df['zip_3digit'] = df['zip'].astype(str).str[:3]
    df = df.drop(columns=['zip'])

    # Retain year only from dates
    df['birth_year'] = pd.to_datetime(df['birth_date']).dt.year
    df['diagnosis_year'] = pd.to_datetime(df['diagnosis_date']).dt.year
    df = df.drop(columns=['birth_date', 'diagnosis_date'])

    # Aggregate ages >89
    df['age_group'] = df['age'].apply(lambda x: '90+' if x > 89 else str(x))
    df = df.drop(columns=['age'])

    # Verify no identifiers remain
    assert 'name' not in df.columns
    assert 'mrn' not in df.columns
    assert 'ssn' not in df.columns

    return df

# Usage
phi_data = pd.read_csv('identifiable_data.csv')
deidentified_data = deidentify_safe_harbor(phi_data)
deidentified_data.to_csv('deidentified_data.csv', index=False)
```

**Free-Text De-identification (Clinical Notes)**:
- **Challenge**: Notes contain names, dates, locations in narrative text
- **NLP Tools**:
  - Microsoft Presidio (open source, detects PII including names, dates, locations, phone, email, SSN)
  - AWS Comprehend Medical (detects PHI in medical text)
  - NLTK + custom rules (named entity recognition + regex patterns)
- **Approach**: Replace identified entities with tokens [NAME], [DATE], [LOCATION] or synthetic replacements
- **Validation**: Manual review of sample (e.g., review 100 random notes to check for missed identifiers)

---

### 5.4 Physical Safeguards for Research

#### Facility Access Controls

**Security Rule** (45 C.F.R. § 164.310(a)(1)): Implement policies/procedures to limit physical access to electronic information systems and facilities housing them

**Research Settings**:

**1. Locked Office/Lab**:
- Researchers working with PHI: Office/lab must lock when unattended
- Keyed locks or badge access
- Sign-in log for visitors

**2. Badge Access Systems**:
- Swipe card or RFID badge to enter secure areas
- Access granted only to authorized personnel
- Audit trail (who accessed when)

**3. Visitor Policies**:
- Visitors must sign in, receive temporary badge
- Escorted at all times in secure areas
- No access to workstations/servers with PHI

**4. Data Center**:
- If institution hosts research databases on-premise
- Restricted access (IT staff only)
- Surveillance cameras
- Environmental controls (fire suppression, temperature/humidity monitoring)

**Research Example - Secure Research Enclave**:
```
Policy: Physical Access to Research Data Center

Access Levels:
- Level 1: Public areas (lobby, conference rooms) - Badge not required
- Level 2: General office space - Badge required (all employees)
- Level 3: Research data center - Badge + PIN required (IT staff, approved researchers with PHI access training)

Access Controls:
- Badge readers at all Level 2/3 entry points
- Failed access attempts logged and reviewed
- Lost/stolen badges reported immediately, access revoked
- Access permissions reviewed quarterly

Physical Security:
- Surveillance cameras in data center (24/7 recording, 90-day retention)
- Locked server racks (key access log maintained)
- Fire suppression system
- Backup power (UPS, generator)
```

#### Workstation Use & Security

**Security Rule** (45 C.F.R. § 164.310(b)-(c)): Implement physical safeguards for workstations and policies for proper use

**Workstation Policies**:

**1. Privacy Screens**:
- Use privacy filters on monitors to prevent shoulder surfing
- Especially important in open offices, clinics, public areas

**2. Screen Positioning**:
- Position monitors away from public view (not visible through windows, from hallways)

**3. Screen Lock**:
- Lock screen when leaving workstation (Windows+L, Ctrl+Cmd+Q on Mac)
- Auto-lock after 15 minutes inactivity

**4. Clean Desk Policy**:
- No paper with PHI left on desk overnight
- Lock papers in drawer/file cabinet when not in use
- Shred paper with PHI when done (cross-cut shredder)

**5. No Public Workstations**:
- Don't access PHI from public computers (library, hotel business center, internet cafe)

**Research Example - Mobile Workstation Policy**:
```
Policy: Laptop Use for Research with PHI

Requirements:
- Institutional laptop (approved configuration, full-disk encryption)
- VPN for remote access to research databases
- Strong password + MFA
- Auto-lock after 15 min inactivity
- Physical security: Don't leave unattended in public (coffee shops, airports, cars)

Prohibited:
- Personal laptops (unless approved by IT, encrypted, MDM enrolled)
- Storing PHI on laptop local disk (store on encrypted network drive, sync via secure methods)
- Leaving laptop in car overnight (high theft risk)

Lost/Stolen:
- Report immediately (24/7 IT help desk)
- Remote wipe if cannot recover
- Breach assessment (was disk encrypted? What PHI was on laptop?)
```

#### Device & Media Controls

**Security Rule** (45 C.F.R. § 164.310(d)(1)): Implement policies/procedures for receipt/removal of hardware/media containing ePHI

**Policies**:

**1. Inventory**:
- Maintain inventory of all devices containing/accessing ePHI (laptops, tablets, USB drives, external hard drives)
- Track serial numbers, assigned users, encryption status

**2. Lost/Stolen Procedures**:
- Immediate reporting
- Remote wipe if capable
- Breach risk assessment
- Replacement device (if institutional property)

**3. Disposal**:
- **Electronic media**: Degaussing (demagnetize), physical destruction (shredding), secure wiping (DoD 5220.22-M wipe standard, multiple overwrites)
- **Paper**: Cross-cut shredding (particles <5mm)
- **Certificate of destruction**: Document disposal (date, method, person responsible)

**4. Reuse**:
- If reassigning laptop to new user: Securely wipe, reinstall OS
- If disposing: Remove hard drive, destroy separately
- **Don't**: Sell/donate devices that contained PHI without secure wiping

**Research Example - Device Disposal**:
```
Procedure: Secure Disposal of Research Devices

Laptops/Desktops:
1. IT removes hard drive
2. Hard drive degaussed or physically destroyed (drill holes, shred)
3. Certificate of destruction signed
4. Remaining hardware (monitor, keyboard, chassis) donated or recycled

USB Drives/External Hard Drives:
1. Physically destroyed (incineration, shredding)
2. Certificate of destruction signed
3. Do NOT donate/reuse (too risky to ensure complete wiping)

Documentation:
- Disposal log: Device serial number, date, method, person responsible
- Retain 6 years
```

---

### 5.5 Safeguards in Cloud & AI Environments

#### Cloud Service Providers

**Business Associate Agreement Required**: Any cloud service that stores/processes PHI on behalf of covered entity must sign BAA

**Not All Cloud Services are HIPAA-Eligible**:
- Consumer versions of Google Drive, Dropbox, iCloud → NOT HIPAA-eligible (no BAA available)
- Enterprise versions with HIPAA compliance features → May be eligible (BAA available)

**HIPAA-Eligible Cloud Platforms**:
- **Amazon Web Services (AWS)**: AWS signs BAA, use eligible services (S3, RDS, EC2, etc.)
- **Microsoft Azure**: Azure signs BAA, use eligible services (Azure Storage, SQL Database, Virtual Machines)
- **Google Cloud Platform (GCP)**: GCP signs BAA, use eligible services (Cloud Storage, BigQuery, Compute Engine)

**Shared Responsibility Model**:
- **Cloud provider responsible for**: Physical security of data centers, network security, infrastructure maintenance
- **Customer (researcher) responsible for**: Access controls (who can access data), encryption configuration, application security, data backup

**Research Example - AWS Setup for PHI**:
```
AWS HIPAA-Compliant Configuration:

1. Sign AWS BAA
2. Use only eligible services (check AWS HIPAA Eligible Services List)
3. Enable encryption:
   - S3 buckets: Server-side encryption with AWS KMS
   - RDS databases: Encryption at rest enabled
   - EBS volumes: Encrypted
4. Configure access controls:
   - IAM users/roles with minimum necessary permissions
   - MFA required for console access
   - VPC (Virtual Private Cloud) for network isolation
5. Enable audit logging:
   - CloudTrail logs all API calls
   - S3 access logs
   - VPC Flow Logs
6. Configure backups:
   - Automated RDS snapshots (encrypted)
   - S3 versioning enabled
7. Incident response:
   - CloudWatch alarms for unusual activity
   - SNS notifications to security team
```

#### AI/ML Platforms

**BAA Required**: If AI/ML platform accesses PHI

**Common Scenarios**:

**Scenario 1: Cloud AI for Training Model on PHI**
- Upload clinical data to cloud platform (AWS SageMaker, Azure ML, Google Vertex AI)
- **Requirements**:
  - BAA with cloud vendor
  - Encrypt data in transit and at rest
  - Access controls (who can access training data, trained models)
  - Audit logs
- **Model Parameters May Contain PHI**: If model memorizes training data
  - Consider: Differential privacy during training (adds noise)
  - Consider: Federated learning (model trains locally, only parameters shared)

**Scenario 2: De-identified Data for AI Training**
- Preferred approach: De-identify before uploading to cloud
- **If properly de-identified**: No BAA required, not PHI
- **But**: Verify de-identification robust (genomic data, rare disease data may still be quasi-identifying)

**Scenario 3: On-Premise AI (No Cloud)**
- Train model on institutional servers
- **BAA**: Not required (no external vendor)
- **Safeguards**: Still need encryption, access controls, audit logs per Security Rule

**AI-Specific Safeguards**:

**1. Training Data Protection**:
- Encrypt training data at rest and in transit
- Limit access to data scientists with IRB approval
- Log all access to training data

**2. Model Parameter Security**:
- Models may memorize sensitive information (patient records, rare characteristics)
- Treat model parameters as potentially containing PHI
- Encrypt saved models
- Limit access to trained models

**3. Inference API Safeguards**:
- If model deployed as API for clinical decision support
- Encrypt API traffic (HTTPS)
- Authenticate API requests (API keys, OAuth tokens)
- Log all API calls (who queried, what inputs, what outputs)

**4. Federated Learning** (for Multi-Site Studies):
- Each site trains model locally on its own data (PHI never leaves site)
- Only model parameters/gradients shared to central server
- Central server aggregates parameters to create global model
- **Advantage**: Preserves privacy (PHI stays local)
- **Limitation**: More complex infrastructure

**5. Differential Privacy**:
- Add calibrated noise during training so individual records cannot be inferred
- Mathematical guarantee of privacy
- **Tradeoff**: Reduces model accuracy slightly

**Example - Cloud AI Model Training with PHI**:
```
Study: Train sepsis prediction model on multi-site EHR data

Setup:
1. Each hospital signs BAA with AWS
2. Hospital uploads encrypted EHR data to AWS S3 (diagnosis codes, vital signs, lab results + patient IDs for linkage)
3. Data scientist accesses data via AWS SageMaker (MFA required)
4. Model trained using SageMaker
5. Model parameters saved to encrypted S3 bucket
6. After training: Data deleted from S3 per BAA terms (6 months post-study completion)
7. Model deployed to on-premise server for clinical use (not cloud, to reduce ongoing BAA requirements)

Safeguards:
- BAA: AWS signs BAA
- Encryption: S3 server-side encryption, data encrypted in transit (HTTPS)
- Access: IAM roles limit access to approved data scientists, MFA required
- Audit: CloudTrail logs all access
- Retention: Data deleted per schedule, certificate of deletion obtained
```

---

### 5.6 Verification of Identity & Authority

**Privacy Rule Requirement** (45 C.F.R. § 164.514(h)): Before using or disclosing PHI, covered entity must verify the identity of person requesting information (if identity not already known) and verify authority to receive information

**Standard**: Reasonable reliance (not absolute certainty)

#### Verification Methods

**In-Person**:
- Government-issued photo ID (driver's license, passport)
- Compare photo to person

**Remote (Phone, Email, Portal)**:
- Challenge questions (personal information only requester would know)
- Callback to phone number on file
- Email to address on file (if reasonable to believe email account is controlled by requester)
- Digital certificates, multi-factor authentication

**Written Requests**:
- Signature comparison (if signature on file)
- Letterhead (if official request from organization)
- Return address (mail to address on file, require in-person pickup with ID)

#### Electronic HIE Mechanisms

**Federated Identity Management**:
- User logs in at home institution (university, hospital)
- Institutions trust each other's authentication (SAML, OAuth, OpenID Connect)
- Example: Faculty member at University A logs in with University A credentials, gains access to HIE that includes University B's data (trusts University A's authentication)

**Attribute-Based Access Control (ABAC)**:
- Access based on attributes (role, affiliation, training completion, IRB approval)
- Example: Access granted if: (role=faculty) AND (HIPAA_training=complete) AND (IRB_approval_number=2026-123)

**Pre-Registered Authorized Users**:
- HIE maintains list of authorized users from each participating institution
- Institution certifies: "These 10 users are our authorized faculty researchers"
- HIE validates user is on authorized list before granting access

#### Research Scenarios

**Scenario: Verifying Collaborator Before Data Sharing**

Researcher at Institution A wants to share PHI with collaborator at Institution B

**Verification Steps**:
1. **Identity**: Confirm collaborator is who they claim to be
   - Email from official institutional email address (not Gmail/Yahoo)
   - Verify via phone call to institution's main number, ask to be transferred to collaborator
   - Check institutional directory/website for collaborator's profile

2. **Authority**: Confirm collaborator is authorized to receive PHI
   - Review IRB approval (is collaborator listed on IRB protocol?)
   - Review BAA or DUA (is collaborator's institution a party to agreement?)
   - Verify training completion (has collaborator completed HIPAA training?)

3. **Documentation**: Document verification steps taken

**Scenario: Student Requests Access to Research Data**

PhD student working on dissertation wants access to PHI dataset

**Verification**:
- Student is known to PI? → If yes, simple verification (PI confirms student is authorized)
- Student is new? → Verify student ID, enrollment status, IRB approval listing student as research personnel, training completion

**Authority Check**: Is student listed on IRB protocol? Has student completed training? Has student signed confidentiality agreement?

---

## Section 6: Accountability

### 6.1 Workforce Training Requirements

**Privacy Rule** (45 C.F.R. § 164.530(b)): Covered entity must train all workforce members on policies/procedures, as necessary and appropriate for them to carry out functions

#### Who Must Be Trained

**All workforce members** with potential PHI access:
- Employees (full-time, part-time, temporary)
- Volunteers
- Trainees (medical students, residents, fellows, PhD students, postdocs)
- Contractors (if they access PHI as part of workforce - different from business associates)

**Research Context**:
- Principal Investigators
- Co-Investigators
- Research Coordinators
- Data Analysts
- Lab Technicians (if handling biospecimens linked to PHI)
- Students (grad students, undergrads working on research projects)

#### Training Content

**Core Topics** (all staff):
1. **What is PHI?** Definition, examples
2. **Permitted Uses/Disclosures**: When can PHI be used without authorization?
3. **Authorization Requirements**: When is authorization needed? How to obtain valid authorization?
4. **Minimum Necessary**: Use only what's needed for the purpose
5. **Individual Rights**: Access, amendment, restriction requests
6. **Safeguards**: Password policies, encryption, physical security, clean desk
7. **Breach Notification**: What to do if laptop stolen, email sent to wrong person
8. **Sanctions**: Consequences of violations
9. **How to Report**: Suspected violations, security incidents

**Role-Specific Training** (for faculty):

**For Clinical Faculty**:
- Using EHR compliantly (documentation, amending records, responding to patient access requests)
- Teaching with PHI (de-identifying case examples, obtaining authorization for photos/videos)
- Telemedicine safeguards (encryption, recording consent, secure platforms)

**For Research Faculty**:
- IRB authorization/waiver process
- BAA requirements for cloud vendors, collaborators
- De-identification methods (Safe Harbor, Expert Determination, Limited Data Sets)
- Multi-site study coordination (data sharing agreements)

**For Instructional Faculty** (using PHI in teaching):
- De-identifying patient cases for classroom discussion
- Using standardized patients vs. real patients for demonstrations
- Obtaining authorization if using actual patient data (photos, videos, detailed cases)
- FERPA vs. HIPAA (student health records)

#### Training Timing

**Initial Training**: Before employee/trainee has access to PHI

**Updates**: When privacy practices change materially (new policies, new systems, regulatory changes)

**Periodic Refresher**: At least annually (recommended)

**New System/Process**: Before implementing new research database, new cloud platform, new HIE participation

#### Documentation Requirements

**Must document**:
- Training content (materials, slides, handouts)
- Attendees (names, dates, acknowledgment of completion)
- Retention: 6 years from date of creation or last effective date (whichever is later)

**Example Training Record**:
```
Course: HIPAA Privacy & Security for Research Personnel
Date: March 15, 2026
Instructor: J. Smith, Privacy Officer
Attendees: [List of names]
Topics Covered: [Checklist of core topics]
Assessment: Quiz (80% passing score)
Completion Certificates: Issued to all attendees who passed quiz
```

---

### 6.2 Sanctions & Enforcement

**Privacy Rule** (45 C.F.R. § 164.530(e)): Covered entity must have and apply appropriate sanctions against workforce members who violate policies or Privacy Rule

#### Sanction Policy Requirements

**Must Have**:
- Written sanctions policy
- Range of sanctions (verbal warning → termination)
- Must actually apply sanctions (cannot ignore violations)

**Should Include**:
- Types of violations (severity levels)
- Corresponding sanctions
- Process for investigation
- Appeals process
- Documentation requirements

#### Faculty-Relevant Scenarios

**Scenario 1: Using Patient Case in Lecture Without De-identification**

**Violation**: Faculty member projects patient's EHR screen (including name, MRN, full medical history) in large lecture hall without authorization

**Investigation**:
- How many students saw PHI? (100+ students)
- Was PHI identifying? (Yes - name, MRN visible)
- Was authorization obtained? (No)
- Was there legitimate educational justification? (Yes, but should have de-identified)

**Sanction**: Written warning, mandatory retraining on de-identification methods, requirement to use de-identified cases in future

**Mitigation**: Contact patient, apologize, offer credit monitoring if identity theft risk (here: low risk, so inform patient of incident)

**Scenario 2: Sharing Research Dataset via Unencrypted Email**

**Violation**: PhD student emails de-identified dataset to advisor using Gmail (unencrypted)

**Investigation**:
- Was data de-identified? (Yes - properly de-identified per Safe Harbor)
- Was data PHI? (No - once properly de-identified, not PHI)
- Was policy violated? (Yes - policy requires secure file transfer even for de-identified data, to ensure de-identification is correct)

**Sanction**: Verbal warning (minor violation, data was de-identified so low risk), retraining on secure file transfer methods

**Prevention**: Update training to emphasize: Even de-identified data should be transferred securely

**Scenario 3: Accessing Colleague's Medical Record Without Authorization**

**Violation**: Faculty member accesses EHR record of colleague (out of curiosity, not for treatment/payment/operations)

**Investigation**:
- Was access authorized? (No - no treating relationship, no legitimate purpose)
- Intent? (Snooping - curiosity about colleague's health condition)
- Prior violations? (No)

**Sanction**: Termination (zero tolerance for snooping)

**Legal Reporting**: May constitute criminal HIPAA violation under HITECH Act (criminal penalties for accessing PHI under false pretenses)

---

### 6.3 Complaint Process

**Privacy Rule** (45 C.F.R. § 164.530(d)): Covered entity must provide process for individuals to complain about compliance

**Requirements**:
- Document complaint process
- Inform individuals how to file complaints (in Notice of Privacy Practices)
- Prohibit retaliation against individuals who file complaints

#### Complaint Handling Procedure

**1. Receipt**:
- Accept complaints in writing or verbally
- Provide contact information (Privacy Officer, compliance hotline, email, mailing address)

**2. Documentation**:
- Who filed complaint?
- What is alleged violation?
- When did it occur?
- Where did it occur?

**3. Investigation**:
- Interview complainant
- Interview staff involved
- Review audit logs, policies, documentation

**4. Determination**:
- Did violation occur?
- If yes, what was cause? (Policy gap, training gap, intentional violation, system error)

**5. Response**:
- Inform complainant of outcome (may be limited by personnel confidentiality)
- Corrective action if violation found

**6. Prevention**:
- Revise policies if needed
- Additional training if needed
- Sanctions if appropriate

#### Faculty Example

**Complaint**: Research participant contacts Privacy Officer: "I was in research study on mental health. I withdrew from study last year, but study coordinator continues to email me asking about my depression symptoms. I told coordinator I want no more contact, but emails continue."

**Investigation**:
- Review IRB protocol (does it address withdrawal process?)
- Review coordinator training records
- Interview coordinator
- Review participant's withdrawal documentation

**Findings**: Coordinator was not trained on withdrawal procedures, continued to send automated follow-up emails after participant withdrew

**Outcome**:
- Corrective action: Stop all contact with participant, apologize
- Coordinator: Retraining on withdrawal procedures, written warning
- Policy: Update coordinator training to explicitly cover withdrawal procedures
- System: Implement automatic email suppression for withdrawn participants

---

### 6.4 Mitigation of Harmful Effects

**Privacy Rule** (45 C.F.R. § 164.530(f)): Covered entity must mitigate, to extent practicable, harmful effects of use/disclosure of PHI in violation of policies or Privacy Rule

**"To the Extent Practicable"**: Reasonable efforts, not unlimited liability

#### Mitigation Strategies

**1. Identify & Contain**:
- What PHI was disclosed? To whom? When?
- Can disclosure be reversed? (Recall email, retrieve documents, delete files)
- Prevent further disclosure (contact recipient, request return/deletion)

**2. Notify Individual (if appropriate)**:
- If individual can take self-protective measures (identity theft risk) → Notify
- If no realistic harm (de-identified data mistakenly treated as PHI) → May not notify
- Inform individual of: What happened, what PHI involved, what entity is doing to mitigate, resources for individual (credit monitoring, fraud alerts)

**3. Corrective Action**:
- Fix cause of violation (patch software bug, revise policy, provide training)
- Sanctions if appropriate

**4. Monitor**:
- Check whether recipient deleted/returned PHI as requested
- Monitor for misuse (credit monitoring if SSN disclosed)

#### Cloud/AI Context Examples

**Example 1: Dataset Accidentally Uploaded to Public Cloud Bucket**

Faculty member uploads research dataset to AWS S3 bucket, mistakenly sets bucket to "public" instead of "private." Dataset contains PHI (names, MRNs, diagnoses).

**Mitigation**:
1. **Immediate**: Change bucket permissions to private (PHI no longer publicly accessible)
2. **Investigate**: Was bucket accessed by unauthorized parties? (Check S3 access logs)
   - If accessed: Assess who, what they downloaded, risk of harm
   - If not accessed: Limited harm (exposed but not accessed)
3. **Notify**:
   - If accessed by unauthorized parties → Breach notification likely required
   - If not accessed → Risk assessment to determine if breach notification required (4-factor test)
4. **Prevent**: Mandatory training on AWS security best practices, require peer review before making buckets public

**Example 2: AI Model Training Data Inadvertently Included Test Patient**

Researcher uses own medical record as "test case" to verify AI model, forgets to remove from training dataset. Model trained on researcher's own PHI.

**Mitigation**:
1. **Identify**: Researcher is both subject and workforce member (self-disclosure)
2. **Contain**: Re-train model without researcher's data
3. **Harm Assessment**: Model parameters may have memorized researcher's PHI (low risk - one record among thousands)
4. **Notify**: Inform researcher (though they already know, since it's their own data)
5. **Prevent**: Policy: No use of own/family/colleague data without explicit IRB approval and safeguards

---

### 6.5 Liability & Business Associate Relationships

#### Covered Entity Liability

**Covered Entity is Liable For**:
- Own violations
- Workforce violations (employees, volunteers, trainees)
- Failure to have satisfactory BAA with business associates
- Failure to act on known business associate violations

**Covered Entity is NOT Directly Liable For**:
- Business associate's violations (if BAA in place and entity takes required action)
- Other covered entity's violations in HIE (each entity responsible for own)

#### Business Associate Liability

**Under HITECH Act** (2009): Business associates now **directly liable** for compliance with certain HIPAA provisions:
- Security Rule (safeguards for ePHI)
- Breach Notification Rule
- Select Privacy Rule provisions (permissible uses/disclosures per BAA, de-identification, minimum necessary to extent specified in BAA)

**Penalties**: HHS can impose civil monetary penalties directly on business associates

#### Covered Entity Obligations When Business Associate Violates

**45 C.F.R. § 164.504(e)(1)(ii)**: If covered entity knows of pattern/practice of BA violation of BAA:
1. **Take reasonable steps to cure** violation
2. **If unsuccessful**: Terminate BAA
3. **If termination not feasible**: Report violation to HHS

**Example - Cloud Vendor Violation**:

University (covered entity) has BAA with Cloud Vendor (BA) for research data storage.

**Scenario**: Cloud Vendor has data breach (unauthorized access to research database with PHI)

**Covered Entity Response**:
1. **Investigate**: What happened? What PHI accessed? Was BAA violated?
2. **Cure**: Demand vendor implement additional safeguards (MFA, enhanced monitoring)
3. **Monitor**: Require vendor to provide weekly security reports for 3 months
4. **If Vendor Refuses to Improve** or **Breaches Continue**: Terminate BAA (migrate data to new vendor)
5. **If Termination Not Feasible** (e.g., vendor holds critical data, migration would take 12 months): Report to HHS while continuing mitigation efforts

#### Multi-Party BAAs and Liability

**Common in Research HIEs**: One HIO, multiple covered entities (hospitals, clinics)

**Liability Structure**:
- Each covered entity liable for own workforce
- HIO liable (to extent BAs can be liable) for HIO's own violations
- Hospital A **not liable** for Hospital B's violations
- But: Each covered entity must ensure HIO is complying with BAA

**Example**: HIO has lax access controls, allows unauthorized access to PHI from all participating hospitals

**Each Covered Entity Must**:
- Demand HIO fix access controls (cure)
- If HIO refuses or fails to fix: Terminate relationship with HIO
- Cannot continue relationship knowing HIO has inadequate safeguards

---

## Section 7: Correction & Amendment Rights

### 7.1 Individual's Right to Request Amendment

**Privacy Rule** (45 C.F.R. § 164.526): Individual has right to request that covered entity amend PHI in designated record set

**Designated Record Set** (45 C.F.R. § 164.501):
- Medical records
- Billing records
- Enrollment records
- Other records used to make decisions about individual

**NOT in Designated Record Set**:
- Psychotherapy notes (separate category)
- Information compiled for litigation
- Certain quality assurance/peer review records (if not used for decisions about individual)

**Timeframe**:
- Covered entity must act within **60 days** of request
- May extend **one time** for up to **30 additional days** (with written notice to individual explaining delay)

#### Research Context

**Research Data** is generally **NOT** in "designated record set" (not used to make decisions about individual in care/billing/enrollment context)

**BUT**: Clinical trial data **may be** in designated record set if:
- Trial provides treatment to individual
- Trial data used to make clinical decisions (dose adjustments, safety monitoring)

**Example**:
- Phase III cancer trial: Participant receives investigational chemotherapy
- Trial data (labs, vital signs, adverse events) → May be in designated record set (used for treatment decisions)
- Participant requests amendment: "My adverse event severity was recorded as Grade 3, but I believe it was Grade 2"
- Covered entity (hospital/trial site) must respond per amendment process

---

### 7.2 Grounds for Denial

Covered entity **may deny** amendment request if determines:

**1. Information not created by covered entity** (unless originator no longer available to act on amendment)
- Example: Hospital receives labs from outside lab, patient requests amendment of lab result → Hospital may deny (didn't create, refer to outside lab)

**2. Not part of designated record set**

**3. Not available for individual to access** under access right (45 C.F.R. § 164.524)
- Example: Psychotherapy notes (individual generally doesn't have access right)

**4. Record is accurate and complete** (covered entity's determination)

**Denial Process**:
- Written denial to individual (within 60-90 days)
- Plain language explanation of basis for denial
- Individual's right to submit statement of disagreement
- Individual's right to complain to covered entity and HHS

---

### 7.3 Electronic Advantages for Amendment

**Efficiency**:
- Individual requests amendment via patient portal (electronic submission)
- Covered entity reviews and responds electronically (faster than mail)
- If accepted: Electronic record easily amended (append note, link amendment to original entry)

**Notification**:
- If amendment accepted, covered entity must notify:
  - Individual
  - Persons identified by individual as needing amendment
  - Others known to have PHI that was amended
- HIE facilitates notification: Can identify all entities that received amended data, send electronic notification

**Example**:
- Patient identifies error in medication list in EHR
- Hospital accepts amendment
- Hospital notifies via HIE: All providers who accessed patient's medication list in past 12 months
- Electronic notification faster than mailing letters to each provider

---

## Section 8: Openness & Transparency

### 8.1 Notice of Privacy Practices (NPP)

**Privacy Rule** (45 C.F.R. § 164.520): Covered entities must provide Notice of Privacy Practices to individuals

**Required NPP Content**:
- **Header**: Statement of individual's right to privacy
- **Uses & Disclosures**: Types and examples (treatment, payment, operations, research, public health, etc.)
- **Individual Rights**: Access, amendment, accounting of disclosures, restriction requests, confidential communications, complaint
- **Covered Entity Duties**: Protect privacy, abide by NPP, notify of breaches
- **Contact**: For complaints, for questions
- **Effective Date**

#### Research-Relevant NPP Additions

**If Covered Entity Conducts Research**:

NPP should mention:
- "We may use/disclose your health information for research purposes"
- Examples: "Researchers may access your medical records to study treatment effectiveness"
- Individual rights: "You have the right to refuse to allow your information to be used for research. Your refusal will not affect your care."

**If Covered Entity Participates in HIE**:

NPP should mention:
- "We participate in [HIE Name] to share your information with other health care providers for your treatment"
- Opt-out opportunity: "You may request that we not share your information through the HIE. Contact [Privacy Officer] to opt out."

#### Electronic NPP Delivery

**Web Posting**: If covered entity has website describing services → Must prominently post NPP on website

**E-Delivery**: May email NPP to individual if individual agrees to electronic delivery (individual retains right to request paper copy)

**First Electronic Service**: If first service is electronic (telemedicine, e-visit), must send electronic NPP automatically

#### Faculty Teaching Context

**Clinical Faculty**:
- Provide NPP to patients at first visit
- NPP should mention if teaching institution: "We are a teaching hospital. Medical students, residents, and fellows may be involved in your care."
- Obtain acknowledgment of receipt (sign form, electronic acknowledgment in portal)

**Research Faculty**:
- Covered entity provides NPP (not researcher)
- But: Research authorization should reference NPP: "You may have received [Hospital's] Notice of Privacy Practices, which describes how we generally use and disclose health information. This authorization permits uses beyond what's described in the Notice."

---

## Section 9: Research Data Management Scenarios

### Scenario 1: Building AI Model for Clinical Decision Support

**Setting**: Faculty researcher at academic hospital wants to train machine learning model to predict sepsis using EHR data (vital signs, lab results, diagnoses)

**HIPAA Analysis**:

**1. PHI Involved?**
- Yes: EHR data includes patient ID, dates, diagnoses, vital signs, lab results → PHI

**2. De-identification Feasible?**
- For training: Yes, can de-identify (remove patient ID, dates → relative time, aggregate ages >89)
- For validation: Maybe (need to link predictions back to outcomes, may need identified data)

**3. Authorization or Waiver?**
- Training on de-identified data: No authorization needed (not PHI once de-identified)
- If need identified data for validation: Waiver likely appropriate (minimal risk, impracticable to obtain authorization from thousands of patients)

**4. Cloud ML Platform?**
- If using cloud (AWS SageMaker, Azure ML): BAA required
- If on-premise: No BAA needed

**5. Minimum Necessary?**
- Determine required features (vital signs, labs, diagnoses)
- Exclude unneeded data (insurance, billing, social history notes, unrelated diagnoses)

**6. Safeguards**:
- Encrypt data in transit (HTTPS) and at rest (database encryption, cloud encryption)
- Access controls (only IRB-approved researchers)
- Audit logging (track who accessed data)
- If cloud: Use HIPAA-eligible services, configure per security best practices

**7. Model Deployment**:
- Model parameters may embed PHI (if model memorizes training data)
- Risk assessment: Low risk if large dataset (model averages over many patients)
- Deploy model to on-premise server (reduces ongoing BAA requirements)

**Implementation Steps**:
1. IRB approval with waiver of authorization (if using identified data) OR IRB determination that de-identified data is not human subjects research
2. If cloud: Execute BAA with cloud vendor
3. Extract EHR data, de-identify (or obtain IRB waiver for identified data)
4. Upload to encrypted cloud storage or on-premise server
5. Train model with safeguards (access controls, audit logs)
6. Validate model
7. Delete training data per schedule
8. Deploy model for clinical use (separate FDA analysis if model is medical device)

**FDA Consideration**: Is model a "medical device"? If provides clinical decision support that's not "clinical decision support software" exemption → May require FDA clearance/approval

---

### Scenario 2: Multi-Site Observational Study

**Setting**: Three hospitals participating in HIE want to collaborate on study of surgical outcomes

**HIPAA Analysis**:

**1. Each Hospital = Covered Entity**

**2. HIE = Business Associate** of each hospital

**3. Data Coordinating Center (DCC) = Business Associate** of each hospital

**4. BAA Structure**:
- Option A: Each hospital has individual BAA with DCC (3 BAAs)
- Option B: Single multi-party BAA signed by all 3 hospitals and DCC (1 BAA)

**5. Data Sharing**:
- Each hospital determines whether to disclose PHI to DCC for study:
  - De-identify before sharing? (preferred if feasible)
  - Limited data set with DUA? (if need dates/ZIP)
  - Identified data with authorization or IRB waiver? (if linkage needed)

**6. Standardization Across Sites**:
- Define common data model (same variable names, formats)
- Agree on de-identification method (all use Safe Harbor, or all use Expert Determination with same risk threshold)
- Common DUA or BAA terms

**7. IRB Coordination**:
- Each hospital's IRB reviews study
- May use reliance agreement (one IRB reviews for all sites)
- All IRBs must approve waiver of authorization (if using identified data)

**8. Data Linkage**:
- If patient treated at Hospital A and Hospital B → DCC may identify common patients via HIE (with BAA authorization for DCC to access HIE record locator service)

**Implementation**:
1. Lead hospital develops protocol, submits to all 3 IRBs
2. IRBs grant waivers of authorization (minimal risk, impracticable to obtain consent, adequate safeguards)
3. Hospitals and DCC execute multi-party BAA
4. Each hospital extracts data (standard format), applies agreed-upon de-identification
5. Hospitals send de-identified data to DCC via secure file transfer (SFTP)
6. DCC aggregates, analyzes, returns results to hospitals
7. Results published (with suppression of cells <11)

---

### Scenario 3: Faculty Using PHI in Teaching

**Setting**: Clinical faculty wants to use patient case in lecture to medical students

**HIPAA Considerations**:

**1. Is Disclosure for Treatment, Payment, or Operations?**
- Teaching may qualify as health care operations (training of health care workforce)
- But: Sharing with students in large lecture (not treating patient) → More conservative approach: Treat as disclosure requiring authorization or de-identification

**2. Options**:

**Option A: De-identify Case** (Preferred)
- Remove patient name, MRN, specific dates (use year only or "5 years ago")
- Remove photos (or blur face)
- Generalize rare details (if only patient in state with rare combination of conditions → generalize)
- "This is a case of a 62-year-old woman with [common diagnosis]..."

**Option B: Obtain Authorization**
- Contact patient, explain: "I'd like to use your case for teaching medical students. Your name and photo would be shown. Do I have your permission?"
- Obtain signed authorization
- Limit disclosure to what authorized (if patient agrees to de-identified case but not photos, honor that)

**Option C: Use Standardized/Simulated Patients**
- Actors portraying patients (not real patients)
- No PHI involved

**3. If De-identifying**:
- Apply Safe Harbor (remove 18 identifiers)
- Check for uniqueness (could students identify patient based on combination of rare features?)
- Document de-identification process

**4. If Obtaining Authorization**:
- Use HIPAA-compliant authorization form
- Explain: Purpose (teaching), what will be disclosed (case details, photos), who will see it (medical students), duration (single lecture or ongoing)
- Patient may refuse without affecting care

**5. Photographs/Videos**:
- Special sensitivity (full-face photos are identifier #17)
- Even if other identifiers removed, face photo makes individual identifiable
- Options: Blur face, obtain authorization, use simulated patients

**Implementation for De-identified Case**:
1. Select representative case (not rare/unusual)
2. Remove all identifiers per Safe Harbor checklist
3. Replace specific dates with relative time ("3 months after surgery")
4. Replace photos with illustrations/diagrams, or blur faces
5. Change non-material details to prevent identification (if patient was in car accident, say "motor vehicle accident" without specific details)
6. Review with privacy officer or second faculty member to verify de-identification
7. Present in lecture

---

### Scenario 4: Cloud-First Research Infrastructure

**Setting**: University adopts cloud-first policy, faculty moving research projects to AWS/Azure

**HIPAA Compliance Steps**:

**1. BAA Execution**:
- University Privacy/Security Office negotiates BAA with cloud vendor (AWS, Azure, GCP)
- BAA covers all faculty/staff uses of cloud for PHI
- Individual faculty don't need separate BAAs (covered under institutional BAA)

**2. Eligible Services**:
- Identify which cloud services are HIPAA-eligible (AWS: S3, EC2, RDS, etc.; Azure: Storage, VMs, SQL Database, etc.)
- Restrict use to eligible services (AWS Lambda may or may not be eligible depending on configuration)
- Publish list of approved services for faculty

**3. Configuration Templates**:
- IT provides templates for HIPAA-compliant configurations (encrypted storage, VPC, access controls)
- Faculty deploy from templates (reduces risk of misconfiguration)

**4. Training**:
- Require cloud security training before faculty get AWS/Azure accounts
- Cover: Encryption, access controls, avoiding public buckets, MFA

**5. Monitoring**:
- IT monitors for policy violations (public S3 buckets, unencrypted databases)
- Automated alerts for high-risk configurations

**Example - AWS Research Project**:
1. Faculty completes cloud security training
2. Faculty requests AWS account via IT portal
3. IT provisions account with pre-configured VPC, encryption policies, audit logging
4. Faculty uploads research data to S3 bucket (automatically encrypted)
5. Faculty launches EC2 instance from approved template (encrypted EBS volume, MFA required, audit logging enabled)
6. Faculty runs analysis on EC2
7. Faculty exports de-identified results
8. After project: Faculty deletes data from S3, terminates EC2 (IT verifies deletion)

---

## Section 10: Integration with OpenDataPlanner

### 10.1 L3 Tier (Sensitive Data)

**When L3 Tier Selected**:
- May involve identifiable research data
- May involve sensitive data not rising to PHI level (sensitive but not health-related, or not covered entity)
- HIPAA considerations appear if PHI involved

**Decision Tree in OpenDataPlanner**:
```
User selects L3 Tier:

Q: Does your data include health information?
→ Yes: Continue to Q2
→ No: L3 tier for other sensitive data (not HIPAA), skip HIPAA guidance

Q: Is the health information individually identifiable?
→ Yes: Continue to Q3
→ No: Aggregate/anonymous data, not PHI, skip HIPAA guidance

Q: Is the data held by or will be received from a HIPAA covered entity?
→ Yes: PHI → Full HIPAA compliance required → Link to HIPAA guidance
→ No: Identifiable health data but not PHI (Common Rule may apply, institutional policies), skip HIPAA

If PHI Involved:
→ Display: "Your data may be Protected Health Information (PHI) subject to HIPAA"
→ Provide links:
  - [HIPAA Quick Reference Guide](HIPAA-RESEARCH-QUICK-REFERENCE.md)
  - [De-identification Decision Tree](HIPAA-RESEARCH-QUICK-REFERENCE.md#de-identification-decision-tree)
  - [Talk to a Human] (IT Workbench, Privacy Officer contact)
```

**L3 DMP Text Generation**:
- If PHI involved: Include HIPAA compliance statement
- Mention de-identification approach (if applicable)
- Mention BAAs with vendors (if cloud storage)
- Describe safeguards (encryption, access controls, training)

---

### 10.2 L4 Tier (PHI/Highly Sensitive)

**When L4 Tier Selected**:
- PHI confirmed
- Highly sensitive data (genetic, HIV, substance abuse with Part 2 applicability)
- Full HIPAA compliance assumed

**OpenDataPlanner Guidance**:

**Required Elements Checklist**:
- [ ] IRB approval obtained (authorization or waiver)
- [ ] HIPAA training completed (all personnel)
- [ ] BAA executed (if using cloud/vendors)
- [ ] Encryption enabled (data at rest and in transit)
- [ ] Access controls configured (RBAC, MFA)
- [ ] Audit logging enabled
- [ ] Breach notification plan in place
- [ ] Data retention/destruction schedule defined

**DMP Generation for L4**:
```
Data Security and Privacy:

This research involves Protected Health Information (PHI) subject to HIPAA Privacy and Security Rules.

De-identification: [If applicable]
Data will be de-identified using the Safe Harbor method prior to analysis. All 18 identifiers listed in 45 C.F.R. § 164.514(b)(2) will be removed.

Authorization: [Choose one]
- Individual authorization will be obtained from all participants.
- An IRB waiver of authorization has been granted per 45 C.F.R. § 164.512(i).

Safeguards:
- Technical: Data encrypted at rest (AES-256) and in transit (TLS 1.3). Access controls via unique user IDs, multi-factor authentication. Audit logging enabled.
- Administrative: All personnel complete HIPAA training. Access limited to IRB-approved research team. Minimum necessary principle applied.
- Physical: Data stored on encrypted institutional servers in access-controlled data center. Workstations in locked offices.

Business Associate Agreements:
- [Cloud vendor]: BAA executed on [date]
- [Data coordinating center]: BAA executed on [date]

Breach Response:
In event of unauthorized disclosure, the institution will follow breach notification procedures per 45 C.F.R. § 164.404-414, including notification to affected individuals and HHS as required.

Data Retention:
Identifiable data will be retained for 7 years post-study completion per institutional policy, then securely destroyed (degaussing/shredding). De-identified datasets will be retained indefinitely for secondary research.
```

---

### 10.3 AI Guidance Integration

**From AI-GUIDANCE-EXPANSION.md**: Track 2 - Clinical & Healthcare AI

**HIPAA Components for AI Track**:

**Applet 1: HIPAA De-identification Decision Tree** (Interactive)
- Embedded in OpenDataPlanner AI Guidance section
- User answers questions about data needs (dates? geography? ages >89?)
- Decision tree recommends: Safe Harbor, Expert Determination, Limited Data Set, or Identifiable with Authorization
- Links to detailed guide sections

**Applet 2: IRB Amendment for AI Guide**
- If researcher wants to add AI/ML analysis to existing IRB protocol
- Guidance on: What to include in amendment, de-identification approaches, cloud BAA requirements, model deployment plans
- Link to HIPAA guidance on AI safeguards (§ 5.5)

**Applet 3: Clinical AI Validation Checklist**
- For AI models that will be deployed in clinical practice
- Includes HIPAA safeguards in deployment
- FDA medical device considerations (is model a device? is it exempt clinical decision support software?)
- Post-deployment monitoring (audit logs, retraining on new PHI)

**Content Integration**:
- AI Bias Assessment → Link to HIPAA de-identification (biased de-identification can exacerbate health disparities)
- Reproducibility Checkpoint → Link to HIPAA data retention (how long must data be retained for reproducibility vs. when must it be destroyed?)
- Documentation Guide → Link to HIPAA documentation requirements (BAAs, IRB approvals, de-identification documentation)

---

### 10.4 IT Workbench Support

**Piper's Use Case** (from IT-WORKBENCH-CONTROL-PANEL.md): IT staff responding to faculty support tickets

**HIPAA FAQs for IT Staff**:

**Q: Faculty wants to use Dropbox for research data. Can they?**
A: Consumer Dropbox is not HIPAA-compliant (no BAA). If data is PHI, faculty must use Dropbox Business with HIPAA BAA, or use institutional HIPAA-compliant file share. If data is de-identified (verified), consumer Dropbox is acceptable (but still recommend institutional tools for access controls).

**Q: Faculty laptop stolen with research data. What do I do?**
A:
1. Immediate: Remotely wipe laptop if capable (MDM)
2. Determine: Was disk encrypted? What data was on laptop (PHI vs. de-identified)?
3. If encrypted: Low risk (unreadable without password)
4. If unencrypted PHI: Breach risk assessment (4-factor test), notify Privacy Officer immediately
5. Documentation: Incident report (what, when, who, what data, encrypted?, who notified)

**Q: Faculty wants to share research data with external collaborator. How?**
A:
1. Verify: Is data PHI or de-identified?
2. If PHI: Requires BAA or DUA, IRB approval, authorized disclosure
3. If de-identified: Less restrictive, but still use secure file transfer (not unencrypted email)
4. Methods: Institutional secure file share (SFTP, Globus), encrypted email, or collaborate via secure research enclave (both parties access same server, data doesn't travel)

**Q: Faculty needs AWS account for research. What are requirements?**
A:
1. Cloud security training (required)
2. Determine: Will account be used for PHI?
3. If PHI: Verify institutional AWS BAA in place, provision account with HIPAA template (VPC, encryption, MFA, audit logging)
4. If not PHI: Standard research account (still secure, but less restrictive)
5. Monitor: IT monitors for policy violations (public buckets, unencrypted volumes)

---

## Appendices

### Appendix A: Regulatory Citations

**Primary HIPAA Regulations**:
- **45 C.F.R. Part 160**: General Administrative Requirements (definitions, preemption, compliance/investigations)
- **45 C.F.R. Part 164, Subpart E**: Privacy of Individually Identifiable Health Information (Privacy Rule)
- **45 C.F.R. Part 164, Subpart C**: Security Standards for Protection of Electronic Protected Health Information (Security Rule)
- **45 C.F.R. Part 164, Subpart D**: Notification in the Case of Breach of Unsecured Protected Health Information (Breach Notification Rule)

**Common Rule** (Human Subjects Research):
- **45 C.F.R. Part 46**: Protection of Human Subjects

**Other Federal Laws**:
- **42 C.F.R. Part 2**: Confidentiality of Substance Use Disorder Patient Records
- **FERPA** (20 U.S.C. § 1232g): Family Educational Rights and Privacy Act
- **GINA** (Pub. L. 110-233): Genetic Information Nondiscrimination Act

**Key Privacy Rule Citations**:
- **§ 160.103**: Definitions (PHI, covered entity, business associate, etc.)
- **§ 164.501**: Definitions (treatment, payment, operations, designated record set, etc.)
- **§ 164.502**: Uses and disclosures of PHI (general rules, minimum necessary)
- **§ 164.506**: Uses and disclosures for TPO
- **§ 164.508**: Uses and disclosures requiring authorization
- **§ 164.510**: Uses and disclosures requiring opportunity to agree/object
- **§ 164.512**: Uses and disclosures for which authorization or opportunity to agree/object not required (public health, research, oversight, judicial/administrative proceedings, law enforcement, etc.)
- **§ 164.514**: De-identification, limited data sets, minimum necessary
- **§ 164.520**: Notice of privacy practices
- **§ 164.522**: Individual rights (restrictions, confidential communications)
- **§ 164.524**: Individual right of access
- **§ 164.526**: Individual right to amendment
- **§ 164.528**: Accounting of disclosures
- **§ 164.530**: Administrative requirements (policies, training, sanctions, mitigation, complaints, documentation)

---

### Appendix B: Template Documents

**(See separate files in `/docs/hipaa/templates/` - note in document)**

**B.1 Business Associate Agreement Template**
**B.2 Data Use Agreement Template (Limited Data Set)**
**B.3 HIPAA Authorization Form Template**
**B.4 Notice of Privacy Practices - Research Addendum Template**

---

### Appendix C: Checklists

**C.1 Safe Harbor De-identification Checklist (18 Identifiers)**

- [ ] Names (full, last, first, middle, maiden, aliases)
- [ ] Geographic subdivisions smaller than state (street addresses, city, county, ZIP [except first 3 if >20K population])
- [ ] Dates directly related to individual (except year) - Birth, admission, discharge, death, service dates, etc.
  - [ ] Age >89 aggregated to "90+"
- [ ] Telephone numbers
- [ ] Fax numbers
- [ ] Email addresses
- [ ] Social Security numbers
- [ ] Medical record numbers
- [ ] Health plan beneficiary numbers
- [ ] Account numbers
- [ ] Certificate/license numbers
- [ ] Vehicle identifiers (license plates, VINs)
- [ ] Device identifiers and serial numbers
- [ ] Web URLs
- [ ] Internet Protocol (IP) addresses
- [ ] Biometric identifiers (fingerprints, voiceprints)
- [ ] Full-face photographs and comparable images
- [ ] Any other unique identifying number/characteristic/code

**Additional Check**:
- [ ] No actual knowledge that remaining information could be used alone or in combination to identify individual

---

**C.2 Limited Data Set Checklist (16 Identifiers to Remove)**

[Similar to C.1, but noting that dates, city, state, ZIP may be retained]

---

**C.3 Cloud Vendor HIPAA Compliance Checklist**

- [ ] Vendor offers BAA (HIPAA-eligible)
- [ ] BAA executed and signed
- [ ] Using only HIPAA-eligible services (checked against vendor's list)
- [ ] Encryption enabled:
  - [ ] At rest (server-side encryption)
  - [ ] In transit (TLS/HTTPS)
- [ ] Access controls configured:
  - [ ] Unique user IDs
  - [ ] MFA enabled for admin access
  - [ ] Role-based permissions
- [ ] Audit logging enabled (CloudTrail, Azure Monitor, Cloud Audit Logs)
- [ ] Backup enabled and encrypted
- [ ] Data deletion process defined (when and how)
- [ ] Incident response plan (vendor's SLA for breach notification)

---

### Appendix D: Glossary

**Accountabil

ity**: Mechanisms to ensure compliance and respond to violations

**Authorization**: Individual's specific permission for use/disclosure not otherwise permitted by Privacy Rule

**Business Associate (BA)**: Person/entity performing functions involving PHI access on behalf of covered entity

**Business Associate Agreement (BAA)**: Contract between covered entity and BA requiring safeguards

**Covered Entity**: Health plan, clearinghouse, or provider transmitting PHI electronically

**De-identification**: Removal of identifiers so information is no longer PHI

**Designated Record Set**: Medical records, billing records, other records used to make decisions about individual

**Limited Data Set**: PHI with 16 direct identifiers removed (dates, city, state, ZIP may be retained)

**Minimum Necessary**: Standard to limit uses/disclosures to amount reasonably necessary for purpose

**Protected Health Information (PHI)**: Individually identifiable health information held/transmitted by covered entity or BA

**Safe Harbor**: De-identification method removing 18 identifiers

**Treatment**: Provision, coordination, management of health care

---

### Appendix E: FAQ Compendium

**(Selected FAQs from 8 source PDFs, organized by topic)**

**Topic: Business Associates**
- Q: Is a HIO covered by HIPAA? A: Generally no, but HIO is usually BA of covered entities...
[Additional FAQs from source PDFs]

---

### Appendix F: Resources & References

**Regulatory**:
- HHS Office for Civil Rights: [https://www.hhs.gov/ocr](https://www.hhs.gov/ocr)
- Federal Register: [https://www.federalregister.gov](https://www.federalregister.gov)

**Educational**:
- NIH HIPAA Training: [https://privacyruleandresearch.nih.gov](https://privacyruleandresearch.nih.gov)
- CITI Program: [https://about.citiprogram.org](https://about.citiprogram.org)

**Tools**:
- De-identification Software: ARX Data Anonymization Tool, Microsoft Presidio
- Cloud HIPAA Guides: AWS HIPAA Compliance, Azure HIPAA Compliance, Google Cloud HIPAA Compliance

---

## Conclusion

This detailed technical guide provides comprehensive coverage of HIPAA Privacy Rule requirements for research data management in the modern cloud-first, AI-driven environment. For faculty spanning instructional and clinical settings, the key takeaways are:

1. **Understand PHI**: Know when data is protected health information subject to HIPAA
2. **De-identify When Possible**: Use Safe Harbor or Expert Determination to enable broader data use
3. **Cloud Requires BAAs**: Any cloud service storing/processing PHI needs business associate agreement
4. **Safeguards are Essential**: Administrative, technical, and physical safeguards protect privacy
5. **Training Matters**: All personnel must understand HIPAA requirements for their roles
6. **Document Everything**: Authorizations, waivers, BAAs, de-identification methods, breach responses

For additional guidance, consult:
- [HIPAA Research Quick Reference Guide](HIPAA-RESEARCH-QUICK-REFERENCE.md) for rapid answers
- [HIPAA Documentation Index](README.md) for navigation
- [AI Guidance Integration](../AI-GUIDANCE-EXPANSION.md) for AI-specific considerations
- Your institutional Privacy Officer and IRB for specific questions

---

**For Quick Answers**: See [HIPAA Research Quick Reference Guide](HIPAA-RESEARCH-QUICK-REFERENCE.md)

**For Navigation**: See [HIPAA Documentation Index](README.md)

**For OpenDataPlanner Integration**: See Section 10 or [AI Guidance Expansion](../AI-GUIDANCE-EXPANSION.md)
