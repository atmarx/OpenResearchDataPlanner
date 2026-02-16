<script setup>
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useConfigStore } from '@/stores/configStore'
import { computed } from 'vue'
import {
  Bot,
  Code,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowLeft
} from 'lucide-vue-next'

const preferencesStore = usePreferencesStore()
const configStore = useConfigStore()

const institutionName = computed(() =>
  configStore.config?.meta?.institution?.name || 'Research IT'
)

// Config-driven content
const aiDisclosure = computed(() => configStore.config?.meta?.ai_disclosure)
const aboutPage = computed(() => aiDisclosure.value?.about_page || {})

const pageIntro = computed(() =>
  aboutPage.value.intro || 'How we used AI to build this tool, and why transparency matters.'
)

const citationText = computed(() => {
  const template = aboutPage.value.citation ||
    'OpenDataPlanner. (2024-2026). Developed by {institution} with AI coding assistance from Claude (Anthropic). All code and content reviewed by human staff.'
  return template.replace('{institution}', institutionName.value)
})
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Back Link -->
    <router-link
      to="/"
      class="inline-flex items-center gap-1 text-sm mb-6"
      :class="preferencesStore.darkMode
        ? 'text-gray-400 hover:text-white'
        : 'text-gray-500 hover:text-gray-900'"
    >
      <ArrowLeft class="w-4 h-4" />
      Back to home
    </router-link>

    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center"
          :class="preferencesStore.darkMode
            ? 'bg-indigo-900/50 text-indigo-400'
            : 'bg-indigo-100 text-indigo-600'"
        >
          <Bot class="w-6 h-6" />
        </div>
        <h1
          class="text-2xl font-bold"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          AI in OpenDataPlanner
        </h1>
      </div>
      <p
        class="text-lg"
        :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
      >
        {{ pageIntro }}
      </p>
    </div>

    <!-- Main Content -->
    <div class="space-y-8">
      <!-- Why This Page Exists -->
      <section
        class="rounded-xl border p-6"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Why This Page Exists
        </h2>
        <p
          class="mb-4"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
        >
          OpenDataPlanner includes guidance on responsible AI use for researchers. We believe
          it's essential to practice what we teach. This page documents our own AI usage so
          you can see how we apply the same principles we recommend to faculty.
        </p>
        <p
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
        >
          Transparency about AI involvement builds trust and helps others make informed
          decisions about using AI-assisted tools.
        </p>
      </section>

      <!-- How AI Was Used -->
      <section
        class="rounded-xl border p-6"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-4"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          How AI Was Used
        </h2>

        <div class="space-y-4">
          <!-- Code Generation -->
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              :class="preferencesStore.darkMode
                ? 'bg-blue-900/50 text-blue-400'
                : 'bg-blue-100 text-blue-600'"
            >
              <Code class="w-5 h-5" />
            </div>
            <div>
              <h3
                class="font-medium"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                Code Generation
              </h3>
              <p
                class="text-sm mt-1"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
              >
                Vue components, JavaScript logic, and CSS styling were developed with
                AI coding assistance (Claude by Anthropic via Claude Code). This accelerated
                development while maintaining code quality through human review.
              </p>
            </div>
          </div>

          <!-- Documentation -->
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              :class="preferencesStore.darkMode
                ? 'bg-green-900/50 text-green-400'
                : 'bg-green-100 text-green-600'"
            >
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <h3
                class="font-medium"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                Documentation Drafts
              </h3>
              <p
                class="text-sm mt-1"
                :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
              >
                Initial drafts of help text, guidance content, and technical documentation
                were AI-assisted. All content was reviewed, edited, and verified by
                {{ institutionName }} staff for accuracy and institutional fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Human Oversight -->
      <section
        class="rounded-xl border p-6"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-4"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Human Oversight
        </h2>

        <div class="flex gap-4 mb-4">
          <div
            class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            :class="preferencesStore.darkMode
              ? 'bg-purple-900/50 text-purple-400'
              : 'bg-purple-100 text-purple-600'"
          >
            <Users class="w-5 h-5" />
          </div>
          <p
            class="text-sm"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
          >
            Every piece of AI-generated output was reviewed by human developers. This includes:
          </p>
        </div>

        <ul
          class="space-y-2 ml-14"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
        >
          <li class="flex items-start gap-2 text-sm">
            <CheckCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-500'"
            />
            <span><strong>Architecture decisions</strong> made by humans based on project requirements</span>
          </li>
          <li class="flex items-start gap-2 text-sm">
            <CheckCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-500'"
            />
            <span><strong>Code review</strong> for security, correctness, and maintainability</span>
          </li>
          <li class="flex items-start gap-2 text-sm">
            <CheckCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-500'"
            />
            <span><strong>Content verification</strong> against institutional policies and best practices</span>
          </li>
          <li class="flex items-start gap-2 text-sm">
            <CheckCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-500'"
            />
            <span><strong>Testing</strong> to ensure functionality works as intended</span>
          </li>
          <li class="flex items-start gap-2 text-sm">
            <CheckCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-green-400' : 'text-green-500'"
            />
            <span><strong>Domain expertise</strong> from Research IT and compliance specialists</span>
          </li>
        </ul>
      </section>

      <!-- What AI Did NOT Do -->
      <section
        class="rounded-xl border p-6"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-4"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          What AI Did NOT Do
        </h2>

        <ul
          class="space-y-2"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
        >
          <li class="flex items-start gap-2 text-sm">
            <AlertCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-amber-400' : 'text-amber-500'"
            />
            <span>AI did not determine institutional policies or compliance requirements</span>
          </li>
          <li class="flex items-start gap-2 text-sm">
            <AlertCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-amber-400' : 'text-amber-500'"
            />
            <span>AI did not set pricing, tier classifications, or service availability</span>
          </li>
          <li class="flex items-start gap-2 text-sm">
            <AlertCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-amber-400' : 'text-amber-500'"
            />
            <span>AI did not have access to sensitive institutional data or user information</span>
          </li>
          <li class="flex items-start gap-2 text-sm">
            <AlertCircle
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              :class="preferencesStore.darkMode ? 'text-amber-400' : 'text-amber-500'"
            />
            <span>AI did not make final decisions about content accuracy or appropriateness</span>
          </li>
        </ul>
      </section>

      <!-- Our Principles -->
      <section
        class="rounded-xl border p-6"
        :class="preferencesStore.darkMode
          ? 'bg-indigo-900/30 border-indigo-800'
          : 'bg-indigo-50 border-indigo-200'"
      >
        <h2
          class="text-lg font-semibold mb-4"
          :class="preferencesStore.darkMode ? 'text-indigo-200' : 'text-indigo-900'"
        >
          The Same Principles We Recommend
        </h2>

        <p
          class="mb-4 text-sm"
          :class="preferencesStore.darkMode ? 'text-indigo-300' : 'text-indigo-700'"
        >
          We followed the guidance we provide in our
          <router-link
            to="/ai"
            class="underline font-medium"
            :class="preferencesStore.darkMode ? 'text-indigo-200' : 'text-indigo-800'"
          >AI Guidance section</router-link>:
        </p>

        <div
          class="grid gap-3 text-sm"
          :class="preferencesStore.darkMode ? 'text-indigo-300' : 'text-indigo-700'"
        >
          <div class="flex items-center gap-2">
            <span class="font-semibold">1. Transparent Disclosure</span>
            <span class="opacity-75">- You're reading it</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">2. Human Oversight</span>
            <span class="opacity-75">- All outputs reviewed before use</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">3. Appropriate Use</span>
            <span class="opacity-75">- AI assisted coding, not decision-making</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">4. Continuous Verification</span>
            <span class="opacity-75">- Ongoing testing and user feedback</span>
          </div>
        </div>
      </section>

      <!-- Report Issues -->
      <section
        class="rounded-xl border p-6"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Found an Issue?
        </h2>
        <p
          class="mb-4"
          :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-600'"
        >
          If you notice errors, have concerns, or want to suggest improvements, please let us know.
          Your feedback helps us improve the tool for everyone.
        </p>
        <div class="flex flex-wrap gap-3">
          <a
            href="https://github.com/your-org/opendataplanner/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="preferencesStore.darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            Report on GitHub
            <ExternalLink class="w-4 h-4" />
          </a>
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="preferencesStore.darkMode
              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'"
          >
            Contact Research IT
          </router-link>
        </div>
      </section>

      <!-- Citation -->
      <section
        class="rounded-xl border p-6"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h2
          class="text-lg font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Citation
        </h2>
        <p
          class="mb-3 text-sm"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-500'"
        >
          If referencing this tool's development approach:
        </p>
        <div
          class="p-3 rounded-lg font-mono text-sm whitespace-pre-line"
          :class="preferencesStore.darkMode
            ? 'bg-gray-900 text-gray-300'
            : 'bg-gray-100 text-gray-700'"
        >{{ citationText.trim() }}</div>
      </section>
    </div>
  </div>
</template>
