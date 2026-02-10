# Policy Concept Graph

A framework for codifying institutional knowledge about research computing governance — making implicit policies explicit, navigable, and shareable.

---

## Why This Exists

RCD (Research Computing & Data) staff spend significant time on recurring questions:

- "Why do we require X for this data type?"
- "What's our policy on Y?"
- "How do I explain Z to a researcher?"
- "Why can't I just give them admin access?"

The answers live in tribal knowledge — passed down through hallway conversations, institutional memory, and hard-won experience. When someone leaves, that knowledge goes with them. When someone new joins, they spend months absorbing it.

**The concept graph makes this knowledge:**

| Property | Benefit |
|----------|---------|
| **Explicit** | Written down, version-controlled, reviewable |
| **Navigable** | Follow connections to understand impact chains |
| **Shareable** | Same content for staff alignment and researcher transparency |
| **Transferable** | Onboarding becomes "explore the graph" |

---

## Two Audiences, One Source

The concept graph serves both internal and external purposes:

```
INTERNAL (RCD Staff)                    EXTERNAL (Researchers)
─────────────────────────────────────────────────────────────
"Why do we do it this way?"             "Here's how your project
                                         will be governed"

Policy advocacy to leadership
"We need Y to mature concept Z"         Set expectations upfront

Onboarding new team members             No surprises later
"Explore our principles"                "You acknowledged this"

Consistent decision-making              Trust and transparency
"This aligns with concept X"            "Same rules for everyone"
```

**The key insight:** The same concepts that help RCD staff make consistent decisions also help researchers understand what to expect. One source of truth, two audiences.

---

## Schema Overview

Each concept is a YAML file with this structure:

```yaml
schema_version: '0.2'
id: tiered_data_risk_model           # Machine-friendly identifier
name: Tiered Data Risk Model         # Human-readable name
summary: Classification of research data by sensitivity to drive proportional controls.
description: |
  Data are categorized into risk tiers that determine required safeguards,
  access controls, and hosting constraints.

tags:
  security: core                     # Domain relevance levels:
  governance: core                   # core | informed-by | tangential
  research-computing: core

assumptions:
  - institution_defines_data_sensitivity_levels

downstream_impacts:                  # Graph edges — what this affects
  - hosting_decisions
  - access_controls

anti_patterns:                       # What this concept prevents
  - one_size_fits_all_security

owners:
  - role: information_security       # Who's responsible

maturity:
  level: current                     # current | emerging | aspirational

notes:
  - Widely applicable across research institutions.
```

### Key Fields

| Field | Purpose | Example |
|-------|---------|---------|
| `id` | Stable identifier for linking | `project_lifecycle_governance` |
| `summary` | One-line explanation | "Explicit management of project creation, operation, and closure" |
| `tags` | Domain mapping with relevance | `security: core`, `billing: informed-by` |
| `assumptions` | When this concept applies | `projects_have_funding_or_sponsorship` |
| `downstream_impacts` | What changes if this changes | `resource_cleanup`, `cost_controls` |
| `anti_patterns` | Failure modes this prevents | `abandoned_projects` |
| `maturity` | Implementation status | `current`, `emerging`, `aspirational` |

---

## Starter Concepts

These concepts ship as starting points. Fork and customize for your institution:

| Concept | Summary | Anti-Pattern Prevented |
|---------|---------|------------------------|
| `tiered_data_risk_model` | Data classification drives proportional controls | One-size-fits-all security |
| `cost_transparency` | Visibility into consumption before surprises | Opaque billing |
| `project_lifecycle_governance` | Projects are created, reviewed, and retired | Abandoned projects |
| `least_privilege_by_persona` | Access based on role, not convenience | Blanket admin access |
| `just_in_time_access` | Temporary access with automatic expiration | Permanent privileged access |
| `support_tier_model` | Layered support (local → central → specialist) | Single team supports everything |
| `capability_maturity_model` | Assess and evolve institutional capability | Static capability assumptions |
| `knowledge_retention` | Documentation outlives individuals | Tribal knowledge |
| `platform_agnostic_design` | Avoid coupling to specific vendors | Vendor-specific governance |

