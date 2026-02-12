<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  Cpu,
  CheckCircle,
  AlertTriangle,
  Info,
  HardDrive,
  Scale,
  Code,
  FileText,
  MessageSquare,
  Globe,
  ExternalLink
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'model-selection-guide'

// Model families (as of February 2026)
const modelFamilies = [
  {
    id: 'llama4',
    name: 'Llama 4',
    provider: 'Meta',
    strengths: 'Multimodal, massive context, strong general performance',
    sizes: ['Scout 109B (17B active)', 'Maverick 400B (17B active)', 'Behemoth ~2T'],
    license: 'Llama license (check commercial terms)',
    bestFor: ['general-purpose', 'multimodal', 'long-context'],
    notes: 'Scout: 10M context, fits single H100. Maverick: 128 experts, 1M context. MoE architecture.'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3.2 / R1',
    provider: 'DeepSeek',
    strengths: 'Best-in-class reasoning, code, math. Beats GPT-5 on reasoning benchmarks.',
    sizes: ['V3.2: 685B (37B active)', 'R1: 671B (37B active)'],
    license: 'MIT License',
    bestFor: ['reasoning', 'code', 'math', 'agentic'],
    notes: 'R1 rivals OpenAI o1. V3.2 uses Sparse Attention for 128K context. Industry leading efficiency.'
  },
  {
    id: 'qwen3',
    name: 'Qwen 3',
    provider: 'Alibaba',
    strengths: 'Multilingual (119 languages), excellent coding, long context',
    sizes: ['Various dense models', '235B-A22B MoE', 'Qwen3-Coder 80B (3B active)'],
    license: 'Apache 2.0 / Qwen license (check version)',
    bestFor: ['multilingual', 'code', 'long-context', 'general-purpose'],
    notes: 'Qwen3-Coder-Next outperforms DeepSeek V3.2 on coding. 92.3% on AIME25.'
  },
  {
    id: 'mistral3',
    name: 'Mistral 3 / Devstral',
    provider: 'Mistral AI',
    strengths: 'Efficient, strong code, runs on low-end hardware',
    sizes: ['Ministral 3B/7B/14B', 'Large 3: 675B (41B active)', 'Devstral Small 2: 24B'],
    license: 'Apache 2.0',
    bestFor: ['code', 'efficiency', 'edge-deployment', 'low-resource'],
    notes: 'Ministral runs on 4GB VRAM. Devstral 2 optimized for software engineering. European company.'
  },
  {
    id: 'gemma3',
    name: 'Gemma 3',
    provider: 'Google',
    strengths: 'Lightweight multimodal, 128K context, 140+ languages',
    sizes: ['270M', '1B', '4B', '12B', '27B'],
    license: 'Gemma Terms of Use (permissive for research)',
    bestFor: ['research', 'lightweight', 'experimentation', 'multimodal'],
    notes: '4B+ models support image input. Excellent for constrained environments and research.'
  },
  {
    id: 'phi4',
    name: 'Phi-4',
    provider: 'Microsoft',
    strengths: 'Exceptional reasoning for size, math specialist',
    sizes: ['Phi-4: 14B', 'Phi-4-mini', 'Phi-4-multimodal', 'Phi-4-reasoning'],
    license: 'MIT License',
    bestFor: ['reasoning', 'math', 'edge-deployment', 'research'],
    notes: 'Outperforms much larger models on math. Phi-4-reasoning for chain-of-thought.'
  }
]

// Task type recommendations
const taskRecommendations = {
  'general-purpose': {
    label: 'General Purpose',
    icon: MessageSquare,
    recommended: ['llama4', 'qwen3', 'deepseek'],
    notes: 'Llama 4 Scout or DeepSeek V3.2 for most general tasks'
  },
  'code': {
    label: 'Code Generation',
    icon: Code,
    recommended: ['qwen3', 'deepseek', 'mistral3'],
    notes: 'Qwen3-Coder leads benchmarks. Devstral 2 excellent for software engineering.'
  },
  'reasoning': {
    label: 'Reasoning & Math',
    icon: Scale,
    recommended: ['deepseek', 'phi4', 'qwen3'],
    notes: 'DeepSeek R1 rivals OpenAI o1. Phi-4-reasoning punches above its weight.'
  },
  'writing': {
    label: 'Writing & Text',
    icon: FileText,
    recommended: ['llama4', 'qwen3', 'deepseek'],
    notes: 'Larger models generally better for nuanced writing'
  },
  'multilingual': {
    label: 'Multilingual',
    icon: Globe,
    recommended: ['qwen3', 'llama4', 'gemma3'],
    notes: 'Qwen 3 supports 119 languages. Gemma 3 covers 140+.'
  },
  'research': {
    label: 'Research / Experimentation',
    icon: Info,
    recommended: ['gemma3', 'phi4', 'mistral3'],
    notes: 'Gemma 3 270M-4B and Phi-4-mini ideal for rapid iteration'
  }
}

