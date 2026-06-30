# Service Comparison Features

This document describes the metadata structure for the service comparison feature, which enables side-by-side feature comparison within service categories.

## Overview

The comparison system has two parts:
1. **Category definitions** - Define what features are relevant for comparing services in that category
2. **Service values** - Each service declares its support level for each feature

When users click "Compare Options" on a service category, they see a matrix showing all available services against all relevant features.

---

## Category Feature Definitions

Located in `config/categories.yaml`, each category can define comparison features:

```yaml
categories:
  - slug: compute
    name: "Compute"
    comparison_features:
      - key: gpu_available
        label: "GPU Available"
        description: "Access to GPU accelerators"
      - key: batch_jobs
        label: "Batch Jobs"
        description: "Submit jobs to run unattended"
      # ... more features
```

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Unique identifier used by services to declare support |
| `label` | string | Yes | Short display label (shown in table header) |
| `description` | string | No | Tooltip text explaining the feature |

### Current Category Features

#### Compute (`compute`)
| Key | Label | Description |
|-----|-------|-------------|
| `gpu_available` | GPU Available | Access to GPU accelerators |
| `batch_jobs` | Batch Jobs | Submit jobs to run unattended |
| `interactive` | Interactive Use | Live, interactive sessions |
| `auto_scaling` | Auto-Scaling | Automatically scale resources |
| `cost_predictable` | Predictable Cost | Fixed or easy-to-estimate pricing |
| `beginner_friendly` | Beginner Friendly | Easy to get started |
| `high_tier_data` | High-Tier Data | Approved for regulated/PHI data |
| `free_tier` | Free Tier | No-cost option available |

#### Storage (`storage`)
| Key | Label | Description |
|-----|-------|-------------|
| `hpc_mounted` | HPC Access | Directly accessible from HPC cluster |
| `high_throughput` | High Throughput | Fast for large data transfers |
| `snapshots` | Snapshots/Backup | Version history or backups |
| `collaboration` | Collaboration | Easy sharing with team |
| `external_sharing` | External Sharing | Share outside institution |
| `large_files` | Large Files | Handles very large files |
| `high_tier_data` | High-Tier Data | Approved for regulated/PHI data |
| `free_allocation` | Free Allocation | No-cost storage included |

#### Environments (`environment`)
| Key | Label | Description |
|-----|-------|-------------|
| `dedicated_resources` | Dedicated Resources | Guaranteed CPU/RAM allocation |
| `gui_desktop` | GUI Desktop | Graphical desktop interface |
| `web_accessible` | Web Accessible | Access from browser |
| `admin_control` | Admin Control | Install your own software |
| `high_tier_data` | High-Tier Data | Approved for regulated/PHI data |
| `scalable` | Scalable | Can increase resources |
| `preconfigured_software` | Pre-configured | Software pre-installed |
| `cost_predictable` | Predictable Cost | Fixed monthly pricing |

#### National Resources (`external`)
| Key | Label | Description |
|-----|-------|-------------|
| `free_nsf` | NSF Funded | No cost to researchers |
| `merit_based` | Merit-Based | Requires allocation application |
| `national_scale` | National Scale | Access to top supercomputing centers |
| `gpu_available` | GPU Available | Access to GPU accelerators |
| `large_scale` | Large Scale | Massive compute capacity |
| `beginner_friendly` | Beginner Friendly | Lower tiers easy to obtain |

---

## Service Feature Values

Each service in `config/services.yaml` can declare its support level for comparison features:

```yaml
services:
  - slug: hpc-compute
    name: "HPC Compute (CPU)"
    category: compute

    comparison_features:
      gpu_available:
        value: none
        detail: "CPU-only; see HPC GPU for A100 access"
      batch_jobs:
        value: full
      interactive:
        value: partial
        detail: "Interactive sessions via srun; 4-hour limit"
      auto_scaling:
        value: none
        detail: "Fixed capacity; queue-based scheduling"
      cost_predictable:
        value: full
        detail: "Tiered per-SU pricing"
      beginner_friendly:
        value: partial
        detail: "Requires SLURM knowledge; training available"
      high_tier_data:
        value: none
        detail: "Low/Medium only; use cloud for High tier"
      free_tier:
        value: none
        detail: "See HPC Free Tier for no-cost option"
```

### Value Types

| Value | Icon | Color | Meaning |
|-------|------|-------|---------|
| `full` | Checkmark | Green | Full support for this feature |
| `partial` | Dash | Yellow | Limited or conditional support |
| `none` | Circle | Gray | Not available or not applicable |

### Schema Options

Features can be specified in two formats:

**Simple format** (value only):
```yaml
comparison_features:
  batch_jobs: full
  interactive: partial
```

