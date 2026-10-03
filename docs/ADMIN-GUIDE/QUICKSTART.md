# Quickstart Guide

Get your own branded OpenResearchDataPlanner running in 15 minutes.

---

## Prerequisites

- Node.js 20+ and npm (`marked`, `sharp`, and `vitest` all require Node 20)
- Git
- A text editor

---

## Step 1: Fork and Clone (2 min)

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR-ORG/OpenResearchDataPlanner.git
cd OpenResearchDataPlanner
npm install
```

Verify it works:

```bash
npm run dev
```

Visit http://localhost:4000 - you should see the Northwinds University demo.

---

## Step 2: Rebrand (3 min)

Edit `config/meta.yaml`:

```yaml
# config/meta.yaml

institution:
  name: "Contoso College"           # Your institution name
  short_name: "Contoso"             # Abbreviated name
  logo: "/images/logo.svg"          # Optional: path in public/

site:
  title: "Research Data Planner"
  tagline: "Plan your data infrastructure and budget for grant proposals"

contact:
  primary:
    type: "email"                       # "email" or "url"
    value: "research-it@contoso.edu"
    label: "research-it@contoso.edu"    # Display text for the link
  security: "data-security@contoso.edu"
  consultation_url: "https://contoso.edu/research-it/consult"

version: "1.0.0"
schema_version: "1.0"               # For upgrade compatibility
last_updated: "2026-04-17"
```

If you have a logo, add it to `public/images/logo.svg`.

---

## Step 3: Define Your Tiers (3 min)

Most institutions use 3-4 tiers. Edit `config/tiers.yaml`. Change the names, descriptions, and examples freely, but **keep the demo's tier slugs** (`low`, `medium`, `high`, `restricted`) unless you're ready to chase them through the rest of the config — see the note below.

```yaml
# config/tiers.yaml

tiers:
  - slug: low
    name: "Public"
    short_name: "Public"
    sort_order: 1
    color: "green"
    description: "Non-sensitive, publishable data"
    examples:
      - "Published datasets"
      - "Public domain images"
    consultation_required: false
    retention_questions_required: false

  - slug: medium
    name: "Internal"
    short_name: "Internal"
    sort_order: 2
    color: "yellow"
    description: "Pre-publication research data"
    examples:
      - "Unpublished experimental results"
      - "Proprietary methods"
    consultation_required: false
    retention_questions_required: false

  - slug: high
    name: "Regulated"
    short_name: "Regulated"
    sort_order: 3
    color: "orange"
    description: "PHI, FERPA, PII - requires compliance controls"
    examples:
      - "Patient medical records"
      - "Student education records"
    # true would END the wizard at a consultation step for this tier —
    # researchers would never reach service selection. Leave it false when
    # the tier has self-service options (approval is set per mapping instead).
    consultation_required: false
    retention_questions_required: true
```

> **Tier slugs are referenced elsewhere.** `bundles.yaml` (`recommended_tiers`), `retention.yaml` (`applies_to_tiers`), `mappings.yaml`, `legal.yaml` (`tier_notices`), and `tier-questionnaire.yaml` (`sets_tier`) all name tiers by slug, and the questionnaire's tier ranking in `src/lib/classifyTier.js` only knows `low`/`medium`/`high`/`restricted`. The example above drops the demo's `restricted` tier, so also remove `restricted` from the `applies_to_tiers` lists in `config/retention.yaml` — otherwise `npm run validate:config` fails with `Retention schedule "export-control" references unknown tier: "restricted"`.

---

## Step 4: Add Your First Services (5 min)

Replace the demo services in `config/services.yaml` with your own. Define each service once — tier availability is wired separately in `mappings.yaml`.

```yaml
# config/services.yaml

