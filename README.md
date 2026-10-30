# OpenResearchDataPlanner

**Self-service discovery for researchers. Informed requests for support teams.**

A guided planning tool that helps researchers select data infrastructure, estimate costs for grant budgets, and generate draft DMP text—while giving support teams complete, reviewable requests instead of vague asks.

**What it does:**
- Guides you through selecting services based on your data's security tier
- Calculates costs for your grant budget (including long-term retention)
- Generates draft Data Management Plan text as a starting point (always review and customize for your project)
- Explains unfamiliar terms and helps estimate requirements

**Who it's for:** researchers planning a grant, the research computing and IT staff who field their requests, and institutions that want to fork it and run their own copy.  The bundled config describes Northwinds University, which is fictional — swap in your own.

## Status

**v1.0, still being polished.**  The last tag is `v1.0.0` (April 2026); everything since lives on `main` and on staging.

**Real today:**
- The wizard: tier selection, grant period, retention, services, software, estimate, results, plus a consultation path for restricted tiers
- Cost math with subsidies, F&A and grant periods; DMP generation and export, including PDF
- 14 Help Me Estimate calculators, the explore pages, the AI Guide with its clinical tracks, and the IT Workbench
- The feedback widget and its API

**Not real yet:**
- **Contacting a human from the app.**  The Get Help modal shows FAQ, office hours and contextual help, but its email, schedule and save buttons only show a demo notice.
- **"Submit to Research IT"** on the slate has no handler, and there's no cross-device "save and continue later".
- **Tier workflow steps.**  `tier-workflow.yaml` compiles and its gating is tested, but nothing renders it yet.
- **Multi-session drafts, folder sync, the policy concept graph and a backend API.**  These are designed or planned for V1.1 through V2.0.

**Tests:** `npm test` runs the Vitest unit suite.  CI doesn't run it, so run it before you push.  There's no end-to-end suite; the Playwright persona sessions (`npm run persona-session`) drive a live target.

## Where It Runs

| Environment | URL | Deploys |
|-------------|-----|---------|
| Staging | https://openresearchdataplanner.dev.xram.net | Automatically on push to `main` (Woodpecker, on xdocker01) |
| Production | Not live | The pipeline fires on a tag and targets xdroplet02, but no production domain has been picked |

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:4000 in your browser.

## For Users

See the [User Guide](docs/USERGUIDE.md) for a complete walkthrough.

### Key Features

- **Tier Questionnaire** — Answer a few questions to determine your data classification
- **Help Me Estimate** — Calculators that translate research concepts (images, samples) to infrastructure units (TB, GPU-hours)
- **Compare Options** — Side-by-side service comparison within categories
- **Terminology Tooltips** — Click any underlined term for a plain-English explanation
- **Software Catalog** — Check what licensed software is available on each platform
- **Get Help** — Floating help with FAQ, office hours and contextual tips (contact buttons are demo-only for now)
- **AI Guide** — Decision applets for using AI tools with research data, including a clinical track (`/ai`)
- **IT Workbench** — Login, dashboard and plan review for IT staff (`/workbench`)

## For Administrators

This is a "fork and own" project. Clone it, customize the configuration for your institution, and deploy.

### Configuration

All institution-specific content lives in YAML files under `config/`:

| File | Purpose |
|------|---------|
| `meta.yaml` | Institution name, contacts, branding |
| `tiers.yaml` | Data security classifications (L1-L4) |
| `categories.yaml` | Service categories with comparison features |
| `services.yaml` | All services with pricing and tier availability |
| `bundles.yaml` | Pre-configured service combinations |
| `mappings.yaml` | Tier-to-service availability matrix |
| `acronyms.yaml` | Terminology for automatic annotation |
| `calculators.yaml` | Help Me Estimate calculator settings |
| `help.yaml` | Contact info and escape hatch config |
| `tier-questionnaire.yaml` | Data classification decision tree |
| `tier-workflow.yaml` | Approval process for L3/L4 data |
| `retention.yaml` | Data retention schedules |
| `software.yaml` | Licensed software catalog |
| `explainers.yaml` | Concept explainers and just-in-time nudges |
| `help-videos.yaml` | Help video catalog (compiled, not yet shown in the UI) |
| `legal.yaml` | Terms text: footer fine print, DMP legal framing |
| `dmp-templates/` | Handlebars templates for DMP output |
| `export-templates/` | Handlebars templates for slate/grant export |
| `ai-guidance/`, `clinical/` | AI Guide applet content (general + clinical tracks) |

