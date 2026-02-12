<script setup>
import { ref, computed, watch } from 'vue'
import { usePreferencesStore } from '@/stores/preferencesStore'
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

const preferencesStore = usePreferencesStore()

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
      class="rounded-lg border p-6"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <!-- Question -->
      <h3
        class="text-xl font-semibold mb-2"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        {{ currentQuestion.question }}
      </h3>

      <!-- Help text -->
      <p
        v-if="currentQuestion.helpText"
        class="mb-4"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        {{ currentQuestion.helpText }}
      </p>

      <!-- Learn more expandable -->
      <div v-if="currentQuestion.learnMore" class="mb-4">
        <button
          @click="showLearnMore = !showLearnMore"
          class="flex items-center gap-2 text-sm font-medium"
          :class="preferencesStore.darkMode
            ? 'text-blue-400 hover:text-blue-300'
            : 'text-blue-600 hover:text-blue-700'"
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
          class="mt-3 p-4 rounded-lg text-sm whitespace-pre-line"
          :class="preferencesStore.darkMode
            ? 'bg-blue-900/30 text-blue-200'
            : 'bg-blue-50 text-blue-900'"
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
          class="w-full p-4 rounded-lg border text-left transition-colors group"
          :class="preferencesStore.darkMode
            ? 'bg-gray-700 border-gray-600 hover:border-blue-500 hover:bg-gray-600'
            : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <span
                class="font-medium"
                :class="preferencesStore.darkMode
                  ? 'text-white group-hover:text-blue-400'
                  : 'text-gray-900 group-hover:text-blue-700'"
              >
                {{ option.label }}
              </span>
              <p
                v-if="option.description"
                class="mt-1 text-sm"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ option.description }}
              </p>
            </div>
            <ArrowRight
              class="w-5 h-5 flex-shrink-0 ml-3"
              :class="preferencesStore.darkMode
                ? 'text-gray-500 group-hover:text-blue-400'
                : 'text-gray-400 group-hover:text-blue-600'"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Back button (when there's history) -->
    <div v-if="history.length > 0 && !isComplete" class="flex">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-sm"
        :class="preferencesStore.darkMode
          ? 'text-gray-400 hover:text-gray-300'
          : 'text-gray-500 hover:text-gray-700'"
      >
        <ArrowLeft class="w-4 h-4" />
        Go back
      </button>
    </div>

    <!-- Completion State -->
    <slot v-if="isComplete" name="complete" :output="output" :flags="flags" :answers="answers" />
  </div>
</template>
