<script setup>
// Planner shell: full institutional chrome (header, AI-disclosure banner, slate
// cart, footer) wrapped around the nested route's <router-view>. Multi-root
// fragment (no wrapper div) so AppHeader / main / SlateFooter / AppFooter land
// as direct flex children of App.vue's flex-col root — preserving today's
// flex-1 main and the `relative z-10` chrome stack above the hero overlay.
//
// The page Transition + Suspense boundary lives INSIDE <main>, wrapping ONLY
// the nested <router-view>. The chrome (and the #slate-nav-slot host inside
// SlateFooter) stays mounted and outside it. SlateFooter renders AFTER <main>
// so its teleport target resolves later than WizardView's deferred source.
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SlateFooter from '@/components/slate/SlateFooter.vue'
import WelcomeBanner from '@/components/layout/WelcomeBanner.vue'
import RouteSkeleton from '@/components/layout/RouteSkeleton.vue'
</script>

<template>
  <AppHeader class="relative z-10" />
  <WelcomeBanner class="relative z-10" />

  <main id="main-content" class="flex-1 px-4 sm:px-6 py-8 relative z-10">
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

  <SlateFooter v-if="!$route.meta.hideCart" class="relative z-10" />
  <AppFooter class="relative z-10" />
</template>