See [Customization Guide](docs/ADMIN-GUIDE/CUSTOMIZE.md) for complete schemas and examples.

### Commands

```bash
npm run dev              # Start dev server (port 4000)
npm run validate:config  # Validate YAML files
npm run build:config     # Compile YAML → config.json
npm run build            # Production build to dist/
npm test                 # Vitest unit suite
```

### Deployment

The build output is static files. Deploy anywhere:
- nginx, Caddy, Apache
- GitHub Pages, Netlify, Vercel
- AWS S3 + CloudFront

The researcher UI needs no backend. The optional feedback widget posts to a small Node.js service (`services/feedback-api/`); the bundled Docker setup runs it behind Caddy — see [Docker deployment](docs/ADMIN-GUIDE/DOCKER.md).

## Documentation

| Document | Audience | Purpose |
|----------|----------|---------|
| [User Guide](docs/USERGUIDE.md) | Researchers | How to use the tool |
| [Customization Guide](docs/ADMIN-GUIDE/CUSTOMIZE.md) | Admins | Configuration reference |
| [Architecture](docs/ARCHITECTURE.md) | Developers | Technical overview |

### Feature Documentation

| Document | Feature |
|----------|---------|
| [EXPLORE-FIRST.md](docs/EXPLORE-FIRST.md) | Pre-wizard discovery tools |
| [CALCULATORS.md](docs/CALCULATORS.md) | Individual calculator UI specs |
| [CALCULATORS-IDENTIFICATION.md](docs/CALCULATORS-IDENTIFICATION.md) | Data identification status helper |
| [ELI5-IMPLEMENTATION.md](docs/ELI5-IMPLEMENTATION.md) | Calculator architecture |
| [COMPARISON-FEATURES.md](docs/COMPARISON-FEATURES.md) | Service comparison matrix |
| [TIER-QUESTIONNAIRE.md](docs/TIER-QUESTIONNAIRE.md) | Data classification helper |
| [SOFTWARE-CATALOG.md](docs/SOFTWARE-CATALOG.md) | Licensed software lookup |
| [TALK-TO-HUMAN.md](docs/TALK-TO-HUMAN.md) | Escape hatch system |
| [POST-WIZARD-ONBOARDING.md](docs/POST-WIZARD-ONBOARDING.md) | Next steps after wizard |
| [CONCEPT-GRAPH.md](docs/CONCEPT-GRAPH.md) | Policy governance framework |
| [MULTI-SESSION.md](docs/MULTI-SESSION.md) | Drafts and folder sync |
| [REQUEST-GATEWAY.md](docs/REQUEST-GATEWAY.md) | Ticketing system integration API |
| [V2-PLANNING.md](docs/V2-PLANNING.md) | Future roadmap |

## Design Principles

1. **Config-driven** — All content from YAML, no code changes for customization
2. **No backend for the researcher UI** — Static files, deployable anywhere; only the optional feedback widget needs a service
3. **Progressive disclosure** — Complex concepts revealed only when needed
4. **Escape hatches** — A path to human help on every step (live contact actions still to come)

## Important Notice

This tool generates draft content to assist with research planning. It does not provide legal, regulatory, or compliance advice. Tier classifications are illustrative — validate with your institution's IT security or research compliance office before making data management decisions. DMP output requires review by your research office before submission to any funding agency. Deployed under the MIT License, as-is, without warranty.

## License

MIT License - see [LICENSE](LICENSE)
