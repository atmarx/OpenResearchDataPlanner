# Grant Runbooks: Dr. Jort Gobleson

**Department:** Astronomy | **Tech level:** Medium | **Archetype:** The legacy system — 8 external drives in his office, knows this is bad, hasn't had time to fix it, finally being forced to document his data situation

---

## Transient Survey Pipeline

**What I'm trying to do:** NSF grant for the automated pipeline that detects transients in nightly telescope data.  Unpublished observations — competitive field, if another group scoops us before we publish we lose years of work.  The pipeline runs every night and churns through a lot of data.  I need compute and storage budgeted properly so I stop explaining to the grants office why I'm going over budget.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Unpublished observations, scoop risk.  I'll just click it directly — I've thought about this.
3. **Help Me Estimate:** Use the **Batch / HPC Simulation** calculator.  25,000 SU/month, sustained.  The pipeline runs nightly whether or not I'm paying attention.
4. **Grant Period:** 3 years.
5. **Services:** **HPC Cluster Allocation** (25,000 SU/month) + **Research Storage** (12 TB active, 8 TB archive).
6. **Software:** Skip — pipeline is custom Python.
7. **Retention:** Federal grant standard.
8. **Results:** Export both budget and DMP.  The DMP should mention automated data processing pipelines — I'll check if it does.  If not, I'll add a sentence.

**What I want out of this:** Budget numbers for the grant and a DMP that mentions the pipeline.  Also some moral authority to tell my grad students that the data has to go somewhere real, not on the external drives stacked under my desk.

---

## Legacy Observation Archive (1998–2015)

**What I'm trying to do:** I have 30 TB of historical observations from 1998–2015.  All published.  Some of it is on tapes I can't read anymore.  I got a small internal grant to finally digitize and properly archive this.  I need a cost estimate to justify the storage request.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Published historical data.  Direct click.
3. **Help Me Estimate:** Skip — I know the numbers: 30 TB active (post-digitization), 30 TB archive (redundant copy).
4. **Grant Period:** 10 years — I want this data to outlive me.  I'll use a custom date range.
5. **Services:** **Research Storage** + **Cold Archive Storage**.  30 TB active, 30 TB deep archive.
6. **Software:** Skip.
7. **Retention:** Federal grant standard — but I want to note that these are observations that should be preserved indefinitely.
8. **Results:** Cost breakdown only.  I'll take the 10-year archive cost to the internal grant committee and say "this is what preservation actually costs."

**What I want out of this:** A number I can defend to a committee that thinks external hard drives are a valid backup strategy.

---

## Citizen Science Image Classification

**What I'm trying to do:** NSF public engagement supplement — volunteers classify telescope images on a web portal.  All data is meant to be shared.  Light compute, small storage.  I mostly need the DMP to satisfy the data sharing requirement.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Public engagement, all data open.  Direct click.
3. **Help Me Estimate:** Use the **Batch / HPC Simulation** calculator.  3,000 SU/month, bursty.
4. **Grant Period:** 2 years.
5. **Services:** **HPC Cluster Allocation** (3,000 SU/month) + **Research Storage** (2 TB active, 1 TB archive).
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** DMP is the main goal here.  The NSF supplement requires a data sharing plan and I want language that mentions the public portal.  Export and customize.

**What I want out of this:** NSF-compliant data sharing language.  The cost estimate is secondary for a supplement — they mostly want to see that I've thought about data management.
