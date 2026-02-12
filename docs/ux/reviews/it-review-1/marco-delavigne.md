# IT Workbench Review: Marco Delavigne

**Reviewer:** Marco Delavigne, Senior Research Computing Specialist
**Experience:** 28 years at institution
**Date:** 2026-02-11
**Artifact reviewed:** docs/IT-WORKBENCH.md

---

## 1. Will this actually reduce my workload?

**Maybe. But I've heard that promise before.**

The theory is sound: researchers add their own notes explaining *why* they need 50TB, I can review it, add my feedback, export it back. In an ideal world, this cuts out the back-and-forth emails where I'm asking "what's this for?" and waiting three weeks for a reply.

But here's my concern: **this assumes researchers will actually write useful notes.**

In 28 years, I've learned that researcher notes come in three flavors:
- Empty (most common)
- "I need this for my research" (useless)
- A three-paragraph justification that doesn't answer my actual question

The spec shows this beautiful example: *"Need this for RNA-seq raw data. We'll have ~200 samples at 30x coverage."* That's a dream. Dr. Chen would never write that. She'd write "genomics stuff" and I'd still have to call her.

**What would help:** Make the notes field *required* for L3/L4 requests, with prompting questions. "What data type? How was this estimate derived? Is this peak or sustained storage?"

---

## 2. JSON Round-Trip Concerns

**This is where I predict 60% of my new tickets will come from.**

Let's walk through the real scenario:
1. Dr. Miller exports JSON
2. Dr. Miller emails it to me (as an attachment, not through some system)
3. I import it, review it, export the reviewed version
4. I email it back
5. Dr. Miller's email client renames it `reviewed (1).json`
6. Dr. Miller tries to import it, gets an error, calls me
7. I spend 20 minutes on the phone walking through "no, the other JSON file"

Or worse:
- Dr. Miller opens the JSON in Word "to look at it" and saves it, corrupting the format
- Dr. Miller's assistant imports the wrong file version
- Dr. Miller loses the original and asks me to "just send the approved one again"

**The spec assumes everyone understands file-based workflows.** They don't. Researchers understand email, and they understand clicking buttons. JSON files are an IT concept.

**What would help:**
- Unique, obvious filenames: `chen-genomics-lab-2024-01-15-submitted.json` not `request.json`
- Checksum validation on import with a clear "this file was modified or corrupted" message
- Consider: can we avoid the email step entirely? Shareable links? QR codes? Something that doesn't require teaching people file management?

---

## 3. The Password Gate

**This is inadequate, but I understand why you did it.**

Client-side password stored in a YAML file that gets compiled to public JSON. Anyone who views source can find it. Session stored in browser sessionStorage. No audit trail.

For what it claims to be — "a light gate to prevent accidental access" — it's fine. I can't get worked up about security theater for data the researcher already has.

But here's my real concern: **who is this workbench for?**

If it's just me and maybe Terry, sure, a shared password works. But if this is supposed to scale to our whole IT support team (8 people), now I've got:
- No way to know who reviewed what
- `itReviewedBy` is just a text field someone types — no authentication
- When something goes wrong (and it will), no audit trail
- New employee onboarding means sharing the password verbally

**What would help:**
- At minimum, make people enter their name/initials on login, store it in session
- Log actions to console or a file (who imported what, when)
- For future: SSO integration hooks, even if not implemented now

---

## 4. The Notes System

**Two-way communication sounds good in theory. What happens in practice is this:**

```
IT Notes: "This storage estimate seems high. Can you clarify
          whether you're keeping raw FASTQs long-term or
          archiving after alignment?"

[Three weeks pass]

Researcher: [imports updated JSON]
Researcher Notes: "Yes"
```

I've been doing this job long enough to know that async written communication with researchers is painful. They're busy. They skim. They answer the question they wish you'd asked.

The status values are good though. I especially like `approved-modified` — that's a real scenario that happens constantly. "Yes, but we're giving you scratch space instead of persistent because your grant ends in 6 months."

