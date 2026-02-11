# Request Gateway API

**Status:** Future (V2.0+)
**Dependencies:** Shopping Cart (EXPLORE-FIRST.md Feature 5)

## Overview

The Request Gateway is a thin, stateless API layer that routes service requests from OpenDataPlanner to institutional ticketing systems. Rather than building deep integrations, it uses an adapter pattern to support multiple backends with minimal coupling.

```
┌─────────────────────────────────────────────────────────────────┐
│                     OpenDataPlanner UI                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Wizard     │  │  Shopping    │  │  Explore First       │  │
│  │   Journey    │  │  Cart        │  │  Quick Requests      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│         └─────────────────┼──────────────────────┘              │
│                           ▼                                     │
│                 ┌─────────────────┐                             │
│                 │  Request JSON   │  ← Canonical format         │
│                 └────────┬────────┘                             │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Request Gateway API                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     /api/v1/requests                        │ │
│  │                                                             │ │
│  │  • Validate request schema                                  │ │
│  │  • Enrich with metadata (timestamp, source, version)        │ │
│  │  • Route to configured adapter                              │ │
│  │  • Return tracking reference                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Adapter Layer                            │ │
│  │                                                             │ │
│  │  ┌─────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────┐  │ │
│  │  │  Jira   │  │ ServiceNow  │  │TeamDynamix  │  │ Email │  │ │
│  │  │ Adapter │  │   Adapter   │  │  Adapter    │  │Adapter│  │ │
│  │  └────┬────┘  └──────┬──────┘  └──────┬──────┘  └───┬───┘  │ │
│  │       │              │                │              │      │ │
│  └───────┼──────────────┼────────────────┼──────────────┼──────┘ │
└──────────┼──────────────┼────────────────┼──────────────┼────────┘
           │              │                │              │
           ▼              ▼                ▼              ▼
      ┌─────────┐   ┌───────────┐   ┌───────────┐   ┌─────────┐
      │  Jira   │   │ServiceNow │   │TeamDynamix│   │  SMTP   │
      │  Cloud  │   │  Instance │   │  Instance │   │ Server  │
      └─────────┘   └───────────┘   └───────────┘   └─────────┘
```

## Design Principles

### 1. Stateless Gateway

The gateway holds no state. All request data is:
- Passed through to the ticketing system
- Stored in the ticketing system
- Optionally logged for audit/debugging

This means:
- No database required for the gateway
- Horizontal scaling is trivial
- Recovery is automatic (restart and go)

### 2. Canonical Request Format

All requests use the same JSON schema regardless of destination:

```json
{
  "version": "1.0",
  "request_id": "uuid-v4",
  "submitted_at": "2025-01-15T10:30:00Z",
  "source": {
    "app": "opendataplanner",
    "version": "1.2.0",
    "session_id": "abc123"
  },
  "requester": {
    "name": "Jane Researcher",
    "email": "jane@university.edu",
    "department": "Biology",
    "role": "faculty"
  },
  "funding": {
    "type": "startup",
    "account": "ST-2024-1234",
    "approver": "dept-chair@university.edu"
  },
  "items": [
    {
      "service_id": "hpc-scratch",
      "category": "storage",
      "name": "HPC Scratch Storage",
      "quantity": 10,
      "unit": "TB",
      "duration": 12,
      "duration_unit": "months",
      "tier": "L1",
      "estimated_cost": 1200,
      "configuration": {
        "backup": false,
        "quota_alerts": true
      }
    }
  ],
  "context": {
    "project_name": "Genome Analysis Pipeline",
    "grant_number": null,
    "data_classification": "L1",
    "estimated_duration": "2 years",
    "notes": "Need storage for sequencing output"
  }
}
```

### 3. Adapter Responsibility

Each adapter:
- Transforms the canonical format to system-specific API calls
- Handles authentication to the target system
- Returns a tracking reference (ticket ID, case number, etc.)
- Reports errors in a standard format

Adapters do NOT:
- Validate the request (gateway does this)
- Store request data (target system does this)
- Handle retries (gateway does this)

## API Endpoints

### POST /api/v1/requests

Submit a new service request.

**Request:**
```http
POST /api/v1/requests
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "version": "1.0",
  "requester": { ... },
  "funding": { ... },
  "items": [ ... ],
  "context": { ... }
}
```

**Response (Success):**
```json
{
  "status": "submitted",
  "request_id": "uuid-from-request",
  "tracking": {
    "system": "servicenow",
    "reference": "REQ0012345",
    "url": "https://university.service-now.com/sp?id=ticket&number=REQ0012345"
  },
  "next_steps": [
    "You will receive email confirmation shortly",
    "Approval typically takes 1-2 business days",
    "Access will be provisioned after approval"
  ]
}
```

