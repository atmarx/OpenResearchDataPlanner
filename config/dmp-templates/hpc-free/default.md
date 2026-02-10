## HPC Computing (Free Tier)

Research computations will utilize {{institution.name}}'s HPC free tier,
providing access to SLURM-managed compute resources at no cost.

**Resource Allocation:**
- Duration: {{number service.estimate}} months
- Cost: {{currency service.total_cost}} (free tier)

**Free Tier Limits:**
- Up to 1,000 CPU-hours/month
- Up to 100 GPU-hours/month (V100, preemptible)
- 100GB BeeGFS scratch space (ephemeral)
- Jobs may be preempted by paid users

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

**Data Handling:**
Data is stored on ephemeral BeeGFS scratch during computation. For persistent
storage, data must be transferred to HPC Storage (Isilon) or other approved
storage systems.

**Access Control:**
Access is managed through the HPC account system. Project members must be
authorized by the PI and complete required HPC orientation training.
