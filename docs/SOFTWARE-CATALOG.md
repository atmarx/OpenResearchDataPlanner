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
- **Availability by platform** (HPC, JupyterHub, VDI, cloud, local)
- **Access instructions** per platform
- **License server hosting info**
- **Searchable UI** with filtering

---

## Config Schema: `config/software.yaml`

```yaml
# config/software.yaml

# License status definitions (for UI legend)
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

# License server hosting info (global)
license_hosting:
  enabled: true
  title: "Need to host your own license server?"
  description: |
    Research Computing can host FlexLM/RLM license servers for your
    lab or department. This is useful for software with "bring your
    own license" requirements.
  contact: "rc-help@northwinds.edu"
  more_info_url: "https://docs.rc.northwinds.edu/licenses/hosting"

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
    description_long: |
      Gaussian is a general purpose computational chemistry software package.
      Used for electronic structure modeling including DFT, HF, MP2, and coupled
      cluster methods. GaussView provides a graphical interface for visualization.

    license_details: |
      Site license covers all academic research use.
      Commercial use requires separate license from vendor.
    license_type: "Site License"
    license_expiry: "2026-06-30"

    availability:
      hpc:
        status: full
        versions: ["g16", "g09"]
        module: "gaussian/g16"
        notes: "Linda parallel available for multi-node jobs"
      jupyterhub:
        status: unavailable
        notes: "Batch computation only - use HPC"
      vdi:
        status: full
        versions: ["g16"]
        notes: "GaussView GUI available on Research VDI"
      cloud:
        status: unavailable
        notes: "License terms prohibit cloud deployment"
      local:
        status: unavailable
        notes: "HPC/VDI only due to license terms"

    documentation_url: "https://docs.northwinds.edu/software/gaussian"
    vendor_url: "https://gaussian.com"
    training_available: true
    institutional_support_url: "https://help.northwinds.edu/software-licensing"
    institutional_support_label: "Research IT — Licensing"

  - slug: orca
    name: "ORCA"
    vendor: "Max Planck Institute"
    category: computational-chemistry
    description: "Quantum chemistry program package"

    license_details: |
      Free for academic use. Register with vendor for download.
      We maintain pre-installed versions on HPC.
    license_type: "Academic Free"

    availability:
      hpc:
        status: full
        versions: ["5.0.4", "4.2.1"]
        module: "orca/5.0.4"
      vdi:
        status: unavailable
      cloud:
        status: full
        notes: "Can be installed on cloud VMs"
      local:
        status: full
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

    license_details: "Open source (LGPL). No restrictions."
    license_type: "Open Source"

    availability:
      hpc:
        status: full
        versions: ["2024.1", "2023.3", "2022.5"]
        module: "gromacs/2024.1"
        notes: "GPU-accelerated versions available"
        gpu_support: true
      vdi:
        status: unavailable
        notes: "Use HPC for simulations"
      cloud:
        status: full
      local:
        status: full

    documentation_url: "https://docs.northwinds.edu/software/gromacs"
    vendor_url: "https://www.gromacs.org"

  - slug: amber
    name: "Amber"
    vendor: "Amber Development Team"
    category: molecular-dynamics
    description: "Biomolecular simulation programs"

    license_details: |
      **Restriction:** License covers unfunded academic research only.
      Industry-sponsored or grant-funded research may require additional licensing.
      Contact vendor for clarification on your use case.
    license_type: "Academic License"
    license_expiry: "2025-12-31"
    restriction_type: "unfunded-research-only"

    availability:
      hpc:
        status: restricted
        versions: ["24", "22"]
        module: "amber/24"
        gpu_support: true
      vdi:
        status: unavailable
      cloud:
        status: unavailable
        notes: "License prohibits cloud deployment"
      local:
        status: unavailable

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

    license_details: "Campus site license. All editions available."
    license_type: "Site License"

    availability:
      hpc:
        status: full
        versions: ["18", "17"]
        module: "stata/18"
        notes: "Stata/MP available for parallel jobs"
      vdi:
        status: full
        versions: ["18"]
        notes: "Available in Research VDI application menu"
      cloud:
        status: unavailable
        notes: "License terms require on-premises deployment"
      local:
        status: full
        notes: "Faculty/staff/student install available"

    documentation_url: "https://docs.northwinds.edu/software/stata"
    vendor_url: "https://www.stata.com"

  - slug: sas
    name: "SAS"
    vendor: "SAS Institute"
    category: statistics
    description: "Analytics and business intelligence software"

    license_details: |
      **Restriction:** Teaching and unfunded research only.
      Grant-funded research requires grant to purchase license.
      Contact vendor for industry-sponsored research.
    license_type: "Academic License"
    restriction_type: "instruction-unfunded-only"

    availability:
      hpc:
        status: restricted
        versions: ["9.4"]
        module: "sas/9.4"
      vdi:
        status: restricted
        versions: ["9.4"]
        notes: "Available in Research VDI"
      cloud:
        status: unavailable
      local:
        status: restricted
        notes: "Student edition available"

    documentation_url: "https://docs.northwinds.edu/software/sas"
    vendor_url: "https://www.sas.com"

  - slug: spss
    name: "IBM SPSS Statistics"
    vendor: "IBM"
    category: statistics
    description: "Statistical analysis software"

    license_details: "Campus site license with concurrent seats."
    license_type: "Site License (Concurrent)"
    license_note: "50 concurrent seats - may need to wait during peak times"

    availability:
      hpc:
        status: unavailable
      vdi:
        status: full
        versions: ["29"]
        notes: "Available in Research VDI"
      cloud:
        status: unavailable
      local:
        status: full
        notes: "Download from software.northwinds.edu"

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

    license_details: |
      **Restriction:** Instruction and academic research only.
      Industry-sponsored research prohibited without separate license.
      Export controlled - US persons only.
    license_type: "Academic License"
    restriction_type: "instruction-academic-only"
    export_controlled: true

    license_server:
      we_can_host: true
      contact: "eda-licenses@northwinds.edu"
      notes: "FlexLM server managed by Research IT"

    availability:
      hpc:
        status: unavailable
        notes: "Interactive use only - see VDI"
      vdi:
        status: restricted
        versions: ["IC23.1"]
        notes: "Dedicated EDA VDI environment"
        requires_approval: true
      cloud:
        status: unavailable
        notes: "License and export control prohibit"
      local:
        status: unavailable

    documentation_url: "https://docs.northwinds.edu/software/cadence"
    vendor_url: "https://www.cadence.com"
    training_available: true

  - slug: synopsys
    name: "Synopsys Design Compiler"
    vendor: "Synopsys"
    category: eda
    description: "RTL synthesis and optimization"

    license_details: |
      **Restriction:** Instruction and academic research only.
      Industry collaboration requires TAP (Technology Access Program).
      Export controlled - US persons only.
    license_type: "Academic License"
    restriction_type: "instruction-academic-only"
    export_controlled: true

    license_server:
      we_can_host: true
      contact: "eda-licenses@northwinds.edu"

    availability:
      hpc:
        status: restricted
        versions: ["2023.09"]
        module: "synopsys/dc"
        notes: "Batch synthesis jobs supported"
      vdi:
        status: restricted
        versions: ["2023.09"]
        notes: "Dedicated EDA VDI environment"
        requires_approval: true
      cloud:
        status: unavailable
      local:
        status: unavailable

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

    license_details: |
      **Restriction:** Academic research and teaching only.
      Limited concurrent seats (25). May experience contention.
      Commercial consulting prohibited.
    license_type: "Academic License (Concurrent)"
    restriction_type: "academic-only"

    license_server:
      we_can_host: true
      contact: "engineering-sw@northwinds.edu"

    availability:
      hpc:
        status: restricted
        versions: ["2024R1", "2023R2"]
        module: "ansys/2024R1"
        gpu_support: true
        notes: "HPC license tokens available"
      vdi:
        status: restricted
        versions: ["2024R1"]
        notes: "Engineering VDI image"
      cloud:
        status: unavailable
      local:
        status: restricted
        notes: "Student version has geometry limits"

    documentation_url: "https://docs.northwinds.edu/software/ansys"
    vendor_url: "https://www.ansys.com"
    training_available: true

  - slug: matlab
    name: "MATLAB"
    vendor: "MathWorks"
    category: engineering
    description: "Numerical computing and programming platform"

    license_details: |
      Campus Total Academic Headcount (TAH) license.
      All toolboxes included. No restrictions on use.
    license_type: "Total Academic Headcount"

    availability:
      hpc:
        status: full
        versions: ["R2024a", "R2023b"]
        module: "matlab/R2024a"
        notes: "Parallel Computing Toolbox enabled"
      vdi:
        status: full
        versions: ["R2024a"]
        notes: "Available in all Research VDI images"
      cloud:
        status: full
        notes: "MATLAB Online available via MathWorks"
      local:
        status: full
        notes: "Download from mathworks.com with @northwinds.edu email"

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

    license_details: |
      **No institutional license.** Individual labs/grants must purchase.
      We can host your FlexLM server if you provide the license.
    license_type: "Bring Your Own"

    license_server:
      we_can_host: true
      notes: "We will host your license server at no cost"
      contact: "licenses@northwinds.edu"

    availability:
      hpc:
        status: byol
        notes: "If you provide license, we install and support"
        requires_own_license: true
      vdi:
        status: byol
        notes: "If you provide license"
        requires_own_license: true
      cloud:
        status: unavailable
      local:
        status: byol
        notes: "Purchase from vendor"
        requires_own_license: true

    vendor_url: "https://www.comsol.com"
    purchase_contact: "Your grant administrator or department"

  - slug: abaqus
    name: "Abaqus"
    vendor: "Dassault Systèmes"
    category: engineering
    description: "Finite element analysis software"

    license_details: |
      **No institutional license.** Contact vendor for academic pricing.
      Central license server hosting available if you purchase.
    license_type: "Bring Your Own"

    license_server:
      we_can_host: true
      notes: "We will host your license server"

    availability:
      hpc:
        status: byol
        notes: "Installed and maintained if you provide license"
        requires_own_license: true
      vdi:
        status: byol
        requires_own_license: true
      cloud:
        status: unavailable
      local:
        status: byol
        requires_own_license: true

    vendor_url: "https://www.3ds.com/products-services/simulia/products/abaqus/"

# Search configuration
search:
  enabled: true
  placeholder: "Search software..."
  search_fields:
    - name
    - description
    - tags
    - vendor
```

