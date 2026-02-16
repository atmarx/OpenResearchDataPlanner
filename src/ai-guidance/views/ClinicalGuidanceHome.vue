<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useConfigStore } from '@/stores/configStore'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  FileCheck,
  BookOpen,
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-vue-next'

const router = useRouter()
const preferencesStore = usePreferencesStore()
const sessionStore = useSessionStore()
const configStore = useConfigStore()
const aiStore = useAiGuidanceStore()

// Clinical applets
const clinicalApplets = [
  {
    id: 'hipaa-deident',
    title: 'HIPAA De-identification',
    question: 'Is your health data truly de-identified?',
    priority: 'P0',
    icon: ShieldCheck,
    color: 'blue',
    description: 'Official 18-identifier Safe Harbor checklist and Expert Determination guidance'
  },
  {
    id: 'irb-amendment',
    title: 'IRB Amendment Guide',
    question: 'How do I amend my protocol for AI use?',
    priority: 'P1',
    icon: Users,
    color: 'purple',
    description: 'Decision tree + sample protocol language and consent form templates'
  },
  {
    id: 'clinical-validation',
    title: 'Clinical Validation Checklist',
    question: 'Is my AI ready for clinical deployment?',
    priority: 'P1',
    icon: FileCheck,
    color: 'green',
    description: 'Comprehensive FDA-aligned validation requirements for clinical AI'
  }
]

// Get tier context
const tierConfig = computed(() => {
  const tierSlug = sessionStore.tier
  if (!tierSlug) return null
  return configStore.tiersBySlug?.[tierSlug]
})

const hasClinicalContext = computed(() => {
  return sessionStore.tier === 'l3-high' || aiStore.allFlags.includes('hipaa')
})

// Count completed
const completedCount = computed(() => {
  return clinicalApplets.filter(a => aiStore.isAppletComplete(`clinical-${a.id}`)).length
})

function goToApplet(appletId) {
  router.push(`/ai/clinical/${appletId}`)
}

function backToGeneralGuidance() {
  router.push('/ai')
}

