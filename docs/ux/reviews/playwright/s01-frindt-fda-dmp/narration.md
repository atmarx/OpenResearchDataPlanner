# Narration — s01-frindt-fda-dmp

> Timestamped think-aloud transcript. Each entry: `[mm:ss] (intent|observe|stall) — line`,
> with the action that triggered it. Stalls cite a `#q-<id>` node or route when one applies.

- **Persona:** 07-frindt-sela
- **Target:** https://openresearchdataplanner.dev.xram.net
- **Session type:** Exploratory (source-walk, scripted regression verified 4/4)
- **Date:** 2026-06-02
- **Analyst:** piper-nakamoto

---

## Exploratory pass — Sela Frindt

### Landing / Welcome (`/`)

- `[00:00]` **(intent)** Okay, Andrew from research computing sent me this link for the grant DMP. I've got three projects in this proposal — one is cardiac stent simulation for an FDA submission, one is hospital patient imaging, and one is an old undergrad design competition archive. I need a data management plan that covers all of them. Let's see if this can handle that.
- `[00:15]` **(observe)** Page loaded. "Research Data Planner" — okay, generic enough. There's a flow: Data Tier → Grant Period → Services → Estimate → Results. That looks manageable.
- `[00:20]` **(stall)** I see "Data Tier" as the first step. But which project? I have three. Do I just pick the hardest one? Do I run this three times? The wizard doesn't say. I'll start with the patient imaging one since that's my scariest data and if I can get a DMP for that one, I can probably figure out the rest. *(No guidance on multi-project use — user must independently decide to run multiple sessions.)*

### Tier questionnaire, Project 2 (hospital patient imaging) — `/tier-check`

