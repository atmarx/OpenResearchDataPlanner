<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useHeroBackgrounds } from '@/composables/useHeroBackgrounds'
import { X, ImageOff, Shuffle, Check } from 'lucide-vue-next'

const emit = defineEmits(['close'])

const preferences = usePreferencesStore()
const { backgrounds } = useHeroBackgrounds()

// Effective mode drives which single tile reads as selected (radio semantics):
// off wins over everything; otherwise random, else a specific photo.
const mode = computed(() => {
  if (!preferences.showWallpaper) return 'off'
  return preferences.wallpaperRandom ? 'random' : 'photo'
})
const activeImage = computed(() => {
  const found = backgrounds.value.find((b) => b.image === preferences.wallpaperChoice)
  return (found || backgrounds.value[0])?.image
})

function chooseOff() {
  if (preferences.showWallpaper) preferences.toggleWallpaper()
}
function chooseRandom() {
  preferences.setWallpaperRandom(true)
}
function choosePhoto(image) {
  preferences.setWallpaperChoice(image)
}

function isPhotoSelected(image) {
  return mode.value === 'photo' && activeImage.value === image
}

const panelRef = ref(null)
function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  panelRef.value?.focus()
})
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- z-[60]: clears the sticky z-50 AppHeader (and its z-50 settings popover)
       this modal is launched from, rather than relying on DOM order to win the tie. -->
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4"
      @click.self="emit('close')"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bg-modal-title"
    >
      <div
        ref="panelRef"
        tabindex="-1"
        class="rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-surface focus:outline-none"
      >
        <!-- Header -->
        <div
          class="sticky top-0 border-b px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-xl bg-surface border-border"
        >
          <div>
            <h2 id="bg-modal-title" class="text-lg font-semibold text-text">Background</h2>
            <p class="text-xs text-text-muted mt-0.5">Choose a backdrop for your session — or none at all.</p>
          </div>
          <button
            @click="emit('close')"
            class="p-1.5 rounded-lg transition-colors hover:bg-surface-alt text-text-muted"
            aria-label="Close"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-5">
          <div
            role="radiogroup"
            aria-labelledby="bg-modal-title"
            class="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            <!-- Off -->
            <button
              type="button"
              role="radio"
              :aria-checked="mode === 'off'"
              @click="chooseOff"
              class="group relative rounded-lg border overflow-hidden text-left transition-colors focus-visible:outline-none aspect-video flex flex-col items-center justify-center gap-1 bg-surface-alt hover:bg-surface-alt border-border"
              :class="mode === 'off' ? 'ux-selected-glow border-primary' : ''"
            >
              <ImageOff class="w-6 h-6 text-text-muted" />
              <span class="text-sm font-medium text-text-secondary">None</span>
              <span
                v-if="mode === 'off'"
                class="absolute top-1.5 right-1.5 rounded-full bg-primary text-on-primary p-0.5"
              ><Check class="w-3.5 h-3.5" /></span>
            </button>

            <!-- Surprise me (only meaningful with 2+ choices) -->
            <button
              v-if="backgrounds.length > 1"
              type="button"
              role="radio"
              :aria-checked="mode === 'random'"
              @click="chooseRandom"
              class="group relative rounded-lg border overflow-hidden text-left transition-colors focus-visible:outline-none aspect-video flex flex-col items-center justify-center gap-1 bg-surface-alt hover:bg-surface-alt border-border"
              :class="mode === 'random' ? 'ux-selected-glow border-primary' : ''"
            >
              <Shuffle class="w-6 h-6 text-primary" />
              <span class="text-sm font-medium text-text-secondary">Surprise me</span>
              <span class="text-[11px] text-text-muted">A fresh one each visit</span>
              <span
                v-if="mode === 'random'"
                class="absolute top-1.5 right-1.5 rounded-full bg-primary text-on-primary p-0.5"
              ><Check class="w-3.5 h-3.5" /></span>
            </button>

            <!-- Photos -->
            <button
              v-for="bg in backgrounds"
              :key="bg.image"
              type="button"
              role="radio"
              :aria-checked="isPhotoSelected(bg.image)"
              @click="choosePhoto(bg.image)"
              class="group relative rounded-lg border overflow-hidden text-left transition-colors focus-visible:outline-none border-border"
              :class="isPhotoSelected(bg.image) ? 'ux-selected-glow border-primary' : ''"
            >
              <div class="aspect-video w-full overflow-hidden bg-surface-alt">
                <img
                  :src="bg.thumb"
                  :alt="bg.caption || 'Background option'"
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
              </div>
              <span
                v-if="isPhotoSelected(bg.image)"
                class="absolute top-1.5 right-1.5 rounded-full bg-primary text-on-primary p-0.5"
              ><Check class="w-3.5 h-3.5" /></span>
              <div v-if="bg.caption || bg.credit" class="px-2 py-1.5">
                <p v-if="bg.caption" class="text-xs font-medium text-text-secondary truncate">{{ bg.caption }}</p>
                <p v-if="bg.credit" class="text-[11px] text-text-muted truncate">Photo: {{ bg.credit }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
