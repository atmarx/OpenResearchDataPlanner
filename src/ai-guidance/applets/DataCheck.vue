<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import AppletFrame from '../components/AppletFrame.vue'
import DecisionFlow from '../components/DecisionFlow.vue'
import {
  Database,
  AlertTriangle,
  CheckCircle,
  Shield,
  Lock,
  Info
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()

const APPLET_ID = 'data-check'

// Questions for the decision flow
const questions = [
  {
    id: 'data-input',
    question: 'Will you input any data into the AI tool?',
    helpText: 'Consider what you\'ll paste, upload, or type into the AI system.',
    options: [
      {
        value: 'no-data',
        label: 'No — just prompts and questions',
        description: 'Asking general questions, brainstorming without specific data',
        setsOutput: { sensitivity: 'public', hasData: false },
        next: 'complete'
      },
      {
        value: 'yes-data',
        label: 'Yes — I will input data',
        description: 'Pasting content, uploading files, sharing specific information',
        setsOutput: { hasData: true },
        next: 'data-type'
      }
    ]
  },
  {
    id: 'data-type',
    question: 'What type of data will you input?',
    helpText: 'Select the most sensitive category that applies.',
    learnMore: {
      title: 'Understanding data types',
      content: `Public data: Published research, public records, openly available information.

Internal data: Your unpublished drafts, ideas, code — not yet shared publicly.

Confidential data: Under NDA, proprietary, or pre-publication embargoed material.

Regulated data: Subject to specific laws with legal consequences for mishandling — e.g., HIPAA (45 CFR Parts 160 & 164), FERPA (20 U.S.C. § 1232g; 34 CFR Part 99), and export controls (ITAR, 22 CFR 120-130; EAR, 15 CFR 730-774).`
    },
    options: [
      {
        value: 'public',
        label: 'Public or published data',
        description: 'Already publicly available, no sensitivity concerns',
        setsOutput: { sensitivity: 'public', dataType: 'public' },
        next: 'complete'
      },
      {
        value: 'synthetic',
        label: 'Synthetic or generated data',
        description: 'Fake data, test data, simulations',
        setsOutput: { sensitivity: 'public', dataType: 'synthetic' },
        next: 'complete'
      },
      {
        value: 'unpublished',
        label: 'My unpublished work (drafts, code, ideas)',
        description: 'Not yet public, but not under agreement',
        setsOutput: { sensitivity: 'internal', dataType: 'unpublished' },
        setsFlags: ['ip-sensitive'],
        next: 'complete'
      },
      {
        value: 'nda',
        label: 'Data under NDA or industry agreement',
        description: 'Contractually protected information',
        setsOutput: { sensitivity: 'confidential', dataType: 'nda' },
        setsFlags: ['nda'],
        next: 'complete'
      },
      {
        value: 'student',
        label: 'Sensitive student records (FERPA)',
        description: 'Transcripts, disciplinary, financial aid, or identifiable research records (routine coursework is lower risk)',
        setsOutput: { sensitivity: 'high', dataType: 'student' },
        setsFlags: ['ferpa'],
        next: 'deidentification'
      },
      {
        value: 'health',
        label: 'Health information (HIPAA/PHI)',
        description: 'Patient data, medical records, health-related identifiers',
        setsOutput: { sensitivity: 'high', dataType: 'health' },
        setsFlags: ['hipaa'],
        next: 'deidentification'
      },
      {
        value: 'export',
        label: 'Export controlled (ITAR/EAR/CUI)',
        description: 'Defense-related, dual-use technology, controlled unclassified',
        setsOutput: { sensitivity: 'restricted', dataType: 'export' },
        setsFlags: ['export-control'],
        next: 'complete'
      },
      {
        value: 'human-subjects',
        label: 'Human subjects research data',
        description: 'Data collected under an IRB protocol',
        setsOutput: { sensitivity: 'variable', dataType: 'human-subjects' },
        setsFlags: ['irb'],
        next: 'irb-check'
      }
    ]
  },
  {
    id: 'deidentification',
    question: 'Is the data de-identified?',
    helpText: 'De-identification has specific requirements. "We removed names" is often insufficient.',
    learnMore: {
      title: 'De-identification standards',
      content: `HIPAA Safe Harbor (45 CFR § 164.514(b)(2)) requires removing 18 specific identifiers, including:
• Names, addresses, dates (except year)
• Phone numbers, email addresses, SSNs
• Medical record numbers, account numbers
• Biometric identifiers, photos, unique IDs

Expert Determination (45 CFR § 164.514(b)(1)) requires a qualified expert to document low re-identification risk.

Warning: AI tools may re-identify individuals through pattern matching even from seemingly de-identified data, especially free-text clinical notes. See OCR's de-identification guidance (2012) and Erlich et al., Science 2018 (DOI 10.1126/science.aau4832) on re-identification risk.`
    },
    options: [
      {
        value: 'safe-harbor',
        label: 'Yes — HIPAA Safe Harbor (18 identifiers removed)',
        description: 'Formally de-identified following Safe Harbor method',
        setsOutput: { deidentified: true, deidentMethod: 'safe-harbor' },
        setsFlags: ['deidentified'],
        next: 'reidentification-risk'
      },
      {
        value: 'expert',
        label: 'Yes — Expert determination',
        description: 'Expert certified low re-identification risk',
        setsOutput: { deidentified: true, deidentMethod: 'expert' },
        setsFlags: ['deidentified'],
        next: 'reidentification-risk'
      },
      {
        value: 'partial',
        label: 'Partially — some identifiers removed',
        description: 'We removed some things but not formally de-identified',
        setsOutput: { deidentified: false, deidentMethod: 'partial' },
        next: 'complete'
      },
      {
        value: 'no',
        label: 'No — data is identifiable',
        description: 'Contains names, IDs, or other identifiers',
        setsOutput: { deidentified: false, deidentMethod: 'none' },
        next: 'complete'
      }
    ]
  },
  {
    id: 'reidentification-risk',
    question: 'What\'s the re-identification risk with AI?',
    helpText: 'AI can sometimes re-identify individuals from patterns in supposedly de-identified data.',
    options: [
      {
        value: 'low',
        label: 'Low — aggregated statistics only',
        description: 'Summary data, no individual records',
        setsOutput: { reidentRisk: 'low', sensitivity: 'internal' },
        next: 'complete'
      },
      {
        value: 'medium',
        label: 'Medium — structured data with common attributes',
        description: 'Individual records but common demographics/conditions',
        setsOutput: { reidentRisk: 'medium', sensitivity: 'confidential' },
        next: 'complete'
      },
      {
        value: 'high',
        label: 'High — free-text or rare conditions',
        description: 'Clinical notes, rare diseases, unique combinations',
        setsOutput: { reidentRisk: 'high', sensitivity: 'high' },
        setsFlags: ['reident-risk'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'irb-check',
    question: 'Does your IRB protocol address AI tool use?',
    helpText: 'Using AI tools may constitute data sharing with a third party.',
    options: [
      {
        value: 'yes-covered',
        label: 'Yes — protocol explicitly permits AI tools',
        description: 'AI analysis was planned and approved',
        setsOutput: { irbCovers: true },
        next: 'complete'
      },
      {
        value: 'maybe',
        label: 'Maybe — protocol mentions computational analysis',
        description: 'General language that might cover AI',
        setsOutput: { irbCovers: 'unclear' },
        setsFlags: ['irb-unclear'],
        next: 'complete'
      },
      {
        value: 'no',
        label: 'No — protocol doesn\'t mention AI',
        description: 'AI use wasn\'t anticipated in protocol',
        setsOutput: { irbCovers: false },
        setsFlags: ['irb-amendment-needed'],
        next: 'complete'
      },
      {
        value: 'prohibits',
        label: 'Protocol prohibits sharing with third parties',
        description: 'Cannot use cloud AI tools',
        setsOutput: { irbCovers: false, irbProhibits: true },
        setsFlags: ['irb-prohibits'],
        next: 'complete'
      }
    ]
  }
]

// Result state
const result = ref(null)
const isComplete = computed(() => result.value !== null)

// Sensitivity level metadata
const sensitivityLevels = {
  public: {
    label: 'Public',
    description: 'All AI tools are available. No special restrictions.',
    color: 'green',
    icon: CheckCircle
  },
  internal: {
    label: 'Internal',
    description: 'Enterprise or local AI tools preferred. Consumer tools with caution.',
    color: 'blue',
    icon: Info
  },
  confidential: {
    label: 'Confidential',
    description: 'Enterprise tools with proper agreements OR local models only. Consumer tools NOT recommended.',
    color: 'yellow',
    icon: Shield
  },
  high: {
    label: 'High Sensitivity',
    description: 'Requires a Business Associate Agreement for HIPAA PHI (45 CFR § 164.502(e)). Enterprise tools with BAA, institutionally hosted, or local only. Consumer tools PROHIBITED.',
    color: 'orange',
    icon: AlertTriangle
  },
  restricted: {
    label: 'Restricted',
    description: 'Local models only OR air-gapped systems. Consult security office before ANY AI use.',
    color: 'red',
    icon: Lock
  },
  variable: {
    label: 'Depends on IRB',
    description: 'Sensitivity determined by your IRB protocol and consent terms.',
    color: 'purple',
    icon: Info
  }
}

// Handle completion
function handleComplete({ output, flags }) {
  const sensitivity = output.sensitivity || 'internal'
  const levelInfo = sensitivityLevels[sensitivity]

  result.value = {
    sensitivity,
    ...levelInfo,
    flags,
    output
  }

  // Save to store
  aiStore.completeApplet(APPLET_ID, {
    sensitivity,
    flags,
    ...output
  })
}

// Get next applet based on result
function getNextApplet(output) {
  // If IRB flagged, go to IRB workflow
  if (output?.flags?.includes('irb') || output?.flags?.includes('irb-amendment-needed')) {
    return 'irb-workflow'
  }
  // Otherwise go to tool picker
  return 'tool-picker'
}

// Color classes
function getLevelColorClasses(color) {
  const colors = {
    green: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400',
    blue: 'bg-surface-alt border-border text-primary',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-400',
    orange: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-400',
    red: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400',
    purple: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-400'
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Data Check"
    core-question="What kind of data will touch this AI tool?"
    :icon="Database"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Explanation -->
    <div class="p-4 rounded-lg border mb-6 bg-surface border-border">
      <h3 class="font-semibold mb-2 text-text">
        Why This Matters
      </h3>
      <p class="text-sm text-text-secondary">
        Data sensitivity determines which AI tools you can use. Some data legally cannot
        be sent to cloud AI services. Understanding what you're working with is essential
        before choosing any tool.
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
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2 text-text">
                Sensitivity: {{ result.label }}
              </h3>
              <p class="mb-4">{{ result.description }}</p>

              <!-- Flags -->
              <div v-if="flags.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="flag in flags"
                  :key="flag"
                  class="px-2 py-1 text-xs rounded-full font-medium uppercase bg-surface-alt text-text-secondary"
                >
                  {{ flag.replace(/-/g, ' ') }}
                </span>
              </div>

              <!-- Specific warnings -->
              <div
                v-if="flags.includes('irb-amendment-needed')"
                class="p-3 rounded-lg mb-3 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                <p class="text-sm font-medium">
                  ⚠️ Your IRB protocol may need an amendment before using AI tools.
                  Proceed to the IRB/Human Subjects applet for guidance.
                </p>
              </div>

              <div
                v-if="flags.includes('export-control')"
                class="p-3 rounded-lg mb-3 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              >
                <p class="text-sm font-medium">
                  🔒 Export controlled data (ITAR, 22 CFR 120-130; EAR, 15 CFR 730-774) requires consultation with your
                  security office before using ANY AI tools, including local models.
                </p>
              </div>

              <div
                v-if="flags.includes('hipaa')"
                class="p-3 rounded-lg mb-3 bg-surface-alt text-primary border border-border"
              >
                <p class="text-sm font-medium mb-2">
                  🏥 Clinical & Healthcare AI Track Available
                </p>
                <p class="text-sm mb-2">
                  You're working with healthcare data. We have specialized guidance for HIPAA
                  de-identification, IRB amendments, and clinical validation.
                </p>
                <router-link
                  to="/ai/clinical"
                  class="inline-flex items-center gap-1 text-sm font-medium hover:underline text-primary"
                >
                  <span>View Clinical Track</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>

              <div
                v-if="flags.includes('reident-risk')"
                class="p-3 rounded-lg bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
              >
                <p class="text-sm font-medium">
                  ⚠️ High re-identification risk. Even de-identified data may be re-identified
                  by AI pattern matching. Use maximum caution and prefer local models.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DecisionFlow>
  </AppletFrame>
</template>
