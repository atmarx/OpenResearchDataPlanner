# OpenResearchDataPlanner User Guide

Plan your research data infrastructure and generate content for your grant proposal.

**Time to complete:** 5-15 minutes

---

## Who Is This Tool For?

**All Northwinds researchers** who need data infrastructure for their research — whether you're storing microscopy images, running genomics pipelines, or planning compute for simulations.

### Do I Need to Use This?

**Not mandatory, but recommended.** This is a self-service planning tool that helps you:

- Figure out what you need before contacting IT
- Get budget numbers for your grant proposal
- Generate draft DMP (Data Management Plan) text
- Submit infrastructure requests

Our Research IT team handles many requests, and this tool helps you get answers quickly without waiting for a consultation. You can always contact us directly if you prefer — but most researchers find the tool faster.

### What if I Don't Know What I Need?

That's exactly what the calculators and wizard are for. You describe your research ("I have 50,000 survey responses" or "I'm doing RNA-seq on 200 samples") and the tool translates that into storage and compute requirements.

---

## Key Terms

| Term | What It Means |
|------|---------------|
| **TB** | Terabyte — 1,000 GB. About 200,000 high-resolution photos. |
| **Service Units (SU)** | A billing unit for compute time. 1 SU = 1 CPU-core for 1 hour. A 16-core job running 2 hours = 32 SU. |
| **GPU-hours** | Graphics processor time for machine learning and simulations. |
| **F&A** | Facilities & Administrative costs (also called "indirect costs"). The university's overhead rate applied to your direct costs. Typically 50-60% depending on your grant type. |
| **DMP** | Data Management Plan — required by most funders. Describes how you'll store, protect, and share your data. |
| **Tier** | Data security level (L1-L4) based on sensitivity. Determines which services you can use. |
| **PHI** | Protected Health Information — patient data covered by HIPAA. |
| **FERPA** | Family Educational Rights and Privacy Act — protects student educational records. |

---

## What OpenResearchDataPlanner Does

OpenResearchDataPlanner helps you:

1. **Estimate your needs** — Use calculators to translate your research into storage and compute requirements
2. **Browse services** — See what's available and how it maps to data security tiers
3. **Build your slate** — Collect the services you need in one place
4. **Get cost estimates** — Calculate budget figures for your grant proposal
5. **Generate draft DMP text** — Create Data Management Plan language as a starting point
6. **Submit to Research IT** — Start the provisioning process

Your progress is saved automatically in your browser.

---

## Two Ways to Use This Tool

### The Guided Path (Wizard)

**Best for:** First-time users, anyone unsure where to start

Click **"Get Started"** on the welcome page. The wizard walks you through:

1. **Data Classification** — What security tier fits your research?
2. **Grant Period** — How long is your project?
3. **Data Retention** — How long must you keep data?
4. **Service Selection** — What do you need?
5. **Usage Estimates** — How much of each service?
6. **Results** — Your budget and DMP text

At the end, your selections are added to your **Service Slate**.

### The Explore Path

**Best for:** Experienced users, those who know what they need

From the welcome page, click **"Estimate Needs"** or **"Browse Services"** to start exploring.

- **Estimate Needs** — Use calculators to figure out storage, compute, and GPU requirements
- **Browse Services** — See all available services in a matrix by security tier

Add items directly to your slate, then review and submit when ready.

---

## Your Service Slate

The **Service Slate** is your collection of proposed services. Think of it as a shopping list for research infrastructure.

### The Slate Footer

A blue footer bar appears at the bottom of the screen:

- **Empty:** "Start building your slate by exploring services or calculators"
- **Has items:** Shows count, total cost, and buttons to expand or review
- **Submitted:** Shows your request ID and status

### Adding to Your Slate

You can add items to your slate from:

- **Calculators** — Click "Add to Slate" after calculating your needs
- **Service Matrix** — Click "Add" next to any service
- **Wizard** — Complete the estimate step to sync your selections

### Managing Your Slate

Click the slate footer to expand and see all items. You can:

- **Remove items** — Click the trash icon next to any item
- **Clear everything** — Click "Clear slate" to start over
- **Export for Grant** — Download your estimates for your proposal
- **Submit to Research IT** — Start the provisioning process

