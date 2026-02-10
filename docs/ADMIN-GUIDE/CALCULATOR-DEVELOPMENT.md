# Calculator Development Guide

Build custom "Help Me Estimate" calculators that translate domain-specific inputs (samples, images, simulations) into infrastructure units (TB, SU, GPU-hours).

---

## Overview

Calculators help researchers who think in terms of their domain ("I have 500 microscopy images at 4K resolution") rather than infrastructure units ("I need 2.5 TB of storage").

The app ships with generic calculators for storage, CPU, and GPU. You can customize these or build domain-specific calculators for your institution's common use cases.

---

## Calculator Types

Three estimation categories, each with multiple calculators:

| Category | Unit Output | Example Calculators |
|----------|-------------|---------------------|
| `storage` | TB | Microscopy, Genomics, Video, Photography |
| `cpu` | SU (Service Units) | Genomics Pipelines, Simulations, Batch Processing |
| `gpu` | GPU-hours | ML Training, Inference, GPU Simulation |

---

## Component Interface

Each calculator is a Vue component that receives props and emits an estimate.

### Props Received

```typescript
interface CalculatorProps {
  // Calculator ID from calculators.yaml
  calculatorId: string

  // Configuration from calculators.yaml
  config: {
    name: string
    icon: string
    description: string
    presets?: Preset[]
    // ...custom config fields
  }

  // Global settings
  globalConfig: {
    safety_multiplier: number
    safety_message: string
    show_calculation: boolean
  }
}
```

### Events Emitted

```typescript
// When user completes estimation
emit('estimate', {
  value: number,           // e.g., 15.5 (TB)
  unit: string,            // e.g., "TB"
  breakdown: string[],     // e.g., ["500 images × 50 MB = 25 GB", "× 1.5 safety = 37.5 GB"]
  inputs: Record<string, any>  // User's inputs for reference
})

// When user clears/resets
emit('clear')
```

---

## Template Skeleton

Create your component in `src/components/estimate/calculators/`:

```vue
<!-- src/components/estimate/calculators/MyCustomCalculator.vue -->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  calculatorId: String,
  config: Object,
  globalConfig: Object
})

const emit = defineEmits(['estimate', 'clear'])

// User inputs
const sampleCount = ref(100)
const sizePerSample = ref(1.5)  // GB

// Calculation
const estimate = computed(() => {
  const rawGB = sampleCount.value * sizePerSample.value
  const withSafety = rawGB * props.globalConfig.safety_multiplier
  return {
    value: withSafety / 1000,  // Convert to TB
    unit: 'TB',
    breakdown: [
      `${sampleCount.value} samples × ${sizePerSample.value} GB = ${rawGB} GB`,
      `× ${props.globalConfig.safety_multiplier} safety buffer = ${withSafety} GB`,
      `= ${(withSafety / 1000).toFixed(2)} TB`
    ],
    inputs: {
      sampleCount: sampleCount.value,
      sizePerSample: sizePerSample.value
    }
  }
})

function applyEstimate() {
  emit('estimate', estimate.value)
}

function clear() {
  sampleCount.value = 100
  sizePerSample.value = 1.5
  emit('clear')
}
</script>

<template>
  <div class="calculator">
    <h3>{{ config.name }}</h3>
    <p class="description">{{ config.description }}</p>

    <!-- Presets (if configured) -->
    <div v-if="config.presets" class="presets">
      <button
        v-for="preset in config.presets"
        :key="preset.label"
        @click="sizePerSample = preset.size_gb"
        class="preset-btn"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Inputs -->
    <div class="inputs">
      <label>
        Number of samples
        <input
          v-model.number="sampleCount"
          type="number"
          min="1"
        />
      </label>

      <label>
        Size per sample (GB)
        <input
          v-model.number="sizePerSample"
          type="number"
          min="0.1"
          step="0.1"
        />
      </label>
    </div>

    <!-- Live calculation preview -->
    <div v-if="globalConfig.show_calculation" class="breakdown">
      <h4>Calculation</h4>
      <ul>
        <li v-for="step in estimate.breakdown" :key="step">{{ step }}</li>
      </ul>
    </div>

    <!-- Result -->
    <div class="result">
      <span class="value">{{ estimate.value.toFixed(1) }}</span>
      <span class="unit">{{ estimate.unit }}</span>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button @click="clear" class="secondary">Clear</button>
      <button @click="applyEstimate" class="primary">Use This Estimate</button>
    </div>
  </div>
</template>
```

---

## Registering a Calculator

### 1. Create the Component

Save your component in `src/components/estimate/calculators/`.

### 2. Register in the Calculator Index

Edit `src/components/estimate/calculators/index.js`:

```javascript
import MicroscopyCalculator from './MicroscopyCalculator.vue'
import GenomicsCalculator from './GenomicsCalculator.vue'
import MyCustomCalculator from './MyCustomCalculator.vue'  // Add import

export const calculators = {
  microscopy: MicroscopyCalculator,
  genomics: GenomicsCalculator,
  'my-custom': MyCustomCalculator  // Add mapping
}
```

### 3. Enable in calculators.yaml

```yaml
# config/calculators.yaml

enabled_calculators:
  storage:
    - microscopy
    - genomics
    - my-custom      # Add your calculator

calculator_config:
  my-custom:
    name: "My Custom Calculator"
    icon: "beaker"
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
  storage_precision: 1    # TB shown as 15.5
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

Connect the calculator result to the relevant service:

```yaml
# In services.yaml
services:
  - slug: research-storage
    estimation:
      help_calculator: "storage"  # Opens storage calculators
```

---

## Testing

### Manual Testing

1. Run `npm run dev`
2. Navigate to a storage/compute service
3. Click "Help Me Estimate"
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
