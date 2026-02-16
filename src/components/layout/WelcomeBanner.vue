<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useConfigStore } from '@/stores/configStore'
import { Bot, X, ExternalLink } from 'lucide-vue-next'

const STORAGE_KEY = 'odp-welcome-dismissed'

const preferencesStore = usePreferencesStore()
const configStore = useConfigStore()

const isVisible = ref(false)

// Config-driven content with defaults
const aiDisclosure = computed(() => configStore.config?.meta?.ai_disclosure)
const isEnabled = computed(() => aiDisclosure.value?.enabled !== false)
const banner = computed(() => aiDisclosure.value?.banner || {})

const title = computed(() => banner.value.title || 'About This Tool')
const message = computed(() =>
  banner.value.message ||
  'This tool was developed with AI coding assistance. All content has been reviewed by staff.'
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
      class="border-b"
      :class="preferencesStore.darkMode
        ? 'bg-indigo-950/50 border-indigo-900'
        : 'bg-indigo-50 border-indigo-100'"
    >
      <div class="max-w-5xl mx-auto px-4 py-3">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
            :class="preferencesStore.darkMode
              ? 'bg-indigo-900 text-indigo-300'
              : 'bg-indigo-100 text-indigo-600'"
          >
            <Bot class="w-4 h-4" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h2
              class="text-sm font-semibold"
              :class="preferencesStore.darkMode ? 'text-indigo-200' : 'text-indigo-900'"
            >
              {{ title }}
            </h2>
            <p
              class="mt-1 text-sm whitespace-pre-line"
              :class="preferencesStore.darkMode ? 'text-indigo-300' : 'text-indigo-700'"
            >
              {{ message.trim() }}
            </p>
            <div class="mt-2 flex items-center gap-4">
              <router-link
                to="/about-ai"
                class="inline-flex items-center gap-1 text-sm font-medium"
                :class="preferencesStore.darkMode
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'"
              >
                {{ learnMoreLabel }}
                <ExternalLink class="w-3 h-3" />
              </router-link>
              <a
                v-if="reportIssueUrl"
                :href="reportIssueUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm"
                :class="preferencesStore.darkMode
                  ? 'text-indigo-400/70 hover:text-indigo-300'
                  : 'text-indigo-500 hover:text-indigo-600'"
              >
                {{ reportIssueLabel }}
              </a>
            </div>
          </div>

          <!-- Dismiss button -->
          <button
            @click="dismiss"
            class="flex-shrink-0 p-1.5 rounded-lg transition-colors"
            :class="preferencesStore.darkMode
              ? 'text-indigo-400 hover:bg-indigo-900 hover:text-indigo-200'
              : 'text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600'"
            aria-label="Dismiss"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
