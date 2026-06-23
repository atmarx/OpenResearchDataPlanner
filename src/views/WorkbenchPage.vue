<script setup>
import { computed } from 'vue'
import { useWorkbenchStore } from '@/stores/workbenchStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import WorkbenchLogin from '@/components/workbench/WorkbenchLogin.vue'
import WorkbenchDashboard from '@/components/workbench/WorkbenchDashboard.vue'
import { LogOut, User } from 'lucide-vue-next'

const workbenchStore = useWorkbenchStore()
const preferencesStore = usePreferencesStore()

const isAuthenticated = computed(() => workbenchStore.isAuthenticated)

function handleLogout() {
  workbenchStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <!-- Header (only when authenticated) -->
    <header
      v-if="isAuthenticated"
      class="border-b bg-surface border-border"
    >
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-semibold text-text">
            Support Workbench
          </h1>
          <span
            class="px-2 py-0.5 text-xs rounded-full"
            :class="preferencesStore.darkMode
              ? 'bg-indigo-900/50 text-indigo-300'
              : 'bg-indigo-100 text-indigo-700'"
          >
            Staff Access
          </span>
        </div>

        <div class="flex items-center gap-4">
          <!-- Staff Name -->
          <div class="flex items-center gap-2 text-sm">
            <User class="w-4 h-4 text-text-muted" />
            <span class="text-text-secondary">
              {{ workbenchStore.staffName }}
            </span>
          </div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
          >
            <LogOut class="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <WorkbenchLogin
        v-if="!isAuthenticated"
        @authenticated="() => {}"
      />
      <WorkbenchDashboard v-else />
    </main>
  </div>
</template>
