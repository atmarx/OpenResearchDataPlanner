<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useSlateStore } from '@/stores/slateStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
  X,
  HardDrive,
  Cpu,
  MonitorSmartphone,
  Microscope,
  Camera,
  Dna,
  Video,
  Scan,
  FileText,
  Workflow,
  Atom,
  Layers,
  BarChart,
  Brain,
  Zap,
  MessageSquareText,
  DollarSign
} from 'lucide-vue-next'
import AnnotatedText from '@/components/acronyms/AnnotatedText.vue'

const router = useRouter()

const configStore = useConfigStore()
const slateStore = useSlateStore()
const preferencesStore = usePreferencesStore()

// Calculator components
const calculatorComponents = {
  microscopy: defineAsyncComponent(() => import('@/components/estimate/MicroscopyCalculator.vue')),
  photography: defineAsyncComponent(() => import('@/components/estimate/PhotographyCalculator.vue')),
  genomics: defineAsyncComponent(() => import('@/components/estimate/GenomicsStorageCalculator.vue')),
  video: defineAsyncComponent(() => import('@/components/estimate/VideoCalculator.vue')),
  'medical-imaging': defineAsyncComponent(() => import('@/components/estimate/MedicalImagingCalculator.vue')),
  documents: defineAsyncComponent(() => import('@/components/estimate/DocumentsCalculator.vue')),
  'genomics-pipelines': defineAsyncComponent(() => import('@/components/estimate/GenomicsPipelinesCalculator.vue')),
  simulations: defineAsyncComponent(() => import('@/components/estimate/SimulationsCalculator.vue')),
  'batch-processing': defineAsyncComponent(() => import('@/components/estimate/BatchProcessingCalculator.vue')),
  statistics: defineAsyncComponent(() => import('@/components/estimate/StatisticsCalculator.vue')),
  'ml-training': defineAsyncComponent(() => import('@/components/estimate/MLTrainingCalculator.vue')),
  'ml-inference': defineAsyncComponent(() => import('@/components/estimate/MLInferenceCalculator.vue')),
  'gpu-simulation': defineAsyncComponent(() => import('@/components/estimate/GPUSimulationCalculator.vue')),
  'llm-api-costs': defineAsyncComponent(() => import('@/components/estimate/LLMApiCalculator.vue'))
}

// Icon mapping
const iconMap = {
  microscope: Microscope,
  camera: Camera,
  dna: Dna,
  video: Video,
  scan: Scan,
  'file-text': FileText,
  workflow: Workflow,
  atom: Atom,
  layers: Layers,
  'bar-chart': BarChart,
  brain: Brain,
  zap: Zap,
  cpu: Cpu,
  'message-square-text': MessageSquareText
}

// Category icons and labels
const categoryInfo = {
  storage: { icon: HardDrive, label: 'Storage', description: 'Estimate data storage needs' },
  cpu: { icon: Cpu, label: 'Compute', description: 'Estimate CPU/SU requirements' },
  gpu: { icon: MonitorSmartphone, label: 'GPU', description: 'Estimate GPU time requirements' },
  api: { icon: DollarSign, label: 'API Costs', description: 'Estimate LLM API costs for budgeting' }
}

// Active calculator for modal
const activeCalculator = ref(null)

// Get enabled calculators from config
const enabledCalculators = computed(() => {
  return configStore.config?.calculators?.enabled_calculators || {}
})

// Get calculator config
const calculatorConfigs = computed(() => {
  return configStore.config?.calculators?.calculator_config || {}
})

// Build categories with their calculators
const categories = computed(() => {
  const result = []

  for (const [categoryKey, calculatorIds] of Object.entries(enabledCalculators.value)) {
    const info = categoryInfo[categoryKey]
    if (!info) continue

    const calcs = calculatorIds
      .map(id => {
        const cfg = calculatorConfigs.value[id]
        if (!cfg) return null

        return {
          id,
          name: cfg.name,
          description: cfg.description,
          icon: iconMap[cfg.icon] || FileText
        }
      })
      .filter(Boolean)

    if (calcs.length > 0) {
      result.push({
        key: categoryKey,
        ...info,
        calculators: calcs
      })
    }
  }

  return result
})

/**
 * Open a calculator in modal
 */
function openCalculator(calculatorId) {
  activeCalculator.value = calculatorId
}

/**
 * Close calculator modal
 */
function closeCalculator() {
  activeCalculator.value = null
}

