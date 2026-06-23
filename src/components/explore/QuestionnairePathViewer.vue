<script setup>
import { ref, computed } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDot,
  CircleCheck,
  CornerDownRight,
  MapPin,
  RotateCcw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock
} from 'lucide-vue-next'

const props = defineProps({
  path: {
    type: Array,
    default: () => []
  },
  currentQuestionId: {
    type: String,
    default: null
  },
  currentQuestionText: {
    type: String,
    default: ''
  },
  optionsPreview: {
    type: Array,
    default: () => []
  },
  currentTier: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['go-back-to', 'reset'])

// Mobile panel state
const isOpen = ref(false)

function togglePanel() {
  isOpen.value = !isOpen.value
}

function handleGoBack(index) {
  emit('go-back-to', index)
}

function handleReset() {
  emit('reset')
  isOpen.value = false
}

// Tier styling
const tierIcons = {
  low: ShieldCheck,
  medium: Shield,
  high: ShieldAlert,
  restricted: Lock
}

const tierColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-orange-500',
  restricted: 'text-red-500'
}

const tierBgColors = {
  low: 'bg-green-500/10',
  medium: 'bg-yellow-500/10',
  high: 'bg-orange-500/10',
  restricted: 'bg-red-500/10'
}

function getTierIcon(tier) {
  return tierIcons[tier] || Shield
}

// No longer truncating - show full question text

const hasHistory = computed(() => props.path.length > 0)
</script>

