# Proposed Changes from Round 1 UX Review

**Analyst:** Claude (after reviewing SUMMARY.md + 6 detailed reviews)
**Date:** 2026-02-05

---

## Review of the Reviews

### Dr. Torben Vex (Physics, Power User)
**My take:** This is your most demanding but also most valuable critic. He'll recommend the tool to his department if it respects his time. His ACCESS Program critique is devastating - the tool looks like it's selling university services instead of helping researchers find the *best* option. His archive ratio slider complaint is valid: power users think in TB, not percentages.

**Key asks:**
- ACCESS Program mention (critical)
- TB input for archive instead of percentage slider
- Skip date selection (just ask for duration)
- Campus software license visibility (ANSYS, MATLAB, etc.)

### Dr. Marge Tonsley (Medieval History, Technophobe)
**My take:** This is your accessibility acid test. If she can complete the wizard, you've made it truly universal. Her review is emotional and honest - the "Storage Only" bundle gave her hope. The unit problem is real: she literally doesn't know what a TB is. Her solution (photo count → TB converter) is exactly right.

**Key asks:**
- Inline unit explanations ("1 TB = 200,000 photos")
- Define every acronym inline, not in a glossary
- Discipline-specific tier examples
- Prominent "Talk to a human" button on every step

### Dr. Lin Vosker (ECE, Defense Research)
**My take:** This is your validation that L4 Restricted was the right call. He's skeptical but intrigued. His biggest complaint is process opacity: "What happens when I select L4?" The tool needs to tell him what to *prepare* before contacting security, not just give him an email address.

**Key asks:**
- L3/L4 workflow clarity (timeline, what to prepare)
- EDA tools mention (Cadence, Synopsys, Mentor)
- FlexLM hosting mention
- Export control language in DMP output

### Dr. Yev Transom (CS/ML, GPU Power User)
**My take:** He approved the ML bundle structure and validated that large numbers don't break it. His criticisms are surgical: V100 warning is buried, no mixed compute strategies, GPU-hour conversion is opaque. The ACCESS point hits again. He'd recommend it "with manual adjustments."

**Key asks:**
- Make V100 vs cloud recommendation more prominent
- Support mixed compute (scavenger + guaranteed + burst)
- GPU-hour presets for cloud services
- Spot/preemptible pricing visibility

### Dr. Sela Frindt (Biomedical Engineering, Compliance)
**My take:** She's the compliance expert who validates that tier separation matters, but finds the compliance *metadata* missing. Her service-by-service HIPAA/FDA question list is a roadmap for what to add. She'd use it but needs to follow up with IT to confirm choices.

**Key asks:**
- Explicit compliance markers on services (HIPAA: Yes/No, FDA 21 CFR Part 11: Yes/No, BAA available: Yes/No)
- FDA-specific bundle
- Compliance language in DMP output
- Clearer tier guidance for regulatory (not just data sensitivity)

### Dr. Fenna Kelbrook (Public Health, Dashboard Publisher)
**My take:** The success story. She discovered web hosting exists and is genuinely excited. Her review is a testimonial waiting to happen. Her suggestions are minor polish - make "Environment" category more visible, add Heroku/Vercel comparison.

**Key asks:**
- Make web hosting more discoverable
- Add "hosting" as a searchable concept
- Include sustainability language in web app DMP template

---

## Proposed Changes by Priority

### P0 - Critical (Before Round 2)

#### 1. Add ACCESS Program Callout
**Impact:** 8+ personas mentioned this. Vex says it's the difference between "helpful tool" and "sales tool."

**Proposal:**
- Add prominent callout in Results page: "For large compute projects, consider ACCESS - free national compute resources"
- Link to campus champion and allocation process
- Could be a "service" (consultation type) or just informational callout

**Effort:** Low (informational text, link)

#### 2. Unit Explanations Inline
**Impact:** Tonsley-level users will abandon at Step 6 without this.

