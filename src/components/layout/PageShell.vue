<!-- PageShell — the ONE standard page container.

  Replaces the 2–3 ad-hoc page wrappers we grew: a bare page that sat straight
  on the hero (title unreadable), a full-bleed `min-h-screen bg-canvas` that
  painted over the hero, and hand-rolled cards with drifting max-widths. Every
  top-level view should wrap its content in this.

  It's a card that FLOATS on the app's hero background (my-6 margin, rounded,
  clipped) so the hero still reads around it. The optional #header slot renders
  on an opaque bg-surface bar, so a page title is always legible over the hero —
  never bare on the image.

  Props:
    width — a Tailwind max-w-* class (default max-w-5xl). Responsive steps are
            fine, e.g. "max-w-4xl xl:max-w-6xl".
    bare  — drop the default body padding when the page owns its inner layout
            (e.g. an internal left/right rail that manages its own padding).
    clip  — re-add overflow-hidden. ONLY for a page whose inner layout paints
            full-bleed to the card edges (e.g. a static left-rail divider) AND
            has NO position:sticky child — clipping traps sticky. Default off.
-->
<script setup>
defineProps({
  width: { type: String, default: 'max-w-5xl' },
  bare: { type: Boolean, default: false },
  clip: { type: Boolean, default: false }
})
</script>

<template>
  <!-- NB: no overflow-hidden by default — it would trap position:sticky rails
       inside the card. The header rounds its own top corners to sit flush
       instead. Pass `clip` only for full-bleed, sticky-free inner layouts. -->
  <div
    :class="['mx-auto my-6 rounded-xl border shadow-sm transition-colors border-border bg-canvas', width, clip ? 'overflow-hidden' : '']"
  >
    <!-- Opaque title/controls bar — keeps the heading readable over the hero -->
    <header
      v-if="$slots.header"
      class="relative overflow-hidden rounded-t-xl border-b px-4 py-4 bg-surface border-border"
    >
      <!-- Skin-accent hairline along the top edge. Rendered only when UX
           enhancements are on (see .ux-accent-hairline in main.css); otherwise
           this empty div collapses to nothing. overflow-hidden clips it to the
           rounded top corners. -->
      <div class="ux-accent-hairline absolute inset-x-0 top-0" aria-hidden="true"></div>
      <slot name="header" />
    </header>

    <div :class="bare ? '' : 'px-4 py-6'">
      <slot />
    </div>
  </div>
</template>
