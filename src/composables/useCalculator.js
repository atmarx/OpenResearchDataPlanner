import { ref, computed, reactive, watch } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSlateStore } from '@/stores/slateStore'

/**
 * Simple debounce function
 */
function debounce(fn, delay = 150) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Default service mappings for calculator results
 * These can be overridden in calculators.yaml
 */
const DEFAULT_TARGET_SERVICES = {
  storage: 'hpc-storage',
  cpu: 'hpc-cpu',
  gpu: 'hpc-gpu'
}

/**
 * Composable for managing calculator state and calculations
 *
 * @param {string} calculatorId - The calculator ID from calculators.yaml
 * @returns {object} Calculator state and methods
 */
export function useCalculator(calculatorId) {
  const configStore = useConfigStore()
  const slateStore = useSlateStore()

  // Calculator configuration from config
  const config = computed(() => {
    return configStore.config?.calculators?.calculator_config?.[calculatorId] || null
  })

  // Calculator category (storage, cpu, gpu)
  const category = computed(() => {
    const enabled = configStore.config?.calculators?.enabled_calculators || {}
    for (const [cat, ids] of Object.entries(enabled)) {
      if (ids.includes(calculatorId)) {
        return cat
      }
    }
    return null
  })

  // Global calculator settings
  const globalSettings = computed(() => {
    return configStore.config?.calculators?.global || {}
  })

  // Reactive inputs state
  const inputs = reactive({})

  // Current result
  const result = ref(null)

  // Calculation breakdown (for "show calculation" feature)
  const breakdown = ref([])

  // Error state
  const error = ref(null)

  /**
   * Get the unit for this calculator's output
   */
  const outputUnit = computed(() => {
    switch (category.value) {
      case 'storage':
        return { label: 'TB', plural: 'TB' }
      case 'cpu':
        return { label: 'SU', plural: 'SU' }
      case 'gpu':
        return { label: 'GPU-hour', plural: 'GPU-hours' }
      default:
        return { label: 'units', plural: 'units' }
    }
  })

  /**
   * Get the target service for this calculator's output
   */
  const targetService = computed(() => {
    // Check if calculator has explicit target_services
    if (config.value?.target_services?.default) {
      return config.value.target_services.default
    }
    // Fall back to category default
    return DEFAULT_TARGET_SERVICES[category.value] || 'hpc-storage'
  })

  /**
   * Get alternative target services
   */
  const alternativeServices = computed(() => {
    return config.value?.target_services?.alternatives || []
  })

  /**
   * Reset inputs to defaults
   */
  function resetInputs() {
    Object.keys(inputs).forEach(key => {
      delete inputs[key]
    })
    result.value = null
    breakdown.value = []
    error.value = null
  }

  /**
   * Apply a preset configuration
   * @param {object} preset - Preset object from config
   */
  function applyPreset(preset) {
    // Copy preset values to inputs
    Object.entries(preset).forEach(([key, value]) => {
      if (key !== 'label' && key !== 'description') {
        inputs[key] = value
      }
    })
    // Recalculate
    calculate()
  }

  /**
   * Calculate result based on calculator type and inputs
   */
  function calculate() {
    error.value = null
    breakdown.value = []

    try {
      switch (category.value) {
        case 'storage':
          calculateStorage()
          break
        case 'cpu':
          calculateCPU()
          break
        case 'gpu':
          calculateGPU()
          break
        default:
          error.value = `Unknown calculator category: ${category.value}`
      }

      // Apply safety multiplier and do final rounding
      if (result.value && globalSettings.value.safety_multiplier) {
        const multiplier = globalSettings.value.safety_multiplier
        const beforeMultiplier = result.value
        result.value = result.value * multiplier

        // Final rounding for storage: 3 decimal places (= 1 GB precision)
        if (category.value === 'storage') {
          result.value = Math.ceil(result.value * 1000) / 1000
        }

        if (multiplier !== 1) {
          breakdown.value.push({
            label: `Safety buffer (${multiplier}×)`,
            value: `${formatResultValue(beforeMultiplier, category.value)} → ${formatResultValue(result.value, category.value)}`
          })
        }
      } else if (result.value && category.value === 'storage') {
        // Round storage even without safety multiplier
        result.value = Math.ceil(result.value * 1000) / 1000
      }
    } catch (e) {
      error.value = e.message || 'Calculation error'
      result.value = null
    }
  }

  /**
   * Calculate storage requirements
   */
  function calculateStorage() {
    const cfg = config.value
    let totalBytes = 0

    switch (calculatorId) {
      case 'microscopy': {
        // Formula: pixels × bytes_per_pixel × channels × z_slices × image_count
        const resolution = cfg.resolutions?.find(r => r.key === inputs.resolution)
        const bitDepth = cfg.bit_depths?.find(b => b.value === inputs.bit_depth)

        if (!resolution || !bitDepth) {
          error.value = 'Please select resolution and bit depth'
          return
        }

        const pixels = resolution.pixels
        const bytesPerPixel = bitDepth.bytes_per_pixel
        const channels = inputs.channels || 1
        const zSlices = inputs.z_slices || 1
        const imageCount = inputs.image_count || 1

        totalBytes = pixels * bytesPerPixel * channels * zSlices * imageCount

        breakdown.value = [
          { label: 'Resolution', value: resolution.label },
          { label: 'Bit depth', value: bitDepth.label },
          { label: 'Channels', value: channels.toString() },
          { label: 'Z-slices', value: zSlices.toString() },
          { label: 'Image count', value: imageCount.toLocaleString() },
          { label: 'Per image', value: formatBytes(pixels * bytesPerPixel * channels * zSlices) }
        ]
        break
      }

      case 'photography': {
        const sizePerFile = (inputs.size_mb || 10) * 1024 * 1024
        const fileCount = inputs.file_count || 1
        totalBytes = sizePerFile * fileCount

        breakdown.value = [
          { label: 'Size per file', value: `${inputs.size_mb || 10} MB` },
          { label: 'Number of files', value: fileCount.toLocaleString() }
        ]
        break
      }

      case 'genomics': {
        const dataType = cfg.data_types?.find(d => d.label === inputs.data_type)
        const sampleCount = inputs.sample_count || 1

        if (!dataType) {
          error.value = 'Please select a data type'
          return
        }

        totalBytes = dataType.size_gb * sampleCount * 1024 * 1024 * 1024

        breakdown.value = [
          { label: 'Data type', value: dataType.label },
          { label: 'Size per sample', value: `${dataType.size_gb} GB` },
          { label: 'Number of samples', value: sampleCount.toLocaleString() }
        ]
        break
      }

      case 'video': {
        const preset = cfg.presets?.find(p => p.label === inputs.preset)
        const hours = inputs.hours || 1

        if (!preset) {
          error.value = 'Please select a video type'
          return
        }

        totalBytes = preset.gb_per_hour * hours * 1024 * 1024 * 1024

        breakdown.value = [
          { label: 'Video type', value: preset.label },
          { label: 'Size per hour', value: `${preset.gb_per_hour} GB` },
          { label: 'Hours of video', value: hours.toString() }
        ]
        break
      }

      case 'medical-imaging': {
        const dataType = cfg.data_types?.find(d => d.label === inputs.data_type)
        const studyCount = inputs.study_count || 1

        if (!dataType) {
          error.value = 'Please select an imaging type'
          return
        }

        totalBytes = dataType.size_gb * studyCount * 1024 * 1024 * 1024

        breakdown.value = [
          { label: 'Imaging type', value: dataType.label },
          { label: 'Size per study', value: `${dataType.size_gb} GB` },
          { label: 'Number of studies', value: studyCount.toLocaleString() }
        ]
        break
      }

      case 'documents': {
        const preset = cfg.presets?.find(p => p.label === inputs.preset)
        const fileCount = inputs.file_count || 1

        if (!preset) {
          error.value = 'Please select a document type'
          return
        }

        totalBytes = preset.size_mb * fileCount * 1024 * 1024

        breakdown.value = [
          { label: 'Document type', value: preset.label },
          { label: 'Size per file', value: `${preset.size_mb} MB` },
          { label: 'Number of files', value: fileCount.toLocaleString() }
        ]
        break
      }

      default:
        error.value = `Unknown storage calculator: ${calculatorId}`
        return
    }

    // Convert to TB (no rounding yet - that happens after safety multiplier)
    result.value = totalBytes / (1024 * 1024 * 1024 * 1024)

    breakdown.value.push({
      label: 'Total storage',
      value: formatBytes(totalBytes),
      highlight: true
    })
  }

  /**
   * Calculate CPU/SU requirements
   */
  function calculateCPU() {
    const cfg = config.value
    let totalSU = 0

    switch (calculatorId) {
      case 'genomics-pipelines': {
        const pipeline = cfg.pipelines?.find(p => p.label === inputs.pipeline)
        const sampleCount = inputs.sample_count || 1

        if (!pipeline) {
          error.value = 'Please select a pipeline'
          return
        }

        totalSU = pipeline.su_per_sample * sampleCount

        breakdown.value = [
          { label: 'Pipeline', value: pipeline.label },
          { label: 'SU per sample', value: pipeline.su_per_sample.toLocaleString() },
          { label: 'Number of samples', value: sampleCount.toLocaleString() }
        ]
        break
      }

      case 'simulations': {
        const pkg = cfg.packages?.find(p => p.label === inputs.package)

        if (!pkg) {
          error.value = 'Please select a simulation package'
          return
        }

        // Different packages have different metrics
        if (pkg.su_per_ns_per_million_atoms) {
          const ns = inputs.nanoseconds || 1
          const atoms = (inputs.atoms || 1000000) / 1000000
          totalSU = pkg.su_per_ns_per_million_atoms * ns * atoms

          breakdown.value = [
            { label: 'Package', value: pkg.label },
            { label: 'Simulation time', value: `${ns} ns` },
            { label: 'System size', value: `${inputs.atoms?.toLocaleString() || '1,000,000'} atoms` }
          ]
        } else if (pkg.su_per_hour_simulated) {
          const hours = inputs.sim_hours || 1
          totalSU = pkg.su_per_hour_simulated * hours

          breakdown.value = [
            { label: 'Package', value: pkg.label },
            { label: 'Simulation hours', value: hours.toString() }
          ]
        } else if (pkg.su_per_calculation) {
          const calcs = inputs.calculations || 1
          totalSU = pkg.su_per_calculation * calcs

          breakdown.value = [
            { label: 'Package', value: pkg.label },
            { label: 'Number of calculations', value: calcs.toLocaleString() }
          ]
        }
        break
      }

      case 'batch-processing': {
        const template = cfg.templates?.find(t => t.label === inputs.template)
        const fileCount = inputs.file_count || 1

        if (!template) {
          error.value = 'Please select a processing type'
          return
        }

        totalSU = template.su_per_file * fileCount

        breakdown.value = [
          { label: 'Processing type', value: template.label },
          { label: 'SU per file', value: template.su_per_file.toString() },
          { label: 'Number of files', value: fileCount.toLocaleString() }
        ]
        break
      }

      case 'statistics': {
        const workload = cfg.workloads?.find(w => w.label === inputs.workload)
        const runs = inputs.runs || 1

        if (!workload) {
          error.value = 'Please select a workload type'
          return
        }

        totalSU = workload.su_estimate * runs

        breakdown.value = [
          { label: 'Workload type', value: workload.label },
          { label: 'SU estimate', value: workload.su_estimate.toLocaleString() },
          { label: 'Number of runs', value: runs.toLocaleString() }
        ]
        break
      }

      default:
        error.value = `Unknown CPU calculator: ${calculatorId}`
        return
    }

    result.value = Math.ceil(totalSU)

    breakdown.value.push({
      label: 'Total SU',
      value: totalSU.toLocaleString(),
      highlight: true
    })
  }

  /**
   * Calculate GPU requirements
   */
  function calculateGPU() {
    const cfg = config.value
    let totalGPUHours = 0

    switch (calculatorId) {
      case 'ml-training': {
        const modelSize = cfg.model_sizes?.find(m => m.label === inputs.model_size)
        const runs = inputs.training_runs || 1

        if (!modelSize) {
          error.value = 'Please select a model size'
          return
        }

        totalGPUHours = modelSize.typical_hours * runs

        breakdown.value = [
          { label: 'Model size', value: modelSize.label },
          { label: 'Typical hours', value: modelSize.typical_hours.toLocaleString() },
          { label: 'Training runs', value: runs.toLocaleString() }
        ]
        break
      }

      case 'ml-inference': {
        const workload = cfg.workloads?.find(w => w.label === inputs.workload)

        if (!workload) {
          error.value = 'Please select a workload type'
          return
        }

        let itemCount = inputs.item_count || 1000

        if (workload.items_per_gpu_hour) {
          totalGPUHours = itemCount / workload.items_per_gpu_hour

          breakdown.value = [
            { label: 'Workload type', value: workload.label },
            { label: 'Items per GPU-hour', value: workload.items_per_gpu_hour.toLocaleString() },
            { label: 'Total items', value: itemCount.toLocaleString() }
          ]
        } else if (workload.tokens_per_gpu_hour) {
          totalGPUHours = itemCount / workload.tokens_per_gpu_hour

          breakdown.value = [
            { label: 'Workload type', value: workload.label },
            { label: 'Tokens per GPU-hour', value: workload.tokens_per_gpu_hour.toLocaleString() },
            { label: 'Total tokens', value: itemCount.toLocaleString() }
          ]
        }
        break
      }

      case 'gpu-simulation': {
        const pkg = cfg.packages?.find(p => p.label === inputs.package)
        const ns = inputs.nanoseconds || 1

        if (!pkg) {
          error.value = 'Please select a simulation package'
          return
        }

        totalGPUHours = pkg.gpu_hours_per_ns * ns

        breakdown.value = [
          { label: 'Package', value: pkg.label },
          { label: 'GPU-hours per ns', value: pkg.gpu_hours_per_ns.toString() },
          { label: 'Simulation time', value: `${ns} ns` }
        ]
        break
      }

      default:
        error.value = `Unknown GPU calculator: ${calculatorId}`
        return
    }

    // Round to 1 decimal place
    result.value = Math.ceil(totalGPUHours * 10) / 10

    breakdown.value.push({
      label: 'Total GPU-hours',
      value: formatNumber(result.value),
      highlight: true
    })
  }

  /**
   * Add current result to the slate
   * @param {string} serviceSlug - Optional service to add to (defaults to targetService)
   */
  function addToSlate(serviceSlug = null) {
    if (!result.value || result.value <= 0) {
      error.value = 'Calculate a result first'
      return false
    }

    const service = serviceSlug || targetService.value

    slateStore.addItem({
      service,
      quantity: result.value,
      unit: outputUnit.value.label,
      fromCalculator: calculatorId,
      calculatorInputs: { ...inputs }
    })

    return true
  }

  /**
   * Get a relatable comparison for the result
   * @returns {string|null} A human-friendly comparison
   */
  const relatableComparison = computed(() => {
    if (!result.value) return null

    switch (category.value) {
      case 'storage': {
        const tb = result.value
        if (tb < 0.001) {
          return `About ${Math.round(tb * 1024 * 1024)} small documents`
        } else if (tb < 0.1) {
          return `About ${Math.round(tb * 1024 * 1000)} photos`
        } else if (tb < 1) {
          return `About ${Math.round(tb * 200)} hours of HD video`
        } else if (tb < 10) {
          return `About ${Math.round(tb * 200)} hours of HD video or ${Math.round(tb * 3)} months of streaming`
        } else {
          return `About ${Math.round(tb / 0.7)} full human genome sequences`
        }
      }
      case 'cpu': {
        const su = result.value
        if (su < 100) {
          return `About ${Math.round(su / 4)} hours on a modern laptop`
        } else if (su < 1000) {
          return `About ${Math.round(su / 40)} days on a modern laptop`
        } else {
          return `Would take ${Math.round(su / 1000)} weeks on a laptop, but just ${Math.round(su / 100)} hours on HPC`
        }
      }
      case 'gpu': {
        const hours = result.value
        if (hours < 10) {
          return `About ${Math.round(hours * 10)} laptop-hours with a consumer GPU`
        } else if (hours < 100) {
          return `Would take ${Math.round(hours / 8)} days non-stop on a gaming GPU`
        } else {
          return `Serious compute - would take ${Math.round(hours / 24 / 7)} weeks on a single GPU`
        }
      }
      default:
        return null
    }
  })

  /**
   * Get display-formatted result (shows GB when < 1 TB for storage)
   */
  const displayResult = computed(() => {
    if (result.value === null) return { value: null, unit: '' }

    if (category.value === 'storage' && result.value < 1) {
      // Show as GB
      const gb = Math.round(result.value * 1024)
      return { value: gb, unit: 'GB' }
    }

    // Default: use standard formatting
    return { value: result.value, unit: outputUnit.value.label }
  })

  // Debounced auto-calculate on input changes
  const debouncedCalculate = debounce(() => {
    // Only auto-calculate if we have meaningful inputs
    const hasInputs = Object.keys(inputs).some(key => {
      const val = inputs[key]
      return val !== null && val !== undefined && val !== ''
    })

    if (hasInputs) {
      calculate()
    }
  }, 200)

  // Watch inputs for changes and auto-calculate
  watch(
    () => ({ ...inputs }),
    () => {
      debouncedCalculate()
    },
    { deep: true }
  )

  return {
    // Configuration
    config,
    category,
    globalSettings,

    // State
    inputs,
    result,
    breakdown,
    error,

    // Computed
    outputUnit,
    targetService,
    alternativeServices,
    relatableComparison,
    displayResult,

    // Methods
    resetInputs,
    applyPreset,
    calculate,
    addToSlate
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format storage value in TB, showing as GB when < 1 TB
 * @param {number} tb - Value in TB
 * @returns {string} Formatted string with unit
 */
function formatStorageValue(tb) {
  if (tb >= 1) {
    // Show as TB with 1 decimal place
    return `${tb.toFixed(1)} TB`
  } else {
    // Convert to GB and show as integer
    const gb = Math.round(tb * 1024)
    return `${gb} GB`
  }
}

/**
 * Format result value with appropriate unit based on category
 * @param {number} value - The result value
 * @param {string} category - Calculator category (storage, cpu, gpu)
 * @returns {string} Formatted string with unit
 */
function formatResultValue(value, category) {
  switch (category) {
    case 'storage':
      return formatStorageValue(value)
    case 'cpu':
      return `${Math.round(value).toLocaleString()} SU`
    case 'gpu':
      return `${formatNumber(value)} GPU-hours`
    default:
      return `${formatNumber(value)} units`
  }
}

/**
 * Format number with appropriate precision
 */
function formatNumber(num) {
  if (num >= 1000) {
    return num.toLocaleString()
  } else if (num >= 1) {
    return num.toFixed(1)
  } else {
    return num.toFixed(2)
  }
}
