<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useSlateStore } from '@/stores/slateStore'
import {
  X,
  Check,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Info,
  Filter,
  ShieldCheck
} from 'lucide-vue-next'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'

const router = useRouter()

const configStore = useConfigStore()
const slateStore = useSlateStore()

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('all')

// Modal state
const selectedService = ref(null)
const showQuickAdd = ref(false)
const quickAddQuantity = ref(1)

// Row descriptions toggle — on by default (show the per-service description)
const showDescriptions = ref(true)

function deploymentLabel(d) {
  return { 'on-prem': 'On-prem', cloud: 'Cloud', hybrid: 'Hybrid' }[d] || d
}

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
      s.description?.toLowerCase().includes(query)
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

// Collect compliance data from L3/L4 mappings for a service
function getServiceComplianceInfo(serviceSlug) {
  const highTiers = ['high', 'restricted']
  const complianceMappings = highTiers
    .map(tier => mappingsIndex.value[`${serviceSlug}-${tier}`])
    .filter(m => m?.compliance)

  if (!complianceMappings.length) return null

  const frameworks = [...new Set(complianceMappings.flatMap(m => m.compliance.frameworks || []))]
  const training = [...new Set(complianceMappings.flatMap(m => m.compliance.training_required || []))]
  const baaMapping = complianceMappings.find(m => m.compliance.baa_status === 'in_place')
  const timelinesRaw = complianceMappings.map(m => m.compliance.timeline).filter(Boolean)

  return {
    hasBaa: !!baaMapping,
    baaReference: baaMapping?.compliance.baa_reference || null,
    frameworks,
    training,
    timeline: timelinesRaw[timelinesRaw.length - 1] || null,
    auditLogging: complianceMappings.some(m => m.compliance.audit_logging),
    encryption: complianceMappings.find(m => m.compliance.encryption)?.compliance.encryption || null
  }
}

// Get tier color class — tier hues are PLATFORM-LOCKED status colours
// (never skinned), so keep literals and add dark: variants. The neutral
// fallback is chrome → semantic tokens.
function getTierColorClass(tierSlug) {
  const tier = tiers.value.find(t => t.slug === tierSlug)
  switch (tier?.color) {
    case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'orange': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default: return 'bg-surface-alt text-text'
  }
}
</script>

