# ELI5 Implementation Plan

This document describes the technical implementation of the "Help Me Estimate" feature and the automatic acronym annotation system.

---

## Design Goals

1. **Config-driven** - Schools customize via YAML, not code changes
2. **Modular calculators** - Each calculator is a standalone plugin
3. **Automatic annotations** - Acronyms auto-highlighted anywhere they appear
4. **Progressive disclosure** - Hover for quick def, click for full explanation
5. **Accessible** - Keyboard navigable, screen reader friendly

---

## Part 1: Acronym Annotation System

### Overview

Any text in the app containing a defined acronym gets automatic annotation:
- **Hover**: Tooltip with short definition
- **Click**: Modal with full explanation, examples, related terms

This works globally - service descriptions, wizard steps, help text - without authors needing to manually add markup.

### Config Schema: `config/acronyms.yaml`

```yaml
# config/acronyms.yaml

acronyms:
  # Infrastructure terms
  - term: "HPC"
    expansion: "High-Performance Computing"
    short_def: "Big shared computers for research"
    long_def: |
      High-Performance Computing (HPC) refers to computing systems that aggregate
      computing power to deliver much higher performance than a typical desktop
      or workstation. HPC systems use parallel processing across many nodes to
      solve complex computational problems.
    examples:
      - "Running a genome alignment across 128 CPU cores"
      - "Simulating molecular dynamics with GROMACS"
    related: ["GPU", "SU", "SLURM"]
    category: "infrastructure"

  - term: "GPU"
    expansion: "Graphics Processing Unit"
    short_def: "Special chip that's fast for ML and simulations"
    long_def: |
      A GPU is a specialized processor originally designed for rendering graphics,
      but now widely used for parallel computing tasks. GPUs excel at operations
      that can be split into thousands of simultaneous threads, making them ideal
      for machine learning, scientific simulations, and image processing.
    examples:
      - "Training a neural network on an NVIDIA V100"
      - "Running CUDA-accelerated molecular dynamics"
    related: ["HPC", "GPU-hour", "CUDA"]
    category: "infrastructure"

  - term: "SU"
    expansion: "Service Unit"
    short_def: "1 CPU-core running for 1 hour"
    long_def: |
      A Service Unit (SU) is the standard billing unit for HPC compute time.
      1 SU = 1 CPU core running for 1 hour. If you run a job on 32 cores for
      10 hours, that's 320 SU.

      Think of it like electricity billing - you pay for what you use.
    examples:
      - "A 4-hour job on 8 cores = 32 SU"
      - "A genome alignment typically uses 100-500 SU"
    related: ["HPC", "GPU-hour", "ACCESS credits"]
    category: "infrastructure"
    see_also:
      - label: "SU Calculator"
        action: "open_calculator"
        calculator: "cpu-compute"

  - term: "TB"
    expansion: "Terabyte"
    short_def: "1,000 GB (about 200,000 high-res photos)"
    long_def: |
      A terabyte (TB) is 1,000 gigabytes (GB) or 1 trillion bytes. For context:
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

  # Storage concepts
  - term: "archive"
    display: "Archive Storage"
    expansion: null  # Not an acronym, but still needs explanation
    short_def: "Cold storage - cheap but slow to retrieve"
    long_def: |
      Archive storage is designed for data you rarely access but need to keep.
      It's much cheaper than active storage but takes hours to retrieve.

      Think of it like putting boxes in the attic vs. keeping them on your desk.
    examples:
      - "Raw sequencing data after analysis is complete"
      - "Grant retention requirements (keep for 7 years)"
    related: ["active storage", "Glacier", "cold storage"]
    category: "storage"

  # Compliance terms
  - term: "PHI"
    expansion: "Protected Health Information"
    short_def: "Patient/health data that needs HIPAA protection"
    long_def: |
      Protected Health Information (PHI) includes any individually identifiable
      health information. This includes medical records, lab results, billing
      information, and even appointment schedules when linked to an individual.

      PHI requires HIPAA-compliant storage and handling. At Northwinds, this
      means using High-tier services with BAAs in place.
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
      A Business Associate Agreement (BAA) is a contract between a HIPAA-covered
      entity and a vendor who will handle PHI. The BAA ensures the vendor will
      appropriately safeguard the information.

      Before storing PHI on any service, verify a BAA is in place. Cloud
      providers (AWS, Azure) have institutional BAAs; check with Research IT.
    related: ["HIPAA", "PHI"]
    category: "compliance"

  - term: "IRB"
    expansion: "Institutional Review Board"
    short_def: "Committee that approves human subjects research"
    long_def: |
      The Institutional Review Board (IRB) reviews research involving human
      subjects to ensure ethical treatment and proper informed consent.
      IRB approval is typically required before collecting or analyzing
      human subjects data.
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

  - term: "FISMA"
    expansion: "Federal Information Security Management Act"
    short_def: "Security standards for federal systems"
    long_def: |
      FISMA establishes security requirements for federal information systems.
      Research with certain federal contracts or grants may require FISMA-
      compliant infrastructure. This typically requires specialized enclaves.
    related: ["CUI", "ITAR", "secure enclave"]
    category: "compliance"

  - term: "CUI"
    expansion: "Controlled Unclassified Information"
    short_def: "Sensitive government data (not classified)"
    long_def: |
      CUI is government-created or owned information that requires safeguarding
      but isn't classified. Many DoD and federal contracts involve CUI and
      require specific handling procedures and compliant infrastructure.
    related: ["FISMA", "ITAR", "NIST 800-171"]
    category: "compliance"

  - term: "ITAR"
    expansion: "International Traffic in Arms Regulations"
    short_def: "Export control for defense-related data"
    long_def: |
      ITAR controls the export of defense-related articles, services, and
      technical data. Research involving ITAR-controlled information cannot
      be accessed by non-US persons and requires specific safeguards.
    related: ["EAR", "CUI", "export control"]
    category: "compliance"

  - term: "EAR"
    expansion: "Export Administration Regulations"
    short_def: "Export control for dual-use technology"
    long_def: |
      EAR controls exports of commercial and dual-use items, software, and
      technology. Less restrictive than ITAR but still requires compliance
      for certain research areas.
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

  # Programs
  - term: "ACCESS"
    expansion: "Advanced Cyberinfrastructure Coordination Ecosystem"
    short_def: "Free national supercomputing for researchers"
    long_def: |
      ACCESS provides free compute time on national supercomputers for US
      researchers. It's funded by the NSF, so qualifying researchers can
      use world-class computing resources at no cost.

      Allocations range from 400,000 credits (Explore, auto-approved) to
      unlimited (Maximize, peer-reviewed).
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

  # Technical terms
  - term: "SLURM"
    expansion: "Simple Linux Utility for Resource Management"
    short_def: "The software that schedules HPC jobs"
    long_def: |
      SLURM is the job scheduler used on most HPC clusters. You submit jobs
      describing what resources you need (cores, memory, time), and SLURM
      schedules them to run when resources are available.
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

  - term: "LabArchives"
    expansion: null  # Product name
    short_def: "Electronic lab notebook (ELN) for research documentation"
    long_def: |
      LabArchives is a cloud-based electronic lab notebook used to document
      research activities, experiments, and protocols. It's commonly used
      for compliance with data management requirements and includes features
      like timestamped entries, version history, and collaboration tools.

      Note: LabArchives has file size limits (typically 4GB per file) and
      storage quotas. For large datasets, use dedicated research storage
      and link to files from your LabArchives entries.
    examples:
      - "Documenting wet lab protocols and observations"
      - "Recording computational experiment parameters"
      - "Meeting grant data management requirements"
    related: ["ELN", "DMP", "data management"]
    category: "tools"

  # Common limits and thresholds
  - term: "4GB limit"
    display: "4 GB File Limit"
    expansion: null
    short_def: "Maximum file size for many cloud services"
    long_def: |
      Many collaboration and storage tools (like Box, LabArchives, Google Drive)
      have maximum file size limits around 4 GB. Files larger than this limit
      cannot be uploaded directly.

      For large files, consider:
      - Research storage with no file size limits (HPC scratch, cloud storage)
      - Splitting files into smaller chunks
      - Using specialized transfer tools (Globus, rclone)
    related: ["TB", "Globus", "research storage"]
    category: "infrastructure"

  - term: "1TB quota"
    display: "1 TB Storage Quota"
    expansion: null
    short_def: "Common default allocation for personal storage"
    long_def: |
      Many institutional services provide 1 TB of personal or project storage
      as a default allocation. This is often sufficient for documents and
      small datasets, but research data frequently exceeds this limit.

      If you need more than 1 TB:
      - Request additional project storage allocation
      - Use dedicated research storage services
      - Archive completed data to cold storage
    related: ["TB", "archive", "allocation"]
    category: "infrastructure"

# Configuration for annotation behavior
annotation_config:
  # Match whole words only (not "GPU" inside "GPUS")
  word_boundary: true

  # Case sensitivity
  case_sensitive: true

  # Elements to skip (don't annotate inside these)
  skip_elements:
    - "code"
    - "pre"
    - "input"
    - "textarea"
    - ".no-annotate"

  # Max annotations per term per page (avoid visual clutter)
  max_per_term: 3

  # Styling
  annotation_style: "dotted-underline"  # or "highlight", "none"

  # Tooltip delay (ms)
  tooltip_delay: 300
```

