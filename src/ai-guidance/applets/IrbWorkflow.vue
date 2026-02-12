<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import DecisionFlow from '../components/DecisionFlow.vue'
import {
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  XCircle
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'irb-workflow'

const questions = [
  {
    id: 'protocol-mentions',
    question: 'Does your IRB protocol mention AI or machine learning tools?',
    helpText: 'Check your approved protocol document for any mention of AI, ML, or computational analysis.',
    options: [
      {
        value: 'explicit-yes',
        label: 'Yes — explicitly permits AI/ML tools',
        description: 'Protocol names specific tools or categories that are approved',
        setsOutput: { status: 'covered', protocolMentions: 'explicit' },
        next: 'which-tools'
      },
      {
        value: 'explicit-no',
        label: 'Yes — explicitly prohibits AI/ML tools',
        description: 'Protocol forbids use of AI or external data processing',
        setsOutput: { status: 'prohibited', protocolMentions: 'prohibits' },
        setsFlags: ['irb-prohibits-ai'],
        next: 'complete'
      },
      {
        value: 'no-mention',
        label: 'No mention of AI or computational analysis',
        description: 'Protocol is silent on this topic',
        setsOutput: { protocolMentions: 'none' },
        next: 'consent-check'
      }
    ]
  },
  {
    id: 'which-tools',
    question: 'Which AI tools are covered by your protocol?',
    helpText: 'Document the specific tools or categories approved.',
    options: [
      {
        value: 'specific',
        label: 'Specific tools are named',
        description: 'Protocol lists particular AI services',
        setsOutput: { toolsCovered: 'specific' },
        next: 'complete'
      },
      {
        value: 'categories',
        label: 'Categories are described',
        description: 'E.g., "institutionally approved AI tools"',
        setsOutput: { toolsCovered: 'categories' },
        next: 'complete'
      },
      {
        value: 'broad',
        label: 'Broad computational analysis language',
        description: 'May or may not cover AI specifically',
        setsOutput: { toolsCovered: 'broad', status: 'consult_irb' },
        setsFlags: ['irb-consult-recommended'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'consent-check',
    question: 'Do participant consent forms mention AI-assisted analysis?',
    helpText: 'Review what participants agreed to regarding data analysis methods.',
    options: [
      {
        value: 'mentions-ai',
        label: 'Yes — consent mentions AI/ML analysis',
        description: 'Participants were informed AI might be used',
        setsOutput: { consentCovers: true },
        next: 'cloud-sharing'
      },
      {
        value: 'mentions-computational',
        label: 'Mentions "computational analysis" broadly',
        description: 'General language that might include AI',
        setsOutput: { consentCovers: 'unclear' },
        setsFlags: ['consent-unclear'],
        next: 'cloud-sharing'
      },
      {
        value: 'silent',
        label: 'No mention of analysis methods',
        description: 'Consent doesn\'t address how data will be analyzed',
        setsOutput: { consentCovers: false },
        setsFlags: ['consent-silent'],
        next: 'cloud-sharing'
      }
    ]
  },
  {
    id: 'cloud-sharing',
    question: 'Does using cloud AI constitute "data sharing" under your protocol?',
    helpText: 'Sending data to OpenAI, Anthropic, etc. means sharing with a third party.',
    learnMore: {
      title: 'Why this matters',
      content: `When you paste data into ChatGPT or Claude, that data is transmitted to servers owned by OpenAI or Anthropic. This is technically "sharing data with a third party."

Your IRB protocol may have restrictions on third-party data sharing. Even if the AI company promises not to use your data for training, the act of transmission itself may require disclosure.

Local AI models (running on your own computer) do not involve data sharing.`
    },
    options: [
      {
        value: 'allowed',
        label: 'Protocol allows third-party data processors',
        description: 'Sharing for analysis purposes is permitted',
        setsOutput: { sharingAllowed: true },
        next: 'baa-check'
      },
      {
        value: 'unclear',
        label: 'Unclear — protocol doesn\'t address this',
        description: 'May need clarification from IRB',
        setsOutput: { sharingAllowed: 'unclear', status: 'consult_irb' },
        setsFlags: ['sharing-unclear'],
        next: 'complete'
      },
      {
        value: 'prohibited',
        label: 'Protocol prohibits external data sharing',
        description: 'Cannot use cloud AI tools',
        setsOutput: { sharingAllowed: false, status: 'local_only' },
        setsFlags: ['cloud-prohibited'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'baa-check',
    question: 'For HIPAA data: Does the AI tool provider have a BAA?',
    helpText: 'Business Associate Agreements are required for HIPAA-covered data.',
    options: [
      {
        value: 'not-hipaa',
        label: 'Not applicable — data is not HIPAA-covered',
        description: 'No PHI involved',
        setsOutput: { baaRequired: false, status: 'covered' },
        next: 'complete'
      },
      {
        value: 'has-baa',
        label: 'Yes — using enterprise tool with BAA',
        description: 'Institution has BAA with AI provider',
        setsOutput: { baaRequired: true, baaInPlace: true, status: 'covered' },
        next: 'complete'
      },
      {
        value: 'no-baa',
        label: 'No — consumer tool without BAA',
        description: 'ChatGPT Free, Claude Free, etc.',
        setsOutput: { baaRequired: true, baaInPlace: false, status: 'prohibited' },
        setsFlags: ['no-baa-prohibited'],
        next: 'complete'
      },
      {
        value: 'unknown',
        label: 'I don\'t know',
        description: 'Need to check with institution',
        setsOutput: { baaRequired: true, baaInPlace: 'unknown', status: 'consult_irb' },
        setsFlags: ['baa-check-needed'],
        next: 'complete'
      }
    ]
  }
]

const result = ref(null)
const isComplete = computed(() => result.value !== null)

const statusInfo = {
  covered: {
    label: 'Covered',
    description: 'Your IRB protocol appears to cover AI tool use. Proceed with the tools specified or permitted.',
    color: 'green',
    icon: CheckCircle
  },
  consult_irb: {
    label: 'Consult IRB',
    description: 'Some aspects are unclear. Contact your IRB for a determination before proceeding.',
    color: 'yellow',
    icon: AlertTriangle
  },
  amendment_needed: {
    label: 'Amendment Needed',
    description: 'Your protocol likely needs an amendment to cover AI tool use. Contact your IRB.',
    color: 'orange',
    icon: FileText
  },
  local_only: {
    label: 'Local Models Only',
    description: 'Cloud AI tools are not permitted. You may use local models that don\'t transmit data.',
    color: 'blue',
    icon: AlertTriangle
  },
  prohibited: {
    label: 'AI Use Prohibited',
    description: 'Your current protocol does not permit AI tool use for this data. Consider a protocol amendment.',
    color: 'red',
    icon: XCircle
  }
}

function handleComplete({ output, flags }) {
  const status = output.status || 'consult_irb'
  const info = statusInfo[status]

  result.value = {
    status,
    ...info,
    flags,
    output
  }

  aiStore.completeApplet(APPLET_ID, {
    status,
    flags,
    ...output
  })
}

function getNextApplet(output) {
  return 'tool-picker'
}

function getLevelColorClasses(color) {
  const isDark = preferencesStore.darkMode
  const colors = {
    green: isDark ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700',
    yellow: isDark ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: isDark ? 'bg-orange-900/30 border-orange-700 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700',
    blue: isDark ? 'bg-blue-900/30 border-blue-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700',
    red: isDark ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
  }
  return colors[color] || colors.yellow
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="IRB/Human Subjects Workflow"
    core-question="Does your IRB protocol cover AI-assisted analysis?"
    :icon="Users"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h3 class="font-semibold mb-2" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Why This Matters
      </h3>
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Many researchers discover mid-project that their consent forms say nothing about AI.
        Using cloud AI tools may constitute "data sharing" that requires IRB awareness or approval.
        It's better to clarify now than to face compliance issues later.
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

              <div v-if="result.status === 'consult_irb'" class="p-3 rounded-lg" :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white/50'">
                <p class="text-sm font-medium">
                  <strong>Next step:</strong> Contact your IRB office for a determination on AI tool use.
                  Bring your protocol number and describe the specific AI tools you want to use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DecisionFlow>
  </AppletFrame>
</template>
