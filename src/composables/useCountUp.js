import { ref, watch, onUnmounted } from 'vue'
import { useMotion } from '@/composables/useMotion'

// Animate a number counting up to its target. Returns a reactive `display`
// value that tweens toward the source whenever it changes.
//
//   const grand = computed(() => costBreakdown.value.grandTotal)
//   const { display } = useCountUp(grand)
//   ...  {{ formatCurrency(display) }}
//
// When motion is off (user opted out, or OS reduced-motion), the display
// snaps to the target instantly — no tween, no rAF loop. The very first
// value on mount also snaps (nothing to count up *from* yet); only later
// changes animate, so the payoff figure ticks when the estimate lands but a
// restored session doesn't spin its wheels on load.
//
// source may be a ref, a computed, or a getter function.
export function useCountUp(source, { duration = 800 } = {}) {
  const { motionEnabled } = useMotion()

  const read = typeof source === 'function' ? source : () => source.value
  const initial = Number(read()) || 0
  const display = ref(initial)

  let frame = null
  let primed = false // becomes true after the first settle, so mount doesn't animate

  function cancel() {
    if (frame !== null) {
      cancelAnimationFrame(frame)
      frame = null
    }
  }

  // easeOutCubic — fast start, gentle landing
  const ease = (t) => 1 - Math.pow(1 - t, 3)

  function animateTo(target) {
    cancel()
    const from = display.value
    const delta = target - from
    if (delta === 0) return
    const start = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      display.value = from + delta * ease(t)
      if (t < 1) {
        frame = requestAnimationFrame(step)
      } else {
        display.value = target
        frame = null
      }
    }
    frame = requestAnimationFrame(step)
  }

  watch(
    () => Number(read()) || 0,
    (target) => {
      if (!primed || !motionEnabled.value) {
        // First settle, or motion disabled — snap.
        cancel()
        display.value = target
      } else {
        animateTo(target)
      }
      primed = true
    },
    { immediate: true }
  )

  onUnmounted(cancel)

  return { display }
}
