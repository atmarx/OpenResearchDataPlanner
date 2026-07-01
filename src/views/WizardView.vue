<script setup>
import { computed, defineAsyncComponent, nextTick, watch } from 'vue'
import { useSessionStore } from '@/stores/sessionStore'
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

watch(
  () => sessionStore.currentStep,
  () => {
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
)

// Mirror wizard selections into the slate as they change, so the slate bar shows
// services/software the moment you add them — not only after the estimate step.
// syncToSlate is idempotent; immediate:true also syncs a session restored from
// localStorage on mount.
watch(
  () => [sessionStore.session.selected_services, sessionStore.session.selected_software],
  () => wizard.syncToSlate(),
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="max-w-4xl 2xl:max-w-5xl mx-auto">
    <!-- Progress indicator (hide on welcome and consultation). Wrapped in its own
         opaque panel matching the step card below — without it, the labels,
         numbers, and connector lines sit directly on the hero background and wash
         out; only the step circles were bg-surface, everything between them was
         transparent. The v-if lives on the wrapper so the whole panel hides on
         welcome/consultation (not just the inner stepper, leaving an empty box). -->
    <div
      v-if="sessionStore.currentStep !== 'welcome' && sessionStore.currentStep !== 'consultation'"
      class="rounded-lg shadow-sm border bg-surface/95 border-border px-8 py-6 mb-8"
    >
      <WizardProgress
        :steps="wizard.activeSteps.value"
        :current-step="sessionStore.currentStep"
        :completed-steps="sessionStore.session.completed_steps"
        @navigate="handleStepNavigate"
      />
    </div>

    <!-- Step content -->
    <div
      class="rounded-lg shadow-sm border bg-surface/95 border-border"
    >
      <component
        :is="currentComponent"
        @next="wizard.nextStep"
        @back="wizard.previousStep"
      />

      <!-- Inline step nav, INSIDE the card under the step's content (mirrors the
           Back/Continue teleported into the slate bar). On a tall screen the
           primary action sits right here under the selections, not only pinned
           at the page bottom. Same handlers; reads on the card surface. -->
      <div
        v-if="wizard.showStepNav.value"
        class="flex items-center justify-between gap-3 px-8 pb-8 pt-4 border-t border-border"
      >
        <button
          v-if="wizard.hasPreviousStep.value"
          @click="wizard.previousStep"
          class="px-4 py-2 rounded-md font-medium text-text-secondary hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
        >
          Back
        </button>
        <span v-else></span>
        <button
          v-if="wizard.hasNextStep.value"
          @click="wizard.nextStep"
          :disabled="!wizard.canProceed.value"
          class="px-6 py-2 rounded-md font-medium bg-primary text-on-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>

    <!-- The same Back/Continue is ALSO teleported into the slate bar's
         #slate-nav-slot, so it stays reachable from the persistent bottom bar.
         WizardView keeps ownership (previousStep's "clear selections?" warning
         still fires here); `defer` lets the later-rendered slot resolve. -->
    <Teleport defer to="#slate-nav-slot" v-if="wizard.showStepNav.value">
      <button
        v-if="wizard.hasPreviousStep.value"
        @click="wizard.previousStep"
        class="px-4 py-2 rounded-md font-medium text-on-primary/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 transition-colors"
      >
        Back
      </button>
      <button
        v-if="wizard.hasNextStep.value"
        @click="wizard.nextStep"
        :disabled="!wizard.canProceed.value"
        class="px-6 py-2 rounded-md font-medium bg-surface text-primary hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-white/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </Teleport>

  <!-- Navigation warning modal. Nested inside the root <div> (not a sibling) so
       this view keeps a SINGLE root element — the layout's <Transition
       mode="out-in"> boundary requires it. A root-level sibling Teleport makes
       the view multi-root, which prevents the leave transition from completing
       and blanks <main> on navigate-away. Teleport still renders to <body>
       regardless of where it sits in the template. -->
  <Teleport to="body">
    <div
      v-if="wizard.showNavigationWarning.value"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="wizard.cancelNavigation"
    >
      <div
        class="rounded-lg shadow-xl max-w-md w-full p-6 bg-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="warning-title"
      >
        <h2
          id="warning-title"
          class="text-lg font-semibold mb-2 text-text"
        >
          Clear existing selections?
        </h2>
        <p
          class="mb-6 text-text-secondary"
        >
          Going back to this step will clear your selections from later steps.
          This cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="wizard.cancelNavigation"
            class="px-4 py-2 rounded-md text-text-secondary bg-surface border border-border-strong hover:bg-surface-alt"
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
