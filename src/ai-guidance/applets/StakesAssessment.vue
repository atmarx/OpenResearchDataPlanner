<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { useConfigStore } from '@/stores/configStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import DecisionFlow from '../components/DecisionFlow.vue'
import {
  Gauge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const configStore = useConfigStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'stakes-assessment'

// Load config from YAML
const appletConfig = computed(() => {
  return configStore.config?.aiGuidance?.['stakes-assessment'] || {}
})

// Transform YAML to DecisionFlow format
const questions = computed(() => {
  const yamlQuestions = appletConfig.value.questions || []
  return yamlQuestions.map(q => ({
    id: q.id,
    question: q.question,
    helpText: q.help_text,
    learnMore: q.learn_more,
    options: (q.options || []).map(opt => ({
      value: opt.value,
      label: opt.label,
      description: opt.description,
      setsOutput: opt.sets_output || {},
      setsFlags: opt.sets_flags || [],
      next: opt.next
    }))
  }))
})

const outcomes = computed(() => appletConfig.value.outcomes || {})
const intro = computed(() => appletConfig.value.intro || {})
const criticalWarning = computed(() => appletConfig.value.critical_warning || {})

const result = ref(null)
const isComplete = computed(() => result.value !== null)

// Calculate stakes level from outputs (LOGIC STAYS IN VUE)
function calculateStakesLevel(output) {
  const maxLevel = Math.max(
    output.audience_level || 1,
    output.decision_level || 1,
    output.catch_level || 1,
    output.cost_level || 1
  )

  if (maxLevel >= 4) return 'critical'
  if (maxLevel >= 3) return 'high'
  if (maxLevel >= 2) return 'medium'
  return 'low'
}

// Handle completion
function handleComplete({ output, flags }) {
  const level = calculateStakesLevel(output)
  const outcomeData = outcomes.value[level] || outcomes.value.low

  result.value = {
    level,
    ...outcomeData,
    flags
  }

  aiStore.completeApplet(APPLET_ID, {
    level,
    flags,
    ...output
  })
}

function getNextApplet() {
  return 'data-check'
}

// Icon mapping (DISPLAY LOGIC STAYS IN VUE)
const iconMap = {
  'check-circle': CheckCircle,
  'info': Info,
  'alert-triangle': AlertTriangle,
  'x-circle': XCircle
}

function getIcon(iconName) {
  return iconMap[iconName] || Info
}

// Color classes (THEME LOGIC STAYS IN VUE)
function getLevelColorClasses(color) {
  const isDark = preferencesStore.darkMode
  const colors = {
    green: isDark
      ? 'bg-green-900/30 border-green-700 text-green-400'
      : 'bg-green-50 border-green-200 text-green-700',
    yellow: isDark
      ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400'
      : 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: isDark
      ? 'bg-orange-900/30 border-orange-700 text-orange-400'
      : 'bg-orange-50 border-orange-200 text-orange-700',
    red: isDark
      ? 'bg-red-900/30 border-red-700 text-red-400'
      : 'bg-red-50 border-red-200 text-red-700'
  }
  return colors[color] || colors.yellow
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    :title="appletConfig.meta?.title || 'Stakes Assessment'"
    :core-question="appletConfig.meta?.core_question || 'What happens if AI gets this wrong?'"
    :icon="Gauge"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Why First explanation -->
    <div
      v-if="intro.why_first_content"
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <h3
        class="font-semibold mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        {{ intro.why_first_title || 'Why This Comes First' }}
      </h3>
      <p
        class="text-sm"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        v-html="intro.why_first_content"
      ></p>
    </div>

    <!-- Decision Flow -->
    <DecisionFlow
      :questions="questions"
      @complete="handleComplete"
    >
      <template #complete="{ output, flags }">
        <!-- Result Card -->
        <div
          class="p-6 rounded-lg border-2"
          :class="getLevelColorClasses(result.color)"
        >
          <div class="flex items-start gap-4">
            <component
              :is="getIcon(result.icon)"
              class="w-8 h-8 flex-shrink-0"
            />
            <div>
              <h3
                class="text-xl font-bold mb-2"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                {{ result.label }}
              </h3>
              <p class="mb-4">{{ result.description }}</p>

              <!-- Flags if any -->
              <div v-if="flags.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="flag in flags"
                  :key="flag"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                  :class="preferencesStore.darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'"
                >
                  {{ flag.replace(/-/g, ' ') }}
                </span>
              </div>

              <!-- Recommendation -->
              <div
                class="p-3 rounded-lg"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-800'
                  : 'bg-white/50'"
              >
                <p class="text-sm font-medium">
                  <strong>Recommendation:</strong> {{ result.recommendation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical warning (CONDITIONAL RENDERING STAYS IN VUE) -->
        <div
          v-if="result.level === 'critical' && criticalWarning.content"
          class="mt-4 p-4 rounded-lg border"
          :class="preferencesStore.darkMode
            ? 'bg-red-900/20 border-red-800 text-red-300'
            : 'bg-red-50 border-red-200 text-red-800'"
        >
          <div class="flex items-start gap-3">
            <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">{{ criticalWarning.title }}</p>
              <p class="text-sm mt-1">
                {{ criticalWarning.content }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </DecisionFlow>
  </AppletFrame>
</template>
