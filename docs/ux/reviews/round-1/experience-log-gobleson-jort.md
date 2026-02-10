# Experience Log: Dr. Jort Gobleson

**Date:** February 5, 2026
**Persona:** Dr. Jort Gobleson, Astronomy Professor
**Session:** Walking through OpenResearchDataPlanner for legacy data archive

---

## Session 1: Legacy Observation Archive (1998-2015)

**Context:** It's 3:17 AM. Just finished a remote observing session. One of my external drives made a new sound tonight - a sort of rhythmic clicking that definitely wasn't there yesterday. Time to finally deal with this.

**Goal:** Figure out how to get 30TB of historical observation data (already published, sitting on external drives and that orphaned NAS) into proper archive storage.

---

### Step 1: Welcome

Click "Get Started."

The page loads. There's a progress bar at the top showing steps: Data Classification, Grant Period, Retention, Select Services, Usage Estimates, Results.

Okay, six steps. That's... manageable? I've filled out NIH biosketches. I can do this.

**First observation:** No indication of whether this is for new projects only or if I can plan for existing data. I'm just going to proceed and hope it becomes clear.

---

### Step 2: Data Classification

**Question:** "What is your data security tier?"

Four options: Low, Medium, High, Restricted.

For the legacy archive, this is easy - it's all published data. Papers from 2003-2015, all openly available. I click **Low**.

The description says "publicly releasable, has no restrictions." Yes, that's correct. In fact, I wish MORE people would access it. Right now the only people who can access it are me and anyone willing to dig through external drives in my office.

**Second observation:** This was straightforward. But I'm already thinking about my other project - the active transient survey. That's definitely NOT public. It's unpublished competitive data. That would be Medium tier, right? Not regulated like HIPAA, but not public either.

Do I have to come back and do this again for that project? The tool doesn't say.

**Click "Next"**

---

### Step 3: Grant Period

**Question:** "When does your grant start and end?"

Wait. This data is from 1998-2015. There is no grant. Well, there WAS - multiple grants over the years - but they're all closed out now.

I have three options: 1 year, 2 years, 3 years, 5 years, or Custom.

**Problem:** None of these options make sense for "I need to archive historical data RIGHT NOW."

I guess... I need to store it for 10 years going forward? My NSF grant requires data retention but that's for NEW data from current projects.

