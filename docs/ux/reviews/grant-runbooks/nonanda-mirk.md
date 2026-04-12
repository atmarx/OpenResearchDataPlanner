# Grant Runbooks: Dr. Mirk Nonanda

**Department:** Computer Science / OS | **Tech level:** Very High | **Archetype:** The pipeline builder — builds the infrastructure others use, skeptical of self-service tools, will try this because it generates DMP text he doesn't want to write

---

## Custom Kernel Development Pipeline

**What I'm trying to do:** NSF grant for open source kernel research — custom OS development, all code public on GitHub.  Heavy compute for kernel testing and continuous integration runs.  The DMP is trivial (everything is open), but I need cost numbers for the budget.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Open source, all public.  Direct click.  Skipping the questionnaire.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  40,000 SU/month, sustained (CI runs constantly).
4. **Grant Period:** 3 years.
5. **Services:** **HPC Cluster Allocation** (40,000 SU/month) + **Research Storage** (3 TB active, 2 TB archive).
6. **Software:** Skip — everything is open source.
7. **Retention:** Federal grant standard.
8. **Results:** Export cost breakdown and DMP.  The DMP for an open-source project should be one sentence: "All code is publicly available on GitHub."  I'll check if the generated text is that clean or if I need to edit it down.

**What I want out of this:** A budget I can defend to NSF.  DMP I can edit to point at the GitHub repo.

---

## OS Course Infrastructure (CS 450)

**What I'm trying to do:** Teaching infrastructure for my operating systems course — student VMs, course tooling, no research data.  I need a departmental budget line for the semester compute costs.  Students break things constantly.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Student VMs, no sensitive data.  Direct click.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  15,000 SU/month, seasonal — heavy during semesters, nothing over summer.
4. **Grant Period:** 1 year.
5. **Services:** **HPC Cluster Allocation** (15,000 SU/month, seasonal) + **Research Storage** (2 TB).
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** Monthly cost during the semester.  I'll use this in the department budget request.  No DMP needed.

**What I want out of this:** Cost-per-semester for the department chair.

---

## Compiler Optimization Research

**What I'm trying to do:** NSF grant for compiler optimization — pre-publication research in a competitive field.  Medium tier.  4-year project.  Heavy but bursty compute pattern.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Pre-publication competitive research.  Direct click.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  30,000 SU/month, bursty.
4. **Grant Period:** 4 years.
5. **Services:** **HPC Cluster Allocation** (30,000 SU/month) + **Research Storage** (4 TB active, 3 TB archive).
6. **Software:** Skip — LLVM/clang toolchain is open source.
7. **Retention:** Federal grant standard.
8. **Results:** Export cost breakdown and DMP.  The DMP needs to address reproducibility — I'll add a section about archived compiler toolchain snapshots and benchmark suites.

**What I want out of this:** Budget numbers and a DMP scaffold.  I'll add the reproducibility details myself.