---

## Calculators

Calculators translate your research into infrastructure requirements.

### Storage Calculators

| Calculator | You describe... | We calculate... |
|------------|-----------------|-----------------|
| **Microscopy** | Resolution, bit depth, channels, Z-stacks | TB of storage |
| **Photography** | Image type, file count | TB of storage |
| **Genomics** | Sequencing type, sample count | TB of storage |
| **Video** | Resolution, hours of footage | TB of storage |
| **Medical Imaging** | Scan type, study count | TB of storage |
| **Documents** | Document type, file count | TB of storage |

### Compute Calculators

| Calculator | You describe... | We calculate... |
|------------|-----------------|-----------------|
| **Genomics Pipelines** | Pipeline type, sample count | Service Units (SU) |
| **Simulations** | Software, system size, time | Service Units (SU) |
| **Batch Processing** | Processing intensity, file count | Service Units (SU) |
| **Statistics** | Analysis type, run count | Service Units (SU) |

### GPU Calculators

| Calculator | You describe... | We calculate... |
|------------|-----------------|-----------------|
| **ML Training** | Model size, training runs | GPU-hours |
| **ML Inference** | Workload type, item count | GPU-hours |
| **GPU Simulation** | Package, simulation time | GPU-hours |

### How Calculators Work

1. **Select a calculator** from the category grid
2. **Use presets** for quick estimates (e.g., "Confocal Core" for microscopy)
3. **Adjust inputs** for your specific situation
4. **View the calculation** breakdown (click "Show calculation")
5. **See relatable comparison** (e.g., "About 200,000 photos")
6. **Add to your slate** when satisfied

### Safety Buffer

All estimates include a 1.5× safety buffer for processing intermediates and unexpected needs. This is the industry standard for grant budgeting.

---

## Service Matrix

The Service Matrix shows all available services organized by security tier.

### Understanding the Matrix

- **Rows:** Services grouped by category (Compute, Storage, etc.)
- **Columns:** Security tiers (L1, L2, L3, L4)
- **Cells:** Availability status for each combination

### Availability Icons

| Icon | Meaning |
|------|---------|
| ✓ (green) | Available — automatic provisioning |
| ⚠ (yellow) | Requires review — needs approval before use |
| ℹ (orange) | Consultation required — talk to Research IT first |
| ✗ (gray) | Not available for this tier |

### Quick Add

Click **"Add"** on any service to add it to your slate:

1. Enter the quantity you need
2. Or use a calculator to estimate ("Not sure? Use a calculator")
3. Click "Add to Slate"

---

## Data Classification (Tiers)

Your data security tier determines which services you can use.

### Tier Overview

| Tier | Name | Examples |
|------|------|----------|
| L1 | Low Risk | Public datasets, published results, open-source code, model organism data |
| L2 | Medium Risk | Pre-publication data, proprietary methods, NDA-protected work, coded biobank samples |
| L3 | High Risk | Patient data (PHI), student records (FERPA), human genomic data, identifiable research participants |
| L4 | Restricted | Export-controlled (ITAR/EAR), CUI, defense research, USDA Select Agents |

### Choosing Your Tier

**If you're unsure:** Click **"Check Your Tier"** on the welcome page. The questionnaire walks you through specific questions about:
- Human subjects research
- Biological samples and organism source (human, mouse, wildlife, etc.)
- Government contracts and export control
- Confidentiality agreements

**For genomics researchers:** The questionnaire distinguishes between human genomic data (typically L3), model organism data (typically L1), and wildlife/endangered species data (case-by-case).

**If you know your tier:** You can browse services and add to your slate directly. Your tier will be confirmed when you submit.

### Tier Required for DMP

To generate Data Management Plan text, you need to specify your tier. Cost estimates work without it.

---

## Exporting and Submitting

### Export for Grant

Generate budget content for your proposal:

- **Cost breakdown** — Monthly and annual costs for each service
- **F&A calculation** — Indirect costs at your institution's rate
- **DMP text** — Draft language for your Data Management Plan (requires tier)

### Submit to Research IT

When you're ready to provision services:

1. Click **"Submit to Research IT"** in your slate
2. Provide contact information
3. Select funding source
4. Indicate timeline/urgency
5. Submit

