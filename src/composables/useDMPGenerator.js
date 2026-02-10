import { computed } from 'vue'
import Handlebars from 'handlebars'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'

/**
 * Register Handlebars helpers
 */
function registerHelpers() {
  // Currency formatting helper
  Handlebars.registerHelper('currency', function(value) {
    if (value == null || isNaN(value)) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  })

  // Number formatting helper
  Handlebars.registerHelper('number', function(value) {
    if (value == null || isNaN(value)) return '0'
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(value)
  })

  // Equality helper
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b
  })

  // Greater than helper
  Handlebars.registerHelper('gt', function(a, b) {
    return a > b
  })

  // Less than helper
  Handlebars.registerHelper('lt', function(a, b) {
    return a < b
  })

  // Date formatting helper
  Handlebars.registerHelper('date', function(value) {
    if (!value) return ''
    const date = new Date(value)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })

  // Pluralize helper
  Handlebars.registerHelper('pluralize', function(count, singular, plural) {
    return count === 1 ? singular : (plural || singular + 's')
  })
}

// Register helpers once
registerHelpers()

/**
 * Composable for generating DMP content
 */
export function useDMPGenerator() {
  const configStore = useConfigStore()
  const sessionStore = useSessionStore()

  /**
   * Build context for a single service
   */
  function buildServiceContext(serviceSlug) {
    const service = sessionStore.session.selected_services.find(
      s => s.service_slug === serviceSlug
    )
    if (!service) return null

    const serviceConfig = configStore.servicesBySlug[serviceSlug]
    const tierSlug = sessionStore.selectedTier
    const tierConfig = configStore.tiersBySlug[tierSlug]
    const mapping = configStore.getMapping(serviceSlug, tierSlug)
    const grantMonths = sessionStore.grantMonths
    const retentionYears = sessionStore.session.retention.longest_years

    // Calculate costs
    let monthlyCost = 0
    if (serviceConfig?.cost_model?.type === 'unit') {
      monthlyCost = (service.estimate || 0) * serviceConfig.cost_model.price

      // Apply auto-subsidies
      const autoSubsidy = serviceConfig.subsidies?.find(sub => sub.auto_apply)
      if (autoSubsidy?.discount_type === 'free_units') {
        const billable = Math.max(0, (service.estimate || 0) - autoSubsidy.discount_value)
        monthlyCost = billable * serviceConfig.cost_model.price
      }
    } else if (serviceConfig?.cost_model?.type === 'tiered') {
      const estimate = service.estimate || 0
      for (const tier of serviceConfig.cost_model.tiers) {
        if (!tier.up_to || estimate <= tier.up_to) {
          monthlyCost = estimate * tier.price
          break
        }
      }
    }

    // Apply opt-in subsidy
    if (service.use_subsidy) {
      const subsidy = serviceConfig.subsidies?.find(sub => sub.slug === service.use_subsidy)
      if (subsidy?.discount_type === 'percent') {
        monthlyCost = monthlyCost * (1 - subsidy.discount_value / 100)
      }
    }

    const totalCost = monthlyCost * grantMonths

    // Archive calculations
    const grantYears = grantMonths / 12
    const archiveYears = Math.max(0, retentionYears - grantYears)
    let archiveEstimate = service.archive_estimate
    let archiveMonthlyCost = 0
    let archiveAnnualCost = 0
    let archiveTotalCost = 0

    if (serviceConfig?.archive_option?.service_slug && archiveEstimate) {
      const archiveConfig = configStore.servicesBySlug[serviceConfig.archive_option.service_slug]
      if (archiveConfig?.cost_model?.price) {
        archiveMonthlyCost = archiveEstimate * archiveConfig.cost_model.price
        archiveAnnualCost = archiveMonthlyCost * 12
        archiveTotalCost = archiveAnnualCost * archiveYears
      }
    }

    return {
      service: {
        slug: serviceSlug,
        name: serviceConfig?.name,
        description: serviceConfig?.description,
        estimate: service.estimate,
        unit: serviceConfig?.cost_model?.unit,
        unit_label: serviceConfig?.cost_model?.unit_label,
        monthly_cost: monthlyCost,
        total_cost: totalCost,
        notes: service.notes || mapping?.notes || null
      },
      archive: archiveEstimate ? {
        estimate: archiveEstimate,
        monthly_cost: archiveMonthlyCost,
        annual_cost: archiveAnnualCost,
        total_cost: archiveTotalCost,
        years: archiveYears
      } : null,
      tier: {
        slug: tierSlug,
        name: tierConfig?.name,
        description: tierConfig?.description
      },
      retention: retentionYears > 0 ? {
        years: retentionYears,
        name: `${retentionYears}-year retention`
      } : null,
      mapping: mapping ? {
        approval: mapping.approval,
        approval_contact: mapping.approval_contact,
        notes: mapping.notes
      } : null
    }
  }

  /**
   * Build full context for all templates
   */
  function buildFullContext() {
    const grantMonths = sessionStore.grantMonths
    const startDate = sessionStore.session.grant_period.start_date
    const endDate = sessionStore.session.grant_period.end_date

    return {
      institution: {
        name: configStore.config?.meta?.institution?.name || 'Institution',
        short_name: configStore.config?.meta?.institution?.short_name || 'Institution'
      },
      grant: {
        start_date: startDate,
        end_date: endDate,
        months: grantMonths,
        years: grantMonths / 12
      },
      generated: {
        date: new Date().toISOString(),
        version: configStore.config?.meta?.version
      }
    }
  }

  /**
   * Render a single DMP template for a service
   */
  function renderServiceDMP(serviceSlug) {
    const mapping = configStore.getMapping(serviceSlug, sessionStore.selectedTier)
    if (!mapping?.dmp_template) return null

    const templateKey = mapping.dmp_template.replace(/\.md$/, '')
    const templateSource = configStore.config?.dmpTemplates?.[templateKey]
    if (!templateSource) {
      console.warn(`DMP template not found: ${templateKey}`)
      return null
    }

    try {
      const template = Handlebars.compile(templateSource)
      const serviceContext = buildServiceContext(serviceSlug)
      const fullContext = buildFullContext()

      const context = {
        ...fullContext,
        ...serviceContext
      }

      return template(context)
    } catch (e) {
      console.error(`Error rendering DMP template for ${serviceSlug}:`, e)
      return `<!-- Error rendering template for ${serviceSlug}: ${e.message} -->`
    }
  }

  /**
   * Computed: Full DMP document combining all service sections
   */
  const dmpContent = computed(() => {
    const services = sessionStore.session.selected_services
    const tierConfig = configStore.tiersBySlug[sessionStore.selectedTier]
    const institution = configStore.config?.meta?.institution?.name || 'Institution'

    const sections = []

    // Header
    sections.push(`# Data Management Plan`)
    sections.push('')
    sections.push(`**Project:** Research Data Infrastructure`)
    sections.push(`**Institution:** ${institution}`)
    sections.push(`**Data Classification:** ${tierConfig?.name || 'Unknown'}`)
    sections.push(`**Grant Period:** ${sessionStore.session.grant_period.start_date} to ${sessionStore.session.grant_period.end_date}`)
    if (sessionStore.session.retention.longest_years > 0) {
      sections.push(`**Data Retention:** ${sessionStore.session.retention.longest_years} years`)
    }
    sections.push('')
    sections.push('---')
    sections.push('')

    // Render each service's DMP section
    for (const service of services) {
      const rendered = renderServiceDMP(service.service_slug)
      if (rendered) {
        sections.push(rendered)
        sections.push('')
        sections.push('---')
        sections.push('')
      }
    }

    // Footer
    sections.push('## Document Information')
    sections.push('')
    sections.push(`*This Data Management Plan was generated using OpenResearchDataPlanner on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.*`)
    sections.push('')
    sections.push(`*Template version: ${configStore.config?.meta?.version || 'unknown'}*`)

    return sections.join('\n')
  })

  /**
   * Get services that have DMP templates
   */
  const servicesWithTemplates = computed(() => {
    return sessionStore.session.selected_services.filter(s => {
      const mapping = configStore.getMapping(s.service_slug, sessionStore.selectedTier)
      return mapping?.dmp_template
    })
  })

  /**
   * Get services without DMP templates
   */
  const servicesWithoutTemplates = computed(() => {
    return sessionStore.session.selected_services.filter(s => {
      const mapping = configStore.getMapping(s.service_slug, sessionStore.selectedTier)
      return !mapping?.dmp_template
    })
  })

  return {
    dmpContent,
    servicesWithTemplates,
    servicesWithoutTemplates,
    renderServiceDMP,
    buildServiceContext,
    buildFullContext
  }
}
