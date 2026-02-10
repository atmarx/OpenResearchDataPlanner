# V2 Planning: Architectural Evolution

This document captures ideas that require significant architectural changes beyond the current SPA model. These are "someday" features that should inform V1 decisions but won't be implemented until a major version bump.

---

## V1 vs V2 Boundary

**V1 (Current SPA):**
- Client-side only
- LocalStorage for temporary persistence
- JSON export/import for sharing
- Manual email integration
- Single session at a time

**V2 (Backend Required):**
- Server-side state persistence
- Shareable URLs with encoded state
- Multiple saved plans per user
- Direct helpdesk integrations
- Collaborative editing (stretch)

---

## Feature: Shareable Plan Links

### The Ask

> "Marco, can you look at this before I submit?"

PIs want to share work-in-progress plans with Research IT for review before finalizing.

### Proposed Solution

Generate shareable URLs that encode or reference plan state:

```
https://planner.northwinds.edu/plan/abc123
https://planner.northwinds.edu/resume?state=eyJwcm9qZWN0Ijp7...
```

### Technical Options

#### Option A: URL-Encoded State (No Backend)

Encode entire state in URL:

```typescript
// Encode
const state = JSON.stringify(wizardState)
const compressed = pako.deflate(state)
const encoded = base64url.encode(compressed)
const url = `${baseUrl}/resume?state=${encoded}`

// Decode
const decoded = base64url.decode(params.state)
const decompressed = pako.inflate(decoded, { to: 'string' })
const state = JSON.parse(decompressed)
```

**Pros:**
- No backend required
- Works offline
- Simple implementation

**Cons:**
- URL length limits (~2000 chars safe, ~8000 max)
- Can't update after sharing
- No access control
- State visible in URL (privacy concern)

#### Option B: Short Code with Backend Storage

Store state server-side, return short code:

```typescript
// Create
const plan = await api.post('/plans', { state: wizardState })
// Returns: { id: "abc123", url: "https://planner.../plan/abc123" }

// Retrieve
const plan = await api.get(`/plans/${id}`)
```

**Pros:**
- Clean URLs
- Updateable after sharing
- Access control possible
- No size limits

**Cons:**
- Requires backend
- State management complexity
- Data retention policies needed

#### Option C: Hybrid (Recommended for V2)

Short-term sharing via URL encoding, long-term via backend:

```typescript
// Quick share (no account needed) - URL encoded, 7-day expiry
const quickShareUrl = encodeStateToUrl(state)

// Saved plan (account required) - backend stored, permanent
const savedPlan = await api.post('/plans', { state })
```

### Backend Requirements

If we go with Option B or C:

```yaml
# Minimum viable backend

endpoints:
  POST /plans              # Create new plan
  GET /plans/:id           # Retrieve plan
  PUT /plans/:id           # Update plan
  DELETE /plans/:id        # Delete plan
  GET /plans               # List user's plans (if authenticated)

storage:
  - Plan state (JSON blob)
  - Created/updated timestamps
  - Owner (if authenticated)
  - Share settings (public, link-only, private)
  - Expiry (for unauthenticated shares)

auth:
  - Optional for creating plans
  - Required for listing/updating/deleting
  - SSO integration (SAML, OAuth)
```

### Data Model

```typescript
interface StoredPlan {
  id: string              // Short code (abc123)
  state: WizardState      // Full wizard state

  // Metadata
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date        // For temporary shares

  // Ownership
  ownerId?: string        // If authenticated
  ownerEmail?: string     // For anonymous shares

  // Sharing
  visibility: 'private' | 'link' | 'public'
  shareToken?: string     // For link-only access

  // Tracking
  viewCount: number
  lastViewedAt?: Date
}
```

---

## Feature: Multiple Saved Plans

### The Ask

Start a new plan without losing the previous one. Compare different scenarios.

### Use Cases

1. **Scenario comparison:** "What if I use cloud vs HPC?"
2. **Grant versions:** "NSF version vs NIH version"
3. **Team plans:** "My project vs student's project"
4. **Drafts:** "Work on this later"

### UI Concept

