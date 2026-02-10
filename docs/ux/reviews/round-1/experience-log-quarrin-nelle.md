# Experience Log: Dr. Nelle Quarrin

**Date:** February 5, 2026
**Reviewer:** Dr. Nelle Quarrin, Neuroscience
**Project:** Clinical fMRI Alzheimer's Biomarker Study (R01 grant due Friday)
**Session Duration:** ~15 minutes (interrupted twice)

---

## Background / Mindset

It's Wednesday. Grant due Friday. I still don't have computing costs in my budget and my Program Officer keeps asking about my Data Management Plan. Maya (my PhD student) said there's a new tool that might help but honestly I'm skeptical. I have 30 minutes blocked on my calendar but clinic is running late so realistically I have maybe 10 minutes.

I'm sitting in my office with my fourth coffee of the day. Let's see if this actually helps or if I should just call the RC help desk like usual.

---

## Step 1: Welcome Screen

**Time: 0:00**

Okay, tool loads. "Welcome to OpenResearchDataPlanner" - fine, whatever. "Get Started" button. Click.

**First thought:** It remembered my last session? I've never used this before. Oh wait, maybe I clicked this link last week when Maya sent it and got distracted. Good that it saves I guess.

**Action:** Click "Start Over" because I don't remember what that was.

---

## Step 2: Data Classification

**Time: 0:30**

**Screen shows:**
- Low tier: "publicly releasable"
- Medium tier: "some restrictions"
- High tier: "Contains PHI, HIPAA data"
- Restricted tier: "special handling"

**My thought process:**
- This is PHI. Definitely PHI.
- Click "High"
- It says "High tier is common for clinical research, patient data, or anything under IRB"
- YES. That's me. Good.

**Concern that pops up:** Is someone going to review this? Like, can I mess this up and accidentally plan for the wrong tier?

**What I wish was here:** A note like "Your IRB number: _______" or "Confirm with IRB coordinator: [email]"

**Action:** Select "High" and click Next.

**Elapsed time: 1 minute**

---

## Step 3: Grant Period

**Time: 1:30**

**Screen shows:** 1, 2, 3, or 5 years. Custom option.

**My thought:** R01 is 4 years. Do I click 5 years? Or Custom?

**Action:** Click "Custom" - it shows date pickers. Start date: July 1, 2026 (when the grant starts, hopefully). End date: June 30, 2030.

**That was easy.** Next.

**Elapsed time: 2 minutes**

---

## Step 4: Data Retention

**Time: 2:15**

**Screen asks:** "How long must you keep data after the grant ends?"

**My brain:**
- IRB says 7 years
- NIH says 3 years after final report
- Which one wins?
- Probably 7 years to be safe

**I see a dropdown:**
- NIH Standard (3 years)
- Clinical Trial (7 years)
- Custom

**Action:** Click "Clinical Trial (7 years)" - it's IRB human subjects research so probably counts as clinical trial?

**Then it shows an "Archive ratio slider":**
- "What percentage of your active data will you archive?"
- Default is 100%

**My confusion:** Can I delete PHI? Isn't that... not allowed? I thought we had to keep everything?

**What I wish was here:** "For HIPAA data, consult your IRB protocol for retention requirements. Most protocols require 100% retention."

**Action:** Leave it at 100% because I'm not risking deleting patient data.

**Elapsed time: 3 minutes**

*[Phone rings - clinic calling about a patient. 4-minute interruption.]*

---

## Step 5: Select Services (RESUMED)

**Time: 7:00**

Okay, back to this. Where was I? Oh right, selecting services.

**I see two tabs:**
- "Bundles (Recommended)"
- "Browse Services"

**Bundles shown:**
- Storage Only
- Genomics Pipeline
- ML/AI Training
- **Clinical/IRB Data Analysis** ← THIS ONE
- Collaborative Project

**Immediate reaction:** THANK YOU. Just tell me what to use. I don't want to think about this.

**Click "Clinical/IRB Data Analysis"**

**Popup shows:**
- "Secure cloud compute and storage for human subjects research data under IRB protocol"
- Services included:
  - Azure Compute ($2000/month default)
  - Research Storage (10TB default)
- "Apply Bundle" button

**My concerns:**
1. **$2,000/month is $24,000/year** - that seems REALLY high for my budget
2. **Why Azure and not the HPC cluster?** We currently use the HPC cluster
3. **10TB** - I need 6TB active + 6TB archive, so is 10TB enough?

