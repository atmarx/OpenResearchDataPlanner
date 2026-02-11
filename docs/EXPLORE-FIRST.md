# Explore First: Pre-Wizard Discovery Tools

Allow researchers to explore infrastructure options, estimate needs, and understand the landscape **before** committing to the planning wizard.

---

## Key Insight: Two Paths, One Slate

The **wizard** and **calculators** are just different entry points to the same destination: **the service slate**.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│     ENTRY POINTS                        SAME DESTINATION        │
│     ────────────                        ────────────────        │
│                                                                  │
│  ┌──────────────┐                    ┌──────────────────┐       │
│  │ Calculators  │───────┐            │  SERVICE SLATE   │       │
│  │ (explore)    │       │            │  ──────────────  │       │
│  └──────────────┘       │            │  • Services      │       │
│                         ├───────────►│  • Software      │       │
│  ┌──────────────┐       │            │  • Quantities    │       │
│  │   Wizard     │───────┘            │  • Costs         │       │
│  │   (guided)   │                    └────────┬─────────┘       │
│  └──────────────┘                             │                  │
│                                               │                  │
│                                               ▼                  │
│                                    ┌────────────────────┐       │
│                                    │ Ready to export?   │       │
│                                    │ ───────────────    │       │
│                                    │ Missing: Tier      │       │
│                                    │ [Complete Now]     │       │
│                                    └────────────────────┘       │
│                                               │                  │
│                                               ▼                  │
│                              ┌────────────────────────────┐     │
│                              │ EXPORT OPTIONS             │     │
│                              │ ─────────────              │     │
│                              │ • Submit to Research IT    │     │
│                              │ • Export for grant (text)  │     │
│                              │ • Generate DMP draft       │     │
│                              └────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**The wizard is just a guided way to fill the slate.** Someone using calculators directly gets the same end product — same DMP drafts, same submission to IT.

### Tier Classification: Required for DMP, Not for Export

Users can explore and add items freely without selecting a tier. When they want to export:

| Action | Tier Required? |
|--------|---------------|
| **Submit to IT** | No — IT will help classify |
| **Export cost table** | No — just numbers |
| **Generate DMP text** | **Yes** — DMP language depends on tier |

If they submit without a tier, IT gets the request and follows up. No "gotcha."

### Avoiding the "But You Showed That!" Problem

Every service shows tier badges **at all times** during exploration:

```
Research Storage   L1 ✓  L2 ✓  L3 ⚠  L4 ✗     $5/TB/mo
Cloud Compute      L1 ✓  L2 ✓  L3 ✓  L4 ⚠     usage-based
```

If they haven't selected a tier, we warn at checkout:

> ⚠ **Some services have tier restrictions.** When IT reviews your request, they'll confirm availability based on your data classification. If a service isn't available for your tier, they'll suggest alternatives.

This prevents the scenario: "But you showed that service!" → "Yeah, but you never classified your data."

---

## The Problem

The current flow is linear: Start → Wizard → Results

But researchers often want to answer questions first:
- "How much storage would I need for my microscopy data?"
- "What services are even available for PHI data?"
- "What's an SU and how many would I need?"

Forcing them into the wizard to find out creates friction. Some abandon. Others make uninformed selections.

---

## The Solution

Add an **"Explore First"** section to the Welcome page with standalone access to:

1. **Estimate Your Needs** — Calculators without wizard context
2. **Browse Services** — Service/tier availability matrix
3. **Check Your Tier** — Quick classification questionnaire
4. **Learn the Terms** — Glossary browser

These tools are **informational** — they help users understand before they plan. Results can optionally seed the wizard when they're ready to begin.

---

## Welcome Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] OpenResearchDataPlanner                                 │
│                                                                 │
│  Plan your research data infrastructure                         │
│  Estimate costs, select services, generate DMP text             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │               [ Start Planning ]                            ││
│  │                                                             ││
│  │         Guided wizard • 5-15 minutes                        ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ────────────── or explore first ──────────────                 │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │                     │  │                     │              │
│  │  Estimate Needs     │  │  Browse Services    │              │
│  │                     │  │                     │              │
│  │  How much storage?  │  │  What's available   │              │
│  │  Compute hours?     │  │  at each tier?      │              │
│  │  GPU time?          │  │                     │              │
│  │                     │  │                     │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │                     │  │                     │              │
│  │  Check Your Tier    │  │  Learn the Terms    │              │
│  │                     │  │                     │              │
│  │  Quick questions    │  │  SU? PHI? HPC?      │              │
│  │  to classify your   │  │  Plain-English      │              │
│  │  data               │  │  glossary           │              │
│  │                     │  │                     │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Have an existing session?  [Import JSON]  [Restore Previous]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature 1: Estimate Your Needs (Standalone Calculators)

### Purpose

Let researchers translate their research into infrastructure units without being in the wizard.

### Flow