```
┌─────────────────────────────────────────────────────────────────┐
│  My Plans                                            [+ New]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Genomics Pipeline (NSF)                          Draft    │ │
│  │ Last edited: 2 hours ago                                  │ │
│  │ Est. cost: $22,770                                        │ │
│  │                                   [Continue] [Share] [⋮]  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ML Training Cluster                           Submitted   │ │
│  │ Submitted: Jan 10, 2024                                   │ │
│  │ Est. cost: $45,000                                        │ │
│  │                                     [View] [Clone] [⋮]    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Student Project Template                       Template   │ │
│  │ Created: Dec 5, 2023                                      │ │
│  │ Est. cost: $1,200                                         │ │
│  │                                [Use Template] [Share] [⋮] │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Clone:** Duplicate a plan as starting point
- **Templates:** Save as reusable template
- **Compare:** Side-by-side cost comparison
- **Archive:** Hide completed plans
- **Export all:** Bulk export for backup

---

## Feature: Helpdesk Integrations

### The Ask

When users submit plans or request help, automatically create tickets in helpdesk systems.

### Supported Systems

| System | Integration Method | Notes |
|--------|-------------------|-------|
| ServiceNow | REST API, Webhooks | Most enterprise |
| TeamDynamix | REST API | Common in higher ed |
| FreshDesk | REST API, Webhooks | Simpler API |
| Jira Service Management | REST API | Atlassian ecosystem |
| Zendesk | REST API | Popular SaaS |

### Integration Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Planner   │────>│   Backend   │────>│  Helpdesk   │
│    (SPA)    │     │   (API)     │     │   (Webhook) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │ Config
                           ▼
                    ┌─────────────┐
                    │  Adapters   │
                    │ ─────────── │
                    │ ServiceNow  │
                    │ TeamDynamix │
                    │ FreshDesk   │
                    │ ...         │
                    └─────────────┘
```

### Webhook Payload

Standardized payload that adapters transform:

```typescript
interface HelpdeskPayload {
  // Ticket basics
  type: 'service_request' | 'help_request' | 'consultation'
  priority: 'low' | 'normal' | 'high' | 'urgent'

  // Requestor
  requestor: {
    name: string
    email: string
    department?: string
    phone?: string
  }

  // Context
  planReference: string
  planUrl: string

  // Content
  subject: string
  description: string

  // Attachments
  attachments: {
    name: string
    type: 'application/json' | 'application/pdf' | 'text/markdown'
    content: string  // Base64 encoded
  }[]

  // Service-specific
  services: {
    slug: string
    name: string
    category: string
    quantity: number
    estimatedCost: number
  }[]

  // Metadata
  source: 'open-data-planner'
  version: string
  timestamp: string
}
```

### Adapter Interface

```typescript
interface HelpdeskAdapter {
  name: string
  validateConfig(config: AdapterConfig): boolean

  // Create ticket
  createTicket(payload: HelpdeskPayload): Promise<TicketResult>

  // Update ticket (if supported)
  updateTicket?(ticketId: string, payload: Partial<HelpdeskPayload>): Promise<void>

  // Get ticket status (if supported)
  getTicketStatus?(ticketId: string): Promise<TicketStatus>
}

// ServiceNow adapter example
class ServiceNowAdapter implements HelpdeskAdapter {
  name = 'servicenow'

  async createTicket(payload: HelpdeskPayload) {
    const snPayload = this.transformPayload(payload)
    const response = await this.api.post('/api/now/table/sc_request', snPayload)
    return { ticketId: response.sys_id, ticketUrl: response.url }
  }

  private transformPayload(payload: HelpdeskPayload) {
    return {
      short_description: payload.subject,
      description: payload.description,
      caller_id: payload.requestor.email,
      category: this.mapCategory(payload.type),
      priority: this.mapPriority(payload.priority),
      // ...
    }
  }
}
```

### Config Schema

```yaml
# config/integrations.yaml

helpdesk:
  enabled: true
  provider: "servicenow"  # or teamdynamix, freshdesk, etc.

  # Provider-specific config
  servicenow:
    instance: "northwinds.service-now.com"
    api_user: "${SERVICENOW_USER}"
    api_password: "${SERVICENOW_PASS}"

    # Field mappings
    mappings:
      category:
        service_request: "Research Computing"
        help_request: "Research Computing > Consultation"
        consultation: "Research Computing > Consultation"

      assignment_group:
        default: "Research IT"
        high_tier: "Security Team"

      catalog_item:
        hpc: "HPC Account Request"
        cloud: "Cloud Account Request"
        vdi: "VDI Request"

  teamdynamix:
    base_url: "https://northwinds.teamdynamix.com"
    api_key: "${TDX_API_KEY}"
    app_id: 123
    # ...

  freshdesk:
    domain: "northwinds.freshdesk.com"
    api_key: "${FRESHDESK_API_KEY}"
    # ...
```

