import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useConfigStore } from './configStore'

const STORAGE_KEY = 'odp-slate'

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

/**
 * SlateStore - Manages the service slate (proposed services awaiting approval)
 *
 * The slate is the unifying data model for both the wizard and explore paths.
 * Users add services via calculators or direct selection, then submit to IT.
 *
 * Persists to sessionStorage (cleared on tab close, unlike localStorage).
 */
export const useSlateStore = defineStore('slate', () => {
  const configStore = useConfigStore()

  // Core slate state
  const slate = ref(createEmptySlate())

  /**
   * Create a fresh empty slate
   */
  function createEmptySlate() {
    return {
      status: 'draft', // 'draft' | 'submitted'
      items: [],       // SlateItem[]
      software: [],    // SoftwareSelection[]

      // Export metadata
      projectName: null,
      finalNotes: null,

      // Submission details (populated when submitting)
      fundingSource: null,
      contact: null,
      timeline: null,
      submittedAt: null,
      requestId: null
    }
  }

  // ============================================================
  // COMPUTED PROPERTIES
  // ============================================================

  /**
   * Total number of items in slate
   */
  const itemCount = computed(() => slate.value.items.length)

  /**
   * Total number of software selections
   */
  const softwareCount = computed(() => slate.value.software.length)

  /**
   * Whether slate has any items
   */
  const hasItems = computed(() => slate.value.items.length > 0 || slate.value.software.length > 0)

  /**
   * Whether slate is empty
   */
  const isEmpty = computed(() => !hasItems.value)

  /**
   * Whether slate has been submitted
   */
  const isSubmitted = computed(() => slate.value.status === 'submitted')

  /**
   * Total annual cost of all items
   */
  const totalAnnualCost = computed(() => {
    return slate.value.items.reduce((sum, item) => sum + (item.annualEstimate || 0), 0)
  })

  /**
   * Total monthly cost of all items
   */
  const totalMonthlyCost = computed(() => {
    return slate.value.items.reduce((sum, item) => sum + (item.monthlyEstimate || 0), 0)
  })

  /**
   * Get all unique service slugs in slate
   */
  const serviceSlugs = computed(() => {
    return [...new Set(slate.value.items.map(item => item.service))]
  })

  /**
   * Get items grouped by category
   */
  const itemsByCategory = computed(() => {
    const grouped = {}
    for (const item of slate.value.items) {
      const service = configStore.servicesBySlug[item.service]
      const category = service?.category || 'other'
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(item)
    }
    return grouped
  })

  // ============================================================
  // COST CALCULATION
  // ============================================================

  /**
   * Calculate costs for a service at a given quantity
   * Returns { monthly, annual, breakdown }
   */
  function calculateItemCosts(serviceSlug, quantity) {
    const service = configStore.servicesBySlug[serviceSlug]
    if (!service || !service.cost_model) {
      return { monthly: 0, annual: 0, breakdown: null }
    }

    const costModel = service.cost_model
    let monthlyCost = 0
    let breakdown = []

    if (costModel.type === 'unit') {
      // Simple unit pricing: price_per_unit * quantity
      const unitPrice = costModel.price_per_unit || 0
      monthlyCost = unitPrice * quantity
      breakdown.push({
        label: `${quantity} ${costModel.unit_label || 'units'} @ $${unitPrice}/${costModel.unit_label || 'unit'}`,
        amount: monthlyCost
      })

    } else if (costModel.type === 'tiered') {
      // Tiered pricing: different rates for different quantities
      let remaining = quantity
      for (const tier of costModel.tiers || []) {
        if (remaining <= 0) break

        const tierMax = tier.up_to === 'unlimited' ? Infinity : tier.up_to
        const tierQuantity = Math.min(remaining, tierMax - (tier.from || 0))
        const tierCost = tierQuantity * (tier.price_per_unit || 0)

        monthlyCost += tierCost
        if (tierCost > 0) {
          breakdown.push({
            label: tier.label || `${tierQuantity} units @ $${tier.price_per_unit}`,
            amount: tierCost
          })
        }
        remaining -= tierQuantity
      }

    } else if (costModel.type === 'consultation') {
      // Consultation-based: no automatic pricing
      monthlyCost = 0
      breakdown.push({
        label: 'Pricing determined during consultation',
        amount: null
      })
    }

    // Apply auto-subsidies if configured
    if (service.subsidies?.auto_apply) {
      const subsidy = service.subsidies
      let discount = 0

      if (subsidy.free_units && quantity > 0) {
        // Free units subsidy (e.g., first 10,000 SU free)
        const freeUnits = Math.min(quantity, subsidy.free_units)
        const unitPrice = costModel.price_per_unit || 0
        discount = freeUnits * unitPrice
        breakdown.push({
          label: `Free allocation (${freeUnits} ${costModel.unit_label || 'units'})`,
          amount: -discount
        })
      } else if (subsidy.discount_type === 'percent') {
        discount = monthlyCost * (subsidy.discount_value / 100)
        breakdown.push({
          label: `${subsidy.discount_value}% subsidy`,
          amount: -discount
        })
      } else if (subsidy.discount_type === 'fixed') {
        discount = subsidy.discount_value
        breakdown.push({
          label: 'Fixed subsidy',
          amount: -discount
        })
      }

      monthlyCost = Math.max(0, monthlyCost - discount)
    }

    return {
      monthly: monthlyCost,
      annual: monthlyCost * 12,
      breakdown
    }
  }

  // ============================================================
  // ITEM MANAGEMENT
  // ============================================================

  /**
   * Add an item to the slate
   * If the same service already exists, prompts to merge or add separately
   */
  function addItem(item) {
    // Find existing item for same service
    const existing = slate.value.items.find(i => i.service === item.service)

    if (existing) {
      // Merge: add quantities together
      existing.quantity += item.quantity
      const costs = calculateItemCosts(existing.service, existing.quantity)
      existing.monthlyEstimate = costs.monthly
      existing.annualEstimate = costs.annual
      existing.calculatorInputs = item.calculatorInputs // Update to latest inputs
    } else {
      // Add new item
      const costs = calculateItemCosts(item.service, item.quantity)
      slate.value.items.push({
        id: generateUUID(),
        service: item.service,
        quantity: item.quantity,
        unit: item.unit || getServiceUnit(item.service),
        monthlyEstimate: costs.monthly,
        annualEstimate: costs.annual,
        fromCalculator: item.fromCalculator || null,
        calculatorInputs: item.calculatorInputs || null,
        notes: null,
        addedAt: new Date().toISOString()
      })
    }
  }

  /**
   * Add item without merging (always creates new entry)
   */
  function addItemSeparate(item) {
    const costs = calculateItemCosts(item.service, item.quantity)
    slate.value.items.push({
      id: generateUUID(),
      service: item.service,
      quantity: item.quantity,
      unit: item.unit || getServiceUnit(item.service),
      monthlyEstimate: costs.monthly,
      annualEstimate: costs.annual,
      fromCalculator: item.fromCalculator || null,
      calculatorInputs: item.calculatorInputs || null,
      notes: null,
      addedAt: new Date().toISOString()
    })
  }

  /**
   * Remove an item by ID
   */
  function removeItem(itemId) {
    slate.value.items = slate.value.items.filter(item => item.id !== itemId)
  }

  /**
   * Update an item's quantity and recalculate costs
   */
  function updateQuantity(itemId, quantity) {
    const item = slate.value.items.find(i => i.id === itemId)
    if (item) {
      item.quantity = quantity
      const costs = calculateItemCosts(item.service, quantity)
      item.monthlyEstimate = costs.monthly
      item.annualEstimate = costs.annual
    }
  }

  /**
   * Update an item's notes
   */
  function updateItemNotes(itemId, notes) {
    const item = slate.value.items.find(i => i.id === itemId)
    if (item) {
      item.notes = notes || null
    }
  }

  /**
   * Get the unit label for a service
   */
  function getServiceUnit(serviceSlug) {
    const service = configStore.servicesBySlug[serviceSlug]
    return service?.cost_model?.unit_label || 'units'
  }

  // ============================================================
  // SOFTWARE MANAGEMENT
  // ============================================================

  /**
   * Add software to slate
   */
  function addSoftware(softwareItem) {
    const existing = slate.value.software.find(s => s.id === softwareItem.id)
    if (!existing) {
      slate.value.software.push({
        id: softwareItem.id,
        licenseModel: softwareItem.licenseModel || 'campus',
        costToUser: softwareItem.costToUser ?? null,
        costPeriod: softwareItem.costPeriod || null,
        note: softwareItem.note || null
      })
    }
  }

  /**
   * Remove software from slate
   */
  function removeSoftware(softwareId) {
    slate.value.software = slate.value.software.filter(s => s.id !== softwareId)
  }

  // ============================================================
  // SLATE LIFECYCLE
  // ============================================================

  /**
   * Clear all items and reset slate to draft
   */
  function wipeSlate() {
    slate.value = createEmptySlate()
  }

  /**
   * Set submission details
   */
  function setSubmissionDetails({ fundingSource, contact, timeline }) {
    slate.value.fundingSource = fundingSource
    slate.value.contact = contact
    slate.value.timeline = timeline
  }

  /**
   * Set project name for export
   */
  function setProjectName(name) {
    slate.value.projectName = name || null
  }

  /**
   * Set final notes for export
   */
  function setFinalNotes(notes) {
    slate.value.finalNotes = notes || null
  }

  /**
   * Mark slate as submitted
   */
  function markSubmitted(requestId) {
    slate.value.status = 'submitted'
    slate.value.submittedAt = new Date().toISOString()
    slate.value.requestId = requestId
  }

  /**
   * Reset to draft (for editing after viewing submitted state)
   */
  function resetToDraft() {
    slate.value.status = 'draft'
    slate.value.submittedAt = null
    slate.value.requestId = null
  }

  // ============================================================
  // PERSISTENCE
  // ============================================================

  /**
   * Save slate to sessionStorage
   */
  function saveToSessionStorage() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slate.value))
    } catch (e) {
      console.warn('Failed to save slate to sessionStorage:', e)
    }
  }

  /**
   * Load slate from sessionStorage
   */
  function loadFromSessionStorage() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        slate.value = { ...createEmptySlate(), ...parsed }
        return true
      }
    } catch (e) {
      console.warn('Failed to load slate from sessionStorage:', e)
    }
    return false
  }

  /**
   * Export slate as JSON for submission
   */
  function exportSlate(includeMetadata = true) {
    if (!includeMetadata) {
      return JSON.stringify(slate.value, null, 2)
    }

    return JSON.stringify({
      export_version: '1.0',
      exported_at: new Date().toISOString(),
      institution: configStore.config?.meta?.institution?.name || 'Unknown',
      slate: slate.value
    }, null, 2)
  }

  // Auto-save on changes
  watch(slate, saveToSessionStorage, { deep: true })

  // Load from storage on init
  loadFromSessionStorage()

  return {
    // State
    slate,

    // Computed
    itemCount,
    softwareCount,
    hasItems,
    isEmpty,
    isSubmitted,
    totalAnnualCost,
    totalMonthlyCost,
    serviceSlugs,
    itemsByCategory,

    // Cost calculation
    calculateItemCosts,

    // Item management
    addItem,
    addItemSeparate,
    removeItem,
    updateQuantity,
    updateItemNotes,
    getServiceUnit,

    // Software management
    addSoftware,
    removeSoftware,

    // Lifecycle
    wipeSlate,
    setSubmissionDetails,
    setProjectName,
    setFinalNotes,
    markSubmitted,
    resetToDraft,

    // Persistence
    saveToSessionStorage,
    loadFromSessionStorage,
    exportSlate
  }
})
