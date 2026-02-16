<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  FileText,
  Settings,
  Save,
  GitBranch
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'reproducibility-checkpoint'

// Reproducibility checklist items
const checklistItems = [
  {
    id: 'model-version',
    question: 'Did you save the exact model version?',
    helpText: 'Model ID string, not just "ChatGPT" or "Claude"',
    example: 'claude-3-5-sonnet-20241022 (not just "Claude")',
    icon: Settings,
    critical: true
  },
  {
    id: 'date',
    question: 'Did you record the date of use?',
    helpText: 'Models update without version changes',
    example: '2026-02-15 — models may behave differently next month',
    icon: Calendar,
    critical: true
  },
  {
    id: 'prompts',
    question: 'Did you save your prompts verbatim?',
    helpText: 'Full prompt text, not paraphrased',
    example: 'Including system prompts if applicable',
    icon: FileText,
    critical: true
  },
  {
    id: 'raw-outputs',
    question: 'Did you save the raw outputs before modification?',
    helpText: 'Complete AI response, not just what you kept',
    example: 'Enables verification of what AI contributed vs your edits',
    icon: Save,
    critical: true
  },
  {
    id: 'regenerate',
    question: 'Can you regenerate similar (not identical) outputs if challenged?',
    helpText: 'Same prompt should produce outputs in the same ballpark',
    example: 'If wildly different, document why',
    icon: RefreshCw,
    critical: false
  },
  {
    id: 'fallback',
    question: 'What\'s your fallback if the model no longer exists?',
    helpText: 'Saved outputs are your primary record',
    example: 'Consider: Would a different model suffice for verification?',
    icon: AlertTriangle,
    critical: false
  }
]

// Pipeline-specific items
const pipelineItems = [
  {
    id: 'version-prompts',
    question: 'Are prompts version-controlled like code?',
    helpText: 'Git or similar version control',
    icon: GitBranch
  },
  {
    id: 'log-responses',
    question: 'Do you log model responses with timestamps?',
    helpText: 'For audit trail and debugging',
    icon: FileText
  },
  {
    id: 'regression-tests',
    question: 'Have you implemented regression tests for prompt changes?',
    helpText: 'Detect when prompt changes affect output quality',
    icon: CheckCircle
  },
  {
    id: 'quality-monitoring',
    question: 'Do you monitor for output quality drift over time?',
    helpText: 'Models update; quality may change',
    icon: AlertTriangle
  }
]

// State
const checkedItems = ref(new Set())
const isPipeline = ref(false)
const pipelineCheckedItems = ref(new Set())

const criticalItems = computed(() => checklistItems.filter(i => i.critical))
const optionalItems = computed(() => checklistItems.filter(i => !i.critical))

const criticalComplete = computed(() => {
  return criticalItems.value.every(item => checkedItems.value.has(item.id))
})

const readinessLevel = computed(() => {
  const criticalCount = criticalItems.value.filter(i => checkedItems.value.has(i.id)).length
  const totalCritical = criticalItems.value.length

  if (criticalCount === totalCritical) {
    const optionalCount = optionalItems.value.filter(i => checkedItems.value.has(i.id)).length
    if (optionalCount === optionalItems.value.length) {
      return 'full'
    }
    return 'partial'
  }
  if (criticalCount >= totalCritical / 2) {
    return 'partial'
  }
  return 'insufficient'
})

const isComplete = computed(() => checkedItems.value.size >= criticalItems.value.length)

const readinessInfo = {
  full: {
    label: 'Fully Reproducible',
    description: 'You have comprehensive documentation. Results can be verified and reproduced.',
    color: 'green',
    icon: CheckCircle
  },
  partial: {
    label: 'Partially Reproducible',
    description: 'Some gaps in documentation. Consider addressing the unchecked items.',
    color: 'yellow',
    icon: AlertTriangle
  },
  insufficient: {
    label: 'Insufficient Documentation',
    description: 'Critical documentation is missing. Results may not be reproducible.',
    color: 'red',
    icon: XCircle
  }
}

const currentReadinessInfo = computed(() => readinessInfo[readinessLevel.value])

function toggleItem(itemId) {
  if (checkedItems.value.has(itemId)) {
    checkedItems.value.delete(itemId)
  } else {
    checkedItems.value.add(itemId)
  }
  checkedItems.value = new Set(checkedItems.value)

  if (isComplete.value) {
    aiStore.completeApplet(APPLET_ID, {
      readiness: readinessLevel.value,
      checkedItems: Array.from(checkedItems.value),
      isPipeline: isPipeline.value,
      pipelineItems: isPipeline.value ? Array.from(pipelineCheckedItems.value) : []
    })
  }
}

function togglePipelineItem(itemId) {
  if (pipelineCheckedItems.value.has(itemId)) {
    pipelineCheckedItems.value.delete(itemId)
  } else {
    pipelineCheckedItems.value.add(itemId)
  }
  pipelineCheckedItems.value = new Set(pipelineCheckedItems.value)
}

