# ELI5: Explain Like I'm Five

This document describes the "Help Me Estimate" feature - an escape valve for researchers overwhelmed by technical units they've never encountered.

---

## The Problem

Our UX testing revealed a consistent pattern: researchers hit a wall when asked to estimate resources in units they don't understand.

### Foreign concepts by persona type

| Persona | Stumbling Block | Actual Question |
|---------|-----------------|-----------------|
| Humanities scholar | "How much storage?" | "What's a TB? I have 5,000 manuscript scans." |
| Bench scientist | "How many SUs?" | "What's an SU? I run BLAST jobs." |
| ML researcher | "GPU-hours needed?" | "I'm training a ResNet. How long is that?" |
| First-time PI | "ACCESS credits?" | "I heard it's free. How do I get some?" |

**The pattern**: Users know their work. They don't know infrastructure units.

### Direct quotes from UX testing

> **Dr. Marge Tonsley (History):** "What I desperately need here: '1 terabyte (TB) is about 1,000 gigabytes (GB), which is roughly 200,000 high-resolution photos.' With that sentence, I could figure it out. Without it, I'm completely stuck."

> **Dr. Yev Transom (ML):** "I had to manually do my own math to figure out what [AWS presets] translate to in actual GPU time."

> **Dr. Torben Vex (Physics):** "Why force me to pick a start date when it's irrelevant to the cost calculation? Just let me say '3 years' and be done with it."

---

## The Solution: Help Me Estimate

An interactive modal that translates what researchers *know* (their data, their workflows) into what we *need* (TB, SU, GPU-hours).

### Design Philosophy

1. **Meet users where they are** - Ask about microscopy images, not megabytes
2. **Domain-specific calculators** - A genomicist sees WGS samples, not generic "files"
3. **Show the math** - Build trust by being transparent about estimates
4. **Always round up** - Recommend 1.5-2x calculated values for safety

---

## Modal Structure

### Entry Points

The modal can be triggered from:
- Storage selection step: "Not sure how much? Help me estimate"
- Compute selection step: "What's an SU? Help me understand"
- Any service card: "Help me estimate" link

### Tab Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Help Me Estimate                                       [X] │
├─────────────────────────────────────────────────────────────┤
│  [ Storage (TB) ] [ CPU Compute (SU) ] [ GPU Compute ]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  (Tab content here)                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                              [ Use this estimate: 2.5 TB ]  │
└─────────────────────────────────────────────────────────────┘
```

---

## Acronym Glossary

The modal should include inline definitions (tooltips or expandable text) for these commonly confused terms.

### Infrastructure Terms

| Acronym | Expansion | Plain English |
|---------|-----------|---------------|
| **HPC** | High-Performance Computing | Big shared computers for research |
| **GPU** | Graphics Processing Unit | Special chip that's fast for ML and simulations |
| **CPU** | Central Processing Unit | Regular computer processor |
| **SU** | Service Unit | 1 CPU-core running for 1 hour |
| **TB** | Terabyte | 1,000 GB (about 200,000 high-res photos) |
| **SLURM** | Simple Linux Utility for Resource Management | The software that schedules HPC jobs |
| **VDI** | Virtual Desktop Infrastructure | Remote Windows/Linux desktops |
| **K8s** | Kubernetes | Software for running containers at scale |

### Compliance Terms

| Acronym | Expansion | Plain English |
|---------|-----------|---------------|
| **PHI** | Protected Health Information | Patient/health data that needs HIPAA |
| **HIPAA** | Health Insurance Portability and Accountability Act | Federal law protecting health data |
| **IRB** | Institutional Review Board | Committee that approves human subjects research |
| **FERPA** | Family Educational Rights and Privacy Act | Federal law protecting student records |
| **FISMA** | Federal Information Security Management Act | Security standards for federal systems |
| **CUI** | Controlled Unclassified Information | Sensitive government data (not classified) |
| **ITAR** | International Traffic in Arms Regulations | Export control for defense-related data |
| **EAR** | Export Administration Regulations | Export control for dual-use technology |
| **BAA** | Business Associate Agreement | HIPAA contract with a vendor |
| **FDA 21 CFR Part 11** | FDA Electronic Records Rule | FDA requirements for clinical trials data |

---

## Concepts That Need Examples

Beyond acronyms, some concepts need concrete analogies.

### Data Tier Selection

> **Low tier**: Public data, published datasets, non-sensitive research
> *Example: "Medieval manuscript photos of public domain works"*
>
> **Medium tier**: Internal data, pre-publication research, proprietary methods
> *Example: "Your lab's unpublished experimental results"*
>
> **High tier**: PHI, student records, export-controlled, legally protected
> *Example: "Patient medical records, defense research data"*

### Archive vs Active Storage

> **Active storage** is like files on your desk - fast access, frequently used.
>
> **Archive storage** is like files in the attic - slower to retrieve, rarely accessed, but much cheaper.
>
> *Rule of thumb: If you won't touch it for 6+ months, archive it.*

### Preemptible/Scavenger Computing

> **Preemptible** means your job can be stopped if someone with priority needs the resources. It's free or discounted, but risky.
>
> *Good for: ML training with checkpoints (can resume), embarrassingly parallel jobs*
>
> *Bad for: 48-hour continuous simulations, anything that can't be interrupted*

### Snapshots

> **Snapshots** are like Time Machine backups - automatic copies of your files from the last 30 days. If you accidentally delete something, we can recover it.

---

## Tab 1: Storage (TB)

### What's a Terabyte?

> A terabyte (TB) is 1,000 gigabytes. Your laptop probably has 256 GB - 1 TB of storage. Research datasets often require 1-100 TB or more.

### Calculator Sections

#### Microscopy Images

```
What resolution are your images?
( ) 2K (2048 × 2048)  →  ~8-24 MB each
( ) 4K (4096 × 4096)  →  ~32-96 MB each
( ) 8K (8192 × 8192)  →  ~128-384 MB each

