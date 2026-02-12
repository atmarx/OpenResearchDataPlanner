<script setup>
import { ref, computed } from 'vue'
import { useAiGuidanceStore } from '../stores/aiGuidanceStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppletFrame from '../components/AppletFrame.vue'
import {
  UserCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  FileText,
  ThumbsUp,
  ThumbsDown
} from 'lucide-vue-next'

const aiStore = useAiGuidanceStore()
const preferencesStore = usePreferencesStore()

const APPLET_ID = 'student-guidance'

// Core mental model points
const mentalModel = [
  {
    id: 'responsibility',
    title: 'You are responsible for your work',
    points: [
      'If you submit it, you own it',
      'AI errors become your errors',
      '"The AI did it" is not a defense'
    ]
  },
  {
    id: 'tool',
    title: 'AI is a tool, not a collaborator',
    points: [
      'Use it like a calculator, not a co-author',
      'It doesn\'t understand your assignment',
      'It doesn\'t know your course material',
      'It doesn\'t know when it\'s wrong'
    ]
  },
  {
    id: 'learning',
    title: 'Learning is the point',
    points: [
      'If AI does the work, you miss the learning',
      'Struggle is part of skill development',
      'Consider: What am I actually learning?'
    ]
  }
]

// Decision framework
const decisionSteps = [
  {
    id: 'policy',
    question: 'Does my instructor\'s policy permit this?',
    ifNo: 'ASK FIRST',
    ifUnclear: 'ASK FIRST'
  },
  {
    id: 'learning',
    question: 'What am I trying to learn from this assignment?',
    ifNo: 'DON\'T USE IT',
    note: 'If AI bypasses the learning objective'
  },
  {
    id: 'verify',
    question: 'Can I verify and understand AI\'s output?',
    ifNo: 'DON\'T USE IT',
    note: 'If you can\'t evaluate correctness'
  },
  {
    id: 'document',
    question: 'Will I document my AI use?',
    ifRequired: 'PREPARE TO DOCUMENT',
    note: 'If disclosure is required'
  },
  {
    id: 'defend',
    question: 'Can I defend everything in my submission?',
    ifNo: 'REVISE UNTIL YOU CAN',
    note: 'If asked about any part'
  }
]

// Appropriate vs inappropriate use
const useCases = {
  appropriate: [
    { use: 'Explaining concepts you\'re learning', why: 'Helps understanding' },
    { use: 'Debugging your code (that you wrote)', why: 'You understand the context' },
    { use: 'Brainstorming ideas (that you develop)', why: 'Starting point, not endpoint' },
    { use: 'Checking grammar/clarity', why: 'Your content, AI polish' },
    { use: 'Learning how to approach problems', why: 'Understanding process' }
  ],
  inappropriate: [
    { use: 'Generating answers you submit', why: 'Not your learning' },
    { use: 'Writing code for you', why: 'Bypasses skill development' },
    { use: 'Writing your essay', why: 'Not your work' },
    { use: 'Generating citations', why: 'AI fabricates references' },
    { use: 'Doing problem sets', why: 'Practice is the point' }
  ]
}

// State
const viewedSections = ref(new Set())
const isComplete = computed(() => viewedSections.value.size >= 3)

function markViewed(section) {
  viewedSections.value.add(section)
  viewedSections.value = new Set(viewedSections.value)

  if (isComplete.value) {
    aiStore.completeApplet(APPLET_ID, {
      sectionsViewed: Array.from(viewedSections.value)
    })
  }
}

function getNextApplet() {
  return 'bias-assessment'
}
</script>