<template>
  <!-- Mobile: Side tab + slide-out panel -->
  <div class="2xl:hidden">
    <!-- Tab trigger (visible when panel is closed and has history) -->
    <button
      v-if="!isOpen && hasHistory"
      @click="togglePanel"
      class="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1 px-2 py-4 rounded-l-lg shadow-lg transition-colors bg-primary text-on-primary hover:bg-primary-dark"
    >
      <ChevronLeft class="w-4 h-4" />
      <span class="text-xs font-medium writing-mode-vertical">Your Path</span>
    </button>

    <!-- Slide-out panel -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-40 shadow-2xl overflow-y-auto bg-surface"
      >
        <!-- Panel header -->
        <div
          class="sticky top-0 flex items-center justify-between px-4 py-3 border-b bg-surface border-border"
        >
          <div class="flex items-center gap-2">
            <MapPin class="w-4 h-4 text-primary" />
            <span
              class="font-semibold text-text"
            >Your Path</span>
          </div>
          <button
            @click="togglePanel"
            class="p-2 rounded-lg transition-colors hover:bg-surface-alt text-text-muted"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Panel content (mobile) -->
        <div class="p-4 space-y-1">
          <!-- Empty state -->
          <div
            v-if="!path.length && !currentQuestionId"
            class="text-center py-6 text-text-muted"
          >
            <p class="text-sm">Start answering questions to see your path here.</p>
          </div>

          <!-- Path history -->
          <template v-for="(entry, idx) in path" :key="entry.questionId">
            <button
              @click="handleGoBack(idx - 1)"
              class="w-full text-left group"
            >
              <div class="flex items-start gap-2 py-2 px-2 rounded-lg transition-colors hover:bg-surface-alt"
              >
                <CircleCheck class="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                <div class="flex-1 min-w-0">
                  <div
                    class="text-xs leading-tight text-text-muted"
                  >
                    {{ entry.questionText }}
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    <CornerDownRight class="w-3 h-3 flex-shrink-0 text-text-muted" />
                    <span
                      class="text-sm font-medium text-text"
                    >
                      {{ entry.answerLabel }}
                    </span>
                    <component
                      v-if="entry.tier"
                      :is="getTierIcon(entry.tier)"
                      class="w-3.5 h-3.5"
                      :class="tierColors[entry.tier]"
                    />
                  </div>
                </div>
              </div>
            </button>
            <div
              v-if="idx < path.length - 1 || currentQuestionId"
              class="ml-4 h-2 border-l-2 border-border"
            />
          </template>

          <!-- Current question -->
          <div v-if="currentQuestionId && currentQuestionId !== 'complete'" class="py-2 px-2">
            <div class="flex items-start gap-2">
              <CircleDot class="w-4 h-4 mt-0.5 flex-shrink-0 text-primary animate-pulse" />
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium uppercase tracking-wide text-primary">Current</div>
                <div
                  class="text-sm text-text"
                >
                  {{ currentQuestionText }}
                </div>
                <div v-if="optionsPreview.length" class="mt-2 space-y-1">
                  <div
                    v-for="opt in optionsPreview"
                    :key="opt.value"
                    class="flex items-center gap-2 text-xs text-text-muted"
                  >
                    <Circle class="w-2.5 h-2.5" />
                    <span>{{ opt.label }}</span>
                    <component
                      v-if="opt.leadsTier"
                      :is="getTierIcon(opt.leadsTier)"
                      class="w-3 h-3 ml-auto"
                      :class="tierColors[opt.leadsTier]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed state -->
          <div
            v-if="currentQuestionId === 'complete' && currentTier"
            class="py-3 px-3 rounded-lg mt-2"
            :class="tierBgColors[currentTier]"
          >
            <div class="flex items-center gap-2">
              <component :is="getTierIcon(currentTier)" class="w-5 h-5" :class="tierColors[currentTier]" />
              <span
                class="font-semibold capitalize text-text"
              >
                {{ currentTier }} Tier
              </span>
            </div>
          </div>

          <!-- Reset button -->
          <button
            v-if="path.length > 0"
            @click="handleReset"
            class="flex items-center gap-2 mt-4 text-xs w-full justify-center py-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
          >
            <RotateCcw class="w-3 h-3" />
            Start over
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        @click="togglePanel"
        class="fixed inset-0 bg-black/30 z-30"
      />
    </Transition>
  </div>

  <!-- Desktop: Always visible sidebar -->
  <div class="hidden 2xl:block w-72 flex-shrink-0">
    <div
      class="sticky top-20 rounded-lg border overflow-hidden bg-surface border-border"
    >
      <!-- Header -->
      <div
        class="flex items-center gap-2 px-4 py-3 border-b border-border"
      >
        <MapPin class="w-4 h-4 text-primary" />
        <span
          class="font-semibold text-text"
        >Your Path</span>
      </div>

      <!-- Content (desktop) -->
      <div class="p-4 max-h-[60vh] overflow-y-auto space-y-1">
        <!-- Empty state -->
        <div
          v-if="!path.length && !currentQuestionId"
          class="text-center py-6 text-text-muted"
        >
          <p class="text-sm">Start answering questions to see your path here.</p>
        </div>

        <!-- Path history -->
        <template v-for="(entry, idx) in path" :key="'desktop-' + entry.questionId">
          <button
            @click="handleGoBack(idx - 1)"
            class="w-full text-left group"
          >
            <div class="flex items-start gap-2 py-2 px-2 rounded-lg transition-colors hover:bg-surface-alt"
            >
              <CircleCheck class="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
              <div class="flex-1 min-w-0">
                <div
                  class="text-xs leading-tight text-text-muted"
                >
                  {{ entry.questionText }}
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <CornerDownRight class="w-3 h-3 flex-shrink-0 text-text-muted" />
                  <span
                    class="text-sm font-medium text-text"
                  >
                    {{ entry.answerLabel }}
                  </span>
                  <component
                    v-if="entry.tier"
                    :is="getTierIcon(entry.tier)"
                    class="w-3.5 h-3.5"
                    :class="tierColors[entry.tier]"
                  />
                </div>
              </div>
            </div>
          </button>
          <div
            v-if="idx < path.length - 1 || currentQuestionId"
            class="ml-4 h-2 border-l-2 border-border"
          />
        </template>

        <!-- Current question -->
        <div v-if="currentQuestionId && currentQuestionId !== 'complete'" class="py-2 px-2">
          <div class="flex items-start gap-2">
            <CircleDot class="w-4 h-4 mt-0.5 flex-shrink-0 text-primary animate-pulse" />
            <div class="flex-1 min-w-0">
              <div class="text-xs font-medium uppercase tracking-wide text-primary">Current</div>
              <div
                class="text-sm text-text"
              >
                {{ currentQuestionText }}
              </div>
              <div v-if="optionsPreview.length" class="mt-2 space-y-1">
                <div
                  v-for="opt in optionsPreview"
                  :key="opt.value"
                  class="flex items-center gap-2 text-xs text-text-muted"
                >
                  <Circle class="w-2.5 h-2.5" />
                  <span>{{ opt.label }}</span>
                  <component
                    v-if="opt.leadsTier"
                    :is="getTierIcon(opt.leadsTier)"
                    class="w-3 h-3 ml-auto"
                    :class="tierColors[opt.leadsTier]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed state -->
        <div
          v-if="currentQuestionId === 'complete' && currentTier"
          class="py-3 px-3 rounded-lg mt-2"
          :class="tierBgColors[currentTier]"
        >
          <div class="flex items-center gap-2">
            <component :is="getTierIcon(currentTier)" class="w-5 h-5" :class="tierColors[currentTier]" />
            <span
              class="font-semibold capitalize text-text"
            >
              {{ currentTier }} Tier
            </span>
          </div>
        </div>

        <!-- Reset button -->
        <button
          v-if="path.length > 0"
          @click="handleReset"
          class="flex items-center gap-2 mt-4 text-xs w-full justify-center py-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-alt"
        >
          <RotateCcw class="w-3 h-3" />
          Start over
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.writing-mode-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
