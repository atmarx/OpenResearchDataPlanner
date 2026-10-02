<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { Bot, X, ExternalLink } from 'lucide-vue-next'
import { fillDisclosureTokens } from '@/lib/aiDisclosure.js'
import { renderMarkdown } from '@/lib/markdown'

const STORAGE_KEY = 'odp-welcome-dismissed'

const configStore = useConfigStore()

const isVisible = ref(false)

// Config-driven content with defaults
const aiDisclosure = computed(() => configStore.config?.meta?.ai_disclosure)
const isEnabled = computed(() => aiDisclosure.value?.enabled !== false)
const banner = computed(() => aiDisclosure.value?.banner || {})

const institutionName = computed(() => configStore.config?.meta?.institution?.name || 'Research IT')
// AI vendor name — single config knob (meta.ai_disclosure.assistant); see src/lib/aiDisclosure.js.
// Only an ABSENT key falls back to the default; an explicit "" is honored so a
// fork can strip the vendor name (fillDisclosureTokens then fixes the grammar).
const assistantName = computed(() => {
  const a = aiDisclosure.value?.assistant
  return a === undefined ? 'Claude (Anthropic)' : a
})

const title = computed(() => banner.value.title || 'About This Tool')
const message = computed(() =>
  fillDisclosureTokens(
    banner.value.message ||
      'This tool was built with AI coding assistance from {assistant}. All content has been reviewed by staff.',
    { institution: institutionName.value, assistant: assistantName.value }
  )
)
const learnMoreLabel = computed(() => banner.value.learn_more_label || 'Learn more')
const reportIssueUrl = computed(() => banner.value.report_issue_url)
const reportIssueLabel = computed(() => banner.value.report_issue_label || 'Report an issue')

onMounted(() => {
  // Check if user has previously dismissed the banner
  const dismissed = localStorage.getItem(STORAGE_KEY)
  if (!dismissed && isEnabled.value) {
    isVisible.value = true
  }
})

function dismiss() {
  isVisible.value = false
  localStorage.setItem(STORAGE_KEY, 'true')
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="isVisible"
      class="border-b bg-indigo-50 border-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-900"
    >
      <!-- max-w-7xl: the chrome column shared with AppHeader / SlateFooter / AppFooter -->
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
          >
            <Bot class="w-4 h-4" />
          </div>

          <!-- Content + actions: stacked on mobile; message left, actions floated
               right on sm+ so they reclaim the old fourth line and balance the
               dead space beside the ragged copy. -->
          <div class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div class="min-w-0 sm:flex-1">
              <h2
                class="text-sm font-semibold text-indigo-900 dark:text-indigo-200"
              >
                {{ title }}
              </h2>
              <!-- v-html of admin-authored config copy (trusted; see lib/markdown.js) -->
              <div
                class="mt-1 text-sm md-body text-indigo-700 dark:text-indigo-300"
              
                v-html="renderMarkdown(message.trim())"
              ></div>
            </div>

            <!-- Actions — button-ized. Learn more leads (filled); Report stays a
                 quieter ghost so it doesn't out-shout the primary link. -->
            <div class="mt-2 sm:mt-0 flex-shrink-0 flex flex-wrap items-center gap-2">
              <router-link
                to="/about"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {{ learnMoreLabel }}
                <ExternalLink class="w-3 h-3" />
              </router-link>
              <a
                v-if="reportIssueUrl"
                :href="reportIssueUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-indigo-700 hover:bg-indigo-100 dark:text-indigo-300 dark:hover:bg-indigo-900"
              >
                {{ reportIssueLabel }}
              </a>
            </div>
          </div>

          <!-- Dismiss button -->
          <button
            @click="dismiss"
            class="flex-shrink-0 p-1.5 rounded-lg transition-colors text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:hover:text-indigo-200"
            aria-label="Dismiss"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
