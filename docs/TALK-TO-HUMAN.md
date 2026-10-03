# Get Help Feature

This document describes the help system for users who need assistance at any point in the planning process.

> **Status (Oct 2026):** Partially implemented. **Shipped:** the persistent
> floating "Get Help" button (`App.vue`) and `GetHelpModal.vue`, driven by
> `config/help.yaml` — contact options, a step-keyed contextual message, office
> hours, an urgent-contact block, and an FAQ. Because the repo ships the
> fictional Northwinds config, the contact buttons are deliberate placeholders:
> clicking one shows a notice describing what a real deployment would do, not a
> `mailto:` or link. **Not built:** the video help system (`help-videos.yaml`
> holds 41 scripted video definitions, none produced, nothing renders them), the
> Email Us / Schedule flows, mid-wizard export and shareable links, the
> auto-prompt, step analytics, and the admin view (the closest thing is the
> [IT Workbench](./IT-WORKBENCH.md), which imports exported plan JSON).

---

## The Problem

From UX testing and faculty feedback:

> "Sometimes I just need to talk to someone. I don't know what I don't know."

> "What if I get halfway through and realize I'm in over my head?"

> "Can I save my progress and have someone review it with me?"

The wizard is designed to be self-service, but some users:
1. Get stuck and don't know how to proceed
2. Have edge cases the wizard doesn't cover
3. Want validation before submitting
4. Simply prefer guided walkthroughs over reading docs

### The Staffing Reality

Research IT teams don't have unlimited staff to field calls. The original "Talk to a Human" design assumed consultants were readily available. Reality check:

> "We don't have the staff! That's the whole point of this tool!"

If we route everyone to humans, we've just built a ticketing system with extra steps.

---

## The Solution: Video-First Help

A prominent "Get Help" button that opens a modal with **contextual video walkthroughs** as the primary assistance method. These short, narrated videos answer the same questions a staff member would - but they scale infinitely.

### Hierarchy of Help

1. **Video walkthrough** (default) - Short narrated videos for common questions
2. **Save progress** - Download state to continue later or share with colleagues
3. **Email request** - For genuinely complex cases that need human review
4. **Schedule consultation** - Last resort for edge cases

The key insight: **Most "I need to talk to someone" requests are actually "I need someone to explain this to me."** Videos do that.

---

## Video Help System

> **Not built.** `config/help-videos.yaml` compiles into `config.help_videos`,
> but no component reads it. Its real shape also differs from the sketch below:
> top-level category lists (`concepts`, `calculators`, `wizard_steps`, `software`,
> `disciplines`, `process`, `troubleshooting`) of entries with `duration: "1:30"`,
> `triggers` (page / component / term), and `script_notes`, plus `settings` and
> `production` blocks — no per-video `url` yet.

### Video Configuration

All help videos are defined in `config/help-videos.yaml`. Each video has:

```yaml
- slug: what-is-tb
  title: "What is a TB?"
  description: "Explains terabytes using real-world examples"
  duration_seconds: 90
  thumbnail: "what-is-tb.jpg"  # Optional
  category: concepts
  contexts:
    - storage-estimate
    - storage-calculator
  url: null  # Production URL added when video is produced
```

### Video Categories

| Category | Purpose | Example |
|----------|---------|---------|
| `concepts` | Core terminology | "What is a TB?", "What is a data tier?" |
| `calculators` | Calculator walkthroughs | "Estimating storage for microscopy data" |
| `wizard` | Step-by-step guides | "Selecting the right data tier" |
| `software` | Software questions | "Finding software licenses" |
| `discipline` | Field-specific guides | "Guide for humanities researchers" |
| `process` | Institutional workflows | "What happens after I submit?" |
| `troubleshooting` | Common problems | "My estimate seems too high" |

### Contextual Video Display

Videos surface based on where the user is in the wizard:

| User Location | Suggested Videos |
|---------------|------------------|
| Storage calculator | "What is a TB?", "Estimating storage for [discipline]" |
| Tier selection | "What is a data tier?", "[discipline] tier examples" |
| Service selection | "Understanding service categories", "HIPAA compliance" |
| Results page | "Reading your cost estimate", "What happens next?" |

### Production Notes

