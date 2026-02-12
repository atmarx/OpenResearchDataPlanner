<script setup>
import { ref, computed } from 'vue'
import { useWorkbenchStore } from '@/stores/workbenchStore'
import { useConfigStore } from '@/stores/configStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { usePdfExport } from '@/composables/usePdfExport'
import {
  User,
  Mail,
  Building,
  Calendar,
  FileText,
  MessageSquare,
  Check,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  Download,
  Send,
  FileCheck
} from 'lucide-vue-next'

const workbenchStore = useWorkbenchStore()
const configStore = useConfigStore()
const preferencesStore = usePreferencesStore()
const { downloadApprovalPdf } = usePdfExport()

const plan = computed(() => workbenchStore.activePlan)
const slate = computed(() => plan.value?.data?.slate || {})
const contact = computed(() => plan.value?.data?.contact || null)

// Track which items are expanded
const expandedItems = ref(new Set())

// Item notes being edited
const editingNotes = ref({})

function toggleItem(itemId) {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId)
  } else {
    expandedItems.value.add(itemId)
  }
}

function getServiceName(serviceSlug) {
  return configStore.servicesBySlug[serviceSlug]?.name || serviceSlug
}

function formatCurrency(amount) {
  if (amount == null) return 'TBD'
  return '$' + amount.toLocaleString()
}

function formatDate(iso) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Item status management
function getItemStatus(item) {
  return item.itStatus || 'pending'
}

function setItemStatus(item, status) {
  // Update item in the plan data
  item.itStatus = status
  item.itReviewedAt = new Date().toISOString()
  item.itReviewedBy = workbenchStore.staffName
  workbenchStore.savePlans()
}

function saveItemNotes(item) {
  const notes = editingNotes.value[item.id]
  if (notes !== undefined) {
    item.itNotes = notes || null
    item.itReviewedAt = new Date().toISOString()
    item.itReviewedBy = workbenchStore.staffName
    delete editingNotes.value[item.id]
    workbenchStore.savePlans()
  }
}

function startEditingNotes(item) {
  editingNotes.value[item.id] = item.itNotes || ''
}

function cancelEditingNotes(item) {
  delete editingNotes.value[item.id]
}

// Plan-level actions
function updatePlanStatus(status) {
  if (plan.value) {
    workbenchStore.updatePlanStatus(plan.value.id, status)
  }
}

function removePlan() {
  if (plan.value && confirm(`Remove "${plan.value.projectName}" from the workbench?`)) {
    workbenchStore.removePlan(plan.value.id)
  }
}

// Export for round-trip
const showExportModal = ref(false)
const exportNote = ref('')

function openExportModal() {
  exportNote.value = getDefaultExportNote()
  showExportModal.value = true
}

function getDefaultExportNote() {
  const status = plan.value?.status
  if (status === 'approved') return 'Plan approved - ready for provisioning'
  if (status === 'needs_revision') return 'Please review IT comments and resubmit'
  return 'Support review completed'
}

function handleExport() {
  if (plan.value) {
    workbenchStore.downloadPlanJSON(plan.value.id, exportNote.value || 'Support review')
    showExportModal.value = false
  }
}

// PDF generation for approved plans
const isGeneratingPdf = ref(false)

async function handleDownloadPdf() {
  if (plan.value && !isGeneratingPdf.value) {
    isGeneratingPdf.value = true
    try {
      await downloadApprovalPdf(plan.value, {
        approvedBy: workbenchStore.staffName
      })
    } finally {
      isGeneratingPdf.value = false
    }
  }
}

// Calculate review progress
const reviewProgress = computed(() => {
  const items = slate.value.items || []
  if (items.length === 0) return { reviewed: 0, total: 0, percent: 0 }

  const reviewed = items.filter(i => i.itStatus && i.itStatus !== 'pending').length
  return {
    reviewed,
    total: items.length,
    percent: Math.round((reviewed / items.length) * 100)
  }
})

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'gray' },
  { value: 'approved', label: 'Approved', icon: Check, color: 'green' },
  { value: 'needs_info', label: 'Needs Info', icon: MessageSquare, color: 'yellow' },
  { value: 'flagged', label: 'Flagged', icon: AlertTriangle, color: 'red' }
]

