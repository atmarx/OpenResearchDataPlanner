<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'task-fit'

// Task categories with fit assessments
const taskCategories = [
  {
    id: 'brainstorming',
    name: 'Brainstorming & Ideation',
    fit: 'good',
    notes: 'Use as thought partner, not oracle. Your expertise adds the real value.',
    verification: 'Light review of ideas for feasibility'
  },
  {
    id: 'drafts',
    name: 'First Draft Generation',
    fit: 'good',
    notes: 'Treat output as raw material, not finished work. Expect significant editing.',
    verification: 'Full review and revision of all content'
  },
  {
    id: 'explaining',
    name: 'Explaining Concepts',
    fit: 'good',
    notes: 'Good for learning. Verify against authoritative sources for accuracy.',
    verification: 'Cross-check key claims with trusted sources'
  },
  {
    id: 'code',
    name: 'Code Scaffolding',
    fit: 'moderate',
    notes: 'Requires adversarial testing beyond standard unit tests. AI-generated code often contains subtle bugs at boundaries.',
    verification: 'Read every line. Test edge cases. Deliberately try to break it.'
  },
  {
    id: 'literature',
    name: 'Literature Discovery',
    fit: 'moderate',
    notes: 'Will hallucinate citations. Every reference must be verified independently.',
    verification: 'Look up EVERY citation in actual databases'
  },
  {
    id: 'summarization',
    name: 'Summarization',
    fit: 'moderate',
    notes: 'May conflate sources or miss nuances. Verify key claims.',
    verification: 'Read original sources to verify summary accuracy'
  },
  {
    id: 'data-cleaning',
    name: 'Data Cleaning & Formatting',
    fit: 'moderate',
    notes: 'Good for transformations. Verify edge cases and spot-check results.',
    verification: 'Sample checking, boundary testing'
  },
  {
    id: 'analysis',
    name: 'Data Analysis',
    fit: 'caution',
    notes: 'May produce plausible but wrong analysis. Requires domain expertise to validate.',
    verification: 'Independent methodology review. Manual calculation checks.'
  },
  {
    id: 'statistics',
    name: 'Statistical Work',
    fit: 'caution',
    notes: 'AI may apply wrong tests or misinterpret results. Expert validation required.',
    verification: 'Statistical expert review of methodology and interpretation'
  },
  {
    id: 'factual',
    name: 'Factual Research',
    fit: 'poor',
    notes: 'High hallucination risk for specific facts. AI does not have reliable memory.',
    verification: 'Verify ALL facts against primary sources'
  },
  {
    id: 'citations',
    name: 'Citation Generation',
    fit: 'poor',
    notes: 'Will fabricate plausible-looking citations. Do not trust any AI-generated citation.',
    verification: 'Look up every single citation. Assume all are fabricated until verified.'
  },
  {
    id: 'legal',
    name: 'Legal/Compliance Text',
    fit: 'poor',
    notes: 'Requires expert review regardless. AI may miss jurisdiction-specific requirements.',
    verification: 'Full legal expert review required'
  },
  {
    id: 'clinical',
    name: 'Clinical Decisions',
    fit: 'regulated',
    notes: 'Requires FDA pathway analysis. Not "no" but heavily governed.',
    verification: 'Regulatory compliance pathway required'
  }
]

// Selected task
const selectedTask = ref(null)

// Complete state
const isComplete = computed(() => selectedTask.value !== null)

// Fit level info
const fitLevels = {
  good: { label: 'Good Fit', color: 'green', icon: CheckCircle },
  moderate: { label: 'Moderate Fit', color: 'yellow', icon: Info },
  caution: { label: 'Use with Caution', color: 'orange', icon: AlertTriangle },
  poor: { label: 'Poor Fit', color: 'red', icon: XCircle },
  regulated: { label: 'Requires Regulatory Pathway', color: 'purple', icon: AlertTriangle }
}

function selectTask(task) {
  selectedTask.value = task
  aiStore.completeApplet(APPLET_ID, {
    taskType: task.id,
    fit: task.fit,
    verification: task.verification
  })
}

