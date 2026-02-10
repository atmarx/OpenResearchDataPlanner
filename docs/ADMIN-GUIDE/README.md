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
└── dmp-templates/            # Handlebars templates for DMP output
```

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

The [examples/minimal-config/](./examples/minimal-config/) directory contains a stripped-down configuration with:
- 3 services
- 2 tiers
- 1 bundle

Use this as a reference for the minimum viable configuration.

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
