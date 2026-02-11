<script setup>
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import TermTooltip from './TermTooltip.vue'

const props = defineProps({
  /**
   * The text content to annotate
   */
  text: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['term-click'])
const configStore = useConfigStore()

// Get annotation config
const annotationConfig = computed(() => {
  return configStore.config?.acronyms?.annotation_config || {}
})

// Check if annotation is enabled
const isEnabled = computed(() => {
  return annotationConfig.value.enabled !== false
})

// Get all terms as a map for quick lookup
const termsMap = computed(() => {
  const terms = configStore.config?.acronyms?.acronyms || []
  const map = new Map()

  for (const term of terms) {
    // Use the term itself as key
    map.set(term.term.toLowerCase(), term)

    // Also map the display form if different
    if (term.display && term.display.toLowerCase() !== term.term.toLowerCase()) {
      map.set(term.display.toLowerCase(), term)
    }
  }

  return map
})

// Build regex pattern for all terms
const termPattern = computed(() => {
  if (!isEnabled.value) return null

  const terms = configStore.config?.acronyms?.acronyms || []
  if (terms.length === 0) return null

  // Get all searchable terms (term and display variants)
  const searchTerms = []
  for (const term of terms) {
    searchTerms.push(escapeRegex(term.term))
    if (term.display && term.display !== term.term) {
      searchTerms.push(escapeRegex(term.display))
    }
  }

  // Sort by length (longest first) to match longer terms first
  searchTerms.sort((a, b) => b.length - a.length)

  // Build pattern with word boundaries if configured
  const wordBoundary = annotationConfig.value.word_boundary !== false
  const prefix = wordBoundary ? '\\b' : ''
  const suffix = wordBoundary ? '\\b' : ''

  const flags = annotationConfig.value.case_sensitive ? 'g' : 'gi'

  return new RegExp(`${prefix}(${searchTerms.join('|')})${suffix}`, flags)
})

// Parse text and create annotated segments
const segments = computed(() => {
  if (!isEnabled.value || !termPattern.value || !props.text) {
    return [{ type: 'text', content: props.text }]
  }

  const result = []
  const text = props.text
  const pattern = termPattern.value

  // Track how many times each term appears (for max_per_term limit)
  const termCounts = new Map()
  const maxPerTerm = annotationConfig.value.max_per_term || 3

  let lastIndex = 0
  let match

  // Reset pattern lastIndex
  pattern.lastIndex = 0

  while ((match = pattern.exec(text)) !== null) {
    const matchedText = match[0]
    const termKey = matchedText.toLowerCase()
    const termData = termsMap.value.get(termKey)

    // Check max_per_term limit
    const count = termCounts.get(termKey) || 0
    if (count >= maxPerTerm) {
      continue
    }
    termCounts.set(termKey, count + 1)

    // Add text before match
    if (match.index > lastIndex) {
      result.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      })
    }

    // Add annotated term
    result.push({
      type: 'term',
      content: matchedText,
      term: termData
    })

    lastIndex = match.index + matchedText.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      type: 'text',
      content: text.slice(lastIndex)
    })
  }

  return result
})

// Escape special regex characters
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Handle term click
function handleTermClick(term) {
  emit('term-click', term)
}
</script>

<template>
  <span class="annotated-text">
    <template v-for="(segment, index) in segments" :key="index">
      <span v-if="segment.type === 'text'">{{ segment.content }}</span>
      <TermTooltip
        v-else
        :term="segment.term"
        :display-text="segment.content"
        @click="handleTermClick(segment.term)"
      />
    </template>
  </span>
</template>

<style scoped>
.annotated-text {
  /* Preserve whitespace and line breaks */
  white-space: inherit;
}
</style>
