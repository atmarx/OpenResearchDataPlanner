<script setup>
import { ref, computed, watch } from 'vue'
import { useSessionStore } from '@/stores/sessionStore'
import { Calendar, Info, ChevronDown } from 'lucide-vue-next'

const sessionStore = useSessionStore()

// Duration is the source of truth — every estimate is computed from the number
// of months, never from specific dates. Researchers rarely know real dates until
// the award lands, so the period is all we ask for. Dates are optional and only
// echoed into the DMP for those who want them.
const presets = [
  { label: '1 year', months: 12 },
  { label: '2 years', months: 24 },
  { label: '3 years', months: 36 },
  { label: '5 years', months: 60 }
]

const months = ref(sessionStore.session.grant_period.months || 36)
const customMode = ref(!presets.some(p => p.months === months.value))

// Optional specific dates (collapsible) — display/DMP only.
const startDate = ref(sessionStore.session.grant_period.start_date || '')
const showDates = ref(!!sessionStore.session.grant_period.start_date)

const years = computed(() => {
  const m = Number(months.value) || 0
  return (m / 12).toFixed(m % 12 === 0 ? 0 : 1)
})

// End date derived from start + duration, for display and the DMP.
const computedEndDate = computed(() => {
  if (!startDate.value || !months.value) return ''
  const start = new Date(startDate.value)
  if (Number.isNaN(start.getTime())) return ''
  const end = new Date(start)
  end.setMonth(end.getMonth() + Number(months.value))
  return end.toISOString().split('T')[0]
})

function selectPreset(m) {
  customMode.value = false
  months.value = m
}
function selectCustom() {
  customMode.value = true
}
function isSelected(m) {
  return !customMode.value && Number(months.value) === m
}
function onCustomMonths(val) {
  months.value = Math.max(1, Math.round(Number(val) || 0))
}

// Sync to the store. With an optional start date set, push start + computed end
// (setGrantPeriod re-derives the same month count); otherwise push the duration
// directly (dates stay null). Not immediate, so a returning session isn't
// overwritten until the user actually changes something.
watch([months, startDate, showDates], () => {
  const m = Math.max(1, Number(months.value) || 36)
  if (showDates.value && startDate.value && computedEndDate.value) {
    sessionStore.setGrantPeriod(startDate.value, computedEndDate.value)
  } else {
    sessionStore.setGrantMonths(m)
  }
})
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-2 text-text">
        Grant Period
      </h2>
      <p class="text-text-secondary">
        How long is your project? Estimates are calculated over this duration.
        You usually won't know exact dates until the award is made — the period
        is all we need.
      </p>
    </div>

    <!-- Duration (primary) -->
    <div class="mb-6">
      <p class="text-sm font-medium mb-2 text-text-secondary">Grant duration:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.months"
          @click="selectPreset(preset.months)"
          class="px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          :class="isSelected(preset.months)
            ? 'bg-primary text-on-primary'
            : 'bg-surface-alt text-text-secondary hover:bg-border-strong'"
        >
          {{ preset.label }}
        </button>
        <button
          @click="selectCustom"
          class="px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          :class="customMode
            ? 'bg-primary text-on-primary'
            : 'bg-surface-alt text-text-secondary hover:bg-border-strong'"
        >
          Custom
        </button>
      </div>

      <!-- Custom months input -->
      <div v-if="customMode" class="mt-3 flex items-center gap-2">
        <input
          type="number"
          min="1"
          step="1"
          :value="months"
          @input="onCustomMonths($event.target.value)"
          class="w-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface border-border-strong text-text"
          aria-label="Grant duration in months"
        />
        <span class="text-sm text-text-secondary">months</span>
      </div>
    </div>

    <!-- Duration summary -->
    <div class="rounded-lg p-4 bg-surface-alt mb-6">
      <div class="flex items-center gap-2 text-primary">
        <Info class="w-5 h-5 text-primary" />
        <span class="font-medium">Grant Duration:</span>
        <span>{{ months }} months ({{ years }} years)</span>
      </div>
      <p class="text-sm mt-2 text-primary">
        Cost estimates will be calculated for this {{ months }}-month period.
      </p>
    </div>

    <!-- Optional specific dates (collapsible) -->
    <div class="border-t border-border pt-4">
      <button
        @click="showDates = !showDates"
        class="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text transition-colors"
        :aria-expanded="showDates"
      >
        <ChevronDown class="w-4 h-4 transition-transform" :class="showDates ? 'rotate-180' : ''" />
        Add a specific start date (optional — for your DMP)
      </button>

      <div v-if="showDates" class="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <label
            for="start-date"
            class="block text-sm font-medium mb-1 text-text-secondary"
          >
            Anticipated start date
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
        <div v-if="startDate && computedEndDate" class="flex items-end">
          <p class="text-sm text-text-muted pb-2">
            Through <span class="font-medium text-text-secondary">{{ computedEndDate }}</span>
            (≈ {{ months }} months). Dates appear in your DMP; only the duration
            affects costs.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
