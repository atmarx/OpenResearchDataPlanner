<script setup>
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
  Check,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Search,
  X,
  Info,
  Server,
  Monitor,
  Cloud,
  Laptop,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next'

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

// Search and filter state
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const platformFilter = ref('all')
const expandedSoftware = ref(null)

// Get software config
const softwareConfig = computed(() => configStore.config?.software || {})
const softwareList = computed(() => softwareConfig.value.software || [])
const softwareCategories = computed(() => softwareConfig.value.categories || [])
const licenseStatuses = computed(() => softwareConfig.value.license_statuses || {})

// Get user's selected platforms based on their service selections
const selectedPlatforms = computed(() => {
  const platforms = new Set()
  for (const selection of sessionStore.session.selected_services) {
    const service = configStore.servicesBySlug[selection.service_slug]
    if (!service) continue

    // Map service categories to software platforms
    if (service.category === 'compute') {
      // Check if it's HPC or cloud
      if (service.slug.includes('hpc') || service.slug.includes('k8s')) {
        platforms.add('hpc')
      } else if (service.slug.includes('aws') || service.slug.includes('azure')) {
        platforms.add('cloud')
      }
    } else if (service.category === 'environment') {
      if (service.slug.includes('vdi') || service.slug.includes('jupyterhub')) {
        platforms.add('vdi')
      }
    }
  }
  return Array.from(platforms)
})

// Check if software is available on any of user's selected platforms
function isAvailableOnSelectedPlatforms(software) {
  if (selectedPlatforms.value.length === 0) return true

  for (const platform of selectedPlatforms.value) {
    const availability = software.availability?.[platform]
    if (availability?.status === 'full' || availability?.status === 'restricted') {
      return true
    }
  }
  return false
}

