# OpenResearchDataPlanner User Guide

This guide walks you through planning your research data infrastructure and generating content for your grant proposal.

**Time to complete:** 5-15 minutes

---

## What OpenResearchDataPlanner Does

OpenResearchDataPlanner helps you:

1. **Classify your data** — Determine the right security level for your research
2. **Select services** — Choose compute, storage, and environments that match your needs
3. **Estimate costs** — Calculate budget figures for your grant proposal
4. **Generate draft DMP text** — Create Data Management Plan language as a starting point (review and customize for your specific project)
5. **Understand next steps** — Know exactly what happens after you submit

Your progress is saved automatically in your browser. You can close and return later.

---

## Getting Help Along the Way

### Understanding Terms

Throughout the tool, you'll see **underlined terms** like <u>HPC</u>, <u>SU</u>, or <u>PHI</u>. These are technical terms that might be unfamiliar.

- **Hover** over an underlined term to see a quick definition
- **Click** the term to open a detailed explanation with examples

Don't know what a "Service Unit" is? No problem—just click and learn.

### "Help Me Estimate" Calculators

When asked how much storage or compute you need, you don't have to guess. Click **"Help me estimate"** to open calculators that translate your research into infrastructure:

| Calculator | You describe... | We calculate... |
|------------|-----------------|-----------------|
| Microscopy | Resolution, channels, image count | TB of storage |
| Genomics | Sample count, sequencing type | TB and compute hours |
| ML Training | Model size, training runs | GPU-hours |
| Video | Resolution, recording hours | TB of storage |

For example: "I have 5,000 confocal images at 4K, 16-bit, 4 channels" → "You need approximately 3.2 TB"

### Need Human Help?

Look for the **"Not sure? Talk to a human"** button on any page. You can:

- **Email** — Get a response within 1 business day
- **Schedule a call** — Book a 30-minute consultation
- **Save progress** — Get a link to return later after talking to someone

We designed this tool to answer most questions, but complex projects deserve a conversation.

---

## Step-by-Step Walkthrough

### Step 1: Welcome

Click **Get Started** to begin.

If you've used the tool before, you'll see an option to restore your previous session or start fresh.

---

### Step 2: Data Classification

**What you're choosing:** The security tier that matches your most sensitive data.

#### Option A: Take the Questionnaire (Recommended)

Click **"Help me determine my tier"** to answer a few yes/no questions:

- Does your research involve human subjects?
- Does it include health or medical information?
- Is it funded by a government agency?
- Does it involve export-controlled technology?

Based on your answers, we'll recommend a tier and explain why.

#### Option B: Select Directly

If you already know your classification, select from:

| Tier | Examples |
|------|----------|
| **Low (L1)** | Public datasets, published results, open-source code |
| **Medium (L2)** | Pre-publication data, proprietary methods, NDA-protected work |
| **High (L3)** | Patient data (PHI), student records (FERPA), identifiable human subjects |
| **Restricted (L4)** | Export-controlled (ITAR/EAR), CUI, defense research |

#### Tips

- When in doubt, choose the higher tier—you can always use less-restricted services
- If you have multiple data types, choose the tier for your **most sensitive** data
- Selecting L3 or L4 will show you a workflow overview explaining the approval process

---

### Step 3: Grant Period

**What you're choosing:** When your grant starts and ends.

#### Options

- **Preset durations:** 1, 2, 3, or 5 years (3 years is typical for NIH R01s)
- **Custom:** Set your own start and end dates

#### Why This Matters

Grant duration affects your total budget. A 3-year grant at $100/month = $3,600 total.

---

### Step 4: Data Retention

**What you're choosing:** How long you must keep data after the grant ends.

#### Common Requirements

| Funder | Typical Requirement |
|--------|---------------------|
| NIH | 3 years after final report |
| NSF | 3 years after project end |
| DOE | 5+ years |
| HIPAA/Clinical | 6-7+ years |

If you're unsure, check your grant solicitation or ask your grants office.

#### Archive Storage

