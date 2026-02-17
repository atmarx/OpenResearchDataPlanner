<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useWizard } from '@/composables/useWizard'
import { useDMPGenerator } from '@/composables/useDMPGenerator'
import { Download, FileText, RefreshCw, ExternalLink, CheckCircle, FileCode, Copy, Check } from 'lucide-vue-next'
import PageFeedback from '@/components/feedback/PageFeedback.vue'

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()
const wizard = useWizard()
const dmpGenerator = useDMPGenerator()

// Active tab
const activeTab = ref('budget')

// Copy state
const copied = ref(false)

// Calculate costs (simplified version - full version in composable)
const costBreakdown = computed(() => {
  const services = sessionStore.session.selected_services
  const grantMonths = sessionStore.grantMonths
  const retentionYears = sessionStore.session.retention.longest_years
  const grantYears = grantMonths / 12
  const archiveYears = Math.max(0, retentionYears - grantYears)

  let monthlyTotal = 0
  let grantTotal = 0
  let archiveTotal = 0

  const byService = services.map(s => {
    const config = configStore.servicesBySlug[s.service_slug]
    if (!config) return null

    // Calculate monthly cost
    let monthly = 0
    if (config.cost_model.type === 'unit') {
      monthly = (s.estimate || 0) * config.cost_model.price

      // Apply auto-subsidies
      const autoSubsidy = config.subsidies?.find(sub => sub.auto_apply)
      if (autoSubsidy && autoSubsidy.discount_type === 'free_units') {
        const billable = Math.max(0, (s.estimate || 0) - autoSubsidy.discount_value)
        monthly = billable * config.cost_model.price
      }
    } else if (config.cost_model.type === 'tiered') {
      // Simplified tiered calculation
      const estimate = s.estimate || 0
      for (const tier of config.cost_model.tiers) {
        if (!tier.up_to || estimate <= tier.up_to) {
          monthly = estimate * tier.price
          break
        }
      }
    }

    // Apply opt-in subsidy
    if (s.use_subsidy) {
      const subsidy = config.subsidies?.find(sub => sub.slug === s.use_subsidy)
      if (subsidy?.discount_type === 'percent') {
        monthly = monthly * (1 - subsidy.discount_value / 100)
      }
    }

    const grantCost = monthly * grantMonths

    // Archive cost
    let archiveCost = 0
    if (config.archive_option?.service_slug && s.archive_estimate) {
      const archiveConfig = configStore.servicesBySlug[config.archive_option.service_slug]
      if (archiveConfig?.cost_model?.price) {
        const annualArchive = s.archive_estimate * archiveConfig.cost_model.price * 12
        archiveCost = annualArchive * archiveYears
      }
    }

    monthlyTotal += monthly
    grantTotal += grantCost
    archiveTotal += archiveCost

    return {
      service_slug: s.service_slug,
      name: config.name,
      monthly,
      grant: grantCost,
      archive: archiveCost
    }
  }).filter(Boolean)

  return {
    byService,
    monthlyTotal,
    grantTotal,
    archiveTotal,
    grandTotal: grantTotal + archiveTotal,
    grantMonths,
    archiveYears
  }
})

// Rendered DMP HTML
const dmpHtml = computed(() => {
  return marked(dmpGenerator.dmpContent.value)
})

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Export session as JSON
function exportJSON() {
  const data = sessionStore.exportSession(
    configStore.config?.meta?.version,
    configStore.config?.meta?.institution?.name
  )
  downloadFile(data, 'openresearchdataplanner-session.json', 'application/json')
}