### Component Architecture

```
src/
  components/
    acronyms/
      AcronymProvider.vue       # Context provider, loads config
      AcronymAnnotator.vue      # Wraps text content, adds annotations
      AcronymTooltip.vue        # Hover tooltip component
      AcronymModal.vue          # Full explanation modal
      useAcronyms.ts            # Composable for acronym data

  plugins/
    acronymPlugin.ts            # Vue plugin for global registration

  utils/
    acronymParser.ts            # Text parsing and annotation logic
```

### AcronymProvider.vue

Loads acronym config and provides it via Vue's provide/inject:

```vue
<script setup lang="ts">
import { provide, ref, onMounted } from 'vue'
import { loadYaml } from '@/utils/configLoader'
import type { AcronymConfig } from '@/types/acronyms'

const acronyms = ref<AcronymConfig | null>(null)
const isLoaded = ref(false)

onMounted(async () => {
  acronyms.value = await loadYaml('/config/acronyms.yaml')
  isLoaded.value = true
})

provide('acronyms', acronyms)
provide('acronymsLoaded', isLoaded)
</script>

<template>
  <slot v-if="isLoaded" />
  <slot name="loading" v-else />
</template>
```

### AcronymAnnotator.vue

Wraps any text content and automatically annotates acronyms:

```vue
<script setup lang="ts">
import { computed, inject } from 'vue'
import { annotateText } from '@/utils/acronymParser'
import AcronymTooltip from './AcronymTooltip.vue'

const props = defineProps<{
  text: string
  maxAnnotations?: number
}>()

const acronyms = inject('acronyms')

const annotatedSegments = computed(() => {
  if (!acronyms.value) return [{ type: 'text', content: props.text }]
  return annotateText(props.text, acronyms.value, props.maxAnnotations)
})
</script>

<template>
  <span class="annotated-text">
    <template v-for="(segment, i) in annotatedSegments" :key="i">
      <span v-if="segment.type === 'text'">{{ segment.content }}</span>
      <AcronymTooltip
        v-else
        :term="segment.term"
        :acronym="segment.acronym"
      />
    </template>
  </span>
</template>
```

