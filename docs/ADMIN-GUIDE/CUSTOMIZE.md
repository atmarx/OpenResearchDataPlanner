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
7. [DMP Templates](#dmp-templates)
8. [Validation & Deployment](#validation--deployment)
9. [Common Customizations](#common-customizations)

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
└── dmp-templates/            # Handlebars templates for DMP output
    ├── storage/
    ├── compute/
    └── ...
```

---

## Core Configuration

### meta.yaml

Institution identity, branding, and primary contact information.

```yaml
# config/meta.yaml

institution:
  name: "Northwinds University"
  short_name: "Northwinds"
  abbreviation: "NWU"
  logo_url: "/assets/logo.svg"
  favicon_url: "/assets/favicon.ico"
  primary_color: "#003366"      # Used in UI theming

  # Research computing organization name
  rc_name: "Research Computing"
  rc_url: "https://rc.northwinds.edu"

contact:
  # Primary support
  general: "rc-help@northwinds.edu"
  general_name: "Research Computing Help Desk"

  # Security/compliance inquiries
  security: "research-security@northwinds.edu"

  # Export control
  export_control: "export-control@northwinds.edu"

  # Consultation booking
  consultation_url: "https://calendly.com/northwinds-rc/consult"
  consultation_description: "30-minute consultation with RC staff"

  # ServiceNow or ticketing integration (optional)
  ticketing_url: "https://northwinds.service-now.com/rc"

# App versioning
version: "1.0.0"
schema_version: "1.0"            # Schema version for upgrade compatibility
last_updated: "2025-01-15"

# Feature flags
features:
  show_pricing: true           # Show cost estimates
  show_comparison: true        # Enable service comparison modal
  show_software_catalog: true  # Enable software catalog
  show_access_program: true    # Show ACCESS national resources
  require_auth: false          # Require SSO login (V2)
```

---

### tiers.yaml

Data security classifications. Most institutions use 3-4 tiers aligned with their data governance policy.

```yaml
# config/tiers.yaml

tiers:
  - slug: L1
    name: "Low (Public Data)"
    short_name: "Low"
    description: "Public or non-sensitive research data"
    color: "green"
    icon: "unlock"

    # What this tier means for users
    examples:
      - "Published datasets"
      - "Public domain images"
      - "Non-sensitive simulations"

    # Workflow implications
    consultation_required: false
    security_review_required: false
    self_service: true
    typical_provisioning_time: "Same day"

  - slug: L2
    name: "Medium (Internal Data)"
    short_name: "Medium"
    description: "Pre-publication research, proprietary methods"
    color: "yellow"
    icon: "shield"

    examples:
      - "Unpublished experimental results"
      - "Proprietary analysis methods"
      - "Internal collaboration data"

    consultation_required: false
    security_review_required: false
    self_service: true
    typical_provisioning_time: "Same day"

  - slug: L3
    name: "High (Regulated Data)"
    short_name: "High"
    description: "PHI, FERPA, PII - requires compliance controls"
    color: "orange"
    icon: "shield-check"

    examples:
      - "Patient medical records (HIPAA/PHI)"
      - "Student education records (FERPA)"
      - "Identifiable human subjects data"

    compliance_types:
      - hipaa
      - ferpa
      - pii

    consultation_required: true
    security_review_required: false  # Usually pre-approved services
    self_service: false
    typical_provisioning_time: "3-7 business days"

    # Show workflow explainer modal when selected
    show_workflow_modal: true

  - slug: L4
    name: "Restricted (Export-Controlled)"
    short_name: "Restricted"
    description: "ITAR, EAR, CUI - requires dedicated infrastructure"
    color: "red"
    icon: "lock"

    examples:
      - "Defense research data (ITAR)"
      - "Controlled Unclassified Information (CUI)"
      - "Export-controlled technology (EAR)"

    compliance_types:
      - itar
      - ear
      - cui
      - nist_800_171

    consultation_required: true
    security_review_required: true
    self_service: false
    typical_provisioning_time: "3-6 weeks"

    show_workflow_modal: true

    # Special warnings
    warnings:
      - "Only US persons may access this data"
      - "Requires dedicated isolated infrastructure"
      - "Annual recertification required"

# Default tier if user skips questionnaire
default_tier: L2
```

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
    order: 1

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
    order: 2

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
    order: 3

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
    order: 4

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

---

### services.yaml

Complete service definitions including pricing, tier availability, and comparison features.

```yaml
# config/services.yaml

services:
  # ============================================================
  # COMPUTE SERVICES
  # ============================================================

  - slug: hpc-free-tier
    name: "HPC Free Tier"
    category: compute

    description: "No-cost introduction to HPC with limited resources"
    long_description: |
      Perfect for learning HPC basics, testing workflows, or small analyses.
      Includes 100 GPU-hours and 10,000 CPU-hours per year at no cost.

    # Tier availability (which data tiers can use this service)
    available_tiers:
      - L1
      - L2

    # Cost model
    cost_model:
      type: free
      notes: "No cost - included with university affiliation"

    # Limits for free tier
    limits:
      cpu_hours_per_year: 10000
      gpu_hours_per_year: 100
      max_concurrent_jobs: 2
      max_job_duration_hours: 24

    # Estimation UI
    estimation:
      unit: "SU"
      prompt: "How many Service Units do you need?"
      default_value: 5000
      help_calculator: "cpu"  # Opens Help Me Estimate on CPU tab

    # Comparison features (matches keys from categories.yaml)
    # Each feature has a 'value' and optional 'detail':
    #   - value: "full"    = Feature fully available (green checkmark)
    #   - value: "partial" = Available with limitations (yellow, show detail)
    #   - value: "none"    = Not available (red X)
    comparison_features:
      gpu_available:
        value: partial
        detail: "100 GPU-hours/year included"
      batch_jobs:
        value: full
      interactive:
        value: partial
        detail: "2-hour interactive limit"
      auto_scaling:
        value: none
        detail: "Queue-based scheduling"
      cost_predictable:
        value: full
        detail: "Always free"
      beginner_friendly:
        value: partial
        detail: "Requires SLURM basics"
      high_tier_data:
        value: none
        detail: "L1/L2 only"
      free_tier:
        value: full

    # Links
    documentation_url: "https://docs.rc.northwinds.edu/hpc/free-tier"
    request_url: "https://rc.northwinds.edu/request/hpc-free"

    # Tags for filtering
    tags:
      - free
      - beginner
      - hpc

  - slug: hpc-standard
    name: "HPC Standard (CPU)"
    category: compute

    description: "Production CPU compute on the campus cluster"
    long_description: |
      Full access to the campus HPC cluster for CPU-based workloads.
      Supports multi-node MPI jobs, large memory nodes, and long-running
      batch jobs. Billed per Service Unit (1 SU = 1 core-hour).

    available_tiers:
      - L1
      - L2

    cost_model:
      type: unit
      unit: "SU"
      price: 0.08
      billing_period: usage
      minimum_purchase: 1000
      bulk_discounts:
        - threshold: 100000
          price: 0.07
        - threshold: 500000
          price: 0.06

    estimation:
      unit: "SU"
      prompt: "How many Service Units do you need per year?"
      default_value: 50000
      min_value: 1000
      presets:
        - label: "Small project"
          value: 10000
          description: "~10 genome alignments"
        - label: "Medium project"
          value: 100000
          description: "Typical funded project"
        - label: "Large project"
          value: 500000
          description: "Large-scale simulations"
      help_calculator: "cpu"

    comparison_features:
      gpu_available:
        value: none
        detail: "CPU only; see HPC GPU"
      batch_jobs:
        value: full
      interactive:
        value: partial
        detail: "4-hour interactive limit"
      auto_scaling:
        value: none
        detail: "Queue-based scheduling"
      cost_predictable:
        value: full
        detail: "$0.08/SU"
      beginner_friendly:
        value: partial
        detail: "Requires SLURM knowledge"
      high_tier_data:
        value: none
        detail: "L1/L2 only"
      free_tier:
        value: none
        detail: "See HPC Free Tier"

    documentation_url: "https://docs.rc.northwinds.edu/hpc/standard"
    request_url: "https://rc.northwinds.edu/request/hpc"

    tags:
      - hpc
      - cpu
      - batch

  - slug: hpc-gpu
    name: "HPC GPU"
    category: compute

    description: "GPU-accelerated compute on NVIDIA V100 GPUs"
    long_description: |
      Access to NVIDIA V100 GPUs (32GB HBM2) for machine learning,
      deep learning, and GPU-accelerated simulations. Supports CUDA,
      cuDNN, and common ML frameworks.

    available_tiers:
      - L1
      - L2

    cost_model:
      type: unit
      unit: "GPU-hour"
      price: 0.35
      billing_period: usage

    estimation:
      unit: "GPU-hours"
      prompt: "How many GPU-hours do you need per year?"
      default_value: 1000
      help_calculator: "gpu"

    comparison_features:
      gpu_available:
        value: full
        detail: "NVIDIA V100 32GB"
      batch_jobs:
        value: full
      interactive:
        value: partial
        detail: "4-hour interactive limit"
      auto_scaling:
        value: none
      cost_predictable:
        value: full
        detail: "$0.35/GPU-hour"
      beginner_friendly:
        value: partial
        detail: "Requires SLURM + CUDA"
      high_tier_data:
        value: none
      free_tier:
        value: none
        detail: "See HPC Free Tier"

    documentation_url: "https://docs.rc.northwinds.edu/hpc/gpu"

    tags:
      - hpc
      - gpu
      - ml

  - slug: cloud-aws-standard
    name: "AWS Research Cloud (Standard)"
    category: compute

    description: "Self-service AWS access for L1/L2 workloads"
    long_description: |
      Managed AWS account with pre-configured security controls,
      cost guardrails, and streamlined billing through the university.
      Supports EC2, S3, Lambda, and most AWS services.

    available_tiers:
      - L1
      - L2

    cost_model:
      type: passthrough
      notes: "AWS pricing + 5% admin fee"
      billing_period: month
      typical_monthly:
        small: 100
        medium: 500
        large: 2000

    estimation:
      unit: "$/month"
      prompt: "Estimated monthly AWS spend?"
      default_value: 500
      presets:
        - label: "Development"
          value: 100
        - label: "Production"
          value: 1000
        - label: "Large scale"
          value: 5000

    comparison_features:
      gpu_available:
        value: full
        detail: "P3, P4, G4 instances"
      batch_jobs:
        value: partial
        detail: "Via AWS Batch"
      interactive:
        value: full
        detail: "SSH, SSM, web consoles"
      auto_scaling:
        value: full
        detail: "Native ASG support"
      cost_predictable:
        value: none
        detail: "Variable; use budgets"
      beginner_friendly:
        value: none
        detail: "AWS expertise required"
      high_tier_data:
        value: none
        detail: "See AWS High-Security"
      free_tier:
        value: none

    documentation_url: "https://docs.rc.northwinds.edu/cloud/aws"

    tags:
      - cloud
      - aws
      - flexible

  - slug: cloud-high-security
    name: "Cloud High-Security (HIPAA/PHI)"
    category: compute

    description: "HIPAA-compliant cloud environment for regulated data"
    long_description: |
      Fully managed cloud environment with HIPAA BAA, encryption at rest,
      audit logging, and compliance controls pre-configured. Supports
      AWS and Azure backends.

    available_tiers:
      - L3

    cost_model:
      type: consultation
      notes: "Pricing varies by requirements; contact for quote"
      typical_monthly:
        small: 500
        medium: 2000
        large: 10000

    comparison_features:
      gpu_available:
        value: full
        detail: "With approval"
      batch_jobs:
        value: full
      interactive:
        value: full
      auto_scaling:
        value: full
      cost_predictable:
        value: partial
        detail: "Depends on usage"
      beginner_friendly:
        value: partial
        detail: "Managed by RC"
      high_tier_data:
        value: full
        detail: "HIPAA BAA in place"
      free_tier:
        value: none

    # Compliance badges
    compliance:
      - hipaa
      - baa

    documentation_url: "https://docs.rc.northwinds.edu/cloud/high-security"

    tags:
      - cloud
      - hipaa
      - compliant

  # ============================================================
  # STORAGE SERVICES
  # ============================================================

  - slug: research-storage
    name: "Research Storage"
    category: storage

    description: "High-performance shared storage for active research data"
    long_description: |
      GPFS-based parallel filesystem mounted on HPC cluster and available
      via Globus. Includes daily snapshots with 30-day retention.

    available_tiers:
      - L1
      - L2

    cost_model:
      type: tiered
      unit: "TB"
      billing_period: month
      tiers:
        - up_to: 1
          price: 0
          note: "First 1 TB free"
        - up_to: 10
          price: 5
        - up_to: 100
          price: 4
        - above: 100
          price: 3

    # Subsidies that auto-apply
    subsidies:
      - slug: base-allocation
        name: "Base Allocation"
        description: "First 1 TB included at no cost"
        discount_type: free_units
        discount_value: 1
        auto_apply: true

    estimation:
      unit: "TB"
      prompt: "How much active storage do you need?"
      default_value: 5
      help_calculator: "storage"

    comparison_features:
      hpc_mounted:
        value: full
        detail: "Direct HPC access"
      high_throughput:
        value: full
        detail: "Parallel filesystem"
      snapshots:
        value: full
        detail: "Daily, 30-day retention"
      collaboration:
        value: full
        detail: "Unix groups"
      external_sharing:
        value: partial
        detail: "Via Globus"
      large_files:
        value: full
        detail: "No file size limit"
      high_tier_data:
        value: none
        detail: "L1/L2 only"
      free_allocation:
        value: full
        detail: "1 TB free"

    documentation_url: "https://docs.rc.northwinds.edu/storage/research"

    tags:
      - storage
      - hpc
      - active

  - slug: archive-storage
    name: "Archive Storage"
    category: storage

    description: "Low-cost cold storage for long-term data retention"
    long_description: |
      Tape-backed archive for data you need to keep but rarely access.
      Ideal for grant retention requirements. Retrieval takes 4-24 hours.

    available_tiers:
      - L1
      - L2

    cost_model:
      type: unit
      unit: "TB"
      price: 1.50
      billing_period: month
      notes: "Plus $0.50/TB retrieval fee"

    estimation:
      unit: "TB"
      prompt: "How much archive storage do you need?"
      default_value: 10

    comparison_features:
      hpc_mounted:
        value: none
        detail: "Retrieval required"
      high_throughput:
        value: none
        detail: "4-24 hour retrieval"
      snapshots:
        value: none
      collaboration:
        value: partial
      external_sharing:
        value: none
      large_files:
        value: full
      high_tier_data:
        value: none
      free_allocation:
        value: none

    documentation_url: "https://docs.rc.northwinds.edu/storage/archive"

    tags:
      - storage
      - archive
      - cold

  # ============================================================
  # ENVIRONMENT SERVICES
  # ============================================================

  - slug: vdi-standard
    name: "Virtual Desktop (Standard)"
    category: environment

    description: "Persistent Windows or Linux desktop VM"
    long_description: |
      Dedicated virtual machine with full desktop environment.
      Pre-installed with common research software. Access from
      anywhere via web browser.

    available_tiers:
      - L1
      - L2

    cost_model:
      type: subscription
      billing_period: month
      options:
        - name: "Standard"
          specs: "4 vCPU, 16 GB RAM, 100 GB SSD"
          price: 50
        - name: "Performance"
          specs: "8 vCPU, 32 GB RAM, 250 GB SSD"
          price: 100
        - name: "High Memory"
          specs: "8 vCPU, 64 GB RAM, 500 GB SSD"
          price: 175

    estimation:
      unit: "VMs"
      prompt: "How many virtual desktops do you need?"
      default_value: 1

    comparison_features:
      dedicated_resources:
        value: full
      gui_desktop:
        value: full
        detail: "Windows or Linux"
      web_accessible:
        value: full
        detail: "Browser-based access"
      admin_control:
        value: partial
        detail: "Install user software"
      high_tier_data:
        value: none
        detail: "See VDI HIPAA"
      scalable:
        value: partial
        detail: "Resize with downtime"
      preconfigured_software:
        value: full
        detail: "MATLAB, R, Python, etc."
      cost_predictable:
        value: full
        detail: "$50-175/month"

    documentation_url: "https://docs.rc.northwinds.edu/vdi/standard"

    tags:
      - vdi
      - desktop
      - gui

  - slug: vdi-hipaa
    name: "Virtual Desktop (HIPAA)"
    category: environment

    description: "HIPAA-compliant virtual desktop for regulated data"

    available_tiers:
      - L3

    cost_model:
      type: subscription
      billing_period: month
      options:
        - name: "Standard"
          specs: "4 vCPU, 16 GB RAM, 100 GB encrypted SSD"
          price: 100
        - name: "Performance"
          specs: "8 vCPU, 32 GB RAM, 250 GB encrypted SSD"
          price: 175

    comparison_features:
      dedicated_resources:
        value: full
      gui_desktop:
        value: full
      web_accessible:
        value: full
        detail: "MFA required"
      admin_control:
        value: partial
        detail: "Approved software only"
      high_tier_data:
        value: full
        detail: "HIPAA compliant"
      scalable:
        value: partial
      preconfigured_software:
        value: full
      cost_predictable:
        value: full

    compliance:
      - hipaa
      - baa

    documentation_url: "https://docs.rc.northwinds.edu/vdi/hipaa"

    tags:
      - vdi
      - hipaa
      - compliant

  # ============================================================
  # EXTERNAL/NATIONAL RESOURCES
  # ============================================================

  - slug: access-explore
    name: "ACCESS Explore"
    category: external

    description: "Auto-approved 400K credits for trying ACCESS systems"
    long_description: |
      No-cost compute on national supercomputers through NSF's ACCESS
      program. Explore allocations are auto-approved within 1 business
      day - perfect for testing workflows before requesting larger
      allocations.

    available_tiers:
      - L1
      - L2

    cost_model:
      type: free
      notes: "Funded by NSF - no cost to researchers"

    limits:
      credits: 400000
      duration_months: 12
      renewable: true

    estimation:
      unit: "ACCESS credits"
      prompt: "How many ACCESS credits do you need?"
      default_value: 400000
      help_text: "1 credit ≈ 1 CPU-hour on standard systems"

    comparison_features:
      free_nsf:
        value: full
        detail: "No cost"
      merit_based:
        value: none
        detail: "Auto-approved"
      national_scale:
        value: partial
        detail: "Smaller systems"
      gpu_available:
        value: partial
        detail: "Limited GPU access"
      large_scale:
        value: none
        detail: "See ACCESS Discover"
      beginner_friendly:
        value: full
        detail: "1-day approval"

    external_url: "https://allocations.access-ci.org/"
    documentation_url: "https://docs.rc.northwinds.edu/access/explore"

    tags:
      - access
      - free
      - national

  - slug: access-discover
    name: "ACCESS Discover"
    category: external

    description: "Up to 1.5M credits with short justification"

    available_tiers:
      - L1
      - L2

    cost_model:
      type: free
      notes: "Funded by NSF - requires brief application"

    limits:
      credits: 1500000
      duration_months: 12

    comparison_features:
      free_nsf:
        value: full
      merit_based:
        value: partial
        detail: "1-page justification"
      national_scale:
        value: full
        detail: "Frontera, Delta, etc."
      gpu_available:
        value: full
        detail: "A100, H100 GPUs"
      large_scale:
        value: partial
      beginner_friendly:
        value: partial
        detail: "~1 week approval"

    external_url: "https://allocations.access-ci.org/"

    tags:
      - access
      - free
      - national
```

---

### bundles.yaml

Pre-configured service combinations for common use cases.

```yaml
# config/bundles.yaml

bundles:
  - slug: hpc-starter
    name: "HPC Starter"
    description: "Everything you need to start using HPC"
    icon: "rocket"

    # Who this is for
    recommended_for:
      - "New HPC users"
      - "Testing workflows"
      - "Small analyses"

    # Which tiers this bundle works with
    recommended_tiers:
      - L1
      - L2

    # Services included
    services:
      - service: hpc-free-tier
        default_estimate: 5000
        required: true
      - service: research-storage
        default_estimate: 1
        required: true

    # Estimated total cost
    estimated_monthly_cost: 0

    # Next steps after selection
    onboarding_steps:
      - "Complete HPC orientation (30 min online)"
      - "Request cluster account"
      - "Transfer first dataset"

  - slug: ml-research
    name: "Machine Learning Research"
    description: "GPU compute and storage for ML projects"
    icon: "brain"

    recommended_for:
      - "Deep learning training"
      - "Computer vision"
      - "NLP research"

    recommended_tiers:
      - L1
      - L2

    services:
      - service: hpc-gpu
        default_estimate: 2000
        required: true
      - service: research-storage
        default_estimate: 10
        required: true
      - service: archive-storage
        default_estimate: 20
        required: false

    estimated_monthly_cost: 750

    onboarding_steps:
      - "Complete GPU computing workshop"
      - "Set up Conda environment"
      - "Configure Weights & Biases integration"

  - slug: clinical-research
    name: "Clinical Research (HIPAA)"
    description: "Compliant infrastructure for patient data"
    icon: "heart-pulse"

    recommended_for:
      - "Clinical trials"
      - "Patient data analysis"
      - "Health informatics"

    recommended_tiers:
      - L3

    requires_consultation: true

    services:
      - service: cloud-high-security
        required: true
      - service: vdi-hipaa
        default_estimate: 2
        required: true

    estimated_monthly_cost: "Contact for quote"

    compliance_notes:
      - "HIPAA BAA required"
      - "Security review within 1 week"
      - "Annual compliance training required"

    onboarding_steps:
      - "Schedule compliance consultation"
      - "Complete HIPAA training"
      - "Sign data use agreement"
      - "Receive environment credentials"

  - slug: national-scale
    name: "National Scale Computing"
    description: "ACCESS allocations for large-scale research"
    icon: "globe"

    recommended_for:
      - "Large simulations"
      - "Big data analysis"
      - "Multi-institution collaborations"

    recommended_tiers:
      - L1
      - L2

    services:
      - service: access-explore
        required: true
        note: "Start here to test workflows"
      - service: access-discover
        required: false
        note: "Apply after validating on Explore"
      - service: research-storage
        default_estimate: 5
        note: "For staging data"

    estimated_monthly_cost: 25

    onboarding_steps:
      - "Register for ACCESS account"
      - "Submit Explore allocation request"
      - "Set up Globus for data transfer"
```

---

### mappings.yaml

Explicit tier-to-service availability matrix with approval workflows.

```yaml
# config/mappings.yaml

# Default mapping rules (can be overridden per-service in services.yaml)
defaults:
  L1:
    approval: automatic
    self_service: true
  L2:
    approval: automatic
    self_service: true
  L3:
    approval: review
    self_service: false
    consultation_required: true
  L4:
    approval: security_review
    self_service: false
    consultation_required: true
    security_review_required: true

# Service-specific overrides
mappings:
  # High-security cloud is pre-approved for L3
  - service: cloud-high-security
    tier: L3
    approval: automatic
    approval_notes: "Pre-approved HIPAA environment"
    dmp_template: "compute/cloud-hipaa"

  # VDI HIPAA is pre-approved for L3
  - service: vdi-hipaa
    tier: L3
    approval: automatic
    dmp_template: "environment/vdi-hipaa"

  # Standard services need review for L3
  - service: hpc-standard
    tier: L3
    approval: review
    approval_contact: "rc-security@northwinds.edu"
    notes: "Requires security configuration review"
    dmp_template: "compute/hpc-high"
```

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
  word_boundary: true      # Match whole words only
  case_sensitive: true     # "HPC" but not "hpc"
  max_per_term: 3          # Max annotations per page per term
  tooltip_delay: 300       # ms before showing tooltip

  # Elements to skip
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
  # Safety multiplier for all estimates
  safety_multiplier: 1.5
  safety_message: "Includes 1.5x buffer for processing intermediates"

  # Show calculation breakdown
  show_calculation: true

  # Precision for results
  storage_precision: 1    # decimal places for TB
  compute_precision: 0    # decimal places for SU
```

---

### help.yaml

Configuration for the "Talk to a Human" help escape hatch and contact information.

```yaml
# config/help.yaml

# Global help CTA that appears on complex pages
global:
  show_help_cta: true
  help_cta_text: "Not sure? Talk to a human"
  help_cta_link: "/contact"
  help_cta_position: "bottom-right"   # or "inline", "header"

  # Pages where help is especially prominent
  emphasized_pages:
    - "tier-selection"
    - "storage-estimate"
    - "service-selection"
    - "high-tier-workflow"

# Contact options in help modal
contact_options:
  - type: "email"
    label: "Email Us"
    description: "Get a response within 1 business day"
    icon: "mail"
    action:
      type: "email"
      address: "rc-help@northwinds.edu"
      subject_template: "Data Planner Help Request"
      # Include wizard state in email body
      include_state: true

  - type: "schedule"
    label: "Schedule a Call"
    description: "30-minute consultation with RC staff"
    icon: "calendar"
    action:
      type: "external_link"
      url: "https://calendly.com/northwinds-rc/consult"

  - type: "save"
    label: "Save & Continue Later"
    description: "Get a link to return to your progress"
    icon: "bookmark"
    action:
      type: "save_state"
      # Email the state link to user
      email_link: true

# What gets exported when user requests help mid-wizard
export_state:
  include:
    - current_step
    - selected_tier
    - selected_services
    - estimates
    - questionnaire_answers

  # Format for email body
  email_format: |
    ## Current Progress

    **Step:** {{current_step}}
    **Data Tier:** {{selected_tier.name}}

    ### Selected Services
    {{#each selected_services}}
    - {{this.name}}: {{this.estimate}} {{this.unit}}
    {{/each}}

    ### Questionnaire Answers
    {{#each questionnaire_answers}}
    - {{this.question}}: {{this.answer}}
    {{/each}}

    ---
    Please help me with: [describe your question]
```

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
        sets_tier: L3
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
        sets_tier: L2
        clears_flags:
          - hipaa
          - phi
        next: government_data
      - label: "Limited dataset (some identifiers)"
        value: "limited"
        sets_tier: L3
        next: government_data
      - label: "Identifiable / not sure"
        value: "identifiable"
        sets_tier: L3
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
        sets_tier: L3
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
        sets_tier: L4
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
        sets_tier: L4
        sets_flags:
          - itar
        next: complete
      - label: "Yes - EAR"
        value: "ear"
        sets_tier: L4
        sets_flags:
          - ear
        next: complete

  - id: complete
    type: "summary"

# Discipline-specific examples to help users understand
examples_by_discipline:
  biomedical:
    L1:
      - "Published protein structures from PDB"
      - "Public genomics datasets from NCBI"
    L2:
      - "Your lab's unpublished experimental results"
      - "Pre-publication manuscripts and figures"
    L3:
      - "Patient samples with clinical data"
      - "Genetic data linked to individuals"

  engineering:
    L1:
      - "Published simulation results"
      - "Open-source CAD models"
    L2:
      - "Proprietary designs before patent filing"
      - "Industry collaboration data under NDA"
    L4:
      - "Defense contractor research (ITAR)"
      - "CUI-marked government data"

  social_science:
    L1:
      - "Census data and public surveys"
      - "Published interview transcripts"
    L2:
      - "Ongoing survey responses (anonymized)"
      - "Interview recordings (consent obtained)"
    L3:
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

---

### tier-workflow.yaml

Detailed approval processes for each tier, shown when users select high-tier data.

```yaml
# config/tier-workflow.yaml

workflows:
  L1:
    name: "Low (Public Data)"
    process: "self-service"
    description: "No special approval needed"
    steps:
      - "Select services in planner"
      - "Provision directly via self-service portal"
    typical_time: "Same day"

  L2:
    name: "Medium (Internal Data)"
    process: "self-service"
    description: "Standard institutional security"
    steps:
      - "Select services in planner"
      - "Provision via self-service with institutional auth"
    typical_time: "Same day"

  L3:
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

  L4:
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

Data retention schedules for compliance and DMP generation.

```yaml
# config/retention.yaml

schedules:
  - slug: nih-standard
    name: "NIH Standard"
    description: "3 years after final expenditure report"
    years: 3
    applies_to:
      - funders: ["NIH", "HHS"]
    source_url: "https://grants.nih.gov/grants/policy/nihgps/html5/section_8/8.4_record_retention_and_access.htm"

  - slug: nsf-standard
    name: "NSF Standard"
    description: "3 years after final expenditure report"
    years: 3
    applies_to:
      - funders: ["NSF"]
    source_url: "https://www.nsf.gov/bfa/dias/policy/rtc/terms.pdf"

  - slug: dod-standard
    name: "DoD Standard"
    description: "3 years after final payment"
    years: 3
    applies_to:
      - funders: ["DoD", "DARPA", "Army", "Navy", "Air Force"]

  - slug: hipaa-retention
    name: "HIPAA Retention"
    description: "6 years from creation or last effective date"
    years: 6
    applies_to:
      - compliance: ["hipaa", "phi"]
    notes: "State laws may require longer retention"

  - slug: fda-clinical
    name: "FDA Clinical Trials"
    description: "2 years after drug approval or investigation discontinuation"
    years: 2
    applies_to:
      - compliance: ["fda_21_cfr_11"]
    notes: "Consult with sponsor for specific requirements"

  - slug: institutional-default
    name: "Institutional Default"
    description: "7 years after project completion"
    years: 7
    is_default: true
    notes: "University policy minimum"

# Default archive ratio for cost estimation
default_archive_ratio: 0.5
archive_ratio_help: |
  The archive ratio estimates how much of your active data will need
  long-term retention. 50% is typical - most intermediate files can
  be deleted, but raw data and final results should be archived.

# Archive cost estimation
archive_pricing:
  per_tb_per_month: 1.50
  retrieval_fee_per_tb: 0.50
```

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
  more_info_url: "https://docs.rc.northwinds.edu/licenses/hosting"
```

---

## DMP Templates

Templates in `config/dmp-templates/` use Handlebars syntax to generate Data Management Plan text.

### Available Variables

```handlebars
{{!-- Institution info --}}
{{institution.name}}
{{institution.short_name}}
{{institution.rc_name}}

{{!-- Selected tier --}}
{{tier.name}}
{{tier.description}}

{{!-- Services --}}
{{#each services}}
  {{this.name}}
  {{this.estimate}}
  {{this.unit}}
  {{this.total_cost}}
  {{this.billing_period}}
{{/each}}

{{!-- Retention --}}
{{retention.schedule.name}}
{{retention.years}}

{{!-- Helpers --}}
{{currency value}}        {{!-- Formats as $1,234.56 --}}
{{number value}}          {{!-- Formats with commas --}}
{{date value}}            {{!-- Formats date --}}
{{#if condition}}...{{/if}}
```

### Example: `config/dmp-templates/storage/default.md`

```markdown
## Data Storage and Preservation

Research data will be stored on {{institution.name}}'s {{services.storage.name}} system,
a {{services.storage.description}}.

**Active Storage Allocation:** {{number services.storage.estimate}} {{services.storage.unit}}
**Estimated Monthly Cost:** {{currency services.storage.monthly_cost}}

{{#if services.archive}}
Long-term data preservation will use {{services.archive.name}} at
{{currency services.archive.price}}/TB/month. Estimated archive storage:
{{number services.archive.estimate}} TB.
{{/if}}

### Backup and Recovery

{{#if services.storage.comparison_features.snapshots.value}}
The storage system provides {{services.storage.comparison_features.snapshots.detail}}.
{{else}}
Users are responsible for maintaining their own backups.
{{/if}}

### Data Retention

Data will be retained for {{retention.years}} years following project completion,
in accordance with {{retention.schedule.name}} requirements.
```

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
- All YAML syntax is valid
- All service references exist
- All tier references exist
- All category references exist
- All DMP templates referenced in mappings exist
- Comparison features match category definitions
- No circular references in bundles
- Required fields are present

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

Deploy to any static host (Netlify, Vercel, GitHub Pages, S3, etc.). No server-side code required for V1.

---

## Common Customizations

### Adding a new service

1. Add service definition to `services.yaml`
2. Add tier mappings (or use defaults from `mappings.yaml`)
3. Add comparison features matching category definitions
4. Create DMP template in `dmp-templates/`
5. Optionally add to bundles in `bundles.yaml`
6. Run `npm run build:config`

### Adding a new data tier

1. Add tier to `tiers.yaml`
2. Add workflow to `tier-workflow.yaml`
3. Update `tier-questionnaire.yaml` if needed
4. Add service mappings for new tier
5. Update retention schedules if applicable
6. Run `npm run build:config`

### Adding terminology

1. Add term to `acronyms.yaml`
2. Include short_def, long_def, examples, related terms
3. Terms are automatically annotated throughout the app

### Adding a calculator

1. Create Vue component in `src/components/estimate/calculators/`
2. Add to `calculators.yaml` enabled list
3. Add configuration in `calculator_config` section
4. Calculator appears in Help Me Estimate modal

### Changing institution branding

1. Edit `meta.yaml` with your institution details
2. Replace logo files in `public/assets/`
3. Update `primary_color` for theme
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
