<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useWizard } from '@/composables/useWizard'
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
const SoftwareStep = defineAsyncComponent(() =>
  import('@/components/wizard/SoftwareStep.vue')
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

const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()
const wizard = useWizard()

// Map step IDs to components
const stepComponents = {
  'welcome': WelcomeStep,
  'tier-select': TierSelectStep,
  'grant-period': GrantPeriodStep,
  'retention': RetentionStep,
  'service-select': ServiceSelectStep,
  'software': SoftwareStep,
  'estimate': EstimateStep,
  'results': ResultsStep,
  'consultation': ConsultationStep
}

const currentComponent = computed(() => {
  return stepComponents[sessionStore.currentStep] || WelcomeStep
})

function handleStepNavigate(stepId) {
  wizard.navigateTo(stepId)
}
</script>

<template>
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
    <div
      class="rounded-lg shadow-sm border"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800/95 border-gray-700'
        : 'bg-white/95 border-gray-200'"
    >
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
        class="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :class="preferencesStore.darkMode
          ? 'text-gray-200 bg-gray-700 border border-gray-600 hover:bg-gray-600'
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'"
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

  <!-- Navigation warning modal -->
  <Teleport to="body">
    <div
      v-if="wizard.showNavigationWarning.value"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="wizard.cancelNavigation"
    >
      <div
        class="rounded-lg shadow-xl max-w-md w-full p-6"
        :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
        role="dialog"
        aria-modal="true"
        aria-labelledby="warning-title"
      >
        <h2
          id="warning-title"
          class="text-lg font-semibold mb-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Clear existing selections?
        </h2>
        <p
          class="mb-6"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
        >
          Going back to this step will clear your selections from later steps.
          This cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="wizard.cancelNavigation"
            class="px-4 py-2 rounded-md"
            :class="preferencesStore.darkMode
              ? 'text-gray-200 bg-gray-700 border border-gray-600 hover:bg-gray-600'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'"
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
</template>
