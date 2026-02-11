<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { Shield, ShieldCheck, ShieldAlert, Lock, Check, HelpCircle, ArrowRight } from 'lucide-vue-next'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

const tiers = computed(() => {
  return (configStore.config?.tiers || []).sort((a, b) => a.sort_order - b.sort_order)
})

const tierIcons = {
  green: ShieldCheck,
  yellow: Shield,
  orange: ShieldAlert,
  red: Lock
}

const tierColors = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    borderSelected: 'border-green-500',
    text: 'text-green-700',
    icon: 'text-green-500',
    ring: 'ring-green-500'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    borderSelected: 'border-yellow-500',
    text: 'text-yellow-700',
    icon: 'text-yellow-500',
    ring: 'ring-yellow-500'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    borderSelected: 'border-orange-500',
    text: 'text-orange-700',
    icon: 'text-orange-500',
    ring: 'ring-orange-500'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    borderSelected: 'border-red-500',
    text: 'text-red-700',
    icon: 'text-red-500',
    ring: 'ring-red-500'
  }
}

function selectTier(tierSlug) {
  sessionStore.setTier(tierSlug)
}

function isSelected(tierSlug) {
  return sessionStore.selectedTier === tierSlug
}

function getColors(color) {
  return tierColors[color] || tierColors.green
}

function getIcon(color) {
  return tierIcons[color] || Shield
}
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h2
        class="text-2xl font-bold mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        Select Your Data Security Tier
      </h2>
      <p :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Choose the tier that best matches the sensitivity of your research data.
        This determines which services are available and any additional requirements.
      </p>

      <!-- Tier finder link -->
      <router-link
        to="/tier-check"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="preferencesStore.darkMode
          ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'"
      >
        <HelpCircle class="w-4 h-4" />
        Not sure which tier? Try the guided questionnaire
        <ArrowRight class="w-4 h-4" />
      </router-link>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <button
        v-for="tier in tiers"
        :key="tier.slug"
        @click="selectTier(tier.slug)"
        class="relative text-left p-6 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="[
          getColors(tier.color).bg,
          isSelected(tier.slug)
            ? getColors(tier.color).borderSelected
            : getColors(tier.color).border,
          `focus:${getColors(tier.color).ring}`
        ]"
      >
        <!-- Selected indicator -->
        <div
          v-if="isSelected(tier.slug)"
          class="absolute top-4 right-4"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center"
            :class="getColors(tier.color).icon.replace('text-', 'bg-')"
          >
            <Check class="w-4 h-4 text-white" />
          </div>
        </div>

        <!-- Tier header -->
        <div class="flex items-center gap-3 mb-3">
          <component
            :is="getIcon(tier.color)"
            class="w-6 h-6"
            :class="getColors(tier.color).icon"
          />
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ tier.name }}
            </h3>
            <span class="text-sm text-gray-600">
              {{ tier.short_name }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-700 mb-3 whitespace-pre-line">
          <AnnotatedText :text="tier.description" />
        </p>

        <!-- Examples -->
        <div class="mb-3">
          <p class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
            Examples:
          </p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li v-for="example in tier.examples" :key="example" class="flex items-start gap-2">
              <span class="text-gray-500">&bull;</span>
              <span>{{ example }}</span>
            </li>
          </ul>
        </div>

        <!-- Consultation required badge -->
        <div
          v-if="tier.consultation_required"
          class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
          :class="[getColors(tier.color).bg, getColors(tier.color).text]"
        >
          <HelpCircle class="w-3 h-3" />
          Requires consultation
        </div>
      </button>
    </div>

    <!-- Help text for selected tier -->
    <div
      v-if="sessionStore.selectedTier"
      class="mt-6 p-4 rounded-lg"
      :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-gray-50'"
    >
      <h3
        class="font-medium mb-2 flex items-center gap-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        <HelpCircle
          class="w-4 h-4"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        />
        About {{ configStore.tiersBySlug[sessionStore.selectedTier]?.name }}
      </h3>
      <p
        class="text-sm whitespace-pre-line"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
      >
        <AnnotatedText :text="configStore.tiersBySlug[sessionStore.selectedTier]?.help_text || ''" />
      </p>
    </div>
  </div>
</template>
