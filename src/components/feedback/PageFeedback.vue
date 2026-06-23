<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useFeedback } from '@/composables/useFeedback'
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  MessageSquare,
  Send
} from 'lucide-vue-next'

const props = defineProps({
  pageId: {
    type: String,
    default: null
  },
  prompt: {
    type: String,
    default: 'Was this helpful?'
  },
  metadata: {
    type: Object,
    default: () => ({})
  },
  variant: {
    type: String,
    default: 'card',
    validator: (v) => ['card', 'inline'].includes(v)
  }
})

const emit = defineEmits(['feedback'])

const route = useRoute()
const preferencesStore = usePreferencesStore()
const { feedbackConfig, submitFeedback } = useFeedback()

// State machine: idle → voted → expanded → submitted
const state = ref('idle')
const sentiment = ref(null)
const comment = ref('')
const contactName = ref('')
const contactEmail = ref('')
const submitting = ref(false)

const resolvedPageId = computed(() => props.pageId || route.path)

async function vote(value) {
  sentiment.value = value
  state.value = 'voted'

  emit('feedback', { sentiment: value })

  // Fire-and-forget initial sentiment POST
  await submitFeedback({
    page: resolvedPageId.value,
    sentiment: value,
    metadata: props.metadata
  })
}

function expand() {
  state.value = 'expanded'
}

async function submitComment() {
  if (submitting.value) return
  submitting.value = true

  await submitFeedback({
    page: resolvedPageId.value,
    sentiment: sentiment.value,
    comment: comment.value || undefined,
    contactName: contactName.value || undefined,
    contactEmail: contactEmail.value || undefined,
    metadata: props.metadata
  })

  state.value = 'submitted'
  submitting.value = false
}

function thumbClasses(value) {
  const isDark = preferencesStore.darkMode
  const isSelected = sentiment.value === value

  if (isSelected && value === 'up') {
    return isDark
      ? 'bg-green-900/50 border-green-700 text-green-400'
      : 'bg-green-100 border-green-300 text-green-700'
  }
  if (isSelected && value === 'down') {
    return isDark
      ? 'bg-red-900/50 border-red-700 text-red-400'
      : 'bg-red-100 border-red-300 text-red-700'
  }

  return 'border-border-strong text-text-muted hover:border-border-strong hover:text-text-secondary'
}
</script>

