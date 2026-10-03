# Admin Guide

Welcome to the OpenResearchDataPlanner administration guide. This folder contains everything you need to customize, deploy, and maintain OpenResearchDataPlanner for your institution.

---

## Start Here

**New to OpenResearchDataPlanner?** Start with the [Quickstart Guide](./QUICKSTART.md) - you'll have your own branded instance running in 15 minutes.

---

## Guide Overview

| Guide | Description | When to Use |
|-------|-------------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Fork, brand, deploy in 15 minutes | First-time setup |
| [CUSTOMIZE.md](./CUSTOMIZE.md) | Complete configuration reference | Adding services, tiers, bundles |
| [CALCULATOR-DEVELOPMENT.md](./CALCULATOR-DEVELOPMENT.md) | Build custom "Help Me Estimate" calculators | Domain-specific estimation tools |
| [VALIDATION.md](./VALIDATION.md) | Troubleshooting config errors | When `npm run build:config` fails |
| [DOCKER.md](./DOCKER.md) | Docker / Caddy deployment, feedback API | Container deployment |
| [UPGRADING.md](./UPGRADING.md) | Version migration guide | Pulling upstream changes |

---

## Quick Reference

### Directory Structure

```
config/
├── meta.yaml                 # Institution identity & branding
├── tiers.yaml                # Data security classifications
├── services.yaml             # Service definitions with pricing
├── bundles.yaml              # Pre-configured service combinations
├── mappings.yaml             # Tier-to-service availability
├── categories.yaml           # Service categories & comparison features
├── acronyms.yaml             # Terminology for auto-annotation
├── calculators.yaml          # Help Me Estimate settings
├── help.yaml                 # Contact info & help escape hatch
├── tier-questionnaire.yaml   # Data classification questions
├── tier-workflow.yaml        # Compliance approval processes
├── retention.yaml            # Data retention schedules
├── software.yaml             # Licensed software catalog
├── help-videos.yaml          # Embedded help video configuration
├── legal.yaml                # Terms, disclaimers, per-tier legal notices
├── explainers.yaml           # Concept explainers + just-in-time nudges
├── dmp-templates/            # Handlebars templates for DMP output
├── export-templates/         # Handlebars template for the slate export
├── ai-guidance/              # AI guidance applet configs (/ai)
└── clinical/                 # Clinical guidance applet configs
```

Every top-level `.yaml` above must exist — `npm run build:config` exits with `Config file not found` if one is missing.

### Essential Commands

```bash
# Validate configuration
npm run validate:config

# Build config + preview
npm run build:config && npm run dev

# Production build
npm run build
```

---

## Examples

The [examples/minimal-config/](./examples/minimal-config/) directory contains stripped-down versions of five files (`meta`, `tiers`, `services`, `mappings`, `bundles`) with:
- 3 services
- 2 tiers
- 1 bundle

Use it as a reference, not a complete drop-in: copy those files over the demo config and keep the rest. Because it uses its own tier slugs (`standard`, `sensitive`), you must also update the tier slugs in `retention.yaml` (`applies_to_tiers`) before validation passes, and the services rely on the demo `categories.yaml` defining `compute` and `storage`.

---

## Related Documentation

These docs cover specific features in depth:

- [ELI5-IMPLEMENTATION.md](../ELI5-IMPLEMENTATION.md) - Acronym system, calculators, compliance workflow
- [SOFTWARE-CATALOG.md](../SOFTWARE-CATALOG.md) - Software availability matrix
- [TALK-TO-HUMAN.md](../TALK-TO-HUMAN.md) - Help escape hatch design

---

## Need Help?

- **GitHub Issues:** For bugs and feature requests
- **GitHub Discussions:** For questions and customization help
- **Your RC Team:** For institution-specific questions
