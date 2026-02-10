<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { X, Check, Minus, Circle, Plus, Info } from 'lucide-vue-next'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'select'])

const configStore = useConfigStore()
const sessionStore = useSessionStore()

// Get category config
const categoryConfig = computed(() => {
  return configStore.categoriesBySlug[props.category]
})

// Get features for this category
const features = computed(() => {
  return categoryConfig.value?.comparison_features || []
})

// Get services in this category that are available for the selected tier
const services = computed(() => {
  const tier = sessionStore.selectedTier
  if (!tier) return []

  return configStore.getServicesForTier(tier)
    .filter(s => s.category === props.category)
    .filter(s => !s.is_archive_tier)
    .filter(s => s.comparison_features) // Only services with comparison data
})

// Check if a service is selected
function isSelected(slug) {
  return sessionStore.selectedServiceSlugs.includes(slug)
}

// Get feature value for a service
function getFeatureValue(service, featureKey) {
  const feature = service.comparison_features?.[featureKey]
  if (!feature) return { value: 'none', detail: null }
  if (typeof feature === 'string') return { value: feature, detail: null }
  return feature
}

// Get icon component for feature value
function getValueIcon(value) {
  switch (value) {
    case 'full': return Check
    case 'partial': return Minus
    default: return Circle
  }
}

// Get CSS classes for feature value
function getValueClasses(value) {
  switch (value) {
    case 'full': return 'text-green-600 bg-green-50'
    case 'partial': return 'text-yellow-600 bg-yellow-50'
    default: return 'text-gray-400 bg-gray-50'
  }
}

// Select a service
function selectService(service) {
  emit('select', service)
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'compare-title-' + category"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 :id="'compare-title-' + category" class="text-xl font-semibold text-gray-900">
            Compare {{ categoryConfig?.name }} Options
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Click a service to add it to your selection
          </p>
        </div>
        <button
          @click="emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          aria-label="Close comparison"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Table container -->
      <div class="flex-1 overflow-auto p-6">
        <div class="min-w-max">
          <table class="w-full text-sm">
            <thead>
              <tr>
                <th class="text-left py-3 px-4 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-[160px]">
                  Feature
                </th>
                <th
                  v-for="service in services"
                  :key="service.slug"
                  class="text-center py-3 px-4 font-medium text-gray-900 bg-gray-50 min-w-[140px]"
                >
                  <button
                    @click="selectService(service)"
                    class="group flex flex-col items-center gap-1 w-full hover:text-blue-600 transition-colors"
                  >
                    <span class="text-xs leading-tight">{{ service.name }}</span>
                    <span
                      v-if="isSelected(service.slug)"
                      class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                    >
                      Selected
                    </span>
                    <span
                      v-else
                      class="text-xs text-gray-400 group-hover:text-blue-500 flex items-center gap-1"
                    >
                      <Plus class="w-3 h-3" />
                      Add
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="feature in features"
                :key="feature.key"
                class="border-t border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 px-4 sticky left-0 bg-white z-10">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900">{{ feature.label }}</span>
                    <button
                      v-if="feature.description"
                      class="text-gray-400 hover:text-gray-600"
                      :title="feature.description"
                    >
                      <Info class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td
                  v-for="service in services"
                  :key="service.slug"
                  class="py-3 px-4 text-center"
                >
                  <div class="flex flex-col items-center gap-1">
                    <span
                      class="inline-flex items-center justify-center w-7 h-7 rounded-full"
                      :class="getValueClasses(getFeatureValue(service, feature.key).value)"
                      :title="getFeatureValue(service, feature.key).detail || undefined"
                    >
                      <component
                        :is="getValueIcon(getFeatureValue(service, feature.key).value)"
                        class="w-4 h-4"
                      />
                    </span>
                    <span
                      v-if="getFeatureValue(service, feature.key).detail"
                      class="text-xs text-gray-500 max-w-[120px] leading-tight"
                    >
                      {{ getFeatureValue(service, feature.key).detail }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Legend -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center gap-6 text-sm">
          <span class="text-gray-500">Legend:</span>
          <span class="flex items-center gap-1.5">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-50 text-green-600">
              <Check class="w-3 h-3" />
            </span>
            <span class="text-gray-700">Full support</span>
          </span>
          <span class="flex items-center gap-1.5">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-50 text-yellow-600">
              <Minus class="w-3 h-3" />
            </span>
            <span class="text-gray-700">Partial/limited</span>
          </span>
          <span class="flex items-center gap-1.5">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-50 text-gray-400">
              <Circle class="w-3 h-3" />
            </span>
            <span class="text-gray-700">Not available</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
