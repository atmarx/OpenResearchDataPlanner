<script setup>
import { ref, computed } from 'vue'
import { useSlateStore } from '@/stores/slateStore'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { ChevronUp, ChevronDown, ArrowRight, FileText, Trash2, CheckCircle, Shield, MessageSquare } from 'lucide-vue-next'
import ExportModal from './ExportModal.vue'

const slateStore = useSlateStore()
const configStore = useConfigStore()
const sessionStore = useSessionStore()

// Export modal state
const showExportModal = ref(false)

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
 * The expanded panel only renders when there's actually something to show.
 * Drive the outer container height AND the panel v-if from this single
 * source so they can't desync — e.g. deleting the last item while expanded
 * used to leave a tall, empty raised footer.
 */
const showExpandedPanel = computed(
  () => isExpanded.value && !slateStore.isEmpty && !slateStore.isSubmitted
)

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
 * Per-item free-allocation split, computed live from the pricing engine so the
 * slate shows "X included free / Y billable" instead of silently swallowing the
 * free floor into the total (Bramford's s02 trust gap). Keyed by item id; only
 * present when the service actually has a free allocation.
 */
const allocations = computed(() => {
  const map = {}
  for (const item of slateStore.slate.items) {
    const costs = slateStore.calculateItemCosts(item.service, item.quantity)
    if (costs && costs.freeUnits > 0) {
      const unit = item.unit || costs.unitLabel
      map[item.id] = {
        free: `${costs.freeUnits.toLocaleString()} ${unit} included free`,
        billable: `${costs.billable.toLocaleString()} ${unit} billable`
      }
    }
  }
  return map
})

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
  // Collapse if that was the last thing in the slate — otherwise isExpanded
  // stays true and the footer re-raises (empty) the next time an item is added.
  if (slateStore.isEmpty) isExpanded.value = false
}

/**
 * Edit an item's quantity (size) inline and recalculate its cost.
 * Guards against negative or non-numeric input.
 */
function handleQuantityInput(itemId, value) {
  const next = Number(value)
  if (!Number.isFinite(next) || next < 0) return
  slateStore.updateQuantity(itemId, next)
}

/**
 * Remove software from the slate
 */
