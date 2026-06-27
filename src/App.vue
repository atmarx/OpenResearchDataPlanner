<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useSlateStore } from '@/stores/slateStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { initSkin } from '@/composables/useSkin'

import GetHelpModal from '@/components/layout/GetHelpModal.vue'
import { MessageCircle } from 'lucide-vue-next'

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const slateStore = useSlateStore()
const preferencesStore = usePreferencesStore()

const showHelpModal = ref(false)
const helpEnabled = computed(() => {
  const g = configStore.config?.help?.global
  return g?.show_help_cta && g?.floating_button?.enabled
})

// Background image from config
const heroBackgroundUrl = computed(() => configStore.config?.meta?.branding?.hero_background)
const heroOverlay = computed(() => configStore.config?.meta?.branding?.hero_overlay ?? 0.4)
const showBackground = computed(() => heroBackgroundUrl.value && preferencesStore.showWallpaper)

// Inject custom CSS from config
function injectCustomStyles() {
  const branding = configStore.config?.meta?.branding
  if (!branding) return

  // Remove any previously injected styles
  document.getElementById('custom-css-inline')?.remove()
  document.getElementById('custom-css-external')?.remove()

  // Inject inline custom CSS
  if (branding.custom_css) {
    const style = document.createElement('style')
    style.id = 'custom-css-inline'
    style.textContent = branding.custom_css
    document.head.appendChild(style)
  }

  // Inject external stylesheet
  if (branding.custom_css_url) {
    const link = document.createElement('link')
    link.id = 'custom-css-external'
    link.rel = 'stylesheet'
    link.href = branding.custom_css_url
    document.head.appendChild(link)
  }
}

onMounted(async () => {
  await configStore.loadConfig()
  // Boot the skin engine with the fork's institutional default (a design.md
  // token block named in meta.branding.default_skin — e.g. 'northwinds').
  initSkin(configStore.config?.meta?.branding?.default_skin)
  // Try to restore session from localStorage
  sessionStore.loadFromLocalStorage()
  // Inject any custom styles from config
  injectCustomStyles()
})

// Re-inject if config reloads (hot reload during dev)
watch(() => configStore.config?.meta?.branding, injectCustomStyles)
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Loading state -->
  <div v-if="configStore.loading" class="flex items-center justify-center min-h-screen bg-canvas">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-text-muted">Loading configuration...</p>
    </div>
  </div>

  <!-- Error state -->
  <div v-else-if="configStore.error" class="flex items-center justify-center min-h-screen bg-canvas">
    <div class="text-center max-w-md px-4">
      <div class="text-red-500 text-5xl mb-4">!</div>
      <p class="text-red-600 font-semibold text-lg">Failed to load configuration</p>
      <p class="text-text-muted mt-2">{{ configStore.error }}</p>
      <button
        @click="configStore.loadConfig()"
        class="mt-4 px-4 py-2 bg-primary text-on-primary rounded-md hover:opacity-90"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Main app -->
  <div
    v-else
    class="min-h-screen flex flex-col transition-colors duration-200 relative bg-canvas"
  >
    <!-- Hero background: fixed, viewport-sized layers BEHIND the content. The
         photo used to sit on this flex-col root with `bg-cover`, so as the page
         grew taller (more wizard steps, the slate, expanded panels) bg-cover
         scaled the image up to cover that height — the "background zooms in as
         you progress" bug. Pinning it to a position:fixed layer (NOT the janky
         background-attachment:fixed) means it only ever fits the viewport and
         never sees the page height. -->
    <template v-if="showBackground">
      <div
        class="fixed inset-0 z-0 bg-cover bg-center pointer-events-none"
        :style="{ backgroundImage: `url(${heroBackgroundUrl})` }"
      ></div>
      <div
        class="fixed inset-0 z-0 pointer-events-none bg-canvas"
        :style="{ opacity: heroOverlay }"
      ></div>
    </template>

    <!-- Each layout (Planner / Guidance / Bare) renders the page chrome and its
         own <main id="main-content"> + page-transition boundary. They're
         multi-root fragments, so their header/main/footer become direct flex
         children of this flex-col root, keeping flex-1 main and the z-10 stack
         above the overlay exactly as before. -->
    <router-view />

    <!-- Floating Get Help button -->
    <button
      v-if="helpEnabled"
      @click="showHelpModal = true"
      class="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg font-medium text-sm transition-all hover:scale-105 active:scale-95 bg-primary text-on-primary hover:opacity-90"
      aria-label="Get help"
    >
      <MessageCircle class="w-4 h-4" />
      <span>Get Help</span>
    </button>

    <GetHelpModal v-if="showHelpModal" @close="showHelpModal = false" />
  </div>
</template>
