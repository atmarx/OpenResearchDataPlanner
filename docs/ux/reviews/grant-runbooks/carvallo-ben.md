# Grant Runbooks: Dr. Ben Carvallo

**Department:** Epidemiology | **Tech level:** Medium | **Archetype:** The careful collaborator — works with state health departments, understands that "de-identified" doesn't mean "not sensitive"

---

## State Health Department Disease Modeling

**What I'm trying to do:** CDC-funded project with the state health department.  De-identified disease surveillance data under a data use agreement.  The DUA says I can't publish without state review.  Medium tier — not PHI, but still sensitive.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** I use the questionnaire because "de-identified but under DUA" is genuinely ambiguous.  I answer: human subjects? Technically de-identified — I'll say no.  Government data? Yes.  Data use agreement? Yes.  Pre-publication restrictions? Yes.  No export controls.  No proprietary. → **Medium Risk**.  Correct — the DUA and pre-publication restrictions push this to Medium even though the data is de-identified.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  20,000 SU/month, bursty.
4. **Grant Period:** 3 years.
5. **Services:** **HPC Cluster Allocation** (20,000 SU/month) + **Research Storage** (5 TB active, 3 TB archive).
6. **Software:** Add **R/RStudio** or statistical analysis packages if available.
7. **Retention:** Federal grant standard.
8. **Results:** DMP with language about data use agreements, state review process before publication, and data destruction timeline.  The state health department will review this DMP before I can start the project.  Export and customize with specific DUA terms.

**What I want out of this:** A DMP my state health department partner will approve, and a cost estimate for the CDC grant proposal.

---

## Published COVID Retrospective

**What I'm trying to do:** Already-published retrospective study on COVID outcomes — all data fully de-identified and published.  I want a long-term archive of the underlying dataset for reproducibility.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Published, fully de-identified.  Direct click.
3. **Help Me Estimate:** Skip.
4. **Grant Period:** 5 years.
5. **Services:** **Cold Archive Storage** — 2 TB.  This needs to be accessible but doesn't need to be fast.
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** Cost for 5-year archive.  I'll include this in the paper as "dataset is archived at [repository] with funding from [grant]."

**What I want out of this:** A 5-year archive cost I can cite in the paper.

---

## CDC Wastewater Surveillance

**What I'm trying to do:** Partnership with CDC on wastewater epidemiology.  Pre-publication data from CDC's National Wastewater Surveillance System.  Medium tier due to government partnership pre-publication agreement.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Government partnership with pre-publication agreement.  I know this without the questionnaire.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  12,000 SU/month, sustained — we're processing incoming surveillance data continuously.
4. **Grant Period:** 2 years.
5. **Services:** **HPC Cluster Allocation** (12,000 SU/month) + **Research Storage** (3 TB active, 2 TB archive).
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** DMP needs to address the CDC partnership and pre-publication review requirements.  Export and customize with the CDC collaboration language.

**What I want out of this:** A DMP CDC will approve and a budget for the cooperative agreement.
