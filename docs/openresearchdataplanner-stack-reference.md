# OpenResearchDataPlanner Technology Stack Reference Guides

**Purpose:** These guides provide Claude Code instances with accurate, up-to-date information about the technologies used in OpenResearchDataPlanner, avoiding reliance on potentially outdated training data.

**Last Updated:** 2026-02-04

---

## Table of Contents

1. [Vue 3](#vue-3)
2. [Vite](#vite)
3. [Pinia](#pinia)
4. [Tailwind CSS](#tailwind-css)
5. [Lucide Icons](#lucide-icons)
6. [Handlebars.js](#handlebarsjs)
7. [Marked](#marked)
8. [js-yaml](#js-yaml)

---

## Vue 3

### Current Version
- **Stable:** 3.5.x (3.5.18 as of July 2025)
- **Beta:** 3.6 (includes Vapor Mode)

### Key Information

Vue 3.5 "Tengen Toppa Gurren Lagann" is the current stable release. Vue 3.6 is in beta with Vapor Mode for improved performance.

### Installation

```bash
npm install vue@latest
```

### Core Patterns for OpenResearchDataPlanner

#### Script Setup (Composition API) - PREFERRED
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive state
const count = ref(0)

// Computed property
const doubled = computed(() => count.value * 2)

// Methods are just functions
function increment() {
  count.value++
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <button @click="increment">{{ count }} (doubled: {{ doubled }})</button>
</template>
```

#### Reactive Props Destructure (Stable in 3.5)
```vue
<script setup>
// Props are now automatically reactive when destructured
const { title, count } = defineProps(['title', 'count'])

// This works reactively - no need for toRef() anymore
watchEffect(() => {
  console.log(count) // Reacts to changes
})
</script>
```

#### useTemplateRef (New in 3.5)
```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// Cleaner than the old ref() pattern
const inputEl = useTemplateRef('input')

onMounted(() => {
  inputEl.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

#### useId (New in 3.5)
```vue
<script setup>
import { useId } from 'vue'

// SSR-safe unique ID generation
const id = useId()
</script>

<template>
  <label :for="id">Name</label>
  <input :id="id" />
</template>
```

#### Composables Pattern
```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return { count, doubled, increment, decrement }
}
```

#### Watch with Cleanup (New in 3.5)
```vue
<script setup>
import { watch, onWatcherCleanup } from 'vue'

watch(searchQuery, (newQuery) => {
  const controller = new AbortController()
  
  fetch(`/api/search?q=${newQuery}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => results.value = data)
  
  // Cleanup runs before next watch execution
  onWatcherCleanup(() => {
    controller.abort()
  })
})
</script>
```

### Key Imports from 'vue'

```javascript
// Reactivity
import { ref, reactive, computed, readonly, shallowRef, shallowReactive } from 'vue'

// Lifecycle
import { onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, onUpdated } from 'vue'

// Watchers
import { watch, watchEffect, watchPostEffect, onWatcherCleanup } from 'vue'

// Component utilities
import { defineProps, defineEmits, defineExpose, defineOptions, defineSlots } from 'vue'

// Template refs
import { useTemplateRef } from 'vue'

// Unique IDs
import { useId } from 'vue'

// Dependency injection
import { provide, inject } from 'vue'

// Transitions
import { Transition, TransitionGroup } from 'vue'

// Teleport
import { Teleport } from 'vue'

// Suspense (experimental)
import { Suspense } from 'vue'

// Async components
import { defineAsyncComponent } from 'vue'
```

### Vue 3.6 Vapor Mode (Beta - For Reference)

Vapor Mode is a new compilation mode for Vue SFCs with significantly better performance. It's opt-in:

```vue
<script setup vapor>
// This component uses Vapor Mode
import { ref } from 'vue'
const count = ref(0)
</script>
```

**Note:** Vapor Mode is still in beta. For OpenResearchDataPlanner v1, stick with standard Vue 3.5.

---

## Vite

### Current Version
- **Stable:** 7.3.x
- **Node.js Required:** 20.19+ or 22.12+

### Key Changes in Vite 7

1. **Node.js 18 dropped** - Requires Node.js 20.19+ or 22.12+
2. **ESM-only distribution** - Vite 7 is distributed as ESM only
3. **New default browser target** - `baseline-widely-available` instead of `modules`
4. **Sass legacy API removed** - Only modern Sass API supported
5. **Rolldown integration** - Rust-powered bundler available via `rolldown-vite` package

### Installation

```bash
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install
npm run dev
```

### Basic Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  // Dev server config
  server: {
    port: 3000,
    open: true
  },
  
  // Build config
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  
  // Path aliases
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

### Environment Variables

```bash
# .env
VITE_API_URL=https://api.example.com

# .env.development
VITE_API_URL=http://localhost:8000

# .env.production
VITE_API_URL=https://api.example.com
```

```javascript
// Access in code
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
const mode = import.meta.env.MODE
```

### Import Meta Features

```javascript
// Dynamic imports (code splitting)
const module = await import('./module.js')

// Glob imports
const modules = import.meta.glob('./modules/*.js')
// Returns: { './modules/a.js': () => import('./modules/a.js'), ... }

// Eager glob imports
const modules = import.meta.glob('./modules/*.js', { eager: true })
// Returns: { './modules/a.js': Module, ... }

// Import with query
import jsonData from './data.json?raw'  // As string
import imageUrl from './image.png?url'   // As URL
```

### CSS Handling

```javascript
// vite.config.js
export default defineConfig({
  css: {
    // PostCSS config (or use postcss.config.js)
    postcss: {
      plugins: [
        // plugins here
      ]
    },
    
    // Preprocessor options
    preprocessorOptions: {
      scss: {
        // Modern API only in Vite 7
        additionalData: `@use "@/styles/variables" as *;`
      }
    }
  }
})
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Pinia

### Current Version
- **Stable:** 3.0.x (3.0.4 as of late 2025)

### Key Changes in Pinia 3

1. **Vue 2 support dropped** - Vue 3 only
2. **TypeScript 5+ required**
3. **`PiniaStorePlugin` removed** - Use `PiniaPlugin` instead
4. **`defineStore({ id: 'id' })` removed** - Use `defineStore('id', ...)` instead

### Installation

```bash
npm install pinia
```

### Setup

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

### Store Definitions

#### Option Stores (Options API Style)
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    // Getter with arguments
    getCountPlusN: (state) => (n) => state.count + n
  },
  
  actions: {
    increment() {
      this.count++
    },
    async fetchData() {
      const response = await fetch('/api/data')
      this.count = await response.json()
    }
  }
})
```

#### Setup Stores (Composition API Style) - PREFERRED
```javascript
// stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  const name = ref('Eduardo')
  
  // Getters
  const doubleCount = computed(() => count.value * 2)
  
  // Actions
  function increment() {
    count.value++
  }
  
  async function fetchData() {
    const response = await fetch('/api/data')
    count.value = await response.json()
  }
  
  return { count, name, doubleCount, increment, fetchData }
})
```

### Using Stores in Components

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()

// Direct access (reactive)
// store.count, store.doubleCount, store.increment()

// Destructure with storeToRefs (keeps reactivity for state/getters)
const { count, doubleCount } = storeToRefs(store)
// Actions can be destructured directly
const { increment } = store
</script>

<template>
  <p>Count: {{ count }}</p>
  <p>Double: {{ doubleCount }}</p>
  <button @click="increment">+1</button>
</template>
```

### Store Patterns for OpenResearchDataPlanner

#### Config Store (Read-Only)
```javascript
// stores/configStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref(null)
  const loading = ref(true)
  const error = ref(null)
  
  // Computed lookups
  const tiersBySlug = computed(() => {
    if (!config.value?.tiers) return {}
    return Object.fromEntries(
      config.value.tiers.map(t => [t.slug, t])
    )
  })
  
  const servicesForTier = computed(() => {
    if (!config.value?.mappings) return {}
    const result = {}
    for (const mapping of config.value.mappings) {
      if (!result[mapping.tier]) result[mapping.tier] = []
      result[mapping.tier].push(mapping.service)
    }
    return result
  })
  
  async function loadConfig() {
    try {
      loading.value = true
      const response = await fetch('/config.json')
      config.value = await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  return { 
    config, loading, error,
    tiersBySlug, servicesForTier,
    loadConfig 
  }
})
```

#### Session Store (Read-Write with Persistence)
```javascript
// stores/sessionStore.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const session = ref(createEmptySession())
  
  function createEmptySession() {
    return {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      tier: null,
      grant_period: { start: null, end: null, months: 36 },
      selected_services: [],
      retention: { schedules: [], longest_years: 3 }
    }
  }
  
  function reset() {
    session.value = createEmptySession()
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('odp-session', JSON.stringify(session.value))
  }
  
  function loadFromLocalStorage() {
    const saved = localStorage.getItem('odp-session')
    if (saved) {
      session.value = JSON.parse(saved)
    }
  }
  
  function exportSession() {
    return JSON.stringify(session.value, null, 2)
  }
  
  function importSession(json) {
    session.value = JSON.parse(json)
    saveToLocalStorage()
  }
  
  // Auto-save on changes
  watch(session, saveToLocalStorage, { deep: true })
  
  return { 
    session, 
    reset, saveToLocalStorage, loadFromLocalStorage,
    exportSession, importSession
  }
})
```

### Pinia Plugins

```javascript
// plugins/piniaLocalStorage.js
export function piniaLocalStoragePlugin({ store }) {
  // Load initial state from localStorage
  const saved = localStorage.getItem(store.$id)
  if (saved) {
    store.$patch(JSON.parse(saved))
  }
  
  // Subscribe to changes
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
}

// main.js
const pinia = createPinia()
pinia.use(piniaLocalStoragePlugin)
```

---

## Tailwind CSS

### Current Version
- **Stable:** 4.1.x (v4.0 released January 2025, v4.1 April 2025)

### Key Changes in Tailwind CSS v4

1. **All-new engine** - 5x faster full builds, 100x faster incremental
2. **CSS-first configuration** - No more tailwind.config.js required
3. **Built-in container queries** - No plugin needed
4. **3D transforms** - rotate-x-*, rotate-y-*, etc.
5. **@theme directive** - Configure via CSS
6. **@import "tailwindcss"** - Single import replaces @tailwind directives
7. **Browser targets** - Safari 16.4+, Chrome 111+, Firefox 128+

### Installation with Vite

```bash
npm install tailwindcss @tailwindcss/vite
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ]
})
```

```css
/* src/assets/styles/main.css */
@import "tailwindcss";
```

### CSS-First Configuration (Tailwind v4)

```css
/* src/assets/styles/main.css */
@import "tailwindcss";

/* Define custom theme */
@theme {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #6b7280;
  
  /* Custom spacing */
  --spacing-128: 32rem;
  
  /* Custom fonts */
  --font-sans: 'Inter', system-ui, sans-serif;
  
  /* Custom breakpoints */
  --breakpoint-3xl: 1920px;
}

/* Custom utilities */
@utility content-auto {
  content-visibility: auto;
}

/* Custom variants */
@variant hocus (&:hover, &:focus);
```

### Common Utility Patterns

```html
<!-- Flexbox layout -->
<div class="flex items-center justify-between gap-4">
  <div class="flex-1">Content</div>
  <div class="shrink-0">Fixed</div>
</div>

<!-- Grid layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Card pattern -->
<div class="rounded-lg border bg-white p-6 shadow-sm">
  <h2 class="text-lg font-semibold">Title</h2>
  <p class="mt-2 text-gray-600">Description</p>
</div>

<!-- Button variants -->
<button class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Primary
</button>

<button class="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
  Secondary
</button>

<!-- Form input -->
<input class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />

<!-- Container queries (new in v4) -->
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3">
    <!-- Responsive to container, not viewport -->
  </div>
</div>

<!-- 3D transforms (new in v4) -->
<div class="perspective-distant">
  <div class="rotate-x-12 rotate-y-6 transform-3d">
    3D transformed element
  </div>
</div>
```

### Dark Mode

```css
/* Using CSS preference (default) */
@import "tailwindcss";

/* Or using class-based dark mode */
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

```html
<!-- Usage -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-gray-100">
    Text that adapts to dark mode
  </p>
</div>
```

### Responsive Design

```html
<!-- Mobile-first breakpoints -->
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<!-- Breakpoint reference:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px
  2xl: 1536px
-->
```

### State Variants

```html
<!-- Hover, focus, active -->
<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 active:bg-blue-700">
  Button
</button>

<!-- Group hover -->
<div class="group">
  <p class="group-hover:text-blue-500">Changes on parent hover</p>
</div>

<!-- Peer states -->
<input class="peer" type="checkbox" />
<span class="peer-checked:text-green-500">Checked!</span>

<!-- First/last child -->
<ul>
  <li class="first:pt-0 last:pb-0 py-4">Item</li>
</ul>

<!-- Disabled state -->
<button class="disabled:opacity-50 disabled:cursor-not-allowed" disabled>
  Disabled
</button>
```

---

## Lucide Icons

### Current Version
- **lucide-vue-next:** 0.546.x (for Vue 3)
- **Icon count:** 1,669+ icons

### Installation

```bash
npm install lucide-vue-next
```

### Usage

#### Individual Icon Import (Recommended - Tree Shakable)
```vue
<script setup>
import { Home, Settings, User, ChevronRight, X } from 'lucide-vue-next'
</script>

<template>
  <Home />
  <Settings :size="24" />
  <User color="blue" :stroke-width="2" />
</template>
```

#### Icon Props
```vue
<script setup>
import { Home } from 'lucide-vue-next'
</script>

<template>
  <Home 
    :size="24"           <!-- Width and height -->
    color="currentColor" <!-- Stroke color -->
    :stroke-width="2"    <!-- Stroke width -->
    :absolute-stroke-width="false"
    class="custom-class"
  />
</template>
```

#### Dynamic Icon Component (Use Sparingly - Not Tree Shakable)
```vue
<script setup>
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 }
})