### Usage Pattern

Any component can use acronym annotation:

```vue
<template>
  <!-- Manual annotation of specific text -->
  <AcronymAnnotator :text="service.long_description" />

  <!-- Or use the directive for simpler cases -->
  <p v-annotate>
    This HPC cluster provides GPU access for ML workloads.
  </p>
</template>
```

### Auto-Annotation Directive

For convenience, a Vue directive that auto-annotates element text content:

```typescript
// src/directives/annotate.ts
import { annotateText } from '@/utils/acronymParser'

export const vAnnotate = {
  mounted(el: HTMLElement, binding, vnode) {
    const acronyms = inject('acronyms')
    if (!acronyms) return

    // Walk text nodes and replace with annotated versions
    walkTextNodes(el, (textNode) => {
      const annotated = annotateText(textNode.textContent, acronyms)
      if (hasAnnotations(annotated)) {
        replaceWithAnnotatedSpan(textNode, annotated)
      }
    })
  }
}
```

---

## Part 2: Modular Calculator System

### Overview

Each calculator is a self-contained plugin that:
1. Declares its metadata (name, category, icon)
2. Provides its own form fields and validation
3. Implements the estimate calculation
4. Returns a standardized result format

Schools add/remove calculators by editing `config/calculators.yaml`.

### Config Schema: `config/calculators.yaml`

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

# Calculator-specific configuration overrides
calculator_config:
  microscopy:
    # Institution-specific defaults
    default_resolution: "4k"
    default_bit_depth: 16
    # Custom presets
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
        description: "Light sheet with Z-stack"

  genomics:
    # Which pipelines to show
    pipelines:
      - wgs_alignment
      - variant_calling
      - rnaseq
      - single_cell
      - de_novo_assembly
    # Institution-specific SU estimates
    su_estimates:
      wgs_alignment:
        min: 100
        typical: 300
        max: 500
        note: "Per 30x sample on our cluster"

  simulations:
    # Which simulation packages to show
    packages:
      - gromacs
      - lammps
      - openfoam
      - ansys
      - custom
    # Whether to show MPI/parallel options
    show_parallel_options: true

# Global calculator settings
global:
  # Safety multiplier applied to all estimates
  safety_multiplier: 1.5

  # Whether to show the math
  show_calculation: true

  # Result precision
  storage_precision: 1  # decimal places for TB
  compute_precision: 0  # decimal places for SU
```

### Calculator Plugin Interface

Each calculator implements a standard interface:

```typescript
// src/types/calculator.ts

export interface CalculatorPlugin {
  // Metadata
  id: string
  name: string
  category: 'storage' | 'cpu' | 'gpu'
  icon: string
  description: string

  // The Vue component for the calculator form
  component: Component

  // Validation
  validate: (inputs: CalculatorInputs) => ValidationResult

  // Calculation
  calculate: (inputs: CalculatorInputs, config: CalculatorConfig) => CalculatorResult
}

export interface CalculatorResult {
  // Primary result
  value: number
  unit: 'TB' | 'SU' | 'GPU-hours' | 'credits'

  // For display
  formatted: string  // "2.5 TB"
  withBuffer: string // "3.75 TB (with 1.5x buffer)"

  // Show the math
  calculation: CalculationStep[]

  // Recommendations
  recommendations?: Recommendation[]
}

export interface CalculationStep {
  description: string  // "10,000 images × 32 MB per image"
  value: string        // "320,000 MB"
}

export interface Recommendation {
  type: 'service' | 'bundle' | 'tip'
  title: string
  description: string
  link?: string
}
```

### Calculator Component Structure

```
src/
  components/
    estimate/
      HelpEstimateModal.vue         # Main modal container
      EstimateTabs.vue              # Tab navigation
      CalculatorLoader.vue          # Dynamic calculator loading
      CalculatorResult.vue          # Result display component

      calculators/
        # Storage calculators
        MicroscopyCalculator.vue
        PhotographyCalculator.vue
        GenomicsStorageCalculator.vue
        VideoCalculator.vue
        MedicalImagingCalculator.vue
        DocumentsCalculator.vue

        # CPU calculators
        GenomicsPipelinesCalculator.vue
        SimulationsCalculator.vue
        BatchProcessingCalculator.vue
        StatisticsCalculator.vue

        # GPU calculators
        MLTrainingCalculator.vue
        MLInferenceCalculator.vue
        GPUSimulationCalculator.vue

      # Shared calculator components
      shared/
        NumberInput.vue              # Validated number input
        PresetSelector.vue           # Quick preset buttons
        ResolutionPicker.vue         # Image resolution selector
        UnitToggle.vue               # TB/GB toggle
        CalculationBreakdown.vue     # "Show math" expandable
```

### Example Calculator: MicroscopyCalculator.vue

```vue
<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { CalculatorPlugin, CalculatorResult } from '@/types/calculator'
import NumberInput from '../shared/NumberInput.vue'
import ResolutionPicker from '../shared/ResolutionPicker.vue'
import PresetSelector from '../shared/PresetSelector.vue'

const config = inject('calculatorConfig')

