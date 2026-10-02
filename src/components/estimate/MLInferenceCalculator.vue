<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Zap } from 'lucide-vue-next'

const emit = defineEmits(['added'])

// GPU-hours = item_count ÷ throughput, where throughput is the workload's
// items_per_gpu_hour or tokens_per_gpu_hour (calculators.yaml → ml-inference).
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
} = useCalculator('ml-inference')

const justAdded = ref(false)

// Initialize with defaults
inputs.workload = null
inputs.item_count = 100000

// Track if workload uses tokens or items. Only relabels the shared item_count
// input; useCalculator checks items_per_gpu_hour first, so a workload should
// define exactly one of the two rates.
const usesTokens = computed(() => {
  if (!inputs.workload || !config.value?.workloads) return false
  const workload = config.value.workloads.find(w => w.label === inputs.workload)
  return !!workload?.tokens_per_gpu_hour
})

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
  inputs.item_count = 100000
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from workloads. These carry only label + description, so
// applyPreset() copies nothing — a chip click just selects that option and recalcs.
const presets = computed(() => {
  return config.value?.workloads?.map(w => ({
    label: w.label,
    description: w.description
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="ML Inference"
    description="Estimate GPU time for running trained models on data"
    category-label="GPU"
    :icon="Zap"
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
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Workload Type
          </label>
          <select
            v-model="inputs.workload"
            class="w-full px-3 py-2 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
          <p v-if="inputs.workload" class="mt-1 text-xs text-text-muted">
            {{ config?.workloads?.find(w => w.label === inputs.workload)?.description }}
          </p>
        </div>

        <!-- Item/Token Count -->
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            {{ usesTokens ? 'Number of Tokens' : 'Number of Items' }}
          </label>
          <input
            v-model.number="inputs.item_count"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <p class="mt-1 text-xs text-text-muted">
            {{ usesTokens ? 'Total tokens to generate (input + output)' : 'Images, documents, or data points to process' }}
          </p>
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