Videos should be produced with:
- **Accessibility**: Captions required, audio descriptions for visual content
- **Length**: 60-180 seconds (short attention spans)
- **Format**: MP4 (H.264), multiple quality levels for bandwidth
- **Style**: Screen recordings with voiceover, minimal talking-head
- **Updates**: Modular so individual videos can be replaced without reshooting everything

See `config/help-videos.yaml` for the full video catalog and production specifications.

---

## Design Principles

### 1. Always Accessible
The help button should be visible on every page, not buried in a menu.

### 2. Preserve Progress
Users should never lose work. Export mid-wizard state.

### 3. Context-Aware
The help request should include what the user was doing, where they got stuck.

### 4. Multiple Channels
Email, scheduling, phone - let users choose their preferred contact method.

### 5. Warm Handoff
When possible, include wizard state so the human helper has context.

---

## UI Implementation

### Persistent Help Button

A floating button in the bottom-right corner (or top nav):

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] Open Data Planner           [Software] [Help] [?]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      (Wizard content)                           │
│                                                                 │
│                                                                 │
│                                                                 │
│                                                                 │
│                                                        ┌──────┐ │
│                                                        │ 💬   │ │
│                                                        │ Help │ │
│                                                        └──────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Help Modal

When clicked, opens a modal with videos first, then fallback options:

```
┌─────────────────────────────────────────────────────────────────┐
│  Get Help                                                  [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Quick Answers                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ▶ What is a TB?                                    1:30   │ │
│  │ ▶ Understanding data tiers                         2:15   │ │
│  │ ▶ Estimating storage for [your discipline]        3:00   │ │
│  │ ▶ What happens after I submit?                     2:00   │ │
│  │                                                           │ │
│  │                            [Browse All Videos →]          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Still need help?                                               │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │  💾 Save Progress   │  │  📧 Email Us        │              │
│  │  Continue later     │  │  Complex questions  │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  📞 (555) 123-4567 during business hours                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Video Player Modal

When a video is selected:

```
┌─────────────────────────────────────────────────────────────────┐
│  What is a TB?                                     [← Back] [X] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │                    (Video Player)                         │ │
│  │                                                           │ │
│  │                       ▶ 1:30                              │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  A terabyte (TB) is about 1,000 gigabytes. For reference:     │
│  • 200,000 photos                                              │
│  • 500 hours of HD video                                       │
│  • 40,000 songs                                                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Related videos:                                                │
│  ▶ Estimating storage for genomics  ▶ What is archive storage? │
│                                                                 │
│  Was this helpful?  [👍 Yes]  [👎 No]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mid-Wizard Export

> **Not built.** `help.yaml` has an `export_state` block, but nothing reads it.
> What exists today: the slate's "Export for Grant" (`ExportModal.vue`, JSON or
> Markdown, available any time) and the Results step's session JSON download.

### Export State Structure

The export captures everything the user has done so far:

```typescript
interface WizardExportState {
  // Metadata
  exportedAt: string  // ISO timestamp
  exportedFrom: string  // Current step/page
  version: string  // App version for compatibility

  // User context (if logged in)
  user?: {
    name: string
    email: string
    department: string
  }

  // Wizard progress
  completedSteps: string[]
  currentStep: string

  // User inputs by step
  inputs: {
    project: {
      title?: string
      description?: string
      piName?: string
      grantNumber?: string
      startDate?: string
      endDate?: string
    }

    tier: {
      selectedTier?: 'low' | 'medium' | 'high'
      tierJustification?: string
    }

    storage: {
      activeAmount?: number
      archiveAmount?: number
      unit?: 'TB' | 'GB'
      estimatedVia?: string  // Which calculator was used
    }

    compute: {
      cpuHours?: number
      gpuHours?: number
    }

    services: {
      selectedServices: string[]
      serviceConfigurations: Record<string, any>
    }

    bundles: {
      selectedBundles: string[]
    }
  }

  // Calculated values
  estimates: {
    monthlyCost?: number
    yearlyCost?: number
    totalCost?: number
  }

  // Where user might be stuck
  context: {
    lastInteraction: string  // Timestamp
    timeOnCurrentStep: number  // Seconds
    helpButtonClickLocation: string  // Which page/step
  }
}
```

### Export Formats

#### 1. Email to Research IT

