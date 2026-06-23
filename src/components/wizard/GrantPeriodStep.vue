<script setup>
import { ref, computed, watch } from 'vue'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { Calendar, Info } from 'lucide-vue-next'

const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

const presets = [
  { label: '1 year', months: 12 },
  { label: '2 years', months: 24 },
  { label: '3 years', months: 36 },
  { label: '5 years', months: 60 },
  { label: 'Custom', months: null }
]

// Track which preset is selected (null = custom or none)
const selectedPreset = ref(null)

// Local state for inputs
const startDate = ref(sessionStore.session.grant_period.start_date || '')
const endDate = ref(sessionStore.session.grant_period.end_date || '')

// True when user has explicitly skipped dates (or has never entered any)
const noDates = computed(() => !startDate.value && !endDate.value && selectedPreset.value === null)

function clearDates() {
  startDate.value = ''
  endDate.value = ''
  selectedPreset.value = null
  sessionStore.setGrantPeriod(null, null)
}

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
      <h2 class="text-2xl font-bold mb-2 text-text">
        Grant Period
      </h2>
      <p class="text-text-secondary">
        Select your grant duration and start date.
        This is used to calculate total costs over the project duration.
      </p>
    </div>

    <!-- Duration presets -->
    <div class="mb-6">
      <p class="text-sm font-medium mb-2 text-text-secondary">Grant duration:</p>
      <div class="flex flex-wrap gap-2">
        <button
          @click="clearDates"
          class="px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          :class="[
            noDates
              ? 'bg-primary text-on-primary'
              : 'bg-surface-alt text-text-secondary hover:bg-border-strong'
          ]"
        >
          No dates yet
        </button>

        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="applyPreset(preset)"
          class="px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          :class="[
            isPresetSelected(preset)
              ? 'bg-primary text-on-primary'
              : 'bg-surface-alt text-text-secondary hover:bg-border-strong'
          ]"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Date inputs (hidden when "No dates yet" is selected) -->
    <div v-if="!noDates" class="grid gap-6 md:grid-cols-2 mb-6">
      <div>
        <label
          for="start-date"
          class="block text-sm font-medium mb-1 text-text-secondary"
        >
          Start Date
        </label>
        <div class="relative">
          <input
            id="start-date"
            v-model="startDate"
            type="date"
            class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface border-border-strong text-text"
          />
          <Calendar class="absolute right-3 top-2.5 w-5 h-5 text-text-muted pointer-events-none" />
        </div>
      </div>

      <div v-if="isCustom">
        <label
          for="end-date"
          class="block text-sm font-medium mb-1 text-text-secondary"
        >
          End Date
        </label>
        <div class="relative">
          <input
            id="end-date"
            v-model="endDate"
            type="date"
            :min="startDate"
            class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface border-border-strong text-text"
          />
          <Calendar class="absolute right-3 top-2.5 w-5 h-5 text-text-muted pointer-events-none" />
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
      class="rounded-lg p-4"
      :class="preferencesStore.darkMode ? 'bg-blue-900/30' : 'bg-blue-50'"
    >
      <div
        class="flex items-center gap-2"
        :class="preferencesStore.darkMode ? 'text-blue-200' : 'text-blue-900'"
      >
        <Info class="w-5 h-5 text-blue-500" />
        <span class="font-medium">Grant Duration:</span>
        <span>{{ calculatedMonths }} months ({{ years }} years)</span>
      </div>
      <p
        class="text-sm mt-2"
        :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-700'"
      >
        Cost estimates will be calculated for this {{ calculatedMonths }}-month period.
      </p>
    </div>

    <!-- Placeholder when no dates selected -->
    <div
      v-else
      class="rounded-lg p-4 bg-surface-alt"
    >
      <p
        v-if="noDates"
        class="text-sm text-text-muted"
      >
        No dates set — estimates will use the default 36-month period. You can come back and update this any time.
      </p>
      <p
        v-else
        class="text-sm text-center text-text-muted"
      >
        Select a duration above or enter custom dates
      </p>
    </div>
  </div>
</template>
