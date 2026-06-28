<script setup>
import { ref, computed } from 'vue'
import { useWorkbenchStore } from '@/stores/workbenchStore'
import { Upload, FileJson, FolderOpen, Clock, ChevronDown } from 'lucide-vue-next'
import PlanReview from './PlanReview.vue'
import WorkbenchFeedback from './WorkbenchFeedback.vue'

const workbenchStore = useWorkbenchStore()

const isDragging = ref(false)
const fileInput = ref(null)
const importError = ref('')
const showPlanSwitcher = ref(false)

const hasActivePlan = computed(() => workbenchStore.activePlan !== null)

function handleDragOver(e) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e) {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) {
    handleFiles(files)
  }
}

function handleFileSelect(e) {
  const files = e.target?.files
  if (files?.length) {
    handleFiles(files)
  }
}

async function handleFiles(files) {
  importError.value = ''

  for (const file of files) {
    if (!file.name.endsWith('.json')) {
      importError.value = 'Please select a JSON file'
      continue
    }

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate it's a plan export
      if (!data.schema_version && !data.export_version) {
        importError.value = 'This file does not appear to be a valid plan export'
        continue
      }

      workbenchStore.importPlan(data)
    } catch (e) {
      importError.value = `Failed to parse ${file.name}: ${e.message}`
    }
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function openFileDialog() {
  fileInput.value?.click()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function getStatusBadge(status) {
  const badges = {
    pending_review: {
      label: 'Pending Review',
      class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
    },
    in_review: {
      label: 'In Review',
      class: 'bg-surface-alt text-primary'
    },
    needs_revision: {
      label: 'Needs Revision',
      class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
    },
    approved: {
      label: 'Approved',
      class: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
    }
  }
  return badges[status] || badges.pending_review
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Two-column layout when plans loaded -->
    <div v-if="workbenchStore.planCount > 0" class="flex gap-6">
      <!-- Left Sidebar: Plans List -->
      <div class="w-72 flex-shrink-0">
        <!-- Plan Switcher Dropdown -->
        <div class="relative mb-4">
          <button
            @click="showPlanSwitcher = !showPlanSwitcher"
            class="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left bg-surface border-border text-text hover:border-border-strong"
          >
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">
                {{ workbenchStore.activePlan?.projectName || 'Select a plan' }}
              </div>
              <div class="text-xs text-text-muted">
                {{ workbenchStore.planCount }} plan{{ workbenchStore.planCount !== 1 ? 's' : '' }} loaded
              </div>
            </div>
            <ChevronDown
              class="w-4 h-4 flex-shrink-0 ml-2 transition-transform text-text-muted"
              :class="showPlanSwitcher ? 'rotate-180' : ''"
            />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showPlanSwitcher"
            class="absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-64 overflow-y-auto bg-surface border-border"
          >
            <div
              v-for="plan in workbenchStore.plans"
              :key="plan.id"
              class="px-4 py-2 cursor-pointer"
              :class="
                plan.id === workbenchStore.activePlanId
                  ? 'bg-primary text-on-primary'
                  : 'hover:bg-surface-alt text-text-secondary'
              "
              @click="workbenchStore.setActivePlan(plan.id); showPlanSwitcher = false"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium truncate">{{ plan.projectName }}</span>
                <span
                  class="px-1.5 py-0.5 text-xs rounded-full ml-2"
                  :class="getStatusBadge(plan.status).class"
                >
                  {{ getStatusBadge(plan.status).label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Compact Import Zone -->
        <div
          class="rounded-lg border-2 border-dashed p-4 text-center transition-colors cursor-pointer"
          :class="
            isDragging
              ? 'border-primary bg-surface-alt'
              : 'border-border-strong hover:border-border-strong'
          "
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          @click="openFileDialog"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            multiple
            class="hidden"
            @change="handleFileSelect"
          />

          <Upload class="w-6 h-6 mx-auto mb-2 text-text-muted" />
          <p class="text-xs text-text-muted">
            Drop or click to import
          </p>

          <p v-if="importError" class="mt-2 text-xs text-red-500">
            {{ importError }}
          </p>
        </div>

        <!-- All Plans List (scrollable) -->
        <div class="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
          <div
            v-for="plan in workbenchStore.plans"
            :key="plan.id"
            class="rounded-lg border p-3 cursor-pointer transition-colors bg-surface"
            :class="
              plan.id === workbenchStore.activePlanId
                ? 'border-primary'
                : 'border-border hover:border-border-strong'
            "
            @click="workbenchStore.setActivePlan(plan.id)"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-medium truncate text-text">
                {{ plan.projectName }}
              </span>
              <span
                class="px-1.5 py-0.5 text-xs rounded-full flex-shrink-0"
                :class="getStatusBadge(plan.status).class"
              >
                {{ getStatusBadge(plan.status).label }}
              </span>
            </div>
            <div class="mt-1 text-xs flex items-center gap-2 text-text-muted">
              <span v-if="plan.data?.totals?.annual">
                ${{ plan.data.totals.annual.toLocaleString() }}/yr
              </span>
              <span>•</span>
              <span>{{ plan.data?.slate?.items?.length || 0 }} items</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content: Plan Review -->
      <div class="flex-1 min-w-0">
        <PlanReview />
      </div>
    </div>

    <!-- Empty State: Full-width Import Zone -->
    <div v-else>
      <!-- Import Zone -->
      <div
        class="rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer"
        :class="
          isDragging
            ? 'border-primary bg-surface-alt'
            : 'border-border-strong hover:border-border-strong'
        "
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @click="openFileDialog"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />

        <Upload class="w-10 h-10 mx-auto mb-3 text-text-muted" />
        <p class="text-sm font-medium text-text-secondary">
          Drop plan files here or click to browse
        </p>
        <p class="mt-1 text-xs text-text-muted">
          JSON files exported from Research Data Planner
        </p>

        <p v-if="importError" class="mt-3 text-sm text-red-500">
          {{ importError }}
        </p>
      </div>

      <!-- Empty State Message -->
      <div class="mt-8 rounded-lg border p-8 text-center bg-surface border-border">
        <FileJson class="w-12 h-12 mx-auto mb-3 text-border-strong" />
        <p class="text-sm text-text-muted">
          No plans loaded yet. Import a JSON file to get started.
        </p>
      </div>
    </div>

    <!-- Site feedback metrics (collapsible; admin-key gated, IT staff only) -->
    <WorkbenchFeedback class="mt-8" />
  </div>
</template>
