# Calculator Development Guide

Build custom "Help Me Estimate" calculators that translate domain-specific inputs (samples, images, simulations) into infrastructure units (TB, SU, GPU-hours).

---

## Overview

Calculators help researchers who think in terms of their domain ("I have 500 microscopy images at 4K resolution") rather than infrastructure units ("I need 2.5 TB of storage").

The app ships with generic calculators for storage, CPU, GPU, and LLM API costs. You can customize these or build domain-specific calculators for your institution's common use cases.

---

## Calculator Types

Four estimation categories, each with multiple calculators:

| Category | Unit Output | Example Calculators |
|----------|-------------|---------------------|
| `storage` | TB | Microscopy, Genomics, Video, Photography |
| `cpu` | SU (Service Units) | Genomics Pipelines, Simulations, Batch Processing |
| `gpu` | GPU-hours | ML Training, Inference, GPU Simulation |
| `api` | $ (USD) | LLM API Costs |

---

## Component Interface

Each calculator is a Vue component that gets its config and reactive state from the `useCalculator` composable and renders the shared `<BaseCalculator>` wrapper. The component holds the inputs and UI; the composable computes the result.

### State from `useCalculator`

A calculator does **not** receive its config via props. Instead it calls `useCalculator('<calculator-id>')`, which returns the config (from `calculators.yaml`) plus reactive state and actions:

```js
const {
  config,        // calculator_config.<id> from calculators.yaml
  inputs,        // reactive user inputs
  result,        // computed numeric result
  breakdown,     // step-by-step calculation lines
  error,         // validation / error message
  outputUnit,    // { label, plural }
  relatableComparison,
  applyPreset,
  calculate,
  addToSlate,
  resetInputs
} = useCalculator('microscopy')
```

The composable exposes more than this (e.g. `category`, `targetService`, `alternativeServices`, `displayResult`) — destructure the subset you need. Global settings come from the composable's `globalSettings` (sourced from the `global:` block in `calculators.yaml`), not a `globalConfig` prop.

### Events Emitted

A calculator emits a single event, `added`, after its result is successfully written to the slate:

```js
const emit = defineEmits(['added'])

function handleAddToSlate() {
  if (addToSlate()) {   // returns true on success
    emit('added')
  }
}
```

The estimate is **not** emitted as a payload. `addToSlate()` (from the composable) writes it to the Pinia slate store via `slateStore.addItem({ service, quantity, unit, fromCalculator, calculatorInputs })`. Reset is handled by `resetInputs()`, not a `clear` event.

The shared `<BaseCalculator>` wrapper emits the UI events the component listens for: `applyPreset`, `calculate`, `addToSlate`, and `reset`.

---

## Template Skeleton

Create your component in `src/components/estimate/`:

```vue
<!-- src/components/estimate/MyCustomCalculator.vue -->
<script setup>
import { ref } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Beaker } from 'lucide-vue-next'

const emit = defineEmits(['added'])

const {
  config,
  inputs,
  result,
  breakdown,
  error,
  outputUnit,
  relatableComparison,
  applyPreset,
  calculate,
  addToSlate,
  resetInputs
} = useCalculator('my-custom')

const justAdded = ref(false)

// Seed default inputs once config has loaded
if (config.value) {
  inputs.sample_count = 100
  inputs.size_per_sample = 1.5  // GB
}

function handleApplyPreset(preset) {
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}
</script>

<template>
  <BaseCalculator
    title="My Custom Calculator"
    description="Estimate storage for custom samples"
    category-label="Storage"
    :icon="Beaker"
    :presets="config?.presets || []"
    :result="result"
    :result-unit="outputUnit.label"
    :breakdown="breakdown"
    :error="error"
    :comparison="relatableComparison"
    :just-added="justAdded"
    @apply-preset="handleApplyPreset"
    @calculate="handleCalculate"
    @add-to-slate="handleAddToSlate"
    @reset="handleReset"
  >
    <template #inputs>
      <label>
        Number of samples
        <input v-model.number="inputs.sample_count" type="number" min="1" />
      </label>
      <label>
        Size per sample (GB)
        <input v-model.number="inputs.size_per_sample" type="number" min="0.1" step="0.1" />
      </label>
    </template>
  </BaseCalculator>
</template>
```

