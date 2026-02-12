import Handlebars from 'handlebars'
import { useSlateStore } from '@/stores/slateStore'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'

// Register additional helpers for export templates
// (currency, number, eq, gt, lt, date, pluralize already registered by useDMPGenerator)
if (!Handlebars.helpers.formatDate) {
  Handlebars.registerHelper('formatDate', function(value, format) {
    if (!value) return ''
    const date = new Date(value)

    // Simple format support
    if (format === 'YYYY-MM-DD') {
      return date.toISOString().slice(0, 10)
    } else if (format === 'h:mm A') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } else {
      // Default: "February 11, 2026"
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  })
}

/**
 * Composable for exporting slate data
 */
export function useExport() {
  const slateStore = useSlateStore()
  const configStore = useConfigStore()
  const sessionStore = useSessionStore()

  /**
   * Generate a safe filename from project name
   * Uses descriptive suffixes: .share.json (for IT), .draft.md (for researcher)
   */
  function generateFilename(projectName, format) {
    const date = new Date().toISOString().slice(0, 10)
    const safeName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const suffix = format === 'json' ? 'share.json' : 'draft.md'
    return `${safeName}-${date}.${suffix}`
  }

  /**
   * Build context for export templates
   */
  function buildExportContext(projectName, finalNotes, contact = null) {
    const tier = sessionStore.selectedTier
      ? configStore.tiersBySlug[sessionStore.selectedTier]
      : null

    return {
      projectName,
      finalNotes,
      exportedAt: new Date().toISOString(),
      tier,
      items: slateStore.slate.items.map(item => ({
        ...item,
        serviceName: configStore.servicesBySlug[item.service]?.name || item.service
      })),
      software: slateStore.slate.software,
      totals: {
        monthly: slateStore.totalMonthlyCost,
        annual: slateStore.totalAnnualCost
      },
      contact: contact || slateStore.slate.contact,
      institution: configStore.config?.meta?.institution
    }
  }

  /**
   * Export slate as JSON (for Support Workbench import)
   */
  function exportJSON(projectName, finalNotes, contact = null) {
    const context = buildExportContext(projectName, finalNotes, contact)

    const data = {
      schema_version: '1.2',
      exported_at: context.exportedAt,
      project_name: projectName,
      institution: context.institution?.name || 'Unknown',
      tier: context.tier?.slug || null,
      tier_name: context.tier?.name || null,
      final_notes: finalNotes || null,
      contact: contact || null,
      slate: {
        ...slateStore.slate,
        projectName,
        finalNotes
      },
      // Versioning fields for Support Workbench round-trip
      slate_version: 1,
      slate_history: [{
        version: 1,
        timestamp: context.exportedAt,
        actor: 'researcher',
        actor_name: contact?.name || null,
        change_note: 'Initial submission',
        items: slateStore.slate.items.map(item => item.id)
      }],
      totals: context.totals
    }

    const json = JSON.stringify(data, null, 2)
    downloadFile(json, generateFilename(projectName, 'json'), 'application/json')
  }

  /**
   * Export slate as Markdown (human-readable)
   */
  function exportMarkdown(projectName, finalNotes, contact = null) {
    const templateSource = configStore.config?.exportTemplates?.['slate-export']

    if (!templateSource) {
      console.error('Export template not found: slate-export')
      // Fallback to basic format
      const context = buildExportContext(projectName, finalNotes, contact)
      const markdown = generateFallbackMarkdown(context)
      downloadFile(markdown, generateFilename(projectName, 'md'), 'text/markdown')
      return
    }

    const template = Handlebars.compile(templateSource)
    const context = buildExportContext(projectName, finalNotes, contact)
    const markdown = template(context)
    downloadFile(markdown, generateFilename(projectName, 'md'), 'text/markdown')
  }

  /**
   * Generate basic markdown if template is missing
   */
  function generateFallbackMarkdown(context) {
    let md = `# Research Computing Request: ${context.projectName}\n\n`
    md += `**Exported:** ${new Date(context.exportedAt).toLocaleDateString()}\n\n`

    if (context.contact) {
      md += `**Contact:** `
      const parts = []
      if (context.contact.name) parts.push(context.contact.name)
      if (context.contact.department) parts.push(context.contact.department)
      if (context.contact.email) parts.push(`<${context.contact.email}>`)
      md += parts.join(', ') + '\n\n'
    }

    if (context.tier) {
      md += `**Classification:** ${context.tier.name}\n\n`
    }

    md += `## Requested Services\n\n`

    for (const item of context.items) {
      md += `### ${item.serviceName}\n`
      md += `- Quantity: ${item.quantity} ${item.unit}\n`
      md += `- Annual Cost: $${item.annualEstimate?.toLocaleString() || 0}\n`
      if (item.notes) {
        md += `- Notes: ${item.notes}\n`
      }
      md += '\n'
    }

    md += `## Cost Summary\n\n`
    md += `- Monthly: $${context.totals.monthly?.toLocaleString() || 0}\n`
    md += `- Annual: $${context.totals.annual?.toLocaleString() || 0}\n\n`

    if (context.finalNotes) {
      md += `## Additional Notes\n\n${context.finalNotes}\n\n`
    }

    md += `---\n\n*Generated by OpenDataPlanner*\n`

    return md
  }

  /**
   * Trigger file download
   */
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    generateFilename,
    buildExportContext,
    exportJSON,
    exportMarkdown
  }
}
