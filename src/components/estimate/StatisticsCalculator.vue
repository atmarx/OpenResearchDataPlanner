<script setup>
import { ref, computed } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { BarChart } from 'lucide-vue-next'

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
} = useCalculator('statistics')

const justAdded = ref(false)

// Initialize with defaults
inputs.workload = null
inputs.runs = 10

function handleApplyPreset(preset) {
  inputs.workload = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.workload = null
  inputs.runs = 10
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from workloads
const presets = computed(() => {
  return config.value?.workloads?.map(w => ({
    label: w.label,
    description: `~${w.su_estimate} SU - ${w.description}`
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="Statistical Analysis"
    description="Estimate compute for R, Stata, SAS, SPSS"
    category-label="Compute"
    :icon="BarChart"
    :presets="presets"
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
      <div class="space-y-4">
        <!-- Workload Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Workload Type
          </label>
          <select
            v-model="inputs.workload"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select workload type...</option>
            <option
              v-for="w in config?.workloads || []"
              :key="w.label"
              :value="w.label"
            >
              {{ w.label }}
            </option>
          </select>
          <p v-if="inputs.workload" class="mt-1 text-xs text-gray-500">
            {{ config?.workloads?.find(w => w.label === inputs.workload)?.description }}
          </p>
        </div>

        <!-- Number of Runs -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Number of Runs/Models
          </label>
          <input
            v-model.number="inputs.runs"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p class="mt-1 text-xs text-gray-500">
            How many separate analyses or model fits?
          </p>
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
