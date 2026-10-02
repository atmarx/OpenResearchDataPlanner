<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  /**
   * The HTML content to annotate
   */
  html: {
    type: String,
    default: ''
  }
})

const configStore = useConfigStore()
const containerRef = ref(null)

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
    map.set(term.term.toLowerCase(), term)
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

  const searchTerms = []
  for (const term of terms) {
    searchTerms.push(escapeRegex(term.term))
    if (term.display && term.display !== term.term) {
      searchTerms.push(escapeRegex(term.display))
    }
  }

  // Sort by length (longest first) — alternation is first-match, not longest
  searchTerms.sort((a, b) => b.length - a.length)

  const wordBoundary = annotationConfig.value.word_boundary !== false
  const prefix = wordBoundary ? '\\b' : ''
  const suffix = wordBoundary ? '\\b' : ''
  const flags = annotationConfig.value.case_sensitive ? 'g' : 'gi'

  return new RegExp(`${prefix}(${searchTerms.join('|')})${suffix}`, flags)
})

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Post-process the v-html DOM in place: wrap matched terms in spans that carry
// a CSS-only tooltip. Done on the live DOM (not by regex over the HTML string)
// so terms inside tag names/attributes are never touched.
function annotateTextNodes() {
  if (!containerRef.value || !termPattern.value || !isEnabled.value) return

  const pattern = termPattern.value
  const maxPerTerm = annotationConfig.value.max_per_term || 3
  const termCounts = new Map()

  // Walk all text nodes
  const walker = document.createTreeWalker(
    containerRef.value,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  // Collect first, mutate after — replacing nodes mid-walk derails the walker.
  const textNodes = []
  let node
  while ((node = walker.nextNode())) {
    // Skip if parent is already a term highlight
    if (node.parentElement?.classList.contains('term-highlight-html')) continue
    textNodes.push(node)
  }

  // Process each text node
  for (const textNode of textNodes) {
    const text = textNode.textContent
    if (!text.trim()) continue

    pattern.lastIndex = 0
    const matches = []
    let match

    while ((match = pattern.exec(text)) !== null) {
      const matchedText = match[0]
      const termKey = matchedText.toLowerCase()
      const termData = termsMap.value.get(termKey)

      if (!termData) continue

      const count = termCounts.get(termKey) || 0
      if (count >= maxPerTerm) continue
      termCounts.set(termKey, count + 1)

      matches.push({
        index: match.index,
        length: matchedText.length,
        text: matchedText,
        term: termData
      })
    }

    if (matches.length === 0) continue

    // Build replacement fragment
    const fragment = document.createDocumentFragment()
    let lastIndex = 0

    for (const m of matches) {
      // Add text before match
      if (m.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, m.index)))
      }

      // Add annotated span
      const span = document.createElement('span')
      span.className = 'term-highlight-html'
      span.textContent = m.text
      span.setAttribute('data-term', m.term.term)
      span.setAttribute('data-expansion', m.term.expansion || '')
      span.setAttribute('data-definition', m.term.short_def || '')

      // Build tooltip content (plain text only - CSS can't render HTML in attr())
      // Just show the expansion for brevity; users can click for full glossary
      const tooltipText = m.term.expansion || m.term.short_def || m.term.term
      span.setAttribute('data-tooltip', tooltipText)

      fragment.appendChild(span)
      lastIndex = m.index + m.length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
    }

    // Replace the text node
    textNode.parentNode.replaceChild(fragment, textNode)
  }
}

// Run annotation after mount and when html changes. nextTick: the watcher fires
// before the re-render, and v-html then replaces the container's DOM (dropping
// prior spans) — so wait for the patched DOM before walking it.
onMounted(() => {
  nextTick(annotateTextNodes)
})

watch(() => props.html, () => {
  nextTick(annotateTextNodes)
})
</script>

<template>
  <!-- v-html: no sanitizer. Callers pass renderMarkdown() of admin-authored
       config (trusted — see src/lib/markdown.js); never pass user input. -->
  <div ref="containerRef" class="annotated-html" v-html="html"></div>
</template>

<style scoped>
.annotated-html :deep(.term-highlight-html) {
  border-bottom: 1px dotted currentColor;
  cursor: help;
  transition: background-color 0.15s ease;
  position: relative;
}

.annotated-html :deep(.term-highlight-html:hover) {
  background-color: rgba(59, 130, 246, 0.1);
}

/* CSS-only tooltip using data attributes */
.annotated-html :deep(.term-highlight-html::after) {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 0.75rem;
  background: #1f2937;
  color: white;
  font-size: 0.75rem;
  line-height: 1.4;
  border-radius: 0.375rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
  z-index: 50;
  pointer-events: none;
  max-width: 250px;
  white-space: normal;
  text-align: left;
}

.annotated-html :deep(.term-highlight-html:hover::after) {
  opacity: 1;
  visibility: visible;
}

/* Arrow */
.annotated-html :deep(.term-highlight-html::before) {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f2937;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
  z-index: 50;
}

.annotated-html :deep(.term-highlight-html:hover::before) {
  opacity: 1;
  visibility: visible;
}
</style>
