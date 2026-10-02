<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { X, Copy, Check, Mail, Link as LinkIcon } from 'lucide-vue-next'

const props = defineProps({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  pathForDisplay: { type: Array, default: () => [] },
  tier: { type: String, default: null },
  flags: { type: Array, default: () => [] }
})

const emit = defineEmits(['close'])

const copiedLink = ref(false)
const copiedTicket = ref(false)

// Deep link to this node: TierQuestionnaire reads #q-<id> on mount and jumps
// there (and keeps the hash in sync as the user moves) — keep the formats aligned.
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
    // Fallback: select text in a temp textarea. navigator.clipboard rejects in
    // non-secure contexts (plain-http intranet hosts) and when permission is denied.
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

// This planner is a demo, so the send button is a placeholder — no live mailto.
// Clicking it flashes a transient notice describing what a real deployment would
// wire up. Same pattern as GetHelpModal's contact buttons.
const demoNotice = ref('')
let demoNoticeTimer = null

function flashDemoNotice(message) {
  demoNotice.value = message
  if (demoNoticeTimer) clearTimeout(demoNoticeTimer)
  demoNoticeTimer = setTimeout(() => { demoNotice.value = '' }, 4500)
}

onBeforeUnmount(() => {
  if (demoNoticeTimer) clearTimeout(demoNoticeTimer)
})

function sendToSupport() {
  flashDemoNotice(
    'This planner is a demo. In your institution\'s deployment, this would send the ticket text above to your research computing team — real people who answer these every day.'
  )
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
            Ask about this question
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
            Have a question about this one? These classification rules carry a lot of
            institutional context, so wanting a closer look is completely reasonable. Copy
            the support ticket text below into an email or ticket — it includes a link back
            to this exact question and the path you took to reach it, so whoever on the
            team picks it up starts right where you are.
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
                class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-primary/10 hover:bg-primary/20 text-primary"
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
                class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-primary/10 hover:bg-primary/20 text-primary"
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

          <!-- Send action — placeholder in this demo, see sendToSupport() -->
          <button
            @click="sendToSupport"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors bg-primary hover:bg-primary-dark text-on-primary"
          >
            <Mail class="w-4 h-4" />
            Send this to your support team
          </button>

        </div>
      </div>
    </div>

    <!-- Demo notice — clicking the placeholder send button flashes this, then it fades out.
         z-[60] so it floats above this dialog's own z-50 backdrop. -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-500 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="demoNotice"
        class="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4 pointer-events-none"
      >
        <div
          class="pointer-events-auto max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-center shadow-xl bg-primary text-on-primary"
          role="status"
          aria-live="polite"
        >
          {{ demoNotice }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