const icon = computed(() => icons[props.name])
</script>

<template>
  <component :is="icon" :size="size" />
</template>
```

### Common Icons for OpenResearchDataPlanner

```javascript
// Navigation & UI
import { 
  Home, ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  Menu, X, Check, AlertCircle, Info, HelpCircle
} from 'lucide-vue-next'

// Data & Storage
import { 
  Database, HardDrive, Server, Cloud, FolderOpen,
  FileText, Files, Archive
} from 'lucide-vue-next'

// Security & Tiers
import { 
  Shield, ShieldCheck, ShieldAlert, Lock, Unlock,
  Eye, EyeOff, Key
} from 'lucide-vue-next'

// Actions
import { 
  Plus, Minus, Edit, Trash2, Download, Upload,
  Save, Copy, RefreshCw
} from 'lucide-vue-next'

// Service categories
import { 
  Cpu,        // Compute
  HardDrive,  // Storage
  Cloud,      // APIs
  Box,        // Environments
  LifeBuoy    // Support
} from 'lucide-vue-next'

// Research/Science
import { 
  Dna, Brain, FlaskConical, Microscope, Activity
} from 'lucide-vue-next'
```

### Accessibility

```vue
<template>
  <!-- Decorative (default) - hidden from screen readers -->
  <Home aria-hidden="true" />
  
  <!-- Meaningful - add label -->
  <Home aria-label="Go to home page" />
  
  <!-- Or use title -->
  <Home>
    <title>Home</title>
  </Home>