<template>
  <div v-if="feedbackConfig.enabled">
    <!-- Card variant -->
    <div
      v-if="variant === 'card'"
      class="p-4 rounded-lg border bg-surface border-border"
    >
      <!-- Idle + Voted: show buttons -->
      <template v-if="state === 'idle' || state === 'voted'">
        <p class="text-sm mb-3 text-text-secondary">
          {{ prompt }}
        </p>
        <div class="flex items-center gap-3">
          <button
            @click="vote('up')"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
            :class="thumbClasses('up')"
            :disabled="state === 'voted'"
          >
            <ThumbsUp class="w-4 h-4" />
            Helpful
          </button>
          <button
            @click="vote('down')"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
            :class="thumbClasses('down')"
            :disabled="state === 'voted'"
          >
            <ThumbsDown class="w-4 h-4" />
            Not helpful
          </button>

          <!-- Add comment link (after voting) -->
          <button
            v-if="state === 'voted'"
            @click="expand"
            class="flex items-center gap-1.5 text-sm ml-2 transition-colors text-text-muted hover:text-text-secondary"
          >
            <MessageSquare class="w-3.5 h-3.5" />
            Add a comment
          </button>
        </div>
      </template>

      <!-- Expanded: comment form -->
      <template v-if="state === 'expanded'">
        <div class="flex items-center gap-2 mb-3">
          <component
            :is="sentiment === 'up' ? ThumbsUp : ThumbsDown"
            class="w-4 h-4"
            :class="sentiment === 'up'
              ? (preferencesStore.darkMode ? 'text-green-400' : 'text-green-600')
              : (preferencesStore.darkMode ? 'text-red-400' : 'text-red-600')"
          />
          <p class="text-sm text-text-secondary">
            Thanks! Anything you'd like to add?
          </p>
        </div>

        <textarea
          v-model="comment"
          rows="3"
          placeholder="What worked well? What could be improved?"
          class="w-full px-3 py-2 rounded-lg border text-sm resize-none mb-3 bg-surface border-border-strong text-text placeholder-text-muted"
        />

        <div class="flex gap-3 mb-3">
          <input
            v-model="contactName"
            type="text"
            placeholder="Name (optional)"
            class="flex-1 px-3 py-2 rounded-lg border text-sm bg-surface border-border-strong text-text placeholder-text-muted"
          />
          <input
            v-model="contactEmail"
            type="email"
            placeholder="Email (optional)"
            class="flex-1 px-3 py-2 rounded-lg border text-sm bg-surface border-border-strong text-text placeholder-text-muted"
          />
        </div>

        <div class="flex justify-end">
          <button
            @click="submitComment"
            :disabled="submitting"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-on-primary hover:bg-primary-dark"
          >
            <Send class="w-4 h-4" />
            {{ submitting ? 'Sending...' : 'Submit' }}
          </button>
        </div>
      </template>

      <!-- Submitted: thank you -->
      <template v-if="state === 'submitted'">
        <div class="flex items-center gap-2">
          <CheckCircle
            class="w-5 h-5"
            :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-600'"
          />
          <p class="text-sm font-medium text-text-secondary">
            Thanks for your feedback!
          </p>
        </div>
      </template>
    </div>

    <!-- Inline variant (minimal, no border) -->
    <div
      v-if="variant === 'inline'"
      class="pt-4 mt-4 border-t border-border"
    >
      <template v-if="state === 'idle' || state === 'voted'">
        <div class="flex items-center gap-3">
          <p class="text-sm text-text-muted">
            {{ prompt }}
          </p>
          <button
            @click="vote('up')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors"
            :class="thumbClasses('up')"
            :disabled="state === 'voted'"
          >
            <ThumbsUp class="w-3.5 h-3.5" />
            Yes
          </button>
          <button
            @click="vote('down')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors"
            :class="thumbClasses('down')"
            :disabled="state === 'voted'"
          >
            <ThumbsDown class="w-3.5 h-3.5" />
            No
          </button>
          <button
            v-if="state === 'voted'"
            @click="expand"
            class="flex items-center gap-1.5 text-sm transition-colors text-text-muted hover:text-text-secondary"
          >
            <MessageSquare class="w-3.5 h-3.5" />
            Comment
          </button>
        </div>
      </template>

      <template v-if="state === 'expanded'">
        <div class="space-y-3">
          <textarea
            v-model="comment"
            rows="2"
            placeholder="What could be improved?"
            class="w-full px-3 py-2 rounded-lg border text-sm resize-none bg-surface border-border-strong text-text placeholder-text-muted"
          />
          <div class="flex gap-3">
            <input
              v-model="contactName"
              type="text"
              placeholder="Name (optional)"
              class="flex-1 px-3 py-2 rounded-lg border text-sm bg-surface border-border-strong text-text placeholder-text-muted"
            />
            <input
              v-model="contactEmail"
              type="email"
              placeholder="Email (optional)"
              class="flex-1 px-3 py-2 rounded-lg border text-sm bg-surface border-border-strong text-text placeholder-text-muted"
            />
            <button
              @click="submitComment"
              :disabled="submitting"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-on-primary hover:bg-primary-dark"
            >
              <Send class="w-3.5 h-3.5" />
              {{ submitting ? '...' : 'Send' }}
            </button>
          </div>
        </div>
      </template>

      <template v-if="state === 'submitted'">
        <div class="flex items-center gap-2">
          <CheckCircle
            class="w-4 h-4"
            :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-600'"
          />
          <p class="text-sm text-text-muted">
            Thanks for your feedback!
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
