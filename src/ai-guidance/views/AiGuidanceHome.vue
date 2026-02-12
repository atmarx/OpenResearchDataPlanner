<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useConfigStore } from '@/stores/configStore'
import {
  Gauge,
  Database,
  Users,
  Wrench,
  Target,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  GitBranch,
  MessageSquare,
  Cpu,
  Lightbulb,
  BookOpen,
  GraduationCap,
  UserCircle,
  Scale,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Shield,
  ShieldAlert,
  Lock,
  HelpCircle,
  X,
  Workflow
} from 'lucide-vue-next'

const router = useRouter()
const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()
const sessionStore = useSessionStore()
const configStore = useConfigStore()

// Tier context state
const showTierPicker = ref(false)
const selectedTier = ref(null)

// Get tier from session store (set by Research Data Planner)
const plannerTier = computed(() => sessionStore.tier)

// Get tier config for display
const tierConfig = computed(() => {
  const tierSlug = selectedTier.value || plannerTier.value
  if (!tierSlug) return null
  return configStore.tiersBySlug?.[tierSlug]
})

// Available tiers for quick selection
const availableTiers = computed(() => {
  return [...(configStore.tiers || [])].sort((a, b) => a.sort_order - b.sort_order)
})

// Has any tier context (either from planner or selected here)
const hasTierContext = computed(() => {
  return !!(selectedTier.value || plannerTier.value)
})

// Tier source for display
const tierSource = computed(() => {
  if (plannerTier.value && !selectedTier.value) return 'planner'
  if (selectedTier.value) return 'selected'
  return null
})

// Set tier for AI guidance context
function setAiTier(tierSlug) {
  selectedTier.value = tierSlug
  showTierPicker.value = false
  // Also store in AI guidance store for applets to use
  aiStore.completeApplet('tier-context', {
    tier: tierSlug,
    source: 'manual-selection'
  })
}

// Clear tier selection (go generic)
function clearTier() {
  selectedTier.value = null
  aiStore.resetApplet('tier-context')
}

// Initialize from session store if available
onMounted(() => {
  if (plannerTier.value) {
    // Pre-populate from planner context
    aiStore.completeApplet('tier-context', {
      tier: plannerTier.value,
      source: 'data-planner'
    })
  }
})

// Tier icons
const tierIcons = {
  green: ShieldCheck,
  yellow: Shield,
  orange: ShieldAlert,
  red: Lock
}

function getTierIcon(color) {
  return tierIcons[color] || Shield
}

