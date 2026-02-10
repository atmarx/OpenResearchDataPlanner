# Software Catalog Feature

This document describes the software catalog system - a centralized, searchable list of all licensed and available software across research computing platforms.

---

## The Problem

From UX testing:

> **Dr. Selwick-Mira (Chemistry):** "Where's Gaussian? I know the university has it somewhere..."

> **Dr. Vosker (ECE):** "I need Cadence and Synopsys. Can I run my own FlexLM server or is there central hosting?"

Researchers know the software they need but don't know:
1. If the university has a license
2. Where they can run it (HPC? VDI? Their laptop?)
3. What restrictions apply (instruction only? unfunded research only?)
4. Whether license servers are centrally hosted

---

## The Solution

A config-driven software catalog with:
- **Stoplight license status** (green/yellow/red)
- **Availability by platform** (HPC, VDI, cloud, local)
- **Access instructions** per platform
- **License server hosting info**
- **Searchable UI** with filtering

---

## Config Schema: `config/software.yaml`

```yaml
# config/software.yaml

# License status definitions (for UI legend)
license_statuses:
  green:
    label: "Fully Licensed"
    description: "Available for all standard research use at no additional cost"
    icon: "check-circle"
    color: "#22c55e"

  yellow:
    label: "Restricted License"
    description: "Available but with usage restrictions - check details"
    icon: "alert-triangle"
    color: "#eab308"

  red:
    label: "Bring Your Own"
    description: "No institutional license - you must provide your own"
    icon: "x-circle"
    color: "#ef4444"

# License server hosting info (global)
license_server_hosting:
  available: true
  description: |
    Research IT provides central FlexLM/RLM license server hosting at no cost.
    We manage the server infrastructure, firewall rules, and monitoring.
    You provide the license file from your vendor.
  contact: "licenses@northwinds.edu"
  documentation_url: "https://docs.northwinds.edu/license-servers"
  supported_managers:
    - FlexLM / FlexNet
    - RLM (Reprise License Manager)
    - LM-X
    - Sentinel RMS
  note: |
    You do NOT need to run license servers on lab machines.
    Contact us before purchasing software that requires network licensing.

# Software categories
categories:
  - slug: computational-chemistry
    name: "Computational Chemistry"
    icon: "flask"

  - slug: molecular-dynamics
    name: "Molecular Dynamics"
    icon: "atom"

  - slug: statistics
    name: "Statistics & Data Analysis"
    icon: "bar-chart"

  - slug: ml-ai
    name: "Machine Learning & AI"
    icon: "brain"

  - slug: visualization
    name: "Visualization"
    icon: "image"

  - slug: eda
    name: "Electronic Design Automation"
    icon: "cpu"

  - slug: gis
    name: "GIS & Geospatial"
    icon: "map"

  - slug: bioinformatics
    name: "Bioinformatics"
    icon: "dna"

  - slug: engineering
    name: "Engineering & Simulation"
    icon: "settings"

  - slug: productivity
    name: "Productivity & Development"
    icon: "code"

# Software entries
software:
  # =============================================================================
  # COMPUTATIONAL CHEMISTRY
  # =============================================================================

  - slug: gaussian
    name: "Gaussian"
    vendor: "Gaussian, Inc."
    category: computational-chemistry
    description: "Electronic structure modeling for molecular systems"

    license_status: green
    license_details: |
      Site license covers all academic research use.
      Commercial use requires separate license from vendor.
    license_type: "Site License"
    license_expiry: "2026-06-30"

    availability:
      hpc:
        available: true
        versions: ["g16", "g09"]
        access: "module load gaussian/g16"
        notes: "Linda parallel available for multi-node jobs"
      vdi:
        available: true
        versions: ["g16"]
        access: "GaussView GUI available on Research VDI"
      cloud:
        available: false
        notes: "License terms prohibit cloud deployment"
      local:
        available: false
        notes: "HPC/VDI only due to license terms"

    documentation_url: "https://docs.northwinds.edu/software/gaussian"
    vendor_url: "https://gaussian.com"
    training_available: true
    support_contact: "hpc-support@northwinds.edu"

  - slug: orca
    name: "ORCA"
    vendor: "Max Planck Institute"
    category: computational-chemistry
    description: "Quantum chemistry program package"

    license_status: green
    license_details: |
      Free for academic use. Register with vendor for download.
      We maintain pre-installed versions on HPC.
    license_type: "Academic Free"

    availability:
      hpc:
        available: true
        versions: ["5.0.4", "4.2.1"]
        access: "module load orca/5.0.4"
      vdi:
        available: false
      cloud:
        available: true
        notes: "Can be installed on cloud VMs"
      local:
        available: true
        notes: "Download from vendor after registration"

    documentation_url: "https://docs.northwinds.edu/software/orca"
    vendor_url: "https://orcaforum.kofo.mpg.de"

  # =============================================================================
  # MOLECULAR DYNAMICS
  # =============================================================================

  - slug: gromacs
    name: "GROMACS"
    vendor: "Open Source"
    category: molecular-dynamics
    description: "High-performance molecular dynamics simulation"

    license_status: green
    license_details: "Open source (LGPL). No restrictions."
    license_type: "Open Source"

    availability:
      hpc:
        available: true
        versions: ["2024.1", "2023.3", "2022.5"]
        access: "module load gromacs/2024.1"
        notes: "GPU-accelerated versions available"
        gpu_support: true
      vdi:
        available: false
        notes: "Use HPC for simulations"
      cloud:
        available: true
      local:
        available: true

    documentation_url: "https://docs.northwinds.edu/software/gromacs"
    vendor_url: "https://www.gromacs.org"

  - slug: amber
    name: "Amber"
    vendor: "Amber Development Team"
    category: molecular-dynamics
    description: "Biomolecular simulation programs"

    license_status: yellow
    license_details: |
      **Restriction:** License covers unfunded academic research only.
      Industry-sponsored or grant-funded research may require additional licensing.
      Contact vendor for clarification on your use case.
    license_type: "Academic License"
    license_expiry: "2025-12-31"
    restriction_type: "unfunded-research-only"

    availability:
      hpc:
        available: true
        versions: ["24", "22"]
        access: "module load amber/24"
        gpu_support: true
      vdi:
        available: false
      cloud:
        available: false
        notes: "License prohibits cloud deployment"
      local:
        available: false

    documentation_url: "https://docs.northwinds.edu/software/amber"
    vendor_url: "https://ambermd.org"

  # =============================================================================
  # STATISTICS
  # =============================================================================

  - slug: stata
    name: "Stata"
    vendor: "StataCorp"
    category: statistics
    description: "Statistical software for data science"

    license_status: green
    license_details: "Campus site license. All editions available."
    license_type: "Site License"

    availability:
      hpc:
        available: true
        versions: ["18", "17"]
        access: "module load stata/18"
        notes: "Stata/MP available for parallel jobs"
      vdi:
        available: true
        versions: ["18"]
        access: "Available in Research VDI application menu"
      cloud:
        available: false
        notes: "License terms require on-premises deployment"
      local:
        available: true
        access: "Download from software.northwinds.edu"
        notes: "Faculty/staff/student install available"

    documentation_url: "https://docs.northwinds.edu/software/stata"
    vendor_url: "https://www.stata.com"

  - slug: sas
    name: "SAS"
    vendor: "SAS Institute"
    category: statistics
    description: "Analytics and business intelligence software"

    license_status: yellow
    license_details: |
      **Restriction:** Teaching and unfunded research only.
      Grant-funded research requires grant to purchase license.
      Contact vendor for industry-sponsored research.
    license_type: "Academic License"
    restriction_type: "instruction-unfunded-only"

    availability:
      hpc:
        available: true
        versions: ["9.4"]
        access: "module load sas/9.4"
      vdi:
        available: true
        versions: ["9.4"]
        access: "Available in Research VDI"
      cloud:
        available: false
      local:
        available: true
        access: "Download from software.northwinds.edu"
        notes: "Student edition available"

    documentation_url: "https://docs.northwinds.edu/software/sas"
    vendor_url: "https://www.sas.com"

  - slug: spss
    name: "IBM SPSS Statistics"
    vendor: "IBM"
    category: statistics
    description: "Statistical analysis software"

    license_status: green
    license_details: "Campus site license with concurrent seats."
    license_type: "Site License (Concurrent)"
    license_note: "50 concurrent seats - may need to wait during peak times"

    availability:
      hpc:
        available: false
      vdi:
        available: true
        versions: ["29"]
        access: "Available in Research VDI"
      cloud:
        available: false
      local:
        available: true
        access: "Download from software.northwinds.edu"

    documentation_url: "https://docs.northwinds.edu/software/spss"
    vendor_url: "https://www.ibm.com/spss"

  # =============================================================================
  # ELECTRONIC DESIGN AUTOMATION
  # =============================================================================

  - slug: cadence
    name: "Cadence Virtuoso"
    vendor: "Cadence Design Systems"
    category: eda
    description: "Custom IC design and verification"

    license_status: yellow
    license_details: |
      **Restriction:** Instruction and academic research only.
      Industry-sponsored research prohibited without separate license.
      Export controlled - US persons only.
    license_type: "Academic License"
    restriction_type: "instruction-academic-only"
    export_controlled: true

    license_server:
      centrally_hosted: true
      contact: "eda-licenses@northwinds.edu"
      notes: "FlexLM server managed by Research IT"

    availability:
      hpc:
        available: false
        notes: "Interactive use only - see VDI"
      vdi:
        available: true
        versions: ["IC23.1"]
        access: "Request access via ServiceNow"
        notes: "Dedicated EDA VDI environment"
        requires_approval: true
      cloud:
        available: false
        notes: "License and export control prohibit"
      local:
        available: false

    documentation_url: "https://docs.northwinds.edu/software/cadence"
    vendor_url: "https://www.cadence.com"
    training_available: true

  - slug: synopsys
    name: "Synopsys Design Compiler"
    vendor: "Synopsys"
    category: eda
    description: "RTL synthesis and optimization"

    license_status: yellow
    license_details: |
      **Restriction:** Instruction and academic research only.
      Industry collaboration requires TAP (Technology Access Program).
      Export controlled - US persons only.
    license_type: "Academic License"
    restriction_type: "instruction-academic-only"
    export_controlled: true

    license_server:
      centrally_hosted: true
      contact: "eda-licenses@northwinds.edu"

    availability:
      hpc:
        available: true
        versions: ["2023.09"]
        access: "module load synopsys/dc"
        notes: "Batch synthesis jobs supported"
      vdi:
        available: true
        versions: ["2023.09"]
        access: "Dedicated EDA VDI environment"
        requires_approval: true
      cloud:
        available: false
      local:
        available: false

    documentation_url: "https://docs.northwinds.edu/software/synopsys"
    vendor_url: "https://www.synopsys.com"

  # =============================================================================
  # ENGINEERING & SIMULATION
  # =============================================================================

  - slug: ansys
    name: "ANSYS Mechanical"
    vendor: "ANSYS Inc."
    category: engineering
    description: "Finite element analysis and simulation"

    license_status: yellow
    license_details: |
      **Restriction:** Academic research and teaching only.
      Limited concurrent seats (25). May experience contention.
      Commercial consulting prohibited.
    license_type: "Academic License (Concurrent)"
    restriction_type: "academic-only"

    license_server:
      centrally_hosted: true
      contact: "engineering-sw@northwinds.edu"

    availability:
      hpc:
        available: true
        versions: ["2024R1", "2023R2"]
        access: "module load ansys/2024R1"
        gpu_support: true
        notes: "HPC license tokens available"
      vdi:
        available: true
        versions: ["2024R1"]
        access: "Engineering VDI image"
      cloud:
        available: false
      local:
        available: true
        access: "Request via ServiceNow"
        notes: "Student version has geometry limits"

    documentation_url: "https://docs.northwinds.edu/software/ansys"
    vendor_url: "https://www.ansys.com"
    training_available: true

  - slug: matlab
    name: "MATLAB"
    vendor: "MathWorks"
    category: engineering
    description: "Numerical computing and programming platform"

    license_status: green
    license_details: |
      Campus Total Academic Headcount (TAH) license.
      All toolboxes included. No restrictions on use.
    license_type: "Total Academic Headcount"

    availability:
      hpc:
        available: true
        versions: ["R2024a", "R2023b"]
        access: "module load matlab/R2024a"
        notes: "Parallel Computing Toolbox enabled"
      vdi:
        available: true
        versions: ["R2024a"]
        access: "Available in all Research VDI images"
      cloud:
        available: true
        notes: "MATLAB Online available via MathWorks"
      local:
        available: true
        access: "Download from mathworks.com with @northwinds.edu email"

    documentation_url: "https://docs.northwinds.edu/software/matlab"
    vendor_url: "https://www.mathworks.com"
    training_available: true

  # =============================================================================
  # BRING YOUR OWN LICENSE EXAMPLES
  # =============================================================================

  - slug: comsol
    name: "COMSOL Multiphysics"
    vendor: "COMSOL Inc."
    category: engineering
    description: "Multiphysics simulation software"

    license_status: red
    license_details: |
      **No institutional license.** Individual labs/grants must purchase.
      We can host your FlexLM server if you provide the license.
    license_type: "Bring Your Own"

    license_server:
      centrally_hosted: true
      notes: "We will host your license server at no cost"
      contact: "licenses@northwinds.edu"

    availability:
      hpc:
        available: true
        notes: "If you provide license, we install and support"
        requires_own_license: true
      vdi:
        available: true
        notes: "If you provide license"
        requires_own_license: true
      cloud:
        available: false
      local:
        available: true
        notes: "Purchase from vendor"
        requires_own_license: true

    vendor_url: "https://www.comsol.com"
    purchase_contact: "Your grant administrator or department"

  - slug: abaqus
    name: "Abaqus"
    vendor: "Dassault Systèmes"
    category: engineering
    description: "Finite element analysis software"

    license_status: red
    license_details: |
      **No institutional license.** Contact vendor for academic pricing.
      Central license server hosting available if you purchase.
    license_type: "Bring Your Own"

    license_server:
      centrally_hosted: true
      notes: "We will host your license server"

    availability:
      hpc:
        available: true
        notes: "Installed and maintained if you provide license"
        requires_own_license: true
      vdi:
        available: true
        requires_own_license: true
      cloud:
        available: false
      local:
        available: true
        requires_own_license: true

    vendor_url: "https://www.3ds.com/products-services/simulia/products/abaqus/"

# Global settings
settings:
  # Show license expiry warnings this many days before
  expiry_warning_days: 90

  # Contact for general software questions
  general_contact: "software@northwinds.edu"

  # Link to software request form
  request_form_url: "https://servicenow.northwinds.edu/software-request"

  # Show "Request Software" button
  show_request_button: true
```

