<script setup>
import { ref, computed } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Brain } from 'lucide-vue-next'

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
} = useCalculator('ml-training')

const justAdded = ref(false)

// Initialize with defaults
inputs.model_size = null
inputs.training_runs = 5

function handleApplyPreset(preset) {
  inputs.model_size = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.model_size = null
  inputs.training_runs = 5
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from model sizes
const presets = computed(() => {
  return config.value?.model_sizes?.map(m => ({
    label: m.label,
    description: `~${m.typical_hours} GPU-hours - ${m.description}`
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="ML Training"
    description="Estimate GPU time for deep learning model training"
    category-label="GPU"
    :icon="Brain"
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
        <!-- Model Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Model Size
          </label>
          <select
            v-model="inputs.model_size"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select model size...</option>
            <option
              v-for="m in config?.model_sizes || []"
              :key="m.label"
              :value="m.label"
            >
              {{ m.label }}
            </option>
          </select>
          <p v-if="inputs.model_size" class="mt-1 text-xs text-gray-500">
            {{ config?.model_sizes?.find(m => m.label === inputs.model_size)?.description }}
          </p>
        </div>

        <!-- Training Runs -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Number of Training Runs
          </label>
          <input
            v-model.number="inputs.training_runs"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p class="mt-1 text-xs text-gray-500">
            Include hyperparameter tuning experiments
          </p>
        </div>

        <!-- Factors hint -->
        <div v-if="config?.factors" class="bg-gray-50 rounded-lg p-3 text-sm">
          <p class="font-medium text-gray-700 mb-1">Factors that affect GPU time:</p>
          <ul class="text-gray-600 text-xs space-y-0.5">
            <li v-for="factor in config.factors" :key="factor">• {{ factor }}</li>
          </ul>
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
