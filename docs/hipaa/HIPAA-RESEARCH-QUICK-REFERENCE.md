# HIPAA Research Quick Reference Guide

*For Educational Content Development*

---

**Version:** 1.0
**Last Updated:** 2026-02-13
**Companion:** [HIPAA Research Detailed Technical Guide](HIPAA-RESEARCH-DETAILED-GUIDE.md)

---

## How to Use This Guide

**Purpose**: Rapid answers for faculty developing educational materials and conducting research in cloud-first, AI-driven environments

**When to use this guide**:
- Need a quick answer to "Does HIPAA apply to this?"
- Looking for actionable checklists
- Want a brief scenario example
- Making rapid decisions during research planning

**When to use the Detailed Guide**:
- Need regulatory citations and legal grounding
- Developing educational materials requiring precision
- Addressing complex/non-routine situations
- Need comprehensive FAQ coverage

**Connection to OpenDataPlanner**:
- **L3 Tier (Sensitive Data)**: HIPAA may apply → See Essential Concepts below
- **L4 Tier (PHI/Highly Sensitive)**: HIPAA applies → See Section 2 (De-identification) and all principles
- **AI Guidance Track 2** (Clinical): Integration with HIPAA de-identification decision trees

---

## Part 1: Essential Concepts

### What is PHI?

**Quick Definition**: Protected Health Information = Individually identifiable health information held by covered entity or business associate

**Is it PHI? 3-Part Test**:
1. **Relates to health** (condition, care, or payment) ✓
2. **Identifies individual** (or reasonable basis to believe it could) ✓
3. **Held by covered entity or business associate** ✓

**Examples**:
- ✅ EHR data with patient ID from university hospital → PHI
- ✅ De-identified research dataset → NOT PHI
- ✅ Health survey data from non-covered entity researcher → NOT PHI (but may be human subjects data)
- ✅ Genomic data linked to medical record → PHI

**Connection to L3/L4 Tiers**:
- **L3**: May or may not be PHI (decision tree determines)
- **L4**: Confirmed PHI, full HIPAA compliance required

---

### Multi-Regulatory Landscape

**CRITICAL**: HIPAA is **not the only** regulation for healthcare AI and research

**Multiple Frameworks May Apply Simultaneously**:
- **HIPAA** → Data privacy & security (PHI)
- **FDA** → Medical device safety & effectiveness
- **Common Rule** → Human subjects research protections

**Example**: AI diagnostic tool
- **FDA**: May be a medical device (needs 510(k) clearance if not exempt CDS)
- **HIPAA**: Training data uses PHI (needs de-identification or IRB waiver)
- **Common Rule**: Training/validation are human subjects research (needs IRB approval)

**→ All three apply independently - must comply with each**

**Quick Decision - FDA**:

Does your AI tool **diagnose, treat, or prevent disease** in clinical practice?
- NO → Not a medical device (research tools, educational tools = no FDA)
- YES → Is it **Clinical Decision Support** (CDS) that enables **independent clinician review**?
  - YES → Exempt from FDA (no regulation)
  - NO → Medical device (FDA 510(k) likely required)

**Red Flag**: Analyzing medical images (X-ray, MRI, pathology) → Almost always an FDA-regulated device (no CDS exemption)

See Detailed Guide § 1.5 for comprehensive FDA guidance

---

### De-identification at a Glance

**Why De-identify**: De-identified data is **not PHI** → No HIPAA restrictions, can share openly

**Three Methods**:

#### Method 1: Safe Harbor (Most Common)

**Remove 18 identifiers**:
1. Names
2. Geographic < state (addresses, city, county, ZIP*)
3. Dates (except year), age >89 → "90+"
4. Phone, fax, email
5. SSN, MRN, insurance ID, account numbers, license numbers
6. Vehicle IDs, device IDs
7. URLs, IP addresses
8. Biometrics, full-face photos
9. Any unique identifier

*Exception: May retain first 3 ZIP digits if area >20,000 population

**+ No actual knowledge of residual re-identification risk**

**✓ Result**: De-identified (not PHI)

See Detailed Guide § 2.2

---

#### Method 2: Expert Determination

**When to Use**: Need dates/ZIP codes/ages >89 beyond Safe Harbor

