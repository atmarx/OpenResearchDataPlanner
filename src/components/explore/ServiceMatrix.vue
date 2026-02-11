<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useSlateStore } from '@/stores/slateStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
  X,
  Check,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Info,
  Filter
} from 'lucide-vue-next'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'

const router = useRouter()

const configStore = useConfigStore()
const slateStore = useSlateStore()
const preferencesStore = usePreferencesStore()

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('all')

// Modal state
const selectedService = ref(null)
const showQuickAdd = ref(false)
const quickAddQuantity = ref(1)

// Get tiers from config
const tiers = computed(() => {
  return configStore.config?.tiers || []
})

// Get categories from config
const categories = computed(() => {
  return configStore.config?.categories || []
})

// Get services grouped by category
const servicesByCategory = computed(() => {
  const services = configStore.config?.services || []
  const grouped = {}

  for (const service of services) {
    const category = service.category || 'other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(service)
  }

  return grouped
})

// Get mappings indexed by service-tier
const mappingsIndex = computed(() => {
  const mappings = configStore.config?.mappings || []
  const index = {}

  for (const mapping of mappings) {
    const key = `${mapping.service}-${mapping.tier}`
    index[key] = mapping
  }

  return index
})

// Filtered services
const filteredServices = computed(() => {
  let services = configStore.config?.services || []

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    services = services.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.short_description?.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value !== 'all') {
    services = services.filter(s => s.category === selectedCategory.value)
  }

  // Group by category for display
  const grouped = {}
  for (const service of services) {
    const category = service.category || 'other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(service)
  }

  return grouped
})

// Get category info
function getCategoryInfo(categorySlug) {
  return categories.value.find(c => c.slug === categorySlug) || { name: categorySlug }
}

// Get availability for a service-tier combination
function getAvailability(serviceSlug, tierSlug) {
  const key = `${serviceSlug}-${tierSlug}`
  const mapping = mappingsIndex.value[key]

  if (!mapping) {
    return { status: 'unavailable', label: 'Not available' }
  }

  switch (mapping.approval) {
    case 'automatic':
      return { status: 'available', label: 'Available' }
    case 'review':
      return { status: 'review', label: 'Requires review' }
    case 'consultation':
      return { status: 'consultation', label: 'Consultation required' }
    default:
      return { status: 'available', label: 'Available' }
  }
}

// Open quick add modal
function openQuickAdd(service) {
  selectedService.value = service
  quickAddQuantity.value = 1
  showQuickAdd.value = true
}

// Add service to slate
function addToSlate() {
  if (!selectedService.value) return

  slateStore.addItem({
    service: selectedService.value.slug,
    quantity: quickAddQuantity.value,
    unit: selectedService.value.cost_model?.unit_label || 'units'
  })

  showQuickAdd.value = false
  selectedService.value = null
}

