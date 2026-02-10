<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

const props = defineProps({
  steps: {
    type: Array,
    required: true
    // Array of { id, label, icon? }
  },
  currentStep: {
    type: String,
    required: true
  },
  completedSteps: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['navigate'])

const currentIndex = computed(() =>
  props.steps.findIndex(s => s.id === props.currentStep)
)

function getStepStatus(step, index) {
  if (props.completedSteps.includes(step.id)) {
    return 'completed'
  }
  if (step.id === props.currentStep) {
    return 'current'
  }
  return 'upcoming'
}

function canNavigateTo(step, index) {
  // Can always go back to completed steps
  if (props.completedSteps.includes(step.id)) {
    return true
  }
  // Can go to current step
  if (step.id === props.currentStep) {
    return true
  }
  // Cannot skip ahead
  return false
}

function handleClick(step, index) {
  if (canNavigateTo(step, index)) {
    emit('navigate', step.id)
  }
}
</script>

<template>
  <nav aria-label="Progress" class="mb-8">
    <ol class="flex items-start justify-between">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="relative flex-1 flex flex-col items-center"
      >
        <!-- Connector line -->
        <div
          v-if="index < steps.length - 1"
          class="absolute top-4 left-1/2 right-0 h-0.5 -translate-y-1/2"
          style="width: calc(100% - 1rem); left: calc(50% + 1rem);"
          :class="[
            completedSteps.includes(step.id) ? 'bg-blue-600' : 'bg-gray-200'
          ]"
          aria-hidden="true"
        />

        <!-- Step indicator -->
        <button
          @click="handleClick(step, index)"
          :disabled="!canNavigateTo(step, index)"
          class="group relative flex flex-col items-center"
          :class="[
            canNavigateTo(step, index) ? 'cursor-pointer' : 'cursor-not-allowed'
          ]"
          :aria-current="step.id === currentStep ? 'step' : undefined"
        >
          <!-- Circle -->
          <span
            class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors bg-white"
            :class="[
              getStepStatus(step, index) === 'completed'
                ? 'bg-blue-600 border-blue-600'
                : getStepStatus(step, index) === 'current'
                  ? 'border-blue-600'
                  : 'border-gray-300',
              canNavigateTo(step, index) && getStepStatus(step, index) !== 'completed'
                ? 'group-hover:border-blue-400'
                : ''
            ]"
          >
            <Check
              v-if="getStepStatus(step, index) === 'completed'"
              class="h-4 w-4 text-white"
              aria-hidden="true"
            />
            <span
              v-else
              class="text-sm font-medium"
              :class="[
                getStepStatus(step, index) === 'current'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </span>
          </span>

          <!-- Label below circle -->
          <span
            class="mt-2 text-xs font-medium text-center hidden sm:block"
            :class="[
              getStepStatus(step, index) === 'completed'
                ? 'text-blue-600'
                : getStepStatus(step, index) === 'current'
                  ? 'text-blue-600'
                  : 'text-gray-500'
            ]"
          >
            {{ step.label }}
          </span>
        </button>
      </li>
    </ol>
  </nav>
</template>
