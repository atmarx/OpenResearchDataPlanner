<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import {
  X,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Server,
  Database,
  Shield,
  Wrench,
  Award,
  Tag
} from 'lucide-vue-next'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'

const router = useRouter()
const configStore = useConfigStore()

// Get acronyms from config
const acronymsConfig = computed(() => configStore.config?.acronyms || {})
const allTerms = computed(() => acronymsConfig.value.acronyms || [])

// State
const searchQuery = ref('')
const selectedCategory = ref(null)
const expandedTerms = ref(new Set())

// Get unique categories
const categories = computed(() => {
  const cats = new Set()
  allTerms.value.forEach(term => {
    if (term.category) cats.add(term.category)
  })
  return Array.from(cats).sort()
})

// Category display info
const categoryInfo = {
  infrastructure: { label: 'Infrastructure', icon: Server, color: 'blue' },
  storage: { label: 'Storage', icon: Database, color: 'green' },
  compliance: { label: 'Compliance', icon: Shield, color: 'amber' },
  tools: { label: 'Tools', icon: Wrench, color: 'purple' },
  programs: { label: 'Programs', icon: Award, color: 'indigo' }
}

// Filtered terms
const filteredTerms = computed(() => {
  let terms = allTerms.value

  // Filter by category
  if (selectedCategory.value) {
    terms = terms.filter(t => t.category === selectedCategory.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    terms = terms.filter(t =>
      t.term.toLowerCase().includes(query) ||
      t.expansion?.toLowerCase().includes(query) ||
      t.short_def?.toLowerCase().includes(query) ||
      t.long_def?.toLowerCase().includes(query)
    )
  }

  return terms
})

// Group terms by category for display
const groupedTerms = computed(() => {
  if (selectedCategory.value) {
    // Single category - no grouping
    return [{ category: selectedCategory.value, terms: filteredTerms.value }]
  }

  // Group by category
  const groups = {}
  filteredTerms.value.forEach(term => {
    const cat = term.category || 'other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(term)
  })

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, terms]) => ({ category, terms }))
})

// Toggle term expansion
function toggleTerm(termId) {
  if (expandedTerms.value.has(termId)) {
    expandedTerms.value.delete(termId)
  } else {
    expandedTerms.value.add(termId)
  }
}

// Get category display info
function getCategoryDisplay(cat) {
  return categoryInfo[cat] || { label: cat, icon: Tag, color: 'gray' }
}

// Get color classes for category
function getCategoryClasses(cat, type = 'bg') {
  const info = getCategoryDisplay(cat)
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  }
  return colorMap[info.color]?.[type] || colorMap.gray[type]
}
</script>

