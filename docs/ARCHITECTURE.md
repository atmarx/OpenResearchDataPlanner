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
│  │  useWizard │ useCalculator │ useDMPGenerator │ useExport │ useSkin   │ │
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
| `explainers.yaml` | Concept explainers | Progressive-disclosure explanatory content |
| `help-videos.yaml` | Help video catalog | Tutorial/walkthrough video links |
| `legal.yaml` | Legal/policy text | Footer links, DMP boilerplate |

See [CUSTOMIZE.md](CUSTOMIZE.md) for complete schemas.

---

## Stores (Pinia)

| Store | Purpose | Persisted |
|-------|---------|-----------|
| `configStore` | Loads and provides access to config.json | No |
| `sessionStore` | User selections + wizard progress (`current_step`, `completed_steps`) | Yes (localStorage) |
| `preferencesStore` | UI/user preferences | Yes (localStorage) |
| `slateStore` | Active slate/plan working state | Yes (localStorage `odp-slate`) |
| `workbenchStore` | Saved plans + auth | Yes (localStorage for plans, sessionStorage for auth) |

### Session Store Shape

```typescript
interface SessionState {
  id: string
  created_at: string
  updated_at: string
  template_version: string | null
  current_step: string
  completed_steps: string[]
  tier: string | null                      // Selected data tier (L1-L4)
  classification_flags: string[]           // Compliance flags from the tier questionnaire
  grant_period: {
    start_date: string | null
    end_date: string | null
    months: number
  }
  retention: {
    schedules: string[]
    longest_years: number
    archive_ratio: number
    custom_ratio: boolean
  }
  selected_services: ServiceSelection[]    // { service_slug, estimate, use_subsidy, notes, archive_estimate, acknowledged }
  selected_software: SoftwareSelection[]   // { software_slug, note, platforms }
  cost_summary: CostSummary | null
}
```

---

## Composables

| Composable | Purpose |
|------------|---------|
| `useWizard` | Step navigation, validation, flow control |
| `useCalculator` | Help Me Estimate calculator logic |
| `useDMPGenerator` | Handlebars template compilation |
| `useExport` | Session/config export |
| `useFeedback` | Feedback capture |
| `usePdfExport` | PDF rendering of results |
| `useQuestionnaireHistory` | Tier-questionnaire answer history |
| `useSkin` | Theme/branding skinning |

---

## Component Structure

```
src/
├── components/
│   ├── CostDisclaimer.vue         # Top-level disclaimer (loose component)
│   │
│   ├── wizard/                    # Wizard steps
│   │   ├── WelcomeStep.vue
│   │   ├── TierSelectStep.vue
│   │   ├── GrantPeriodStep.vue
│   │   ├── RetentionStep.vue
│   │   ├── ServiceSelectStep.vue
│   │   ├── SoftwareStep.vue
│   │   ├── EstimateStep.vue
│   │   ├── ResultsStep.vue
│   │   ├── ConsultationStep.vue
│   │   └── CompareModal.vue        # Service comparison modal
│   │
│   ├── acronyms/                  # Terminology system
│   │   ├── AnnotatedText.vue      # Annotates plain text via :text prop
│   │   ├── AnnotatedHtml.vue      # Annotates pre-rendered HTML via :html prop
│   │   └── TermTooltip.vue        # Internal hover/click tooltip child
│   │
│   ├── estimate/                  # Help Me Estimate (one calculator per domain)
│   │   ├── BaseCalculator.vue
│   │   ├── BatchProcessingCalculator.vue
│   │   ├── DocumentsCalculator.vue
│   │   ├── GenomicsPipelinesCalculator.vue
│   │   ├── GenomicsStorageCalculator.vue
│   │   ├── GPUSimulationCalculator.vue
│   │   ├── LLMApiCalculator.vue
│   │   ├── MedicalImagingCalculator.vue
│   │   ├── MicroscopyCalculator.vue
│   │   ├── MLInferenceCalculator.vue
│   │   ├── MLTrainingCalculator.vue
│   │   ├── PhotographyCalculator.vue
│   │   ├── SimulationsCalculator.vue
│   │   ├── StatisticsCalculator.vue
│   │   └── VideoCalculator.vue
│   │
│   ├── explore/                   # Tier questionnaire / guided exploration
│   ├── feedback/                  # Page feedback widget
│   ├── layout/                    # App shell: header, footer, layouts
│   ├── slate/                     # Slate export + footer
│   └── workbench/                 # Saved-plans workbench (dashboard, login, review)
│
├── ai-guidance/                   # AI guidance surface (applets, views, stores)
├── assets/                        # Styles and static assets
├── composables/                   # Business logic
├── lib/                           # Helpers (pricing, tier classification, AI disclosure)
├── router/                        # Vue Router route definitions
├── stores/                        # Pinia stores
└── views/                         # Top-level routed views (incl. TierQuestionnaire.vue)
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
| 6 | `SoftwareStep` | Software selection (optional) |
| 7 | `EstimateStep` | Usage estimates (with calculators) |
| 8 | `ResultsStep` | Cost summary, DMP output, next steps |
| — | `ConsultationStep` | Restricted-tier branch (replaces flow: Welcome → TierSelect → Consultation) |

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
<!-- Plain text -->
<AnnotatedText text="Store your data on HPC storage with SU-based billing." />

<!-- Pre-rendered HTML (e.g. markdown output) -->
<AnnotatedHtml :html="renderedHtml" />

<!-- Matched terms (e.g. "HPC", "SU") get hover tooltips, rendered internally via TermTooltip -->
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
npm run test            # Unit tests (Vitest)
npm run test:watch      # Unit tests, watch mode (Vitest)
npm run persona-session # Browser persona/regression runs (Playwright)
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
