<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
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

// Clinical context detection
const hasClinicalContext = computed(() => {
  return sessionStore.tier === 'l3-high' || aiStore.allFlags.includes('hipaa')
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

// Color classes for applet cards — categorical/status hues stay literal
// (fixed meaning, must NOT follow the skin); dark: variants replace the
// old JS darkMode branching. 'blue' here is a categorical card accent.
function getColorClasses(color) {
  const colors = {
    amber: 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400',
    blue: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400',
    purple: 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-400',
    green: 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400',
    red: 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400',
    orange: 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-400',
    slate: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-900/30 dark:border-cyan-700 dark:text-cyan-400',
    violet: 'bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-900/30 dark:border-violet-700 dark:text-violet-400',
    teal: 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-400',
    rose: 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-400',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-400',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400',
    sky: 'bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-400',
    lime: 'bg-lime-50 border-lime-200 text-lime-600 dark:bg-lime-900/30 dark:border-lime-700 dark:text-lime-400',
    fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:border-fuchsia-700 dark:text-fuchsia-400'
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <div
    class="min-h-screen transition-colors bg-canvas"
  >
    <!-- Header -->
    <header
      class="border-b bg-surface border-border"
    >
      <div class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-2xl font-bold text-text"
            >
              AI Guidance
            </h1>
            <p
              class="mt-1 text-text-secondary"
            >
              Responsible use of generative AI in research and teaching
            </p>
          </div>

          <!-- Progress / Reset -->
          <div class="flex items-center gap-4">
            <div
              class="text-sm text-text-muted"
            >
              {{ completedCount }} / {{ allApplets.length }} completed
            </div>
            <button
              v-if="completedCount > 0"
              @click="resetProgress"
              class="p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
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
        class="p-6 rounded-lg border bg-surface border-border"
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
              <p class="text-sm text-text-muted">
                {{ tierSource === 'planner' ? 'From your Data Planner session:' : 'Selected tier:' }}
              </p>
              <p class="font-semibold text-text">
                {{ tierConfig.short_name }} — {{ tierConfig.name }}
              </p>
              <p class="text-sm mt-1 text-text-secondary">
                AI guidance will be tailored to {{ tierConfig.short_name }} data sensitivity requirements.
              </p>
            </div>
          </div>
          <button
            @click="showTierPicker = true"
            class="text-sm px-3 py-1.5 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
          >
            Change
          </button>
        </div>

        <!-- No tier context - prompt to select -->
        <div v-else>
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-surface-alt"
            >
              <HelpCircle class="w-6 h-6 text-text-muted" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1 text-text">
                What's your data security tier?
              </h3>
              <p class="text-sm mb-4 text-text-secondary">
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
                  class="px-3 py-2 rounded-lg border text-sm transition-colors flex items-center gap-1 border-border-strong text-text-secondary hover:text-text hover:border-border-strong"
                >
                  <HelpCircle class="w-4 h-4" />
                  Help me find my tier
                </router-link>
              </div>

              <p class="text-xs mt-3 text-text-muted">
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
          class="relative w-full max-w-md rounded-lg shadow-xl p-6 bg-surface"
        >
          <button
            @click="showTierPicker = false"
            class="absolute top-4 right-4 p-1 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
          >
            <X class="w-5 h-5" />
          </button>

          <h3 class="text-lg font-semibold mb-4 text-text">
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
                  <span class="text-text-secondary ml-2">{{ tier.name }}</span>
                </div>
              </div>
            </button>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-border">
            <button
              @click="clearTier(); showTierPicker = false"
              class="text-sm text-text-muted hover:text-text-secondary"
            >
              Use generic guidance
            </button>
            <router-link
              to="/tier-check"
              class="text-sm flex items-center gap-1 text-primary hover:text-primary"
            >
              <HelpCircle class="w-4 h-4" />
              Help me decide
            </router-link>
          </div>
        </div>
      </div>

      <!-- Intro -->
      <div
        class="p-6 rounded-lg border bg-surface border-border"
      >
        <h2
          class="text-lg font-semibold mb-2 text-text"
        >
          Getting Started
        </h2>
        <p
          class="text-text-secondary"
        >
          These applets help you make informed decisions about using AI in your research.
          Start with <strong>Phase 1</strong> for the core decision flow, or jump to any
          applet that addresses your specific question.
          {{ hasTierContext ? 'Guidance is tailored to your ' + tierConfig?.short_name + ' data requirements.' : '' }}
        </p>
      </div>

      <!-- Clinical & Healthcare AI Track — blue is the app accent/info panel
           here, so it maps to semantic tokens (follows skin + dark). -->
      <div
        class="p-6 rounded-lg border bg-surface-alt border-border"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-surface"
          >
            <ShieldAlert
              class="w-6 h-6 text-primary"
            />
          </div>
          <div class="flex-1">
            <h2
              class="text-lg font-semibold mb-1 text-primary"
            >
              Clinical & Healthcare AI Track
            </h2>
            <p
              class="mb-3 text-primary"
            >
              {{ hasClinicalContext
                ? "You're working with healthcare data. We have specialized guidance for HIPAA, IRB, FDA, and clinical validation requirements."
                : "Working with clinical or healthcare AI? Specialized guidance for HIPAA de-identification, IRB amendments, and FDA validation requirements."
              }}
            </p>
            <router-link
              to="/ai/clinical"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 bg-primary text-on-primary hover:bg-primary-dark"
            >
              <span>Enter Clinical Track</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Phases -->
      <div v-for="phase in phases" :key="phase.id" class="space-y-4">
        <div>
          <h2
            class="text-xl font-bold text-text"
          >
            {{ phase.title }}
          </h2>
          <p
            class="mt-1 text-text-secondary"
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
              getColorClasses(applet.color),
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
              class="font-semibold mb-1 text-text"
            >
              {{ applet.title }}
            </h3>

            <!-- Question -->
            <p
              class="text-sm text-text-secondary"
            >
              {{ applet.question }}
            </p>

            <!-- Arrow on hover -->
            <ArrowRight
              class="absolute bottom-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted"
            />
          </button>
        </div>
      </div>

      <!-- Scope note -->
      <div
        class="p-4 rounded-lg border bg-surface-alt border-border"
      >
        <p
          class="text-sm text-text-secondary"
        >
          <strong>Scope:</strong> This guide focuses on generative AI (LLMs, image generators).
          For research ML (training custom models, scientific computing), consult Research Computing directly.
        </p>
      </div>
    </main>
  </div>
</template>
