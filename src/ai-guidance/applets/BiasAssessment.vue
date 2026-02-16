<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  Scale,
  CheckCircle,
  AlertTriangle,
  Info,
  Users,
  Code,
  FileText,
  Image,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'bias-assessment'

// Get task type from previous applets
const taskOutput = computed(() => aiStore.getAppletOutput('task-fit'))

// Use case relevance
const useCaseRelevance = [
  { useCase: 'Text about/affecting people', relevance: 'high', icon: Users },
  { useCase: 'Image generation with people', relevance: 'high', icon: Image },
  { useCase: 'Classification of people', relevance: 'very-high', icon: Users },
  { useCase: 'Decision support about people', relevance: 'very-high', icon: TrendingUp },
  { useCase: 'Code generation (general)', relevance: 'low-medium', icon: Code },
  { useCase: 'Scientific data analysis', relevance: 'domain-dependent', icon: FileText },
  { useCase: 'Physical sciences (no human element)', relevance: 'lower', icon: FileText },
  { useCase: 'Pure math/logic tasks', relevance: 'lower', icon: FileText }
]

// Where bias enters
const biasStages = [
  {
    stage: 'Training data',
    source: 'Historical patterns in data',
    example: 'Models reflecting societal biases'
  },
  {
    stage: 'Model design',
    source: 'Optimization objectives',
    example: 'What the model learned to prioritize'
  },
  {
    stage: 'Deployment context',
    source: 'Who uses it and how',
    example: 'Different accuracy across demographics'
  },
  {
    stage: 'User interaction',
    source: 'How you prompt and interpret',
    example: 'Confirmation of existing assumptions'
  }
]

// Bias risk by use case
const biasRisks = [
  { useCase: 'Text generation', risk: 'medium-high', concerns: 'Gender, cultural, political bias in framing' },
  { useCase: 'Code generation', risk: 'medium', concerns: 'Perpetuating coding style biases; security patterns' },
  { useCase: 'Analysis/summarization', risk: 'medium', concerns: 'Emphasis, framing, what\'s included/excluded' },
  { useCase: 'Image generation', risk: 'high', concerns: 'Demographics, stereotypes, representation' },
  { useCase: 'Recommendation', risk: 'high', concerns: 'Filter bubbles, popularity bias' },
  { useCase: 'Classification (people)', risk: 'very-high', concerns: 'Demographic disparities in accuracy' },
  { useCase: 'Decision support', risk: 'context-dependent', concerns: 'Amplifies historical decision patterns' }
]

// Discipline-specific concerns
const disciplineConcerns = [
  { track: 'Human subjects / social sciences', concerns: 'Demographic representation, cultural assumptions, stereotype reinforcement' },
  { track: 'Physical sciences / engineering', concerns: 'Training data coverage of physical phenomena, domain shift' },
  { track: 'Quantitative / financial', concerns: 'Market data biases, survivorship bias, look-ahead bias' },
  { track: 'Creative / humanities', concerns: 'Cultural representation, Western-centric training, appropriation' }
]

// Mitigation strategies
const mitigationStrategies = [
  'Test with diverse inputs across relevant dimensions',
  'Disaggregate results by relevant demographics (when applicable)',
  'Have diverse reviewers check outputs',
  'Document known limitations',
  'Don\'t deploy for high-stakes decisions on people without audit',
  'Report bias issues you discover'
]

// State
const selectedRelevance = ref(null)
const checkedStrategies = ref(new Set())
const showBiasStages = ref(false)

const isComplete = computed(() => selectedRelevance.value !== null)

const relevanceInfo = {
  'high': { label: 'High Relevance', color: 'red', description: 'Proceed with full bias assessment' },
  'very-high': { label: 'Very High Relevance', color: 'red', description: 'Proceed with full bias assessment' },
  'medium': { label: 'Medium Relevance', color: 'yellow', description: 'Consider bias implications for your specific use' },
  'low-medium': { label: 'Low-Medium Relevance', color: 'blue', description: 'Check for style/pattern biases' },
  'domain-dependent': { label: 'Domain Dependent', color: 'yellow', description: 'Check training data representativeness' },
  'lower': { label: 'Lower Relevance', color: 'green', description: 'Demographic bias may not be primary concern' }
}

function selectRelevance(relevance) {
  selectedRelevance.value = relevance

  aiStore.completeApplet(APPLET_ID, {
    relevance,
    strategies: Array.from(checkedStrategies.value)
  })
}

function toggleStrategy(strategy) {
  if (checkedStrategies.value.has(strategy)) {
    checkedStrategies.value.delete(strategy)
  } else {
    checkedStrategies.value.add(strategy)
  }
  checkedStrategies.value = new Set(checkedStrategies.value)
}

function isStrategyChecked(strategy) {
  return checkedStrategies.value.has(strategy)
}

function getRelevanceClasses(relevance, selected) {
  const isDark = preferencesStore.darkMode
  const info = relevanceInfo[relevance] || relevanceInfo['medium']
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
      : (isDark ? 'border-green-800 hover:border-green-700' : 'border-green-200 hover:border-green-300')
  }
  return colors[info.color] || colors.yellow
}