The component holds inputs and UI only — `<BaseCalculator>` renders the presets, result, breakdown, comparison, and the Calculate / Add to Slate / Reset actions. The actual math lives in `useCalculator.js` (see step 4 below).

---

## Registering a Calculator

### 1. Create the Component

Save your component in `src/components/estimate/`.

### 2. Register the Component

Add it to the `calculatorComponents` map in `src/views/CalculatorBrowser.vue`:

```javascript
const calculatorComponents = {
  microscopy: defineAsyncComponent(() => import('@/components/estimate/MicroscopyCalculator.vue')),
  // ...existing calculators
  'my-custom': defineAsyncComponent(() => import('@/components/estimate/MyCustomCalculator.vue'))  // Add mapping
}
```

If your calculator uses a new icon, import it from `lucide-vue-next` and add it to the `iconMap` in the same file (this maps the `icon:` string in `calculators.yaml` to the imported icon).

### 3. Enable in calculators.yaml

```yaml
# config/calculators.yaml

enabled_calculators:
  storage:
    - microscopy
    - genomics
    - my-custom      # Add your calculator under its category

calculator_config:
  my-custom:
    name: "My Custom Calculator"
    icon: "beaker"            # Must exist in iconMap (step 2)
    description: "Estimate storage for custom samples"

    # Optional: presets for quick selection
    presets:
      - label: "Small (1 GB/sample)"
        size_gb: 1
      - label: "Medium (5 GB/sample)"
        size_gb: 5
      - label: "Large (20 GB/sample)"
        size_gb: 20
```

### 4. Implement the Calculation

The math is **not** in the component. Add a `case '<calculator-id>':` block to the matching `calculate*()` function in `src/composables/useCalculator.js` — `calculateStorage()`, `calculateCPU()`, `calculateGPU()`, or `calculateAPI()`, chosen by the calculator's category. Without it, the id falls through to the default branch and errors with `Unknown <category> calculator: <id>`.

```javascript
// in calculateStorage(), src/composables/useCalculator.js
case 'my-custom': {
  const sampleCount = inputs.sample_count || 1
  const sizePerSample = inputs.size_per_sample || 1  // GB
  totalBytes = sizePerSample * sampleCount * 1024 * 1024 * 1024

  breakdown.value = [
    { label: 'Size per sample', value: `${sizePerSample} GB` },
    { label: 'Number of samples', value: sampleCount.toLocaleString() }
  ]
  break
}
```

Storage cases set `totalBytes` and `breakdown.value`; the shared tail converts to TB and `calculate()` applies the global `safety_multiplier` and rounding. Each `calculate*()` function uses its own accumulator and shared tail — match the existing cases in the function you're editing.

---

## Configuration Options

### Standard Fields

All calculators should define in `calculators.yaml`:

```yaml
calculator_config:
  my-calculator:
    name: "Display Name"           # Required
    icon: "icon-name"              # From icon set
    description: "Brief help text" # Required

    # Optional: quick presets
    presets:
      - label: "Preset Name"
        # ...preset-specific fields
```

### Custom Fields

Add any fields your calculator needs:

```yaml
calculator_config:
  genomics:
    name: "Genomics Data"
    icon: "dna"
    description: "Sequencing data estimation"

    # Custom: data type reference table
    data_types:
      - label: "Whole Genome (30x)"
        size_gb: 150
        description: "Raw FASTQ + BAM + VCF"
      - label: "RNA-seq"
        size_gb: 30
        description: "Per sample, raw + counts"
```

Access in your component via `props.config.data_types`.

---

## Global Settings

These apply to all calculators:

```yaml
# config/calculators.yaml

global:
  # Multiplier for all estimates (accounts for intermediates, retries)
  safety_multiplier: 1.5
  safety_message: "Includes 1.5x buffer for processing intermediates"

  # Show step-by-step calculation to user
  show_calculation: true

  # Decimal precision
  storage_precision: 3    # 3 decimals = 1 GB precision
  compute_precision: 0    # SU shown as 50000
```