---

## Feature: Real-Time Collaboration (Stretch)

### The Dream

Multiple people editing the same plan simultaneously, like Google Docs.

### Use Cases

- PI and grad student planning together
- Research IT helping a user in real-time
- Department reviewing multiple proposals

### Technical Approach

**Operational Transformation (OT) or CRDTs:**

```typescript
// Using Yjs for CRDT-based collaboration
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider(
  'wss://planner.northwinds.edu/collab',
  planId,
  ydoc
)

// Shared state
const ystate = ydoc.getMap('wizard-state')

// Local changes automatically sync
ystate.set('storage', { amount: 15, unit: 'TB' })
```

**This is complex.** Probably V3 at earliest.

---

## V2 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (SPA)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Wizard  │  │  Plans   │  │  Share   │  │  Export  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │ API
┌──────────────────────────────┼──────────────────────────────────┐
│                         Backend (API)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Plans   │  │  Auth    │  │ Helpdesk │  │  Export  │       │
│  │  CRUD    │  │  SSO     │  │ Adapters │  │ Generate │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │ Database │        │  SSO/    │        │ Helpdesk │
    │ (Plans)  │        │  SAML    │        │   APIs   │
    └──────────┘        └──────────┘        └──────────┘
```

### Technology Choices

| Component | V1 (Current) | V2 Options |
|-----------|--------------|------------|
| Frontend | Vue 3 SPA | Vue 3 SPA (same) |
| State | LocalStorage | Backend + LocalStorage cache |
| Backend | None | Node/Express, Python/FastAPI, Go |
| Database | None | PostgreSQL, SQLite, DynamoDB |
| Auth | None | SAML/OAuth via university SSO |
| Hosting | Static (S3/CDN) | Container (ECS, K8s, App Service) |

### Migration Path

1. **V1.x:** Add optional backend endpoints, keep SPA working standalone
2. **V2.0:** Backend required for new features, legacy mode for static deploy
3. **V2.x:** Full backend features, deprecate standalone mode

---

## Database Schema (V2)

```sql
-- Plans table
CREATE TABLE plans (
  id TEXT PRIMARY KEY,  -- Short code
  state JSONB NOT NULL,

  -- Ownership
  owner_id TEXT REFERENCES users(id),
  owner_email TEXT,  -- For anonymous plans

  -- Sharing
  visibility TEXT DEFAULT 'private',  -- private, link, public
  share_token TEXT UNIQUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,  -- NULL = never expires

  -- Tracking
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ
);

