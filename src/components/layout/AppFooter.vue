<script setup>
import { useConfigStore } from '@/stores/configStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { computed } from 'vue'
import { Bot } from 'lucide-vue-next'

const configStore = useConfigStore()
const preferencesStore = usePreferencesStore()

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

const links = computed(() => {
  const raw = configStore.config?.meta?.links || {}
  // Filter out empty/whitespace-only values so they don't render
  const filtered = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value && typeof value === 'string' && value.trim()) {
      filtered[key] = value
    }
  }
  return filtered
})

// AI Disclosure config
const aiDisclosure = computed(() => configStore.config?.meta?.ai_disclosure)
const showAiFooter = computed(() => aiDisclosure.value?.enabled !== false)
const aiFooterText = computed(() => aiDisclosure.value?.footer?.text || 'Built with AI assistance.')
const aiFooterLearnMore = computed(() => aiDisclosure.value?.footer?.learn_more_label || 'Learn more')
</script>

<template>
  <footer
    class="border-t px-6 py-6 pb-20 transition-colors duration-200"
    :class="preferencesStore.darkMode
      ? 'bg-gray-900 border-gray-700'
      : 'bg-white border-gray-200'"
  >
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between gap-8">
        <!-- Left side: Contact info, links, version -->
        <div class="flex flex-col gap-2">
          <!-- Contact info -->
          <div
            class="flex items-center gap-4 text-sm"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            <span v-if="primaryContact">
              Questions?
              <a
                :href="primaryContact.type === 'email' ? 'mailto:' + primaryContact.value : primaryContact.value"
                :target="primaryContact.type === 'url' ? '_blank' : undefined"
                :rel="primaryContact.type === 'url' ? 'noopener noreferrer' : undefined"
                class="hover:underline"
                :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
              >
                {{ primaryContact.label }}
              </a>
            </span>

            <span v-if="primaryContact && consultationUrl" class="text-gray-300">|</span>

            <a
              v-if="consultationUrl"
              :href="consultationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
            >
              Schedule consultation
            </a>
          </div>

          <!-- Policy links -->
          <div
            class="flex items-center gap-4 text-xs"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
          >
            <a
              v-if="links.privacy"
              :href="links.privacy"
              target="_blank"
              rel="noopener noreferrer"
              :class="preferencesStore.darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'"
            >
              Privacy
            </a>
            <a
              v-if="links.accessibility"
              :href="links.accessibility"
              target="_blank"
              rel="noopener noreferrer"
              :class="preferencesStore.darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'"
            >
              Accessibility
            </a>
            <a
              v-if="links.terms"
              :href="links.terms"
              target="_blank"
              rel="noopener noreferrer"
              :class="preferencesStore.darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'"
            >
              Terms
            </a>
          </div>

          <!-- AI Acknowledgment -->
          <div
            v-if="showAiFooter"
            class="flex items-center gap-1.5 text-xs"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
          >
            <Bot class="w-3 h-3" />
            <span>{{ aiFooterText }}</span>
            <router-link
              to="/about-ai"
              :class="preferencesStore.darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'"
            >
              {{ aiFooterLearnMore }}
            </router-link>
          </div>

          <!-- Version -->
          <div
            class="text-xs"
            :class="preferencesStore.darkMode ? 'text-gray-600' : 'text-gray-300'"
          >
            Template v{{ templateVersion }}
          </div>
        </div>

        <!-- Right side: Logo (crest) to balance header -->
        <div class="flex items-center flex-shrink-0">
          <img
            v-if="footerLogo"
            :src="footerLogo"
            :alt="institutionName"
            class="h-24 w-auto"
          />
          <span
            v-else
            class="text-sm font-medium"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
          >
            {{ institutionName }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
