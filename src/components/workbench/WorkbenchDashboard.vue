<script setup>
import { ref, computed } from 'vue'
import { useWorkbenchStore } from '@/stores/workbenchStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { Upload, FileJson, FolderOpen, Clock, ChevronDown } from 'lucide-vue-next'
import PlanReview from './PlanReview.vue'

const workbenchStore = useWorkbenchStore()
const preferencesStore = usePreferencesStore()

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
      class: preferencesStore.darkMode
        ? 'bg-yellow-900/50 text-yellow-300'
        : 'bg-yellow-100 text-yellow-700'
    },
    in_review: {
      label: 'In Review',
      class: preferencesStore.darkMode
        ? 'bg-blue-900/50 text-blue-300'
        : 'bg-blue-100 text-blue-700'
    },
    needs_revision: {
      label: 'Needs Revision',
      class: preferencesStore.darkMode
        ? 'bg-orange-900/50 text-orange-300'
        : 'bg-orange-100 text-orange-700'
    },
    approved: {
      label: 'Approved',
      class: preferencesStore.darkMode
        ? 'bg-green-900/50 text-green-300'
        : 'bg-green-100 text-green-700'
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
            class="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left"
            :class="preferencesStore.darkMode
              ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
              : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'"
          >
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">
                {{ workbenchStore.activePlan?.projectName || 'Select a plan' }}
              </div>
              <div
                class="text-xs"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ workbenchStore.planCount }} plan{{ workbenchStore.planCount !== 1 ? 's' : '' }} loaded
              </div>
            </div>
            <ChevronDown
              class="w-4 h-4 flex-shrink-0 ml-2 transition-transform"
              :class="[
                preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500',
                showPlanSwitcher ? 'rotate-180' : ''
              ]"
            />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showPlanSwitcher"
            class="absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-64 overflow-y-auto"
            :class="preferencesStore.darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'"
          >
            <div
              v-for="plan in workbenchStore.plans"
              :key="plan.id"
              class="px-4 py-2 cursor-pointer"
              :class="[
                plan.id === workbenchStore.activePlanId
                  ? (preferencesStore.darkMode
                      ? 'bg-indigo-900/50 text-indigo-200'
                      : 'bg-indigo-50 text-indigo-700')
                  : (preferencesStore.darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-50 text-gray-700')
              ]"
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
          :class="[
            isDragging
              ? (preferencesStore.darkMode
                  ? 'border-indigo-500 bg-indigo-900/20'
                  : 'border-indigo-400 bg-indigo-50')
              : (preferencesStore.darkMode
                  ? 'border-gray-700 hover:border-gray-600'
                  : 'border-gray-300 hover:border-gray-400')
          ]"
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

          <Upload
            class="w-6 h-6 mx-auto mb-2"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
          />
          <p
            class="text-xs"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
          >
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
            class="rounded-lg border p-3 cursor-pointer transition-colors"
            :class="[
              plan.id === workbenchStore.activePlanId
                ? (preferencesStore.darkMode
                    ? 'bg-indigo-900/30 border-indigo-700'
                    : 'bg-indigo-50 border-indigo-200')
                : (preferencesStore.darkMode
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-300')
            ]"
            @click="workbenchStore.setActivePlan(plan.id)"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="text-sm font-medium truncate"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                {{ plan.projectName }}
              </span>
              <span
                class="px-1.5 py-0.5 text-xs rounded-full flex-shrink-0"
                :class="getStatusBadge(plan.status).class"
              >
                {{ getStatusBadge(plan.status).label }}
              </span>
            </div>
            <div
              class="mt-1 text-xs flex items-center gap-2"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
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
        :class="[
          isDragging
            ? (preferencesStore.darkMode
                ? 'border-indigo-500 bg-indigo-900/20'
                : 'border-indigo-400 bg-indigo-50')
            : (preferencesStore.darkMode
                ? 'border-gray-700 hover:border-gray-600'
                : 'border-gray-300 hover:border-gray-400')
        ]"
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

        <Upload
          class="w-10 h-10 mx-auto mb-3"
          :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
        />
        <p
          class="text-sm font-medium"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Drop plan files here or click to browse
        </p>
        <p
          class="mt-1 text-xs"
          :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
        >
          JSON files exported from OpenDataPlanner
        </p>

        <p v-if="importError" class="mt-3 text-sm text-red-500">
          {{ importError }}
        </p>
      </div>

      <!-- Empty State Message -->
      <div
        class="mt-8 rounded-lg border p-8 text-center"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <FileJson
          class="w-12 h-12 mx-auto mb-3"
          :class="preferencesStore.darkMode ? 'text-gray-600' : 'text-gray-300'"
        />
        <p
          class="text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        >
          No plans loaded yet. Import a JSON file to get started.
        </p>
      </div>
    </div>
  </div>
</template>
