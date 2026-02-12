# IT Workbench Specification

## Overview

The IT Workbench is a review interface for Research IT staff to process submitted service requests. It lives within the same app at `/workbench` with simple password protection.

**Design philosophy:** Keep it part of the main app during active development to reuse logic (stores, composables, components). Can be extracted later once patterns stabilize.

---

## Route Structure

```
/workbench              → Password gate (if not authenticated)
/workbench              → Dashboard (list of imported requests)
/workbench/:requestId   → Request review detail view
```

### Password Protection

Simple client-side gate using a password stored in `meta.yaml`:

```yaml
# config/meta.yaml
workbench:
  enabled: true
  password: "northwinds-it-2024"  # Simple shared password
  session_duration: 8  # hours before re-auth required
```

**Security note:** This is not meant to protect sensitive data—the JSON files contain the same info faculty already have. It's a light gate to prevent accidental access and keep the interface focused for IT staff.

---

## Data Flow

```
RESEARCHER                           IT STAFF
──────────                           ────────
┌─────────────────┐
│ OpenDataPlanner │
│ (planning mode) │
└────────┬────────┘
         │
         │ Export JSON
         ▼
    request.json ──────────────────► Import into Workbench
         │                                    │
         │                                    ▼
         │                           ┌─────────────────┐
         │                           │  IT Workbench   │
         │                           │  ─────────────  │
         │                           │  • Review items │
         │                           │  • Add notes    │
         │                           │  • Set status   │
         │                           │  • Export PDF   │
         │                           └────────┬────────┘
         │                                    │
         │                           Export reviewed JSON
         │                                    │
    reviewed.json ◄───────────────────────────┘
         │
         ▼
  Re-import into Planner
  (see IT notes, respond)
```

---

## Notes System

### Schema Extension

Add notes fields to SlateItem in `slateStore`:

```javascript
// SlateItem shape (extended)
{
  id: string,
  service: string,
  quantity: number,
  unit: string,
  monthlyEstimate: number,
  annualEstimate: number,
  fromCalculator: string | null,
  calculatorInputs: object | null,
  addedAt: string,

  // NEW: Notes fields
  notes: string | null,           // Researcher's notes (why they need this)
  itNotes: string | null,         // IT response/feedback
  itStatus: string | null,        // 'pending' | 'approved' | 'needs-info' | 'denied'
  itReviewedAt: string | null,    // ISO timestamp
  itReviewedBy: string | null     // IT staff name/initials
}
```

### Two-Way Communication

| Field | Written By | Visible To | Purpose |
|-------|-----------|------------|---------|
| `notes` | Researcher | Both | "Why I need this", context, justification |
| `itNotes` | IT Staff | Both | Feedback, questions, alternatives suggested |
| `itStatus` | IT Staff | Both | Workflow state |

### Status Values

```yaml
itStatus:
  pending: "Not yet reviewed"
  approved: "Approved as requested"
  approved-modified: "Approved with changes (see notes)"
  needs-info: "Need more information from researcher"
  denied: "Cannot provision (see notes for alternatives)"
```

---

## Workbench UI

### Password Gate

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                    🔐 IT Workbench                         │
│                                                            │
│        Enter the workbench password to continue            │
│                                                            │
│        ┌─────────────────────────────────────┐            │
│        │ ••••••••••••••                      │            │
│        └─────────────────────────────────────┘            │
│                                                            │
│                    [ Enter Workbench ]                     │
│                                                            │
│        ─────────────────────────────────────               │
│        Need access? Contact your admin.                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

Store auth state in sessionStorage:
```javascript
{
  workbenchAuth: true,
  workbenchAuthAt: "2024-01-15T09:00:00Z"
}
```

### Dashboard (Request List)

