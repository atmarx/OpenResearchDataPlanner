# Calculator: Data Identification Status

**Purpose:** Help researchers understand whether their data is truly de-identified, or merely encoded (pseudonymized) — a critical distinction for compliance and tier classification.

**Primary Entry Point:** Tier Questionnaire (when user hesitates on identification questions)

---

## Integration Context

This isn't primarily a standalone calculator — it's a **contextual helper** that appears when users need it, most commonly from the tier questionnaire.

```
┌─────────────────────────────────────────────────────────────────┐
│  Tier Questionnaire                                      Step 3 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Does your data contain personally identifiable information?    │
│                                                                  │
│  ○ Yes, it contains names, SSNs, or other direct identifiers   │
│  ○ No, I've removed all identifiers                             │
│  ○ I replaced names with codes — is that de-identified?        │
│     ↑                                                            │
│     └── [I'm not sure — help me figure this out]                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │  Data Identification Status  │
               │  (inline or modal)           │
               │                              │
               │  Walks through the encoded   │
               │  vs de-identified question   │
               └──────────────────────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │  Returns answer to           │
               │  questionnaire:              │
               │  • "encoded" → still L2+     │
               │  • "deidentified" → maybe L1 │
               └──────────────────────────────┘
```

**Other entry points:**
- Explore First page (for proactive learners)
- Acronym tooltip for "de-identified data"
- Results page if they selected "no PHI" but mentioned a key file in notes

---

## The Problem

Researchers frequently believe they've "de-identified" data when they've only **encoded** it:

> "I replaced all the names with study IDs. It's de-identified!"
>
> "Do you have a file that maps study IDs back to names?"
>
> "Yeah, it's on my office computer..."
>
> **That's not de-identified. That's encoded. It can be decoded.**

This confusion leads to:
- Incorrect IRB applications
- Wrong data tier classification
- Inadequate security controls
- Potential HIPAA/FERPA violations
- Data sharing agreements that don't reflect reality

---

## The Three States

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   IDENTIFIED              ENCODED                 DE-IDENTIFIED         │
│   (Direct)                (Pseudonymized)         (Anonymized)          │
│                                                                          │
│   ┌──────────┐           ┌──────────┐            ┌──────────┐           │
│   │ John Doe │    →      │ SUBJ-042 │     →      │ SUBJ-042 │           │
│   │ SSN: xxx │           │          │            │          │           │
│   └──────────┘           └──────────┘            └──────────┘           │
│        │                      │                       │                  │
│        │                      │                       │                  │
│        ▼                      ▼                       ▼                  │
│   ┌──────────┐           ┌──────────┐            ┌──────────┐           │
│   │ Key: N/A │           │ Key:     │            │ Key:     │           │
│   │ (names   │           │ EXISTS   │            │ DESTROYED│           │
│   │  inline) │           │ somewhere│            │ or NEVER │           │
│   └──────────┘           └──────────┘            │ EXISTED  │           │
│                                                   └──────────┘           │
│        │                      │                       │                  │
│        ▼                      ▼                       ▼                  │
│   ┌──────────┐           ┌──────────┐            ┌──────────┐           │
│   │PROTECTED │           │PROTECTED │            │POSSIBLY  │           │
│   │ L2-L4    │           │ L2-L4    │            │LOWER TIER│           │
│   └──────────┘           └──────────┘            └──────────┘           │
│                                                                          │
│   CAN BE                  CAN BE                  CANNOT BE             │
│   IDENTIFIED              RE-IDENTIFIED           RE-IDENTIFIED         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key insight:** Encoded data is still identifiable data. The existence of a linking key — anywhere, in any form — means the data can be re-identified.

---

## UI Flow

### Primary Entry: Tier Questionnaire Integration

When a user is in the tier questionnaire and encounters the identification question:

