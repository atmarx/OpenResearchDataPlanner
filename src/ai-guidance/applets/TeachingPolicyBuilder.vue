<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  GraduationCap,
  CheckCircle,
  Copy,
  AlertTriangle,
  XCircle,
  Info,
  FileText
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'teaching-policy-builder'

// Policy approaches
const policyApproaches = [
  {
    id: 'prohibition',
    name: 'Prohibition',
    description: 'No AI use permitted',
    bestFor: 'High-stakes assessment, foundational skills development',
    icon: XCircle,
    color: 'red'
  },
  {
    id: 'restricted',
    name: 'Restricted',
    description: 'AI permitted for specific tasks only',
    bestFor: 'Mixed use cases, scaffolded learning',
    icon: AlertTriangle,
    color: 'yellow'
  },
  {
    id: 'disclosure',
    name: 'Permitted with Disclosure',
    description: 'AI allowed if documented',
    bestFor: 'Process-focused courses, research skills',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'encouraged',
    name: 'Encouraged',
    description: 'AI use is part of learning objectives',
    bestFor: 'AI literacy courses, professional preparation',
    icon: CheckCircle,
    color: 'green'
  },
  {
    id: 'required',
    name: 'Required',
    description: 'AI use is mandatory for assignments',
    bestFor: 'Teaching AI skills, computational courses',
    icon: CheckCircle,
    color: 'purple'
  }
]

// Decision questions
const decisionQuestions = [
  {
    id: 'objectives',
    question: 'What are your learning objectives?',
    options: [
      { value: 'skill-development', label: 'Skill development (practice/mastery)', suggests: 'prohibition' },
      { value: 'output-quality', label: 'Output quality (professional work)', suggests: 'encouraged' },
      { value: 'ai-literacy', label: 'AI literacy (learning to use AI)', suggests: 'required' },
      { value: 'mixed', label: 'Mixed objectives', suggests: 'restricted' }
    ]
  },
  {
    id: 'assessment',
    question: 'How will you assess learning?',
    options: [
      { value: 'ai-can-do', label: 'AI can complete the assignment', suggests: 'prohibition' },
      { value: 'human-judgment', label: 'Human judgment is key to success', suggests: 'disclosure' },
      { value: 'process-matters', label: 'Process matters as much as output', suggests: 'disclosure' },
      { value: 'ai-augments', label: 'AI augments but doesn\'t replace', suggests: 'encouraged' }
    ]
  },
  {
    id: 'enforcement',
    question: 'What\'s feasible to enforce?',
    options: [
      { value: 'can-detect', label: 'Can reliably detect violations', suggests: 'prohibition' },
      { value: 'honor-system', label: 'Rely on honor system/disclosure', suggests: 'disclosure' },
      { value: 'design-around', label: 'Design assignments AI can\'t do', suggests: 'restricted' },
      { value: 'embrace', label: 'Embrace AI, teach responsible use', suggests: 'encouraged' }
    ]
  }
]

// Policy components checklist
const policyComponents = [
  { id: 'permitted', label: 'Is AI use permitted, restricted, or prohibited?' },
  { id: 'which', label: 'For which assignments/activities?' },
  { id: 'disclosure', label: 'What disclosure is required?' },
  { id: 'documentation', label: 'What documentation must students keep?' },
  { id: 'evaluation', label: 'How will AI-assisted work be evaluated?' },
  { id: 'consequences', label: 'What are the consequences of policy violations?' },
  { id: 'help', label: 'Where can students get help with AI tools?' }
]

// State
const selectedApproach = ref(null)
const answers = ref({})
const checkedComponents = ref(new Set())
const copiedLanguage = ref(false)

const isComplete = computed(() => selectedApproach.value !== null)

const suggestedApproach = computed(() => {
  const suggestions = Object.values(answers.value)
  if (suggestions.length === 0) return null

  const counts = {}
  suggestions.forEach(s => {
    counts[s] = (counts[s] || 0) + 1
  })

  let maxCount = 0
  let suggested = null
  Object.entries(counts).forEach(([approach, count]) => {
    if (count > maxCount) {
      maxCount = count
      suggested = approach
    }
  })

  return suggested
})