**Detailed format** (value + explanation):
```yaml
comparison_features:
  batch_jobs:
    value: full
  interactive:
    value: partial
    detail: "Interactive sessions limited to 4 hours"
```

The `detail` field appears as a tooltip and as small text below the icon in the comparison table.

---

## UI Behavior

### Compare Button Visibility

The "Compare Options" button only appears on a category if:
1. The category has `comparison_features` defined
2. At least 2 services in that category have `comparison_features` data
3. Those services are available for the user's selected tier

### Comparison Modal

- Services are shown as columns, features as rows
- Clicking a service column header adds it to selection
- Already-selected services show a "Selected" badge
- Feature details appear as tooltips and inline text

---

## Adding Comparison Features to a Service

1. Identify which category the service belongs to
2. Look up the category's comparison features in `categories.yaml`
3. Add a `comparison_features` block to the service
4. Declare a value (`full`, `partial`, `none`) for each relevant feature
5. Add `detail` text for any non-obvious values

### Example: Adding features to a new storage service

```yaml
- slug: new-storage-service
  name: "New Storage Service"
  category: storage

  comparison_features:
    hpc_mounted:
      value: none
      detail: "Web access only"
    high_throughput:
      value: partial
      detail: "Good for files under 10GB"
    snapshots:
      value: full
      detail: "Daily snapshots, 90-day retention"
    collaboration:
      value: full
    external_sharing:
      value: full
      detail: "Shareable links with expiration"
    large_files:
      value: partial
      detail: "5GB max per file"
    high_tier_data:
      value: full
      detail: "BAA in place"
    free_allocation:
      value: none
```

---

## Guidelines for Product Specialists

### When to use `full`
- Feature is fully supported without caveats
- No significant limitations compared to purpose-built solutions
- Users can rely on this feature for production use

### When to use `partial`
- Feature exists but has limitations (size, time, speed)
- Feature requires additional configuration or approval
- Feature works but isn't the service's primary strength
- Always add a `detail` explaining the limitation

### When to use `none`
- Feature is not available
- Feature is technically possible but not recommended
- Consider adding `detail` pointing to alternatives

### Writing good `detail` text
- Keep it under 50 characters if possible
- Be specific: "4-hour limit" not "time limited"
- Point to alternatives: "See HPC GPU for A100 access"
- Mention costs if relevant: "$0.50/GB retrieval fee"

---

## UI Implementation

### Compare Button

The "Compare Options" button appears on each category card when comparison is available:

```
┌─────────────────────────────────────────────────────────────────┐
│  Compute                                                        │
│  Processing and analysis resources                              │
│                                                                 │
│  [HPC Free] [HPC CPU] [HPC GPU] [K8s] [AWS] [Azure] ...        │
│                                                                 │
│                               [Compare Options]  [Select All →] │
└─────────────────────────────────────────────────────────────────┘
```

### Comparison Modal

When "Compare Options" is clicked:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Compare Compute Options                                               [X]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┬────────────┬────────────┬────────────┬────────────┐  │
│  │                  │ HPC Free   │ HPC CPU    │ HPC GPU    │ AWS Large  │  │
│  │                  │            │            │            │            │  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ GPU Available    │ 🟡 Partial │ ❌ None    │ ✅ Full    │ ✅ Full    │  │
│  │                  │ 100 GPU-hr │ CPU only   │ A100 80GB  │ P3/P4      │  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ Batch Jobs       │ ✅ Full    │ ✅ Full    │ ✅ Full    │ 🟡 Partial │  │
│  │                  │            │            │            │ AWS Batch  │  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ Interactive      │ 🟡 Partial │ 🟡 Partial │ 🟡 Partial │ ✅ Full    │  │
│  │                  │ via srun   │ 4hr limit  │ 4hr limit  │ SSH/SSM    │  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ Auto-Scaling     │ ❌ None    │ ❌ None    │ ❌ None    │ ✅ Full    │  │
│  │                  │ Queue-based│ Queue-based│ Queue-based│ ASG        │  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ Predictable Cost │ ✅ Full    │ ✅ Full    │ ✅ Full    │ ❌ None    │  │
│  │                  │ Free       │ Per-SU     │ Per-GPU-hr │ Variable   │  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ Beginner Friendly│ 🟡 Partial │ 🟡 Partial │ 🟡 Partial │ ❌ None    │  │
│  │                  │ SLURM      │ SLURM      │ SLURM+CUDA │ AWS + GPU  │  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ High-Tier Data   │ ❌ None    │ ❌ None    │ ❌ None    │ ✅ Full    │  │
│  │                  │ Low/Med    │ Low/Med    │ Low/Med    │ With config│  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ Free Tier        │ ✅ Full    │ ❌ None    │ ❌ None    │ ❌ None    │  │
│  │                  │ No cost    │ See Free   │ See Free   │ Pay-per-use│  │
│  ├──────────────────┼────────────┼────────────┼────────────┼────────────┤  │
│  │ Price            │ $0/mo      │ $0.08/SU   │ $0.35/GPU-h│ ~$1K+/mo   │  │
│  └──────────────────┴────────────┴────────────┴────────────┴────────────┘  │
│                                                                             │
│  Legend: ✅ Full support  🟡 Limited/conditional  ❌ Not available         │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Select services to add to your plan:                                       │
│  [ ] HPC Free Tier    [ ] HPC CPU    [✓] HPC GPU    [ ] AWS Large          │
│                                                                             │
│                                               [Cancel]  [Add Selected (1)] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile/Responsive View

