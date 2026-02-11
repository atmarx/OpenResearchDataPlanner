<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
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
const preferencesStore = usePreferencesStore()

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
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <BookOpen class="w-5 h-5" />
          </div>
          <h1
            class="text-xl font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >Glossary</h1>
        </div>

        <!-- Search -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search terms..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="preferencesStore.darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-900'"
          />
        </div>

        <!-- Category filters -->
        <div class="flex flex-wrap gap-2 mt-3">
          <button
            @click="selectedCategory = null"
            class="px-3 py-1.5 text-sm rounded-full border transition-colors"
            :class="!selectedCategory
              ? (preferencesStore.darkMode ? 'bg-white text-gray-900 border-white' : 'bg-gray-900 text-white border-gray-900')
              : (preferencesStore.darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')"
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
              : (preferencesStore.darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')"
          >
            <component :is="getCategoryDisplay(cat).icon" class="w-3.5 h-3.5" />
            {{ getCategoryDisplay(cat).label }}
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- No results -->
      <div
        v-if="filteredTerms.length === 0"
        class="text-center py-12"
        :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
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
              class="text-lg font-semibold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >
              {{ getCategoryDisplay(group.category).label }}
            </h2>
            <span
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >({{ group.terms.length }})</span>
          </div>

          <!-- Terms -->
          <div class="space-y-2">
            <div
              v-for="term in group.terms"
              :key="term.term"
              class="rounded-lg border overflow-hidden"
              :class="preferencesStore.darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'"
            >
              <!-- Term header -->
              <button
                @click="toggleTerm(term.term)"
                class="w-full px-4 py-3 flex items-start justify-between text-left transition-colors"
                :class="preferencesStore.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      class="font-semibold"
                      :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                    >
                      {{ term.display || term.term }}
                    </span>
                    <span
                      v-if="term.expansion"
                      class="text-sm"
                      :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                    >
                      ({{ term.expansion }})
                    </span>
                  </div>
                  <p
                    class="text-sm mt-1"
                    :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
                  >
                    <AnnotatedText :text="term.short_def" />
                  </p>
                </div>
                <component
                  :is="expandedTerms.has(term.term) ? ChevronUp : ChevronDown"
                  class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
                />
              </button>

              <!-- Expanded content -->
              <div
                v-if="expandedTerms.has(term.term)"
                class="px-4 pb-4 border-t"
                :class="preferencesStore.darkMode
                  ? 'border-gray-700 bg-gray-700'
                  : 'border-gray-100 bg-gray-50'"
              >
                <!-- Long definition -->
                <div v-if="term.long_def" class="mt-3">
                  <p
                    class="text-sm whitespace-pre-line"
                    :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
                  >
                    <AnnotatedText :text="term.long_def" />
                  </p>
                </div>

                <!-- Examples -->
                <div v-if="term.examples?.length" class="mt-4">
                  <h4
                    class="text-xs font-medium uppercase tracking-wide mb-2"
                    :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                  >
                    Examples
                  </h4>
                  <ul class="space-y-1">
                    <li
                      v-for="(example, idx) in term.examples"
                      :key="idx"
                      class="text-sm flex items-start gap-2"
                      :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
                    >
                      <span class="text-gray-400">•</span>
                      {{ example }}
                    </li>
                  </ul>
                </div>

                <!-- Related terms -->
                <div v-if="term.related?.length" class="mt-4">
                  <h4
                    class="text-xs font-medium uppercase tracking-wide mb-2"
                    :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                  >
                    Related
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="related in term.related"
                      :key="related"
                      @click="searchQuery = related; selectedCategory = null"
                      class="px-2 py-1 text-xs rounded"
                      :class="preferencesStore.darkMode
                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                      {{ related }}
                    </button>
                  </div>
                </div>

                <!-- See also / external links -->
                <div v-if="term.see_also?.length" class="mt-4">
                  <h4
                    class="text-xs font-medium uppercase tracking-wide mb-2"
                    :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
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
                      class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded"
                      :class="preferencesStore.darkMode
                        ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-900'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'"
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
