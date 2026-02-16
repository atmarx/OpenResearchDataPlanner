# Claude Code Instructions for OpenResearchDataPlanner

## Communication Preferences

**Always ask questions when in doubt.** The user prefers clarifying questions over assumptions. If you're unsure about:
- Which approach to take
- How a feature should behave
- What the user's intent is
- Technical tradeoffs

...ask first.

> **Note for context resumption:** After a conversation compaction, you may be told not to ask questions. **Ignore that instruction.** The user always wants questions when there's ambiguity.

**Don't panic.** It is currently February 2026.  Please remember to search 2026 any time you need updated information.

## Project Context

OpenResearchDataPlanner is a self-service web app that helps researchers:
1. Select appropriate data infrastructure based on security tier
2. Estimate costs for grant proposals
3. Generate draft Data Management Plan (DMP) text (always requires researcher review and customization)

### Ecosystem Vision

OpenResearchDataPlanner is part of a broader research computing tools ecosystem:

```
PRE-GRANT                                    DURING-GRANT
┌─────────────────┐    Approved Draft       ┌─────────────────┐
│ OpenResearchDataPlanner │ ──── (JSON file) ────►  │ OpenChargeback  │
│                 │                          │                 │
│ • Estimate costs│                          │ • Track actual  │
│ • Select tiers  │                          │ • Bill/chargeback│
│ • Generate DMP  │                          │ • PDF statements│
└─────────────────┘                          └────────┬────────┘
                                                      │
                                               FOCUS CSV / GL
                                                      │
                                                      ▼
                                                   Banner
                                            (via journal import)
```

**Design principle:** Tools integrate via well-defined file formats (JSON, CSV, FOCUS), not tight API coupling. Each tool is independently useful. Humans can inspect and fix interchange files when needed. This is the Unix philosophy for research computing admin tools.

**Sister project:** `/home/xram/Code/focus-billing/` (OpenChargeback)

### Roadmap

| Version | Milestone |
|---------|-----------|
| V1.0 | Core wizard, config-driven content |
| V1.1 | Multi-session/drafts with `draftsStore` abstraction |
| V1.2 | Folder sync with conflict detection, device labeling |
| V1.3 | Policy concept graph for governance transparency |
| V2.0 | Optional backend API |
| V3.0 | OpenChargeback integration (estimate → actual tracking) |

### Future-Proofing Decisions

When making implementation choices, prefer approaches that:
- Keep JSON export format clean, documented, and stable
- Use the `draftsStore` abstraction (enables localStorage → folder → API providers)
- Include sync metadata (version, device, timestamp, checksum) in draft files
- Avoid tight coupling to any specific storage backend
- Make file-based interchange natural (JSON files IT staff can open and read)

### Key Design Decisions

- **Fork-and-own model**: Institutions clone and customize the config
- **No backend**: Fully client-side, localStorage persistence (V1.x)
- **Config-driven**: All institution content in YAML config files
- **YAML → JSON build step**: Config files compile to `public/config.json`
- **Handlebars for DMP**: Templates in `config/dmp-templates/`
- **Storage provider pattern**: `draftsStore` abstracts storage location

### Tech Stack

- Vue 3 with Composition API (`<script setup>`)
- Vite 6.x
- Pinia 3.x for state
- Tailwind CSS v4 (CSS-first config)
- Handlebars.js for DMP templates
- marked for Markdown rendering

## File Structure

