# OpenResearchDataPlanner Spec Addendum

**Date:** 2026-02-04  
**Status:** Decisions finalized, ready to scaffold

## Resolved Open Questions

| # | Question | Resolution |
|---|----------|------------|
| 1 | YAML vs JSON for config | **YAML source → JSON at build**. YAML for human maintenance, JSON for runtime. Build script handles conversion + validation. |
| 2 | Template hot-reload in dev | **Not needed**. Manual refresh is fine. |
| 3 | Default institution config | **Include generation instructions**. Sample data will be built iteratively with Claude Code guidance for coverage. |
| 4 | Accessibility | **Yes**. Semantic HTML, ARIA labels, keyboard navigation, visible focus states. Standard best practices. |
| 5 | Mobile support | **Desktop-focused**. Functional on tablet, not optimized for phone. Too many moving parts for mobile-first. |

## Config Build Pipeline

### Approach: Single Merged File

All YAML configs compile to a single `dist/config.json` for simplicity. One fetch on app load, no lazy-loading complexity. Can revisit if config grows unwieldy (unlikely for research institutions).

### Build Script: `scripts/build-config.js`

```
config/                          dist/
├── meta.yaml                    └── config.json  (merged + validated)
├── categories.yaml                  {
├── tiers.yaml                         "meta": {...},
├── services.yaml          →           "categories": [...],
├── mappings.yaml                      "tiers": [...],
├── bundles.yaml                       "services": [...],
├── retention.yaml                     "mappings": [...],
└── dmp-templates/                     "bundles": [...],
    └── **/*.md                        "retention": {...},
                                       "dmpTemplates": {...}
                                     }
```

### Validation Rules

The build script will enforce referential integrity:

1. **Mappings → Services**: Every `mapping.service` must exist in `services[].slug`
2. **Mappings → Tiers**: Every `mapping.tier` must exist in `tiers[].slug`
3. **Bundles → Services**: Every `bundle.services[].service` must exist
4. **Services → Categories**: Every `service.category` must exist in `categories[].slug`
5. **Services → Archive**: If `service.archive_option.service_slug` is set, that service must exist
6. **DMP Templates**: Every `mapping.dmp_template` path must exist in `dmp-templates/`
7. **Retention → Tiers**: Every `retention.schedules[].applies_to_tiers` value must be valid

### NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run build:config && vite build",
    "build:config": "node scripts/build-config.js",
    "validate:config": "node scripts/build-config.js --validate-only",
    "preview": "vite preview"
  }
}
```

## Scaffold Plan

When you give the go-ahead, I'll create:

```
openresearchdataplanner/
├── README.md
├── LICENSE                      # MIT
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
│
├── scripts/
│   └── build-config.js          # YAML→JSON + validation
│
├── config/                      # YAML source (institution-specific)
│   ├── meta.yaml
│   ├── categories.yaml
│   ├── tiers.yaml
│   ├── services.yaml
│   ├── mappings.yaml
│   ├── bundles.yaml
│   ├── retention.yaml
│   └── dmp-templates/
│       └── _placeholder.md
│
├── sample-config/               # Generic example for new forks
│   └── (same structure)
│
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── assets/styles/main.css
│   ├── components/
│   │   ├── layout/
│   │   ├── wizard/
│   │   ├── services/
│   │   ├── results/
│   │   └── ui/
│   ├── composables/
│   ├── stores/
│   └── utils/
│
└── docs/
    ├── README.md
    ├── configuration.md
    └── deployment.md
```

Initial scaffold will include:
- Working Vite + Vue 3 + Pinia + Tailwind setup
- Config build script with validation
- Skeleton YAML configs (minimal but valid)
- Wizard shell with step navigation (components stubbed)
- localStorage persistence (save/restore session)
- Basic a11y: skip links, focus management, ARIA landmarks

**Not in initial scaffold** (next iterations):
- Full step implementations
- Cost calculation logic
- DMP generation
- Export functionality

## Next Steps

1. **Scaffold** → Get the project structure and tooling working
2. **Config iteration** → Build out realistic sample data with your guidance
3. **Wizard steps** → Implement each step, starting with tier select
4. **Cost engine** → Calculation logic with tests
5. **DMP generation** → Template rendering
6. **Export** → JSON session + Markdown outputs
7. **Polish** → Error handling, edge cases, documentation

Ready to scaffold when you are.
