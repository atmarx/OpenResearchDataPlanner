# Tier Questionnaire: "Help Me Pick My Tier"

This document describes the interactive questionnaire that helps researchers determine the appropriate data classification tier (Low, Medium, High, Restricted) for their project.

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
│  Progress: ████████░░░░░░░░░░░░ Question 2                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  (Question content here)                                        │
│                                                                 │
│                                        [← Back]  [Next →]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Question Flow

The questionnaire is a **branching decision tree**, not a fixed-length list.
Every question is single-select (radio buttons); the option you choose decides
which question comes next (its `next:` pointer) and may raise the recommended
tier and attach compliance flags. The walk starts at **Human Subjects** and
ends at the summary (`complete`). Which questions you see — and how many —
depends on your answers.

> The progress indicator shows a running **"Question N"** count (not "N of 6") —
> there is no fixed total, because branches differ in length.

The three opening branches (human subjects, biological samples, or neither) all
converge on the government/defense questions before the summary.

---

### Human Subjects  *(start)*

```
Does your research involve human subjects?
(surveys, interviews, medical records, genetic data — any data from people)

( ) No   → Biological Samples
( ) Yes  → Health Information
```

---

### Biological Samples

```
Does your research involve biological samples or genetic/genomic data?
(DNA, RNA, tissue, cell cultures, or other biological materials — any organism)

( ) No   → Government / Defense
( ) Yes  → Organism Source
```

---

### Organism Source

```
What is the source of your biological samples or genetic data?
(pick the most sensitive if several apply)

( ) Human-derived (tissue, cell lines, DNA/RNA)         → Human Sample Detail
( ) Model organisms (mouse, rat, zebrafish, fly, yeast) → Low tier · Government / Defense
( ) Wildlife, field samples, or endangered species      → Wildlife Sensitivity
( ) Agricultural, livestock, or plants                  → Agricultural Sensitivity
```

ℹ️ Why organism source matters
   Human-derived material can re-identify individuals even without an IRB
   protocol. Model organisms are low sensitivity. Wildlife may carry location
   sensitivity (endangered species, poaching). Agricultural may involve
   proprietary breeding or biosecurity concerns.

---

### Human Sample Detail  *(human-derived branch)*

```
What type of human-derived samples are you working with?

( ) Research participant samples (with consent/IRB)
      → High tier · flags: human_genomic
( ) Biobank samples (commercial or repository)    → Biobank Consent
( ) Immortalized cell lines (HeLa, HEK293, etc.)  → Low tier
( ) Ancient DNA or archaeological samples         → Low tier
```

