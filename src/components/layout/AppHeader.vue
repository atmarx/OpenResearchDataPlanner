<script setup>
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { computed } from 'vue'

const configStore = useConfigStore()
const sessionStore = useSessionStore()

const institutionName = computed(() =>
  configStore.config?.meta?.institution?.name || 'Research Institution'
)

const siteTitle = computed(() =>
  configStore.config?.meta?.site?.title || 'Research Data Planner'
)

function handleReset() {
  if (sessionStore.hasUnsavedChanges) {
    if (confirm('This will clear all your current selections. Are you sure?')) {
      sessionStore.reset()
    }
  } else {
    sessionStore.reset()
  }
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ siteTitle }}
        </h1>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">
          {{ institutionName }}
        </span>

        <button
          v-if="sessionStore.hasUnsavedChanges"
          @click="handleReset"
          class="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Start over
        </button>
      </div>
    </div>
  </header>
</template>
