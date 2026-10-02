import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

/**
 * Normalizes the institution's hero-background config into a single list the
 * App renderer and the picker modal both consume. Accepts either the new
 * `branding.hero_backgrounds` array ({ image, thumb?, caption?, credit? }) or
 * the legacy single `branding.hero_background` string — so old forks keep
 * working. Each entry is guaranteed to have `image` and a `thumb` (falls back
 * to the full image when none is supplied).
 */
export function useHeroBackgrounds() {
  const configStore = useConfigStore()

  const backgrounds = computed(() => {
    const branding = configStore.config?.meta?.branding || {}
    let list = []
    if (Array.isArray(branding.hero_backgrounds)) {
      list = branding.hero_backgrounds.map((entry) =>
        typeof entry === 'string' ? { image: entry } : entry
      )
    } else if (branding.hero_background) {
      list = [{ image: branding.hero_background }]
    }
    return list
      .filter((b) => b && b.image)
      .map((b) => ({
        image: b.image,
        thumb: b.thumb || b.image,
        caption: b.caption || '',
        credit: b.credit || ''
      }))
  })

  // Opacity of the canvas-coloured wash App.vue lays over the photo so text
  // stays legible: 0 = raw photo, 1 = photo hidden.
  const overlay = computed(() =>
    configStore.config?.meta?.branding?.hero_overlay ?? 0.4
  )

  return { backgrounds, overlay }
}
