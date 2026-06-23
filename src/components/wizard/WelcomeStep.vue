<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSlateStore } from '@/stores/slateStore'
import { ArrowRight, Calculator, Grid, HelpCircle, Book, ChevronDown, ChevronRight, Package } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const configStore = useConfigStore()
const slateStore = useSlateStore()

// Collapsible intro section - persisted to localStorage
const STORAGE_KEY = 'odp-welcome-collapsed'
const infoCollapsed = ref(false)

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      infoCollapsed.value = JSON.parse(saved)
    }
  } catch (e) {
    // Ignore parse errors
  }
})

function toggleInfo() {
  infoCollapsed.value = !infoCollapsed.value
  localStorage.setItem(STORAGE_KEY, JSON.stringify(infoCollapsed.value))
}
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="max-w-3xl mx-auto">
      <!-- Hero section - centered -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-3 text-text">
          {{ configStore.config?.meta?.site?.title || 'Research Data Planner' }}
        </h1>

        <p class="text-lg mb-6 text-text-secondary">
          {{ configStore.config?.meta?.site?.tagline || 'Plan your data infrastructure and budget for grant proposals' }}
        </p>

        <button
          @click="emit('next')"
          class="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary text-lg font-medium rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Get Started
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>

      <!-- Info pill - unified container with two sections -->
      <div class="rounded-lg overflow-hidden mb-8 border border-border">
        <!-- Shared header - single toggle -->
        <button
          @click="toggleInfo"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-surface-alt text-text-secondary hover:bg-border"
        >
          <component :is="infoCollapsed ? ChevronRight : ChevronDown" class="w-4 h-4" />
          {{ infoCollapsed ? 'Show quick start info' : 'Hide quick start info' }}
        </button>

        <!-- Content row - two colored sections side by side -->
        <div v-if="!infoCollapsed" class="grid grid-cols-2">
          <!-- What this tool does -->
          <div class="p-3 bg-surface-alt">
            <h3 class="text-sm font-medium mb-2 text-primary">
              What this tool does
            </h3>
            <ul class="space-y-1.5 text-sm text-text-secondary">
              <li class="flex items-start gap-2">
                <span class="text-primary">1.</span>
                <span>Choose the right data security tier</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary">2.</span>
                <span>See available services and costs</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary">3.</span>
                <span>Calculate budget with retention costs</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary">4.</span>
                <span>Generate DMP text for your grant</span>
              </li>
            </ul>
          </div>

          <!-- It helps to know -->
          <div class="p-3 bg-surface-alt">
            <h3 class="text-sm font-medium mb-2 text-text">
              It helps to know
            </h3>
            <ul class="space-y-1.5 text-sm text-text-secondary">
              <li class="flex items-start gap-2">
                <span class="text-text-muted">&bull;</span>
                <span>
                  Your data type
                  <router-link
                    to="/tier-check"
                    class="text-primary hover:underline"
                  >(tier helper)</router-link>
                </span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-text-muted">&bull;</span>
                <span>Rough grant period dates</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-text-muted">&bull;</span>
                <span>
                  Storage & compute needs
                  <router-link
                    to="/calculators"
                    class="text-primary hover:underline"
                  >(calculators)</router-link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Explore First Section -->
      <div class="pt-6 border-t text-center border-border">
        <p class="text-sm mb-4 text-text-muted">or explore first</p>

        <!-- Row 1: 3 items -->
        <div class="grid grid-cols-3 gap-3 mb-3">
          <!-- Estimate Needs -->
          <router-link
            to="/calculators"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group border bg-surface border-border hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-surface-alt"
          >
            <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:group-hover:bg-blue-900/50">
              <Calculator class="w-5 h-5" />
            </div>
            <div>
              <div class="font-medium text-text">Estimate Needs</div>
              <div class="text-xs text-text-muted">Storage & compute calculators</div>
            </div>
          </router-link>

          <!-- Browse Services -->
          <router-link
            to="/services"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group border bg-surface border-border hover:border-green-300 hover:bg-green-50 dark:hover:border-green-500 dark:hover:bg-surface-alt"
          >
            <div class="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:group-hover:bg-green-900/50">
              <Grid class="w-5 h-5" />
            </div>
            <div>
              <div class="font-medium text-text">Browse Services</div>
              <div class="text-xs text-text-muted">See what's available</div>
            </div>
          </router-link>

          <!-- Browse Software -->
          <router-link
            to="/software"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group border bg-surface border-border hover:border-teal-300 hover:bg-teal-50 dark:hover:border-teal-500 dark:hover:bg-surface-alt"
          >
            <div class="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:group-hover:bg-teal-900/50">
              <Package class="w-5 h-5" />
            </div>
            <div>
              <div class="font-medium text-text">Browse Software</div>
              <div class="text-xs text-text-muted">Licensed software catalog</div>
            </div>
          </router-link>
        </div>

        <!-- Row 2: 2 items centered -->
        <div class="flex justify-center gap-3">
          <!-- Check Your Tier -->
          <router-link
            to="/tier-check"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group border bg-surface border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:border-amber-500 dark:hover:bg-surface-alt"
          >
            <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:group-hover:bg-amber-900/50">
              <HelpCircle class="w-5 h-5" />
            </div>
            <div>
              <div class="font-medium text-text">Check Your Tier</div>
              <div class="text-xs text-text-muted">Data classification helper</div>
            </div>
          </router-link>

          <!-- Learn the Terms -->
          <router-link
            to="/glossary"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group border bg-surface border-border hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-500 dark:hover:bg-surface-alt"
          >
            <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:group-hover:bg-purple-900/50">
              <Book class="w-5 h-5" />
            </div>
            <div>
              <div class="font-medium text-text">Learn the Terms</div>
              <div class="text-xs text-text-muted">Glossary & definitions</div>
            </div>
          </router-link>
        </div>

        <!-- Slate indicator -->
        <div
          v-if="slateStore.hasItems"
          class="mt-6 p-3 rounded-lg bg-surface-alt border border-border"
        >
          <p class="text-sm text-text-secondary">
            <strong>{{ slateStore.itemCount }} item{{ slateStore.itemCount !== 1 ? 's' : '' }}</strong>
            in your slate.
            <button
              @click="emit('next')"
              class="font-medium hover:underline text-primary"
            >
              Continue to planning →
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
