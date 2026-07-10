<script setup>
import { computed } from 'vue'
import { ExternalLink, X } from 'lucide-vue-next'
import { useConfigStore } from '@/stores/configStore'

// Renders one explainer from config/explainers.yaml (content-as-YAML — the
// institution edits strings, never this component): the short answer, the
// worked who-pays-what table, the bottom line, and the corpus link.
const props = defineProps({
  explainer: { type: Object, required: true }
})

const emit = defineEmits(['close'])

const configStore = useConfigStore()

// "Read the full guide →" resolves full_guide.corpus_path against the
// governance corpus base URL (meta.governance_corpus_url). If no base is
// configured, the link stays hidden and the in-app explainer stands alone.
const fullGuideUrl = computed(() => {
  const base = configStore.config?.meta?.governance_corpus_url
  const path = props.explainer?.full_guide?.corpus_path
  if (!base || !path) return null
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      @click.self="emit('close')"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explainer-title"
    >
      <div
        class="rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-xl max-h-[90vh] overflow-y-auto bg-surface"
      >
        <!-- Header -->
        <div
          class="sticky top-0 border-b px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-xl bg-surface border-border"
        >
          <h2
            id="explainer-title"
            class="text-lg font-semibold text-text"
          >
            {{ explainer.title }}
          </h2>
          <button
            @click="emit('close')"
            class="p-1.5 rounded-lg transition-colors hover:bg-surface-alt text-text-muted"
            aria-label="Close"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="px-5 py-4 space-y-5">

          <!-- The short answer -->
          <p class="text-sm whitespace-pre-line text-text-secondary">
            {{ explainer.short }}
          </p>

          <!-- Worked example — pure config data (columns/rows straight from YAML) -->
          <div
            v-if="explainer.table"
            class="rounded-lg border overflow-hidden border-border"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <caption
                  class="text-left text-xs uppercase tracking-wide font-medium px-3 py-2 bg-surface-alt text-text-muted"
                >
                  {{ explainer.table.caption }}
                </caption>
                <thead v-if="explainer.table.columns?.length">
                  <tr class="border-t border-b border-border">
                    <th
                      v-for="(col, i) in explainer.table.columns"
                      :key="i"
                      class="text-left px-3 py-2 font-medium text-text-secondary"
                    >
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, i) in explainer.table.rows"
                    :key="i"
                    class="border-b last:border-b-0 border-border"
                  >
                    <td
                      v-for="(cell, j) in row"
                      :key="j"
                      class="px-3 py-2 align-top"
                      :class="j === 0 ? 'font-medium text-text' : 'text-text-secondary'"
                    >
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              v-if="explainer.table.footnote"
              class="text-xs px-3 py-2 border-t bg-surface-alt border-border text-text-muted"
            >
              {{ explainer.table.footnote }}
            </p>
          </div>

          <!-- The takeaway -->
          <p
            v-if="explainer.bottom_line"
            class="text-sm font-medium border-l-4 pl-3 border-primary text-text"
          >
            {{ explainer.bottom_line }}
          </p>

          <!-- Depth: the statute-grounded corpus page -->
          <a
            v-if="fullGuideUrl"
            :href="fullGuideUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {{ explainer.full_guide.text }}
            <ExternalLink class="w-3.5 h-3.5" />
          </a>

        </div>
      </div>
    </div>
  </Teleport>
</template>
