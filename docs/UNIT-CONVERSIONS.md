# Unit Conversion Reference

This document provides unit conversion examples for helping researchers estimate storage and compute needs. These conversions are used in the UI to make technical units (TB, SU, GPU-hours) accessible to non-technical users.

---

## Storage Units

### Base conversions

| Unit | Bytes | Relationship |
|------|-------|--------------|
| 1 KB (kilobyte) | 1,000 | 1,000 bytes |
| 1 MB (megabyte) | 1,000,000 | 1,000 KB |
| 1 GB (gigabyte) | 1,000,000,000 | 1,000 MB |
| 1 TB (terabyte) | 1,000,000,000,000 | 1,000 GB |
| 1 PB (petabyte) | 1,000,000,000,000,000 | 1,000 TB |

*Note: We use SI units (base 1000) which match cloud provider billing. Binary units (KiB, MiB, GiB) use base 1024.*

---

## Photography & Imaging

### Consumer photography

| Image Type | Typical Size | Per GB | Per TB |
|------------|-------------|--------|--------|
| Smartphone photo (12MP, JPEG) | 3-5 MB | ~250 | ~250,000 |
| DSLR photo (24MP, JPEG) | 8-12 MB | ~100 | ~100,000 |
| DSLR photo (24MP, RAW) | 25-40 MB | ~30 | ~30,000 |
| Medium format (100MP, RAW) | 100-150 MB | ~8 | ~8,000 |

### Archival & document scanning

| Image Type | Typical Size | Per GB | Per TB |
|------------|-------------|--------|--------|
| Document scan (300 DPI, JPEG) | 0.5-2 MB | ~700 | ~700,000 |
| Document scan (600 DPI, TIFF) | 5-15 MB | ~100 | ~100,000 |
| Archival scan (high-res TIFF) | 50-200 MB | ~10 | ~10,000 |
| Manuscript page (archival TIFF, 16-bit) | 100-300 MB | ~5 | ~5,000 |

### Scientific microscopy

| Resolution | Uncompressed Size | Per GB | Per TB |
|------------|-------------------|--------|--------|
| 2K (2048 × 2048, 16-bit grayscale) | ~8 MB | ~125 | ~125,000 |
| 2K (2048 × 2048, 16-bit RGB) | ~24 MB | ~40 | ~40,000 |
| 4K (4096 × 4096, 16-bit grayscale) | ~32 MB | ~30 | ~30,000 |
| 4K (4096 × 4096, 16-bit RGB) | ~96 MB | ~10 | ~10,000 |
| 8K (8192 × 8192, 16-bit grayscale) | ~128 MB | ~8 | ~8,000 |
| 8K (8192 × 8192, 16-bit RGB) | ~384 MB | ~2.5 | ~2,500 |

### Microscopy modalities

| Modality | Typical Image Size | Notes |
|----------|-------------------|-------|
| Brightfield (standard) | 8-32 MB | Single channel, 2K-4K |
| Fluorescence (multi-channel) | 50-200 MB | 3-5 channels, 2K-4K |
| Confocal Z-stack | 200 MB - 2 GB | 50-200 slices per stack |
| Light sheet (single timepoint) | 1-10 GB | Full specimen volume |
| Light sheet (time-lapse, 24hr) | 100 GB - 1 TB | Per experiment |
| Electron microscopy (TEM) | 50-500 MB | Per image |
| Cryo-EM (single particle) | 1-5 TB | Per dataset |
| Whole slide imaging (pathology) | 500 MB - 5 GB | Per slide at 40x |

### Medical imaging

| Modality | Typical Size | Per TB |
|----------|-------------|--------|
| X-ray (single) | 10-30 MB | ~50,000 |
| CT scan (full study) | 100-500 MB | ~3,000 |
| MRI scan (full study) | 50-200 MB | ~7,000 |
| PET/CT (combined) | 500 MB - 1 GB | ~1,500 |
| Mammography (4 views) | 100-200 MB | ~7,000 |
| Ultrasound video (10 min) | 500 MB - 2 GB | ~1,000 |
| DICOM archive (per patient/year) | 1-10 GB | ~200 |

---

## Video & Motion Capture

| Format | Per Hour | Per TB |
|--------|----------|--------|
| HD video (1080p, compressed) | 2-5 GB | ~300 hours |
| 4K video (compressed) | 10-20 GB | ~60 hours |
| 4K video (ProRes, production) | 100-200 GB | ~6 hours |
| High-speed video (1000fps, 1080p) | 200-500 GB | ~2.5 hours |
| Motion capture (marker data only) | 100 MB | ~10,000 hours |
| Motion capture (with video) | 10-50 GB | ~30 hours |

---

## Genomics & Bioinformatics

| Data Type | Typical Size | Notes |
|-----------|-------------|-------|
| Whole genome sequencing (30x) | 100-200 GB | Raw FASTQ |
| WGS aligned (BAM) | 50-100 GB | Per sample |
| WGS variant calls (VCF) | 100-500 MB | Per sample |
| RNA-seq (per sample) | 5-20 GB | Raw FASTQ |
| Single-cell RNA-seq (10x) | 20-100 GB | Per run |
| Proteomics (mass spec) | 1-10 GB | Per experiment |
| Metabolomics | 500 MB - 5 GB | Per experiment |

