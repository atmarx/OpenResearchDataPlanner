<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Dna } from 'lucide-vue-next'

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
} = useCalculator('genomics')

const justAdded = ref(false)

// Initialize with defaults
inputs.data_type = null
inputs.sample_count = 10

function handleApplyPreset(preset) {
  // For genomics, presets are data types
  inputs.data_type = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.data_type = null
  inputs.sample_count = 10
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from data types
const presets = computed(() => {
  return config.value?.data_types?.map(dt => ({
    label: dt.label,
    description: `${dt.size_gb} GB/sample - ${dt.description}`
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="Genomics Data"
    description="Estimate storage for sequencing reads, alignments, and variants"
    category-label="Storage"
    :icon="Dna"
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
        <!-- Data Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Data Type
          </label>
          <select
            v-model="inputs.data_type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select data type...</option>
            <option
              v-for="dt in config?.data_types || []"
              :key="dt.label"
              :value="dt.label"
            >
              {{ dt.label }} ({{ dt.size_gb }} GB/sample)
            </option>
          </select>
          <p v-if="inputs.data_type" class="mt-1 text-xs text-gray-500">
            {{ config?.data_types?.find(d => d.label === inputs.data_type)?.description }}
          </p>
        </div>

        <!-- Sample Count -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Number of Samples
          </label>
          <input
            v-model.number="inputs.sample_count"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
