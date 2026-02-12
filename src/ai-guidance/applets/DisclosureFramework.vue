<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import DecisionFlow from '../components/DecisionFlow.vue'
import {
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  FileText
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'disclosure-framework'

// Get context from previous applets
const taskOutput = computed(() => aiStore.getAppletOutput('task-fit'))

const questions = [
  {
    id: 'context',
    question: 'What is the context of this work?',
    helpText: 'Different contexts have different disclosure norms and requirements.',
    options: [
      {
        value: 'course',
        label: 'Course assignment',
        description: 'Work submitted for academic credit',
        setsOutput: { context: 'course' },
        next: 'course-policy'
      },
      {
        value: 'thesis',
        label: 'Thesis or dissertation',
        description: 'Graduate research work',
        setsOutput: { context: 'thesis' },
        next: 'thesis-policy'
      },
      {
        value: 'publication',
        label: 'Publication (journal/conference)',
        description: 'Academic publishing',
        setsOutput: { context: 'publication' },
        next: 'venue-policy'
      },
      {
        value: 'grant',
        label: 'Grant proposal',
        description: 'Funding application',
        setsOutput: { context: 'grant' },
        next: 'sponsor-policy'
      },
      {
        value: 'internal',
        label: 'Internal document',
        description: 'Lab notes, team docs, presentations',
        setsOutput: { context: 'internal', requirement: 'optional' },
        next: 'ai-role'
      },
      {
        value: 'public',
        label: 'Public communication',
        description: 'Blog, social media, outreach',
        setsOutput: { context: 'public' },
        next: 'ai-role'
      }
    ]
  },
  {
    id: 'course-policy',
    question: 'Does your instructor have an explicit AI policy?',
    helpText: 'Check your syllabus or ask your instructor.',
    options: [
      {
        value: 'prohibits',
        label: 'Yes — policy prohibits AI',
        description: 'AI use is not permitted for this course/assignment',
        setsOutput: { policyExists: true, policyType: 'prohibits', requirement: 'prohibited' },
        setsFlags: ['ai-prohibited'],
        next: 'complete'
      },
      {
        value: 'requires-disclosure',
        label: 'Yes — requires disclosure',
        description: 'AI is allowed with proper documentation',
        setsOutput: { policyExists: true, policyType: 'disclosure', requirement: 'required' },
        next: 'ai-role'
      },
      {
        value: 'permits',
        label: 'Yes — permits without disclosure',
        description: 'AI use is fine, no documentation required',
        setsOutput: { policyExists: true, policyType: 'permitted', requirement: 'optional' },
        next: 'ai-role'
      },
      {
        value: 'unclear',
        label: 'No policy or unclear',
        description: 'Syllabus doesn\'t address AI',
        setsOutput: { policyExists: false, requirement: 'ask' },
        setsFlags: ['ask-instructor'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'thesis-policy',
    question: 'Does your institution/department have a thesis AI policy?',
    helpText: 'Check with your graduate school or department.',
    options: [
      {
        value: 'has-policy',
        label: 'Yes — explicit policy exists',
        description: 'Graduate school has guidelines',
        setsOutput: { policyExists: true, requirement: 'per-policy' },
        next: 'ai-role'
      },
      {
        value: 'advisor',
        label: 'No policy — advisor discretion',
        description: 'Department defers to advisor',
        setsOutput: { policyExists: false, requirement: 'advisor' },
        setsFlags: ['consult-advisor'],
        next: 'ai-role'
      },
      {
        value: 'unknown',
        label: 'I don\'t know',
        description: 'Need to check',
        setsOutput: { policyExists: 'unknown', requirement: 'check' },
        setsFlags: ['check-policy'],
        next: 'ai-role'
      }
    ]
  },
  {
    id: 'venue-policy',
    question: 'Does the venue (journal/conference) have an AI policy?',
    helpText: 'Check author guidelines and submission requirements.',
    options: [
      {
        value: 'prohibits',
        label: 'Yes — prohibits AI use',
        description: 'Venue does not allow AI-generated content',
        setsOutput: { policyExists: true, policyType: 'prohibits', requirement: 'prohibited' },
        setsFlags: ['venue-prohibits-ai'],
        next: 'complete'
      },
      {
        value: 'requires-disclosure',
        label: 'Yes — requires disclosure',
        description: 'Must disclose AI use in specific format',
        setsOutput: { policyExists: true, policyType: 'disclosure', requirement: 'required' },
        next: 'ai-role'
      },
      {
        value: 'permits',
        label: 'Yes — permits (disclosure optional)',
        description: 'AI allowed, documentation not mandatory',
        setsOutput: { policyExists: true, policyType: 'permitted', requirement: 'recommended' },
        next: 'ai-role'
      },
      {
        value: 'no-policy',
        label: 'No explicit policy',
        description: 'Author guidelines silent on AI',
        setsOutput: { policyExists: false, requirement: 'recommended' },
        next: 'ai-role'
      }
    ]
  },
  {
    id: 'sponsor-policy',
    question: 'Does the funding sponsor have AI guidance?',
    helpText: 'Check the RFP and sponsor policies.',
    options: [
      {
        value: 'has-guidance',
        label: 'Yes — sponsor addresses AI',
        description: 'RFP or sponsor policy mentions AI',
        setsOutput: { policyExists: true, requirement: 'per-sponsor' },
        next: 'ai-role'
      },
      {
        value: 'no-guidance',
        label: 'No explicit guidance',
        description: 'Sponsor silent on AI use',
        setsOutput: { policyExists: false, requirement: 'emerging' },
        next: 'ai-role'
      }
    ]
  },
  {
    id: 'ai-role',
    question: 'What role did AI play in this work?',
    helpText: 'Different roles may have different disclosure expectations.',
    options: [
      {
        value: 'brainstorming',
        label: 'Brainstorming / ideation',
        description: 'Used for generating ideas you developed further',
        setsOutput: { aiRole: 'brainstorming', disclosureLevel: 'may-not-require' },
        next: 'complete'
      },
      {
        value: 'drafting',
        label: 'Drafting text',
        description: 'AI generated text you edited/revised',
        setsOutput: { aiRole: 'drafting', disclosureLevel: 'usually-required' },
        next: 'complete'
      },
      {
        value: 'editing',
        label: 'Editing / polishing',
        description: 'AI improved existing text',
        setsOutput: { aiRole: 'editing', disclosureLevel: 'gray-area' },
        next: 'complete'
      },
      {
        value: 'analysis',
        label: 'Analysis / results',
        description: 'AI contributed to data analysis or findings',
        setsOutput: { aiRole: 'analysis', disclosureLevel: 'definitely-required' },
        next: 'complete'
      },
      {
        value: 'code',
        label: 'Code generation',
        description: 'AI wrote code you used',
        setsOutput: { aiRole: 'code', disclosureLevel: 'usually-required' },
        next: 'complete'
      },
      {
        value: 'figures',
        label: 'Figures / visualizations',
        description: 'AI created visual content',
        setsOutput: { aiRole: 'figures', disclosureLevel: 'usually-required' },
        next: 'complete'
      }
    ]
  }
]

const result = ref(null)
const isComplete = computed(() => result.value !== null)
const copiedLanguage = ref(false)

const disclosureGuidance = {
  prohibited: {
    label: 'AI Use Not Permitted',
    description: 'Based on the policy, you should not use AI for this work.',
    color: 'red',
    icon: XCircle,
    action: 'Do not use AI assistance for this work.'
  },
  required: {
    label: 'Disclosure Required',
    description: 'You must disclose AI use according to the relevant policy.',
    color: 'yellow',
    icon: AlertTriangle,
    action: 'Document AI use and include disclosure in your submission.'
  },
  recommended: {
    label: 'Disclosure Recommended',
    description: 'While not strictly required, disclosure is best practice for transparency.',
    color: 'blue',
    icon: Eye,
    action: 'Consider including a disclosure statement.'
  },
  optional: {
    label: 'Disclosure Optional',
    description: 'No disclosure requirement, but document for your own records.',
    color: 'green',
    icon: CheckCircle,
    action: 'Keep personal records of AI use for reproducibility.'
  },
  ask: {
    label: 'Clarification Needed',
    description: 'Ask your instructor before using AI for this assignment.',
    color: 'orange',
    icon: AlertTriangle,
    action: 'Contact your instructor to clarify the AI policy.'
  },
  'per-policy': {
    label: 'Follow Institutional Policy',
    description: 'Follow your institution\'s specific requirements.',
    color: 'blue',
    icon: FileText,
    action: 'Review and follow the institutional AI policy.'
  },
  'per-sponsor': {
    label: 'Follow Sponsor Guidance',
    description: 'Adhere to the funding agency\'s requirements.',
    color: 'blue',
    icon: FileText,
    action: 'Follow sponsor-specific AI guidance.'
  },
  emerging: {
    label: 'Emerging Norms',
    description: 'Norms are developing. Default to transparency.',
    color: 'blue',
    icon: Eye,
    action: 'Err on the side of disclosure for transparency.'
  },
  check: {
    label: 'Check Policy First',
    description: 'Verify your institution\'s requirements before proceeding.',
    color: 'orange',
    icon: AlertTriangle,
    action: 'Contact your graduate school or department for guidance.'
  },
  advisor: {
    label: 'Consult Advisor',
    description: 'Discuss AI use with your thesis advisor.',
    color: 'blue',
    icon: FileText,
    action: 'Talk to your advisor about appropriate AI use and disclosure.'
  }
}

const sampleDisclosureLanguage = `The authors used [Tool Name, version/date] for [specific purpose, e.g., initial draft generation, code scaffolding, literature organization]. All AI-generated content was reviewed, verified, and substantially revised by the authors, who take full responsibility for the final work.`

function handleComplete({ output, flags }) {
  const requirement = output.requirement || 'recommended'
  const guidance = disclosureGuidance[requirement] || disclosureGuidance.recommended

  result.value = {
    requirement,
    ...guidance,
    flags,
    output
  }

  aiStore.completeApplet(APPLET_ID, {
    requirement,
    context: output.context,
    aiRole: output.aiRole,
    flags
  })
}

async function copyLanguage() {
  try {
    await navigator.clipboard.writeText(sampleDisclosureLanguage)
    copiedLanguage.value = true
    setTimeout(() => copiedLanguage.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
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
  return colors[color] || colors.blue
}

function getNextApplet() {
  return 'reproducibility-checkpoint'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Disclosure Framework"
    core-question="Do I need to disclose AI use? How?"
    :icon="Eye"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Intro -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Norms and requirements for AI disclosure vary by context. Some venues require it;
        others prohibit AI use entirely. This wizard helps you determine what applies to your situation.
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

              <div
                class="p-3 rounded-lg mb-4"
                :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white/50'"
              >
                <p class="text-sm font-medium">
                  <strong>Action:</strong> {{ result.action }}
                </p>
              </div>

              <div v-if="flags.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="flag in flags"
                  :key="flag"
                  class="px-2 py-1 text-xs rounded-full font-medium uppercase"
                  :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'"
                >
                  {{ flag.replace(/-/g, ' ') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sample Disclosure Language -->
        <div
          v-if="['required', 'recommended', 'emerging'].includes(result.requirement)"
          class="mt-6 p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              Sample Disclosure Language
            </h4>
            <button
              @click="copyLanguage"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="copiedLanguage
                ? (preferencesStore.darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700')
                : (preferencesStore.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
            >
              <component :is="copiedLanguage ? CheckCircle : Copy" class="w-4 h-4" />
              {{ copiedLanguage ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <blockquote
            class="text-sm italic p-3 rounded-lg"
            :class="preferencesStore.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'"
          >
            "{{ sampleDisclosureLanguage }}"
          </blockquote>
          <p class="text-xs mt-2" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
            Customize this template with specific details about your AI use.
          </p>
        </div>

        <!-- Where to Include Disclosure -->
        <div
          v-if="result.requirement !== 'prohibited'"
          class="mt-6 p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'"
        >
          <h4 class="font-medium mb-2" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'">
            Where to Include Disclosure
          </h4>
          <ul class="text-sm space-y-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'">
            <li v-if="output.context === 'publication'">• Methods section (for research methodology)</li>
            <li v-if="output.context === 'publication'">• Acknowledgments (for writing assistance)</li>
            <li v-if="output.context === 'thesis'">• Acknowledgments or methodology chapter</li>
            <li v-if="output.context === 'grant'">• As appropriate per sponsor requirements</li>
            <li v-if="output.context === 'course'">• Per instructor's specified format</li>
            <li>• Author note (for general transparency)</li>
          </ul>
        </div>
      </template>
    </DecisionFlow>
  </AppletFrame>
</template>