<template>
  <div
    class="min-h-screen transition-colors bg-canvas"
  >
    <!-- Header -->
    <header
      class="border-b sticky top-0 z-10 bg-surface border-border"
    >
      <div class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <BookOpen class="w-5 h-5" />
          </div>
          <h1
            class="text-xl font-semibold text-text"
          >Glossary</h1>
        </div>

        <!-- Search -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search terms..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface border-border text-text placeholder-text-muted"
          />
        </div>

        <!-- Category filters -->
        <div class="flex flex-wrap gap-2 mt-3">
          <button
            @click="selectedCategory = null"
            class="px-3 py-1.5 text-sm rounded-full border transition-colors"
            :class="!selectedCategory
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface border-border text-text-secondary hover:border-border-strong'"
          >
            All ({{ allTerms.length }})
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = selectedCategory === cat ? null : cat"
            class="px-3 py-1.5 text-sm rounded-full border transition-colors flex items-center gap-1.5"
            :class="selectedCategory === cat
              ? `${getCategoryClasses(cat, 'bg')} ${getCategoryClasses(cat, 'text')} ${getCategoryClasses(cat, 'border')}`
              : 'bg-surface border-border text-text-secondary hover:border-border-strong'"
          >
            <component :is="getCategoryDisplay(cat).icon" class="w-3.5 h-3.5" />
            {{ getCategoryDisplay(cat).label }}
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-6">
      <!-- No results -->
      <div
        v-if="filteredTerms.length === 0"
        class="text-center py-12 text-text-muted"
      >
        <BookOpen class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No terms found matching "{{ searchQuery }}"</p>
      </div>

      <!-- Terms list -->
      <div v-else class="space-y-8">
        <div v-for="group in groupedTerms" :key="group.category">
          <!-- Category header -->
          <div
            v-if="!selectedCategory"
            class="flex items-center gap-2 mb-3"
          >
            <component
              :is="getCategoryDisplay(group.category).icon"
              class="w-5 h-5"
              :class="getCategoryClasses(group.category, 'text')"
            />
            <h2
              class="text-lg font-semibold text-text"
            >
              {{ getCategoryDisplay(group.category).label }}
            </h2>
            <span
              class="text-sm text-text-muted"
            >({{ group.terms.length }})</span>
          </div>

          <!-- Terms -->
          <div class="space-y-2">
            <div
              v-for="term in group.terms"
              :key="term.term"
              class="rounded-lg border overflow-hidden bg-surface border-border"
            >
              <!-- Term header -->
              <button
                @click="toggleTerm(term.term)"
                class="w-full px-4 py-3 flex items-start justify-between text-left transition-colors hover:bg-surface-alt"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      class="font-semibold text-text"
                    >
                      {{ term.display || term.term }}
                    </span>
                    <span
                      v-if="term.expansion"
                      class="text-sm text-text-muted"
                    >
                      ({{ term.expansion }})
                    </span>
                  </div>
                  <p
                    class="text-sm mt-1 text-text-secondary"
                  >
                    <AnnotatedText :text="term.short_def" />
                  </p>
                </div>
                <component
                  :is="expandedTerms.has(term.term) ? ChevronUp : ChevronDown"
                  class="w-5 h-5 text-text-muted flex-shrink-0 mt-1"
                />
              </button>

              <!-- Expanded content -->
              <div
                v-if="expandedTerms.has(term.term)"
                class="px-4 pb-4 border-t border-border bg-surface-alt"
              >
                <!-- Long definition -->
                <div v-if="term.long_def" class="mt-3">
                  <p
                    class="text-sm whitespace-pre-line text-text-secondary"
                  >
                    <AnnotatedText :text="term.long_def" />
                  </p>
                </div>

                <!-- Examples -->
                <div v-if="term.examples?.length" class="mt-4">
                  <h4
                    class="text-xs font-medium uppercase tracking-wide mb-2 text-text-muted"
                  >
                    Examples
                  </h4>
                  <ul class="space-y-1">
                    <li
                      v-for="(example, idx) in term.examples"
                      :key="idx"
                      class="text-sm flex items-start gap-2 text-text-secondary"
                    >
                      <span class="text-text-muted">•</span>
                      {{ example }}
                    </li>
                  </ul>
                </div>

                <!-- Related terms -->
                <div v-if="term.related?.length" class="mt-4">
                  <h4
                    class="text-xs font-medium uppercase tracking-wide mb-2 text-text-muted"
                  >
                    Related
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="related in term.related"
                      :key="related"
                      @click="searchQuery = related; selectedCategory = null"
                      class="px-2 py-1 text-xs rounded bg-surface-alt text-text-secondary hover:bg-border"
                    >
                      {{ related }}
                    </button>
                  </div>
                </div>

                <!-- See also / external links -->
                <div v-if="term.see_also?.length" class="mt-4">
                  <h4
                    class="text-xs font-medium uppercase tracking-wide mb-2 text-text-muted"
                  >
                    Learn More
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <a
                      v-for="link in term.see_also"
                      :key="link.label"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-primary text-on-primary hover:opacity-90"
                    >
                      {{ link.label }}
                      <ExternalLink v-if="link.url" class="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