```
Welcome Page
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Estimate Your Needs                                            │
│                                                                 │
│  Choose what you're working with:                               │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Microscopy  │ │  Genomics   │ │ ML Training │ │   Video   │ │
│  │             │ │             │ │             │ │           │ │
│  │  Images &   │ │  Sequences  │ │  Models &   │ │ Recording │ │
│  │  stacks     │ │  & samples  │ │  datasets   │ │  footage  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐                               │
│  │  Simulation │ │   Custom    │                               │
│  │             │ │             │                               │
│  │  HPC jobs   │ │  Enter your │                               │
│  │  & runs     │ │  own values │                               │
│  └─────────────┘ └─────────────┘                               │
│                                                                 │
│                                              [Back to Welcome]  │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼ (user selects Microscopy)
┌─────────────────────────────────────────────────────────────────┐
│  Microscopy Storage Estimator                                   │
│                                                                 │
│  Image Details                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Resolution:     [ 2048 ] x [ 2048 ] pixels                  ││
│  │ Bit depth:      ( ) 8-bit  (•) 16-bit  ( ) 32-bit          ││
│  │ Channels:       [ 4 ]                                       ││
│  │ Z-slices:       [ 50 ]                                      ││
│  │ Time points:    [ 1 ]                                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Dataset Size                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Number of images/stacks:  [ 5000 ]                          ││
│  │ Growth rate:  [ 500 ] per [ month ▼ ]                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Current dataset:         3.2 TB                            ││
│  │  After 1 year:            9.2 TB                            ││
│  │  After 3 years:          21.2 TB                            ││
│  │                                                             ││
│  │  Recommended buffer:      +20%                              ││
│  │  ─────────────────────────────────                          ││
│  │  Suggested allocation:   25 TB (3-year grant)               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐ │
│  │  Try another type   │  │  Start planning with this value  │ │
│  └─────────────────────┘  └──────────────────────────────────┘ │
│                                                                 │
│  Calculation breakdown: 2048×2048×2 bytes×4 ch×50 z = 838 MB/  │
│  stack. 5000 stacks = 4.1 TB raw. Compression ~20% savings.    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Behaviors

| Behavior | Description |
|----------|-------------|
| **No login required** | Purely informational, no state saved |
| **Calculation visible** | Show the math so researchers can verify |
| **Growth projection** | Project forward based on acquisition rate |
| **Carry forward** | "Start planning with this value" seeds the wizard |
| **Multiple estimates** | Can run several, get a combined total |

### Calculator Types

Reuse the calculators from [ELI5-IMPLEMENTATION.md](ELI5-IMPLEMENTATION.md):

| Calculator | Inputs | Output |
|------------|--------|--------|
| Microscopy | Resolution, bit depth, channels, Z, time, count | TB storage |
| Genomics | Sample count, sequencing type, coverage | TB + compute hours |
| ML Training | Model params, dataset size, training runs | GPU-hours |
| Video | Resolution, framerate, hours, codec | TB storage |
| Simulation | Core count, hours/run, run count | SU (service units) |
| Custom | Direct entry | Any unit |

### Carrying Values Forward

When user clicks "Start planning with this value":

1. Store estimate in sessionStore (not committed to draft yet)
2. Navigate to wizard step 1 (Welcome → Get Started)
3. When they reach the Estimate step, pre-fill with stored value
4. Show indicator: "Based on your earlier estimate (Microscopy: 25 TB)"

```typescript
// Temporary storage for pre-wizard estimates
interface PreWizardEstimate {
  calculatorType: string       // 'microscopy', 'genomics', etc.
  result: {
    value: number
    unit: string               // 'TB', 'SU', 'GPU-hours'
  }
  inputs: Record<string, any>  // For showing "how we got here"
  timestamp: string
}

sessionStore.preWizardEstimates: PreWizardEstimate[]
```

---

## Feature 2: Browse Services (Tier/Service Matrix)

### Purpose

Show what services are available at each data classification tier, so researchers understand the landscape before selecting their tier.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Browse Services                                                │
│                                                                 │
│  See what's available based on your data's security needs       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Filter by category:  [All ▼]   Search: [____________]      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                     L1          L2          L3          L4      │
│                   Public     Internal       PHI     Restricted  │
│  ───────────────────────────────────────────────────────────────│
│  COMPUTE                                                        │
│  ───────────────────────────────────────────────────────────────│
│  HPC Standard       ✓           ✓           ⚠           ✗      │
│  ├ 10,000 SU free tier, then $0.01/SU                          │
│  └ [Details]                                                    │
│                                                                 │
│  HPC GPU            ✓           ✓           ⚠           ✗      │
│  ├ A100 and V100 GPUs, $0.50/GPU-hour                          │
│  └ [Details]                                                    │
│                                                                 │
│  Cloud Compute      ✓           ✓           ✓           ⚠      │
│  ├ Azure VMs, various sizes, usage-based                       │
│  └ [Details]                                                    │
│                                                                 │
│  Kubernetes         ✓           ✓           ✗           ✗      │
│  ├ Container orchestration, $0.10/pod-hour                     │
│  └ [Details]                                                    │
│  ───────────────────────────────────────────────────────────────│
│  STORAGE                                                        │
│  ───────────────────────────────────────────────────────────────│
│  Research Storage   ✓           ✓           ⚠           ✗      │
│  ├ 1 TB free, then $5/TB/month                                 │
│  └ [Details]                                                    │
│                                                                 │
│  Cloud Storage      ✓           ✓           ✓           ⚠      │
│  ├ Azure Blob, $0.02/GB/month + egress                         │
│  └ [Details]                                                    │
│                                                                 │
│  Archive Storage    ✓           ✓           ✓           ✓      │
│  ├ Long-term, $1.50/TB/month, slow retrieval                   │
│  └ [Details]                                                    │
│  ───────────────────────────────────────────────────────────────│
│                                                                 │
│  Legend:  ✓ Available   ⚠ Requires approval   ✗ Not available  │
│                                                                 │
│  Not sure which tier?  [Take the questionnaire]                 │
│                                                                 │
│                                              [Back to Welcome]  │
└─────────────────────────────────────────────────────────────────┘
```

### Service Detail Modal

Clicking [Details] opens a modal:

