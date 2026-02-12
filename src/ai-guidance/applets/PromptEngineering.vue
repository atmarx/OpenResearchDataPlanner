<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  Lightbulb,
  Copy,
  CheckCircle,
  Settings,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'prompt-engineering'

// Core principles
const principles = [
  {
    id: 'specific',
    title: 'Be Specific',
    description: 'Vague prompts get vague outputs. State exactly what you need.',
    example: 'Instead of "Write about dogs", try "Write a 200-word overview of golden retriever health issues for pet owners"'
  },
  {
    id: 'context',
    title: 'Provide Context',
    description: 'Tell the model what it\'s helping with and who the audience is.',
    example: 'Add context like "I\'m preparing a grant proposal for NSF" or "This is for undergraduate students"'
  },
  {
    id: 'examples',
    title: 'Show Examples',
    description: 'Few-shot prompting improves consistency dramatically.',
    example: 'Include 1-3 examples of the format/style you want before your actual request'
  },
  {
    id: 'format',
    title: 'Specify Format',
    description: 'If you need JSON, code, bullet points, or structured output, say so explicitly.',
    example: '"Respond in JSON with keys: summary, key_points, recommendations"'
  },
  {
    id: 'iterate',
    title: 'Iterate',
    description: 'First prompt rarely optimal. Refine based on outputs.',
    example: 'Save successful prompts and build on them over time'
  }
]

// Prompt template
const promptTemplate = `[Context/Role]
You are a [role] helping with [task].

[Task Description]
I need you to [specific action].

[Constraints]
- Requirement 1
- Requirement 2
- Format: [desired output format]

[Examples] (optional but powerful)
Input: [example input]
Output: [example output]

[Actual Input]
[Your content here]`

// Key parameters
const parameters = [
  {
    name: 'Temperature',
    description: 'Higher = more creative/random; Lower = more deterministic',
    lowUse: 'Factual tasks, code, consistent outputs (0-0.3)',
    highUse: 'Creative writing, brainstorming (0.7+)',
    default: '~0.7 for most APIs'
  },
  {
    name: 'Max Tokens',
    description: 'Limits response length',
    lowUse: 'Short answers, classifications',
    highUse: 'Long-form content, detailed analysis',
    default: 'Varies by model'
  },
  {
    name: 'Top-p (Nucleus)',
    description: 'Sampling threshold - probability mass to consider',
    lowUse: 'Usually leave at default',
    highUse: 'Usually leave at default',
    default: '~0.9-1.0'
  },
  {
    name: 'System Prompt',
    description: 'Persistent instructions for consistent behavior',
    lowUse: 'Simple one-off tasks',
    highUse: 'Repeated tasks, chatbots, pipelines',
    default: 'Optional'
  }
]

// Common task templates
const taskTemplates = [
  {
    id: 'summarize',
    name: 'Summarization',
    template: `Summarize the following text in [X] sentences, focusing on [main points/methodology/findings].

Maintain [formal/neutral] tone and preserve key technical terms.

Text to summarize:
"""
[Your text here]
"""`
  },
  {
    id: 'code-review',
    name: 'Code Review',
    template: `Review this code for:
1. Potential bugs or edge cases
2. Security vulnerabilities
3. Performance issues
4. Readability improvements

Be specific about line numbers and provide concrete suggestions.

\`\`\`[language]
[Your code here]
\`\`\``
  },
  {
    id: 'explain',
    name: 'Concept Explanation',
    template: `Explain [concept] to someone with [background level] knowledge.

Include:
- A simple analogy
- Key principles
- One practical example
- Common misconceptions to avoid

Limit to [X] words.`
  },
  {
    id: 'analysis',
    name: 'Data Analysis',
    template: `Analyze this data for [specific question/pattern].

Data:
[Your data here]

Provide:
1. Key findings
2. Methodology used
3. Confidence level
4. Limitations of this analysis`
  }
]

// State
const selectedTemplate = ref(null)
const expandedSections = ref(new Set(['principles']))
const copiedContent = ref(null)

const isComplete = ref(false)

function toggleSection(section) {
  if (expandedSections.value.has(section)) {
    expandedSections.value.delete(section)
  } else {
    expandedSections.value.add(section)
  }
  expandedSections.value = new Set(expandedSections.value)
}

function isSectionExpanded(section) {
  return expandedSections.value.has(section)
}

function selectTemplate(templateId) {
  selectedTemplate.value = templateId
}

