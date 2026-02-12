<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  FileText,
  Copy,
  CheckCircle,
  Info,
  Calendar,
  MessageSquare,
  Settings,
  FileOutput,
  Edit,
  ClipboardCheck
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'documentation-guide'

// Get context from previous applets
const stakesLevel = computed(() => aiStore.stakesLevel)
const taskOutput = computed(() => aiStore.getAppletOutput('task-fit'))

// Documentation elements
const documentationElements = [
  {
    id: 'tool',
    name: 'Tool Used',
    why: 'Different tools produce different outputs',
    how: 'Full model ID string (e.g., "claude-3-5-sonnet-20241022")',
    example: 'Claude 3.5 Sonnet via API, version claude-3-5-sonnet-20241022',
    icon: Settings,
    required: true
  },
  {
    id: 'date',
    name: 'Date of Use',
    why: 'Models change over time, even without version changes',
    how: 'Timestamp of interaction',
    example: '2025-01-15 14:30 UTC',
    icon: Calendar,
    required: true
  },
  {
    id: 'prompts',
    name: 'Prompts Used',
    why: 'Same prompt can give different results; enables reproduction',
    how: 'Save full prompt text verbatim',
    example: 'System: You are a helpful assistant... User: Analyze this dataset...',
    icon: MessageSquare,
    required: true
  },
  {
    id: 'parameters',
    name: 'Parameters',
    why: 'Temperature, sampling affect outputs',
    how: 'Document all non-default settings',
    example: 'temperature=0.3, max_tokens=2000',
    icon: Settings,
    required: false
  },
  {
    id: 'outputs',
    name: 'Outputs Received',
    why: 'For verification and reproducibility',
    how: 'Save full response, not just excerpts',
    example: 'Complete AI response saved to project-logs/2025-01-15-analysis.md',
    icon: FileOutput,
    required: true
  },
  {
    id: 'modifications',
    name: 'Modifications Made',
    why: 'Track human contribution vs AI contribution',
    how: 'Version history or diff showing changes',
    example: 'Git diff between raw AI output and final version',
    icon: Edit,
    required: false
  },
  {
    id: 'verification',
    name: 'Verification Performed',
    why: 'Evidence of due diligence',
    how: 'Checklist or notes documenting verification steps',
    example: 'Verified 12/12 citations exist, checked 3 calculations manually',
    icon: ClipboardCheck,
    required: false
  }
]

// Documentation levels by context
const contextLevels = [
  {
    id: 'personal',
    name: 'Personal Exploration',
    minimum: 'None required',
    recommended: 'Tool + date for your records',
    requiredElements: []
  },
  {
    id: 'team',
    name: 'Lab / Team Work',
    minimum: 'Tool + prompts',
    recommended: 'Full conversation logs in version control',
    requiredElements: ['tool', 'prompts', 'outputs']
  },
  {
    id: 'grant',
    name: 'Grant Applications',
    minimum: 'Tool + what was AI-assisted',
    recommended: 'Detailed prompts and outputs',
    requiredElements: ['tool', 'date', 'prompts', 'outputs']
  },
  {
    id: 'publication',
    name: 'Publications',
    minimum: 'Per journal policy',
    recommended: 'Full audit trail',
    requiredElements: ['tool', 'date', 'prompts', 'parameters', 'outputs', 'modifications']
  },
  {
    id: 'regulatory',
    name: 'Regulatory Submissions',
    minimum: 'Complete audit trail',
    recommended: 'Everything, timestamped',
    requiredElements: ['tool', 'date', 'prompts', 'parameters', 'outputs', 'modifications', 'verification']
  }
]

// State
const selectedContext = ref(null)
const checkedElements = ref(new Set())
const copiedTemplate = ref(false)

const isComplete = computed(() => selectedContext.value !== null)

const selectedContextConfig = computed(() => {
  return contextLevels.find(c => c.id === selectedContext.value)
})

const requiredForContext = computed(() => {
  if (!selectedContextConfig.value) return []
  return selectedContextConfig.value.requiredElements
})

function selectContext(context) {
  selectedContext.value = context.id
  // Pre-check required elements for this context
  checkedElements.value = new Set(context.requiredElements)

  aiStore.completeApplet(APPLET_ID, {
    context: context.id,
    requiredElements: context.requiredElements,
    recommendedLevel: context.recommended
  })
}

function toggleElement(elementId) {
  if (checkedElements.value.has(elementId)) {
    checkedElements.value.delete(elementId)
  } else {
    checkedElements.value.add(elementId)
  }
  checkedElements.value = new Set(checkedElements.value) // trigger reactivity
}

