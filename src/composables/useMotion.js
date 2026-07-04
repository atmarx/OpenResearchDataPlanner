import { computed, ref } from 'vue'
import { usePreferencesStore } from '@/stores/preferencesStore'

// Single source of truth for whether animated flourishes should run.
//
// Two independent gates, AND-ed together:
//   1. The user's explicit "UX Enhancements" toggle (preferencesStore).
//   2. The OS-level `prefers-reduced-motion` media query.
//
// Motion runs only when the user hasn't opted out AND the OS isn't asking for
// reduced motion. JS-driven effects (count-ups, scroll-spy, orchestrated
// staggers) import this. Purely CSS-driven flourishes gate themselves with the
// `html:not(.ux-plain)` class + a `@media (prefers-reduced-motion)` block, which
// mirrors this same logic without needing JS.
//
// The media-query ref is a module-level singleton so every caller shares one
// listener rather than each mounting its own.

const prefersReducedMotion = ref(false)
let mql = null

function ensureMediaQuery() {
  if (mql || typeof window === 'undefined' || !window.matchMedia) return
  mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mql.matches
  // addEventListener is the modern API; guard for older Safari's addListener.
  const handler = (e) => { prefersReducedMotion.value = e.matches }
  if (mql.addEventListener) {
    mql.addEventListener('change', handler)
  } else if (mql.addListener) {
    mql.addListener(handler)
  }
}

export function useMotion() {
  ensureMediaQuery()
  const preferences = usePreferencesStore()

  const motionEnabled = computed(
    () => preferences.uxEnhancements && !prefersReducedMotion.value
  )

  return { motionEnabled, prefersReducedMotion }
}
