# Post-Wizard Onboarding: What Happens Next

This document describes the user journey after completing the infrastructure planning wizard, including the handoff to service provisioning and ongoing support.

> **Status (Oct 2026):** Mostly not started. What exists is the wizard's
> Results step (`ResultsStep.vue`), which covers part of Steps 1–2: a cost
> summary tab with a Markdown budget download and a session JSON download, and a
> DMP tab with copy + Markdown download. The slate's "Export for Grant"
> (`ExportModal.vue`) adds a JSON/Markdown plan export. **Not built:** the
> "What's Next" page and service-specific next steps, `.docx`/`.xlsx` exports,
> emailing the plan to Research IT, the checklist email, progress tracking,
> `config/onboarding.yaml`, and ServiceNow integration. The only "next steps"
> text in the app is a fixed list on the IT-generated approval PDF
> (`usePdfExport.js`).

---

## The Problem

From UX feedback:

> "Okay, I have a PDF with cost estimates... now what? How do I actually get these services?"

> "Do I email someone? Fill out a form? Who do I talk to?"

The wizard produces a plan, but researchers need clear next steps to actually provision resources. Without guidance, they may:
1. Not know how to proceed
2. Email the wrong people
3. Miss required steps (training, approvals)
4. Wait too long and miss grant deadlines

---

## The Solution

A clear "What's Next" page after wizard completion that:
1. Summarizes what they've planned
2. Shows concrete next steps by service
3. Generates actionable outputs (DMP text, cost estimates, request forms)
4. Tracks progress through onboarding

---

## Completion Flow

### Step 1: Summary Review

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ Your Plan is Ready                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Project: Genomics Analysis Pipeline                            │
│  PI: Dr. Jane Smith                                             │
│  Duration: 3 years (Jan 2025 - Dec 2027)                       │
│  Data Tier: Medium                                              │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  Services Selected:                                             │
│                                                                 │
│  Compute                                                        │
│  ├── HPC Compute (CPU)      100,000 SU      $6,600/yr          │
│  └── HPC GPU                500 GPU-hr      $150/yr            │
│                                                                 │
│  Storage                                                        │
│  ├── HPC Storage (Isilon)   15 TB active    $720/yr            │
│  └── AWS Glacier            10 TB archive   $120/yr            │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  Estimated Annual Cost: $7,590                                  │
│  3-Year Total: $22,770                                          │
│                                                                 │
│  ⚠️ Departmental subsidy may reduce HPC costs by up to 50%     │
│                                                                 │
│                              [Edit Plan]  [Continue to Export →]│
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Export Options

```
┌─────────────────────────────────────────────────────────────────┐
│  Export Your Plan                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  What would you like to do with your plan?                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📄  Download DMP Section                                  │ │
│  │  Ready-to-paste text for your grant's Data Management Plan │ │
│  │                                                            │ │
│  │  [Download .docx]  [Download .md]  [Copy to clipboard]    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  💰  Download Budget Justification                         │ │
│  │  Cost breakdown suitable for grant budget narrative        │ │
│  │                                                            │ │
│  │  [Download .docx]  [Download .xlsx]                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📋  Download Full Plan (JSON)                             │ │
│  │  Machine-readable plan for import or archival              │ │
│  │                                                            │ │
│  │  [Download .json]                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📧  Email Plan to Research IT                             │ │
│  │  Send to our team to start the provisioning process       │ │
│  │                                                            │ │
│  │  [Send & Continue to Next Steps]                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                              [Skip Exports]  [What's Next →]   │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3: What's Next

```
┌─────────────────────────────────────────────────────────────────┐
│  What Happens Next                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Here's how to get your services up and running.               │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  1️⃣  HPC Access (Compute + Storage)                            │
│  ─────────────────────────────────────────────────────────────  │
│  Timeline: 1-3 business days                                    │
│                                                                 │
│  ☐ Request HPC account                                         │
│    [Request Account →]                                          │
│    You'll receive login credentials via email                   │
│                                                                 │
│  ☐ Complete SLURM training (recommended)                        │
│    [View Training Schedule →]                                   │
│    Self-paced or live sessions available                        │
│                                                                 │
│  ☐ Request storage allocation                                   │
│    Your 15 TB will be provisioned with your account             │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  2️⃣  AWS Glacier Archive                                        │
│  ─────────────────────────────────────────────────────────────  │
│  Timeline: 1-2 business days                                    │
│                                                                 │
│  ☐ Request cloud account                                        │
│    [Request AWS Access →]                                       │
│    Linked to your university identity                           │
│                                                                 │
│  ☐ Review billing setup                                         │
│    Charges will appear on your monthly statement                │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  📧 Questions?                                                  │
│  Your plan has been saved. Reference: #ODP-2024-0542           │
│                                                                 │
│  [Talk to Research IT]  [Save Checklist]  [Done]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Service-Specific Next Steps

