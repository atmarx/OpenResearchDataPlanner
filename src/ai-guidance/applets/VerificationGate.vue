<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import DecisionFlow from '../components/DecisionFlow.vue'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'verification-gate'

// Get task type from previous applet for context
const taskOutput = computed(() => aiStore.getAppletOutput('task-fit'))

const questions = [
  {
    id: 'expertise',
    question: 'Do you have the domain expertise to evaluate AI output for this task?',
    helpText: 'Can you recognize when the AI is wrong, not just when it sounds wrong?',
    learnMore: {
      title: 'Why expertise matters',
      content: `AI produces confident output regardless of accuracy. It doesn't know when it's wrong.

The danger is "plausible nonsense" — output that sounds reasonable but is subtly incorrect. Only domain experts can reliably catch these errors.

If you're using AI to help with something outside your expertise, you cannot effectively verify the output.`
    },
    options: [
      {
        value: 'yes',
        label: 'Yes — I can evaluate this output',
        description: 'I have the expertise to recognize errors in this domain',
        setsOutput: { expertiseLevel: 'full' },
        next: 'sources'
      },
      {
        value: 'partial',
        label: 'Partially — I can verify some aspects',
        description: 'I know enough to catch some errors but not all',
        setsOutput: { expertiseLevel: 'partial' },
        setsFlags: ['partial-expertise'],
        next: 'sources'
      },
      {
        value: 'no',
        label: 'No — this is outside my expertise',
        description: 'I cannot reliably judge if the output is correct',
        setsOutput: { expertiseLevel: 'none', canVerify: false },
        setsFlags: ['cannot-verify'],
        next: 'no-expertise'
      }
    ]
  },
  {
    id: 'no-expertise',
    question: 'Without expertise, can you get expert review?',
    helpText: 'Someone with domain knowledge must verify AI output before you use it.',
    options: [
      {
        value: 'get-review',
        label: 'Yes — I can get expert review',
        description: 'Colleague, advisor, or consultant can verify',
        setsOutput: { expertReviewPlanned: true },
        setsFlags: ['needs-expert-review'],
        next: 'sources'
      },
      {
        value: 'no-review',
        label: 'No — I cannot get expert review',
        description: 'No access to someone who can verify',
        setsOutput: { expertReviewPlanned: false, canVerify: false, blocked: true },
        setsFlags: ['verification-blocked'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'sources',
    question: 'Can you access authoritative sources to check against?',
    helpText: 'Verification requires something to verify against.',
    options: [
      {
        value: 'yes',
        label: 'Yes — I have access to authoritative sources',
        description: 'Primary sources, databases, documentation, test environments',
        setsOutput: { hasAuthoritativeSources: true },
        next: 'time'
      },
      {
        value: 'some',
        label: 'Partially — for some claims but not all',
        description: 'Can verify some things but gaps exist',
        setsOutput: { hasAuthoritativeSources: 'partial' },
        setsFlags: ['source-gaps'],
        next: 'time'
      },
      {
        value: 'no',
        label: 'No — I cannot verify claims',
        description: 'No reliable way to check AI output',
        setsOutput: { hasAuthoritativeSources: false, canVerify: false },
        setsFlags: ['no-sources'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'time',
    question: 'Do you have time allocated for verification?',
    helpText: 'Verification is not optional. It takes real time.',
    learnMore: {
      title: 'Verification time budget',
      content: `A common mistake is assuming verification is quick. In practice:

• Checking citations: 2-5 minutes per citation
• Reviewing code: At least as long as writing it yourself
• Verifying facts: Requires finding primary sources
• Checking analysis: May need to redo calculations

Budget 30-50% of the time you "saved" for thorough verification.`
    },
    options: [
      {
        value: 'yes',
        label: 'Yes — I\'ve budgeted time for verification',
        description: 'Verification is part of my timeline',
        setsOutput: { timeAllocated: true },
        next: 'plan'
      },
      {
        value: 'some',
        label: 'Some — but it\'s tight',
        description: 'I\'ll do what I can in the time available',
        setsOutput: { timeAllocated: 'limited' },
        setsFlags: ['time-pressure'],
        next: 'plan'
      },
      {
        value: 'no',
        label: 'No — I don\'t have time to verify',
        description: 'Need the output now, can\'t thoroughly check',
        setsOutput: { timeAllocated: false },
        setsFlags: ['no-verification-time'],
        next: 'time-warning'
      }
    ]
  },
  {
    id: 'time-warning',
    question: 'Using unverified AI output is risky. Proceed anyway?',
    helpText: 'If you cannot verify it, you cannot responsibly use it.',
    options: [
      {
        value: 'reconsider',
        label: 'You\'re right — I\'ll make time to verify',
        description: 'Verification is worth the time',
        setsOutput: { timeAllocated: 'committed', reconsidered: true },
        next: 'plan'
      },
      {
        value: 'low-stakes',
        label: 'Stakes are low enough to proceed',
        description: 'This is just for exploration/brainstorming',
        setsOutput: { timeAllocated: false, acceptedRisk: 'low-stakes' },
        setsFlags: ['accepted-unverified-low-stakes'],
        next: 'complete'
      },
      {
        value: 'proceed-anyway',
        label: 'I understand the risk and proceed anyway',
        description: 'Accepting responsibility for unverified output',
        setsOutput: { timeAllocated: false, acceptedRisk: 'acknowledged' },
        setsFlags: ['accepted-unverified-risk'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'plan',
    question: 'What\'s your verification plan?',
    helpText: 'Specific steps, not "I\'ll check it later."',
    options: [
      {
        value: 'have-plan',
        label: 'I have a specific verification plan',
        description: 'I know exactly what I\'ll check and how',
        setsOutput: { hasPlan: true, canVerify: true },
        next: 'complete'
      },
      {
        value: 'will-make',
        label: 'I\'ll create a plan before using output',
        description: 'Will define steps before proceeding',
        setsOutput: { hasPlan: 'pending', canVerify: true },
        next: 'complete'
      }
    ]
  }
]

const result = ref(null)
const isComplete = computed(() => result.value !== null)

const outcomes = {
  pass: {
    label: 'Verification Ready',
    description: 'You have the expertise, sources, time, and plan to verify AI output. Proceed with your verification approach.',
    color: 'green',
    icon: CheckCircle
  },
  conditional: {
    label: 'Proceed with Caution',
    description: 'Some verification gaps exist. Be especially careful in areas you flagged as uncertain.',
    color: 'yellow',
    icon: AlertTriangle
  },
  blocked: {
    label: 'Cannot Proceed Responsibly',
    description: 'You cannot verify this output. Using unverified AI output for this task is not recommended.',
    color: 'red',
    icon: XCircle
  },
  accepted_risk: {
    label: 'Proceeding with Acknowledged Risk',
    description: 'You\'ve chosen to proceed without full verification. You accept responsibility for any errors.',
    color: 'orange',
    icon: AlertTriangle
  }
}

function handleComplete({ output, flags }) {
  let outcome = 'pass'

  if (output.blocked || output.canVerify === false) {
    outcome = 'blocked'
  } else if (output.acceptedRisk) {
    outcome = 'accepted_risk'
  } else if (flags.includes('partial-expertise') || flags.includes('source-gaps') || flags.includes('time-pressure')) {
    outcome = 'conditional'
  }

  result.value = {
    outcome,
    ...outcomes[outcome],
    flags,
    output
  }

  aiStore.completeApplet(APPLET_ID, {
    outcome,
    canVerify: output.canVerify !== false,
    flags,
    ...output
  })
}

function getLevelColorClasses(color) {
  const isDark = preferencesStore.darkMode
  const colors = {
    green: isDark ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700',
    yellow: isDark ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: isDark ? 'bg-orange-900/30 border-orange-700 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700',
    red: isDark ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
  }
  return colors[color] || colors.yellow
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Verification Gate"
    core-question="Can you actually verify the output?"
    :icon="ShieldCheck"
    :is-complete="isComplete"
  >
    <!-- Quote -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <blockquote
        class="italic text-lg"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
      >
        "If you cannot verify it, you cannot use it."
      </blockquote>
      <p class="text-sm mt-2" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
        This is a hard gate, not a soft recommendation. AI tools produce confident output
        regardless of accuracy.
      </p>
    </div>

    <!-- Task context if available -->
    <div
      v-if="taskOutput"
      class="p-3 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        <span class="font-medium">Your task:</span> {{ taskOutput.taskType?.replace(/-/g, ' ') || 'Not specified' }}
      </p>
      <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        <span class="font-medium">Required verification:</span> {{ taskOutput.verification || 'Standard review' }}
      </p>
    </div>

    <DecisionFlow :questions="questions" @complete="handleComplete">
      <template #complete="{ output, flags }">
        <div class="p-6 rounded-lg border-2" :class="getLevelColorClasses(result.color)">
          <div class="flex items-start gap-4">
            <component :is="result.icon" class="w-8 h-8 flex-shrink-0" />
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ result.label }}
              </h3>
              <p class="mb-4">{{ result.description }}</p>

              <div v-if="flags.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="flag in flags"
                  :key="flag"
                  class="px-2 py-1 text-xs rounded-full font-medium uppercase"
                  :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'"
                >
                  {{ flag.replace(/-/g, ' ') }}
                </span>
              </div>

              <!-- Specific guidance based on outcome -->
              <div
                v-if="result.outcome === 'blocked'"
                class="p-3 rounded-lg"
                :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white/50'"
              >
                <p class="text-sm font-medium mb-2">What now?</p>
                <ul class="text-sm space-y-1">
                  <li>• Find a domain expert to review outputs</li>
                  <li>• Use AI only for tasks you CAN verify</li>
                  <li>• Consider traditional (non-AI) approaches</li>
                </ul>
              </div>

              <div
                v-if="result.outcome === 'conditional'"
                class="p-3 rounded-lg"
                :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white/50'"
              >
                <p class="text-sm font-medium mb-2">Proceed carefully:</p>
                <ul class="text-sm space-y-1">
                  <li v-if="flags.includes('partial-expertise')">• Get expert review for areas outside your expertise</li>
                  <li v-if="flags.includes('source-gaps')">• Be explicit about what you couldn't verify</li>
                  <li v-if="flags.includes('time-pressure')">• Prioritize verification of highest-stakes content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Phase 1 Complete Message -->
        <div
          class="mt-6 p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'"
        >
          <p class="font-medium" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'">
            ✅ Core flow complete
          </p>
          <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'">
            You've completed the Phase 1 core flow. Consider exploring Phase 2 applets for
            additional guidance on documentation, pitfalls, and disclosure.
          </p>
        </div>
      </template>
    </DecisionFlow>
  </AppletFrame>
</template>
