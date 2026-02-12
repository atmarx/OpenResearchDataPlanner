<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Code,
  BookOpen,
  BarChart3,
  Lightbulb,
  Workflow,
  ChevronDown,
  ChevronRight
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'common-pitfalls'

// Get task type from previous applet
const taskOutput = computed(() => aiStore.getAppletOutput('task-fit'))
const taskType = computed(() => taskOutput.value?.taskType)

// Pitfall checklists by task type
const pitfallChecklists = {
  'brainstorming': {
    name: 'Brainstorming & Ideation',
    icon: Lightbulb,
    items: [
      'Use as starting point, not endpoint',
      'AI will generate conventional ideas (training bias)',
      'Your unique expertise is the value-add',
      'Don\'t let AI narrow your thinking prematurely',
      'Challenge AI suggestions with your domain knowledge'
    ]
  },
  'drafts': {
    name: 'Writing & Text Generation',
    icon: FileText,
    items: [
      'AI will sound confident even when wrong',
      'Check all factual claims against sources',
      'Verify all citations exist and say what AI claims',
      'Watch for generic/vague framing (sign of AI filler)',
      'Ensure you can defend every sentence if asked',
      'Check for subtle bias in framing or word choice'
    ]
  },
  'explaining': {
    name: 'Explaining Concepts',
    icon: BookOpen,
    items: [
      'AI explanations may be oversimplified or technically inaccurate',
      'Cross-reference with authoritative textbooks or documentation',
      'Watch for confident but incorrect technical details',
      'AI may miss nuances experts would catch',
      'Verify examples actually work as described'
    ]
  },
  'code': {
    name: 'Code Generation',
    icon: Code,
    items: [
      'Read and understand every line',
      'Test with normal inputs AND edge cases',
      'Test with intentionally malformed inputs',
      'Verify behavior at array boundaries (empty, single, max)',
      'Check numerical precision for floating-point operations',
      'Check for security vulnerabilities (injection, etc.)',
      'Verify error handling is appropriate',
      'Don\'t trust AI comments — they may describe wrong behavior',
      'Run linters and static analysis',
      'Do not assume AI-generated tests are sufficient'
    ]
  },
  'literature': {
    name: 'Literature Review & Research',
    icon: BookOpen,
    items: [
      'Every citation must be verified to exist',
      'Check that citations actually support the claims made',
      'Watch for conflation of different papers\' findings',
      'Be skeptical of "comprehensive" claims',
      'AI cannot access recent papers (training cutoff)',
      'DOIs may be fabricated — look them up'
    ]
  },
  'summarization': {
    name: 'Summarization',
    icon: FileText,
    items: [
      'Read original sources to verify summary accuracy',
      'Watch for missed nuances or oversimplification',
      'Check that key points weren\'t omitted',
      'Verify direct quotes if any are included',
      'Be alert to subtle reframing of arguments'
    ]
  },
  'data-cleaning': {
    name: 'Data Cleaning & Formatting',
    icon: BarChart3,
    items: [
      'Spot-check a sample of transformed data',
      'Verify edge cases (empty fields, special characters)',
      'Check that no data was lost in transformation',
      'Validate data types after conversion',
      'Test with the largest and smallest values'
    ]
  },
  'analysis': {
    name: 'Data Analysis',
    icon: BarChart3,
    items: [
      'Validate methodology is appropriate for your data',
      'Check all calculations independently',
      'Verify statistical tests are correctly applied',
      'Don\'t trust AI interpretation of results',
      'Watch for plausible-sounding but wrong analysis',
      'Check assumptions underlying any statistical tests'
    ]
  },
  'statistics': {
    name: 'Statistical Work',
    icon: BarChart3,
    items: [
      'Verify the test chosen is appropriate for your data',
      'Check assumptions (normality, independence, etc.)',
      'Validate sample size calculations',
      'Don\'t trust p-value interpretations without verification',
      'Have a statistician review if stakes are high',
      'Check for multiple comparison issues'
    ]
  },
  'factual': {
    name: 'Factual Research',
    icon: BookOpen,
    items: [
      'Verify EVERY factual claim against primary sources',
      'AI confidently states false information',
      'Numbers and dates are particularly unreliable',
      'Cross-reference multiple authoritative sources',
      'Be especially skeptical of specific details'
    ]
  },
  'citations': {
    name: 'Citation Generation',
    icon: BookOpen,
    items: [
      'Assume ALL citations are fabricated until verified',
      'Look up every single citation in actual databases',
      'Check author names, titles, journals, years, DOIs',
      'Verify the cited work actually supports your claim',
      'Never submit without manual verification of every reference'
    ]
  },
  'legal': {
    name: 'Legal/Compliance Text',
    icon: FileText,
    items: [
      'AI output requires full legal expert review',
      'Jurisdiction-specific requirements may be missed',
      'Regulatory language has precise meanings',
      'Do not rely on AI for compliance decisions',
      'Use only as a starting draft for expert revision'
    ]
  },
  'clinical': {
    name: 'Clinical Applications',
    icon: AlertTriangle,
    items: [
      'Requires FDA pathway analysis',
      'Patient safety is paramount',
      'Clinical validation studies required',
      'Consult regulatory affairs early',
      'Never deploy without proper oversight structure'
    ]
  }
}

