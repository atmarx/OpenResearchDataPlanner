<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
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

function getColorClasses(color) {
  const colors = {
    blue: 'bg-surface-alt border-border text-primary',
    purple: 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-400',
    green: 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <div class="min-h-screen transition-colors bg-canvas">
    <!-- Header -->
    <header class="border-b bg-surface border-border">
      <div class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <button
                @click="backToGeneralGuidance"
                class="flex items-center gap-1 text-sm transition-colors text-text-muted hover:text-text-secondary"
              >
                <ArrowLeft class="w-4 h-4" />
                AI Guidance
              </button>
            </div>
            <h1 class="text-2xl font-bold text-text">
              Clinical & Healthcare AI
            </h1>
            <p class="mt-1 text-text-secondary">
              Specialized guidance for HIPAA, IRB, FDA, and clinical validation
            </p>
          </div>

          <!-- Progress -->
          <div class="text-sm text-text-muted">
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
        class="p-4 rounded-lg border bg-surface-alt border-border"
      >
        <div class="flex items-start gap-3">
          <ShieldAlert
            class="w-5 h-5 flex-shrink-0 text-primary"
          />
          <div>
            <p class="font-medium text-primary">
              You're working with {{ tierConfig.name }} data
            </p>
            <p class="text-sm mt-1 text-text-secondary">
              This guidance is tailored to healthcare compliance requirements.
            </p>
          </div>
        </div>
      </div>

      <!-- Why a Separate Track? -->
      <div class="p-6 rounded-lg border bg-surface border-border">
        <h2 class="text-lg font-semibold mb-2 text-text">
          Why a Clinical Track?
        </h2>
        <p class="mb-3 text-text-secondary">
          Clinical and healthcare AI research has unique requirements that don't apply to general research:
        </p>
        <ul class="space-y-2 text-sm text-text-secondary">
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
        <h2 class="text-xl font-bold mb-4 text-text">
          Essential Clinical AI Guides
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="applet in clinicalApplets"
            :key="applet.id"
            @click="goToApplet(applet.id)"
            class="relative p-4 rounded-lg border text-left transition-all hover:shadow-md group"
            :class="[
              getColorClasses(applet.color),
              'hover:scale-[1.02]'
            ]"
          >
            <!-- Priority badge -->
            <div class="absolute top-2 right-2 flex items-center gap-1">
              <span
                class="px-2 py-0.5 text-xs rounded-full font-medium bg-surface-alt text-text-secondary"
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
            <h3 class="font-semibold mb-1 text-text">
              {{ applet.title }}
            </h3>

            <!-- Question -->
            <p class="text-sm mb-2 text-text-secondary">
              {{ applet.question }}
            </p>

            <!-- Description -->
            <p class="text-xs text-text-muted">
              {{ applet.description }}
            </p>

            <!-- Arrow on hover -->
            <ArrowRight
              class="absolute bottom-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted"
            />
          </button>
        </div>
      </div>

      <!-- Suggested Path -->
      <div class="p-6 rounded-lg border bg-surface border-border">
        <h2 class="text-lg font-semibold mb-3 text-text">
          Suggested Path
        </h2>
        <p class="mb-4 text-text-secondary">
          For clinical AI research, we recommend completing these in order:
        </p>
        <ol class="space-y-2 text-sm text-text-secondary">
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
              class="hover:underline text-primary"
            >
              Return to general AI guidance
            </router-link>
            <span>for tool selection and verification</span>
          </li>
        </ol>
      </div>

      <!-- Disclaimer -->
      <div
        class="p-4 rounded-lg border bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
      >
        <div class="flex items-start gap-3">
          <AlertTriangle
            class="w-5 h-5 flex-shrink-0 text-orange-600 dark:text-orange-400"
          />
          <div class="text-sm">
            <p class="font-medium mb-1 text-orange-800 dark:text-orange-300">
              Important Disclaimer
            </p>
            <p class="text-orange-700 dark:text-orange-400">
              This guidance is for educational purposes and does not constitute legal or compliance advice.
              Always consult your institutional IRB office, privacy/compliance office, or regulatory affairs
              before making final decisions about HIPAA, IRB protocols, or FDA requirements.
            </p>
          </div>
        </div>
      </div>

      <!-- External Resources -->
      <div class="p-6 rounded-lg border bg-surface-alt border-border">
        <h3 class="font-semibold mb-3 flex items-center gap-2 text-text">
          <BookOpen class="w-5 h-5" />
          Official Resources
        </h3>
        <ul class="space-y-2 text-sm text-text-secondary">
          <li>
            <a
              href="https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline text-primary"
            >
              HHS OCR — Guidance on De-identification of PHI under the HIPAA Privacy Rule (2012); 45 CFR § 164.514
            </a>
          </li>
          <li>
            <a
              href="https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline text-primary"
            >
              FDA — Artificial Intelligence-Enabled Medical Devices (authorized device list)
            </a>
          </li>
          <li>
            <a
              href="https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline text-primary"
            >
              FDA/Health Canada/MHRA — Good Machine Learning Practice: Guiding Principles (Oct 2021)
            </a>
          </li>
          <li>
            <a
              href="https://www.nist.gov/itl/ai-risk-management-framework"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline text-primary"
            >
              NIST AI Risk Management Framework 1.0 (NIST AI 100-1, 2023) + Generative AI Profile (NIST AI 600-1, 2024)
            </a>
          </li>
          <li>
            <a
              href="https://www.who.int/publications/i/item/9789240084759"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline text-primary"
            >
              WHO — Ethics & Governance of AI for Health: Large Multi-Modal Models (Jan 2024)
            </a>
          </li>
          <li>
            <a
              href="https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-132.html"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline text-primary"
            >
              NIH NOT-OD-25-132 — Supporting Fairness & Originality in NIH Applications (AI use; eff. Sept 2025)
            </a>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>
