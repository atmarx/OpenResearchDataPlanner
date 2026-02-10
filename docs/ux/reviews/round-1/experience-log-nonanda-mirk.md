# Experience Log: Dr. Mirk Nonanda

**Date:** 2026-02-05
**Persona:** Dr. Mirk Nonanda, Computer Science (OS/Systems)
**Archetype:** Pipeline Builder

---

## Project Context

I'm planning a grant proposal for my kernel development pipeline research. This is a 3-year NSF grant for open-source kernel research. All code is public, so it's Low tier data.

**Workload characteristics:**
- Sustained compute: 40,000 SU/month for kernel compilation and testing
- Active storage: 3TB for source trees, build artifacts, test results
- Archive storage: 2TB for long-term retention
- Federal grant standard retention (3 years post-completion)
- Team size: 3 people (me + 2 PhD students)

I'm also interested in the K8s beta for migrating my personal CI infrastructure.

---

## Session Start

Opening the tool. Clean interface. Progress bar at top. "Get Started" button.

I click it.

---

## Step 1: Data Classification

Four tiers: Low, Medium, High, Restricted.

The descriptions are simplified for non-technical users:
- Low: "publicly releasable, has no restrictions"
- Medium: "proprietary, unpublished"
- High: "PHI, HIPAA data"
- Restricted: "FISMA, CUI, classified"

My kernel research is open source. Everything goes on GitHub. This is clearly **Low tier**.

I select Low and continue.

**Observation:** The tier selection doesn't explain what technical controls each tier provides. For someone with my background, I want to know:
- Is encryption at rest enabled?
- What authentication mechanisms are used?
- Are there network isolation requirements?

I understand why this is simplified for general users, but there should be a "technical details" link.

---

## Step 2: Grant Period

I need a 3-year grant starting in September 2026.

The interface shows preset durations (1, 2, 3, 5 years) and a "Custom" option.

I select "3 years" and then click the date picker for the start date.

**Issue:** The date picker defaults to today (February 5, 2026). My grant starts September 1, 2026. I have to navigate forward 7 months. This is tedious.

**Suggestion:** Add a month/year dropdown for faster navigation, or allow typing the date.

I set the start date to September 1, 2026. The end date auto-calculates to August 31, 2029. Correct.

I continue.

---

## Step 3: Data Retention

The interface asks: "How long must you retain data after the grant ends?"

Pre-populated options:
- "No retention required after grant"
- "3 years after grant end (common for federal grants)"
- "5 years after grant end"
- "7 years after grant end (clinical trials)"
- "Custom"

NSF requires 3 years after project end. I select "3 years after grant end."

An archive ratio slider appears: "What percentage of your active data will need to be archived?"

Default: 70%.

For kernel research, I'll keep most of it - source trees, major build artifacts, test results. I'll delete intermediate build files. I adjust the slider to **80%**.

The interface shows: "Archive period: Sep 2029 - Aug 2032 (36 months)"

Good. The calculation is transparent.

I continue.

---

## Step 4: Select Services

Two tabs: "Bundles" and "Browse Services"

### Exploring Bundles

I click through the bundles to see what's offered:

- **Storage Only**: Just research storage. Too simple for me.
- **Genomics Pipeline**: HPC + storage + Globus. Not relevant.
- **ML/AI Training (On-Prem)**: HPC + GPU cluster + storage. This is closer, but I don't need GPUs for kernel compilation.
- **Simulation & FEA**: GPU-focused. Not relevant.

None of these bundles match my workload exactly. I need:
- HPC compute for kernel builds
- Research storage for source and artifacts
- Possibly K8s beta for CI infrastructure

**I switch to "Browse Services"**

### Browsing Individual Services

Services are grouped by category:
- Compute
- Storage
- API
- Environment
- Support

Good categorization. I expand each category.

#### Compute Services

**HPC Cluster (SLURM)** - This is what I need.
- Description: "Shared high-performance computing cluster for batch workloads"
- Indicator: Green "Recommended" for Low tier
- I click it.

**Kubernetes Cluster (Beta)** - Wait, this is here?
- Description: "Container orchestration platform for research workloads"
- Indicator: Yellow "Requires acknowledgment"
- I click it.