</template>
```

---

## Handlebars.js

### Current Version
- **Stable:** 4.7.8

### Installation

```bash
npm install handlebars
```

### Basic Usage

```javascript
import Handlebars from 'handlebars'

// Compile template
const source = `
  <h1>{{title}}</h1>
  <p>{{description}}</p>
`
const template = Handlebars.compile(source)

// Render with data
const html = template({
  title: 'Hello',
  description: 'World'
})
```

### Template Syntax for DMP Generation

#### Variables
```handlebars
{{name}}                  <!-- Escaped output -->
{{{rawHtml}}}             <!-- Unescaped (raw) output -->
{{person.name}}           <!-- Nested properties -->
{{articles.[0].title}}    <!-- Array access -->
```

#### Conditionals
```handlebars
{{#if isActive}}
  <p>Active</p>
{{else}}
  <p>Inactive</p>
{{/if}}

{{#unless isDisabled}}
  <p>Enabled</p>
{{/unless}}
```

#### Loops
```handlebars
{{#each services}}
  <li>{{this.name}} - {{this.cost}}</li>
{{/each}}

<!-- With index -->
{{#each items}}
  <p>{{@index}}: {{this}}</p>
{{/each}}

<!-- First/last helpers -->
{{#each items}}
  {{#if @first}}First!{{/if}}
  {{#if @last}}Last!{{/if}}
{{/each}}
```

#### With Context
```handlebars
{{#with institution}}
  <p>{{name}}</p>
  <p>{{contact.email}}</p>
{{/with}}
```

### Custom Helpers for OpenResearchDataPlanner

```javascript
import Handlebars from 'handlebars'

// Format currency
Handlebars.registerHelper('currency', function(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
})

// Format number with commas
Handlebars.registerHelper('number', function(value) {
  return new Intl.NumberFormat('en-US').format(value)
})

// Pluralize
Handlebars.registerHelper('pluralize', function(count, singular, plural) {
  return count === 1 ? singular : plural
})

// Date formatting
Handlebars.registerHelper('formatDate', function(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Conditional equality
Handlebars.registerHelper('eq', function(a, b) {
  return a === b
})

// Greater than
Handlebars.registerHelper('gt', function(a, b) {
  return a > b
})
```

### DMP Template Example

```handlebars
## {{service.name}}

{{service.long_description}}

**Resource Allocation:**
- Estimated usage: {{number service.estimate}} {{service.unit_label}} per month
- Grant period total: {{number service.total_estimate}} {{service.unit_label}}
- Estimated cost: {{currency service.total_cost}}

{{#if service.subsidies}}
**Applied Subsidies:**
{{#each service.subsidies}}
- {{this.name}}: {{this.description}}
{{/each}}
{{/if}}

{{#if service.notes}}
**Special Considerations:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} {{pluralize retention.years "year" "years"}}.
{{#if archive}}
After the active grant period, data will be migrated to archival storage:
- Archive storage: {{number archive.estimate}} TB
- Annual archive cost: {{currency archive.annual_cost}}
- Total retention cost: {{currency archive.total_cost}}
{{/if}}
{{/if}}
```

---

## Marked

### Current Version
- **Stable:** 17.0.x

### Installation

```bash
npm install marked
```

### Basic Usage

```javascript
import { marked } from 'marked'

// Parse markdown to HTML
const html = marked.parse('# Hello World')

// Inline parsing (no <p> wrapper)
const inline = marked.parseInline('**bold** and *italic*')
```

### Configuration

```javascript
import { marked } from 'marked'

// Set options globally
marked.setOptions({
  gfm: true,           // GitHub Flavored Markdown
  breaks: false,       // Convert \n to <br>
  pedantic: false,     // Conform to original markdown.pl
  silent: false        // Don't throw on errors
})

// Or per-parse
const html = marked.parse(markdown, { gfm: true })
```

### Use in OpenResearchDataPlanner (DMP Preview)

```javascript
import { marked } from 'marked'

// For rendering DMP preview
function renderDmpPreview(markdownContent) {
  return marked.parse(markdownContent, {
    gfm: true,
    breaks: true
  })
}
```

### Custom Renderer

```javascript
import { marked } from 'marked'

const renderer = {
  heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    return `
      <h${level} id="${escapedText}">
        ${text}
      </h${level}>
    `
  },
  
  link(href, title, text) {
    return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`
  }
}

marked.use({ renderer })
```

---

## js-yaml

### Current Version
- **Stable:** 4.1.x

### Installation

```bash
npm install js-yaml
```

### Basic Usage

```javascript
import yaml from 'js-yaml'
import fs from 'fs'

// Parse YAML string
const doc = yaml.load(`
  name: John
  age: 30
  items:
    - one
    - two
`)
// Returns: { name: 'John', age: 30, items: ['one', 'two'] }

// Parse YAML file
const content = fs.readFileSync('config.yaml', 'utf8')
const config = yaml.load(content)

// Stringify to YAML
const yamlString = yaml.dump({ name: 'John', age: 30 })
```

### Build Script Usage for OpenResearchDataPlanner

```javascript
// scripts/build-config.js
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const CONFIG_DIR = './config'
const OUTPUT_FILE = './dist/config.json'

const configFiles = [
  'meta.yaml',
  'tiers.yaml',
  'categories.yaml',
  'services.yaml',
  'mappings.yaml',
  'bundles.yaml',
  'retention.yaml'
]

function loadYamlFile(filename) {
  const filepath = path.join(CONFIG_DIR, filename)
  const content = fs.readFileSync(filepath, 'utf8')
  return yaml.load(content)
}

function buildConfig() {
  const config = {}
  
  for (const file of configFiles) {
    const key = path.basename(file, '.yaml')
    config[key] = loadYamlFile(file)
  }
  
  // Load DMP templates
  config.dmpTemplates = loadDmpTemplates()
  
  return config
}

function loadDmpTemplates() {
  const templates = {}
  const templatesDir = path.join(CONFIG_DIR, 'dmp-templates')
  
  // Recursively load all .md files
  function walkDir(dir, prefix = '') {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filepath = path.join(dir, file)
      const stat = fs.statSync(filepath)
      
      if (stat.isDirectory()) {
        walkDir(filepath, `${prefix}${file}/`)
      } else if (file.endsWith('.md')) {
        const key = `${prefix}${file}`.replace(/\.md$/, '')
        templates[key] = fs.readFileSync(filepath, 'utf8')
      }
    }
  }
  
  walkDir(templatesDir)
  return templates
}

// Run build
const config = buildConfig()

// Ensure dist directory exists
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })

// Write JSON
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(config, null, 2))

console.log(`Config built: ${OUTPUT_FILE}`)
```

### Schema Validation Helper

```javascript
// scripts/validate-config.js
import yaml from 'js-yaml'
import fs from 'fs'

function validateConfig(config) {
  const errors = []
  
  // Validate mappings reference valid services
  const servicesSlugs = new Set(config.services.map(s => s.slug))
  for (const mapping of config.mappings) {
    if (!servicesSlugs.has(mapping.service)) {
      errors.push(`Mapping references unknown service: ${mapping.service}`)
    }
  }
  
  // Validate mappings reference valid tiers
  const tierSlugs = new Set(config.tiers.map(t => t.slug))
  for (const mapping of config.mappings) {
    if (!tierSlugs.has(mapping.tier)) {
      errors.push(`Mapping references unknown tier: ${mapping.tier}`)
    }
  }
  
  // Validate services reference valid categories
  const categorySlugs = new Set(config.categories.map(c => c.slug))
  for (const service of config.services) {
    if (!categorySlugs.has(service.category)) {
      errors.push(`Service ${service.slug} references unknown category: ${service.category}`)
    }
  }
  
  // Validate bundles reference valid services
  for (const bundle of config.bundles) {
    for (const item of bundle.services) {
      if (!servicesSlugs.has(item.service)) {
        errors.push(`Bundle ${bundle.slug} references unknown service: ${item.service}`)
      }
    }
  }
  
  return errors
}
```

---

## Version Summary

| Package | Version | Notes |
|---------|---------|-------|
| vue | 3.5.x | Composition API, script setup |
| vite | 7.3.x | Node 20.19+ required |
| pinia | 3.0.x | Vue 3 only, TS 5+ |
| tailwindcss | 4.1.x | CSS-first config |
| @tailwindcss/vite | 4.x | Vite plugin |
| lucide-vue-next | 0.546.x | Vue 3 icons |
| handlebars | 4.7.8 | Template engine |
| marked | 17.0.x | Markdown parser |
| js-yaml | 4.1.x | YAML parser |

---

## Quick Reference: Package.json Dependencies

```json
{
  "dependencies": {
    "vue": "^3.5.0",
    "pinia": "^3.0.0",
    "handlebars": "^4.7.8",
    "marked": "^17.0.0"
  },
  "devDependencies": {
    "vite": "^7.3.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.0.0",
    "lucide-vue-next": "^0.546.0",
    "js-yaml": "^4.1.0"
  }
}
```
