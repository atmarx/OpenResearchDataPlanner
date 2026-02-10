<script setup>
import { useConfigStore } from '@/stores/configStore'
import { computed } from 'vue'

const configStore = useConfigStore()

const contactEmail = computed(() =>
  configStore.config?.meta?.contact?.general
)

const templateVersion = computed(() =>
  configStore.config?.meta?.version || '1.0.0'
)

const consultationUrl = computed(() =>
  configStore.config?.meta?.contact?.consultation_url
)
</script>

<template>
  <footer class="bg-white border-t border-gray-200 px-6 py-4">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <div class="flex items-center gap-4">
          <span v-if="contactEmail">
            Questions?
            <a
              :href="'mailto:' + contactEmail"
              class="text-blue-600 hover:underline"
            >
              {{ contactEmail }}
            </a>
          </span>

          <a
            v-if="consultationUrl"
            :href="consultationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline"
          >
            Schedule consultation
          </a>
        </div>

        <div class="text-gray-400">
          Template v{{ templateVersion }}
        </div>
      </div>
    </div>
  </footer>
</template>