A modal appears:

> **Kubernetes Beta Program Requirements**
>
> The Kubernetes cluster is in beta and requires application approval. Apply at k8s-beta@northwinds.edu with your use case and experience.
>
> - You must have experience with containerized applications
> - Helm chart knowledge required (or willingness to learn with support)
> - Access is by application only - not a general-use resource
> - Beta services may have downtime for maintenance

There's a checkbox: "I understand these requirements and will apply if needed"

**This is exactly what I want.** I've been running my own build farm for years. I know Docker, Kubernetes, Helm. I could migrate my CI pipelines to this and offload the hardware maintenance.

I check the box and add it to my selection.

**Observation:** The acknowledgment modal is clear about requirements and the application process. I appreciate that they're gatekeeping this - they don't want to support users who don't know what they're doing.

I also notice the cost is **$0.00/namespace-month** during beta. Future pricing TBD. This is free right now, which makes it perfect for testing migration.

#### Storage Services

**Research Storage (GPFS)** - I need this.
- $5/TB/month
- 500GB base allocation included
- Archive option available
- I select it.

**Cold Archive Storage** - Listed as an archive tier.
- $0.50/TB/month
- "Tape-backed archival tier"
- "48-72 hour retrieval time"

I don't select this directly - the tool should suggest it automatically for my archive retention.

#### Other Services

I skim through the others:
- **Globus Transfer**: Free, might be useful for collaboration, but not critical for this grant
- **Azure OpenAI**: Not relevant
- **GPU Cluster**: Not needed for kernel compilation
- **VDI tiers**: I have root on department machines, don't need this
- **RC Consultation**: First hour free - I might use this for K8s architecture review

**Decision:** I select **HPC SLURM**, **K8s Beta**, and **Research Storage**.

I continue.

---

## Step 5: Usage Estimates

The interface shows three services I selected, each with an estimation form.

### HPC Cluster (SLURM)

**Prompt:** "How many CPU-core-hours do you expect per month?"

Four presets:
- Light (1,000 SU) - "A few jobs per week on 1-2 nodes"
- Moderate (10,000 SU) - "Daily jobs using 10-50 nodes"
- Heavy (100,000 SU) - "Continuous large parallel workloads"
- Very Heavy (500,000 SU) - "Near-continuous use of significant cluster fraction"

My kernel research needs **40,000 SU/month**. This is between Moderate and Heavy.

The presets don't have a 40k option. I manually type **40000** into the input field.

**Subsidies:**
- "Scavenger Partition" checkbox: "Free tier for preemptible, opportunistic workloads. Jobs may be preempted; best for fault-tolerant workflows. Max 5000 SU/month."

My kernel builds are fault-tolerant - if a job gets preempted, I just restart it. This saves me money.

I check the "Scavenger Partition" box.

**Cost preview updates:**
- 40,000 SU/month
- Tiered pricing: 10,000 at $0.10 = $1,000; 30,000 at $0.08 = $2,400
- Total before subsidy: $3,400/month
- Scavenger subsidy: -$500/month (5000 SU at 100% discount)
- **Net cost: $2,900/month**

**Observation:** The cost breakdown is transparent. I can see the tier calculation and the subsidy application. This is exactly what I wanted.

### Kubernetes Cluster (Beta)

**Prompt:** "How many namespaces do you need?"

Two presets:
- Single application (1 namespace)
- Dev + Prod (2 namespaces)

I need one namespace for my CI pipeline. I select **1**.

**Cost:** $0.00/month (beta program, 100% discount auto-applied)

**Observation:** This is free during beta. The subsidy explanation says "Free access during beta period." Clear.

### Research Storage (GPFS)

**Prompt:** "How much active storage do you need?"

Four presets:
- Small project (1TB)
- Medium project (10TB)
- Data-intensive (100TB)
- Large-scale (500TB)

I need **3TB** for active storage. I type **3** into the input field.

**Subsidies:**
- "Base Allocation" checkbox: "First 500 GB included at no cost per project" (auto-applied, grayed out)

