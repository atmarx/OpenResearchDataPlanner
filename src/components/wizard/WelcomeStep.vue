<script setup>
import { useConfigStore } from '@/stores/configStore'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const configStore = useConfigStore()
</script>

<template>
  <div class="p-8 md:p-12">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ configStore.config?.meta?.site?.title || 'Research Data Planner' }}
      </h1>

      <p class="text-lg text-gray-600 mb-8">
        {{ configStore.config?.meta?.site?.tagline || 'Plan your data infrastructure and budget for grant proposals' }}
      </p>

      <div class="bg-blue-50 rounded-lg p-6 mb-8 text-left">
        <h2 class="text-lg font-semibold text-blue-900 mb-3">
          What this tool does:
        </h2>
        <ul class="space-y-2 text-blue-800">
          <li class="flex items-start gap-2">
            <span class="text-blue-500 mt-1">1.</span>
            <span>Helps you choose the right data security tier for your research</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-500 mt-1">2.</span>
            <span>Shows available services and their costs based on your tier</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-500 mt-1">3.</span>
            <span>Calculates budget estimates including long-term data retention</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-500 mt-1">4.</span>
            <span>Generates Data Management Plan text for your grant proposal</span>
          </li>
        </ul>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">
          Before you begin:
        </h2>
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-gray-400">&bull;</span>
            <span>Know what type of data you'll be working with (public, proprietary, regulated)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-gray-400">&bull;</span>
            <span>Have a rough idea of your grant period (start/end dates)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-gray-400">&bull;</span>
            <span>Consider your compute and storage needs</span>
          </li>
        </ul>
      </div>

      <p class="text-sm text-gray-500 mb-8">
        Your progress is automatically saved in your browser.
        You can close this page and return later.
      </p>

      <button
        @click="emit('next')"
        class="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Get Started
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