// Applet definitions organized by phase
const phases = [
  {
    id: 'phase-1',
    title: 'Phase 1: Core Flow',
    description: 'Start here. These applets guide you through the essential decisions.',
    applets: [
      {
        id: 'stakes-assessment',
        title: 'Stakes Assessment',
        question: 'What happens if AI gets this wrong?',
        icon: Gauge,
        color: 'amber'
      },
      {
        id: 'data-check',
        title: 'Data Check',
        question: 'What data will touch this AI tool?',
        icon: Database,
        color: 'blue'
      },
      {
        id: 'irb-workflow',
        title: 'IRB/Human Subjects',
        question: 'Does your IRB protocol cover AI use?',
        icon: Users,
        color: 'purple'
      },
      {
        id: 'tool-picker',
        title: 'Tool Picker',
        question: 'Which AI tools can you use?',
        icon: Wrench,
        color: 'green'
      },
      {
        id: 'task-fit',
        title: 'Task Fit',
        question: 'Is AI the right approach?',
        icon: Target,
        color: 'indigo'
      },
      {
        id: 'verification-gate',
        title: 'Verification Gate',
        question: 'Can you verify the output?',
        icon: ShieldCheck,
        color: 'red'
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Supporting Guidance',
    description: 'Deeper guidance on specific aspects of AI use.',
    applets: [
      {
        id: 'common-pitfalls',
        title: 'Common Pitfalls',
        question: 'What should you watch for?',
        icon: AlertTriangle,
        color: 'orange'
      },
      {
        id: 'documentation-guide',
        title: 'Documentation Guide',
        question: 'What do you need to record?',
        icon: FileText,
        color: 'slate'
      },
      {
        id: 'reproducibility-checkpoint',
        title: 'Reproducibility',
        question: 'Can you reproduce this in 6 months?',
        icon: Clock,
        color: 'cyan'
      },
      {
        id: 'disclosure-framework',
        title: 'Disclosure Framework',
        question: 'Do you need to disclose AI use?',
        icon: MessageSquare,
        color: 'teal'
      },
      {
        id: 'model-selection-guide',
        title: 'Model Selection',
        question: 'Which local model should you use?',
        icon: Cpu,
        color: 'rose'
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Teaching & Technical',
    description: 'Guidance for instructors, students, and technical users.',
    applets: [
      {
        id: 'prompt-engineering',
        title: 'Prompt Basics',
        question: 'How do you get good outputs?',
        icon: Lightbulb,
        color: 'yellow'
      },
      {
        id: 'teaching-policy-builder',
        title: 'Teaching Policy',
        question: 'How should you handle AI in your course?',
        icon: GraduationCap,
        color: 'sky'
      },
      {
        id: 'student-guidance',
        title: 'Student Guidance',
        question: 'How should students use AI?',
        icon: UserCircle,
        color: 'lime'
      },
      {
        id: 'pipeline-integration',
        title: 'Pipeline Integration',
        question: 'Building an automated system?',
        icon: Workflow,
        color: 'violet'
      },
      {
        id: 'ai-ethics',
        title: 'Ethics Reference',
        question: 'What ethical guidelines apply?',
        icon: BookOpen,
        color: 'emerald'
      },
      {
        id: 'bias-assessment',
        title: 'Bias Assessment',
        question: 'Could AI bias affect your results?',
        icon: Scale,
        color: 'fuchsia'
      }
    ]
  }
]

// All applets flat
const allApplets = computed(() => {
  return phases.flatMap(p => p.applets)
})

// Count completed
const completedCount = computed(() => {
  return allApplets.value.filter(a => aiStore.isAppletComplete(a.id)).length
})

// Navigate to applet
function goToApplet(appletId) {
  router.push(`/ai/${appletId}`)
}

// Reset all progress
function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    aiStore.resetAll()
  }
}

// Color classes for applet cards
function getColorClasses(color, isDark) {
  const colors = {
    amber: isDark
      ? 'bg-amber-900/30 border-amber-700 text-amber-400'
      : 'bg-amber-50 border-amber-200 text-amber-600',
    blue: isDark
      ? 'bg-blue-900/30 border-blue-700 text-blue-400'
      : 'bg-blue-50 border-blue-200 text-blue-600',
    purple: isDark
      ? 'bg-purple-900/30 border-purple-700 text-purple-400'
      : 'bg-purple-50 border-purple-200 text-purple-600',
    green: isDark
      ? 'bg-green-900/30 border-green-700 text-green-400'
      : 'bg-green-50 border-green-200 text-green-600',
    indigo: isDark
      ? 'bg-indigo-900/30 border-indigo-700 text-indigo-400'
      : 'bg-indigo-50 border-indigo-200 text-indigo-600',
    red: isDark
      ? 'bg-red-900/30 border-red-700 text-red-400'
      : 'bg-red-50 border-red-200 text-red-600',
    orange: isDark
      ? 'bg-orange-900/30 border-orange-700 text-orange-400'
      : 'bg-orange-50 border-orange-200 text-orange-600',
    slate: isDark
      ? 'bg-slate-800 border-slate-600 text-slate-400'
      : 'bg-slate-50 border-slate-200 text-slate-600',
    cyan: isDark
      ? 'bg-cyan-900/30 border-cyan-700 text-cyan-400'
      : 'bg-cyan-50 border-cyan-200 text-cyan-600',
    violet: isDark
      ? 'bg-violet-900/30 border-violet-700 text-violet-400'
      : 'bg-violet-50 border-violet-200 text-violet-600',
    teal: isDark
      ? 'bg-teal-900/30 border-teal-700 text-teal-400'
      : 'bg-teal-50 border-teal-200 text-teal-600',
    rose: isDark
      ? 'bg-rose-900/30 border-rose-700 text-rose-400'
      : 'bg-rose-50 border-rose-200 text-rose-600',
    yellow: isDark
      ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400'
      : 'bg-yellow-50 border-yellow-200 text-yellow-600',
    emerald: isDark
      ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400'
      : 'bg-emerald-50 border-emerald-200 text-emerald-600',
    sky: isDark
      ? 'bg-sky-900/30 border-sky-700 text-sky-400'
      : 'bg-sky-50 border-sky-200 text-sky-600',
    lime: isDark
      ? 'bg-lime-900/30 border-lime-700 text-lime-400'
      : 'bg-lime-50 border-lime-200 text-lime-600',
    fuchsia: isDark
      ? 'bg-fuchsia-900/30 border-fuchsia-700 text-fuchsia-400'
      : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600'
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="preferencesStore.darkMode ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <!-- Header -->
    <header
      class="border-b"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-2xl font-bold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              AI Guidance
            </h1>
            <p
              class="mt-1"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              Responsible use of generative AI in research and teaching
            </p>
          </div>

          <!-- Progress / Reset -->
          <div class="flex items-center gap-4">
            <div
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ completedCount }} / {{ allApplets.length }} completed
            </div>
            <button
              v-if="completedCount > 0"
              @click="resetProgress"
              class="p-2 rounded-lg transition-colors"
              :class="preferencesStore.darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'"
              title="Reset progress"
            >
              <RotateCcw class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-8 space-y-8">
      <!-- Tier Context Card -->
      <div
        class="p-6 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <!-- Has tier context -->
        <div v-if="hasTierContext && tierConfig" class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="{
                'bg-green-100 text-green-600': tierConfig.color === 'green',
                'bg-yellow-100 text-yellow-600': tierConfig.color === 'yellow',
                'bg-orange-100 text-orange-600': tierConfig.color === 'orange',
                'bg-red-100 text-red-600': tierConfig.color === 'red'
              }"
            >
              <component :is="getTierIcon(tierConfig.color)" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ tierSource === 'planner' ? 'From your Data Planner session:' : 'Selected tier:' }}
              </p>
              <p class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ tierConfig.short_name }} — {{ tierConfig.name }}
              </p>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                AI guidance will be tailored to {{ tierConfig.short_name }} data sensitivity requirements.
              </p>
            </div>
          </div>
          <button
            @click="showTierPicker = true"
            class="text-sm px-3 py-1.5 rounded-lg transition-colors"
            :class="preferencesStore.darkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'"
          >
            Change
          </button>
        </div>

        <!-- No tier context - prompt to select -->
        <div v-else>
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-100'"
            >
              <HelpCircle class="w-6 h-6" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                What's your data security tier?
              </h3>
              <p class="text-sm mb-4" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                Knowing your tier helps tailor AI guidance to your data sensitivity.
                You can also proceed without selecting a tier for generic guidance.
              </p>

              <!-- Quick tier selector -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tier in availableTiers"
                  :key="tier.slug"
                  @click="setAiTier(tier.slug)"
                  class="px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105"
                  :class="{
                    'bg-green-50 border-green-200 text-green-700 hover:border-green-400': tier.color === 'green',
                    'bg-yellow-50 border-yellow-200 text-yellow-700 hover:border-yellow-400': tier.color === 'yellow',
                    'bg-orange-50 border-orange-200 text-orange-700 hover:border-orange-400': tier.color === 'orange',
                    'bg-red-50 border-red-200 text-red-700 hover:border-red-400': tier.color === 'red'
                  }"
                >
                  {{ tier.short_name }}
                </button>
                <router-link
                  to="/tier-check"
                  class="px-3 py-2 rounded-lg border text-sm transition-colors flex items-center gap-1"
                  :class="preferencesStore.darkMode
                    ? 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                    : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'"
                >
                  <HelpCircle class="w-4 h-4" />
                  Help me find my tier
                </router-link>
              </div>

              <p class="text-xs mt-3" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'">
                Or skip this and proceed with generic guidance below.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tier Picker Modal -->
      <div
        v-if="showTierPicker"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="showTierPicker = false"
        />

        <!-- Modal -->
        <div
          class="relative w-full max-w-md rounded-lg shadow-xl p-6"
          :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
        >
          <button
            @click="showTierPicker = false"
            class="absolute top-4 right-4 p-1 rounded-lg transition-colors"
            :class="preferencesStore.darkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'"
          >
            <X class="w-5 h-5" />
          </button>

          <h3 class="text-lg font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            Select Data Tier
          </h3>

          <div class="space-y-2 mb-4">
            <button
              v-for="tier in availableTiers"
              :key="tier.slug"
              @click="setAiTier(tier.slug)"
              class="w-full p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.02]"
              :class="{
                'bg-green-50 border-green-200 hover:border-green-400': tier.color === 'green',
                'bg-yellow-50 border-yellow-200 hover:border-yellow-400': tier.color === 'yellow',
                'bg-orange-50 border-orange-200 hover:border-orange-400': tier.color === 'orange',
                'bg-red-50 border-red-200 hover:border-red-400': tier.color === 'red'
              }"
            >
              <div class="flex items-center gap-3">
                <component
                  :is="getTierIcon(tier.color)"
                  class="w-5 h-5"
                  :class="{
                    'text-green-600': tier.color === 'green',
                    'text-yellow-600': tier.color === 'yellow',
                    'text-orange-600': tier.color === 'orange',
                    'text-red-600': tier.color === 'red'
                  }"
                />
                <div>
                  <span class="font-medium" :class="{
                    'text-green-800': tier.color === 'green',
                    'text-yellow-800': tier.color === 'yellow',
                    'text-orange-800': tier.color === 'orange',
                    'text-red-800': tier.color === 'red'
                  }">{{ tier.short_name }}</span>
                  <span class="text-gray-700 ml-2">{{ tier.name }}</span>
                </div>
              </div>
            </button>
          </div>

          <div class="flex items-center justify-between pt-4 border-t" :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
              @click="clearTier(); showTierPicker = false"
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'"
            >
              Use generic guidance
            </button>
            <router-link
              to="/tier-check"
              class="text-sm flex items-center gap-1"
              :class="preferencesStore.darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'"
            >
              <HelpCircle class="w-4 h-4" />
              Help me decide
            </router-link>
          </div>
        </div>
      </div>

      <!-- Intro -->
      <div
        class="p-6 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Getting Started
        </h2>
        <p
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          These applets help you make informed decisions about using AI in your research.
          Start with <strong>Phase 1</strong> for the core decision flow, or jump to any
          applet that addresses your specific question.
          {{ hasTierContext ? 'Guidance is tailored to your ' + tierConfig?.short_name + ' data requirements.' : '' }}
        </p>
      </div>

      <!-- Phases -->
      <div v-for="phase in phases" :key="phase.id" class="space-y-4">
        <div>
          <h2
            class="text-xl font-bold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ phase.title }}
          </h2>
          <p
            class="mt-1"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ phase.description }}
          </p>
        </div>

        <!-- Applet Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="applet in phase.applets"
            :key="applet.id"
            @click="goToApplet(applet.id)"
            class="relative p-4 rounded-lg border text-left transition-all hover:shadow-md group"
            :class="[
              getColorClasses(applet.color, preferencesStore.darkMode),
              'hover:scale-[1.02]'
            ]"
          >
            <!-- Completed badge -->
            <div
              v-if="aiStore.isAppletComplete(applet.id)"
              class="absolute top-2 right-2"
            >
              <CheckCircle class="w-5 h-5 text-green-500" />
            </div>

            <!-- Icon -->
            <component
              :is="applet.icon"
              class="w-8 h-8 mb-3"
            />

            <!-- Title -->
            <h3
              class="font-semibold mb-1"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              {{ applet.title }}
            </h3>

            <!-- Question -->
            <p
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ applet.question }}
            </p>

            <!-- Arrow on hover -->
            <ArrowRight
              class="absolute bottom-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            />
          </button>
        </div>
      </div>

      <!-- Scope note -->
      <div
        class="p-4 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-100 border-gray-200'"
      >
        <p
          class="text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          <strong>Scope:</strong> This guide focuses on generative AI (LLMs, image generators).
          For research ML (training custom models, scientific computing), consult Research Computing directly.
        </p>
      </div>
    </main>
  </div>
</template>
