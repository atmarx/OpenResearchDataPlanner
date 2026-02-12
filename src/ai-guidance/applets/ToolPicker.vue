<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  Wrench,
  Cloud,
  Building,
  Server,
  Laptop,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'tool-picker'

// Get context from previous applets
const dataSensitivity = computed(() => aiStore.dataSensitivity || 'internal')
const allFlags = computed(() => aiStore.allFlags)

// Tool categories
const toolCategories = [
  {
    id: 'consumer',
    name: 'Consumer Cloud',
    icon: Cloud,
    examples: 'ChatGPT Free, Claude Free, Gemini',
    description: 'Data may be used for training. No enterprise agreements.',
    dataPolicy: 'Stored on third-party servers. May be used for model improvement.',
    forSensitivity: ['public'],
    prohibited: ['high', 'restricted'],
    warning: 'Not suitable for sensitive data. Check terms of service.'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Cloud',
    icon: Building,
    examples: 'ChatGPT Enterprise, Claude for Enterprise, Azure OpenAI',
    description: 'Data not used for training. BAA available for HIPAA.',
    dataPolicy: 'Enterprise agreements. Audit logs. Data isolation.',
    forSensitivity: ['public', 'internal', 'confidential'],
    prohibited: ['restricted'],
    warning: 'Verify institutional agreement is in place. Check BAA status for HIPAA data.'
  },
  {
    id: 'institutional',
    name: 'Institutionally Hosted',
    icon: Server,
    examples: 'University AI Portal (if available)',
    description: 'Data stays within institution. Institutional policies apply.',
    dataPolicy: 'No external transmission. Local governance.',
    forSensitivity: ['public', 'internal', 'confidential', 'high'],
    prohibited: [],
    warning: 'Check if your institution offers this. May satisfy IRB "no external sharing" requirements.'
  },
  {
    id: 'local',
    name: 'Local Models',
    icon: Laptop,
    examples: 'Llama, Mistral via Ollama',
    description: 'Data never leaves your machine. Full control.',
    dataPolicy: 'No external transmission. You control everything.',
    forSensitivity: ['public', 'internal', 'confidential', 'high', 'restricted'],
    prohibited: [],
    warning: 'Requires technical setup. See Model Selection Guide for help choosing.'
  }
]

// Determine which tools are available for current sensitivity
const availableTools = computed(() => {
  return toolCategories.map(cat => ({
    ...cat,
    status: getToolStatus(cat)
  }))
})

function getToolStatus(category) {
  const sensitivity = dataSensitivity.value

  if (category.prohibited.includes(sensitivity)) {
    return 'prohibited'
  }
  if (category.forSensitivity.includes(sensitivity)) {
    return 'available'
  }
  return 'caution'
}

function getStatusClasses(status) {
  const isDark = preferencesStore.darkMode
  if (status === 'available') {
    return isDark
      ? 'bg-green-900/30 border-green-700'
      : 'bg-green-50 border-green-200'
  }
  if (status === 'prohibited') {
    return isDark
      ? 'bg-red-900/30 border-red-700 opacity-60'
      : 'bg-red-50 border-red-200 opacity-60'
  }
  return isDark
    ? 'bg-yellow-900/30 border-yellow-700'
    : 'bg-yellow-50 border-yellow-200'
}

function getStatusIcon(status) {
  if (status === 'available') return CheckCircle
  if (status === 'prohibited') return XCircle
  return AlertTriangle
}

// Mark complete when user views
const isComplete = ref(false)

function markComplete() {
  isComplete.value = true
  aiStore.completeApplet(APPLET_ID, {
    sensitivity: dataSensitivity.value,
    availableCategories: availableTools.value
      .filter(t => t.status === 'available')
      .map(t => t.id)
  })
}

// Auto-complete on mount (informational applet)
import { onMounted } from 'vue'
onMounted(() => {
  setTimeout(markComplete, 1000)
})

function getNextApplet() {
  return 'task-fit'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Tool Picker"
    core-question="Which AI tools can you use for this data sensitivity level?"
    :icon="Wrench"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Context from previous applets -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'">
            Based on your Data Check:
          </p>
          <p class="font-semibold capitalize" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            {{ dataSensitivity }} sensitivity
          </p>
        </div>
        <div v-if="allFlags.length > 0" class="flex flex-wrap gap-1">
          <span
            v-for="flag in allFlags.slice(0, 3)"
            :key="flag"
            class="px-2 py-0.5 text-xs rounded-full"
            :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'"
          >
            {{ flag.replace(/-/g, ' ') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tool Categories -->
    <div class="space-y-4">
      <div
        v-for="tool in availableTools"
        :key="tool.id"
        class="p-4 rounded-lg border-2 transition-all"
        :class="getStatusClasses(tool.status)"
      >
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-white'"
          >
            <component :is="tool.icon" class="w-6 h-6" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'" />
          </div>

          <div class="flex-1">
            <!-- Header -->
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ tool.name }}
              </h3>
              <component
                :is="getStatusIcon(tool.status)"
                class="w-5 h-5"
                :class="{
                  'text-green-500': tool.status === 'available',
                  'text-red-500': tool.status === 'prohibited',
                  'text-yellow-500': tool.status === 'caution'
                }"
              />
            </div>

            <!-- Examples -->
            <p class="text-sm mb-2" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'">
              {{ tool.examples }}
            </p>

            <!-- Description -->
            <p class="text-sm mb-2" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
              {{ tool.description }}
            </p>

            <!-- Status message -->
            <div
              v-if="tool.status === 'prohibited'"
              class="text-sm font-medium"
              :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-600'"
            >
              ❌ Not available for {{ dataSensitivity }} sensitivity data
            </div>
            <div
              v-else-if="tool.status === 'caution'"
              class="text-sm font-medium"
              :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-600'"
            >
              ⚠️ {{ tool.warning }}
            </div>
            <div
              v-else
              class="text-sm font-medium"
              :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-600'"
            >
              ✓ Available for your data type
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Special cases -->
    <div
      v-if="allFlags.includes('export-control')"
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'"
    >
      <p class="font-medium" :class="preferencesStore.darkMode ? 'text-red-300' : 'text-red-800'">
        🔒 Export Controlled Data
      </p>
      <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-700'">
        Local models only, potentially air-gapped. Consult your security office before ANY AI use.
      </p>
    </div>

    <div
      v-if="allFlags.includes('cloud-prohibited') || allFlags.includes('irb-prohibits-ai')"
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'"
    >
      <p class="font-medium" :class="preferencesStore.darkMode ? 'text-orange-300' : 'text-orange-800'">
        📋 Protocol Restriction
      </p>
      <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-orange-400' : 'text-orange-700'">
        Your IRB protocol restricts cloud AI use. Local models may still be an option.
      </p>
    </div>
  </AppletFrame>
</template>