- `[00:45]` **(intent)** Going to the tier check. It says "Answer a few questions to help us recommend the right security level." I notice there's a "Skip if I know my tier" — I don't, that's the whole point. Also a quick-select for "my data is not sensitive." My hospital data is definitely sensitive, so I'll start the questionnaire.
- `[01:00]` **(observe)** First question: "Does your research involve human subjects?" (`#q-human_subjects`). Yes, obviously — patient implant imaging data. Clicking Yes.
- `[01:05]` **(observe)** "Does your data include health or medical information?" (`#q-health_data`). Yes, absolutely — patient imaging, clinical data. Clicking Yes. Flags set: HIPAA, PHI (I don't see this on screen, but the reasoning is sound).
- `[01:10]` **(observe)** "Is the health data identifiable or de-identified?" (`#q-identifiable`). The learn_more here is actually good — it explains that "coded" means the key exists somewhere, even if YOU don't have it. This is the confusion I always see with my students. The option "Limited dataset (some identifiers remain)" fits the patient imaging — there are accession numbers, scan dates, hospital IDs. Clicking "Limited dataset." → **High tier.**
- `[01:20]` **(observe)** "Is this research funded by or for a government agency?" (`#q-government_data`). NSF grant. Clicking "Yes — NSF, NIH, NEH, NEA, or other standard federal grant." Good — it lists NSF specifically.
- `[01:25]` **(observe)** "Does your research involve export-controlled technology?" (`#q-export_control`). No, this is a hospital collaboration, not defense tech.
- `[01:30]` **(observe)** "Does your research involve proprietary or confidential data?" (`#q-proprietary_check`). The hospital has a DUA. That's confidential. Yes — "pre-publication or NDA-protected." Tier was already High, stays High.
- `[01:35]` **(observe)** Summary says: **High tier.** Good — that's what I expected for this project. "Consultation recommended." Okay, makes sense.

### Tier questionnaire, Project 1 (cardiac stent simulation, FDA) — second visit to `/tier-check`

- `[02:00]` **(intent)** Now let me try the stent simulation. This is the tricky one. It's simulations — computational models. No patients in the data. But it's for an FDA 510(k) submission. The FDA has very specific requirements about data record-keeping. I expect this to come out as High or at least have an FDA flag.
- `[02:15]` **(observe)** "Does your research involve human subjects?" (`#q-human_subjects`). No — it's device simulations, not patient data. Clicking No.
- `[02:20]` **(observe)** "Does your research involve biological samples or genetic/genomic data?" (`#q-biological_samples`). No — it's finite element analysis, not biology. Clicking No.
- `[02:25]` **(observe)** "Is this research funded by or for a government agency?" (`#q-government_data`). NSF again.
- `[02:30]` **(observe)** "Does your research involve export-controlled technology?" (`#q-export_control`). Cardiac stent simulations aren't defense articles. No. I'm not totally sure — is medical device simulation dual-use? There's no mention of FDA regulatory work in the options. I'll say No and keep going.
- `[02:35]` **(observe)** "Does your research involve proprietary or confidential data?" (`#q-proprietary_check`). We have an industry NDA with the stent manufacturer. Yes — "pre-publication or NDA-protected." → **Medium tier.**
- `[02:40]` **(stall)** Wait, **Medium**? I thought this was High. The FDA requires very specific record-keeping for 510(k) submissions. Their guidance says data must be "controlled, traceable, and retrievable under 21 CFR Part 820." None of that came up in the questionnaire. There was no question about regulatory submissions, FDA requirements, or device regulation. The tool is telling me Medium but I'm pretty sure FDA expects more than Medium protections. *(No FDA regulatory pathway in the questionnaire. The tool has no concept of FDA data requirements.)*
- `[02:55]` **(stall)** I don't see any way to tell the tool "this data supports an FDA submission." I could try the override to bump it to High manually, but I'd have no documentation about WHY — the DMP would just say "High" with no FDA context. My PI is going to ask why we're in High for a simulation project. I can't explain it from this output. [URL: `https://openresearchdataplanner.dev.xram.net/tier-check` — no applicable `#q-<id>` for this gap; the path ended at `proprietary_check` with no FDA node]

### Tier questionnaire, Project 3 (undergrad archive) — quick path

- `[03:10]` **(intent)** The undergrad design competition archive. Student capstone projects. No sensitive data, no IP, no compliance frameworks. I'll try the quick-select.
- `[03:12]` **(observe)** "My data is not sensitive - use standard tier" quick-select. Clicking it. → **Low tier.** Correct, exactly right, zero friction. Perfect.

### Back to the wizard — single-project limitation

- `[03:30]` **(intent)** Okay, I have three tiers: High (hospital), Medium (stent simulation), Low (undergrad archive). The wizard is now sitting at the tier-select step. I went through the tier check for the hospital project. But the wizard shows one flow. Do I fill out one DMP for all three? Or three separate DMPs?
- `[03:40]` **(stall)** The wizard doesn't have a "add another project" concept. There's no way to say "I have three datasets at different tiers." I can fill out one DMP at High tier (for the hospital project), but there's nowhere in the form to say "and by the way, I also have simulation data at Medium and an archive at Low." The output DMP will be about ONE project. *(The multi-project use case — which is extremely common for biomedical researchers, who routinely run compliant and non-compliant data in parallel — is not supported. The tool never suggests running the wizard multiple times.)*

### DMP output check — does it name HIPAA or FDA?

- `[04:30]` **(intent)** Getting to results with the hospital project on High. Let me look at the DMP draft. I specifically need it to say "HIPAA" so I can attach it to the IRB application. And if I could somehow get FDA language into the stent project DMP, I could attach it to the 510(k) submission documentation.
- `[04:45]` **(observe)** DMP output says: **"Data Classification: High"** and "High-tier data requires verification." It has sections on storage services, retention, and access controls. Well-organized.
- `[04:50]` **(stall)** But it doesn't say "HIPAA." It doesn't say "PHI." It doesn't say "human subjects." It doesn't say "IRB protocol." For a generic research computing DMP, that's fine. For an IRB submission or a hospital compliance review, this is a problem. My IRB reviewer is going to ask: "This says High tier — what does that mean? Is this covered under your IRB protocol? Is this covered under your BAA with the hospital?" The DMP doesn't answer those questions. *(The DMP generator uses tier slug only — it does not consume the HIPAA/PHI flags set during the questionnaire. The compliance-specific context is silently discarded after the questionnaire.)*

### Cost estimate check

- `[05:15]` **(intent)** Going to the calculators. My department admin wants a dollar figure. How much is this going to cost?
- `[05:20]` **(observe)** Calculator page loads. Storage estimator — enter TB, see monthly cost. Reasonable. I can enter ~2TB for the patient imaging data and get a monthly figure.
- `[05:25]` **(observe)** The estimate shows up in the DMP results. There's a number I can hand to the admin. Good. This part works.

---

## Scripted regression pass

- `[00:01]` **(intent)** Starting as 07-frindt-sela against https://openresearchdataplanner.dev.xram.net. I want to you're sela frindt, biomedical engineering.
- `[00:01]` **(intent)** Landing on the planner. I expect a clear starting point, not a wall of jargon.
- `[00:02]` **(observe)** Page loaded and titled. Wizard view is the entry point.
- `[00:02]` **(intent)** Going to the tier check to classify my data. I want to know what protections it needs.
- `[00:03]` **(intent)** There's a "Start Questionnaire" button — clicking to begin classifying.
- `[00:04]` **(observe)** First question is up and addressable (#q-human_subjects). Good: I can cite the exact node if I get stuck.
- `[00:04]` **(intent)** If a question confuses me, I want a way to flag exactly which one to support.
- `[00:04]` **(observe)** The "I don't understand this!" button is here on the question — confusion has an escape hatch that captures what/where.
- `[00:04]` **(intent)** I need a dollar figure for the budget. Looking for the cost estimators.
- `[00:04]` **(observe)** Calculators route loads. This is where a cost estimate would come from.