// Export budget as markdown
function exportBudget() {
  const lines = [
    '# Research Data Budget Estimate',
    '',
    `**Generated:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    `**Institution:** ${configStore.config?.meta?.institution?.name}`,
    `**Template Version:** ${configStore.config?.meta?.version}`,
    '',
    '## Project Parameters',
    '',
    `- **Data Classification:** ${configStore.tiersBySlug[sessionStore.selectedTier]?.name}`,
    `- **Grant Period:** ${sessionStore.session.grant_period.start_date} to ${sessionStore.session.grant_period.end_date} (${sessionStore.grantMonths} months)`,
    `- **Retention Requirement:** ${sessionStore.session.retention.longest_years} years`,
    '',
    '## Cost Summary',
    '',
    '| Service | Monthly | Grant Period | Archive |',
    '|---------|---------|--------------|---------|'
  ]

  for (const service of costBreakdown.value.byService) {
    lines.push(`| ${service.name} | ${formatCurrency(service.monthly)} | ${formatCurrency(service.grant)} | ${service.archive > 0 ? formatCurrency(service.archive) : '—'} |`)
  }

  lines.push(`| **Total** | **${formatCurrency(costBreakdown.value.monthlyTotal)}** | **${formatCurrency(costBreakdown.value.grantTotal)}** | **${formatCurrency(costBreakdown.value.archiveTotal)}** |`)
  lines.push('')
  lines.push(`**Grand Total (Grant + Archive):** ${formatCurrency(costBreakdown.value.grandTotal)}`)
  lines.push('')
  lines.push('---')
  lines.push('*This estimate was generated using OpenResearchDataPlanner. Actual costs may vary.*')

  downloadFile(lines.join('\n'), 'budget-estimate.md', 'text/markdown')
}

// Export DMP as markdown
function exportDMP() {
  downloadFile(dmpGenerator.dmpContent.value, 'data-management-plan.md', 'text/markdown')
}

// Copy DMP to clipboard
async function copyDMP() {
  try {
    await navigator.clipboard.writeText(dmpGenerator.dmpContent.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

// Download helper
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

// Start over
function startOver() {
  if (confirm('This will clear all your selections. Are you sure?')) {
    sessionStore.reset()
  }
}
</script>

<template>
  <div class="p-8">
    <div class="mb-6 flex items-start justify-between">
      <div>
        <h2
          class="text-2xl font-bold mb-2 flex items-center gap-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          <CheckCircle class="w-7 h-7 text-green-500" />
          Your Estimate is Ready
        </h2>
        <p :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
          Review your cost estimates and data management plan below.
        </p>
      </div>
    </div>

    <!-- Tab navigation -->
    <div
      class="border-b mb-6"
      :class="preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-200'"
    >
      <nav class="flex gap-4" aria-label="Results tabs">
        <button
          @click="activeTab = 'budget'"
          class="py-3 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="[
            activeTab === 'budget'
              ? 'border-blue-500 text-blue-500'
              : preferencesStore.darkMode
                ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Budget Estimate
        </button>
        <button
          @click="activeTab = 'dmp'"
          class="py-3 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="[
            activeTab === 'dmp'
              ? 'border-blue-500 text-blue-500'
              : preferencesStore.darkMode
                ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Data Management Plan
        </button>
      </nav>
    </div>

    <!-- Budget Tab -->
    <div v-show="activeTab === 'budget'">
      <!-- Summary cards -->
      <div class="grid gap-4 md:grid-cols-3 mb-8">
        <div
          class="rounded-lg p-4"
          :class="preferencesStore.darkMode ? 'bg-blue-900/30' : 'bg-blue-50'"
        >
          <p class="text-sm text-blue-500 font-medium">Monthly Cost</p>
          <p
            class="text-2xl font-bold"
            :class="preferencesStore.darkMode ? 'text-blue-200' : 'text-blue-900'"
          >
            {{ formatCurrency(costBreakdown.monthlyTotal) }}
          </p>
        </div>
        <div
          class="rounded-lg p-4"
          :class="preferencesStore.darkMode ? 'bg-green-900/30' : 'bg-green-50'"
        >
          <p class="text-sm text-green-500 font-medium">Grant Period ({{ costBreakdown.grantMonths }} mo)</p>
          <p
            class="text-2xl font-bold"
            :class="preferencesStore.darkMode ? 'text-green-200' : 'text-green-900'"
          >
            {{ formatCurrency(costBreakdown.grantTotal) }}
          </p>
        </div>
        <div
          class="rounded-lg p-4"
          :class="preferencesStore.darkMode ? 'bg-purple-900/30' : 'bg-purple-50'"
        >
          <p class="text-sm text-purple-500 font-medium">
            Archive ({{ costBreakdown.archiveYears.toFixed(1) }} yr)
          </p>
          <p
            class="text-2xl font-bold"
            :class="preferencesStore.darkMode ? 'text-purple-200' : 'text-purple-900'"
          >
            {{ formatCurrency(costBreakdown.archiveTotal) }}
          </p>
        </div>
      </div>

      <!-- Grand total -->
      <div class="bg-gray-900 text-white rounded-lg p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400">Grand Total (Grant + Archive)</p>
            <p class="text-3xl font-bold">
              {{ formatCurrency(costBreakdown.grandTotal) }}
            </p>
          </div>
          <div class="text-right text-sm text-gray-400">
            <p>{{ configStore.tiersBySlug[sessionStore.selectedTier]?.name }}</p>
            <p>{{ sessionStore.grantMonths }} month grant</p>
            <p>{{ sessionStore.session.retention.longest_years }} year retention</p>
          </div>
        </div>
      </div>

      <!-- Cost breakdown table -->
      <div class="mb-8">
        <h3
          class="text-lg font-semibold mb-4"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >Cost Breakdown by Service</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr
                class="border-b"
                :class="preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-200'"
              >
                <th
                  class="text-left py-3 px-4 font-medium"
                  :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                >Service</th>
                <th
                  class="text-right py-3 px-4 font-medium"
                  :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                >Monthly</th>
                <th
                  class="text-right py-3 px-4 font-medium"
                  :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                >Grant Period</th>
                <th
                  class="text-right py-3 px-4 font-medium"
                  :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                >Archive</th>
                <th
                  class="text-right py-3 px-4 font-medium"
                  :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                >Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="service in costBreakdown.byService"
                :key="service.service_slug"
                class="border-b"
                :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-100'"
              >
                <td
                  class="py-3 px-4"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >{{ service.name }}</td>
                <td
                  class="py-3 px-4 text-right"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
                >{{ formatCurrency(service.monthly) }}</td>
                <td
                  class="py-3 px-4 text-right"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
                >{{ formatCurrency(service.grant) }}</td>
                <td
                  class="py-3 px-4 text-right"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
                >
                  {{ service.archive > 0 ? formatCurrency(service.archive) : '—' }}
                </td>
                <td
                  class="py-3 px-4 text-right font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ formatCurrency(service.grant + service.archive) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-50'">
                <td
                  class="py-3 px-4 font-semibold"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >Total</td>
                <td
                  class="py-3 px-4 text-right font-semibold"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ formatCurrency(costBreakdown.monthlyTotal) }}
                </td>
                <td
                  class="py-3 px-4 text-right font-semibold"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ formatCurrency(costBreakdown.grantTotal) }}
                </td>
                <td
                  class="py-3 px-4 text-right font-semibold"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ formatCurrency(costBreakdown.archiveTotal) }}
                </td>
                <td
                  class="py-3 px-4 text-right font-semibold"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  {{ formatCurrency(costBreakdown.grandTotal) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Export buttons -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button
          @click="exportBudget"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Download class="w-4 h-4" />
          Export Budget (Markdown)
        </button>
        <button
          @click="exportJSON"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <FileText class="w-4 h-4" />
          Export Session (JSON)
        </button>
      </div>
    </div>

    <!-- DMP Tab -->
    <div v-show="activeTab === 'dmp'">
      <!-- DMP info -->
      <div
        class="rounded-lg p-4 mb-6"
        :class="preferencesStore.darkMode ? 'bg-blue-900/30' : 'bg-blue-50'"
      >
        <p
          class="text-sm"
          :class="preferencesStore.darkMode ? 'text-blue-200' : 'text-blue-800'"
        >
          <strong>Data Management Plan</strong> - This document describes how your research data will be stored,
          protected, and retained. Copy or download this content to include in your grant proposal.
        </p>
      </div>

      <!-- DMP content -->
      <div
        class="border rounded-lg mb-6"
        :class="preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-200'"
      >
        <div
          class="flex items-center justify-between px-4 py-2 border-b"
          :class="preferencesStore.darkMode
            ? 'bg-gray-700 border-gray-600'
            : 'bg-gray-50 border-gray-200'"
        >
          <span
            class="text-sm font-medium"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
          >Preview</span>
          <div class="flex gap-2">
            <button
              @click="copyDMP"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors"
              :class="preferencesStore.darkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
            >
              <component :is="copied ? Check : Copy" class="w-4 h-4" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
            <button
              @click="exportDMP"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download class="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
        <div
          class="p-6 prose prose-sm max-w-none overflow-auto max-h-[600px]"
          :class="preferencesStore.darkMode ? 'prose-invert' : ''"
          v-html="dmpHtml"
        />
      </div>

      <!-- Services without templates warning -->
      <div
        v-if="dmpGenerator.servicesWithoutTemplates.value.length > 0"
        class="rounded-lg p-4 mb-6"
        :class="preferencesStore.darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'"
      >
        <p
          class="text-sm"
          :class="preferencesStore.darkMode ? 'text-yellow-200' : 'text-yellow-800'"
        >
          <strong>Note:</strong> Some services do not have DMP templates and are not included above:
          {{ dmpGenerator.servicesWithoutTemplates.value.map(s => configStore.servicesBySlug[s.service_slug]?.name).join(', ') }}
        </p>
      </div>
    </div>

    <!-- Disclaimer and contact (shown on both tabs) -->
    <div
      class="rounded-lg p-4 mb-6"
      :class="preferencesStore.darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'"
    >
      <p
        class="text-sm"
        :class="preferencesStore.darkMode ? 'text-yellow-200' : 'text-yellow-800'"
      >
        <strong>Note:</strong> This is an estimate based on current pricing and your inputs.
        Actual costs may vary. Please consult with
        <a
          :href="'mailto:' + configStore.config?.meta?.contact?.general"
          class="text-blue-500 hover:underline"
        >
          {{ configStore.config?.meta?.contact?.general }}
        </a>
        for final budget approval.
      </p>
    </div>

    <!-- Feedback -->
    <PageFeedback
      page-id="wizard-complete"
      prompt="Was the Research Data Planner helpful for your grant planning?"
      :metadata="{ tier: sessionStore.session?.selected_tier }"
    />

    <!-- Actions -->
    <div
      class="flex items-center justify-between pt-4 border-t"
      :class="preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-200'"
    >
      <button
        @click="startOver"
        class="inline-flex items-center gap-2 px-4 py-2"
        :class="preferencesStore.darkMode
          ? 'text-gray-400 hover:text-gray-200'
          : 'text-gray-700 hover:text-gray-900'"
      >
        <RefreshCw class="w-4 h-4" />
        Start Over
      </button>

      <a
        v-if="configStore.config?.meta?.contact?.consultation_url"
        :href="configStore.config.meta.contact.consultation_url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Schedule Consultation
        <ExternalLink class="w-4 h-4" />
      </a>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

/* Prose styling for markdown content */
.prose h1 { @apply text-2xl font-bold text-gray-900 mb-4 mt-0; }
.prose h2 { @apply text-xl font-semibold text-gray-900 mb-3 mt-6; }
.prose h3 { @apply text-lg font-semibold text-gray-900 mb-2 mt-4; }
.prose h4 { @apply text-base font-semibold text-gray-900 mb-2 mt-3; }
.prose p { @apply text-gray-700 mb-3; }
.prose ul { @apply list-disc list-inside mb-3 text-gray-700; }
.prose ol { @apply list-decimal list-inside mb-3 text-gray-700; }
.prose li { @apply mb-1; }
.prose strong { @apply font-semibold text-gray-900; }
.prose hr { @apply my-6 border-gray-200; }
.prose a { @apply text-blue-600 hover:underline; }
</style>
