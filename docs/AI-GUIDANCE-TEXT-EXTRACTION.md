# AI Guidance Text Extraction Plan

> Extract text content from Vue components to YAML configs for fork-ability, following i18n-style pattern.

---

## Philosophy

**Goal:** Fork owners should edit text content in YAML, not wade through Vue code.

**Approach:** i18n-style extraction
- **Extract:** All user-facing text (questions, labels, descriptions, warnings, guidance)
- **Keep in Vue:** Display logic (color schemes, conditional rendering, state management)

**Pattern:** Same as clinical track
- Questions/options/outcomes → YAML
- Component interprets YAML → renders with Vue logic
- Fork owners edit `config/ai-guidance/*.yaml`, not `.vue` files

---

## Migration Tiers

### Tier 1: Clean Extraction (DO NOW)
**These are pure data, minimal logic. Extract to YAML immediately.**

| Applet | YAML File | Extractable | Stays in Vue |
|--------|-----------|-------------|--------------|
| **StakesAssessment** | `stakes-assessment.yaml` | Questions, outcomes, descriptions | `calculateStakesLevel()` (max function) |
| **TaskFit** | `task-fit.yaml` | 13 task categories, verification requirements | Selection state (trivial) |
| **VerificationGate** | `verification-gate.yaml` | Questions, options, guidance | Outcome determination logic |
| **DocumentationGuide** | `documentation-guide.yaml` | Principles, checklist items | Checklist state |

**Benefit:** High — institutions customize these heavily
**Complexity:** Low — 1-2 hours per applet
**Total:** ~6-8 hours for all Tier 1

---

### Tier 2: Partial Extraction (LATER)
**Extract text, keep complex logic in Vue.**

| Applet | Extract to YAML | Keep in Vue |
|--------|-----------------|-------------|
| **ToolPicker** | Tool definitions, categories, descriptions | `getToolStatus()` availability logic |
| **CommonPitfalls** | Checklist items for all 13 task types | Interactive checklist state + high-risk warnings |
| **DisclosureFramework** | Questions, disclosure templates | Post-flow template rendering + copy-to-clipboard |
| **BiasAssessment** | Relevance descriptions, mitigation strategies | Multi-dimensional color logic, conditional sections |

**Benefit:** Medium — ~70% text editable in YAML
**Complexity:** Medium-high — needs careful component refactoring
**Total:** ~12-16 hours for all Tier 2

---

### Tier 3: Leave as Vue
**Too entangled or too simple to bother.**

- **DataCheck** — Already works well, complex tier integration
- **IrbWorkflow** — Simple informational applet, not worth extracting
- Phase 2/3 applets — Lower priority, less customized

---

## File Structure

```
config/
├── ai-guidance/              # General AI applet content
│   ├── stakes-assessment.yaml
│   ├── task-fit.yaml
│   ├── verification-gate.yaml
│   ├── documentation-guide.yaml
│   ├── tool-picker.yaml      # Tier 2
│   ├── common-pitfalls.yaml  # Tier 2
│   └── ...
└── clinical/                 # Clinical track (already done)
    ├── hipaa-deidentification.yaml
    ├── irb-amendment.yaml
    └── clinical-validation.yaml
```

---

## Example: StakesAssessment Extraction

### Before (Vue Component)

```vue
<script setup>
const questions = [
  {
    id: 'audience',
    question: 'Who will act on this output?',
    helpText: 'Consider the scope of impact',
    options: [
      {
        value: 'self',
        label: 'Just me (personal notes, brainstorming)',
        description: 'Low stakes',
        setsOutput: { audienceLevel: 1 }
      },
      // ... more hardcoded options
    ]
  }
]

const stakesLevels = {
  critical: {
    label: 'Critical Stakes',
    color: 'red',
    description: 'Errors could cause significant harm...'
  }
}
</script>
```

### After (YAML + Vue)

**config/ai-guidance/stakes-assessment.yaml:**
```yaml
meta:
  applet_id: stakes-assessment
  title: Stakes Assessment
  core_question: What happens if AI gets this wrong?

questions:
  - id: audience
    question: Who will act on this output?
    help_text: Consider the scope of impact
    options:
      - value: self
        label: Just me (personal notes, brainstorming)
        description: Low stakes
        sets_output:
          audience_level: 1

outcomes:
  critical:
    label: Critical Stakes
    color: red
    description: Errors could cause significant harm...
```

**Component:**
```vue
<script setup>
const configStore = useConfigStore()

const appletConfig = computed(() => {
  return configStore.config?.aiGuidance?.['stakes-assessment'] || {}
})

const questions = computed(() => transformYamlQuestions(appletConfig.value.questions))
const outcomes = computed(() => appletConfig.value.outcomes)

// Display logic stays here
function calculateStakesLevel(output) {
  const max = Math.max(output.audience_level, output.decision_level, ...)
  return max >= 4 ? 'critical' : max >= 3 ? 'high' : ...
}
</script>
```

---

## Build Script Addition

Already implemented! `loadClinicalGuidance()` pattern extends to general applets.