Bit depth: ( ) 8-bit  (•) 16-bit
Channels:  (•) Grayscale  ( ) RGB/Multi-channel

How many images? [________]

┌──────────────────────────────────────┐
│  10,000 images × 32 MB = 320 GB      │
│  With 2x buffer: ~0.6 TB recommended │
└──────────────────────────────────────┘
```

#### Photography & Scans

```
What type of images?
( ) Archival scans (TIFF, 600 DPI)     →  ~10-15 MB each
( ) Archival scans (TIFF, high-res)    →  ~50-200 MB each
( ) Document scans (JPEG, 300 DPI)     →  ~0.5-2 MB each
( ) DSLR photos (RAW)                  →  ~25-40 MB each

How many images? [________]
```

#### Genomics Data

```
What type of sequencing?
( ) Whole genome (30x coverage)        →  ~100-200 GB per sample (raw)
( ) RNA-seq                            →  ~5-20 GB per sample
( ) Single-cell (10x Genomics)         →  ~20-100 GB per run

How many samples/runs? [________]

[ ] Include space for aligned BAM files (+50% for WGS)
[ ] Include space for analysis intermediates (+100%)
```

#### Video

```
What format?
( ) HD video (1080p, compressed)       →  ~3 GB per hour
( ) 4K video (compressed)              →  ~15 GB per hour
( ) 4K video (ProRes/production)       →  ~150 GB per hour
( ) High-speed video (1000fps)         →  ~350 GB per hour

How many hours? [________]
```

#### Medical Imaging

```
What modality?
( ) CT scans                           →  ~300 MB per study
( ) MRI scans                          →  ~150 MB per study
( ) PET/CT                             →  ~750 MB per study
( ) Whole slide pathology              →  ~2 GB per slide

How many studies/slides? [________]
```

#### Documents & Text

```
What type of documents?
( ) Plain text files                   →  ~10 KB each
( ) Word documents                     →  ~100 KB each
( ) PDFs (text-only)                   →  ~200 KB each
( ) PDFs (with images)                 →  ~2-10 MB each
( ) OCR'd historical documents         →  ~1-5 MB each

How many documents? [________]

