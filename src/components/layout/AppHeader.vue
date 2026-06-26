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

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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

          <!-- Preference toggles -->
          <div class="flex items-center gap-1 ml-4">
            <!-- Institution skin selector -->
            <SkinPicker class="mr-1" />

            <!-- Wallpaper toggle (only show if hero background is configured) -->
            <button
              v-if="hasHeroBackground"
              @click="preferencesStore.toggleWallpaper"
              class="p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
              :title="preferencesStore.showWallpaper ? 'Hide wallpaper' : 'Show wallpaper'"
            >
              <Image v-if="preferencesStore.showWallpaper" class="w-5 h-5" />
              <ImageOff v-else class="w-5 h-5" />
            </button>

            <!-- Dark mode toggle -->
            <button
              @click="preferencesStore.toggleDarkMode"
              class="p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
              :title="preferencesStore.darkMode ? 'Light mode' : 'Dark mode'"
            >
              <Moon v-if="!preferencesStore.darkMode" class="w-5 h-5" />
              <Sun v-else class="w-5 h-5" />
            </button>
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