// Get tier color class
function getTierColorClass(tierSlug) {
  const tier = tiers.value.find(t => t.slug === tierSlug)
  switch (tier?.color) {
    case 'green': return 'bg-green-100 text-green-800'
    case 'yellow': return 'bg-yellow-100 text-yellow-800'
    case 'orange': return 'bg-orange-100 text-orange-800'
    case 'red': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="preferencesStore.darkMode ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <!-- Header -->
    <div
      class="border-b sticky top-0 z-10"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="mb-4">
          <h1
            class="text-2xl font-bold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >Browse Services</h1>
          <p
            class="mt-1"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            Explore available services by security tier
          </p>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search services..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>

          <!-- Category filter -->
          <div class="flex items-center gap-2">
            <Filter class="w-4 h-4 text-gray-400" />
            <select
              v-model="selectedCategory"
              class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'"
            >
              <option value="all">All Categories</option>
              <option
                v-for="cat in categories"
                :key="cat.slug"
                :value="cat.slug"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Tier legend -->
        <div class="flex items-center gap-4 mt-4 text-sm">
          <span :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'">Tiers:</span>
          <span
            v-for="tier in tiers"
            :key="tier.slug"
            class="px-2 py-0.5 rounded text-xs font-medium"
            :class="getTierColorClass(tier.slug)"
          >
            {{ tier.short_name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Matrix -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div
        v-for="(services, categorySlug) in filteredServices"
        :key="categorySlug"
        class="mb-8"
      >
        <!-- Category header -->
        <h2
          class="text-lg font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          {{ getCategoryInfo(categorySlug).name }}
        </h2>

        <!-- Service table -->
        <div
          class="rounded-lg border overflow-hidden"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead
                class="border-b"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'"
              >
                <tr>
                  <th
                    class="px-4 py-3 text-left text-sm font-medium min-w-[200px]"
                    :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
                  >
                    Service
                  </th>
                  <th
                    v-for="tier in tiers"
                    :key="tier.slug"
                    class="px-3 py-3 text-center text-sm font-medium min-w-[80px]"
                    :class="getTierColorClass(tier.slug)"
                  >
                    {{ tier.short_name }}
                  </th>
                  <th
                    class="px-4 py-3 text-center text-sm font-medium w-[100px]"
                    :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
                  >
                    Add
                  </th>
                </tr>
              </thead>
              <tbody
                class="divide-y"
                :class="preferencesStore.darkMode ? 'divide-gray-700' : 'divide-gray-100'"
              >
                <tr
                  v-for="service in services"
                  :key="service.slug"
                  :class="preferencesStore.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'"
                >
                  <td class="px-4 py-3">
                    <div
                      class="font-medium"
                      :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                    >{{ service.name }}</div>
                    <div
                      class="text-sm truncate max-w-[250px]"
                      :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                    >
                      <AnnotatedText :text="service.short_description" />
                    </div>
                  </td>

                  <!-- Tier availability cells -->
                  <td
                    v-for="tier in tiers"
                    :key="tier.slug"
                    class="px-3 py-3 text-center"
                  >
                    <span
                      v-if="getAvailability(service.slug, tier.slug).status === 'available'"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <Check class="w-4 h-4" />
                    </span>
                    <span
                      v-else-if="getAvailability(service.slug, tier.slug).status === 'review'"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <AlertTriangle class="w-4 h-4" />
                    </span>
                    <span
                      v-else-if="getAvailability(service.slug, tier.slug).status === 'consultation'"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <Info class="w-4 h-4" />
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <XCircle class="w-4 h-4" />
                    </span>
                  </td>

                  <!-- Add button -->
                  <td class="px-4 py-3 text-center">
                    <button
                      @click="openQuickAdd(service)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg"
                      :class="preferencesStore.darkMode
                        ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-900'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'"
                    >
                      <Plus class="w-4 h-4" />
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="Object.keys(filteredServices).length === 0"
        class="text-center py-12"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        <Search class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No services found matching your search.</p>
      </div>

      <!-- Slate status -->
      <div
        v-if="slateStore.hasItems"
        class="fixed bottom-20 left-0 right-0 px-4"
      >
        <div
          class="max-w-7xl mx-auto rounded-lg p-4 flex items-center justify-between shadow-lg border"
          :class="preferencesStore.darkMode
            ? 'bg-blue-900/50 border-blue-800'
            : 'bg-blue-50 border-blue-200'"
        >
          <div>
            <span
              class="font-medium"
              :class="preferencesStore.darkMode ? 'text-blue-200' : 'text-blue-900'"
            >Your Slate</span>
            <span
              class="ml-2"
              :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-700'"
            >
              {{ slateStore.itemCount }} service{{ slateStore.itemCount !== 1 ? 's' : '' }}
            </span>
          </div>
          <button
            @click="router.push('/')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Review Slate
          </button>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div
      class="max-w-7xl mx-auto px-4 py-4 mb-20 text-sm"
      :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
    >
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
            <Check class="w-3 h-3" />
          </span>
          <span>Available</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-600">
            <AlertTriangle class="w-3 h-3" />
          </span>
          <span>Requires review</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600">
            <Info class="w-3 h-3" />
          </span>
          <span>Consultation needed</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400">
            <XCircle class="w-3 h-3" />
          </span>
          <span>Not available</span>
        </div>
      </div>
    </div>

    <!-- Quick Add Modal -->
    <Teleport to="body">
      <div
        v-if="showQuickAdd && selectedService"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showQuickAdd = false"
      >
        <div
          class="rounded-xl shadow-2xl max-w-md w-full p-6"
          :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
        >
          <h3
            class="text-lg font-semibold mb-2"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            Add {{ selectedService.name }}
          </h3>
          <p
            class="text-sm mb-4"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            <AnnotatedText :text="selectedService.short_description" />
          </p>

          <!-- Quantity input -->
          <div class="mb-6">
            <label
              class="block text-sm font-medium mb-1"
              :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              Quantity ({{ selectedService.cost_model?.unit_label || 'units' }})
            </label>
            <input
              v-model.number="quickAddQuantity"
              type="number"
              min="1"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'"
            />
            <p
              class="mt-1 text-xs"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Not sure?
              <button
                class="hover:underline"
                :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
                @click="router.push('/calculators')"
              >
                Use a calculator
              </button>
              to estimate your needs.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="showQuickAdd = false"
              class="flex-1 px-4 py-2 rounded-lg"
              :class="preferencesStore.darkMode
                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
            >
              Cancel
            </button>
            <button
              @click="addToSlate"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Add to Slate
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
