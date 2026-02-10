# "Talk to a Human" Feature

This document describes the escape valve for users who need human assistance at any point in the planning process.

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
4. Simply prefer human interaction

---

## The Solution

A prominent, always-visible "Get Help" button that:
1. Saves current wizard state (mid-progress export)
2. Packages it for easy handoff to Research IT
3. Provides multiple contact options
4. Never feels like "giving up" - it's a feature, not a failure

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

When clicked, opens a modal with options:

```
┌─────────────────────────────────────────────────────────────────┐
│  Need Help?                                                [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  We're here to help! Choose how you'd like to connect:         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📧  Email Us                                              │ │
│  │  Send your current progress to our team.                  │ │
│  │  We'll review and respond within 1 business day.          │ │
│  │                                                [Send →]    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📅  Schedule a Consultation                               │ │
│  │  30-minute call with a Research IT specialist.            │ │
│  │  We'll review your needs together.                        │ │
│  │                                          [Book Time →]     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  💾  Save & Continue Later                                 │ │
│  │  Download your progress to continue on your own time.     │ │
│  │                                          [Download →]      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📞 Prefer to call? (555) 123-4567 during business hours       │
│  📍 Or visit us: Research IT, Building 42, Room 101            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mid-Wizard Export

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

```yaml
# config/help.yaml

help:
  # Enable/disable help button
  enabled: true

  # Position of floating button
  button_position: "bottom-right"  # or "top-nav", "bottom-left"

  # Contact options
  email:
    enabled: true
    address: "research-it@northwinds.edu"
    response_time: "1 business day"
    include_state: true  # Attach wizard state to email

  scheduling:
    enabled: true
    provider: "calendly"  # or "microsoft-bookings", "custom"
    url: "https://calendly.com/northwinds-research-it/consultation"
    duration_minutes: 30
    include_state: true  # Share state before call

  phone:
    enabled: true
    number: "(555) 123-4567"
    hours: "Monday-Friday, 9am-5pm EST"

  walkin:
    enabled: true
    location: "Research IT, Building 42, Room 101"
    hours: "Monday-Friday, 9am-5pm EST"

  # Save/download option
  save_progress:
    enabled: true
    format: "json"  # or "yaml"

  # Shareable links (requires backend)
  shareable_links:
    enabled: false
    expiry_days: 30

  # Contextual help triggers
  auto_prompt:
    # Show help prompt after N seconds of inactivity on a step
    inactivity_seconds: 180  # 3 minutes
    message: "Need help? We're here if you get stuck."

    # Show help prompt after N failed interactions
    failed_interactions: 3
    failed_message: "This step can be tricky. Want to talk to someone?"
```

---

## Admin View for Research IT

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