If retention extends beyond your grant, you'll need archive storage. This is:
- **Cheaper** than active storage (~$1.50/TB/month vs ~$5/TB/month)
- **Slower** to access (hours instead of seconds)
- **Perfect** for data you must keep but rarely need

#### Archive Ratio

Estimate what percentage of your active data you'll archive:

| Ratio | When to use |
|-------|-------------|
| 25% | Only keeping raw data |
| 50% | Typical—raw data + final results (recommended) |
| 100% | Regulatory requirement to keep everything |

**Tip:** If you already know your archive amount (e.g., "I need 4 TB of archive"), click **"I know my amount"** to enter it directly.

---

### Step 5: Select Services

**What you're choosing:** The compute, storage, and environments you need.

#### Using Bundles (Recommended for New Users)

Bundles are pre-configured combinations for common use cases:

| Bundle | Includes | Good for |
|--------|----------|----------|
| **HPC Starter** | Free tier compute + 1 TB storage | Learning HPC, small analyses |
| **Machine Learning** | GPU compute + storage + archive | Deep learning, training models |
| **Clinical Research** | HIPAA cloud + VDI | Patient data, regulated research |
| **National Scale** | ACCESS allocations + staging | Large simulations, multi-institution |

Click a bundle to see what's included, then click **Apply Bundle** to add all services.

#### Browsing Individual Services

Switch to **"Browse Services"** to pick specific services. They're grouped by category:

- **Compute** — HPC cluster, cloud VMs, GPU resources
- **Storage** — Research storage, archive, cloud buckets
- **Environments** — Virtual desktops, Kubernetes
- **National Resources** — ACCESS allocations

#### Service Indicators

- **✓ Available** — Ready to use for your tier
- **⚠ Requires review** — Needs approval before provisioning
- **Grayed out** — Not available for your tier

#### Compare Options

Click **"Compare Options"** on any category to see a side-by-side comparison:

```
                    HPC Free    HPC GPU     Cloud
GPU Available       Partial     Full        Full
Batch Jobs          Full        Full        Partial
Interactive         Limited     Limited     Full
Cost Predictable    Yes         Yes         No
```

This helps you choose between similar services.

---

### Step 6: Usage Estimates

**What you're choosing:** How much of each service you need.

#### For Each Service

1. **Enter your estimate** — Storage in TB, compute in hours, etc.
2. **Use presets** — Click "Small", "Medium", or "Large" for common scenarios
3. **Use calculators** — Click "Help me estimate" for guided estimation
4. **Apply subsidies** — Check any discounts you want to apply for

#### Subsidies and Discounts

Some services offer cost reductions:

- **Auto-applied** — "First 1 TB free" applies automatically
- **Opt-in** — "Apply for research credits" requires checking a box

#### Services with Limitations

Some services have hard limits (e.g., "4 GB max file size"). You'll see a warning panel:

1. Read the limitations
2. Check "I understand these limitations"
3. Continue

#### Software Availability

Need specific software? Click **"Check software availability"** to search what's available:

| Software | HPC | VDI | Cloud |
|----------|-----|-----|-------|
| MATLAB | ✓ Full | ✓ Full | ⚠ BYOL |
| Gaussian | ✓ Full | By request | ✗ |
| PyTorch | ✓ Full | ✓ Full | ✓ Full |

- **Full** — Licensed and ready to use
- **Restricted** — Available with approval
- **BYOL** — Bring your own license

---

### Step 7: Results

You're done with the wizard! This page has three sections:

#### Budget Estimate

- **Monthly cost** — What you'll spend per month during the grant
- **Grant period total** — Sum across your entire grant
- **Archive cost** — Post-grant retention costs
- **Grand total** — What to put in your budget

**Export options:**
- **Export Budget (Markdown)** — Formatted for your proposal
- **Export Budget (CSV)** — For spreadsheets
- **Export Session (JSON)** — To restore later or share

#### Data Management Plan

Draft DMP text based on your selections:

> "Research data will be stored on Northwinds University's Research Storage system, a high-performance parallel filesystem accessible from the HPC cluster. Daily snapshots provide 30-day recovery. Long-term preservation will use Archive Storage at $1.50/TB/month..."