Each service type has its own onboarding path:

### HPC Services

```yaml
hpc:
  timeline: "1-3 business days"
  steps:
    - action: "Request HPC account"
      url: "https://accounts.northwinds.edu/hpc"
      description: "You'll receive login credentials via email"
      required: true

    - action: "Complete SLURM training"
      url: "https://training.northwinds.edu/hpc-intro"
      description: "Self-paced or live sessions available"
      required: false
      recommended: true

    - action: "Join HPC mailing list"
      url: "https://lists.northwinds.edu/hpc-users"
      description: "Stay informed about maintenance, updates"
      required: false

  auto_provisions:
    - "Storage allocation (requested amount)"
    - "Home directory (50 GB)"
    - "Scratch access (100 TB shared)"
```

### Cloud Services (AWS/Azure)

```yaml
cloud:
  timeline: "1-2 business days"
  steps:
    - action: "Request cloud account"
      url: "https://cloud.northwinds.edu/request"
      description: "Linked to your university identity"
      required: true

    - action: "Complete cloud security training"
      url: "https://training.northwinds.edu/cloud-security"
      description: "Required for cloud resource access"
      required: true

    - action: "Review billing and cost management"
      url: "https://docs.northwinds.edu/cloud-billing"
      description: "Set up budget alerts"
      required: false
      recommended: true

  auto_provisions:
    - "Landing zone with security baseline"
    - "Budget alerts at 50%, 80%, 100%"
    - "Cost reports in portal"
```

### High-Tier Services

```yaml
high_tier:
  timeline: "5-10 business days"
  steps:
    - action: "Confirm compliance requirements"
      description: "Research IT will contact you to verify requirements"
      required: true

    - action: "Complete required training"
      conditional:
        hipaa: "HIPAA Privacy and Security training"
        ferpa: "FERPA training"
        cui: "CUI handling training"
        itar: "Export control briefing"
      required: true

    - action: "Sign data handling agreement"
      description: "Acknowledges responsibilities for protected data"
      required: true

    - action: "BAA verification"
      description: "Confirm BAA in place for selected services"
      conditional:
        hipaa: true
      required: true

    - action: "Schedule onboarding call"
      url: "https://calendly.com/northwinds-security/high-tier"
      description: "30-minute setup and orientation"
      required: true
```

### ACCESS Allocations

```yaml
access:
  timeline: "Varies by tier (1 day - 4 months)"
  steps:
    - action: "Create ACCESS account"
      url: "https://access-ci.org/register"
      description: "Use your institutional email"
      required: true

    - action: "Submit allocation request"
      url: "https://allocations.access-ci.org"
      description: "Use your plan's credit estimates"
      required: true
      note: "We can help review your request before submission"

    - action: "Add team members"
      description: "After approval, add students/collaborators"
      required: false

  allocation_guidance:
    explore:
      approval_time: "1-2 weeks"
      documentation: "Abstract + CV only"
    discover:
      approval_time: "2-4 weeks"
      documentation: "One-page description"
    accelerate:
      approval_time: "4-6 weeks"
      documentation: "Three-page proposal"
    maximize:
      approval_time: "3-4 months"
      documentation: "Full proposal with justification"
```

