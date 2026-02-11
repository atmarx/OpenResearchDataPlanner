<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  /**
   * The term data object from acronyms config
   */
  term: {
    type: Object,
    required: true
  },
  /**
   * The actual matched text to display
   */
  displayText: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['click'])
const configStore = useConfigStore()

// Get tooltip delay from config
const tooltipDelay = computed(() => {
  return configStore.config?.acronyms?.annotation_config?.tooltip_delay || 300
})

// Build tooltip content
const tooltipContent = computed(() => {
  if (!props.term) return ''

  let content = ''

  // Add expansion if available
  if (props.term.expansion) {
    content += `<strong>${props.term.expansion}</strong><br>`
  }

  // Add short definition
  if (props.term.short_def) {
    content += props.term.short_def
  }

  return content
})

// Handle click to open glossary
function handleClick() {
  emit('click', props.term)
}
</script>

<template>
  <span
    v-tooltip="{
      content: tooltipContent,
      html: true,
      delay: { show: tooltipDelay, hide: 0 }
    }"
    class="term-highlight"
    @click="handleClick"
  >
    {{ displayText }}
  </span>
</template>

<style scoped>
.term-highlight {
  border-bottom: 1px dotted currentColor;
  cursor: help;
  transition: background-color 0.15s ease;
}

.term-highlight:hover {
  background-color: rgba(59, 130, 246, 0.1);
}
</style>
