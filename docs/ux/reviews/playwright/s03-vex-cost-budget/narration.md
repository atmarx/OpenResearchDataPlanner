# Narration — s03-vex-cost-budget

> Timestamped think-aloud transcript. Each entry: `[mm:ss] (intent|observe|stall) — line`,
> with the action that triggered it. Stalls cite a `#q-<id>` node or route when one applies.

- **Persona:** 01-vex-torben
- **Target:** local merged build at `cb5948c` (main branding + FRE tier logic — ahead of staging, which the reshoot work depends on), `http://localhost:4000`
- **Session type:** Exploratory (live Playwright walk, fresh contexts; probe scripts + state traces archived)
- **Date:** 2026-07-09
- **Analyst:** piper-nakamoto

> **Automation note:** the UX-enhancements entrance animations keep elements
> sub-pixel unstable for ~1s after each step swap; unforced Playwright clicks
> time out ("element is not stable"). All clicks in this run are forced. Humans
> won't notice; anyone scripting against the app will.

---

## Exploratory pass — Dr. Torben Vex

### Landing (`/`)

- `[00:00]` **(intent)** IT sent another wizard. Fine. I have a budget spreadsheet open in the other monitor with a blank cell where three years of alloy-simulation money should go. If this thing can fill that cell, I'll eat my words. If it makes me click through feelings first, I'm closing the tab.
- `[00:15]` **(observe)** "Self-service discovery for researchers." A seven-step tracker across the top: Tier → Grant Period → Services → Software → Estimates → Results. At least it shows me the whole gauntlet up front instead of surprising me.
- `[00:25]` **(intent)** It wants a "data security tier" first. The alloy work is unpublished and tech transfer keeps mumbling about patents, so it's not public — but it's also not medical records. I don't know your tier vocabulary. There's a questionnaire at `/tier-check`. I'll allow it — but it had better be short.

### Tier questionnaire (`/tier-check`)

- `[00:45]` **(observe)** Intro says who this is for and there's a "my data is not sensitive" fast lane. Not my case, but good — the open-data people shouldn't have to sit through this. Starting.
- `[00:55]` **(observe)** `#q-human_subjects` — human subjects? No. Atoms don't consent. Next.
- `[01:05]` **(observe)** `#q-biological_samples` — DNA, tissue? No. High-entropy alloys, not high-entropy organisms.
- `[01:15]` **(observe)** `#q-government_data` — funded by a government agency? Yes — and the option literally says "NSF, NIH, NEH, NEA, or other standard federal grant." It names NSF instead of making me guess which bucket a normal grant falls in. Fine, that's one question I don't have to interpret.
- `[01:30]` **(observe)** `#q-export_control` — ITAR/EAR? No. Aluminum alloys for turbine blades, not warheads. Answering "No / Not sure."
- `[01:35]` **(stall)** Small gripe as a reviewer of other people's paperwork: "No" and "Not sure" are the SAME button here. For export control those are not the same state of mind — the colleague who is genuinely *not sure* about EAR should probably get routed to the new export-control sub-branch, not waved through with the confident Nos. *(One-line design note, not my problem today: `#q-export_control` conflates "No" and "Not sure" on the clean-exit path.)*
- `[01:50]` **(observe)** `#q-proprietary_check` — proprietary or confidential? Yes — "pre-publication or NDA-protected." That's exactly the tech-transfer situation. Clicking it.
- `[02:00]` **(observe)** **"Your Recommended Data Tier: L2 — Medium Risk. Proprietary data, IP-sensitive pre-publication work."** Five questions. FIVE. No lecture, no "are you sure," and it did NOT panic-classify my unpublished work as some HIPAA-adjacent horror. It also says, in plain text: "Classification guidance, not a final determination... validate with your institution's compliance office." Correct posture — it's advice, and it admits it. I'm... mildly impressed. Don't tell IT.
- `[02:10]` **(observe)** There's a "Continue to Service Selection" button right on the result. Good — carry my answer forward, don't make me re-enter it.

### The handoff (`/tier-check` → `/`)

- `[02:20]` **(stall)** Clicked "Continue to Service Selection" and got a **blank page**. Hero background, footer, a floating Help button — and nothing else. The URL changed to `/`. This is the part where every wizard betrays you. *(Reproducible 3/3 in fresh contexts, both before and after a dev-server restart: client-side nav renders an empty view; a hard reload of the same URL renders fine. Same family as the `/ai` applet-card mount bug filed Jul 9 — the scope is bigger than the AI catalog.)*
- `[02:35]` **(observe)** I did what any of us does: hit F5. And — credit where due — it came back at the **Grant Period** step with my tier already applied. So the state survived; only the render died. A first-year grad student would have assumed their answers were gone and started over. I assumed the frontend was Wednesday-quality and refreshed.

### Grant Period (`/`, wizard step 3)

