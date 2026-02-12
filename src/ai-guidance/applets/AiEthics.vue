<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  Scale,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Eye,
  Users,
  Shield,
  Heart,
  Lock
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'ai-ethics'

// General principles
const principles = [
  {
    id: 'transparency',
    name: 'Transparency',
    description: 'Be clear about AI\'s role in your work',
    icon: Eye
  },
  {
    id: 'accountability',
    name: 'Accountability',
    description: 'Humans remain responsible for AI-assisted outputs',
    icon: Users
  },
  {
    id: 'fairness',
    name: 'Fairness',
    description: 'Consider disparate impacts across groups',
    icon: Scale
  },
  {
    id: 'privacy',
    name: 'Privacy',
    description: 'Protect data subjects; minimize data exposure',
    icon: Lock
  },
  {
    id: 'beneficence',
    name: 'Beneficence',
    description: 'AI use should aim to benefit, not harm',
    icon: Heart
  }
]

// Discipline-specific resources
const disciplineResources = [
  {
    discipline: 'Computing',
    guidelines: 'ACM Code of Ethics, IEEE Ethically Aligned Design',
    focus: 'Algorithmic fairness, privacy, security'
  },
  {
    discipline: 'Medicine',
    guidelines: 'AMA AI Ethics, FDA guidance',
    focus: 'Patient safety, clinical validation, informed consent'
  },
  {
    discipline: 'Psychology',
    guidelines: 'APA Ethics Code adaptations',
    focus: 'Research subjects, assessment validity'
  },
  {
    discipline: 'Journalism',
    guidelines: 'SPJ AI guidelines',
    focus: 'Transparency, accuracy, attribution'
  },
  {
    discipline: 'Education',
    guidelines: 'Various emerging',
    focus: 'Academic integrity, equitable access'
  },
  {
    discipline: 'Law',
    guidelines: 'ABA guidance',
    focus: 'Confidentiality, competence, supervision'
  }
]

// Research ethics considerations
const researchEthics = [
  {
    id: 'dual-use',
    title: 'Dual Use',
    description: 'Could your AI application be misused?',
    icon: AlertTriangle
  },
  {
    id: 'environmental',
    title: 'Environmental Impact',
    description: 'Large model training has significant carbon footprint',
    icon: Shield
  },
  {
    id: 'labor',
    title: 'Labor Implications',
    description: 'AI trained on human-created content; attribution concerns',
    icon: Users
  },
  {
    id: 'power',
    title: 'Power Concentration',
    description: 'Who controls the AI systems you depend on?',
    icon: Lock
  }
]

// Red flags
const redFlags = [
  'AI making decisions that affect people\'s opportunities',
  'AI used on populations not represented in training',
  'AI outputs used without human review in high-stakes contexts',
  'AI application that concentrates power or reduces accountability',
  'AI use that would be controversial if publicly known'
]

// State
const selectedDiscipline = ref(null)
const checkedFlags = ref(new Set())
const isComplete = ref(false)

function markComplete() {
  isComplete.value = true
  aiStore.completeApplet(APPLET_ID, {
    disciplineViewed: selectedDiscipline.value,
    flagsChecked: Array.from(checkedFlags.value)
  })
}

function toggleFlag(flag) {
  if (checkedFlags.value.has(flag)) {
    checkedFlags.value.delete(flag)
  } else {
    checkedFlags.value.add(flag)
  }
  checkedFlags.value = new Set(checkedFlags.value)
}

function isFlagChecked(flag) {
  return checkedFlags.value.has(flag)
}

// Auto-complete on mount (informational applet)
import { onMounted } from 'vue'
onMounted(() => {
  setTimeout(markComplete, 2000)
})