**Requirements**:
- Qualified expert applies statistical methods (k-anonymity, uniqueness analysis)
- Expert determines re-identification risk is "very small"
- Expert documents methods and results

**✓ Result**: De-identified (not PHI)

See Detailed Guide § 2.3

---

#### Method 3: Limited Data Set

**What It Is**: PHI with 16 identifiers removed (dates, city, state, ZIP **may be retained**)

**Requirements**:
- Execute Data Use Agreement (DUA) with recipient
- DUA prohibits re-identification, requires safeguards

**⚠ Result**: Still PHI (but no authorization required if DUA in place)

See Detailed Guide § 2.4

---

### Business Associate Agreements (BAAs)

**When Required (3-Sentence Rule)**:
1. Entity accesses/uses/discloses PHI
2. Entity performs function/service on behalf of covered entity
3. → BAA required

**Common Research Business Associates**:
- Cloud storage provider (AWS, Azure, GCP)
- Cloud AI/ML platform
- Data coordinating center
- Health Information Exchange (HIE)
- Transcription service

**WHO SIGNS BAAs**:
- **Institutional officials** (Privacy Office, Legal, Contracts - varies by institution)
- **NOT individual faculty/researchers** (you cannot sign BAAs on behalf of your institution)
- **Action for faculty**: Check with Privacy Office or IT whether institutional BAA exists with vendor. If not, request institutional BAA be executed.

**Key BAA Terms**:
- Permitted uses/disclosures
- Safeguards required
- Breach reporting
- Subcontractor requirements
- Data deletion at termination