```
┌─────────────────────────────────────────────────────────────────┐
│  HPC Standard Compute                                      [×]  │
│                                                                 │
│  High-performance computing cluster for batch workloads         │
│                                                                 │
│  Availability                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  L1 Public       ✓ Self-service                            ││
│  │  L2 Internal     ✓ Self-service                            ││
│  │  L3 PHI          ⚠ Requires security review (3-5 days)     ││
│  │  L4 Restricted   ✗ Use dedicated enclave instead           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Pricing                                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  First 10,000 SU    Free (per grant year)                  ││
│  │  Additional SU      $0.01 per SU                           ││
│  │  Priority queue     $0.015 per SU                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Features                                                       │
│  • 500+ nodes, Intel Xeon processors                           │
│  • InfiniBand interconnect                                      │
│  • Slurm scheduler                                              │
│  • 30-day job history                                           │
│                                                                 │
│  Limitations                                                    │
│  • 7-day max job runtime                                        │
│  • No interactive GUI (use VDI for that)                       │
│  • Shared filesystem, no guaranteed IOPS                        │
│                                                                 │
│  Software Available                                             │
│  MATLAB, Gaussian, Python, R, GROMACS, NAMD, ...  [See all]    │
│                                                                 │
│                        [Start Planning with This Service]       │
└─────────────────────────────────────────────────────────────────┘
```

### Data Source

All data comes from existing config:
- `services.yaml` — service definitions, pricing, features
- `mappings.yaml` — tier availability matrix
- `categories.yaml` — groupings
- `software.yaml` — software catalog (for the "See all" link)

### Tier Badges: Always Visible

**Critical UX requirement:** Tier availability must be visible on EVERY service row, not just in detail views. This prevents the "but you showed that service!" problem.

```
                     L1 ✓    L2 ✓    L3 ⚠    L4 ✗
Research Storage     ────────────────────────────     $5/TB/mo    [+ Add]
```

Users see at a glance which tiers each service supports. If they haven't classified their data yet, they can still explore — but they see the restrictions.

### Interactions

| Action | Result |
|--------|--------|
| Click service row | Expand inline details |
| Click [Details] | Open full modal |
| Click tier header | Show tier description tooltip |
| Click ⚠ or ✗ icon | Show why (approval needed, or alternative services) |
| "Start Planning with This Service" | Jump to wizard with service pre-selected |
| Category filter | Show only services in category |
| Search | Filter by service name or description |

---

## Feature 3: Check Your Tier (Standalone Questionnaire)

### Purpose

Let researchers determine their data classification without starting the wizard.

### Flow

Uses the same questionnaire from [TIER-QUESTIONNAIRE.md](TIER-QUESTIONNAIRE.md), but in standalone mode:

```
┌─────────────────────────────────────────────────────────────────┐
│  Check Your Data Classification                                 │
│                                                                 │
│  Answer a few questions to determine the right security tier    │
│                                                                 │
│  Question 1 of 5                                                │
│  ───────────────────────────────────────────────────────────────│
│                                                                 │
│  Does your research involve human subjects?                     │
│                                                                 │
│        ┌─────────────────────────────────────────┐              │
│        │             Yes                          │              │
│        └─────────────────────────────────────────┘              │
│        ┌─────────────────────────────────────────┐              │
│        │             No                           │              │
│        └─────────────────────────────────────────┘              │
│        ┌─────────────────────────────────────────┐              │
│        │             I'm not sure                 │              │
│        └─────────────────────────────────────────┘              │
│                                                                 │
│                                                                 │
│  ◀ Back                                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Result Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Data Classification                                       │
│                                                                 │
│  Based on your answers, your data is:                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │                        L3 — High                            ││
│  │                                                             ││
│  │         Protected Health Information (PHI)                  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Why this classification?                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • You indicated human subjects research           ✓        ││
│  │ • Health or medical information involved          ✓        ││
│  │ • Data is identifiable (not de-identified)        ✓        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  What this means:                                               │
│  • Most services available with security review                 │
│  • HIPAA training required before access                        │
│  • Environment provisioning takes 3-7 days                      │
│  • BAA (Business Associate Agreement) verification              │
│                                                                 │
│  [See available services for L3]    [Start planning as L3]     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Think this is wrong?  [Retake questionnaire]  [Talk to human] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Carrying Forward

If user clicks "Start planning as L3":
1. Store tier determination in sessionStore
2. When wizard reaches Tier Selection step, pre-select L3
3. Show: "Based on your earlier questionnaire (L3 — PHI)"
4. User can still change if needed

---

## Feature 4: Learn the Terms (Glossary Browser)

### Purpose

Let researchers explore terminology without context-switching during the wizard.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Terminology Glossary                                           │
│                                                                 │
│  Search: [________________]                                     │
│                                                                 │
│  Popular terms:  [SU]  [PHI]  [HPC]  [HIPAA]  [DMP]  [TB]      │
│                                                                 │
│  ───────────────────────────────────────────────────────────────│
│  A                                                              │
│  ───────────────────────────────────────────────────────────────│
│  ACCESS                                                         │
│  Advanced Cyberinfrastructure Coordination Ecosystem: Services  │
│  & Support — the NSF-funded national computing network.         │
│  [Show more]                                                    │
│                                                                 │
│  Archive Storage                                                │
│  Long-term, low-cost storage for data you must keep but rarely  │
│  access. Retrieval takes hours instead of seconds.              │
│                                                                 │
│  ───────────────────────────────────────────────────────────────│
│  B                                                              │
│  ───────────────────────────────────────────────────────────────│
│  BAA (Business Associate Agreement)                             │
│  Legal contract required when a third party handles PHI on      │
│  behalf of a covered entity. Required for HIPAA compliance.     │
│                                                                 │
│  ...                                                            │
│                                                                 │
│                                              [Back to Welcome]  │
└─────────────────────────────────────────────────────────────────┘
```