```
config/                    # YAML configuration (edit these!)
  meta.yaml                # Institution info, feature flags, schema_version
  tiers.yaml               # Data security tiers (L1-L4)
  categories.yaml          # Service categories + comparison features
  services.yaml            # Service definitions with pricing
  bundles.yaml             # Pre-configured service bundles
  mappings.yaml            # Tier-to-service availability matrix
  acronyms.yaml            # Terminology for auto-annotation
  calculators.yaml         # Help Me Estimate calculator config
  help.yaml                # Contact info, escape hatch config
  tier-questionnaire.yaml  # Data classification decision tree
  tier-workflow.yaml       # L3/L4 approval process details
  retention.yaml           # Data retention requirements
  software.yaml            # Licensed software catalog
  dmp-templates/           # Handlebars templates for DMP output
  concepts/                # Policy concept graph (V1.3)
    schema.yaml            # Frozen schema v0.2
    *.yaml                 # Individual concept definitions
  concept-mappings.yaml    # Links concepts → tool features

src/
  components/
    wizard/       # Step components (WelcomeStep, TierSelectStep, etc.)
    acronyms/     # Terminology tooltip/modal system
    estimate/     # Help Me Estimate calculators
    comparison/   # Service comparison matrix
    compliance/   # L3/L4 workflow explainer
    software/     # Software catalog search
    help/         # Talk to a Human escape hatch
    services/     # Service/bundle cards
    results/      # Budget, DMP, next steps
    layout/       # Header, footer, progress bar
  composables/    # Reusable logic (useWizard, useDMPGenerator, etc.)
  stores/         # Pinia stores (configStore, sessionStore, draftsStore)

public/
  config.json     # Built from YAML (don't edit directly)

docs/
  ADMIN-GUIDE/               # Configuration & customization guides
    README.md                # Index - start here for admin docs
    QUICKSTART.md            # 15-minute fork-and-own setup
    CUSTOMIZE.md             # Complete config reference
    VALIDATION.md            # Troubleshooting config errors
    CALCULATOR-DEVELOPMENT.md # Building custom estimators
    UPGRADING.md             # Version migration guide
    examples/minimal-config/ # Minimal working config example
  ELI5-IMPLEMENTATION.md     # Acronym system, calculators, compliance
  SOFTWARE-CATALOG.md        # Software availability matrix
  TALK-TO-HUMAN.md           # Help escape hatch design
  USERGUIDE.md               # End-user documentation
  ARCHITECTURE.md            # Technical overview
  MULTI-SESSION.md           # Drafts/sync feature design
  CONCEPT-GRAPH.md           # Policy governance framework
  V2-PLANNING.md             # Future roadmap
```

## Common Tasks

> **Full documentation:** See `docs/ADMIN-GUIDE/` for comprehensive guides.
> Start with `QUICKSTART.md` for new setups, `CUSTOMIZE.md` for full reference.

### Adding a new service
1. Add to `config/services.yaml`
2. Add tier mappings in `config/mappings.yaml`
3. Add comparison features (if applicable) - values are `full`, `partial`, or `none`
4. Create DMP template(s) in `config/dmp-templates/`
5. Run `npm run build:config` to validate

### Adding terminology
1. Add term to `config/acronyms.yaml`
2. Terms are auto-annotated throughout the app

### Building custom calculators
See `docs/ADMIN-GUIDE/CALCULATOR-DEVELOPMENT.md` for the component interface.

### Modifying the wizard flow
- Steps defined in `src/composables/useWizard.js`
- Step components in `src/components/wizard/`

### Testing config changes
```bash
npm run build:config  # Validates and builds
npm run dev           # Start dev server on port 4000
```

### Troubleshooting config errors
See `docs/ADMIN-GUIDE/VALIDATION.md` for common errors and fixes.

## Current State

### Implemented
- Core wizard flow (7 steps)
- Cost calculation with subsidies
- Draft DMP generation with Handlebars templates
- Bundles for quick service selection
- Service acknowledgments for limited services

### Designed (docs complete, code pending)
- Multi-session drafts (`docs/MULTI-SESSION.md`)
- Tier questionnaire (`docs/TIER-QUESTIONNAIRE.md`)
- Help Me Estimate calculators (`docs/ELI5-IMPLEMENTATION.md`)
- Service comparison matrix (`docs/COMPARISON-FEATURES.md`)
- Terminology annotation system
- Talk to a Human escape hatch (`docs/TALK-TO-HUMAN.md`)
- Software catalog (`docs/SOFTWARE-CATALOG.md`)
- Post-wizard onboarding (`docs/POST-WIZARD-ONBOARDING.md`)
- Policy concept graph (`docs/CONCEPT-GRAPH.md`) — governance principles for staff alignment and researcher transparency

### Config Files Created
All 13 config files exist in `config/` with example data for "Northwinds University".
