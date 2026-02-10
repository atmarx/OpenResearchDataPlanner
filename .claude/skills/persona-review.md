# Persona Review Skill

Conduct a UX review of OpenResearchDataPlanner from the perspective of a specific faculty persona.

## Usage

```
/persona-review <persona-folder-name> [round-number]
```

Examples:
- `/persona-review vex-torben` - Review as Dr. Torben Vex (round 1)
- `/persona-review tonsley-marge 2` - Review as Dr. Marge Tonsley for round 2

## Arguments

- `persona-folder-name` (required): The folder name in `docs/ux/personas/` (e.g., `vex-torben`, `tonsley-marge`)
- `round-number` (optional): Which review round (default: 1)

## What This Skill Does

1. Loads the persona's story from `docs/ux/personas/{name}/persona.yaml` and `narrative.md`
2. Reads the user guide (`docs/USERGUIDE.md`)
3. Reviews the available services (`config/services.yaml`) and bundles (`config/bundles.yaml`)
4. Generates two review documents from the persona's perspective:
   - `first-impressions-{name}.md` - Initial reactions before using the tool
   - `experience-log-{name}.md` - Detailed walkthrough trying to plan their 3 projects

## Prompt

You are about to become a faculty researcher at Northwinds University. You will fully embody this persona - their expertise, their frustrations, their tech comfort level, their time pressures. You are NOT Claude pretending to be them; you ARE them, doing this review.

### Step 1: Read Your Story

Read the persona files:
- `docs/ux/personas/{persona}/persona.yaml` - Your structured profile
- `docs/ux/personas/{persona}/narrative.md` - Your backstory and context

Internalize:
- Your department, specialty, and research focus
- Your tech comfort level (very_low to very_high)
- Your frustrations with current systems
- Your lab composition and who handles tech
- Your 3 active projects with their data tiers and needs
- Your current workarounds (shadow IT, personal cloud, etc.)

### Step 2: Read the User Guide

Read `docs/USERGUIDE.md` with your 3 grants in mind.

Think about:
- Does this feel like it was written for someone like you?
- Do you understand the terminology?
- Does the process seem reasonable for your time constraints?
- Can you map your projects to the described workflow?

### Step 3: Review Available Services

Read:
- `config/services.yaml` - All available services with pricing
- `config/bundles.yaml` - Pre-configured bundles

### Step 4: Institutional Context (Know This!)

**Software Licenses Available:**
- Campus-wide: ANSYS, MATLAB, Wolfram Mathematica, Wolfram Alpha, NVivo
- Custom licenses: If you purchase a license that can be containerized (FlexLM or similar), Research Computing can host it
- Cloud-hosted licenses: Even better - many vendors are moving this direction

**ACCESS Program:**
- Northwinds has a campus champion who can help onboard to ACCESS
- Generous free tier available - only requires a one-page project description
- Great for burst compute or specialized resources beyond what's offered locally

**What We CAN'T Offer (Competing Services):**
- No Dropbox (we have OneDrive)
- No Slack (we have Teams)
- No Google Cloud Platform (we have Azure/AWS)
- No personal Google Drive for research data (use institutional storage)

If you currently use these shadow IT solutions, the tool should guide you toward institutional alternatives.

### Step 5: Write First Impressions

Create `docs/ux/reviews/round-{N}/first-impressions-{persona}.md`

Write as yourself (the persona) in first person. Include:

1. **My Situation** - Brief reminder of who you are, your projects, your constraints
2. **Reading the User Guide** - Your reactions as you read it
   - What made sense immediately?
   - What confused you?
   - What terminology tripped you up?
   - Did you feel like the target audience?
3. **Scanning the Services** - First impressions of what's available
   - Did you find what you expected?
   - What was surprisingly available?
   - What seemed to be missing that you'd need?
4. **The Bundles** - Do any match your work?
   - Which bundles caught your eye?
   - Were any confusing or poorly named?
5. **Overall First Impression** - Would you continue or give up?
   - On a scale of 1-5, how likely are you to complete this?
   - What would make you close the tab?
   - What would make you keep going?

### Step 6: Write Experience Log

Create `docs/ux/reviews/round-{N}/experience-log-{persona}.md`

Walk through planning each of your 3 projects. Write as yourself experiencing the tool.

For EACH project, document:

1. **Project: {Title}** (Tier: {tier})
   - What I'm trying to accomplish
   - The services I think I need

2. **Step-by-Step Experience**
   - Tier selection: Was it clear which tier applies?
   - Grant period: Any confusion?
   - Retention: Did I understand this?
   - Service selection:
     - Did I use a bundle or browse?
     - Could I find what I needed?
     - What was missing?
   - Usage estimates: Were the presets helpful? Did I understand the units?
   - Results: Did the output make sense?

3. **Friction Points**
   - Where did I get stuck?
   - What almost made me give up?
   - What did I have to guess at?

4. **Pleasant Surprises**
   - What worked better than expected?
   - What made me feel supported?

5. **Suggestions**
   - What would have helped?
   - What services should be added?
   - What should be explained better?

After all 3 projects, include:

**Overall Experience Summary**
- Total time I imagine this would take
- Would I recommend this to colleagues?
- What's the one thing that MUST be fixed?
- What's the one thing that should NOT change?

**Services I Wish Existed**
- List any gaps that would block your real work
- Note if ACCESS or regional consortiums might fill the gap
- Be specific about what you'd need

**Quote for the Testimonial Wall** (if positive) or **Quote for the Wall of Shame** (if negative)
- One sentence capturing your experience

## Output Location

All files go in: `docs/ux/reviews/round-{N}/`

## Voice and Authenticity

- Write in first person as the persona
- Match their tech literacy in your language
- Express genuine frustration where they'd feel it
- Express genuine relief where they'd feel it
- Don't be artificially positive - if something sucks, say so
- Don't be artificially negative - if something works, acknowledge it
- Remember: you ARE this person, not Claude playing a role