### Genomics rules of thumb

- **WGS project (50 samples):** ~5-10 TB raw, ~2-5 TB aligned
- **RNA-seq project (100 samples):** ~1-2 TB raw
- **Single-cell (10 runs):** ~500 GB - 1 TB

---

## Compute Units

### Service Units (SU)

| Definition | Conversion |
|------------|------------|
| 1 SU | 1 CPU-core-hour |
| 1 node-hour (32 cores) | 32 SU |
| 1 node-hour (128 cores) | 128 SU |
| 1 GPU-hour (V100) | ~10 SU (weighted) |

### Workload estimates

| Workload | SU per run | Notes |
|----------|------------|-------|
| Simple analysis script | 1-10 SU | Single core, minutes |
| Genomics alignment (30x WGS) | 100-500 SU | Per sample |
| WGS variant calling | 50-200 SU | Per sample |
| RNA-seq pipeline | 20-100 SU | Per sample |
| Molecular dynamics (short) | 1,000-5,000 SU | 1 ns simulation |
| CFD simulation (moderate) | 5,000-50,000 SU | Depends on mesh |
| ML training (small model) | 100-1,000 SU | CPU-based |

### GPU hours

| Workload | GPU-hours | Notes |
|----------|-----------|-------|
| ML inference testing | 1-10 | Model evaluation |
| CNN training (ResNet) | 10-50 | ImageNet-scale |
| LLM fine-tuning (7B) | 50-200 | Depends on dataset |
| LLM training (from scratch) | 10,000+ | Not practical on V100 |
| FEA simulation (moderate) | 10-100 | GPU-accelerated solver |
| Molecular dynamics (GPU) | 100-1,000 | Protein simulation |

---

## Cloud Cost Estimates

### AWS/Azure compute (approximate)

| Instance Size | Specs | Monthly (always-on) |
|--------------|-------|---------------------|
| Small | 2 vCPU, 8 GB | $50-75 |
| Medium | 8 vCPU, 32 GB | $200-300 |
| Large | 32 vCPU, 128 GB | $800-1,200 |
| GPU (A100) | 8 vCPU, 1 GPU | $2,500-4,000 |

### Cloud storage (approximate)

| Tier | Per TB/month | Use case |
|------|--------------|----------|
| Hot (S3 Standard, Blob Hot) | $20-25 | Active data |
| Cold (S3-IA, Blob Cool) | $10-15 | Infrequent access |
| Archive (Glacier, Blob Archive) | $1-2 | Long-term retention |

---

## Quick Reference Cards

### For humanities researchers

> **"I have photographs of manuscripts..."**
>
> | Your data | Estimated storage |
> |-----------|-------------------|
> | 1,000 archival scans (TIFF) | ~100-200 GB |
> | 5,000 archival scans (TIFF) | ~500 GB - 1 TB |
> | 10,000 archival scans (TIFF) | ~1-2 TB |
> | 50,000 document scans (JPEG) | ~50-100 GB |

### For microscopy researchers

> **"I have microscopy images..."**
>
> | Your data | Estimated storage |
> |-----------|-------------------|
> | 1,000 brightfield (4K) | ~30-100 GB |
> | 100 confocal Z-stacks | ~20-200 GB |
> | 10 light sheet timelapses | ~100 GB - 1 TB |
> | 50 whole slide images | ~25-250 GB |
> | 1 cryo-EM dataset | ~1-5 TB |

### For genomics researchers

> **"I have sequencing data..."**
>
> | Your data | Estimated storage |
> |-----------|-------------------|
> | 10 WGS samples (raw) | ~1-2 TB |
> | 50 WGS samples (aligned) | ~2.5-5 TB |
> | 100 RNA-seq samples | ~1-2 TB |
> | 10 single-cell runs | ~500 GB - 1 TB |

### For clinical researchers

> **"I have medical imaging..."**
>
> | Your data | Estimated storage |
> |-----------|-------------------|
> | 100 patients (mixed imaging) | ~100-500 GB |
> | 500 patients (CT/MRI heavy) | ~500 GB - 2 TB |
> | 1,000 patients (imaging archive) | ~1-10 TB |

---

## Implementation Notes

### UI integration

These conversions should be surfaced in the EstimateStep component:
- Show relevant examples based on service type (storage vs compute)
- Allow users to select their data type and get estimates
- Include discipline-specific presets

### Suggested UI pattern

```
How much storage do you need?

[______] TB

Not sure? Tell us about your data:
- [ ] I have _____ microscopy images at [2K/4K/8K] resolution
- [ ] I have _____ archival scans
- [ ] I have _____ whole genome samples
- [ ] I have _____ hours of video

[Calculate estimate]
```

### Accuracy disclaimer

All estimates are approximate. Actual storage needs depend on:
- Compression settings
- Bit depth and color channels
- Metadata and derived files
- Processing intermediates (often 2-5x raw data)

Recommend users estimate **1.5-2x** their calculated raw data size to account for intermediates and growth.
