import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * AI Guidance Store
 * Manages state for the AI Guidance applets flow
 *
 * Design: Fully decoupled from Research Data Planner stores
 * Can be extracted to separate project later
 */
export const useAiGuidanceStore = defineStore('aiGuidance', () => {
  // Completed applets with their outputs
  const completedApplets = ref({})

  // Current applet being viewed
  const currentApplet = ref(null)

  // Feedback given (applet -> 'up' | 'down' | null)
  const feedback = ref({})

  // Session flags accumulated from applets
  const flags = ref([])

  // Computed: Get output from a specific applet
  function getAppletOutput(appletId) {
    return completedApplets.value[appletId] || null
  }

  // Computed: Check if applet is complete
  function isAppletComplete(appletId) {
    return appletId in completedApplets.value
  }

  // Computed: Get all flags set by completed applets
  const allFlags = computed(() => {
    return [...new Set(flags.value)]
  })

  // Computed: Stakes level (from Stakes Assessment applet)
  const stakesLevel = computed(() => {
    return completedApplets.value['stakes-assessment']?.level || null
  })

  // Computed: Data sensitivity (from Data Check applet)
  const dataSensitivity = computed(() => {
    return completedApplets.value['data-check']?.sensitivity || null
  })

  // Computed: IRB status (from IRB Workflow applet)
  const irbStatus = computed(() => {
    return completedApplets.value['irb-workflow']?.status || null
  })

  // Actions
  function completeApplet(appletId, output) {
    completedApplets.value[appletId] = {
      ...output,
      completedAt: new Date().toISOString()
    }

    // Extract and merge flags if present
    if (output.flags && Array.isArray(output.flags)) {
      flags.value = [...new Set([...flags.value, ...output.flags])]
    }
  }

  function setCurrentApplet(appletId) {
    currentApplet.value = appletId
  }

  function setFeedback(appletId, vote) {
    feedback.value[appletId] = vote
  }

  function addFlag(flag) {
    if (!flags.value.includes(flag)) {
      flags.value.push(flag)
    }
  }

  function removeFlag(flag) {
    flags.value = flags.value.filter(f => f !== flag)
  }

  function clearFlags() {
    flags.value = []
  }

  function resetApplet(appletId) {
    delete completedApplets.value[appletId]
    delete feedback.value[appletId]
  }

  function resetAll() {
    completedApplets.value = {}
    currentApplet.value = null
    feedback.value = {}
    flags.value = []
  }

  // Export session data (for saving/sharing)
  function exportSession() {
    return {
      completedApplets: completedApplets.value,
      feedback: feedback.value,
      flags: flags.value,
      exportedAt: new Date().toISOString()
    }
  }

  // Import session data
  function importSession(data) {
    if (data.completedApplets) {
      completedApplets.value = data.completedApplets
    }
    if (data.feedback) {
      feedback.value = data.feedback
    }
    if (data.flags) {
      flags.value = data.flags
    }
  }

  return {
    // State
    completedApplets,
    currentApplet,
    feedback,
    flags,

    // Computed
    allFlags,
    stakesLevel,
    dataSensitivity,
    irbStatus,

    // Getters
    getAppletOutput,
    isAppletComplete,

    // Actions
    completeApplet,
    setCurrentApplet,
    setFeedback,
    addFlag,
    removeFlag,
    clearFlags,
    resetApplet,
    resetAll,
    exportSession,
    importSession
  }
})
