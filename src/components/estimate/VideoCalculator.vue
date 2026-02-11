<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Video } from 'lucide-vue-next'

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
} = useCalculator('video')

const justAdded = ref(false)

// Initialize with defaults
inputs.preset = null
inputs.hours = 10

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
  inputs.hours = 10
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
    title="Video Recording"
    description="Estimate storage for behavioral studies, time-lapse, or lectures"
    category-label="Storage"
    :icon="Video"
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
        <!-- Video Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Video Type
          </label>
          <select
            v-model="inputs.preset"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select video type...</option>
            <option
              v-for="preset in config?.presets || []"
              :key="preset.label"
              :value="preset.label"
            >
              {{ preset.label }} ({{ preset.gb_per_hour }} GB/hour)
            </option>
          </select>
          <p v-if="inputs.preset" class="mt-1 text-xs text-gray-500">
            {{ config?.presets?.find(p => p.label === inputs.preset)?.description }}
          </p>
        </div>

        <!-- Hours -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Hours of Video
          </label>
          <input
            v-model.number="inputs.hours"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
