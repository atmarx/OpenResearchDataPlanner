<script setup>
import { ref } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { FileText } from 'lucide-vue-next'

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
} = useCalculator('documents')

const justAdded = ref(false)

// Initialize with defaults
inputs.preset = null
inputs.file_count = 1000

function handleApplyPreset(preset) {
  inputs.preset = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.preset = null
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
    title="Documents & PDFs"
    description="Estimate storage for papers, reports, text documents"
    category-label="Storage"
    :icon="FileText"
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
        <!-- Document Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Document Type
          </label>
          <select
            v-model="inputs.preset"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select document type...</option>
            <option
              v-for="preset in config?.presets || []"
              :key="preset.label"
              :value="preset.label"
            >
              {{ preset.label }} ({{ preset.size_mb }} MB avg)
            </option>
          </select>
          <p v-if="inputs.preset" class="mt-1 text-xs text-gray-500">
            {{ config?.presets?.find(p => p.label === inputs.preset)?.description }}
          </p>
        </div>

        <!-- File Count -->
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
