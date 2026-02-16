# IT Workbench Control Panel Spec

> Settings and keyboard shortcuts for power users like Marco and Piper.

---

## Location

Add a settings/control panel accessible from the workbench header. Small gear icon next to the logout button.

```
┌─────────────────────────────────────────────────────────────┐
│ Support Workbench  [Staff Access]           👤 Piper  ⚙️ ↪  │
└─────────────────────────────────────────────────────────────┘
                                                    ^
                                              gear icon here
```

Clicking the gear opens a slide-out panel or modal.

---

## Control Panel Sections

### 1. Keyboard Shortcuts

Toggle to enable/disable keyboard shortcuts globally.

```
┌─────────────────────────────────────────────────────────┐
│ ⌨️ Keyboard Shortcuts                          [ON/OFF] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Item Review (when item expanded)                       │
│  ─────────────────────────────────────────              │
│  A    Mark as Approved                                  │
│  I    Mark as Needs Info                                │
│  F    Mark as Flagged                                   │
│  P    Mark as Pending (reset)                           │
│  N    Focus notes textarea                              │
│                                                         │
│  Navigation                                             │
│  ─────────────────────────────────────────              │
│  ↑/↓  Move between items                                │
│  Enter/Space  Expand/collapse current item              │
│  Esc  Collapse current item                             │
│                                                         │
│  Plan Actions                                           │
│  ─────────────────────────────────────────              │
│  Shift+A  Set plan status to Approved                   │
│  Shift+R  Set plan status to Needs Revision             │
│  Shift+E  Open export modal                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Implementation notes:**
- Shortcuts only active when a plan is loaded
- Item shortcuts only active when an item is expanded
- Prevent conflicts with browser shortcuts (no Ctrl/Cmd combos)
- Show toast confirmation: "Marked as Approved (A)"

---

### 2. Quick Note Templates

Pre-defined notes that can be inserted with one click.

```
┌─────────────────────────────────────────────────────────┐
│ 📝 Quick Note Templates                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [+ Add template]                                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Approved - Standard                               │  │
│  │ "Approved. Standard allocation."                  │  │
│  │                                      [Edit] [🗑️]  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Needs HIPAA clarification                         │  │
│  │ "Need to confirm HIPAA status — please update     │  │
│  │  tier if applicable and resubmit."                │  │
│  │                                      [Edit] [🗑️]  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Escalate to Marco                                 │  │
│  │ "Escalating to senior staff for L3/L4 review."   │  │
│  │                                      [Edit] [🗑️]  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Usage:**
- When editing item notes, show template picker dropdown
- Templates stored in localStorage per-user
- Keyboard shortcut: `T` to open template picker when in notes field

**Default templates (pre-populated):**
1. "Approved. Standard allocation."
2. "Need to confirm HIPAA status — please update tier if applicable."
3. "Contact Research Computing for L3/L4 requirements."
4. "Storage estimate looks high — please verify calculation."
5. "Approved pending department billing confirmation."

---

### 3. Display Preferences

```
┌─────────────────────────────────────────────────────────┐
│ 🎨 Display                                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Auto-expand items on load           [OFF]              │
│  Show cost in sidebar list           [ON]               │
│  Compact item view                   [OFF]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## State Management

Add to `workbenchStore.js`:

```javascript
// Settings (persisted to localStorage)
const settings = ref({
  keyboardShortcutsEnabled: true,
  noteTemplates: [
    { id: '1', name: 'Approved - Standard', text: 'Approved. Standard allocation.' },
    { id: '2', name: 'Needs HIPAA clarification', text: 'Need to confirm HIPAA status — please update tier if applicable.' },
    { id: '3', name: 'Escalate', text: 'Escalating to senior staff for L3/L4 review.' },
  ],
  autoExpandItems: false,
  showCostInSidebar: true,
  compactView: false
})

function updateSettings(updates) {
  settings.value = { ...settings.value, ...updates }
  saveSettings()
}

function addNoteTemplate(name, text) {
  settings.value.noteTemplates.push({
    id: crypto.randomUUID(),
    name,
    text
  })
  saveSettings()
}

function removeNoteTemplate(id) {
  settings.value.noteTemplates = settings.value.noteTemplates.filter(t => t.id !== id)
  saveSettings()
}
```

---

## Keyboard Handler Component

Create `src/components/workbench/WorkbenchKeyboardHandler.vue`:

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useWorkbenchStore } from '@/stores/workbenchStore'

const workbenchStore = useWorkbenchStore()
const emit = defineEmits([
  'approve-item',
  'needs-info-item',
  'flag-item',
  'pending-item',
  'focus-notes',
  'expand-toggle',
  'collapse',
  'navigate-up',
  'navigate-down',
  'approve-plan',
  'revision-plan',
  'export-plan'
])

function handleKeydown(e) {
  if (!workbenchStore.settings.keyboardShortcutsEnabled) return
  if (!workbenchStore.activePlan) return

  // Skip if in input/textarea
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    // Allow Escape to blur
    if (e.key === 'Escape') {
      e.target.blur()
    }
    return
  }

  const key = e.key.toLowerCase()
  const shift = e.shiftKey

  // Plan-level (Shift + key)
  if (shift) {
    if (key === 'a') { emit('approve-plan'); e.preventDefault() }
    if (key === 'r') { emit('revision-plan'); e.preventDefault() }
    if (key === 'e') { emit('export-plan'); e.preventDefault() }
    return
  }

  // Item-level
  if (key === 'a') { emit('approve-item'); e.preventDefault() }
  if (key === 'i') { emit('needs-info-item'); e.preventDefault() }
  if (key === 'f') { emit('flag-item'); e.preventDefault() }
  if (key === 'p') { emit('pending-item'); e.preventDefault() }
  if (key === 'n') { emit('focus-notes'); e.preventDefault() }

  // Navigation
  if (key === 'arrowup') { emit('navigate-up'); e.preventDefault() }
  if (key === 'arrowdown') { emit('navigate-down'); e.preventDefault() }
  if (key === 'enter' || key === ' ') { emit('expand-toggle'); e.preventDefault() }
  if (key === 'escape') { emit('collapse'); e.preventDefault() }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <slot />
</template>
```

---

## UI Components Needed

1. **WorkbenchControlPanel.vue** — The settings panel (slide-out or modal)
2. **WorkbenchKeyboardHandler.vue** — Global keyboard listener
3. **NoteTemplatePicker.vue** — Dropdown for inserting templates
4. **KeyboardShortcutHint.vue** — Small badge showing shortcut (e.g., "[A]" next to Approved button)

---

## Implementation Order

1. [ ] Add `settings` to workbenchStore with persistence
2. [ ] Create WorkbenchControlPanel with toggle for shortcuts
3. [ ] Create WorkbenchKeyboardHandler component
4. [ ] Wire up keyboard events in PlanReview
5. [ ] Add shortcut hints to status buttons
6. [ ] Add note templates management
7. [ ] Add template picker to notes textarea

---

## Accessibility Notes

- Keyboard shortcuts should be visible (hints on buttons)
- Shortcuts must not conflict with screen reader keys
- Add `aria-keyshortcuts` attributes to buttons
- Provide way to disable shortcuts entirely

---

## Future: Email Integration

Piper asked for this. Not in this PR, but the spec:

```
[Send to Researcher]
  ├── Download JSON (current)
  ├── Copy to clipboard
  └── Open email with attachment (if browser supports)
```

For email integration, we'd use `mailto:` with pre-filled subject/body, but attachment handling varies by browser/OS. The JSON download + manual attachment is the reliable path for now.