---

## Best Practices

### 1. Use Domain Language

Researchers understand "samples" and "images," not "storage objects." Match their vocabulary.

```yaml
# Good
prompt: "How many whole genomes are you sequencing?"

# Less good
prompt: "How many 150 GB data units?"
```

### 2. Provide Presets for Common Scenarios

Save users from guessing values:

```yaml
presets:
  - label: "Confocal Microscope"
    resolution: "4096x4096"
    bit_depth: 16
    channels: 4
  - label: "Light Sheet"
    resolution: "2048x2048"
    bit_depth: 16
    channels: 2
    z_slices: 200
```

### 3. Show the Math

Transparency builds trust. Always show the calculation breakdown:

```
500 images × 50 MB = 25,000 MB
25,000 MB = 25 GB
× 1.5 safety buffer = 37.5 GB
= 0.04 TB
```

### 4. Round Appropriately

Storage: 1 decimal place (15.5 TB)
Compute: Whole numbers (50,000 SU)

### 5. Include Safety Margin

The global `safety_multiplier` (default 1.5x) accounts for:
- Intermediate processing files
- Retries and failed runs
- Growth during project

### 6. Link to Services

Each calculator's result maps to a service so it can be added to the slate. By default the mapping follows the calculator's **category** — `storage` → `hpc-storage`, `cpu` → `hpc-cpu`, `gpu` → `hpc-gpu`. To target a specific service, set `target_services` in `calculators.yaml`:

```yaml
# config/calculators.yaml
calculator_config:
  my-custom:
    target_services:
      default: hpc-storage             # Service slug from services.yaml
      alternatives: [archive-storage]  # Optional fallbacks
```

Note: the built-in `cpu` category default is the slug `hpc-cpu`, but the shipped CPU service is `hpc-compute`. For CPU calculators, set `target_services.default: hpc-compute` explicitly rather than relying on the category default.

---

## Testing

### Manual Testing

1. Run `npm run dev`
2. Open "Calculators" in the top navigation (the `/calculators` page, headed "Estimate Your Needs")
3. Find your calculator's card under its category (Storage / Compute / GPU / API Costs) and click it to open it in the modal
4. Verify your calculator appears and works

### Verification Checklist

- [ ] Calculator appears in the modal
- [ ] Inputs accept valid values
- [ ] Calculation updates live
- [ ] Breakdown shows correct math
- [ ] "Use This Estimate" populates the service field
- [ ] Presets work (if configured)
- [ ] Clear resets to defaults

---

## Examples

### Storage Calculator: Video Production

```yaml
calculator_config:
  video:
    name: "Video & Film"
    icon: "video"
    description: "Raw footage, editing projects, final deliverables"

    formats:
      - label: "4K ProRes (RAW)"
        gb_per_hour: 880
      - label: "4K H.264"
        gb_per_hour: 45
      - label: "1080p ProRes"
        gb_per_hour: 220
      - label: "1080p H.264"
        gb_per_hour: 12
```

### CPU Calculator: Simulation Runs

```yaml
calculator_config:
  simulations:
    name: "Scientific Simulations"
    icon: "atom"
    description: "GROMACS, LAMMPS, OpenFOAM"

    packages:
      - label: "GROMACS"
        su_per_ns_per_million_atoms: 100
      - label: "LAMMPS"
        su_per_ns_per_million_atoms: 80
      - label: "OpenFOAM (per hour simulated)"
        su_per_hour: 500
```

### GPU Calculator: ML Training

```yaml
calculator_config:
  ml-training:
    name: "ML Training"
    icon: "brain"
    description: "Deep learning model training"

    model_sizes:
      - label: "Small (ResNet-18)"
        typical_hours: 10
      - label: "Medium (ResNet-50)"
        typical_hours: 50
      - label: "Large (ViT-L)"
        typical_hours: 200
```

---

## Reference

- [ELI5-IMPLEMENTATION.md](../ELI5-IMPLEMENTATION.md) - Full feature design
- [CUSTOMIZE.md](./CUSTOMIZE.md) - Calculator config reference
- [examples/minimal-config/](./examples/minimal-config/) - Minimal working example