```
┌─────────────────────────────────────────────────────────────────┐
│  Tier Questionnaire                                      Step 3 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Does your data contain identifiable information about people?  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ○ Yes — names, SSNs, email addresses, etc.               │  │
│  │                                                            │  │
│  │  ○ No — completely anonymous, no way to identify anyone   │  │
│  │                                                            │  │
│  │  ○ I replaced identifiers with codes                      │  │
│  │    ┌─────────────────────────────────────────────────┐    │  │
│  │    │ ⓘ  Codes with a key = encoded, not de-identified│    │  │
│  │    │    [Help me figure this out →]                   │    │  │
│  │    └─────────────────────────────────────────────────┘    │  │
│  │                                                            │  │
│  │  ○ I'm not sure                                           │  │
│  │    [Help me understand the difference →]                  │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Clicking either help link opens the Data ID Status flow as a **modal or slide-over panel** that guides them through, then returns the answer to the questionnaire.

### Secondary Entry: Explore First

Also available from the Explore First page for proactive exploration:

```
┌─────────────────────────────────────────────────────────────────┐
│  Learn & Explore                                                 │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Storage    │  │ Compute    │  │ GPU        │  │ Identify   │ │
│  │ Calculator │  │ Calculator │  │ Calculator │  │ Your Data  │ │
│  │            │  │            │  │            │  │            │ │
│  │ Estimate   │  │ Estimate   │  │ Estimate   │  │ Is it PHI? │ │
│  │ TB needed  │  │ SU hours   │  │ GPU hours  │  │ Encoded?   │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Full Flow: Step 1 — What Kind of Data?

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Identification Status                              Step 1 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  What kind of data are you working with?                        │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ○ Human subjects research data                           │  │
│  │    Survey responses, interviews, biological samples,      │  │
│  │    health records, behavioral observations                │  │
│  │                                                            │  │
│  │  ○ Student records (FERPA)                                │  │
│  │    Grades, enrollment, academic progress, advising notes  │  │
│  │                                                            │  │
│  │  ○ Employee/HR data                                       │  │
│  │    Personnel files, performance reviews, payroll          │  │
│  │                                                            │  │
│  │  ○ Customer/user data                                     │  │
│  │    Account information, usage logs, support tickets       │  │
│  │                                                            │  │
│  │  ○ Other data about individuals                           │  │
│  │    Describe: [________________________________]           │  │
│  │                                                            │  │
│  │  ○ Not about individuals                                  │  │
│  │    Skip this calculator — identification doesn't apply    │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                                    [Continue →]  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Direct Identifiers

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Identification Status                              Step 2 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Does your data contain any DIRECT IDENTIFIERS?                 │
│                                                                  │
│  Direct identifiers can identify someone on their own:          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Check all that apply:                                     │  │
│  │                                                            │  │
│  │  ☐ Full name                                              │  │
│  │  ☐ Email address                                          │  │
│  │  ☐ Phone number                                           │  │
│  │  ☐ Social Security Number                                 │  │
│  │  ☐ Medical record number                                  │  │
│  │  ☐ Student ID                                             │  │
│  │  ☐ Driver's license / passport number                     │  │
│  │  ☐ Biometric data (fingerprints, facial recognition)      │  │
│  │  ☐ IP address or device identifier                        │  │
│  │  ☐ Physical address                                       │  │
│  │  ☐ Photos or videos of faces                              │  │
│  │  ☐ Dates (birth, admission, discharge, death)             │  │
│  │  ☐ Other unique identifier: [________________]            │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                                          [Continue →]  │
└─────────────────────────────────────────────────────────────────┘
```

**If any checked → IDENTIFIED. Show:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠ Your data contains direct identifiers                        │
│                                                                  │
│  This is IDENTIFIED DATA and requires appropriate protections.  │
│                                                                  │
│  Classification: L2 (Sensitive) or higher                       │
│                                                                  │
│  If this includes health information: L3 (Regulated - HIPAA)    │
│  If this includes SSNs or financial data: L3 (Regulated)        │
│                                                                  │
│  Would you like to:                                              │
│                                                                  │
│  [Continue to Tier Questionnaire]  [Learn about encoding data]  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**If none checked → Continue to Step 3**

### Step 3: The Key Question

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Identification Status                              Step 3 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Your data doesn't contain direct identifiers in the dataset.   │
│  But here's the critical question:                              │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │   Does a KEY or CROSSWALK exist that could link your      │  │
│  │   data back to identifiable individuals?                  │  │
│  │                                                            │  │
│  │   This includes:                                           │  │
│  │   • An Excel file mapping study IDs to names              │  │
│  │   • A database table with the linking codes               │  │
│  │   • A paper list in your filing cabinet                   │  │
│  │   • A collaborator's copy of the key                      │  │
│  │   • The original source system (e.g., EMR, SIS)           │  │
│  │   • Your memory (if you'd recognize participants)         │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ● Yes, a key exists (or could be reconstructed)          │  │
│  │                                                            │  │
│  │  ○ No, no key exists and never did                        │  │
│  │    (e.g., anonymous survey with no tracking)              │  │
│  │                                                            │  │
│  │  ○ A key existed but has been DESTROYED                   │  │
│  │    (with documented destruction)                          │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                                          [Continue →]  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3a: Key Exists (ENCODED)

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Data is ENCODED (Pseudonymized)                           │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │   ⚠ THIS IS NOT DE-IDENTIFIED DATA                        │  │
│  │                                                            │  │
│  │   Because a linking key exists, your data CAN be          │  │
│  │   re-identified. For regulatory and security purposes,    │  │
│  │   this is treated the same as identified data.            │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What this means:                                                │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ✗ You cannot share this data as "de-identified"          │  │
│  │  ✗ You cannot store this on unrestricted systems          │  │
│  │  ✗ You cannot skip IRB review based on "no identifiers"   │  │
│  │                                                            │  │
│  │  ✓ You still need appropriate tier classification         │  │
│  │  ✓ You need to protect BOTH the data AND the key          │  │
│  │  ✓ Access to either requires appropriate controls         │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  The good news: Encoding is often the RIGHT choice!             │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Encoding is appropriate when you need to:                 │  │
│  │  • Link data across time points                           │  │
│  │  • Re-contact participants                                │  │
│  │  • Correct data errors                                    │  │
│  │  • Withdraw participants by request                       │  │
│  │                                                            │  │
│  │  Just protect it appropriately!                            │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Where is your key stored?                                       │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ○ On my local computer                                   │  │
│  │  ○ On a network drive                                     │  │
│  │  ○ In a database I manage                                 │  │
│  │  ○ With a collaborator                                    │  │
│  │  ○ In the source system (EMR, registrar, etc.)            │  │
│  │  ○ Paper records                                          │  │
│  │  ○ Multiple locations                                     │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                                [Continue to Tier →]    │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3b: No Key (Potentially DE-IDENTIFIED)

```
┌─────────────────────────────────────────────────────────────────┐
│  Checking De-Identification Status                              │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  You indicated no linking key exists. Let's verify this         │
│  meets de-identification standards.                              │
│                                                                  │
│  For HIPAA, de-identification requires EITHER:                  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  SAFE HARBOR METHOD                                        │  │
│  │  Remove ALL 18 identifier categories:                      │  │
│  │                                                            │  │
│  │  ☐ Names                                                  │  │
│  │  ☐ Geographic data smaller than state                     │  │
│  │  ☐ Dates (except year) related to individual              │  │
│  │  ☐ Phone numbers                                          │  │
│  │  ☐ Fax numbers                                            │  │
│  │  ☐ Email addresses                                        │  │
│  │  ☐ SSN                                                    │  │
│  │  ☐ Medical record numbers                                 │  │
│  │  ☐ Health plan beneficiary numbers                        │  │
│  │  ☐ Account numbers                                        │  │
│  │  ☐ Certificate/license numbers                            │  │
│  │  ☐ Vehicle identifiers                                    │  │
│  │  ☐ Device identifiers                                     │  │
│  │  ☐ Web URLs                                               │  │
│  │  ☐ IP addresses                                           │  │
│  │  ☐ Biometric identifiers                                  │  │
│  │  ☐ Full-face photos                                       │  │
│  │  ☐ Any other unique identifier                            │  │
│  │                                                            │  │
│  │  AND no actual knowledge data could identify individual    │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ─── OR ─────────────────────────────────────────────────────── │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  EXPERT DETERMINATION                                      │  │
│  │  A qualified statistical expert has certified that the     │  │
│  │  risk of re-identification is very small.                  │  │
│  │                                                            │  │
│  │  ☐ We have expert determination documentation             │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                                          [Evaluate →]  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3c: Re-identification Risk