- Click **Copy** to copy to clipboard
- Click **Download** to save as a file
- **Important:** This is a starting point—review and customize for your specific project before including in your proposal

#### Next Steps

Based on your selections, you'll see personalized next steps:

**For L1/L2 (Low/Medium tier):**
1. Submit service requests via self-service portal
2. Complete any required training
3. Transfer your data

**For L3 (High/Regulated):**
1. Schedule consultation with Research IT
2. Complete HIPAA/FERPA training
3. Wait for environment provisioning (3-7 days)

**For L4 (Restricted/Export-Controlled):**
1. Schedule consultation
2. Export control review (1-2 weeks)
3. Security assessment
4. Enclave provisioning (2-4 weeks)

---

## Tips & FAQ

### Can I go back and change something?

Yes. Click any completed step in the progress bar. If changes affect later selections, you'll see a warning before they're cleared.

### Is my data saved?

Your session saves automatically to your browser's local storage. It persists even if you close the browser.

To start fresh: Click **Start Over** on the Results page.

### What if I pick the wrong tier?

You can always go back and change it. If you're unsure, select a higher tier—you can use less-restricted services, but not vice versa.

If you've already provisioned services and need to change tiers, contact Research IT.

### The costs are estimates, right?

Yes. Actual costs may vary based on:
- Actual usage vs. estimates
- Pricing changes during your grant
- Subsidy approval status

Always confirm with your research computing team before finalizing your budget.

### Can I share my session with my PI or grants office?

Yes! Export as JSON and send the file. They can import it to see your selections and costs.

### What if my needs change mid-grant?

That's normal! You can:
- Adjust service allocations (usually easy)
- Add new services (follow normal request process)
- Change data tier (may require new approvals for higher tiers)

Contact Research IT—we help with mid-project adjustments regularly.

### I need help with something not covered here

Use the **"Talk to a human"** button on any page to:
- Email the support team
- Schedule a consultation
- Save your progress and continue later

---

## Understanding the Compliance Process

### What happens when I select High-tier (L3) data?

Most L3/HIPAA projects follow this timeline:

1. **Complete planner** (~10 min) — You're doing this now
2. **Consultation** (1-3 days) — Quick call to verify requirements
3. **BAA verification** (0-5 days) — Confirm agreements are in place
4. **Environment setup** (1-3 days) — Configure security controls
5. **Training** (~30 min) — Complete required compliance training

**Total: 3-7 business days** for most projects

**Shortcuts:** Pre-approved services (like our HIPAA cloud) skip the BAA step.

### What happens when I select Restricted (L4) data?

L4/export-controlled projects require more thorough review:

1. **Complete planner** (~10 min)
2. **Consultation** (1-3 days)
3. **Export control determination** (3-5 days) — Research Security review
4. **Security assessment** (1-2 weeks) — Architecture review
5. **Enclave provisioning** (1-2 weeks) — Dedicated infrastructure
6. **Certification** (3-5 days) — Final security approval
7. **Training** (~2 hours) — Export control handling

**Total: 3-6 weeks** typical

**Important:** Only US persons may access L4 data. International collaborators cannot participate in this portion of your research.

### I have a grant deadline—can this be expedited?

Contact Research IT immediately with your deadline. We can often:
- Prioritize your consultation
- Work steps in parallel
- Pre-stage infrastructure while approvals complete

Include your deadline in the planner notes or mention it when you reach out.

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between controls |
| Enter/Space | Activate buttons and links |
| Escape | Close modals and tooltips |
| Arrow keys | Navigate within lists |

All interactive elements have visible focus indicators.

---

## Getting More Help

### In-App Help

- **Underlined terms** — Click for definitions
- **"Help me estimate"** — Calculators for storage and compute
- **"Compare Options"** — Side-by-side service comparison
- **"Talk to a human"** — Email, schedule, or save progress

### Documentation

- [Customization Guide](CUSTOMIZE.md) — For administrators deploying this tool
- [Architecture](ARCHITECTURE.md) — Technical overview

### Contact

Contact information appears on the Results page and in the help menu. For issues with the tool itself, contact your system administrator.
