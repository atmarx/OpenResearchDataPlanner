<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useSessionStore } from '@/stores/sessionStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
  X,
  Mail,
  Calendar,
  Ticket,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Phone,
  Clock,
  MapPin,
  Video,
  AlertTriangle
} from 'lucide-vue-next'

const emit = defineEmits(['close'])

const configStore = useConfigStore()
const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

const helpConfig = computed(() => configStore.config?.help || {})
const contactOptions = computed(() => helpConfig.value?.contact_options || [])
const faqItems = computed(() => helpConfig.value?.faq || [])
const officeHours = computed(() => helpConfig.value?.office_hours)
const urgentContact = computed(() => helpConfig.value?.urgent)
const contextualHelp = computed(() => {
  const step = sessionStore.currentStep
  return helpConfig.value?.contextual_help?.[step] || null
})

const expandedFaq = ref(null)

function toggleFaq(index) {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

const iconMap = {
  mail: Mail,
  calendar: Calendar,
  ticket: Ticket,
  bookmark: Bookmark
}

function getIcon(iconName) {
  return iconMap[iconName] || Mail
}

function buildStateContext() {
  const tier = sessionStore.selectedTier
  const step = sessionStore.currentStep
  const services = sessionStore.selectedServiceSlugs || []
  const tierObj = tier ? configStore.tiersBySlug?.[tier] : null

  const lines = []
  lines.push(`Current Step: ${step || 'Not started'}`)
  if (tierObj) lines.push(`Data Tier: ${tierObj.name} (${tierObj.slug})`)
  else if (tier) lines.push(`Data Tier: ${tier}`)
  if (services.length) lines.push(`Selected Services: ${services.join(', ')}`)
  return lines.join('\n')
}

function handleAction(option) {
  const action = option.action
  if (!action) return

  if (action.type === 'email') {
    const subject = encodeURIComponent(action.subject_template || 'Data Planner Help Request')
    let body = 'Please describe your question below:\n\n\n'
    if (action.include_state) {
      body += '--- Current Progress ---\n' + buildStateContext() + '\n'
    }
    window.location.href = `mailto:${action.address}?subject=${subject}&body=${encodeURIComponent(body)}`
  } else if (action.type === 'external_link') {
    window.open(action.url, '_blank', 'noopener noreferrer')
  } else if (action.type === 'save_state') {
    emit('save-state')
    emit('close')
  }
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      @click.self="handleClose"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        class="rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-surface"
      >
        <!-- Header -->
        <div
          class="sticky top-0 border-b px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-xl bg-surface border-border"
        >
          <h2
            id="help-modal-title"
            class="text-lg font-semibold text-text"
          >
            Get Help
          </h2>
          <button
            @click="handleClose"
            class="p-1.5 rounded-lg transition-colors hover:bg-surface-alt text-text-muted"
            aria-label="Close"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="px-5 py-4 space-y-6">

          <!-- Contextual message for current step -->
          <div
            v-if="contextualHelp"
            class="rounded-lg p-4 text-sm"
            :class="preferencesStore.darkMode
              ? 'bg-blue-900/30 border border-blue-700 text-blue-200'
              : 'bg-blue-50 border border-blue-200 text-blue-800'"
          >
            <p class="font-medium mb-1">{{ contextualHelp.title }}</p>
            <p>{{ contextualHelp.message }}</p>
          </div>

          <!-- Contact options -->
          <div v-if="contactOptions.length">
            <h3
              class="text-sm font-semibold uppercase tracking-wide mb-3 text-text-muted"
            >
              Contact Us
            </h3>
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="option in contactOptions"
                :key="option.type"
                @click="handleAction(option)"
                class="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border transition-colors"
                :class="option.primary
                  ? 'bg-primary border-primary hover:bg-primary-dark text-on-primary'
                  : 'bg-surface-alt border-border hover:bg-surface-alt text-text-secondary'"
              >
                <component
                  :is="getIcon(option.icon)"
                  class="w-5 h-5 flex-shrink-0"
                  :class="option.primary ? 'opacity-90' : 'text-text-muted'"
                />
                <div>
                  <div class="font-medium text-sm">{{ option.label }}</div>
                  <div
                    class="text-xs mt-0.5"
                    :class="option.primary ? 'opacity-80' : 'text-text-muted'"
                  >{{ option.description }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Office hours -->
          <div v-if="officeHours?.enabled && officeHours.schedule?.length">
            <h3
              class="text-sm font-semibold uppercase tracking-wide mb-3 text-text-muted"
            >
              <Clock class="w-4 h-4 inline-block mr-1 -mt-0.5" />
              {{ officeHours.title }}
            </h3>
            <p
              v-if="officeHours.description"
              class="text-sm mb-2 text-text-muted"
            >{{ officeHours.description }}</p>
            <div class="space-y-2">
              <div
                v-for="slot in officeHours.schedule"
                :key="`${slot.day}-${slot.time}`"
                class="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span class="font-medium w-24 flex-shrink-0">{{ slot.day }}</span>
                <div>
                  <div>{{ slot.time }}</div>
                  <div class="flex items-center gap-1 text-xs mt-0.5 text-text-muted">
                    <MapPin class="w-3 h-3" />
                    <a
                      v-if="slot.link"
                      :href="slot.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="underline text-primary hover:text-primary-dark"
                    >{{ slot.location }}</a>
                    <span v-else>{{ slot.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ -->
          <div v-if="faqItems.length">
            <h3
              class="text-sm font-semibold uppercase tracking-wide mb-3 text-text-muted"
            >
              Quick Answers
            </h3>
            <div class="space-y-1">
              <div
                v-for="(item, index) in faqItems"
                :key="index"
                class="rounded-lg border overflow-hidden border-border"
              >
                <button
                  @click="toggleFaq(index)"
                  class="w-full flex items-center justify-between px-4 py-3 text-sm text-left font-medium transition-colors text-text-secondary hover:bg-surface-alt"
                >
                  <span>{{ item.question }}</span>
                  <ChevronDown
                    v-if="expandedFaq !== index"
                    class="w-4 h-4 flex-shrink-0 ml-2 text-text-muted"
                  />
                  <ChevronUp
                    v-else
                    class="w-4 h-4 flex-shrink-0 ml-2 text-text-muted"
                  />
                </button>
                <div
                  v-if="expandedFaq === index"
                  class="px-4 pb-3 text-sm leading-relaxed border-t text-text-secondary border-border bg-canvas"
                  v-html="item.answer.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"
                />
              </div>
            </div>
          </div>

          <!-- Urgent contact -->
          <div
            v-if="urgentContact?.enabled"
            class="rounded-lg p-3 flex items-start gap-3 text-sm"
            :class="preferencesStore.darkMode
              ? 'bg-red-900/20 border border-red-800 text-red-300'
              : 'bg-red-50 border border-red-200 text-red-700'"
          >
            <AlertTriangle class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span class="font-medium">{{ urgentContact.title }}:</span>
              {{ urgentContact.description }}
              <a
                :href="`mailto:${urgentContact.contact}`"
                class="underline ml-1"
              >{{ urgentContact.contact }}</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>
