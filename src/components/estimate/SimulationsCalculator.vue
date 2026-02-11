<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { Atom } from 'lucide-vue-next'

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
} = useCalculator('simulations')

const justAdded = ref(false)

// Initialize with defaults
inputs.package = null
inputs.nanoseconds = 10
inputs.atoms = 1000000
inputs.sim_hours = 10
inputs.calculations = 100

// Track which input type is needed for the selected package
const inputType = computed(() => {
  if (!inputs.package || !config.value?.packages) return null
  const pkg = config.value.packages.find(p => p.label === inputs.package)
  if (pkg?.su_per_ns_per_million_atoms) return 'md'
  if (pkg?.su_per_hour_simulated) return 'cfd'
  if (pkg?.su_per_calculation) return 'qc'
  return null
})

function handleApplyPreset(preset) {
  inputs.package = preset.label
  applyPreset(preset)
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.package = null
  inputs.nanoseconds = 10
  inputs.atoms = 1000000
  inputs.sim_hours = 10
  inputs.calculations = 100
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from packages
const presets = computed(() => {
  return config.value?.packages?.map(p => ({
    label: p.label,
    description: p.description
  })) || []
})
</script>

<template>
  <BaseCalculator
    title="Scientific Simulations"
    description="Estimate compute for GROMACS, LAMMPS, OpenFOAM, ANSYS"
    category-label="Compute"
    :icon="Atom"
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
        <!-- Package -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Simulation Package
          </label>
          <select
            v-model="inputs.package"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select package...</option>
            <option
              v-for="p in config?.packages || []"
              :key="p.label"
              :value="p.label"
            >
              {{ p.label }}
            </option>
          </select>
          <p v-if="inputs.package" class="mt-1 text-xs text-gray-500">
            {{ config?.packages?.find(p => p.label === inputs.package)?.description }}
          </p>
        </div>

        <!-- MD-specific inputs -->
        <template v-if="inputType === 'md'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Simulation Time (nanoseconds)
            </label>
            <input
              v-model.number="inputs.nanoseconds"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              System Size (atoms)
            </label>
            <input
              v-model.number="inputs.atoms"
              type="number"
              min="1000"
              step="1000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </template>

        <!-- CFD-specific inputs -->
        <template v-if="inputType === 'cfd'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Simulated Hours
            </label>
            <input
              v-model.number="inputs.sim_hours"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </template>

        <!-- QC-specific inputs -->
        <template v-if="inputType === 'qc'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Number of Calculations
            </label>
            <input
              v-model.number="inputs.calculations"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </template>

        <!-- Prompt to select package first -->
        <div v-if="!inputs.package" class="text-sm text-gray-500 italic">
          Select a simulation package to see specific parameters.
        </div>
      </div>
    </template>
  </BaseCalculator>
</template>
