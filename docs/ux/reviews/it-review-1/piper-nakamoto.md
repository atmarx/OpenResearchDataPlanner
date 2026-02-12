# IT Workbench Review: Piper Nakamoto

**Reviewer:** Piper Nakamoto, Research Computing Support Specialist
**Experience:** 1.5 years at institution
**Date:** 2026-02-11
**Artifact reviewed:** docs/IT-WORKBENCH.md

---

## 1. Can I actually use this?

Honestly? **Mostly yes, but I have concerns.**

The UI mockups are clear enough that I could figure out the basic flow: import JSON, review items, set statuses, add notes, export. That part makes sense.

What worries me:

- **The status options are intimidating.** I see `approved`, `approved-modified`, `needs-info`, `denied`. For L1/L2 stuff, sure, I could probably approve those. But L3? Anything with `hipaa` flags? I don't feel comfortable clicking "approved" on that. The spec doesn't tell me which statuses *I* can use versus which ones are Marco-level decisions.

- **The JSON schema is detailed.** I can read it, but if something goes wrong — if a professor exports a file and it doesn't import right — I'm not going to be able to debug that JSON by hand. The spec assumes a technical comfort level I don't quite have yet.

- **No error states shown.** What happens if I import a malformed file? What if the version number doesn't match? The mockups show the happy path. I need to know what to say when things break.

---

## 2. Will this help me help researchers?

**Yes, actually.** This is the part that excites me.

Right now when a faculty member calls confused about their request status, I have to dig through emails or ask Marco. With this:

- I can see their request summary at a glance
- I can see what *they* said they needed and why (the `notes` field)
- I can leave clear feedback in `itNotes` so there's a paper trail

The two-way communication table is exactly what I needed. Having "who sees what" spelled out means I won't accidentally tell a researcher something that was supposed to be internal.

**But** — and this is important — this only helps if researchers actually use the notes field. If they export a blank JSON with no context, I'm back to calling them anyway.

---

## 3. The JSON import/export — Can I explain this to a frustrated professor on the phone?

**Sort of.** Here's my script attempt:

> "Okay Professor, you'll see a Download button at the end of the planner. That gives you a file. You email that file to us. We review it and send you back an updated file. You can re-import that to see our notes."

That... actually sounds reasonable? The problem is:

- Professors don't think in terms of "files." They think in terms of "I submitted my request, where is it?"
- There's no concept of submission here. It's export/import. That's a terminology mismatch that will cause confusion.
- What if they lose the file? What if they overwrite it?
- The spec says researchers re-import the reviewed JSON, but I don't see where in the planner UI that import happens. Is it the same import as the workbench? Different button?

I'd want the UI to say something like "Submit your plan to Research IT" instead of "Export JSON." Make it feel like a submission, even if technically it's a file download.

---

## 4. The status workflow — Do I have authority to approve things?

**The spec doesn't say.** And that's a problem.

Looking at the status values, I can imagine a hierarchy:

| Status | Can Piper do this? |
|--------|-------------------|
| `pending` | Yes (default) |
| `needs-info` | Probably yes — I'm just asking for clarification |
| `approved` on L1/L2 | Maybe? If Marco trained me? |
| `approved` on L3/L4 | Definitely not — that needs Marco or compliance |
| `approved-modified` | No idea — what counts as a "modification"? |
| `denied` | I would never click this without checking with Marco first |

What I need is a permission model. Something like:

```yaml
workbench:
  roles:
    piper:
      can_approve_tiers: [low, standard]
      can_deny: false
      escalation_required: [high, restricted]
```

Without this, I'm going to be terrified of clicking the wrong button and approving something that should have gone through compliance review.

---

## 5. What training would I need?

Things the spec assumes I know:

1. **What makes a valid JSON file** — I can learn this, but I'd want a validation guide. What are the required fields? What if `tier` is misspelled?

2. **When to use each status** — Needs explicit decision trees. "If the request is L3 and includes PHI, always escalate to..."