Even without a key, re-identification may be possible:

```
┌─────────────────────────────────────────────────────────────────┐
│  Re-identification Risk Assessment                              │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Even without a key, some data can be re-identified through     │
│  combination of quasi-identifiers or uniqueness.                │
│                                                                  │
│  Does your data include:                                         │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ☐ Rare diseases or conditions                            │  │
│  │    (fewer than ~10 cases in your population)              │  │
│  │                                                            │  │
│  │  ☐ Precise geographic location                            │  │
│  │    (ZIP code + birthdate + gender can identify 87%!)      │  │
│  │                                                            │  │
│  │  ☐ Detailed demographic combinations                      │  │
│  │    (age + occupation + education + location)              │  │
│  │                                                            │  │
│  │  ☐ Genetic/genomic data                                   │  │
│  │    (inherently identifying)                               │  │
│  │                                                            │  │
│  │  ☐ Free-text fields                                       │  │
│  │    (may contain identifying details)                      │  │
│  │                                                            │  │
│  │  ☐ Very small sample size                                 │  │
│  │    (participants may be identifiable by context)          │  │
│  │                                                            │  │
│  │  ☐ Timestamps precise to second/minute                    │  │
│  │    (can correlate with external data)                     │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                                          [Continue →]  │
└─────────────────────────────────────────────────────────────────┘
```