**Proposal:**
- Add unit converter in EstimateStep for storage services
- Show: "1 TB = approximately 200,000 photos or 500 hours of HD video"
- Add inline tooltip/helper for each unit type (TB, SU, GPU-hour)

**Effort:** Medium (UI component + content)

#### 3. Tier Examples by Discipline
**Impact:** Tonsley and others were confused about Low vs Medium.

**Proposal:**
- Add collapsible "Examples" section on TierSelectStep
- Discipline-specific: "Medieval manuscript photos = Low", "Unpublished research = Medium", "Patient data = High"
- Maybe 10-15 examples covering sciences, humanities, health, engineering

**Effort:** Low (content + minor UI)

#### 4. Compliance Markers on Services
**Impact:** Frindt, Kelbrook, Vosker all need to know which services are compliant.

**Proposal:**
- Add to service metadata: `compliance: { hipaa: true/false, fda_21_cfr_11: true/false, baa_available: true/false, itar: true/false }`
- Display badges on service cards
- Filter services by compliance need (optional)

**Effort:** Medium (schema change + content audit + UI)

### P1 - High (Major Friction)

#### 5. Archive TB Input Option
**Impact:** Power users (Vex, Transom, Cramble) hate the percentage slider.

**Proposal:**
- Add toggle: "Calculate from percentage" vs "Enter exact TB"
- Default to percentage for most users, but allow override
- Power users can type "5 TB" directly

**Effort:** Medium (UI + logic change)

#### 6. L3/L4 Workflow Clarity
**Impact:** Vosker can't use the tool confidently for defense research without this.

**Proposal:**
- When services show "requires review", add expandable section:
  - Who reviews (cloud-team@, security@, etc.)
  - Typical timeline (2-4 weeks for L3, 4-8 weeks for L4)
  - What to prepare (project description, data classification, etc.)
- For L4, add "Prepare for Consultation" checklist

**Effort:** Medium (content + UI enhancement)

#### 7. Date Selection → Duration
**Impact:** Several personas found date pickers unnecessary.

**Proposal:**
- Default to duration selection (1, 2, 3, 5 years)
- Only show date pickers if user clicks "Set specific dates"
- Most users never need actual dates; they're estimating for proposals

**Effort:** Low (UI simplification)

#### 8. V100 Warning More Prominent
**Impact:** Less experienced ML users might pick on-prem GPUs for LLM work.

**Proposal:**
- Add visual indicator on gpu-cluster service: "Best for: Simulation, FEA, CFD | Consider cloud for: LLM training, large-scale ML"
- In Compare modal, highlight GPU architecture age (V100 = 2017)

**Effort:** Low (content + visual indicator)

### P2 - Medium (UX Improvements)

#### 9. Bundle Renaming/Splitting
**Impact:** "Simulation & FEA" and "Collaborative Research" are too vague.

**Proposal:**
- Rename "Simulation & FEA" → "Simulation & Modeling (GPU)"
- Add "Computational Science (CPU)" bundle (HPC + storage + archive)
- Rename "Collaborative Research Project" → "Multi-Institution File Sharing" or similar
- Add note on ML On-Prem: "V100 GPUs - suitable for simulation, limited for modern LLM training"

**Effort:** Low (YAML changes)

#### 10. "Talk to a Human" Button
**Impact:** Tonsley's biggest request; others would benefit too.

**Proposal:**
- Add persistent help button: "Not sure? Talk to Research Computing"
- Links to consultation service or scheduler
- Visible on every step, not just at the end

**Effort:** Low (UI element + link)

#### 11. Software License Visibility
**Impact:** Vex, Selwick-Mira, others want to know about campus ANSYS, MATLAB, etc.

**Proposal:**
- Add "Campus Software Licenses" informational section
- Not a service to select, but a reference: "These are available at no cost..."
- Link to software documentation

**Effort:** Low (content addition)

#### 12. GPU-Hour / Cloud Presets
**Impact:** Transom wants ML-specific cloud cost examples.

