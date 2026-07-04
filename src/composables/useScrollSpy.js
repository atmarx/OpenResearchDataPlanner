import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

// Track which section is currently in view, for a "you are here" rail nav.
//
//   const sectionIds = computed(() => phases.value.map(p => 'ai-phase-' + p.id))
//   const { activeId } = useScrollSpy(sectionIds)
//   ...  :class="{ active: activeId === id }"
//
// `source` is a getter or ref that resolves to an array of element ids. The
// observer rebuilds whenever that list changes (sections load async from
// config). rootMargin biases "active" toward whatever heading sits near the
// top of the viewport, so the highlight tracks reading position rather than
// flipping on the first pixel of intersection.
export function useScrollSpy(source, { rootMargin = '-25% 0px -65% 0px' } = {}) {
  const activeId = ref(null)
  let observer = null
  const topByeId = new Map()

  const readIds = () => {
    const raw = typeof source === 'function' ? source() : source.value
    return Array.isArray(raw) ? raw : []
  }

  function teardown() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    topByeId.clear()
  }

  async function build() {
    teardown()
    if (typeof IntersectionObserver === 'undefined') return
    await nextTick() // let the target sections render first

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            topByeId.set(entry.target.id, entry.boundingClientRect.top)
          } else {
            topByeId.delete(entry.target.id)
          }
        }
        if (topByeId.size) {
          // Highest section still in the active band wins.
          activeId.value = [...topByeId.entries()].sort((a, b) => a[1] - b[1])[0][0]
        }
      },
      { rootMargin, threshold: 0 }
    )

    for (const id of readIds()) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  }

  onMounted(build)
  onUnmounted(teardown)
  // Rebuild when the id list changes (e.g. config-driven sections arrive).
  watch(() => readIds().join('|'), build)

  return { activeId }
}