---

## How Concepts Connect to Tools

The concept graph links directly to OpenResearchDataPlanner features:

```yaml
# config/concept-mappings.yaml
mappings:
  - feature: tier_selection_wizard
    implements: [tiered_data_risk_model]
    researcher_sees: |
      Your data classification (L1-L4) determines which services
      are available and what security controls apply.

  - feature: cost_estimate
    implements: [cost_transparency]
    researcher_sees: |
      You'll see estimated costs before committing, and receive
      monthly usage reports during your grant.

  - feature: retention_planning
    implements: [project_lifecycle_governance]
    researcher_sees: |
      We'll plan for data retention from the start, including
      what happens when your grant ends.

  - feature: dmp_generation
    implements: [knowledge_retention]
    researcher_sees: |
      Your Data Management Plan captures decisions so they're
      not lost when team members change.
```

This creates a clear chain: **Concept → Feature → Researcher Explanation**

---

## Integration Points

### In OpenResearchDataPlanner

**Results Page — Governance Principles Section:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Governance Principles                                          │
│                                                                 │
│  Your project will be governed by these institutional policies: │
│                                                                 │
│  ● Tiered Data Risk Model                                      │
│    Your L2 classification determines security controls.         │
│    → Learn more                                                 │
│                                                                 │
│  ● Project Lifecycle Governance                                 │
│    Projects are reviewed annually; data retained per policy.    │
│    → Learn more                                                 │
│                                                                 │
│  ● Cost Transparency                                            │
│    You'll receive monthly usage reports.                        │
│    → Learn more                                                 │
│                                                                 │
│  ☐ I acknowledge these governance principles                    │
└─────────────────────────────────────────────────────────────────┘
```

**Contextual Links:**

- Tier selection → links to `tiered_data_risk_model`
- Retention settings → links to `project_lifecycle_governance`
- Cost estimates → links to `cost_transparency`

### In Exported Plans

The JSON/PDF export includes acknowledged concepts:

```json
{
  "plan": { ... },
  "governance": {
    "acknowledged_at": "2024-01-15T10:30:00Z",
    "concepts": [
      {
        "id": "tiered_data_risk_model",
        "name": "Tiered Data Risk Model",
        "summary": "Classification of research data by sensitivity..."
      },
      ...
    ]
  }
}
```

### In OpenChargeback (V3)

Monthly billing statements can reference concepts:

> "This charge reflects the **Cost Transparency** principle: you can see exactly what resources were consumed."

---

## For RCD Staff

### Daily Use

When a researcher asks "why can't I just...?", you can point to a concept:

> "That would conflict with our **Least Privilege by Persona** principle. Here's the concept documentation explaining the reasoning and the risks we're avoiding."

### Policy Discussions

When advocating for resources or process changes:

> "We need to invest in tooling to mature **Just-in-Time Access** from 'emerging' to 'current'. Here are the anti-patterns we're currently exposed to."

### Onboarding

New team members can explore the graph:

1. Start with high-level concepts
2. Follow `downstream_impacts` to see connections
3. Review `anti_patterns` to understand what we're preventing
4. Check `maturity` to see where we're investing

### Maturity Assessment

Use the maturity levels to track progress:

| Level | Meaning | Action |
|-------|---------|--------|
| `current` | Fully implemented, documented, enforced | Maintain |
| `emerging` | Partially implemented, in progress | Invest |
| `aspirational` | Recognized need, not yet started | Plan |

---

## Visualization

The included `generate_markdown.py` script creates Obsidian-compatible markdown:

```bash
python generate_markdown.py concepts/ output_md/
```

This generates files with `[[wikilinks]]` for downstream impacts, enabling Obsidian's graph view to visualize concept relationships.

**Example graph visualization:**

```
                    ┌──────────────────────┐
                    │ tiered_data_risk_model│
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌────────────────┐ ┌────────────┐ ┌──────────────┐
     │hosting_decisions│ │access_controls│ │least_privilege│
     └────────────────┘ └────────────┘ └──────┬───────┘
                                              │
                                              ▼
                                       ┌────────────┐
                                       │auditability │
                                       └────────────┘
