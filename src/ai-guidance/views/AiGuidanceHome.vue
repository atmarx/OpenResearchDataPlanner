<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useConfigStore } from '@/stores/configStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { useMotion } from '@/composables/useMotion'
import PageShell from '@/components/layout/PageShell.vue'
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
const preferencesStore = usePreferencesStore()

// Where the tier card lives: the sidebar rail on wide (xl) screens, teleported
// to the top of the page on narrow ones. Single instance, moved — not two
// copies hidden with CSS. isWide drives <Teleport :disabled> below.
const isWide = ref(typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches)
let _tierMq = null
function _onTierMq(e) { isWide.value = e.matches }
onMounted(() => {
  _tierMq = window.matchMedia('(min-width: 1280px)')
  isWide.value = _tierMq.matches
  _tierMq.addEventListener('change', _onTierMq)
})
onBeforeUnmount(() => { _tierMq?.removeEventListener('change', _onTierMq) })

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

// "On this page" rail nav — scroll-spy the phase sections so the rail shows
// which phase you're reading. Section ids match the :id on each phase block.
const { motionEnabled } = useMotion()
const phaseNav = phases.map(p => ({ id: 'ai-phase-' + p.id, title: p.title }))
const { activeId } = useScrollSpy(() => phaseNav.map(p => p.id))

function goToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({
      behavior: motionEnabled.value ? 'smooth' : 'auto',
      block: 'start'
    })
  }
}

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
  <PageShell width="max-w-4xl xl:max-w-7xl" bare>
    <!-- Title + progress on the opaque header bar (was a full-bleed
         min-h-screen canvas that painted over the hero). -->
    <template #header>
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
    </template>

    <!-- Main content -->
    <div class="px-4 py-8">
      <!-- Two-column on xl+: the primary flow (tier setup, orientation, the
           phase applets) rides a wide column; the Clinical-track shortcut and
           scope note move to a sticky reference rail so the shortcut stays in
           view while you browse the phases. Single column below xl. -->
      <div class="xl:flex xl:gap-8 xl:items-start">
      <div class="xl:flex-1 xl:min-w-0 space-y-8">
      <!-- Teleport target: the tier card lands here (top of page) on narrow
           screens; on xl+ it stays in the sidebar rail. Empty on desktop. -->
      <div id="ai-tier-top"></div>
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

      <!-- Intro — dismissable, remembered in prefs -->
      <div
        v-if="!preferencesStore.aiGettingStartedDismissed"
        class="relative p-6 rounded-lg border bg-surface border-border"
      >
        <button
          @click="preferencesStore.dismissAiGettingStarted()"
          class="absolute top-3 right-3 p-1.5 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
          aria-label="Dismiss Getting Started"
        >
          <X class="w-4 h-4" />
        </button>
        <h2
          class="text-lg font-semibold mb-2 pr-8 text-text"
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

      <!-- Phases -->
      <div v-for="phase in phases" :key="phase.id" class="space-y-4">
        <div :id="'ai-phase-' + phase.id" class="scroll-mt-24">
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
            v-for="(applet, i) in phase.applets"
            :key="applet.id"
            @click="goToApplet(applet.id)"
            class="ux-rise relative p-4 rounded-lg border text-left transition-all hover:shadow-md group"
            :style="{ '--ux-delay': Math.min(i, 8) * 40 + 'ms' }"
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

      </div><!-- /primary column -->

      <!-- ===== Reference rail (sticky on xl+) ===== -->
      <aside class="xl:flex-none xl:w-[20rem] space-y-6 mt-8 xl:mt-0 xl:sticky xl:top-24">
        <!-- Tier Context Card — sidebar rail on xl+, teleported to the top of
             the page on narrow screens (single instance, disabled = render in
             place here in the rail). -->
        <Teleport defer to="#ai-tier-top" :disabled="isWide">
        <div
          class="p-5 rounded-lg border bg-surface border-border"
        >
          <!-- Has tier context -->
          <div v-if="hasTierContext && tierConfig" class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="{
                  'bg-green-100 text-green-600': tierConfig.color === 'green',
                  'bg-yellow-100 text-yellow-600': tierConfig.color === 'yellow',
                  'bg-orange-100 text-orange-600': tierConfig.color === 'orange',
                  'bg-red-100 text-red-600': tierConfig.color === 'red'
                }"
              >
                <component :is="getTierIcon(tierConfig.color)" class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <p class="text-xs text-text-muted">
                  {{ tierSource === 'planner' ? 'From your planner session:' : 'Selected tier:' }}
                </p>
                <p class="font-semibold text-sm text-text">
                  {{ tierConfig.short_name }} — {{ tierConfig.name }}
                </p>
              </div>
            </div>
            <button
              @click="showTierPicker = true"
              class="text-xs px-2 py-1 rounded-lg transition-colors flex-shrink-0 text-text-muted hover:text-text hover:bg-surface-alt"
            >
              Change
            </button>
          </div>

          <!-- No tier context - prompt to select -->
          <div v-else>
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-surface-alt"
              >
                <HelpCircle class="w-5 h-5 text-text-muted" />
              </div>
              <h3 class="font-semibold text-text">
                What's your data security tier?
              </h3>
            </div>
            <p class="text-sm mb-3 text-text-secondary">
              Knowing your tier tailors AI guidance to your data sensitivity.
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
            </div>
            <router-link
              to="/tier-check"
              class="mt-2 inline-flex items-center gap-1 text-sm transition-colors text-text-secondary hover:text-text"
            >
              <HelpCircle class="w-4 h-4" />
              Help me find my tier
            </router-link>
          </div>
        </div>
        </Teleport>

        <!-- On this page — scroll-spy nav for the phase sections. Rail-only
             affordance (single column below xl has no rail), so hidden on
             mobile. The active phase is highlighted as you scroll. -->
        <nav
          v-if="phaseNav.length > 1"
          class="hidden xl:block p-4 rounded-lg border bg-surface border-border"
          aria-label="On this page"
        >
          <p class="text-xs font-semibold uppercase tracking-wide mb-2 text-text-muted">
            On this page
          </p>
          <ul class="space-y-1">
            <li v-for="item in phaseNav" :key="item.id">
              <button
                @click="goToSection(item.id)"
                class="w-full text-left text-sm px-2 py-1.5 rounded-md border-l-2 transition-colors"
                :class="activeId === item.id
                  ? 'border-primary text-primary font-medium bg-surface-alt'
                  : 'border-transparent text-text-secondary hover:text-text hover:bg-surface-alt'"
              >
                {{ item.title }}
              </button>
            </li>
          </ul>
        </nav>

        <!-- Clinical & Healthcare AI Track — restyled as a vertical rail card.
             blue is the app accent/info panel here, so it maps to semantic
             tokens (follows skin + dark). -->
        <div
          class="p-5 rounded-lg border bg-surface-alt border-border"
        >
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-surface"
            >
              <ShieldAlert
                class="w-5 h-5 text-primary"
              />
            </div>
            <h2
              class="text-base font-semibold text-primary"
            >
              Clinical & Healthcare AI Track
            </h2>
          </div>
          <p
            class="mb-3 text-sm text-primary"
          >
            {{ hasClinicalContext
              ? "You're working with healthcare data. We have specialized guidance for HIPAA, IRB, FDA, and clinical validation requirements."
              : "Working with clinical or healthcare AI? Specialized guidance for HIPAA de-identification, IRB amendments, and FDA validation requirements."
            }}
          </p>
          <router-link
            to="/ai/clinical"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105 bg-primary text-on-primary hover:bg-primary-dark"
          >
            <span>Enter Clinical Track</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
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
      </aside>

      </div><!-- /two-column -->
    </div><!-- /body -->
  </PageShell>
</template>
