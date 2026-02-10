# Architecture Overview

OpenResearchDataPlanner is a config-driven, client-side single-page application built with Vue 3. All institutional data, service definitions, and explanatory content come from YAML configuration files—only workflows and UI concepts are hard-coded.

---

## Design Principles

1. **Config-driven content** — All text, services, pricing, and terminology from YAML
2. **Zero backend** — Fully static, deployable anywhere
3. **Progressive disclosure** — Complex concepts revealed only when needed
4. **Escape hatches** — Human help always accessible

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Browser                                         │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────────────┐   │
│  │    Vue 3       │  │    Pinia       │  │      localStorage           │   │
│  │   Components   │◄─┤    Stores      │◄─┤    Session Persistence      │   │
│  └───────┬────────┘  └───────┬────────┘  └─────────────────────────────┘   │
│          │                   │                                              │
│          ▼                   ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      Composables Layer                                 │ │
│  │  useWizard │ useAcronyms │ useCalculator │ useComparison │ useDMP    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    config.json (compiled from YAML)                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Build Pipeline

```
config/*.yaml  ───────►  build-config.js  ───────►  public/config.json
     │                         │
     │                         ▼
     │                  ┌─────────────────┐
     │                  │   Validation    │
     │                  │  - Schema check │
     │                  │  - Referential  │
     │                  │    integrity    │
     │                  └─────────────────┘
     │
     ▼
config/dmp-templates/  ───────►  Bundled with app  ───────►  Runtime Handlebars
```

### Build Commands

```bash
npm run validate:config  # Validate YAML files only
npm run build:config     # Compile YAML → config.json
npm run build            # Full production build
npm run dev              # Development server
```

---

## Configuration Files

All configuration lives in `config/`:

| File | Purpose | Key Data |
|------|---------|----------|
| `meta.yaml` | Institution identity | Name, contacts, branding, feature flags |
| `tiers.yaml` | Data classifications | L1-L4 tiers, requirements, workflows |
| `categories.yaml` | Service categories | Compute, Storage, etc. + comparison features |
| `services.yaml` | Service catalog | All services with pricing, tiers, features |
| `bundles.yaml` | Pre-configured combos | Common use case packages |
| `mappings.yaml` | Tier-service matrix | What's available for each tier |
| `acronyms.yaml` | Terminology glossary | Terms, definitions, examples |
| `calculators.yaml` | Estimation tools | Storage/compute calculators config |
| `help.yaml` | Escape hatch config | Contact options, FAQ |
| `tier-questionnaire.yaml` | Classification helper | Decision tree questions |
| `tier-workflow.yaml` | Compliance processes | L3/L4 approval steps |
| `retention.yaml` | Data retention | Funder requirements, archive ratios |
| `software.yaml` | Software catalog | Licensed software by platform |

See [CUSTOMIZE.md](CUSTOMIZE.md) for complete schemas.

---

## Stores (Pinia)

| Store | Purpose | Persisted |
|-------|---------|-----------|
| `configStore` | Loads and provides access to config.json | No |
| `sessionStore` | User selections throughout wizard | Yes (localStorage) |
| `wizardStore` | Current step, validation state | No |
| `comparisonStore` | Comparison modal state | No |

### Session Store Shape

```typescript
interface SessionState {
  tier: string | null           // Selected data tier (L1-L4)
  grantPeriod: {
    start: Date
    end: Date
    months: number
  }
  retention: {
    years: number
    archiveRatio: number
  }
  selectedServices: Map<string, ServiceSelection>
  estimates: Map<string, EstimateValue>
  questionnaireAnswers: Answer[]
  comparisonSelections: string[]
}
```

---

## Composables

| Composable | Purpose |
|------------|---------|
| `useWizard` | Step navigation, validation, flow control |
| `useAcronyms` | Text annotation, tooltips, modals |
| `useCalculator` | Help Me Estimate calculator logic |
| `useComparison` | Service comparison matrix |
| `useDMPGenerator` | Handlebars template compilation |
| `useTierQuestionnaire` | Decision tree navigation |
| `useComplianceWorkflow` | L3/L4 process explainer |
| `useHelp` | Escape hatch, contact options |
| `useSoftwareCatalog` | Software search and filtering |

