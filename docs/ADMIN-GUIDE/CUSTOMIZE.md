# Customization Guide

> **New to OpenResearchDataPlanner?** Start with [QUICKSTART.md](./QUICKSTART.md) for a 15-minute setup guide.

This guide is the complete reference for customizing OpenResearchDataPlanner for your institution. All institutional data, service definitions, terminology, and explanatory text are config-driven via YAML files.

**Design principle:** Only concepts and workflows are hard-coded. All data and explanatory language stems from YAML configuration.

---

## Related Guides

| Guide | Use When |
|-------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | First-time setup |
| [VALIDATION.md](./VALIDATION.md) | Troubleshooting config errors |
| [CALCULATOR-DEVELOPMENT.md](./CALCULATOR-DEVELOPMENT.md) | Building custom estimators |
| [DOCKER.md](./DOCKER.md) | Container deployment + feedback API |
| [UPGRADING.md](./UPGRADING.md) | Pulling upstream changes |
| [examples/minimal-config/](./examples/minimal-config/) | Minimal working reference |

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Files Overview](#configuration-files-overview)
3. [Core Configuration](#core-configuration)
   - [meta.yaml](#metayaml) - Institution identity
   - [tiers.yaml](#tiersyaml) - Data security classifications
   - [categories.yaml](#categoriesyaml) - Service categories
   - [services.yaml](#servicesyaml) - Service definitions
   - [bundles.yaml](#bundlesyaml) - Pre-configured combinations
   - [mappings.yaml](#mappingsyaml) - Tier-to-service availability
4. [Help & Explanation System](#help--explanation-system)
   - [acronyms.yaml](#acronymsyaml) - Terminology definitions
   - [calculators.yaml](#calculatorsyaml) - Help Me Estimate calculators
   - [help.yaml](#helpyaml) - Contact & escape hatch config
5. [Compliance & Workflow](#compliance--workflow)
   - [tier-questionnaire.yaml](#tier-questionnaireyaml) - Data classification questions
   - [tier-workflow.yaml](#tier-workflowyaml) - Approval process details
   - [retention.yaml](#retentionyaml) - Data retention schedules
6. [Software Catalog](#software-catalog)
   - [software.yaml](#softwareyaml) - Licensed software catalog
7. [Legal, Explainers & Guidance](#legal-explainers--guidance)
8. [DMP Templates](#dmp-templates)
9. [Validation & Deployment](#validation--deployment)
10. [Common Customizations](#common-customizations)

---

## Quick Start

1. Fork or clone the repository
2. Edit files in `config/`
3. Run `npm run build:config` to validate
4. Deploy

```bash
# Validate configuration
npm run validate:config

# Build with config
npm run build:config

# Full production build
npm run build
```

---

## Configuration Files Overview

All configuration lives in `config/`:

```
config/
├── meta.yaml                 # Institution identity & contacts
├── tiers.yaml                # Data security classifications
├── categories.yaml           # Service categories with comparison features
├── services.yaml             # All service definitions
├── bundles.yaml              # Pre-configured service combinations
├── mappings.yaml             # Tier-to-service availability matrix
├── acronyms.yaml             # Terminology for auto-annotation
├── calculators.yaml          # Help Me Estimate calculator settings
├── help.yaml                 # Contact info & help escape hatch
├── tier-questionnaire.yaml   # Data classification decision tree
├── tier-workflow.yaml        # Compliance approval processes
├── retention.yaml            # Data retention schedules
├── software.yaml             # Licensed software catalog
├── help-videos.yaml          # Help video catalog (not rendered yet)
├── legal.yaml                # Terms, disclaimers, per-tier legal notices
├── explainers.yaml           # Plain-language explainers + just-in-time nudges
├── dmp-templates/            # Handlebars templates for DMP output
│   ├── hpc-compute/
│   ├── hpc-storage/
│   ├── cloud-compute/
│   ├── cloud-storage/
│   └── ...                   # any layout; mappings reference template paths
├── export-templates/         # slate-export.md.hbs (Markdown export)
├── ai-guidance/              # AI guidance applet configs (/ai)
└── clinical/                 # Clinical guidance applet configs
```

**How files become config keys.** `scripts/build-config.js` loads each top-level file into `public/config.json` under its basename with hyphens turned into underscores (`tier-questionnaire.yaml` → `config.tier_questionnaire`). If the file has a root key named after itself (`tiers:` in `tiers.yaml`), that key is unwrapped; otherwise the whole document is used (`meta`, `retention`, `help`, ...). `software.yaml` and `acronyms.yaml` keep their full structure. The directories become `dmpTemplates`, `exportTemplates`, `aiGuidance`, and `clinicalGuidance`.

**Every top-level file is required.** A missing one stops the build with `Config file not found`. A new `.yaml` file in `config/` is ignored unless it's added to `CONFIG_FILES` in `scripts/build-config.js`.

---

## Core Configuration

### meta.yaml

Institution identity, branding, contacts, footer links, cost/F&A settings, AI disclosure, and feedback.

```yaml
# config/meta.yaml

institution:
  name: "Northwinds University"
  short_name: "Northwinds"
  logo: "/images/northwinds_horizontal.png"        # Header logo (path under public/)
  footer_logo: "/images/northwinds_logo.png"       # Crest shown in the footer

site:
  title: "Research Data Planner"                   # Header + welcome page title
  tagline: "Self-service discovery for researchers. Informed requests for support teams."

# Visual branding & theming
branding:
  # Welcome-page hero images. With 2+ entries users get a picker in the gear
  # menu. Each entry: image (required), thumb, caption, credit.
  # (A legacy single `hero_background: "/path.png"` string still works.)
  hero_backgrounds:
    - image: "/images/backgrounds/college.webp"
      thumb: "/images/backgrounds/thumbs/college.webp"
      caption: "Northwinds University"
      credit: "Northwinds University"
  hero_overlay: 0.4               # 0 = no darkening, 1 = fully dark
  # Built-in skin booted as the default theme (users can switch in-app).
  # Options: northwinds | highcontrast | (omit for the ODP default)
  default_skin: northwinds
  # Override theme colors with inline CSS custom properties (or null)
  custom_css: null
  # External stylesheet loaded after the main styles (or null)
  custom_css_url: null

contact:
  # Primary support — appears in the footer as "Questions? [label]"
  primary:
    type: "email"                                  # "email" or "url"
    value: "rc-help@northwinds.edu"
    label: "rc-help@northwinds.edu"                # Display text for the link

  # Security/compliance inquiries (also the consultation-step fallback
  # when a tier has no consultation_contact)
  security: "research-security@northwinds.edu"

  # Consultation booking
  consultation_url: "https://northwinds.edu/research-computing/consult"

# Footer policy links — a plain list; add, remove, or reorder freely.
# (The legacy object form { privacy: url, ... } still renders.)
links:
  - label: "Privacy Notice"
    url: "https://northwinds.edu/privacy"
  - label: "Data Classification Policy"
    url: "https://rcd.northwinds.edu/policies/data-classification"

# Base URL that explainers.yaml full_guide.corpus_path values resolve
# against. null hides the "read the full guide" links.
governance_corpus_url: "https://rcd.northwinds.edu"

# Shown wherever dollar figures appear (slate, results, exports)
cost_disclaimer:
  short: "Planning estimate, not a quote — prices are subject to change."
  long: |
    These figures are planning estimates, not a quote for services. ...

# F&A in the slate export. default_rate is applied to the whole direct
# total; rate_label / rate_basis / note / policy_url are display only.
indirect_costs:
  default_rate: 0.54
  rate_label: "54%"
  rate_basis: "MTDC"
  sponsor_rates: []               # Not read by the app yet
  note: |
    Indirect costs (F&A) are calculated at the federally negotiated rate.
  policy_url: "https://northwinds.edu/research/indirect-costs"

# AI-assistance disclosure: first-visit banner, footer line, /about-ai page
ai_disclosure:
  enabled: true
  assistant: "Claude (Anthropic)"   # Substituted for {assistant}; "" drops the vendor mention
  banner:
    title: "About This Tool"
    message: |
      Research Data Planner was built with agentic coding assistance from {assistant}. ...
    learn_more_label: "Learn more"
    report_issue_url: "https://github.com/your-org/your-fork/issues"
    report_issue_label: "Report an issue"
  footer:
    text: "Built with agentic coders — every change reviewed by Research IT."
    learn_more_label: "Learn more"
    feedback_label: "Share your feedback"
  about_page:
    intro: "How we used AI to build this tool, and why transparency matters."
    citation: |
      Research Data Planner. (2024-2026). Developed by {institution} with AI coding
      assistance from {assistant}.

# Feedback widgets — require the feedback-api service (see DOCKER.md).
# api_key must match the service's API_KEY_WRITE. Set enabled: false on a
# pure static host.
feedback:
  enabled: true
  api_url: "/api/v1"
  api_key: "changeme-write"

# App versioning
version: "1.0.0"                 # Echoed in the DMP footer and exports
schema_version: "1.0"            # Config schema version (informational; not checked by the build)
last_updated: "2026-06-25"       # Informational only — not read by the app
```

---

### tiers.yaml

Data security classifications. Most institutions use 3-4 tiers aligned with their data governance policy.

```yaml
# config/tiers.yaml

tiers:
  - slug: low
    name: "Low (Public Data)"
    short_name: "L1"
    sort_order: 1                   # Display order in the wizard and matrix
    color: "green"                  # green, yellow, orange, red
    description: |
      Public or non-sensitive research data
    types_of_data:                  # Shown on the tier card
      - "Public datasets"
      - "Open source code and models"
      - "Synthetic or simulated data"
    examples:                       # Shown on the tier card
      - "Published datasets"
      - "Public domain images"
      - "Non-sensitive simulations"
    requirements:                   # Shown on the tier card
      - "Standard university authentication"
      - "Basic access controls"
    help_text: |
      Shown when this tier is selected to help users confirm their choice.

    # Workflow implications
    consultation_required: false        # Skip the consultation step in the wizard
    retention_questions_required: false # Skip the retention questions step

  - slug: medium
    name: "Medium (Internal Data)"
    short_name: "L2"
    sort_order: 2
    color: "yellow"
    description: |
      Pre-publication research, proprietary methods
    types_of_data:
      - "Pre-publication research data"
      - "Proprietary analysis methods"
    examples:
      - "Unpublished experimental results"
      - "Internal collaboration data"
    requirements:
      - "University authentication required"
      - "Project-based access controls"
    help_text: |
      Choose this tier if your data has IP value but isn't regulated.

    consultation_required: false
    retention_questions_required: false

  - slug: high
    name: "High (Regulated Data)"
    short_name: "L3"
    sort_order: 3
    color: "orange"
    description: |
      PHI, FERPA, PII - requires compliance controls
    types_of_data:
      - "Protected Health Information (PHI)"
      - "Student education records (FERPA)"
      - "Personally Identifiable Information (PII)"
    examples:
      - "Patient medical records (HIPAA/PHI)"
      - "Student education records (FERPA)"
      - "Identifiable human subjects data"
    requirements:
      - "HIPAA-compliant infrastructure"
      - "IRB approval documentation"
      - "Audit logging enabled"
    help_text: |
      This tier requires additional retention planning.

    consultation_required: false       # Regulated tiers often skip consultation when services are pre-approved
    retention_questions_required: true # Ask retention questions for regulated data

  - slug: restricted
    name: "Restricted (Export-Controlled)"
    short_name: "L4"
    sort_order: 4
    color: "red"
    description: |
      ITAR, EAR, CUI - requires dedicated infrastructure
    types_of_data:
      - "Controlled Unclassified Information (CUI)"
      - "ITAR-controlled defense data"
    examples:
      - "Defense research data (ITAR)"
      - "Export-controlled technology (EAR)"
    requirements:
      - "Isolated secure enclave"
      - "NIST 800-171 compliance"
      - "US persons only access"
    help_text: |
      Projects at this tier require consultation with the security team.

    consultation_required: true       # ENDS the wizard here: welcome -> tier -> consultation step;
                                      # no service selection, estimate, or results for this tier
    retention_questions_required: true
    consultation_message: |           # Shown on the consultation step (Markdown)
      Projects at this tier require a consultation with the Research
      Security team to determine appropriate controls and budget.
    consultation_contact: "security@example.edu"  # Falls back to meta.contact.security
```

> **Tier slugs matter beyond this file.** The questionnaire's upgrade-only ranking (`src/lib/classifyTier.js`) and the Service Matrix compliance badges (`src/views/ServiceMatrix.vue`, which reads `high`/`restricted` mappings) are keyed to the demo slugs `low`, `medium`, `high`, `restricted`. Renaming slugs also means updating `mappings.yaml`, `bundles.yaml`, `retention.yaml`, `legal.yaml` (`tier_notices`), and `tier-questionnaire.yaml`. Keep the four slugs and change `name`/`short_name` unless you're prepared to do all of that.

> **Note on fields:** Only the fields above are read by the app. You may see older example configs with `icon`, `self_service`, `security_review_required`, `typical_provisioning_time`, `show_workflow_modal`, `compliance_types`, `warnings`, or a top-level `default_tier` — none of those are wired into the current Vue components. Adding them won't cause errors, but they won't affect behavior either.

---

### categories.yaml

Service categories organize services and define comparison features for side-by-side comparison.

```yaml
# config/categories.yaml

categories:
  - slug: compute
    name: "Compute"
    description: "Processing and analysis resources"
    icon: "cpu"
    sort_order: 1

    # Features for the comparison modal
    # Users see these as rows when comparing services
    comparison_features:
      - key: gpu_available
        label: "GPU Available"
        description: "Access to GPU accelerators for ML and simulation"
      - key: batch_jobs
        label: "Batch Jobs"
        description: "Submit jobs to run unattended"
      - key: interactive
        label: "Interactive Use"
        description: "Live, interactive sessions"
      - key: auto_scaling
        label: "Auto-Scaling"
        description: "Automatically scale resources up/down"
      - key: cost_predictable
        label: "Predictable Cost"
        description: "Fixed or easy-to-estimate pricing"
      - key: beginner_friendly
        label: "Beginner Friendly"
        description: "Easy to get started without specialized knowledge"
      - key: high_tier_data
        label: "High-Tier Data"
        description: "Approved for regulated/PHI data (L3+)"
      - key: free_tier
        label: "Free Tier"
        description: "No-cost option available"

  - slug: storage
    name: "Storage"
    description: "Data storage and management"
    icon: "database"
    sort_order: 2

    comparison_features:
      - key: hpc_mounted
        label: "HPC Access"
        description: "Directly accessible from HPC cluster"
      - key: high_throughput
        label: "High Throughput"
        description: "Fast for large data transfers"
      - key: snapshots
        label: "Snapshots/Backup"
        description: "Version history or automatic backups"
      - key: collaboration
        label: "Collaboration"
        description: "Easy sharing with team members"
      - key: external_sharing
        label: "External Sharing"
        description: "Share outside institution"
      - key: large_files
        label: "Large Files"
        description: "Handles very large files (>4GB)"
      - key: high_tier_data
        label: "High-Tier Data"
        description: "Approved for regulated/PHI data (L3+)"
      - key: free_allocation
        label: "Free Allocation"
        description: "No-cost storage included"

  - slug: environment
    name: "Environments"
    description: "Dedicated workspaces and VMs"
    icon: "monitor"
    sort_order: 3

    comparison_features:
      - key: dedicated_resources
        label: "Dedicated Resources"
        description: "Guaranteed CPU/RAM allocation"
      - key: gui_desktop
        label: "GUI Desktop"
        description: "Graphical desktop interface"
      - key: web_accessible
        label: "Web Accessible"
        description: "Access from browser without VPN"
      - key: admin_control
        label: "Admin Control"
        description: "Install your own software"
      - key: high_tier_data
        label: "High-Tier Data"
        description: "Approved for regulated/PHI data (L3+)"
      - key: scalable
        label: "Scalable"
        description: "Can increase resources as needed"
      - key: preconfigured_software
        label: "Pre-configured"
        description: "Research software pre-installed"
      - key: cost_predictable
        label: "Predictable Cost"
        description: "Fixed monthly pricing"

  - slug: external
    name: "National Resources"
    description: "ACCESS and other external programs"
    icon: "globe"
    sort_order: 4

    comparison_features:
      - key: free_nsf
        label: "NSF Funded"
        description: "No cost to US researchers"
      - key: merit_based
        label: "Merit-Based"
        description: "Requires allocation application"
      - key: national_scale
        label: "National Scale"
        description: "Access to top supercomputing centers"
      - key: gpu_available
        label: "GPU Available"
        description: "Access to GPU accelerators"
      - key: large_scale
        label: "Large Scale"
        description: "Massive compute capacity"
      - key: beginner_friendly
        label: "Beginner Friendly"
        description: "Lower tiers easy to obtain"
```

> **Category `icon`** is looked up in a small map in `ServiceSelectStep.vue`: `cpu`, `hard-drive`, `cloud`, `box`, `life-buoy`. Any other name (e.g. `database`, `monitor`, `globe` above) falls back to the `box` icon. The compare button only appears for a category when it has `comparison_features` **and** at least two services available at the selected tier carry `comparison_features`.

---

### services.yaml

Service definitions — pricing, estimation UI, and comparison-matrix feature values.

**Tier availability is NOT defined here** — it's configured in `mappings.yaml` (see below). That separation lets you add a service once and control which tiers see it from a single file.

```yaml
# config/services.yaml

services:
  # ============================================================
  # Tiered-pricing unit service (per-unit rate, volume discounts)
  # ============================================================

  - slug: hpc-compute
    fa_exempt: true                              # Optional — internal service center flag (metadata, not yet rendered)
    name: "HPC Compute (CPU)"
    category: compute                            # Must match a category slug in categories.yaml
    description: "CPU compute on SLURM cluster for batch workloads"
    long_description: |
      CPU-focused compute on our SLURM-managed HPC cluster. Supports
      genomics pipelines, data processing, and parallel workloads.
      Billed per core-hour with tiered volume discounts.
    documentation_url: "https://docs.rc.northwinds.edu/hpc"

    # Comparison-matrix feature values (keys must match categories.yaml features)
    # Each feature: value ∈ {full, partial, none}, plus optional detail string
    comparison_features:
      gpu_available:
        value: none
        detail: "CPU-only; see HPC GPU"
      batch_jobs:
        value: full
      interactive:
        value: partial
        detail: "4-hour interactive limit"
      cost_predictable:
        value: full
        detail: "Tiered per-SU pricing"

    cost_model:
      type: tiered                               # "unit" | "tiered" | "consultation"
      unit: "core-hour"                          # Internal unit identifier
      unit_label: "CPU Core Hour"                # Display label (shown in UI)
      tiers:                                     # Marginal bands: each up_to is a cumulative ceiling
        - up_to: 10000                           # Rate applies up to this quantity
          price: 0.08
          label: "Standard"
        - up_to: 100000
          price: 0.06
          label: "Volume"
        - up_to: null                            # null = unbounded top tier
          price: 0.04
          label: "High Volume"

    subsidies: []                                # No auto-applied subsidies
    archive_option: null                         # No paired archive service

    # Optional cross-sell (metadata, not yet rendered in wizard)
    recommended_with:
      - service: hpc-storage
        reason: "Persistent storage required — BeeGFS scratch is ephemeral"

    estimation:
      prompt: "How many CPU core-hours do you expect per month?"
      default_value: 10000
      min_value: 1000
      max_value: 1000000
      step: 1000
      presets:
        - label: "Light"
          value: 5000
          description: "Small jobs, occasional use"
        - label: "Moderate"
          value: 25000
          description: "Regular multi-node jobs"
        - label: "Heavy"
          value: 100000
          description: "Continuous large-scale workloads"

  # ============================================================
  # Flat unit-rate service with paired archive + auto subsidy
  # ============================================================

  - slug: research-storage
    fa_exempt: true
    name: "Research Storage"
    category: storage
    description: "Shared storage for active research data (parallel filesystem)"
    long_description: |
      GPFS-based parallel filesystem mounted on HPC cluster and available
      via Globus. Includes daily snapshots with 30-day retention.
    documentation_url: "https://docs.rc.northwinds.edu/storage/research"

    comparison_features:
      hpc_mounted:
        value: full
      snapshots:
        value: full
        detail: "Daily, 30-day retention"

    cost_model:
      type: unit
      unit: "TB"
      unit_label: "TB"
      price: 5.00                                # Flat monthly rate per unit

    # Auto-applied subsidy — reduces billable units (first 1 TB free)
    subsidies:
      - name: "Base Allocation"
        auto_apply: true
        discount_type: free_units
        discount_value: 1

    # Pair this service with an archive service (shown as "also archive?" in wizard)
    archive_option:
      service_slug: archive-storage              # Must match another service's slug
      description: "Archive cold data to tape for long-term retention"

    estimation:
      prompt: "How much active storage do you need?"
      default_value: 5
      min_value: 1
      max_value: 500
      step: 1

  # ============================================================
  # Consultation service (no self-service price, contact required)
  # ============================================================

  - slug: cloud-high-security
    name: "Cloud High-Security (HIPAA/PHI)"
    category: compute
    description: "HIPAA-compliant cloud environment for regulated data"
    long_description: |
      Managed cloud environment with BAA, encryption at rest, audit logging,
      and compliance controls. Pricing varies by requirements — contact for quote.
    documentation_url: "https://docs.rc.northwinds.edu/cloud/high-security"

    comparison_features:
      high_tier_data:
        value: full
        detail: "HIPAA BAA in place"
      cost_predictable:
        value: partial
        detail: "Depends on usage"

    cost_model:
      type: consultation                         # Signals "contact sales" — no estimate UI
      unit_label: "Consultation"

    subsidies: []
    archive_option: null
    estimation: null                             # No estimator for consultation services
```

**Schema reference — which fields the app consumes:**

| Field | Required | Consumed by |
|-------|----------|-------------|
| `slug` | ✅ | All components (identifier) |
| `name` | ✅ | Wizard + explore pages |
| `category` | ✅ | Groups services in wizard; links to `categories.yaml` |
| `description` | ✅ | Service cards, DMP |
| `comparison_features` | recommended | `CompareModal` (keys must match `categories.yaml`). Each value is either a bare level (`full`/`partial`/`none`) or `{ value, detail }`; a missing key reads as `none` |
| `cost_model.type` | ✅ | `"unit"`, `"tiered"`, or `"consultation"` (anything else prices at $0) |
| `cost_model.unit_label` | ✅ | Display label throughout UI (falls back to `cost_model.unit`) |
| `cost_model.price` | unit only | `src/lib/pricing.js` — shared by `ResultsStep`, `slateStore`, `useDMPGenerator` |
| `cost_model.tiers[].up_to/price/label` | tiered only | Same — marginal banding; the last band uses `up_to: null` |
| `subsidies[]` | optional | `slug`, `name`, `description`, `condition`, `discount_type` (`free_units` \| `percent` \| `fixed`), `discount_value`, `auto_apply`. `auto_apply: true` subsidies are always applied by `pricing.js` (free units come off the quantity before pricing); `auto_apply: false` ones are opt-in checkboxes on `EstimateStep` (one per service, matched by `slug`) |
| `archive_option.service_slug/description` | optional | `EstimateStep` surfaces paired archive prompt; priced through the archive service's own `cost_model` |
| `estimation.prompt/default_value/min_value/max_value/step/presets` | optional | `EstimateStep` UI |
| `estimation.unit_display` | optional | Unit shown next to the estimate input (overrides `cost_model.unit_label`) |
| `acknowledgment.required/title/message/items` | optional | `EstimateStep` shows a limitations checkbox; the wizard won't advance until it's ticked |
| `deployment` | optional | Service Matrix badges: list of `on-prem`, `cloud`, `hybrid` |
| `tech` | optional | Service Matrix tech badges (list of strings) |
| `pricing_url` | optional | Service Matrix "pricing" link (e.g. a vendor calculator) |
| `is_archive_tier` | optional | `true` hides the service from service selection and comparison — it's reachable only as another service's `archive_option` |

**Fields defined in config but not currently rendered** (recorded for reference, reserved for future work):

- `long_description`, `documentation_url` — present on every demo service, but no component renders them for services today (`documentation_url` is only read on software entries).
- `fa_exempt` — used in real configs to flag internal service centers (F&A-exempt). Not read yet: the slate export applies `meta.indirect_costs.default_rate` to the whole direct total, exempt services included.
- `recommended_with` — planned cross-sell prompt ("pair storage with compute"). Defined but not surfaced.
- `cost_model.billing_period`, `cost_model.unit_description`, `cost_model.note`, `cost_model.contact` — metadata honored by configs but not consumed by the wizard today. All prices are treated as monthly.

**Removed legacy fields** — if you're migrating an older `services.yaml`, these are no-ops and can be deleted:

- `available_tiers:` — tier availability is now in `mappings.yaml` (see below)
- `limits:` — never consumed by the wizard
- `estimation.help_calculator`, `estimation.unit`, `estimation.help_text` — not read on services (calculators are launched separately; `cost_model.unit_label` drives display)
- `tags:` — only consumed on software entries, not services
- `external_url:`, `request_url:` — not read
- `compliance:` (per-service) — compliance metadata lives on `mappings.yaml` entries
- `cost_model.typical_monthly`, `cost_model.options`, `cost_model.minimum_purchase`, `cost_model.bulk_discounts` — not read (use `tiered` cost model for volume discounts)

---

### bundles.yaml

Pre-selected service combinations researchers can apply in one click.  Bundles are shown in the "Bundles" view of the service-selection step and labeled by the researcher's tier — a bundle is "recommended" if its `recommended_tiers` list includes the selected tier, "available" if every service it references is mapped to that tier, and otherwise shown greyed out as unavailable with no Apply button.

> A "recommended" bundle can be applied even if one of its services isn't mapped to that tier, and the build doesn't check this — only list tiers in `recommended_tiers` where every bundled service has a `mappings.yaml` entry.

```yaml
# config/bundles.yaml

bundles:
  - slug: genomics-pipeline
    name: "Genomics Pipeline"
    description: |
      Standard setup for genomics and bioinformatics workflows: HPC compute
      for alignment/analysis, high-capacity storage for sequence data, and
      Globus for data transfer from sequencing cores.

    # Tier slugs from tiers.yaml (use lowercase slugs — low, medium, high, restricted)
    recommended_tiers:
      - low
      - medium

    # Each item references a service slug and the starting estimate applied
    # when the researcher clicks "Apply Bundle"
    services:
      - service: hpc-compute
        default_estimate: 50000
      - service: hpc-storage
        default_estimate: 100
      - service: globus-transfer
        default_estimate: 20

  - slug: ml-training
    name: "ML/AI Model Training"
    description: "GPU compute and fast storage for training machine-learning models."

    recommended_tiers:
      - low
      - medium

    services:
      - service: hpc-gpu
        default_estimate: 500
      - service: hpc-storage
        default_estimate: 50

  - slug: clinical-research
    name: "Clinical Research (HIPAA)"
    description: "HIPAA-compliant compute and storage for identifiable health data."

    recommended_tiers:
      - high

    services:
      - service: cloud-high-security          # cost_model.type: consultation — no estimate
      - service: vdi-hipaa
        default_estimate: 2
```

**Schema reference — bundles:**

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | ✅ | Identifier |
| `name` | ✅ | Display |
| `description` | ✅ | Shown on the bundle card (Markdown, rendered through `AnnotatedHtml`) |
| `recommended_tiers` | ✅ | Array of tier slugs from `tiers.yaml` (lowercase: `low`, `medium`, `high`, `restricted`) |
| `services[].service` | ✅ | Service slug from `services.yaml` |
| `services[].default_estimate` | optional | Initial quantity applied to the service; omit for consultation services |

**Not read by the wizard** (if you have these in an older `bundles.yaml`, they're no-ops — safe to remove):

- `icon`, `recommended_for`, `estimated_monthly_cost`, `onboarding_steps`, `compliance_notes`, `requires_consultation`
- `services[].required`, `services[].note`

---

### mappings.yaml

Explicit tier-to-service availability matrix.  If a `service` + `tier` combination is **not** listed, that service is **not available** for that tier — the wizard will hide it.

```yaml
# config/mappings.yaml

mappings:
  # HPC compute available at low and medium risk
  - service: hpc-compute
    tier: low
    approval: automatic
    notes: null
    dmp_template: "hpc-compute/default"

  - service: hpc-compute
    tier: medium
    approval: automatic
    notes: |
      Data must remain on cluster filesystems during processing.
      Do not copy data to personal devices.
    dmp_template: "hpc-compute/default"

  # High-risk cloud requires review and a contact
  - service: aws-compute-high
    tier: high
    approval: review
    approval_contact: "cloud-team@northwinds.edu"
    notes: |
      **Additional requirements:**
      - Dedicated VPC with restricted access
      - All data encrypted with customer-managed KMS keys
    dmp_template: "cloud-compute/high"
    # Optional compliance metadata — shown in the Service Matrix detail panel
    # (BAA badge, frameworks, training, timeline, audit logging, encryption)
    # for mappings on the `high` and `restricted` tiers; validated at build time.
    compliance:
      frameworks: [hipaa, ferpa]
      baa_status: in_place
      baa_reference: "AWS Business Associate Addendum"
      training_required:
        - "HIPAA Security Awareness (annual)"
      timeline: "3-5 business days after security assessment"
      audit_logging: true
      encryption: both
```

**Schema (per mapping entry):**

| Field | Required | Notes |
|-------|----------|-------|
| `service` | yes | Service slug from `services.yaml` |
| `tier` | yes | Tier slug from `tiers.yaml` (`low`, `medium`, `high`, `restricted`) |
| `approval` | yes | `automatic`, `review`, or `consultation` — non-automatic values show a "Requires review/consultation" badge (missing defaults to `automatic`); informational only, nothing is blocked |
| `approval_contact` | optional | Passed to DMP templates as `{{mapping.approval_contact}}` |
| `notes` | optional | User-facing notes (Markdown), shown as the service's requirements and passed to DMP templates.  Use `null` for none. |
| `dmp_template` | optional | Path under `config/dmp-templates/`, with or without `.md`. Without it, the service gets no DMP section |
| `compliance` | optional | See below |

**`compliance` block** (optional; rendered in the Service Matrix for `high`/`restricted` mappings):

| Field | Notes |
|-------|-------|
| `frameworks` | List, e.g. `hipaa`, `ferpa`, `fda_21_cfr_11`, `fedramp` |
| `baa_status` | `in_place`, `available`, `not_available`, or `not_applicable` — any other value is a build error. Only `in_place` lights the BAA badge |
| `baa_reference` | Name of the agreement. Build **warning** if `baa_status: in_place` without it |
| `training_required` | List of strings |
| `timeline` | Expected provisioning time |
| `audit_logging` | Boolean |
| `encryption` | `at_rest`, `in_transit`, `both`, `none` |

Build rule: listing `hipaa` in `frameworks` requires `baa_status` of `in_place` (or `not_applicable` for on-prem services with no business associate) — otherwise the build fails. See [VALIDATION.md](./VALIDATION.md).

> **Note — schema changes from earlier versions:**
>
> Older drafts of this doc described a top-level `defaults:` block (per-tier defaults like `self_service` or `security_review_required`).  No such block exists in the current schema — all approval behavior is per-mapping, and tier-level rules live in `tiers.yaml` (e.g. `consultation_required`).  If you have an older config with a `defaults:` block, you can delete it.

---

## Help & Explanation System

### acronyms.yaml

Terminology definitions for automatic annotation throughout the app. Any text containing these terms gets hover tooltips and click-for-more modals.

```yaml
# config/acronyms.yaml

acronyms:
  # ============================================================
  # INFRASTRUCTURE TERMS
  # ============================================================

  - term: "HPC"
    expansion: "High-Performance Computing"
    short_def: "Big shared computers for research"
    long_def: |
      High-Performance Computing (HPC) refers to computing systems that
      aggregate computing power to deliver much higher performance than
      a typical desktop. HPC systems use parallel processing across many
      nodes to solve complex computational problems.
    examples:
      - "Running a genome alignment across 128 CPU cores"
      - "Simulating molecular dynamics with GROMACS"
    related: ["GPU", "SU", "SLURM"]
    category: "infrastructure"

  - term: "GPU"
    expansion: "Graphics Processing Unit"
    short_def: "Special chip that's fast for ML and simulations"
    long_def: |
      A GPU is a specialized processor originally designed for rendering
      graphics, but now widely used for parallel computing tasks. GPUs
      excel at operations that can be split into thousands of simultaneous
      threads, making them ideal for machine learning, scientific
      simulations, and image processing.
    examples:
      - "Training a neural network on an NVIDIA V100"
      - "Running CUDA-accelerated molecular dynamics"
    related: ["HPC", "GPU-hour", "CUDA"]
    category: "infrastructure"

  - term: "SU"
    expansion: "Service Unit"
    short_def: "1 CPU-core running for 1 hour"
    long_def: |
      A Service Unit (SU) is the standard billing unit for HPC compute
      time. 1 SU = 1 CPU core running for 1 hour. If you run a job on
      32 cores for 10 hours, that's 320 SU.

      Think of it like electricity billing - you pay for what you use.
    examples:
      - "A 4-hour job on 8 cores = 32 SU"
      - "A genome alignment typically uses 100-500 SU"
    related: ["HPC", "GPU-hour", "ACCESS credits"]
    category: "infrastructure"
    see_also:
      - label: "SU Calculator"
        action: "open_calculator"
        calculator: "cpu"

  - term: "TB"
    expansion: "Terabyte"
    short_def: "1,000 GB (about 200,000 high-res photos)"
    long_def: |
      A terabyte (TB) is 1,000 gigabytes (GB) or 1 trillion bytes.
      For context:
      - Your laptop probably has 256 GB - 1 TB of storage
      - A single whole genome sequence is ~100-200 GB
      - Research datasets often require 1-100 TB or more
    examples:
      - "1 TB ≈ 200,000 smartphone photos"
      - "1 TB ≈ 30,000 4K microscopy images"
      - "1 TB ≈ 250 hours of HD video"
    related: ["GB", "PB", "archive"]
    category: "infrastructure"
    see_also:
      - label: "Storage Calculator"
        action: "open_calculator"
        calculator: "storage"

  - term: "SLURM"
    expansion: "Simple Linux Utility for Resource Management"
    short_def: "The software that schedules HPC jobs"
    long_def: |
      SLURM is the job scheduler used on most HPC clusters. You submit
      jobs describing what resources you need (cores, memory, time), and
      SLURM schedules them to run when resources are available.
    examples:
      - "sbatch my_job.sh - submit a batch job"
      - "srun --pty bash - start an interactive session"
    related: ["HPC", "batch job", "queue"]
    category: "infrastructure"

  - term: "VDI"
    expansion: "Virtual Desktop Infrastructure"
    short_def: "Remote Windows/Linux desktops"
    long_def: |
      VDI provides remote access to dedicated virtual machines with full
      desktop environments. Unlike HPC, VDI gives you a persistent machine
      with a graphical interface - ideal for GUI applications, analysis
      tools, and development work.
    related: ["VM", "remote desktop"]
    category: "infrastructure"

  - term: "K8s"
    display: "Kubernetes (K8s)"
    expansion: "Kubernetes"
    short_def: "Software for running containers at scale"
    long_def: |
      Kubernetes (often abbreviated K8s) is an orchestration platform for
      containerized applications. It automatically handles deployment,
      scaling, and management of applications packaged as containers.
    related: ["container", "Docker", "Helm"]
    category: "infrastructure"

  # ============================================================
  # STORAGE CONCEPTS
  # ============================================================

  - term: "archive"
    display: "Archive Storage"
    expansion: null
    short_def: "Cold storage - cheap but slow to retrieve"
    long_def: |
      Archive storage is designed for data you rarely access but need to
      keep. It's much cheaper than active storage but takes hours to
      retrieve.

      Think of it like putting boxes in the attic vs. keeping them on
      your desk.
    examples:
      - "Raw sequencing data after analysis is complete"
      - "Grant retention requirements (keep for 7 years)"
    related: ["active storage", "Glacier", "cold storage"]
    category: "storage"

  - term: "snapshot"
    display: "Snapshots"
    expansion: null
    short_def: "Automatic backups you can restore from"
    long_def: |
      Snapshots are point-in-time copies of your files, like Time Machine
      backups. If you accidentally delete or modify something, you can
      recover the previous version.

      Our research storage keeps daily snapshots for 30 days.
    related: ["backup", "version control"]
    category: "storage"

  # ============================================================
  # COMPLIANCE TERMS
  # ============================================================

  - term: "PHI"
    expansion: "Protected Health Information"
    short_def: "Patient/health data that needs HIPAA protection"
    long_def: |
      Protected Health Information (PHI) includes any individually
      identifiable health information. This includes medical records,
      lab results, billing information, and even appointment schedules
      when linked to an individual.

      PHI requires HIPAA-compliant storage and handling. At Northwinds,
      this means using High-tier services with BAAs in place.
    examples:
      - "Patient medical records from a clinical study"
      - "Genetic data linked to individual participants"
    related: ["HIPAA", "BAA", "IRB", "high-tier"]
    category: "compliance"

  - term: "HIPAA"
    expansion: "Health Insurance Portability and Accountability Act"
    short_def: "Federal law protecting health data"
    long_def: |
      HIPAA is a US federal law that establishes national standards for
      protecting sensitive patient health information. Research involving
      PHI must use HIPAA-compliant systems and have appropriate agreements
      (BAAs) in place with service providers.
    related: ["PHI", "BAA", "IRB"]
    category: "compliance"

  - term: "BAA"
    expansion: "Business Associate Agreement"
    short_def: "HIPAA contract with a vendor"
    long_def: |
      A Business Associate Agreement (BAA) is a contract between a
      HIPAA-covered entity and a vendor who will handle PHI. The BAA
      ensures the vendor will appropriately safeguard the information.

      Before storing PHI on any service, verify a BAA is in place.
      Cloud providers (AWS, Azure) have institutional BAAs; check with
      Research IT.
    related: ["HIPAA", "PHI"]
    category: "compliance"

  - term: "IRB"
    expansion: "Institutional Review Board"
    short_def: "Committee that approves human subjects research"
    long_def: |
      The Institutional Review Board (IRB) reviews research involving
      human subjects to ensure ethical treatment and proper informed
      consent. IRB approval is typically required before collecting or
      analyzing human subjects data.
    related: ["PHI", "HIPAA", "consent"]
    category: "compliance"

  - term: "FERPA"
    expansion: "Family Educational Rights and Privacy Act"
    short_def: "Federal law protecting student records"
    long_def: |
      FERPA protects the privacy of student education records. Research
      using student data (grades, enrollment, financial aid) requires
      appropriate data use agreements and typically IRB approval.
    related: ["IRB", "high-tier"]
    category: "compliance"

  - term: "CUI"
    expansion: "Controlled Unclassified Information"
    short_def: "Sensitive government data (not classified)"
    long_def: |
      CUI is government-created or owned information that requires
      safeguarding but isn't classified. Many DoD and federal contracts
      involve CUI and require specific handling procedures and compliant
      infrastructure (NIST 800-171).
    related: ["FISMA", "ITAR", "NIST 800-171"]
    category: "compliance"

  - term: "ITAR"
    expansion: "International Traffic in Arms Regulations"
    short_def: "Export control for defense-related data"
    long_def: |
      ITAR controls the export of defense-related articles, services,
      and technical data. Research involving ITAR-controlled information
      cannot be accessed by non-US persons and requires specific
      safeguards and dedicated infrastructure.
    related: ["EAR", "CUI", "export control"]
    category: "compliance"

  - term: "EAR"
    expansion: "Export Administration Regulations"
    short_def: "Export control for dual-use technology"
    long_def: |
      EAR controls exports of commercial and dual-use items, software,
      and technology. Less restrictive than ITAR but still requires
      compliance for certain research areas.
    related: ["ITAR", "export control"]
    category: "compliance"

  - term: "FDA 21 CFR Part 11"
    display: "21 CFR Part 11"
    expansion: "FDA Electronic Records Rule"
    short_def: "FDA requirements for clinical trials data"
    long_def: |
      21 CFR Part 11 establishes FDA requirements for electronic records
      and signatures. Research data intended for FDA submissions (clinical
      trials, drug development) must use systems meeting these requirements,
      including audit trails and validated software.
    related: ["clinical trial", "GxP", "validation"]
    category: "compliance"

  # ============================================================
  # PROGRAMS
  # ============================================================

  - term: "ACCESS"
    expansion: "Advanced Cyberinfrastructure Coordination Ecosystem"
    short_def: "Free national supercomputing for researchers"
    long_def: |
      ACCESS provides free compute time on national supercomputers for
      US researchers. It's funded by the NSF, so qualifying researchers
      can use world-class computing resources at no cost.

      Allocations range from 400,000 credits (Explore, auto-approved)
      to unlimited (Maximize, peer-reviewed).
    examples:
      - "Running large-scale climate simulations on Frontera"
      - "Training ML models on Delta's GPUs"
    related: ["NSF", "XSEDE", "credits"]
    category: "programs"
    see_also:
      - label: "ACCESS Tiers Explained"
        action: "open_section"
        section: "access-explainer"
      - label: "ACCESS Website"
        action: "external_link"
        url: "https://access-ci.org"

  # ============================================================
  # TOOLS
  # ============================================================

  - term: "LabArchives"
    expansion: null
    short_def: "Electronic lab notebook (ELN) for research documentation"
    long_def: |
      LabArchives is a cloud-based electronic lab notebook used to
      document research activities, experiments, and protocols. It's
      commonly used for compliance with data management requirements.

      Note: LabArchives has file size limits (typically 4GB per file)
      and storage quotas. For large datasets, use dedicated research
      storage and link to files from your LabArchives entries.
    examples:
      - "Documenting wet lab protocols and observations"
      - "Recording computational experiment parameters"
    related: ["ELN", "DMP", "data management"]
    category: "tools"

  - term: "Globus"
    expansion: null
    short_def: "Fast, reliable research data transfer"
    long_def: |
      Globus is a data transfer service designed for research. It handles
      large file transfers reliably, resuming automatically if interrupted.
      It's the recommended way to move data to/from HPC systems and
      between institutions.
    examples:
      - "Transferring 10 TB of sequencing data"
      - "Sharing data with collaborators at other universities"
    related: ["data transfer", "research storage"]
    category: "tools"

# Annotation behavior settings
annotation_config:
  enabled: true            # false turns auto-annotation off everywhere
  word_boundary: true      # Match whole words only
  case_sensitive: true     # "HPC" but not "hpc"
  max_per_term: 3          # Max annotations per term per annotated text block
  tooltip_delay: 300       # ms before showing tooltip

  # Not read by the app today (annotation only runs inside AnnotatedText /
  # AnnotatedHtml blocks, so code/inputs are never annotated anyway)
  skip_elements:
    - "code"
    - "pre"
    - "input"
    - "textarea"
    - ".no-annotate"
```

---

### calculators.yaml

Configuration for the "Help Me Estimate" calculators that translate researcher-friendly inputs into infrastructure units.

```yaml
# config/calculators.yaml

# Which calculators are enabled and in what order
enabled_calculators:
  storage:
    - microscopy
    - photography
    - genomics
    - video
    - medical-imaging
    - documents

  cpu:
    - genomics-pipelines
    - simulations
    - batch-processing
    - statistics

  gpu:
    - ml-training
    - ml-inference
    - gpu-simulation

  api:
    - llm-api-costs

# Group keys must be storage, cpu, gpu, or api (others are skipped). Each id
# needs a calculator_config entry AND a component registered in
# src/views/CalculatorBrowser.vue, or it won't render.

# Calculator-specific configuration
calculator_config:
  microscopy:
    name: "Microscopy Images"
    icon: "microscope"
    description: "Confocal, fluorescence, electron microscopy"

    # Institution-specific defaults
    default_resolution: "4k"
    default_bit_depth: 16

    # Quick presets for common setups
    presets:
      - label: "Confocal Core"
        resolution: "4k"
        bit_depth: 16
        channels: 4
        description: "Standard confocal microscope settings"
      - label: "Light Sheet"
        resolution: "4k"
        bit_depth: 16
        channels: 2
        z_slices: 200
        description: "Light sheet microscopy with Z-stack"
      - label: "Electron Microscopy"
        resolution: "8k"
        bit_depth: 16
        channels: 1
        description: "High-resolution EM images"

  genomics:
    name: "Genomics Data"
    icon: "dna"
    description: "Sequencing reads, alignments, variants"

    # Which data types to show
    data_types:
      - label: "Whole Genome (30x)"
        size_gb: 150
        description: "Raw FASTQ + BAM + VCF"
      - label: "Whole Exome"
        size_gb: 20
        description: "Raw + processed files"
      - label: "RNA-seq"
        size_gb: 30
        description: "Per sample, raw + counts"
      - label: "Single-cell RNA"
        size_gb: 100
        description: "10x Chromium, per run"
      - label: "ATAC-seq"
        size_gb: 25
        description: "Per sample"

  genomics-pipelines:
    name: "Genomics Pipelines"
    icon: "workflow"
    description: "Alignment, variant calling, RNA-seq"

    pipelines:
      - label: "WGS Alignment (BWA-MEM2)"
        su_per_sample: 300
        description: "30x genome alignment"
      - label: "Variant Calling (GATK)"
        su_per_sample: 200
        description: "Per sample, joint calling extra"
      - label: "RNA-seq (STAR + featureCounts)"
        su_per_sample: 50
        description: "Alignment + quantification"
      - label: "Single-cell (Cell Ranger)"
        su_per_sample: 400
        description: "10x processing pipeline"

  ml-training:
    name: "ML Training"
    icon: "brain"
    description: "Deep learning model training"

    model_sizes:
      - label: "Small (ResNet-18, BERT-base)"
        typical_hours: 10
        description: "Fine-tuning or small datasets"
      - label: "Medium (ResNet-50, GPT-2)"
        typical_hours: 50
        description: "Full training, medium datasets"
      - label: "Large (ViT-L, LLaMA-7B)"
        typical_hours: 200
        description: "Large models, big datasets"
      - label: "Very Large (LLaMA-70B)"
        typical_hours: 2000
        description: "Requires multi-GPU"

  simulations:
    name: "Scientific Simulations"
    icon: "atom"
    description: "GROMACS, LAMMPS, OpenFOAM, ANSYS"

    packages:
      - label: "GROMACS"
        su_per_ns_per_million_atoms: 100
      - label: "LAMMPS"
        su_per_ns_per_million_atoms: 80
      - label: "OpenFOAM"
        su_per_hour_simulated: 500
      - label: "ANSYS Fluent"
        su_per_hour_simulated: 1000

# Global calculator settings
global:
  # Safety multiplier applied to every result — the only global key the app reads
  safety_multiplier: 1.5

  # Present in the demo config but not read by the app today:
  # safety_message, show_calculation, storage_precision, compute_precision,
  # default_archive_ratio, archive_ratio_help (rounding is hardcoded)
```

See [CALCULATOR-DEVELOPMENT.md](./CALCULATOR-DEVELOPMENT.md) for per-calculator keys and the component interface.

---

### help.yaml

Configuration for the "Talk to a Human" help escape hatch: a floating help button that opens the Get Help modal.

```yaml
# config/help.yaml

global:
  # The floating help button shows only when BOTH of these are true
  show_help_cta: true
  floating_button:
    enabled: true

# Contact buttons in the help modal
contact_options:
  - type: "email"                     # Unique per option (used as the list key)
    label: "Email Us"
    description: "Get a response within 1 business day"
    icon: "mail"                      # mail | calendar | ticket | bookmark (others -> mail)
    primary: true                     # Highlighted button
    action:
      type: "email"                   # email | external_link | save_state
      address: "rc-help@northwinds.edu"

  - type: "schedule"
    label: "Schedule a Call"
    description: "30-minute consultation with RC staff"
    icon: "calendar"
    action:
      type: "external_link"
      url: "https://calendly.com/northwinds-rc/consult"

# Context message at the top of the modal, keyed by the CURRENT WIZARD STEP ID:
# welcome, tier-select, grant-period, retention, service-select, software,
# estimate, results, consultation
contextual_help:
  tier-select:
    title: "Not sure which data tier?"
    message: |
      If your research involves human subjects data, health information,
      or government contracts, we recommend a quick consultation.

# Quick FAQ (answers are Markdown)
faq:
  - question: "How long does provisioning take?"
    answer: |
      - **L1/L2 services:** Same day (self-service)
      - **L3 (HIPAA):** 3-7 business days

# Optional drop-in hours
office_hours:
  enabled: true
  title: "Drop-in Office Hours"
  description: "No appointment needed"
  schedule:
    - day: "Tuesday"
      time: "2:00 PM - 4:00 PM"
      location: "Virtual (Zoom)"

# Optional urgent-issue line
urgent:
  enabled: true
  title: "Urgent Issue?"
  description: "For production system outages or security incidents"
```

**Present in the demo `help.yaml` but not read by the app today:** `global.help_cta_text`, `help_cta_link`, `help_cta_position`, `emphasized_pages`, `floating_button.icon/pulse_animation/show_after_seconds`; `action.subject_template`, `include_state`, `email_link`; per-message `show_*_cta` flags; `office_hours.schedule[].link`; `urgent.contact/phone`; and the entire `export_state` block.

> **Heads-up:** the demo's `contextual_help` keys (`tier-selection`, `storage-estimate`, ...) don't match any wizard step id, so no contextual message appears until you rename them (e.g. `tier-select`, `estimate`).

---

## Compliance & Workflow

### tier-questionnaire.yaml

Decision tree questions to help users determine their data tier.

```yaml
# config/tier-questionnaire.yaml

# Introduction shown before questions
intro:
  title: "What type of data will you be working with?"
  description: |
    Answer a few questions to help us recommend the right security level
    for your research data. If you're unsure, err on the side of caution -
    you can always adjust later with our team.

# Questions in order
questions:
  - id: human_subjects
    question: "Does your research involve human subjects?"
    help_text: "This includes surveys, interviews, medical records, genetic data, or any data collected from people."
    options:
      - label: "No"
        value: false
        next: government_data
      - label: "Yes"
        value: true
        next: health_data

  - id: health_data
    question: "Does your data include health or medical information?"
    help_text: "Medical records, diagnoses, treatments, genetic information linked to individuals, mental health data, substance abuse records."
    options:
      - label: "No"
        value: false
        next: student_data
      - label: "Yes"
        value: true
        sets_tier: high
        sets_flags:
          - hipaa
          - phi
        next: identifiable

  - id: identifiable
    question: "Is the health data identifiable or de-identified?"
    help_text: "De-identified means all 18 HIPAA identifiers have been removed (names, dates, locations, etc.)"
    options:
      - label: "Fully de-identified (Safe Harbor method)"
        value: "deidentified"
        sets_tier: medium
        clears_flags:
          - hipaa
          - phi
        next: government_data
      - label: "Limited dataset (some identifiers)"
        value: "limited"
        sets_tier: high
        next: government_data
      - label: "Identifiable / not sure"
        value: "identifiable"
        sets_tier: high
        next: government_data

  - id: student_data
    question: "Does your data include student education records?"
    help_text: "Grades, enrollment status, financial aid, disciplinary records, or other data from student information systems."
    options:
      - label: "No"
        value: false
        next: government_data
      - label: "Yes"
        value: true
        sets_tier: high
        sets_flags:
          - ferpa
        next: government_data

  - id: government_data
    question: "Is this research funded by or for a government agency?"
    help_text: "DoD, DoE, NASA, or other federal contracts may have specific data handling requirements."
    options:
      - label: "No"
        value: false
        next: export_control
      - label: "Yes - standard federal grant (NSF, NIH)"
        value: "standard_federal"
        next: export_control
      - label: "Yes - DoD/defense-related"
        value: "dod"
        sets_flags:
          - cui_possible
        next: cui_check

  - id: cui_check
    question: "Does your contract specify CUI (Controlled Unclassified Information)?"
    help_text: "Check your contract for terms like 'CUI', 'DFARS 252.204-7012', or 'NIST 800-171'."
    options:
      - label: "No / Not sure"
        value: false
        next: export_control
      - label: "Yes"
        value: true
        sets_tier: restricted
        sets_flags:
          - cui
          - nist_800_171
        next: complete

  - id: export_control
    question: "Does your research involve export-controlled technology?"
    help_text: "ITAR (defense articles), EAR (dual-use technology), or technology that cannot be shared with non-US persons."
    options:
      - label: "No / Not sure"
        value: false
        next: complete
      - label: "Yes - ITAR"
        value: "itar"
        sets_tier: restricted
        sets_flags:
          - itar
        next: complete
      - label: "Yes - EAR"
        value: "ear"
        sets_tier: restricted
        sets_flags:
          - ear
        next: complete

  - id: complete
    type: "summary"

# Discipline-specific examples to help users understand
examples_by_discipline:
  biomedical:
    name: "Biomedical / Life Sciences"
    icon: "microscope"
    examples:
      low:
        - "Published protein structures from PDB"
        - "Public genomics datasets from NCBI"
      medium:
        - "Your lab's unpublished experimental results"
        - "Pre-publication manuscripts and figures"
      high:
        - "Patient samples with clinical data"
        - "Genetic data linked to individuals"

  engineering:
    name: "Engineering"
    icon: "cog"
    examples:
      low:
        - "Published simulation results"
        - "Open-source CAD models"
      medium:
        - "Proprietary designs before patent filing"
        - "Industry collaboration data under NDA"
      restricted:
        - "Defense contractor research (ITAR)"
        - "CUI-marked government data"

  social_science:
    name: "Social Science"
    icon: "users"
    examples:
      low:
        - "Census data and public surveys"
        - "Published interview transcripts"
      medium:
        - "Ongoing survey responses (anonymized)"
        - "Interview recordings (consent obtained)"
      high:
        - "Student educational records"
        - "Identifiable interview data"

# Allow users to override the recommendation
override:
  enabled: true
  confirmation_required: true
  confirmation_text: |
    You're selecting a different tier than our recommendation.
    Please confirm you understand the implications:

    - **Selecting a lower tier** may mean your data isn't adequately protected
    - **Selecting a higher tier** will require additional approval steps

    If you're unsure, please contact Research Computing for guidance.
```

**How the questionnaire walks the tree** (`src/lib/classifyTier.js`, shared with `TierQuestionnaire.vue`):

- It starts at the **first** entry in `questions` and follows each option's `next`; `next: complete` (or no `next`) ends the walk. An entry with `type: "summary"` also ends it.
- `sets_tier` only ever **upgrades** the result, ranked `low < medium < high < restricted`. The ranking is hardcoded — a `sets_tier` naming any other slug is ignored. A path that sets no tier lands on `low`.
- `sets_flags` / `clears_flags` add and remove classification flags (`hipaa`, `phi`, `ferpa`, `cui`, `itar`, `ear`, `fre`, ...). Flags flow into the DMP (`{{#if flags.phi}}`) and the results summary.

**Other keys the page reads:** `intro.audience_note.{title,description}`, `intro.skip_option.{enabled,label}`, `intro.quick_select.{enabled,label,tier}`; per question `icon` and `learn_more.{title,content,link}`; `summary.{title,show_flags,cta.<tier-slug>}`; and `examples_by_discipline`. The top-level `override` block shown above (and the demo's top-level `quick_select`) is **not read** — use `intro.quick_select` instead.

---

### tier-workflow.yaml

Detailed approval processes for each tier.

> **Not rendered yet.** No component reads `tier-workflow.yaml` today. It's built into `config.json`, and the `show_if` / `skip_if` step gating is implemented and unit-tested in `src/lib/workflowSteps.js`, but no UI shows the workflow. Keep it accurate for when it's wired up; editing it won't change what researchers see.

```yaml
# config/tier-workflow.yaml

workflows:
  low:
    name: "Low (Public Data)"
    process: "self-service"
    description: "No special approval needed"
    steps:
      - "Select services in planner"
      - "Provision directly via self-service portal"
    typical_time: "Same day"

  medium:
    name: "Medium (Internal Data)"
    process: "self-service"
    description: "Standard institutional security"
    steps:
      - "Select services in planner"
      - "Provision via self-service with institutional auth"
    typical_time: "Same day"

  high:
    name: "High (Regulated Data)"
    process: "consultation"
    description: "Requires BAA verification or IRB documentation"

    compliance_types:
      - hipaa
      - ferpa
      - pii

    steps:
      - step: "Complete planner"
        description: "Finish selecting your services"
        time: "~10 min"
        self_service: true

      - step: "Research IT consultation"
        description: "Verify data classification and service compatibility"
        time: "1-3 business days"
        contact: "rc-help@northwinds.edu"

      - step: "BAA verification"
        description: "Confirm institutional agreement covers your use case"
        time: "Same day to 1 week"
        skip_if: "using_preapproved_service"

      - step: "Environment setup"
        description: "Configure encryption, access controls, audit logging"
        time: "1-3 business days"

      - step: "Training"
        description: "Complete required compliance training"
        time: "~30 min"
        training_url: "https://training.northwinds.edu/hipaa"

    typical_time: "3-7 business days"

    preapproved_services:
      - "cloud-high-security"
      - "vdi-hipaa"

  restricted:
    name: "Restricted (Export-Controlled)"
    process: "security_review"
    description: "Requires export control review and dedicated infrastructure"

    compliance_types:
      - itar
      - ear
      - cui

    steps:
      - step: "Complete planner"
        time: "~10 min"
        self_service: true

      - step: "Research IT consultation"
        description: "Review requirements with compliance team"
        time: "1-3 business days"

      - step: "Export control determination"
        description: "Research Security confirms data classification"
        time: "3-5 business days"
        contact: "export-control@northwinds.edu"

      - step: "Security assessment"
        description: "Architecture review for NIST 800-171 / CMMC compliance"
        time: "1-2 weeks"

      - step: "Enclave provisioning"
        description: "Dedicated isolated environment with required controls"
        time: "1-2 weeks"

      - step: "Certification"
        description: "Security team certifies environment"
        time: "3-5 business days"

      - step: "Training"
        description: "Export control handling, personnel restrictions"
        time: "~2 hours"
        training_url: "https://training.northwinds.edu/export-control"

    typical_time: "3-6 weeks"

    warnings:
      - "Only US persons may access this data"
      - "Dedicated infrastructure required - no shared resources"
      - "Annual recertification required"

# FAQ shown in workflow modal
faq:
  - question: "Why does high-tier data take longer?"
    answer: |
      Regulated and export-controlled data requires verification of
      compliance infrastructure. This protects both the data subjects
      and the institution. We've streamlined this process as much as
      possible while maintaining required safeguards.

  - question: "Can I start working while waiting for approval?"
    answer: |
      **For L3 (HIPAA/PHI):** Yes, you can often begin with de-identified
      or synthetic data while BAA verification completes.

      **For L4 (export-controlled):** No, you must wait for full approval
      before any data access. However, you can prepare analysis code on
      non-sensitive test data.

  - question: "What if I'm not sure about my data tier?"
    answer: |
      That's common! The tier questionnaire helps identify likely
      requirements, but Research IT will confirm during consultation.
      It's better to over-estimate initially - we can always relax
      controls if warranted.

  - question: "I have a grant deadline. Can this be expedited?"
    answer: |
      Contact Research IT immediately with your deadline. We can often
      prioritize consultations and work in parallel with other approvals.
      Include your deadline in the planner notes.
```

---

### retention.yaml

Data retention schedules for the wizard's retention step (shown only for tiers with `retention_questions_required: true`). Researchers tick the schedules that apply; the longest selected schedule wins (never less than 3 years), and the years beyond the grant period drive archive cost.

```yaml
# config/retention.yaml

schedules:
  - slug: federal-grant-standard
    name: "Federal Grant (Standard)"
    description: "Most federally funded research must keep data for 3 years after the grant closes."
    years: 3
    regulation: "2 CFR 200.334"                    # Link text
    regulation_url: "https://www.ecfr.gov/current/title-2/section-200.334"
    applies_to_tiers:                              # REQUIRED — tier slugs; validated at build
      - low
      - medium
      - high
    is_default: true                               # Pre-selected and labeled as the default

  - slug: irb-human-subjects
    name: "IRB Human Subjects Research"
    description: "Research with human participants under an IRB protocol requires records for up to 20 years."
    years: 20
    regulation: "45 CFR 46 / 21 CFR 50"
    regulation_url: "https://www.hhs.gov/ohrp/regulations-and-policy"
    applies_to_tiers:
      - high

archive_settings:
  custom_ratio_prompt: |                           # Help text on the archive-ratio control
    After your grant ends, some data still needs to be kept in "archive" storage ...
```

| Field | Notes |
|-------|-------|
| `schedules[].slug/name/description/years` | Required |
| `schedules[].applies_to_tiers` | **Required** — a schedule without it breaks the retention step. Every slug must exist in `tiers.yaml` |
| `schedules[].regulation`, `regulation_url` | Optional citation link |
| `schedules[].is_default` | Optional |
| `archive_settings.custom_ratio_prompt` | Optional |

**Not read by the app today:** `schedules[].is_post_grant`, `archive_required`, `trigger_question`; `archive_settings.typical_archive_ratio` (the default ratio is hardcoded at 0.7) and `allow_custom_ratio`. Archive pricing comes from the service's `archive_option` (see `services.yaml`), not from this file.

---

## Software Catalog

### software.yaml

Licensed software available on various platforms. Uses a "stoplight" system for license status.

```yaml
# config/software.yaml

# License status definitions
license_statuses:
  full:
    label: "Available"
    color: "green"
    icon: "check-circle"
    description: "Fully licensed, ready to use"

  restricted:
    label: "Restricted"
    color: "yellow"
    icon: "alert-circle"
    description: "Available with limitations or approval required"

  byol:
    label: "Bring Your Own"
    color: "gray"
    icon: "external-link"
    description: "You must provide your own license"

  unavailable:
    label: "Not Available"
    color: "red"
    icon: "x-circle"
    description: "Not available on this platform"

# The status keys full / restricted / byol / unavailable are fixed — the
# catalog's filters and colors are keyed to them. Edit labels and text only.

# Software catalog
software:
  # ============================================================
  # COMPUTATIONAL CHEMISTRY
  # ============================================================

  - slug: gaussian
    name: "Gaussian"
    vendor: "Gaussian, Inc."
    category: "computational-chemistry"
    description: "Electronic structure modeling"
    website: "https://gaussian.com"

    availability:
      hpc:
        status: full
        versions: ["16-C.01", "16-B.01"]
        module: "gaussian/16-C.01"
        notes: "Site license, all users"
      vdi:
        status: restricted
        notes: "By request only"
      cloud:
        status: byol
        notes: "Cloud licensing not permitted"

    documentation_url: "https://docs.rc.northwinds.edu/software/gaussian"

    tags:
      - chemistry
      - quantum
      - dft

  - slug: amber
    name: "AMBER"
    vendor: "AMBER Development Team"
    category: "molecular-dynamics"
    description: "Molecular dynamics for biomolecules"
    website: "https://ambermd.org"

    availability:
      hpc:
        status: full
        versions: ["22", "20"]
        module: "amber/22"
        gpu_support: true
      vdi:
        status: byol
      cloud:
        status: full
        notes: "AWS/Azure marketplace images available"

    tags:
      - chemistry
      - molecular-dynamics
      - gpu

  - slug: matlab
    name: "MATLAB"
    vendor: "MathWorks"
    category: "numerical-computing"
    description: "Numerical computing and visualization"
    website: "https://mathworks.com/products/matlab.html"

    availability:
      hpc:
        status: full
        versions: ["R2024a", "R2023b"]
        module: "matlab/R2024a"
        parallel_toolbox: true
        notes: "Campus license with Parallel Computing Toolbox"
      vdi:
        status: full
        versions: ["R2024a"]
        notes: "Pre-installed on all VDI images"
      cloud:
        status: restricted
        notes: "Requires MathWorks Cloud license"

    # Available toolboxes
    toolboxes:
      - "Parallel Computing Toolbox"
      - "Statistics and Machine Learning Toolbox"
      - "Image Processing Toolbox"
      - "Signal Processing Toolbox"
      - "Bioinformatics Toolbox"

    documentation_url: "https://docs.rc.northwinds.edu/software/matlab"

    tags:
      - numerical
      - visualization
      - engineering

  - slug: stata
    name: "Stata"
    vendor: "StataCorp"
    category: "statistics"
    description: "Statistical software for data science"
    website: "https://stata.com"

    availability:
      hpc:
        status: full
        versions: ["18-MP"]
        module: "stata/18"
        notes: "Stata/MP with 32 cores"
      vdi:
        status: full
        versions: ["18"]

    tags:
      - statistics
      - social-science
      - economics

  # ============================================================
  # EDA TOOLS (often restricted)
  # ============================================================

  - slug: cadence
    name: "Cadence Virtuoso"
    vendor: "Cadence Design Systems"
    category: "eda"
    description: "IC design and verification"
    website: "https://cadence.com"

    availability:
      hpc:
        status: restricted
        notes: "ECE department license only"
        contact: "ece-it@northwinds.edu"
        approval_required: true
      vdi:
        status: restricted
        notes: "Dedicated EDA VDI pool"

    # License server info
    license_info:
      type: "FlexLM"
      server: "Internal"
      contact: "ece-it@northwinds.edu"

    tags:
      - eda
      - vlsi
      - engineering

  - slug: ansys
    name: "ANSYS"
    vendor: "ANSYS, Inc."
    category: "simulation"
    description: "Multi-physics simulation suite"
    website: "https://ansys.com"

    availability:
      hpc:
        status: full
        versions: ["2024R1", "2023R2"]
        module: "ansys/2024R1"
        products:
          - "Mechanical"
          - "Fluent"
          - "CFX"
          - "HFSS"
        notes: "Teaching and research licenses"
      vdi:
        status: full
        notes: "Workbench GUI available"
      cloud:
        status: byol
        notes: "Elastic licensing available for purchase"

    license_info:
      type: "ANSYS License Manager"
      teaching_licenses: 25
      research_licenses: 10
      contact: "rc-help@northwinds.edu"

    documentation_url: "https://docs.rc.northwinds.edu/software/ansys"

    tags:
      - simulation
      - fea
      - cfd
      - engineering

# Categories for filtering
categories:
  - slug: computational-chemistry
    name: "Computational Chemistry"
    icon: "flask"

  - slug: molecular-dynamics
    name: "Molecular Dynamics"
    icon: "atom"

  - slug: statistics
    name: "Statistics"
    icon: "bar-chart"

  - slug: numerical-computing
    name: "Numerical Computing"
    icon: "calculator"

  - slug: eda
    name: "Electronic Design Automation"
    icon: "cpu"

  - slug: simulation
    name: "Simulation & FEA"
    icon: "box"

# License server hosting info (shown as callout)
license_hosting:
  enabled: true
  title: "Need to host your own license server?"
  description: |
    Research Computing can host FlexLM/RLM license servers for your
    lab or department. This is useful for software with "bring your
    own license" requirements.
  contact: "rc-help@northwinds.edu"
  more_info_url: "https://docs.rc.northwinds.edu/licenses/hosting"   # not read

# Platform display names (keys match the availability keys above)
platforms:
  hpc:
    name: "HPC Cluster"
    description: "High-performance computing cluster"
  jupyterhub:
    name: "JupyterHub"
    description: "Managed Jupyter notebook environment"
    url: "https://jupyter.northwinds.edu"
    features: ["Pre-configured environments", "No local installation needed"]
  vdi:
    name: "Virtual Desktop"
    description: "Virtual desktop infrastructure"
  cloud:
    name: "Cloud (AWS/Azure)"
    description: "Cloud computing platforms"

search:
  enabled: true
  placeholder: "Search software..."
```

**Other software fields the app reads:** `description_long`, `license_model` (`byol` triggers a bring-your-own-license notice in the wizard), `license_server.{we_can_host,contact}`, `license_info.{type,server,contact,notes,cost_estimate,cost_notes,cost_period}`, `institutional_support_url` / `institutional_support_label`, `export_control.{classification,eccn,restriction,notes}`, and `tier_restrictions.{min_tier,max_tier,notes}` (catalog badges).

**Not read today** (safe to keep, no effect): `availability.<platform>.gpu_support`, `parallel_toolbox`, `products`, `approval_required`, `no_setup`, `packages_included`, `requires_own_license`; `toolboxes`, `add_ons`, `byol_available`; `license_info.teaching_licenses/research_licenses/cost_per_seat/vendor_contact/request_quote_cta`; `platforms.*.typical_use`; `search.search_fields`.

---

## Legal, Explainers & Guidance

### legal.yaml

The terms layer. Have your counsel review it before go-live (the file's `counsel_review` block is a note to you, not display text).

| Key | Where it appears |
|-----|------------------|
| `terms_of_use`, `acceptable_use`, `data_responsibility`, `no_warranty` | `{heading, short, body}` — the `body` sections render on the About AI page |
| `no_warranty.short` | Footer fine print |
| `dmp_legal_framing.{heading, body}` | "About This Plan" section at the end of the generated DMP |
| `tier_notices.<tier-slug>` | Per-tier legal notice appended to the DMP — keys must match your tier slugs |

`acknowledgement`, `last_reviewed`, and `counsel_review` are not read by the app.

### explainers.yaml

Short in-app explainers, keyed by id under `explainers:`. The app currently renders one id, `overhead-and-direct-costs`, as a "→" nudge on the results step, slate, and Service Matrix cost column.

| Key | Purpose |
|-----|---------|
| `title` | Modal title |
| `jit.link_text` | Nudge link text — without it the nudge doesn't render |
| `short` | Opening answer (Markdown) |
| `table.{caption, columns, rows, footnote}` | Worked example table |
| `bottom_line` | One-sentence takeaway |
| `full_guide.{text, corpus_path}` | "Read the full guide" link, resolved against `meta.governance_corpus_url` (hidden when that's null) |

### help-videos.yaml

Loaded into `config.json` but **not read by any component yet**. Editing it has no visible effect today.

### ai-guidance/ and clinical/

Each `*.yaml` file becomes an entry keyed by filename: `ai-guidance/stakes-assessment.yaml` → `config.aiGuidance['stakes-assessment']`, `clinical/irb-amendment.yaml` → `config.clinicalGuidance['irb-amendment']`. Each applet component looks up its own filename, so keep the existing names. Renaming a file silently drops that applet's content. See [AI-GUIDANCE-APPLETS.md](../AI-GUIDANCE-APPLETS.md).

---

## DMP Templates

Templates in `config/dmp-templates/` use Handlebars syntax to generate Data Management Plan text. Any `.md` file under that directory (nested folders allowed) becomes a template keyed by its path without `.md` — `hpc-storage/default.md` is `hpc-storage/default`. A mapping opts in with `dmp_template: "hpc-storage/default"`; a service/tier mapping without `dmp_template` gets no DMP section.

Each template renders **once per selected service**, so the context describes that one service.

### Available Variables

```handlebars
{{!-- Institution --}}
{{institution.name}}  {{institution.short_name}}

{{!-- This service --}}
{{service.slug}}  {{service.name}}  {{service.description}}
{{service.estimate}}      {{!-- researcher's quantity --}}
{{service.unit}}  {{service.unit_label}}
{{service.free_units}}  {{service.billable}}
{{service.monthly_cost}}  {{service.total_cost}}   {{!-- total = whole grant period --}}
{{service.notes}}         {{!-- researcher's note, else the mapping's notes --}}

{{!-- Archive tail (null unless the researcher added archive) --}}
{{archive.estimate}}  {{archive.monthly_cost}}  {{archive.annual_cost}}
{{archive.total_cost}}  {{archive.years}}

{{!-- Tier and mapping --}}
{{tier.slug}}  {{tier.name}}  {{tier.description}}
{{mapping.approval}}  {{mapping.approval_contact}}  {{mapping.notes}}

{{!-- Retention (null when no retention years) --}}
{{retention.years}}  {{retention.name}}   {{!-- name = "N-year retention" --}}

{{!-- Grant period --}}
{{grant.start_date}}  {{grant.end_date}}  {{grant.months}}  {{grant.years}}

{{!-- Questionnaire classification flags --}}
{{#if flags.phi}}...{{/if}}
{{#each classification.labels}}{{this}}{{/each}}

{{!-- Generation info --}}
{{generated.date}}  {{generated.version}}   {{!-- version = meta.yaml version --}}

{{!-- Helpers --}}
{{currency value}}        {{!-- $1,234 --}}
{{number value}}          {{!-- 1,234 --}}
{{date value}}            {{!-- Formats date --}}
{{pluralize count "file" "files"}}
{{#if (eq a b)}}  {{#if (gt a b)}}  {{#if (lt a b)}}
```

The app wraps the rendered sections with a header (institution, classification, grant period, retention), regulatory guidance driven by the classification flags, and a footer that adds `meta.cost_disclaimer.long` and `legal.yaml`'s `tier_notices` / `dmp_legal_framing`.

### Example: `config/dmp-templates/hpc-storage/default.md`

```markdown
## HPC Storage

Research data will be stored on {{institution.name}}'s Ceph storage cluster.

**Storage Allocation:**
- Active storage needed: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years.
{{#if archive}}
- Archive storage: {{number archive.estimate}} TB
- Total retention cost: {{currency archive.total_cost}}
{{/if}}
{{/if}}
```

### Export template

`config/export-templates/slate-export.md.hbs` is the Handlebars template for the slate's Markdown export. Every `*.md.hbs` file in that directory is loaded (keyed by filename without the extension), but the app only renders `slate-export`.

---

## Validation & Deployment

### Validation

The build script validates all configuration:

```bash
# Validate only
npm run validate:config

# Validate and build
npm run build:config
```

Validation checks:
- Every config file in the build list exists
- All YAML syntax is valid
- All service references exist
- All tier references exist
- All category references exist
- All DMP templates referenced in mappings exist
- Archive-option service references exist
- Bundle recommended tiers exist
- Retention schedule tiers exist
- Compliance/BAA invariants enforced (e.g. HIPAA frameworks require an in-place BAA; `baa_status` must be a known value)

### Deployment

Build creates static files in `dist/`:

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Deploy to any static host (Netlify, Vercel, GitHub Pages, S3, etc.) with an SPA fallback to `index.html` (the app uses history-mode routing). No server-side code is required, except the optional feedback API — set `meta.feedback.enabled: false` if you don't run it. See [DOCKER.md](./DOCKER.md) for the containerized setup.

---

## Common Customizations

### Adding a new service

1. Add service definition to `services.yaml`
2. Add tier mappings in `mappings.yaml` (there are no defaults — an unmapped service is hidden)
3. Add comparison features matching category definitions
4. Create DMP template in `dmp-templates/`
5. Optionally add to bundles in `bundles.yaml`
6. Run `npm run build:config`

### Adding a new data tier

1. Add tier to `tiers.yaml` (the questionnaire can only recommend `low`/`medium`/`high`/`restricted` — see the note under [tiers.yaml](#tiersyaml))
2. Add workflow to `tier-workflow.yaml` (not rendered yet)
3. Update `tier-questionnaire.yaml`, `legal.yaml` `tier_notices`, and `bundles.yaml` `recommended_tiers` if needed
4. Add service mappings for new tier
5. Update retention schedules if applicable
6. Run `npm run build:config`

### Adding terminology

1. Add term to `acronyms.yaml`
2. Include short_def, long_def, examples, related terms
3. Terms are automatically annotated throughout the app

### Adding a calculator

1. Create Vue component in `src/components/estimate/` (e.g. `src/components/estimate/MyThingCalculator.vue`)
2. Register it in the `calculatorComponents` map in `src/views/CalculatorBrowser.vue`
3. Add to `calculators.yaml` enabled list
4. Add configuration in `calculator_config` section
5. Calculator appears on the Calculators explore page (`/calculators`)

### Changing institution branding

1. Edit `meta.yaml` with your institution details
2. Replace logo files in `public/images/` and point `institution.logo` / `institution.footer_logo` at them
3. Set `branding.default_skin` (or override colors via `branding.custom_css` / `custom_css_url`) — `primary_color` is not used by the app
4. Run `npm run build`

### Adding licensed software

1. Add entry to `software.yaml`
2. Specify availability per platform (hpc, vdi, cloud)
3. Add license server info if applicable
4. Software appears in catalog and is searchable

---

## Need Help?

- **Documentation issues:** Open an issue on GitHub
- **Customization questions:** rc-help@northwinds.edu
- **Feature requests:** GitHub discussions