### VDI Services

```yaml
vdi:
  timeline: "1-2 business days"
  steps:
    - action: "Request VDI access"
      url: "https://servicenow.northwinds.edu/vdi"
      description: "Specify Windows or Linux, tier level"
      required: true

    - action: "Install Horizon client"
      url: "https://docs.northwinds.edu/vdi-client"
      description: "Or use web access (no install needed)"
      required: false

    - action: "Request additional software"
      url: "https://servicenow.northwinds.edu/software"
      description: "Beyond base image"
      required: false

  auto_provisions:
    - "VM with requested specs"
    - "VPN access (if needed)"
    - "Azure AD authentication"
```

---

## Checklist Email

After completion, send a summary email:

```
Subject: Your Research Infrastructure Plan - Next Steps

Dear Dr. Smith,

Thank you for using the Open Data Planner! Here's a summary of your
infrastructure plan and next steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT SUMMARY
───────────────
Project: Genomics Analysis Pipeline
Reference: #ODP-2024-0542
Data Tier: Medium
Duration: 3 years
Estimated Cost: $22,770 (3-year total)

SERVICES SELECTED
─────────────────
• HPC Compute (CPU) - 100,000 SU/year
• HPC GPU - 500 GPU-hours/year
• HPC Storage (Isilon) - 15 TB
• AWS Glacier - 10 TB archive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS
──────────

☐ HPC Account (1-3 days)
  Request at: https://accounts.northwinds.edu/hpc
  Training: https://training.northwinds.edu/hpc-intro

☐ AWS Access (1-2 days)
  Request at: https://cloud.northwinds.edu/request
  Billing info: https://docs.northwinds.edu/cloud-billing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ATTACHMENTS
───────────
• data-management-plan.docx - DMP section for your grant
• budget-justification.docx - Cost narrative
• infrastructure-plan.json - Machine-readable plan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTIONS?
──────────
Reply to this email or contact research-it@northwinds.edu
Phone: (555) 123-4567
Office hours: Mon-Fri 9am-5pm

We're here to help you succeed!

Best regards,
Research IT
Northwinds University
```

---

## Progress Tracking (Optional)