function getRiskBadgeClass(risk) {
  const isDark = preferencesStore.darkMode
  const classes = {
    'very-high': isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700',
    'high': isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700',
    'medium-high': isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
    'medium': isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
    'context-dependent': isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
  }
  return classes[risk] || classes.medium
}

function getNextApplet() {
  return null // Last applet
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Bias Assessment"
    core-question="Could AI bias affect my results?"
    :icon="Scale"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Intro -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Every AI system has biases baked into its training data. This is not a bug to be fixed later — it is fundamental.
        Different use cases have different bias relevance. Select yours below to see tailored guidance.
      </p>
    </div>

    <!-- Applicability Check -->
    <div class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Is Bias Assessment Relevant to Your Use Case?
      </h3>
      <div class="space-y-2">
        <button
          v-for="item in useCaseRelevance"
          :key="item.useCase"
          @click="selectRelevance(item.relevance)"
          class="w-full p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3"
          :class="[
            getRelevanceClasses(item.relevance, selectedRelevance === item.relevance),
            preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'
          ]"
        >
          <component
            :is="item.icon"
            class="w-5 h-5 flex-shrink-0"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
          />
          <div class="flex-1">
            <span class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ item.useCase }}
            </span>
          </div>
          <span
            class="px-2 py-0.5 text-xs rounded-full"
            :class="getRiskBadgeClass(item.relevance)"
          >
            {{ relevanceInfo[item.relevance]?.label || item.relevance }}
          </span>
        </button>
      </div>
    </div>

    <!-- Relevance Result -->
    <div
      v-if="selectedRelevance"
      class="mb-6 p-4 rounded-lg border-2"
      :class="getRelevanceClasses(selectedRelevance, true)"
    >
      <div class="flex items-center gap-3">
        <component
          :is="relevanceInfo[selectedRelevance]?.color === 'green' ? Info : AlertTriangle"
          class="w-6 h-6 flex-shrink-0"
        />
        <div>
          <h4 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            {{ relevanceInfo[selectedRelevance]?.label }}
          </h4>
          <p class="text-sm">{{ relevanceInfo[selectedRelevance]?.description }}</p>
        </div>
      </div>
    </div>

    <!-- Where Bias Enters (Collapsible) -->
    <div
      v-if="selectedRelevance && ['high', 'very-high', 'medium', 'medium-high'].includes(selectedRelevance)"
      class="mb-6"
    >
      <button
        @click="showBiasStages = !showBiasStages"
        class="flex items-center gap-2 w-full text-left mb-3"
      >
        <component
          :is="showBiasStages ? ChevronDown : ChevronRight"
          class="w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        />
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Where Bias Enters
        </h3>
      </button>

      <div v-if="showBiasStages" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'">
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Stage</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Bias Source</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in biasStages"
              :key="item.stage"
              :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
            >
              <td class="p-2 border-b font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">{{ item.stage }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ item.source }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ item.example }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bias Risk by Use Case -->
    <div
      v-if="selectedRelevance && ['high', 'very-high', 'medium', 'medium-high'].includes(selectedRelevance)"
      class="mb-6"
    >
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Bias Risk by Use Case
      </h3>
      <div class="space-y-2">
        <div
          v-for="item in biasRisks"
          :key="item.useCase"
          class="p-3 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ item.useCase }}
            </span>
            <span
              class="px-2 py-0.5 text-xs rounded-full"
              :class="getRiskBadgeClass(item.risk)"
            >
              {{ item.risk }}
            </span>
          </div>
          <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
            {{ item.concerns }}
          </p>
        </div>
      </div>
    </div>

    <!-- Mitigation Strategies -->
    <div
      v-if="selectedRelevance"
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Bias Mitigation Strategies
      </h3>
      <div class="space-y-2">
        <div
          v-for="strategy in mitigationStrategies"
          :key="strategy"
          @click="toggleStrategy(strategy)"
          class="flex items-start gap-3 p-2 rounded cursor-pointer transition-colors"
          :class="preferencesStore.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'"
        >
          <div
            class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center"
            :class="isStrategyChecked(strategy)
              ? 'bg-green-500 border-green-500'
              : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
          >
            <CheckCircle v-if="isStrategyChecked(strategy)" class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ strategy }}
          </span>
        </div>
      </div>
    </div>

    <!-- Physical Sciences Note -->
    <div
      v-if="selectedRelevance === 'lower'"
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'"
    >
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 flex-shrink-0 mt-0.5" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'" />
        <div>
          <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'">
            For Non-Human Element Tasks
          </h4>
          <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'">
            If your use case has no human element (e.g., analyzing crystal structures, physics simulations),
            the demographic bias framing may not apply. However, consider: Is your training/prompt data
            representative of the phenomena you're studying?
          </p>
        </div>
      </div>
    </div>

    <!-- Completion Message -->
    <div
      v-if="isComplete"
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'"
    >
      <p class="font-medium" :class="preferencesStore.darkMode ? 'text-green-300' : 'text-green-800'">
        ✅ AI Guidance Complete
      </p>
      <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-700'">
        You've completed all available applets. Return to the AI Guidance home to review your results
        or explore other sections.
      </p>
    </div>
  </AppletFrame>
</template>