function getStatusOption(status) {
  return statusOptions.find(o => o.value === status) || statusOptions[0]
}

function getStatusClasses(status) {
  const option = getStatusOption(status)
  const colors = {
    gray: preferencesStore.darkMode
      ? 'bg-gray-700 text-gray-300'
      : 'bg-gray-100 text-gray-600',
    green: preferencesStore.darkMode
      ? 'bg-green-900/50 text-green-300'
      : 'bg-green-100 text-green-700',
    yellow: preferencesStore.darkMode
      ? 'bg-yellow-900/50 text-yellow-300'
      : 'bg-yellow-100 text-yellow-700',
    red: preferencesStore.darkMode
      ? 'bg-red-900/50 text-red-300'
      : 'bg-red-100 text-red-700'
  }
  return colors[option.color]
}
</script>

<template>
  <div v-if="plan" class="space-y-6">
    <!-- Plan Header -->
    <div
      class="rounded-lg border p-5"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2
            class="text-xl font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ plan.projectName }}
          </h2>

          <!-- Tier Badge -->
          <div
            v-if="plan.data?.tier_name"
            class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm"
            :class="preferencesStore.darkMode
              ? 'bg-indigo-900/50 text-indigo-300'
              : 'bg-indigo-100 text-indigo-700'"
          >
            {{ plan.data.tier_name }}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            @click="removePlan"
            class="p-2 rounded-lg transition-colors"
            :class="preferencesStore.darkMode
              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
              : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'"
            title="Remove from workbench"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Contact Info -->
      <div
        v-if="contact"
        class="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm"
        :class="preferencesStore.darkMode
          ? 'border-gray-700 text-gray-300'
          : 'border-gray-200 text-gray-600'"
      >
        <div v-if="contact.name" class="flex items-center gap-1.5">
          <User class="w-4 h-4" />
          {{ contact.name }}
        </div>
        <div v-if="contact.email" class="flex items-center gap-1.5">
          <Mail class="w-4 h-4" />
          <a
            :href="`mailto:${contact.email}`"
            class="hover:underline"
            :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
          >
            {{ contact.email }}
          </a>
        </div>
        <div v-if="contact.department" class="flex items-center gap-1.5">
          <Building class="w-4 h-4" />
          {{ contact.department }}
        </div>
      </div>

      <!-- Meta Info -->
      <div
        class="mt-3 flex flex-wrap gap-4 text-xs"
        :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
      >
        <div class="flex items-center gap-1">
          <Calendar class="w-3 h-3" />
          Exported: {{ formatDate(plan.data?.exported_at) }}
        </div>
        <div class="flex items-center gap-1">
          <Clock class="w-3 h-3" />
          Imported: {{ formatDate(plan.importedAt) }}
        </div>
      </div>

      <!-- Researcher Notes -->
      <div
        v-if="plan.data?.final_notes"
        class="mt-4 pt-4 border-t"
        :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
      >
        <div
          class="flex items-center gap-1.5 text-sm font-medium mb-2"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          <FileText class="w-4 h-4" />
          Researcher Notes
        </div>
        <p
          class="text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          {{ plan.data.final_notes }}
        </p>
      </div>
    </div>

    <!-- Review Progress -->
    <div
      class="rounded-lg border p-4"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="flex items-center justify-between mb-2">
        <span
          class="text-sm font-medium"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Review Progress
        </span>
        <span
          class="text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        >
          {{ reviewProgress.reviewed }} / {{ reviewProgress.total }} items
        </span>
      </div>
      <div
        class="h-2 rounded-full overflow-hidden"
        :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-200'"
      >
        <div
          class="h-full rounded-full transition-all"
          :class="reviewProgress.percent === 100
            ? (preferencesStore.darkMode ? 'bg-green-500' : 'bg-green-500')
            : (preferencesStore.darkMode ? 'bg-indigo-500' : 'bg-indigo-500')"
          :style="{ width: `${reviewProgress.percent}%` }"
        />
      </div>
    </div>

    <!-- Items List -->
    <div class="space-y-3">
      <h3
        class="text-sm font-medium"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        Requested Services ({{ slate.items?.length || 0 }})
      </h3>

      <div
        v-for="item in slate.items || []"
        :key="item.id"
        class="rounded-lg border overflow-hidden"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <!-- Item Header (clickable) -->
        <div
          class="px-4 py-3 cursor-pointer"
          :class="preferencesStore.darkMode
            ? 'hover:bg-gray-700/50'
            : 'hover:bg-gray-50'"
          @click="toggleItem(item.id)"
        >
          <div class="flex items-center gap-3">
            <component
              :is="expandedItems.has(item.id) ? ChevronUp : ChevronDown"
              class="w-4 h-4 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
            />

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ getServiceName(item.service) }}
                </span>
                <span
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="getStatusClasses(getItemStatus(item))"
                >
                  {{ getStatusOption(getItemStatus(item)).label }}
                </span>
              </div>
              <div
                class="text-sm"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ item.quantity }} {{ item.unit }}
              </div>
            </div>

            <div
              class="text-right"
              :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
            >
              <div class="font-medium">
                {{ formatCurrency(item.annualEstimate) }}/yr
              </div>
              <div
                class="text-xs"
                :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
              >
                {{ formatCurrency(item.monthlyEstimate) }}/mo
              </div>
            </div>
          </div>
        </div>

        <!-- Expanded Details -->
        <div
          v-if="expandedItems.has(item.id)"
          class="px-4 py-4 border-t"
          :class="preferencesStore.darkMode
            ? 'border-gray-700 bg-gray-800/50'
            : 'border-gray-200 bg-gray-50'"
        >
          <!-- Researcher's Notes -->
          <div v-if="item.notes" class="mb-4">
            <div
              class="text-xs font-medium mb-1"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Researcher's Notes
            </div>
            <p
              class="text-sm p-2 rounded"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-white text-gray-600'"
            >
              {{ item.notes }}
            </p>
          </div>

          <!-- Calculator Info -->
          <div v-if="item.fromCalculator" class="mb-4">
            <div
              class="text-xs font-medium mb-1"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Calculated via: {{ item.fromCalculator }}
            </div>
          </div>

          <!-- Status Selector -->
          <div class="mb-4">
            <div
              class="text-xs font-medium mb-2"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Review Status
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                @click="setItemStatus(item, option.value)"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                :class="[
                  getItemStatus(item) === option.value
                    ? getStatusClasses(option.value)
                    : (preferencesStore.darkMode
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
                ]"
              >
                <component :is="option.icon" class="w-4 h-4" />
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- IT Notes -->
          <div>
            <div
              class="text-xs font-medium mb-2"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Support Notes
            </div>

            <div v-if="editingNotes[item.id] !== undefined">
              <textarea
                v-model="editingNotes[item.id]"
                rows="3"
                placeholder="Add notes for the researcher..."
                class="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'"
              />
              <div class="mt-2 flex gap-2">
                <button
                  @click="saveItemNotes(item)"
                  class="px-3 py-1.5 rounded text-sm font-medium"
                  :class="preferencesStore.darkMode
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'"
                >
                  Save
                </button>
                <button
                  @click="cancelEditingNotes(item)"
                  class="px-3 py-1.5 rounded text-sm"
                  :class="preferencesStore.darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div v-else>
              <div
                v-if="item.itNotes"
                class="p-2 rounded text-sm mb-2"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-white border border-gray-200 text-gray-600'"
              >
                {{ item.itNotes }}
              </div>
              <button
                @click="startEditingNotes(item)"
                class="text-sm"
                :class="preferencesStore.darkMode
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'"
              >
                {{ item.itNotes ? 'Edit notes' : 'Add notes' }}
              </button>
            </div>

            <!-- Review metadata -->
            <div
              v-if="item.itReviewedBy"
              class="mt-2 text-xs"
              :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
            >
              Last reviewed by {{ item.itReviewedBy }} on {{ formatDate(item.itReviewedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cost Summary -->
    <div
      class="rounded-lg border p-4"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <h3
        class="text-sm font-medium mb-3"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        Cost Summary
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div
            class="text-xs"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
          >
            Monthly
          </div>
          <div
            class="text-lg font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ formatCurrency(plan.data?.totals?.monthly) }}
          </div>
        </div>
        <div>
          <div
            class="text-xs"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
          >
            Annual
          </div>
          <div
            class="text-lg font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ formatCurrency(plan.data?.totals?.annual) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Plan-Level Actions -->
    <div
      class="rounded-lg border p-4"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <h3
        class="text-sm font-medium mb-3"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        Plan Status
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          @click="updatePlanStatus('pending_review')"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="plan.status === 'pending_review'
            ? (preferencesStore.darkMode
                ? 'bg-yellow-900/50 text-yellow-300'
                : 'bg-yellow-100 text-yellow-700')
            : (preferencesStore.darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')"
        >
          Pending Review
        </button>
        <button
          @click="updatePlanStatus('needs_revision')"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="plan.status === 'needs_revision'
            ? (preferencesStore.darkMode
                ? 'bg-orange-900/50 text-orange-300'
                : 'bg-orange-100 text-orange-700')
            : (preferencesStore.darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')"
        >
          Needs Revision
        </button>
        <button
          @click="updatePlanStatus('approved')"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="plan.status === 'approved'
            ? (preferencesStore.darkMode
                ? 'bg-green-900/50 text-green-300'
                : 'bg-green-100 text-green-700')
            : (preferencesStore.darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')"
        >
          Approved
        </button>
      </div>

      <!-- PDF Receipt Button (shows when approved) -->
      <div
        v-if="plan.status === 'approved'"
        class="mt-4 pt-4 border-t"
        :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
      >
        <button
          @click="handleDownloadPdf"
          :disabled="isGeneratingPdf"
          class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          :class="[
            isGeneratingPdf ? 'opacity-50 cursor-wait' : '',
            preferencesStore.darkMode
              ? 'bg-green-600 text-white hover:bg-green-500'
              : 'bg-green-600 text-white hover:bg-green-700'
          ]"
        >
          <FileCheck class="w-4 h-4" />
          {{ isGeneratingPdf ? 'Generating PDF...' : 'Download Approval Receipt (PDF)' }}
        </button>
        <p
          class="mt-2 text-xs"
          :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
        >
          Generate a formal approval receipt for grant documentation.
        </p>
      </div>
    </div>

    <!-- Export for Round-Trip -->
    <div
      class="rounded-lg border p-4"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <h3
        class="text-sm font-medium mb-3"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        Send Back to Researcher
      </h3>
      <p
        class="text-sm mb-3"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
      >
        Export the reviewed plan with your notes and status updates. The researcher can re-import this file to see your feedback.
      </p>
      <button
        @click="openExportModal"
        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        :class="preferencesStore.darkMode
          ? 'bg-indigo-600 text-white hover:bg-indigo-500'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'"
      >
        <Send class="w-4 h-4" />
        Export Reviewed Plan
      </button>
    </div>

    <!-- Export Modal -->
    <Teleport to="body">
      <div
        v-if="showExportModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showExportModal = false"
      >
        <div
          class="rounded-xl shadow-2xl max-w-md w-full"
          :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
        >
          <div
            class="px-5 py-4 border-b"
            :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
          >
            <h2
              class="text-lg font-semibold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              Export Reviewed Plan
            </h2>
          </div>

          <div class="p-5 space-y-4">
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-700'"
              >
                Review Summary
              </label>
              <textarea
                v-model="exportNote"
                rows="3"
                placeholder="Brief note about this review..."
                class="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'"
              />
              <p
                class="mt-1 text-xs"
                :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
              >
                This note will be visible to the researcher in the version history.
              </p>
            </div>

            <div
              class="p-3 rounded-lg text-sm"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-600'"
            >
              <div class="flex items-center justify-between">
                <span>Current status:</span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs"
                  :class="getStatusClasses(plan.status)"
                >
                  {{ getStatusOption(plan.status).label }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span>Items reviewed:</span>
                <span>{{ reviewProgress.reviewed }} / {{ reviewProgress.total }}</span>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="showExportModal = false"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                Cancel
              </button>
              <button
                @click="handleExport"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="preferencesStore.darkMode
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'"
              >
                <Download class="w-4 h-4" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

  <!-- Empty State -->
  <div
    v-else
    class="text-center py-12"
  >
    <FileText
      class="w-12 h-12 mx-auto mb-3"
      :class="preferencesStore.darkMode ? 'text-gray-600' : 'text-gray-300'"
    />
    <p
      class="text-sm"
      :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
    >
      Select a plan to review
    </p>
  </div>
</template>