[ ] Include derived files (annotations, extracted text)
```

---

## Tab 2: CPU Compute (SU)

### What's a Service Unit?

> A Service Unit (SU) is 1 CPU-core running for 1 hour. If you use 32 cores for 10 hours, that's 320 SU. Think of it like electricity - you pay for what you use.

### Quick Reference

| If you're running... | Typical SU per run |
|---------------------|-------------------|
| Simple Python script (single core, 10 min) | 0.2 SU |
| Data processing (8 cores, 2 hours) | 16 SU |
| Genome alignment (32 cores, 4 hours) | 128 SU |
| Large simulation (128 cores, 24 hours) | 3,072 SU |

### Calculator Sections

#### Genomics Workflows

```
What pipeline are you running?
( ) Genome alignment (BWA-MEM)         →  ~100-500 SU per sample
( ) Variant calling (GATK)             →  ~50-200 SU per sample
( ) RNA-seq (STAR + featureCounts)     →  ~20-100 SU per sample
( ) De novo assembly                   →  ~500-5,000 SU per assembly

How many samples? [________]
How many times will you rerun? [________]

┌──────────────────────────────────────┐
│  50 samples × 300 SU × 2 runs        │
│  = 30,000 SU                         │
│  With buffer: ~50,000 SU recommended │
└──────────────────────────────────────┘
```

#### Simulations

```
What type of simulation?
( ) Molecular dynamics (GROMACS, NAMD)
( ) Computational fluid dynamics (OpenFOAM)
( ) Finite element analysis
( ) Climate/weather modeling
( ) Custom code

Cores per job: [________]
Hours per job: [________]
Number of jobs: [________]
```

#### Batch Data Processing

```
I have [________] files to process
Each file takes about [________] minutes on 1 core
I want to run [________] cores in parallel

┌──────────────────────────────────────┐
│  1,000 files × 30 min ÷ 60           │
│  = 500 core-hours = 500 SU           │
└──────────────────────────────────────┘
```

#### Statistics (R, Stata, SAS)

```
What type of analysis?
( ) Linear regression (small dataset)     →  1-10 SU
( ) Mixed effects models                  →  10-100 SU
( ) Bootstrapping (1000 iterations)       →  50-500 SU
( ) MCMC/Bayesian (10K samples)           →  100-1,000 SU
( ) Large-scale survey analysis           →  100-500 SU

Number of analyses: [________]
Number of bootstrap/permutation runs: [________]
```

---

## Tab 3: GPU Compute

### What's a GPU-hour?

> A GPU-hour is 1 GPU running for 1 hour. GPUs are specialized processors that excel at parallel tasks like machine learning and simulations. They're more expensive than CPUs but much faster for the right workloads.

### Quick Reference

| If you're training... | Typical GPU-hours |
|----------------------|------------------|
| Small CNN (MNIST-scale) | 1-5 |
| ResNet-50 on ImageNet | 20-50 |
| Fine-tuning a 7B LLM | 50-200 |
| Object detection (YOLO) | 10-50 |
| Stable Diffusion fine-tune | 20-100 |

### Calculator Sections

#### Machine Learning Training

```
What are you training?
( ) Image classification (CNN)
( ) Object detection
( ) Segmentation
( ) Language model fine-tuning
( ) Generative model
( ) Reinforcement learning

Dataset size:
( ) Small (<10K samples)              →  1-10 GPU-hours
( ) Medium (10K-100K samples)         →  10-50 GPU-hours
( ) Large (100K-1M samples)           →  50-200 GPU-hours
( ) Very large (>1M samples)          →  200+ GPU-hours

How many experiments/hyperparameter runs? [________]
```

#### GPU-Accelerated Simulation

```
What solver?
( ) GROMACS (molecular dynamics)
( ) AMBER (molecular dynamics)
( ) LAMMPS (materials science)
( ) GPU-accelerated CFD

Simulation length: [________] nanoseconds
System size: [________] atoms
```

#### ML Inference (Batch Processing)

```
What model are you running?
( ) Image classification (ResNet, EfficientNet)
( ) Object detection (YOLO, Faster R-CNN)
( ) Text embeddings (BERT, sentence transformers)
( ) LLM inference (7B-70B parameters)

How many items to process? [________]
Batch size: [________]

