<script setup>
import { ref, computed } from 'vue'
import { useSlateStore } from '@/stores/slateStore'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { ChevronUp, ChevronDown, ArrowRight, FileText, Trash2, CheckCircle, Shield } from 'lucide-vue-next'

const slateStore = useSlateStore()
const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

/**
 * Get the selected tier config for display
 */
const selectedTierConfig = computed(() => {
  if (!sessionStore.selectedTier) return null
  return configStore.tiersBySlug[sessionStore.selectedTier]
})

/**
 * Tier badge colors based on tier color
 */
const tierBadgeClasses = computed(() => {
  if (!selectedTierConfig.value) return ''
  const color = selectedTierConfig.value.color
  switch (color) {
    case 'green': return 'bg-green-500/20 text-green-100 border-green-400/30'
    case 'yellow': return 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30'
    case 'orange': return 'bg-orange-500/20 text-orange-100 border-orange-400/30'
    case 'red': return 'bg-red-500/20 text-red-100 border-red-400/30'
    default: return 'bg-white/10 text-white border-white/20'
  }
})

const isExpanded = ref(false)

/**
 * Format currency for display
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'TBD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Get service display name from slug
 */
function getServiceName(slug) {
  const service = configStore.servicesBySlug[slug]
  return service?.name || slug
}

/**
 * Summary text for collapsed view
 */
const summaryText = computed(() => {
  const serviceCount = slateStore.itemCount
  const softwareCount = slateStore.softwareCount

  const parts = []
  if (serviceCount > 0) {
    parts.push(`${serviceCount} service${serviceCount !== 1 ? 's' : ''}`)
  }
  if (softwareCount > 0) {
    parts.push(`${softwareCount} software`)
  }

  return parts.join(' + ')
})

/**
 * Toggle expanded/collapsed state
 */
function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

/**
 * Navigate to review/submit flow
 */
function goToReview() {
  // For now, just expand. Full review modal comes in later sprint.
  isExpanded.value = true
}

/**
 * Remove an item from the slate
 */
function handleRemoveItem(itemId) {
  slateStore.removeItem(itemId)
}

/**
 * Remove software from the slate
 */
function handleRemoveSoftware(softwareId) {
  slateStore.removeSoftware(softwareId)
}

/**
 * Clear the entire slate
 */
function handleWipeSlate() {
  if (confirm('Remove all items from your slate? This cannot be undone.')) {
    slateStore.wipeSlate()
    isExpanded.value = false
  }
}
</script>