On smaller screens, switch to card-based comparison:

```
┌─────────────────────────────────────┐
│  Compare: HPC GPU                   │
├─────────────────────────────────────┤
│  ✅ GPU Available                   │
│     NVIDIA A100 GPUs (80GB HBM2e)   │
│                                     │
│  ✅ Batch Jobs                      │
│     Full support                    │
│                                     │
│  🟡 Interactive                     │
│     4-hour limit                    │
│                                     │
│  ❌ Auto-Scaling                    │
│     Queue-based scheduling          │
│                                     │
│  ...                                │
│                                     │
│  Price: $0.35/GPU-hour             │
│                                     │
│  [Add to Plan]                      │
└─────────────────────────────────────┘
│ ← HPC CPU          AWS Large →      │
└─────────────────────────────────────┘
```

### Feature Tooltips

Clicking on a feature row shows more detail:

```
┌─────────────────────────────────────────────────────────────────┐
│  GPU Available                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Does this service provide access to GPU accelerators for      │
│  machine learning, simulation, and parallel computing?          │
│                                                                 │
│  Why it matters:                                                │
│  • ML training is 10-100x faster on GPUs                       │
│  • Many simulation packages have GPU-accelerated versions      │
│  • GPU time is more expensive but often more cost-effective    │
│                                                                 │
│  Related services:                                              │
│  • HPC GPU - On-premises A100 GPUs                             │
│  • K8s Cluster - Cutting-edge H200/A100 GPUs                   │
│  • AWS/Azure Large - Cloud GPUs (P4, NC-series)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Filtering Services in Comparison

Allow users to filter which services appear in comparison:

```
┌─────────────────────────────────────────────────────────────────┐
│  Filter services:                                               │
│  [✓] On-premises (HPC)  [✓] Cloud (AWS/Azure)  [ ] External    │
│  [ ] Free tier only     [ ] GPU only           [ ] High-tier OK │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

The comparison feature lives in two files under `src/components/wizard/`. There is no
separate `comparison/` directory and no standalone `FeatureValue.vue` — the table,
value icons, and legend are all rendered inline in `CompareModal.vue`.

```
src/components/wizard/
  ServiceSelectStep.vue   # renders the "Compare Options" button → openCompare(category.slug); imports CompareModal
  CompareModal.vue        # entire comparison modal: table, value icons, and legend all inline
```

### Value Display

Value rendering is inline in `CompareModal.vue`, not a separate component. Icons come
from `lucide-vue-next` and are mapped by value — `full` → `Check`, `partial` → `Minus`,
`none` → `Circle`:

```js
import { X, Check, Minus, Circle, Plus, Info } from 'lucide-vue-next'

function getValueIcon(value) {
  switch (value) {
    case 'full': return Check
    case 'partial': return Minus
    default: return Circle
  }
}

function getValueClasses(value) {
  switch (value) {
    case 'full': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
    case 'partial': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30'
    default: return 'text-text-muted bg-canvas'
  }
}
```

The legend is rendered inline in the same component.

---

## Future Considerations

### Potential additional features

**Compute:**
- `spot_pricing` - Discounted preemptible instances
- `mpi_support` - Multi-node MPI jobs
- `containerized` - Docker/Singularity support

**Storage:**
- `versioning` - File version history
- `encryption_at_rest` - Data encrypted on disk
- `geo_redundant` - Multiple datacenter copies

**Compliance (cross-cutting):**
- `hipaa_compliant` - HIPAA BAA in place
- `fda_21_cfr_11` - FDA electronic records compliance
- `itar_eligible` - Export control capable

### Compliance markers

A future enhancement could add explicit compliance metadata to services:

```yaml
compliance:
  hipaa: true
  hipaa_baa: true
  fda_21_cfr_11: false
  itar: false
  fedramp: false
```

This would enable filtering services by compliance requirement and generating compliance-specific DMP language.
