<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
  X,
  ArrowRight,
  ArrowLeft,
  Users,
  HeartPulse,
  UserCheck,
  GraduationCap,
  Landmark,
  FileLock,
  Globe,
  Lock,
  Info,
  CheckCircle,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  List,
  MessageCircleQuestion,
  Check,
  BookOpen,
  Fingerprint
} from 'lucide-vue-next'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'
import DataIdentificationFlow from '@/components/explore/DataIdentificationFlow.vue'

const router = useRouter()
const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

// Get questionnaire config
const questionnaireConfig = computed(() => configStore.config?.tier_questionnaire || {})
const questions = computed(() => questionnaireConfig.value.questions || [])
const intro = computed(() => questionnaireConfig.value.intro || {})
const summary = computed(() => questionnaireConfig.value.summary || {})
const examples = computed(() => questionnaireConfig.value.examples_by_discipline || {})

// State
const viewMode = ref('questionnaire') // 'questionnaire', 'table', 'examples', or 'identification'
const currentQuestionId = ref(null) // null = intro screen
const answers = ref({})
const flags = ref([])
const determinedTier = ref(null)
const showLearnMore = ref(false)
const selectedDiscipline = ref(null)

// Sorted tiers for table view
const sortedTiers = computed(() => {
  return [...(configStore.tiers || [])].sort((a, b) => a.sort_order - b.sort_order)
})

// Icon mapping
const iconMap = {
  'users': Users,
  'heart-pulse': HeartPulse,
  'user-check': UserCheck,
  'graduation-cap': GraduationCap,
  'landmark': Landmark,
  'file-lock': FileLock,
  'globe-lock': Globe,
  'lock': Lock
}

// Current question
const currentQuestion = computed(() => {
  if (!currentQuestionId.value) return null
  return questions.value.find(q => q.id === currentQuestionId.value)
})

// Check if we're at the summary
const atSummary = computed(() => currentQuestionId.value === 'complete')

// Get tier config
const tierConfig = computed(() => {
  if (!determinedTier.value) return null
  return configStore.tiersBySlug?.[determinedTier.value.toLowerCase()]
})

// Get CTA for current tier
const tierCta = computed(() => {
  if (!determinedTier.value) return null
  return summary.value.cta?.[determinedTier.value]
})

// Start the questionnaire
function startQuestionnaire() {
  currentQuestionId.value = questions.value[0]?.id || null
}

// Skip to tier selection
function skipToTierSelect() {
  router.push('/')
}

// Handle answer selection
function selectAnswer(option) {
  // Store answer
  answers.value[currentQuestionId.value] = option.value

  // Apply tier if set
  if (option.sets_tier) {
    determinedTier.value = option.sets_tier
  }

  // Apply flags if set
  if (option.sets_flags) {
    flags.value = [...new Set([...flags.value, ...option.sets_flags])]
  }

  // Clear flags if specified
  if (option.clears_flags) {
    flags.value = flags.value.filter(f => !option.clears_flags.includes(f))
  }

  // Navigate to next question
  if (option.next === 'complete') {
    currentQuestionId.value = 'complete'
  } else if (option.next) {
    currentQuestionId.value = option.next
  }
}

// Go back to previous question (simplified - just go to intro for now)
function goBack() {
  if (atSummary.value) {
    // Find the last question before complete
    const lastQ = questions.value.filter(q => q.type !== 'summary').pop()
    currentQuestionId.value = lastQ?.id || null
  } else {
    // Simple back - go to intro
    currentQuestionId.value = null
    answers.value = {}
    flags.value = []
    determinedTier.value = null
  }
}

// Apply the determined tier and navigate to wizard grant-period step
function applyTier() {
  if (determinedTier.value) {
    const tierSlug = determinedTier.value.toLowerCase()
    sessionStore.setTier(tierSlug)
    navigateToWizardWithTier()
  }
}

// Select a tier from table view and navigate to wizard grant-period step
function selectTierFromTable(tierSlug) {
  sessionStore.setTier(tierSlug)
  navigateToWizardWithTier()
}

// Navigate to wizard at grant-period step (skip welcome and tier-select)
function navigateToWizardWithTier() {
  // Mark prerequisite steps as completed
  sessionStore.completeStep('welcome')
  sessionStore.completeStep('tier-select')
  // Set current step to grant-period (step 3)
  sessionStore.setStep('grant-period')
  router.push('/')
}

