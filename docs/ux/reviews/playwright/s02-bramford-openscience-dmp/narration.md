# Narration — s02-bramford-openscience-dmp

> Timestamped think-aloud transcript. Each entry: `[mm:ss] (intent|observe|stall) — line`,
> with the action that triggered it. Stalls cite a `#q-<id>` node or route when one applies.

- **Persona:** 03-bramford-lina
- **Target:** https://openresearchdataplanner.dev.xram.net
- **Session type:** Exploratory (source-walk). Live video/trace pending a runner pass — see verdict note.
- **Date:** 2026-06-03
- **Analyst:** piper-nakamoto

---

## Exploratory pass — Dr. Lina Bramford

### Landing / Welcome (`/`)

- `[00:00]` **(intent)** Andrew's team sent me this for the climate downscaling renewal. Four-year NSF, everything open — all the models, all the data, freely shared with the folks at the other campuses. I'm sitting on tens of terabytes of simulation output and a pile of Landsat/Sentinel imagery that's already public domain. What I need from this thing: tell me I don't have to wade through compliance theater for *open* data, give me language my DMP reviewers will accept as FAIR, and a real cost number before I write it into the budget. Let's go.
- `[00:12]` **(observe)** "Research Data Planner." Flow reads Data Tier → Grant Period → Services → Estimate → Results. Fine, that's a wizard, I can do a wizard.
- `[00:18]` **(intent)** Tier first. My data isn't sensitive, so I'm bracing to fight a flow that assumes everyone's doing HIPAA. Let's see how hostile it is to "I just want this to be open."

### Tier questionnaire (`/tier-check`)

- `[00:30]` **(observe)** Oh — this is better than I expected. The intro has an "audience note" that literally says *"You can likely skip this if: Your data is already publicly available (published datasets, open source); You study physical phenomena without biological or human components."* That's me. Climate downscaling on public satellite imagery — physical phenomena, public data, no humans, no biology. The tool is *telling me I don't need it.* I did not expect to feel seen on the landing screen. ✅
- `[00:40]` **(observe)** There's a quick-select button right here: *"My data is not sensitive — use standard tier"* → goes straight to low (`quick_select.tier: low`). And a separate "I already know my tier" skip. So I have a one-click exit. Good.
- `[00:50]` **(stall)** Here's the thing though — I don't just want to *skip*. I'm an open-science evangelist writing an open-science DMP. The framing is "this isn't sensitive, move along." But openness isn't the *absence* of sensitivity — it's an affirmative choice I want my reviewers to see me make. The tool offers me the door marked "nothing to see here." There's no door marked "yes, and here's how I'm making it FAIR and public." Low tier is offered as an exit, not as a path. *(Open science is a skip, not a first-class flow — `tier-questionnaire.yaml` intro `quick_select` + `audience_note`.)*
- `[01:00]` **(intent)** Fine. I'll take the quick-select to standard tier — it's correct, and I'm not going to make work for myself. Clicking "My data is not sensitive — use standard tier." → **Low tier.** Correct answer, light touch, no over-warning. That part genuinely works.

### Grant period (`/` wizard, Step 3)

- `[01:20]` **(observe)** Grant period chooser. "No dates yet" is the default, selected, sitting first — nice, I don't have to fight a pre-filled 3-year. But I *do* know my dates: four-year renewal. I pick a period and set the start. Editable start, end follows. Clean enough.

### Services / estimate (`/` wizard, Service + Estimate steps)

