<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../../stores/aiGuidanceStore'
import { useConfigStore } from '@/stores/configStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../../components/AppletFrame.vue'
import DecisionFlow from '../../components/DecisionFlow.vue'
import {
  ShieldCheck,
  XCircle,
  AlertTriangle
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const configStore = useConfigStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'clinical-hipaa-deident'

// Load config from YAML
const appletConfig = computed(() => {
  return configStore.config?.clinicalGuidance?.['hipaa-deidentification'] || {}
})

// Transform YAML structure to DecisionFlow format
const questions = computed(() => {
  const yamlQuestions = appletConfig.value.questions || []

  return yamlQuestions.map(q => ({
    id: q.id,
    question: q.question,
    helpText: q.help_text,
    learnMore: q.learn_more ? {
      title: q.learn_more.title,
      content: q.learn_more.content
    } : undefined,
    options: (q.options || []).map(opt => ({
      value: opt.value,
      label: opt.label,
      description: opt.description,
      setsOutput: opt.sets_output || {},
      setsFlags: opt.sets_flags || [],
      clearsFlags: opt.clears_flags || [],
      next: opt.next
    }))
  }))
})

const outcomes = computed(() => appletConfig.value.outcomes || {})
const intro = computed(() => appletConfig.value.intro || {})

const result = ref(null)
const isComplete = computed(() => result.value !== null)

function handleComplete({ output, flags }) {
  let outcome = 'not-compliant'

  if (output.method === 'safe-harbor' && output.compliant) {
    outcome = 'safe-harbor-compliant'
  } else if (output.method === 'expert-determination' && output.compliant) {
    outcome = 'expert-determination'
  } else if (output.data_type === 'genomic') {
    outcome = 'genomic-special'
  } else if (flags.includes('expert-determination-recommended')) {
    outcome = 'expert-needed'
  }

  const outcomeData = outcomes.value[outcome] || outcomes.value['not-compliant']

  result.value = {
    outcome,
    ...outcomeData,
    flags,
    output
  }

  aiStore.completeApplet(APPLET_ID, {
    outcome,
    compliant: output.compliant !== false && outcome !== 'genomic-special',
    method: output.method,
    dataType: output.data_type,
    flags
  })
}

function getNextApplet(output) {
  // If compliant, suggest tool picker
  if (output?.compliant) {
    return 'tool-picker'
  }
  // If needs expert, suggest IRB workflow next
  if (output?.flags?.includes('expert-determination-recommended')) {
    return 'irb-workflow'
  }
  return null
}

const iconMap = {
  'shield-check': ShieldCheck,
  'x-circle': XCircle,
  'alert-triangle': AlertTriangle
}

function getIcon(iconName) {
  return iconMap[iconName] || AlertTriangle
}

function getLevelColorClasses(color) {
  const isDark = preferencesStore.darkMode
  const colors = {
    green: isDark ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700',
    yellow: isDark ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: isDark ? 'bg-orange-900/30 border-orange-700 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700',
    red: isDark ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
  }
  return colors[color] || colors.yellow
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    :title="appletConfig.meta?.title || 'HIPAA De-identification'"
    :core-question="appletConfig.meta?.core_question || 'Is your health data truly de-identified?'"
    :icon="ShieldCheck"
    :is-complete="isComplete"
    :get-next-applet="() => getNextApplet(result?.output)"
  >
    <!-- Intro -->
    <div
      v-if="intro.text"
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'" v-html="intro.text"></p>
      <p v-if="intro.source_note" class="text-sm mt-2" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        {{ intro.source_note }}
      </p>
    </div>

    <DecisionFlow :questions="questions" @complete="handleComplete">
      <template #complete="{ output, flags }">
        <div class="p-6 rounded-lg border-2" :class="getLevelColorClasses(result.color)">
          <div class="flex items-start gap-4">
            <component :is="getIcon(result.icon)" class="w-8 h-8 flex-shrink-0" />
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ result.title }}
              </h3>
              <p class="mb-4">{{ result.description }}</p>

              <!-- Implications -->
              <div v-if="result.implications" class="mb-4">
                <p class="text-sm font-medium mb-2">Implications:</p>
                <ul class="text-sm space-y-1">
                  <li v-for="(item, idx) in result.implications" :key="idx">
                    • {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Recommendations -->
              <div v-if="result.recommendations" class="mb-4">
                <p class="text-sm font-medium mb-2">Recommendations:</p>
                <ul class="text-sm space-y-1">
                  <li v-for="(item, idx) in result.recommendations" :key="idx">
                    • {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Warnings -->
              <div
                v-if="result.warnings"
                class="p-3 rounded-lg"
                :class="preferencesStore.darkMode ? 'bg-red-900/30' : 'bg-red-50'"
              >
                <p class="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle class="w-4 h-4" />
                  Critical Warnings
                </p>
                <ul class="text-sm space-y-1">
                  <li v-for="(item, idx) in result.warnings" :key="idx">
                    ⚠️ {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Flags -->
              <div v-if="flags.length > 0" class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="flag in flags"
                  :key="flag"
                  class="px-2 py-1 text-xs rounded-full font-medium uppercase"
                  :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'"
                >
                  {{ flag.replace(/-/g, ' ') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- External resource link -->
        <div
          v-if="appletConfig.meta?.official_guidance_url"
          class="mt-6 p-4 rounded-lg border text-sm"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 text-gray-400'
            : 'bg-gray-100 border-gray-200 text-gray-600'"
        >
          <p class="font-medium mb-2">Official HHS Resources:</p>
          <a
            :href="appletConfig.meta.official_guidance_url"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline"
            :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
          >
            HIPAA De-identification Guidance (HHS.gov)
          </a>
        </div>
      </template>
    </DecisionFlow>
  </AppletFrame>
</template>