**Decision:** I pick "Custom" and set:
- Start date: Today (defaults to today, that's fine)
- End date: 10 years from now

**Third observation:** This step feels completely wrong for my use case. I'm not planning a future grant - I'm fixing a past mistake. But there's no "I need archive storage indefinitely" option.

Maybe I should have chosen 5 years? But what happens after 5 years - does the tool assume I delete everything? That can't be right for archive storage.

**Feeling:** Confused and a bit anxious I'm doing this wrong.

**Click "Next" anyway**

---

### Step 4: Data Retention

**Question:** "How long must you keep data after the grant ends?"

Options presented: Federal Grant Standard (3 years), DOE Requirements (5 years), Clinical Trials (7 years), Custom.

**Fourth observation:** WAIT. This is asking about retention AFTER the grant. But I just set the "grant" to be 10 years as a workaround because my actual grants ended years ago.

So if I choose "Federal Grant Standard (3 years)", does that mean 10 years (fake grant) + 3 years retention = 13 years total?

I think the tool is asking: "You have a grant from Year 0 to Year N. After Year N, how much longer do you need to keep the data?"

**Decision:** I choose "Federal Grant Standard (3 years)" because that's technically what NSF requires, even though the conceptual model is all wrong for my situation.

There's an **archive ratio slider** - "What percentage of your active data will you archive?"

It defaults to 100%. I leave it there. All 30TB needs to be archived. None of it can be deleted - it's historical observations that can't be recreated.

**Fifth observation:** The archive ratio slider is actually a brilliant feature for people doing active research with lots of intermediate files. For me, it's simple: keep everything.

**Click "Next"**

---

### Step 5: Select Services

Two tabs: "Bundles" and "Browse Services"

I look at the bundles first:

- **Storage Only** - "Just need a place to store your research data?"

YES. This is me. This is exactly me.

Bundle includes: Research Storage (GPFS)

**Click "Apply Bundle"**

The Research Storage service is now selected. I switch to "Browse Services" to see what else is there.

I scroll through:
- HPC Cluster - Don't need this for archive
- Research Storage - Already selected
- Cold Archive Storage - Wait, this exists as a separate service?

**Sixth observation:** The bundle gave me Research Storage, but Cold Archive is a separate service. The user guide mentioned archive storage for retention, but it's not in the Storage Only bundle.

Should I add Cold Archive manually? Or will it appear automatically because I said I need retention beyond the grant?

The service description says: "is_archive_tier: true" in my mental model from reading the YAML. But in the UI, it just says "Long-term archival storage for retention compliance."

**Decision:** I add Cold Archive Storage manually by clicking it.

Now I have two services selected:
- Research Storage (GPFS)
- Cold Archive Storage

**Seventh observation:** This feels redundant. Do I need BOTH? Or does the tool automatically know to use Research Storage during the "grant" period and Cold Archive after?

I'm confused about the relationship between these two services.

**Click "Next" anyway**

---

### Step 6: Usage Estimates

Now I need to estimate usage for each service.

#### Research Storage (GPFS)

**Prompt:** "How much active storage do you need?"

Default: 5 TB

Presets:
- Small project (1TB)
- Medium project (10TB)
- Data-intensive (100TB)
- Large-scale (500TB)

**My situation:** I have 30TB of historical data currently on external drives. But this is asking about "active" storage. For an archive-only project, how much is "active"?

I think the mental model is:
- During the "grant" period, my data is on Research Storage (active, expensive)
- After the "grant" ends, it moves to Cold Archive (retention, cheaper)

But that's not how I want to use this. I want to put 30TB directly into Cold Archive right now. I don't need high-performance access to 1998 telescope data.

**Decision:** I enter 30 TB, because that's what I have. But I'm frustrated that I can't say "skip active storage, go straight to archive."

**Cost shown:** $145/month (30TB × $5/TB, minus the 0.5TB free allocation)

Over 10 years (my fake grant period), that's $145 × 12 × 10 = $17,400

**Eighth observation:** This is expensive for archive storage. I don't need high-performance parallel filesystem access to published data from 2003.

#### Archive Storage Estimate

Below the active storage input, there's a section:

**"Archive Storage (after grant ends)"**

Shows: 30 TB (100% of active data based on retention settings)

Cost: $15/month for 3 years retention period = $540 total

**Ninth observation:** THERE it is. $15/month is what I saw in services.yaml. That's the cold archive rate ($0.50/TB/month × 30TB).

But now I'm even more confused about the workflow. The tool is calculating:
- $17,400 for 10 years of active storage on GPFS
- $540 for 3 years of archive storage after that

**Total:** $17,940 for data that should just sit in cold archive from Day 1.

#### Cold Archive Storage

Wait, I also manually added Cold Archive as a service. Does it ask me to estimate that separately?

I scroll down. There's no estimation section for Cold Archive Storage.

**Tenth observation:** Cold Archive doesn't have an estimation section because it's calculated automatically from the retention settings. So I shouldn't have manually added it.

But the UI let me select it! There was no indication that it was already included automatically.

**Feeling:** Frustrated. Confused. I think I misunderstood the workflow.

**Decision:** I deselect Cold Archive Storage manually (go back to Select Services step, remove it).

Now I only have Research Storage selected.

**Return to Usage Estimates**

Okay, so the final numbers are:
- Research Storage: $145/month during grant (10 years) = $17,400
- Archive Storage: $15/month after grant (3 years) = $540
- **Grand Total:** $17,940

**Eleventh observation:** For a 13-year total timeline (10-year "grant" + 3-year retention), I'm paying $17,940 for 30TB of data that I barely need to access.

If I could put it DIRECTLY into cold archive for 13 years, it would be:
- 30TB × $0.50/month × 12 months × 13 years = $2,340

That's a $15,600 difference.

**Critical realization:** This tool is designed for active research projects, not for migrating legacy data directly to archive. There's no pathway for "I just need cold storage for existing data."

**Click "Next" to see results**

---

### Step 7: Results

Two tabs: Budget Estimate and Data Management Plan

#### Budget Estimate Tab

**Summary cards:**
- Monthly Cost: $145
- Grant Period Total: $17,400
- Archive Period Total: $540
- **Grand Total: $17,940**

**Cost Breakdown Table:**

| Service | Monthly | Grant Total | Archive Total |
|---------|---------|-------------|---------------|
| Research Storage (GPFS) | $145 | $17,400 | $540 |

**Twelfth observation:** The table is clear and well-organized. I can see exactly where the money is going. But it's showing me the wrong answer for my use case.

#### Data Management Plan Tab

There's generated text:

> "Data will be stored on the institutional Research Storage (GPFS) system, a high-performance parallel filesystem with automated backups and snapshots. Following the grant period, data will be migrated to Cold Archive Storage to meet federal retention requirements."

**Thirteenth observation:** The DMP text is well-written and appropriate for a normal research project. For my situation (migrating legacy data), it's technically correct but economically wrong.

---

## Post-Session Reflection

### What I tried to do
Get a cost estimate for archiving 30TB of historical published observation data from 1998-2015, currently scattered across failing external drives.

### What the tool assumed I wanted
Plan a new 10-year research project with 30TB of active data on high-performance storage, then move it to archive for 3 years after the project ends.

### The mismatch

The tool has a mental model of:
1. You write a grant proposal
2. You generate data during the grant
3. You store active data on expensive, high-performance storage
4. After the grant ends, you archive on cheap, slow storage
5. After retention period ends, you delete (or renew)

My actual situation:
1. I already HAVE data (generated 1998-2015 under old grants)
2. I need to move it from dying hardware to stable archive
3. I don't need high-performance access - it's published historical data
4. I need to keep it indefinitely (or at least 10+ years)
5. I want the cheapest sustainable option

### What worked well

- **Clear pricing:** I can see exactly what everything costs
- **Archive awareness:** The tool KNOWS about cold archive and calculates it
- **Service descriptions:** Well-written, honest about limitations
- **Storage Only bundle:** Conceptually perfect for my need
- **Cost breakdown:** Transparent and detailed

### What didn't work

- **No "migrate existing data" pathway:** The grant period model doesn't fit legacy data
- **Forced onto expensive active storage:** Can't go directly to cold archive
- **Confusing service relationships:** Should I manually add Cold Archive or not?
- **Unclear multi-project support:** Do I run this three separate times for my three projects?
- **Grant period required:** What if I just need ongoing archive service, not tied to a grant?

### Questions I still have

1. **Can I request cold archive without active storage?** Or do I have to pay for expensive GPFS first?

2. **Is there a way to model "migration project" vs "new research project"?** Different cost structures.

3. **What happens at the end of the 13-year period?** Does my data get deleted? Can I renew? What's the process?

4. **Should I be using this tool three times for three projects?** Or is there a way to plan multiple projects in one session?

5. **Who do I talk to about the actual migration?** The tool gives me cost estimates, but not next steps for the physical transfer from my external drives.

---

## Key Insights for OpenResearchDataPlanner Team

### Critical gap: Legacy data migration use case

Researchers like me (and there are MANY in astronomy, climate science, geology - any field with long-term observational data) need:

- A way to indicate "I already have this data, I need to move it NOW"
- Direct-to-archive pricing without expensive active storage period
- Migration support, not just planning
- Ongoing service model, not tied to grant periods

### The tool is SO CLOSE

The infrastructure exists:
- Cold Archive pricing is perfect ($15/month for 30TB)
- The tool can calculate archive costs
- The retention model almost works

What's missing:
- A "Data Migration" project type alongside "Research Grant"
- Start date of "Now" and ongoing service (not a fixed grant period)
- Ability to skip active storage for archive-only needs

### Suggested "Legacy Data" bundle

```
Legacy Data Archive
- Cold Archive Storage (estimate in TB)
- Globus Transfer (one-time, for migration)
- RC Consultation (help planning the migration)
- Optional: Research Storage (temporary staging during migration)
```

This would serve:
- Professors with old data on dying hardware
- Labs migrating from PI-owned NAS devices
- Department shutdowns/retirements requiring data preservation
- Compliance-driven retention of published data

---

## Bottom Line

**Would I recommend this tool to a colleague with a similar problem?**

Not yet. I'd tell them: "It's designed for planning NEW grants, not fixing legacy data problems. You'll get an estimate, but it'll be 5-10x higher than what you actually need because it assumes you need active high-performance storage."

**Would I use this tool for my NEXT grant (the transient survey)?**

Yes, absolutely. For planning a new 3-year grant with active research, compute needs, and proper data management from Day 1, this tool seems excellent.

**What would make this tool work for my immediate crisis?**

A simple toggle: "Is this for new data or existing data migration?"

If "existing data migration":
- Skip grant period (just ongoing service)
- Offer cold archive as primary option
- Include Globus transfer for migration
- Include RC consultation for planning
- Give me a quote and a contact person

That's it. That would solve my problem.

---

**Session end time:** 4:42 AM

**Status:** Legacy archive plan incomplete. Will try again for active transient survey project instead. May email RC directly about the legacy data - this tool isn't the right fit for that problem.