function getFitClasses(fit) {
  const isDark = preferencesStore.darkMode
  const colors = {
    good: isDark ? 'border-green-700 hover:bg-green-900/30' : 'border-green-200 hover:bg-green-50',
    moderate: isDark ? 'border-yellow-700 hover:bg-yellow-900/30' : 'border-yellow-200 hover:bg-yellow-50',
    caution: isDark ? 'border-orange-700 hover:bg-orange-900/30' : 'border-orange-200 hover:bg-orange-50',
    poor: isDark ? 'border-red-700 hover:bg-red-900/30' : 'border-red-200 hover:bg-red-50',
    regulated: isDark ? 'border-purple-700 hover:bg-purple-900/30' : 'border-purple-200 hover:bg-purple-50'
  }
  return colors[fit] || colors.moderate
}

function getSelectedClasses(fit) {
  const isDark = preferencesStore.darkMode
  const colors = {
    good: isDark ? 'bg-green-900/30 border-green-500' : 'bg-green-50 border-green-400',
    moderate: isDark ? 'bg-yellow-900/30 border-yellow-500' : 'bg-yellow-50 border-yellow-400',
    caution: isDark ? 'bg-orange-900/30 border-orange-500' : 'bg-orange-50 border-orange-400',
    poor: isDark ? 'bg-red-900/30 border-red-500' : 'bg-red-50 border-red-400',
    regulated: isDark ? 'bg-purple-900/30 border-purple-500' : 'bg-purple-50 border-purple-400'
  }
  return colors[fit] || colors.moderate
}

function getNextApplet() {
  return 'verification-gate'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Task Fit"
    core-question="Is AI the right approach for this task?"
    :icon="Target"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h3 class="font-semibold mb-2" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Select Your Task Type
      </h3>
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Different tasks have different AI fit levels. Each comes with specific verification requirements.
        Select the category that best matches what you're trying to do.
      </p>
    </div>

    <!-- Task Grid -->
    <div class="grid gap-3">
      <button
        v-for="task in taskCategories"
        :key="task.id"
        @click="selectTask(task)"
        class="p-4 rounded-lg border-2 text-left transition-all"
        :class="[
          selectedTask?.id === task.id
            ? getSelectedClasses(task.fit)
            : getFitClasses(task.fit),
          preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'
        ]"
      >
        <div class="flex items-start gap-3">
          <component
            :is="fitLevels[task.fit].icon"
            class="w-5 h-5 flex-shrink-0 mt-0.5"
            :class="{
              'text-green-500': task.fit === 'good',
              'text-yellow-500': task.fit === 'moderate',
              'text-orange-500': task.fit === 'caution',
              'text-red-500': task.fit === 'poor',
              'text-purple-500': task.fit === 'regulated'
            }"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ task.name }}
              </h4>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="{
                  'bg-green-100 text-green-700': task.fit === 'good',
                  'bg-yellow-100 text-yellow-700': task.fit === 'moderate',
                  'bg-orange-100 text-orange-700': task.fit === 'caution',
                  'bg-red-100 text-red-700': task.fit === 'poor',
                  'bg-purple-100 text-purple-700': task.fit === 'regulated'
                }"
              >
                {{ fitLevels[task.fit].label }}
              </span>
            </div>
            <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
              {{ task.notes }}
            </p>
          </div>
        </div>
      </button>
    </div>

    <!-- Selected Task Details -->
    <div
      v-if="selectedTask"
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Verification Required
      </h3>
      <p :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">
        {{ selectedTask.verification }}
      </p>

      <div
        v-if="selectedTask.fit === 'poor' || selectedTask.fit === 'caution'"
        class="mt-4 p-3 rounded-lg"
        :class="preferencesStore.darkMode ? 'bg-orange-900/20' : 'bg-orange-50'"
      >
        <p class="text-sm font-medium" :class="preferencesStore.darkMode ? 'text-orange-300' : 'text-orange-800'">
          ⚠️ Consider alternatives
        </p>
        <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-orange-400' : 'text-orange-700'">
          For this task type, the time spent on verification may approach or exceed the time saved by using AI.
          Consider whether traditional approaches might be more efficient.
        </p>
      </div>
    </div>
  </AppletFrame>
</template>
