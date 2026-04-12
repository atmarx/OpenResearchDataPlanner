# Grant Runbooks: Dr. Andras Volgin

**Department:** Economics | **Tech level:** Medium | **Archetype:** The Excel escapee — Stata and Excel macros don't scale, wants bigger compute but doesn't want to become a programmer

---

## Agent-Based Market Simulation

**What I'm trying to do:** NSF grant for agent-based economic modeling.  My simulation models have 10 million agents and run for days.  Proprietary model architecture — I don't publish it until I get the paper out.  I've been running these on my workstation and it's agonizing.  Need to scale up.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Proprietary model.  Direct click.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  25,000 SU/month, bursty — I run model batches, then analyze, then run again.
4. **Grant Period:** 3 years.
5. **Services:** **HPC Cluster Allocation** (25,000 SU/month) + **Research Storage** (3 TB active, 2 TB archive).
6. **Software:** Check for NetLogo, Mesa, or any ABM platforms.  Also Stata — I analyze outputs in Stata.
7. **Retention:** Federal grant standard.
8. **Results:** Export cost breakdown.  This goes into the NSF budget as "computing costs."  Also export DMP — I need to address what happens to the model code after the grant ends (I'll release it eventually).

**What I want out of this:** A cost estimate that justifies moving from my workstation to the cluster, and a DMP that buys me time to decide when to open-source the model.

---

## Public Policy Impact Dataset

**What I'm trying to do:** Long-term storage for government data I've collected — public records, policy databases.  This is all public domain.  I just need a place to keep it that isn't a USB drive.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Government data, public record.  Direct click.
3. **Help Me Estimate:** Skip.
4. **Grant Period:** 5 years.
5. **Services:** **Cold Archive Storage** — 2 TB.  This doesn't need to be fast.
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** 5-year archive cost.  I'll include it in a grant as "data maintenance costs."

**What I want out of this:** A defensible storage line item.

---

## Fed Reserve Collaboration

**What I'm trying to do:** Working with the Federal Reserve on pre-publication macroeconomic modeling.  Sensitive timing — if our model outputs leak before the Fed publishes their policy decisions, that's a problem.  Medium tier, strict about access.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  I'll use the questionnaire for this one — the Fed collaboration is unusual enough that I want to be deliberate.  Government partner? Yes.  Pre-publication with timing sensitivity? Yes.  No export controls.  No PHI. → **Medium Risk**.
3. **Help Me Estimate:** **Batch / HPC Simulation** calculator.  15,000 SU/month, bursty.
4. **Grant Period:** 2 years.
5. **Services:** **HPC Cluster Allocation** (15,000 SU/month) + **Research Storage** (4 TB active, 3 TB archive).
6. **Software:** Stata — I need it on the cluster, not just my laptop.
7. **Retention:** Federal grant standard.
8. **Results:** DMP with strong access control and timing language.  The Fed will want to see that I understand the sensitivity of pre-publication policy data.  Export and customize with the Fed's specific review requirements.

**What I want out of this:** A DMP the Federal Reserve collaboration team will approve, and a cost estimate for the external funding source.