**Red Flags** (no BAA available = can't use for PHI):
- Consumer cloud services (personal Dropbox, Google Drive, iCloud)
- Social media platforms
- Free AI tools without BAA (ChatGPT, free Colab, etc.)

See Detailed Guide § 1.2

---

## Part 2: The 6 Privacy Principles

### 1. Individual Choice

**Quick Rule**: Patients must have meaningful control over their PHI

**Research Checklist**:
- [ ] Authorization obtained (if required) with all 8 core elements
- [ ] Psychotherapy notes? → Separate authorization required (no waiver)
- [ ] Minors? → Verify who is personal representative (parent vs. emancipated minor)
- [ ] IRB waiver of authorization? → Meets 3 criteria (minimal risk, impracticable, adequate safeguards)

**Common Research Scenario**:

**Q**: I want to use hospital EHR data for retrospective chart review. Do I need patient authorization?

**A**: Not necessarily. Options:
1. **De-identify data** → No authorization needed (not PHI)
2. **IRB waiver** → If meets criteria (minimal privacy risk, impracticable to obtain consent from thousands of patients, adequate safeguards)
3. **Individual authorization** → If waiver not granted (contact each patient, obtain signed authorization)

**Cross-ref**: Detailed Guide § 3 (Individual Choice & Consent)

---

### 2. Collection, Use & Disclosure Limitation

**Quick Rule**: Use only minimum necessary PHI for stated purpose

**Research Checklist**:
- [ ] De-identification considered first (can research question be answered with de-identified data?)
- [ ] Minimum necessary data elements identified (don't request full record if only need diagnoses)
- [ ] Time period limited (don't request 10 years if only need 2 years)
- [ ] Population limited (don't include pediatric patients if studying adults)

**Common Research Scenario**:

**Q**: I'm building AI model to predict readmission. Do I need all EHR data?

**A**: Apply minimum necessary:
- **Need**: Diagnoses, procedures, vital signs, lab results, prior admissions, demographics (for model features)
- **DON'T need**: Insurance info, billing details, social work notes (unless validated as predictive)
- **Minimize**: Request specific data elements, not "all EHR data"

**Exception**: Minimum necessary does NOT apply to disclosures for **treatment**. If you're providing treatment as part of clinical trial, can receive full records.

**Cross-ref**: Detailed Guide § 4 (Collection, Use & Disclosure Limitation)

---

### 3. Safeguards

**Quick Rule**: Administrative + Technical + Physical = Protection

**Research Checklist**:
- [ ] **Administrative**: HIPAA training completed, access controls defined, sanctions policy in place
- [ ] **Technical**: Encryption (at rest + in transit), MFA, audit logs, unique user IDs
- [ ] **Physical**: Locked office, privacy screens, clean desk policy, secure disposal

**Minimum Safeguards Table**:

| Context | Administrative | Technical | Physical |
|---------|----------------|-----------|----------|
| **Solo Faculty Researcher** | Training, policies | Encrypted laptop, strong password, VPN | Locked office |
| **Multi-Site Study** | + BAAs, + role-based access | + MFA, + audit logs, + secure file transfer | + Visitor logs, + badge access |
| **Cloud AI Pipeline** | + Cloud security training, + vendor management | + Cloud encryption, + API security, + data deletion schedule | + Data center (cloud vendor responsibility) |

**Common Research Scenario**:

**Q**: I'm analyzing PHI on my laptop while traveling. What safeguards do I need?

**A**:
- **Laptop**: Full-disk encryption (BitLocker/FileVault) **required**
- **Network**: Use VPN when on public Wi-Fi
- **Physical**: Don't leave laptop unattended (airports, coffee shops, cars)
- **Screen**: Privacy screen to prevent shoulder surfing
- **Better**: Access PHI via VPN to institutional server (don't store PHI locally on laptop)

**Cross-ref**: Detailed Guide § 5 (Safeguards)

---

### 4. Accountability

**Quick Rule**: Document, train, enforce, mitigate

**Research Checklist**:
- [ ] All research personnel HIPAA-trained
- [ ] Sanctions policy exists and is applied for violations
- [ ] Audit logs reviewed regularly
- [ ] Breach response plan in place (know what to do if laptop stolen)

**Common Research Scenario**:

**Q**: Student researcher accidentally emailed unencrypted dataset to wrong collaborator. What do I do?

**A**: Immediate mitigation:
1. **Recall**: Try to recall email (if same email system)
2. **Contact recipient**: Ask wrong recipient to delete without opening, confirm deletion
3. **Notify**: Inform Privacy Officer immediately
4. **Assess**: Was data PHI or de-identified? How many patients? What identifiers?
5. **Breach determination**: Privacy Officer applies 4-factor test
6. **Sanctions**: Student receives training on secure file transfer, written warning
7. **Prevention**: Update training to emphasize: Always verify recipient before sending PHI

**Cross-ref**: Detailed Guide § 6 (Accountability)

---

### 5. Correction

**Quick Rule**: Individuals can amend PHI or document disputes (60-day response timeline)

**Research Checklist**:
- [ ] Amendment process defined (who receives requests, how to respond)
- [ ] 60-day response timeline (+ 30-day extension if needed)
- [ ] If amendment accepted: Notify others who have the data
- [ ] If amendment denied: Allow individual to submit statement of disagreement

**Common Research Scenario**:

**Q**: Research participant requests correction to diagnosis in clinical trial records. Do I have to correct it?

**A**:
- **If trial data is in designated record set** (used for treatment decisions): Must respond to amendment request within 60 days
- **Options**:
  - **Accept**: Correct record, notify others (IRB, sponsor, data coordinating center)
  - **Deny**: If record is accurate (entity's determination), provide written denial with rationale
- **If trial data is NOT in designated record set** (observational study, no treatment): Amendment right may not apply (but still good practice to allow corrections for data integrity)

**Electronic Advantage**: HIE facilitates notification to all who received amended data

**Cross-ref**: Detailed Guide § 7 (Correction)

---

### 6. Openness & Transparency

**Quick Rule**: Notice of Privacy Practices (NPP) discloses uses/rights

**Research Checklist**:
- [ ] Covered entity provides NPP to patients (not researcher's responsibility)
- [ ] If teaching hospital: NPP mentions trainees may be involved in care
- [ ] If research hospital: NPP mentions PHI may be used for research
- [ ] If uses HIE: NPP mentions health information exchange participation

**Common Research Scenario**:

**Q**: I'm faculty at teaching hospital conducting research. Do I need to provide Notice of Privacy Practices?

**A**:
- **Hospital provides NPP** (not individual faculty)
- **NPP should mention**: "We are a teaching hospital. Medical students and residents may be involved in your care. We conduct research. Your information may be used in de-identified form for research."
- **Research authorization** is separate from NPP: When you enroll patient in study, provide specific authorization form for that study

**Cross-ref**: Detailed Guide § 8 (Openness & Transparency)

---

## Part 3: Research Data Workflows

### Workflow 1: Accessing EHR Data for Research

```
[Research Question]
         ↓
Can de-identified data answer question?
├─ YES → De-identify (Safe Harbor or Expert Determination)
│        ↓
│        Use de-identified data (no authorization needed)
│        ↓
│        END
│
└─ NO → Need identifiable data
         ↓
         IRB waiver of authorization feasible?
         ├─ YES → Obtain IRB waiver
         │        Provide representations to covered entity
         │        Covered entity discloses per waiver
         │        ↓
         │        END
         │
         └─ NO → Obtain individual authorizations
                  Contact patients, obtain signed forms
                  Covered entity discloses per authorizations
                  ↓
                  END
```

---

### Workflow 2: Using AI/ML with PHI

```
[AI/ML Research Project]
         ↓
Where will model be trained?
├─ Cloud Platform (AWS, Azure, GCP)
│  ├─ Is platform HIPAA-eligible?
│  │  ├─ YES → Execute BAA
│  │  │        Configure encryption, access controls
│  │  │        ↓
│  │  │        Training data PHI or de-identified?
│  │  │        ├─ De-identified → No authorization needed
│  │  │        └─ PHI → Authorization or IRB waiver
│  │  │        ↓
│  │  │        Train model with safeguards
│  │  │        ↓
│  │  │        Delete data per schedule
│  │  │        ↓
│  │  │        END
│  │  │
│  │  └─ NO → STOP (cannot use non-HIPAA-compliant cloud for PHI)
│  │           De-identify data first, or use different platform
│  │
└─ On-Premise (Institutional Servers)
   ├─ No BAA needed
   ├─ Apply safeguards (encryption, access controls, audit logs)
   ├─ Training data PHI or de-identified?
   │  ├─ De-identified → No authorization needed
   │  └─ PHI → Authorization or IRB waiver
   ├─ Train model
   └─ END
```

**FDA Note**: If model will be used for clinical decision support → Assess whether it's a medical device requiring FDA clearance

---

### Workflow 3: Multi-Site Collaboration

```
[Multi-Site Study - 3 Hospitals + Coordinating Center]
         ↓
Each Hospital = Covered Entity
Coordinating Center = Business Associate of each
         ↓
BAA Structure?
├─ Single Multi-Party BAA (efficient)
│  └─ All 3 hospitals + coordinator sign one agreement
│
└─ Individual BAAs
   └─ Hospital A-Coordinator, Hospital B-Coordinator, Hospital C-Coordinator (3 BAAs)
         ↓
Data Sharing Approach?
├─ De-identified → Each hospital de-identifies, sends to coordinator (no authorization)
├─ Limited Data Set → Each hospital removes 16 identifiers, executes DUA with coordinator
└─ Identified PHI → Each hospital obtains IRB waiver, sends PHI to coordinator per BAA
         ↓
Coordinator aggregates data, analyzes, returns results to hospitals
         ↓
Publication (suppress cells <11)
         ↓
END
```

---

## Part 4: Connection to OpenDataPlanner

### L3 Tier (Sensitive Data) - HIPAA Considerations

**When L3 Selected**: OpenDataPlanner asks: "Is this health information from a covered entity?"

**If YES → PHI**: Follow HIPAA guidance
- Review de-identification decision tree (below)
- Consider BAAs for cloud vendors
- Include HIPAA compliance in DMP

**If NO → Not PHI**: Institutional policies may still apply, but HIPAA does not

---

### L4 Tier (PHI/Highly Sensitive) - Full HIPAA Compliance

**When L4 Selected**: Full HIPAA safeguards required

**OpenDataPlanner Generates DMP Content**:
- De-identification method (if applicable)
- Authorization or waiver status
- BAAs with vendors
- Safeguards (administrative, technical, physical)
- Breach notification plan
- Data retention/destruction schedule

**Pre-Submission Checklist**:
- [ ] IRB approval obtained
- [ ] HIPAA training completed (all personnel)
- [ ] BAAs executed (all cloud vendors, collaborators)
- [ ] Encryption enabled
- [ ] Access controls configured
- [ ] Audit logging enabled
- [ ] Breach response plan documented

---

### AI Guidance Integration (Track 2: Clinical & Healthcare AI)

**From AI-GUIDANCE-EXPANSION.md**:

**Applet: HIPAA De-identification Decision Tree** (Interactive)
- Embedded in AI Guidance section
- Guides faculty through de-identification choices based on research needs

**Applet: IRB Amendment for AI**
- Adding AI/ML analysis to existing study
- Links to HIPAA guidance on cloud BAAs, safeguards

**Applet: Clinical AI Validation**
- Deploying AI model in clinical practice
- HIPAA safeguards for deployment
- FDA medical device considerations

---

## Part 5: Multi-Regulatory Quick Reference & Red Flags

### Which Regulations Apply to My Project?

**Quick Assessment Table**:

| Your Project | FDA | HIPAA | Common Rule | Key Actions |
|--------------|-----|-------|-------------|-------------|
| **Research AI (not clinical use)** | ✗ | ✓ (if PHI) | ✓ (if human subjects) | IRB approval, de-identify or waiver |
| **Exempt CDS** (guideline reminder, drug checker) | ✗ (exempt) | ✓ (if PHI) | ✗ (clinical use) | HIPAA safeguards only |
| **AI Medical Device** (diagnostic tool, image analysis) | **✓** | ✓ (if PHI) | ✓ (if validation research) | FDA 510(k) + HIPAA + IRB |
| **Teaching tool** (AI tutor, case generator) | ✗ | ✓ (if uses PHI) | ✗ (educational) | De-identify patient data |
| **Multi-site study** (retrospective) | ✗ | ✓ | ✓ | IRB waiver, BAAs, de-identify preferred |

**Key Insight**: You may need to comply with **multiple regulations simultaneously**

---

### Red Flags: HIPAA

**Stop and Get HIPAA Help When**:
- Psychotherapy notes involved (special authorization required, no waiver allowed)
- Genetic information for purposes beyond research (GINA implications)
- Minors' health information (determine who is personal representative)
- Substance abuse treatment records (42 CFR Part 2 may apply - more stringent than HIPAA)
- Multi-state data exchange (state law preemption analysis needed)
- HIV/AIDS data (many states have stricter laws)
- Using consumer cloud services for PHI (Dropbox, personal Google Drive - not HIPAA-compliant)

---

### Red Flags: FDA

**Stop and Get FDA Help When**:
- AI tool will diagnose disease in clinical practice (likely a medical device)
- Analyzing medical images (X-ray, MRI, CT, retinal photos, pathology slides) for clinical use (almost always a device)
- No clear predicate device exists (may need De Novo)
- High-risk application (autonomous decisions, life-threatening conditions)
- Transitioning research tool to clinical use (regulatory status may change)

**FDA Pre-Submission Program**: Free consultation with FDA before development → **Use it!**

---

### Quick Wins: HIPAA

**✓ De-identify whenever possible**
- Safe Harbor checklist (Appendix A) is straightforward
- De-identified data = no HIPAA restrictions
- Also simplifies FDA compliance (no PHI = no HIPAA requirements for FDA submission)

**✓ Use institutional BAAs**
- Most universities have enterprise BAAs with AWS, Azure, Microsoft 365
- Check with IT before signing your own

**✓ Encrypt everything**
- Full-disk encryption on laptops (BitLocker, FileVault)
- HTTPS for web applications
- Encrypted email or secure file transfer for PHI
- Cloud encryption (AWS KMS, Azure Key Vault)

**✓ Default to IRB waiver** for retrospective studies
- Chart reviews typically meet waiver criteria
- Faster than obtaining individual authorizations

**✓ Use limited data sets** when you need dates/geography
- Easier than Expert Determination
- DUA simpler than full BAA

**✓ Leverage HIE** for multi-site studies
- HIE as common business associate
- Facilitates data sharing with BAA in place

---

### Quick Wins: FDA

**✓ Design for CDS exemption** (if possible)
- Enable clinician independent review (show data, explain logic, display recommendations transparently)
- Avoid "black box" AI → More likely to be exempt

**✓ Use FDA Pre-Submission** (free consultation)
- Get FDA feedback before investing in development/validation
- Clarify regulatory pathway early

**✓ Identify predicate devices** early
- Search FDA database for similar AI tools (1,250+ approved AI devices)
- Predicate → 510(k) pathway (faster than De Novo)

**✓ Consider PCCP** (Predetermined Change Control Plan)
- Include in initial 510(k) submission
- Enables model updates without new submissions
- Critical for AI (models need retraining to address drift)

**✓ Document from start**
- Even if research tool (not device), document training data, performance, validation
- If later transition to clinical → Documentation ready for FDA

---

### Quick Wins: Multi-Regulatory

**✓ Engage experts early**:
- Privacy Officer (HIPAA)
- Regulatory affairs (FDA)
- IRB (Common Rule)
- **Don't assume** you only need one

**✓ Use de-identified data** for research/training
- Simplifies HIPAA (no authorization needed)
- Simplifies FDA (no PHI concerns in training data)
- May still need IRB (human subjects determination)

**✓ Transition planning**:
- If research tool may become clinical → Plan for FDA from start
- Document everything (saves time/cost during FDA submission)

---

## Appendices

### Appendix A: Safe Harbor Checklist (18 Identifiers)

**Before sharing/using data, verify all removed**:

- [ ] 1. Names
- [ ] 2. Address, city, county, ZIP (except first 3 if >20K)
- [ ] 3. Dates (→ year only), ages >89 (→ "90+")
- [ ] 4. Phone
- [ ] 5. Fax
- [ ] 6. Email
- [ ] 7. SSN
- [ ] 8. MRN
- [ ] 9. Insurance ID
- [ ] 10. Account numbers
- [ ] 11. License numbers
- [ ] 12. Vehicle IDs
- [ ] 13. Device IDs
- [ ] 14. URLs
- [ ] 15. IP addresses
- [ ] 16. Biometric identifiers
- [ ] 17. Full-face photos
- [ ] 18. Any unique identifier
- [ ] No actual knowledge of residual risk

---

### Appendix B: Limited Data Set Checklist (16 Identifiers to Remove)

**Same as Safe Harbor EXCEPT** dates, city, state, ZIP **may be retained**:

[Checkboxes for all 16, noting date/geography retention]

---

### Appendix C: BAA Essentials

**IMPORTANT**: Faculty cannot sign BAAs on behalf of the institution. Only authorized institutional officials (Privacy Office, Legal, Contracts) can execute BAAs.

**Faculty Action - Before Using Cloud Vendor for PHI**:
1. **Check**: Does institutional BAA exist with vendor?
   - Contact Privacy Office or IT: "Do we have a BAA with AWS/Azure/[Vendor]?"
2. **If YES**: Proceed with vendor (follow institutional procedures)
3. **If NO**: Request Privacy Office to evaluate vendor and execute institutional BAA
   - **Timing**: May take weeks to months → **Plan ahead**
4. **Verify**:
   - [ ] Institutional BAA executed and signed
   - [ ] Using only HIPAA-eligible services (check vendor's list)
   - [ ] Encryption enabled (at rest and in transit)
   - [ ] Access controls configured (MFA, unique user IDs)
   - [ ] Audit logging enabled
   - [ ] Data deletion plan defined per institutional policy

**Common HIPAA-Eligible Cloud Services** (institutional BAA required):
- **AWS**: S3, EC2, RDS, SageMaker (with HIPAA configuration)
- **Azure**: Storage, VMs, SQL Database, Machine Learning
- **Google Cloud**: Cloud Storage, Compute Engine, BigQuery

**Not HIPAA-Eligible** (cannot use for PHI, even with attempt to sign BAA):
- Consumer Dropbox, Google Drive, iCloud
- Free AI tools without BAA (ChatGPT, free Colab notebooks)
- Social media platforms

---

### Appendix D: Quick Scenarios

**Scenario: Faculty wants to use patient X-ray in lecture**
- **De-identify**: Remove patient name/ID from image, blur face if visible → OK to use
- **Or get authorization**: Contact patient, obtain permission → OK to use
- **Don't**: Project identified X-ray without permission (HIPAA violation)

**Scenario: Sharing research data with external collaborator**
- **Is data de-identified?** → Yes: Share via secure file transfer (SFTP, encrypted email)
- **Is data PHI?** → Need: IRB approval, BAA or DUA with collaborator's institution, secure transfer

**Scenario: Storing research data in cloud**
- **Is data de-identified?** → Can use any cloud (but institutional cloud preferred for access controls)
- **Is data PHI?** → Must use HIPAA-eligible cloud with BAA (AWS/Azure/GCP with institutional BAA)

**Scenario: Faculty laptop stolen**
- **Report immediately**: IT help desk, Privacy Officer
- **Was disk encrypted?** → Yes: Low risk (data unreadable) → Likely not a breach
- **Was disk unencrypted?** → Breach risk assessment (what PHI, how many patients?) → May require breach notification

---

### Appendix E: Glossary (Key Terms)

**HIPAA Terms**:
- **Business Associate (BA)**: Entity performing functions for covered entity, requiring PHI access
- **BAA**: Business Associate Agreement (contract requiring safeguards)
- **Covered Entity**: Health plan, clearinghouse, or provider transmitting PHI electronically
- **De-identification**: Removing identifiers so data is no longer PHI
- **DUA**: Data Use Agreement (for limited data set)
- **Limited Data Set**: PHI with 16 identifiers removed (dates/geography may be retained)
- **Minimum Necessary**: Using only amount of PHI needed for purpose
- **PHI**: Protected Health Information (individually identifiable health info from covered entity)
- **Safe Harbor**: De-identification method (18 identifiers removed)
- **Treatment**: Provision/coordination of health care (minimum necessary doesn't apply to treatment disclosures)

**FDA Terms**:
- **Medical Device**: Instrument/software intended for diagnosis, treatment, prevention, or mitigation of disease
- **SaMD**: Software as a Medical Device (software performing medical functions without hardware)
- **CDS**: Clinical Decision Support software (may be exempt from FDA regulation if meets 4 criteria)
- **510(k)**: Premarket Notification pathway (demonstrate substantial equivalence to predicate device)
- **De Novo**: Classification pathway for novel low-to-moderate risk devices (no predicate)
- **PCCP**: Predetermined Change Control Plan (allows AI model updates without new FDA submissions)
- **Predicate Device**: Legally marketed device to which new device is compared for 510(k)

**Common Rule Terms**:
- **IRB**: Institutional Review Board (reviews human subjects research)
- **Waiver of Consent**: IRB determination that informed consent requirement can be waived (minimal risk, impracticable to obtain consent)
- **Human Subjects Research**: Systematic investigation designed to develop/contribute to generalizable knowledge, involving living individuals

---

### Appendix F: When to Use Which Guide

**Use Quick Reference**:
- During active research planning (need quick answers)
- Creating research protocols (know what HIPAA requirements to include)
- Training research team (overview of key concepts)
- Responding to IRB questions (quick lookups)
- Teaching HIPAA basics to students

**Use Detailed Guide**:
- Developing educational materials (need accuracy and regulatory grounding)
- Addressing complex situations (multi-state study, rare diseases, special populations)
- Writing institutional policies (need comprehensive coverage)
- Preparing for audits (need to cite regulations)
- Deep dive into specific topics (Expert Determination methods, state law preemption, etc.)

**Use Both**:
- Quick Reference for initial assessment → Detailed Guide for deeper understanding when needed
- Quick Reference provides cross-references to Detailed Guide sections

---

## Quick Decision: Does HIPAA Apply to My Research?

**START**: Does your research use health information?
  → NO: HIPAA doesn't apply (but other protections may - Common Rule for human subjects, FERPA for student data, etc.)
  → YES: Continue

**Q1**: Is the health information **individually identifiable**?
  → NO: Aggregate/anonymous data → HIPAA doesn't apply
  → YES: Continue

**Q2**: Is the information held/received from a **HIPAA covered entity** (hospital, clinic, health plan) or **business associate**?
  → NO: HIPAA doesn't apply (but may be human subjects research under Common Rule)
  → YES: **HIPAA APPLIES** (it's PHI)

**If HIPAA Applies** → Use this Quick Reference + Detailed Guide as needed

---

## Summary: Faculty Takeaways for Cloud-First, AI-Driven Research

### Multi-Regulatory Compliance

**THE MOST IMPORTANT TAKEAWAY**: Healthcare research and AI tools are subject to **multiple overlapping regulations** - you need to comply with ALL that apply.

**Assessment Table**:

| Tool Type | FDA? | HIPAA? | Common Rule? | Where to Get Help |
|-----------|------|--------|--------------|-------------------|
| **Research-only AI** | No | Yes (if PHI) | Yes (if human subjects) | IRB, Privacy Officer |
| **Clinical AI tool** | **Maybe** | Yes (if PHI) | Yes (if validation research) | **Regulatory Affairs, FDA, Privacy Officer, IRB** |
| **Teaching with patient cases** | No | Yes (if PHI) | No | Privacy Officer |
| **De-identified data** | No | No | Depends | IRB |

---

### HIPAA Takeaways

**1. Know When HIPAA Applies**:
- Health information from covered entity (hospital, clinic) + identifiable = PHI
- Survey data you collect yourself (not from covered entity) ≠ PHI

**2. De-identify When Possible**:
- Safe Harbor (18 identifiers) is straightforward
- Enables cloud use without BAA restrictions
- Enables open data sharing
- **Also simplifies FDA** (no PHI = no HIPAA concerns in FDA submission)

**3. Cloud Requires BAAs**:
- AWS, Azure, GCP: Need institutional BAA, use eligible services, configure encryption
- Consumer cloud (Dropbox, Google Drive): Not HIPAA-compliant for PHI
- Free AI tools: Not HIPAA-compliant (ChatGPT, free Colab)

**4. Train Your Team**:
- All research personnel need HIPAA training (before accessing PHI)
- Annual refresher
- Document training completion

**5. Safeguard Everything**:
- Encrypt laptops (full-disk), use VPN, don't email PHI unencrypted
- Lock offices, use privacy screens, shred paper with PHI
- Audit logs for databases with PHI

**6. Teaching with PHI**:
- De-identify patient cases for lectures
- Or obtain authorization for identified cases
- Don't project EHR screens with names/MRNs in large lectures

---

### FDA Takeaways

**1. Assess Early**: Before investing months in development, determine if your AI tool is an FDA-regulated medical device

**2. CDS Exemption is Powerful**:
- Design tool to enable **independent clinician review** (show data, explain logic)
- Avoids FDA regulation (saves 6-12 months, $50K-$150K)

**3. Medical Images = Device**:
- Analyzing X-rays, MRIs, CT scans, pathology slides for clinical use → Almost always an FDA-regulated device
- No CDS exemption for image analysis

**4. Research vs. Clinical Use**:
- Research tools (not for clinical decisions) → Not FDA-regulated
- Transition to clinical use → FDA regulation may begin to apply

**5. Use FDA Pre-Submission Program**:
- Free consultation before development
- Get FDA feedback on regulatory pathway, performance testing requirements

**6. Timeline & Cost**:
- FDA 510(k): 6-12 months, $50K-$150K
- Plan accordingly (don't promise deployment in 3 months if need FDA clearance)

---

### When to Get Help

**HIPAA**:
- Privacy Officer: Compliance questions, BAAs, waivers
- IRB: Authorization/waiver for research

**FDA**:
- Regulatory Affairs Office: Device classification, 510(k) strategy
- FDA Pre-Submission Program: Free FDA consultation
- Medical device consultants: 510(k) preparation, testing

**Common Rule**:
- IRB: Human subjects determination, protocol review

**Multi-Regulatory**:
- Institutional Counsel: Complex compliance strategies
- OpenDataPlanner [Talk to a Human](../TALK-TO-HUMAN.md): Data tier selection, infrastructure planning

---

**Next Steps**:
1. Review this Quick Reference for rapid decision-making
2. Consult [Detailed Guide](HIPAA-RESEARCH-DETAILED-GUIDE.md) for comprehensive coverage
3. Contact Privacy Officer for institution-specific questions
4. Use [OpenDataPlanner](../../README.md) for data management planning

---

**For Comprehensive Details**: See [HIPAA Research Detailed Technical Guide](HIPAA-RESEARCH-DETAILED-GUIDE.md)

**For Navigation**: See [HIPAA Documentation Index](README.md)
