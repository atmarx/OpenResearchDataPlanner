# IT Workbench Review Round 1

**Date:** 2026-02-11
**Artifact:** [docs/IT-WORKBENCH.md](../../../IT-WORKBENCH.md)

## Reviewers

| Persona | Role | Experience | Verdict |
|---------|------|------------|---------|
| [Marco Delavigne](marco-delavigne.md) | Senior Research Computing Specialist | 28 years | Needs work |
| [Piper Nakamoto](piper-nakamoto.md) | Research Computing Support Specialist | 1.5 years | Needs work |

## Key Themes

### Both agree on:
- **PDF export is required** — for escalations, grants offices, and confused faculty
- **Keep note history** — audit trail matters for disputes
- **Batch approve with guardrails** — L1/L2 can be bulk-approved, L3/L4 require individual review
- **Two-way notes system is valuable** — but only if researchers actually use it

### Marco's concerns (veteran perspective):
- JSON round-trip will generate support tickets (file management confusion)
- No integration with ServiceNow, SLURM, or existing systems
- Researchers won't write useful notes without prompts
- Need clipboard export for pasting into other systems
- Password gate needs at minimum name-on-login for audit

### Piper's concerns (first-line support perspective):
- No permission model — doesn't know what she's authorized to approve
- Calculator inputs require domain knowledge she doesn't have
- "Export/import JSON" language will confuse researchers
- Needs decision trees and training materials
- Error states not documented

## Suggested Improvements

### High Priority (both reviewers)
1. Add PDF export
2. Require notes with guiding prompts for L3/L4
3. Human-readable unique filenames
4. Keep note history with timestamps
5. Bulk approve for L1/L2 only

### Marco-specific
6. Clipboard export for ServiceNow
7. Name-on-login for audit trail
8. Request age tracking (2+ weeks unreviewed)
9. IT-to-IT internal notes field
10. Pricing verification from config (don't trust import)

### Piper-specific
11. Permission model by role and tier
12. Decision tree for status assignments
13. Training documentation with examples
14. Error state documentation
15. "Submit" language instead of "Export JSON"

## Open Questions — Resolved

| Question | Marco's Answer | Piper's Answer |
|----------|---------------|----------------|
| PDF generation? | Yes, required for escalations | Yes, professors love PDFs |
| Request ID format? | IT assigns (we have numbering scheme) | Auto-generate (prevent typos) |
| Keep note history? | Yes, need receipts for disputes | Yes, audit trail for compliance |
| Batch operations? | Yes, with L1/L2 restriction | Yes, with flag-based guardrails |
