# Grant Runbooks: Dr. Sela Frindt

**Department:** Biomedical Engineering | **Tech level:** Medium | **Archetype:** The compliance juggler — FDA + hospital + NDAs simultaneously, spends more time on paperwork than research

---

## Cardiac Stent Simulation (FDA Submission)

**What I'm trying to do:** We're running finite element simulations on a cardiac stent design as part of a 510(k) submission.  FDA has specific requirements for how you store and document simulation data.  This is Medium-to-High tier depending on how you look at it — regulatory submission, not patient data directly, but the consequences of getting the data wrong are serious.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** I use the questionnaire carefully.  Not human subjects data directly → regulatory submission context → no patient PHI → export-controlled regulatory documentation → proprietary medical device design → **Medium Risk**.  I write a note to myself: "FDA 510(k) submission data — treat as High anyway, consult research compliance."
3. **Help Me Estimate:** Use the **Batch / HPC Simulation** calculator.  25,000 SU/month, bursty (we run batches for each design iteration).
4. **Grant Period:** 3 years.
5. **Services:** Browse manually.  **HPC Cluster Allocation** (25,000 SU/month) + **Research Storage** (5 TB active, 5 TB archive — equal archive because FDA requires complete audit trail).
6. **Software:** Add **ANSYS** — this is a significant license cost that needs to appear in the budget.
7. **Retention:** Export-controlled regulatory — I need the longest retention option.
8. **Results:** Export DMP — I need it to mention audit trail and data integrity for regulatory purposes.  This will require heavy customization.  Also export cost breakdown for the budget.

**What I want out of this:** A budget that includes ANSYS, a DMP with regulatory data integrity language, and a paper trail I can show an FDA inspector if they ask how I managed my simulation data.

---

## Hospital Collaboration: Implant Analysis

**What I'm trying to do:** Joint project with the hospital to analyze patient imaging data for implant wear patterns.  HIPAA applies.  The hospital IT is involved but I need an infrastructure plan that the IRB coordinator will accept.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** High Risk.  HIPAA patient imaging data.  I click directly — I know this one.
3. **Help Me Estimate:** Use the **Medical Imaging** calculator.  ~100 patient scans, MRI, ~50 GB each = ~5 TB of raw imaging.  Preprocessing adds another 50%.  I estimate 3 TB active conservatively.
4. **Grant Period:** 2 years.
5. **Services:** **Clinical/IRB Data Analysis** bundle as a starting point.  Adjust compute down — we don't need $2,000/month for 100 patients.  Set to $600/month.
6. **Software:** Skip — analysis is done in custom Python.
7. **Retention:** IRB Human Subjects — 7 years.
8. **Results:** DMP text is critical here.  The IRB coordinator wants to see specific language about access controls, audit logging, and who has access to patient data.  Export and customize heavily — add hospital IT's security review process, IRB number, de-identification protocol.

**What I want out of this:** An IRB-acceptable data management plan and a cost estimate that the hospital administration will approve.  The DMP goes to three reviewers so I need it to be thorough.

---

## Undergraduate Design Competition Archive

**What I'm trying to do:** Archive of senior capstone projects — student work, 3D models, design reports.  No IP, no compliance.  I want somewhere reliable to store these so I stop getting emails asking for old project files.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Student coursework.  Direct click.
3. **Help Me Estimate:** Skip.
4. **Grant Period:** 1 year (departmental budget request).
5. **Services:** **Research Storage** — 1 TB active, 1 TB archive.
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** Monthly cost.  I'll include it in a department email asking for storage funding.

**What I want out of this:** A justification I can forward to the department chair.
