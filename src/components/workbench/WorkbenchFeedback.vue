<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import {
  MessageSquare,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  KeyRound,
  AlertCircle
} from 'lucide-vue-next'

// Site feedback metrics for IT staff. The /feedback/stats endpoint is admin-gated
// because it returns PII (names/emails visitors chose to share), so the admin key
// must NOT be baked into the public bundle. Instead the staffer enters it here at
// runtime and it lives only in sessionStorage for this tab. (Production can instead
// have Caddy inject the key on a staff-only path — see services/feedback-api.)
const KEY_STORAGE = 'odp-workbench-feedback-key'

const configStore = useConfigStore()

const apiUrl = computed(() => configStore.config?.meta?.feedback?.api_url || '')
const feedbackEnabled = computed(() => configStore.config?.meta?.feedback?.enabled === true)

const expanded = ref(false)
const adminKey = ref(sessionStorage.getItem(KEY_STORAGE) || '')
const keyInput = ref('')
const stats = ref(null)
const loading = ref(false)
const error = ref('')

const hasKey = computed(() => !!adminKey.value)

function saveKey() {
  const k = keyInput.value.trim()
  if (!k) return
  adminKey.value = k
  sessionStorage.setItem(KEY_STORAGE, k)
  keyInput.value = ''
  fetchStats()
}

function changeKey() {
  adminKey.value = ''
  sessionStorage.removeItem(KEY_STORAGE)
  stats.value = null
  error.value = ''
}