```
Subject: Data Planning Assistance Request - [Project Title]

Hello Research IT,

[User Name] ([email]) has requested assistance with their research
infrastructure plan.

Project: [Title]
Department: [Department]
Requested from: [Current Step Name]

--- Current Progress ---

✅ Completed Steps:
  - Project Details
  - Data Classification (Medium Tier)
  - Storage Estimates (15 TB active, 10 TB archive)

🔄 Currently On:
  - Service Selection

📋 Selected Services:
  - HPC Compute (CPU)
  - HPC Storage (Isilon)

💰 Current Estimate: $450/month

--- User's Selections (JSON) ---
[Attached: wizard-state-2024-01-15.json]

--- How to Help ---
1. Open the attachment in the Data Planner admin view
2. Review their selections and estimates
3. Reach out to schedule a consultation

Best,
Open Data Planner
```

#### 2. Downloadable JSON

For user to save and reload later:

```json
{
  "exportedAt": "2024-01-15T14:30:00Z",
  "exportedFrom": "service-selection",
  "version": "1.2.0",
  "inputs": {
    "project": {
      "title": "Genomics Analysis Pipeline",
      "piName": "Dr. Jane Smith"
    },
    "tier": {
      "selectedTier": "medium"
    },
    "storage": {
      "activeAmount": 15,
      "archiveAmount": 10,
      "unit": "TB"
    }
  }
}
```

#### 3. Shareable Link (Optional)

If the app supports it, generate a shareable link that encodes state:

```
https://planner.northwinds.edu/resume?state=eyJwcm9qZWN0Ijp7...
```

---

## "Email Us" Flow

### Step 1: Compose Message

```
┌─────────────────────────────────────────────────────────────────┐
│  Send to Research IT                                       [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your progress will be included automatically.                  │
│                                                                 │
│  Your Email *                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ jane.smith@northwinds.edu                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  What do you need help with? *                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ I'm not sure which storage option is right for my       │   │
│  │ genomics data. I have about 50 samples at 30x coverage  │   │
│  │ and I'm not sure if I need HPC storage or cloud...      │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📎 Your current progress will be attached                      │
│     Project: Genomics Analysis Pipeline                         │
│     Step: Service Selection                                     │
│     Estimate: $450/month                                        │
│                                                                 │
│  [ ] I'd like someone to call me: (___) ___-____               │
│                                                                 │
│                                        [Cancel]  [Send Request] │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│  Request Sent! ✅                                          [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  We've received your request and will respond within            │
│  1 business day.                                                │
│                                                                 │
│  Your reference number: #RIT-2024-0542                         │
│                                                                 │
│  What happens next?                                             │
│  1. Our team will review your progress and question             │
│  2. We'll email you with recommendations or schedule a call     │
│  3. You can continue working here - we'll email you either way  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📧 Confirmation sent to: jane.smith@northwinds.edu            │
│  📞 Need urgent help? Call (555) 123-4567                       │
│                                                                 │
│                                              [Continue Planning] │
└─────────────────────────────────────────────────────────────────┘
```

---

## "Schedule a Consultation" Flow

Integration with Calendly, Microsoft Bookings, or similar:

```
┌─────────────────────────────────────────────────────────────────┐
│  Schedule a Consultation                                   [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Book a 30-minute call with a Research IT specialist.          │
│  We'll review your infrastructure needs together.              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │          (Embedded Calendly / Bookings widget)          │   │
│  │                                                         │   │
│  │   Select a time that works for you...                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📎 Your current progress will be shared with your consultant  │
│     before the call so they can prepare.                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Config Schema

### help.yaml - Contact Options (Fallback)

> **As built** the file has a different shape: top-level `global`,
> `contact_options`, `contextual_help`, `export_state`, `faq`, `office_hours`,
> and `urgent`. `GetHelpModal.vue` reads `contact_options`, `contextual_help`
> (keyed by wizard step id), `faq`, `office_hours`, and `urgent`; `App.vue`
> reads `global.show_help_cta` + `global.floating_button.enabled`. The rest of
> `global` (CTA text/link/position, `emphasized_pages`, `show_after_seconds`,
> `pulse_animation`) and `export_state` aren't wired up. The sketch below is the
> original design.

```yaml
# config/help.yaml