function isElementRequired(elementId) {
  return requiredForContext.value.includes(elementId)
}

function isElementChecked(elementId) {
  return checkedElements.value.has(elementId)
}

const documentationTemplate = computed(() => {
  const elements = documentationElements.filter(e => checkedElements.value.has(e.id))
  let template = `# AI Usage Documentation

## Session Details
- **Date:** [YYYY-MM-DD HH:MM UTC]
- **Project/Task:** [Description]

`
  elements.forEach(e => {
    template += `## ${e.name}
[${e.example}]

`
  })

  template += `## Notes
[Any additional context or observations]
`
  return template
})

async function copyTemplate() {
  try {
    await navigator.clipboard.writeText(documentationTemplate.value)
    copiedTemplate.value = true
    setTimeout(() => copiedTemplate.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function getNextApplet() {
  return 'reproducibility-checkpoint'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Documentation Guide"
    core-question="What do I need to save/record?"
    :icon="FileText"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Why Documentation Matters -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <blockquote
        class="italic text-lg mb-2"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        "If you can't reproduce a result, it didn't happen."
      </blockquote>
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        AI-assisted work requires documentation for reproducibility and accountability.
        LLMs are stochastic — even the same prompt can give different outputs.
      </p>
    </div>

    <!-- Context Selection -->
    <div class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        What's the context for this work?
      </h3>
      <div class="grid gap-2">
        <button
          v-for="context in contextLevels"
          :key="context.id"
          @click="selectContext(context)"
          class="p-4 rounded-lg border-2 text-left transition-all"
          :class="[
            selectedContext === context.id
              ? (preferencesStore.darkMode ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-400')
              : (preferencesStore.darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'),
            preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'
          ]"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ context.name }}
              </h4>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                <span class="font-medium">Minimum:</span> {{ context.minimum }}
              </p>
            </div>
            <CheckCircle
              v-if="selectedContext === context.id"
              class="w-5 h-5 text-blue-500 flex-shrink-0"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Documentation Elements Checklist -->
    <div v-if="selectedContext" class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Documentation Elements
      </h3>
      <p class="text-sm mb-4" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        <span class="font-medium">Recommended for {{ selectedContextConfig.name }}:</span>
        {{ selectedContextConfig.recommended }}
      </p>

      <div class="space-y-3">
        <div
          v-for="element in documentationElements"
          :key="element.id"
          @click="toggleElement(element.id)"
          class="p-4 rounded-lg border cursor-pointer transition-all"
          :class="[
            isElementChecked(element.id)
              ? (preferencesStore.darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300')
              : (preferencesStore.darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300')
          ]"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
              :class="isElementChecked(element.id)
                ? 'bg-green-500 border-green-500'
                : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
            >
              <CheckCircle v-if="isElementChecked(element.id)" class="w-3 h-3 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <component
                  :is="element.icon"
                  class="w-4 h-4"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                />
                <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                  {{ element.name }}
                </h4>
                <span
                  v-if="isElementRequired(element.id)"
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="preferencesStore.darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'"
                >
                  Required
                </span>
              </div>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                <span class="font-medium">Why:</span> {{ element.why }}
              </p>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
                <span class="font-medium">Example:</span> {{ element.example }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Generator -->
    <div
      v-if="selectedContext && checkedElements.size > 0"
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Documentation Template
        </h3>
        <button
          @click="copyTemplate"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          :class="copiedTemplate
            ? (preferencesStore.darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700')
            : (preferencesStore.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100')"
        >
          <component :is="copiedTemplate ? CheckCircle : Copy" class="w-4 h-4" />
          {{ copiedTemplate ? 'Copied!' : 'Copy Template' }}
        </button>
      </div>
      <pre
        class="text-sm p-3 rounded-lg overflow-x-auto"
        :class="preferencesStore.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'"
      >{{ documentationTemplate }}</pre>
    </div>

    <!-- Storage Recommendations -->
    <div
      v-if="selectedContext"
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'"
    >
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 flex-shrink-0 mt-0.5" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'" />
        <div>
          <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'">
            Storage Recommendations
          </h4>
          <ul class="text-sm mt-2 space-y-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'">
            <li>• Save conversations as markdown or PDF</li>
            <li>• Include in project documentation folder</li>
            <li>• Use version control for prompts (like code)</li>
            <li>• Retention: At least as long as the project/publication</li>
          </ul>
        </div>
      </div>
    </div>
  </AppletFrame>
</template>
