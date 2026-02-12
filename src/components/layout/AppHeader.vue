<script setup>
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
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
const navTabs = [
  { path: '/', name: 'Planner', icon: Compass },
  { path: '/calculators', name: 'Calculators', icon: Calculator },
  { path: '/services', name: 'Services', icon: Grid },
  { path: '/software', name: 'Software', icon: Package },
  { path: '/tier-check', name: 'Tier Check', icon: HelpCircle },
  { path: '/ai', name: 'AI Guide', icon: Sparkles },
  { path: '/glossary', name: 'Glossary', icon: Book }
]

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
  <header
    class="sticky top-0 z-50 transition-all duration-200"
    :class="preferencesStore.darkMode
      ? 'bg-gray-900'
      : 'bg-white'"
  >
    <!-- Top row: Logo, Title, Controls -->
    <div
      class="flex items-center justify-between border-b"
      :class="preferencesStore.darkMode ? 'border-gray-800' : 'border-gray-100'"
    >
      <!-- Logo (with left padding matching right side) -->
      <div class="flex-shrink-0 pl-4 sm:pl-6">
        <router-link to="/">
          <img
            v-if="institutionLogo"
            :src="institutionLogo"
            :alt="institutionName"
            class="w-auto transition-all duration-200"
            :class="isScrolled ? 'h-10' : 'h-16'"
          />
          <span
            v-else
            class="text-sm"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-500'"
          >
            {{ institutionName }}
          </span>
        </router-link>
      </div>

      <!-- Right side: Title + controls (with padding) -->
      <div
        class="flex items-center gap-3 px-4 sm:px-6 transition-all duration-200"
        :class="isScrolled ? 'py-2' : 'py-4'"
      >
        <h1
          class="font-semibold transition-all duration-200 hidden sm:block"
          :class="[
            isScrolled ? 'text-base' : 'text-xl',
            preferencesStore.darkMode ? 'text-white' : 'text-gray-900'
          ]"
        >
          {{ siteTitle }}
        </h1>

        <!-- Preference toggles -->
        <div class="flex items-center gap-1 ml-4">
          <!-- Wallpaper toggle (only show if hero background is configured) -->
          <button
            v-if="hasHeroBackground"
            @click="preferencesStore.toggleWallpaper"
            class="p-2 rounded-lg transition-colors"
            :class="preferencesStore.darkMode
              ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'"
            :title="preferencesStore.showWallpaper ? 'Hide wallpaper' : 'Show wallpaper'"
          >
            <Image v-if="preferencesStore.showWallpaper" class="w-5 h-5" />
            <ImageOff v-else class="w-5 h-5" />
          </button>

          <!-- Dark mode toggle -->
          <button
            @click="preferencesStore.toggleDarkMode"
            class="p-2 rounded-lg transition-colors"
            :class="preferencesStore.darkMode
              ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'"
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
          class="text-sm underline ml-2"
          :class="preferencesStore.darkMode
            ? 'text-gray-400 hover:text-gray-200'
            : 'text-gray-500 hover:text-gray-700'"
        >
          Start over
        </button>
      </div>
    </div>

    <!-- Navigation tabs -->
    <nav
      class="border-b overflow-x-auto"
      :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
    >
      <div class="flex justify-center px-4 sm:px-6">
        <router-link
          v-for="tab in navTabs"
          :key="tab.path"
          :to="tab.path"
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap"
          :class="currentPath === tab.path
            ? (preferencesStore.darkMode
              ? 'border-blue-400 text-blue-400'
              : 'border-blue-600 text-blue-600')
            : (preferencesStore.darkMode
              ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ tab.name }}</span>
        </router-link>
      </div>
    </nav>
  </header>
</template>