// Form state
const resolution = ref<'2k' | '4k' | '8k'>('4k')
const bitDepth = ref<8 | 16>(16)
const channels = ref<'grayscale' | 'rgb' | 'multi'>('grayscale')
const channelCount = ref(1)
const imageCount = ref(1000)
const includeProcessing = ref(false)

// Size lookup table (MB per image)
const sizeTable = {
  '2k': { 8: { grayscale: 4, rgb: 12 }, 16: { grayscale: 8, rgb: 24 } },
  '4k': { 8: { grayscale: 16, rgb: 48 }, 16: { grayscale: 32, rgb: 96 } },
  '8k': { 8: { grayscale: 64, rgb: 192 }, 16: { grayscale: 128, rgb: 384 } },
}

const sizePerImage = computed(() => {
  const base = sizeTable[resolution.value][bitDepth.value]
  if (channels.value === 'grayscale') return base.grayscale
  if (channels.value === 'rgb') return base.rgb
  // Multi-channel: scale by channel count
  return base.grayscale * channelCount.value
})

const result = computed<CalculatorResult>(() => {
  const rawMB = imageCount.value * sizePerImage.value
  const rawTB = rawMB / 1_000_000
  const withBuffer = rawTB * (config?.safety_multiplier || 1.5)
  const withProcessing = includeProcessing.value ? withBuffer * 2 : withBuffer

  return {
    value: withProcessing,
    unit: 'TB',
    formatted: `${withProcessing.toFixed(1)} TB`,
    withBuffer: `${withProcessing.toFixed(1)} TB (includes ${config?.safety_multiplier || 1.5}x buffer${includeProcessing.value ? ' + processing space' : ''})`,
    calculation: [
      {
        description: `${imageCount.value.toLocaleString()} images × ${sizePerImage.value} MB per image`,
        value: `${rawMB.toLocaleString()} MB`
      },
      {
        description: `Convert to TB`,
        value: `${rawTB.toFixed(2)} TB`
      },
      {
        description: `Apply ${(config?.safety_multiplier || 1.5)}x safety buffer`,
        value: `${(rawTB * (config?.safety_multiplier || 1.5)).toFixed(2)} TB`
      },
      ...(includeProcessing.value ? [{
        description: `Add processing/intermediate space (2x)`,
        value: `${withProcessing.toFixed(2)} TB`
      }] : [])
    ]
  }
})

const emit = defineEmits<{
  result: [result: CalculatorResult]
}>()

const applyEstimate = () => {
  emit('result', result.value)
}
</script>

<template>
  <div class="calculator microscopy-calculator">
    <h3>Microscopy Images</h3>

    <!-- Quick presets -->
    <PresetSelector
      v-if="config?.presets?.length"
      :presets="config.presets"
      @select="applyPreset"
    />

    <div class="form-grid">
      <ResolutionPicker
        v-model="resolution"
        :options="['2k', '4k', '8k']"
        label="Image Resolution"
      />

      <div class="field">
        <label>Bit Depth</label>
        <select v-model="bitDepth">
          <option :value="8">8-bit</option>
          <option :value="16">16-bit</option>
        </select>
      </div>

      <div class="field">
        <label>Channels</label>
        <select v-model="channels">
          <option value="grayscale">Grayscale</option>
          <option value="rgb">RGB (3 channels)</option>
          <option value="multi">Multi-channel</option>
        </select>
      </div>

      <NumberInput
        v-if="channels === 'multi'"
        v-model="channelCount"
        label="Number of channels"
        :min="1"
        :max="20"
      />

      <NumberInput
        v-model="imageCount"
        label="Number of images"
        :min="1"
        :step="100"
        :presets="[1000, 5000, 10000, 50000]"
      />

      <div class="field checkbox">
        <label>
          <input type="checkbox" v-model="includeProcessing" />
          Include space for processing intermediates
        </label>
        <span class="hint">Doubles estimate for analysis outputs</span>
      </div>
    </div>

    <!-- Live result preview -->
    <div class="result-preview">
      <div class="result-value">{{ result.formatted }}</div>
      <div class="result-note">{{ result.withBuffer }}</div>

      <details class="calculation-breakdown">
        <summary>Show calculation</summary>
        <ul>
          <li v-for="step in result.calculation" :key="step.description">
            {{ step.description }} = <strong>{{ step.value }}</strong>
          </li>
        </ul>
      </details>
    </div>

    <button @click="applyEstimate" class="btn-primary">
      Use this estimate
    </button>
  </div>
</template>
```

### Calculator Registry

Dynamic loading of enabled calculators:

```typescript
// src/calculators/registry.ts

import type { CalculatorPlugin } from '@/types/calculator'

// Lazy-loaded calculator imports
const calculatorModules = {
  // Storage
  'microscopy': () => import('./storage/MicroscopyCalculator.vue'),
  'photography': () => import('./storage/PhotographyCalculator.vue'),
  'genomics': () => import('./storage/GenomicsStorageCalculator.vue'),
  'video': () => import('./storage/VideoCalculator.vue'),
  'medical-imaging': () => import('./storage/MedicalImagingCalculator.vue'),
  'documents': () => import('./storage/DocumentsCalculator.vue'),

  // CPU
  'genomics-pipelines': () => import('./cpu/GenomicsPipelinesCalculator.vue'),
  'simulations': () => import('./cpu/SimulationsCalculator.vue'),
  'batch-processing': () => import('./cpu/BatchProcessingCalculator.vue'),
  'statistics': () => import('./cpu/StatisticsCalculator.vue'),

  // GPU
  'ml-training': () => import('./gpu/MLTrainingCalculator.vue'),
  'ml-inference': () => import('./gpu/MLInferenceCalculator.vue'),
  'gpu-simulation': () => import('./gpu/GPUSimulationCalculator.vue'),
}

