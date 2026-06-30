# Support Workbench Specification

## Overview

The Support Workbench is a review interface for Research IT staff to process submitted service requests. It lives within the same app at `/workbench` with simple password protection.

**Design philosophy:** Keep it part of the main app during active development to reuse logic (stores, composables, components). Can be extracted later once patterns stabilize.

---

## Route Structure

```
/workbench              → Password gate (if not authenticated)
/workbench              → Dashboard (list of imported requests)
```

### Password Protection

Simple client-side gate. The password is a **build-time** environment
variable, `VITE_WORKBENCH_PASSWORD`, read by `src/stores/workbenchStore.js`.
When it isn't set, the store falls back to `support2024` — and it is currently
unset in the repo, so `support2024` is the effective password until you
override it.

```bash
# .env — consumed by the docker-compose build
VITE_WORKBENCH_PASSWORD=northwinds-it-2024
```

Because this is a Vite variable, the value is baked into the static bundle at
build time. Change it and rebuild the image; there is no runtime config to edit.

There is no session-expiry or re-auth logic. On a successful login the store
writes only `{ isAuthenticated, staffName }` to `sessionStorage` (no
timestamp), so a session lasts until the staff member logs out or the browser
tab/session ends.

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
         │                           │  Support Workbench   │
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
│                    🔐 Support Workbench                         │
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
│  Support Workbench                                            [ Log Out ]   │
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
  "schema_version": "1.2",
  "exported_at": "2024-01-15T14:30:00Z",
  "project_name": "Genomics of Treatment Resistance",
  "institution": "Northwinds University",
  "tier": "high",
  "tier_name": "High Risk (L3)",
  "final_notes": null,

  "contact": {
    "name": "Dr. Sarah Chen",
    "email": "schen@northwinds.edu",
    "department": "Genomics Lab"
  },

  "slate": {
    "status": "submitted",
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
    "software": ["..."],
    "projectName": "Genomics of Treatment Resistance",
    "finalNotes": null,
    "contact": {
      "name": "Dr. Sarah Chen",
      "email": "schen@northwinds.edu",
      "department": "Genomics Lab"
    }
  },

  "slate_version": 1,
  "slate_history": [
    {
      "version": 1,
      "timestamp": "2024-01-15T14:30:00Z",
      "actor": "researcher",
      "actor_name": "Dr. Sarah Chen",
      "change_note": "Initial submission",
      "items": ["uuid-1234"]
    }
  ],

  "totals": {
    "monthly": 1033.33,
    "annual": 12400,
    "fandaRate": 0.5,
    "fandaRateLabel": "50% MTDC",
    "fandaAnnual": 6200,
    "totalMonthlyWithFanda": 1550,
    "totalAnnualWithFanda": 18600
  }
}
```

This is the researcher-side export emitted by `exportJSON()` in
`src/composables/useExport.js`. A few things to keep straight:

- **Flat, snake_case top level.** The keys are `schema_version`,
  `exported_at`, `project_name`, `institution`, `tier`, `tier_name`,
  `final_notes`, `contact`, `slate`, `slate_version`, `slate_history`,
  `totals`.
- **Redundant nesting.** The `slate` sub-object is the raw slate-store object,
  so it repeats `projectName`/`finalNotes` (and `contact`) in camelCase
  alongside the snake_case top-level copies. `totals` (camelCase sub-keys, from
  `buildTotals`) lives at the top level, not under `slate`.
- **`slate_history`** entries use snake_case `actor_name`/`change_note`, and
  their `items` field holds item IDs, not full snapshots.
- **Casing is load-bearing.** The dashboard importer rejects any file missing
  both `schema_version` and `export_version` (`WorkbenchDashboard.vue`), and
  the workbench re-export (`workbenchStore.exportPlanJSON`) appends a
  `slate_history` entry with `actor: "support"` and adds `last_reviewed_at` /
  `last_reviewed_by` / `review_status` — all snake_case.

**Key changes from v1.1:**
- `schema_version` bumped to `1.2`
- Flat `project_name` replaces `request.id` — no auto-generated IDs (the
  workbench derives a local id by slugifying `project_name` + `exported_at`)
- Flat `tier` + `tier_name` carry the classification
- `slate_version` + `slate_history` for round-trip versioning (snake_case
  `actor_name`/`change_note` per entry)
- Planned for later phases, not yet emitted: a `device` block, `dmp`,
  `itReview` (including `approvalPdfGeneratedAt`), `grant_period`, and a nested
  `classification` block

---

## Implementation Plan

### Phase 1: Notes in Slate (Researcher Side)
1. Extend SlateItem schema with notes fields
2. Add notes textarea to SlateExpandedView item cards
3. Include notes in JSON export
4. Parse notes from JSON import
5. Add project name field to session/export

### Phase 2: Password Gate
1. Add workbench config to meta.yaml
2. Create WorkbenchAuth.vue component
3. Create workbenchStore for auth state
4. Add route guard for /workbench

### Phase 3: Import & Dashboard
1. Create WorkbenchDashboard.vue
2. Implement JSON import with schema validation
3. Store imported requests in workbenchStore (IndexedDB for persistence)
4. Display request cards with summary stats
5. Add plan switcher dropdown in header

### Phase 4: Review Interface
1. Create WorkbenchReview.vue
2. Display all slate items with researcher notes
3. Add IT notes textarea per item
4. Add status dropdown per item (pending/approved/approved-modified/needs-info/denied)
5. Implement save progress
6. Add version timeline viewer (read-only history)

### Phase 5: Round-Trip with Versioning
1. Create slate version on each export (increment slateVersion, append to slateHistory)
2. Export reviewed JSON from workbench
3. Import reviewed JSON in planner
4. Display IT notes and status to researcher
5. Allow researcher to respond/update (creates new version)
6. Show version history in planner UI

### Phase 6: Final Approval & PDF
1. Add "Approve All & Generate PDF" action when all items approved
2. Generate PDF receipt with:
   - Project name and timestamp
   - Contact info
   - All services with quantities, costs, and IT notes
   - Approval status and IT reviewer name
3. Track `approvalPdfGeneratedAt` in JSON
4. Lock further edits after PDF generation (or require new version)

---

## File Summary

### New Files
```
src/stores/workbenchStore.js              # Auth state, imported requests, active plan
src/composables/useSlateVersioning.js     # Version history management
src/components/workbench/WorkbenchAuth.vue
src/components/workbench/WorkbenchDashboard.vue
src/components/workbench/WorkbenchReview.vue
src/components/workbench/WorkbenchHeader.vue      # Plan switcher dropdown
src/components/workbench/RequestCard.vue
src/components/workbench/ServiceReviewCard.vue
src/components/workbench/VersionTimeline.vue      # Version history viewer
src/components/workbench/ApprovalPdfGenerator.vue # PDF generation
```

### Modified Files
```
config/meta.yaml                              # Add workbench config
src/stores/slateStore.js                      # Add notes fields to SlateItem
src/stores/sessionStore.js                    # Add project name field
src/components/slate/SlateExpandedView.vue    # Add notes UI for researcher
src/components/slate/SlateItemCard.vue        # Show IT status badges
src/router/index.js                           # Add /workbench routes
src/composables/useExportImport.js            # Handle versioned JSON format
```

---

## Resolved Design Decisions

### 1. PDF Generation
**Decision:** Yes, generate PDF — but only at final approval as the "IT-approved receipt."

- PDF indicates the document is locked/finalized
- Generated when IT marks the request as fully approved
- Serves as official record that can be attached to ticketing system
- Contains: project name, timestamp, all services with IT notes, approval status

### 2. Request Identification
**Decision:** No auto-generated IDs — use existing ticketing system.

For display/tracking, use:
- **Project name** (researcher provides this)
- **Timestamp** (when exported/imported)
- **Device label** (to be collected via the planned `draftsStore` sync metadata — V1.1/V1.2)

This avoids duplicating the ticketing system's ID scheme.

### 3. Multiple Reviews (Versioning)
**Decision:** Keep full history via slate versioning.

```javascript
// JSON structure with version history
{
  "version": "1.1",
  "slateVersion": 3,  // Current version number
  "slateHistory": [
    {
      "version": 1,
      "timestamp": "2024-01-15T14:30:00Z",
      "actor": "researcher",
      "actorName": "Dr. Sarah Chen",
      "items": [ ... snapshot of slate items ... ],
      "changeNote": "Initial submission"
    },
    {
      "version": 2,
      "timestamp": "2024-01-16T09:15:00Z",
      "actor": "it",
      "actorName": "J. Martinez",
      "items": [ ... ],
      "changeNote": "Adjusted storage estimate, requested clarification on compute needs"
    },
    {
      "version": 3,
      "timestamp": "2024-01-17T11:00:00Z",
      "actor": "researcher",
      "actorName": "Dr. Sarah Chen",
      "items": [ ... ],
      "changeNote": "Clarified compute requirements, accepted storage adjustment"
    }
  ],
  "slate": {
    "items": [ ... current items ... ]
  }
}
```

**UI implications:**
- Show version timeline in review interface
- Allow viewing any previous version (read-only)
- Diff view between versions (future enhancement)

### 4. Batch Operations
**Decision:** No batch approval across plans. Individual review required.

**However:** Add a plan switcher dropdown so IT can jump between loaded plans without returning to dashboard.

**Critical:** Ensure no data bleed between plans:
- Clear form state when switching
- Confirm unsaved changes before switching
- Visual indicator of which plan is active

---

## Plan Switcher UI

```
┌────────────────────────────────────────────────────────────────────────┐
│  ← Dashboard    │ Active: Dr. Chen - Genomics Study ▼ │    [ Log Out ] │
│                 └─────────────────────────────────────┘                │
│                   ┌─────────────────────────────────┐                  │
│                   │ ● Dr. Chen - Genomics Study     │ ← current        │
│                   │ ○ Prof. Miller - Physics Sim    │                  │
│                   │ ○ Dr. Patel - ML Training       │                  │
│                   │ ─────────────────────────────── │                  │
│                   │ + Import another plan...        │                  │
│                   └─────────────────────────────────┘                  │
├────────────────────────────────────────────────────────────────────────┤
│  ... review interface ...                                              │
```

**Safeguards:**
- Unsaved changes warning: "You have unsaved changes to Dr. Chen's plan. Save before switching?"
- Visual badge showing plan status (● reviewing, ✓ approved, ⚠ needs response)
- Active plan name always visible in header

---

## Version Timeline UI

```
┌────────────────────────────────────────────────────────────────────────┐
│  Version History                                          [Collapse ▲] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  v3 ● ─── Jan 17, 11:00am ─── Dr. Sarah Chen (Researcher)             │
│      │    "Clarified compute requirements, accepted storage adjustment"│
│      │    ← You are viewing this version                               │
│      │                                                                  │
│  v2 ○ ─── Jan 16, 9:15am ─── J. Martinez (IT)                         │
│      │    "Adjusted storage estimate, requested clarification"         │
│      │    [View this version]                                          │
│      │                                                                  │
│  v1 ○ ─── Jan 15, 2:30pm ─── Dr. Sarah Chen (Researcher)              │
│           "Initial submission"                                          │
│           [View this version]                                          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```
