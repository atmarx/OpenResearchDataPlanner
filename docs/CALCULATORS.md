# Individual Calculator Specifications

Detailed UI specifications for each "Help Me Estimate" calculator. Use these for UX testing with faculty before implementation.

---

## Calculator Index

| Category | Calculator | Estimates |
|----------|------------|-----------|
| **Storage** | [Microscopy](#microscopy-calculator) | TB |
| | [Genomics](#genomics-storage-calculator) | TB |
| | [Video/Audio](#videoaudio-calculator) | TB |
| | [Simulation Output](#simulation-output-calculator) | TB |
| | [General Files](#general-files-calculator) | TB |
| **Compute** | [HPC Batch Jobs](#hpc-batch-jobs-calculator) | SU (core-hours) |
| | [Genomics Pipelines](#genomics-pipelines-calculator) | SU |
| | [Simulations](#simulations-calculator) | SU |
| **GPU** | [ML Training](#ml-training-calculator) | GPU-hours |
| | [ML Inference](#ml-inference-calculator) | GPU-hours |

---

## Storage Calculators

### Microscopy Calculator

**Purpose:** Estimate storage for microscopy imaging data (confocal, light sheet, electron microscopy, etc.)

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Microscopy Storage Estimator                                   │
│                                                                 │
│  Quick Presets                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  Confocal   │ │ Light Sheet │ │ Electron    │              │
│  │  Core       │ │ Z-Stack     │ │ Microscopy  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Image Dimensions                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Resolution      [  2048  ] × [  2048  ] pixels            ││
│  │                  ○ 1K (1024)  ○ 2K (2048)  ● 4K (4096)     ││
│  │                  ○ 8K (8192)  ○ Custom                      ││
│  │                                                             ││
│  │  Bit Depth       ○ 8-bit     ● 16-bit     ○ 32-bit         ││
│  │                                                             ││
│  │  Channels        [  4  ]  (fluorescence channels)          ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Z-Stack / Time Series (optional)                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Z-slices per stack     [  50  ]                           ││
│  │  Time points            [   1  ]                           ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Dataset Size                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Number of images/stacks    [  5000  ]                     ││
│  │                                                             ││
│  │  Acquisition rate           [  500  ] per [ month ▼ ]      ││
│  │                                                             ││
│  │  ☐ Include space for processing intermediates              ││
│  │    (Adds 2x for analysis outputs)                          ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║        3.2 TB             ║                 ││
│  │              ║    current dataset        ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  Over your grant period:                                    ││
│  │  • After 1 year:     9.2 TB                                ││
│  │  • After 3 years:   21.2 TB                                ││
│  │                                                             ││
│  │  With 20% buffer:   25 TB recommended                      ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ▼ Show calculation                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  4096 × 4096 pixels × 2 bytes (16-bit) = 33.6 MB/plane     ││
│  │  × 4 channels × 50 z-slices = 6.7 GB per stack             ││
│  │  × 5,000 stacks = 33.5 TB raw                              ││
│  │  Compressed ~10x = 3.35 TB                                  ││
│  │  + 20% buffer = 4.0 TB                                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │  Use this estimate (25 TB) │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Presets:**

| Preset | Resolution | Bit Depth | Channels | Z-slices | Notes |
|--------|------------|-----------|----------|----------|-------|
| Confocal Core | 2048×2048 | 16-bit | 4 | 1 | Single plane, 4 color |
| Light Sheet | 2048×2048 | 16-bit | 2 | 200 | Z-stack |
| Electron Microscopy | 8192×8192 | 16-bit | 1 | 1 | Large single images |
| Live Cell | 1024×1024 | 16-bit | 2 | 1 | Time series (set time points) |

**Calculation Formula:**

```
bytes_per_pixel = bit_depth / 8
image_size_bytes = width × height × bytes_per_pixel × channels × z_slices × time_points
raw_total_bytes = image_size_bytes × image_count
compressed_bytes = raw_total_bytes × compression_ratio  # Default 0.1 (10x compression)
with_buffer = compressed_bytes × 1.2
with_processing = with_buffer × (processing_enabled ? 2 : 1)
```

**Output Format:**
- Primary: "X.X TB"
- With growth: "After N years: X.X TB"
- Recommended: "X TB (with buffer)"

---

### Genomics Storage Calculator

**Purpose:** Estimate storage for sequencing data (WGS, RNA-seq, single-cell, etc.)

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Genomics Storage Estimator                                     │
│                                                                 │
│  Sequencing Type                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ● Whole Genome Sequencing (WGS)                           ││
│  │  ○ Whole Exome Sequencing (WES)                            ││
│  │  ○ RNA-seq (bulk)                                          ││
│  │  ○ Single-cell RNA-seq                                     ││
│  │  ○ ChIP-seq / ATAC-seq                                     ││
│  │  ○ Long-read (PacBio / Nanopore)                           ││
│  │  ○ Custom / Other                                          ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Sample Details                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Number of samples       [  100  ]                         ││
│  │                                                             ││
│  │  Coverage depth          [  30  ] ×                        ││
│  │                          (typical: 30× for WGS, 100× WES)  ││
│  │                                                             ││
│  │  Organism                [ Human (3.2 Gb) ▼ ]              ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Data to Keep                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ☑ Raw reads (FASTQ)           ~100 GB/sample              ││
│  │  ☑ Aligned reads (BAM)         ~50 GB/sample               ││
│  │  ☑ Variant calls (VCF)         ~1 GB/sample                ││
│  │  ☐ Intermediate files          +50% of total               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║        15.1 TB            ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  Breakdown:                                                 ││
│  │  • Raw reads (FASTQ):     10.0 TB                          ││
│  │  • Aligned reads (BAM):    5.0 TB                          ││
│  │  • Variant calls (VCF):    0.1 TB                          ││
│  │                                                             ││
│  │  Recommended with buffer: 18 TB                            ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  💡 Tip: Raw FASTQ files can be archived after processing.     │
│     Consider archiving ~10 TB to cold storage.                  │
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │  Use this estimate (18 TB) │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Size Estimates (per sample at 30× coverage, human):**

| Data Type | Size | Notes |
|-----------|------|-------|
| Raw FASTQ | ~100 GB | Paired-end reads, compressed |
| Aligned BAM | ~50 GB | With duplicates marked |
| Sorted/Dedup BAM | ~30 GB | After duplicate removal |
| VCF/gVCF | ~1 GB | Variant calls only |

**Sequencing Type Multipliers:**

| Type | Base Size | Notes |
|------|-----------|-------|
| WGS 30× | 100 GB/sample | Full genome |
| WES 100× | 10 GB/sample | Exome only |
| RNA-seq | 5-20 GB/sample | Depends on depth |
| scRNA-seq | 1-5 GB/cell × cells | 10,000+ cells common |
| Long-read | 200 GB/sample | Less compression |

**Organism Sizes:**

| Organism | Genome Size | Affects coverage calculation |
|----------|-------------|------------------------------|
| Human | 3.2 Gb | Reference |
| Mouse | 2.8 Gb | ~0.9× human |
| Zebrafish | 1.4 Gb | ~0.4× human |
| E. coli | 4.6 Mb | ~0.001× human |
| Custom | User input | Any value |

---

### Video/Audio Calculator

**Purpose:** Estimate storage for video and audio recordings

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Video/Audio Storage Estimator                                  │
│                                                                 │
│  Media Type                                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ● Video    ○ Audio only                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Video Settings                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Resolution        ○ 720p   ● 1080p   ○ 4K   ○ 8K          ││
│  │                                                             ││
│  │  Frame rate        ○ 24 fps  ● 30 fps  ○ 60 fps            ││
│  │                                                             ││
│  │  Codec/Quality     ● H.264 (good compression)              ││
│  │                    ○ ProRes (editing quality)              ││
│  │                    ○ RAW (uncompressed)                    ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Recording Amount                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Total recording time    [  100  ] hours                   ││
│  │                                                             ││
│  │  Or describe your project:                                  ││
│  │  [ 50 ] sessions × [ 2 ] hours each = 100 hours            ││
│  │                                                             ││
│  │  ☐ Include backup copies (+100%)                           ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║         750 GB            ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  1080p @ 30fps, H.264 ≈ 7.5 GB/hour                        ││
│  │  100 hours × 7.5 GB = 750 GB                               ││
│  │                                                             ││
│  │  Recommended with buffer: 1 TB                             ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │   Use this estimate (1 TB) │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Size Reference (GB per hour):**

| Resolution | H.264 | ProRes | RAW |
|------------|-------|--------|-----|
| 720p 30fps | 3 | 50 | 200 |
| 1080p 30fps | 7.5 | 110 | 500 |
| 4K 30fps | 30 | 440 | 2000 |
| 4K 60fps | 60 | 880 | 4000 |
| 8K 30fps | 120 | 1760 | 8000 |

**Audio only:**

| Quality | Size |
|---------|------|
| MP3 128kbps | 55 MB/hour |
| WAV 16-bit 44.1kHz | 635 MB/hour |
| WAV 24-bit 96kHz | 2 GB/hour |

---

### Simulation Output Calculator

**Purpose:** Estimate storage for computational simulation outputs

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Simulation Output Storage Estimator                            │
│                                                                 │
│  Simulation Type                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ○ Molecular Dynamics (GROMACS, AMBER, NAMD)               ││
│  │  ○ Computational Fluid Dynamics (OpenFOAM, ANSYS)          ││
│  │  ○ Finite Element Analysis                                  ││
│  │  ○ Climate/Weather Modeling                                 ││
│  │  ● Custom / Other                                           ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Output Details                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Checkpoint/frame size    [  500  ] MB                     ││
│  │                                                             ││
│  │  Frames to save           [  1000 ]                        ││
│  │                                                             ││
│  │  Number of simulations    [   10  ]                        ││
│  │                                                             ││
│  │  ☑ Keep trajectory files                                   ││
│  │  ☐ Keep all intermediate checkpoints                       ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║         5.0 TB            ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  500 MB × 1000 frames × 10 simulations = 5.0 TB            ││
│  │                                                             ││
│  │  Recommended with buffer: 6 TB                             ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │   Use this estimate (6 TB) │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Presets (typical outputs):**

| Type | Frame Size | Typical Frames | Notes |
|------|------------|----------------|-------|
| MD (GROMACS) | 50-500 MB | 10,000-1M | Depends on atoms |
| CFD (OpenFOAM) | 1-10 GB | 1000-10,000 | 3D mesh size |
| FEA | 100 MB - 1 GB | 100-1000 | Result at each timestep |
| Climate | 10-100 GB | 1000+ | Global grid |

---

### General Files Calculator

**Purpose:** Quick estimate for common file types (documents, data files, etc.)

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  General Storage Estimator                                      │
│                                                                 │
│  What are you storing?                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  File Type               Count        Size Each             ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │  📄 Documents (PDF, Word)   [ 10000 ]   ~2 MB each         ││
│  │  📊 Spreadsheets            [  1000 ]   ~5 MB each         ││
│  │  📈 Data files (CSV, JSON)  [  5000 ]   ~10 MB each        ││
│  │  🔬 Scientific formats      [   500 ]   ~100 MB each       ││
│  │     (HDF5, NetCDF, FITS)                                    ││
│  │  📦 Archives (ZIP, tar)     [   100 ]   ~1 GB each         ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Or enter directly:                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  I already know I need approximately [      ] [ TB ▼ ]     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Documents:         20 GB                                   ││
│  │  Spreadsheets:       5 GB                                   ││
│  │  Data files:        50 GB                                   ││
│  │  Scientific:        50 GB                                   ││
│  │  Archives:         100 GB                                   ││
│  │  ──────────────────────                                     ││
│  │  Total:            225 GB                                   ││
│  │                                                             ││
│  │  Recommended with buffer: 500 GB (0.5 TB)                  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │ Use this estimate (0.5 TB) │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Compute Calculators (SU)

### HPC Batch Jobs Calculator

**Purpose:** Estimate Service Units (core-hours) for general HPC batch jobs

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  HPC Compute Estimator                                          │
│                                                                 │
│  What is a Service Unit (SU)?                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  1 SU = 1 CPU core running for 1 hour                      ││
│  │  Example: A 32-core job running for 10 hours = 320 SU      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Your Job Details                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Cores per job          [  32  ]                           ││
│  │                         ○ 1  ○ 8  ● 32  ○ 64  ○ 128        ││
│  │                                                             ││
│  │  Hours per job          [  10  ]                           ││
│  │                         ○ 1  ○ 4  ● 10  ○ 24  ○ 48         ││
│  │                                                             ││
│  │  Number of jobs         [ 1000 ]                           ││
│  │                                                             ││
│  │  Or describe your project:                                  ││
│  │  [ 100 ] samples × [ 10 ] runs each = 1000 jobs            ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║      320,000 SU           ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  32 cores × 10 hours × 1,000 jobs = 320,000 SU             ││
│  │                                                             ││
│  │  At $0.01/SU = $3,200                                      ││
│  │  (First 10,000 SU free per year)                           ││
│  │                                                             ││
│  │  With 20% buffer: 400,000 SU                               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  For reference:                                                 │
│  • Small project: ~10,000 SU/year                              │
│  • Medium project: ~100,000 SU/year                            │
│  • Large project: ~1,000,000+ SU/year                          │
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │    Use 400,000 SU          │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Formula:**

```
SU = cores × hours × jobs × buffer
```

---

### Genomics Pipelines Calculator

**Purpose:** Estimate compute for common genomics workflows

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Genomics Pipeline Compute Estimator                            │
│                                                                 │
│  Pipeline Type                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ● WGS Alignment + Variant Calling (BWA + GATK)            ││
│  │  ○ RNA-seq (STAR + featureCounts)                          ││
│  │  ○ Single-cell RNA-seq (Cell Ranger)                       ││
│  │  ○ ChIP-seq peak calling                                   ││
│  │  ○ De novo assembly                                         ││
│  │  ○ Metagenomics                                             ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Sample Details                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Number of samples       [  100  ]                         ││
│  │                                                             ││
│  │  Coverage (if WGS/WES)   [  30  ] ×                        ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║       30,000 SU           ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  WGS 30× alignment + variant calling                        ││
│  │  ~300 SU per sample × 100 samples = 30,000 SU              ││
│  │                                                             ││
│  │  Wall time estimate: ~6 hours per sample on 32 cores       ││
│  │                                                             ││
│  │  With 20% buffer: 36,000 SU                                ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │     Use 36,000 SU          │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Pipeline Estimates (per sample):**

| Pipeline | SU/Sample | Notes |
|----------|-----------|-------|
| WGS Alignment (BWA) | 100-200 SU | 30× human |
| Variant Calling (GATK) | 100-300 SU | Depends on coverage |
| RNA-seq (STAR) | 20-50 SU | Per sample |
| scRNA-seq (Cell Ranger) | 50-200 SU | Per 10K cells |
| ChIP-seq | 10-30 SU | Per sample |
| De novo assembly | 500-2000 SU | Highly variable |

---

### Simulations Calculator

**Purpose:** Estimate compute for scientific simulations

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Simulation Compute Estimator                                   │
│                                                                 │
│  Simulation Package                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ● GROMACS (Molecular Dynamics)                            ││
│  │  ○ LAMMPS (Molecular Dynamics)                             ││
│  │  ○ NAMD (Molecular Dynamics)                               ││
│  │  ○ OpenFOAM (CFD)                                          ││
│  │  ○ ANSYS Fluent (CFD)                                      ││
│  │  ○ Gaussian (Quantum Chemistry)                            ││
│  │  ○ Custom / Other                                          ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  System Details (for GROMACS)                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  System size              [ 100000 ] atoms                 ││
│  │                           ○ Small (<10K)  ● Medium (10K-1M)││
│  │                           ○ Large (>1M)                     ││
│  │                                                             ││
│  │  Simulation length        [  100  ] ns                     ││
│  │                                                             ││
│  │  Number of replicas       [   3   ]                        ││
│  │                                                             ││
│  │  ☐ Using GPU acceleration                                  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║      150,000 SU           ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  100K atom system: ~50 ns/day on 32 cores                  ││
│  │  100 ns × 3 replicas = 300 ns total                        ││
│  │  300 ns ÷ 50 ns/day = 6 days = 144 hours                   ││
│  │  144 hours × 32 cores × 3 = ~14,000 SU per system          ││
│  │                                                             ││
│  │  Note: With GPU acceleration, ~10× faster                  ││
│  │                                                             ││
│  │  With 20% buffer: 180,000 SU                               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │    Use 180,000 SU          │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## GPU Calculators

### ML Training Calculator

**Purpose:** Estimate GPU-hours for machine learning model training

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ML Training GPU Estimator                                      │
│                                                                 │
│  Model Type                                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ○ Small CNN (ResNet-18, VGG-16)                           ││
│  │  ● Medium CNN (ResNet-50, EfficientNet)                    ││
│  │  ○ Large CNN (ResNet-152)                                   ││
│  │  ○ Transformer (BERT-base)                                  ││
│  │  ○ Large Transformer (GPT-2, BERT-large)                   ││
│  │  ○ Vision Transformer (ViT)                                 ││
│  │  ○ Custom                                                   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Training Details                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Dataset size            [ 100000 ] images/samples         ││
│  │                                                             ││
│  │  Epochs                  [  100   ]                        ││
│  │                                                             ││
│  │  Batch size              [   32   ]                        ││
│  │                                                             ││
│  │  Number of experiments   [   10   ]                        ││
│  │  (hyperparameter search, etc.)                              ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  GPU Selection                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ○ V100 (16GB) - Good for most training                    ││
│  │  ● A100 (40GB) - Large models, fast training               ││
│  │  ○ A100 (80GB) - Very large models                         ││
│  │                                                             ││
│  │  GPUs per job            [   4   ]                         ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║     400 GPU-hours         ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  ResNet-50 on 100K images:                                  ││
│  │  ~10 min/epoch on 4× A100 = ~17 hours per full training    ││
│  │  × 10 experiments = 170 GPU-hours                          ││
│  │  × 4 GPUs = 680 GPU-hours                                  ││
│  │                                                             ││
│  │  With failed runs buffer: 800 GPU-hours                    ││
│  │                                                             ││
│  │  At $2.00/GPU-hour = ~$1,600                               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  💡 Tip: Start with smaller experiments to validate approach   │
│     before committing to full training runs.                    │
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │  Use 800 GPU-hours         │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Training Time Estimates (per epoch, ImageNet-scale, single GPU):**

| Model | V100 | A100 40GB | A100 80GB |
|-------|------|-----------|-----------|
| ResNet-18 | 15 min | 8 min | 8 min |
| ResNet-50 | 30 min | 15 min | 15 min |
| ResNet-152 | 90 min | 45 min | 45 min |
| BERT-base | 2 hours | 1 hour | 1 hour |
| BERT-large | 6 hours | 3 hours | 2.5 hours |

---

### ML Inference Calculator

**Purpose:** Estimate GPU-hours for inference/prediction workloads

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ML Inference GPU Estimator                                     │
│                                                                 │
│  Inference Type                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ● Batch inference (process large dataset)                 ││
│  │  ○ Interactive/API (serve predictions)                     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Model Details                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Model type              [ Image Classification ▼ ]        ││
│  │                                                             ││
│  │  Inference time/sample   [  50  ] ms                       ││
│  │  (or select model to auto-estimate)                        ││
│  │                                                             ││
│  │  Samples to process      [ 1000000 ]                       ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  Your Estimate                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              ╔═══════════════════════════╗                 ││
│  │              ║      14 GPU-hours         ║                 ││
│  │              ╚═══════════════════════════╝                 ││
│  │                                                             ││
│  │  1M samples × 50ms = 50,000 seconds = 14 hours             ││
│  │                                                             ││
│  │  With overhead buffer: 20 GPU-hours                        ││
│  │                                                             ││
│  │  At $0.50/GPU-hour = ~$10                                  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    Try another type      │  │   Use 20 GPU-hours         │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuration

All calculators can be customized in `config/calculators.yaml`:

```yaml
# Which calculators are enabled (and their display order)
enabled_calculators:
  storage:
    - microscopy
    - photography
    - genomics
    - video
    - medical-imaging
    - documents

  cpu:
    - genomics-pipelines
    - simulations
    - batch-processing
    - statistics

  gpu:
    - ml-training
    - ml-inference
    - gpu-simulation

  api:
    - llm-api-costs

# Per-calculator customization
calculator_config:
  microscopy:
    presets:
      - label: "Confocal Core"
        resolution: "4k"         # must match a resolutions key (2k/4k/8k)
        bit_depth: 16
        channels: 4
        description: "Standard confocal microscope settings"
      - label: "Light Sheet"
        resolution: "4k"
        bit_depth: 16
        channels: 2
        z_slices: 200
        description: "Light sheet microscopy with Z-stack"

  # Institution-specific pipeline benchmarks (a compute calculator)
  genomics-pipelines:
    pipelines:
      - label: "WGS Alignment (BWA-MEM2)"
        su_per_sample: 300
        description: "30x genome alignment"

  ml-training:
    model_sizes:
      - label: "Small (ViT-B, Llama 3.2 3B)"
        typical_hours: 10
        description: "Fine-tuning or small datasets"

# Global settings — a top-level key, sibling to the two above
global:
  safety_multiplier: 1.5    # Add 50% buffer to all estimates
  safety_message: "Includes 1.5x buffer for processing intermediates"
  show_calculation: true    # Show math breakdown
  show_cost_estimate: true  # Show dollar amounts
```

---

## Accessibility

All calculators must meet these requirements:

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Tab through fields, Enter to submit |
| Screen reader | Proper labels, live regions for results |
| Color contrast | 4.5:1 minimum |
| Error handling | Clear error messages with field association |
| Focus management | Focus moves to result after calculation |

---

## Related Documentation

- [ELI5-IMPLEMENTATION.md](ELI5-IMPLEMENTATION.md) — Calculator architecture
- [EXPLORE-FIRST.md](EXPLORE-FIRST.md) — Standalone calculator access
- [UNIT-CONVERSIONS.md](UNIT-CONVERSIONS.md) — Conversion reference
