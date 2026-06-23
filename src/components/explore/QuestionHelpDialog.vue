<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { X, Copy, Check, Mail, Link as LinkIcon } from 'lucide-vue-next'

const props = defineProps({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  pathForDisplay: { type: Array, default: () => [] },
  tier: { type: String, default: null },
  flags: { type: Array, default: () => [] }
})

const emit = defineEmits(['close'])

const configStore = useConfigStore()

const copiedLink = ref(false)
const copiedTicket = ref(false)

const supportEmail = computed(() => {
  const contacts = configStore.config?.help?.contact_options || []
  const email = contacts.find(c => c.action?.type === 'email')
  return email?.action?.address || configStore.config?.meta?.contact?.email || 'research-computing@northwinds.edu'
})

const shareableUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  const { origin, pathname, search } = window.location
  return `${origin}${pathname}${search}#q-${props.questionId}`
})

const ticketString = computed(() => {
  const lines = []
  lines.push('Tier Questionnaire — help requested')
  lines.push('')
  lines.push(`Question: ${props.questionText}`)
  lines.push(`Question ID: ${props.questionId}`)
  lines.push(`Link: ${shareableUrl.value}`)
  if (props.tier) lines.push(`Tier so far: ${props.tier}`)
  if (props.flags?.length) lines.push(`Flags: ${props.flags.join(', ')}`)
  if (props.pathForDisplay?.length) {
    lines.push('')
    lines.push('Path so far:')
    props.pathForDisplay.forEach((step, i) => {
      lines.push(`  ${i + 1}. ${step.questionText} → ${step.answerLabel}`)
    })
  }
  lines.push('')
  lines.push('My question:')
  lines.push('  ')
  return lines.join('\n')
})

async function copyText(text, target) {
  try {
    await navigator.clipboard.writeText(text)
    if (target === 'link') {
      copiedLink.value = true
      setTimeout(() => (copiedLink.value = false), 2000)
    } else {
      copiedTicket.value = true
      setTimeout(() => (copiedTicket.value = false), 2000)
    }
  } catch (e) {
    // Fallback: select text in a temp textarea
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    if (target === 'link') copiedLink.value = true
    else copiedTicket.value = true
    setTimeout(() => {
      copiedLink.value = false
      copiedTicket.value = false
    }, 2000)
  }
}

function emailSupport() {
  const subject = encodeURIComponent(`Tier Questionnaire help: ${props.questionId}`)
  const body = encodeURIComponent(ticketString.value)
  window.location.href = `mailto:${supportEmail.value}?subject=${subject}&body=${body}`
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      @click.self="emit('close')"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qhelp-title"
    >
      <div
        class="rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-xl max-h-[90vh] overflow-y-auto bg-surface"
      >
        <!-- Header -->
        <div
          class="sticky top-0 border-b px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-xl bg-surface border-border"
        >
          <h2
            id="qhelp-title"
            class="text-lg font-semibold text-text"
          >
            Get help with this question
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

          <p
            class="text-sm text-text-secondary"
          >
            Most of this is policy you may not have seen before, so questions are normal.
            Copy the support ticket text below into an email or ticket — it includes a link
            back to this exact question and the path you took to reach it.
          </p>

          <!-- Question echo -->
          <div
            class="rounded-lg border p-3 text-sm bg-canvas border-border text-text-secondary"
          >
            <div
              class="text-xs uppercase tracking-wide mb-1 text-text-muted"
            >You're on</div>
            <div class="font-medium">{{ questionText }}</div>
          </div>

          <!-- Shareable link -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label
                class="text-xs uppercase tracking-wide font-medium text-text-muted"
              >Direct link to this question</label>
              <button
                @click="copyText(shareableUrl, 'link')"
                class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-surface-alt hover:bg-border-strong text-text-secondary"
              >
                <Check v-if="copiedLink" class="w-3.5 h-3.5 text-green-500" />
                <Copy v-else class="w-3.5 h-3.5" />
                {{ copiedLink ? 'Copied' : 'Copy link' }}
              </button>
            </div>
            <div
              class="font-mono text-xs px-3 py-2 rounded border break-all bg-canvas border-border text-primary"
            >
              <LinkIcon class="w-3.5 h-3.5 inline -mt-0.5 mr-1" />{{ shareableUrl }}
            </div>
          </div>

          <!-- Ticket text -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label
                class="text-xs uppercase tracking-wide font-medium text-text-muted"
              >Support ticket text</label>
              <button
                @click="copyText(ticketString, 'ticket')"
                class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-surface-alt hover:bg-border-strong text-text-secondary"
              >
                <Check v-if="copiedTicket" class="w-3.5 h-3.5 text-green-500" />
                <Copy v-else class="w-3.5 h-3.5" />
                {{ copiedTicket ? 'Copied' : 'Copy text' }}
              </button>
            </div>
            <pre
              class="font-mono text-xs px-3 py-2 rounded border whitespace-pre-wrap max-h-64 overflow-y-auto bg-canvas border-border text-text-secondary"
            >{{ ticketString }}</pre>
          </div>

          <!-- Email action -->
          <button
            @click="emailSupport"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors bg-primary hover:bg-primary-dark text-on-primary"
          >
            <Mail class="w-4 h-4" />
            Email this to {{ supportEmail }}
          </button>

        </div>
      </div>
    </div>
  </Teleport>
</template>
