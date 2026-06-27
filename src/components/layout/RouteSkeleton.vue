<script setup>
// Lightweight placeholder shown by each layout's <Suspense> fallback while a
// lazy route chunk loads. Upgrades the old blank lazy-chunk gap into a visible,
// theme-aware shimmer. Keyed by route.path, so it only appears on a real route
// change — Pinia-driven wizard step swaps stay within '/' and never trip it.
</script>

<template>
  <div class="max-w-4xl mx-auto" aria-hidden="true">
    <div class="space-y-4">
      <div class="h-8 w-1/3 rounded-md animate-pulse bg-surface-alt"></div>
      <div class="h-40 rounded-lg animate-pulse bg-surface-alt"></div>
      <div class="h-4 w-2/3 rounded animate-pulse bg-surface-alt"></div>
      <div class="h-4 w-1/2 rounded animate-pulse bg-surface-alt"></div>
    </div>
  </div>
</template>