// Filter and sort software
const filteredSoftware = computed(() => {
  let result = softwareList.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(sw =>
      sw.name.toLowerCase().includes(query) ||
      sw.description?.toLowerCase().includes(query) ||
      sw.vendor?.toLowerCase().includes(query) ||
      sw.tags?.some(t => t.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (categoryFilter.value !== 'all') {
    result = result.filter(sw => sw.category === categoryFilter.value)
  }

  // Platform filter
  if (platformFilter.value !== 'all') {
    result = result.filter(sw => {
      const availability = sw.availability?.[platformFilter.value]
      return availability?.status === 'full' || availability?.status === 'restricted'
    })
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(sw => {
      // Check the dominant status across platforms
      const statuses = Object.values(sw.availability || {}).map(a => a.status)
      if (statusFilter.value === 'full') {
        return statuses.includes('full')
      } else if (statusFilter.value === 'restricted') {
        return statuses.includes('restricted') && !statuses.includes('full')
      } else if (statusFilter.value === 'byol') {
        return statuses.every(s => s === 'byol' || s === 'unavailable')
      }
      return true
    })
  }

  // Sort: prioritize software available on user's platforms
  return result.sort((a, b) => {
    const aAvailable = isAvailableOnSelectedPlatforms(a)
    const bAvailable = isAvailableOnSelectedPlatforms(b)
    if (aAvailable && !bAvailable) return -1
    if (!aAvailable && bAvailable) return 1
    return a.name.localeCompare(b.name)
  })
})

// Group software by category for display
const softwareByCategory = computed(() => {
  const grouped = {}
  for (const sw of filteredSoftware.value) {
    const cat = sw.category || 'other'
    if (!grouped[cat]) {
      grouped[cat] = {
        category: softwareCategories.value.find(c => c.slug === cat) || { slug: cat, name: cat },
        software: []
      }
    }
    grouped[cat].software.push(sw)
  }
  return Object.values(grouped)
})

// Get status color and icon
function getStatusInfo(status) {
  const info = {
    full: { color: 'green', icon: CheckCircle, label: 'Available' },
    restricted: { color: 'yellow', icon: AlertCircle, label: 'Restricted' },
    byol: { color: 'gray', icon: ExternalLink, label: 'BYOL' },
    unavailable: { color: 'red', icon: XCircle, label: 'N/A' }
  }
  return info[status] || info.unavailable
}

// Get best status for software (across all platforms)
function getBestStatus(software) {
  const statuses = Object.values(software.availability || {}).map(a => a.status)
  if (statuses.includes('full')) return 'full'
  if (statuses.includes('restricted')) return 'restricted'
  if (statuses.includes('byol')) return 'byol'
  return 'unavailable'
}

// Get platform icon
function getPlatformIcon(platform) {
  const icons = {
    hpc: Server,
    vdi: Monitor,
    cloud: Cloud,
    local: Laptop
  }
  return icons[platform] || Server
}

// Check if software is selected
function isSoftwareSelected(slug) {
  return sessionStore.selectedSoftwareSlugs.includes(slug)
}

// Toggle software selection
function toggleSoftware(software) {
  sessionStore.toggleSoftware(software.slug, selectedPlatforms.value)
}

// Toggle expanded state
function toggleExpanded(slug) {
  expandedSoftware.value = expandedSoftware.value === slug ? null : slug
}

// Format BYOL pricing
function formatByolPricing(software) {
  if (!software.license_info) return null

  if (software.license_info.cost_estimate) {
    const cost = software.license_info.cost_estimate
    const period = software.license_info.cost_period || 'year'
    return `~$${cost}/${period}`
  }

  return null
}

// Clear all filters
function clearFilters() {
  searchQuery.value = ''
  categoryFilter.value = 'all'
  statusFilter.value = 'all'
  platformFilter.value = 'all'
}
</script>

<template>
  <div class="p-8">
    <div class="mb-6">
      <h2
        class="text-2xl font-bold mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        Software Catalog
      </h2>
      <p :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Review available software for your selected services.
        Flag any software you'll need for your project, especially items requiring separate licensing.
      </p>
      <p
        v-if="selectedPlatforms.length > 0"
        class="text-sm mt-2"
        :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
      >
        Showing software for: {{ selectedPlatforms.map(p => p.toUpperCase()).join(', ') }}
      </p>
    </div>

    <!-- Search and filters -->
    <div class="mb-6 space-y-4">
      <!-- Search -->
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search software..."
          class="w-full pl-10 pr-10 py-2 rounded-lg border"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2"
          :class="preferencesStore.darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Filter pills -->
      <div class="flex flex-wrap gap-2">
        <!-- Category filter -->
        <select
          v-model="categoryFilter"
          class="px-3 py-1.5 rounded-md text-sm border"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 text-gray-300'
            : 'bg-white border-gray-300 text-gray-700'"
        >
          <option value="all">All Categories</option>
          <option v-for="cat in softwareCategories" :key="cat.slug" :value="cat.slug">
            {{ cat.name }}
          </option>
        </select>

        <!-- Platform filter -->
        <select
          v-model="platformFilter"
          class="px-3 py-1.5 rounded-md text-sm border"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 text-gray-300'
            : 'bg-white border-gray-300 text-gray-700'"
        >
          <option value="all">All Platforms</option>
          <option value="hpc">HPC</option>
          <option value="vdi">VDI</option>
          <option value="cloud">Cloud</option>
        </select>

        <!-- Status filter -->
        <select
          v-model="statusFilter"
          class="px-3 py-1.5 rounded-md text-sm border"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 text-gray-300'
            : 'bg-white border-gray-300 text-gray-700'"
        >
          <option value="all">All Status</option>
          <option value="full">Available</option>
          <option value="restricted">Restricted</option>
          <option value="byol">BYOL Only</option>
        </select>

        <!-- Clear filters -->
        <button
          v-if="searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || platformFilter !== 'all'"
          @click="clearFilters"
          class="px-3 py-1.5 rounded-md text-sm"
          :class="preferencesStore.darkMode
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-500 hover:text-gray-700'"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Software list -->
    <div class="space-y-6">
      <div v-for="group in softwareByCategory" :key="group.category.slug">
        <h3
          class="text-lg font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          {{ group.category.name }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="software in group.software"
            :key="software.slug"
            class="rounded-lg border transition-all"
            :class="[
              isSoftwareSelected(software.slug)
                ? (preferencesStore.darkMode
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-blue-500 bg-blue-50')
                : (preferencesStore.darkMode
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'),
              !isAvailableOnSelectedPlatforms(software) && 'opacity-60'
            ]"
          >
            <!-- Card content -->
            <div class="p-4">
              <!-- Header row -->
              <div class="flex items-start gap-3">
                <!-- Status indicator -->
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="{
                    'bg-green-100 text-green-600': getBestStatus(software) === 'full',
                    'bg-yellow-100 text-yellow-600': getBestStatus(software) === 'restricted',
                    'bg-gray-100 text-gray-500': getBestStatus(software) === 'byol',
                    'bg-red-100 text-red-500': getBestStatus(software) === 'unavailable'
                  }"
                >
                  <component :is="getStatusInfo(getBestStatus(software)).icon" class="w-4 h-4" />
                </div>

                <!-- Software info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4
                      class="font-medium"
                      :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                    >
                      {{ software.name }}
                    </h4>
                    <span
                      v-if="software.vendor === 'Open Source'"
                      class="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700"
                    >
                      OSS
                    </span>
                  </div>
                  <p
                    v-if="software.vendor && software.vendor !== 'Open Source'"
                    class="text-xs"
                    :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
                  >
                    {{ software.vendor }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-1 flex-shrink-0">
                  <!-- Expand button -->
                  <button
                    @click="toggleExpanded(software.slug)"
                    class="p-1.5 rounded-md"
                    :class="preferencesStore.darkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
                  >
                    <component :is="expandedSoftware === software.slug ? ChevronUp : ChevronDown" class="w-4 h-4" />
                  </button>

                  <!-- Select button -->
                  <button
                    @click="toggleSoftware(software)"
                    class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="[
                      isSoftwareSelected(software.slug)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : (preferencesStore.darkMode
                          ? 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                          : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-400')
                    ]"
                    :aria-label="isSoftwareSelected(software.slug) ? 'Remove' : 'Add'"
                  >
                    <Check v-if="isSoftwareSelected(software.slug)" class="w-4 h-4" />
                    <span v-else class="text-lg leading-none">+</span>
                  </button>
                </div>
              </div>

              <!-- Description -->
              <p
                class="text-sm mt-2 line-clamp-2"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
              >
                {{ software.description }}
              </p>

              <!-- Platform availability pills -->
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span
                  v-for="(avail, platform) in software.availability"
                  :key="platform"
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': avail.status === 'full',
                    'bg-yellow-100 text-yellow-700': avail.status === 'restricted',
                    'bg-gray-100 text-gray-600': avail.status === 'byol',
                    'bg-red-50 text-red-400': avail.status === 'unavailable'
                  }"
                >
                  <component :is="getPlatformIcon(platform)" class="w-3 h-3" />
                  {{ platform.toUpperCase() }}
                </span>
              </div>

              <!-- BYOL pricing if applicable -->
              <div
                v-if="getBestStatus(software) === 'byol'"
                class="text-xs mt-3 pt-2 border-t"
                :class="preferencesStore.darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-100'"
              >
                <template v-if="formatByolPricing(software)">
                  <div>
                    {{ formatByolPricing(software) }}
                    <span class="italic">(estimate)</span>
                  </div>
                  <a
                    :href="`mailto:rc-help@northwinds.edu?subject=License quote request: ${software.name}&body=I'm interested in using ${software.name} for my research project. Could you help me get an updated quote?`"
                    class="text-blue-500 hover:text-blue-600"
                  >
                    Request quote
                  </a>
                  <span v-if="software.license_server?.we_can_host" class="block text-blue-500 mt-1">
                    We can host your license
                  </span>
                </template>
                <a
                  v-else
                  :href="`mailto:rc-help@northwinds.edu?subject=License pricing request: ${software.name}&body=I'm interested in using ${software.name} for my research project. Could you help me get pricing information?`"
                  class="text-blue-500 hover:text-blue-600"
                >
                  Request pricing
                </a>
              </div>
            </div>

            <!-- Expanded details -->
            <div
              v-if="expandedSoftware === software.slug"
              class="px-4 pb-4 pt-0 border-t"
              :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
            >
              <div class="mt-4 space-y-4">
                <!-- Platform details -->
                <div>
                  <h5
                    class="text-sm font-medium mb-2"
                    :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    Platform Availability
                  </h5>
                  <div class="space-y-2">
                    <div
                      v-for="(avail, platform) in software.availability"
                      :key="platform"
                      class="flex items-start gap-3 text-sm"
                    >
                      <component
                        :is="getPlatformIcon(platform)"
                        class="w-4 h-4 mt-0.5 flex-shrink-0"
                        :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
                      />
                      <div>
                        <span
                          class="font-medium"
                          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                        >
                          {{ platform.toUpperCase() }}:
                        </span>
                        <span
                          :class="{
                            'text-green-600': avail.status === 'full',
                            'text-yellow-600': avail.status === 'restricted',
                            'text-gray-500': avail.status === 'byol',
                            'text-red-500': avail.status === 'unavailable'
                          }"
                        >
                          {{ getStatusInfo(avail.status).label }}
                        </span>
                        <span
                          v-if="avail.notes"
                          class="ml-1"
                          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                        >
                          - {{ avail.notes }}
                        </span>
                        <span
                          v-if="avail.versions"
                          class="ml-1"
                          :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
                        >
                          ({{ avail.versions.join(', ') }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- BYOL info -->
                <div v-if="software.license_info">
                  <h5
                    class="text-sm font-medium mb-2"
                    :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    Licensing
                  </h5>
                  <div
                    class="text-sm"
                    :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
                  >
                    <p v-if="software.license_info.cost_notes">
                      {{ software.license_info.cost_notes }}
                    </p>
                    <p v-if="software.license_server?.we_can_host" class="mt-1 text-blue-500">
                      We can host your license server at no additional cost.
                      Contact: {{ software.license_server.contact || 'rc-help@northwinds.edu' }}
                    </p>
                  </div>
                </div>

                <!-- Links -->
                <div class="flex gap-3">
                  <a
                    v-if="software.documentation_url"
                    :href="software.documentation_url"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    <Info class="w-4 h-4" />
                    Documentation
                  </a>
                  <a
                    v-if="software.website"
                    :href="software.website"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink class="w-4 h-4" />
                    Vendor Site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredSoftware.length === 0"
        class="text-center py-12"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        <p>No software matches your filters.</p>
        <button
          @click="clearFilters"
          class="mt-2 text-blue-500 hover:text-blue-600"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Selected software summary -->
    <div
      class="mt-8 p-4 rounded-lg"
      :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-gray-50'"
    >
      <h3
        class="font-medium mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        Selected Software ({{ sessionStore.session.selected_software.length }})
      </h3>
      <div
        v-if="sessionStore.session.selected_software.length === 0"
        class="text-sm"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        No software flagged. This step is optional - continue if you don't need specific software.
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="selected in sessionStore.session.selected_software"
          :key="selected.software_slug"
          class="flex items-center justify-between text-sm"
        >
          <div>
            <span :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
              {{ softwareList.find(s => s.slug === selected.software_slug)?.name || selected.software_slug }}
            </span>
            <span
              v-if="softwareList.find(s => s.slug === selected.software_slug)?.license_model === 'byol'"
              class="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700"
            >
              BYOL
            </span>
          </div>
          <button
            @click="sessionStore.removeSoftware(selected.software_slug)"
            class="text-red-600 hover:text-red-700 p-1"
          >
            <X class="w-4 h-4" />
          </button>
        </li>
      </ul>

      <!-- BYOL reminder -->
      <div
        v-if="sessionStore.session.selected_software.some(s => softwareList.find(sw => sw.slug === s.software_slug)?.license_model === 'byol')"
        class="mt-4 p-3 rounded border"
        :class="preferencesStore.darkMode
          ? 'bg-yellow-900/30 border-yellow-700'
          : 'bg-yellow-50 border-yellow-200'"
      >
        <div class="flex gap-2">
          <AlertCircle class="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p
            class="text-sm"
            :class="preferencesStore.darkMode ? 'text-yellow-300' : 'text-yellow-700'"
          >
            Some selected software requires separate licensing (BYOL).
            These costs will be noted in your budget but must be purchased directly from vendors.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
