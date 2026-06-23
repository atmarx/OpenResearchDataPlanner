<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Home
} from 'lucide-vue-next'
import PageFeedback from '@/components/feedback/PageFeedback.vue'

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

function handleFeedbackEvent(event) {
  aiStore.setFeedback(props.appletId, event.sentiment)
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
  <div class="min-h-screen transition-colors bg-canvas">
    <!-- Header -->
    <header class="border-b sticky top-0 z-10 bg-surface border-border">
      <div class="max-w-3xl 2xl:max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Back / Home -->
          <div class="flex items-center gap-2">
            <button
              @click="goBack"
              class="p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
              title="Go back"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <button
              @click="goHome"
              class="p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
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
              class="w-6 h-6 text-primary"
            />
            <h1 class="text-lg font-semibold text-text">
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
        class="mb-8 p-4 rounded-lg border-l-4 bg-surface-alt border-primary text-primary"
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
        <PageFeedback
          :page-id="appletId"
          prompt="Was this applet helpful?"
          :metadata="{ appletId, type: 'ai-guidance' }"
          @feedback="handleFeedbackEvent"
        />

        <!-- Next Action -->
        <div v-if="nextApplet || getNextApplet" class="flex justify-end">
          <button
            @click="goToNext"
            class="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Continue
            <ArrowRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
