<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
      class="narrative-sidebar bg-surface border-border"
    >
      <div class="sticky top-4">
        <div class="flex items-center gap-2 mb-4">
          <BookOpen
            class="w-5 h-5 text-text-muted"
          />
          <h3
            class="font-semibold text-text"
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
            :class="
              activeSection === section.id
                ? 'bg-surface-alt text-primary font-medium'
                : 'text-text-secondary hover:bg-surface-alt hover:text-text'
            "
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
        <div class="mt-6 pt-4 border-t border-border">
          <div
            class="text-xs mb-2 text-text-muted"
          >
            Reading Progress
          </div>
          <div
            class="h-2 rounded-full overflow-hidden bg-surface-alt"
          >
            <div
              class="h-full rounded-full transition-all"
              :class="readingProgress === 100 ? 'bg-green-500' : 'bg-primary'"
              :style="{ width: `${readingProgress}%` }"
            />
          </div>
          <div
            class="text-xs mt-1 text-text-muted"
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