// Pipeline/automation-specific pitfalls
const pipelinePitfalls = {
  name: 'Automated/Pipeline Usage',
  icon: Workflow,
  items: [
    'How will you monitor output quality over time?',
    'What happens when the API fails or rate-limits?',
    'How do you validate outputs at scale (spot-checking, automated checks)?',
    'What is your alerting strategy for unexpected outputs?',
    'How do you version your prompts alongside your code?',
    'Have you budgeted for API costs at scale?'
  ]
}

// State
const selectedTask = ref(taskType.value || null)
const showPipeline = ref(false)
const checkedItems = ref(new Set())
const expandedSections = ref(new Set())

const isComplete = computed(() => selectedTask.value !== null)

const currentChecklist = computed(() => {
  if (!selectedTask.value) return null
  return pitfallChecklists[selectedTask.value]
})

const allTaskTypes = computed(() => {
  return Object.entries(pitfallChecklists).map(([id, config]) => ({
    id,
    ...config
  }))
})

function selectTask(taskId) {
  selectedTask.value = taskId
  checkedItems.value = new Set()

  aiStore.completeApplet(APPLET_ID, {
    taskType: taskId,
    checklistName: pitfallChecklists[taskId]?.name
  })
}

function toggleItem(item) {
  const key = `${selectedTask.value}-${item}`
  if (checkedItems.value.has(key)) {
    checkedItems.value.delete(key)
  } else {
    checkedItems.value.add(key)
  }
  checkedItems.value = new Set(checkedItems.value)
}

function isItemChecked(item) {
  return checkedItems.value.has(`${selectedTask.value}-${item}`)
}

function togglePipelineItem(item) {
  const key = `pipeline-${item}`
  if (checkedItems.value.has(key)) {
    checkedItems.value.delete(key)
  } else {
    checkedItems.value.add(key)
  }
  checkedItems.value = new Set(checkedItems.value)
}

function isPipelineItemChecked(item) {
  return checkedItems.value.has(`pipeline-${item}`)
}

function getNextApplet() {
  return 'disclosure-framework'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Common Pitfalls"
    core-question="What should I watch for with this task type?"
    :icon="AlertTriangle"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Intro -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Different AI use cases have different failure modes. Generic warnings aren't as useful
        as specific, contextual guidance. Select your task type for a targeted checklist.
      </p>
    </div>

    <!-- Task Type Selection -->
    <div class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Select Task Type
      </h3>
      <div class="grid gap-2 sm:grid-cols-2">
        <button
          v-for="task in allTaskTypes"
          :key="task.id"
          @click="selectTask(task.id)"
          class="p-3 rounded-lg border-2 text-left transition-all"
          :class="[
            selectedTask === task.id
              ? (preferencesStore.darkMode ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-400')
              : (preferencesStore.darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'),
            preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'
          ]"
        >
          <div class="flex items-center gap-2">
            <component
              :is="task.icon"
              class="w-4 h-4 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            />
            <span class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ task.name }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Task-Specific Checklist -->
    <div v-if="currentChecklist" class="mb-6">
      <div class="flex items-center gap-2 mb-4">
        <component
          :is="currentChecklist.icon"
          class="w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-orange-400' : 'text-orange-600'"
        />
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          {{ currentChecklist.name }} Checklist
        </h3>
      </div>

      <div class="space-y-2">
        <div
          v-for="(item, index) in currentChecklist.items"
          :key="index"
          @click="toggleItem(item)"
          class="p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3"
          :class="[
            isItemChecked(item)
              ? (preferencesStore.darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300')
              : (preferencesStore.darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300')
          ]"
        >
          <div
            class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center"
            :class="isItemChecked(item)
              ? 'bg-green-500 border-green-500'
              : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
          >
            <CheckCircle v-if="isItemChecked(item)" class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pipeline/Automation Section -->
    <div
      v-if="selectedTask"
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <button
        @click="showPipeline = !showPipeline"
        class="w-full flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <Workflow class="w-5 h-5" :class="preferencesStore.darkMode ? 'text-purple-400' : 'text-purple-600'" />
          <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            Using AI in a Pipeline/Automation?
          </h3>
        </div>
        <component
          :is="showPipeline ? ChevronDown : ChevronRight"
          class="w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        />
      </button>

      <div v-if="showPipeline" class="mt-4 space-y-2">
        <p class="text-sm mb-3" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
          Production systems with automated AI calls have different risk profiles than interactive use.
        </p>
        <div
          v-for="(item, index) in pipelinePitfalls.items"
          :key="index"
          @click="togglePipelineItem(item)"
          class="p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3"
          :class="[
            isPipelineItemChecked(item)
              ? (preferencesStore.darkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-300')
              : (preferencesStore.darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300')
          ]"
        >
          <div
            class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center"
            :class="isPipelineItemChecked(item)
              ? 'bg-purple-500 border-purple-500'
              : (preferencesStore.darkMode ? 'border-gray-500' : 'border-gray-300')"
          >
            <CheckCircle v-if="isPipelineItemChecked(item)" class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <!-- Warning for high-risk tasks -->
    <div
      v-if="['clinical', 'legal', 'statistics', 'citations'].includes(selectedTask)"
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'"
    >
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-600'" />
        <div>
          <p class="font-medium" :class="preferencesStore.darkMode ? 'text-red-300' : 'text-red-800'">
            High-Risk Task Type
          </p>
          <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-700'">
            This task type has a poor fit for AI assistance. Consider whether the time spent on
            verification exceeds the time saved. Expert review is essential.
          </p>
        </div>
      </div>
    </div>
  </AppletFrame>
</template>
