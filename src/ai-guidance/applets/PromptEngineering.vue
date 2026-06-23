<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
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
    <div class="p-4 rounded-lg border mb-6 bg-surface border-border">
      <p class="text-sm text-text-secondary">
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
          class="w-5 h-5 text-text-muted"
        />
        <h3 class="font-semibold text-text">
          Core Principles
        </h3>
      </button>

      <div v-if="isSectionExpanded('principles')" class="mt-4 space-y-4">
        <div
          v-for="principle in principles"
          :key="principle.id"
          class="p-4 rounded-lg border bg-surface border-border"
        >
          <h4 class="font-medium mb-1 text-text">
            {{ principle.title }}
          </h4>
          <p class="text-sm mb-2 text-text-secondary">
            {{ principle.description }}
          </p>
          <p class="text-sm p-2 rounded bg-canvas text-text-secondary">
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
          class="w-5 h-5 text-text-muted"
        />
        <h3 class="font-semibold text-text">
          Prompt Structure Template
        </h3>
      </button>

      <div v-if="isSectionExpanded('template')" class="mt-4">
        <div class="p-4 rounded-lg border bg-surface border-border">
          <div class="flex justify-end mb-2">
            <button
              @click="copyContent(promptTemplate, 'template')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="copiedContent === 'template'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                : 'bg-surface-alt text-text-secondary hover:bg-border'"
            >
              <component :is="copiedContent === 'template' ? CheckCircle : Copy" class="w-4 h-4" />
              {{ copiedContent === 'template' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre class="text-sm p-3 rounded-lg overflow-x-auto whitespace-pre-wrap bg-canvas text-text-secondary">{{ promptTemplate }}</pre>
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
          class="w-5 h-5 text-text-muted"
        />
        <h3 class="font-semibold text-text">
          Key Parameters
        </h3>
      </button>

      <div v-if="isSectionExpanded('parameters')" class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-border">
              <th class="text-left p-2 border-b text-text-secondary">Parameter</th>
              <th class="text-left p-2 border-b text-text-secondary">Effect</th>
              <th class="text-left p-2 border-b text-text-secondary">When Low</th>
              <th class="text-left p-2 border-b text-text-secondary">When High</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="param in parameters"
              :key="param.name"
              class="border-border"
            >
              <td class="p-2 border-b font-medium text-text">{{ param.name }}</td>
              <td class="p-2 border-b text-text-secondary">{{ param.description }}</td>
              <td class="p-2 border-b text-text-secondary">{{ param.lowUse }}</td>
              <td class="p-2 border-b text-text-secondary">{{ param.highUse }}</td>
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
          class="w-5 h-5 text-text-muted"
        />
        <h3 class="font-semibold text-text">
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
              ? 'bg-primary text-on-primary'
              : 'bg-surface-alt text-text-secondary hover:bg-border'"
          >
            {{ template.name }}
          </button>
        </div>

        <div
          v-if="selectedTemplate"
          class="p-4 rounded-lg border bg-surface border-border"
        >
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-medium text-text">
              {{ taskTemplates.find(t => t.id === selectedTemplate)?.name }}
            </h4>
            <button
              @click="copyContent(taskTemplates.find(t => t.id === selectedTemplate)?.template, selectedTemplate)"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="copiedContent === selectedTemplate
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                : 'bg-surface-alt text-text-secondary hover:bg-border'"
            >
              <component :is="copiedContent === selectedTemplate ? CheckCircle : Copy" class="w-4 h-4" />
              {{ copiedContent === selectedTemplate ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre class="text-sm p-3 rounded-lg overflow-x-auto whitespace-pre-wrap bg-canvas text-text-secondary">{{ taskTemplates.find(t => t.id === selectedTemplate)?.template }}</pre>
        </div>
      </div>
    </div>

    <!-- Reproducibility Tips -->
    <div class="p-4 rounded-lg border mb-6 bg-surface-alt border-border">
      <h4 class="font-medium mb-2 text-primary">
        Reproducibility Tips
      </h4>
      <ul class="text-sm space-y-1 text-text-secondary">
        <li>• Save your prompts exactly as used</li>
        <li>• Document temperature and other parameters</li>
        <li>• Use system prompts for consistent behavior</li>
        <li>• For APIs: use same model version string when possible</li>
        <li>• Expect variation — same prompt won't give identical outputs</li>
      </ul>
    </div>

    <!-- Prompt Injection Warning -->
    <div class="p-4 rounded-lg border bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
        <div>
          <h4 class="font-medium text-yellow-800 dark:text-yellow-300">
            Prompt Injection Awareness
          </h4>
          <p class="text-sm mt-1 text-yellow-700 dark:text-yellow-400">
            If building applications that include user input in prompts:
          </p>
          <ul class="text-sm mt-2 space-y-1 text-yellow-700 dark:text-yellow-400">
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