<template>
  <!-- Slate Footer - Only show when config is loaded -->
  <div
    v-if="configStore.config"
    class="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out"
    :class="isExpanded ? 'h-[40vh] md:h-[35vh]' : 'h-auto'"
  >
    <!-- Collapsed Bar -->
    <div
      class="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-t border-blue-500"
      :class="{ 'rounded-t-lg': isExpanded }"
    >
      <div class="max-w-5xl mx-auto px-4 py-3">
        <!-- Empty State -->
        <div v-if="slateStore.isEmpty && !slateStore.isSubmitted" class="flex items-center justify-center gap-3 text-blue-100">
          <FileText class="w-5 h-5" />
          <!-- Show tier if selected -->
          <span
            v-if="selectedTierConfig"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
            :class="tierBadgeClasses"
          >
            <Shield class="w-3 h-3" />
            {{ selectedTierConfig.short_name || selectedTierConfig.name }}
          </span>
          <span class="text-sm">Start building your slate by exploring services or calculators</span>
        </div>

        <!-- Has Items State -->
        <div v-else-if="!slateStore.isSubmitted" class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Toggle button -->
            <button
              @click="toggleExpanded"
              class="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
              :aria-expanded="isExpanded"
              aria-controls="slate-expanded"
            >
              <component
                :is="isExpanded ? ChevronDown : ChevronUp"
                class="w-5 h-5"
              />
            </button>

            <!-- Summary -->
            <div class="flex items-center gap-3">
              <span class="font-medium">Your Slate:</span>
              <!-- Tier Badge -->
              <span
                v-if="selectedTierConfig"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
                :class="tierBadgeClasses"
              >
                <Shield class="w-3 h-3" />
                {{ selectedTierConfig.short_name || selectedTierConfig.name }}
              </span>
              <span class="text-blue-100">{{ summaryText }}</span>
              <span class="text-white/60">•</span>
              <span class="font-semibold">{{ formatCurrency(slateStore.totalAnnualCost) }}/yr</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="handleWipeSlate"
              class="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Clear slate"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <button
              @click="goToReview"
              class="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Review
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Submitted State -->
        <div v-else class="flex items-center justify-center gap-3 text-green-100">
          <CheckCircle class="w-5 h-5" />
          <span class="font-medium">
            Request {{ slateStore.slate.requestId || 'submitted' }}
          </span>
          <span class="text-white/60">•</span>
          <span class="text-sm">Pending review</span>
        </div>
      </div>
    </div>

    <!-- Expanded Panel -->
    <div
      v-if="isExpanded && !slateStore.isEmpty && !slateStore.isSubmitted"
      id="slate-expanded"
      class="border-x overflow-y-auto"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
      :style="{ height: 'calc(40vh - 56px)' }"
    >
      <div class="max-w-5xl mx-auto px-4 py-4">
        <!-- Services Section -->
        <div v-if="slateStore.itemCount > 0" class="mb-6">
          <h3
            class="text-sm font-semibold uppercase tracking-wide mb-3"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            Services
          </h3>
          <div class="space-y-2">
            <div
              v-for="item in slateStore.slate.items"
              :key="item.id"
              class="flex items-center justify-between rounded-lg px-4 py-3"
              :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <div class="flex-1">
                <div
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ getServiceName(item.service) }}
                </div>
                <div
                  class="text-sm"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                >
                  {{ item.quantity.toLocaleString() }} {{ item.unit }}
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <div
                    class="font-semibold"
                    :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                  >
                    {{ formatCurrency(item.annualEstimate) }}/yr
                  </div>
                  <div
                    class="text-xs"
                    :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                  >
                    {{ formatCurrency(item.monthlyEstimate) }}/mo
                  </div>
                </div>
                <button
                  @click="handleRemoveItem(item.id)"
                  class="p-2 rounded-lg transition-colors"
                  :class="preferencesStore.darkMode
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'"
                  title="Remove from slate"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Software Section -->
        <div v-if="slateStore.softwareCount > 0" class="mb-6">
          <h3
            class="text-sm font-semibold uppercase tracking-wide mb-3"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            Software
          </h3>
          <div class="space-y-2">
            <div
              v-for="sw in slateStore.slate.software"
              :key="sw.id"
              class="flex items-center justify-between rounded-lg px-4 py-3"
              :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <div class="flex-1">
                <div
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >{{ sw.id }}</div>
                <div
                  class="text-sm"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                >{{ sw.licenseModel }}</div>
              </div>
              <div class="flex items-center gap-4">
                <div v-if="sw.costToUser !== null" class="text-right">
                  <div
                    class="font-semibold"
                    :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                  >
                    {{ formatCurrency(sw.costToUser) }}/{{ sw.costPeriod || 'yr' }}
                  </div>
                </div>
                <div
                  v-else
                  class="text-sm"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                >
                  Included
                </div>
                <button
                  @click="handleRemoveSoftware(sw.id)"
                  class="p-2 rounded-lg transition-colors"
                  :class="preferencesStore.darkMode
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'"
                  title="Remove from slate"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div
          class="border-t pt-4 flex items-center justify-between"
          :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
        >
          <div :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">
            Estimated annual total
          </div>
          <div
            class="text-xl font-bold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ formatCurrency(slateStore.totalAnnualCost) }}/yr
          </div>
        </div>

        <!-- Actions (placeholder for full review modal) -->
        <div class="mt-6 flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-lg transition-colors"
            :class="preferencesStore.darkMode
              ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
            @click="isExpanded = false"
          >
            Collapse
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export for Grant
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit to Research IT
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Spacer to prevent content from being hidden under fixed footer -->
  <div v-if="configStore.config" class="h-14"></div>
</template>