```
┌────────────────────────────────────────────────────────────────────────┐
│  IT Workbench                                            [ Log Out ]   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  📁 Import Request JSON                              [Browse]  │   │
│  │     Drag and drop or click to import                           │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ── Imported Requests ───────────────────────────────────────────────  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 RC-2024-0142                                    Jan 15, 2024 │   │
│  │    Dr. Sarah Chen • Genomics Lab                                │   │
│  │    Tier: L3 (High) • 4 services • $12,400/yr                   │   │
│  │    ⚠ 2 items need review                                        │   │
│  │                                        [Review] [Export] [Remove]│   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ 🟢 RC-2024-0139                                    Jan 12, 2024 │   │
│  │    Prof. James Miller • Physics                                 │   │
│  │    Tier: L1 (Low) • 2 services • $3,200/yr                     │   │
│  │    ✓ All items approved                                         │   │
│  │                                        [Review] [Export] [Remove]│   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ── No requests ─────────────────────────────────────────────────────  │
│  Import a researcher's exported JSON file to begin review.             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Request Review Detail

```
┌────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                     RC-2024-0142 • Dr. Sarah Chen │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐ │
│  │ RESEARCHER INFO                 │  │ REQUEST SUMMARY             │ │
│  │ ───────────────                 │  │ ───────────────             │ │
│  │ Name: Dr. Sarah Chen            │  │ Tier: L3 (High)             │ │
│  │ Email: schen@northwinds.edu     │  │ Grant Period: 3 years       │ │
│  │ Dept: Genomics Lab              │  │ Services: 4                 │ │
│  │ Submitted: Jan 15, 2024         │  │ Est. Annual: $12,400        │ │
│  └─────────────────────────────────┘  └─────────────────────────────┘ │
│                                                                        │
│  ── Services Requested ──────────────────────────────────────────────  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 PENDING    HPC Storage                                       │   │
│  │               50 TB @ $50/TB/yr = $2,500/yr                    │   │
│  │ ─────────────────────────────────────────────────────────────── │   │
│  │ RESEARCHER NOTES:                                               │   │
│  │ "Need this for RNA-seq raw data. We'll have ~200 samples       │   │
│  │  at 30x coverage. Used the genomics calculator."               │   │
│  │ ─────────────────────────────────────────────────────────────── │   │
│  │ IT NOTES:                                                       │   │
│  │ ┌──────────────────────────────────────────────────────────┐   │   │
│  │ │ Type your notes here...                                   │   │   │
│  │ └──────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │ STATUS: [Pending ▼]  [Approved] [Needs Info] [Denied]          │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ 🟡 PENDING    HIPAA-Compliant Compute                          │   │
│  │               100,000 SU @ $0.05/SU = $5,000/yr                │   │
│  │ ─────────────────────────────────────────────────────────────── │   │
│  │ RESEARCHER NOTES:                                               │   │
│  │ "Running GATK pipeline. Estimated via genomics pipeline calc." │   │
│  │ ─────────────────────────────────────────────────────────────── │   │
│  │ IT NOTES:                                                       │   │
│  │ ┌──────────────────────────────────────────────────────────┐   │   │
│  │ │                                                           │   │   │
│  │ └──────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │ STATUS: [Pending ▼]                                            │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ... more services ...                                                 │
│                                                                        │
│  ── Actions ─────────────────────────────────────────────────────────  │
│                                                                        │
│  [ Save Progress ]  [ Export Reviewed JSON ]  [ Generate Summary PDF ] │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Researcher Notes UI

Add notes capability to the slate item cards:

### In Slate Expanded View

```
┌────────────────────────────────────────────────────────────────────────┐
│ HPC Storage                                              50 TB         │
│ $2,500/yr                                                              │
│ ─────────────────────────────────────────────────────────────────────  │
│ 📝 Add note for IT...                                                  │
│ ┌──────────────────────────────────────────────────────────────────┐  │
│ │ Need this for RNA-seq raw data. We'll have ~200 samples at 30x   │  │
│ │ coverage. Used the genomics calculator.                          │  │
│ └──────────────────────────────────────────────────────────────────┘  │
│                                                              [Remove]  │
└────────────────────────────────────────────────────────────────────────┘
```

### After IT Review (re-imported JSON)

