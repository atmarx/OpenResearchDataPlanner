# Tier Questionnaire: "Help Me Pick My Tier"

This document describes the interactive questionnaire that helps researchers determine the appropriate data classification tier (Low, Medium, High) for their project.

---

## The Problem

From UX testing:

> **Dr. Marge Tonsley:** "I don't know what PHI is... I don't know what any of those acronyms mean."

> **Dr. Lin Vosker:** "What's the difference between L3 and L4? What happens if I pick the wrong one?"

Researchers struggle with tier selection because:
1. They don't know compliance terminology (PHI, FERPA, CUI, ITAR)
2. They're unsure what "counts" as sensitive
3. They fear picking wrong and either overpaying or violating policy
4. The consequences of each tier aren't clear

---

## The Solution

A decision-tree questionnaire that:
1. Asks plain-language questions about their data
2. Explains implications as they go
3. Recommends a tier with justification
4. Allows override with acknowledgment

---

## Questionnaire Flow

### Entry Point

When user reaches the tier selection step:

```
┌─────────────────────────────────────────────────────────────────┐
│  What type of data will you be working with?                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟢 Low - Public/Non-Sensitive                           │   │
│  │    Published datasets, public records, non-sensitive     │   │
│  │    research data                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟡 Medium - Internal/Pre-Publication                    │   │
│  │    Unpublished research, proprietary methods,           │   │
│  │    non-regulated internal data                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔴 High - Regulated/Protected                           │   │
│  │    Patient data, student records, export-controlled,    │   │
│  │    legally protected information                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Not sure? [Help me decide →]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Questionnaire Modal

When "Help me decide" is clicked:

```
┌─────────────────────────────────────────────────────────────────┐
│  Let's figure out your data tier                           [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Answer a few questions about your data. We'll recommend       │
│  the appropriate tier based on your answers.                   │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Progress: ████████░░░░░░░░░░░░ Question 2 of 6                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  (Question content here)                                        │
│                                                                 │
│                                        [← Back]  [Next →]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Question Flow

### Question 1: Human Subjects

```
Does your research involve data from or about people?

( ) No - My data is about things, not people
      Examples: environmental sensors, astronomical observations,
      materials science, computational chemistry

( ) Yes - My data involves human subjects or their information
      Examples: survey responses, medical records, interviews,
      behavioral data, genetic samples
```

**If No → Skip to Question 5 (likely Low tier)**
**If Yes → Continue to Question 2**

---

### Question 2: Health Information

```
Does your data include health or medical information?

( ) No - No health data involved

( ) Yes, but de-identified
      Data has been stripped of identifiers per HIPAA Safe Harbor
      or Expert Determination method

      ⚠️ "I replaced names with codes" is NOT de-identified!
         [Help me figure out if my data is truly de-identified →]
         (Opens Data Identification Status helper)

( ) Yes, with identifiers (PHI)
      Includes names, dates, medical record numbers, or other
      identifiers linked to health information

ℹ️ What counts as PHI?
   Protected Health Information includes any health data that can be
   linked to an individual: diagnoses, treatments, test results,
   insurance info, appointment records, genetic data, etc.
```

**If "Yes, with identifiers" → High tier (HIPAA)**
**Otherwise → Continue**

---

### Question 3: Student Records

```
Does your data include student education records?

( ) No - No student records

( ) Yes, but only directory information
      Name, enrollment status, major - things the university
      publishes in directories

( ) Yes, including protected records
      Grades, transcripts, financial aid, disciplinary records,
      disability accommodations

ℹ️ What's protected under FERPA?
   The Family Educational Rights and Privacy Act protects student
   "education records" - anything directly related to a student and
   maintained by the institution. This includes grades, transcripts,
   class schedules, financial information, and disciplinary records.
```

**If "Yes, protected records" → High tier (FERPA)**
**Otherwise → Continue**

---

### Question 4: Government/Defense

