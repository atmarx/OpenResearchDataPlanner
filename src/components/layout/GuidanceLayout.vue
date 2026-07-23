<script setup>
// AI-guidance shell: header (with cross-nav back to the planner) + the
// AI-disclosure WelcomeBanner + footer, but deliberately NO slate cart — the
// cart is intended to disappear on /ai/* (slate data still persists in Pinia).
// Multi-root fragment, same flex/z-10 contract as PlannerLayout.
//
// <main> carries NO px/py here: the /ai applets self-pad via their own
// min-h-screen / max-w / px / py. The Transition + Suspense boundary still
// wraps only the nested <router-view>.
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import WelcomeBanner from '@/components/layout/WelcomeBanner.vue'
</script>

<template>
  <AppHeader class="relative z-10" />
  <WelcomeBanner class="relative z-10" />

  <main id="main-content" class="flex-1 relative z-10">
    <router-view v-slot="{ Component, route }">
      <!-- No <Suspense>, and the dynamic component is wrapped in a stable keyed
           <div> so <Transition mode="out-in"> has one concrete root to track —
           without it, clicking an applet card (/ai → /ai/:applet client nav) left
           a blank <main>. See PlannerLayout for the full note on both. -->
      <Transition name="page" mode="out-in">
        <div :key="route.path">
          <component :is="Component" />
        </div>
      </Transition>
    </router-view>
  </main>

  <AppFooter class="relative z-10" />
</template>