┌──────────────────────────────────────┐
│  100,000 images ÷ 1,000 per hour     │
│  = 100 GPU-hours                     │
└──────────────────────────────────────┘
```

---

## ACCESS Credits Explainer

### What's ACCESS?

> ACCESS (Advanced Cyberinfrastructure Coordination Ecosystem: Services & Support) provides free compute time on national supercomputers. It's funded by the NSF, so US researchers can use it at no cost.

### Allocation Tiers

```
┌────────────────────────────────────────────────────────────────┐
│  ACCESS Explore        │  Up to 400,000 credits                │
│  ─────────────────────────────────────────────────────────────│
│  • Automatic approval (just register!)                        │
│  • Great for: Testing, small projects, getting started        │
│  • Timeline: Access within days                               │
├────────────────────────────────────────────────────────────────┤
│  ACCESS Discover       │  Up to 1,500,000 credits              │
│  ─────────────────────────────────────────────────────────────│
│  • CV review (usually approved)                               │
│  • Great for: Small research projects, coursework             │
│  • Timeline: 1-2 weeks                                        │
├────────────────────────────────────────────────────────────────┤
│  ACCESS Accelerate     │  Up to 3,000,000 credits              │
│  ─────────────────────────────────────────────────────────────│
│  • Merit review required                                      │
│  • Great for: Funded research, publications                   │
│  • Timeline: Quarterly review cycles                          │
├────────────────────────────────────────────────────────────────┤
│  ACCESS Maximize       │  Unlimited (what you need)            │
│  ─────────────────────────────────────────────────────────────│
│  • Full peer review                                           │
│  • Great for: Large-scale, flagship computations              │
│  • Timeline: Quarterly review cycles                          │
└────────────────────────────────────────────────────────────────┘
```

### What's an ACCESS Credit?

> ACCESS credits are a universal currency across all ACCESS systems. 1 credit ≈ 1 CPU-core-hour on a standard system, but the exact exchange rate varies by machine. GPU systems cost more credits per hour.

### Credit Exchange Rates (Approximate)

| Resource | Credits per Hour |
|----------|-----------------|
| 1 CPU-core on Expanse (SDSC) | 1 credit |
| 1 CPU-core on Stampede3 (TACC) | 1 credit |
| 1 A100 GPU on Delta (NCSA) | ~4 credits |
| 1 H100 GPU on Delta | ~6 credits |
| 1 TB storage/month | ~1 credit |

### How Many Credits Do I Need?

| Project Type | Typical Credits |
|--------------|-----------------|
| Course project / learning | 10,000 - 50,000 |
| Master's thesis | 50,000 - 200,000 |
| PhD dissertation | 100,000 - 500,000 |
| Single funded research project | 200,000 - 2,000,000 |
| Large-scale simulation campaign | 1,000,000+ |

*A typical PhD thesis project uses 100K-500K credits over 3-4 years.*

---

## Implementation Notes

### Component Structure

```
src/components/
  estimate/
    HelpEstimateModal.vue      # Main modal wrapper with tabs
    StorageEstimator.vue       # Storage tab content
    CpuEstimator.vue           # CPU compute tab content
    GpuEstimator.vue           # GPU compute tab content
    AccessExplainer.vue        # ACCESS credit explanation
    calculators/
      MicroscopyCalc.vue       # Individual calculator widgets
      GenomicsCalc.vue
      VideoCalc.vue
      ...
```

### State Flow

1. User enters domain-specific inputs (e.g., "10,000 4K microscopy images")
2. Calculator converts to base units (e.g., 320 GB)
3. Safety multiplier applied (e.g., 1.5x → 480 GB)
4. Rounded to user-friendly value (e.g., 0.5 TB)
5. User clicks "Use this estimate" → value flows to parent form

### Storing Conversion Factors

Conversion factors should be stored in a config file (not hardcoded) so product specialists can update them:

```yaml
# config/conversions.yaml
microscopy:
  resolutions:
    2k:
      dimensions: "2048 × 2048"
      size_8bit_gray_mb: 4
      size_16bit_gray_mb: 8
      size_16bit_rgb_mb: 24
    4k:
      dimensions: "4096 × 4096"
      size_8bit_gray_mb: 16
      size_16bit_gray_mb: 32
      size_16bit_rgb_mb: 96
    8k:
      dimensions: "8192 × 8192"
      size_8bit_gray_mb: 64
      size_16bit_gray_mb: 128
      size_16bit_rgb_mb: 384

