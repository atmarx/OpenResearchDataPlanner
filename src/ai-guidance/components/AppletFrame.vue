<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
  ArrowLeft,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Home
} from 'lucide-vue-next'

const props = defineProps({
  appletId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  coreQuestion: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    default: null
  },
  // Optional: where to go next
  nextApplet: {
    type: String,
    default: null
  },
  // Optional: conditional next based on output
  getNextApplet: {
    type: Function,
    default: null
  },
  // Is the applet complete?
  isComplete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['complete'])

const router = useRouter()
const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

// Feedback state for this applet
const currentFeedback = computed(() => aiStore.feedback[props.appletId])

function handleFeedback(vote) {
  aiStore.setFeedback(props.appletId, vote)
}

function goBack() {
  router.back()
}

function goHome() {
  router.push('/ai')
}

function goToNext() {
  if (props.getNextApplet) {
    const output = aiStore.getAppletOutput(props.appletId)
    const next = props.getNextApplet(output)
    if (next) {
      router.push(`/ai/${next}`)
    }
  } else if (props.nextApplet) {
    router.push(`/ai/${props.nextApplet}`)
  }
}
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="preferencesStore.darkMode ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <!-- Header -->
    <header
      class="border-b sticky top-0 z-10"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="max-w-3xl 2xl:max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Back / Home -->
          <div class="flex items-center gap-2">
            <button
              @click="goBack"
              class="p-2 rounded-lg transition-colors"
              :class="preferencesStore.darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'"
              title="Go back"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <button
              @click="goHome"
              class="p-2 rounded-lg transition-colors"
              :class="preferencesStore.darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'"
              title="AI Guidance Home"
            >
              <Home class="w-5 h-5" />
            </button>
          </div>

          <!-- Title -->
          <div class="flex items-center gap-3">
            <component
              v-if="icon"
              :is="icon"
              class="w-6 h-6"
              :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'"
            />
            <h1
              class="text-lg font-semibold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              {{ title }}
            </h1>
          </div>

          <!-- Complete indicator -->
          <div class="w-20 flex justify-end">
            <CheckCircle
              v-if="isComplete"
              class="w-6 h-6 text-green-500"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-3xl 2xl:max-w-4xl mx-auto px-4 py-8">
      <!-- Core Question -->
      <div
        class="mb-8 p-4 rounded-lg border-l-4"
        :class="preferencesStore.darkMode
          ? 'bg-blue-900/20 border-blue-500 text-blue-200'
          : 'bg-blue-50 border-blue-500 text-blue-900'"
      >
        <p class="text-lg font-medium italic">"{{ coreQuestion }}"</p>
      </div>

      <!-- Applet Content (slot) -->
      <div class="space-y-6">
        <slot />
      </div>

      <!-- Completion Actions -->
      <div v-if="isComplete" class="mt-8 space-y-6">
        <!-- Feedback -->
        <div
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'"
        >
          <p
            class="text-sm mb-3"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            Was this applet helpful?
          </p>
          <div class="flex items-center gap-3">
            <button
              @click="handleFeedback('up')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
              :class="currentFeedback === 'up'
                ? 'bg-green-100 border-green-300 text-green-700'
                : (preferencesStore.darkMode
                  ? 'border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-400'
                  : 'border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600')"
            >
              <ThumbsUp class="w-4 h-4" />
              Helpful
            </button>
            <button
              @click="handleFeedback('down')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
              :class="currentFeedback === 'down'
                ? 'bg-red-100 border-red-300 text-red-700'
                : (preferencesStore.darkMode
                  ? 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400'
                  : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600')"
            >
              <ThumbsDown class="w-4 h-4" />
              Not helpful
            </button>
          </div>
        </div>

        <!-- Next Action -->
        <div v-if="nextApplet || getNextApplet" class="flex justify-end">
          <button
            @click="goToNext"
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
            <ArrowRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