function handleRemoveSoftware(softwareId) {
  slateStore.removeSoftware(softwareId)
  if (slateStore.isEmpty) isExpanded.value = false
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
    :class="showExpandedPanel ? 'h-[40vh] md:h-[35vh]' : 'h-auto'"
  >
    <!-- Collapsed Bar -->
    <div
      class="bg-primary text-on-primary shadow-lg border-t border-primary"
      :class="{ 'rounded-t-lg': isExpanded }"
    >
      <div class="max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-3">
        <!-- Empty State -->
        <div v-if="slateStore.isEmpty && !slateStore.isSubmitted" class="flex items-center justify-center gap-3 text-on-primary">
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
              <span class="text-on-primary">{{ summaryText }}</span>
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
              class="flex items-center gap-2 bg-surface text-primary px-4 py-2 rounded-lg font-medium hover:bg-surface-alt transition-colors"
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
      v-if="showExpandedPanel"
      id="slate-expanded"
      class="border-x overflow-y-auto bg-surface border-border"
      :style="{ height: 'calc(40vh - 56px)' }"
    >
      <div class="max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-4">
        <!-- Services Section -->
        <div v-if="slateStore.itemCount > 0" class="mb-6">
          <h3 class="text-sm font-semibold uppercase tracking-wide mb-3 text-text-muted">
            Services
          </h3>
          <div class="space-y-3">
            <div
              v-for="item in slateStore.slate.items"
              :key="item.id"
              class="rounded-lg overflow-hidden bg-surface-alt"
            >
              <!-- Main row -->
              <div class="flex items-center justify-between px-4 py-3">
                <div class="flex-1">
                  <div class="font-medium text-text">
                    {{ getServiceName(item.service) }}
                  </div>
                  <!-- Editable size — recomputes cost on change via updateQuantity -->
                  <div class="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      inputmode="decimal"
                      :value="item.quantity"
                      @change="handleQuantityInput(item.id, $event.target.value)"
                      min="0"
                      step="any"
                      class="w-28 text-sm px-2 py-1 rounded border bg-surface border-border-strong text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      :aria-label="`Quantity in ${item.unit}`"
                    />
                    <span class="text-sm text-text-muted">{{ item.unit }}</span>
                  </div>
                  <!-- Free-allocation split (only when the service has a free floor) -->
                  <div
                    v-if="allocations[item.id]"
                    class="flex flex-wrap items-center gap-x-1.5 mt-1.5 text-xs"
                  >
                    <span class="font-medium text-green-600 dark:text-green-400">
                      {{ allocations[item.id].free }}
                    </span>
                    <span class="text-text-muted">·</span>
                    <span class="text-text-muted">{{ allocations[item.id].billable }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <div class="font-semibold text-text">
                      {{ formatCurrency(item.annualEstimate) }}/yr
                    </div>
                    <div class="text-xs text-text-muted">
                      {{ formatCurrency(item.monthlyEstimate) }}/mo
                    </div>
                  </div>
                  <button
                    @click="handleRemoveItem(item.id)"
                    class="p-2 rounded-lg transition-colors text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                    title="Remove from slate"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Notes section -->
              <div class="px-4 pb-3 border-t border-border">
                <div class="flex items-start gap-2 mt-2">
                  <MessageSquare class="w-4 h-4 mt-2 flex-shrink-0 text-text-muted" />
                  <textarea
                    :value="item.notes || ''"
                    @input="slateStore.updateItemNotes(item.id, $event.target.value)"
                    placeholder="Add notes for IT (optional)..."
                    rows="2"
                    class="flex-1 text-sm px-2 py-1.5 rounded border resize-none bg-surface border-border-strong text-text-secondary placeholder:text-text-muted"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Software Section -->
        <div v-if="slateStore.softwareCount > 0" class="mb-6">
          <h3 class="text-sm font-semibold uppercase tracking-wide mb-3 text-text-muted">
            Software
          </h3>
          <div class="space-y-2">
            <div
              v-for="sw in slateStore.slate.software"
              :key="sw.id"
              class="flex items-center justify-between rounded-lg px-4 py-3 bg-surface-alt"
            >
              <div class="flex-1">
                <div class="font-medium text-text">{{ sw.id }}</div>
                <div class="text-sm text-text-muted">{{ sw.licenseModel }}</div>
              </div>
              <div class="flex items-center gap-4">
                <div v-if="sw.costToUser !== null" class="text-right">
                  <div class="font-semibold text-text">
                    {{ formatCurrency(sw.costToUser) }}/{{ sw.costPeriod || 'yr' }}
                  </div>
                </div>
                <div v-else class="text-sm text-text-muted">
                  Included
                </div>
                <button
                  @click="handleRemoveSoftware(sw.id)"
                  class="p-2 rounded-lg transition-colors text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                  title="Remove from slate"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="border-t pt-4 flex items-center justify-between border-border">
          <div class="text-text-secondary">
            Estimated annual total
          </div>
          <div class="text-xl font-bold text-text">
            {{ formatCurrency(slateStore.totalAnnualCost) }}/yr
          </div>
        </div>

        <!-- Actions (placeholder for full review modal) -->
        <div class="mt-6 flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-lg transition-colors text-text-secondary bg-surface-alt hover:bg-border"
            @click="isExpanded = false"
          >
            Collapse
          </button>
          <button
            class="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-dark transition-colors"
            @click="showExportModal = true"
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

  <!-- Export Modal -->
  <ExportModal
    v-if="showExportModal"
    @close="showExportModal = false"
  />

  <!-- Spacer to prevent content from being hidden under fixed footer -->
  <div v-if="configStore.config" class="h-14"></div>
</template>