3. **How to write good IT notes** — Are these notes official? Can researchers cite them in grant applications? Should I be formal or friendly?

4. **What calculator inputs mean** — The spec shows calculator inputs like `sampleCount: 200` and `coverage: "30x"`. I don't know what 30x coverage means for RNA-seq. How am I supposed to verify if the researcher's estimate is reasonable?

5. **The round-trip workflow** — Phase 5 mentions the researcher can "respond/update" after seeing IT notes. What does that look like? Is it a conversation or a new submission?

**Documentation I'd want:**
- A one-page "Workbench Quick Start" with screenshots
- A decision tree for status assignments by tier
- Example IT notes for common scenarios (approved, needs-info, denied)
- A FAQ of "things researchers will ask and how to answer"

---

## 6. What questions will researchers ask me about this?

| They'll ask... | Can I answer? |
|----------------|---------------|
| "I submitted my request, where is it?" | Sort of — I can check if it was imported into workbench, but "submitted" isn't a thing here |
| "When will I hear back?" | No — the spec has no SLA or timeline guidance |
| "Why was my storage request denied?" | Yes, if IT notes are filled in |
| "Can I change my request after submitting?" | Yes, they just... edit in the planner and re-export? But then what happens to our notes on the old version? |
| "Why do I need L3 approval?" | Maybe — I can point to the tier flags, but explaining *why* those flags matter is policy knowledge I'm still learning |
| "Can I talk to someone about this?" | Yes, the notes field enables async communication, but they'll still want a phone call |
| "I lost the file you sent me" | ...good question. Is it saved anywhere? Or do I have to re-export from workbench? |

---

## 7. The Open Questions — Piper's Perspective

**Question 1: PDF generation**

> Should we add a "Generate Summary PDF"?

**Yes please.** Professors love PDFs. They want something they can print, attach to a grant application, share with their department admin. The JSON round-trip is great for the workflow, but a PDF is what they'll actually send to their grants office.

Also, if I'm on a call with a confused professor, I can email them a PDF summary of their request status way more easily than explaining how to import a JSON file.

**Question 2: Request ID format**

> Auto-generated on export, or IT assigns it?

**Auto-generate on export.** If I have to manually assign IDs, I'll forget, or I'll duplicate one, or I'll typo. The system should handle this. Use the format shown (`RC-2024-0142`) and increment automatically.

Maybe let IT add a suffix if we need to — like `RC-2024-0142-R2` for revision 2 — but the base ID should be automatic.

**Question 3: Multiple reviews / history**

> Keep history of all notes, or just show current?

**Keep history.** This is important for two reasons:

1. If a professor says "but you told me last time...", I need to see what we actually said.
2. For L3/L4 requests that go back and forth with compliance, having an audit trail matters.

Maybe show the most recent notes prominently, with a "View history" toggle for older exchanges. Don't clutter the main view, but don't lose the history either.

**Question 4: Batch operations**

> Approve all at once, or require individual review?

**Both, with guard rails.**

For L1/L2 requests with 5+ items that all look standard? Yes, "Approve All" saves time.

But require individual review for:
- Any L3/L4 request
- Any item with special flags (HIPAA, PHI, export control)
- Any item over a certain cost threshold

So: "Approve All Eligible" button that skips flagged items, with those flagged items requiring manual review.

---

## Summary

**The Good:**
- Clear UI mockups that I can follow
- Two-way notes system is exactly what we need
- Status values make sense conceptually
- Round-trip workflow is clever

**The Concerning:**
- No permission model — I don't know what I'm allowed to approve
- No error handling documentation
- Calculator inputs require domain knowledge I don't have
- "Export/import JSON" language will confuse researchers

**What I need before going live:**
1. A decision tree for status assignments
2. Permission levels by role and tier
3. Training on what calculator fields mean
4. A script for explaining the workflow to researchers
5. PDF export (please)

---

## Verdict

**Needs work.**

This is a solid foundation. But deploying it without the permission model and training materials means I'll be guessing on every L3 request — or escalating everything to Marco, which defeats the purpose.