---

## JupyterHub — Zero Setup Computing

JupyterHub is a managed notebook environment where users can start working immediately without installing anything locally.

**Benefits:**
- Pre-configured Python, R, Julia, and MATLAB kernels
- GPU access for machine learning (PyTorch, TensorFlow)
- Common packages pre-installed (numpy, pandas, tidyverse, etc.)
- No environment setup or dependency management
- Works from any browser

**Best for:**
- Exploratory data analysis
- Teaching and coursework
- Quick prototyping before scaling to HPC
- Collaborative notebook sharing

**Access:** https://jupyter.northwinds.edu (or your institution's URL)

Software entries with `no_setup: true` indicate the tool is ready to use on JupyterHub with no configuration required.

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

## Integration with Service Slate

Software selections are added to the service slate just like storage or compute:

```typescript
interface SoftwareSelection {
  id: string               // Software slug
  name: string             // Display name
  license_model: 'campus' | 'byol' | 'free' | 'hybrid'
  cost_to_user: number | null  // null = "confirm with vendor"
  cost_period?: string         // 'year', 'month', 'perpetual'
  note?: string
  installed_on: string[]       // Services this will be used on
}
```

### BYOL Pricing Display

For software requiring lab purchase, show appropriate messaging:

| Scenario | Display |
|----------|---------|
| Known price | `[$7,995/yr BYOL]` |
| Unknown price | `[Contact vendor for pricing]` |
| Free academic | `[Free - register with vendor]` |
| Campus included | `[Included]` |

