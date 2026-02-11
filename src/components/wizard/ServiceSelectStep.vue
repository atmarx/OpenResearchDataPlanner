<script setup>
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { Check, Plus, Minus, Info, AlertTriangle, Cpu, HardDrive, Cloud, Box, LifeBuoy, Scale } from 'lucide-vue-next'
import CompareModal from './CompareModal.vue'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

// View mode: 'services' or 'bundles' - default to bundles
const viewMode = ref('bundles')

// Notes modal state
const showNotesModal = ref(false)
const activeNotes = ref({ title: '', content: '' })

// Compare modal state
const compareCategory = ref(null)

// Category icons mapping
const categoryIcons = {
  'cpu': Cpu,
  'hard-drive': HardDrive,
  'cloud': Cloud,
  'box': Box,
  'life-buoy': LifeBuoy
}

// Get services available for the selected tier
const availableServices = computed(() => {
  const tier = sessionStore.selectedTier
  if (!tier) return []

  return configStore.getServicesForTier(tier)
    .filter(s => !s.is_archive_tier) // Exclude archive tiers from direct selection
})

// Group services by category
const servicesByCategory = computed(() => {
  const categories = configStore.config?.categories || []
  const result = []

  for (const category of categories) {
    const services = availableServices.value.filter(s => s.category === category.slug)
    if (services.length > 0) {
      result.push({
        ...category,
        services
      })
    }
  }

  return result.sort((a, b) => a.sort_order - b.sort_order)
})

// Get bundles
const bundles = computed(() => {
  return configStore.config?.bundles || []
})

// Check bundle tier suitability
function getBundleSuitability(bundle) {
  const tier = sessionStore.selectedTier
  if (!tier) return 'unknown'

  if (bundle.recommended_tiers?.includes(tier)) {
    return 'recommended'
  }
  // Check if all services are available for this tier
  const allAvailable = bundle.services.every(s =>
    configStore.isServiceAvailableForTier(s.service, tier)
  )
  return allAvailable ? 'available' : 'unavailable'
}

// Check if service is selected
function isServiceSelected(slug) {
  return sessionStore.selectedServiceSlugs.includes(slug)
}

// Toggle service selection
function toggleService(service) {
  if (isServiceSelected(service.slug)) {
    sessionStore.removeService(service.slug)
  } else {
    sessionStore.addService(service.slug, service.estimation?.default_value)
  }
}

// Apply bundle
function applyBundle(bundle) {
  for (const item of bundle.services) {
    if (!isServiceSelected(item.service)) {
      sessionStore.addService(item.service, item.default_estimate)
    }
  }
}

// Get mapping notes for a service
function getServiceNotes(serviceSlug) {
  const mapping = configStore.getMapping(serviceSlug, sessionStore.selectedTier)
  return mapping?.notes
}

// Get approval type for a service
function getApprovalType(serviceSlug) {
  const mapping = configStore.getMapping(serviceSlug, sessionStore.selectedTier)
  return mapping?.approval || 'automatic'
}

// Get category icon component
function getCategoryIcon(iconName) {
  return categoryIcons[iconName] || Box
}

// Show notes modal
function showRequirements(service) {
  const notes = getServiceNotes(service.slug)
  if (notes) {
    activeNotes.value = {
      title: `${service.name} Requirements`,
      content: notes
    }
    showNotesModal.value = true
  }
}

// Check if category has comparison features
function hasComparisonFeatures(categorySlug) {
  const category = configStore.categoriesBySlug[categorySlug]
  if (!category?.comparison_features?.length) return false

  // Also check if any services in this category have comparison data
  const tier = sessionStore.selectedTier
  const servicesWithComparison = configStore.getServicesForTier(tier)
    .filter(s => s.category === categorySlug)
    .filter(s => !s.is_archive_tier)
    .filter(s => s.comparison_features)

  return servicesWithComparison.length >= 2 // Need at least 2 to compare
}

// Open compare modal for a category
function openCompare(categorySlug) {
  compareCategory.value = categorySlug
}

