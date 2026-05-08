<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
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
  Filter,
  Shield,
  ShieldAlert,
  Link,
  Check
} from 'lucide-vue-next'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const preferencesStore = usePreferencesStore()

// Search and filter state
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const platformFilter = ref('all')

// Modal state - controlled by URL hash
const selectedSoftwareSlug = ref(null)

// Get software config
const softwareConfig = computed(() => configStore.config?.software || {})
const softwareList = computed(() => softwareConfig.value.software || [])
const softwareCategories = computed(() => softwareConfig.value.categories || [])
const licenseStatuses = computed(() => softwareConfig.value.license_statuses || {})

// Filter software
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

  // Sort alphabetically
  return result.sort((a, b) => a.name.localeCompare(b.name))
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

// Get selected software object
const selectedSoftware = computed(() => {
  if (!selectedSoftwareSlug.value) return null
  return softwareList.value.find(sw => sw.slug === selectedSoftwareSlug.value)
})

// Open software modal (updates URL hash)
function openSoftware(slug) {
  selectedSoftwareSlug.value = slug
  window.history.replaceState(null, '', `#${slug}`)
}

// Close software modal (clears URL hash)
function closeSoftware() {
  selectedSoftwareSlug.value = null
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

// Handle hash changes (back/forward navigation)
function handleHashChange() {
  const hash = window.location.hash.slice(1)
  if (hash && softwareList.value.find(sw => sw.slug === hash)) {
    selectedSoftwareSlug.value = hash
  } else {
    selectedSoftwareSlug.value = null
  }
}

// Initialize from URL hash on mount
onMounted(() => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})

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

// Resolve the institutional default support contact from meta.contact.primary.
const defaultSoftwareSupportContact = computed(() => {
  const primary = configStore.config?.meta?.contact?.primary
  if (primary?.type === 'email' && primary?.value) return primary.value
  return 'rc-help@example.edu'
})

function getSoftwareSupportContact(software) {
  return software?.license_server?.contact || defaultSoftwareSupportContact.value
}

function getSoftwareSupportMailto(software, requestType) {
  const subjectPrefix = requestType === 'quote' ? 'License quote request' : 'License pricing request'
  const askWord = requestType === 'quote' ? 'an updated quote' : 'pricing information'
  const body = `I'm interested in using ${software.name} for my research project. Could you help me with ${askWord}?`
  return `mailto:${getSoftwareSupportContact(software)}?subject=${encodeURIComponent(`${subjectPrefix}: ${software.name}`)}&body=${encodeURIComponent(body)}`
}

function getPrimaryContactHref() {
  const primary = configStore.config?.meta?.contact?.primary
  if (!primary?.value) return `mailto:${defaultSoftwareSupportContact.value}`
  return primary.type === 'email' ? `mailto:${primary.value}` : primary.value
}

// Legend modal state
const legendModal = ref(null)

const legendDefinitions = {
  full: {
    title: 'Available',
    icon: 'full',
    description: 'Fully licensed and ready to use.',
    detail: 'No special permissions or purchases required. You can use this software on the listed platforms with your existing university account.'
  },
  restricted: {
    title: 'Restricted',
    icon: 'restricted',
    description: 'Available with limitations or approval required.',
    detail: 'Common restrictions include group-only access, per-PI licensing, core count limits, or a brief approval process. Check the software\'s detail page for specifics before starting a project.'
  },
  byol: {
    title: 'Bring Your Own License (BYOL)',
    icon: 'byol',
    description: 'The institution does not hold a site license for this software.',
    detail: 'You must purchase or register for your own license directly with the vendor before you can use it on institutional platforms. Contact us if you need help identifying the right license type for research use.'
  },
  unavailable: {
    title: 'Not Available',
    icon: 'unavailable',
    description: 'This software is not licensed or certified for use on this platform.',
    detail: 'It may be available on other platforms listed in the catalog. Contact us to discuss alternatives or to request that we evaluate licensing it.'
  },
  tier_limit: {
    title: 'Tier Limit',
    icon: null,
    description: 'This software has data security tier restrictions.',
    detail: 'For example, ≤L2 means it cannot be used with data classified L3 or higher. If your research involves sensitive, regulated, or restricted data, verify that this software is approved for your data tier before use.'
  },
  export_control: {
    title: 'Export Controlled',
    icon: null,
    description: 'This software is subject to U.S. export control regulations.',
    detail: 'EAR (Export Administration Regulations) or ITAR (International Traffic in Arms Regulations) may restrict who can access the software and how it can be shared. Deemed export rules may apply — contact your research compliance office if you work with international collaborators or students.'
  }
}