function isItemChecked(itemId) {
  return checkedItems.value.has(itemId)
}

function isPipelineItemChecked(itemId) {
  return pipelineCheckedItems.value.has(itemId)
}

function getReadinessClasses(color) {
  const isDark = preferencesStore.darkMode
  const colors = {
    green: isDark ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700',
    yellow: isDark ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: isDark ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
  }
  return colors[color] || colors.yellow
}

function getNextApplet() {
  return 'model-selection-guide'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Reproducibility Checkpoint"
    core-question="Can you reproduce this AI-assisted analysis in six months?"
    :icon="RefreshCw"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- The Problem -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h3 class="font-semibold mb-2" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        The Reproducibility Problem
      </h3>
      <p class="text-sm mb-3" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Unlike traditional software, LLMs:
      </p>
      <ul class="text-sm space-y-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        <li>• Produce different outputs from the same prompt</li>
        <li>• Are updated by providers without notice</li>
        <li>• May be deprecated or replaced entirely</li>
        <li>• Don't have semantic versioning you can pin</li>
      </ul>
      <p class="text-sm mt-3 font-medium" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
        If you used Claude 3.5 Sonnet in January and reviewers ask questions in June,
        you may get different outputs from a newer version.
      </p>
    </div>

    <!-- Readiness Indicator -->
    <div
      v-if="checkedItems.size > 0"
      class="p-4 rounded-lg border-2 mb-6"
      :class="getReadinessClasses(currentReadinessInfo.color)"
    >
      <div class="flex items-center gap-3">
        <component :is="currentReadinessInfo.icon" class="w-6 h-6 flex-shrink-0" />
        <div>
          <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            {{ currentReadinessInfo.label }}
          </h3>
          <p class="text-sm">{{ currentReadinessInfo.description }}</p>
        </div>
      </div>
    </div>

    <!-- Critical Items -->
    <div class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Critical Documentation
      </h3>
      <div class="space-y-3">
        <div
          v-for="item in criticalItems"
          :key="item.id"
          @click="toggleItem(item.id)"
          class="p-4 rounded-lg border cursor-pointer transition-all"
          :class="[
            isItemChecked(item.id)
              ? (preferencesStore.darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300')
              : (preferencesStore.darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300')
          ]"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
              :class="isItemChecked(item.id)
                ? 'bg-green-500 border-green-500'
                : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
            >
              <CheckCircle v-if="isItemChecked(item.id)" class="w-3 h-3 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <component
                  :is="item.icon"
                  class="w-4 h-4"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                />
                <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                  {{ item.question }}
                </h4>
                <span
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="preferencesStore.darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'"
                >
                  Required
                </span>
              </div>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ item.helpText }}
              </p>
              <p class="text-sm mt-1 italic" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
                {{ item.example }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Optional Items -->
    <div class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Additional Considerations
      </h3>
      <div class="space-y-3">
        <div
          v-for="item in optionalItems"
          :key="item.id"
          @click="toggleItem(item.id)"
          class="p-4 rounded-lg border cursor-pointer transition-all"
          :class="[
            isItemChecked(item.id)
              ? (preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')
              : (preferencesStore.darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300')
          ]"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
              :class="isItemChecked(item.id)
                ? 'bg-blue-500 border-blue-500'
                : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
            >
              <CheckCircle v-if="isItemChecked(item.id)" class="w-3 h-3 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <component
                  :is="item.icon"
                  class="w-4 h-4"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                />
                <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                  {{ item.question }}
                </h4>
              </div>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ item.helpText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pipeline Section -->
    <div
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          v-model="isPipeline"
          class="w-4 h-4 rounded"
        />
        <span class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Using AI in a production/pipeline system?
        </span>
      </label>

      <div v-if="isPipeline" class="mt-4 space-y-3">
        <p class="text-sm mb-3" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
          Additional considerations for automated systems:
        </p>
        <div
          v-for="item in pipelineItems"
          :key="item.id"
          @click="togglePipelineItem(item.id)"
          class="p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3"
          :class="[
            isPipelineItemChecked(item.id)
              ? (preferencesStore.darkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-300')
              : (preferencesStore.darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300')
          ]"
        >
          <div
            class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center"
            :class="isPipelineItemChecked(item.id)
              ? 'bg-purple-500 border-purple-500'
              : (preferencesStore.darkMode ? 'border-gray-500' : 'border-gray-300')"
          >
            <CheckCircle v-if="isPipelineItemChecked(item.id)" class="w-3 h-3 text-white" />
          </div>
          <div>
            <h4 class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ item.question }}
            </h4>
            <p class="text-xs mt-0.5" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
              {{ item.helpText }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppletFrame>
</template>