help:
  enabled: true
  button_position: "bottom-right"

  # Contact options (fallback after videos)
  email:
    enabled: true
    address: "research-it@northwinds.edu"
    response_time: "1 business day"
    include_state: true

  scheduling:
    enabled: false  # Disable if no staff for 1:1 consultations

  phone:
    enabled: true
    number: "(555) 123-4567"
    hours: "Monday-Friday, 9am-5pm EST"

  walkin:
    enabled: false  # Disable if no walk-in hours

  save_progress:
    enabled: true
    format: "json"

  auto_prompt:
    inactivity_seconds: 180
    message: "Need help? Watch a quick video walkthrough."
    failed_interactions: 3
    failed_message: "This step can be tricky. Would a video help?"
```

### help-videos.yaml - Video Catalog

See `config/help-videos.yaml` for the complete video catalog with ~45 topics organized by category (concepts, calculators, wizard steps, discipline guides, etc.)

```yaml
# Example video definition
videos:
  - slug: what-is-tb
    title: "What is a TB?"
    description: "Terabytes explained with real-world examples"
    duration_seconds: 90
    category: concepts
    contexts:
      - storage-estimate
      - storage-calculator
    url: null  # null = not yet produced
```

---

## Admin View for Research IT

> **Not built** as a help-request inbox. The [IT Workbench](./IT-WORKBENCH.md)
> covers the "see their state" half: staff import a researcher's exported plan
> JSON and review it.

When Research IT receives a help request, they should have a way to view the user's state:

```
┌─────────────────────────────────────────────────────────────────┐
│  Help Request #RIT-2024-0542                        [Assign ▼]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  From: Dr. Jane Smith (jane.smith@northwinds.edu)              │
│  Submitted: Jan 15, 2024 at 2:30 PM                            │
│  Department: Biology                                            │
│                                                                 │
│  Question:                                                      │
│  "I'm not sure which storage option is right for my genomics   │
│   data. I have about 50 samples at 30x coverage..."            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Their Progress:                                                │
│                                                                 │
│  Project: Genomics Analysis Pipeline                            │
│  Tier: Medium                                                   │
│  Storage: 15 TB active, 10 TB archive                          │
│                                                                 │
│  Selected Services:                                             │
│  ✅ HPC Compute (CPU)                                          │
│  ✅ HPC Storage (Isilon)                                       │
│                                                                 │
│  Current Estimate: $450/month                                   │
│                                                                 │
│  [View Full State]  [Open in Planner]  [Reply]  [Schedule Call] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

### State Persistence

- Use localStorage for automatic save-as-you-go
- Export to JSON for portability
- Consider URL-encoded state for shareable links (but watch length limits)

### Privacy Considerations

- Only send state if user consents (they click "Send")
- Don't include sensitive data in shareable links
- Encrypt state if storing server-side

### Accessibility

- Help button must be keyboard accessible
- Announce modal opening to screen readers
- Provide text alternatives for icons

---

## Integration Points

### Wizard Steps

Each step should track:
- Time spent on step
- Number of interactions (clicks, changes)
- Any validation errors encountered

This context helps Research IT understand where users struggle.

### Export Component

Reuse the existing export functionality:

```vue
<script setup>
import { useWizardState } from '@/composables/useWizardState'
import { exportToJson, exportToEmail } from '@/utils/export'

const { state, completedSteps, currentStep } = useWizardState()

const handleEmailRequest = async (message: string, email: string) => {
  const exportData = {
    ...state.value,
    completedSteps: completedSteps.value,
    currentStep: currentStep.value,
    helpRequest: {
      message,
      email,
      timestamp: new Date().toISOString()
    }
  }

  await exportToEmail(exportData)
}
</script>
```

### Analytics (Optional)

Track help requests to identify pain points:
- Which steps trigger the most help requests?
- What questions are most common?
- How long do users spend before asking for help?

---

## Future Enhancements

### AI-Assisted Triage (v2)

Before routing to a human, offer AI assistance:
- "Let me try to help first..."
- Parse the question, suggest relevant docs
- If AI can't help, seamlessly hand off to human

### Live Chat (v3)

Real-time chat with Research IT during business hours:
- Show online/offline status
- Queue management
- Chat history saved to request

### Community Forum

For common questions, link to a community Q&A:
- "Others have asked similar questions..."
- Reduces load on Research IT
- Builds knowledge base

---

## References

- [ELI5.md](./ELI5.md) - Help Me Estimate feature
- [SOFTWARE-CATALOG.md](./SOFTWARE-CATALOG.md) - Software catalog (often triggers help requests)
