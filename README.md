# OpenResearchDataPlanner

**Self-service discovery for researchers. Informed requests for support teams.**

A guided planning tool that helps researchers select data infrastructure, estimate costs for grant budgets, and generate draft DMP text—while giving support teams complete, reviewable requests instead of vague asks.

**What it does:**
- Guides you through selecting services based on your data's security tier
- Calculates costs for your grant budget (including long-term retention)
- Generates draft Data Management Plan text as a starting point (always review and customize for your project)
- Explains unfamiliar terms and helps estimate requirements

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
- **Talk to a Human** — Escape hatch to email, schedule a call, or save progress

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
| `dmp-templates/` | Handlebars templates for DMP output |

See [Customization Guide](docs/CUSTOMIZE.md) for complete schemas and examples.

### Commands

```bash
npm run dev              # Start dev server (port 4000)
npm run validate:config  # Validate YAML files
npm run build:config     # Compile YAML → config.json
npm run build            # Production build to dist/
```

### Deployment

The build output is static files. Deploy anywhere:
- nginx, Caddy, Apache
- GitHub Pages, Netlify, Vercel
- AWS S3 + CloudFront

No backend required.

## Documentation

| Document | Audience | Purpose |
|----------|----------|---------|
| [User Guide](docs/USERGUIDE.md) | Researchers | How to use the tool |
| [Customization Guide](docs/CUSTOMIZE.md) | Admins | Configuration reference |
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
2. **Zero backend** — Fully static, deployable anywhere
3. **Progressive disclosure** — Complex concepts revealed only when needed
4. **Escape hatches** — Human help always accessible

## License

MIT License - see [LICENSE](LICENSE)
