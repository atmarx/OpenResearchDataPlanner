import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// localStorage key. The stored value is the raw session object below — there
// is no schema version; loadFromLocalStorage shallow-merges it over
// createEmptySession() so newly added TOP-LEVEL keys get defaults.
const STORAGE_KEY = 'odp-session'

/**
 * Generate a UUID, with fallback for non-secure contexts (HTTP)
 */
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for non-secure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const useSessionStore = defineStore('session', () => {
  // Session state
  const session = ref(createEmptySession())

  /**
   * Create a fresh empty session
   */
  function createEmptySession() {
    return {
      id: generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      template_version: null, // Set when config loads

      // Wizard progress
      current_step: 'welcome',
      completed_steps: [],

      // User selections
      tier: null,
      // Compliance flags derived by the tier questionnaire (classifyTier.js):
      // hipaa, phi, ferpa, cui, ear, itar, human_genomic, ... Captured so the
      // DMP can express the intent behind the tier, not just the tier slug.
      classification_flags: [],

      grant_period: {
        start_date: null,
        end_date: null,
        months: 36 // Default 3-year grant
      },

      retention: {
        schedules: [],
        longest_years: 3,
        // Pre-fills each archive estimate as active estimate × ratio in the
        // EstimateStep UI. Never used by the pricing engine — only the archive
        // estimate the user commits is priced (see lib/pricing.js).
        archive_ratio: 0.7,
        custom_ratio: false
      },

      selected_services: [],
      // Each service entry: { service_slug, estimate, use_subsidy, notes, archive_estimate, acknowledged }
      // use_subsidy = slug of an opt-in (non-auto_apply) subsidy, or null

      selected_software: [],
      // Each software entry: { software_slug, note, platforms }
      // platforms = which of their selected services will use this software

      // Reserved: nothing currently writes this (setCostSummary has no callers);
      // totals are computed live from lib/pricing.js. Still cleared on back-nav.
      cost_summary: null
    }
  }

  // Computed helpers
  const currentStep = computed(() => session.value.current_step)
  const selectedTier = computed(() => session.value.tier)
  const classificationFlags = computed(() => session.value.classification_flags || [])
  const grantMonths = computed(() => session.value.grant_period.months)

  const selectedServiceSlugs = computed(() =>
    session.value.selected_services.map(s => s.service_slug)
  )

  const selectedSoftwareSlugs = computed(() =>
    session.value.selected_software.map(s => s.software_slug)
  )

  const hasUnsavedChanges = computed(() => {
    // Misnomer kept for callers: the session autosaves, so this really means
    // "has selections worth warning about before a destructive back-nav".
    return session.value.tier !== null ||
           session.value.selected_services.length > 0 ||
           session.value.selected_software.length > 0
  })

  /**
   * Reset session to empty state
   */
  function reset() {
    session.value = createEmptySession()
  }

  /**
   * Update the current step
   */
  function setStep(stepId) {
    session.value.current_step = stepId
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Mark a step as completed
   */
  function completeStep(stepId) {
    if (!session.value.completed_steps.includes(stepId)) {
      session.value.completed_steps.push(stepId)
    }
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Clear steps from a given point forward (for back navigation)
   */
  function clearStepsFrom(stepId, allSteps) {
    const stepIndex = allSteps.indexOf(stepId)
    if (stepIndex === -1) return

    // Remove completed steps from this point forward
    session.value.completed_steps = session.value.completed_steps.filter(s => {
      const idx = allSteps.indexOf(s)
      return idx < stepIndex
    })

    // Clear downstream data based on which step we're clearing from. Each
    // branch catches any step AT OR BEFORE its anchor, so the cascade is
    // positional: going back to grant-period or retention (which sit between
    // tier-select and service-select) also wipes services + software.
    // The grant period is never reset here; retention schedules only from tier-select.
    if (stepId === 'tier-select' || allSteps.indexOf(stepId) <= allSteps.indexOf('tier-select')) {
      session.value.tier = null
      session.value.classification_flags = []
      session.value.selected_services = []
      session.value.selected_software = []
      session.value.retention.schedules = []
      session.value.cost_summary = null
    } else if (stepId === 'service-select' || allSteps.indexOf(stepId) <= allSteps.indexOf('service-select')) {
      session.value.selected_services = []
      session.value.selected_software = []
      session.value.cost_summary = null
    } else if (stepId === 'software' || allSteps.indexOf(stepId) <= allSteps.indexOf('software')) {
      session.value.selected_software = []
      session.value.cost_summary = null
    } else if (stepId === 'estimate') {
      session.value.cost_summary = null
    }

    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Set the selected tier
   */
  function setTier(tierSlug) {
    session.value.tier = tierSlug
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Set tier + classification flags together. The questionnaire derives both
   * (classifyTier.js); direct tier picks pass [] so flags from an earlier
   * questionnaire run don't linger on a freshly chosen tier.
   */
  function setClassification(tierSlug, flags = []) {
    session.value.tier = tierSlug
    session.value.classification_flags = Array.isArray(flags) ? [...flags] : []
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Set grant period
   */
  function setGrantPeriod(startDate, endDate) {
    session.value.grant_period.start_date = startDate
    session.value.grant_period.end_date = endDate

    if (startDate && endDate) {
      // Counts calendar-month boundaries crossed, ignoring the day of month
      // (Jan 15 -> Feb 14 and Jan 15 -> Feb 16 are both 1). Date-only strings
      // parse as UTC but getMonth() reads local time, so a 1st-of-month date
      // can count as the prior month in US timezones.
      const start = new Date(startDate)
      const end = new Date(endDate)
      const months = (end.getFullYear() - start.getFullYear()) * 12 +
                     (end.getMonth() - start.getMonth())
      session.value.grant_period.months = Math.max(1, months)
    } else {
      session.value.grant_period.months = 36
    }

    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Set grant duration directly in months, no specific dates (period-first).
   * Dates are optional and only echoed in display/DMP — every calculation uses
   * `months`. Setting a duration clears any stale start/end so the DMP doesn't
   * print a range that contradicts the chosen length; the optional date field
   * re-populates them via setGrantPeriod.
   */
  function setGrantMonths(months) {
    session.value.grant_period.months = Math.max(1, Number(months) || 36)
    session.value.grant_period.start_date = null
    session.value.grant_period.end_date = null
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Set retention schedules
   */
  function setRetentionSchedules(scheduleSlugs, longestYears) {
    session.value.retention.schedules = scheduleSlugs
    session.value.retention.longest_years = longestYears
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Set archive ratio
   */
  function setArchiveRatio(ratio, isCustom = false) {
    session.value.retention.archive_ratio = ratio
    session.value.retention.custom_ratio = isCustom
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Add a service to the selection
   */
  function addService(serviceSlug, defaultEstimate = null) {
    if (selectedServiceSlugs.value.includes(serviceSlug)) return

    session.value.selected_services.push({
      service_slug: serviceSlug,
      estimate: defaultEstimate,
      use_subsidy: null,
      notes: '',
      archive_estimate: null,
      acknowledged: false
    })
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Remove a service from the selection
   */
  function removeService(serviceSlug) {
    session.value.selected_services = session.value.selected_services.filter(
      s => s.service_slug !== serviceSlug
    )
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Update a service's estimate
   */
  function updateServiceEstimate(serviceSlug, estimate) {
    const service = session.value.selected_services.find(
      s => s.service_slug === serviceSlug
    )
    if (service) {
      service.estimate = estimate
      session.value.updated_at = new Date().toISOString()
    }
  }

  /**
   * Update a service's subsidy selection
   */
  function updateServiceSubsidy(serviceSlug, subsidySlug) {
    const service = session.value.selected_services.find(
      s => s.service_slug === serviceSlug
    )
    if (service) {
      service.use_subsidy = subsidySlug
      session.value.updated_at = new Date().toISOString()
    }
  }

  /**
   * Update a service's archive estimate
   */
  function updateServiceArchiveEstimate(serviceSlug, archiveEstimate) {
    const service = session.value.selected_services.find(
      s => s.service_slug === serviceSlug
    )
    if (service) {
      service.archive_estimate = archiveEstimate
      session.value.updated_at = new Date().toISOString()
    }
  }

  /**
   * Update a service's acknowledgment status
   */
  function updateServiceAcknowledgment(serviceSlug, acknowledged) {
    const service = session.value.selected_services.find(
      s => s.service_slug === serviceSlug
    )
    if (service) {
      service.acknowledged = acknowledged
      session.value.updated_at = new Date().toISOString()
    }
  }

  // =====================================================
  // SOFTWARE SELECTION METHODS
  // =====================================================

  /**
   * Add software to the selection
   */
  function addSoftware(softwareSlug, platforms = []) {
    if (selectedSoftwareSlugs.value.includes(softwareSlug)) return

    session.value.selected_software.push({
      software_slug: softwareSlug,
      note: '',
      platforms: platforms // Which platforms/services they'll use it on
    })
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Remove software from the selection
   */
  function removeSoftware(softwareSlug) {
    session.value.selected_software = session.value.selected_software.filter(
      s => s.software_slug !== softwareSlug
    )
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Toggle software selection
   */
  function toggleSoftware(softwareSlug, platforms = []) {
    if (selectedSoftwareSlugs.value.includes(softwareSlug)) {
      removeSoftware(softwareSlug)
    } else {
      addSoftware(softwareSlug, platforms)
    }
  }

  /**
   * Update software note
   */
  function updateSoftwareNote(softwareSlug, note) {
    const software = session.value.selected_software.find(
      s => s.software_slug === softwareSlug
    )
    if (software) {
      software.note = note
      session.value.updated_at = new Date().toISOString()
    }
  }

  /**
   * Set the calculated cost summary
   */
  function setCostSummary(summary) {
    session.value.cost_summary = summary
    session.value.updated_at = new Date().toISOString()
  }

  /**
   * Save session to localStorage
   */
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session.value))
    } catch (e) {
      console.warn('Failed to save session to localStorage:', e)
    }
  }

  /**
   * Load session from localStorage
   */
  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge with defaults to handle schema changes. Shallow: a saved
        // grant_period/retention object replaces the default wholesale, so a
        // key added inside one of those stays undefined for old sessions.
        session.value = { ...createEmptySession(), ...parsed }
        return true
      }
    } catch (e) {
      console.warn('Failed to load session from localStorage:', e)
    }
    return false
  }

  /**
   * Export session as JSON string. Note export_version here is a separate
   * format from the slate's schema_version '1.2' file (useExport.exportJSON).
   */
  function exportSession(templateVersion, institutionName) {
    return JSON.stringify({
      export_version: '1.0',
      exported_at: new Date().toISOString(),
      template_version: templateVersion,
      institution: institutionName,
      session: session.value
    }, null, 2)
  }

  /**
   * Import session from JSON string
   */
  function importSession(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      if (data.session) {
        session.value = { ...createEmptySession(), ...data.session }
        saveToLocalStorage()
        return true
      }
    } catch (e) {
      console.error('Failed to import session:', e)
    }
    return false
  }

  // Auto-save on changes
  watch(session, saveToLocalStorage, { deep: true })

  return {
    // State
    session,

    // Computed
    currentStep,
    selectedTier,
    classificationFlags,
    grantMonths,
    selectedServiceSlugs,
    selectedSoftwareSlugs,
    hasUnsavedChanges,

    // Methods
    reset,
    setStep,
    completeStep,
    clearStepsFrom,
    setTier,
    setClassification,
    setGrantPeriod,
    setGrantMonths,
    setRetentionSchedules,
    setArchiveRatio,
    addService,
    removeService,
    updateServiceEstimate,
    updateServiceSubsidy,
    updateServiceArchiveEstimate,
    updateServiceAcknowledgment,
    addSoftware,
    removeSoftware,
    toggleSoftware,
    updateSoftwareNote,
    setCostSummary,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportSession,
    importSession
  }
})