### Term Detail (Expanded)

```
┌─────────────────────────────────────────────────────────────────┐
│  SU (Service Unit)                                              │
│                                                                 │
│  A measure of compute time on HPC systems.                      │
│                                                                 │
│  1 SU = 1 core-hour (one CPU core running for one hour)        │
│                                                                 │
│  Examples:                                                      │
│  • A 4-core job running for 2 hours = 8 SU                     │
│  • A 128-core job running for 10 hours = 1,280 SU              │
│  • A GPU job might cost 10-50 SU per GPU-hour (varies)         │
│                                                                 │
│  Typical usage:                                                 │
│  • Small project: 10,000 SU/year                               │
│  • Medium project: 100,000 SU/year                             │
│  • Large simulation: 1,000,000+ SU/year                        │
│                                                                 │
│  Related: [HPC] [GPU] [Core-hour] [Allocation]                 │
│                                                                 │
│  [Estimate how many SU you need]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Source

All content from `acronyms.yaml` — same source as the inline tooltips.

---

## Configuration

### Feature Flags

```yaml
# config/meta.yaml

features:
  explore_first:
    enabled: true

    # Which tools to show on welcome page
    show_calculators: true
    show_service_matrix: true
    show_tier_questionnaire: true
    show_glossary: true

    # Carry-forward behavior
    seed_wizard_from_exploration: true
```

### Welcome Page Customization

```yaml
# config/meta.yaml

welcome:
  title: "OpenResearchDataPlanner"
  tagline: "Plan your research data infrastructure"
  subtitle: "Estimate costs, select services, generate DMP text"

  start_button:
    label: "Start Planning"
    sublabel: "Guided wizard • 5-15 minutes"

  explore_section:
    heading: "or explore first"

    cards:
      - id: calculators
        title: "Estimate Needs"
        description: "How much storage? Compute hours? GPU time?"
        icon: "calculator"  # or emoji or SVG path

      - id: services
        title: "Browse Services"
        description: "What's available at each tier?"
        icon: "grid"

      - id: tier
        title: "Check Your Tier"
        description: "Quick questions to classify your data"
        icon: "shield"

      - id: glossary
        title: "Learn the Terms"
        description: "SU? PHI? HPC? Plain-English glossary"
        icon: "book"
```

---

## Components

### New Components

| Component | Purpose |
|-----------|---------|
| `ExploreSection.vue` | The "or explore first" section on Welcome |
| `ExploreCard.vue` | Individual tool cards |
| `CalculatorBrowser.vue` | Standalone calculator picker |
| `ServiceMatrix.vue` | Tier/service availability grid |
| `ServiceDetailModal.vue` | Full service info modal |
| `GlossaryBrowser.vue` | Alphabetical term browser |
| `TierQuestionnaire.vue` | Reused from wizard, standalone mode |

### Reused Components

| Component | From | Adaptation |
|-----------|------|------------|
| `MicroscopyCalculator.vue` | estimate/ | No changes, just different parent |
| `GenomicsCalculator.vue` | estimate/ | No changes |
| `AcronymTooltip.vue` | acronyms/ | Used in glossary |
| `AcronymModal.vue` | acronyms/ | Used for expanded terms |

---

## State Management

### Pre-Wizard State

Exploration results stored in sessionStore but NOT part of the draft:

```typescript
// sessionStore additions
interface SessionState {
  // ... existing fields ...

  // Pre-wizard exploration (not persisted to draft)
  exploration: {
    estimates: PreWizardEstimate[]
    tierResult: {
      tier: string
      answers: Answer[]
      timestamp: string
    } | null
    viewedServices: string[]  // For analytics/personalization
  }
}
```

### Seeding the Wizard

When user starts the wizard after exploration:

```typescript
function startWizardFromExploration() {
  // If tier determined, pre-select
  if (exploration.tierResult) {
    sessionStore.setTier(exploration.tierResult.tier)
    sessionStore.setQuestionnaireAnswers(exploration.tierResult.answers)
  }

  // If estimates made, queue them for the Estimate step
  if (exploration.estimates.length > 0) {
    sessionStore.setPreWizardEstimates(exploration.estimates)
  }

  // Navigate to wizard
  router.push('/wizard/welcome')
}
```

---

## Analytics Events

Track exploration to understand user behavior:

```typescript
// Events to emit (if analytics enabled)
analytics.track('explore_tool_opened', { tool: 'calculators' })
analytics.track('calculator_completed', { type: 'microscopy', result_tb: 25 })
analytics.track('service_matrix_viewed', { filter: 'compute' })
analytics.track('service_detail_opened', { service: 'hpc-standard' })
analytics.track('tier_questionnaire_completed', { result: 'L3' })
analytics.track('wizard_started_from_exploration', {
  had_estimates: true,
  had_tier: true
})
```

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Arrow keys in matrix, Tab through cards |
| Screen reader | Proper headings, ARIA labels for icons |
| Focus management | Focus trap in modals, return focus on close |
| Color contrast | Icons have text labels, not color-only meaning |
| Reduced motion | Respect `prefers-reduced-motion` for transitions |

---

## Mobile Considerations

### Card Layout

On narrow screens, cards stack vertically:

```
┌─────────────────────────┐
│  [ Start Planning ]     │
└─────────────────────────┘

── or explore first ──────

┌─────────────────────────┐
│  Estimate Needs         │
│  How much storage?...   │
└─────────────────────────┘