-- Users table (linked to SSO)
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- From SSO
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  department TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Helpdesk tickets (for tracking)
CREATE TABLE helpdesk_tickets (
  id SERIAL PRIMARY KEY,
  plan_id TEXT REFERENCES plans(id),

  provider TEXT NOT NULL,  -- servicenow, teamdynamix, etc.
  external_id TEXT NOT NULL,
  external_url TEXT,

  status TEXT,  -- open, in_progress, resolved, closed

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_plans_owner ON plans(owner_id);
CREATE INDEX idx_plans_share_token ON plans(share_token);
CREATE INDEX idx_tickets_plan ON helpdesk_tickets(plan_id);
```

---

## V1 Decisions That Affect V2

When building V1, keep these V2 features in mind:

### State Structure

Design state to be serializable and versionable:

```typescript
interface WizardState {
  version: string  // For migration
  // ... rest of state
}
```

### API Readiness

Even in V1 SPA-only mode, structure code as if there were an API:

```typescript
// Good: Service abstraction
class PlanService {
  async save(plan: Plan): Promise<void> {
    // V1: LocalStorage
    localStorage.setItem(`plan:${plan.id}`, JSON.stringify(plan))

    // V2: Add API call
    // await api.put(`/plans/${plan.id}`, plan)
  }
}

// Bad: Direct storage access everywhere
localStorage.setItem('plan', JSON.stringify(state))
```

### Export Format

Use a format that's also suitable for API responses:

```typescript
interface ExportedPlan {
  meta: {
    version: string
    exportedAt: string
    source: 'open-data-planner'
  }
  plan: WizardState
}
```

---

## Priority Order

| Version | Focus | Key Deliverables |
|---------|-------|------------------|
| V1.0 | Core wizard | Config-driven SPA, DMP generation |
| V1.1 | Multi-session | `draftsStore` abstraction, named drafts |
| V1.2 | Folder sync | Sync to any folder, conflict detection |
| V1.3 | Concept graph | Governance principles, researcher acknowledgment |
| V2.0 | Backend API | Plan storage, SSO, shareable links |
| V2.x | Helpdesk | ServiceNow/TeamDynamix integration |
| V3.0 | **OpenChargeback** | Estimate → actual tracking |

---

## V3: OpenChargeback Integration

### The Vision

OpenResearchDataPlanner and OpenChargeback are sister projects that complete the research computing lifecycle:

```
PRE-GRANT                                    DURING-GRANT
┌─────────────────┐    Approved Draft       ┌─────────────────┐
│ OpenResearchDataPlanner │ ──── (JSON file) ────►  │ OpenChargeback  │
│                 │                          │                 │
│ • Estimate costs│                          │ • Track actual  │
│ • Select tiers  │                          │ • Bill/chargeback│
│ • Generate DMP  │                          │ • PDF statements│
└─────────────────┘                          └────────┬────────┘
                                                      │
                                               FOCUS CSV / GL
                                                      │
                                                      ▼
                                                   Banner
                                            (via journal import)
```

**Design principle:** Tools integrate via well-defined file formats (JSON, CSV, FOCUS), not tight API coupling. Each tool is independently useful. This is the Unix philosophy for research computing admin tools.

### Integration Points

#### 1. Shared Service Catalog

OpenChargeback could import service definitions from OpenResearchDataPlanner's config:

```yaml
# OpenChargeback config
import_services_from: "/path/to/OpenResearchDataPlanner/config/services.yaml"
```

Or both tools could share a common config repository.

#### 2. Estimate → Project Creation

When a draft is approved, it creates an OpenChargeback project:

```typescript
// Draft JSON includes everything needed
{
  "name": "NIH R01 Genomics",
  "tier": "L2",
  "grantPeriod": { "start": "2025-09-01", "end": "2028-08-31" },
  "services": [
    { "slug": "hpc-standard", "estimate": { "amount": 50000, "unit": "SU" } },
    { "slug": "research-storage", "estimate": { "amount": 5, "unit": "TB" } }
  ],
  "estimatedTotal": 4200,  // Annual
  "sync": { /* version, device, timestamp */ }
}
```

OpenChargeback reads this and creates a project with the estimated budget as baseline.

#### 3. Estimate vs Actual Dashboard

OpenChargeback shows variance:

```
┌─────────────────────────────────────────────────────────────────┐
│  NIH R01 Genomics                                               │
│                                                                  │
│  Budget Tracking (Year 1)                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  Estimated:  $4,200                                       │ │
│  │  Actual:     $3,847                                       │ │
│  │  Variance:   -$353 (8% under budget) ✓                   │ │
│  │                                                            │ │
│  │  ████████████████████████░░░░░░░░  92%                   │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  By Service:                                                    │
│  ┌──────────────┬──────────────┬──────────────┬─────────────┐ │
│  │ Service      │ Estimated    │ Actual       │ Variance    │ │
│  ├──────────────┼──────────────┼──────────────┼─────────────┤ │
│  │ HPC Compute  │ $2,500       │ $2,120       │ -15%        │ │
│  │ Storage      │ $1,200       │ $1,440       │ +20%        │ │
│  │ Archive      │ $500         │ $287         │ -43%        │ │
│  └──────────────┴──────────────┴──────────────┴─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 4. File-Based Handoff

The simplest integration: shared folder.

```
/shared/research-computing/
├── drafts/                    # OpenResearchDataPlanner writes here
│   ├── pending/               # Awaiting IT review
│   │   └── nih-r01-genomics.json
│   └── approved/              # IT moved after review
│       └── nsf-career-ml.json
│
└── projects/                  # OpenChargeback reads from here
    └── nsf-career-ml/
        ├── project.json       # Created from approved draft
        └── statements/
            └── 2025-01.pdf
```

IT staff:
1. See new draft appear in `pending/`
2. Review in OpenResearchDataPlanner or directly
3. Move to `approved/`
4. OpenChargeback watches and creates project

### Why V3?

Both tools need to be stable independently before integration:

- V1.x: OpenResearchDataPlanner core wizard + drafts
- V2.x: OpenResearchDataPlanner backend (optional)
- Parallel: OpenChargeback continues independent development
- V3: Integration once both are mature

### Preparing Now (V1.x)

To make V3 integration smooth, V1.x should:

1. **Stable service slugs** — Service identifiers that OpenChargeback can reference
2. **Clean JSON schema** — Documented, versioned export format
3. **FOCUS-compatible fields** — Estimates that map to billing categories
4. **Sync metadata** — Version, device, timestamp for conflict detection

See [MULTI-SESSION.md](./MULTI-SESSION.md) for draft format details.

### Sister Project

OpenChargeback: `/home/xram/Code/focus-billing/`

- Python CLI + Flask web UI
- FOCUS format for portable billing data
- PDF statement generation
- GL journal export
- SQLite, no external services

---

## V1.3: Policy Concept Graph

### The Vision

RCD staff hold institutional knowledge about governance in their heads. When they leave, it goes with them. When researchers ask "why?", explanations are inconsistent. When advocating for resources, it's hard to connect daily work to strategy.

The **policy concept graph** codifies this knowledge:

```yaml
# config/concepts/tiered_data_risk_model.yaml
id: tiered_data_risk_model
name: Tiered Data Risk Model
summary: Data classification drives proportional controls.
anti_patterns:
  - one_size_fits_all_security
downstream_impacts:
  - hosting_decisions
  - access_controls
maturity:
  level: current
```

### Two Audiences, One Source

| For RCD Staff | For Researchers |
|---------------|-----------------|
| "Why do we do it this way?" | "Here's how your project will be governed" |
| Consistent decision-making | No surprises later |
| Onboarding: "Explore the graph" | Acknowledgment: "I understand these principles" |
| Advocacy: "Mature concept X" | Trust: Same rules for everyone |

### Integration with OpenResearchDataPlanner

**Results page shows relevant concepts:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Governance Principles                                          │
│                                                                 │
│  ● Tiered Data Risk Model                                      │
│    Your L2 classification determines security controls.         │
│                                                                 │
│  ● Project Lifecycle Governance                                 │
│    Projects are reviewed annually; data retained per policy.    │
│                                                                 │
│  ☐ I acknowledge these governance principles                    │
└─────────────────────────────────────────────────────────────────┘
```

**Export includes acknowledged concepts:**

```json
{
  "plan": { ... },
  "governance": {
    "acknowledged_at": "2024-01-15T10:30:00Z",
    "concepts": ["tiered_data_risk_model", "project_lifecycle_governance"]
  }
}
```

### File Structure

```
config/
  concepts/                        # Policy concept YAML files
    schema.yaml                   # v0.2 schema definition
    tiered_data_risk_model.yaml
    cost_transparency.yaml
    project_lifecycle_governance.yaml
    ...
  concept-mappings.yaml           # Links concepts → tool features
```

### Why V1.3?

This is config-only (no backend needed) and builds on V1.1/V1.2:

- V1.1 gives us draftsStore for export format
- V1.2 gives us sync metadata
- V1.3 adds governance concepts to the export

See [CONCEPT-GRAPH.md](./CONCEPT-GRAPH.md) for full design.

---

## Questions for V2 Planning

Before starting V2 development:

1. **Hosting:** Do we have container/VM hosting available? Or must stay serverless?
2. **SSO:** What's our university SSO situation? SAML? OAuth? CAS?
3. **Database:** Managed PostgreSQL available? Or bring our own?
4. **Helpdesk:** Which system is primary? ServiceNow? TeamDynamix?
5. **Timeline:** When would V2 be needed? Next grant cycle? Next year?
6. **Resources:** Who maintains the backend? Same team or different?

---

## References

- [TALK-TO-HUMAN.md](./TALK-TO-HUMAN.md) - Current help flow (V1)
- [POST-WIZARD-ONBOARDING.md](./POST-WIZARD-ONBOARDING.md) - Current next steps (V1)
- [ELI5-IMPLEMENTATION.md](./ELI5-IMPLEMENTATION.md) - Current SPA architecture