```
┌────────────────────────────────────────────────────────────────────────┐
│ HPC Storage                                    ✓ APPROVED    50 TB    │
│ $2,500/yr                                                              │
│ ─────────────────────────────────────────────────────────────────────  │
│ 📝 Your note:                                                          │
│ "Need this for RNA-seq raw data..."                                    │
│ ─────────────────────────────────────────────────────────────────────  │
│ 💬 IT Response:                                                        │
│ "Approved. Note: Consider archiving raw FASTQs after alignment to     │
│  reduce ongoing storage costs. Archive tier is $10/TB/yr."            │
│                                                              [Remove]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## JSON Export Format (Extended)

```json
{
  "version": "1.1",
  "exportedAt": "2024-01-15T14:30:00Z",
  "exportedFrom": "planner",
  "request": {
    "id": "RC-2024-0142",
    "status": "submitted",
    "submittedAt": "2024-01-15T14:30:00Z"
  },
  "contact": {
    "name": "Dr. Sarah Chen",
    "email": "schen@northwinds.edu",
    "department": "Genomics Lab"
  },
  "classification": {
    "tier": "high",
    "tierName": "High Risk (L3)",
    "flags": ["hipaa", "phi"],
    "questionnaireAnswers": { ... }
  },
  "grantPeriod": {
    "years": 3,
    "startDate": "2024-07-01",
    "endDate": "2027-06-30"
  },
  "slate": {
    "items": [
      {
        "id": "uuid-1234",
        "service": "hpc-storage",
        "quantity": 50,
        "unit": "TB",
        "monthlyEstimate": 208.33,
        "annualEstimate": 2500,
        "fromCalculator": "genomics",
        "calculatorInputs": {
          "sampleCount": 200,
          "sequencingType": "rna-seq",
          "coverage": "30x"
        },
        "notes": "Need this for RNA-seq raw data...",
        "itNotes": null,
        "itStatus": "pending",
        "itReviewedAt": null,
        "itReviewedBy": null
      }
    ],
    "software": [ ... ],
    "totals": {
      "monthlyBase": 1033.33,
      "annualBase": 12400,
      "annualWithFA": 18600
    }
  },
  "dmp": {
    "generated": true,
    "tierTemplate": "high",
    "text": "..."
  },
  "itReview": {
    "reviewedAt": null,
    "reviewedBy": null,
    "overallStatus": "pending",
    "internalNotes": null
  }
}
```

---

## Implementation Plan

### Phase 1: Notes in Slate
1. Extend SlateItem schema with notes fields
2. Add notes textarea to SlateExpandedView item cards
3. Include notes in JSON export
4. Parse notes from JSON import

### Phase 2: Password Gate
1. Add workbench config to meta.yaml
2. Create WorkbenchAuth.vue component
3. Create workbenchStore for auth state
4. Add route guard for /workbench

### Phase 3: Import & Dashboard
1. Create WorkbenchDashboard.vue
2. Implement JSON import with validation
3. Store imported requests in workbenchStore
4. Display request cards with summary stats

### Phase 4: Review Interface
1. Create WorkbenchReview.vue
2. Display all slate items with notes
3. Add IT notes textarea per item
4. Add status dropdown per item
5. Implement save/export

### Phase 5: Round-Trip
1. Export reviewed JSON from workbench
2. Import reviewed JSON in planner
3. Display IT notes and status to researcher
4. Allow researcher to respond/update

---

## File Summary

### New Files
```
src/stores/workbenchStore.js          # Auth state, imported requests
src/components/workbench/WorkbenchAuth.vue
src/components/workbench/WorkbenchDashboard.vue
src/components/workbench/WorkbenchReview.vue
src/components/workbench/RequestCard.vue
src/components/workbench/ServiceReviewCard.vue
```

### Modified Files
```
config/meta.yaml                      # Add workbench config
src/stores/slateStore.js              # Add notes fields to SlateItem
src/components/slate/SlateExpandedView.vue  # Add notes UI
src/router/index.js                   # Add /workbench routes
```

---

## Open Questions

1. **PDF generation**: Should we add a "Generate Summary PDF" for IT to send to researchers, or is the JSON round-trip sufficient?

2. **Request ID format**: Currently showing `RC-2024-0142`. Should this be auto-generated on export, or should IT assign it?

3. **Multiple reviews**: If a request goes back and forth multiple times, should we keep history of all notes, or just show current?

4. **Batch operations**: Should IT be able to approve all items at once, or require individual review?