// Get tier icon based on color
const tierIcons = {
  green: ShieldCheck,
  yellow: Shield,
  orange: ShieldAlert,
  red: Lock
}

function getTierIcon(color) {
  return tierIcons[color] || Shield
}

// Get tier color classes from tier config or fall back to severity-based
function getTierColor(tierSlug) {
  const tier = configStore.tiersBySlug?.[tierSlug?.toLowerCase()]

  // Use tier's color if defined in config
  if (tier?.color) {
    return tier.color
  }

  // Fall back based on tier's severity level (higher = more restrictive)
  const level = tier?.level || 0
  if (level >= 4) return 'bg-red-100 text-red-800 border-red-300'
  if (level >= 3) return 'bg-amber-100 text-amber-800 border-amber-300'
  if (level >= 2) return 'bg-blue-100 text-blue-800 border-blue-300'
  return 'bg-green-100 text-green-800 border-green-300'
}

// Get icon component for a question
function getIcon(iconName) {
  return iconMap[iconName] || Info
}

// Handle completion of data identification flow
function handleIdentificationComplete(result) {
  // Based on the result, we can guide the user to the appropriate tier
  // The result has: status ('identified', 'encoded', 'deidentified'), tier suggestion, etc.
  if (result.status === 'deidentified') {
    // De-identified data might qualify for L1/L2, switch to questionnaire for full assessment
    viewMode.value = 'questionnaire'
    currentQuestionId.value = null
  } else {
    // Identified or encoded data - switch to questionnaire to determine exact tier
    viewMode.value = 'questionnaire'
    currentQuestionId.value = null
  }
}