┌─────────────────────────┐
│  Browse Services        │
│  What's available...    │
└─────────────────────────┘

...
```

### Service Matrix

On mobile, matrix becomes a list with tier filter:

```
┌─────────────────────────┐
│ Tier: [ L2 Internal ▼ ] │
└─────────────────────────┘

HPC Standard          ✓
$0.01/SU after free tier
[Details]

HPC GPU               ✓
$0.50/GPU-hour
[Details]

Cloud Compute         ✓
Usage-based pricing
[Details]
```

---

## Implementation Notes

### Phase 1: Service Matrix (Quickest Win)
- All data exists in config
- Mostly rendering, minimal logic
- High value for "front door" demos

### Phase 2: Standalone Calculators
- Calculator components exist (for wizard)
- Need to wrap in standalone browser UI
- Add carry-forward logic

### Phase 3: Standalone Questionnaire
- Questionnaire logic exists
- Wrap in standalone result screen
- Add carry-forward logic

### Phase 4: Glossary Browser
- Acronym data exists
- Build alphabetical browser UI
- Add search/filter

---

## Feature 5: Your Service Slate (Draft System)

### Terminology: Why "Service Slate"?

| Term | Problem |
|------|---------|
| Cart | E-commerce — implies transaction complete at checkout |
| Basket | Same issue |
| Portfolio | Implies finished collection |
| Plan | Generic, could work |
| **Service Slate** | Academic, implies a proposed set awaiting approval ✓ |

A **slate** is a proposed set of items for consideration — like a "slate of candidates." It's not done until someone approves it.

And like a chalkboard, you can **wipe the slate clean** to start over.

### Core Concept: The Draft

Everything the user builds is a **draft** until IT confirms it. This prevents the "I downloaded a PDF so I'm done" problem.

```
USER SIDE                              IT SIDE (Toolbench)
┌──────────────────────┐              ┌──────────────────────┐
│  Build service slate │              │  Review request      │
│  ↓                   │   JSON       │  ↓                   │
│  Submit to IT        │ ─────────►   │  Provision services  │
│                      │              │  ↓                   │
│  Wait for confirm    │   PDF        │  Send confirmation   │
│                      │ ◄─────────   │                      │
└──────────────────────┘              └──────────────────────┘

The PDF is IT's artifact, not the researcher's.
```

### The Problem

Not everyone is planning a grant. The tool serves multiple audiences:

**Researchers:**
- **Startup funds** — New faculty setting up their lab
- **Overhead/indirect funds** — Discretionary spending
- **Internal seed grants** — Pilot projects
- **Core facility chargebacks** — Existing accounts

**Departments & Units:**
- **Operational storage** — Shared drives, departmental file servers
- **Lab computing** — Workstations, specialized software
- **Teaching resources** — Course-related computing needs

**Core Facilities:**
- **Instrument storage** — Data from shared equipment
- **Processing infrastructure** — Analysis pipelines for users

**Administrative Units:**
- **Project storage** — Non-research institutional projects
- **Compliance archives** — Records retention

These users don't need DMP text or multi-year projections — they want to estimate, select, and request services now.

### Two Paths From Calculators

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Estimate: 25 TB storage                                   │
│                                                                 │
│  What would you like to do?                                     │
│                                                                 │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐│
│  │                              │  │                          ││
│  │   Plan for a Grant          │  │   Request Now            ││
│  │                              │  │                          ││
│  │   Build a full budget,      │  │   Add to your plan and   ││
│  │   estimate costs over       │  │   request today using    ││
│  │   your grant period,        │  │   startup, overhead,     ││
│  │   generate DMP text         │  │   or other funds         ││
│  │                              │  │                          ││
│  │   [Start Planning Wizard]   │  │   [Add to Slate]          ││
│  │                              │  │                          ││
│  └──────────────────────────────┘  └──────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Draft Plan Flow

```
Calculator → Add to Slate → Review Slate → Submit to IT → IT Confirms
```

**Step 1: Add to Slate**

From any calculator or service browser:

```
┌─────────────────────────────────────────────────────────────────┐
│  Added to Your Slate                                     [×]    │
│                                                                 │
│  ✓ Research Storage: 25 TB                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Monthly cost:  $125/month                                  ││
│  │  Annual cost:   $1,500/year                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Continue Browsing]             [View Slate (1 item)]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Step 2: Review Slate**

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Service Slate                               [DRAFT]       │
│                                                                 │
│  Status: Not yet submitted to Research IT                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Research Storage                                    [×]   ││
│  │  25 TB @ $5/TB/month                                        ││
│  │  ───────────────────────────────────────                    ││
│  │  Monthly: $125    Annual: $1,500                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  HPC Compute                                         [×]   ││
│  │  100,000 SU @ $0.01/SU                                      ││
│  │  ───────────────────────────────────────                    ││
│  │  Total: $1,000 (minus 10K free = $900)                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Estimated Annual Total: $2,400                                 │
│                                                                 │
│  [+ Add More]                           [Submit to Research IT] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Step 3: Submit — Funding & Contact**