**Response (Validation Error):**
```json
{
  "status": "error",
  "code": "VALIDATION_FAILED",
  "errors": [
    {"field": "requester.email", "message": "Required field missing"},
    {"field": "items[0].quantity", "message": "Must be positive integer"}
  ]
}
```

### GET /api/v1/requests/{request_id}/status

Check status of a submitted request.

**Response:**
```json
{
  "request_id": "uuid",
  "status": "pending_approval",
  "tracking": {
    "system": "servicenow",
    "reference": "REQ0012345",
    "url": "https://..."
  },
  "timeline": [
    {"timestamp": "2025-01-15T10:30:00Z", "event": "submitted"},
    {"timestamp": "2025-01-15T10:31:00Z", "event": "routed_to_approver"}
  ]
}
```

### GET /api/v1/health

Health check for load balancers.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "adapters": {
    "servicenow": "connected",
    "email": "connected"
  }
}
```

## Adapter Specifications

### Jira Adapter

Maps requests to Jira Service Management (JSM) tickets.

**Configuration:**
```yaml
adapter: jira
jira:
  base_url: https://university.atlassian.net
  project_key: RCREQ
  auth:
    type: api_token
    email: ${JIRA_EMAIL}
    token: ${JIRA_API_TOKEN}

  # Field mappings
  mappings:
    summary: "{{context.project_name}}: {{items | summarize}}"
    description: "{{| request_template}}"
    issue_type: Service Request
    priority:
      default: Medium
      rules:
        - condition: "items.any(i => i.tier == 'L4')"
          value: High

    # Custom fields
    custom_fields:
      cf_10001: "{{requester.department}}"   # Department
      cf_10002: "{{funding.type}}"           # Funding Type
      cf_10003: "{{funding.account}}"        # Account Number
```

**Behavior:**
- Creates a single parent issue for the request
- Optionally creates sub-tasks for each item
- Attaches full request JSON as attachment
- Returns issue key (e.g., "RCREQ-123")

### ServiceNow Adapter

Maps requests to ServiceNow catalog items or incidents.

**Configuration:**
```yaml
adapter: servicenow
servicenow:
  instance: university
  auth:
    type: oauth
    client_id: ${SNOW_CLIENT_ID}
    client_secret: ${SNOW_CLIENT_SECRET}

  # Create as catalog request or incident
  request_type: catalog_item
  catalog_item_id: abc123def456

  # Field mappings (ServiceNow field names)
  mappings:
    short_description: "{{context.project_name}}"
    description: "{{| request_template}}"
    caller_id: "{{requester.email}}"  # Will lookup sys_id
    assignment_group: Research Computing
    u_funding_source: "{{funding.type}}"
    u_account_number: "{{funding.account}}"
```

**Behavior:**
- Creates catalog request with requested items
- Triggers configured workflows/approvals
- Returns request number (e.g., "REQ0012345")

### TeamDynamix Adapter

Maps requests to TeamDynamix tickets.

**Configuration:**
```yaml
adapter: teamdynamix
teamdynamix:
  base_url: https://university.teamdynamix.com
  app_id: 123
  auth:
    type: bearer
    token: ${TDX_API_TOKEN}

  # Ticket configuration
  type_id: 456          # Service Request type
  form_id: 789          # Custom form
  service_id: 101       # Research Computing service

  # Attribute mappings (TDX custom attribute IDs)
  attributes:
    12345: "{{requester.department}}"
    12346: "{{funding.type}}"
    12347: "{{context.data_classification}}"
```

**Behavior:**
- Creates ticket with custom form data
- Sets responsible group based on service
- Returns ticket ID

### Email Adapter (Fallback)

For institutions without API access or as a fallback.

**Configuration:**
```yaml
adapter: email
email:
  smtp:
    host: smtp.university.edu
    port: 587
    auth:
      user: ${SMTP_USER}
      pass: ${SMTP_PASS}

  # Email configuration
  from: no-reply@dataplanner.university.edu
  to:
    default: rc-requests@university.edu
    rules:
      - condition: "items.any(i => i.category == 'storage')"
        to: storage-team@university.edu
      - condition: "context.data_classification in ['L3', 'L4']"
        to: security-team@university.edu
        cc: rc-requests@university.edu

  subject: "[DataPlanner] {{context.project_name}}"
  template: request-email.hbs
```

**Behavior:**
- Sends formatted email with request details
- Attaches JSON file for import
- Returns message ID as tracking reference
- CC's requester for confirmation

## Gateway Configuration

The gateway itself is configured via environment or config file:

```yaml
# gateway.yaml
server:
  port: 8080
  cors:
    origins:
      - https://dataplanner.university.edu
      - http://localhost:4000

# Which adapter to use
adapter: servicenow

# Retry configuration
retry:
  max_attempts: 3
  backoff: exponential
  initial_delay: 1000
  max_delay: 30000

# Rate limiting
rate_limit:
  requests_per_minute: 60
  burst: 10