---

## Component Structure

```
src/
├── components/
│   ├── wizard/                    # Wizard steps
│   │   ├── WelcomeStep.vue
│   │   ├── TierSelectStep.vue
│   │   ├── TierQuestionnaire.vue
│   │   ├── GrantPeriodStep.vue
│   │   ├── RetentionStep.vue
│   │   ├── ServiceSelectStep.vue
│   │   ├── EstimateStep.vue
│   │   ├── ResultsStep.vue
│   │   └── ConsultationStep.vue
│   │
│   ├── acronyms/                  # Terminology system
│   │   ├── AcronymProvider.vue
│   │   ├── AcronymAnnotator.vue
│   │   ├── AcronymTooltip.vue
│   │   └── AcronymModal.vue
│   │
│   ├── estimate/                  # Help Me Estimate
│   │   ├── EstimateModal.vue
│   │   ├── CalculatorTabs.vue
│   │   └── calculators/
│   │       ├── MicroscopyCalculator.vue
│   │       ├── GenomicsCalculator.vue
│   │       ├── MLTrainingCalculator.vue
│   │       └── VideoCalculator.vue
│   │
│   ├── comparison/                # Service comparison
│   │   ├── CompareButton.vue
│   │   ├── ComparisonModal.vue
│   │   ├── ComparisonTable.vue
│   │   ├── FeatureRow.vue
│   │   └── FeatureValue.vue
│   │
│   ├── compliance/                # L3/L4 workflows
│   │   ├── WorkflowModal.vue
│   │   ├── WorkflowTimeline.vue
│   │   └── WorkflowStep.vue
│   │
│   ├── software/                  # Software catalog
│   │   ├── SoftwareCatalog.vue
│   │   ├── SoftwareSearch.vue
│   │   ├── SoftwareCard.vue
│   │   └── AvailabilityBadge.vue
│   │
│   ├── help/                      # Escape hatch
│   │   ├── HelpButton.vue
│   │   ├── HelpModal.vue
│   │   └── ContactOptions.vue
│   │
│   ├── services/                  # Service selection
│   │   ├── ServiceCard.vue
│   │   ├── BundleCard.vue
│   │   └── CategorySection.vue
│   │
│   ├── results/                   # Output generation
│   │   ├── BudgetSummary.vue
│   │   ├── CostBreakdown.vue
│   │   ├── DMPPreview.vue
│   │   └── NextSteps.vue
│   │
│   └── shared/                    # Reusable components
│       ├── Modal.vue
│       ├── Tooltip.vue
│       ├── ProgressBar.vue
│       └── LoadingSpinner.vue
│
├── composables/                   # Business logic
├── stores/                        # Pinia stores
├── utils/                         # Helper functions
└── types/                         # TypeScript interfaces
```

---

## Wizard Steps

| # | Component | Purpose |
|---|-----------|---------|
| 1 | `WelcomeStep` | Introduction, session restore |
| 2 | `TierSelectStep` | Data classification (with questionnaire) |
| 3 | `GrantPeriodStep` | Duration selection |
| 4 | `RetentionStep` | Data retention requirements |
| 5 | `ServiceSelectStep` | Service/bundle selection (with comparison) |
| 6 | `EstimateStep` | Usage estimates (with calculators) |
| 7 | `ResultsStep` | Cost summary, DMP output, next steps |
| 8 | `ConsultationStep` | Restricted tier redirect |

---

## Data Flow

### User Input Flow

```
User Input
    │
    ▼
┌──────────────────┐
│  sessionStore    │  ◄── Persisted to localStorage
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Computed costs  │  ◄── Reactive calculations
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
Budget    DMP Text
Summary   Generation
```

### DMP Generation Flow

```
Selected Services + Estimates
           │
           ▼
    ┌─────────────────┐
    │ useDMPGenerator │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │   Handlebars    │  ◄── Templates from dmp-templates/
    │   Compilation   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Rendered DMP   │  ◄── Ready to paste
    └─────────────────┘
```

---

## Key Features

### Acronym Annotation System