**Archive estimate:**
I selected 80% archive ratio in the retention step. The interface shows:
- "Archive estimate for retention period: 2.4 TB" (80% of 3TB)
- Archive cost: $0.50/TB/month × 2.4 TB = $1.20/month

**Cost preview:**
- Active storage: 3TB
- Base allocation: -0.5TB (free)
- Billable: 2.5TB at $5/TB = $12.50/month

**Observation:** The base allocation subsidy is auto-applied and shown in the calculation. The archive estimate is based on my retention settings. This is well-designed.

---

## Step 6: Review and Submit

I continue to the results page.

### Budget Estimate Tab

Three summary cards:
- **Monthly Cost:** $2,912.50
  - HPC: $2,900
  - K8s: $0
  - Storage: $12.50

- **Grant Period Cost:** $104,850 (36 months × $2,912.50)

- **Archive Cost:** $43.20 (36 months × $1.20)

- **Grand Total:** $104,893.20

**Cost Breakdown Table:**

| Service | Quantity | Monthly | Grant Period | Archive Period | Total |
|---------|----------|---------|--------------|----------------|-------|
| HPC Cluster (SLURM) | 40,000 SU | $2,900 | $104,400 | - | $104,400 |
| Kubernetes Cluster (Beta) | 1 namespace | $0 | $0 | - | $0 |
| Research Storage (GPFS) | 3 TB | $12.50 | $450 | - | $450 |
| Cold Archive Storage | 2.4 TB | - | - | $43.20 | $43.20 |
| **Total** | | **$2,912.50** | **$104,850** | **$43.20** | **$104,893.20** |

**Observation:** The table shows per-service costs with clear separation between grant period and archive period. This is exactly what I need for my budget justification.

**Export Options:**

Two buttons:
- "Export Budget (Markdown)"
- "Export Session (JSON)"

I click **"Export Session (JSON)"** to see what it contains.

A file downloads: `openresearchdataplanner-session-2026-02-05.json`

I open it in a text editor:

```json
{
  "version": "1.0",
  "timestamp": "2026-02-05T21:15:32Z",
  "tier": "low",
  "grant_period": {
    "start": "2026-09-01",
    "end": "2029-08-31",
    "duration_months": 36
  },
  "retention": {
    "years": 3,
    "archive_ratio": 0.8
  },
  "services": [
    {
      "slug": "hpc-slurm",
      "quantity": 40000,
      "subsidies": ["free-scavenger"],
      "monthly_cost": 2900,
      "grant_period_cost": 104400
    },
    {
      "slug": "k8s-cluster",
      "quantity": 1,
      "subsidies": ["k8s-beta"],
      "monthly_cost": 0,
      "grant_period_cost": 0
    },
    {
      "slug": "research-storage",
      "quantity": 3,
      "subsidies": ["base-allocation"],
      "monthly_cost": 12.50,
      "grant_period_cost": 450,
      "archive_quantity": 2.4,
      "archive_cost": 43.20
    }
  ],
  "total_monthly": 2912.50,
  "total_grant_period": 104850,
  "total_archive": 43.20,
  "grand_total": 104893.20
}
```

**This is excellent.** The JSON is well-structured, human-readable, and includes:
- All my selections (tier, dates, services, quantities)
- Applied subsidies
- Cost calculations broken down by period
- Archive calculations

I can parse this with `jq`, load it into a script, or import it back into the tool.

**Question:** Can I create a JSON file manually and load it into the tool? That would enable automation.

### Data Management Plan Tab

I click the "Data Management Plan" tab.

The interface shows a preview of generated DMP text:

> **Data Management Plan**
>
> **Data Security Classification:** Low (publicly releasable data)
>
> **Compute Infrastructure:**
> Research computing needs will be met using the HPC Cluster (SLURM) at Northwinds University...
> (continues with HPC details)
>
> Our CI/CD pipeline will utilize the Kubernetes Cluster (Beta) at Northwinds University...
> (continues with K8s details)
>
> **Data Storage and Management:**
> Active research data will be stored on the Research Storage (GPFS) system...
> (continues with storage details, retention policy, archive plan)

The text is well-written, technically accurate, and ready to paste into a grant proposal.

**Export Options:**
- "Copy to Clipboard"
- "Download as Markdown"

