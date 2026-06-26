<script setup>
/**
 * Estimate-not-a-quote disclaimer, shown wherever dollar figures appear so a
 * planning estimate is never mistaken for a binding quote. Text is config-driven
 * (meta.cost_disclaimer.{short,long}) so institutions own the wording.
 */
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { Info } from 'lucide-vue-next'

const props = defineProps({
  variant: { type: String, default: 'short' }, // 'short' | 'long'
  icon: { type: Boolean, default: true }
})

const configStore = useConfigStore()

const FALLBACK = {
  short: 'Planning estimate, not a quote — prices are subject to change.',
  long: 'These are planning estimates, not a quote for services. Prices are anticipatory and subject to change; you will have time to plan for any adjustments.'
}

const text = computed(() => {
  const d = configStore.config?.meta?.cost_disclaimer || {}
  return props.variant === 'long'
    ? (d.long || d.short || FALLBACK.long)
    : (d.short || d.long || FALLBACK.short)
})
</script>

<template>
  <p class="flex items-start gap-1.5 text-xs text-text-muted">
    <Info v-if="icon" class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
    <span>{{ text }}</span>
  </p>
</template>
