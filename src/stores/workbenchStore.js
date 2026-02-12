import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'odp-workbench'
const SESSION_KEY = 'odp-workbench-session'

/**
 * WorkbenchStore - Manages the Support Workbench state
 *
 * Handles authentication, loaded plans, and workbench settings.
 * Persists to localStorage for plans, sessionStorage for auth.
 */
export const useWorkbenchStore = defineStore('workbench', () => {
  // Authentication state (session-only)
  const isAuthenticated = ref(false)
  const staffName = ref('')

  // Loaded plans
  const plans = ref([])
  const activePlanId = ref(null)

  // ============================================================
  // COMPUTED
  // ============================================================

  const activePlan = computed(() => {
    if (!activePlanId.value) return null
    return plans.value.find(p => p.id === activePlanId.value) || null
  })

  const planCount = computed(() => plans.value.length)

  const hasPendingPlans = computed(() => {
    return plans.value.some(p => p.status === 'pending_review')
  })

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  /**
   * Verify password and authenticate
   * @param {string} password - Password to verify
   * @param {string} name - Staff member's name
   * @returns {boolean} Whether authentication succeeded
   */
  function authenticate(password, name) {
    // Password is stored in config - check against it
    // For now, use a simple comparison (config will provide the hash/password)
    const configPassword = import.meta.env.VITE_WORKBENCH_PASSWORD || 'support2024'

    if (password === configPassword && name.trim()) {
      isAuthenticated.value = true
      staffName.value = name.trim()
      saveSession()
      return true
    }
    return false
  }

  /**
   * Log out of workbench
   */
  function logout() {
    isAuthenticated.value = false
    staffName.value = ''
    sessionStorage.removeItem(SESSION_KEY)
  }

  // ============================================================
  // PLAN MANAGEMENT
  // ============================================================

  /**
   * Import a plan from JSON file
   * @param {Object} data - Parsed JSON data from researcher export
   * @returns {Object} The imported plan with workbench metadata
   */
  function importPlan(data) {
    // Generate a workbench ID based on project name + timestamp
    const projectName = data.project_name || 'Untitled'
    const timestamp = data.exported_at || new Date().toISOString()
    const id = `${slugify(projectName)}-${timestamp.slice(0, 10)}`

    // Check if already imported
    const existing = plans.value.find(p => p.id === id)
    if (existing) {
      // Update existing plan
      existing.data = data
      existing.importedAt = new Date().toISOString()
      existing.importedBy = staffName.value
      savePlans()
      return existing
    }

    // Create new plan entry
    const plan = {
      id,
      projectName,
      status: 'pending_review',
      data,
      importedAt: new Date().toISOString(),
      importedBy: staffName.value,
      reviews: []
    }

    plans.value.unshift(plan)
    activePlanId.value = id
    savePlans()
    return plan
  }

  /**
   * Remove a plan from the workbench
   */
  function removePlan(planId) {
    plans.value = plans.value.filter(p => p.id !== planId)
    if (activePlanId.value === planId) {
      activePlanId.value = plans.value[0]?.id || null
    }
    savePlans()
  }

  /**
   * Set the active plan
   */
  function setActivePlan(planId) {
    if (plans.value.find(p => p.id === planId)) {
      activePlanId.value = planId
    }
  }

  /**
   * Update plan status
   */
  function updatePlanStatus(planId, status) {
    const plan = plans.value.find(p => p.id === planId)
    if (plan) {
      plan.status = status
      savePlans()
    }
  }

  /**
   * Add a review to a plan
   */
  function addReview(planId, review) {
    const plan = plans.value.find(p => p.id === planId)
    if (plan) {
      plan.reviews.push({
        ...review,
        reviewedAt: new Date().toISOString(),
        reviewedBy: staffName.value
      })
      savePlans()
    }
  }

  /**
   * Export a plan as JSON for round-trip back to researcher
   * Increments slate_version and adds to slate_history
   */
  function exportPlanJSON(planId, changeNote = 'Support review completed') {
    const plan = plans.value.find(p => p.id === planId)
    if (!plan) return null

    const data = plan.data
    const now = new Date().toISOString()

    // Increment version
    const newVersion = (data.slate_version || 1) + 1

    // Add to history
    const historyEntry = {
      version: newVersion,
      timestamp: now,
      actor: 'support',
      actor_name: staffName.value,
      change_note: changeNote,
      items: data.slate?.items?.map(item => item.id) || []
    }

    const history = data.slate_history || []
    history.push(historyEntry)

    // Build export data
    const exportData = {
      ...data,
      schema_version: '1.2',
      slate_version: newVersion,
      slate_history: history,
      last_reviewed_at: now,
      last_reviewed_by: staffName.value,
      review_status: plan.status
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Download the plan as JSON file
   */
  function downloadPlanJSON(planId, changeNote) {
    const json = exportPlanJSON(planId, changeNote)
    if (!json) return

    const plan = plans.value.find(p => p.id === planId)
    const filename = `${plan.id}-reviewed.json`

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ============================================================
  // PERSISTENCE
  // ============================================================

  function savePlans() {
    try {
      const data = {
        plans: plans.value,
        activePlanId: activePlanId.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save workbench plans:', e)
    }
  }

  function loadPlans() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        plans.value = data.plans || []
        activePlanId.value = data.activePlanId || null
      }
    } catch (e) {
      console.warn('Failed to load workbench plans:', e)
    }
  }

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        isAuthenticated: isAuthenticated.value,
        staffName: staffName.value
      }))
    } catch (e) {
      console.warn('Failed to save session:', e)
    }
  }

  function loadSession() {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        isAuthenticated.value = data.isAuthenticated || false
        staffName.value = data.staffName || ''
      }
    } catch (e) {
      console.warn('Failed to load session:', e)
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50)
  }

  // Initialize
  loadSession()
  loadPlans()

  // Auto-save plans on change
  watch(plans, savePlans, { deep: true })

  return {
    // Auth state
    isAuthenticated,
    staffName,

    // Plans
    plans,
    activePlanId,
    activePlan,
    planCount,
    hasPendingPlans,

    // Auth actions
    authenticate,
    logout,

    // Plan actions
    importPlan,
    removePlan,
    setActivePlan,
    updatePlanStatus,
    addReview,
    exportPlanJSON,
    downloadPlanJSON,

    // Persistence
    savePlans,
    loadPlans
  }
})