```
┌─────────────────────────────────────────────────────────────────┐
│  Submit Your Slate                                              │
│                                                                 │
│  How will this be funded?                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ○ Grant / Sponsored Project                                ││
│  │    Fund/Account: [________________]                         ││
│  │    PI: [________________]                                   ││
│  │                                                             ││
│  │  ● Startup Funds                                            ││
│  │    Department: [ Chemistry ▼ ]                              ││
│  │                                                             ││
│  │  ○ Overhead / Discretionary                                 ││
│  │    Cost center: [________________]                          ││
│  │                                                             ││
│  │  ○ Internal Seed Grant                                      ││
│  │    Award #: [________________]                              ││
│  │                                                             ││
│  │  ○ Core Facility Account                                    ││
│  │    Account #: [________________]                            ││
│  │                                                             ││
│  │  ○ Other / I'll provide later                               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Contact Information                                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Name:  [________________]                                  ││
│  │  Email: [________________]                                  ││
│  │  Dept:  [________________]                                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  When do you need this?                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ○ As soon as possible                                      ││
│  │  ● Within 2 weeks                                           ││
│  │  ○ Within a month                                           ││
│  │  ○ Specific date: [________]                                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                                   [Submit to Research IT →]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Step 4: Confirmation (Request Pending)**

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Plan Submitted                                               │
│                                                                 │
│  Request #: RC-2024-0142                                        │
│  Status: Pending Review                                         │
│                                                                 │
│  What happens now?                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  1. Research IT reviews your request (1-2 days)             ││
│  │  2. We verify funding with your department                  ││
│  │  3. Services are provisioned (1-3 days)                     ││
│  │  4. You receive a confirmation PDF with access details      ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ⚠ You'll receive a confirmation PDF from Research IT once     │
│    your services are ready. That's your official record.        │
│                                                                 │
│  A copy of your submission has been emailed to                  │
│  jane.doe@university.edu                                        │
│                                                                 │
│                                              [Return to Home]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Note:** No PDF download for users. The PDF is IT's confirmation *to* the researcher after provisioning. This prevents the "I'm done" false completion signal.

### Slate State Management

```typescript
interface SlateItem {
  service: string           // Service slug
  quantity: number          // Amount (TB, SU, etc.)
  unit: string             // Unit type
  monthlyEstimate: number  // Calculated cost
  annualEstimate: number
  fromCalculator?: string  // Which calculator produced this
}

interface SoftwareSelection {
  id: string               // Software slug
  license_model: 'campus' | 'byol' | 'free' | 'hybrid'
  cost_to_user: number | null  // null = "confirm with vendor"
  cost_period?: string
  note?: string
}

interface SlateState {
  status: 'draft' | 'submitted' | 'confirmed'
  items: SlateItem[]
  software: SoftwareSelection[]
  fundingSource?: FundingSource
  contact?: ContactInfo
  timeline?: string
  submittedAt?: string
  requestId?: string       // Assigned on submit, e.g. "RC-2024-0142"
}

// Slate persists in sessionStorage (not localStorage)
// Cleared on confirmation or explicit "wipe slate"
```

### Integration with Service Matrix

From the service matrix, each service row gets an "Add to Slate" action:

```
                     L1        L2        L3        L4
Research Storage     ✓         ✓         ⚠         ✗      [+ Add]
HPC Compute          ✓         ✓         ⚠         ✗      [+ Add]
```

Clicking [+ Add] opens a quick quantity modal:

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Research Storage                                      [×]  │
│                                                                 │
│  How much storage do you need?                                  │
│                                                                 │
│  [  25  ] TB                                                    │
│                                                                 │
│  Presets: [5 TB] [10 TB] [25 TB] [50 TB]                       │
│                                                                 │
│  Not sure?  [Open storage calculator]                           │
│                                                                 │
│  ───────────────────────────────────────────────────────────────│
│                                                                 │
│  Monthly estimate: $125                                         │
│  Annual estimate:  $1,500                                       │
│                                                                 │
│                                              [Add to Slate]      │
└─────────────────────────────────────────────────────────────────┘
```

### Sticky Footer with Expand

The slate lives in a sticky footer — always visible, never blocking content.

**Collapsed (default):**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         Main Content                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ▲ Your Slate: 2 services, 3 software  │ $2,400/yr  │ [Review →]│
└─────────────────────────────────────────────────────────────────┘
```

**Expanded (click ▲ or Review):**
```
┌─────────────────────────────────────────────────────────────────┐
│                         Main Content                            │
│                         (still visible, just shorter)           │
├─────────────────────────────────────────────────────────────────┤
│ ▼ Your Slate                                    [Wipe]  [× Close]│
├─────────────────────────────────────────────────────────────────┤
│  SERVICES                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Research Storage • 25 TB                    $1,500/yr   [×] ││
│  │ HPC Compute • 100K SU                         $900/yr   [×] ││
│  └─────────────────────────────────────────────────────────────┘│
│  SOFTWARE                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ MATLAB [Included]  •  Gaussian [Included]  •  Stata [Incl.] ││
│  └─────────────────────────────────────────────────────────────┘│
│  ───────────────────────────────────────────────────────────────│
│  Est. Annual Total: $2,400      [Export for Grant] [Submit →]  │
├─────────────────────────────────────────────────────────────────┤
│  Research IT • rc-help@northwinds.edu • Docs • Feedback         │
└─────────────────────────────────────────────────────────────────┘
```

**Footer states:**

| State | Collapsed Display |
|-------|-------------------|
| Empty | `Start building your slate by exploring services or calculators` |
| Has items | `Your Slate: 2 services, 3 software • $2,400/yr [▲] [Review →]` |
| Submitted | `Request RC-2024-0142 submitted • Pending review` |

**Height:**
- Collapsed: ~48px (single bar)
- Expanded: ~40% viewport (scrollable if needed)

**Mobile:** Collapsed footer becomes floating button → opens full-screen modal

### Data Tier Handling

If user adds a service that requires L3/L4 approval:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠ This service requires approval                               │
│                                                                 │
│  Cloud HIPAA Storage is available for regulated data, but      │
│  requires security review before provisioning.                  │
│                                                                 │
│  You can still add it to your slate. During submission, we'll  │
│  initiate the approval process.                                 │
│                                                                 │
│  Typical timeline: 3-7 business days                            │
│                                                                 │
│  [Cancel]                         [Add to Slate Anyway]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Unified Calculator Architecture

All estimation tools are "calculators" that emit items to the slate:

```
┌───────────────────────────────────────────────────────────────────────┐
│                           CALCULATORS                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │
│  │ Storage     │ │ Compute     │ │ GPU         │ │ Software        │  │
│  │ ─────────── │ │ ─────────── │ │ ─────────── │ │ ───────────────│  │
│  │ Microscopy  │ │ Simulation  │ │ ML Training │ │ By discipline   │  │
│  │ Genomics    │ │ Genomics    │ │ Rendering   │ │ By category     │  │
│  │ Video       │ │ General     │ │ Inference   │ │ By service      │  │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └────────┬────────┘  │
│         │               │               │                  │           │
│         └───────────────┴───────────────┴──────────────────┘           │
│                                    │                                    │
│                                    ▼                                    │
│                          ┌─────────────────┐                           │
│                          │  SERVICE SLATE  │                           │
│                          │  (unified)      │                           │
│                          └─────────────────┘                           │
└───────────────────────────────────────────────────────────────────────┘
```

Each calculator:
- Has themed entry points (discipline-specific UI)
- Reads from YAML config for units, pricing, options
- Emits `SlateItem` or `SoftwareSelection` to the unified slate
- Can be accessed standalone (Explore First) or in wizard flow

### Configuration

```yaml
# config/meta.yaml

