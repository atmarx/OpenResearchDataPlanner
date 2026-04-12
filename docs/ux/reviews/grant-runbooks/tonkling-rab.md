# Grant Runbooks: Dr. Rab Tonkling

**Department:** Civil Engineering | **Tech level:** Medium | **Archetype:** The practical engineer — closet NAS, knows it's a fire hazard, just wants someone to tell him what to do and how much it costs

---

## Seismic Retrofit Analysis (State DOT)

**What I'm trying to do:** State Department of Transportation contract for seismic retrofit analysis on bridge infrastructure.  Pre-publication government contract data — the DOT wants to review before I publish anything.  I need compute and storage on legitimate infrastructure, not on the NAS in my closet.  If my hard drive fails I lose 3 years of simulation results and a contract.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Government contract with pre-publication restrictions.  I think about using the questionnaire but just click Medium directly.  I'm an engineer, I can read the description.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  35,000 SU/month, bursty — we run big simulations when we hit a design iteration, then nothing for two weeks.
4. **Grant Period:** 3 years.
5. **Services:** **HPC Cluster Allocation** (35,000 SU/month) + **Research Storage** (6 TB active, 4 TB archive).  I look at the bundles but nothing matches a DOT contract scenario — I go manual.
6. **Software:** Add any FEA packages — check if the institution has licenses.
7. **Retention:** Federal grant standard.
8. **Results:** Export cost breakdown.  I need to justify compute costs in the contract proposal — the DOT procurement officer wants to see that we've thought about it.  Also export DMP — I'll adapt it for the data use agreement with DOT.

**What I want out of this:** A cost estimate I can put in a government contract and a data management section for the DUA with DOT.  And a reason to finally decommission the closet NAS.

---

## Historical Earthquake Data Repository

**What I'm trying to do:** USGS public data — decades of earthquake records I've been using for research.  I want to set up a proper institutional copy so I stop downloading it from USGS every time I need it.  Internal budget justification, not a grant.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Public USGS data.  Direct click.
3. **Help Me Estimate:** Skip.
4. **Grant Period:** 5 years.
5. **Services:** **Cold Archive Storage** — 4 TB active, 4 TB archive.  This doesn't need to be fast storage.
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** Monthly cost.  I'll use it to argue for a line item in the department computing budget.

**What I want out of this:** A number I can email to the department chair.  5-year total would be ideal.

---

## Bridge Sensor Network Analysis

**What I'm trying to do:** Bridge sensor network — real-time structural health monitoring data.  Infrastructure security concerns because if you publish which bridges are showing stress anomalies before they're repaired, bad things can happen.  Medium tier.  Moderate compute, sustained pattern.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Infrastructure security — I'll use the questionnaire this time because "infrastructure data" is an unusual category.  I answer: not human subjects → government partnership → pre-publication restrictions → no export controls → infrastructure security sensitivity → **Medium Risk**.  Good.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  12,000 SU/month, sustained.
4. **Grant Period:** 2 years.
5. **Services:** **HPC Cluster Allocation** (12,000 SU/month) + **Research Storage** (3 TB active, 2 TB archive).
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** Export cost and DMP.  The DMP needs a note about responsible disclosure of infrastructure anomalies — I'll add that paragraph myself.

**What I want out of this:** Budget for the grant proposal and a starting DMP.  The infrastructure security angle is something I'll need to write myself — the tool won't know that.