- `[01:45]` **(intent)** Now the part I actually came for: what does 40-ish terabytes cost. I share via my personal Google Drive right now, which is held together with hope and a paid family plan. I want to stop. Show me the real number.
- `[02:00]` **(observe)** Storage services. "Globus-Connected Storage (iRODS)" — 5PB array, Globus endpoint, external sharing marked *full*, collaboration *full*. That's exactly my multi-institution sharing story. And the comparison row says **"500GB free per project."** Okay, so there's a free floor and it's 500GB, not the "1TB free" I thought I'd heard somewhere. Noting that.
- `[02:10]` **(observe)** The estimate input: "How much Globus-connected storage do you need?" Range 1–1000 TB, presets: Small (5TB), **Data-intensive (50TB)**, Large-scale (200TB). The "Data-intensive — large datasets, multi-site sharing" preset describes my project to a tee. I click it, then nudge it down to 40. The input takes 40 without complaint — no ceiling fight, no unit confusion (it's in TB, labeled TB). ✅
- `[02:25]` **(observe)** Price model is $3.50/TB/month, first 500GB free, auto-applied. So 40 − 0.5 = 39.5 TB billable × $3.50 ≈ **$138/month.** Over a 48-month grant that's about **$6,600 active.** That's a budgetable number. Globus transfers included at no cost — good, transfer-cost surprises are how budgets die.
- `[02:40]` **(stall)** But I had to do that subtraction in my head. The estimate shows me a monthly figure; what I don't see called out is the *line* — "500GB included free, 39.5TB billable." The free allocation is applied silently in the math (`Math.max(0, estimate − 0.5)` in the DMP/cost path). For me it's fine, I can do arithmetic. For a junior PI it reads as "$138/mo for 40TB" with no visible explanation of where the free tier stopped. The brief asked: *does she understand where free ends and paid begins without asking a human?* I worked it out, but the UI didn't spell it out. *(Free-tier boundary is computed, not surfaced as a labeled line item.)*
- `[02:55]` **(stall)** Also: the free allocation isn't consistent across services. Globus storage is 500GB free; "nwfiles" research storage is 100GB free at $3/TB; and somewhere in the institutional messaging it's "1TB free." Three different free floors. As someone who'll compare options, that inconsistency makes me trust the number a little less. *(Config drift across `services.yaml` free_allocation values vs. institutional "1TB free" messaging — dev-config issue, but it reaches the user.)*

### DMP results (`/results`)

- `[03:15]` **(intent)** Here's the real test. I need DMP language my NSF reviewers will read as a credible open-data, FAIR-aligned plan. This is the document that decides whether the panel believes I'll actually share.
- `[03:30]` **(observe)** The DMP is assembled from per-service, per-tier templates — so it does pick up my actual storage choice, that's good, it's not a generic blob. The Globus storage section describes the iRODS array, capacity, transfer story.
- `[03:40]` **(stall)** But I read the whole output and the words **"FAIR," "findable," "accessible," "interoperable," "reusable," "open data," "public repository," "data sharing plan"** do not appear. Not in the low-tier storage template, not in the default template — I checked the obvious places I'd land. (FAIR language exists elsewhere in the tool — clinical guidance, an AI-ethics applet, the acronym list — but not in the storage DMP templates I actually get handed.) My entire grant thesis is *openness*, and the document I'm supposed to attach to my NSF submission is silent on it. *(`config/dmp-templates/{globus-storage,cloud-storage,nwfiles}/*.md` carry no FAIR/open-data language; the questionnaire never collects an "open/public" flag for the DMP to consume even if a template wanted it.)*
- `[03:50]` **(observe)** So what I get is a competent *storage and cost* plan. What I don't get is a *data-sharing* plan — which, for an open-science proposal, is the half the reviewers care about most. I'd have to hand-write the FAIR section myself. Which is exactly the work I hoped this tool would save me.

### Wrap

- `[04:10]` **(observe)** Net: the tier path didn't over-warn me — that fear was unfounded, the audience-note and quick-select are genuinely respectful of low-sensitivity work. The cost number is real and budgetable, and 40TB sailed through with a preset that fit me. Two real gaps: open science is offered as an *exit* rather than a documented *path*, and the DMP output has zero FAIR/open-data language for the one researcher who needs it most.
- `[04:20]` **(intent)** Is this faster/cleaner than my Google Drive? For *figuring out what it costs and what to provision* — yes, clearly, and I'd come back for that. For *producing the open-data DMP I can hand a reviewer* — not yet. I'd leave with the cost answer in hand and the sharing-plan still on my to-do list.