- `[02:50]` **(observe)** "How long is your project?" with preset buttons — 1 / 2 / 3 / 5 years, custom if you want it. It even says you don't need exact dates until the award is made — somebody here has actually written a grant. Clicked "3 years."
- `[03:00]` **(stall)** Now the trap. There are **two Continue buttons** on this screen — one inside the step card, one on the dark bar at the bottom. I clicked the one in the card, because it's the one next to the thing I just did. It threw me **backwards to the tier picker — with my tier CLEARED.** The questionnaire's answer, gone. *(State trace: `current_step: grant-period → tier-select`, `completed_steps` loses `tier-select`, `tier: medium → null`. The in-card Continue on this step fires the backward-navigation path, which by design clears downstream data. The bottom-bar Continue advances correctly. Verified in isolated contexts, both buttons, three runs.)*
- `[03:20]` **(stall)** Re-picked Medium, re-picked 3 years, clicked the in-card Continue again — bounced back to tiers AGAIN. This is the point where I'd normally write the all-caps email. The tool asks a question, I answer it, and it un-answers it. If this is what happened to whoever demoed it and got "stuck between risk tiers" — same loop, I'd bet lunch. *(It is: this matches the operator's Jun 22 report exactly.)*
- `[03:40]` **(observe)** Third pass, I used the OTHER Continue — the one on the bottom bar. Advanced cleanly to Services, tier intact. So: one of the two identical-looking Continue buttons works and the other one eats your homework. Fix the button, or better, don't ship two.

### Select Services (step 4)

- `[04:00]` **(stall)** The step opens on a "Use Bundles" tab — sixteen curated packages with "Recommended" chips. "Genomics Pipeline," "LLM/Chatbot Application"... I know what I need; I don't want a meal deal. One click to "Browse Services" gets me the raw catalog. Tolerable, but the default assumes I don't know what I'm doing — which is this tool's one recurring sin.
- `[04:15]` **(observe)** The catalog itself is honest: categories, per-unit prices on every card, tier columns already filtered to what L2 allows. "HPC Compute (CPU) — CPU compute on SLURM cluster... Tiered pricing from $0.04/SU." SLURM! It says SLURM. I've been submitting to SLURM since before this building had a name. Adding it.
- `[04:25]` **(stall)** "From $0.04/SU" — noted for later. "From" pricing is how gyms advertise. $0.04 is the HIGH-VOLUME band; nobody's first core-hour costs that. Watch this number; I will be checking the math.
- `[04:35]` **(observe)** Storage: "NorthStar — 5PB iRODS-managed research storage with native Globus connectivity, $3.50/TB/mo." My 8 TB of trajectories goes there. Add. The little circle-plus is the selection control — took one wrong click on "View requirements" to figure that out.

### Software (step 5), Usage Estimates (step 6)

- `[04:50]` **(observe)** Software check — I compile my own stack; Continue. It didn't argue. Good.
- `[05:00]` **(observe)** Estimates: "How many CPU-core-hours do you expect per month?" A number field, presets (Light/Moderate/Heavy). I typed 50,000 — that's my sustained LAMMPS load. Storage: 8 TB. It also auto-suggested archive at 70% of active — reasonable default, and it let me change it. These are the right questions in the right units.

### Results (step 7)

- `[05:20]` **(observe)** **Monthly $3,226. Grant period (36 mo): $116,145.** Itemized: HPC Compute $3,200/mo, NorthStar $26/mo. Export buttons for Markdown and JSON. THERE is the number for my spreadsheet cell — reached in about fourteen real actions plus one forced refresh and one button-trap detour.
- `[05:40]` **(stall)** Now the audit. 50,000 SU × the advertised "$0.04/SU" = $2,000. The screen says **$3,200**. The real math (I checked the rate card): first 10k at $0.08, next 40k at $0.06 — marginal banding, $800 + $2,400 = $3,200. The NUMBER IS RIGHT — more right than flat-rate would be — but **nothing on this screen shows the banding**. No per-band line, no effective rate ($0.0645/SU), nothing connecting the "$0.04" the catalog whispered to the $3,200 it's now asking my grant to carry. A program officer will ask me to defend this figure; today my defense is "trust the wizard," which is worth nothing. Show the bands. *(The pricing engine already computes the breakdown — it isn't rendered. Same story for NorthStar's 500 GB free floor: the slate shows "included free / billable"; this results table doesn't.)*
- `[06:10]` **(observe)** One more line on this screen: "Why isn't this covered by my overhead? →". I clicked it expecting nothing and got the first straight institutional answer I've seen on the F&A question — who pays for the commons, why my increment is a direct cost, and a worked 50 TB example with real dollars, ~32% of market. That is the argument I have had with three deans, in a modal. Whoever wired that: the skeptics noticed.
- `[06:30]` **(observe)** The disclaimer under the total says these are planning estimates, prices subject to change, consult research-computing for final approval. Correct. A tool that knows what it doesn't know.

### Verdict, from the greybeard's chair

- `[06:45]` **(observe)** The bones are genuinely good: five questions to the right tier with no over-classification, grant-period presets that understand awards, real units (SU, TB), presets, exports, honest disclaimers, and a cost engine whose math survives an audit. If the path were clean I'd hand this to my students.
- `[07:00]` **(stall)** But the path is not clean. A blank page at the exact moment the tool hands off its best result, and a Continue button that silently erases the answer you just gave — those aren't polish items, they're the two moments a skeptic decides the tool is what he always suspected. I got through because I refresh reflexively and I'll try a second identical-looking button out of spite. My colleagues won't.
