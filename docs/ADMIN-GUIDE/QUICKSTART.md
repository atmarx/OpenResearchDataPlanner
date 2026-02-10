# Quickstart Guide

Get your own branded OpenResearchDataPlanner running in 15 minutes.

---

## Prerequisites

- Node.js 18+ and npm
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
  general: "research-it@contoso.edu"
  security: "data-security@contoso.edu"
  consultation_url: "https://contoso.edu/research-it/consult"

version: "1.0.0"
schema_version: "1.0"               # For upgrade compatibility
last_updated: "2024-01-15"
```

If you have a logo, add it to `public/images/logo.svg`.

---

## Step 3: Define Your Tiers (3 min)

Most institutions use 3-4 tiers. Edit `config/tiers.yaml`:

```yaml
# config/tiers.yaml

tiers:
  - slug: public
    name: "Public"
    short_name: "Public"
    description: "Non-sensitive, publishable data"
    color: "green"
    examples:
      - "Published datasets"
      - "Public domain images"
    self_service: true

  - slug: internal
    name: "Internal"
    short_name: "Internal"
    description: "Pre-publication research data"
    color: "yellow"
    examples:
      - "Unpublished experimental results"
      - "Proprietary methods"
    self_service: true

  - slug: regulated
    name: "Regulated"
    short_name: "Regulated"
    description: "PHI, FERPA, PII - requires compliance controls"
    color: "orange"
    examples:
      - "Patient medical records"
      - "Student education records"
    consultation_required: true
    show_workflow_modal: true

default_tier: internal
```

---

## Step 4: Add Your First Services (5 min)

Replace the demo services in `config/services.yaml` with your own. Here's a minimal example:

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

    available_tiers:
      - public
      - internal

    cost_model:
      type: unit
      unit: "SU"
      price: 0.05
      billing_period: usage

    estimation:
      unit: "SU"
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

    available_tiers:
      - public
      - internal

    cost_model:
      type: tiered
      unit: "TB"
      billing_period: month
      tiers:
        - up_to: 1
          price: 0
          note: "First 1 TB free"
        - up_to: 10
          price: 10
        - above: 10
          price: 8

    subsidies:
      - slug: free-tier
        name: "Free Tier"
        discount_type: free_units
        discount_value: 1
        auto_apply: true

    estimation:
      unit: "TB"
      prompt: "How much storage?"
      default_value: 5

    documentation_url: "https://storage.contoso.edu"

  - slug: hipaa-storage
    name: "HIPAA Storage"
    category: storage
    description: "Encrypted storage for regulated data"

    available_tiers:
      - regulated

    cost_model:
      type: unit
      unit: "TB"
      price: 25
      billing_period: month

    compliance:
      - hipaa
      - baa

    documentation_url: "https://storage.contoso.edu/hipaa"
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
- Multiple cost models (unit, tiered, subscription, consultation)
- Subsidies and bulk discounts
- DMP templates

### Create Bundles

Pre-configured service combinations in `config/bundles.yaml`:

```yaml
bundles:
  - slug: starter
    name: "HPC Starter"
    description: "Everything to get started with HPC"
    services:
      - service: hpc-compute
        default_estimate: 10000
      - service: research-storage
        default_estimate: 1
    estimated_monthly_cost: 0
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

Popular options:
- GitHub Pages
- Netlify
- Vercel
- S3 + CloudFront
- Your existing web infrastructure
