<script setup>
// Bare shell: no global chrome at all — no header, banner, cart, or footer.
// WorkbenchPage paints its own staff header and bg-canvas, so this layout is
// just the skip-link <main> target plus the page Transition + Suspense boundary
// around the nested <router-view>.
import RouteSkeleton from '@/components/layout/RouteSkeleton.vue'
</script>

<template>
  <main id="main-content" class="flex-1 relative z-10">
    <router-view v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <Suspense>
          <component :is="Component" :key="route.path" />
          <template #fallback>
            <RouteSkeleton />
          </template>
        </Suspense>
      </Transition>
    </router-view>
  </main>
</template>
