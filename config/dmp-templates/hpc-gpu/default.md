## HPC GPU Computing

Research computations will utilize {{institution.name}}'s GPU partition
on the SLURM-managed HPC cluster, featuring NVIDIA V100 accelerators.

**Resource Allocation:**
- Estimated GPU-hours per month: {{number service.estimate}}
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period total: {{currency service.total_cost}}

**Hardware:**
- NVIDIA V100 GPUs (2 per node, 32GB HBM2 each)
- CUDA, OpenCL, and vendor-optimized libraries
- 100TB BeeGFS scratch storage (free, ephemeral)

**Best Use Cases:**
V100 GPUs are optimized for simulation workloads including finite element
analysis (FEA), computational fluid dynamics (CFD), and molecular dynamics.
For heavy ML/AI training, consider the K8s cluster (H200/GH200/A100) or
cloud GPU options.

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Data Handling:**
Scratch storage on BeeGFS is included free but is ephemeral. Use HPC Storage
(Isilon) for persistent data and results that need to survive beyond job
completion.

**Access Control:**
Access is managed through the HPC account system. Project members must be
authorized by the PI and complete required HPC orientation training.