services:
  # ===================
  # COMPUTE
  # ===================

  - slug: hpc-compute
    name: "HPC Compute"
    category: compute
    description: "Campus cluster compute time"

    cost_model:
      type: unit
      unit: "SU"
      unit_label: "SU"
      price: 0.05

    estimation:
      unit_display: "SU"
      prompt: "How many Service Units?"
      default_value: 10000

    documentation_url: "https://hpc.contoso.edu/docs"

  # ===================
  # STORAGE
  # ===================

  - slug: research-storage
    name: "Research Storage"
    category: storage
    description: "Shared storage for active research"

    cost_model:
      type: tiered
      unit: "TB"
      unit_label: "TB"
      tiers:                            # marginal bands; up_to = cumulative ceiling
        - up_to: 10
          price: 10
        - up_to: null                   # null = unbounded top band
          price: 8

    subsidies:                          # first 1 TB free (comes off before banding)
      - slug: free-tier
        name: "Free Tier"
        description: "First 1 TB included"
        discount_type: free_units
        discount_value: 1
        auto_apply: true

    estimation:
      unit_display: "TB"
      prompt: "How much storage?"
      default_value: 5

    documentation_url: "https://storage.contoso.edu"

  - slug: hipaa-storage
    name: "HIPAA Storage"
    category: storage
    description: "Encrypted storage for regulated data"

    cost_model:
      type: unit
      unit: "TB"
      unit_label: "TB"
      price: 25

    documentation_url: "https://storage.contoso.edu/hipaa"
```

Now wire each service to the tiers that can use it in `config/mappings.yaml`:

```yaml
# config/mappings.yaml
# If a service-tier pair isn't listed here, that service is hidden for that tier.

mappings:
  - service: hpc-compute
    tier: low
    approval: automatic

  - service: hpc-compute
    tier: medium
    approval: automatic

  - service: research-storage
    tier: low
    approval: automatic

  - service: research-storage
    tier: medium
    approval: automatic

  - service: hipaa-storage
    tier: high
    approval: consultation
    approval_contact: "data-security@contoso.edu"
```

See [CUSTOMIZE.md](./CUSTOMIZE.md#mappingsyaml) for optional mapping fields (`notes`, `dmp_template`, `compliance` metadata).

Finally, the demo `config/bundles.yaml` references the Northwinds services you just replaced, so validation will fail until you clear it. Start with an empty list and add your own bundles later (see [Create Bundles](#create-bundles)):

```yaml
# config/bundles.yaml
bundles: []
```

---

## Step 5: Validate and Preview (2 min)

```bash
# Validate your config
npm run validate:config

# If validation passes, build and preview
npm run build:config
npm run dev
```

Fix any validation errors (see [VALIDATION.md](./VALIDATION.md) for common issues).

---

## Checklist

Before going live:

- [ ] Institution name and contact info updated in `meta.yaml`
- [ ] Logo added (optional)
- [ ] Tiers match your data classification policy
- [ ] At least 2-3 services defined with accurate pricing
- [ ] Service tier mappings make sense
- [ ] `npm run build:config` passes without errors
- [ ] Manual walkthrough of the wizard works

---

## What's Next?

### Add More Services

See [CUSTOMIZE.md](./CUSTOMIZE.md) for the complete service schema including:
- Comparison features for side-by-side comparison
- Cost models (`unit`, `tiered`, `consultation`)
- Subsidies and bulk discounts
- DMP templates

### Create Bundles

Pre-configured service combinations in `config/bundles.yaml`:

```yaml
bundles:
  - slug: starter
    name: "HPC Starter"
    description: "Everything to get started with HPC"
    recommended_tiers:
      - low
      - medium
    services:
      - service: hpc-compute
        default_estimate: 10000
      - service: research-storage
        default_estimate: 1
```

### Add Software Catalog

List licensed software available on your systems in `config/software.yaml`.

### Build Custom Calculators

Domain-specific estimation tools - see [CALCULATOR-DEVELOPMENT.md](./CALCULATOR-DEVELOPMENT.md).

---

## Deployment

Deploy the `dist/` folder to any static host:

```bash
npm run build
# Deploy contents of dist/ to your web server
```

The app uses HTML5 history routing, so configure your host to serve `index.html` for unknown paths (SPA fallback) — otherwise deep links like `/services` or `/workbench` 404 on refresh. The feedback widget needs the separate feedback API (see [DOCKER.md](./DOCKER.md)); on a pure static host, set `feedback.enabled: false` in `meta.yaml`.

Popular options:
- GitHub Pages
- Netlify
- Vercel
- S3 + CloudFront
- Your existing web infrastructure