```
Is your research funded by or related to government or defense work?

( ) No - Standard academic research

( ) Yes, federal contract but no controlled information
      NIH, NSF, DOE basic research without classification

( ) Yes, involves CUI (Controlled Unclassified Information)
      DFARS 7012, NIST 800-171 requirements

( ) Yes, involves export-controlled data (ITAR/EAR)
      Defense articles, dual-use technology, international
      collaboration restrictions

( ) Yes, involves classified information
      ⚠️ Contact security@northwinds.edu - this requires
      special facilities not covered by this tool

ℹ️ Not sure if your grant has CUI/ITAR requirements?
   Check your award terms or contact your grants administrator.
   Common indicators: DFARS clauses, export control notices,
   restrictions on foreign nationals.
```

**If CUI/ITAR/Classified → High tier**
**If federal contract no CUI → Medium tier**
**Otherwise → Continue**

---

### Question 5: Data Sensitivity

```
How would you describe the sensitivity of your data?

( ) Public or intended for publication
      Open data, published datasets, publicly available records,
      data you plan to share openly

( ) Internal but not regulated
      Unpublished research, proprietary methods, pre-publication
      results, internal analyses

( ) Confidential or legally protected
      Contractual confidentiality, trade secrets, legal privilege,
      data covered by NDAs or DUAs
```

**If "Public" → Low tier**
**If "Internal" → Medium tier**
**If "Confidential" → High tier**

---

### Question 6: Data Sources (Confirmation)

```
Where does your data come from? (Select all that apply)

[ ] Public datasets (Kaggle, data.gov, published repositories)
[ ] My own experiments/observations (no human subjects)
[ ] Surveys or interviews I conduct
[ ] Medical/clinical records
[ ] Existing research datasets (with DUA)
[ ] Partner institution data sharing
[ ] Government or defense contracts
[ ] Commercial data purchases
[ ] Social media scraping
[ ] Other: _______________
```

This question helps validate the recommendation and may surface edge cases.

---

## Results Screen

### Recommended: Low Tier

```
┌─────────────────────────────────────────────────────────────────┐
│  Recommended Tier: 🟢 Low                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Based on your answers, your data appears to be non-sensitive  │
│  and suitable for our standard research infrastructure.        │
│                                                                 │
│  ✅ What this means:                                           │
│  • Access to all standard HPC and storage services             │
│  • No special compliance requirements                          │
│  • Lowest cost options available                               │
│  • Data can be shared openly                                   │
│                                                                 │
│  Your answers:                                                  │
│  • No human subjects data                                       │
│  • Public/publication-intended data                            │
│  • No government/defense restrictions                          │
│                                                                 │
│                                                                 │
│  [Use Low Tier]                [I need a higher tier anyway →] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended: Medium Tier

```
┌─────────────────────────────────────────────────────────────────┐
│  Recommended Tier: 🟡 Medium                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Based on your answers, your data is internal/pre-publication  │
│  but doesn't require regulated-data infrastructure.            │
│                                                                 │
│  ✅ What this means:                                           │
│  • Access to most HPC and storage services                     │
│  • Standard security controls                                   │
│  • Some services may have restrictions                          │
│  • Data should not be shared publicly until publication        │
│                                                                 │
│  Your answers:                                                  │
│  • Human subjects: De-identified data                           │
│  • Internal/pre-publication sensitivity                        │
│  • Standard federal funding (no CUI)                           │
│                                                                 │
│  ⚠️ If your IRB requires additional protections, consider      │
│     High tier. When in doubt, check with your IRB.             │
│                                                                 │
│  [Use Medium Tier]             [I need High tier instead →]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended: High Tier

