<script setup>
import { ref, computed, watch } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { Check, ExternalLink, Info, AlertCircle } from 'lucide-vue-next'

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

// Get retention schedules applicable to the selected tier
const applicableSchedules = computed(() => {
  const tier = sessionStore.selectedTier
  if (!tier) return []

  return (configStore.config?.retention?.schedules || [])
    .filter(s => s.applies_to_tiers.includes(tier))
    .sort((a, b) => b.years - a.years) // Sort by years descending
})

// Selected schedule slugs
const selectedSchedules = ref(
  sessionStore.session.retention.schedules || []
)

// Archive ratio
const archiveRatio = ref(sessionStore.session.retention.archive_ratio || 0.7)
const useCustomRatio = ref(sessionStore.session.retention.custom_ratio || false)

// Calculate longest retention period
const longestYears = computed(() => {
  if (selectedSchedules.value.length === 0) return 3 // Default

  const selected = applicableSchedules.value.filter(s =>
    selectedSchedules.value.includes(s.slug)
  )

  return Math.max(...selected.map(s => s.years), 3)
})

// Archive years = retention years - grant years
const archiveYears = computed(() => {
  const grantYears = sessionStore.session.grant_period.months / 12
  return Math.max(0, longestYears.value - grantYears)
})

// Toggle schedule selection
function toggleSchedule(slug) {
  const idx = selectedSchedules.value.indexOf(slug)
  if (idx === -1) {
    selectedSchedules.value.push(slug)
  } else {
    selectedSchedules.value.splice(idx, 1)
  }
}

// Check if schedule is selected
function isSelected(slug) {
  return selectedSchedules.value.includes(slug)
}

// Sync to store on change
watch([selectedSchedules, archiveRatio, useCustomRatio], () => {
  sessionStore.setRetentionSchedules(selectedSchedules.value, longestYears.value)
  sessionStore.setArchiveRatio(archiveRatio.value, useCustomRatio.value)
}, { deep: true })

// Initialize defaults
if (selectedSchedules.value.length === 0) {
  const defaultSchedule = applicableSchedules.value.find(s => s.is_default)
  if (defaultSchedule) {
    selectedSchedules.value.push(defaultSchedule.slug)
  }
}
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h2
        class="text-2xl font-bold mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        Data Retention Requirements
      </h2>
      <p :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Select all retention requirements that apply to your research.
        The longest requirement determines your archive duration.
      </p>
    </div>

    <!-- Retention schedule selection -->
    <div class="space-y-3 mb-8">
      <button
        v-for="schedule in applicableSchedules"
        :key="schedule.slug"
        @click="toggleSchedule(schedule.slug)"
        class="w-full text-left p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :class="[
          isSelected(schedule.slug)
            ? preferencesStore.darkMode
              ? 'border-blue-500 bg-blue-900/30'
              : 'border-blue-500 bg-blue-50'
            : preferencesStore.darkMode
              ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
              : 'border-gray-200 bg-white hover:border-gray-300'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3
                class="font-medium"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                {{ schedule.name }}
              </h3>
              <span
                class="text-sm px-2 py-0.5 rounded"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-600 text-gray-300'
                  : 'bg-gray-100 text-gray-600'"
              >
                {{ schedule.years }} years
              </span>
              <span v-if="schedule.is_default" class="text-xs text-blue-500">
                (Default)
              </span>
            </div>
            <p
              class="text-sm mt-1"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ schedule.description }}
            </p>
            <a
              v-if="schedule.regulation_url"
              :href="schedule.regulation_url"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
              class="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline mt-2"
            >
              {{ schedule.regulation }}
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>

          <div
            class="ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            :class="[
              isSelected(schedule.slug)
                ? 'bg-blue-600 border-blue-600'
                : preferencesStore.darkMode ? 'border-gray-500' : 'border-gray-300'
            ]"
          >
            <Check v-if="isSelected(schedule.slug)" class="w-4 h-4 text-white" />
          </div>
        </div>
      </button>
    </div>

    <!-- Archive summary -->
    <div
      class="rounded-lg p-4 mb-6"
      :class="preferencesStore.darkMode ? 'bg-blue-900/30' : 'bg-blue-50'"
    >
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p
            class="font-medium"
            :class="preferencesStore.darkMode ? 'text-blue-200' : 'text-blue-900'"
          >
            Retention Period: {{ longestYears }} years total
          </p>
          <p
            class="text-sm mt-1"
            :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-700'"
          >
            Based on your selections, data must be retained for {{ longestYears }} years.
            <span v-if="archiveYears > 0">
              After your {{ (sessionStore.session.grant_period.months / 12).toFixed(1) }}-year grant ends,
              {{ archiveYears.toFixed(1) }} years of archive storage will be needed.
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Archive ratio setting -->
    <div
      class="rounded-lg p-4"
      :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-50'"
    >
      <div class="flex items-center justify-between mb-2">
        <label
          class="font-medium"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Archive Storage Ratio
        </label>
        <label
          class="flex items-center gap-2 text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          <input
            v-model="useCustomRatio"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Custom ratio
        </label>
      </div>

      <p
        class="text-sm mb-3"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        {{ configStore.config?.retention?.archive_settings?.custom_ratio_prompt }}
      </p>

      <div class="flex items-center gap-4">
        <input
          v-model.number="archiveRatio"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          :disabled="!useCustomRatio"
          class="flex-1"
        />
        <span
          class="text-lg font-medium w-16 text-right"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          {{ Math.round(archiveRatio * 100) }}%
        </span>
      </div>
    </div>

    <!-- Warning if no schedules selected -->
    <div
      v-if="selectedSchedules.length === 0"
      class="mt-4 p-4 rounded-lg flex items-start gap-3"
      :class="preferencesStore.darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'"
    >
      <AlertCircle class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
      <p
        class="text-sm"
        :class="preferencesStore.darkMode ? 'text-yellow-200' : 'text-yellow-800'"
      >
        Please select at least one retention requirement to continue.
      </p>
    </div>
  </div>
</template>
