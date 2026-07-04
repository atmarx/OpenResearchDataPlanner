import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'odp-preferences'

export const usePreferencesStore = defineStore('preferences', () => {
  // User preferences
  const showWallpaper = ref(true)
  const darkMode = ref(false)
  // AI Guidance "Getting Started" intro card — dismissed once, stays dismissed
  const aiGettingStartedDismissed = ref(false)
  // UX Enhancements — the motion + visual-flourish layer (count-ups, staggered
  // card entrances, richer route transitions, accent hairlines/glows). On by
  // default; opt out for a plainer, calmer interface (the "disable Themes on
  // XP" crowd). OS-level prefers-reduced-motion is honored independently in
  // useMotion.js and CSS — this toggle is the *user's explicit* choice on top.
  const uxEnhancements = ref(true)

  // Load from localStorage on init
  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const prefs = JSON.parse(saved)
        showWallpaper.value = prefs.showWallpaper ?? true
        darkMode.value = prefs.darkMode ?? false
        aiGettingStartedDismissed.value = prefs.aiGettingStartedDismissed ?? false
        uxEnhancements.value = prefs.uxEnhancements ?? true
      }
    } catch (e) {
      // Ignore parse errors
    }
    applyDarkMode()
    applyUxClass()
  }

  // Save to localStorage
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      showWallpaper: showWallpaper.value,
      darkMode: darkMode.value,
      aiGettingStartedDismissed: aiGettingStartedDismissed.value,
      uxEnhancements: uxEnhancements.value
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

  // Apply the 'ux-plain' class to <html> when enhancements are OFF. Absence of
  // the class is the default (enhanced) state, so CSS gates flourishes with
  // html:not(.ux-plain). Plain is the special case that adds the marker.
  function applyUxClass() {
    if (uxEnhancements.value) {
      document.documentElement.classList.remove('ux-plain')
    } else {
      document.documentElement.classList.add('ux-plain')
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

  function toggleUxEnhancements() {
    uxEnhancements.value = !uxEnhancements.value
    applyUxClass()
    saveToStorage()
  }

  // Watch for changes and persist
  watch([showWallpaper, darkMode, aiGettingStartedDismissed, uxEnhancements], saveToStorage)

  // Initialize on store creation
  loadFromStorage()

  return {
    showWallpaper,
    darkMode,
    aiGettingStartedDismissed,
    uxEnhancements,
    toggleWallpaper,
    toggleDarkMode,
    dismissAiGettingStarted,
    toggleUxEnhancements,
    loadFromStorage
  }
})
