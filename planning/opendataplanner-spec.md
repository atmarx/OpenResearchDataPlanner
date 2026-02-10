# OpenResearchDataPlanner Technical Specification

**Version:** 0.1.0-draft  
**Date:** 2026-02-04  
**Status:** Draft for review

## Overview

OpenResearchDataPlanner is a self-service web application that helps researchers plan data infrastructure for grant proposals. It guides users through selecting appropriate services based on their data security tier, generates cost estimates (including long-term retention), and produces Data Management Plan (DMP) fragments.

### Design Principles

1. **Template-driven**: All institution-specific content (tiers, services, costs, DMP text) lives in configuration files, not code
2. **Fork-and-own**: Each institution deploys their own instance; no multi-tenancy
3. **Client-side state**: No authentication, no server-side persistence; localStorage + JSON export
4. **Progressive disclosure**: Wizard flow reveals complexity only as needed
5. **Budget transparency**: Show list prices, subsidies, and net costs clearly

### Companion Project

OpenResearchDataPlanner is designed as a planning-phase companion to [OpenChargeback](https://github.com/atmarx/OpenChargeback), which handles actual billing reconciliation. They share design philosophy but are independent deployments.

---

## Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Vue 3 (Composition API) | Reactive, lightweight, good DX |
| **Build** | Vite | Fast builds, good Vue integration |
| **State** | Pinia | Official Vue state management, clean API |
| **Styling** | Tailwind CSS | Utility-first, easy theming |
| **Icons** | Lucide Vue | MIT licensed, comprehensive set |
| **Templating** | Handlebars.js | Client-side template rendering for DMPs |
| **Markdown** | marked | Render DMP fragments as HTML for preview |
| **Storage** | localStorage | Browser-native, no backend required |
| **Deployment** | Static files (nginx/Caddy/S3) | Simplest possible deployment |

### Why Not Nuxt?

Nuxt adds SSR, file-based routing, and conventions that are valuable for larger apps, but OpenResearchDataPlanner is:
- A single-page wizard (no complex routing)
- Entirely client-side (no SSR benefit)
- Config-driven (no dynamic server routes)

Plain Vue + Vite keeps the project simpler and more approachable for institutions forking it.

### Why Not FastAPI Backend?

A backend would be needed if we wanted:
- User accounts / saved sessions on server
- PDF generation server-side
- Complex DMP rendering with Jinja2
- Admin UI for editing templates

None of these are in scope for v1. The template-as-files approach is more GitOps-friendly and easier for institutions to customize. A backend can be added later if needed.

---

## Directory Structure

```
openresearchdataplanner/
├── README.md
├── LICENSE                     # MIT
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── main.js                 # Vue app entry
│   ├── App.vue                 # Root component
│   │
│   ├── assets/
│   │   └── styles/
│   │       └── main.css        # Tailwind imports + custom styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── WizardProgress.vue
│   │   │
│   │   ├── wizard/
│   │   │   ├── WelcomeStep.vue
│   │   │   ├── TierSelectStep.vue
│   │   │   ├── GrantPeriodStep.vue
│   │   │   ├── RetentionStep.vue
│   │   │   ├── ServiceSelectStep.vue
│   │   │   ├── EstimateStep.vue
│   │   │   └── ResultsStep.vue
│   │   │
│   │   ├── services/
│   │   │   ├── ServiceCard.vue
│   │   │   ├── ServiceList.vue
│   │   │   ├── BundleCard.vue
│   │   │   ├── BundleList.vue
│   │   │   └── EstimateInput.vue
│   │   │
│   │   ├── results/
│   │   │   ├── CostBreakdown.vue
│   │   │   ├── ServiceNotes.vue
│   │   │   ├── DmpPreview.vue
│   │   │   └── ExportPanel.vue
│   │   │
│   │   └── ui/
│   │       ├── Modal.vue
│   │       ├── Tooltip.vue
│   │       ├── Card.vue
│   │       └── Button.vue
│   │
│   ├── composables/
│   │   ├── useConfig.js        # Load and access config files
│   │   ├── useCostCalculator.js
│   │   ├── useRetention.js
│   │   ├── useDmpGenerator.js
│   │   └── useSessionStorage.js
│   │
│   ├── stores/
│   │   ├── configStore.js      # Loaded configuration (read-only)
│   │   └── sessionStore.js     # User's planning session (read-write)
│   │
│   └── utils/
│       ├── currency.js         # Formatting helpers
│       ├── dates.js            # Date calculations
│       └── export.js           # JSON/text export utilities
│
├── config/                     # INSTITUTION-SPECIFIC TEMPLATES
│   ├── meta.yaml               # Site metadata (institution name, etc.)
│   ├── tiers.yaml
│   ├── categories.yaml         # Service categories with icons
│   ├── services.yaml
│   ├── mappings.yaml           # Service-tier relationships
│   ├── bundles.yaml
│   ├── retention.yaml
│   └── dmp-templates/
│       ├── _intro.md           # Optional intro boilerplate
│       ├── _outro.md           # Optional closing boilerplate
│       ├── hpc-slurm/
│       │   ├── low.md
│       │   ├── medium.md
│       │   └── high.md
│       ├── research-storage/
│       │   ├── default.md
│       │   └── high.md
│       └── ...
│
├── sample-config/              # GENERIC EXAMPLE (for new institutions)
│   └── (same structure as config/)
│
├── docs/
│   ├── README.md
│   ├── configuration.md        # How to customize templates
│   ├── deployment.md           # Deployment guide
│   └── development.md          # Contributing guide
│
└── scripts/
    ├── validate-config.js      # Validate YAML/references
    └── generate-sample.js      # Generate sample session for testing
```

---

## Configuration Schema

All configuration is YAML for human readability, converted to JSON at build time (or loaded dynamically in dev mode).

### `config/meta.yaml`

```yaml
# Site-wide metadata
institution:
  name: "Northwinds University"
  short_name: "Northwinds"
  logo: "/images/logo.svg"  # optional
  
site:
  title: "Research Data Planner"
  tagline: "Plan your data infrastructure and budget for grant proposals"
  
contact:
  general: "research-computing@northwinds.edu"
  security: "data-security@northwinds.edu"
  consultation_url: "https://northwinds.edu/research-computing/consult"

# Template version (included in exports for tracking)
version: "1.0.0"
last_updated: "2026-02-01"
```

### `config/categories.yaml`

```yaml
categories:
  - slug: compute
    name: "Compute"
    description: "Processing and analysis resources"
    icon: "cpu"  # Lucide icon name
    sort_order: 1
    
  - slug: storage
    name: "Storage"
    description: "Data storage and file systems"
    icon: "hard-drive"
    sort_order: 2
    
  - slug: api
    name: "APIs & Services"
    description: "Cloud APIs, AI services, specialized tools"
    icon: "cloud"
    sort_order: 3
    
  - slug: environment
    name: "Environments"
    description: "Managed research environments and enclaves"
    icon: "box"
    sort_order: 4
    
  - slug: support
    name: "Support Services"
    description: "Consultation, training, and assistance"
    icon: "life-buoy"
    sort_order: 5
```

### `config/tiers.yaml`

```yaml
tiers:
  - slug: low
    name: "Low Risk"
    short_name: "L1"
    sort_order: 1
    color: "green"  # For UI theming
    description: |
      Open science data, publicly available datasets, 
      pre-publication non-sensitive research data.
    examples:
      - "Publicly available genomic databases"
      - "Open source model weights"
      - "Published datasets being reanalyzed"
    help_text: |
      Choose this tier if your data could be made public without
      any negative consequences. This includes open science projects,
      replication studies using public data, and method development
      using synthetic or public datasets.
    consultation_required: false
    retention_questions_required: false
    
  - slug: medium
    name: "Medium Risk"
    short_name: "L2"
    sort_order: 2
    color: "yellow"
    description: |
      Proprietary data, IP-sensitive pre-publication work,
      data under DUA with standard terms.
    examples:
      - "Unpublished research data"
      - "Licensed commercial datasets"
      - "Industry collaboration data"
    help_text: |
      Choose this tier if your data has IP value or is covered by
      a Data Use Agreement, but does not contain regulated data
      (PHI, PII, export-controlled, etc.).
    consultation_required: false
    retention_questions_required: false
    
  - slug: high
    name: "High Risk"
    short_name: "L3"
    sort_order: 3
    color: "orange"
    description: |
      HIPAA, FERPA, IRB-governed human subjects data,
      export-controlled research (EAR/ITAR).
    examples:
      - "Clinical trial data"
      - "Student educational records"
      - "Export-controlled defense research"
    help_text: |
      Choose this tier if your data is subject to regulatory
      requirements such as HIPAA, FERPA, or export controls.
      This tier requires additional retention planning.
    consultation_required: false
    retention_questions_required: true
    
  - slug: restricted
    name: "Restricted"
    short_name: "L4"
    sort_order: 4
    color: "red"
    description: |
      Secure enclaves, bespoke security requirements,
      DOD/defense contractor work, CUI.
    examples:
      - "Classified research"
      - "Defense contractor projects"
      - "Controlled Unclassified Information (CUI)"
    help_text: |
      This tier requires a dedicated secure enclave with custom
      security controls. Pricing and services are determined through
      consultation with the security team.
    consultation_required: true
    consultation_message: |
      Projects at this tier require a consultation with the
      Research Security team to determine appropriate controls
      and budget.
    consultation_contact: "security@northwinds.edu"
```

### `config/services.yaml`

```yaml
services:
  - slug: hpc-slurm
    name: "HPC Cluster (SLURM)"
    category: compute
    description: "Shared high-performance computing cluster for batch workloads"
    long_description: |
      Our primary HPC resource, offering CPU and GPU nodes managed by SLURM.
      Suitable for genomics pipelines, simulations, ML training, and more.
    documentation_url: "https://docs.northwinds.edu/hpc"
    
    cost_model:
      type: tiered
      unit: "SU"
      unit_label: "Service Unit"
      unit_description: "1 SU ≈ 1 CPU-core-hour (GPU hours use weighted SUs)"
      tiers:
        - up_to: 10000
          price: 0.10
          label: "Standard"
        - up_to: 100000
          price: 0.08
          label: "Volume"
        - up_to: null
          price: 0.05
          label: "High Volume"
          
    subsidies:
      - slug: free-scavenger
        name: "Scavenger Partition"
        description: "Free tier for preemptible, opportunistic workloads"
        condition: "Jobs may be preempted; best for fault-tolerant workflows"
        discount_type: percent
        discount_value: 100
        max_units_per_month: 5000
        auto_apply: false  # User must opt-in
        
    archive_option: null  # Compute has no archive
    
    estimation:
      prompt: "How many CPU-core-hours do you expect per month?"
      default_value: 10000
      min_value: 100
      max_value: 10000000
      step: 1000
      presets:
        - label: "Light (single-node, occasional)"
          value: 1000
          description: "A few jobs per week on 1-2 nodes"
        - label: "Moderate (regular multi-node)"
          value: 10000
          description: "Daily jobs using 10-50 nodes"
        - label: "Heavy (large-scale)"
          value: 100000
          description: "Continuous large parallel workloads"
        - label: "Very Heavy (dedicated allocation)"
          value: 500000
          description: "Near-continuous use of significant cluster fraction"

  - slug: research-storage
    name: "Research Storage (GPFS)"
    category: storage
    description: "High-performance parallel filesystem for active research data"
    long_description: |
      Enterprise-grade parallel filesystem with snapshots, quotas, and
      high-throughput access from HPC and campus networks.
    documentation_url: "https://docs.northwinds.edu/storage"
    
    cost_model:
      type: unit
      unit: "TB"
      unit_label: "Terabyte"
      price: 5.00
      billing_period: month
      
    subsidies:
      - slug: base-allocation
        name: "Base Allocation"
        description: "First 500 GB included at no cost per project"
        condition: null
        discount_type: free_units
        discount_value: 0.5  # TB
        auto_apply: true
        
    archive_option:
      service_slug: cold-archive
      description: |
        At grant end, data can be migrated to cold archive storage
        for long-term retention at reduced cost.
        
    estimation:
      prompt: "How much active storage do you need?"
      default_value: 5
      min_value: 0.1
      max_value: 5000
      step: 1
      unit_display: "TB"
      presets:
        - label: "Small project"
          value: 1
          description: "Documents, code, small datasets"
        - label: "Medium project"
          value: 10
          description: "Moderate datasets, some imaging"
        - label: "Data-intensive"
          value: 100
          description: "Genomics, imaging, simulations"
        - label: "Large-scale"
          value: 500
          description: "Major data collection or generation"

  - slug: cold-archive
    name: "Cold Archive Storage"
    category: storage
    description: "Long-term archival storage for retention compliance"
    long_description: |
      Tape-backed archival tier for data that must be retained but
      is not actively accessed. 48-72 hour retrieval time.
    documentation_url: "https://docs.northwinds.edu/archive"
    
    is_archive_tier: true  # Special flag: not directly selectable
    
    cost_model:
      type: unit
      unit: "TB"
      unit_label: "Terabyte"
      price: 0.50
      billing_period: month
      
    subsidies: []
    archive_option: null
    
    estimation: null  # Calculated from primary storage + retention

  - slug: azure-openai
    name: "Azure OpenAI Service"
    category: api
    description: "GPT-4, embeddings, and other Azure-hosted AI models"
    long_description: |
      Institutional Azure OpenAI instance with approved models.
      Data does not leave the university's Azure tenant.
    documentation_url: "https://docs.northwinds.edu/azure-ai"
    
    cost_model:
      type: unit
      unit: "1M tokens"
      unit_label: "Million tokens"
      price: 30.00
      billing_period: month
      note: "Blended rate across models; actual cost varies by model"
      
    subsidies: []
    archive_option: null
    
    estimation:
      prompt: "Estimated token usage per month?"
      default_value: 5
      min_value: 0.1
      max_value: 1000
      step: 1
      unit_display: "M tokens"
      presets:
        - label: "Prototype/testing"
          value: 1
          description: "Development and small-scale testing"
        - label: "Production chatbot"
          value: 10
          description: "Moderate user base, RAG application"
        - label: "Batch processing"
          value: 100
          description: "Large-scale document analysis"

  - slug: secure-enclave
    name: "Secure Research Enclave"
    category: environment
    description: "Isolated environment for restricted data"
    long_description: |
      Purpose-built secure environment meeting specific compliance
      requirements (FISMA, CUI, etc.). Custom configuration per project.
    documentation_url: "https://docs.northwinds.edu/enclave"
    
    cost_model:
      type: consultation
      contact: "security@northwinds.edu"
      note: |
        Pricing varies significantly based on requirements.
        Typical range: $5,000 - $50,000/year depending on scale
        and compliance requirements.
        
    subsidies: []
    archive_option: null
    estimation: null
```

### `config/mappings.yaml`

```yaml
# Service-to-tier mappings with metadata
# If a service-tier combination is not listed, that service
# is NOT available for that tier.

mappings:
  # HPC - available at all non-restricted tiers
  - service: hpc-slurm
    tier: low
    approval: automatic
    notes: null
    dmp_template: "hpc-slurm/low.md"
    
  - service: hpc-slurm
    tier: medium
    approval: automatic
    notes: |
      Data must remain on cluster filesystems during processing.
      Do not copy data to personal devices.
    dmp_template: "hpc-slurm/medium.md"
    
  - service: hpc-slurm
    tier: high
    approval: review
    approval_contact: "hpc-support@northwinds.edu"
    notes: |
      **Additional requirements for High-Risk data:**
      - Signed data handling agreement required
      - Must use the `secure` SLURM partition
      - No job output to shared scratch space
      - Contact HPC support before first submission
    dmp_template: "hpc-slurm/high.md"

  # Research Storage - all non-restricted tiers
  - service: research-storage
    tier: low
    approval: automatic
    notes: null
    dmp_template: "research-storage/default.md"
    
  - service: research-storage
    tier: medium
    approval: automatic
    notes: "Encryption at rest is enabled by default."
    dmp_template: "research-storage/default.md"
    
  - service: research-storage
    tier: high
    approval: review
    approval_contact: "storage-team@northwinds.edu"
    notes: |
      **Additional requirements:**
      - Dedicated project allocation (no shared spaces)
      - Access logging enabled and audited
      - Annual access review required
      - Encryption at rest and in transit
    dmp_template: "research-storage/high.md"

  # Azure OpenAI - low and medium only
  - service: azure-openai
    tier: low
    approval: automatic
    notes: null
    dmp_template: "azure-openai/default.md"
    
  - service: azure-openai
    tier: medium
    approval: automatic
    notes: |
      Do not include sensitive or proprietary data in prompts.
      Use for general analysis, not for processing protected data.
    dmp_template: "azure-openai/default.md"
    
  # Note: No azure-openai mapping for 'high' tier = not available

  # Cold Archive - all tiers (but typically via archive_option)
  - service: cold-archive
    tier: low
    approval: automatic
    notes: null
    dmp_template: "cold-archive/default.md"
    
  - service: cold-archive
    tier: medium
    approval: automatic
    notes: null
    dmp_template: "cold-archive/default.md"
    
  - service: cold-archive
    tier: high
    approval: automatic
    notes: "Archive storage maintains same access controls as source."
    dmp_template: "cold-archive/high.md"

  # Secure Enclave - restricted tier only
  - service: secure-enclave
    tier: restricted
    approval: consultation
    approval_contact: "security@northwinds.edu"
    notes: |
      Secure enclaves are provisioned through consultation.
      Allow 4-8 weeks lead time for setup.
    dmp_template: null  # No auto-generated DMP
```

### `config/bundles.yaml`

```yaml
bundles:
  - slug: genomics-pipeline
    name: "Genomics Pipeline"
    description: |
      Standard setup for genomics and bioinformatics workflows:
      HPC compute for alignment/analysis, high-capacity storage
      for sequence data.
    icon: "dna"
    recommended_tiers: [low, medium, high]
    services:
      - service: hpc-slurm
        default_estimate: 50000  # SU/month
        note: "Typical for WGS pipeline: ~5000 SU per sample"
      - service: research-storage
        default_estimate: 100  # TB
        note: "~1TB raw data per WGS sample; plan for intermediates"
        
  - slug: ml-training
    name: "ML/AI Model Training"
    description: |
      GPU compute with high-speed storage for training
      machine learning models.
    icon: "brain"
    recommended_tiers: [low, medium]
    services:
      - service: hpc-slurm
        default_estimate: 100000
        note: "GPU hours are weighted; 1 GPU-hour ≈ 10 SU"
      - service: research-storage
        default_estimate: 50
        note: "Model checkpoints and training data"
        
  - slug: llm-application
    name: "LLM/Chatbot Application"
    description: |
      Build a chatbot, RAG system, or other LLM-powered application
      using Azure OpenAI with document storage.
    icon: "message-square"
    recommended_tiers: [low, medium]
    services:
      - service: azure-openai
        default_estimate: 10  # M tokens/month
        note: "Varies heavily with user volume and context size"
      - service: research-storage
        default_estimate: 1
        note: "Document corpus and vector indices"
        
  - slug: clinical-data
    name: "Clinical/IRB Data Analysis"
    description: |
      Secure storage and compute for human subjects research
      data under IRB protocol.
    icon: "shield"
    recommended_tiers: [high]
    services:
      - service: hpc-slurm
        default_estimate: 10000
        note: "Using secure partition"
      - service: research-storage
        default_estimate: 10
        note: "PHI storage with audit logging"
```

### `config/retention.yaml`

```yaml
# Retention schedules and requirements
# Users select applicable schedules; longest retention wins

schedules:
  - slug: federal-grant-standard
    name: "Federal Grant (Standard)"
    description: "Standard federal grant data retention requirement"
    years: 3
    regulation: "2 CFR 200.334"
    regulation_url: "https://www.ecfr.gov/current/title-2/section-200.334"
    applies_to_tiers: [low, medium, high]
    is_post_grant: true  # Years counted from grant end date
    is_default: true  # Pre-selected if no other requirements
    archive_required: false
    
  - slug: nih-gds
    name: "NIH Genomic Data Sharing"
    description: "Genomic data under NIH GDS Policy"
    years: 10
    regulation: "NIH GDS Policy"
    regulation_url: "https://sharing.nih.gov/genomic-data-sharing-policy"
    applies_to_tiers: [low, medium, high]
    is_post_grant: true
    is_default: false
    archive_required: true
    
  - slug: irb-human-subjects
    name: "IRB Human Subjects Research"
    description: "Research involving human subjects under IRB protocol"
    years: 20
    regulation: "45 CFR 46 / 21 CFR 50"
    regulation_url: "https://www.hhs.gov/ohrp/regulations-and-policy"
    applies_to_tiers: [high]
    is_post_grant: false  # From data collection date
    is_default: false
    archive_required: true
    trigger_question: "Does your research involve human subjects under an IRB protocol?"
    
  - slug: ferpa
    name: "FERPA Student Records"
    description: "Educational records covered by FERPA"
    years: 7
    regulation: "20 U.S.C. § 1232g"
    regulation_url: "https://www2.ed.gov/policy/gen/guid/fpco/ferpa"
    applies_to_tiers: [high]
    is_post_grant: false
    is_default: false
    archive_required: true
    trigger_question: "Does your research involve student educational records?"
    
  - slug: export-control
    name: "Export Controlled Data"
    description: "Data subject to EAR or ITAR export controls"
    years: 5
    regulation: "EAR/ITAR"
    applies_to_tiers: [high]
    is_post_grant: true  # From project completion
    is_default: false
    archive_required: true
    trigger_question: "Is your research subject to export controls (EAR/ITAR)?"

# Archive cost calculation settings
archive_settings:
  # When calculating archive costs, assume data reduces to this
  # percentage of active storage (deduplication, cleanup, etc.)
  typical_archive_ratio: 0.7
  
  # Prompt user to estimate if they expect different
  allow_custom_ratio: true
  custom_ratio_prompt: |
    What percentage of your active data will need long-term retention?
    (Default: 70% - accounts for temporary files, duplicates, etc.)
```

### DMP Templates (`config/dmp-templates/`)

DMP templates use Handlebars syntax for variable substitution.

**`config/dmp-templates/hpc-slurm/medium.md`**
```markdown
## High-Performance Computing

Research computations will be performed on {{institution.name}}'s HPC cluster,
a shared resource managed with the SLURM workload manager.

**Resource Allocation:**
- Estimated usage: {{service.estimate}} {{service.unit_label}} per month
- Total grant period: {{service.total_estimate}} {{service.unit_label}}
- Estimated cost: {{service.total_cost_formatted}}

**Data Handling:**
Data processed on the HPC cluster will remain on cluster filesystems during
active computation. {{#if service.notes}}

**Special Considerations:**
{{service.notes}}
{{/if}}

**Access Control:**
Access to compute allocations is managed through the PI's account and
authorized project members. Job accounting tracks all resource usage
by user and project.
```

**`config/dmp-templates/research-storage/high.md`**
```markdown
## Data Storage

Research data will be stored on {{institution.name}}'s Research Storage
system, a high-performance parallel filesystem with enterprise security
controls.

**Storage Allocation:**
- Active storage needed: {{service.estimate}} TB
- Estimated monthly cost: {{service.monthly_cost_formatted}}
- Grant period cost: {{service.total_cost_formatted}}

**Security Controls:**
Given the {{tier.name}} classification of this data:
- Dedicated project allocation with isolated namespace
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Comprehensive access logging with audit trail
- Annual access review required

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. After the active grant period, data will be
migrated to archival storage:
- Archive storage: {{archive.estimate}} TB
- Annual archive cost: {{archive.annual_cost_formatted}}
- Total retention cost: {{archive.total_cost_formatted}}
{{/if}}

**Access Control:**
Access is restricted to PI-authorized personnel. All access is logged
and subject to periodic review by the data steward.
```

---

## State Management

### Session Store (`stores/sessionStore.js`)

The session store holds all user inputs and derived calculations.

```javascript
// Pinia store structure
{
  // Metadata
  id: "uuid-v4",
  created_at: "ISO timestamp",
  updated_at: "ISO timestamp",
  template_version: "1.0.0",
  
  // Wizard progress
  current_step: "tier-select",  // welcome | tier-select | grant-period | retention | service-select | estimate | results
  completed_steps: ["welcome", "tier-select"],
  
  // User selections
  tier: "medium",  // tier slug
  
  grant_period: {
    start_date: "2026-09-01",
    end_date: "2029-08-31",
    months: 36
  },
  
  retention: {
    schedules: ["federal-grant-standard", "nih-gds"],
    longest_years: 10,
    archive_ratio: 0.7,
    custom_ratio: false
  },
  
  selected_services: [
    {
      service_slug: "hpc-slurm",
      estimate: 50000,  // user's estimate in service units
      use_subsidy: "free-scavenger",  // slug or null
      notes: ""  // user's notes
    },
    {
      service_slug: "research-storage",
      estimate: 100,
      use_subsidy: null,
      notes: ""
    }
  ],
  
  // Calculated (derived from above)
  cost_summary: {
    monthly_total: 475.00,
    grant_period_total: 17100.00,
    archive_annual: 350.00,
    archive_total: 2450.00,  // 7 years post-grant
    grand_total: 19550.00,
    
    by_service: [
      {
        service_slug: "hpc-slurm",
        monthly: 0,  // using free tier
        grant_total: 0,
        archive: null
      },
      {
        service_slug: "research-storage",
        monthly: 475.00,  // (100 - 0.5 free) * $5
        grant_total: 17100.00,
        archive_annual: 350.00,  // 70 TB * $0.50
        archive_total: 2450.00
      }
    ]
  }
}
```

### Config Store (`stores/configStore.js`)

Read-only store for loaded configuration. Populated on app init.

```javascript
{
  meta: { /* from meta.yaml */ },
  tiers: [ /* from tiers.yaml */ ],
  categories: [ /* from categories.yaml */ ],
  services: [ /* from services.yaml */ ],
  mappings: [ /* from mappings.yaml */ ],
  bundles: [ /* from bundles.yaml */ ],
  retention: { /* from retention.yaml */ },
  dmpTemplates: { /* compiled Handlebars templates */ },
  
  // Derived lookups (computed on load)
  servicesBySlug: { "hpc-slurm": {...}, ... },
  tiersBySlug: { "low": {...}, ... },
  mappingLookup: { "hpc-slurm:medium": {...}, ... },
  servicesForTier: { "medium": ["hpc-slurm", "research-storage", ...], ... }
}
```

---

## Cost Calculation Logic

### `composables/useCostCalculator.js`

```javascript
function calculateServiceCost(service, estimate, subsidySlug, grantMonths) {
  const costModel = service.cost_model;
  let monthlyGross = 0;
  
  // Calculate gross cost based on model type
  switch (costModel.type) {
    case 'unit':
      monthlyGross = estimate * costModel.price;
      break;
      
    case 'tiered':
      monthlyGross = calculateTieredCost(estimate, costModel.tiers);
      break;
      
    case 'flat':
      monthlyGross = costModel.price;
      break;
      
    case 'consultation':
      return { type: 'consultation', contact: costModel.contact };
  }
  
  // Apply subsidy if selected
  let monthlyNet = monthlyGross;
  let subsidyAmount = 0;
  
  if (subsidySlug) {
    const subsidy = service.subsidies.find(s => s.slug === subsidySlug);
    if (subsidy) {
      if (subsidy.discount_type === 'percent') {
        const eligibleUnits = Math.min(estimate, subsidy.max_units_per_month || Infinity);
        const discountedCost = calculateUnitCost(eligibleUnits, costModel);
        subsidyAmount = discountedCost * (subsidy.discount_value / 100);
      } else if (subsidy.discount_type === 'free_units') {
        const freeUnits = subsidy.discount_value;
        const billableUnits = Math.max(0, estimate - freeUnits);
        monthlyNet = calculateUnitCost(billableUnits, costModel);
        subsidyAmount = monthlyGross - monthlyNet;
      }
      monthlyNet = monthlyGross - subsidyAmount;
    }
  }
  
  return {
    type: 'calculated',
    monthly: {
      gross: monthlyGross,
      subsidy: subsidyAmount,
      net: monthlyNet
    },
    grant_period: {
      gross: monthlyGross * grantMonths,
      subsidy: subsidyAmount * grantMonths,
      net: monthlyNet * grantMonths
    }
  };
}

function calculateArchiveCost(storageService, archiveService, estimate, archiveRatio, retentionYears, grantYears) {
  const archiveYears = Math.max(0, retentionYears - grantYears);
  if (archiveYears === 0) return null;
  
  const archiveTB = estimate * archiveRatio;
  const annualCost = archiveTB * archiveService.cost_model.price * 12;
  
  return {
    years: archiveYears,
    tb: archiveTB,
    annual: annualCost,
    total: annualCost * archiveYears
  };
}
```

---

## Wizard Navigation Logic

```javascript
// Step definitions with conditions
const STEPS = [
  { 
    id: 'welcome',
    component: WelcomeStep,
    canProceed: () => true  // Always can proceed
  },
  {
    id: 'tier-select',
    component: TierSelectStep,
    canProceed: (session) => !!session.tier
  },
  {
    id: 'grant-period',
    component: GrantPeriodStep,
    canProceed: (session) => session.grant_period.months > 0,
    skip: (session, config) => {
      // Skip if restricted tier (goes straight to consultation)
      const tier = config.tiersBySlug[session.tier];
      return tier?.consultation_required;
    }
  },
  {
    id: 'retention',
    component: RetentionStep,
    canProceed: (session) => session.retention.schedules.length > 0,
    skip: (session, config) => {
      // Skip if tier doesn't require retention questions
      const tier = config.tiersBySlug[session.tier];
      return !tier?.retention_questions_required;
    }
  },
  {
    id: 'service-select',
    component: ServiceSelectStep,
    canProceed: (session) => session.selected_services.length > 0,
    skip: (session, config) => {
      const tier = config.tiersBySlug[session.tier];
      return tier?.consultation_required;
    }
  },
  {
    id: 'estimate',
    component: EstimateStep,
    canProceed: (session) => session.selected_services.every(s => s.estimate > 0),
    skip: (session, config) => {
      const tier = config.tiersBySlug[session.tier];
      return tier?.consultation_required;
    }
  },
  {
    id: 'results',
    component: ResultsStep,
    canProceed: () => true
  }
];
```

---

## Export Formats

### Session Export (JSON)

Full session state for import/restore:

```json
{
  "export_version": "1.0",
  "exported_at": "2026-02-04T10:30:00Z",
  "template_version": "1.0.0",
  "institution": "Northwinds University",
  "session": { /* full session store state */ }
}
```

### Budget Export (Markdown)

```markdown
# Research Data Budget Estimate

**Generated:** February 4, 2026  
**Template Version:** 1.0.0  
**Institution:** Northwinds University

## Project Parameters

- **Data Classification:** Medium Risk (L2)
- **Grant Period:** September 2026 – August 2029 (36 months)
- **Retention Requirement:** NIH Genomic Data Sharing (10 years post-grant)

## Cost Summary

| Category | Monthly | Grant Period (3 yr) | Archive (7 yr) |
|----------|---------|---------------------|----------------|
| HPC Cluster | $0* | $0* | — |
| Research Storage | $475 | $17,100 | $2,450 |
| **Total** | **$475** | **$17,100** | **$2,450** |

*Using Scavenger Partition (free tier)

**Grand Total (Grant + Archive):** $19,550

## Service Details

### HPC Cluster (SLURM)
- Usage estimate: 50,000 SU/month
- Subsidy applied: Scavenger Partition (100% discount up to 5,000 SU)
- Note: Jobs may be preempted; suitable for fault-tolerant workflows

### Research Storage (GPFS)
- Storage estimate: 100 TB
- Base allocation: 0.5 TB free
- Billable storage: 99.5 TB × $5.00/TB-mo = $497.50/mo

### Archive Storage (Post-Grant)
- Archive estimate: 70 TB (70% of active)
- Duration: 7 years (10 year retention - 3 year grant)
- Annual cost: 70 TB × $0.50/TB-mo × 12 = $420/yr

## Notes & Caveats

**Research Storage (Medium Risk):**
Encryption at rest is enabled by default.

---
*This estimate was generated using OpenResearchDataPlanner. Actual costs may vary.
Consult with Research Computing for final budget approval.*
```

### DMP Export (Markdown)

Concatenation of DMP fragments with context:

```markdown
# Data Management Plan

**Project:** [User enters or leaves blank]  
**PI:** [User enters or leaves blank]  
**Data Classification:** Medium Risk  
**Generated:** February 4, 2026

---

## High-Performance Computing

Research computations will be performed on Northwinds University's HPC cluster...
[rendered hpc-slurm/medium.md template]

---

## Data Storage

Research data will be stored on Northwinds University's Research Storage system...
[rendered research-storage/default.md template]

---

## Data Retention

Data will be retained in accordance with NIH Genomic Data Sharing requirements
(10 years from project completion). After the active grant period, data will
be migrated to archival storage...

---

*This Data Management Plan was generated using OpenResearchDataPlanner and should be
reviewed and customized before submission. Template version: 1.0.0*
```

---

## Deployment

### Development

```bash
# Clone and install
git clone https://github.com/yourorg/openresearchdataplanner.git
cd openresearchdataplanner
npm install

# Copy sample config and customize
cp -r sample-config/ config/

# Run dev server
npm run dev
```

### Production Build

```bash
# Build static files
npm run build

# Output in dist/
# Deploy to any static host: nginx, Caddy, S3, GitHub Pages, etc.
```

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Configuration Updates

When templates change:
1. Edit YAML files in `config/`
2. Rebuild: `npm run build`
3. Deploy new `dist/`

For GitOps workflows, this integrates naturally with CI/CD.

---

## Future Considerations (Out of Scope for v1)

These are explicitly not in v1 but are designed-for:

1. **PDF Export**: Add server-side PDF generation (or client-side with jsPDF)
2. **Admin UI**: Add if demand warrants; keep database-backed config
3. **Multi-language**: i18n support in templates
4. **API Backend**: FastAPI layer for complex rendering or integrations
5. **OpenChargeback Integration**: Export projected budgets as baseline
6. **Comparison Mode**: "What if High Risk vs Medium Risk?"
7. **Analytics**: Anonymous usage stats for service planning

---

## Open Questions for Review

1. **YAML vs JSON for config**: I spec'd YAML for readability, but JSON is more browser-native. Build step converts YAML→JSON, or ship JSON directly?

2. **Template hot-reload in dev**: Should dev mode watch `config/` and reload, or require restart?

3. **Default institution config**: Ship with realistic sample data (like OpenChargeback), or minimal skeleton?

4. **Accessibility**: Any specific a11y requirements beyond semantic HTML + ARIA?

5. **Mobile support**: Full responsive, or "works but desktop-optimized"?

---

## Next Steps

With your approval of this spec:

1. Initialize project with Vite + Vue 3 + Pinia + Tailwind
2. Create config loading infrastructure
3. Build wizard shell with navigation
4. Implement each step component
5. Add cost calculation logic
6. Add DMP generation
7. Add export functionality
8. Write sample config matching Northwinds (genericized)
9. Documentation

Ready when you are.
