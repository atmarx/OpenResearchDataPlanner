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
-->
<script setup>
defineProps({
  width: { type: String, default: 'max-w-5xl' },
  bare: { type: Boolean, default: false }
})
</script>

<template>
  <!-- NB: no overflow-hidden — it would trap position:sticky rails inside the
       card. The header rounds its own top corners to sit flush instead. -->
  <div
    :class="['mx-auto my-6 rounded-xl border shadow-sm transition-colors border-border bg-canvas', width]"
  >
    <!-- Opaque title/controls bar — keeps the heading readable over the hero -->
    <header
      v-if="$slots.header"
      class="rounded-t-xl border-b px-4 py-4 bg-surface border-border"
    >
      <slot name="header" />
    </header>

    <div :class="bare ? '' : 'px-4 py-6'">
      <slot />
    </div>
  </div>
</template>
