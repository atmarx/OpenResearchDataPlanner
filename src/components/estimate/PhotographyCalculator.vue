<script setup>
import { ref } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Camera } from 'lucide-vue-next'

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
} = useCalculator('photography')

const justAdded = ref(false)

// Initialize with defaults
inputs.size_mb = 10
inputs.file_count = 1000

function handleApplyPreset(preset) {
  inputs.size_mb = preset.size_mb
  calculate()
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.size_mb = 10
  inputs.file_count = 1000
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
    title="Photography/Fieldwork"
    description="Estimate storage for field photos, specimen imaging, documentation"
    category-label="Storage"
    :icon="Camera"
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
      <div class="space-y-4">
        <!-- Average file size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Average File Size (MB)
          </label>
          <input
            v-model.number="inputs.size_mb"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- File count -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Number of Files
          </label>
          <input
            v-model.number="inputs.file_count"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