ℹ️ When in doubt, treat human genomic data as identifiable — it is easier to
   reclassify down than to contain a breach.
   [Check your data's identification status →] (opens the Data Identification helper)

All paths except Biobank continue to **Government / Defense**.

---

### Biobank Consent  *(biobank branch)*

```
What consent and de-identification applies to your biobank samples?

( ) Fully de-identified with broad consent      → Low tier
( ) Coded samples (key held by biobank)         → Medium tier
( ) Identifiable or consent restrictions apply  → High tier · flags: human_genomic
( ) Not sure - need to check MTA/DUA            → High tier · flags: human_genomic, needs_review
```

All paths continue to **Government / Defense**.

---

### Wildlife Sensitivity  *(wildlife branch)*

```
Does your wildlife data have location or conservation sensitivity?
(endangered-species locations, nesting sites, poaching/harassment risk)

( ) No - common species, no location concerns   → Low tier
( ) Yes - endangered species or sensitive sites → Medium tier · flags: location_sensitive
( ) Not sure                                     → Medium tier
```

All paths continue to **Government / Defense**.

---

### Agricultural Sensitivity  *(agricultural branch)*

```
Does your agricultural/plant data involve proprietary or biosecurity concerns?

( ) No - standard research crops/livestock           → Low tier
( ) Yes - proprietary breeding or commercial partner → Medium tier · flags: proprietary
( ) Yes - USDA Select Agent or biosecurity concern   → Restricted tier · flags: select_agent, biosecurity → summary
```

The first two options continue to **Government / Defense**; Select Agent ends
the questionnaire.

---

### Health Information  *(human-subjects branch)*

```
Does your data include health or medical information?
(medical records, diagnoses, treatments, genetic info linked to individuals,
mental-health or substance-abuse records)

( ) No   → Student Records
( ) Yes  → flags: hipaa, phi → Identifiable?
```

---

### Identifiable?

```
Is the health data identifiable or de-identified?
(de-identified = all 18 HIPAA identifiers removed AND no linking key exists)

( ) Fully de-identified (Safe Harbor, no linking key)
      → Medium tier · clears flags: hipaa, phi
( ) Encoded (codes with a linking key somewhere)  → High tier
( ) Limited dataset (some identifiers remain)     → High tier
( ) Identifiable (names, SSNs, etc. in the data)  → High tier
```

ℹ️ Replacing names with codes is NOT de-identification if a linking key exists
   anywhere (spreadsheet, database, a collaborator's copy).
   [Help me figure out my data's status →] (opens the Data Identification helper)

All paths continue to **Government / Defense**.

---

### Student Records

```
Does your data include student education records?
(grades, enrollment, coursework, or other student-information-system data)

( ) No   → Government / Defense
( ) Yes  → Education Record Type
```

---

### Education Record Type

```
What kind of education records — and how are they used?
(FERPA covers all of these; the tier follows content and use)

( ) Directory information only (name, enrollment status, dates)
      → Low tier
( ) Routine coursework / instructional records (incl. classroom LLM use)
      → Medium tier · flags: ferpa_instructional
( ) Sensitive records — transcripts, disciplinary, financial aid, SSN, or health
      → High tier · flags: ferpa
( ) Research use — analyzing or linking identifiable education records
      → High tier · flags: ferpa_research
```

ℹ️ Peer R1 universities escalate by content, not by use: sensitive records stay
   High even in routine handling.

All paths continue to **Government / Defense**.

---

### Government / Defense  *(convergence point)*

```
Is this research funded by or for a government agency?

( ) No                                             → Export Control
( ) Yes - NSF, NIH, NEH, NEA, or standard federal  → Export Control
( ) Yes - DoD/defense-related                       → flags: cui_possible → CUI Check
( ) Yes - DOE, DHS, NASA, or other possible-CUI     → flags: cui_possible → CUI Check
```

ℹ️ Standard science and humanities agencies (NSF, NIH, USDA, NASA science, NEH,
   NEA) follow open-data policies with no special controls. Defense and security
   agencies (DoD, DHS, some DOE programs) may impose CUI. Check your award for
   "CUI," "DFARS," or "NIST 800-171."

Standard federal funding does **not** by itself raise the tier — it continues
to the next question.

---

### CUI Check  *(defense branch)*

```
Does your contract specify CUI (Controlled Unclassified Information)?
(look for "CUI", "DFARS 252.204-7012", or "NIST 800-171")

( ) No / Not sure  → Export Control
( ) Yes            → Restricted tier · flags: cui, nist_800_171 → summary
```

---

### Export Control

```
Does your research involve export-controlled technology?
(ITAR — defense articles; EAR — dual-use; tech not shareable with non-US persons)

( ) No / Not sure                                 → Proprietary Check
( ) Yes - ITAR (defense articles, military tech)  → Restricted tier · flags: itar → summary
( ) Yes - EAR (dual-use commercial technology)    → Restricted tier · flags: ear → summary
( ) Yes - both ITAR and EAR apply                 → Restricted tier · flags: itar, ear → summary
```

---

### Proprietary Check  *(final question)*

```
Does your research involve proprietary or confidential data?
(industry NDAs, proprietary algorithms, trade secrets, confidential data)

( ) No - publicly shareable                 → summary
( ) Yes - pre-publication or NDA-protected  → Medium tier → summary
```

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

### Recommended: Restricted Tier (L4)

```
┌─────────────────────────────────────────────────────────────────┐
│  Recommended Tier: ⛔ Restricted (L4)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your answers indicate export-controlled or otherwise           │
│  restricted data requiring a secure enclave and a security      │
│  consultation before any data is stored.                        │
│                                                                 │
│  ⚠️ What this means:                                            │
│  • Isolated secure enclave, US-persons-only access              │
│  • NIST 800-171 controls and continuous monitoring              │
│  • Pricing and services set through consultation                │
│                                                                 │
│  Compliance factors detected:                                   │
│  🔒 CUI / ITAR / EAR - export-controlled data                    │
│                                                                 │
│  Consultation required — export control review must happen      │
│  before any data is stored.                                     │
│                                                                 │
│  [Schedule Consultation]    [Continue Planning (Preliminary)]   │
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
| DoD contract data | Restricted | Likely CUI/ITAR |
| Dual-use technology | Restricted | Export controlled |

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
#
# Top-level keys actually present in this file:
#   intro / questions / summary / examples_by_discipline / override / quick_select
# Tiers are NOT defined here — they live in config/tiers.yaml (described below),
# and there is no compliance_flags block: flags are bare string tokens (see below).

# The decision tree. Each question is a node; the chosen option's `next:`
# pointer decides the following question (or the literal `complete` to finish).
questions:
  - id: human_subjects
    question: "Does your research involve human subjects?"
    help_text: "Surveys, interviews, medical records, genetic data, or any data collected from people."
    icon: "users"
    options:
      - label: "No"
        value: false             # value may be boolean or string; the walker keys answers on it
        next: biological_samples  # id of the next question
      - label: "Yes"
        value: true
        next: health_data

  # An option may also escalate the tier and add/remove compliance flags:
  #   - label: "Yes - ITAR (defense articles)"
  #     value: "itar"
  #     sets_tier: restricted    # low | medium | high | restricted — UPGRADE-ONLY, never downgrades
  #     sets_flags: [itar]       # string tokens unioned into the running flag set
  #     clears_flags: [hipaa]    # string tokens removed from the flag set
  #     next: complete           # `complete` is the terminal summary node

# Per-tier call-to-action shown on the summary page (keys are tier slugs):
summary:
  show_flags: true
  show_reasoning: true
  cta:
    # one block per tier slug — low, medium, high, restricted — each with
    # title / message / action (high & restricted add a secondary_action)
```

Tiers themselves are defined in **`config/tiers.yaml`**, as a list of objects
(one per tier) keyed by `slug`. There are **four** tiers — `low`, `medium`,
`high`, and `restricted`:

```yaml
# config/tiers.yaml
tiers:
  - slug: low                 # also: medium, high, restricted
    name: "Low Risk"
    short_name: "L1"           # L1–L4
    sort_order: 1
    color: "green"             # named color: green | yellow | orange | red (not hex)
    description: |
      Open science data, publicly available datasets, ...
    types_of_data: [ ... ]
    examples: [ ... ]
    requirements: [ ... ]
    help_text: |
      ...
    consultation_required: false
    retention_questions_required: false
    # the `restricted` tier additionally carries:
    #   consultation_message, consultation_contact
```

A tier has **no** `label`, `icon`, or `implications` field; the per-tier icon
is derived in code from the color via `getTierIcon(tier.color)` in
`src/views/TierQuestionnaire.vue`.

**Compliance flags** are not a config block and carry no `triggers_tier` or
`requirements` of their own. They are bare string tokens attached to options via
`sets_flags:` / `clears_flags:` (lists of strings). The classifier
(`src/lib/classifyTier.js`) unions them into — and removes them from — a running
set and returns `flags: string[]`. Tier escalation is driven by `sets_tier` on
the option (upgrade-only), not by any flag. Real tokens include: `hipaa`,
`phi`, `ferpa`, `ferpa_instructional`, `ferpa_research`, `cui`, `cui_possible`,
`nist_800_171`, `itar`, `ear`, `human_genomic`, `location_sensitive`,
`proprietary`, `select_agent`, `biosecurity`, `needs_review`.

---

## Integration Points

### With Wizard State

```typescript
// The pure classifier (src/lib/classifyTier.js) returns
// { tier, flags: string[], path: string[] }. This wizard-level result wraps
// that with the user's selection / override state.
interface TierQuestionnaireResult {
  recommendedTier: 'low' | 'medium' | 'high' | 'restricted'
  selectedTier: 'low' | 'medium' | 'high' | 'restricted'
  overridden: boolean
  overrideReason?: string

  // Bare string tokens accumulated while walking the tree, e.g.
  // 'hipaa', 'phi', 'ferpa', 'cui', 'nist_800_171', 'itar', 'ear'.
  // Set via sets_flags / removed via clears_flags (see classifyTier.js).
  flags: string[]

  answers: Record<string, string | boolean>

  requirements: string[]  // Surfaced from the selected tier (tiers.yaml)
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
  high: 1.5,       // Compliance overhead
  restricted: 2.0  // Secure enclave + security consultation
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
