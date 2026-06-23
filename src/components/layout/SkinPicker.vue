<script setup>
import { useSkin } from '@/composables/useSkin'
import { Palette, ChevronDown } from 'lucide-vue-next'

const { currentSkin, skinList, applySkin } = useSkin()
</script>

<template>
  <!-- Institution skin selector. Dogfoods the semantic tokens: this whole
       control re-skins itself when you switch, in light and dark. -->
  <div class="relative inline-flex items-center">
    <Palette class="w-3.5 h-3.5 absolute left-2 pointer-events-none text-text-muted" />
    <select
      :value="currentSkin"
      @change="applySkin($event.target.value)"
      class="appearance-none bg-surface text-text border border-border rounded-md pl-7 pr-7 py-1.5 text-xs font-medium cursor-pointer hover:border-primary focus:border-primary focus:outline-none transition-colors"
      aria-label="Institution theme"
      title="Switch institution theme — or drag a design.md onto the page"
    >
      <option v-for="s in skinList" :key="s.value" :value="s.value">{{ s.label }}</option>
    </select>
    <ChevronDown class="w-3.5 h-3.5 absolute right-2 pointer-events-none text-text-muted" />
  </div>
</template>
