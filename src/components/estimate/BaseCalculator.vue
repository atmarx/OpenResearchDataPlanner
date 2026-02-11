<script setup>
import { ref, computed } from 'vue'
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Calculator,
  RefreshCw,
  AlertCircle
} from 'lucide-vue-next'

const props = defineProps({
  /**
   * Calculator title
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Calculator description
   */
  description: {
    type: String,
    default: ''
  },

  /**
   * Icon component to display
   */
  icon: {
    type: [Object, Function],
    default: null
  },

  /**
   * Category label (Storage, Compute, GPU)
   */
  categoryLabel: {
    type: String,
    default: ''
  },

  /**
   * Presets array: [{ label, description, ...values }]
   */
  presets: {
    type: Array,
    default: () => []
  },

  /**
   * Current result value
   */
  result: {
    type: Number,
    default: null
  },

  /**
   * Unit for result (TB, SU, GPU-hours)
   */
  resultUnit: {
    type: String,
    default: 'units'
  },

  /**
   * Calculation breakdown: [{ label, value, highlight? }]
   */
  breakdown: {
    type: Array,
    default: () => []
  },

  /**
   * Error message if any
   */
  error: {
    type: String,
    default: null
  },

  /**
   * Relatable comparison text
   */
  comparison: {
    type: String,
    default: null
  },

  /**
   * Whether the result was just added to slate
   */
  justAdded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['applyPreset', 'calculate', 'addToSlate', 'reset'])

const showBreakdown = ref(false)
const showComparison = ref(false)

/**
 * Check if this is a storage calculator showing sub-TB values
 */
const showAsGB = computed(() => {
  return props.categoryLabel === 'Storage' && props.result !== null && props.result < 1
})

/**
 * Format result for display
 */
const formattedResult = computed(() => {
  if (props.result === null) return '—'

  // For storage < 1 TB, show as GB
  if (showAsGB.value) {
    const gb = Math.round(props.result * 1024)
    return gb.toLocaleString()
  }

  if (props.result >= 1000) {
    return props.result.toLocaleString()
  } else if (props.result >= 1) {
    return props.result.toFixed(1)
  } else {
    return props.result.toFixed(2)
  }
})

/**
 * Get the display unit (GB for small storage, otherwise original)
 */
const displayUnit = computed(() => {
  if (showAsGB.value) {
    return 'GB'
  }
  return props.resultUnit
})

/**
 * Handle preset click
 */
function handlePresetClick(preset) {
  emit('applyPreset', preset)
}

/**
 * Handle calculate button
 */
function handleCalculate() {
  emit('calculate')
}

/**
 * Handle add to slate button
 */
function handleAddToSlate() {
  emit('addToSlate')
}

/**
 * Handle reset button
 */
function handleReset() {
  emit('reset')
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
      <div class="flex items-center gap-3">
        <div
          v-if="icon"
          class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"
        >
          <component :is="icon" class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <span
              v-if="categoryLabel"
              class="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600"
            >
              {{ categoryLabel }}
            </span>
          </div>
          <p v-if="description" class="text-sm text-gray-500">{{ description }}</p>
        </div>
      </div>
    </div>

    <!-- Presets -->
    <div v-if="presets.length > 0" class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Quick Presets
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="handlePresetClick(preset)"
          class="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          :title="preset.description"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Input Section (slot) -->
    <div class="px-6 py-5">
      <slot name="inputs">
        <p class="text-gray-500 text-sm">Configure your inputs above to estimate requirements.</p>
      </slot>
    </div>

    <!-- Calculate Button -->
    <div class="px-6 py-3 border-t border-gray-100 bg-gray-50">
      <div class="flex items-center gap-3">
        <button
          @click="handleCalculate"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calculator class="w-4 h-4" />
          Calculate
        </button>
        <button
          @click="handleReset"
          class="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          title="Reset to defaults"
        >
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Result Section -->
    <div
      v-if="result !== null || error"
      class="px-6 py-5 border-t border-gray-200"
      :class="error ? 'bg-red-50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'"
    >
      <!-- Error Display -->
      <div v-if="error" class="flex items-start gap-3 text-red-700">
        <AlertCircle class="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p>{{ error }}</p>
      </div>

      <!-- Result Display -->
      <div v-else>
        <div class="text-center mb-4">
          <div class="text-4xl font-bold text-gray-900">
            {{ formattedResult }}
            <span class="text-xl font-normal text-gray-500">{{ displayUnit }}</span>
          </div>

          <!-- Relatable comparison (hidden by default) -->
          <div v-if="comparison" class="mt-3">
            <button
              v-if="!showComparison"
              @click="showComparison = true"
              class="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Put this in perspective
            </button>
            <p
              v-else
              class="text-sm text-gray-600 italic bg-gray-100 rounded-lg px-3 py-2 inline-block"
            >
              {{ comparison }}
            </p>
          </div>
        </div>

        <!-- Breakdown Toggle -->
        <div v-if="breakdown.length > 0" class="mt-4">
          <button
            @click="showBreakdown = !showBreakdown"
            class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <component :is="showBreakdown ? ChevronUp : ChevronDown" class="w-4 h-4" />
            {{ showBreakdown ? 'Hide' : 'Show' }} calculation
          </button>

          <div
            v-if="showBreakdown"
            class="mt-3 bg-white rounded-lg border border-gray-200 divide-y divide-gray-100"
          >
            <div
              v-for="(item, index) in breakdown"
              :key="index"
              class="flex justify-between px-4 py-2 text-sm"
              :class="item.highlight ? 'font-semibold bg-blue-50' : ''"
            >
              <span class="text-gray-600">{{ item.label }}</span>
              <span class="text-gray-900">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Add to Slate Button -->
        <div class="mt-6 flex justify-center">
          <button
            v-if="!justAdded"
            @click="handleAddToSlate"
            class="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus class="w-5 h-5" />
            Add to Slate
          </button>
          <div
            v-else
            class="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium"
          >
            <Check class="w-5 h-5" />
            Added to Slate!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