features:
  service_slate:
    enabled: true

    # Funding source options
    funding_sources:
      # Research funding
      - id: grant
        label: "Grant / Sponsored Project"
        fields: ["fund_account", "pi_name"]
        category: "research"

      - id: startup
        label: "Faculty Startup Funds"
        fields: ["department", "pi_name"]
        category: "research"

      - id: overhead
        label: "Overhead / Discretionary (PI)"
        fields: ["cost_center", "pi_name"]
        category: "research"

      - id: seed_grant
        label: "Internal Seed Grant"
        fields: ["award_number"]
        category: "research"

      # Department/Unit funding
      - id: department_ops
        label: "Department Operating Budget"
        fields: ["department", "cost_center", "approver"]
        category: "department"

      - id: core_facility
        label: "Core Facility Account"
        fields: ["facility_name", "account_number"]
        category: "department"

      - id: teaching
        label: "Teaching / Course Support"
        fields: ["department", "course_number"]
        category: "department"

      # Administrative
      - id: institutional
        label: "Institutional / Administrative"
        fields: ["unit", "cost_center", "approver"]
        category: "admin"

      - id: other
        label: "Other / I'll provide later"
        fields: []
        category: "other"

    # Where does the request go?
    submit_to:
      method: "email"  # or "webhook", "servicenow"
      email: "rc-requests@university.edu"
      cc_requester: true

    # For webhook/ServiceNow integration (V2)
    # webhook_url: "https://..."
```

### Relationship to Grant Planning

The service slate and grant wizard serve different needs:

| Direct Request (via Slate) | Grant Planning Wizard |
|----------------------------|----------------------|
| Immediate purchase | Future budget planning |
| Any funding source | Grant-specific |
| Simple request flow | Full DMP generation |
| No retention planning | Multi-year projections |
| Skip tier questionnaire | Full classification |
| Researchers, depts, admins | Researchers only |

**But they share:**
- Same service catalog
- Same calculators
- Same pricing data
- Same tier restrictions

### Who Uses What?

| User Type | Likely Path |
|-----------|-------------|
| PI writing R01 | Grant Planning Wizard |
| New faculty with startup | Shopping Cart (startup funds) |
| Postdoc needing quick storage | Service Slate (PI's overhead) |
| Department IT manager | Service Slate (dept operating) |
| Core facility manager | Service Slate (core account) |
| Grad student exploring options | Explore First → talk to advisor |
| Grants office estimating | Explore First → export estimates |

---

## Feature 6: Software Calculator

Software selection is another calculator, themed by discipline or category.

### Wizard Integration

In the planning wizard, software is a **skippable step**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Software (Optional)                         [Skip →]   │
│                                                                 │
│  Do you need specific research software?                        │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Yes, let me    │  │  I'll figure    │  │  I don't need   │ │
│  │  select now     │  │  it out later   │  │  any special    │ │
│  │                 │  │                 │  │  software       │ │
│  │  [Open Catalog] │  │  [Skip]         │  │  [Continue]     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

If they choose "Yes", they get the software calculator:

```
┌─────────────────────────────────────────────────────────────────┐
│  Software Catalog                                          [×]  │
│                                                                 │
│  Based on your selections (HPC Compute, Research Storage):     │
│                                                                 │
│  Browse by:  [Discipline ▼]  Search: [____________]            │
│                                                                 │
│  ─── Statistics & Data Analysis ───────────────────────────────│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ☑ MATLAB R2024b                              [Included]    ││
│  │    Campus license - HPC, VDI                                ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  ☑ Stata/MP 18                                [Included]    ││
│  │    Campus license - VDI only                                ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  ☐ SAS 9.4                                    [Included]    ││
│  │    Campus license - VDI only                                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ─── Computational Chemistry ──────────────────────────────────│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ☐ Gaussian 16                                [Included]    ││
│  │    Campus license - HPC                                     ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  ☐ ORCA 5                                     [Free]        ││
│  │    Academic free - HPC                                      ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  ☐ Schrödinger Suite                    [Contact vendor]    ││
│  │    BYOL - requires lab license                              ││
│  │    [Request pricing info →]                                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Your software selections: 2 items                              │
│                                                                 │
│                         [Cancel]    [Add to Slate & Continue]   │
└─────────────────────────────────────────────────────────────────┘
```

### License Model Display

| License Model | Badge | User Impact |
|---------------|-------|-------------|
| `campus` | [Included] | No cost to user |
| `free` | [Free] | No cost, may need registration |
| `byol` | [Contact vendor] or [$X/yr] | User must acquire license |
| `hybrid` | [Included*] | Some features require upgrade |

For BYOL without known pricing:

```yaml
# config/software.yaml
- id: schrodinger
  name: "Schrödinger Suite"
  license_model: byol
  license_info:
    cost_per_seat: null  # Unknown - contact vendor
    vendor_contact: "https://www.schrodinger.com/academic"
    notes: "Academic pricing varies by modules selected"
