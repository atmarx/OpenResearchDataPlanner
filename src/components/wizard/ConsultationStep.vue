<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { Shield, Mail, ExternalLink, ArrowLeft } from 'lucide-vue-next'

const emit = defineEmits(['back'])

const configStore = useConfigStore()
const sessionStore = useSessionStore()

const tier = computed(() =>
  configStore.tiersBySlug[sessionStore.selectedTier]
)

const consultationEmail = computed(() =>
  tier.value?.consultation_contact ||
  configStore.config?.meta?.contact?.security
)

const consultationUrl = computed(() =>
  configStore.config?.meta?.contact?.consultation_url
)
</script>

<template>
  <div class="p-8">
    <div class="max-w-2xl mx-auto text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Shield class="w-8 h-8 text-red-600" />
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Consultation Required
      </h2>

      <div class="bg-red-50 rounded-lg p-6 mb-8 text-left">
        <h3 class="font-semibold text-red-900 mb-2">
          {{ tier?.name }} Data Classification
        </h3>
        <p class="text-red-800 whitespace-pre-line">
          {{ tier?.consultation_message }}
        </p>
      </div>

      <p class="text-gray-600 mb-8">
        Projects at this security tier require custom infrastructure and pricing
        that cannot be estimated through this self-service tool. Our security
        team will work with you to:
      </p>

      <ul class="text-left space-y-3 mb-8 max-w-md mx-auto">
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-600 text-sm font-medium">1</span>
          </span>
          <span class="text-gray-700">
            Assess your specific security and compliance requirements
          </span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-600 text-sm font-medium">2</span>
          </span>
          <span class="text-gray-700">
            Design an appropriate secure enclave configuration
          </span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-600 text-sm font-medium">3</span>
          </span>
          <span class="text-gray-700">
            Provide a detailed cost estimate for your proposal
          </span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-600 text-sm font-medium">4</span>
          </span>
          <span class="text-gray-700">
            Help draft appropriate DMP language for your grant
          </span>
        </li>
      </ul>

      <!-- Contact options -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <a
          v-if="consultationEmail"
          :href="'mailto:' + consultationEmail + '?subject=Secure%20Enclave%20Consultation%20Request'"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Mail class="w-5 h-5" />
          Email {{ consultationEmail }}
        </a>

        <a
          v-if="consultationUrl"
          :href="consultationUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Schedule Consultation
          <ExternalLink class="w-5 h-5" />
        </a>
      </div>

      <p class="text-sm text-gray-500 mb-8">
        Please allow 4-8 weeks lead time for secure enclave provisioning.
      </p>

      <!-- Back button -->
      <button
        @click="emit('back')"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to tier selection
      </button>
    </div>
  </div>
</template>
