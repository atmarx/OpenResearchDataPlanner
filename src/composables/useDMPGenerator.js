import { computed } from 'vue'
import Handlebars from 'handlebars'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { computeServiceLineItem } from '@/lib/pricing.js'
import { flagLabel } from '@/lib/classificationFlags.js'

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

    // Cost via the shared pricing engine (src/lib/pricing.js): one line-item
    // builder shared by the DMP, the slate, and the wizard, so the exported
    // grant doc agrees with the slate the researcher just saw. It folds in the
    // auto subsidies, the opt-in (user-selected) subsidy, and the archive tail
    // — which honours free floors because it prices through the same engine.
    const li = computeServiceLineItem(serviceConfig, service, {
      grantMonths,
      retentionYears,
      resolveService: (slug) => configStore.servicesBySlug[slug]
    })

    return {
      service: {
        slug: serviceSlug,
        name: serviceConfig?.name,
        description: serviceConfig?.description,
        estimate: service.estimate,
        unit: serviceConfig?.cost_model?.unit,
        unit_label: serviceConfig?.cost_model?.unit_label,
        free_units: li.freeUnits,
        billable: li.billable,
        monthly_cost: li.monthly,
        total_cost: li.grant,
        notes: service.notes || mapping?.notes || null
      },
      archive: service.archive_estimate ? {
        estimate: service.archive_estimate,
        monthly_cost: li.archive?.monthly || 0,
        annual_cost: li.archive?.annual || 0,
        total_cost: li.archive?.total || 0,
        years: li.archiveYears
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

    // Classification flags from the questionnaire (classifyTier.js), exposed two
    // ways: `flags` as a map for conditional template sections ({{#if flags.phi}})
    // and `classification.flags`/`labels` for iteration/display. This is how the
    // DMP expresses the intent behind the tier (HIPAA, PHI, export control, and
    // FAIR/open-data once that flag is added) — not just the tier slug. Templates
    // opt in; an absent flag is simply falsy.
    const flags = sessionStore.classificationFlags || []

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
      flags: Object.fromEntries(flags.map(f => [f, true])),
      classification: {
        flags,
        labels: flags.map(flagLabel)
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
    const classificationFlags = sessionStore.classificationFlags || []
    if (classificationFlags.length > 0) {
      sections.push(`**Compliance considerations:** ${classificationFlags.map(flagLabel).join(', ')}`)
    }
    const gp = sessionStore.session.grant_period
    const grantPeriodStr = gp.start_date && gp.end_date
      ? `${gp.start_date} to ${gp.end_date}`
      : `${sessionStore.grantMonths} months (${(sessionStore.grantMonths / 12).toFixed(1)} years)`
    sections.push(`**Grant Period:** ${grantPeriodStr}`)
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
    sections.push(`*This Data Management Plan was generated using Research Data Planner on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.*`)
    sections.push('')
    sections.push(`*Template version: ${configStore.config?.meta?.version || 'unknown'}*`)
    sections.push('')
    sections.push('> **Draft — requires review before submission.** This document is a starting point generated from your inputs. Review and customize it with your institution\'s research office or grants administrator before submitting to any funding agency. It does not guarantee compliance with funder requirements.')

    const costDisclaimer = configStore.config?.meta?.cost_disclaimer?.long
    if (costDisclaimer) {
      sections.push('')
      sections.push('> **Cost estimate, not a quote.** ' + costDisclaimer)
    }

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