async function copyContent(content, id) {
  try {
    await navigator.clipboard.writeText(content)
    copiedContent.value = id
    setTimeout(() => copiedContent.value = null, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function markComplete() {
  isComplete.value = true
  aiStore.completeApplet(APPLET_ID, {
    viewed: true
  })
}

// Auto-complete on mount (informational applet)
import { onMounted } from 'vue'
onMounted(() => {
  setTimeout(markComplete, 2000)
})

function getNextApplet() {
  return 'ai-ethics'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Prompt Engineering Basics"
    core-question="How do I get consistent, useful outputs from AI?"
    :icon="Lightbulb"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Intro -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Not comprehensive training, but essential guidance on reproducible outputs,
        prompt structure, and common parameters. These fundamentals apply across AI tools.
      </p>
    </div>

    <!-- Core Principles -->
    <div class="mb-6">
      <button
        @click="toggleSection('principles')"
        class="flex items-center gap-2 w-full text-left"
      >
        <component
          :is="isSectionExpanded('principles') ? ChevronDown : ChevronRight"
          class="w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        />
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Core Principles
        </h3>
      </button>

      <div v-if="isSectionExpanded('principles')" class="mt-4 space-y-4">
        <div
          v-for="principle in principles"
          :key="principle.id"
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <h4 class="font-medium mb-1" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            {{ principle.title }}
          </h4>
          <p class="text-sm mb-2" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
            {{ principle.description }}
          </p>
          <p
            class="text-sm p-2 rounded"
            :class="preferencesStore.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'"
          >
            <span class="font-medium">Example:</span> {{ principle.example }}
          </p>
        </div>
      </div>
    </div>

    <!-- Prompt Template -->
    <div class="mb-6">
      <button
        @click="toggleSection('template')"
        class="flex items-center gap-2 w-full text-left"
      >
        <component
          :is="isSectionExpanded('template') ? ChevronDown : ChevronRight"
          class="w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        />
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Prompt Structure Template
        </h3>
      </button>

      <div v-if="isSectionExpanded('template')" class="mt-4">
        <div
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex justify-end mb-2">
            <button
              @click="copyContent(promptTemplate, 'template')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="copiedContent === 'template'
                ? (preferencesStore.darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700')
                : (preferencesStore.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
            >
              <component :is="copiedContent === 'template' ? CheckCircle : Copy" class="w-4 h-4" />
              {{ copiedContent === 'template' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre
            class="text-sm p-3 rounded-lg overflow-x-auto whitespace-pre-wrap"
            :class="preferencesStore.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'"
          >{{ promptTemplate }}</pre>
        </div>
      </div>
    </div>

    <!-- Key Parameters -->
    <div class="mb-6">
      <button
        @click="toggleSection('parameters')"
        class="flex items-center gap-2 w-full text-left"
      >
        <component
          :is="isSectionExpanded('parameters') ? ChevronDown : ChevronRight"
          class="w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        />
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Key Parameters
        </h3>
      </button>

      <div v-if="isSectionExpanded('parameters')" class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'">
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Parameter</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Effect</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">When Low</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">When High</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="param in parameters"
              :key="param.name"
              :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
            >
              <td class="p-2 border-b font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">{{ param.name }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ param.description }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ param.lowUse }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ param.highUse }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Task Templates -->
    <div class="mb-6">
      <button
        @click="toggleSection('tasks')"
        class="flex items-center gap-2 w-full text-left"
      >
        <component
          :is="isSectionExpanded('tasks') ? ChevronDown : ChevronRight"
          class="w-5 h-5"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        />
        <h3 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
          Common Task Templates
        </h3>
      </button>

      <div v-if="isSectionExpanded('tasks')" class="mt-4">
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="template in taskTemplates"
            :key="template.id"
            @click="selectTemplate(template.id)"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            :class="selectedTemplate === template.id
              ? (preferencesStore.darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (preferencesStore.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
          >
            {{ template.name }}
          </button>
        </div>

        <div
          v-if="selectedTemplate"
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ taskTemplates.find(t => t.id === selectedTemplate)?.name }}
            </h4>
            <button
              @click="copyContent(taskTemplates.find(t => t.id === selectedTemplate)?.template, selectedTemplate)"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="copiedContent === selectedTemplate
                ? (preferencesStore.darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700')
                : (preferencesStore.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
            >
              <component :is="copiedContent === selectedTemplate ? CheckCircle : Copy" class="w-4 h-4" />
              {{ copiedContent === selectedTemplate ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre
            class="text-sm p-3 rounded-lg overflow-x-auto whitespace-pre-wrap"
            :class="preferencesStore.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'"
          >{{ taskTemplates.find(t => t.id === selectedTemplate)?.template }}</pre>
        </div>
      </div>
    </div>

    <!-- Reproducibility Tips -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'"
    >
      <h4 class="font-medium mb-2" :class="preferencesStore.darkMode ? 'text-blue-300' : 'text-blue-800'">
        Reproducibility Tips
      </h4>
      <ul class="text-sm space-y-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-700'">
        <li>• Save your prompts exactly as used</li>
        <li>• Document temperature and other parameters</li>
        <li>• Use system prompts for consistent behavior</li>
        <li>• For APIs: use same model version string when possible</li>
        <li>• Expect variation — same prompt won't give identical outputs</li>
      </ul>
    </div>

    <!-- Prompt Injection Warning -->
    <div
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'"
    >
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-600'" />
        <div>
          <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-yellow-300' : 'text-yellow-800'">
            Prompt Injection Awareness
          </h4>
          <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-700'">
            If building applications that include user input in prompts:
          </p>
          <ul class="text-sm mt-2 space-y-1" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-700'">
            <li>• User input can override your instructions</li>
            <li>• Never trust AI output for security decisions</li>
            <li>• Sanitize/validate user inputs</li>
            <li>• Consider output validation</li>
          </ul>
        </div>
      </div>
    </div>
  </AppletFrame>
</template>
