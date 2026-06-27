<script setup>
// Near-bare shell: no header, banner, or cart — WorkbenchPage paints its own
// staff header and bg-canvas. The global AppFooter IS kept here, so the
// institutional / accessibility links persist on staff pages too. Otherwise this
// is just the skip-link <main> target plus the page Transition + Suspense
// boundary around the nested <router-view>.
import AppFooter from '@/components/layout/AppFooter.vue'
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

  <AppFooter class="relative z-10" />
</template>
