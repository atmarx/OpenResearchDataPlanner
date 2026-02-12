<script setup>
import { ref } from 'vue'
import { useWorkbenchStore } from '@/stores/workbenchStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { Lock, User, AlertCircle } from 'lucide-vue-next'

const emit = defineEmits(['authenticated'])

const workbenchStore = useWorkbenchStore()
const preferencesStore = usePreferencesStore()

const staffName = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  error.value = ''

  if (!staffName.value.trim()) {
    error.value = 'Please enter your name'
    return
  }

  if (!password.value) {
    error.value = 'Please enter the password'
    return
  }

  isSubmitting.value = true

  // Small delay for UX
  await new Promise(resolve => setTimeout(resolve, 300))

  const success = workbenchStore.authenticate(password.value, staffName.value)

  if (success) {
    emit('authenticated')
  } else {
    error.value = 'Invalid password'
    password.value = ''
  }

  isSubmitting.value = false
}
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <div
      class="w-full max-w-sm rounded-xl shadow-lg border p-6"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <!-- Header -->
      <div class="text-center mb-6">
        <div
          class="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          :class="preferencesStore.darkMode
            ? 'bg-indigo-900/50 text-indigo-400'
            : 'bg-indigo-100 text-indigo-600'"
        >
          <Lock class="w-7 h-7" />
        </div>
        <h1
          class="text-xl font-semibold"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Support Workbench
        </h1>
        <p
          class="mt-1 text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        >
          For Research IT and Compliance staff
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Staff Name -->
        <div>
          <label
            class="block text-sm font-medium mb-1.5"
            :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-700'"
          >
            Your Name
          </label>
          <div class="relative">
            <User
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
            />
            <input
              v-model="staffName"
              type="text"
              placeholder="e.g., Marco DeVries"
              autocomplete="name"
              class="w-full pl-10 pr-3 py-2 rounded-lg border text-sm"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label
            class="block text-sm font-medium mb-1.5"
            :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-700'"
          >
            Password
          </label>
          <div class="relative">
            <Lock
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
            />
            <input
              v-model="password"
              type="password"
              placeholder="Enter workbench password"
              autocomplete="current-password"
              class="w-full pl-10 pr-3 py-2 rounded-lg border text-sm"
              :class="preferencesStore.darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'"
            />
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="flex items-center gap-2 text-sm text-red-500"
        >
          <AlertCircle class="w-4 h-4" />
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2.5 rounded-lg font-medium text-sm transition-colors"
          :class="[
            isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : '',
            preferencesStore.darkMode
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          ]"
        >
          {{ isSubmitting ? 'Signing in...' : 'Enter Workbench' }}
        </button>
      </form>

      <!-- Footer -->
      <p
        class="mt-4 text-xs text-center"
        :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
      >
        Contact your IT administrator if you need access.
      </p>
    </div>
  </div>
</template>
