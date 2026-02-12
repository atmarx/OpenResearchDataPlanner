<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  Workflow,
  CheckCircle,
  AlertTriangle,
  Server,
  Bell,
  GitBranch,
  DollarSign,
  Activity,
  Shield
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'pipeline-integration'

// Checklist categories
const checklistCategories = [
  {
    id: 'reliability',
    name: 'Reliability',
    icon: Server,
    items: [
      { id: 'api-failure', label: 'What happens when the API fails?', helpText: 'Retry logic, fallback behavior' },
      { id: 'rate-limits', label: 'What happens when you hit rate limits?', helpText: 'Queueing, backoff strategy' },
      { id: 'timeouts', label: 'Do you have timeout handling?', helpText: 'Reasonable limits, graceful handling' },
      { id: 'degradation', label: 'Is there graceful degradation if AI is unavailable?', helpText: 'Can the system function without AI?' }
    ]
  },
  {
    id: 'quality',
    name: 'Quality Monitoring',
    icon: Activity,
    items: [
      { id: 'quality-detection', label: 'How will you detect output quality degradation?', helpText: 'Models change, quality may drift' },
      { id: 'sample-outputs', label: 'Do you have sample outputs to compare against?', helpText: 'Golden examples for regression testing' },
      { id: 'automated-checks', label: 'What automated checks validate outputs?', helpText: 'Format validation, sanity checks' },
      { id: 'periodic-review', label: 'Who reviews samples periodically?', helpText: 'Human oversight schedule' }
    ]
  },
  {
    id: 'alerting',
    name: 'Alerting',
    icon: Bell,
    items: [
      { id: 'alert-triggers', label: 'What triggers an alert for unexpected outputs?', helpText: 'Anomaly detection, threshold violations' },
      { id: 'stop-pipeline', label: 'How quickly can you stop the pipeline?', helpText: 'Kill switch, emergency procedures' },
      { id: 'alert-response', label: 'Who is responsible for responding to alerts?', helpText: 'On-call rotation, escalation path' }
    ]
  },
  {
    id: 'versioning',
    name: 'Versioning',
    icon: GitBranch,
    items: [
      { id: 'prompts-versioned', label: 'Are prompts version-controlled like code?', helpText: 'Git, change history, rollback capability' },
      { id: 'log-versions', label: 'Do you log which prompt version produced each output?', helpText: 'Traceability for debugging' },
      { id: 'reproduce-runs', label: 'Can you reproduce historical runs?', helpText: 'Same inputs → same process' }
    ]
  },
  {
    id: 'cost',
    name: 'Cost Control',
    icon: DollarSign,
    items: [
      { id: 'budget-limits', label: 'Do you have budget limits/alerts set?', helpText: 'API spend caps, notifications' },
      { id: 'cost-per-call', label: 'Do you understand cost per API call at your volume?', helpText: 'Token pricing, batch discounts' },
      { id: 'cost-spikes', label: 'What happens if costs spike unexpectedly?', helpText: 'Circuit breakers, investigation triggers' }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    items: [
      { id: 'prompt-injection', label: 'Is user input sanitized before including in prompts?', helpText: 'Prompt injection prevention' },
      { id: 'output-validation', label: 'Is AI output validated before use?', helpText: 'Don\'t trust AI for security decisions' },
      { id: 'secrets-handling', label: 'Are API keys and secrets properly managed?', helpText: 'Environment variables, secret managers' }
    ]
  }
]

// State
const checkedItems = ref(new Set())
const expandedCategories = ref(new Set(['reliability', 'quality']))

const totalItems = computed(() => {
  return checklistCategories.reduce((sum, cat) => sum + cat.items.length, 0)
})

const checkedCount = computed(() => checkedItems.value.size)

const readinessLevel = computed(() => {
  const percentage = (checkedCount.value / totalItems.value) * 100
  if (percentage >= 80) return 'ready'
  if (percentage >= 50) return 'partial'
  return 'not-ready'
})

const isComplete = computed(() => checkedCount.value >= Math.floor(totalItems.value * 0.5))

const readinessInfo = {
  ready: {
    label: 'Production Ready',
    description: 'You\'ve addressed most critical considerations for production AI systems.',
    color: 'green',
    icon: CheckCircle
  },
  partial: {
    label: 'Needs Attention',
    description: 'Some gaps exist. Review unchecked items before production deployment.',
    color: 'yellow',
    icon: AlertTriangle
  },
  'not-ready': {
    label: 'Not Production Ready',
    description: 'Significant gaps in production readiness. Address critical items first.',
    color: 'red',
    icon: AlertTriangle
  }
}

function toggleCategory(categoryId) {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
  expandedCategories.value = new Set(expandedCategories.value)
}

function isCategoryExpanded(categoryId) {
  return expandedCategories.value.has(categoryId)
}

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
      totalItems: totalItems.value
    })
  }
}

