# Experience Log: Dr. Fenna Kelbrook
**Persona:** Dashboard Publisher
**Date:** February 5, 2026
**Scenario:** Planning a grant proposal for a public health dashboard renewal

---

## Project Context

I'm preparing to submit a renewal proposal for my public health dashboard project. Current situation:
- **Project:** Interactive dashboard for state health department
- **Current hosting:** Heroku (I'm paying ~$100/month out of pocket)
- **Tech stack:** Node.js frontend, PostgreSQL database, background data update jobs
- **Data classification:** Medium tier (government data with pre-release restrictions)
- **Grant period:** 2 years (renewal)
- **Team:** Me + PhD student (Amir) + Master's student (Tyler)

I need to budget for proper institutional hosting and figure out sustainability beyond the grant period.

---

## Step 1: Welcome

**Action:** Open OpenResearchDataPlanner, click "Get Started"

**Thought process:** I've heard about this tool from someone in the Bioinformatics department. They use it for genomics stuff. I'm skeptical that it'll have anything for web applications, but worth a look.

**Emotional state:** Low expectations, but curious.

---

## Step 2: Data Classification

**Options presented:**
- Low (publicly releasable)
- Medium (restricted but not regulated)
- High (PHI, HIPAA)
- Restricted (special handling)

**My choice:** Medium

**Reasoning:** The dashboard displays pre-release government data with contractual restrictions. It's not PHI or HIPAA, so not High. But it's definitely not public until the state releases it. Medium fits.

**Thought process:** Okay, this is straightforward. The tier descriptions are clear. No confusion here.

**Concern:** Does the tier choice affect whether web hosting is available? I don't see any indication that it does, but I'm slightly worried I'm about to lock myself out of services.

---

## Step 3: Grant Period

**Action:** Select "2 years" preset, keep default start date (today)

**Thought process:** This is my renewal period. Easy.

**Emotional state:** Still waiting to see if this tool can actually help me.

---

## Step 4: Data Retention

**Options:** NIH (3 years), NSF (3 years), DOE (5 years), Clinical trials (7 years), Custom

**My choice:** This is a state contract, not a federal grant. What do I choose?

**Problem:** None of these options match my funder. The state requires data retention but didn't specify a timeline. I'll probably go with "Custom" and set it to 3 years to match NIH standards, since that's what reviewers generally expect.

**Action:** Select "Custom" and set 3 years after grant end

**Archive slider:** 70% (I'll keep most data but can delete intermediate processing files)

**Thought process:** This is making me think about retention in a way I hadn't. Good prompt. But I wish there was a "state/local government" option or at least guidance for non-federal contracts.

---

## Step 5: Select Services

**Action:** Click on the "Bundles" tab (it's selected by default)

**Scan through bundles:**
- Genomics Pipeline (not me)
- ML/AI Training (not me)
- Clinical/IRB Data (close, but not quite)
- Collaborative Project (maybe?)
- Storage Only (not enough)
- Simulation & FEA (not me)
- **Research Web Application** - WAIT WHAT

**Reaction:** 🎯 This. This is it. "Deploy and host research web applications, APIs, and databases on managed Azure infrastructure with CI/CD pipelines."

**Emotional state:** Suddenly very interested.

**Action:** Click "Apply Bundle: Research Web Application"

**What got added:**
- Web hosting ($150 default)
- NWFiles (1TB for uploads/assets)
- RC Consultation (2 hours)

**Thought process:** This is exactly what I need. The consultation hours are a great touch - I can use those to get help with the deployment pipeline setup. And having file storage bundled in makes sense for user uploads.

**Question:** The default estimate is $150/month. Is that right for my application? I need to understand that better in the next step.

---

## Step 6: Usage Estimates

### Web Hosting Service

**Prompt:** "Estimated monthly Azure spend for your application?"

**Presets:**
- Simple app ($75): Static site or small API, minimal database
- Standard application ($200): Web app with PostgreSQL, moderate traffic
- Complex platform ($500): Multi-service architecture, heavy database use

**My situation:**
- Web app: Yes
- PostgreSQL: Yes
- Moderate traffic: Yes
- Multi-service? Kind of - I have background jobs

**Decision:** I'll go with "Standard application" ($200) to be safe. That's still competitive with what I'm paying on Heroku, and it includes managed PostgreSQL and CI/CD setup.

**Action:** Select $200

**Subsidies section:** No subsidies listed. Makes sense - this is pass-through pricing.

**Acknowledgment panel:** None. Good.

---

### NWFiles Service

**Prompt:** "How much file storage do you need?"

**Default:** 2 TB

**My needs:** The dashboard stores uploaded health data files temporarily. I'd estimate about 500GB max.

**Action:** Adjust to 0.5 TB

**Subsidies:** "First 100GB included via department allocation" (auto-applied)

**Cost:** Should be minimal after the free tier.

---

### RC Consultation Service

**Prompt:** "How many consultation hours do you anticipate needing?"

**Default:** 1 hour

**Presets:**
- Initial consultation only (1 hour)
- Implementation support (5 hours)
- Extended engagement (10 hours)

**My needs:** I want help with:
1. Architecture review for Azure Container Apps vs other options
2. Setting up the CI/CD pipeline in Azure DevOps
3. Migration plan from Heroku
4. Possibly one follow-up session after initial deployment

That sounds like "Implementation support."

**Action:** Select 5 hours

**Subsidies:** "First hour free for each new project" (auto-applied)

**Cost:** 4 hours at $150/hour = $600 one-time

**Thought process:** This is absolutely worth it. Amir graduates next year. Having institutional support for the deployment pipeline means the project doesn't collapse when he leaves.

---

### Archive Storage

The tool shows an estimated archive cost for my retention period. It calculated that 70% of my 0.5TB file storage would be archived at the end of the grant.

**Cost shown:** About $0.18/month for 0.35TB on Cold Archive

**Thought process:** That's so cheap it's almost negligible. Good to know.

---

## Step 7: Results

### Budget Estimate Tab

**Summary cards:**
- Monthly cost: ~$205
- Grant period (2 years): ~$4,920
- Archive (3 years post-grant): ~$6.48
- **Grand total: $4,926.48**

**Thought process:**
- This is about double what I'm currently paying on Heroku ($100/month = $2,400 over 2 years)
- BUT that doesn't include:
  - The fact that I'm paying personally (institutional funding > personal discretionary spend)
  - The consultation hours ($600) which are one-time and incredibly valuable
  - File storage (NWFiles) which I don't currently have
  - The fact that this has institutional support and continuity

If I subtract the consultation ($600) and compare just ongoing costs:
- OpenResearchDataPlanner: $205/month = $4,920 - $600 = $4,320 for 2 years
- Heroku: $100/month = $2,400 for 2 years

So I'm paying about $80/month more for institutional hosting with managed PostgreSQL, CI/CD pipelines, file storage, and support.

**Decision:** That's absolutely worth it. And it's budgetable in a grant.

---

### Cost Breakdown Table

| Service | Monthly | Grant Period | Archive | Total |
|---------|---------|--------------|---------|-------|
| Web hosting | $200 | $4,800 | - | $4,800 |
| NWFiles | ~$2 | ~$48 | $6.48 | ~$54.48 |
| RC Consultation | - | $600 (one-time) | - | $600 |

**Thought process:** The web hosting is the bulk of it. NWFiles is almost free after the department allocation. Consultation is one-time and worth every penny.

---

### Data Management Plan Tab

**Action:** Click "Data Management Plan" tab

**Preview text:**

I see generated sections for:
1. Data storage and backup (NWFiles)
2. Web hosting infrastructure (Azure Container Apps, DevOps, PostgreSQL)
3. Long-term preservation (Cold Archive)

**Specific callouts I notice:**
- It mentions that web applications are hosted on "university-managed Azure infrastructure"
- It references the CI/CD pipeline for reproducibility
- It talks about database backups and disaster recovery
- It mentions the consultation support for sustainability planning

**Reaction:** This is EXACTLY what I need for the sustainability section of my proposal. Reviewers always ask "how will the dashboard remain accessible after the grant ends?" and I've never had a good answer.

Now I can say:
- Hosted on institutional infrastructure (not personal accounts)
- Managed by Research Computing team (not dependent on student labor)
- Budget includes consultation for maintenance planning
- Data retention plan includes archival storage for compliance

**Action:** Click "Copy to Clipboard"

**Emotional state:** Relieved. Actually excited.

---

## Overall Experience

### What Worked

1. **Bundle discovery:** The "Research Web Application" bundle was perfectly named. I found it immediately.

2. **Service descriptions:** The web hosting service description mentioned all the right things: Container Apps, PostgreSQL, CI/CD, Azure DevOps. I knew it was the right fit.

3. **Presets were helpful:** The "Standard application" preset for $200 gave me a good baseline.

4. **Consultation bundled in:** Including RC consultation hours in the bundle is brilliant. That's the piece that makes this sustainable beyond a single student knowing how to deploy.

5. **DMP generation:** The auto-generated DMP text addresses sustainability in a way that's credible for grant reviewers.

6. **Cost transparency:** Pass-through pricing with no overhead is refreshing and easy to justify in budgets.

### What Could Be Better

#### 1. Retention options for non-federal grants
The retention step assumes federal funders (NIH, NSF, DOE) or clinical trials. State and local government contracts, foundation grants, and institutional funding don't fit neatly.

**Suggestion:** Add an "Other" option or clarify that "Custom" is for non-federal funders.

---

#### 2. Multi-environment budgeting
My Heroku setup has dev, staging, and production environments. Do I need to budget for three separate web hosting services? Or is that included?

The tool doesn't make this clear. I'd love guidance like:
- "Budget includes development and production environments"
- OR "For multi-environment deployments, select this service multiple times"

**Current state:** I'm not sure if my $200/month estimate covers just production or all environments.

---

#### 3. Cost drivers for web hosting
The presets help, but I'd love more detail on what drives Azure costs:
- Container Apps vs Functions vs Static Web Apps
- Database size and transaction volume
- Bandwidth/egress costs
- Background job compute time

Maybe a link to a more detailed cost estimator or examples?

---

#### 4. Migration guidance
I have an existing Heroku app. There's no mention of migration support or whether the consultation hours can be used for this.

**Suggestion:** Add a note like "Need to migrate from Heroku, Vercel, or other platforms? RC consultation can help with migration planning and execution."

---

#### 5. Post-grant hosting
The grant period cost is clear. The archive cost is clear. But what about ongoing hosting after the grant ends if I want to keep the application running?

**Suggestion:** Add a note in the results: "For hosting beyond the grant period, contact [email] to discuss options for continued service or migration to long-term institutional hosting."

---

### Emotional Journey

**Start:** Skeptical. "This tool is for HPC people, not for me."

**Bundles step:** Surprised. "Wait, there's a web application bundle?"

**Service details:** Excited. "This is exactly what I need."

**Cost calculation:** Thoughtful. "More expensive than Heroku, but worth it for institutional support."

**DMP generation:** Relieved. "I can actually write a credible sustainability plan now."

**End:** Convinced. "I'm using this for my next grant proposal."

---

## Impact on My Work

### Immediate

I'm going to:
1. Export this budget estimate and paste it into my renewal proposal
2. Use the DMP text for the data management plan section
3. Include a line in the budget justification: "Research web hosting on institutional Azure infrastructure with CI/CD pipeline support - $200/month"

### Medium-term

For my other projects (Open Data Portal Toolkit and Research Data Catalog):
- The toolkit is currently on a personal Vercel account. I can move it to institutional hosting.
- The catalog doesn't exist yet but was planned as a web app. Now I know exactly how to budget for it.

### Long-term

The existence of this service changes how I think about research outputs. Interactive dashboards and data tools are now first-class research products that can be sustained institutionally.

I'm going to tell everyone in my lab about this. And probably everyone in the iSchool.

---

## Key Quotes

> "I've been paying for Heroku out of pocket for three years. I had no idea institutional hosting was even an option. This tool didn't just help me budget - it showed me a service I didn't know existed."

> "The DMP generation is game-changing. Reviewers always ask about sustainability for web applications. Now I have a real answer."

> "The fact that consultation hours are bundled in means this isn't just infrastructure - it's supported infrastructure. That's the difference between a service that works and one that becomes technical debt."

---

## Would I Recommend This Tool?

**Yes. Absolutely.**

Not just for other dashboard publishers, but for anyone doing computational research. The tool is well-designed, the service descriptions are clear, and it solves a real problem (translating research needs into budgetable infrastructure costs).

For my specific use case (web applications), it went from "I didn't know this existed" to "I'm putting this in my grant proposal" in about 10 minutes.

That's a successful tool.