Automatically annotates technical terms throughout the app:

```vue
<AcronymProvider :config="acronymConfig">
  <AcronymAnnotator>
    <p>Store your data on HPC storage with SU-based billing.</p>
  </AcronymAnnotator>
</AcronymProvider>

<!-- Renders with tooltips on "HPC" and "SU" -->
```

Terms defined in `acronyms.yaml` get:
- Hover tooltips (short definition)
- Click modals (full explanation + examples)

### Help Me Estimate Calculators

Translate researcher concepts to infrastructure units:

```
Researcher: "5,000 confocal images, 4K, 16-bit, 4 channels"
Calculator: "≈ 3.2 TB storage needed"
```

Configured in `calculators.yaml`, renders domain-specific UIs.

### Service Comparison

Side-by-side feature comparison for services in a category:

```
Feature          HPC GPU    Cloud GPU    K8s GPU
───────────────────────────────────────────────
GPU Available    ✓ Full     ✓ Full       ✓ Full
Batch Jobs       ✓ Full     ◐ Partial    ✓ Full
Auto-Scaling     ✗ None     ✓ Full       ✓ Full
Predictable $    ✓ Full     ✗ None       ◐ Partial
```

Features defined per-category in `categories.yaml`, values per-service in `services.yaml`.

### Compliance Workflow Explainer

When user selects L3/L4 data, show step-by-step approval process:

```
┌─────────────────────────────────────────────┐
│  STEP 1: Complete Planner           ~10min  │
├─────────────────────────────────────────────┤
│  STEP 2: Research IT Consultation   1-3 d   │
├─────────────────────────────────────────────┤
│  STEP 3: BAA Verification           0-5 d   │
├─────────────────────────────────────────────┤
│  ...                                        │
└─────────────────────────────────────────────┘
```

Configured in `tier-workflow.yaml`.

---

## Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for institution theming (from `meta.yaml`)
- **Responsive** mobile-first design
- **Accessible** WCAG 2.1 AA compliant

---

## State Management

### Local Storage Persistence

Session state auto-persists to `localStorage`:

```typescript
// Automatic via Pinia plugin
const sessionStore = useSessionStore()

// On page load, session is restored
// On every change, session is saved
```

### Shareable State

Export/import sessions as JSON:

```typescript
// Export
const json = sessionStore.exportSession()

// Import
sessionStore.importSession(json)
```

---

## Security Considerations

1. **No secrets in config** — All config is public
2. **No user data collected** — Everything stays in browser
3. **No external requests** — Fully self-contained (except optional analytics)
4. **CSP-friendly** — No inline scripts or eval

---

## Deployment

The build output is static files deployable anywhere:

```bash
npm run build
# Output in dist/
```

Compatible with:
- nginx, Caddy, Apache
- GitHub Pages, Netlify, Vercel
- AWS S3 + CloudFront
- Any static file host

### Configuration Customization

1. Fork repository
2. Edit files in `config/`
3. Run `npm run build`
4. Deploy `dist/`

No code changes required for institutional customization.

---

## Testing

```bash
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:a11y      # Accessibility tests
```

### Key Test Areas

- Wizard flow navigation
- Cost calculations
- DMP template rendering
- Acronym annotation
- Calculator accuracy
- Comparison matrix

---

## Future Considerations

### V1.1
- PDF export
- Email/share functionality
- Archive direct input (alongside ratio)

### V2
- User accounts with SSO
- Saved plans in database
- Admin dashboard
- Usage analytics
- Multi-language support
- API for external integrations

See [V2-PLANNING.md](V2-PLANNING.md) for roadmap.

---

## Related Documentation

- [CUSTOMIZE.md](CUSTOMIZE.md) — Configuration reference
- [USERGUIDE.md](USERGUIDE.md) — End-user documentation
- [ELI5-IMPLEMENTATION.md](ELI5-IMPLEMENTATION.md) — Help Me Estimate design
- [COMPARISON-FEATURES.md](COMPARISON-FEATURES.md) — Service comparison design
- [TIER-QUESTIONNAIRE.md](TIER-QUESTIONNAIRE.md) — Classification helper design