```

---

## Feature 7: Grant Writer Export (Text Only)

Grant writers need numbers for proposals but shouldn't get a PDF that implies completion.

### Export Options by Tier Status

Different exports have different requirements:

| Export Type | Tier Required? | Notes |
|-------------|----------------|-------|
| **Submit to IT** | No | IT will help classify during review |
| **Cost table (txt/md)** | No | Just numbers, no DMP language |
| **Full DMP draft** | **Yes** | Template language varies by tier |

### Submitting Without a Tier

If user clicks "Submit to IT" without selecting a tier:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠ Data Classification Not Set                                  │
│                                                                 │
│  You haven't classified your data yet. That's okay — Research  │
│  IT can help you determine the right tier during review.       │
│                                                                 │
│  Note: Some services in your slate have tier restrictions.     │
│  IT may suggest alternatives if your data requires a higher    │
│  security tier than a selected service supports.               │
│                                                                 │
│  Services with restrictions:                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  • Research Storage — Not available for L4 Restricted       ││
│  │  • HPC Compute — Requires review for L3                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Classify Now (2 min)]              [Submit Anyway — IT Will Help]│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### DMP Generation Gate

Only when requesting a DMP draft do we require tier:

```
┌─────────────────────────────────────────────────────────────────┐
│  Generate DMP Draft                                              │
│                                                                 │
│  To generate DMP text, we need to know your data classification │
│  (the template language varies by security requirements).       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ☑ Services selected                              ✓ Done   ││
│  │  ☐ Data classification (security tier)           [Do Now]  ││
│  │  ☐ Grant duration (for multi-year projections)   [Do Now]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  This takes about 2 minutes.                                    │
│                                                                 │
│  Or: [Export cost table only (no DMP)]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Clicking "Do Now" opens the relevant mini-questionnaire inline or as a modal. Once complete, the DMP generation proceeds.

### Export for Grant Proposal

```
┌─────────────────────────────────────────────────────────────────┐
│  Export for Grant Proposal                                      │
│                                                                 │
│  This exports your cost estimates as text for your budget      │
│  justification. This is NOT a service request.                  │
│                                                                 │
│  What to include:                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ☑ Cost breakdown table                                     ││
│  │  ☑ DMP boilerplate text                                     ││
│  │  ☐ Software requirements list                               ││
│  │  ☐ Data classification summary                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Format:                                                        │
│  ○ Plain text (.txt)                                           │
│  ● Markdown (.md)                                              │
│  ○ Copy to clipboard                                           │
│                                                                 │
│  ⚠ Remember: Submit your actual service request to Research IT │
│    before your grant starts!                                    │
│                                                                 │
│                                        [Export]  [Cancel]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What Gets Exported

**Cost Table (Markdown):**
```markdown
## Research Computing Budget Estimate

| Service | Quantity | Unit Cost | Annual Cost |
|---------|----------|-----------|-------------|
| Research Storage | 25 TB | $5/TB/mo | $1,500 |
| HPC Compute | 100,000 SU | $0.01/SU | $900* |
| **Total** | | | **$2,400** |

*Includes 10,000 SU/year free allocation

Generated via OpenResearchDataPlanner on 2024-01-15
Estimate only — submit request to rc-help@university.edu
```

**DMP Boilerplate:**
```markdown
## Data Management Plan: Storage and Computing

Data will be stored on institutional research storage infrastructure
(25 TB allocation) with nightly backups and 30-day retention...

[Template text from config/dmp-templates/]
```

### What's NOT Exported

- No PDF (that's IT's confirmation document)
- No "complete" branding
- No request confirmation number
- Clear "estimate only" watermark

---

## Future Enhancements

### Smart Recommendations

Based on exploration, suggest a path:

> "Based on your estimates (25 TB storage, 50,000 SU) and your L2 data classification, we recommend the **HPC Starter** bundle. [Start with this bundle]"

### Exploration History

Remember what users explored across sessions:

> "Welcome back! Last time you estimated 25 TB for microscopy and looked at L2 services. [Continue where you left off]"

### Comparison Mode

Select multiple services to compare side-by-side:

> [Compare: HPC Standard vs Cloud Compute vs Kubernetes]

---

## Related Documentation

- [ELI5-IMPLEMENTATION.md](ELI5-IMPLEMENTATION.md) — Calculator design
- [SOFTWARE-CATALOG.md](SOFTWARE-CATALOG.md) — Software catalog schema
- [TIER-QUESTIONNAIRE.md](TIER-QUESTIONNAIRE.md) — Classification questionnaire
- [COMPARISON-FEATURES.md](COMPARISON-FEATURES.md) — Service comparison (within wizard)
- [ARCHITECTURE.md](ARCHITECTURE.md) — Component structure
