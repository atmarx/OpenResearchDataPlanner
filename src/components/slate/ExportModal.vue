<script setup>
import { ref, computed } from 'vue'
import { useExport } from '@/composables/useExport'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { X, Download, FileJson, FileText, ChevronDown, User } from 'lucide-vue-next'

const emit = defineEmits(['close'])

// darkMode still drives the LOCKED green wayfinding accent on the Markdown
// export button (green has no semantic token — it stays mode-dependent).
const preferencesStore = usePreferencesStore()
const { generateFilename, exportJSON, exportMarkdown } = useExport()

const projectName = ref('')
const finalNotes = ref('')

// Optional contact info
const contactName = ref('')
const contactEmail = ref('')
const contactDepartment = ref('')
const showContactFields = ref(false)

const isValid = computed(() => projectName.value.trim().length > 0)

// Build contact object only if any contact info provided
const contactInfo = computed(() => {
  const name = contactName.value.trim()
  const email = contactEmail.value.trim()
  const department = contactDepartment.value.trim()

  if (!name && !email && !department) return null

  return {
    name: name || null,
    email: email || null,
    department: department || null
  }
})

const jsonFilename = computed(() =>
  projectName.value.trim()
    ? generateFilename(projectName.value.trim(), 'json')
    : 'project-name-YYYY-MM-DD.share.json'
)

const mdFilename = computed(() =>
  projectName.value.trim()
    ? generateFilename(projectName.value.trim(), 'md')
    : 'project-name-YYYY-MM-DD.draft.md'
)

function handleExportJSON() {
  if (!isValid.value) return
  exportJSON(projectName.value.trim(), finalNotes.value.trim() || null, contactInfo.value)
}

function handleExportMarkdown() {
  if (!isValid.value) return
  exportMarkdown(projectName.value.trim(), finalNotes.value.trim() || null, contactInfo.value)
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="handleClose"
    >
      <div
        class="rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto bg-surface"
      >
        <!-- Header -->
        <div
          class="sticky top-0 border-b px-5 py-4 flex items-center justify-between bg-surface border-border"
        >
          <h2
            class="text-lg font-semibold text-text"
          >
            Export Your Request
          </h2>
          <button
            @click="handleClose"
            class="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-5 space-y-5">
          <!-- Project Name -->
          <div>
            <label
              class="block text-sm font-medium mb-1.5 text-text-secondary"
            >
              Project Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="projectName"
              type="text"
              placeholder="e.g., Chen Lab RNA-seq Study"
              class="w-full px-3 py-2 rounded-lg border text-sm bg-surface border-border-strong text-text placeholder-gray-400"
            />
            <p
              class="mt-1 text-xs text-text-muted"
            >
              Used in the filename and document header
            </p>
          </div>

          <!-- Final Notes -->
          <div>
            <label
              class="block text-sm font-medium mb-1.5 text-text-secondary"
            >
              Additional Notes (optional)
            </label>
            <textarea
              v-model="finalNotes"
              rows="3"
              placeholder="Any additional context for IT, grant details, timeline, etc."
              class="w-full px-3 py-2 rounded-lg border text-sm resize-none bg-surface border-border-strong text-text placeholder-gray-400"
            />
          </div>

          <!-- Contact Info (collapsible) -->
          <div
            class="rounded-lg border border-border"
          >
            <button
              type="button"
              @click="showContactFields = !showContactFields"
              class="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left text-text-secondary hover:text-text"
            >
              <User class="w-4 h-4" />
              <span class="flex-1">Contact Information (optional)</span>
              <ChevronDown
                class="w-4 h-4 transition-transform"
                :class="showContactFields ? 'rotate-180' : ''"
              />
            </button>

            <div
              v-if="showContactFields"
              class="px-3 pb-3 space-y-3 border-t border-border"
            >
              <p
                class="text-xs pt-2 text-text-muted"
              >
                Helps support staff follow up if they have questions.
              </p>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label
                    class="block text-xs font-medium mb-1 text-text-secondary"
                  >
                    Name
                  </label>
                  <input
                    v-model="contactName"
                    type="text"
                    placeholder="Dr. Sarah Chen"
                    class="w-full px-2.5 py-1.5 rounded border text-sm bg-surface border-border-strong text-text placeholder-gray-400"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-medium mb-1 text-text-secondary"
                  >
                    Department
                  </label>
                  <input
                    v-model="contactDepartment"
                    type="text"
                    placeholder="Biology"
                    class="w-full px-2.5 py-1.5 rounded border text-sm bg-surface border-border-strong text-text placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-xs font-medium mb-1 text-text-secondary"
                >
                  Email
                </label>
                <input
                  v-model="contactEmail"
                  type="email"
                  placeholder="schen@university.edu"
                  class="w-full px-2.5 py-1.5 rounded border text-sm bg-surface border-border-strong text-text placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <!-- Export Buttons -->
          <div class="space-y-3">
            <p
              class="text-sm font-medium text-text-secondary"
            >
              Download as:
            </p>

            <!-- JSON Export -->
            <button
              @click="handleExportJSON"
              :disabled="!isValid"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left"
              :class="isValid
                ? 'bg-canvas border-border hover:border-primary hover:bg-surface-alt'
                : 'bg-surface-alt border-border opacity-50 cursor-not-allowed'"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-on-primary"
              >
                <FileJson class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="font-medium text-text"
                >
                  JSON (for Research IT)
                </div>
                <div
                  class="text-xs truncate text-text-muted"
                >
                  {{ jsonFilename }}
                </div>
              </div>
              <Download
                class="w-5 h-5 flex-shrink-0 text-text-muted"
              />
            </button>

            <!-- Markdown Export -->
            <button
              @click="handleExportMarkdown"
              :disabled="!isValid"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left"
              :class="isValid
                ? ['bg-canvas border-border hover:bg-surface-alt', preferencesStore.darkMode ? 'hover:border-green-500' : 'hover:border-green-300']
                : 'bg-surface-alt border-border opacity-50 cursor-not-allowed'"
            >
              <!-- Green icon chip is LOCKED format-wayfinding (success-family) — not skinned. -->
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="preferencesStore.darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'"
              >
                <FileText class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="font-medium text-text"
                >
                  Markdown (for your records)
                </div>
                <div
                  class="text-xs truncate text-text-muted"
                >
                  {{ mdFilename }}
                </div>
              </div>
              <Download
                class="w-5 h-5 flex-shrink-0 text-text-muted"
              />
            </button>
          </div>

          <!-- Help Text -->
          <div
            class="text-xs space-y-1 text-text-muted"
          >
            <p><strong>JSON:</strong> Send this to Research IT for review and approval.</p>
            <p><strong>Markdown:</strong> Human-readable draft for your records. Can be opened in any text editor.</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
