<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import DecisionFlow from '../components/DecisionFlow.vue'
import {
  Gauge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'stakes-assessment'

// Questions for the decision flow
const questions = [
  {
    id: 'audience',
    question: 'Who will see this output?',
    helpText: 'Consider the broadest possible audience for this work.',
    options: [
      {
        value: 'just-me',
        label: 'Just me',
        description: 'Personal notes, exploration, learning',
        setsOutput: { audienceLevel: 1 },
        next: 'decisions'
      },
      {
        value: 'collaborators',
        label: 'Collaborators or lab members',
        description: 'Internal team use, shared drafts',
        setsOutput: { audienceLevel: 2 },
        next: 'decisions'
      },
      {
        value: 'public',
        label: 'Public or publication',
        description: 'Conference papers, journal articles, reports',
        setsOutput: { audienceLevel: 3 },
        next: 'decisions'
      },
      {
        value: 'affected-parties',
        label: 'Patients, students, or affected parties',
        description: 'People whose wellbeing may be impacted',
        setsOutput: { audienceLevel: 4 },
        setsFlags: ['affects-people'],
        next: 'decisions'
      }
    ]
  },
  {
    id: 'decisions',
    question: 'What decisions will be made based on this?',
    helpText: 'Consider downstream uses of AI-generated content.',
    options: [
      {
        value: 'none',
        label: 'No decisions — just exploration',
        description: 'Brainstorming, learning, curiosity',
        setsOutput: { decisionLevel: 1 },
        next: 'catchable'
      },
      {
        value: 'direction',
        label: 'Research direction or approach',
        description: 'Informing what to work on next',
        setsOutput: { decisionLevel: 2 },
        next: 'catchable'
      },
      {
        value: 'resources',
        label: 'Resource allocation or commitments',
        description: 'Grant proposals, budgets, hiring',
        setsOutput: { decisionLevel: 3 },
        next: 'catchable'
      },
      {
        value: 'safety-legal',
        label: 'Health, safety, or legal matters',
        description: 'Clinical decisions, legal advice, safety-critical',
        setsOutput: { decisionLevel: 4 },
        setsFlags: ['safety-critical'],
        next: 'catchable'
      }
    ]
  },
  {
    id: 'catchable',
    question: 'Can errors be caught later?',
    helpText: 'Consider the review and correction process.',
    options: [
      {
        value: 'easily',
        label: 'Yes, easily',
        description: 'Multiple review stages, low-stakes context',
        setsOutput: { catchLevel: 1 },
        next: 'correction-cost'
      },
      {
        value: 'with-effort',
        label: 'Maybe, with effort',
        description: 'Would require active checking to find',
        setsOutput: { catchLevel: 2 },
        next: 'correction-cost'
      },
      {
        value: 'difficult',
        label: 'Difficult or unlikely',
        description: 'Errors might propagate undetected',
        setsOutput: { catchLevel: 3 },
        next: 'correction-cost'
      },
      {
        value: 'impossible',
        label: 'No — errors would be permanent',
        description: 'Once published or acted on, cannot undo',
        setsOutput: { catchLevel: 4 },
        setsFlags: ['irreversible'],
        next: 'correction-cost'
      }
    ]
  },
  {
    id: 'correction-cost',
    question: 'What\'s the correction cost if something is wrong?',
    helpText: 'Think about the effort and impact of fixing errors.',
    options: [
      {
        value: 'trivial',
        label: 'Trivial rework',
        description: 'Minor edits, quick fixes',
        setsOutput: { costLevel: 1 },
        next: 'complete'
      },
      {
        value: 'significant',
        label: 'Significant rework',
        description: 'Hours or days of effort to correct',
        setsOutput: { costLevel: 2 },
        next: 'complete'
      },
      {
        value: 'reputation',
        label: 'Reputation damage or retraction',
        description: 'Public correction, professional impact',
        setsOutput: { costLevel: 3 },
        setsFlags: ['reputation-risk'],
        next: 'complete'
      },
      {
        value: 'harm',
        label: 'Harm to others',
        description: 'People could be hurt by errors',
        setsOutput: { costLevel: 4 },
        setsFlags: ['harm-risk'],
        next: 'complete'
      }
    ]
  }
]

// Result state
const result = ref(null)
const isComplete = computed(() => result.value !== null)

// Calculate stakes level from outputs
function calculateStakesLevel(output) {
  const maxLevel = Math.max(
    output.audienceLevel || 1,
    output.decisionLevel || 1,
    output.catchLevel || 1,
    output.costLevel || 1
  )

  if (maxLevel >= 4) return 'critical'
  if (maxLevel >= 3) return 'high'
  if (maxLevel >= 2) return 'medium'
  return 'low'
}

// Stakes level metadata
const stakesLevels = {
  low: {
    label: 'Low Stakes',
    description: 'Proceed with basic review. AI errors would cause embarrassment or minor rework at most.',
    color: 'green',
    icon: CheckCircle,
    recommendation: 'Basic verification is sufficient. Proceed with standard care.'
  },
  medium: {
    label: 'Medium Stakes',
    description: 'Thorough verification required. Errors could affect professional reputation or waste significant effort.',
    color: 'yellow',
    icon: Info,
    recommendation: 'Plan verification time. Check outputs against authoritative sources.'
  },
  high: {
    label: 'High Stakes',
    description: 'Independent verification required. Errors could cause career impact, institutional liability, or require public correction.',
    color: 'orange',
    icon: AlertTriangle,
    recommendation: 'Have someone else review AI-assisted work. Document your verification process.'
  },
  critical: {
    label: 'Critical Stakes',
    description: 'AI may not be appropriate. Errors could cause safety issues, legal liability, or harm to people.',
    color: 'red',
    icon: XCircle,
    recommendation: 'Strongly consider whether AI should be used at all. If proceeding, implement maximum verification rigor.'
  }
}

// Handle completion
function handleComplete({ output, flags }) {
  const level = calculateStakesLevel(output)

  result.value = {
    level,
    ...stakesLevels[level],
    flags
  }

  // Save to store
  aiStore.completeApplet(APPLET_ID, {
    level,
    flags,
    ...output
  })
}

// Get next applet based on result
function getNextApplet() {
  // Always go to data check next, but critical stakes should also see IRB if affects people
  return 'data-check'
}

// Color classes
function getLevelColorClasses(color) {
  const isDark = preferencesStore.darkMode
  const colors = {
    green: isDark
      ? 'bg-green-900/30 border-green-700 text-green-400'
      : 'bg-green-50 border-green-200 text-green-700',
    yellow: isDark
      ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400'
      : 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: isDark
      ? 'bg-orange-900/30 border-orange-700 text-orange-400'
      : 'bg-orange-50 border-orange-200 text-orange-700',
    red: isDark
      ? 'bg-red-900/30 border-red-700 text-red-400'
      : 'bg-red-50 border-red-200 text-red-700'
  }
  return colors[color] || colors.yellow
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Stakes Assessment"
    core-question="What happens if AI gets this wrong?"
    :icon="Gauge"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Why First explanation -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <h3
        class="font-semibold mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        Why This Comes First
      </h3>
      <p
        class="text-sm"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        Stakes determine everything downstream. If you're working on something where errors
        could cause real harm, you need to know that <em>before</em> deciding whether AI is
        appropriate, not after. Stakes can veto other decisions—task fit can't veto stakes.
      </p>
    </div>

    <!-- Decision Flow -->
    <DecisionFlow
      :questions="questions"
      @complete="handleComplete"
    >
      <template #complete="{ output, flags }">
        <!-- Result Card -->
        <div
          class="p-6 rounded-lg border-2"
          :class="getLevelColorClasses(result.color)"
        >
          <div class="flex items-start gap-4">
            <component
              :is="result.icon"
              class="w-8 h-8 flex-shrink-0"
            />
            <div>
              <h3
                class="text-xl font-bold mb-2"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                {{ result.label }}
              </h3>
              <p class="mb-4">{{ result.description }}</p>

              <!-- Flags if any -->
              <div v-if="flags.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="flag in flags"
                  :key="flag"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                  :class="preferencesStore.darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'"
                >
                  {{ flag.replace(/-/g, ' ') }}
                </span>
              </div>

              <!-- Recommendation -->
              <div
                class="p-3 rounded-lg"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-800'
                  : 'bg-white/50'"
              >
                <p class="text-sm font-medium">
                  <strong>Recommendation:</strong> {{ result.recommendation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical warning -->
        <div
          v-if="result.level === 'critical'"
          class="mt-4 p-4 rounded-lg border"
          :class="preferencesStore.darkMode
            ? 'bg-red-900/20 border-red-800 text-red-300'
            : 'bg-red-50 border-red-200 text-red-800'"
        >
          <div class="flex items-start gap-3">
            <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">Consider carefully before proceeding</p>
              <p class="text-sm mt-1">
                For critical-stakes work, the potential harm from AI errors may outweigh
                any efficiency gains. If you proceed, implement maximum verification rigor
                and consider having all AI-assisted outputs reviewed by independent experts.
              </p>
            </div>
          </div>
        </div>
      </template>
    </DecisionFlow>
  </AppletFrame>
</template>
