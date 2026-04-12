# Grant Runbooks: Dr. Torben Vex

**Department:** Physics | **Tech level:** High | **Archetype:** The skeptic — Linux greybeard, compiles his own kernels, hoping this tool respects his time

---

## Novel High-Entropy Alloy Simulations

**What I'm trying to do:** I have an NSF Materials grant coming up for LAMMPS-based molecular dynamics on novel high-entropy alloys.  The university tech transfer office says there's potential patent exposure so this isn't open data.  I need a cost estimate that doesn't embarrass me in front of program officers who know what HPC actually costs.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Skip the questionnaire — I know what I'm doing.  Click **Medium Risk** directly.  The tooltip says "proprietary, IP-sensitive" — yes, that's correct.
3. **Help Me Estimate:** Open the **Batch / HPC Simulation** calculator.  Enter 50,000 SU/month sustained over 3 years.  Note the compute estimate.
4. **Grant Period:** 3 years.
5. **Services:** Skip bundles.  Browse services manually.  Select **HPC Cluster Allocation** (50,000 SU/month) + **Research Storage** (8 TB active, 5 TB archive).  I don't need Azure.
6. **Software:** Lammps is open source, no license needed.  Skip.
7. **Retention:** Federal grant standard — 3 years post-grant.
8. **Results:** Export budget breakdown as Markdown.  Copy DMP text — I'll gut it and rewrite, but the storage retention language is boilerplate I'm not going to type myself.

**What I want out of this:** A defensible cost table for the budget justification.  The DMP section I'll edit heavily but the compute and storage numbers need to be real.

---

## PHYS 480 Computational Lab Archive

**What I'm trying to do:** Course materials for my computational physics lab.  Student assignments, simulation examples, no IP concerns.  I mostly want this off my office hard drive and somewhere the university can be responsible for it.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  This is student coursework.  Click it directly.
3. **Help Me Estimate:** Skip — I know I have 2 TB.
4. **Grant Period:** 1 year (course infrastructure, not a grant — I'll use the 1-year option as a proxy).
5. **Services:** Storage only.  Select **Research Storage** — 2 TB active, 2 TB archive.  No compute.
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** I mostly want the monthly cost figure.  Export it.  I'll use it to justify a line item in my department budget request.

**What I want out of this:** A dollar figure I can put in a budget email.  Not interested in the DMP for course materials.

---

## OpenKIM Interatomic Potential Validation

**What I'm trying to do:** Open science collaboration with the NSF-funded OpenKIM project.  All data and code will be public.  I need compute for running validation tests on interatomic potentials — bursty pattern, not sustained.  This is a supplement to a colleague's grant so the budget section needs to be clean.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Open collaboration, all data public.  Direct click.
3. **Help Me Estimate:** Use the **Batch / HPC Simulation** calculator.  Bursty pattern, ~10,000 SU/month peak.  Note the estimate.
4. **Grant Period:** 2 years.
5. **Services:** **HPC Cluster Allocation** (10,000 SU/month) + **Research Storage** (1 TB active, 1 TB archive).
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** Export budget breakdown.  I'll use the DMP text as a starting point — OpenKIM collaboration requires a data sharing statement and the boilerplate here is close enough to adapt.

**What I want out of this:** Budget numbers for the supplement request, and a data sharing statement I can adapt to reference the OpenKIM repository directly.