// Handle learn_more link clicks
function handleLearnMoreLink(link) {
  if (link.action === 'open_calculator' && link.calculator === 'data-identification') {
    viewMode.value = 'identification'
    showLearnMore.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="preferencesStore.darkMode ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <!-- Header -->
    <header
      class="border-b sticky top-0 z-10"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="max-w-3xl mx-auto px-4 py-3">
        <div class="flex items-center justify-center gap-6">
          <h1
            class="text-xl font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >Check Your Data Tier</h1>

          <!-- View Toggle Tabs -->
          <div class="flex gap-1">
          <button
            @click="viewMode = 'questionnaire'; currentQuestionId = null"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
            :class="viewMode === 'questionnaire'
              ? (preferencesStore.darkMode
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-900')
              : (preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700')"
          >
            <MessageCircleQuestion class="w-4 h-4" />
            Guided Questions
          </button>
          <button
            @click="viewMode = 'table'"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
            :class="viewMode === 'table'
              ? (preferencesStore.darkMode
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-900')
              : (preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700')"
          >
            <List class="w-4 h-4" />
            All Tiers
          </button>
          <button
            @click="viewMode = 'examples'; selectedDiscipline = null"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
            :class="viewMode === 'examples'
              ? (preferencesStore.darkMode
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-900')
              : (preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700')"
          >
            <BookOpen class="w-4 h-4" />
            Examples
          </button>
          <button
            @click="viewMode = 'identification'"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
            :class="viewMode === 'identification'
              ? (preferencesStore.darkMode
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-900')
              : (preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700')"
          >
            <Fingerprint class="w-4 h-4" />
            Data Status
          </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-8">
      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="space-y-6">
        <p
          class="text-center"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          Select the tier that matches your data sensitivity. Click any tier to use it.
        </p>

        <!-- Tier Cards -->
        <div class="space-y-4">
          <button
            v-for="tier in sortedTiers"
            :key="tier.slug"
            @click="selectTierFromTable(tier.slug)"
            class="w-full text-left p-5 rounded-lg border-2 transition-all hover:shadow-md group"
            :class="{
              'bg-green-50 border-green-200 hover:border-green-400': tier.color === 'green',
              'bg-yellow-50 border-yellow-200 hover:border-yellow-400': tier.color === 'yellow',
              'bg-orange-50 border-orange-200 hover:border-orange-400': tier.color === 'orange',
              'bg-red-50 border-red-200 hover:border-red-400': tier.color === 'red'
            }"
          >
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="{
                  'bg-green-100 text-green-600': tier.color === 'green',
                  'bg-yellow-100 text-yellow-600': tier.color === 'yellow',
                  'bg-orange-100 text-orange-600': tier.color === 'orange',
                  'bg-red-100 text-red-600': tier.color === 'red'
                }"
              >
                <component :is="getTierIcon(tier.color)" class="w-6 h-6" />
              </div>

              <div class="flex-1 min-w-0">
                <!-- Header row -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span
                      class="text-lg font-bold"
                      :class="{
                        'text-green-800': tier.color === 'green',
                        'text-yellow-800': tier.color === 'yellow',
                        'text-orange-800': tier.color === 'orange',
                        'text-red-800': tier.color === 'red'
                      }"
                    >
                      {{ tier.short_name }}
                    </span>
                    <span class="text-gray-900 font-semibold">{{ tier.name }}</span>
                  </div>
                  <ArrowRight
                    class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                  />
                </div>

                <!-- Description -->
                <p class="text-sm text-gray-700 mb-3 whitespace-pre-line">
                  <AnnotatedText :text="tier.description" />
                </p>

                <!-- Types of Data -->
                <div v-if="tier.types_of_data?.length" class="mb-3">
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Types of Data:
                  </p>
                  <ul class="text-sm text-gray-600 space-y-0.5">
                    <li
                      v-for="dataType in tier.types_of_data"
                      :key="dataType"
                      class="flex items-start gap-2"
                    >
                      <span class="text-gray-400">•</span>
                      <span>{{ dataType }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Examples -->
                <div v-if="tier.examples?.length" class="mb-3">
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Examples:
                  </p>
                  <ul class="text-sm text-gray-600 space-y-0.5">
                    <li
                      v-for="example in tier.examples"
                      :key="example"
                      class="flex items-start gap-2"
                    >
                      <span class="text-gray-400">•</span>
                      <span>{{ example }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Requirements -->
                <div v-if="tier.requirements?.length" class="mb-3">
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Requirements:
                  </p>
                  <ul class="text-sm text-gray-600 space-y-0.5">
                    <li
                      v-for="req in tier.requirements"
                      :key="req"
                      class="flex items-start gap-2"
                    >
                      <span class="text-gray-400">•</span>
                      <span>{{ req }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Badges -->
                <div class="flex flex-wrap gap-2">
                  <span
                    v-if="tier.consultation_required"
                    class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800"
                  >
                    <AlertTriangle class="w-3 h-3" />
                    Consultation required
                  </span>
                  <span
                    v-if="tier.retention_questions_required"
                    class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                  >
                    <Info class="w-3 h-3" />
                    Retention planning required
                  </span>
                  <span
                    v-if="!tier.consultation_required && !tier.retention_questions_required"
                    class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800"
                  >
                    <Check class="w-3 h-3" />
                    Self-service
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Help text -->
        <p
          class="text-center text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
        >
          Not sure which tier fits?
          <button
            @click="viewMode = 'questionnaire'"
            class="text-blue-500 hover:underline"
          >Try the guided questions</button>
        </p>
      </div>

      <!-- Examples View -->
      <div v-else-if="viewMode === 'examples'" class="space-y-6">
        <p
          class="text-center"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          See what data types belong in each tier for your discipline.
        </p>

        <!-- Discipline selector -->
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="(disc, key) in examples"
            :key="key"
            @click="selectedDiscipline = selectedDiscipline === key ? null : key"
            class="px-4 py-2 text-sm rounded-lg border transition-colors"
            :class="selectedDiscipline === key
              ? 'bg-blue-100 border-blue-300 text-blue-800'
              : (preferencesStore.darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')"
          >
            {{ disc.name }}
          </button>
        </div>

        <!-- Selected discipline examples -->
        <div v-if="selectedDiscipline && examples[selectedDiscipline]" class="space-y-4">
          <template v-for="tier in sortedTiers" :key="tier.slug">
            <div
              v-if="examples[selectedDiscipline].examples?.[tier.slug]"
              class="p-4 rounded-lg border-2"
              :class="{
                'bg-green-50 border-green-200': tier.color === 'green',
                'bg-yellow-50 border-yellow-200': tier.color === 'yellow',
                'bg-orange-50 border-orange-200': tier.color === 'orange',
                'bg-red-50 border-red-200': tier.color === 'red'
              }"
            >
              <div class="flex items-center gap-3 mb-2">
                <component :is="getTierIcon(tier.color)" class="w-5 h-5" :class="{
                  'text-green-600': tier.color === 'green',
                  'text-yellow-600': tier.color === 'yellow',
                  'text-orange-600': tier.color === 'orange',
                  'text-red-600': tier.color === 'red'
                }" />
                <span class="font-semibold" :class="{
                  'text-green-800': tier.color === 'green',
                  'text-yellow-800': tier.color === 'yellow',
                  'text-orange-800': tier.color === 'orange',
                  'text-red-800': tier.color === 'red'
                }">{{ tier.short_name }}</span>
                <span class="text-gray-700">{{ tier.name }}</span>
              </div>
              <ul class="text-sm text-gray-700 space-y-1 ml-8">
                <li
                  v-for="(example, idx) in examples[selectedDiscipline].examples?.[tier.slug]"
                  :key="idx"
                  class="flex items-start gap-2"
                >
                  <span class="opacity-60">•</span>
                  {{ example }}
                </li>
              </ul>
            </div>
          </template>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="text-center py-12 rounded-lg border"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 text-gray-400'
            : 'bg-white border-gray-200 text-gray-500'"
        >
          <BookOpen class="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Select a discipline above to see example data types for each tier.</p>
        </div>

        <!-- CTA -->
        <div class="text-center pt-4 space-y-3">
          <button
            @click="viewMode = 'questionnaire'; currentQuestionId = null"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Answer questions to find your tier
            <ArrowRight class="w-5 h-5" />
          </button>
          <p
            class="text-sm"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
          >
            Or
            <button
              @click="viewMode = 'table'"
              class="text-blue-500 hover:underline"
            >select a tier directly</button>
          </p>
        </div>
      </div>

      <!-- Data Identification Flow View -->
      <div v-else-if="viewMode === 'identification'">
        <DataIdentificationFlow
          @complete="handleIdentificationComplete"
          @back="viewMode = 'questionnaire'; currentQuestionId = null"
        />
      </div>

      <!-- Questionnaire: Intro Screen -->
      <div v-else-if="viewMode === 'questionnaire' && !currentQuestionId" class="space-y-8">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield class="w-8 h-8 text-blue-600" />
          </div>
          <h2
            class="text-2xl font-bold mb-2"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ intro.title || "What type of data will you be working with?" }}
          </h2>
          <p
            class="whitespace-pre-line"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ intro.description }}
          </p>
        </div>

        <!-- Link to Examples Tab -->
        <button
          @click="viewMode = 'examples'"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
        >
          <BookOpen class="w-5 h-5 text-gray-400" />
          <span class="font-medium">See examples by discipline</span>
          <ArrowRight class="w-4 h-4 text-gray-400" />
        </button>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3">
          <button
            @click="startQuestionnaire"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Questionnaire
            <ArrowRight class="w-5 h-5" />
          </button>

          <button
            v-if="intro.skip_option?.enabled"
            @click="skipToTierSelect"
            class="text-sm"
            :class="preferencesStore.darkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-500 hover:text-gray-700'"
          >
            {{ intro.skip_option.label || "I already know my tier" }}
          </button>
        </div>
      </div>

      <!-- Questionnaire: Question Screen -->
      <div v-else-if="viewMode === 'questionnaire' && currentQuestion && !atSummary" class="space-y-6">
        <!-- Question -->
        <div
          class="rounded-lg border p-6"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <component :is="iconMap[currentQuestion.icon] || Info" class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h2
                class="text-xl font-semibold mb-2"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                {{ currentQuestion.question }}
              </h2>
              <p
                v-if="currentQuestion.help_text"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
              >
                {{ currentQuestion.help_text }}
              </p>
            </div>
          </div>

          <!-- Learn More -->
          <div v-if="currentQuestion.learn_more" class="mt-4">
            <button
              @click="showLearnMore = !showLearnMore"
              class="flex items-center gap-2 text-sm"
              :class="preferencesStore.darkMode
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'"
            >
              <Info class="w-4 h-4" />
              {{ showLearnMore ? 'Hide details' : currentQuestion.learn_more.title }}
            </button>
            <div
              v-if="showLearnMore"
              class="mt-3 p-4 rounded-lg text-sm"
              :class="preferencesStore.darkMode
                ? 'bg-blue-900/30 text-blue-200'
                : 'bg-blue-50 text-blue-900'"
            >
              <div class="whitespace-pre-line">{{ currentQuestion.learn_more.content }}</div>
              <!-- Link to calculator if specified -->
              <button
                v-if="currentQuestion.learn_more.link?.action === 'open_calculator'"
                @click="handleLearnMoreLink(currentQuestion.learn_more.link)"
                class="mt-3 inline-flex items-center gap-2 font-medium"
                :class="preferencesStore.darkMode
                  ? 'text-blue-300 hover:text-blue-200'
                  : 'text-blue-700 hover:text-blue-800'"
              >
                <Fingerprint class="w-4 h-4" />
                {{ currentQuestion.learn_more.link.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Options -->
        <div class="space-y-3">
          <button
            v-for="option in currentQuestion.options"
            :key="option.value"
            @click="selectAnswer(option)"
            class="w-full p-4 border rounded-lg text-left transition-colors group"
            :class="preferencesStore.darkMode
              ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-700'
              : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'"
          >
            <div class="flex items-center justify-between">
              <span
                class="font-medium"
                :class="preferencesStore.darkMode
                  ? 'text-white group-hover:text-blue-400'
                  : 'text-gray-900 group-hover:text-blue-900'"
              >
                {{ option.label }}
              </span>
              <ArrowRight
                class="w-5 h-5"
                :class="preferencesStore.darkMode
                  ? 'text-gray-500 group-hover:text-blue-400'
                  : 'text-gray-400 group-hover:text-blue-600'"
              />
            </div>
          </button>
        </div>

        <!-- Back button -->
        <button
          @click="goBack"
          class="flex items-center gap-2"
          :class="preferencesStore.darkMode
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-500 hover:text-gray-700'"
        >
          <ArrowLeft class="w-4 h-4" />
          Start over
        </button>
      </div>

      <!-- Questionnaire: Summary Screen -->
      <div v-else-if="viewMode === 'questionnaire' && atSummary" class="space-y-6">
        <div
          class="rounded-lg border p-6 text-center"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            :class="getTierColor(determinedTier).replace('border-', 'bg-').split(' ')[0]"
          >
            <component
              :is="tierConfig?.consultation_required ? AlertTriangle : CheckCircle"
              class="w-8 h-8"
              :class="tierConfig?.consultation_required ? 'text-amber-600' : 'text-green-600'"
            />
          </div>

          <h2
            class="text-2xl font-bold mb-2"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ summary.title || "Your Recommended Data Tier" }}
          </h2>

          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold border-2 mb-4"
            :class="getTierColor(determinedTier)"
          >
            {{ tierConfig?.short_name || determinedTier }}
            <span class="font-normal">—</span>
            {{ tierConfig?.name || 'Unknown' }}
          </div>

          <p
            v-if="tierConfig?.description"
            class="mb-4"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ tierConfig.description }}
          </p>

          <!-- Flags -->
          <div v-if="flags.length > 0 && summary.show_flags" class="flex flex-wrap justify-center gap-2 mb-4">
            <span
              v-for="flag in flags"
              :key="flag"
              class="px-2 py-1 text-xs rounded-full uppercase"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'"
            >
              {{ flag.replace(/_/g, ' ') }}
            </span>
          </div>
        </div>

        <!-- CTA -->
        <div
          v-if="tierCta"
          class="rounded-lg border p-6"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'"
        >
          <h3
            class="font-semibold mb-2"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >{{ tierCta.title }}</h3>
          <p
            class="mb-4"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >{{ tierCta.message }}</p>

          <div class="flex flex-col gap-3">
            <button
              @click="applyTier"
              class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {{ tierCta.action }}
              <ArrowRight class="w-5 h-5" />
            </button>

            <button
              v-if="tierCta.secondary_action"
              @click="router.push('/')"
              class="text-sm"
              :class="preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'"
            >
              {{ tierCta.secondary_action }}
            </button>
          </div>
        </div>

        <!-- Back button -->
        <button
          @click="goBack"
          class="flex items-center gap-2"
          :class="preferencesStore.darkMode
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-500 hover:text-gray-700'"
        >
          <ArrowLeft class="w-4 h-4" />
          Go back
        </button>
      </div>
    </main>
  </div>
</template>