function getNextApplet() {
  return 'bias-assessment'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="AI Ethics Quick Reference"
    core-question="What ethical guidelines apply to my AI use?"
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
        A reference linking to discipline-specific ethics guidelines for AI development and deployment,
        separate from academic integrity concerns.
      </p>
    </div>

    <!-- General Principles -->
    <div class="mb-6">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        General Principles
      </h3>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="principle in principles"
          :key="principle.id"
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-center gap-2 mb-2">
            <component
              :is="principle.icon"
              class="w-5 h-5"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
            />
            <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ principle.name }}
            </h4>
          </div>
          <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
            {{ principle.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Discipline-Specific Resources -->
    <div class="mb-6">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Discipline-Specific Resources
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'">
              <th class="text-left p-3 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Discipline</th>
              <th class="text-left p-3 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Key Guidelines</th>
              <th class="text-left p-3 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Focus Areas</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="resource in disciplineResources"
              :key="resource.discipline"
              class="border-b cursor-pointer transition-colors"
              :class="[
                preferencesStore.darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50',
                selectedDiscipline === resource.discipline ? (preferencesStore.darkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''
              ]"
              @click="selectedDiscipline = resource.discipline"
            >
              <td class="p-3 font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ resource.discipline }}
              </td>
              <td class="p-3" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ resource.guidelines }}
              </td>
              <td class="p-3" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ resource.focus }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Research Ethics Beyond Academic Integrity -->
    <div class="mb-6">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Research Ethics Considerations
      </h3>
      <p class="text-sm mb-4" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Beyond academic integrity, research ethics for AI include:
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="item in researchEthics"
          :key="item.id"
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-center gap-2 mb-2">
            <component
              :is="item.icon"
              class="w-4 h-4"
              :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-600'"
            />
            <h4 class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ item.title }}
            </h4>
          </div>
          <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Red Flags Checklist -->
    <div
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'"
    >
      <div class="flex items-center gap-2 mb-4">
        <AlertTriangle class="w-5 h-5" :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-600'" />
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-red-300' : 'text-red-800'">
          Red Flags for Ethical Concern
        </h3>
      </div>
      <p class="text-sm mb-4" :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-700'">
        Check any that apply to your AI use:
      </p>
      <div class="space-y-2">
        <div
          v-for="flag in redFlags"
          :key="flag"
          @click="toggleFlag(flag)"
          class="flex items-start gap-3 p-2 rounded cursor-pointer transition-colors"
          :class="preferencesStore.darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'"
        >
          <div
            class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center"
            :class="isFlagChecked(flag)
              ? 'bg-red-500 border-red-500'
              : (preferencesStore.darkMode ? 'border-red-700' : 'border-red-300')"
          >
            <CheckCircle v-if="isFlagChecked(flag)" class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm" :class="preferencesStore.darkMode ? 'text-red-300' : 'text-red-700'">
            {{ flag }}
          </span>
        </div>
      </div>

      <div
        v-if="checkedFlags.size > 0"
        class="mt-4 p-3 rounded-lg"
        :class="preferencesStore.darkMode ? 'bg-red-900/40' : 'bg-red-100'"
      >
        <p class="text-sm font-medium" :class="preferencesStore.darkMode ? 'text-red-200' : 'text-red-800'">
          {{ checkedFlags.size }} flag(s) checked.
          Consider consulting with colleagues or your IRB about these concerns.
        </p>
      </div>
    </div>

    <!-- Links to More -->
    <div
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'"
    >
      <h4 class="font-medium mb-2" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'">
        Further Reading
      </h4>
      <ul class="text-sm space-y-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'">
        <li class="flex items-center gap-1">
          <ExternalLink class="w-3 h-3" />
          <span>Search for your professional organization's AI guidelines</span>
        </li>
        <li class="flex items-center gap-1">
          <ExternalLink class="w-3 h-3" />
          <span>Check your institution's AI policy page</span>
        </li>
        <li class="flex items-center gap-1">
          <ExternalLink class="w-3 h-3" />
          <span>Review the Bias Assessment applet for fairness considerations</span>
        </li>
      </ul>
    </div>
  </AppletFrame>
</template>
