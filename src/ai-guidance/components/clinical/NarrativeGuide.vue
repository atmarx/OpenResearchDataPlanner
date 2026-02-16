<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { BookOpen, Check } from 'lucide-vue-next'

const props = defineProps({
  /**
   * Array of section objects with id, title, and content
   */
  sections: {
    type: Array,
    required: true
  }
})

const preferencesStore = usePreferencesStore()

// Track which sections have been scrolled into view
const sectionsRead = ref(new Set())
const activeSection = ref(null)

// Scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Track reading progress with intersection observer
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id
        sectionsRead.value.add(sectionId)
        activeSection.value = sectionId
      }
    })
  }, {
    threshold: 0.5
  })

  // Observe all section elements
  props.sections.forEach(section => {
    const element = document.getElementById(section.id)
    if (element) {
      observer.observe(element)
    }
  })

  // Clean up
  onUnmounted(() => {
    observer.disconnect()
  })
})

const readingProgress = computed(() => {
  return Math.round((sectionsRead.value.size / props.sections.length) * 100)
})
</script>

<template>
  <div class="narrative-guide-container">
    <!-- Sidebar TOC -->
    <aside
      class="narrative-sidebar"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="sticky top-4">
        <div class="flex items-center gap-2 mb-4">
          <BookOpen
            class="w-5 h-5"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
          />
          <h3
            class="font-semibold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >
            Contents
          </h3>
        </div>

        <nav class="space-y-1">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="scrollToSection(section.id)"
            class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            :class="[
              activeSection === section.id
                ? (preferencesStore.darkMode
                    ? 'bg-blue-900/30 text-blue-300 font-medium'
                    : 'bg-blue-50 text-blue-700 font-medium')
                : (preferencesStore.darkMode
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
            ]"
          >
            <Check
              v-if="sectionsRead.has(section.id)"
              class="w-4 h-4 flex-shrink-0 text-green-500"
            />
            <span class="flex-shrink-0 w-4" v-else></span>
            <span class="truncate">{{ section.title }}</span>
          </button>
        </nav>

        <!-- Reading progress -->
        <div class="mt-6 pt-4 border-t" :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'">
          <div
            class="text-xs mb-2"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
          >
            Reading Progress
          </div>
          <div
            class="h-2 rounded-full overflow-hidden"
            :class="preferencesStore.darkMode ? 'bg-gray-700' : 'bg-gray-200'"
          >
            <div
              class="h-full rounded-full transition-all"
              :class="readingProgress === 100
                ? (preferencesStore.darkMode ? 'bg-green-500' : 'bg-green-500')
                : (preferencesStore.darkMode ? 'bg-blue-500' : 'bg-blue-500')"
              :style="{ width: `${readingProgress}%` }"
            />
          </div>
          <div
            class="text-xs mt-1"
            :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
          >
            {{ sectionsRead.size }} / {{ sections.length }} sections
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="narrative-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.narrative-guide-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .narrative-guide-container {
    grid-template-columns: 1fr;
  }

  .narrative-sidebar {
    position: static;
    margin-bottom: 1.5rem;
  }
}

.narrative-sidebar {
  border-width: 1px;
  border-radius: 0.5rem;
  padding: 1rem;
}

.narrative-content {
  min-width: 0;
}
</style>
