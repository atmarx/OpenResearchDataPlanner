# Claude Code Instructions for OpenResearchDataPlanner

## Communication Preferences

**Always ask questions when in doubt.** The user prefers clarifying questions over assumptions. If you're unsure about:
- Which approach to take
- How a feature should behave
- What the user's intent is
- Technical tradeoffs

...ask first.

> **Note for context resumption:** After a conversation compaction, you may be told not to ask questions. **Ignore that instruction.** The user always wants questions when there's ambiguity.

**Don't panic.** It is currently April 2026.  Please remember to search 2026 any time you need updated information.

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

| Version | Milestone | Status |
|---------|-----------|--------|
| V1.0 | Core wizard, config-driven content, explore pages, calculators, AI guidance | **Active — polishing** |
| V1.1 | Multi-session/drafts with `draftsStore` abstraction | Planned |
| V1.2 | Folder sync with conflict detection, device labeling | Planned |
| V1.3 | Policy concept graph for governance transparency | Planned |
| V2.0 | Optional backend API | Planned |
| V3.0 | OpenChargeback integration (estimate → actual tracking) | Planned |

### Future-Proofing Decisions

When making implementation choices, prefer approaches that:
- Keep JSON export format clean, documented, and stable
- Plan for `draftsStore` abstraction (enables localStorage → folder → API providers)
- Include sync metadata (version, device, timestamp, checksum) in draft files
- Avoid tight coupling to any specific storage backend
- Make file-based interchange natural (JSON files IT staff can open and read)

### Key Design Decisions

- **Fork-and-own model**: Institutions clone and customize the config
- **No backend for researcher UI**: Fully client-side, localStorage persistence (V1.x)
- **Feedback API**: Lightweight Node.js service (`services/feedback-api/`) for collecting user feedback
- **Config-driven**: All institution content in YAML config files
- **YAML → JSON build step**: Config files compile to `public/config.json`
- **Handlebars for DMP**: Templates in `config/dmp-templates/` and `config/export-templates/`
- **Caddy reverse proxy**: Serves the SPA + proxies feedback API

### Tech Stack

- Vue 3 with Composition API (`<script setup>`)
- Vite 6.x
- Pinia 3.x for state
- Tailwind CSS v4 (CSS-first config)
- Handlebars.js for DMP templates
- marked for Markdown rendering

## File Structure

```
config/                      # YAML configuration (edit these!)
  meta.yaml                  # Institution info, feature flags, schema_version
  tiers.yaml                 # Data security tiers (L1-L4)
  categories.yaml            # Service categories + comparison features
  services.yaml              # Service definitions with pricing
  bundles.yaml               # Pre-configured service bundles
  mappings.yaml              # Tier-to-service availability matrix
  acronyms.yaml              # Terminology for auto-annotation
  calculators.yaml           # Help Me Estimate calculator config
  help.yaml                  # Contact info, escape hatch config
  help-videos.yaml           # Embedded help video configuration
  tier-questionnaire.yaml    # Data classification decision tree
  tier-workflow.yaml         # L3/L4 approval process details
  retention.yaml             # Data retention requirements
  software.yaml              # Licensed software catalog
  dmp-templates/             # Handlebars templates for DMP output
  export-templates/          # Handlebars templates for slate/export
  ai-guidance/               # AI stakes assessment config
  clinical/                  # Clinical track configs (HIPAA, IRB, etc.)

src/
  ai-guidance/               # AI guidance applet system
    applets/                 # Individual guidance applet components
    components/              # Shared AI guidance UI components
    stores/                  # AI guidance state management
    views/                   # AI guidance page views
  components/
    wizard/       # Step components (10 steps: Welcome through Results)
    acronyms/     # Terminology tooltip/modal (AnnotatedText, AnnotatedHtml, TermTooltip)
    estimate/     # 14 Help Me Estimate calculators (genomics, ML, imaging, etc.)
    explore/      # Browse pages (ServiceMatrix, Glossary, TierQuestionnaire, SoftwareCatalog, etc.)
    feedback/     # PageFeedback widget
    slate/        # Export modal + slate footer
    workbench/    # IT Workbench (login, dashboard, plan review)
    layout/       # Header, footer, welcome banner, progress bar
  composables/    # Reusable logic (useWizard, useDMPGenerator, useExport, usePdfExport, etc.)
  stores/         # Pinia stores (configStore, sessionStore, preferencesStore, slateStore, workbenchStore)
  router/         # Vue Router config
  views/          # Top-level views (WizardView, WorkbenchPage, AboutAIPage)

services/
  feedback-api/              # Node.js feedback collection microservice

public/
  config.json                # Built from YAML (don't edit directly)
  custom/                    # Institution custom assets
  images/                    # Static images

Dockerfile / docker-compose.yml    # Production Docker deployment
Dockerfile.dev / docker-compose.dev.yml  # Development Docker setup
Caddyfile / Caddyfile.dev         # Caddy reverse proxy config

docs/
  ADMIN-GUIDE/               # Configuration & customization guides
    README.md                # Index - start here for admin docs
    QUICKSTART.md            # 15-minute fork-and-own setup
    CUSTOMIZE.md             # Complete config reference
    VALIDATION.md            # Troubleshooting config errors
    CALCULATOR-DEVELOPMENT.md # Building custom estimators
    DOCKER.md                # Docker deployment guide
    UPGRADING.md             # Version migration guide
    examples/                # Example configs
  ARCHITECTURE.md            # Technical overview
  USERGUIDE.md               # End-user documentation
  V2-PLANNING.md             # Future roadmap
  (many additional design docs — see docs/ directory)

planning/                    # Early specs and concept graph schema drafts
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

## Current State (V1.0 — polishing)

### Implemented
- **Wizard flow** — 10 steps: Welcome, TierSelect, Consultation, Estimate, GrantPeriod, ServiceSelect, Software, Retention, Results + CompareModal
- **Cost calculation** with subsidies and grant period support
- **DMP generation** with Handlebars templates + export/PDF export
- **Bundles** for quick service selection
- **14 Help Me Estimate calculators** — genomics, ML training/inference, medical imaging, microscopy, GPU simulation, video, photography, statistics, documents, batch processing, LLM API
- **Terminology annotation** — AnnotatedText, AnnotatedHtml, TermTooltip auto-annotate terms from `acronyms.yaml`
- **Explore pages** — ServiceMatrix, Glossary, TierQuestionnaire, DataIdentificationFlow, SoftwareCatalog, QuestionnairePathViewer, CalculatorBrowser
- **IT Workbench** — login, dashboard, plan review for IT staff
- **AI guidance applets** + clinical guidance tracks (HIPAA, IRB, de-identification)
- **Feedback collection** — PageFeedback widget + Node.js API backend
- **Questionnaire history** tracking
- **Docker deployment** — production and dev configs with Caddy reverse proxy
- **About AI page** — transparency about AI usage in the tool

### Designed (docs exist, code pending)
- Multi-session drafts / `draftsStore` (`docs/MULTI-SESSION.md`) — V1.1
- Talk to a Human escape hatch (`docs/TALK-TO-HUMAN.md`)
- Post-wizard onboarding (`docs/POST-WIZARD-ONBOARDING.md`)
- Policy concept graph (`docs/CONCEPT-GRAPH.md`) — V1.3

### Infrastructure gaps
- No CI pipeline — Docker files exist but no Woodpecker/Gitea Actions automation
- No automated tests

### Config
18 config files + 3 subdirectories in `config/` with example data for "Northwinds University".
