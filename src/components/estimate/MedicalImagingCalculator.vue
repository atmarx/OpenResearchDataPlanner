<script setup>
import { ref, computed } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Scan } from 'lucide-vue-next'

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
} = useCalculator('medical-imaging')

const justAdded = ref(false)

// Initialize with defaults
inputs.data_type = null
inputs.study_count = 50

function handleApplyPreset(preset) {
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
  inputs.study_count = 50
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
    description: `${dt.size_gb} GB/study - ${dt.description}`
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="Medical Imaging"
    description="Estimate storage for CT, MRI, PET, X-ray, Ultrasound"
    category-label="Storage"
    :icon="Scan"
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
        <!-- Imaging Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Imaging Type
          </label>
          <select
            v-model="inputs.data_type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select imaging type...</option>
            <option
              v-for="dt in config?.data_types || []"
              :key="dt.label"
              :value="dt.label"
            >
              {{ dt.label }} ({{ dt.size_gb }} GB/study)
            </option>
          </select>
          <p v-if="inputs.data_type" class="mt-1 text-xs text-gray-500">
            {{ config?.data_types?.find(d => d.label === inputs.data_type)?.description }}
          </p>
        </div>

        <!-- Study Count -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Number of Studies/Scans
          </label>
          <input
            v-model.number="inputs.study_count"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