async function fetchStats() {
  if (!adminKey.value || !apiUrl.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${apiUrl.value}/feedback/stats`, {
      headers: { 'X-API-Key': adminKey.value }
    })
    if (res.status === 401) {
      error.value = 'Admin key rejected. Use "Change key" to re-enter it.'
      return
    }
    if (!res.ok) {
      error.value = `Request failed (HTTP ${res.status}).`
      return
    }
    stats.value = await res.json()
  } catch (e) {
    error.value = `Could not reach the feedback service: ${e.message}`
  } finally {
    loading.value = false
  }
}

function toggle() {
  expanded.value = !expanded.value
  if (expanded.value && hasKey.value && !stats.value && !loading.value) {
    fetchStats()
  }
}

function pct(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

function formatDate(s) {
  if (!s) return ''
  // sqlite datetime('now') is UTC, formatted "YYYY-MM-DD HH:MM:SS"
  const d = new Date(s.replace(' ', 'T') + 'Z')
  if (isNaN(d)) return s
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })
}

const upCount = computed(() => stats.value?.by_sentiment?.up || 0)
const downCount = computed(() => stats.value?.by_sentiment?.down || 0)
</script>

<template>
  <section class="rounded-xl border bg-surface border-border overflow-hidden">
    <!-- Header / toggle -->
    <button
      @click="toggle"
      class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-alt transition-colors"
    >
      <div class="flex items-center gap-2.5">
        <MessageSquare class="w-5 h-5 text-primary" />
        <span class="font-semibold text-text">Site Feedback</span>
        <span
          v-if="stats"
          class="px-2 py-0.5 rounded-full text-xs bg-surface-alt text-text-muted"
        >
          {{ stats.total }} total
        </span>
      </div>
      <ChevronDown
        class="w-4 h-4 text-text-muted transition-transform"
        :class="expanded ? 'rotate-180' : ''"
      />
    </button>

    <div v-if="expanded" class="px-5 pb-5 border-t border-border">
      <!-- Feedback collection disabled -->
      <p v-if="!feedbackEnabled" class="mt-4 text-sm text-text-muted">
        Feedback collection is turned off (<code class="text-xs">meta.feedback.enabled</code>).
        Enable it and run the feedback-api service to gather responses.
      </p>

      <!-- Admin key entry -->
      <div v-else-if="!hasKey" class="mt-4 max-w-md">
        <div class="flex items-center gap-2 mb-2 text-sm font-medium text-text-secondary">
          <KeyRound class="w-4 h-4" />
          Feedback admin key required
        </div>
        <p class="text-xs text-text-muted mb-3 leading-relaxed">
          Feedback can include names and emails visitors chose to share, so reading it
          needs the admin key (separate from the public submit key). It is held only in
          this browser tab and never written into the app.
        </p>
        <form @submit.prevent="saveKey" class="flex gap-2">
          <input
            v-model="keyInput"
            type="password"
            autocomplete="off"
            placeholder="Admin key"
            class="flex-1 px-3 py-2 rounded-lg border text-sm bg-surface-alt border-border-strong text-text placeholder-text-muted"
          />
          <button
            type="submit"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark"
          >
            Load
          </button>
        </form>
      </div>

      <!-- Stats view -->
      <div v-else class="mt-4">
        <!-- Toolbar -->
        <div class="flex items-center gap-3 mb-4">
          <button
            @click="fetchStats"
            :disabled="loading"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border-strong text-text-secondary hover:bg-surface-alt disabled:opacity-50"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" />
            {{ loading ? 'Loading…' : 'Refresh' }}
          </button>
          <button
            @click="changeKey"
            class="text-sm text-text-muted hover:text-text-secondary"
          >
            Change key
          </button>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="flex items-start gap-2 p-3 rounded-lg mb-4 text-sm bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
        >
          <AlertCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{{ error }}</span>
        </div>

        <template v-if="stats">
          <!-- Summary -->
          <div class="grid grid-cols-3 gap-3 mb-5">
            <div class="rounded-lg border border-border p-3 text-center">
              <div class="text-2xl font-bold text-text">{{ stats.total }}</div>
              <div class="text-xs text-text-muted">responses</div>
            </div>
            <div class="rounded-lg border border-border p-3 text-center">
              <div class="flex items-center justify-center gap-1.5 text-2xl font-bold text-green-600 dark:text-green-400">
                <ThumbsUp class="w-5 h-5" />{{ upCount }}
              </div>
              <div class="text-xs text-text-muted">{{ pct(upCount, stats.total) }}% helpful</div>
            </div>
            <div class="rounded-lg border border-border p-3 text-center">
              <div class="flex items-center justify-center gap-1.5 text-2xl font-bold text-red-600 dark:text-red-400">
                <ThumbsDown class="w-5 h-5" />{{ downCount }}
              </div>
              <div class="text-xs text-text-muted">{{ pct(downCount, stats.total) }}% not helpful</div>
            </div>
          </div>

          <!-- By page -->
          <div v-if="stats.by_page?.length" class="mb-5">
            <h3 class="text-sm font-semibold mb-2 text-text-secondary">By page</h3>
            <div class="rounded-lg border border-border overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface-alt text-text-muted">
                  <tr>
                    <th class="text-left font-medium px-3 py-2">Page</th>
                    <th class="text-right font-medium px-3 py-2 w-16">👍</th>
                    <th class="text-right font-medium px-3 py-2 w-16">👎</th>
                    <th class="text-right font-medium px-3 py-2 w-20">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in stats.by_page" :key="row.page">
                    <td class="px-3 py-2 font-mono text-xs text-text-secondary truncate max-w-[260px]">{{ row.page }}</td>
                    <td class="px-3 py-2 text-right text-green-600 dark:text-green-400">{{ row.up }}</td>
                    <td class="px-3 py-2 text-right text-red-600 dark:text-red-400">{{ row.down }}</td>
                    <td class="px-3 py-2 text-right text-text">{{ row.total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent comments -->
          <div v-if="stats.recent?.length">
            <h3 class="text-sm font-semibold mb-2 text-text-secondary">Recent</h3>
            <ul class="space-y-2">
              <li
                v-for="item in stats.recent"
                :key="item.id"
                class="rounded-lg border border-border p-3"
              >
                <div class="flex items-center gap-2 text-xs text-text-muted mb-1">
                  <ThumbsUp v-if="item.sentiment === 'up'" class="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  <ThumbsDown v-else class="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span class="font-mono truncate">{{ item.page }}</span>
                  <span class="ml-auto flex-shrink-0">{{ formatDate(item.created_at) }}</span>
                </div>
                <p v-if="item.comment" class="text-sm text-text-secondary">{{ item.comment }}</p>
                <p v-else class="text-sm italic text-text-muted">No comment</p>
                <p v-if="item.contact_name || item.contact_email" class="mt-1 text-xs text-text-muted">
                  — {{ item.contact_name }}<span v-if="item.contact_email"> &lt;{{ item.contact_email }}&gt;</span>
                </p>
              </li>
            </ul>
          </div>

          <p v-if="!stats.total" class="text-sm text-text-muted">
            No feedback collected yet.
          </p>
        </template>
      </div>
    </div>
  </section>
</template>