```

---

## Customization

### Adding a Concept

1. Create `config/concepts/your_concept.yaml`
2. Follow the schema structure
3. Link via `downstream_impacts`
4. Run validation: `npm run validate:config`

### Institution-Specific Concepts

Some concepts are universal (tiered data risk, cost transparency). Others are institution-specific:

```yaml
# Example: Institution-specific concept
id: grad_student_data_stewardship
name: Graduate Student Data Stewardship
summary: Graduate students have limited data retention obligations after graduation.
description: |
  When a graduate student completes their program, their research data
  must be transferred to their advisor or archived per institutional policy.

tags:
  governance: core
  research-computing: core

assumptions:
  - graduate_program_exists
  - data_transfer_process_defined

downstream_impacts:
  - project_lifecycle_governance
  - knowledge_retention

anti_patterns:
  - orphaned_graduate_data

owners:
  - role: graduate_school
  - role: research_computing

maturity:
  level: emerging
```

### Maturity Levels for Your Institution

Assess each concept for your institution:

```yaml
# Example institutional assessment
concepts:
  tiered_data_risk_model:
    maturity: current
    notes: "Implemented via L1-L4 classification, enforced in provisioning"

  just_in_time_access:
    maturity: emerging
    notes: "Piloting with CyberArk for L3/L4 environments"

  capability_maturity_model:
    maturity: aspirational
    notes: "Discussed but no formal framework yet"
```

---

## The Promise

When researchers see the governance concepts upfront:

| What They See | What It Means |
|---------------|---------------|
| "I acknowledge these principles" | No surprises later |
| Concepts linked to features | Understand the "why" |
| Same content as staff | Transparency builds trust |
| Exportable with their plan | Evidence of agreement |

When RCD staff use the concept graph:

| What They Do | What It Means |
|--------------|---------------|
| Point to concepts in conversations | Consistent explanations |
| Track maturity levels | Clear investment priorities |
| Share graph with new hires | Faster onboarding |
| Reference in policy discussions | Bridge tactics → strategy |

---

## The Goal

Every hour spent on "why do we do it this way?" conversations is an hour not spent on the interesting work. Every surprise policy conflict is trust eroded.

The concept graph exists so RCD staff can:

1. **Spend less time explaining** — point to the documentation
2. **Make consistent decisions** — aligned with documented principles
3. **Advocate effectively** — connect daily work to strategic priorities
4. **Onboard faster** — new staff explore, don't just shadow
5. **Focus on the cool tech** — not boilerplate wheel-spinning

And researchers can:

1. **Know what to expect** — governance is visible upfront
2. **Trust the process** — same rules for everyone
3. **Plan accordingly** — no mid-project surprises
4. **Move faster** — self-service with clear guardrails

---

## File Structure

```
config/
  concepts/                        # Concept YAML files
    schema.yaml                   # v0.2 schema definition
    tiered_data_risk_model.yaml
    cost_transparency.yaml
    project_lifecycle_governance.yaml
    least_privilege_by_persona.yaml
    just_in_time_access.yaml
    support_tier_model.yaml
    capability_maturity_model.yaml
    knowledge_retention.yaml
    platform_agnostic_design.yaml

  concept-mappings.yaml           # Links concepts → tool features

scripts/
  generate_markdown.py            # Obsidian export
```

---

## Related Documentation

- [CUSTOMIZE.md](CUSTOMIZE.md) — Configuration reference
- [ARCHITECTURE.md](ARCHITECTURE.md) — Technical overview
- [V2-PLANNING.md](V2-PLANNING.md) — Roadmap including concept graph integration