**Proposal:**
- Add presets to AWS/Azure compute:
  - "8x A100 for 100 hrs/mo (~$2,400)"
  - "LLM fine-tuning with spot (~$1,200)"
  - "On-demand H100 crunch (~$8,000)"
- Show conversion helper: "1 GPU-hour ≈ 10 SU on HPC"

**Effort:** Medium (content + preset logic)

### P3 - Nice to Have

#### 13. Multi-Project Session
**Impact:** Vex, Vosker want to compare 3 projects side-by-side.

**Proposal:**
- Add project tab management
- "New Project" creates fresh session alongside existing
- Compare view shows all projects' costs

**Effort:** High (significant architecture change)

#### 14. Power User / Quick Mode
**Impact:** Power users want to skip the wizard entirely.

**Proposal:**
- Add "Quick Entry" mode: select services, enter numbers, get costs
- Skip tier explanation, bundle suggestions, etc.
- For users who know exactly what they need

**Effort:** High (new mode/route)

#### 15. NSF Budget Format Export
**Impact:** Vex mentioned Research.gov format.

**Proposal:**
- Export budget in NSF FastLane/Research.gov compatible format
- Template-based export

**Effort:** Medium (export template)

#### 16. DMP Compliance Language
**Impact:** Frindt wants auto-generated compliance statements.

**Proposal:**
- DMP templates include conditional compliance sections
- "This project uses HIPAA-compliant Azure compute with BAA in place"
- Auto-generated based on tier and service selection

**Effort:** Medium (template logic)

---

## Missing Services to Consider

| Service | Priority | Notes |
|---------|----------|-------|
| **ACCESS Program** | P0 | Free national compute - huge cost savings |
| **Campus Software Licenses** | P1 | Informational, not selectable service |
| **EDA Tools (FlexLM)** | P2 | Cadence, Synopsys hosting mention |
| **Teaching Archive** | P3 | Cheap storage for course materials |

---

## Missing Bundles to Consider

| Bundle | Priority | Contents |
|--------|----------|----------|
| **Computational Science (CPU)** | P1 | HPC + storage + archive (non-GPU) |
| **FDA Regulatory Submission** | P2 | HPC + audit storage + archive + consultation |
| **Teaching/Course Archive** | P3 | Cheap storage only |

---

## Quick Wins (< 2 hours each)

1. Add "Talk to a Human" button (link to consultation)
2. Rename confusing bundles (YAML edit)
3. Add discipline-specific tier examples (content)
4. Add unit explanations as tooltips (small UI)
5. Add ACCESS callout to Results page (content)
6. Add V100 age warning to GPU cluster service (content)
7. Default GrantPeriodStep to duration-only mode

---

## What's Already Working (Don't Break)

From unanimous praise:
- Cost transparency and math accuracy
- Subsidy visibility (scavenger, free allocations)
- DMP technical language ("SLURM", "GPFS" - not dumbed down)
- Storage Only bundle
- Web hosting discovery (Kelbrook's testimonial)
- L4 Restricted acknowledgment
- Auto-save
- No loading spinners between steps

---

## Recommended Round 2 Focus

1. **Test the Compare feature** - Does it help decision-making? (We just built this)
2. **Test unit explanations** - Can Tonsley now complete the wizard?
3. **Test compliance markers** - Does Frindt have enough info now?
4. **Test L3/L4 workflows** - Does Vosker understand the process?
5. **Test ACCESS callout** - Does Vex feel the tool is helping, not selling?

---

## Personal Review Notes

**Strongest feedback:** ACCESS Program missing. This is the single change that would most shift perception from "IT sales tool" to "researcher helper."

**Most emotional feedback:** Tonsley's. Her line "I shouldn't need a computer science degree" is the kind of quote that gets put on slide decks. Fix units for her.

**Most actionable feedback:** Frindt's compliance checklist. She literally listed what metadata each service needs. Do it.

**Best testimonial potential:** Kelbrook's Heroku discovery. This is marketing gold.

**Most skeptical but recoverable:** Vosker. He *wants* this to work for defense research. Give him the workflow clarity and he'll be an evangelist.