function isItemChecked(itemId) {
  return checkedItems.value.has(itemId)
}

function getCategoryProgress(category) {
  const checked = category.items.filter(i => checkedItems.value.has(i.id)).length
  return `${checked}/${category.items.length}`
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
  return 'reproducibility-checkpoint'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Pipeline Integration Check"
    core-question="I'm building a system that calls an LLM API. What are the additional considerations?"
    :icon="Workflow"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Intro -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Production systems with automated AI calls have different risk profiles than interactive use.
        There's no human sitting at a chat interface. Use this checklist to ensure your pipeline is ready.
      </p>
    </div>

    <!-- When This Applies -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'"
    >
      <h4 class="font-medium mb-2" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'">
        When This Applies
      </h4>
      <ul class="text-sm space-y-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'">
        <li>• Automated prompt generation</li>
        <li>• Batch processing of inputs through LLMs</li>
        <li>• Downstream systems consuming LLM outputs</li>
        <li>• Scheduled or triggered AI analysis</li>
        <li>• Any system where AI runs without human review of each interaction</li>
      </ul>
    </div>

    <!-- Readiness Indicator -->
    <div
      v-if="checkedCount > 0"
      class="p-4 rounded-lg border-2 mb-6"
      :class="getReadinessClasses(readinessInfo[readinessLevel].color)"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <component :is="readinessInfo[readinessLevel].icon" class="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ readinessInfo[readinessLevel].label }}
            </h3>
            <p class="text-sm">{{ readinessInfo[readinessLevel].description }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold">{{ checkedCount }}/{{ totalItems }}</p>
          <p class="text-xs">items checked</p>
        </div>
      </div>
    </div>

    <!-- Checklist Categories -->
    <div class="space-y-4">
      <div
        v-for="category in checklistCategories"
        :key="category.id"
        class="rounded-lg border overflow-hidden"
        :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <!-- Category Header -->
        <button
          @click="toggleCategory(category.id)"
          class="w-full p-4 flex items-center justify-between"
          :class="preferencesStore.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'"
        >
          <div class="flex items-center gap-3">
            <component
              :is="category.icon"
              class="w-5 h-5"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            />
            <h3 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ category.name }}
            </h3>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-sm px-2 py-0.5 rounded-full"
              :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'"
            >
              {{ getCategoryProgress(category) }}
            </span>
            <span
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ isCategoryExpanded(category.id) ? '▼' : '▶' }}
            </span>
          </div>
        </button>

        <!-- Category Items -->
        <div
          v-if="isCategoryExpanded(category.id)"
          class="border-t"
          :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
        >
          <div
            v-for="item in category.items"
            :key="item.id"
            @click="toggleItem(item.id)"
            class="p-4 border-b last:border-b-0 cursor-pointer transition-colors flex items-start gap-3"
            :class="[
              preferencesStore.darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50',
              isItemChecked(item.id) ? (preferencesStore.darkMode ? 'bg-green-900/10' : 'bg-green-50/50') : ''
            ]"
          >
            <div
              class="w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
              :class="isItemChecked(item.id)
                ? 'bg-green-500 border-green-500'
                : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
            >
              <CheckCircle v-if="isItemChecked(item.id)" class="w-3 h-3 text-white" />
            </div>
            <div>
              <p class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ item.label }}
              </p>
              <p class="text-xs mt-0.5" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
                {{ item.helpText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monitoring Recommendations -->
    <div
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h4 class="font-medium mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Recommended Dashboard Components
      </h4>
      <div class="grid gap-2 sm:grid-cols-2">
        <div
          v-for="component in ['API latency/errors', 'Token usage/costs', 'Output quality metrics', 'Prompt version tracking']"
          :key="component"
          class="p-2 rounded text-sm"
          :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
        >
          {{ component }}
        </div>
      </div>
    </div>
  </AppletFrame>
</template>