function selectApproach(approachId) {
  selectedApproach.value = approachId

  aiStore.completeApplet(APPLET_ID, {
    approach: approachId,
    approachName: policyApproaches.find(a => a.id === approachId)?.name,
    answers: answers.value,
    components: Array.from(checkedComponents.value)
  })
}

function selectAnswer(questionId, value, suggests) {
  answers.value = { ...answers.value, [questionId]: suggests }
}

function toggleComponent(componentId) {
  if (checkedComponents.value.has(componentId)) {
    checkedComponents.value.delete(componentId)
  } else {
    checkedComponents.value.add(componentId)
  }
  checkedComponents.value = new Set(checkedComponents.value)
}

function isComponentChecked(componentId) {
  return checkedComponents.value.has(componentId)
}

function getApproachColorClasses(approach, selected) {
  const isDark = preferencesStore.darkMode
  const colors = {
    red: selected
      ? (isDark ? 'bg-red-900/30 border-red-500' : 'bg-red-50 border-red-400')
      : (isDark ? 'border-red-800 hover:border-red-700' : 'border-red-200 hover:border-red-300'),
    yellow: selected
      ? (isDark ? 'bg-yellow-900/30 border-yellow-500' : 'bg-yellow-50 border-yellow-400')
      : (isDark ? 'border-yellow-800 hover:border-yellow-700' : 'border-yellow-200 hover:border-yellow-300'),
    blue: selected
      ? (isDark ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-400')
      : (isDark ? 'border-blue-800 hover:border-blue-700' : 'border-blue-200 hover:border-blue-300'),
    green: selected
      ? (isDark ? 'bg-green-900/30 border-green-500' : 'bg-green-50 border-green-400')
      : (isDark ? 'border-green-800 hover:border-green-700' : 'border-green-200 hover:border-green-300'),
    purple: selected
      ? (isDark ? 'bg-purple-900/30 border-purple-500' : 'bg-purple-50 border-purple-400')
      : (isDark ? 'border-purple-800 hover:border-purple-700' : 'border-purple-200 hover:border-purple-300')
  }
  return colors[approach.color] || colors.blue
}

const syllabusLanguage = computed(() => {
  if (!selectedApproach.value) return ''

  const approach = policyApproaches.find(a => a.id === selectedApproach.value)

  const templates = {
    prohibition: `AI Policy: Prohibited

The use of AI tools (such as ChatGPT, Claude, Copilot, etc.) is not permitted for any assignments in this course. All submitted work must be entirely your own.

Rationale: This course focuses on developing foundational skills that require independent practice and mastery. Using AI tools would undermine the learning objectives.

Violations will be treated as academic integrity violations per university policy.`,

    restricted: `AI Policy: Restricted Use

AI tools may be used ONLY for the following activities:
- [List specific permitted uses]

AI tools are NOT permitted for:
- [List prohibited uses]

For any permitted use, you must document what tools you used and how.`,

    disclosure: `AI Policy: Permitted with Disclosure

You may use AI tools to assist with coursework, but you must:
1. Disclose all AI use in your submissions
2. Specify which tools you used and for what purpose
3. Include your original prompts and AI outputs if requested
4. Take full responsibility for the accuracy of submitted work

Remember: AI tools can produce plausible-sounding but incorrect information. You must verify all AI-generated content.`,

    encouraged: `AI Policy: Encouraged

AI literacy is a learning objective of this course. You are encouraged to use AI tools to enhance your work. When using AI:

1. Document your AI usage (tool, purpose, extent)
2. Critically evaluate AI outputs
3. Use AI to augment, not replace, your thinking
4. Be prepared to explain and defend your work

We will discuss effective and ethical AI use throughout the course.`,

    required: `AI Policy: Required

This course includes assignments that require AI tool usage. You will learn to:
- Effectively prompt AI systems
- Critically evaluate AI outputs
- Integrate AI into your workflow responsibly

Specific AI tool requirements will be outlined for each assignment. You must document your AI interactions and reflect on the experience.`
  }

  return templates[selectedApproach.value] || ''
})

async function copySyllabusLanguage() {
  try {
    await navigator.clipboard.writeText(syllabusLanguage.value)
    copiedLanguage.value = true
    setTimeout(() => copiedLanguage.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function getNextApplet() {
  return 'student-guidance'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Teaching Policy Builder"
    core-question="How should I handle AI in my course?"
    :icon="GraduationCap"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Intro -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Faculty need to make deliberate decisions about AI use in their courses,
        communicate clearly to students, and align with institutional norms.
        This tool helps you develop a coherent policy.
      </p>
    </div>

    <!-- Decision Questions -->
    <div class="mb-6">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Consider Your Context
      </h3>
      <div class="space-y-4">
        <div
          v-for="question in decisionQuestions"
          :key="question.id"
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <h4 class="font-medium mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            {{ question.question }}
          </h4>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="option in question.options"
              :key="option.value"
              @click="selectAnswer(question.id, option.value, option.suggests)"
              class="p-2 rounded-lg border text-left text-sm transition-all"
              :class="[
                answers[question.id] === option.suggests
                  ? (preferencesStore.darkMode ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-400')
                  : (preferencesStore.darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300')
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Suggestion -->
      <div
        v-if="suggestedApproach"
        class="mt-4 p-3 rounded-lg"
        :class="preferencesStore.darkMode ? 'bg-blue-900/20' : 'bg-blue-50'"
      >
        <p class="text-sm" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-700'">
          <Info class="w-4 h-4 inline mr-1" />
          Based on your answers, consider the
          <strong>{{ policyApproaches.find(a => a.id === suggestedApproach)?.name }}</strong> approach.
        </p>
      </div>
    </div>

    <!-- Policy Spectrum -->
    <div class="mb-6">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Select Your Approach
      </h3>
      <div class="space-y-3">
        <button
          v-for="approach in policyApproaches"
          :key="approach.id"
          @click="selectApproach(approach.id)"
          class="w-full p-4 rounded-lg border-2 text-left transition-all"
          :class="[
            getApproachColorClasses(approach, selectedApproach === approach.id),
            preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'
          ]"
        >
          <div class="flex items-start gap-3">
            <component
              :is="approach.icon"
              class="w-5 h-5 flex-shrink-0 mt-0.5"
              :class="{
                'text-red-500': approach.color === 'red',
                'text-yellow-500': approach.color === 'yellow',
                'text-blue-500': approach.color === 'blue',
                'text-green-500': approach.color === 'green',
                'text-purple-500': approach.color === 'purple'
              }"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                  {{ approach.name }}
                </h4>
                <span
                  v-if="suggestedApproach === approach.id"
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="preferencesStore.darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'"
                >
                  Suggested
                </span>
              </div>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ approach.description }}
              </p>
              <p class="text-xs mt-1" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
                Best for: {{ approach.bestFor }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Policy Components Checklist -->
    <div
      v-if="selectedApproach"
      class="mb-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Policy Components to Address
      </h3>
      <div class="space-y-2">
        <div
          v-for="component in policyComponents"
          :key="component.id"
          @click="toggleComponent(component.id)"
          class="flex items-center gap-3 p-2 rounded cursor-pointer transition-colors"
          :class="preferencesStore.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'"
        >
          <div
            class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center"
            :class="isComponentChecked(component.id)
              ? 'bg-green-500 border-green-500'
              : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
          >
            <CheckCircle v-if="isComponentChecked(component.id)" class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ component.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Template Syllabus Language -->
    <div
      v-if="selectedApproach"
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Template Syllabus Language
        </h3>
        <button
          @click="copySyllabusLanguage"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          :class="copiedLanguage
            ? (preferencesStore.darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700')
            : (preferencesStore.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
        >
          <component :is="copiedLanguage ? CheckCircle : Copy" class="w-4 h-4" />
          {{ copiedLanguage ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <pre
        class="text-sm p-3 rounded-lg overflow-x-auto whitespace-pre-wrap"
        :class="preferencesStore.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'"
      >{{ syllabusLanguage }}</pre>
      <p class="text-xs mt-2" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
        Customize this template for your specific course and assignments.
      </p>
    </div>
  </AppletFrame>
</template>
