import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'odp-preferences'

export const usePreferencesStore = defineStore('preferences', () => {
  // User preferences
  const showWallpaper = ref(true)
  const darkMode = ref(false)
  // AI Guidance "Getting Started" intro card — dismissed once, stays dismissed
  const aiGettingStartedDismissed = ref(false)

  // Load from localStorage on init
  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const prefs = JSON.parse(saved)
        showWallpaper.value = prefs.showWallpaper ?? true
        darkMode.value = prefs.darkMode ?? false
        aiGettingStartedDismissed.value = prefs.aiGettingStartedDismissed ?? false
      }
    } catch (e) {
      // Ignore parse errors
    }
    applyDarkMode()
  }

  // Save to localStorage
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      showWallpaper: showWallpaper.value,
      darkMode: darkMode.value,
      aiGettingStartedDismissed: aiGettingStartedDismissed.value
    }))
  }

  // Apply dark mode class to document
  function applyDarkMode() {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle functions
  function toggleWallpaper() {
    showWallpaper.value = !showWallpaper.value
    saveToStorage()
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    applyDarkMode()
    saveToStorage()
  }

  function dismissAiGettingStarted() {
    aiGettingStartedDismissed.value = true
    saveToStorage()
  }

  // Watch for changes and persist
  watch([showWallpaper, darkMode, aiGettingStartedDismissed], saveToStorage)

  // Initialize on store creation
  loadFromStorage()

  return {
    showWallpaper,
    darkMode,
    aiGettingStartedDismissed,
    toggleWallpaper,
    toggleDarkMode,
    dismissAiGettingStarted,
    loadFromStorage
  }
})