<template>
  <div
    class="min-h-screen transition-colors bg-canvas"
  >
    <!-- Header -->
    <div
      class="border-b sticky top-0 z-10 bg-surface border-border"
    >
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="mb-4">
          <h1
            class="text-2xl font-bold text-text"
          >Browse Services</h1>
          <p
            class="mt-1 text-text-secondary"
          >
            Explore available services by security tier
          </p>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search services..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface-alt border-border-strong text-text placeholder:text-text-muted"
            />
          </div>

          <!-- Category filter -->
          <div class="flex items-center gap-2">
            <Filter class="w-4 h-4 text-text-muted" />
            <select
              v-model="selectedCategory"
              class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface-alt border-border-strong text-text"
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

          <!-- Description toggle (on by default) -->
          <label class="flex items-center gap-2 text-sm cursor-pointer text-text-secondary whitespace-nowrap">
            <input type="checkbox" v-model="showDescriptions" class="rounded border-border-strong text-primary focus:ring-primary" />
            Show descriptions
          </label>
        </div>

        <!-- Tier legend -->
        <div class="flex items-center gap-4 mt-4 text-sm">
          <span class="text-text-muted">Tiers:</span>
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
          class="text-lg font-semibold mb-3 text-text"
        >
          {{ getCategoryInfo(categorySlug).name }}
        </h2>

        <!-- Service table -->
        <div
          class="rounded-lg border overflow-hidden bg-surface border-border"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead
                class="border-b bg-surface-alt border-border"
              >
                <tr>
                  <th
                    class="px-4 py-3 text-left text-sm font-medium min-w-[200px] text-text-secondary"
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
                    class="px-4 py-3 text-center text-sm font-medium w-[100px] text-text-secondary"
                  >
                    Add
                  </th>
                </tr>
              </thead>
              <tbody
                class="divide-y divide-border"
              >
                <tr
                  v-for="service in services"
                  :key="service.slug"
                  class="hover:bg-surface-alt"
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span
                        class="font-medium text-text"
                      >{{ service.name }}</span>
                      <!-- Deployment: on-prem / cloud (a service can be both) -->
                      <span
                        v-for="d in service.deployment || []"
                        :key="d"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium shrink-0"
                        :class="d === 'cloud'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'"
                      >
                        {{ deploymentLabel(d) }}
                      </span>
                      <!-- Tech / access badges (e.g. Globus) -->
                      <span
                        v-for="t in service.tech || []"
                        :key="t"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border bg-surface-alt text-text-secondary border-border shrink-0"
                      >
                        {{ t }}
                      </span>
                      <!-- BAA (compliance-derived: cloud services with a negotiated BAA) -->
                      <span
                        v-if="getServiceComplianceInfo(service.slug)?.hasBaa"
                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 shrink-0"
                        :title="getServiceComplianceInfo(service.slug)?.baaReference || 'BAA in place for sensitive data tiers'"
                      >
                        <ShieldCheck class="w-3 h-3" />
                        BAA
                      </span>
                    </div>
                    <!-- Description (toggle, on by default) -->
                    <div
                      v-if="showDescriptions"
                      class="text-sm mt-1 text-text-muted max-w-prose"
                    >
                      <AnnotatedText :text="service.description" />
                    </div>
                    <!-- External pricing calculator (cloud-variable services) -->
                    <a
                      v-if="service.pricing_url"
                      :href="service.pricing_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-block mt-1 text-xs hover:underline text-primary"
                    >
                      Estimate on the provider's pricing calculator →
                    </a>
                  </td>

                  <!-- Tier availability cells -->
                  <td
                    v-for="tier in tiers"
                    :key="tier.slug"
                    class="px-3 py-3 text-center"
                  >
                    <span
                      v-if="getAvailability(service.slug, tier.slug).status === 'available'"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <Check class="w-4 h-4" />
                    </span>
                    <span
                      v-else-if="getAvailability(service.slug, tier.slug).status === 'review'"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <AlertTriangle class="w-4 h-4" />
                    </span>
                    <span
                      v-else-if="getAvailability(service.slug, tier.slug).status === 'consultation'"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <Info class="w-4 h-4" />
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-alt text-text-muted"
                      :title="getAvailability(service.slug, tier.slug).label"
                    >
                      <XCircle class="w-4 h-4" />
                    </span>
                  </td>

                  <!-- Add button -->
                  <td class="px-4 py-3 text-center">
                    <button
                      @click="openQuickAdd(service)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary-dark"
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
        class="text-center py-12 text-text-muted"
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
          class="max-w-7xl mx-auto rounded-lg p-4 flex items-center justify-between shadow-lg border bg-surface border-border"
        >
          <div>
            <span
              class="font-medium text-primary"
            >Your Slate</span>
            <span
              class="ml-2 text-text-secondary"
            >
              {{ slateStore.itemCount }} service{{ slateStore.itemCount !== 1 ? 's' : '' }}
            </span>
          </div>
          <button
            @click="router.push('/')"
            class="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-dark"
          >
            Review Slate
          </button>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div
      class="max-w-7xl mx-auto px-4 py-4 mb-20 text-sm text-text-muted"
    >
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Check class="w-3 h-3" />
          </span>
          <span>Available</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle class="w-3 h-3" />
          </span>
          <span>Requires review</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <Info class="w-3 h-3" />
          </span>
          <span>Consultation needed</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-alt text-text-muted">
            <XCircle class="w-3 h-3" />
          </span>
          <span>Not available</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
            <ShieldCheck class="w-3 h-3" />
            BAA
          </span>
          <span>HIPAA Business Associate Agreement pre-negotiated</span>
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
          class="rounded-xl shadow-2xl max-w-md w-full p-6 bg-surface"
        >
          <h3
            class="text-lg font-semibold mb-2 text-text"
          >
            Add {{ selectedService.name }}
          </h3>
          <p
            class="text-sm mb-4 text-text-secondary"
          >
            <AnnotatedText :text="selectedService.description" />
          </p>

          <!-- Quantity input -->
          <div class="mb-6">
            <label
              class="block text-sm font-medium mb-1 text-text-secondary"
            >
              Quantity ({{ selectedService.cost_model?.unit_label || 'units' }})
            </label>
            <input
              v-model.number="quickAddQuantity"
              type="number"
              min="1"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface-alt border-border-strong text-text"
            />
            <p
              class="mt-1 text-xs text-text-muted"
            >
              Not sure?
              <button
                class="hover:underline text-primary"
                @click="router.push('/calculators')"
              >
                Use a calculator
              </button>
              to estimate your needs.
            </p>
          </div>

          <!-- Compliance Status -->
          <div
            v-if="selectedService && getServiceComplianceInfo(selectedService.slug)"
            class="mb-4 rounded-lg p-3 border bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800/50"
          >
            <div class="flex items-center gap-1.5 mb-2">
              <ShieldCheck class="w-4 h-4 text-teal-600" />
              <span
                class="text-sm font-semibold text-teal-800 dark:text-teal-300"
              >Compliance Status (L3/L4)</span>
            </div>
            <dl class="space-y-1 text-xs text-teal-900 dark:text-teal-200">
              <div v-if="getServiceComplianceInfo(selectedService.slug).hasBaa" class="flex gap-1">
                <dt class="font-medium shrink-0">BAA:</dt>
                <dd>In place — {{ getServiceComplianceInfo(selectedService.slug).baaReference || 'contact IT for details' }}</dd>
              </div>
              <div v-if="getServiceComplianceInfo(selectedService.slug).frameworks?.length" class="flex gap-1">
                <dt class="font-medium shrink-0">Frameworks:</dt>
                <dd>{{ getServiceComplianceInfo(selectedService.slug).frameworks.map(f => f.toUpperCase().replace('_', ' ')).join(', ') }}</dd>
              </div>
              <div v-if="getServiceComplianceInfo(selectedService.slug).timeline" class="flex gap-1">
                <dt class="font-medium shrink-0">Provisioning:</dt>
                <dd>{{ getServiceComplianceInfo(selectedService.slug).timeline }}</dd>
              </div>
              <div v-if="getServiceComplianceInfo(selectedService.slug).training?.length" class="flex gap-1">
                <dt class="font-medium shrink-0 mt-0.5">Training:</dt>
                <dd>
                  <ul class="list-disc list-inside">
                    <li v-for="t in getServiceComplianceInfo(selectedService.slug).training" :key="t">{{ t }}</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="showQuickAdd = false"
              class="flex-1 px-4 py-2 rounded-lg bg-surface-alt text-text-secondary hover:bg-border-strong"
            >
              Cancel
            </button>
            <button
              @click="addToSlate"
              class="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-dark"
            >
              Add to Slate
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