// Handle service selection from compare modal
function handleCompareSelect(service) {
  if (!isServiceSelected(service.slug)) {
    sessionStore.addService(service.slug, service.estimation?.default_value)
  }
}
</script>

<template>
  <div class="p-8">
    <div class="mb-6">
      <h2
        class="text-2xl font-bold mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        Select Services
      </h2>
      <p :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Choose the services you need for your research project.
        Only services available for your data tier are shown.
      </p>
    </div>

    <!-- View mode toggle -->
    <div class="flex gap-2 mb-6">
      <button
        @click="viewMode = 'services'"
        class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="[
          viewMode === 'services'
            ? 'bg-blue-600 text-white'
            : (preferencesStore.darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
        ]"
      >
        Browse Services
      </button>
      <button
        @click="viewMode = 'bundles'"
        class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="[
          viewMode === 'bundles'
            ? 'bg-blue-600 text-white'
            : (preferencesStore.darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
        ]"
      >
        Use Bundles
      </button>
    </div>

    <!-- Services view -->
    <div v-if="viewMode === 'services'" class="space-y-8">
      <div v-for="category in servicesByCategory" :key="category.slug">
        <div class="flex items-center justify-between mb-3">
          <h3
            class="text-lg font-semibold flex items-center gap-2"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            <component
              :is="getCategoryIcon(category.icon)"
              class="w-5 h-5"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            />
            {{ category.name }}
          </h3>
          <button
            v-if="hasComparisonFeatures(category.slug)"
            @click="openCompare(category.slug)"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors"
            :class="preferencesStore.darkMode
              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'"
          >
            <Scale class="w-4 h-4" />
            Compare Options
          </button>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="service in category.services"
            :key="service.slug"
            class="relative p-4 rounded-lg border-2 transition-all"
            :class="[
              isServiceSelected(service.slug)
                ? (preferencesStore.darkMode
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-blue-500 bg-blue-50')
                : (preferencesStore.darkMode
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white')
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 pr-4">
                <h4
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ service.name }}
                </h4>
                <p
                  class="text-sm mt-1"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
                >
                  <AnnotatedText :text="service.description" />
                </p>

                <!-- Pricing info -->
                <div
                  class="text-sm mt-2"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                >
                  <span v-if="service.cost_model.type === 'unit'">
                    ${{ service.cost_model.price }}/{{ service.cost_model.unit }}/mo
                  </span>
                  <span v-else-if="service.cost_model.type === 'tiered'">
                    Tiered pricing from ${{ service.cost_model.tiers[service.cost_model.tiers.length - 1].price }}/{{ service.cost_model.unit }}
                  </span>
                  <span v-else-if="service.cost_model.type === 'consultation'">
                    Pricing via consultation
                  </span>
                </div>

                <!-- Approval badge -->
                <span
                  v-if="getApprovalType(service.slug) !== 'automatic'"
                  class="inline-flex items-center gap-1 text-xs mt-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800"
                >
                  <AlertTriangle class="w-3 h-3" />
                  Requires {{ getApprovalType(service.slug) }}
                </span>

                <!-- Notes preview -->
                <button
                  v-if="getServiceNotes(service.slug)"
                  class="flex items-center gap-1 text-xs hover:underline mt-2"
                  :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
                  @click.stop="showRequirements(service)"
                >
                  <Info class="w-3 h-3" />
                  View requirements
                </button>
              </div>

              <!-- Selection button -->
              <button
                @click="toggleService(service)"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                :class="[
                  isServiceSelected(service.slug)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : (preferencesStore.darkMode
                      ? 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                      : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-400')
                ]"
                :aria-label="isServiceSelected(service.slug) ? 'Remove service' : 'Add service'"
              >
                <component :is="isServiceSelected(service.slug) ? Check : Plus" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bundles view -->
    <div v-else class="space-y-4">
      <div
        v-for="bundle in bundles"
        :key="bundle.slug"
        class="p-4 rounded-lg border-2 transition-all"
        :class="[
          getBundleSuitability(bundle) === 'unavailable'
            ? (preferencesStore.darkMode
              ? 'border-gray-700 bg-gray-800 opacity-60'
              : 'border-gray-200 bg-gray-50 opacity-60')
            : getBundleSuitability(bundle) === 'recommended'
              ? 'border-green-200 bg-green-50'
              : (preferencesStore.darkMode
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-white')
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h4
                class="font-medium"
                :class="preferencesStore.darkMode && getBundleSuitability(bundle) !== 'recommended' ? 'text-white' : 'text-gray-900'"
              >
                {{ bundle.name }}
              </h4>
              <span
                v-if="getBundleSuitability(bundle) === 'recommended'"
                class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700"
              >
                Recommended
              </span>
              <span
                v-else-if="getBundleSuitability(bundle) === 'unavailable'"
                class="text-xs px-2 py-0.5 rounded-full"
                :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'"
              >
                Not available for this tier
              </span>
            </div>
            <p
              class="text-sm mt-1 whitespace-pre-line"
              :class="preferencesStore.darkMode && getBundleSuitability(bundle) !== 'recommended' ? 'text-gray-400' : 'text-gray-600'"
            >
              <AnnotatedText :text="bundle.description" />
            </p>

            <div class="mt-3">
              <p
                class="text-xs font-medium uppercase tracking-wide mb-1"
                :class="preferencesStore.darkMode && getBundleSuitability(bundle) !== 'recommended' ? 'text-gray-400' : 'text-gray-500'"
              >
                Includes:
              </p>
              <ul
                class="text-sm space-y-1"
                :class="preferencesStore.darkMode && getBundleSuitability(bundle) !== 'recommended' ? 'text-gray-400' : 'text-gray-600'"
              >
                <li v-for="item in bundle.services" :key="item.service" class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full flex items-center justify-center"
                    :class="isServiceSelected(item.service) ? 'bg-blue-100 text-blue-600' : (preferencesStore.darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400')"
                  >
                    <Check v-if="isServiceSelected(item.service)" class="w-3 h-3" />
                  </span>
                  {{ configStore.servicesBySlug[item.service]?.name || item.service }}
                </li>
              </ul>
            </div>
          </div>

          <button
            v-if="getBundleSuitability(bundle) !== 'unavailable'"
            @click="applyBundle(bundle)"
            class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 flex-shrink-0"
          >
            Apply Bundle
          </button>
        </div>
      </div>
    </div>

    <!-- Selected services summary -->
    <div
      class="mt-8 p-4 rounded-lg"
      :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-gray-50'"
    >
      <h3
        class="font-medium mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        Selected Services ({{ sessionStore.session.selected_services.length }})
      </h3>
      <div
        v-if="sessionStore.session.selected_services.length === 0"
        class="text-sm"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        No services selected yet. Select at least one service to continue.
      </div>
      <ul v-else class="space-y-1">
        <li
          v-for="selected in sessionStore.session.selected_services"
          :key="selected.service_slug"
          class="flex items-center justify-between text-sm"
        >
          <span :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ configStore.servicesBySlug[selected.service_slug]?.name }}
          </span>
          <button
            @click="sessionStore.removeService(selected.service_slug)"
            class="text-red-600 hover:text-red-700"
          >
            <Minus class="w-4 h-4" />
          </button>
        </li>
      </ul>
    </div>

    <!-- Requirements modal -->
    <Teleport to="body">
      <div
        v-if="showNotesModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showNotesModal = false"
      >
        <div
          class="rounded-lg shadow-xl max-w-lg w-full p-6"
          :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
          role="dialog"
          aria-modal="true"
        >
          <h3
            class="text-lg font-semibold mb-4"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ activeNotes.title }}
          </h3>
          <div
            class="text-sm whitespace-pre-line mb-6 prose prose-sm max-w-none"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
          >
            {{ activeNotes.content }}
          </div>
          <div class="flex justify-end">
            <button
              @click="showNotesModal = false"
              class="px-4 py-2 rounded-md"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Compare modal -->
    <Teleport to="body">
      <CompareModal
        v-if="compareCategory"
        :category="compareCategory"
        @close="compareCategory = null"
        @select="handleCompareSelect"
      />
    </Teleport>
  </div>
</template>