<template>
  <AppletFrame
    :applet-id="APPLET_ID"
    title="Student Guidance"
    core-question="How should I use AI for my coursework?"
    :icon="UserCircle"
    :is-complete="isComplete"
    :get-next-applet="getNextApplet"
  >
    <!-- Intro -->
    <div
      class="p-4 rounded-lg border mb-6"
      :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <p class="text-sm" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Students need clear, actionable guidance — not just rules, but understanding of why and how.
        Always defer to your instructor's specific policy.
      </p>
    </div>

    <!-- Mental Model -->
    <div class="mb-6" @mouseenter="markViewed('mental-model')">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        The Student Mental Model
      </h3>
      <div class="space-y-4">
        <div
          v-for="(item, index) in mentalModel"
          :key="item.id"
          class="p-4 rounded-lg border"
          :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <h4 class="font-medium mb-2" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
            {{ index + 1 }}. {{ item.title }}
          </h4>
          <ul class="space-y-1">
            <li
              v-for="point in item.points"
              :key="point"
              class="text-sm flex items-start gap-2"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              <span class="text-gray-400">•</span>
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Decision Framework -->
    <div class="mb-6" @mouseenter="markViewed('decision-framework')">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Before Using AI, Ask Yourself:
      </h3>
      <div
        class="p-4 rounded-lg border"
        :class="preferencesStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="space-y-4">
          <div
            v-for="(step, index) in decisionSteps"
            :key="step.id"
            class="flex items-start gap-3"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
              :class="preferencesStore.darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <p class="font-medium" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
                {{ step.question }}
              </p>
              <p
                v-if="step.ifNo"
                class="text-sm mt-1"
                :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-600'"
              >
                → If no or unclear: <strong>{{ step.ifNo }}</strong>
              </p>
              <p
                v-if="step.ifRequired"
                class="text-sm mt-1"
                :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-600'"
              >
                → If required: <strong>{{ step.ifRequired }}</strong>
              </p>
              <p
                v-if="step.note"
                class="text-xs mt-1"
                :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
              >
                {{ step.note }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appropriate vs Inappropriate -->
    <div class="mb-6" @mouseenter="markViewed('use-cases')">
      <h3 class="font-semibold mb-4" :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'">
        Appropriate vs. Inappropriate Use
      </h3>
      <p class="text-sm mb-4" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        General guidance — always defer to your instructor's specific policy
      </p>

      <div class="grid gap-4 md:grid-cols-2">
        <!-- Appropriate -->
        <div
          class="p-4 rounded-lg border-2"
          :class="preferencesStore.darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'"
        >
          <div class="flex items-center gap-2 mb-3">
            <ThumbsUp class="w-5 h-5" :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-600'" />
            <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-green-300' : 'text-green-800'">
              Generally Appropriate
            </h4>
          </div>
          <ul class="space-y-2">
            <li
              v-for="item in useCases.appropriate"
              :key="item.use"
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-700'"
            >
              <strong>{{ item.use }}</strong>
              <span class="block text-xs opacity-75">{{ item.why }}</span>
            </li>
          </ul>
        </div>

        <!-- Inappropriate -->
        <div
          class="p-4 rounded-lg border-2"
          :class="preferencesStore.darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'"
        >
          <div class="flex items-center gap-2 mb-3">
            <ThumbsDown class="w-5 h-5" :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-600'" />
            <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-red-300' : 'text-red-800'">
              Generally Inappropriate
            </h4>
          </div>
          <ul class="space-y-2">
            <li
              v-for="item in useCases.inappropriate"
              :key="item.use"
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-red-400' : 'text-red-700'"
            >
              <strong>{{ item.use }}</strong>
              <span class="block text-xs opacity-75">{{ item.why }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Key Reminder -->
    <div
      class="p-4 rounded-lg border"
      :class="preferencesStore.darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'"
    >
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-600'" />
        <div>
          <h4 class="font-medium" :class="preferencesStore.darkMode ? 'text-yellow-300' : 'text-yellow-800'">
            Remember
          </h4>
          <ul class="text-sm mt-2 space-y-1" :class="preferencesStore.darkMode ? 'text-yellow-400' : 'text-yellow-700'">
            <li>• AI can be confidently wrong — always verify</li>
            <li>• AI doesn't know your course content or assignment requirements</li>
            <li>• If you're unsure about AI use, ask your instructor</li>
            <li>• Academic integrity policies apply to AI use</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Progress indicator -->
    <div
      v-if="!isComplete"
      class="mt-6 p-3 rounded-lg"
      :class="preferencesStore.darkMode ? 'bg-gray-800' : 'bg-gray-100'"
    >
      <p class="text-sm text-center" :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'">
        Review all sections to complete this applet
        ({{ viewedSections.size }}/3 viewed)
      </p>
    </div>
  </AppletFrame>
</template>