function getColorClasses(color, isDark) {
  const colors = {
    blue: isDark
      ? 'bg-blue-900/30 border-blue-700 text-blue-400'
      : 'bg-blue-50 border-blue-200 text-blue-600',
    purple: isDark
      ? 'bg-purple-900/30 border-purple-700 text-purple-400'
      : 'bg-purple-50 border-purple-200 text-purple-600',
    green: isDark
      ? 'bg-green-900/30 border-green-700 text-green-400'
      : 'bg-green-50 border-green-200 text-green-600'
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
            <div class="flex items-center gap-2 mb-1">
              <button
                @click="backToGeneralGuidance"
                class="flex items-center gap-1 text-sm transition-colors"
                :class="preferencesStore.darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'"
              >
                <ArrowLeft class="w-4 h-4" />
                AI Guidance
              </button>
            </div>
            <h1
              class="text-2xl font-bold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              Clinical & Healthcare AI
            </h1>
            <p
              class="mt-1"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              Specialized guidance for HIPAA, IRB, FDA, and clinical validation
            </p>
          </div>

          <!-- Progress -->
          <div
            class="text-sm"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            {{ completedCount }} / {{ clinicalApplets.length }} completed
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-8 space-y-8">
      <!-- Tier Context (if applicable) -->
      <div
        v-if="hasClinicalContext && tierConfig"
        class="p-4 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-blue-900/20 border-blue-800'
          : 'bg-blue-50 border-blue-200'"
      >
        <div class="flex items-start gap-3">
          <ShieldAlert
            class="w-5 h-5 flex-shrink-0"
            :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
          />
          <div>
            <p
              class="font-medium"
              :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'"
            >
              You're working with {{ tierConfig.name }} data
            </p>
            <p
              class="text-sm mt-1"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'"
            >
              This guidance is tailored to healthcare compliance requirements.
            </p>
          </div>
        </div>
      </div>

      <!-- Why a Separate Track? -->
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
          Why a Clinical Track?
        </h2>
        <p
          class="mb-3"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          Clinical and healthcare AI research has unique requirements that don't apply to general research:
        </p>
        <ul
          class="space-y-2 text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          <li class="flex items-start gap-2">
            <CheckCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
            <span><strong>HIPAA compliance:</strong> De-identification, BAA requirements, audit logging</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
            <span><strong>IRB protocols:</strong> Human subjects research with AI tools</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
            <span><strong>FDA validation:</strong> Clinical deployment and regulatory pathways</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
            <span><strong>Bias auditing:</strong> Performance across demographic groups</span>
          </li>
        </ul>
      </div>

      <!-- Essential Guides -->
      <div>
        <h2
          class="text-xl font-bold mb-4"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Essential Clinical AI Guides
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="applet in clinicalApplets"
            :key="applet.id"
            @click="goToApplet(applet.id)"
            class="relative p-4 rounded-lg border text-left transition-all hover:shadow-md group"
            :class="[
              getColorClasses(applet.color, preferencesStore.darkMode),
              'hover:scale-[1.02]'
            ]"
          >
            <!-- Priority badge -->
            <div class="absolute top-2 right-2 flex items-center gap-1">
              <span
                class="px-2 py-0.5 text-xs rounded-full font-medium"
                :class="preferencesStore.darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'"
              >
                {{ applet.priority }}
              </span>
              <CheckCircle
                v-if="aiStore.isAppletComplete(`clinical-${applet.id}`)"
                class="w-4 h-4 text-green-500"
              />
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
              class="text-sm mb-2"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ applet.question }}
            </p>

            <!-- Description -->
            <p
              class="text-xs"
              :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
            >
              {{ applet.description }}
            </p>

            <!-- Arrow on hover -->
            <ArrowRight
              class="absolute bottom-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            />
          </button>
        </div>
      </div>

      <!-- Suggested Path -->
      <div
        class="p-6 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Suggested Path
        </h2>
        <p
          class="mb-4"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          For clinical AI research, we recommend completing these in order:
        </p>
        <ol
          class="space-y-2 text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          <li class="flex items-start gap-2">
            <span class="font-medium">1.</span>
            <span><strong>HIPAA De-identification</strong> — Verify your data classification before using any AI tools</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="font-medium">2.</span>
            <span><strong>IRB Amendment</strong> — Ensure your protocol covers AI use</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="font-medium">3.</span>
            <span><strong>Clinical Validation</strong> — Track readiness for publication or deployment</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="font-medium">4.</span>
            <router-link
              to="/ai"
              class="hover:underline"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
            >
              Return to general AI guidance
            </router-link>
            <span>for tool selection and verification</span>
          </li>
        </ol>
      </div>

      <!-- Disclaimer -->
      <div
        class="p-4 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-orange-900/20 border-orange-800'
          : 'bg-orange-50 border-orange-200'"
      >
        <div class="flex items-start gap-3">
          <AlertTriangle
            class="w-5 h-5 flex-shrink-0"
            :class="preferencesStore.darkMode ? 'text-orange-400' : 'text-orange-600'"
          />
          <div class="text-sm">
            <p
              class="font-medium mb-1"
              :class="preferencesStore.darkMode ? 'text-orange-300' : 'text-orange-800'"
            >
              Important Disclaimer
            </p>
            <p
              :class="preferencesStore.darkMode ? 'text-orange-400' : 'text-orange-700'"
            >
              This guidance is for educational purposes and does not constitute legal or compliance advice.
              Always consult your institutional IRB office, privacy/compliance office, or regulatory affairs
              before making final decisions about HIPAA, IRB protocols, or FDA requirements.
            </p>
          </div>
        </div>
      </div>

      <!-- External Resources -->
      <div
        class="p-6 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-100 border-gray-200'"
      >
        <h3
          class="font-semibold mb-3 flex items-center gap-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          <BookOpen class="w-5 h-5" />
          Official Resources
        </h3>
        <ul
          class="space-y-2 text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          <li>
            <a
              href="https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
            >
              HHS HIPAA De-identification Guidance (Feb 2025)
            </a>
          </li>
          <li>
            <a
              href="https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
            >
              FDA AI/ML-Enabled Medical Devices
            </a>
          </li>
          <li>
            <a
              href="https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-132.html"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
            >
              NIH AI Use Policy (NOT-OD-25-132)
            </a>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>
