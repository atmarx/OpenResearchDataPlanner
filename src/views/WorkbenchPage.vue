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
  <div class="min-h-screen" :class="preferencesStore.darkMode ? 'bg-gray-900' : 'bg-gray-50'">
    <!-- Header (only when authenticated) -->
    <header
      v-if="isAuthenticated"
      class="border-b"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1
            class="text-lg font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
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
            <User
              class="w-4 h-4"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            />
            <span :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'">
              {{ workbenchStore.staffName }}
            </span>
          </div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            :class="preferencesStore.darkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
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
