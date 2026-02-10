import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Computed lookups for quick access
  const tiersBySlug = computed(() => {
    if (!config.value?.tiers) return {}
    return Object.fromEntries(
      config.value.tiers.map(t => [t.slug, t])
    )
  })

  const categoriesBySlug = computed(() => {
    if (!config.value?.categories) return {}
    return Object.fromEntries(
      config.value.categories.map(c => [c.slug, c])
    )
  })

  const servicesBySlug = computed(() => {
    if (!config.value?.services) return {}
    return Object.fromEntries(
      config.value.services.map(s => [s.slug, s])
    )
  })

  const bundlesBySlug = computed(() => {
    if (!config.value?.bundles) return {}
    return Object.fromEntries(
      config.value.bundles.map(b => [b.slug, b])
    )
  })

  // Mapping lookup: "service:tier" -> mapping object
  const mappingLookup = computed(() => {
    if (!config.value?.mappings) return {}
    return Object.fromEntries(
      config.value.mappings.map(m => [`${m.service}:${m.tier}`, m])
    )
  })

  // Services available for each tier
  const servicesForTier = computed(() => {
    if (!config.value?.mappings) return {}
    const result = {}
    for (const mapping of config.value.mappings) {
      if (!result[mapping.tier]) result[mapping.tier] = []
      result[mapping.tier].push(mapping.service)
    }
    return result
  })

  // Retention schedules by slug
  const retentionBySlug = computed(() => {
    if (!config.value?.retention?.schedules) return {}
    return Object.fromEntries(
      config.value.retention.schedules.map(r => [r.slug, r])
    )
  })

  // Get mapping for a service-tier combination
  function getMapping(serviceSlug, tierSlug) {
    return mappingLookup.value[`${serviceSlug}:${tierSlug}`] || null
  }

  // Check if a service is available for a tier
  function isServiceAvailableForTier(serviceSlug, tierSlug) {
    return !!getMapping(serviceSlug, tierSlug)
  }

  // Get services available for a tier (full service objects)
  function getServicesForTier(tierSlug) {
    const slugs = servicesForTier.value[tierSlug] || []
    return slugs.map(slug => servicesBySlug.value[slug]).filter(Boolean)
  }

  // Load configuration from JSON file
  async function loadConfig() {
    try {
      loading.value = true
      error.value = null

      const response = await fetch('/config.json')
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status} ${response.statusText}`)
      }

      config.value = await response.json()
    } catch (e) {
      error.value = e.message
      console.error('Failed to load configuration:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    config,
    loading,
    error,

    // Computed lookups
    tiersBySlug,
    categoriesBySlug,
    servicesBySlug,
    bundlesBySlug,
    mappingLookup,
    servicesForTier,
    retentionBySlug,

    // Methods
    loadConfig,
    getMapping,
    isServiceAvailableForTier,
    getServicesForTier
  }
})
