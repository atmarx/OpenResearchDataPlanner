# Grant Runbooks: Dr. Ama Rilston

**Department:** Genomics Core Facility | **Tech level:** Medium | **Archetype:** The compliance expert — runs the sequencing core, knows the regulatory requirements cold, has projects at all three standard tiers

---

## Human Cancer Genomics Study

**What I'm trying to do:** NIH R01 for human cancer genomics — whole-genome sequencing of 200 cancer patients.  HIPAA applies.  NIH Genomic Data Sharing Policy applies.  I know exactly what tier this is.  I need a cost estimate and a DMP that addresses dbGaP submission requirements.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** High Risk.  Direct click.  I don't need the questionnaire — I wrote our lab's IRB protocol.
3. **Help Me Estimate:** **Genomics / Sequencing** calculator.  200 human WGS samples at 30x coverage.  Note the compute estimate.
4. **Grant Period:** 5 years.
5. **Services:** Browse manually.  **HPC Cluster Allocation** (45,000 SU/month) + **Research Storage** (12 TB active, 12 TB archive — equal because we archive everything under dbGaP and HIPAA retention).
6. **Software:** Add relevant bioinformatics tools — check if GATK, BWA, etc. are covered or if they're open source (most are open source).
7. **Retention:** NIH Genomic — the policy-specific retention option.
8. **Results:** DMP text is critical.  I need explicit language about dbGaP submission timelines, institutional data access committee, and de-identification protocols.  Export and customize extensively — this DMP will be read by NIH program officers who know what dbGaP looks like.

**What I want out of this:** An NIH-compliant DMP with dbGaP specifics and a 5-year cost estimate.  The cost estimate goes directly into the Research Plan budget.

---

## Mouse Colony Breeding Study

**What I'm trying to do:** Proprietary mouse strain — breeding data, phenotyping results.  Not public until we publish.  NIH R21.  Medium tier.  Moderate compute.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Medium Risk.  Proprietary strain, unpublished.  Direct click.
3. **Help Me Estimate:** **Genomics / Sequencing** calculator — smaller scale.  15,000 SU/month, sustained.
4. **Grant Period:** 3 years.
5. **Services:** **HPC Cluster Allocation** (15,000 SU/month) + **Research Storage** (6 TB active, 4 TB archive).
6. **Software:** Skip.
7. **Retention:** Federal grant standard.
8. **Results:** Export cost and DMP.  DMP should address the proprietary strain and specify that data sharing will occur after publication.  Customize the embargo language.

**What I want out of this:** A budget and a DMP with appropriate IP/embargo language.

---

## Museum Bird DNA Barcoding Initiative

**What I'm trying to do:** Open science collaboration with the natural history museum — DNA barcoding of bird specimens.  All data goes to GenBank immediately.  Low tier.  2-year NSF collaborative grant.

**Steps:**

1. Open the tool → **Start New Plan**
2. **Tier:** Low Risk.  Open collaboration, all data public.  Direct click.
3. **Help Me Estimate:** **Genomics / Sequencing** calculator.  ~500 bird specimens, barcoding (short reads) — much lighter than WGS.  10,000 SU/month, bursty.
4. **Grant Period:** 2 years.
5. **Services:** **HPC Cluster Allocation** (10,000 SU/month) + **Research Storage** (4 TB active, 3 TB archive).
6. **Software:** Skip — BLAST and BOLD database tools are web-based.
7. **Retention:** Federal grant standard.
8. **Results:** DMP text with explicit GenBank deposition language.  NSF collaborative grants need data sharing plans that name the repository.  Export and add the GenBank accession process specifics.

**What I want out of this:** A DMP that names GenBank as the repository and a cost estimate for the collaborative budget.
