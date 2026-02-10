<script setup>
import { ref, computed, watch } from 'vue'
import { useSessionStore } from '@/stores/sessionStore'
import { Calendar, Info } from 'lucide-vue-next'

const sessionStore = useSessionStore()

// Quick presets - numeric order with 3-year as recommended
const presets = [
  { label: '1 year', months: 12, recommended: false },
  { label: '2 years', months: 24, recommended: false },
  { label: '3 years', months: 36, recommended: true },
  { label: '5 years', months: 60, recommended: false },
  { label: 'Custom', months: null, recommended: false }
]

// Track which preset is selected (null = custom or none)
const selectedPreset = ref(null)

// Local state for inputs
const startDate = ref(sessionStore.session.grant_period.start_date || getTodayString())
const endDate = ref(sessionStore.session.grant_period.end_date || '')

// Get today's date as YYYY-MM-DD string
function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

// Calculate end date from start date and months
function calculateEndDate(start, months) {
  const startDt = new Date(start)
  const endDt = new Date(startDt)
  endDt.setMonth(endDt.getMonth() + months)
  // Keep the same day of month (handles month-end edge cases automatically)
  return endDt.toISOString().split('T')[0]
}

// Calculate months between dates
const calculatedMonths = computed(() => {
  if (!startDate.value || !endDate.value) return null

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  if (end <= start) return null

  const months = (end.getFullYear() - start.getFullYear()) * 12 +
                 (end.getMonth() - start.getMonth())
  return Math.max(1, months)
})

const years = computed(() => {
  if (!calculatedMonths.value) return null
  return (calculatedMonths.value / 12).toFixed(1)
})

// Validation
const isValid = computed(() => {
  return startDate.value && endDate.value && calculatedMonths.value > 0
})

const errorMessage = computed(() => {
  if (!startDate.value || !endDate.value) return null
  if (calculatedMonths.value === null || calculatedMonths.value <= 0) {
    return 'End date must be after start date'
  }
  return null
})

// Is custom mode (end date is editable)
const isCustom = computed(() => selectedPreset.value === null || selectedPreset.value === 'custom')

// Sync to store on change
watch([startDate, endDate], () => {
  if (isValid.value) {
    sessionStore.setGrantPeriod(startDate.value, endDate.value)
  }
})

// When start date changes and a preset is selected, auto-update end date
watch(startDate, (newStart) => {
  if (selectedPreset.value && selectedPreset.value !== 'custom' && newStart) {
    const preset = presets.find(p => p.months === selectedPreset.value)
    if (preset && preset.months) {
      endDate.value = calculateEndDate(newStart, preset.months)
    }
  }
})

// Apply a preset
function applyPreset(preset) {
  if (preset.months === null) {
    // Custom mode
    selectedPreset.value = 'custom'
    // Keep current start date, clear end date for manual entry
    if (!startDate.value) {
      startDate.value = getTodayString()
    }
  } else {
    selectedPreset.value = preset.months
    // Set start to today if not already set
    if (!startDate.value) {
      startDate.value = getTodayString()
    }
    // Calculate end date
    endDate.value = calculateEndDate(startDate.value, preset.months)
  }
}

// Check if a preset is currently selected
function isPresetSelected(preset) {
  if (preset.months === null) {
    return selectedPreset.value === 'custom'
  }
  return selectedPreset.value === preset.months
}
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        Grant Period
      </h2>
      <p class="text-gray-600">
        Select your grant duration and start date.
        This is used to calculate total costs over the project duration.
      </p>
    </div>

    <!-- Duration presets -->
    <div class="mb-6">
      <p class="text-sm font-medium text-gray-700 mb-2">Grant duration:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="applyPreset(preset)"
          class="px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          :class="[
            isPresetSelected(preset)
              ? 'bg-blue-600 text-white'
              : preset.recommended
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ preset.label }}
          <span v-if="preset.recommended && !isPresetSelected(preset)" class="ml-1 text-xs">(typical)</span>
        </button>
      </div>
    </div>

    <!-- Date inputs -->
    <div class="grid gap-6 md:grid-cols-2 mb-6">
      <div>
        <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <div class="relative">
          <input
            id="start-date"
            v-model="startDate"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <Calendar class="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">
          End Date
          <span v-if="!isCustom" class="text-gray-400 font-normal">(auto-calculated)</span>
        </label>
        <div class="relative">
          <input
            id="end-date"
            v-model="endDate"
            type="date"
            :min="startDate"
            :disabled="!isCustom"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
          <Calendar class="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="errorMessage" class="text-sm text-red-600 mb-4">
      {{ errorMessage }}
    </p>

    <!-- Duration summary -->
    <div
      v-if="calculatedMonths"
      class="bg-blue-50 rounded-lg p-4"
    >
      <div class="flex items-center gap-2 text-blue-900">
        <Info class="w-5 h-5 text-blue-500" />
        <span class="font-medium">Grant Duration:</span>
        <span>{{ calculatedMonths }} months ({{ years }} years)</span>
      </div>
      <p class="text-sm text-blue-700 mt-2">
        Cost estimates will be calculated for this {{ calculatedMonths }}-month period.
      </p>
    </div>

    <!-- Placeholder when no dates selected -->
    <div
      v-else
      class="bg-gray-50 rounded-lg p-4 text-center text-gray-500"
    >
      Select a duration above or enter custom dates
    </div>
  </div>
</template>