I click **"Download as Markdown"**. A file downloads: `data-management-plan-2026-02-05.md`

---

## Overall Experience Assessment

### What Worked Well

1. **Transparent cost calculations:** The cost breakdown showed tiered pricing, subsidies, and archive costs clearly. I could verify every number.

2. **Flexible service selection:** The bundle system exists for people who need it, but I could browse individual services and build exactly what I needed.

3. **JSON export:** The session export is well-structured and machine-readable. I can automate cost scenarios if I can import JSON.

4. **Technical honesty:** The K8s beta acknowledgment was clear about requirements and limitations. The cold archive explicitly said "tape-backed, 48-72 hour retrieval." No marketing BS.

5. **Subsidy handling:** Auto-applied subsidies (base storage allocation) vs opt-in subsidies (scavenger partition) were clearly differentiated.

6. **DMP generation:** The generated text was technically accurate and ready to use. This saves me time.

### What Could Be Better

1. **Date picker UX:** Navigating 7 months forward to set a September start date was tedious. Add month/year dropdowns or allow direct typing.

2. **Missing technical specs:**
   - What GPU models are on the HPC cluster when using GPU-weighted SUs?
   - What's the IOPS guarantee for GPFS storage?
   - What Kubernetes version is running?
   - What's the network topology?

3. **No API or CLI:** I can export JSON, but can I import it? Can I script multiple scenarios? This would be valuable for comparing cost options.

4. **Preset gaps:** The HPC presets jumped from 10k to 100k SU. My 40k workload fell in the gap. Add more presets or make it more obvious that I can type custom values.

5. **Pass-through pricing clarity:** AWS/Azure services have 5% admin overhead, but this isn't shown prominently in the cost summaries. I had to read the services.yaml carefully to find this.

6. **K8s application process:** The tool tells me to email k8s-beta@northwinds.edu, but it doesn't generate a pre-filled email or provide a form. A "Apply Now" button that opens a template email would be helpful.

### Specific Use Cases

#### Use Case 1: Kernel Research Grant (This Session)
- **Goal:** Estimate costs for 3-year NSF kernel development grant
- **Result:** $104,893.20 total (compute + storage + archive)
- **Outcome:** SUCCESS. I have a defensible budget number and DMP text ready for the proposal.

#### Use Case 2: K8s Beta Application
- **Goal:** Migrate my personal CI infrastructure to K8s cluster
- **Result:** Identified the service, understood requirements, got application contact
- **Outcome:** PARTIAL SUCCESS. I know what to do, but I have to email separately. A form or template would be better.

#### Use Case 3: Teaching Infrastructure (CS 450)
- **Hypothetical:** Plan infrastructure for my operating systems course
- **Workload:** 15,000 SU/month (seasonal), 2TB storage
- **Question:** Can I save multiple sessions for different projects? Or do I need to export JSON and re-import?

---

## Questions for the Development Team

1. **Can I import JSON sessions?** If yes, I can script multiple cost scenarios. If no, this should be added.

2. **What GPU models are on the HPC cluster?** The services.yaml says "GPU hours use weighted SUs" but doesn't specify the hardware.

3. **Is there a technical appendix?** I want SLAs, performance specs, architecture diagrams, and implementation details.

4. **What happens to K8s costs after beta?** The tool says "future pricing TBD based on CPU/memory/storage." Can I add a placeholder estimate?

5. **Can I share sessions with collaborators?** If I send someone my JSON export, can they load it and see my selections?

---

## Bottom Line

This tool is significantly better than I expected. It's transparent, technically honest, and generates outputs I can actually use (JSON, Markdown, DMP text).

For a systems person like me, the main gaps are:
- Missing technical specifications
- No API/CLI for automation
- Minor UX issues (date picker, preset gaps)

But for grant cost estimation, this tool does exactly what it claims to do. I'll use it for my NSF proposal, and I'm applying for the K8s beta.

**Final rating: 7.5/10**

Would be 9/10 with:
- JSON import functionality
- Technical specifications appendix
- API for automation

Would be 10/10 with:
- Full API/CLI
- Terraform/Ansible configs available for inspection
- Real-time cost tracking integration
