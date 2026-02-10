<script setup>
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-vue-next'

const configStore = useConfigStore()
const sessionStore = useSessionStore()

// Track which services have expanded details
const expandedServices = ref(new Set())

// Get selected services with their config
const selectedServices = computed(() => {
  return sessionStore.session.selected_services.map(s => ({
    ...s,
    config: configStore.servicesBySlug[s.service_slug],
    mapping: configStore.getMapping(s.service_slug, sessionStore.selectedTier)
  }))
})

// Services that require acknowledgment but haven't been acknowledged yet
const pendingAcknowledgments = computed(() => {
  return selectedServices.value.filter(s =>
    s.config?.acknowledgment?.required && !s.acknowledged
  )
})

// Toggle service expansion
function toggleExpand(slug) {
  if (expandedServices.value.has(slug)) {
    expandedServices.value.delete(slug)
  } else {
    expandedServices.value.add(slug)
  }
}

// Update estimate for a service
function updateEstimate(serviceSlug, value) {
  sessionStore.updateServiceEstimate(serviceSlug, parseFloat(value) || 0)
}

// Apply preset value
function applyPreset(serviceSlug, value) {
  sessionStore.updateServiceEstimate(serviceSlug, value)
}

// Toggle subsidy
function toggleSubsidy(serviceSlug, subsidySlug) {
  const current = sessionStore.session.selected_services.find(
    s => s.service_slug === serviceSlug
  )?.use_subsidy

  if (current === subsidySlug) {
    sessionStore.updateServiceSubsidy(serviceSlug, null)
  } else {
    sessionStore.updateServiceSubsidy(serviceSlug, subsidySlug)
  }
}

// Get archive service if applicable
function getArchiveService(service) {
  if (!service.config?.archive_option?.service_slug) return null
  return configStore.servicesBySlug[service.config.archive_option.service_slug]
}

// Calculate default archive estimate
function getDefaultArchiveEstimate(service) {
  const ratio = sessionStore.session.retention.archive_ratio
  return (service.estimate || 0) * ratio
}

// Update archive estimate
function updateArchiveEstimate(serviceSlug, value) {
  sessionStore.updateServiceArchiveEstimate(serviceSlug, parseFloat(value) || 0)
}

// Toggle acknowledgment
function toggleAcknowledgment(serviceSlug, acknowledged) {
  sessionStore.updateServiceAcknowledgment(serviceSlug, acknowledged)
}
</script>