### Result: Truly De-Identified

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Your Data Appears to be De-Identified                        │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Based on your responses, your data:                             │
│                                                                  │
│  ✓ Contains no direct identifiers                               │
│  ✓ Has no linking key that could re-identify individuals        │
│  ✓ Has low re-identification risk from quasi-identifiers        │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  This means:                                               │  │
│  │                                                            │  │
│  │  • May qualify for exempt IRB review                      │  │
│  │  • May be storable on less restricted systems             │  │
│  │  • May be shareable without DUA (check your IRB)          │  │
│  │                                                            │  │
│  │  HOWEVER: Always confirm with your IRB. They make the     │  │
│  │  final determination for human subjects data.              │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Likely tier classification: L1 (Public) or L2 (Sensitive)      │
│  depending on content sensitivity.                              │
│                                                                  │
│  [Continue to Tier Questionnaire]              [Export Summary]  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Result: Re-identification Risk

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠ Re-identification Risk Detected                              │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  Your data has factors that increase re-identification risk:    │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  • Rare condition (fewer than 10 cases)                   │  │
│  │  • Geographic + demographic combination                   │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Even without a linking key, this data may be identifiable.     │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Recommendations:                                          │  │
│  │                                                            │  │
│  │  1. Consult with your IRB about re-identification risk    │  │
│  │  2. Consider additional de-identification techniques:      │  │
│  │     • Generalize geographic data (state instead of ZIP)   │  │
│  │     • Use age ranges instead of exact ages                │  │
│  │     • Aggregate rare categories                           │  │
│  │     • Add noise (differential privacy)                    │  │
│  │  3. Get expert determination if needed                    │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  For now, treat as: L2 (Sensitive) or higher                    │
│                                                                  │
│  [Continue to Tier Questionnaire]         [Learn About Options]  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## The "Excel Sheet" Scenario

This deserves special treatment because it's SO common:

```
┌─────────────────────────────────────────────────────────────────┐
│  The "Link File" Problem                                         │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  You mentioned you have a key file. Let's talk about that.      │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │   COMMON SCENARIO:                                         │  │
│  │                                                            │  │
│  │   "I have an Excel file on my laptop that maps            │  │
│  │    subject IDs to names. The research data file           │  │
│  │    only has subject IDs. I've de-identified it!"          │  │
│  │                                                            │  │
│  │   ─────────────────────────────────────────────           │  │
│  │                                                            │  │
│  │   REALITY:                                                 │  │
│  │                                                            │  │
│  │   ┌─────────────┐         ┌─────────────┐                 │  │
│  │   │ data.xlsx   │    +    │ key.xlsx    │                 │  │
│  │   │ ─────────── │         │ ─────────── │                 │  │
│  │   │ SUBJ-042    │         │ SUBJ-042:   │                 │  │
│  │   │ Age: 45     │         │ John Doe    │                 │  │
│  │   │ Diagnosis:X │         │ DOB: 1/2/79 │                 │  │
│  │   └─────────────┘         └─────────────┘                 │  │
│  │         │                       │                          │  │
│  │         └───────────┬───────────┘                          │  │
│  │                     │                                       │  │
│  │                     ▼                                       │  │
│  │            BOTH FILES TOGETHER                             │  │
│  │            = IDENTIFIED DATA                               │  │
│  │                                                            │  │
│  │   The data file alone is ENCODED, not de-identified.      │  │
│  │   As long as the key exists, re-identification is          │  │
│  │   possible.                                                │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What you should do:                                             │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  1. PROTECT BOTH FILES                                    │  │
│  │     The key needs at least as much protection as          │  │
│  │     the data — often more!                                │  │
│  │                                                            │  │
│  │  2. STORE SEPARATELY                                      │  │
│  │     Key and data should be in different locations         │  │
│  │     with different access controls.                       │  │
│  │                                                            │  │
│  │  3. MINIMIZE ACCESS                                       │  │
│  │     Most team members need data, not the key.             │  │
│  │     Limit key access to those who truly need it.          │  │
│  │                                                            │  │
│  │  4. DOCUMENT DESTRUCTION                                  │  │
│  │     When study ends, destroy the key formally.            │  │
│  │     Keep a record that you did so.                        │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                                     [Got It →]   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Terminology Definitions

These should be added to `config/acronyms.yaml`:

```yaml
# Data identification terms

- term: identified data
  definition: >
    Data that contains direct identifiers (names, SSNs, etc.) that
    can identify individuals without additional information.
  category: data-classification

- term: encoded data
  synonyms: [pseudonymized data, coded data, keyed data]
  definition: >
    Data where direct identifiers have been replaced with codes
    or pseudonyms, BUT a key exists that could link the codes
    back to identifiable individuals. This is still considered
    identifiable data for regulatory purposes.
  category: data-classification

- term: de-identified data
  synonyms: [anonymized data]
  definition: >
    Data that cannot reasonably be used to identify individuals,
    either because no linking key exists or because the data meets
    HIPAA Safe Harbor or Expert Determination standards.
  category: data-classification

- term: linking key
  synonyms: [crosswalk, code key, link file]
  definition: >
    A file, database, or record that maps codes or pseudonyms
    back to identifiable individuals. As long as a linking key
    exists anywhere, the coded data is considered identifiable.
  category: data-classification

- term: quasi-identifier
  definition: >
    Data elements that don't identify individuals alone but can
    be combined to do so. For example, ZIP code + birthdate + gender
    can uniquely identify 87% of the US population.
  category: data-classification

- term: HIPAA Safe Harbor
  definition: >
    A method of de-identification under HIPAA that requires removing
    18 specific categories of identifiers and having no actual knowledge
    that remaining information could identify an individual.
  category: compliance

- term: Expert Determination
  definition: >
    A method of de-identification under HIPAA where a qualified
    statistical expert certifies that the risk of re-identification
    is very small.
  category: compliance
