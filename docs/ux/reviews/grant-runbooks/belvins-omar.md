# Grant Runbooks: Dr. Omar Belvins

**Department:** Psychology | **Tech level:** Low | **Archetype:** The stats specialist — R on his laptop, surveys in Excel, compute-averse but gets burned when analyses take hours, has FERPA-adjacent student data he doesn't fully understand

---

## Large-Scale Survey Study (N=50,000)

**What I'm trying to do:** NSF grant for a large survey study — 50,000 respondents, demographic data, some sensitive questions.  My advisor said I need a "real" DMP this time after my last one got flagged by the program officer.  I don't really understand what "medium tier" means but I'm going to figure it out.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** I use the questionnaire because I genuinely don't know.  I answer: human subjects? Yes — survey respondents.  Health data? No.  Identifiable? Depends — we have IP addresses and some demographic data.  I'm not sure how to answer.  I click "partially identifiable" or whatever the closest option is.  I end up at **Medium Risk** which seems right — it's not HIPAA but it's not nothing.
3. **Help Me Estimate:** I try the **Statistics / Analysis** calculator.  50,000 respondents, survey data.  The estimate seems low — I'll accept it.
4. **Grant Period:** 3 years.
5. **Services:** I look at the bundles.  Nothing quite matches "survey research."  I browse manually.  **HPC Cluster Allocation** (3,000 SU/month) + **Research Storage** (1 TB active, 0.5 TB archive).
6. **Software:** I check for R/RStudio or Stata.  If they're available institutionally, I need to know.  My current Stata license expires next year.
7. **Retention:** Federal grant standard.
8. **Results:** Export DMP.  I'll have my graduate student review the technical sections.  Export cost breakdown for the budget.

**What I want out of this:** A DMP my program officer won't flag.  A cost estimate that includes the statistical software license I'm always forgetting to budget.

---

## Longitudinal Student Outcomes Study

**What I'm trying to do:** Educational outcomes study using student records — FERPA applies.  Data comes from the registrar under a data use agreement.  I don't fully understand FERPA but the registrar's office said I need "High tier" infrastructure before they'll give me the data.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** High Risk.  The registrar's office told me so.  I click it.  I'll use the questionnaire to confirm: human subjects → student educational records → FERPA → → **High Risk**.  Good.
3. **Help Me Estimate:** Skip.
4. **Grant Period:** 5 years.
5. **Services:** I look at bundles — nothing for "student records."  I'll browse.  I need secure storage — the registrar's office wants to see that the data won't leave the institution.  **Research Storage** in a High-tier environment.
6. **Software:** I need statistical analysis software.  Check the catalog.
7. **Retention:** FERPA student records retention policy.
8. **Results:** DMP with FERPA compliance language.  I need to show this to the registrar before they'll give me the data.  Export and customize — add the data use agreement terms, the registrar contact, and the specific destruction timeline.

**What I want out of this:** A DMP that satisfies the registrar's FERPA requirements.  This is literally a prerequisite for getting the data.

---

## Meta-Analysis Archive

**What I'm trying to do:** Just storing the published effect sizes I've collected for a meta-analysis.  Public literature data.  No compute, minimal storage.  I want to put it somewhere so other researchers can reproduce my meta-analysis.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Published literature data.  Direct click.
3. **Help Me Estimate:** Skip.
4. **Grant Period:** 3 years.
5. **Services:** **Research Storage** — 0.1 TB.  Tiny.
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** A repository location I can cite in the paper as "data available at."  The cost is negligible.

**What I want out of this:** A place to put the data and a citation-ready statement.
