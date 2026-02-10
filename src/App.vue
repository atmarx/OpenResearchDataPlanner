<script setup>
import { onMounted, computed, defineAsyncComponent } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useWizard } from '@/composables/useWizard'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import WizardProgress from '@/components/layout/WizardProgress.vue'

// Lazy load step components
const WelcomeStep = defineAsyncComponent(() =>
  import('@/components/wizard/WelcomeStep.vue')
)
const TierSelectStep = defineAsyncComponent(() =>
  import('@/components/wizard/TierSelectStep.vue')
)
const GrantPeriodStep = defineAsyncComponent(() =>
  import('@/components/wizard/GrantPeriodStep.vue')
)
const RetentionStep = defineAsyncComponent(() =>
  import('@/components/wizard/RetentionStep.vue')
)
const ServiceSelectStep = defineAsyncComponent(() =>
  import('@/components/wizard/ServiceSelectStep.vue')
)
const EstimateStep = defineAsyncComponent(() =>
  import('@/components/wizard/EstimateStep.vue')
)
const ResultsStep = defineAsyncComponent(() =>
  import('@/components/wizard/ResultsStep.vue')
)
const ConsultationStep = defineAsyncComponent(() =>
  import('@/components/wizard/ConsultationStep.vue')
)

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const wizard = useWizard()

// Map step IDs to components
const stepComponents = {
  'welcome': WelcomeStep,
  'tier-select': TierSelectStep,
  'grant-period': GrantPeriodStep,
  'retention': RetentionStep,
  'service-select': ServiceSelectStep,
  'estimate': EstimateStep,
  'results': ResultsStep,
  'consultation': ConsultationStep
}

const currentComponent = computed(() => {
  return stepComponents[sessionStore.currentStep] || WelcomeStep
})

onMounted(async () => {
  await configStore.loadConfig()
  // Try to restore session from localStorage
  sessionStore.loadFromLocalStorage()
})

function handleStepNavigate(stepId) {
  wizard.navigateTo(stepId)
}
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Loading state -->
  <div v-if="configStore.loading" class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading configuration...</p>
    </div>
  </div>

  <!-- Error state -->
  <div v-else-if="configStore.error" class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center max-w-md px-4">
      <div class="text-red-500 text-5xl mb-4">!</div>
      <p class="text-red-600 font-semibold text-lg">Failed to load configuration</p>
      <p class="text-gray-500 mt-2">{{ configStore.error }}</p>
      <button
        @click="configStore.loadConfig()"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Main app -->
  <div v-else class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />

    <main id="main-content" class="flex-1 px-4 sm:px-6 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Progress indicator (hide on welcome and consultation) -->
        <WizardProgress
          v-if="sessionStore.currentStep !== 'welcome' && sessionStore.currentStep !== 'consultation'"
          :steps="wizard.activeSteps.value"
          :current-step="sessionStore.currentStep"
          :completed-steps="sessionStore.session.completed_steps"
          @navigate="handleStepNavigate"
        />

        <!-- Step content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <component
            :is="currentComponent"
            @next="wizard.nextStep"
            @back="wizard.previousStep"
          />
        </div>

        <!-- Navigation buttons (except on welcome and results) -->
        <div
          v-if="sessionStore.currentStep !== 'welcome' && sessionStore.currentStep !== 'results' && sessionStore.currentStep !== 'consultation'"
          class="mt-6 flex justify-between"
        >
          <button
            v-if="wizard.hasPreviousStep.value"
            @click="wizard.previousStep"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <div v-else></div>

          <button
            v-if="wizard.hasNextStep.value"
            @click="wizard.nextStep"
            :disabled="!wizard.canProceed.value"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </main>

    <AppFooter />

    <!-- Navigation warning modal -->
    <Teleport to="body">
      <div
        v-if="wizard.showNavigationWarning.value"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="wizard.cancelNavigation"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="warning-title"
        >
          <h2 id="warning-title" class="text-lg font-semibold text-gray-900 mb-2">
            Clear existing selections?
          </h2>
          <p class="text-gray-600 mb-6">
            Going back to this step will clear your selections from later steps.
            This cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="wizard.cancelNavigation"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="wizard.confirmNavigation"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Clear and continue
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