```
┌─────────────────────────────────────────────────────────────────┐
│  Recommended Tier: 🔴 High                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Based on your answers, your data requires regulated/protected │
│  infrastructure with enhanced security controls.               │
│                                                                 │
│  ⚠️ What this means:                                           │
│  • Limited to High-tier approved services                      │
│  • VDI, secure enclaves, compliant cloud required             │
│  • Higher costs due to compliance requirements                 │
│  • Additional onboarding steps (BAAs, DUAs, training)         │
│                                                                 │
│  Compliance factors detected:                                   │
│  🏥 HIPAA - Health information with identifiers                │
│                                                                 │
│  Your answers:                                                  │
│  • Health data with identifiers (PHI)                          │
│  • Clinical trial or patient data                              │
│                                                                 │
│  📋 Next steps after planning:                                  │
│  1. Confirm BAA is in place for selected services              │
│  2. Complete HIPAA training if not current                     │
│  3. IRB approval must reference data security plan             │
│                                                                 │
│  [Use High Tier]                    [Talk to a human →]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Override Flow

If user selects a lower tier than recommended:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ Confirm Lower Tier Selection                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  You've selected Medium tier, but based on your answers we     │
│  recommended High tier.                                         │
│                                                                 │
│  You indicated your data includes:                              │
│  • Health information with identifiers (PHI)                   │
│                                                                 │
│  Using a lower tier may:                                        │
│  ❌ Violate HIPAA regulations                                   │
│  ❌ Put you at risk of data breaches                           │
│  ❌ Invalidate your IRB approval                               │
│  ❌ Result in grant non-compliance                             │
│                                                                 │
│  Are you sure you want to proceed?                              │
│                                                                 │
│  [ ] I confirm my data does NOT actually contain PHI           │
│      (I may have misunderstood the question)                   │
│                                                                 │
│  [ ] I will only store de-identified data on these systems     │
│      (identifiable data will be stored elsewhere)              │
│                                                                 │
│  [ ] I understand the risks and accept responsibility          │
│      ⚠️ Requires supervisor acknowledgment                     │
│                                                                 │
│                                        [Go Back]  [I Confirm]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Discipline-Specific Examples

Show relevant examples based on earlier discipline selection:

### Life Sciences / Biomedical

| Data Type | Typical Tier | Why |
|-----------|--------------|-----|
| Published genomic data (NCBI, EBI) | Low | Public data |
| Your sequencing data (no human) | Low/Medium | Depends on publication status |
| De-identified human genomics | Medium | IRB may require more |
| Patient samples with consent | High | HIPAA/PHI |
| Clinical trial data | High | FDA 21 CFR Part 11 |

### Social Sciences

| Data Type | Typical Tier | Why |
|-----------|--------------|-----|
| Census microdata | Low | Public use files |
| Survey responses (anonymous) | Medium | Could be re-identified |
| Interview transcripts | Medium/High | Depends on content |
| Student data (with grades) | High | FERPA |
| Qualitative health data | High | HIPAA if health-related |

### Engineering / Physical Sciences

| Data Type | Typical Tier | Why |
|-----------|--------------|-----|
| Simulation outputs | Low | Computational data |
| Sensor/instrument data | Low/Medium | Depends on source |
| NSF-funded research | Medium | Standard federal |
| DoD contract data | High | Likely CUI/ITAR |
| Dual-use technology | High | Export controlled |

### Humanities

| Data Type | Typical Tier | Why |
|-----------|--------------|-----|
| Archival photographs | Low | Historical/public domain |
| Published texts | Low | Already public |
| Oral history recordings | Medium | Living subjects |
| Private correspondence | Medium/High | Estate permissions |
| Indigenous cultural data | High | NAGPRA, tribal sovereignty |

---

## Config Schema

```yaml
# config/tier-questionnaire.yaml