function openLegendModal(key) {
  legendModal.value = legendDefinitions[key] || null
}

function closeLegendModal() {
  legendModal.value = null
}

// Clear all filters
function clearFilters() {
  searchQuery.value = ''
  categoryFilter.value = 'all'
  statusFilter.value = 'all'
  platformFilter.value = 'all'
}

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value || categoryFilter.value !== 'all' || statusFilter.value !== 'all' || platformFilter.value !== 'all'
})

// Share URL for modal
const shareUrl = computed(() => {
  if (!selectedSoftware.value) return ''
  return `${window.location.origin}/software#${selectedSoftware.value.slug}`
})

// Copy to clipboard state
const copied = ref(false)

async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    // Fallback for older browsers
    const input = document.createElement('input')
    input.value = shareUrl.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

// Check if software has export control restrictions
function hasExportControl(software) {
  return software.export_control?.classification
}

// Check if software has tier restrictions
function hasTierRestrictions(software) {
  return software.tier_restrictions?.max_tier || software.tier_restrictions?.min_tier
}

// Format tier restriction for display
function formatTierRestriction(software) {
  const tr = software.tier_restrictions
  if (!tr) return null

  if (tr.min_tier && tr.max_tier) {
    return `${tr.min_tier}-${tr.max_tier}`
  } else if (tr.max_tier) {
    return `≤${tr.max_tier}`
  } else if (tr.min_tier) {
    return `≥${tr.min_tier}`
  }
  return null
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
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1
              class="text-2xl font-bold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              Software Catalog
            </h1>
            <p
              class="mt-1"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              Browse available research software by platform and availability
            </p>
          </div>
        </div>

        <!-- Search and filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search software..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-2">
            <Filter class="w-4 h-4 text-gray-400 hidden sm:block" />

            <!-- Category -->
            <select
              v-model="categoryFilter"
              class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'"
            >
              <option value="all">All Categories</option>
              <option
                v-for="cat in softwareCategories"
                :key="cat.slug"
                :value="cat.slug"
              >
                {{ cat.name }}
              </option>
            </select>

            <!-- Platform -->
            <select
              v-model="platformFilter"
              class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'"
            >
              <option value="all">All Platforms</option>
              <option value="hpc">HPC</option>
              <option value="vdi">VDI</option>
              <option value="cloud">Cloud</option>
            </select>

            <!-- Status -->
            <select
              v-model="statusFilter"
              class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'"
            >
              <option value="all">All Status</option>
              <option value="full">Available</option>
              <option value="restricted">Restricted</option>
              <option value="byol">BYOL Only</option>
            </select>

            <!-- Clear filters -->
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-sm px-2 py-1"
              :class="preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap items-center gap-4 mt-4 text-sm">
          <span :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'">Status:</span>
          <button @click="openLegendModal('full')" class="flex items-center gap-1 cursor-pointer rounded hover:opacity-75 transition-opacity" title="Click to learn more">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
              <CheckCircle class="w-3 h-3" />
            </span>
            <span class="underline decoration-dotted underline-offset-2" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">Available</span>
          </button>
          <button @click="openLegendModal('restricted')" class="flex items-center gap-1 cursor-pointer rounded hover:opacity-75 transition-opacity" title="Click to learn more">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle class="w-3 h-3" />
            </span>
            <span class="underline decoration-dotted underline-offset-2" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">Restricted</span>
          </button>
          <button @click="openLegendModal('byol')" class="flex items-center gap-1 cursor-pointer rounded hover:opacity-75 transition-opacity" title="Click to learn more">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-500">
              <ExternalLink class="w-3 h-3" />
            </span>
            <span class="underline decoration-dotted underline-offset-2" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">BYOL</span>
          </button>
          <button @click="openLegendModal('unavailable')" class="flex items-center gap-1 cursor-pointer rounded hover:opacity-75 transition-opacity" title="Click to learn more">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-500">
              <XCircle class="w-3 h-3" />
            </span>
            <span class="underline decoration-dotted underline-offset-2" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">N/A</span>
          </button>

          <span class="border-l pl-4 ml-2" :class="preferencesStore.darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'">Compliance:</span>
          <button @click="openLegendModal('tier_limit')" class="flex items-center gap-1 cursor-pointer rounded hover:opacity-75 transition-opacity" title="Click to learn more">
            <span class="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">≤L2</span>
            <span class="underline decoration-dotted underline-offset-2" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">Tier limit</span>
          </button>
          <button @click="openLegendModal('export_control')" class="flex items-center gap-1 cursor-pointer rounded hover:opacity-75 transition-opacity" title="Click to learn more">
            <span class="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">EAR</span>
            <span class="underline decoration-dotted underline-offset-2" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">Export control</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Software list by category -->
      <div class="space-y-8">
        <div v-for="group in softwareByCategory" :key="group.category.slug">
          <h2
            class="text-lg font-semibold mb-4"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ group.category.name }}
            <span
              class="text-sm font-normal ml-2"
              :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
            >
              ({{ group.software.length }})
            </span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="software in group.software"
              :key="software.slug"
              @click="openSoftware(software.slug)"
              class="rounded-lg border transition-all text-left p-3 hover:shadow-md"
              :class="preferencesStore.darkMode
                ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                : 'border-gray-200 bg-white hover:border-gray-300'"
            >
              <!-- Header row -->
              <div class="flex items-center gap-2">
                <!-- Status indicator -->
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="{
                    'bg-green-100 text-green-600': getBestStatus(software) === 'full',
                    'bg-yellow-100 text-yellow-600': getBestStatus(software) === 'restricted',
                    'bg-gray-100 text-gray-500': getBestStatus(software) === 'byol',
                    'bg-red-100 text-red-500': getBestStatus(software) === 'unavailable'
                  }"
                >
                  <component :is="getStatusInfo(getBestStatus(software)).icon" class="w-3.5 h-3.5" />
                </div>

                <!-- Name -->
                <h3
                  class="font-medium truncate flex-1"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ software.name }}
                </h3>

                <!-- OSS badge -->
                <span
                  v-if="software.vendor === 'Open Source'"
                  class="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 flex-shrink-0"
                >
                  OSS
                </span>

                <!-- Tier restriction badge -->
                <span
                  v-if="hasTierRestrictions(software)"
                  class="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 flex-shrink-0"
                  :title="software.tier_restrictions?.notes || 'Tier restrictions apply'"
                >
                  {{ formatTierRestriction(software) }}
                </span>

                <!-- Export control badge -->
                <span
                  v-if="hasExportControl(software)"
                  class="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 flex-shrink-0"
                  :title="software.export_control?.notes || 'Export controlled'"
                >
                  {{ software.export_control.classification }}
                </span>
              </div>

              <!-- Brief description -->
              <p
                v-if="software.description"
                class="text-xs mt-1 line-clamp-2"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
              >
                <AnnotatedText :text="software.description" />
              </p>

              <!-- Platform pills -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="(avail, platform) in software.availability"
                  :key="platform"
                  class="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded"
                  :class="{
                    'bg-green-100 text-green-700': avail.status === 'full',
                    'bg-yellow-100 text-yellow-700': avail.status === 'restricted',
                    'bg-gray-100 text-gray-500': avail.status === 'byol',
                    'bg-red-50 text-red-400': avail.status === 'unavailable'
                  }"
                >
                  <component :is="getPlatformIcon(platform)" class="w-3 h-3" />
                  {{ platform.toUpperCase() }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredSoftware.length === 0"
        class="text-center py-16"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        <Search class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="text-lg">No software found</p>
        <p class="mt-1">Try adjusting your search or filters</p>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="mt-4 px-4 py-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          :class="preferencesStore.darkMode && 'hover:bg-blue-900/30'"
        >
          Clear all filters
        </button>
      </div>
    </div>

    <!-- Summary footer -->
    <div
      class="max-w-7xl mx-auto px-4 py-6 text-sm border-t"
      :class="preferencesStore.darkMode
        ? 'text-gray-400 border-gray-700'
        : 'text-gray-500 border-gray-200'"
    >
      <div class="flex flex-wrap gap-6">
        <div>
          <strong>BYOL</strong> = Bring Your Own License (you must purchase separately)
        </div>
        <div>
          <strong>Restricted</strong> = License limits apply (e.g., core count, group access)
        </div>
      </div>
      <p class="mt-2">
        Need software that's not listed?
        <a :href="getPrimaryContactHref()" class="text-blue-500 hover:text-blue-600">Contact us</a>
        to discuss options.
      </p>
    </div>
  </div>

  <!-- Legend Definition Modal -->
  <Teleport to="body">
    <div
      v-if="legendModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click.self="closeLegendModal"
    >
      <div
        class="rounded-xl shadow-2xl max-w-sm w-full p-5"
        :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-start justify-between gap-3 mb-3">
          <h3
            class="text-base font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ legendModal.title }}
          </h3>
          <button
            @click="closeLegendModal"
            class="p-1 rounded"
            :class="preferencesStore.darkMode
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <p
          class="text-sm font-medium mb-1"
          :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-800'"
        >
          {{ legendModal.description }}
        </p>
        <p
          class="text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          {{ legendModal.detail }}
        </p>
      </div>
    </div>
  </Teleport>

  <!-- Software Detail Modal -->
  <Teleport to="body">
    <div
      v-if="selectedSoftware"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeSoftware"
    >
      <div
        class="rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`software-${selectedSoftware.slug}-title`"
      >
        <!-- Header -->
        <div
          class="sticky top-0 p-4 border-b flex items-start gap-3"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <!-- Status indicator -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="{
              'bg-green-100 text-green-600': getBestStatus(selectedSoftware) === 'full',
              'bg-yellow-100 text-yellow-600': getBestStatus(selectedSoftware) === 'restricted',
              'bg-gray-100 text-gray-500': getBestStatus(selectedSoftware) === 'byol',
              'bg-red-100 text-red-500': getBestStatus(selectedSoftware) === 'unavailable'
            }"
          >
            <component :is="getStatusInfo(getBestStatus(selectedSoftware)).icon" class="w-5 h-5" />
          </div>

          <div class="flex-1 min-w-0">
            <h2
              :id="`software-${selectedSoftware.slug}-title`"
              class="text-xl font-semibold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              {{ selectedSoftware.name }}
            </h2>
            <p
              v-if="selectedSoftware.vendor"
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ selectedSoftware.vendor }}
            </p>
          </div>

          <button
            @click="closeSoftware"
            class="p-2 rounded-lg"
            :class="preferencesStore.darkMode
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-5">
          <!-- Description (prefer long description if available) -->
          <p
            class="text-sm whitespace-pre-line"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
          >
            <AnnotatedText :text="selectedSoftware.description_long || selectedSoftware.description" />
          </p>

          <!-- Platform Availability -->
          <div>
            <h3
              class="text-sm font-semibold mb-2"
              :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-800'"
            >
              Platform Availability
            </h3>
            <div class="space-y-2">
              <div
                v-for="(avail, platform) in selectedSoftware.availability"
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
                  <div
                    v-if="avail.versions"
                    class="text-xs mt-0.5"
                    :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
                  >
                    Versions: {{ avail.versions.join(', ') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Compliance Restrictions -->
          <div v-if="hasExportControl(selectedSoftware) || hasTierRestrictions(selectedSoftware)">
            <h3
              class="text-sm font-semibold mb-2"
              :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-800'"
            >
              Compliance
            </h3>
            <div class="space-y-2 text-sm">
              <!-- Export control -->
              <div
                v-if="hasExportControl(selectedSoftware)"
                class="flex items-start gap-2 p-2 rounded-lg"
                :class="preferencesStore.darkMode ? 'bg-orange-900/30' : 'bg-orange-50'"
              >
                <ShieldAlert class="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span class="font-medium text-orange-700">
                    {{ selectedSoftware.export_control.classification }}
                    <span v-if="selectedSoftware.export_control.eccn" class="font-normal">
                      ({{ selectedSoftware.export_control.eccn }})
                    </span>
                  </span>
                  <span
                    v-if="selectedSoftware.export_control.restriction === 'us_persons'"
                    class="block text-orange-600"
                  >
                    US persons only
                  </span>
                  <span
                    v-else-if="selectedSoftware.export_control.restriction === 'us_citizens'"
                    class="block text-orange-600"
                  >
                    US citizens only
                  </span>
                  <p
                    v-if="selectedSoftware.export_control.notes"
                    class="mt-1"
                    :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
                  >
                    {{ selectedSoftware.export_control.notes }}
                  </p>
                </div>
              </div>

              <!-- Tier restrictions -->
              <div
                v-if="hasTierRestrictions(selectedSoftware)"
                class="flex items-start gap-2 p-2 rounded-lg"
                :class="preferencesStore.darkMode ? 'bg-purple-900/30' : 'bg-purple-50'"
              >
                <Shield class="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span class="font-medium text-purple-700">
                    Tier {{ formatTierRestriction(selectedSoftware) }}
                  </span>
                  <p
                    v-if="selectedSoftware.tier_restrictions.notes"
                    class="mt-1"
                    :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
                  >
                    {{ selectedSoftware.tier_restrictions.notes }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Licensing (for BYOL) -->
          <div v-if="getBestStatus(selectedSoftware) === 'byol'">
            <h3
              class="text-sm font-semibold mb-2"
              :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-800'"
            >
              Licensing
            </h3>
            <div
              class="text-sm p-3 rounded-lg"
              :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <p
                v-if="formatByolPricing(selectedSoftware)"
                :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
              >
                Estimated cost: {{ formatByolPricing(selectedSoftware) }}
                <span class="italic">(requires confirmation)</span>
              </p>
              <p
                v-if="selectedSoftware.license_info?.cost_notes"
                class="mt-1"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ selectedSoftware.license_info.cost_notes }}
              </p>
              <p v-if="selectedSoftware.license_server?.we_can_host" class="mt-2 text-blue-500">
                We can host your license server at no additional cost.
              </p>
              <a
                :href="getSoftwareSupportMailto(selectedSoftware, 'quote')"
                class="inline-block mt-2 text-blue-500 hover:text-blue-600 font-medium"
              >
                Request quote from us
              </a>
            </div>
          </div>

          <!-- Links -->
          <div
            v-if="selectedSoftware.institutional_support_url || selectedSoftware.documentation_url || selectedSoftware.website"
            class="flex flex-wrap gap-4 pt-2"
          >
            <a
              v-if="selectedSoftware.institutional_support_url"
              :href="selectedSoftware.institutional_support_url"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600"
            >
              <Info class="w-4 h-4" />
              {{ selectedSoftware.institutional_support_label || 'Institutional Support' }}
            </a>
            <a
              v-if="selectedSoftware.documentation_url"
              :href="selectedSoftware.documentation_url"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600"
            >
              <Info class="w-4 h-4" />
              Documentation
            </a>
            <a
              v-if="selectedSoftware.website"
              :href="selectedSoftware.website"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600"
            >
              <ExternalLink class="w-4 h-4" />
              Vendor Site
            </a>
          </div>
        </div>

        <!-- Footer with copy link -->
        <div
          class="px-4 py-3 border-t flex items-center justify-between"
          :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-100'"
        >
          <button
            @click="copyShareUrl"
            class="inline-flex items-center gap-1.5 text-sm transition-colors"
            :class="copied
              ? 'text-green-500'
              : (preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700')"
          >
            <component :is="copied ? Check : Link" class="w-4 h-4" />
            {{ copied ? 'Link copied!' : 'Copy link' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
