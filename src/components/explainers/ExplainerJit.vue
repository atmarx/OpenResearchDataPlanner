<script setup>
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import ExplainerModal from './ExplainerModal.vue'

// The just-in-time "→" nudge from config/explainers.yaml — one quiet link
// dropped next to a confusing thing, opening the in-app explainer.  The
// `anchor` prop names which spot this render fills (the YAML's jit.anchors
// list: cost-column, direct-charge, tier-cost) so config and surface stay
// traceable to each other.  Renders nothing if the explainer isn't configured.
const props = defineProps({
  explainerId: { type: String, default: 'overhead-and-direct-costs' },
  anchor: { type: String, required: true }
})

const configStore = useConfigStore()

const explainer = computed(
  () => configStore.config?.explainers?.[props.explainerId] || null
)

const showModal = ref(false)
</script>

<template>
  <span v-if="explainer?.jit?.link_text" :data-explainer-anchor="anchor">
    <button
      type="button"
      class="text-xs text-primary hover:underline text-left"
      @click="showModal = true"
    >
      {{ explainer.jit.link_text }}
    </button>
    <ExplainerModal
      v-if="showModal"
      :explainer="explainer"
      @close="showModal = false"
    />
  </span>
</template>
