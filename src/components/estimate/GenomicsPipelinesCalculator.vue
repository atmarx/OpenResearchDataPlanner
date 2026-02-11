<script setup>
import { ref, computed } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Workflow } from 'lucide-vue-next'

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
} = useCalculator('genomics-pipelines')

const justAdded = ref(false)

// Initialize with defaults
inputs.pipeline = null
inputs.sample_count = 10

function handleApplyPreset(preset) {
  inputs.pipeline = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.pipeline = null
  inputs.sample_count = 10
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from pipelines
const presets = computed(() => {
  return config.value?.pipelines?.map(p => ({
    label: p.label,
    description: `${p.su_per_sample} SU/sample - ${p.description}`
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="Genomics Pipelines"
    description="Estimate compute for alignment, variant calling, RNA-seq"
    category-label="Compute"
    :icon="Workflow"
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
        <!-- Pipeline -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Pipeline
          </label>
          <select
            v-model="inputs.pipeline"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select pipeline...</option>
            <option
              v-for="p in config?.pipelines || []"
              :key="p.label"
              :value="p.label"
            >
              {{ p.label }} ({{ p.su_per_sample }} SU/sample)
            </option>
          </select>
          <p v-if="inputs.pipeline" class="mt-1 text-xs text-gray-500">
            {{ config?.pipelines?.find(p => p.label === inputs.pipeline)?.description }}
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
