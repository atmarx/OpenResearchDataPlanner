<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import BaseCalculator from './BaseCalculator.vue'
import { MessageSquareText, Info, AlertTriangle } from 'lucide-vue-next'

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
} = useCalculator('llm-api-costs')

const justAdded = ref(false)

// Initialize with defaults
inputs.model = null
inputs.use_case = null
inputs.input_tokens = 1000
inputs.output_tokens = 500
inputs.requests_per_day = 10
inputs.time_period = 'Monthly'
inputs.custom_days = 365

// Selected model details
const selectedModel = computed(() => {
  if (!inputs.model || !config.value?.models) return null
  return config.value.models.find(m => m.label === inputs.model)
})

// Selected use case
const selectedUseCase = computed(() => {
  if (!inputs.use_case || !config.value?.use_cases) return null
  return config.value.use_cases.find(u => u.label === inputs.use_case)
})

// Time period multiplier
const timePeriodMultiplier = computed(() => {
  if (!inputs.time_period || !config.value?.time_periods) return 1
  const period = config.value.time_periods.find(p => p.label === inputs.time_period)
  if (!period) return 1
  if (period.multiplier === 0) return inputs.custom_days || 365
  return period.multiplier
})

// Is custom time period
const isCustomPeriod = computed(() => {
  const period = config.value?.time_periods?.find(p => p.label === inputs.time_period)
  return period?.multiplier === 0
})

// Group models by provider
const modelsByProvider = computed(() => {
  if (!config.value?.models) return {}
  return config.value.models.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = []
    acc[model.provider].push(model)
    return acc
  }, {})
})

// When use case changes, update token estimates
watch(() => inputs.use_case, (newUseCase) => {
  const useCase = config.value?.use_cases?.find(u => u.label === newUseCase)
  if (useCase && useCase.avg_input_tokens > 0) {
    inputs.input_tokens = useCase.avg_input_tokens
    inputs.output_tokens = useCase.avg_output_tokens
  }
})

function handleApplyPreset(preset) {
  const useCase = config.value?.use_cases?.find(u => u.label === preset.label)
  if (useCase) {
    inputs.use_case = useCase.label
    if (useCase.avg_input_tokens > 0) {
      inputs.input_tokens = useCase.avg_input_tokens
      inputs.output_tokens = useCase.avg_output_tokens
    }
  }
  justAdded.value = false
}

function handleCalculate() {
  calculate()
  justAdded.value = false
}

function handleReset() {
  resetInputs()
  inputs.model = null
  inputs.use_case = null
  inputs.input_tokens = 1000
  inputs.output_tokens = 500
  inputs.requests_per_day = 10
  inputs.time_period = 'Monthly'
  inputs.custom_days = 365
  justAdded.value = false
}

function handleAddToSlate() {
  if (addToSlate()) {
    justAdded.value = true
    emit('added')
  }
}

// Create presets from use cases
const presets = computed(() => {
  return config.value?.use_cases?.filter(u => u.avg_input_tokens > 0).map(u => ({
    label: u.label,
    description: u.description
  })) || []
})

// Format currency
function formatCurrency(amount) {
  if (amount < 0.01) return `$${amount.toFixed(4)}`
  if (amount < 1) return `$${amount.toFixed(3)}`
  if (amount < 100) return `$${amount.toFixed(2)}`
  return `$${Math.round(amount).toLocaleString()}`
}
</script>

<template>
  <BaseCalculator
    title="LLM API Costs"
    description="Estimate costs for commercial LLM APIs for grant budgeting"
    category-label="API"
    :icon="MessageSquareText"
    :presets="presets"
    :result="result"
    result-unit="$"
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
        <!-- Model Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            LLM Model
          </label>
          <select
            v-model="inputs.model"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select a model...</option>
            <optgroup v-for="(models, provider) in modelsByProvider" :key="provider" :label="provider">
              <option v-for="model in models" :key="model.label" :value="model.label">
                {{ model.label }}
              </option>
            </optgroup>
          </select>
          <div v-if="selectedModel" class="mt-2 p-2 bg-gray-50 rounded-lg text-xs">
            <p class="text-gray-600">{{ selectedModel.description }}</p>
            <div class="flex gap-4 mt-1 text-gray-500">
              <span>Input: ${{ selectedModel.input_per_million }}/M tokens</span>
              <span>Output: ${{ selectedModel.output_per_million }}/M tokens</span>
            </div>
          </div>
        </div>

        <!-- Use Case -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Use Case
          </label>
          <select
            v-model="inputs.use_case"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null" disabled>Select a use case...</option>
            <option v-for="uc in config?.use_cases || []" :key="uc.label" :value="uc.label">
              {{ uc.label }}
            </option>
          </select>
          <p v-if="selectedUseCase" class="mt-1 text-xs text-gray-500">
            {{ selectedUseCase.description }}
          </p>
        </div>

        <!-- Token Estimates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Input Tokens (per request)
            </label>
            <input
              v-model.number="inputs.input_tokens"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Output Tokens (per request)
            </label>
            <input
              v-model.number="inputs.output_tokens"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Volume -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Requests per Day
            </label>
            <input
              v-model.number="inputs.requests_per_day"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              v-model="inputs.time_period"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="tp in config?.time_periods || []" :key="tp.label" :value="tp.label">
                {{ tp.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Custom Grant Period -->
        <div v-if="isCustomPeriod">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Grant Period (days)
          </label>
          <input
            v-model.number="inputs.custom_days"
            type="number"
            min="1"
            placeholder="e.g., 365 for 1 year, 1095 for 3 years"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p class="mt-1 text-xs text-gray-500">
            Common: 365 (1 year), 730 (2 years), 1095 (3 years), 1825 (5 years)
          </p>
        </div>

        <!-- Tips -->
        <div v-if="config?.tips" class="bg-blue-50 rounded-lg p-3 text-sm">
          <div class="flex items-start gap-2">
            <Info class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-blue-800 mb-1">Estimation Tips</p>
              <ul class="text-blue-700 text-xs space-y-0.5">
                <li v-for="tip in config.tips.slice(0, 3)" :key="tip">{{ tip }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Pricing Warning -->
        <div class="bg-yellow-50 rounded-lg p-3 text-sm">
          <div class="flex items-start gap-2">
            <AlertTriangle class="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p class="text-yellow-700 text-xs">
              <strong>Note:</strong> API pricing changes frequently. Verify current prices
              with providers before finalizing grant budgets. Prices shown are estimates
              as of February 2026.
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Custom result display for currency -->
    <template #result-display="{ result: r }">
      <div class="text-center">
        <p class="text-3xl font-bold text-green-600">
          {{ formatCurrency(r) }}
        </p>
        <p class="text-sm text-gray-500 mt-1">
          Estimated {{ inputs.time_period?.toLowerCase() || 'total' }} cost
        </p>
      </div>
    </template>
  </BaseCalculator>
</template>