For users who create accounts, track onboarding progress:

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Onboarding Progress                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Plan: Genomics Analysis Pipeline (#ODP-2024-0542)             │
│  Created: January 15, 2024                                      │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  HPC Access                           ███████████░░░░ 75%       │
│  ├── ✅ Account requested             Jan 15                    │
│  ├── ✅ Account provisioned           Jan 16                    │
│  ├── ✅ Storage allocated             Jan 16                    │
│  └── ⏳ SLURM training               Not started               │
│                                                                 │
│  AWS Access                           ██████░░░░░░░░░ 40%       │
│  ├── ✅ Account requested             Jan 15                    │
│  ├── ⏳ Security training            In progress               │
│  └── ☐ Billing setup                 Not started               │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  Overall Progress: ████████░░░░░░░░░░░░ 58%                     │
│                                                                 │
│  Estimated ready date: January 22, 2024                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## DMP Text Generation

Generate grant-ready Data Management Plan text:

```markdown
## Data Storage and Preservation

Research data for this project will be stored using Northwinds University's
research computing infrastructure. Active data (approximately 15 TB) will be
stored on the high-performance Isilon storage system, which provides:

- Direct access from HPC compute nodes for analysis workflows
- Daily snapshots with 30-day retention for data recovery
- SFTP access for data transfer from campus locations

Long-term archival storage (approximately 10 TB) will utilize AWS Glacier
Deep Archive, providing:

- Highly durable storage (99.999999999% durability)
- Cost-effective retention for grant compliance periods
- Geographic redundancy across multiple data centers

## Computational Resources

Analysis will be performed using the Northwinds HPC cluster, providing:

- 100,000 Service Units annually of CPU compute time
- 500 GPU-hours annually on NVIDIA V100 accelerators
- Job scheduling via SLURM workload manager
- Access to standard bioinformatics software modules

## Data Security

All data is classified as Medium tier (internal/pre-publication) and will
be handled according to Northwinds University's Research Data Policy.
Security controls include:

- Access restricted to project team members via Unix group permissions
- Data transmitted via encrypted protocols (SSH, SFTP)
- Regular security patching of compute and storage systems

## Budget Justification

| Resource | Quantity | Annual Cost | 3-Year Total |
|----------|----------|-------------|--------------|
| HPC Compute (CPU) | 100,000 SU | $6,600 | $19,800 |
| HPC GPU | 500 GPU-hr | $150 | $450 |
| HPC Storage | 15 TB | $720 | $2,160 |
| AWS Glacier | 10 TB | $120 | $360 |
| **Total** | | **$7,590** | **$22,770** |

Note: Departmental subsidies may reduce HPC costs by up to 50% for
qualifying projects. Actual costs will be confirmed during onboarding.
```

---

## Config Schema

```yaml
# config/onboarding.yaml

onboarding:
  # Enable progress tracking
  track_progress: true

  # Email settings
  send_summary_email: true
  cc_research_it: true
  from_address: "data-planner@northwinds.edu"

  # Export options
  exports:
    dmp:
      enabled: true
      formats: ["docx", "md", "txt"]
    budget:
      enabled: true
      formats: ["docx", "xlsx", "csv"]
    plan:
      enabled: true
      formats: ["json", "yaml"]

  # Service-specific onboarding
  services:
    hpc:
      account_request_url: "https://accounts.northwinds.edu/hpc"
      training_url: "https://training.northwinds.edu/hpc-intro"
      timeline_days: 3
      auto_provisions:
        - "Storage allocation"
        - "Home directory"
        - "Scratch access"

    cloud:
      account_request_url: "https://cloud.northwinds.edu/request"
      training_url: "https://training.northwinds.edu/cloud-security"
      timeline_days: 2
      training_required: true

    vdi:
      account_request_url: "https://servicenow.northwinds.edu/vdi"
      client_url: "https://docs.northwinds.edu/vdi-client"
      timeline_days: 2

    access:
      register_url: "https://access-ci.org/register"
      allocations_url: "https://allocations.access-ci.org"
      support_email: "access-help@northwinds.edu"

  # High-tier additional requirements
  high_tier:
    timeline_days: 10
    consultation_required: true
    consultation_url: "https://calendly.com/northwinds-security/high-tier"
    training:
      hipaa: "https://training.northwinds.edu/hipaa"
      ferpa: "https://training.northwinds.edu/ferpa"
      cui: "https://training.northwinds.edu/cui"
      itar: "https://training.northwinds.edu/export-control"
```

---

## Integration Points

### Save Plan for Later

Allow users to save and return:

```typescript
interface SavedPlan {
  id: string  // Reference number
  createdAt: string
  updatedAt: string
  status: 'draft' | 'complete' | 'submitted' | 'provisioning' | 'active'

  projectDetails: ProjectDetails
  tierSelection: TierSelection
  services: SelectedService[]
  estimates: CostEstimates

  onboarding: {
    stepsCompleted: string[]
    stepsRemaining: string[]
    estimatedReadyDate: string
  }
}
```

### ServiceNow Integration (Optional)

Auto-create tickets for provisioning:

```typescript
async function submitToServiceNow(plan: SavedPlan) {
  const tickets = plan.services.map(service => ({
    category: service.category,
    service: service.slug,
    quantity: service.quantity,
    requestor: plan.projectDetails.piEmail,
    reference: plan.id,
    priority: plan.tierSelection.tier === 'high' ? 'high' : 'normal'
  }))

  await serviceNowApi.createTickets(tickets)
}
```

---

## References

- [TALK-TO-HUMAN.md](./TALK-TO-HUMAN.md) - Help request flow
- [ELI5.md](./ELI5.md) - Resource estimation
- [TIER-QUESTIONNAIRE.md](./TIER-QUESTIONNAIRE.md) - Tier selection