tiers:
  low:
    name: "Low"
    label: "Public/Non-Sensitive"
    color: "#22c55e"
    icon: "check-circle"
    description: "Published datasets, public records, non-sensitive research data"
    implications:
      - "Access to all standard HPC and storage services"
      - "No special compliance requirements"
      - "Lowest cost options available"
      - "Data can be shared openly"

  medium:
    name: "Medium"
    label: "Internal/Pre-Publication"
    color: "#eab308"
    icon: "shield"
    description: "Unpublished research, proprietary methods, non-regulated internal data"
    implications:
      - "Access to most HPC and storage services"
      - "Standard security controls"
      - "Some services may have restrictions"
      - "Data should not be shared publicly until publication"

  high:
    name: "High"
    label: "Regulated/Protected"
    color: "#ef4444"
    icon: "lock"
    description: "Patient data, student records, export-controlled, legally protected"
    implications:
      - "Limited to High-tier approved services"
      - "VDI, secure enclaves, compliant cloud required"
      - "Higher costs due to compliance requirements"
      - "Additional onboarding steps (BAAs, DUAs, training)"

compliance_flags:
  hipaa:
    name: "HIPAA"
    description: "Health Insurance Portability and Accountability Act"
    triggers_tier: "high"
    requirements:
      - "BAA must be in place"
      - "HIPAA training required"
      - "PHI handling procedures"

  ferpa:
    name: "FERPA"
    description: "Family Educational Rights and Privacy Act"
    triggers_tier: "high"
    requirements:
      - "Student data handling training"
      - "Access controls documentation"

  cui:
    name: "CUI"
    description: "Controlled Unclassified Information"
    triggers_tier: "high"
    requirements:
      - "NIST 800-171 compliance"
      - "Secure enclave required"
      - "Access restricted to authorized personnel"

  itar:
    name: "ITAR"
    description: "International Traffic in Arms Regulations"
    triggers_tier: "high"
    requirements:
      - "US persons only"
      - "Export control training"
      - "Technology control plan"

  fda_11:
    name: "FDA 21 CFR Part 11"
    description: "FDA Electronic Records"
    triggers_tier: "high"
    requirements:
      - "Validated systems"
      - "Audit trails"
      - "Electronic signatures"

questions:
  # Questions defined here for customization
  - id: human_subjects
    text: "Does your research involve data from or about people?"
    options:
      - value: "no"
        label: "No - My data is about things, not people"
        examples: ["environmental sensors", "astronomical observations"]
        tier_impact: null  # Continue to next question
      - value: "yes"
        label: "Yes - My data involves human subjects"
        examples: ["survey responses", "medical records"]
        tier_impact: null  # Continue to next question
    skip_to:
      "no": "data_sensitivity"  # Skip human-related questions

  # ... additional questions
```

---

## Integration Points

### With Wizard State

```typescript
interface TierQuestionnaireResult {
  recommendedTier: 'low' | 'medium' | 'high'
  selectedTier: 'low' | 'medium' | 'high'
  overridden: boolean
  overrideReason?: string

  complianceFlags: {
    hipaa: boolean
    ferpa: boolean
    cui: boolean
    itar: boolean
    fda11: boolean
  }

  answers: Record<string, string>

  requirements: string[]  // Aggregated from triggered flags
}
```

### With Service Filtering

The selected tier filters available services:

```typescript
const availableServices = services.filter(s => {
  if (selectedTier === 'high') {
    return s.supports_high_tier === true
  }
  if (selectedTier === 'medium') {
    return s.supports_medium_tier !== false
  }
  return true  // Low tier sees everything
})
```

### With Cost Estimates

High tier services typically cost more:

```typescript
const tierMultiplier = {
  low: 1.0,
  medium: 1.0,
  high: 1.5  // Compliance overhead
}
```

---

## Accessibility

- All questions work with keyboard navigation
- Radio buttons have clear focus states
- Help text is accessible to screen readers
- Progress indicator announces current step
- Override warnings are announced

---

## References

- [CALCULATORS-IDENTIFICATION.md](./CALCULATORS-IDENTIFICATION.md) - Encoded vs de-identified helper
- [ELI5.md](./ELI5.md) - Compliance term definitions
- [TALK-TO-HUMAN.md](./TALK-TO-HUMAN.md) - Escape valve for complex cases