Add to `scripts/build-config.js`:

```javascript
function loadAiGuidance() {
  const aiGuidance = {}
  const guidanceDir = path.join(CONFIG_DIR, 'ai-guidance')

  if (!fs.existsSync(guidanceDir)) return aiGuidance

  for (const file of fs.readdirSync(guidanceDir)) {
    if (file.endsWith('.yaml')) {
      const key = file.replace(/\.yaml$/, '')
      aiGuidance[key] = yaml.load(fs.readFileSync(path.join(guidanceDir, file), 'utf8'))
    }
  }

  return aiGuidance
}

// In buildConfig():
config.aiGuidance = loadAiGuidance()  // General track
config.clinicalGuidance = loadClinicalGuidance()  // Clinical track (existing)
```

---

## What Gets Extracted (Per Applet)

### Text Content → YAML
- `meta:` applet_id, title, core_question, description, version
- `intro:` introductory text, source notes
- `questions:` all question text, help_text, learn_more content
- `options:` labels, descriptions
- `outcomes:` titles, descriptions, implications, recommendations, warnings
- `guidance:` any instructional content
- `institutional:` contact info, local resources, customization points

### Display Logic → Vue
- `calculateStakesLevel()` functions
- `getColorClasses()` theme-aware styling
- Conditional rendering: `v-if="flags.includes(...)"`
- State management: `ref()`, `computed()`, `watch()`
- Icon mapping: `iconMap = { 'shield-check': ShieldCheck }`
- Progress tracking, animations, transitions

---

## Implementation Pattern (Reusable)

Every YAML-driven applet follows this structure:

```vue
<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

// 1. Load from YAML
const appletConfig = computed(() => {
  return configStore.config?.aiGuidance?.['applet-name'] || {}
})

// 2. Transform YAML to component format (if needed)
const questions = computed(() => {
  return (appletConfig.value.questions || []).map(q => ({
    id: q.id,
    question: q.question,
    helpText: q.help_text,
    options: (q.options || []).map(opt => ({
      ...opt,
      setsOutput: opt.sets_output,  // snake_case → camelCase
      setsFlags: opt.sets_flags
    }))
  }))
})

// 3. Display logic stays here (genuinely code-based)
function calculateSomething(output) {
  return /* actual logic that shouldn't be in YAML */
}

// 4. Render with YAML data + Vue logic
</script>

<template>
  <AppletFrame :title="appletConfig.meta?.title">
    <div v-html="appletConfig.intro?.text"></div>
    <DecisionFlow :questions="questions" @complete="handleComplete">
      <!-- outcome text from YAML, styling from Vue -->
    </DecisionFlow>
  </AppletFrame>
</template>
```

---

## Extraction Checklist (Per Applet)

For each applet being extracted:

- [ ] Create `config/ai-guidance/{applet-name}.yaml`
- [ ] Extract `meta` section (title, core_question, version)
- [ ] Extract `intro` text
- [ ] Extract `questions` array with help_text and learn_more
- [ ] Extract `options` labels and descriptions
- [ ] Extract `outcomes` with titles, descriptions, recommendations
- [ ] Extract any static guidance text
- [ ] Add `institutional` customization section
- [ ] Update component to `useConfigStore()`
- [ ] Test applet loads and functions identically
- [ ] Rebuild config, verify in dev server

---

## Tier 1 Priority Order

1. **StakesAssessment** (Phase 1 entry point — most used)
2. **VerificationGate** (Phase 1 exit point — critical messaging)
3. **TaskFit** (connects Stakes → Verification)
4. **DocumentationGuide** (Phase 2 — highly customizable)

**After these 4:** You have the core flow YAML-ified. Fork owners can customize the most-used applets.

---

## What This Enables for Fork Owners

**Example: Institutional customization of StakesAssessment**

```yaml
# config/ai-guidance/stakes-assessment.yaml

# University of XYZ can change this:
questions:
  - id: audience
    question: Who will act on this output?
    help_text: Consider institutional impact  # ← Changed
    options:
      - value: self
        label: Personal use only
        description: For your own reference  # ← Simplified language

# Add local resources:
institutional:
  contact: responsible-ai@xyz.edu
  policy_url: https://xyz.edu/ai-policy
  local_guidance:
    - title: XYZ AI Use Guidelines
      url: /local/ai-guidelines.pdf
```

**No Vue code touched.** Just edit YAML, rebuild config, done.

---

## Testing Strategy

For each migrated applet:

1. **Functionality test:** Complete applet flow, verify outcomes match
2. **Cross-applet test:** Verify routing and flag passing still works
3. **Content test:** Edit YAML text, rebuild, verify changes appear
4. **Institutional test:** Add institutional section, verify displayed
5. **Dark mode test:** Ensure styling still works (logic stayed in Vue)

---

## Next Steps

Should I start with Tier 1 extractions? Order:
1. StakesAssessment (most used)
2. VerificationGate (critical messaging)
3. TaskFit (connector)
4. DocumentationGuide (customizable)

This gives you the core Phase 1 flow YAML-ified first.