---

## UI Components

### Software Catalog Page

A dedicated `/software` page with:

```
┌─────────────────────────────────────────────────────────────────┐
│  Software Catalog                                    [Search...]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filter by:                                                     │
│  [All Categories ▼] [All Platforms ▼] [All License Status ▼]   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🟢 Gaussian                              Comp. Chemistry │  │
│  │    Electronic structure modeling                         │  │
│  │    Available on: HPC, VDI                               │  │
│  │    [View Details]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🟡 Amber                                 Molecular Dyn.  │  │
│  │    Biomolecular simulation programs                      │  │
│  │    ⚠️ Unfunded research only                            │  │
│  │    Available on: HPC                                     │  │
│  │    [View Details]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🔴 COMSOL Multiphysics                   Engineering     │  │
│  │    Multiphysics simulation software                      │  │
│  │    ❌ Bring your own license                             │  │
│  │    We can host your license server!                      │  │
│  │    [View Details]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📋 License Server Hosting                                      │
│  Don't run FlexLM on your grad student's machine!              │
│  We provide free central hosting for your license servers.     │
│  [Learn More]                                                   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Can't find what you need?                                      │
│  [Request Software] [Talk to a Human]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Software Detail Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Cadence Virtuoso                                          [X]  │
│  Custom IC design and verification                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  License Status: 🟡 Restricted                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ⚠️ Instruction and academic research only.                │ │
│  │ Industry-sponsored research prohibited without separate   │ │
│  │ license. Export controlled - US persons only.             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Where can I use it?                                            │
│  ┌─────────────┬─────────────────────────────────────────────┐ │
│  │ HPC         │ ❌ Not available (interactive use only)     │ │
│  │ VDI         │ ✅ IC23.1 - Request access via ServiceNow   │ │
│  │ Cloud       │ ❌ License prohibits                        │ │
│  │ Local       │ ❌ Not available                            │ │
│  └─────────────┴─────────────────────────────────────────────┘ │
│                                                                 │
│  License Server: Centrally hosted by Research IT               │
│  Contact: eda-licenses@northwinds.edu                          │
│                                                                 │
│  [📖 Documentation]  [🎓 Request Training]  [📧 Get Help]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration with Service Selection

When a user selects HPC or VDI services, show relevant software:

```vue
<!-- In service detail or selection -->
<div class="available-software">
  <h4>Pre-installed Software</h4>
  <p>This service includes access to:</p>

  <div class="software-chips">
    <SoftwareChip
      v-for="sw in availableSoftware"
      :key="sw.slug"
      :software="sw"
      :platform="currentPlatform"
    />
  </div>

  <router-link to="/software" class="see-all">
    Browse full software catalog →
  </router-link>
</div>
```

---

## Searchability

The software catalog should be searchable by:
- Software name
- Vendor name
- Category
- Use case keywords (in description)
- Availability (platform filter)
- License status (stoplight filter)

```typescript
interface SoftwareSearchFilters {
  query: string
  categories: string[]
  platforms: ('hpc' | 'vdi' | 'cloud' | 'local')[]
  licenseStatus: ('green' | 'yellow' | 'red')[]
  onlyAvailable: boolean  // Hide "bring your own" by default?
}
```

---

## References

- [ELI5.md](./ELI5.md) - Acronym glossary includes software-related terms
- [COMPARISON-FEATURES.md](./COMPARISON-FEATURES.md) - Service comparison approach