**What's missing from the notes system:**
- Timestamps on researcher notes (did they write this before or after my question?)
- Ability to mark a note as "needs response" vs informational
- Character limits or prompts to encourage useful responses
- An "IT to IT" internal notes field that researchers don't see (for things like "spoke with dept admin, they're handling procurement separately")

---

## 5. What's Missing

**Integration points.** This is a standalone tool that doesn't talk to anything I actually use:

- **ServiceNow**: Every request still needs a ticket. Am I supposed to manually create SNOW tickets for each import? Export the reviewed JSON and attach it to a ticket? The spec doesn't say.

- **SLURM/Allocation Management**: Once I approve 100,000 SU, how does that become an actual allocation? This is still a manual process.

- **Identity**: How do I verify `schen@northwinds.edu` is who they say they are? The JSON is just text.

- **Pricing verification**: Researchers can edit JSON. What stops them from importing a file where they changed `$50/TB/yr` to `$5/TB/yr`? The workbench should pull pricing from authoritative config, not trust the import.

**Other missing pieces:**

- **Bulk operations**: You asked about this. Yes, absolutely I need "approve all L1 items" or "approve all items from this service category." Most L1 requests are rubber stamps.

- **Templates for common IT notes**: I write "Consider archiving raw data after processing" about 50 times a month. Let me save that.

- **Request age tracking**: Show me which requests have been sitting unreviewed for 2+ weeks. That's how things fall through cracks.

- **Export to ServiceNow format**: Even if it's just copying structured text I can paste into a ticket.

---

## 6. Integration with Existing Systems

**This is my biggest skepticism.**

I use:
- **ServiceNow** for tickets
- **SLURM** for allocations
- **Grafana** for monitoring
- **Grouper** for access management
- **A shared spreadsheet** (don't judge) for tracking grant accounts

This tool is another tab I have to keep open. Another system where data lives. When a researcher calls asking "what's the status of my request," I now have to check ServiceNow AND this workbench AND my email for the JSON file AND the spreadsheet.

The spec says the philosophy is "tools integrate via well-defined file formats, not tight API coupling." I appreciate the Unix philosophy, but **I need at least a way to copy structured data to my clipboard** that I can paste into other systems. Otherwise I'm re-typing everything.

---

## 7. Answers to the Open Questions

**PDF generation**: Yes, add it. Not everyone in the approval chain can handle JSON. When I need to escalate to my director or to the IRB, I need something they can open. A PDF summary with:
- Researcher info
- All items with status and notes
- Total costs
- Data classification summary
- IT staff name and review date

**Request ID format**: Let IT assign it. We have our own numbering scheme that maps to fiscal years and departments. Auto-generated IDs are meaningless to us. But provide a suggested format and let config override it.

**Multiple reviews**: Keep history. When this ends up in a dispute ("you never told me about the archive tier!"), I need receipts. Show current prominently, but let me expand to see all previous notes with timestamps.

**Batch operations**: Required. With guardrails:
- "Approve all" only for L1/L2, require individual review for L3/L4
- Show confirmation with count before executing
- Log the batch action

---

## Verdict

**Needs work before I'd use it.**

This is a reasonable first draft by someone who understands the problem theoretically. But it's designed for a world where:
- Researchers read and write thoughtfully
- File-based workflows are intuitive
- IT staff only need one tool
- Everything goes smoothly

In my world:
- Researchers skim and answer tersely
- File management is a support ticket waiting to happen
- I have six systems open and this would be seven
- Something always goes wrong

**I'd pilot it if:**
1. Notes become required fields with guiding prompts for L3/L4
2. There's a clipboard export for ServiceNow integration
3. PDF export exists for escalations
4. Filenames are human-readable and unique
5. There's at minimum a name-on-login for audit purposes
6. Bulk approve exists for L1/L2

Build those, and I'll try it with 10 researchers and see if it actually reduces my email volume. That's the real test.