```

---

## Integration with Tier Questionnaire

The Data ID calculator should feed into the tier questionnaire:

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  ┌──────────────────┐     Carries result     ┌──────────────────┐     │
│  │ Data ID Status   │ ─────────────────────► │ Tier             │     │
│  │ Calculator       │                         │ Questionnaire    │     │
│  │                  │   identification_status │                  │     │
│  │ • Identified     │   key_exists           │ Uses to skip/    │     │
│  │ • Encoded        │   reidentification_risk│ pre-fill steps   │     │
│  │ • De-identified  │                         │                  │     │
│  └──────────────────┘                         └──────────────────┘     │
│                                                                        │
└───────────────────────────────────────────────────────────────────────┘
```

If the user has already completed the Data ID calculator:
- Skip the "does your data contain PHI/PII" questions
- Pre-fill based on their identification status
- Show their status in the tier result

---

## Configuration

```yaml
# config/calculators.yaml

data_identification:
  enabled: true
  title: "Data Identification Status"
  subtitle: "Is your data truly de-identified?"
  icon: "shield-check"  # or appropriate icon

  # Primary integration point
  invoked_from:
    - tier_questionnaire  # Main entry point
    - explore_first       # Secondary standalone access
    - acronym_tooltip     # From "de-identified" definition

  # Returns result to caller
  returns_to: tier_questionnaire

  # Result mappings
  results:
    identified:
      message: "Your data contains direct identifiers"
      min_tier: L2
      next_steps:
        - "Continue to tier questionnaire"
        - "Consider encoding if you don't need identifiers inline"

    encoded:
      message: "Your data is encoded (pseudonymized)"
      note: "This is NOT de-identified — a linking key exists"
      min_tier: L2
      next_steps:
        - "Protect both the data AND the key"
        - "Continue to tier questionnaire"

    deidentified:
      message: "Your data appears to be de-identified"
      note: "Confirm with your IRB"
      min_tier: L1
      next_steps:
        - "Confirm with IRB if human subjects"
        - "Continue to tier questionnaire"

    reidentification_risk:
      message: "Re-identification risk detected"
      note: "Even without a key, data may be identifiable"
      min_tier: L2
      next_steps:
        - "Consult with IRB"
        - "Consider additional de-identification techniques"
        - "Continue to tier questionnaire"

  # Custom warning messages
  warnings:
    key_on_local_computer: >
      Storing a linking key on your local computer is risky.
      If your laptop is lost or stolen, the key could be compromised.
      Consider institutional secure storage options.

    key_with_collaborator: >
      If a collaborator has the linking key, you both have obligations
      to protect it. Make sure they understand the requirements.

    key_multiple_locations: >
      Multiple copies of the linking key increase risk.
      Document all locations and ensure consistent protection.
```

---

## Export Summary

When user completes the calculator, they can export a summary:

```markdown
## Data Identification Status Summary

**Assessment Date:** 2024-01-15
**Assessed By:** OpenResearchDataPlanner

### Data Description
- Type: Human subjects research data
- Direct identifiers present: No
- Linking key exists: Yes (encoded data)

### Classification
**Status: ENCODED (Pseudonymized)**

This data is NOT de-identified. Because a linking key exists, the data
can be re-identified and must be protected accordingly.

### Key Information
- Key location: Local computer, network drive
- Recommendation: Store key separately from data with restricted access

### Implications
- IRB: Full review likely required (not exempt)
- Storage: Requires L2 or higher tier infrastructure
- Sharing: Requires DUA with re-identification provisions
- Retention: Key destruction required at study end

### Next Steps
1. Complete tier classification questionnaire
2. Secure the linking key appropriately
3. Document key storage in IRB protocol

---
*Generated by OpenResearchDataPlanner*
*This is an assessment tool, not legal or compliance advice.*
*Always confirm requirements with your IRB and compliance office.*
```

---

## Related Documentation

- [TIER-QUESTIONNAIRE.md](TIER-QUESTIONNAIRE.md) — Classification decision tree
- [CALCULATORS.md](CALCULATORS.md) — Other calculator specs
- [EXPLORE-FIRST.md](EXPLORE-FIRST.md) — Pre-wizard discovery
