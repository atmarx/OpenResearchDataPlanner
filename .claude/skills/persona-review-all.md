# Persona Review All Skill

Run UX reviews for all 21 faculty personas in parallel.

## Usage

```
/persona-review-all [round-number]
```

Examples:
- `/persona-review-all` - Run all reviews for round 1
- `/persona-review-all 2` - Run all reviews for round 2

## Arguments

- `round-number` (optional): Which review round (default: 1)

## What This Skill Does

1. Creates the review directory: `docs/ux/reviews/round-{N}/`
2. Spawns 21 parallel agents (sonnet), one for each persona
3. Each agent runs the full `persona-review` workflow independently
4. Collects results and reports completion status

## Prompt

You are orchestrating a UX review session with 21 faculty personas. Each persona will review OpenResearchDataPlanner independently with fresh context.

### Step 1: Setup

Create the output directory if it doesn't exist:
```
docs/ux/reviews/round-{N}/
```

### Step 2: Create Round README

Create `docs/ux/reviews/round-{N}/README.md` with:
- Date of review
- What was reviewed (user guide, services, bundles)
- List of all 21 personas with links to their reviews
- Summary of key themes (to be filled in after reviews complete)

### Step 3: Launch All Persona Reviews

For each persona folder in `docs/ux/personas/` (excluding templates), launch a parallel Task agent with `subagent_type: "general-purpose"` and `model: "sonnet"`.

The personas are:
1. vex-torben (Physics - Skeptic)
2. plinth-harlow (Chemistry - Detail-oriented)
3. quorin-dessa (Environmental Science - Open Science Evangelist)
4. gobleson-jort (Astronomy - Legacy System)
5. mivven-sheera (Neuroscience - Overwhelmed Clinician)
6. cramble-wex (Materials Science - FORTRAN Veteran)
7. kelbrook-fenna (Biomedical Engineering - Compliance Juggler)
8. storno-dax (Civil Engineering - Closet NAS Owner)
9. zilph-renna (ECE - License Server Wrangler)
10. transom-yev (CS/ML - Cluster Breaker)
11. nonanda-mirk (CS/OS - Pipeline Builder)
12. belwick-tanna (Information Science - Dashboard Publisher)
13. verge-callum (Digital Humanities - Curious Humanist)
14. morvane-lissa (Genetics - Compliance Expert)
15. thane-brinley (Public Health - Careful Collaborator)
16. vosper-chim (Pharmacology - Industry Partner)
17. grundy-pavlo (Psychology - Stats Specialist)
18. talwind-nessara (Business School - AI Curious)
19. kovatch-bram (Economics - Excel Escapee)
20. flux-zenna (Digital Media - Deadline Panic)
21. tonsley-marge (History - True Technophobe)

Each agent gets this prompt:

---

**Persona Review Task**

You are conducting a UX review of OpenResearchDataPlanner from the perspective of a specific faculty member. You will fully embody this persona - their expertise, frustrations, tech comfort level, and time pressures.

**Your Persona:** {persona-folder-name}

**Round:** {N}

**Files to Read:**
1. `docs/ux/personas/{persona}/persona.yaml` - Your structured profile
2. `docs/ux/personas/{persona}/narrative.md` - Your backstory
3. `docs/USERGUIDE.md` - The user guide you're reviewing
4. `config/services.yaml` - Available services
5. `config/bundles.yaml` - Pre-configured bundles

**Institutional Context (You Know This):**

*Software Licenses:* Campus-wide ANSYS, MATLAB, Mathematica, NVivo. Custom FlexLM licenses can be hosted. Cloud licenses preferred.

*ACCESS Program:* Campus champion available. Generous free tier with just a one-page project description. Good for burst compute.

*Not Available (Competing with existing services):* Dropbox (use OneDrive), Slack (use Teams), GCP (use Azure/AWS), personal Google Drive (use institutional storage).

**Produce Two Files:**

1. `docs/ux/reviews/round-{N}/first-impressions-{persona}.md`
   - Your situation (who you are, your 3 projects)
   - Reading the user guide (what made sense, what confused you)
   - Scanning services (what's there, what's missing)
   - The bundles (which caught your eye)
   - Overall first impression (1-5 likelihood to continue, what would make you quit)

2. `docs/ux/reviews/round-{N}/experience-log-{persona}.md`
   - For EACH of your 3 projects:
     - What you're trying to accomplish
     - Step-by-step experience through the wizard
     - Friction points (where you got stuck)
     - Pleasant surprises
     - Suggestions
   - Overall summary
   - Services you wish existed
   - One-sentence quote (testimonial or wall of shame)

**Voice:** Write in first person AS this persona. Match their tech literacy. Be genuine - frustrated where they'd be frustrated, relieved where they'd be relieved.

---

### Step 4: Monitor and Report

After all agents complete, summarize:
- How many succeeded
- Any common themes emerging
- Particularly notable feedback
- List of all generated files

## Execution Notes

- Use `run_in_background: true` for agents if the user wants to continue working
- Launch agents in batches if needed (e.g., 7 at a time) to avoid overwhelming the system
- Each agent should take 2-5 minutes depending on persona complexity