export async function loadCalculator(id: string): Promise<CalculatorPlugin | null> {
  const loader = calculatorModules[id]
  if (!loader) {
    console.warn(`Unknown calculator: ${id}`)
    return null
  }

  const module = await loader()
  return module.default
}

export async function loadEnabledCalculators(
  config: CalculatorsConfig
): Promise<Record<string, CalculatorPlugin[]>> {
  const result = {
    storage: [],
    cpu: [],
    gpu: []
  }

  for (const [category, ids] of Object.entries(config.enabled_calculators)) {
    for (const id of ids) {
      const calc = await loadCalculator(id)
      if (calc) {
        result[category].push(calc)
      }
    }
  }

  return result
}
```

---

## Part 3: Help Me Estimate Modal

### Modal Structure

```vue
<!-- HelpEstimateModal.vue -->
<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useCalculatorConfig } from '@/composables/useCalculatorConfig'
import EstimateTabs from './EstimateTabs.vue'
import CalculatorLoader from './CalculatorLoader.vue'
import AccessExplainer from './AccessExplainer.vue'

const props = defineProps<{
  initialTab?: 'storage' | 'cpu' | 'gpu' | 'access'
  initialCalculator?: string
}>()

const emit = defineEmits<{
  close: []
  result: [result: { value: number, unit: string, category: string }]
}>()

const { config, calculators } = useCalculatorConfig()

const activeTab = ref(props.initialTab || 'storage')
const activeCalculator = ref(props.initialCalculator || null)

// Provide config to child calculators
provide('calculatorConfig', config)