Example config for unknown pricing:

```yaml
- slug: schrodinger
  name: "Schrödinger Suite"
  license_status: red
  license_model: byol
  license_info:
    cost_per_seat: null  # Unknown - varies by modules
    vendor_contact: "https://www.schrodinger.com/academic"
    notes: "Academic pricing varies by modules selected. Contact vendor."
    request_quote_cta: true  # Show "Request Quote" button
```

### In the Slate Review

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Service Slate                               [DRAFT]       │
│                                                                 │
│  SERVICES                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  HPC Compute: 100,000 SU                         $900/yr   ││
│  │  Research Storage: 25 TB                       $1,500/yr   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  SOFTWARE                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  MATLAB R2024b                              [Included]  ✓  ││
│  │  Gaussian 16                                [Included]  ✓  ││
│  │  Schrödinger Suite               [Contact vendor]  ⚠       ││
│  │    └─ Lab must acquire license separately                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ⚠ 1 software item requires separate licensing                 │
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
  platforms: ('hpc' | 'jupyterhub' | 'vdi' | 'cloud' | 'local')[]
  licenseStatus: ('green' | 'yellow' | 'red')[]
  onlyAvailable: boolean  // Hide "bring your own" by default?
}
```

---

## References

- [ELI5.md](./ELI5.md) - Acronym glossary includes software-related terms
- [COMPARISON-FEATURES.md](./COMPARISON-FEATURES.md) - Service comparison approach