// Resource requirements (2026 hardware)
const resourceRequirements = [
  {
    size: '1-4B',
    vramFp16: '~4-8GB',
    vramQuantized: '~2-4GB (4-bit)',
    hardware: 'Any GPU, even integrated (Ministral, Gemma 3, Phi-4-mini)',
    speed: 'Very fast'
  },
  {
    size: '7-14B',
    vramFp16: '~14-28GB',
    vramQuantized: '~4-8GB (4-bit)',
    hardware: 'RTX 3090/4090/5080 (16-24GB)',
    speed: 'Fast (~120-200 tok/s on 5080/5090)'
  },
  {
    size: '27-40B',
    vramFp16: '~54-80GB',
    vramQuantized: '~16-24GB (4-bit)',
    hardware: 'RTX 5090 32GB, RTX 4090 24GB, or multi-GPU',
    speed: 'Moderate (~60 tok/s on 5090)'
  },
  {
    size: '70B+',
    vramFp16: '~140GB+',
    vramQuantized: '~40GB+ (4-bit)',
    hardware: 'Multi-GPU, A100/H100, or HPC cluster',
    speed: 'Slower, use MoE models for efficiency'
  }
]

// Local inference tools (2026)
const inferenceTools = [
  {
    name: 'Ollama',
    description: 'Easiest setup with native tool calling, auto model management',
    url: 'https://ollama.ai',
    bestFor: 'Getting started, single-user, model testing'
  },
  {
    name: 'llama.cpp',
    description: 'Pure C/C++, GGUF format, supports MXFP4 and multimodal',
    url: 'https://github.com/ggerganov/llama.cpp',
    bestFor: 'Maximum efficiency, edge devices, CPU/GPU hybrid'
  },
  {
    name: 'vLLM',
    description: 'PagedAttention, 35x throughput vs single-user tools',
    url: 'https://github.com/vllm-project/vllm',
    bestFor: 'Production serving, multi-user, high throughput'
  },
  {
    name: 'LM Studio',
    description: 'Desktop GUI with model browser and chat interface',
    url: 'https://lmstudio.ai',
    bestFor: 'Visual interface, beginners, quick testing'
  },
  {
    name: 'ExLlamaV2',
    description: 'EXL2 quantization, tensor parallelism for multi-GPU',
    url: 'https://github.com/turboderp/exllamav2',
    bestFor: 'Quantized models, multi-GPU speed'
  }
]

// State
const selectedTask = ref(null)
const selectedModel = ref(null)
const showResources = ref(false)

const isComplete = computed(() => selectedTask.value !== null || selectedModel.value !== null)

const recommendedModels = computed(() => {
  if (!selectedTask.value) return []
  const rec = taskRecommendations[selectedTask.value]
  return modelFamilies.filter(m => rec?.recommended.includes(m.id))
})

function selectTask(taskId) {
  selectedTask.value = taskId
  selectedModel.value = null

  aiStore.completeApplet(APPLET_ID, {
    taskType: taskId,
    recommendedModels: taskRecommendations[taskId]?.recommended || []
  })
}

function selectModel(modelId) {
  selectedModel.value = modelId
  const model = modelFamilies.find(m => m.id === modelId)

  aiStore.completeApplet(APPLET_ID, {
    taskType: selectedTask.value,
    selectedModel: modelId,
    modelName: model?.name,
    license: model?.license
  })
}