const handleResult = (result) => {
  emit('result', {
    ...result,
    category: activeTab.value
  })
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal help-estimate-modal" role="dialog" aria-labelledby="modal-title">
      <header class="modal-header">
        <h2 id="modal-title">Help Me Estimate</h2>
        <button @click="$emit('close')" aria-label="Close" class="close-btn">×</button>
      </header>

      <EstimateTabs v-model="activeTab" :tabs="['storage', 'cpu', 'gpu', 'access']" />

      <div class="modal-body">
        <!-- Storage Tab -->
        <div v-if="activeTab === 'storage'" class="tab-content">
          <div class="tab-intro">
            <h3>How much storage do you need?</h3>
            <p>Select your data type to estimate storage in terabytes (TB).</p>
            <AcronymAnnotator text="1 TB = 1,000 GB. Your laptop probably has 256 GB - 1 TB." />
          </div>

          <div class="calculator-grid">
            <button
              v-for="calc in calculators.storage"
              :key="calc.id"
              @click="activeCalculator = calc.id"
              :class="{ active: activeCalculator === calc.id }"
              class="calculator-card"
            >
              <component :is="calc.icon" class="calc-icon" />
              <span>{{ calc.name }}</span>
            </button>
          </div>

          <CalculatorLoader
            v-if="activeCalculator"
            :calculator-id="activeCalculator"
            @result="handleResult"
          />
        </div>

        <!-- CPU Compute Tab -->
        <div v-if="activeTab === 'cpu'" class="tab-content">
          <div class="tab-intro">
            <h3>How much compute do you need?</h3>
            <p>Estimate your needs in Service Units (SU).</p>
            <AcronymAnnotator text="1 SU = 1 CPU core running for 1 hour. 32 cores × 10 hours = 320 SU." />
          </div>

          <div class="calculator-grid">
            <button
              v-for="calc in calculators.cpu"
              :key="calc.id"
              @click="activeCalculator = calc.id"
              :class="{ active: activeCalculator === calc.id }"
              class="calculator-card"
            >
              <component :is="calc.icon" class="calc-icon" />
              <span>{{ calc.name }}</span>
            </button>
          </div>

          <CalculatorLoader
            v-if="activeCalculator"
            :calculator-id="activeCalculator"
            @result="handleResult"
          />
        </div>

        <!-- GPU Compute Tab -->
        <div v-if="activeTab === 'gpu'" class="tab-content">
          <div class="tab-intro">
            <h3>How many GPU-hours do you need?</h3>
            <p>Estimate GPU compute for ML training, inference, or accelerated simulation.</p>
            <AcronymAnnotator text="GPUs are specialized processors that excel at parallel tasks like machine learning." />
          </div>

          <div class="calculator-grid">
            <button
              v-for="calc in calculators.gpu"
              :key="calc.id"
              @click="activeCalculator = calc.id"
              :class="{ active: activeCalculator === calc.id }"
              class="calculator-card"
            >
              <component :is="calc.icon" class="calc-icon" />
              <span>{{ calc.name }}</span>
            </button>
          </div>

          <CalculatorLoader
            v-if="activeCalculator"
            :calculator-id="activeCalculator"
            @result="handleResult"
          />
        </div>

        <!-- ACCESS Explainer Tab -->
        <div v-if="activeTab === 'access'" class="tab-content">
          <AccessExplainer @select-tier="handleAccessTier" />
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## Part 4: Global Help Escape Hatch

Every page with confusing content should have a prominent "Talk to a Human" button.

### Config

```yaml
# config/help.yaml (addition)

global:
  show_help_cta: true
  help_cta_text: "Not sure? Talk to a human →"
  help_cta_link: "/contact-rc"
  help_cta_position: "bottom-right"  # or "inline", "header"

  # Pages where help is especially prominent
  emphasized_pages:
    - "tier-selection"
    - "storage-estimate"
    - "service-selection"
    - "high-tier-workflow"
```

### Implementation

Add a global `HelpCTA` component that appears on every wizard page:

```vue
<!-- HelpCTA.vue - Floating or inline help button -->
<template>
  <div class="help-cta" :class="position">
    <button @click="openHelpModal" class="help-button">
      <MessageCircle class="icon" />
      <span>{{ config.help_cta_text }}</span>
    </button>
  </div>
</template>
```

This connects to the full help flow documented in [TALK-TO-HUMAN.md](./TALK-TO-HUMAN.md).

---

## Part 5: Software Catalog Integration

The Help Me Estimate modal should link to the software catalog for users asking "Where's Gaussian?"

### Cross-Reference

When users are on compute estimation, show:

```
┌─────────────────────────────────────────────────────────────────┐
│  💡 Looking for specific software?                              │
│                                                                 │
│  Check our [Software Catalog →] to see what's pre-installed   │
│  on HPC and VDI, including Gaussian, MATLAB, Stata, and more.  │
└─────────────────────────────────────────────────────────────────┘
```

Full software catalog design in [SOFTWARE-CATALOG.md](./SOFTWARE-CATALOG.md).

---

## Part 6: Compliance Workflow Explainer

CXO feedback: "Vosker-Lin wanted to know 'What actually happens when I select L4?' The acronym system explains what ITAR is, but not the process."

When users select High-tier data (L3/L4), show a **process explainer** - not just definitions.

### Compliance Flow Modal

Triggered when user selects L3 (regulated) or L4 (export-controlled) data:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  What Happens Next: High-Tier Data Workflow                            [X]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  You've indicated your data requires elevated security. Here's what        │
│  happens next:                                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  STEP 1: Complete This Planner                              ~10 min │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  Finish selecting your services. We'll generate a requirements     │   │
│  │  summary for Research IT.                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           ↓                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  STEP 2: Research IT Consultation                           ~30 min │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  We'll review your data types and recommend appropriate services.   │   │
│  │  This is a collaborative conversation, not an approval gate.        │   │
│  │                                                                      │   │
│  │  📅 Typical wait: 1-3 business days                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           ↓                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  STEP 3: Security Assessment (if needed)                            │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  For L4/export-controlled data, our security team confirms the      │   │
│  │  proposed infrastructure meets requirements. For most L3/HIPAA      │   │
│  │  cases, pre-approved services skip this step.                        │   │
│  │                                                                      │   │
│  │  📅 L3 with BAA: Often same-day                                     │   │
│  │  📅 L4/CUI/ITAR: 1-2 weeks                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           ↓                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  STEP 4: Environment Provisioning                                   │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  We configure your approved services with required security         │   │
│  │  controls (encryption, access logging, network isolation).          │   │
│  │                                                                      │   │
│  │  📅 Typical: 1-5 business days after approval                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                           ↓                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  STEP 5: Training & Access                                          │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  Brief training on compliance requirements for your environment.    │   │
│  │  Then you're ready to start your research!                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💡 Most researchers with HIPAA/PHI data are working within 1 week.        │
│     Export-controlled projects typically take 2-3 weeks.                   │
│                                                                             │
│  Questions? [Talk to Research IT →]                                        │
│                                                                             │
│                                            [Got it, continue planning →]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tier-Specific Process Details

Add to `config/tier-workflow.yaml`:

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
        time: "~10 min"
        self_service: true
      - step: "Research IT consultation"
        time: "1-3 days"
        description: "Verify data classification and service compatibility"
      - step: "BAA verification"
        time: "Same day to 1 week"
        description: "Confirm institutional agreement covers your use case"
        skip_if: "using_preapproved_service"
      - step: "Environment setup"
        time: "1-3 days"
        description: "Configure encryption, access controls, audit logging"
      - step: "Training"
        time: "~30 min"
        description: "HIPAA/FERPA handling requirements"
    typical_time: "3-7 business days"
    preapproved_services:
      - "cloud-high-security"
      - "vdi-hipaa"
      - "box-hipaa"

  L4:
    name: "Restricted (Export-Controlled)"
    process: "security_review"
    description: "Requires export control review and dedicated infrastructure"
    compliance_types:
      - itar
      - ear
      - cui
      - classified
    steps:
      - step: "Complete planner"
        time: "~10 min"
        self_service: true
      - step: "Research IT consultation"
        time: "1-3 days"
        description: "Review requirements with compliance team"
      - step: "Export control determination"
        time: "3-5 days"
        description: "Research Security confirms data classification"
        contact: "export-control@university.edu"
      - step: "Security assessment"
        time: "1-2 weeks"
        description: "Architecture review for NIST 800-171 / CMMC compliance"
      - step: "Enclave provisioning"
        time: "1-2 weeks"
        description: "Dedicated isolated environment with required controls"
      - step: "Certification"
        time: "3-5 days"
        description: "Security team certifies environment"
      - step: "Training"
        time: "~2 hours"
        description: "Export control handling, personnel restrictions"
    typical_time: "3-6 weeks"
    notes:
      - "Only US persons may access L4 data (ITAR/EAR restriction)"
      - "Dedicated infrastructure required - no shared resources"
      - "Annual recertification required"

# FAQ for compliance workflow
faq:
  - question: "Why does high-tier data take longer?"
    answer: |
      Regulated and export-controlled data requires verification of compliance
      infrastructure. This protects both the data subjects and the institution.
      We've streamlined this process as much as possible while maintaining
      required safeguards.

  - question: "Can I start working while waiting for approval?"
    answer: |
      For L3 (HIPAA/PHI): Yes, you can often begin with de-identified or
      synthetic data while BAA verification completes.

      For L4 (export-controlled): No, you must wait for full approval before
      any data access. However, you can prepare analysis code on non-sensitive
      test data.

  - question: "What if I'm not sure about my data tier?"
    answer: |
      That's common! The tier questionnaire helps identify likely requirements,
      but Research IT will confirm during consultation. It's better to
      over-estimate initially - we can always relax controls if warranted.

  - question: "I have a grant deadline. Can this be expedited?"
    answer: |
      Contact Research IT immediately with your deadline. We can often
      prioritize consultations and work in parallel with other approvals.
      Include your deadline in the planner notes.
```

### Integration in Wizard

Show the workflow explainer at two points:

1. **After tier selection** - When user selects L3/L4, show the modal
2. **In summary page** - Include timeline estimate based on data tier

```typescript
// src/composables/useComplianceWorkflow.ts

export function useComplianceWorkflow(selectedTier: Ref<string>) {
  const showWorkflowModal = ref(false)
  const workflowConfig = ref<WorkflowConfig | null>(null)

  watch(selectedTier, (newTier, oldTier) => {
    // Show modal when upgrading to L3 or L4
    if ((newTier === 'L3' || newTier === 'L4') &&
        (oldTier !== 'L3' && oldTier !== 'L4')) {
      showWorkflowModal.value = true
    }
  })

  const estimatedTimeline = computed(() => {
    return workflowConfig.value?.workflows[selectedTier.value]?.typical_time || 'Same day'
  })

  const requiredSteps = computed(() => {
    return workflowConfig.value?.workflows[selectedTier.value]?.steps || []
  })

  return {
    showWorkflowModal,
    estimatedTimeline,
    requiredSteps
  }
}
```

---

## Part 7: Integration Points

### Entry Points

The modal should be accessible from multiple places:

```yaml
# Where "Help Me Estimate" links appear

wizard_steps:
  - step: "storage_selection"
    trigger: "Not sure how much? Help me estimate →"
    opens_tab: "storage"

  - step: "compute_selection"
    trigger: "What's an SU? Help me understand →"
    opens_tab: "cpu"

  - step: "service_details"
    trigger: "Help me estimate" (on service cards)
    opens_tab: "based on service category"

global:
  - location: "header help menu"
    trigger: "Resource Calculator"
    opens_tab: null  # User chooses

  - location: "footer"
    trigger: "Estimate Resources"
    opens_tab: null
```

### Result Flow

When user clicks "Use this estimate":

```typescript
// The result flows back to the parent form
interface EstimateResult {
  value: number
  unit: 'TB' | 'SU' | 'GPU-hours' | 'credits'
  category: 'storage' | 'cpu' | 'gpu'
  calculator: string  // Which calculator produced this
  calculation: CalculationStep[]  // For audit/display
}

// Parent form receives and applies
function handleEstimateResult(result: EstimateResult) {
  if (result.category === 'storage') {
    formState.storage.amount = result.value
    formState.storage.unit = result.unit
    formState.storage.estimatedVia = result.calculator
  }
  // etc.
}
```

### Domain Detection

Use earlier wizard answers to pre-select relevant calculators:

```typescript
// src/composables/useSmartCalculatorDefaults.ts

export function useSmartCalculatorDefaults(wizardState: WizardState) {
  const suggestedTab = computed(() => {
    // If they selected ML/AI methodology, suggest GPU
    if (wizardState.methodologies?.includes('machine-learning')) {
      return 'gpu'
    }
    // If they have microscopy in their data types, suggest storage
    if (wizardState.dataTypes?.includes('microscopy')) {
      return 'storage'
    }
    // Default
    return 'storage'
  })

  const suggestedCalculator = computed(() => {
    // Pre-select based on discipline/methodology
    const mapping = {
      'microscopy': 'microscopy',
      'genomics': 'genomics',
      'machine-learning': 'ml-training',
      'clinical': 'medical-imaging',
      'humanities': 'documents',
    }

    for (const [key, calc] of Object.entries(mapping)) {
      if (wizardState.disciplines?.includes(key) ||
          wizardState.dataTypes?.includes(key)) {
        return calc
      }
    }
    return null
  })

  return { suggestedTab, suggestedCalculator }
}
```

---

## Part 8: Custom Calculator Template

For schools that want to add their own calculators:

```vue
<!-- Template: CustomCalculator.vue -->
<script setup lang="ts">
/**
 * Custom Calculator Template
 *
 * To create a new calculator:
 * 1. Copy this file to src/components/estimate/calculators/your-name/
 * 2. Implement the form fields and calculation logic
 * 3. Register in config/calculators.yaml under enabled_calculators
 * 4. Optionally add presets in calculator_config.your_calculator
 */

import { ref, computed } from 'vue'
import type { CalculatorResult } from '@/types/calculator'
import NumberInput from '../shared/NumberInput.vue'

// === CALCULATOR METADATA ===
// Export these for the registry
export const id = 'your-calculator-id'
export const name = 'Your Calculator Name'
export const category = 'storage' // or 'cpu' or 'gpu'
export const icon = 'IconName'
export const description = 'Brief description for the card'

// === FORM STATE ===
const myField = ref(100)
const anotherField = ref('option1')

// === CALCULATION LOGIC ===
const result = computed<CalculatorResult>(() => {
  // Your calculation here
  const rawValue = myField.value * 10
  const withBuffer = rawValue * 1.5

  return {
    value: withBuffer,
    unit: 'TB',  // or 'SU', 'GPU-hours'
    formatted: `${withBuffer.toFixed(1)} TB`,
    withBuffer: `${withBuffer.toFixed(1)} TB (with 1.5x buffer)`,
    calculation: [
      {
        description: `${myField.value} × 10`,
        value: `${rawValue}`
      },
      {
        description: 'Apply 1.5x buffer',
        value: `${withBuffer}`
      }
    ]
  }
})

// === EMIT RESULT ===
const emit = defineEmits<{
  result: [result: CalculatorResult]
}>()

const applyEstimate = () => emit('result', result.value)
</script>

<template>
  <div class="calculator">
    <h3>{{ name }}</h3>

    <!-- Your form fields here -->
    <NumberInput v-model="myField" label="My Field" />

    <!-- Result display -->
    <div class="result-preview">
      <div class="result-value">{{ result.formatted }}</div>
    </div>

    <button @click="applyEstimate">Use this estimate</button>
  </div>
</template>
```

---

## Part 9: Accessibility Requirements

### Keyboard Navigation

- Tab order follows visual layout
- Enter/Space activates buttons and links
- Escape closes modals
- Arrow keys navigate within calculator cards

### Screen Reader Support

- All form fields have associated labels
- Calculator results announced when updated
- "Show calculation" details properly labeled
- Modal has appropriate ARIA attributes

### Visual Design

- Minimum 4.5:1 contrast ratio for text
- Focus indicators on all interactive elements
- Acronym underlines don't rely on color alone
- Tooltips work on focus (not just hover)

---

## Known Issues & Future Considerations

### Archive Storage Direct Input (CXO Feedback)

**Issue:** Vex said *"I just want to type 4 TB of archive."* The ratio-based calculator is confusing for users who already know their storage requirement.

**Current behavior:** Archive storage is calculated as a ratio of active storage (e.g., "archive 50% of my active data").

**Requested behavior:** Allow direct TB input for archive storage alongside the ratio calculator.

**Proposed solution:**

```vue
<!-- ArchiveStorageInput.vue - dual input mode -->
<template>
  <div class="archive-input">
    <div class="input-mode-toggle">
      <button :class="{ active: mode === 'ratio' }" @click="mode = 'ratio'">
        Calculate from ratio
      </button>
      <button :class="{ active: mode === 'direct' }" @click="mode = 'direct'">
        I know my amount
      </button>
    </div>

    <!-- Ratio mode -->
    <div v-if="mode === 'ratio'" class="ratio-input">
      <label>Archive ratio</label>
      <select v-model="archiveRatio">
        <option value="0">None - I'll manage my own archiving</option>
        <option value="0.25">25% - Keep a small archive</option>
        <option value="0.5">50% - Archive half my data (typical)</option>
        <option value="1.0">100% - Archive everything</option>
        <option value="2.0">200% - Archive more than active (multi-year retention)</option>
      </select>
      <p class="result">
        {{ activeStorage }} TB active × {{ archiveRatio * 100 }}% =
        <strong>{{ (activeStorage * archiveRatio).toFixed(1) }} TB archive</strong>
      </p>
    </div>

    <!-- Direct mode -->
    <div v-if="mode === 'direct'" class="direct-input">
      <label>Archive storage needed</label>
      <div class="input-with-unit">
        <input type="number" v-model="directTB" min="0" step="0.5" />
        <span class="unit">TB</span>
      </div>
      <p class="hint">
        Enter your total long-term storage needs. Archive storage is slower
        but cheaper (~$0.004/GB/mo vs ~$0.023/GB/mo for active).
      </p>
    </div>
  </div>
</template>
```

**Implementation note:** This is a V1.1 enhancement. For V1, document that users can enter their total storage and we'll calculate archive separately, or use "Other" option to specify directly.

---

## Implementation Order

### Phase 1: Acronym System
1. Create `config/acronyms.yaml` with core terms
2. Build `AcronymTooltip` and `AcronymModal` components
3. Implement text parsing utility
4. Add `AcronymProvider` and `AcronymAnnotator`
5. Test on service descriptions

### Phase 2: Calculator Infrastructure
1. Define `CalculatorPlugin` interface
2. Build shared components (`NumberInput`, `PresetSelector`, etc.)
3. Create `CalculatorLoader` and registry
4. Build `HelpEstimateModal` shell with tabs

### Phase 3: Individual Calculators
1. Storage: Microscopy, Genomics (high priority based on UX feedback)
2. Storage: Photography, Video, Medical Imaging, Documents
3. CPU: Genomics Pipelines, Batch Processing
4. CPU: Simulations, Statistics
5. GPU: ML Training, ML Inference, GPU Simulation

### Phase 4: Integration
1. Add entry points in wizard steps
2. Implement result flow back to forms
3. Add domain detection for smart defaults
4. Create `config/calculators.yaml` for customization

### Phase 5: Polish
1. Accessibility audit
2. Mobile responsive design
3. Documentation for adding custom calculators
4. Performance optimization (lazy loading)

---

## Testing Considerations

### Unit Tests
- Acronym parsing with various text inputs
- Calculator math accuracy
- Result formatting

### Integration Tests
- Modal open/close behavior
- Tab navigation
- Result flow to parent forms

### UX Testing
- Validate with same personas from Round 1
- Specifically: Tonsley (TB), Transom (GPU-hours), Vex (SU)

---

## References

- [ELI5.md](./ELI5.md) - Feature concept and content
- [UNIT-CONVERSIONS.md](./UNIT-CONVERSIONS.md) - Conversion factors
- [Foreign Concepts.md](./Foreign%20Concepts.md) - UX research findings
