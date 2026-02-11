<script setup>
import { ref, computed } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Cpu } from 'lucide-vue-next'

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
} = useCalculator('gpu-simulation')

const justAdded = ref(false)

// Initialize with defaults
inputs.package = null
inputs.nanoseconds = 100

function handleApplyPreset(preset) {
  inputs.package = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.package = null
  inputs.nanoseconds = 100
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from packages
const presets = computed(() => {
  return config.value?.packages?.map(p => ({
    label: p.label,
    description: `${p.gpu_hours_per_ns} GPU-hr/ns - ${p.speedup}`
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="GPU-Accelerated Simulation"
    description="Estimate GPU time for CUDA-accelerated scientific codes"
    category-label="GPU"
    :icon="Cpu"
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
        <!-- Package -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Simulation Package
          </label>
          <select
            v-model="inputs.package"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select package...</option>
            <option
              v-for="p in config?.packages || []"
              :key="p.label"
              :value="p.label"
            >
              {{ p.label }} ({{ p.speedup }})
            </option>
          </select>
          <p v-if="inputs.package" class="mt-1 text-xs text-gray-500">
            {{ config?.packages?.find(p => p.label === inputs.package)?.description }}
          </p>
        </div>

        <!-- Nanoseconds -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Simulation Time (nanoseconds)
          </label>
          <input
            v-model.number="inputs.nanoseconds"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
