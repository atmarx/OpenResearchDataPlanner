<script setup>
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import SkinPicker from '@/components/layout/SkinPicker.vue'
import {
  Sun,
  Moon,
  Image,
  ImageOff,
  Settings,
  Compass,
  Calculator,
  Grid,
  Package,
  HelpCircle,
  Sparkles,
  Book
} from 'lucide-vue-next'

const route = useRoute()
const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

// Navigation tabs
const navTabs = computed(() => {
  const tabs = [
    { path: '/', name: 'Planner', icon: Compass },
    { path: '/calculators', name: 'Calculators', icon: Calculator },
    { path: '/services', name: 'Services', icon: Grid },
    { path: '/software', name: 'Software', icon: Package },
    { path: '/tier-check', name: 'Tier Check', icon: HelpCircle },
    { path: '/ai', name: 'AI Guide', icon: Sparkles },
    { path: '/glossary', name: 'Glossary', icon: Book }
  ]
  if (!configStore.config?.meta?.ai_disclosure?.enabled) {
    return tabs.filter(t => t.path !== '/ai')
  }
  return tabs
})

const currentPath = computed(() => route.path)

const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

// Settings dropdown (gear) — collapses skin + wallpaper + dark mode into one
// popover instead of three loose header buttons. Closes on outside-click / Esc.
const settingsOpen = ref(false)
const settingsRef = ref(null)
function closeSettingsOnOutside(e) {
  if (settingsOpen.value && settingsRef.value && !settingsRef.value.contains(e.target)) {
    settingsOpen.value = false
  }
}
function closeSettingsOnEsc(e) {
  if (e.key === 'Escape') settingsOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  document.addEventListener('click', closeSettingsOnOutside)
  document.addEventListener('keydown', closeSettingsOnEsc)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeSettingsOnOutside)
  document.removeEventListener('keydown', closeSettingsOnEsc)
})

const institutionName = computed(() =>
  configStore.config?.meta?.institution?.name || 'Research Institution'
)

const institutionLogo = computed(() =>
  configStore.config?.meta?.institution?.logo
)

const siteTitle = computed(() =>
  configStore.config?.meta?.site?.title || 'Research Data Planner'
)

const hasHeroBackground = computed(() =>
  !!configStore.config?.meta?.branding?.hero_background
)

function handleReset() {
  if (sessionStore.hasUnsavedChanges) {
    if (confirm('This will clear all your current selections. Are you sure?')) {
      sessionStore.reset()
    }
  } else {
    sessionStore.reset()
  }
}
</script>

<template>
  <!-- Header is a raised surface; bg-surface + border-border flip themselves
       under .dark and under any institution skin. No darkMode ternaries.
       The bar (bg + borders) is full-bleed like the footer; the content is
       capped at max-w-5xl mx-auto so it lines up with the footer column. -->
  <header class="sticky top-0 z-50 transition-all duration-200 bg-surface">
    <!-- Top row: Logo, Title, Controls -->
    <div class="border-b border-border px-4 sm:px-6">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/">
            <img
              v-if="institutionLogo"
              :src="institutionLogo"
              :alt="institutionName"
              class="w-auto transition-all duration-200"
              :class="isScrolled ? 'h-10' : 'h-16'"
            />
            <span v-else class="text-sm text-text-muted">
              {{ institutionName }}
            </span>
          </router-link>
        </div>

        <!-- Right side: Title + controls -->
        <div
          class="flex items-center gap-3 transition-all duration-200"
          :class="isScrolled ? 'py-2' : 'py-4'"
        >
          <h1
            class="font-semibold transition-all duration-200 hidden sm:block text-text"
            :class="isScrolled ? 'text-base' : 'text-xl'"
          >
            {{ siteTitle }}
          </h1>

          <!-- Settings: one gear collapses skin + wallpaper + dark mode into a
               dropdown instead of three loose header buttons. -->
          <div class="relative ml-4" ref="settingsRef">
            <button
              @click="settingsOpen = !settingsOpen"
              class="p-2 rounded-lg transition-colors hover:bg-surface-alt"
              :class="settingsOpen ? 'bg-surface-alt text-text' : 'text-text-muted hover:text-text'"
              :aria-expanded="settingsOpen"
              aria-haspopup="true"
              title="Display settings"
            >
              <Settings class="w-5 h-5" />
            </button>

            <div
              v-if="settingsOpen"
              class="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-surface shadow-lg z-50 p-3 space-y-3"
              role="menu"
            >
              <!-- Institution theme -->
              <div>
                <label class="block text-xs font-medium mb-1 text-text-muted">Institution theme</label>
                <SkinPicker />
              </div>

              <!-- Background photo (only if a hero background is configured) -->
              <button
                v-if="hasHeroBackground"
                @click="preferencesStore.toggleWallpaper"
                class="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm text-text-secondary hover:bg-surface-alt transition-colors"
                role="menuitemcheckbox"
                :aria-checked="preferencesStore.showWallpaper"
              >
                <span class="flex items-center gap-2">
                  <component :is="preferencesStore.showWallpaper ? Image : ImageOff" class="w-4 h-4" />
                  Background photo
                </span>
                <span
                  class="text-xs font-medium"
                  :class="preferencesStore.showWallpaper ? 'text-primary' : 'text-text-muted'"
                >
                  {{ preferencesStore.showWallpaper ? 'On' : 'Off' }}
                </span>
              </button>

              <!-- Dark mode -->
              <button
                @click="preferencesStore.toggleDarkMode"
                class="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm text-text-secondary hover:bg-surface-alt transition-colors"
                role="menuitemcheckbox"
                :aria-checked="preferencesStore.darkMode"
              >
                <span class="flex items-center gap-2">
                  <component :is="preferencesStore.darkMode ? Sun : Moon" class="w-4 h-4" />
                  Dark mode
                </span>
                <span
                  class="text-xs font-medium"
                  :class="preferencesStore.darkMode ? 'text-primary' : 'text-text-muted'"
                >
                  {{ preferencesStore.darkMode ? 'On' : 'Off' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Start over -->
          <button
            v-if="sessionStore.hasUnsavedChanges"
            @click="handleReset"
            class="text-sm underline ml-2 text-text-muted hover:text-text"
          >
            Start over
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation tabs -->
    <nav class="border-b border-border overflow-x-auto px-4 sm:px-6">
      <div class="max-w-5xl mx-auto flex justify-center">
        <router-link
          v-for="tab in navTabs"
          :key="tab.path"
          :to="tab.path"
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap"
          :class="currentPath === tab.path
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text hover:border-border-strong'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ tab.name }}</span>
        </router-link>
      </div>
    </nav>
  </header>
</template>