**What I do:** Hover over the "View requirements" link (I don't see one). Look for more info. Don't see anything.

**Action:** Click "Apply Bundle" because what else am I supposed to do?

**Next screen:** "Browse Services" tab now shows Azure Compute and Research Storage with checkmarks.

**Elapsed time: 9 minutes**

---

## Step 6: Usage Estimates - Azure Compute

**Time: 9:30**

**Screen shows:**
- "Estimated monthly Azure spend?"
- Slider or input box: default is $2000
- Quick presets:
  - Light usage: $200
  - Moderate usage: $1000
  - Heavy usage: $5000

**My brain:**
- I have NO IDEA what I currently spend
- Mika set up the analysis pipeline
- It runs overnight on the cluster
- Is $2000 reasonable? Is it crazy?

**What I desperately need here:**
- "Clinical fMRI analysis typically costs $X per subject"
- "For 60 patients, estimate $Y"
- Or: "Contact computing@northwinds.edu to discuss your specific needs"

**What I do:**
- Stare at the screen
- Think about my budget ($150K total over 4 years)
- $2000/month = $96K over 4 years
- That's most of my budget
- That can't be right

**Action:** Click "Moderate usage ($1000)" and hope for the best.

**Subsidy checkbox:** "Apply for Azure research credits"
- I check it because free money

**Elapsed time: 11 minutes**

---

## Step 6 continued: Usage Estimates - Research Storage

**Time: 11:30**

**Screen shows:**
- "How much active storage do you need?"
- Default: 10TB
- Presets: Small (1TB), Medium (10TB), Data-intensive (100TB)
- Input field to customize

**My data:**
- 60 patients
- Each fMRI scan = ~100GB raw data
- That's 6TB raw
- Then preprocessed data, analysis results, maybe another 2-3TB?
- Call it 8TB to be safe

**Archive:**
- Below the input, I see "Archive storage: 8TB" (automatically calculated)
- It says "Cold Archive Storage: $0.50/TB/month"

**Action:** Enter "8" in the input field.

**Math check in my head:**
- Active: 8TB × $5/month = $40/month
- But wait, first 500GB free, so 7.5TB × $5 = $37.50/month
- Archive: 8TB × $0.50/month = $4/month
- Active for 4 years = $37.50 × 48 = $1,800
- Archive for 7 years = $4 × 84 = $336
- Total storage = ~$2,136

**Okay that seems... reasonable?**

**Elapsed time: 13 minutes**

*[Maya knocks on door - question about lab meeting. 2-minute interruption.]*

---

## Step 7: Results

**Time: 15:30**

**Back to screen. Click "Next"**

**Results page loads:**

### Budget Tab

**Shows:**
- Monthly cost during grant: $1,037.50
- Total grant period (4 years): $49,800
- Archive cost (7 years post-grant): $336
- **Grand total: $50,136**

**Breakdown table:**
- Azure Compute: $1,000/month × 48 months = $48,000
- Research Storage: $37.50/month × 48 months = $1,800
- Cold Archive: $4/month × 84 months = $336

**My reaction:**
- Wait, $50K is a third of my entire grant budget
- Is that normal?
- Should I apply for a bigger budget?
- Or am I overestimating compute?

**What I need here:**
- "This is typical for clinical imaging studies" OR
- "This seems high - schedule a consultation: [link]"
- Some kind of sanity check

**Action:** Click "Export Budget (Markdown)" - downloads a .md file. Good, I can paste that into my grant.

### DMP Tab

**Click "Data Management Plan" tab**

**Shows rendered text:**
- Talks about Azure compute for HIPAA compliance
- Mentions audit logging
- Storage with encryption
- Archive plan

**My reaction:**
- This is... actually really good?
- It's written in grant language
- Mentions HIPAA specifically
- I could literally paste this into my DMP section

**What I wish it included:**
- My IRB number (maybe an input field earlier?)
- Specific data retention policy (7 years)
- How we'll handle de-identification

**Action:** Click "Copy to Clipboard" and paste into my grant doc. I'll edit it later.

**Elapsed time: 18 minutes**

---

## Final Actions

**I see buttons:**
- "Start Over"
- "Export Session (JSON)"
- Contact info: "Questions? Email researchcomputing@northwinds.edu"

**What I do:**
- Export session as backup
- Close the browser
- Stare at my grant budget and wonder if $50K is really right

---

## Post-Session Thoughts

### What Actually Happened

I got through it. I have numbers. I have DMP text. That's more than I had 20 minutes ago.

### What Worked

1. **The bundle.** I didn't have to think about what services I need. It just told me.
2. **Auto-save.** Got interrupted twice and it didn't lose my place.
3. **DMP text generation.** That's genuinely useful and well-written.
4. **Archive calculation.** It figured out the 7-year retention cost for me.

### What Made Me Anxious

1. **No confirmation I'm doing this right.** Am I supposed to talk to someone? Is this just a planning tool or is this binding?
2. **$50K seems really high.** Is that normal? Should I be worried?
3. **HIPAA compliance.** It says "HIPAA-compliant" but I don't actually know what that means I have to do.
4. **Computing estimates.** I guessed $1000/month. Is that right? Too high? Too low?

### What Would Have Helped

1. **Validation / sanity check:** "For a clinical imaging study with 60 subjects, $X-Y is typical"
2. **Clear next steps:** "After using this tool, email your plan to RC team for review"
3. **HIPAA requirements:** A link to "what you need to do for High tier data" - not just "pick High tier"
4. **Example projects:** "See an example: Clinical fMRI study"
5. **Help link more prominent:** I saw the email at the bottom but I want it at the TOP when I'm confused

---

## Would I Recommend This?

**To a colleague?** Yes, with caveats.

**The caveats:**
- "Use it to get ballpark numbers, then call RC to verify"
- "The bundle approach is great but you still need to understand what you're picking"
- "Budget extra time for questions"

**To admin?** Yes, this is genuinely helpful.

**What would make it essential:**
- Required consultation for High tier (build it into the workflow)
- Example cost ranges for common project types
- Integration with grant submission (wouldn't that be nice)

---

## Action Items (For Me)

- [ ] Email researchcomputing@northwinds.edu: "Used the planner, got $50K estimate for 4-year clinical fMRI study. Is that reasonable?"
- [ ] Review DMP text and customize with IRB details
- [ ] Decide if I need to increase my budget ask or reduce compute estimates
- [ ] Actually understand what "Azure compute" means vs HPC cluster

**Current status:** Numbers in grant, but not confident. Will follow up with RC team.

---

**Total time:** 18 minutes (not counting interruptions)

**Completion status:** Finished but anxious

**Would use again:** Yes, but would call someone first next time
