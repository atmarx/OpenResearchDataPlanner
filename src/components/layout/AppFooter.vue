<script setup>
import { useConfigStore } from '@/stores/configStore'
import { computed } from 'vue'
import { Bot } from 'lucide-vue-next'

const configStore = useConfigStore()

const institutionName = computed(() =>
  configStore.config?.meta?.institution?.name || 'Research Institution'
)

const footerLogo = computed(() =>
  configStore.config?.meta?.institution?.footer_logo ||
  configStore.config?.meta?.institution?.logo
)

const primaryContact = computed(() =>
  configStore.config?.meta?.contact?.primary
)

const templateVersion = computed(() =>
  configStore.config?.meta?.version || '1.0.0'
)

const consultationUrl = computed(() =>
  configStore.config?.meta?.contact?.consultation_url
)

// Footer links are a YAML-driven list of { label, url } so institutions edit
// policies in config alone. A legacy object form { privacy: url, ... } is still
// accepted and mapped to the list, so existing forks don't break on upgrade.
const links = computed(() => {
  const raw = configStore.config?.meta?.links
  const valid = (l) => l && l.label && typeof l.url === 'string' && l.url.trim()
  if (Array.isArray(raw)) {
    return raw.filter(valid)
  }
  if (raw && typeof raw === 'object') {
    const legacyLabels = { privacy: 'Privacy', accessibility: 'Accessibility', terms: 'Terms' }
    return Object.entries(raw)
      .filter(([, url]) => url && typeof url === 'string' && url.trim())
      .map(([key, url]) => ({ label: legacyLabels[key] || key, url }))
  }
  return []
})

// Legal fine print (config/legal.yaml). The short "as is / planning only"
// warranty notice belongs in the footer; the full terms live in the export +
// (future) About page. Renders only if the boilerplate is present.
const legalFinePrint = computed(() => configStore.config?.legal?.no_warranty?.short)

// AI Disclosure config
const aiDisclosure = computed(() => configStore.config?.meta?.ai_disclosure)
const showAiFooter = computed(() => aiDisclosure.value?.enabled !== false)
const aiFooterText = computed(() => aiDisclosure.value?.footer?.text || 'Built with AI assistance.')
const aiFooterLearnMore = computed(() => aiDisclosure.value?.footer?.learn_more_label || 'Learn more')
const aiFooterFeedback = computed(() => aiDisclosure.value?.footer?.feedback_label || 'Share your feedback')
</script>

<template>
  <footer
    class="border-t px-6 py-6 pb-20 transition-colors duration-200 bg-surface border-border"
  >
    <div class="max-w-5xl mx-auto">
      <!-- Stack on mobile so the crest drops below the text instead of
           fighting it for width (was a fixed two-column row → 65px overflow) -->
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <!-- Left side: Contact info, links, version -->
        <!-- min-w-0 lets this column shrink when side-by-side on sm+ -->
        <div class="flex flex-col gap-2 min-w-0">
          <!-- Contact info — wraps so the long support email can't blow out
               the row on narrow screens -->
          <div
            class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted"
          >
            <span v-if="primaryContact">
              Questions?
              <a
                :href="primaryContact.type === 'email' ? 'mailto:' + primaryContact.value : primaryContact.value"
                :target="primaryContact.type === 'url' ? '_blank' : undefined"
                :rel="primaryContact.type === 'url' ? 'noopener noreferrer' : undefined"
                class="hover:underline text-primary"
              >
                {{ primaryContact.label }}
              </a>
            </span>

            <span v-if="primaryContact && consultationUrl" class="text-text-muted">|</span>

            <a
              v-if="consultationUrl"
              :href="consultationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline text-primary"
            >
              Schedule consultation
            </a>
          </div>

          <!-- Policy links (YAML-driven list; wraps when there are many) -->
          <div
            v-if="links.length"
            class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted"
          >
            <a
              v-for="link in links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-text-secondary"
            >
              {{ link.label }}
            </a>
          </div>

          <!-- AI Acknowledgment -->
          <div
            v-if="showAiFooter"
            class="flex items-center gap-1.5 text-xs text-text-muted"
          >
            <Bot class="w-3 h-3" />
            <span>{{ aiFooterText }}</span>
            <router-link
              to="/about-ai"
              class="underline hover:text-text-secondary"
            >
              {{ aiFooterLearnMore }}
            </router-link>
            <span aria-hidden="true" class="opacity-50">·</span>
            <router-link
              to="/about-ai#feedback"
              class="underline hover:text-text-secondary"
            >
              {{ aiFooterFeedback }}
            </router-link>
          </div>

          <!-- Version -->
          <div
            class="text-xs text-text-muted"
          >
            Template v{{ templateVersion }}
          </div>

          <!-- Legal fine print: the "as is / planning only" disclaimer -->
          <div
            v-if="legalFinePrint"
            class="text-xs text-text-muted max-w-prose leading-snug"
          >
            {{ legalFinePrint }}
          </div>
        </div>

        <!-- Right side: Logo (crest) to balance header -->
        <div class="flex items-center flex-shrink-0">
          <img
            v-if="footerLogo"
            :src="footerLogo"
            :alt="institutionName"
            class="h-16 sm:h-24 w-auto"
          />
          <span
            v-else
            class="text-sm font-medium text-text-secondary"
          >
            {{ institutionName }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
