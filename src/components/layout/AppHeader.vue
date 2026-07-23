<script setup>
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useHeroBackgrounds } from '@/composables/useHeroBackgrounds'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import SkinPicker from '@/components/layout/SkinPicker.vue'
import BackgroundPickerModal from '@/components/layout/BackgroundPickerModal.vue'
import {
  Sun,
  Moon,
  Image,
  ImageOff,
  Images,
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
const { backgrounds } = useHeroBackgrounds()

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

// Shrink-on-scroll with HYSTERESIS. A single threshold is a feedback trap: the
// header collapses (logo h-16→h-10, py-4→py-2 — ~24px shorter) when scrollY
// crosses it, which shortens the document and drags scrollY back across the
// SAME line — an endless sub-pixel wobble whenever the resting scroll sits near
// it. The wizard's tier step lands right there, which is the "jiggle" (and the
// Playwright "element is not stable" 30s timeout the reshoot hit). Two
// thresholds with a dead-band far wider than the header's own height change
// mean the collapse can never re-trigger its own inverse: engage past 64px,
// release under 8px, hold state in the 56px band between.
const isScrolled = ref(false)
const ENGAGE_AT = 64
const RELEASE_AT = 8

function handleScroll() {
  const y = window.scrollY
  if (!isScrolled.value && y > ENGAGE_AT) isScrolled.value = true
  else if (isScrolled.value && y < RELEASE_AT) isScrolled.value = false
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

// Any background configured at all → show the control. More than one → the
// control opens the picker modal instead of being a plain on/off toggle.
const hasHeroBackground = computed(() => backgrounds.value.length >= 1)
const hasMultipleBackgrounds = computed(() => backgrounds.value.length > 1)
const backgroundModalOpen = ref(false)

function openBackgroundPicker() {
  settingsOpen.value = false
  backgroundModalOpen.value = true
}

// Right-side status label for the "Background" row when it opens the picker.
const backgroundStatusLabel = computed(() => {
  if (!preferencesStore.showWallpaper) return 'Off'
  if (preferencesStore.wallpaperRandom) return 'Surprise me'
  const chosen = backgrounds.value.find((b) => b.image === preferencesStore.wallpaperChoice)
  return chosen?.caption || (backgrounds.value[0]?.caption ?? 'On')
})

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

              <!-- Background: with several to choose from, this opens the
                   picker modal; with one, it's a plain on/off toggle (no modal
                   for a single photo). Hidden entirely when none configured. -->
              <button
                v-if="hasMultipleBackgrounds"
                @click="openBackgroundPicker"
                class="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm text-text-secondary hover:bg-surface-alt transition-colors"
                role="menuitem"
              >
                <span class="flex items-center gap-2">
                  <Images class="w-4 h-4" />
                  Background
                </span>
                <span class="text-xs font-medium max-w-[7rem] truncate" :class="preferencesStore.showWallpaper ? 'text-primary' : 'text-text-muted'">
                  {{ backgroundStatusLabel }}
                </span>
              </button>
              <button
                v-else-if="hasHeroBackground"
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

              <!-- UX Enhancements — the motion + flourish layer. On by default;
                   off gives a plainer, calmer interface. OS reduced-motion is
                   honored separately, so this is the user's explicit choice. -->
              <button
                @click="preferencesStore.toggleUxEnhancements"
                class="w-full flex items-start justify-between gap-2 px-2 py-1.5 rounded-md text-sm text-text-secondary hover:bg-surface-alt transition-colors"
                role="menuitemcheckbox"
                :aria-checked="preferencesStore.uxEnhancements"
              >
                <span class="flex items-start gap-2 text-left">
                  <Sparkles class="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    UX enhancements
                    <span class="block text-xs text-text-muted">Subtle motion &amp; visual polish</span>
                  </span>
                </span>
                <span
                  class="text-xs font-medium mt-0.5 flex-shrink-0"
                  :class="preferencesStore.uxEnhancements ? 'text-primary' : 'text-text-muted'"
                >
                  {{ preferencesStore.uxEnhancements ? 'On' : 'Off' }}
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

    <BackgroundPickerModal
      v-if="backgroundModalOpen"
      @close="backgroundModalOpen = false"
    />
  </header>
</template>
