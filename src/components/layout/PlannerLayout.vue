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
</script>

<template>
  <AppHeader class="relative z-10" />
  <WelcomeBanner class="relative z-10" />

  <main id="main-content" class="flex-1 px-4 sm:px-6 py-8 relative z-10">
    <router-view v-slot="{ Component, route }">
      <!-- Page transition. Two non-obvious requirements, both learned from a
           blank-<main>-on-client-nav bug (every same-layout child→child nav —
           /tier-check → /, /ai card → applet — rendered an empty <main>; a hard
           reload, having no leave phase, masked it):

           1. NO <Suspense>. No route view uses async <script setup> (the only
              async is the lazy () => import(), which vue-router resolves before
              handing us Component). A Suspense wrapping non-async children only
              raced the child swap under mode="out-in" and dropped the enter.

           2. Wrap the dynamic <component> in a stable keyed <div>. <Transition>
              applies its enter/leave classes to its DIRECT child; a bare
              <component :is> swapping under mode="out-in" gave the transition no
              concrete root to track, so the leave never completed and the enter
              never mounted. The keyed <div> is that stable root — verified: the
              blank views render on client nav with the transition kept. -->
      <Transition name="page" mode="out-in">
        <div :key="route.path">
          <component :is="Component" />
        </div>
      </Transition>
    </router-view>
  </main>

  <SlateFooter v-if="!$route.meta.hideCart" class="relative z-10" />
  <AppFooter class="relative z-10" />
</template>
