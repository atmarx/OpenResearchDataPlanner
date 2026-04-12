# Grant Runbooks: Dr. Yev Transom

**Department:** Computer Science / ML | **Tech level:** Very High | **Archetype:** The cluster breaker — knows more about infrastructure than most IT staff, frustrated when tools assume he doesn't

---

## Large Language Model Training

**What I'm trying to do:** NSF grant for training large language models on proprietary corpora.  GPU-heavy, bursty when we're doing pre-training runs.  I need a cost estimate that actually reflects GPU-hour pricing, not CPU SU equivalencies.  If the tool doesn't distinguish GPU from CPU I'm going to have to do this manually anyway.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Proprietary training data and model weights.  Direct click.
3. **Help Me Estimate:** I'll try the **ML Training / GPU** calculator.  Enter GPU hours, model size parameters.  If it surfaces per-GPU-hour rates I'll use them.  If it just does SU conversions I'll note that as a gap.
4. **Grant Period:** 3 years.
5. **Services:** **GPU Cluster Allocation** + **Research Storage** (20 TB active, 15 TB archive — checkpoints are large).
6. **Software:** Skip — open source stack (PyTorch, HuggingFace).
7. **Retention:** Federal grant standard.
8. **Results:** Export cost breakdown.  DMP needs to address model weights specifically — NSF has new requirements about AI model sharing that aren't in most generic DMP templates.  I'll write that section myself.

**What I want out of this:** A GPU cost estimate and a DMP I can start from.  I'll rewrite the AI-specific sections but I don't want to generate the storage and retention boilerplate from scratch.

---

## Open Benchmark Leaderboard

**What I'm trying to do:** NSF supplement for maintaining an open benchmark leaderboard.  Public data, public results, moderate compute.  Needs a data sharing plan that actually says we're sharing everything.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Public benchmarks.  Direct click.
3. **Help Me Estimate:** **ML Training / GPU** calculator.  15,000 GPU-SU/month, sustained (leaderboard jobs run continuously).
4. **Grant Period:** 2 years.
5. **Services:** **GPU Cluster Allocation** (15,000 SU/month) + **Research Storage** (5 TB active, 3 TB archive).
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** DMP text with open data sharing emphasis.  This goes directly into the supplement — minimal editing needed for a low-risk open-science project.

**What I want out of this:** A clean data sharing DMP and a defensible cost estimate for the supplement.

---

## Industry Partnership: Recommendation Systems

**What I'm trying to do:** Corporate partner — recommendation system research using their user interaction data.  NDA, corporate data, Medium tier.  Two-year project.  The partner wants to see that we have data governance infrastructure before they hand us anything sensitive.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Corporate NDA data.  Direct click.
3. **Help Me Estimate:** **ML Training / GPU** calculator.  60,000 GPU-SU/month, bursty.
4. **Grant Period:** 2 years.
5. **Services:** **GPU Cluster Allocation** (60,000 SU/month) + **Research Storage** (10 TB active, 5 TB archive).
6. **Software:** Skip.
7. **Retention:** Federal grant standard — NDA has separate destruction requirements I'll handle contractually.
8. **Results:** The DMP is what the corporate partner actually wants to see.  Export it and send it to their legal team as evidence that we have a data governance process.  Cost breakdown goes into the contract budget.

**What I want out of this:** A DMP document I can email to the partner's legal team and a cost table for the contract.