# Logging
logging:
  level: info
  format: json
  # Don't log PII
  redact:
    - requester.email
    - funding.account

# Webhook for status updates (optional)
webhook:
  enabled: true
  url: https://dataplanner.university.edu/api/status-update
  secret: ${WEBHOOK_SECRET}
```

## Status Synchronization

For real-time status updates, the gateway can receive webhooks from ticketing systems:

```
┌───────────────┐     Ticket Updated      ┌─────────────────┐
│  ServiceNow   │ ──────────────────────► │ Request Gateway │
│  (webhook)    │                          │ /api/v1/webhook │
└───────────────┘                          └────────┬────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                           │  WebSocket/SSE  │
                                           │  to UI clients  │
                                           └─────────────────┘
```

**Webhook payload (ServiceNow example):**
```json
{
  "event": "state_changed",
  "ticket": "REQ0012345",
  "old_state": "pending_approval",
  "new_state": "approved",
  "timestamp": "2025-01-15T14:30:00Z"
}
```

This enables the UI to show real-time status without polling.

## Security Considerations

### Authentication

The gateway should validate requests:

1. **Session tokens** - Validate against institution SSO
2. **CSRF protection** - Standard token validation
3. **Rate limiting** - Prevent abuse

### Data Handling

1. **No PII storage** - Gateway is stateless
2. **TLS everywhere** - All connections encrypted
3. **Audit logging** - Log request IDs, not content
4. **Secret management** - API keys in vault/env, never in config files

### Adapter Security

Each adapter handles its own auth:
- Jira: API tokens (scoped to project)
- ServiceNow: OAuth with limited scope
- TeamDynamix: Service account token
- Email: SMTP auth (ideally with dedicated send-only account)

## Implementation Phases

### Phase 1: Email Adapter (V2.0)

- Implement canonical request format
- Build email adapter with templates
- Basic validation
- Manual processing on receiving end

This provides immediate value with minimal infrastructure.

### Phase 2: Primary Ticketing Integration (V2.1)

- Implement adapter for institution's primary ticketing system
- Status tracking via polling
- Error handling and retries

### Phase 3: Webhooks and Real-time (V2.2)

- Webhook receiver for status updates
- WebSocket/SSE for UI updates
- Multi-adapter support (route different request types to different systems)

### Phase 4: Advanced Features (V3.0+)

- Request modification/cancellation
- Batch requests
- Approval workflow integration
- SLA tracking
- Analytics dashboard

## Alternative: Direct Integration

For simpler deployments, the UI can call ticketing APIs directly:

```
┌─────────────────┐                    ┌───────────────┐
│  OpenDataPlanner│ ──── Direct ────► │  ServiceNow   │
│       UI        │      API Call      │               │
└─────────────────┘                    └───────────────┘
```

**Pros:**
- No additional infrastructure
- Simpler deployment

**Cons:**
- API credentials in browser (even if proxied, CORS issues)
- Harder to switch ticketing systems
- No abstraction layer

The gateway approach is recommended for:
- Institutions with multiple ticketing systems
- Security-conscious environments
- Future flexibility

## OpenChargeback Integration

When integrated with OpenChargeback, the flow extends:

```
OpenDataPlanner                Request Gateway              OpenChargeback
      │                              │                            │
      │  Submit Request              │                            │
      ├─────────────────────────────►│                            │
      │                              │  Create Ticket             │
      │                              ├───────────────►            │
      │                              │                            │
      │                              │  Also: POST request JSON   │
      │                              ├────────────────────────────►
      │                              │                            │
      │   Tracking Reference         │                            │
      │◄─────────────────────────────┤                            │
      │                              │                            │
```

OpenChargeback receives the request JSON and can:
- Create a pending allocation
- Track estimated vs actual costs
- Associate with cost center for billing

This closes the loop from "planning" to "tracking."

## File Locations

```
src/
  api/
    gateway/
      index.js           # Express app
      routes.js          # API routes
      validation.js      # Request schema validation
      adapters/
        index.js         # Adapter factory
        jira.js          # Jira adapter
        servicenow.js    # ServiceNow adapter
        teamdynamix.js   # TeamDynamix adapter
        email.js         # Email fallback adapter
      templates/
        request-email.hbs  # Email template

config/
  gateway.yaml           # Gateway configuration
  adapters/
    jira.yaml            # Jira-specific config
    servicenow.yaml      # ServiceNow-specific config
```

## Summary

The Request Gateway provides a clean abstraction between the planning UI and institutional ticketing systems. By using a canonical request format and adapter pattern, institutions can:

1. Start with email (zero infrastructure)
2. Add ticketing integration when ready
3. Switch systems without changing the UI
4. Support multiple systems simultaneously

This follows the project's core philosophy: **tools integrate via well-defined formats, not tight coupling.**
