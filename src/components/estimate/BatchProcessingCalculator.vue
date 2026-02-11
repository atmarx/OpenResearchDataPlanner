<script setup>
import { ref, computed } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Layers } from 'lucide-vue-next'

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
} = useCalculator('batch-processing')

const justAdded = ref(false)

// Initialize with defaults
inputs.template = null
inputs.file_count = 1000

function handleApplyPreset(preset) {
  inputs.template = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.template = null
  inputs.file_count = 1000
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from templates
const presets = computed(() => {
  return config.value?.templates?.map(t => ({
    label: t.label,
    description: `${t.su_per_file} SU/file - ${t.description}`
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="General Batch Processing"
    description="Estimate compute for custom scripts, image processing, data conversion"
    category-label="Compute"
    :icon="Layers"
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
        <!-- Processing Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Processing Type
          </label>
          <select
            v-model="inputs.template"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select processing type...</option>
            <option
              v-for="t in config?.templates || []"
              :key="t.label"
              :value="t.label"
            >
              {{ t.label }} ({{ t.su_per_file }} SU/file)
            </option>
          </select>
          <p v-if="inputs.template" class="mt-1 text-xs text-gray-500">
            {{ config?.templates?.find(t => t.label === inputs.template)?.description }}
          </p>
        </div>

        <!-- File Count -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Number of Files to Process
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
