import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'

/**
 * Wizard step definitions
 */
const ALL_STEPS = [
  {
    id: 'welcome',
    label: 'Welcome',
    component: 'WelcomeStep'
  },
  {
    id: 'tier-select',
    label: 'Data Tier',
    component: 'TierSelectStep'
  },
  {
    id: 'grant-period',
    label: 'Grant Period',
    component: 'GrantPeriodStep'
  },
  {
    id: 'retention',
    label: 'Retention',
    component: 'RetentionStep'
  },
  {
    id: 'service-select',
    label: 'Services',
    component: 'ServiceSelectStep'
  },
  {
    id: 'estimate',
    label: 'Estimates',
    component: 'EstimateStep'
  },
  {
    id: 'results',
    label: 'Results',
    component: 'ResultsStep'
  }
]

// Consultation step for restricted tier (replaces normal flow)
const CONSULTATION_STEP = {
  id: 'consultation',
  label: 'Consultation',
  component: 'ConsultationStep'
}

export function useWizard() {
  const configStore = useConfigStore()
  const sessionStore = useSessionStore()

  const pendingNavigation = ref(null)
  const showNavigationWarning = ref(false)

  /**
   * Get the currently selected tier config
   */
  const selectedTierConfig = computed(() => {
    if (!sessionStore.selectedTier) return null
    return configStore.tiersBySlug[sessionStore.selectedTier]
  })

  /**
   * Check if current tier requires consultation (restricted)
   */
  const requiresConsultation = computed(() => {
    return selectedTierConfig.value?.consultation_required === true
  })

  /**
   * Get the active steps based on selected tier
   */
  const activeSteps = computed(() => {
    const tier = selectedTierConfig.value

    // If restricted tier selected, short-circuit to consultation
    if (requiresConsultation.value) {
      return [
        ALL_STEPS[0], // welcome
        ALL_STEPS[1], // tier-select
        CONSULTATION_STEP
      ]
    }

    // Filter steps based on tier requirements
    return ALL_STEPS.filter(step => {
      // Always show welcome, tier-select, service-select, estimate, results
      if (['welcome', 'tier-select', 'service-select', 'estimate', 'results'].includes(step.id)) {
        return true
      }

      // Grant period - skip if consultation required (already handled above)
      if (step.id === 'grant-period') {
        return true
      }

      // Retention - only show if tier requires retention questions
      if (step.id === 'retention') {
        return tier?.retention_questions_required === true
      }

      return true
    })
  })

  /**
   * Get current step index
   */
  const currentStepIndex = computed(() => {
    return activeSteps.value.findIndex(s => s.id === sessionStore.currentStep)
  })

  /**
   * Get current step config
   */
  const currentStepConfig = computed(() => {
    return activeSteps.value.find(s => s.id === sessionStore.currentStep) || activeSteps.value[0]
  })

  /**
   * Check if can proceed to next step
   */
  const canProceed = computed(() => {
    const step = sessionStore.currentStep

    switch (step) {
      case 'welcome':
        return true

      case 'tier-select':
        return !!sessionStore.selectedTier

      case 'grant-period':
        return sessionStore.session.grant_period.months > 0

      case 'retention':
        return sessionStore.session.retention.schedules.length > 0

      case 'service-select':
        return sessionStore.session.selected_services.length > 0

      case 'estimate':
        // Check all services have estimates
        const hasAllEstimates = sessionStore.session.selected_services.every(s => s.estimate > 0)

        // Check all services requiring acknowledgment have been acknowledged
        const allAcknowledged = sessionStore.session.selected_services.every(s => {
          const serviceConfig = configStore.servicesBySlug[s.service_slug]
          if (serviceConfig?.acknowledgment?.required) {
            return s.acknowledged === true
          }
          return true
        })

        return hasAllEstimates && allAcknowledged

      case 'results':
      case 'consultation':
        return true

      default:
        return false
    }
  })

  /**
   * Check if there's a next step
   */
  const hasNextStep = computed(() => {
    return currentStepIndex.value < activeSteps.value.length - 1
  })

  /**
   * Check if there's a previous step
   */
  const hasPreviousStep = computed(() => {
    return currentStepIndex.value > 0
  })

  /**
   * Get step IDs that would be affected by navigating back
   */
  function getAffectedSteps(targetStepId) {
    const targetIndex = activeSteps.value.findIndex(s => s.id === targetStepId)
    const currentIndex = currentStepIndex.value

    if (targetIndex >= currentIndex) return []

    // Return steps that would be cleared (between target and current, inclusive of those after target)
    return activeSteps.value
      .slice(targetIndex + 1)
      .map(s => s.id)
      .filter(id => sessionStore.session.completed_steps.includes(id))
  }

  /**
   * Check if navigating to a step would clear data
   */
  function wouldClearData(targetStepId) {
    const affectedSteps = getAffectedSteps(targetStepId)
    return affectedSteps.length > 0 && sessionStore.hasUnsavedChanges
  }

  /**
   * Navigate to a specific step
   */
  function navigateTo(stepId, force = false) {
    const stepIds = activeSteps.value.map(s => s.id)

    if (!stepIds.includes(stepId)) {
      console.warn(`Step "${stepId}" is not in active steps`)
      return
    }

    // Check if this would clear data
    if (!force && wouldClearData(stepId)) {
      pendingNavigation.value = stepId
      showNavigationWarning.value = true
      return
    }

    // Clear downstream data if going back
    const targetIndex = activeSteps.value.findIndex(s => s.id === stepId)
    if (targetIndex < currentStepIndex.value) {
      sessionStore.clearStepsFrom(stepId, stepIds)
    }

    sessionStore.setStep(stepId)
    pendingNavigation.value = null
    showNavigationWarning.value = false
  }

  /**
   * Confirm pending navigation (used after warning)
   */
  function confirmNavigation() {
    if (pendingNavigation.value) {
      navigateTo(pendingNavigation.value, true)
    }
  }

  /**
   * Cancel pending navigation
   */
  function cancelNavigation() {
    pendingNavigation.value = null
    showNavigationWarning.value = false
  }

  /**
   * Go to next step
   */
  function nextStep() {
    if (!canProceed.value || !hasNextStep.value) return

    // Mark current step as completed
    sessionStore.completeStep(sessionStore.currentStep)

    // Move to next step
    const nextIndex = currentStepIndex.value + 1
    const nextStepConfig = activeSteps.value[nextIndex]
    sessionStore.setStep(nextStepConfig.id)
  }

  /**
   * Go to previous step
   */
  function previousStep() {
    if (!hasPreviousStep.value) return

    const prevIndex = currentStepIndex.value - 1
    const prevStepConfig = activeSteps.value[prevIndex]
    navigateTo(prevStepConfig.id)
  }

  return {
    // State
    activeSteps,
    currentStepIndex,
    currentStepConfig,
    selectedTierConfig,
    requiresConsultation,
    canProceed,
    hasNextStep,
    hasPreviousStep,
    showNavigationWarning,
    pendingNavigation,

    // Methods
    navigateTo,
    nextStep,
    previousStep,
    confirmNavigation,
    cancelNavigation,
    wouldClearData,
    getAffectedSteps
  }
}