genomics:
  wgs_30x:
    raw_fastq_gb: 150
    aligned_bam_gb: 75
    vcf_mb: 300
```

### Accessibility

- All calculators must work with keyboard only
- Results announced to screen readers
- Color not used as sole indicator
- Clear labeling of all form fields

---

## Future Enhancements

### Smart Recommendations

Once a user estimates their needs, we could proactively recommend:
- Appropriate service tier
- Relevant bundles
- Training resources for their domain

### History & Comparison

Allow users to save estimates and compare scenarios:
- "What if I have 20,000 images instead of 10,000?"
- "What if I use 8K resolution?"

### Domain Detection

Use earlier survey answers to pre-select the relevant calculator:
- User selected "Microscopy" discipline → open Storage tab with Microscopy calculator expanded
- User selected "Machine Learning" methodology → open GPU tab

---

## Bottom Line: What Help Me Estimate Must Have

Based on UX testing, the modal MUST include:

1. **Unit converters** - photos → TB, workflows → SUs, models → GPU-hours
2. **Inline acronym definitions** - tooltips for HPC, GPU, SU, PHI, etc.
3. **Tier decision tree** - discipline-specific examples for Low/Medium/High
4. **Workload presets by field** - genomics, ML, simulation, humanities archives
5. **Show the math** - transparency builds trust ("10,000 × 32 MB = 320 GB")
6. **Always round up** - recommend 1.5-2x for safety margin

### Quick Reference Cards

For users who just want a number without the calculator:

**Storage (photos/files → TB):**
- 1 TB ≈ 200,000 smartphone photos (5 MB each)
- 1 TB ≈ 30,000 DSLR RAW photos
- 1 TB ≈ 30,000 4K microscopy images (16-bit grayscale)
- 1 TB ≈ 500,000 document scans (JPEG)
- 1 TB ≈ 250 hours of HD video
- 1 whole-genome sequence ≈ 100-200 GB raw

**Compute (task → SU):**
- 1 WGS alignment pipeline ≈ 100-500 SU per sample
- 1 hour of LAMMPS (1M atoms, 64 cores) ≈ 64 SU
- 1 RNA-seq pipeline ≈ 20-100 SU per sample

**GPU (task → GPU-hours):**
- Fine-tuning a 7B LLM ≈ 50-200 GPU-hours
- Training ResNet-50 on ImageNet ≈ 20-50 GPU-hours
- ANSYS FEA simulation (medium mesh) ≈ 10-100 GPU-hours

---

## Per-Persona Confusion Notes

Reference from UX testing - what each persona struggled with:

| Persona | Confusing Concepts |
|---------|-------------------|
| **Dr. Tonsley** (History) | TB, GB, tier, HPC, GPU, PHI, IRB, HIPAA, FISMA, CUI, SU, archive vs active |
| **Dr. Vex** (Physics) | Archive ratio slider ("I think in TB, not percentages"), SU vs core-hour terminology |
| **Dr. Selwick-Mira** (Chemistry) | Software licenses (where's Gaussian?), service indicator colors |
| **Dr. Transom** (ML) | GPU-hour vs SU conversion, spot/preemptible pricing, AWS presets ("just USD buckets") |
| **Dr. Vosker** (ECE/ITAR) | L3 vs L4 process, EDA tools (Cadence, Synopsys), FlexLM licenses |
| **Dr. Frindt-Sela** (Biomedical) | BAA, FDA 21 CFR Part 11, HIPAA compliance markers |

---

## References

- [UNIT-CONVERSIONS.md](./UNIT-CONVERSIONS.md) - Full conversion tables
- [COMPARISON-FEATURES.md](./COMPARISON-FEATURES.md) - Service comparison metadata
- [Foreign Concepts.md](./Foreign%20Concepts.md) - Raw UX feedback on confusing terms
- [ACCESS Allocations](https://allocations.access-ci.org/) - Official ACCESS documentation
