## HPC Computing (CPU)

Research computations will be performed using {{institution.name}}'s
SLURM-managed HPC cluster for CPU-focused batch workloads.

**Resource Allocation:**
- Estimated CPU-hours per month: {{number service.estimate}} SU
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period total: {{currency service.total_cost}}

**Compute Resources:**
- Multi-core CPU nodes (up to 128 cores per node)
- High-memory nodes available (up to 1TB RAM)
- InfiniBand interconnect for MPI jobs
- 100TB BeeGFS scratch storage (free, ephemeral)

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Data Handling:**
Scratch storage on BeeGFS is included free but is ephemeral - data is purged
regularly. Use HPC Storage (Isilon) for any data that needs to persist beyond
job completion.

**Access Control:**
Access is managed through the HPC account system. Project members must be
authorized by the PI and complete required HPC orientation training.
