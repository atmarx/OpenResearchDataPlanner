<script setup>
// Lightweight placeholder shown by each layout's <Suspense> fallback. NOTE:
// vue-router resolves a lazy route chunk DURING navigation (the old page stays
// visible), so this does NOT cover the chunk-download gap. It shows only when an
// incoming routed component has an async setup() that suspends — bridging that
// with a theme-aware shimmer instead of a blank flash.
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