You'll receive a request ID and can track status.

**Note:** You don't need to complete the tier classification to submit. Research IT can help determine the right tier during consultation.

---

## Wizard Walkthrough

If you're using the guided wizard path:

### Step 1: Welcome

Click **Get Started** to begin. You can also explore calculators and services from here.

### Step 2: Data Classification

Select your security tier or take the questionnaire. See [Data Classification](#data-classification-tiers) above.

### Step 3: Grant Period

Set your grant duration:
- Presets: 1, 2, 3, or 5 years
- Custom: Set specific start and end dates

### Step 4: Data Retention

Specify how long you must keep data after the grant ends. This helps calculate archive storage needs.

### Step 5: Select Services

Choose services from:
- **Bundles** — Pre-configured combinations for common use cases
- **Individual services** — Pick exactly what you need

### Step 6: Usage Estimates

Enter how much of each service you need:
- Use presets for quick estimates
- Use calculators for precision
- Apply available subsidies

### Step 7: Results

View your complete plan:
- Budget estimate with costs
- Draft DMP text (copy or download)
- Next steps for your tier

Your selections are automatically added to your slate.

---

## Tips & FAQ

### Can I mix wizard and explore modes?

Absolutely. Items added from calculators or the service matrix appear in your slate alongside wizard selections.

### Is my data saved?

Yes. Your session and slate save automatically to your browser.

- **Session:** Stored in localStorage (persists across browser sessions)
- **Slate:** Stored in sessionStorage (cleared when you close the tab)

### What if I pick the wrong tier?

You can change it. If you've already submitted, contact Research IT to adjust.

### The costs are estimates, right?

Yes. Actual costs may vary based on:
- Actual usage vs. estimates
- Pricing changes during your grant
- Subsidy approval status

Always confirm with your research computing team before finalizing your budget.

### Why does this tool exist?

Research IT gets many similar questions: "How much storage do I need?" "What will this cost?" "What should I put in my DMP?" This tool provides immediate answers to those questions so you don't have to wait for a consultation.

It's particularly helpful when:
- Writing a grant proposal with a tight deadline
- Comparing different infrastructure options
- Getting a ballpark budget before talking to IT

### I'm not sure if my data is "sensitive" — should I be worried?

Take the **Tier Check** questionnaire on the welcome page. It asks specific questions about your data (human subjects, government contracts, etc.) and recommends the appropriate security level.

When in doubt, err on the side of caution. It's easier to relax restrictions than to contain a problem.

### Can I share my session?

Yes! Export as JSON and send the file. Others can import it to see your selections.

### I need help

Look for the **"Talk to a human"** button or contact information in the footer. Real humans are available — this tool is here to help, not replace, our team.

---

## Understanding Compliance

### High-tier (L3) Timeline

Most HIPAA/FERPA projects:

1. **Complete planner** (~10 min)
2. **Consultation** (1-3 days)
3. **BAA verification** (0-5 days)
4. **Environment setup** (1-3 days)
5. **Training** (~30 min)

**Total: 3-7 business days**

### Restricted (L4) Timeline

Export-controlled projects:

1. **Complete planner** (~10 min)
2. **Consultation** (1-3 days)
3. **Export control review** (3-5 days)
4. **Security assessment** (1-2 weeks)
5. **Enclave provisioning** (1-2 weeks)
6. **Certification** (3-5 days)
7. **Training** (~2 hours)

**Total: 3-6 weeks**

### Deadline Pressure?

Contact Research IT immediately with your deadline. We can often:
- Prioritize your consultation
- Work steps in parallel
- Pre-stage infrastructure while approvals complete

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between controls |
| Enter/Space | Activate buttons |
| Escape | Close modals |
| Arrow keys | Navigate within lists |

---

## Getting More Help

### In-App

- **Calculators** — Guided estimation for storage and compute
- **Service Matrix** — Browse all services by tier
- **Slate footer** — Quick access to your selections

### Documentation

- [Customization Guide](CUSTOMIZE.md) — For administrators
- [Architecture](ARCHITECTURE.md) — Technical overview

### Contact

Contact information appears in the footer. For issues with the tool itself, contact your system administrator.
