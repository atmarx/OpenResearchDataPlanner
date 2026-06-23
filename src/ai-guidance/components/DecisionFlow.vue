<script setup>
import { ref, computed, watch } from 'vue'
import {
  ArrowRight,
  ArrowLeft,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next'

const props = defineProps({
  // Array of questions with options
  questions: {
    type: Array,
    required: true
    /*
    Format:
    [
      {
        id: 'q1',
        question: 'What are you trying to do?',
        helpText: 'Optional explanation',
        learnMore: { title: 'Learn more', content: '...' },
        options: [
          {
            value: 'option1',
            label: 'Option 1',
            description: 'Optional description',
            next: 'q2' | 'complete',
            setsOutput: { key: 'value' },
            setsFlags: ['flag1'],
            clearsFlags: ['flag2']
          }
        ]
      }
    ]
    */
  },
  // Initial question ID (defaults to first)
  startQuestion: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['complete', 'update:answers'])

// State
const currentQuestionId = ref(props.startQuestion || props.questions[0]?.id)
const answers = ref({})
const output = ref({})
const flags = ref([])
const showLearnMore = ref(false)
const isComplete = ref(false)

// Current question object
const currentQuestion = computed(() => {
  return props.questions.find(q => q.id === currentQuestionId.value) || null
})

// Answer history for back navigation
const history = ref([])

// Select an option
function selectOption(option) {
  // Record answer
  answers.value[currentQuestionId.value] = option.value
  history.value.push(currentQuestionId.value)

  // Apply output values
  if (option.setsOutput) {
    output.value = { ...output.value, ...option.setsOutput }
  }

  // Apply flags
  if (option.setsFlags) {
    flags.value = [...new Set([...flags.value, ...option.setsFlags])]
  }

  // Clear flags
  if (option.clearsFlags) {
    flags.value = flags.value.filter(f => !option.clearsFlags.includes(f))
  }

  // Hide learn more when moving on
  showLearnMore.value = false

  // Navigate
  if (option.next === 'complete') {
    isComplete.value = true
    emit('complete', {
      answers: answers.value,
      output: output.value,
      flags: flags.value
    })
  } else if (option.next) {
    currentQuestionId.value = option.next
  }
}

// Go back one question
function goBack() {
  if (history.value.length > 0) {
    const prevId = history.value.pop()
    // Remove the answer for the current question
    delete answers.value[currentQuestionId.value]
    currentQuestionId.value = prevId
    isComplete.value = false
    showLearnMore.value = false
  }
}

// Reset flow
function reset() {
  currentQuestionId.value = props.startQuestion || props.questions[0]?.id
  answers.value = {}
  output.value = {}
  flags.value = []
  history.value = []
  isComplete.value = false
  showLearnMore.value = false
}

// Expose reset method
defineExpose({ reset })

// Emit answers on change
watch(answers, (val) => {
  emit('update:answers', val)
}, { deep: true })
</script>

<template>
  <div class="space-y-6">
    <!-- Question Card -->
    <div
      v-if="currentQuestion && !isComplete"
      class="rounded-lg border p-6 bg-surface border-border"
    >
      <!-- Question -->
      <h3
        class="text-xl font-semibold mb-2 text-text"
      >
        {{ currentQuestion.question }}
      </h3>

      <!-- Help text -->
      <p
        v-if="currentQuestion.helpText"
        class="mb-4 text-text-secondary"
      >
        {{ currentQuestion.helpText }}
      </p>

      <!-- Learn more expandable -->
      <div v-if="currentQuestion.learnMore" class="mb-4">
        <button
          @click="showLearnMore = !showLearnMore"
          class="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80"
        >
          <Info class="w-4 h-4" />
          {{ currentQuestion.learnMore.title || 'Learn more' }}
          <component
            :is="showLearnMore ? ChevronUp : ChevronDown"
            class="w-4 h-4"
          />
        </button>
        <div
          v-if="showLearnMore"
          class="mt-3 p-4 rounded-lg text-sm whitespace-pre-line bg-primary text-on-primary"
        >
          {{ currentQuestion.learnMore.content }}
        </div>
      </div>

      <!-- Options -->
      <div class="space-y-3">
        <button
          v-for="option in currentQuestion.options"
          :key="option.value"
          @click="selectOption(option)"
          class="w-full p-4 rounded-lg border text-left transition-colors group bg-canvas border-border hover:border-primary hover:bg-surface-alt"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <span
                class="font-medium text-text group-hover:text-primary"
              >
                {{ option.label }}
              </span>
              <p
                v-if="option.description"
                class="mt-1 text-sm text-text-muted"
              >
                {{ option.description }}
              </p>
            </div>
            <ArrowRight
              class="w-5 h-5 flex-shrink-0 ml-3 text-text-muted group-hover:text-primary"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Back button (when there's history) -->
    <div v-if="history.length > 0 && !isComplete" class="flex">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft class="w-4 h-4" />
        Go back
      </button>
    </div>

    <!-- Completion State -->
    <slot v-if="isComplete" name="complete" :output="output" :flags="flags" :answers="answers" />
  </div>
</template>
