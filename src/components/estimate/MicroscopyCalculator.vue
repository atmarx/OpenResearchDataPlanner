<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Microscope } from 'lucide-vue-next'

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
} = useCalculator('microscopy')

const justAdded = ref(false)

// Initialize with defaults
if (config.value) {
  inputs.resolution = config.value.default_resolution || '4k'
  inputs.bit_depth = config.value.default_bit_depth || 16
  inputs.channels = 1
  inputs.z_slices = 1
  inputs.image_count = 100
}

// Watch for config to load
watch(() => config.value, (newConfig) => {
  if (newConfig && !inputs.resolution) {
    inputs.resolution = newConfig.default_resolution || '4k'
    inputs.bit_depth = newConfig.default_bit_depth || 16
  }
}, { immediate: true })

function handleApplyPreset(preset) {
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  if (config.value) {
    inputs.resolution = config.value.default_resolution || '4k'
    inputs.bit_depth = config.value.default_bit_depth || 16
    inputs.channels = 1
    inputs.z_slices = 1
    inputs.image_count = 100
  }
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
    title="Microscopy Images"
    description="Estimate storage for confocal, fluorescence, or electron microscopy"
    category-label="Storage"
    :icon="Microscope"
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
        <!-- Resolution -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Resolution
          </label>
          <select
            v-model="inputs.resolution"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option
              v-for="res in config?.resolutions || []"
              :key="res.key"
              :value="res.key"
            >
              {{ res.label }}
            </option>
          </select>
        </div>

        <!-- Bit Depth -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Bit Depth
          </label>
          <select
            v-model="inputs.bit_depth"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option
              v-for="bd in config?.bit_depths || []"
              :key="bd.value"
              :value="bd.value"
            >
              {{ bd.label }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <!-- Channels -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Channels
            </label>
            <input
              v-model.number="inputs.channels"
              type="number"
              min="1"
              max="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Z-Slices -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Z-Slices
            </label>
            <input
              v-model.number="inputs.z_slices"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Image Count -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <input
              v-model.number="inputs.image_count"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