<template>
  <div class="p-8">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        Usage Estimates
      </h2>
      <p class="text-gray-600">
        Enter your estimated usage for each service.
        These estimates will be used to calculate your budget.
      </p>
    </div>

    <div class="space-y-6">
      <div
        v-for="service in selectedServices"
        :key="service.service_slug"
        class="border border-gray-200 rounded-lg overflow-hidden"
      >
        <!-- Service header -->
        <button
          @click="toggleExpand(service.service_slug)"
          class="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left"
        >
          <div>
            <h3 class="font-medium text-gray-900">
              {{ service.config?.name }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ service.config?.description }}
            </p>
          </div>
          <component
            :is="expandedServices.has(service.service_slug) ? ChevronUp : ChevronDown"
            class="w-5 h-5 text-gray-400"
          />
        </button>

        <!-- Service details -->
        <div class="p-4 space-y-4">
          <!-- Main estimate input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ service.config?.estimation?.prompt || 'Estimated usage' }}
            </label>

            <div class="flex items-center gap-3">
              <input
                type="number"
                :value="service.estimate"
                @input="updateEstimate(service.service_slug, $event.target.value)"
                :min="service.config?.estimation?.min_value || 0"
                :max="service.config?.estimation?.max_value"
                :step="service.config?.estimation?.step || 1"
                class="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span class="text-gray-600">
                {{ service.config?.estimation?.unit_display || service.config?.cost_model?.unit_label || 'units' }}
                /month
              </span>
            </div>

            <!-- Presets -->
            <div v-if="service.config?.estimation?.presets?.length" class="mt-3">
              <p class="text-xs text-gray-500 mb-2">Quick estimates:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="preset in service.config.estimation.presets"
                  :key="preset.value"
                  @click="applyPreset(service.service_slug, preset.value)"
                  class="px-3 py-1.5 text-xs rounded-md transition-colors"
                  :class="[
                    service.estimate === preset.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                  :title="preset.description"
                >
                  {{ preset.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Subsidies -->
          <div v-if="service.config?.subsidies?.filter(s => !s.auto_apply)?.length">
            <p class="text-sm font-medium text-gray-700 mb-2">Available subsidies:</p>
            <div class="space-y-2">
              <label
                v-for="subsidy in service.config.subsidies.filter(s => !s.auto_apply)"
                :key="subsidy.slug"
                class="flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors"
                :class="[
                  service.use_subsidy === subsidy.slug
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <input
                  type="checkbox"
                  :checked="service.use_subsidy === subsidy.slug"
                  @change="toggleSubsidy(service.service_slug, subsidy.slug)"
                  class="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ subsidy.name }}</p>
                  <p class="text-xs text-gray-600">{{ subsidy.description }}</p>
                  <p v-if="subsidy.condition" class="text-xs text-yellow-700 mt-1">
                    {{ subsidy.condition }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Service limitations acknowledgment -->
          <div v-if="service.config?.acknowledgment?.required" class="border-t border-gray-200 pt-4 mt-4">
            <div
              class="p-4 rounded-lg"
              :class="[
                service.acknowledged
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-amber-50 border border-amber-200'
              ]"
            >
              <div class="flex items-start gap-3">
                <AlertTriangle
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
                  :class="service.acknowledged ? 'text-green-600' : 'text-amber-600'"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 text-sm">
                    {{ service.config.acknowledgment.title }}
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ service.config.acknowledgment.message }}
                  </p>
                  <ul class="mt-2 space-y-1">
                    <li
                      v-for="(item, idx) in service.config.acknowledgment.items"
                      :key="idx"
                      class="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span class="text-amber-500 mt-0.5">•</span>
                      {{ item }}
                    </li>
                  </ul>
                  <label class="flex items-center gap-2 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="service.acknowledged"
                      @change="toggleAcknowledgment(service.service_slug, $event.target.checked)"
                      class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span class="text-sm font-medium text-gray-700">
                      I understand these limitations
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Archive storage (for storage services) -->
          <div v-if="getArchiveService(service) && sessionStore.session.retention.longest_years > 0">
            <div class="border-t border-gray-200 pt-4 mt-4">
              <p class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Info class="w-4 h-4 text-gray-400" />
                Long-term archive storage
              </p>
              <p class="text-xs text-gray-500 mb-3">
                {{ service.config.archive_option.description }}
              </p>

              <div class="flex items-center gap-3">
                <input
                  type="number"
                  :value="service.archive_estimate ?? getDefaultArchiveEstimate(service)"
                  @input="updateArchiveEstimate(service.service_slug, $event.target.value)"
                  min="0"
                  step="1"
                  class="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span class="text-gray-600 text-sm">
                  {{ getArchiveService(service)?.cost_model?.unit_label }} for archive
                </span>
                <button
                  @click="updateArchiveEstimate(service.service_slug, getDefaultArchiveEstimate(service))"
                  class="text-xs text-blue-600 hover:underline"
                >
                  Reset to {{ Math.round(sessionStore.session.retention.archive_ratio * 100) }}%
                </button>
              </div>
            </div>
          </div>

          <!-- Expanded details -->
          <div v-if="expandedServices.has(service.service_slug)" class="border-t border-gray-200 pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Pricing Details</h4>
            <div class="text-sm text-gray-600 space-y-1">
              <p v-if="service.config?.cost_model?.type === 'unit'">
                Unit price: ${{ service.config.cost_model.price }}/{{ service.config.cost_model.unit }}/month
              </p>
              <p v-else-if="service.config?.cost_model?.type === 'tiered'">
                <span class="block font-medium">Tiered pricing:</span>
                <span
                  v-for="(tier, idx) in service.config.cost_model.tiers"
                  :key="idx"
                  class="block ml-2"
                >
                  {{ tier.label }}: ${{ tier.price }}/{{ service.config.cost_model.unit }}
                  <span v-if="tier.up_to">(up to {{ tier.up_to.toLocaleString() }})</span>
                </span>
              </p>
            </div>

            <!-- Auto-applied subsidies -->
            <div v-if="service.config?.subsidies?.filter(s => s.auto_apply)?.length" class="mt-3">
              <p class="text-sm font-medium text-gray-700 mb-1">Auto-applied subsidies:</p>
              <ul class="text-sm text-green-700 space-y-1">
                <li v-for="subsidy in service.config.subsidies.filter(s => s.auto_apply)" :key="subsidy.slug">
                  {{ subsidy.name }}: {{ subsidy.description }}
                </li>
              </ul>
            </div>

            <!-- Service notes -->
            <div v-if="service.mapping?.notes" class="mt-3 p-3 bg-yellow-50 rounded-md">
              <p class="text-sm text-yellow-800 whitespace-pre-line">{{ service.mapping.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation messages -->
    <div
      v-if="selectedServices.some(s => !s.estimate || s.estimate <= 0)"
      class="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3"
    >
      <Info class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
      <p class="text-sm text-yellow-800">
        Please enter usage estimates for all selected services to continue.
      </p>
    </div>

    <div
      v-if="pendingAcknowledgments.length > 0"
      class="mt-4 p-4 bg-amber-50 rounded-lg flex items-start gap-3"
    >
      <AlertTriangle class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div class="text-sm text-amber-800">
        <p class="font-medium">Acknowledgment required</p>
        <p>
          Please review and acknowledge the limitations for:
          {{ pendingAcknowledgments.map(s => s.config?.name).join(', ') }}
        </p>
      </div>
    </div>
  </div>
</template>