function getNextApplet() {
  return 'prompt-engineering'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Model Selection Guide"
    core-question="Which local model should I use?"
    :icon="Cpu"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- When This Applies -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        You've decided to run models locally. Different architectures have different strengths,
        licensing implications, and resource requirements. This guide helps you choose.
      </p>
      <p class="text-xs mt-2 italic" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
        Note: This landscape changes rapidly. Check current benchmarks and releases.
      </p>
    </div>

    <!-- Task Selection -->
    <div class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        What's your primary task?
      </h3>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="(config, taskId) in taskRecommendations"
          :key="taskId"
          @click="selectTask(taskId)"
          class="p-3 rounded-lg border-2 text-left transition-all"
          :class="[
            selectedTask === taskId
              ? (preferencesStore.darkMode ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-400')
              : (preferencesStore.darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'),
            preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'
          ]"
        >
          <div class="flex items-center gap-2">
            <component
              :is="config.icon"
              class="w-4 h-4 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
            />
            <span class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ config.label }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Recommended Models -->
    <div v-if="selectedTask && recommendedModels.length > 0" class="mb-6">
      <h3 class="font-semibold mb-2" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Recommended for {{ taskRecommendations[selectedTask].label }}
      </h3>
      <p class="text-sm mb-4" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        {{ taskRecommendations[selectedTask].notes }}
      </p>

      <div class="space-y-3">
        <div
          v-for="model in recommendedModels"
          :key="model.id"
          @click="selectModel(model.id)"
          class="p-4 rounded-lg border-2 cursor-pointer transition-all"
          :class="[
            selectedModel === model.id
              ? (preferencesStore.darkMode ? 'bg-green-900/30 border-green-500' : 'bg-green-50 border-green-400')
              : (preferencesStore.darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'),
            preferencesStore.darkMode ? 'bg-gray-800' : 'bg-white'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                  {{ model.name }}
                </h4>
                <span
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'"
                >
                  {{ model.provider }}
                </span>
              </div>
              <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ model.strengths }}
              </p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="text-xs" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'">
                  Sizes: {{ model.sizes.join(', ') }}
                </span>
              </div>
              <p class="text-xs mt-2" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-700'">
                <Scale class="w-3 h-3 inline mr-1" />
                {{ model.license }}
              </p>
            </div>
            <CheckCircle
              v-if="selectedModel === model.id"
              class="w-5 h-5 text-green-500 flex-shrink-0 ml-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- All Model Families -->
    <div v-if="!selectedTask" class="mb-6">
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Common Model Families (February 2026)
      </h3>
      <div class="space-y-3">
        <div
          v-for="model in modelFamilies"
          :key="model.id"
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-center gap-2 mb-2">
            <h4 class="font-semibold" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
              {{ model.name }}
            </h4>
            <span
              class="px-2 py-0.5 text-xs rounded-full"
              :class="preferencesStore.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'"
            >
              {{ model.provider }}
            </span>
          </div>
          <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
            <strong>Strengths:</strong> {{ model.strengths }}
          </p>
          <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
            <strong>Sizes:</strong> {{ model.sizes.join(', ') }}
          </p>
          <p class="text-xs mt-2" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-700'">
            {{ model.license }}
          </p>
        </div>
      </div>
    </div>

    <!-- Resource Requirements -->
    <div class="mb-6">
      <button
        @click="showResources = !showResources"
        class="flex items-center gap-2 font-semibold mb-3"
        :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
      >
        <HardDrive class="w-5 h-5" />
        Resource Requirements
        <span class="text-sm font-normal" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'">
          {{ showResources ? '(hide)' : '(show)' }}
        </span>
      </button>

      <div v-if="showResources" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'">
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Model Size</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">VRAM (FP16)</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">VRAM (Quantized)</th>
              <th class="text-left p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'">Hardware</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="req in resourceRequirements"
              :key="req.size"
              :class="preferencesStore.darkMode ? 'border-gray-700' : 'border-gray-200'"
            >
              <td class="p-2 border-b font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">{{ req.size }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ req.vramFp16 }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ req.vramQuantized }}</td>
              <td class="p-2 border-b" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">{{ req.hardware }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Local Inference Tools -->
    <div
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <h3 class="font-semibold mb-3" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Running Locally
      </h3>
      <div class="grid gap-3 sm:grid-cols-2">
        <a
          v-for="tool in inferenceTools"
          :key="tool.name"
          :href="tool.url"
          target="_blank"
          rel="noopener noreferrer"
          class="p-3 rounded-lg border transition-colors flex items-start gap-3"
          :class="preferencesStore.darkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700' : 'border-gray-200 hover:border-gray-300 bg-gray-50'"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h4 class="font-medium text-sm" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ tool.name }}
              </h4>
              <ExternalLink class="w-3 h-3" :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'" />
            </div>
            <p class="text-xs mt-1" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
              {{ tool.description }}
            </p>
            <p class="text-xs mt-1" :class="preferencesStore.darkMode ? 'text-blue-400' : 'text-blue-600'">
              Best for: {{ tool.bestFor }}
            </p>
          </div>
        </a>
      </div>
    </div>

    <!-- License Warning -->
    <div
      class="mt-6 p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'"
    >
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-600'" />
        <div>
          <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-yellow-300' : 'text-yellow-800'">
            Check Licenses Before Deploying
          </h4>
          <p class="text-sm mt-1" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-700'">
            Open-weight models have various licenses. Some restrict commercial use, derivative models,
            or have specific attribution requirements. Always verify the license matches your use case.
          </p>
        </div>
      </div>
    </div>
  </AppletFrame>
</template>