/**
 * Handle item added to slate
 */
function handleAdded() {
  // Could show a toast notification here
  // For now, the slate footer updates automatically
}
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="preferencesStore.darkMode ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <!-- Header -->
    <div
      class="border-b"
      :class="preferencesStore.darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <div class="max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-6">
        <div>
          <h1
            class="text-2xl font-bold"
            :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
          >Estimate Your Needs</h1>
          <p
            class="mt-1"
            :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
          >
            Choose a calculator to estimate storage, compute, or GPU requirements
          </p>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div
        v-for="category in categories"
        :key="category.key"
      >
        <!-- Category Header -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="{
              'bg-blue-100 text-blue-600': category.key === 'storage',
              'bg-green-100 text-green-600': category.key === 'cpu',
              'bg-purple-100 text-purple-600': category.key === 'gpu',
              'bg-amber-100 text-amber-600': category.key === 'api'
            }"
          >
            <component :is="category.icon" class="w-5 h-5" />
          </div>
          <div>
            <h2
              class="text-lg font-semibold"
              :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
            >{{ category.label }}</h2>
            <p
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            >{{ category.description }}</p>
          </div>
        </div>

        <!-- Calculator Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="calc in category.calculators"
            :key="calc.id"
            @click="openCalculator(calc.id)"
            class="text-left rounded-lg border p-4 transition-all group"
            :class="preferencesStore.darkMode
              ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-700'
              : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                :class="{
                  'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600': category.key === 'storage' && !preferencesStore.darkMode,
                  'bg-gray-700 text-gray-400 group-hover:bg-blue-900/50 group-hover:text-blue-400': category.key === 'storage' && preferencesStore.darkMode,
                  'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600': category.key === 'cpu' && !preferencesStore.darkMode,
                  'bg-gray-700 text-gray-400 group-hover:bg-green-900/50 group-hover:text-green-400': category.key === 'cpu' && preferencesStore.darkMode,
                  'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600': category.key === 'gpu' && !preferencesStore.darkMode,
                  'bg-gray-700 text-gray-400 group-hover:bg-purple-900/50 group-hover:text-purple-400': category.key === 'gpu' && preferencesStore.darkMode,
                  'bg-gray-100 text-gray-600 group-hover:bg-amber-100 group-hover:text-amber-600': category.key === 'api' && !preferencesStore.darkMode,
                  'bg-gray-700 text-gray-400 group-hover:bg-amber-900/50 group-hover:text-amber-400': category.key === 'api' && preferencesStore.darkMode
                }"
              >
                <component :is="calc.icon" class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  class="font-medium group-hover:text-blue-600"
                  :class="preferencesStore.darkMode
                    ? 'text-white group-hover:text-blue-400'
                    : 'text-gray-900 group-hover:text-blue-600'"
                >
                  {{ calc.name }}
                </h3>
                <p
                  class="text-sm mt-0.5 line-clamp-2"
                  :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
                >
                  <AnnotatedText :text="calc.description" />
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Slate Status -->
      <div
        v-if="slateStore.hasItems"
        class="rounded-lg p-4 flex items-center justify-between border"
        :class="preferencesStore.darkMode
          ? 'bg-blue-900/30 border-blue-800'
          : 'bg-blue-50 border-blue-200'"
      >
        <div>
          <span
            class="font-medium"
            :class="preferencesStore.darkMode ? 'text-blue-200' : 'text-blue-900'"
          >Your Slate</span>
          <span
            class="ml-2"
            :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-700'"
          >
            {{ slateStore.itemCount }} service{{ slateStore.itemCount !== 1 ? 's' : '' }}
          </span>
        </div>
        <button
          @click="router.push('/')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Review Slate
        </button>
      </div>
    </div>

    <!-- Calculator Modal -->
    <Teleport to="body">
      <div
        v-if="activeCalculator"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeCalculator"
      >
        <div
          class="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'"
        >
          <div
            class="sticky top-0 border-b px-4 py-3 flex items-center justify-between"
            :class="preferencesStore.darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'"
          >
            <span
              class="font-medium"
              :class="preferencesStore.darkMode ? 'text-gray-200' : 'text-gray-700'"
            >Calculator</span>
            <button
              @click="closeCalculator"
              class="p-2 rounded-lg"
              :class="preferencesStore.darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-4">
            <component
              :is="calculatorComponents[activeCalculator]"
              @added="handleAdded"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
