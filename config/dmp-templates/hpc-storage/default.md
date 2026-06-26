## HPC Storage

Research data will be stored on {{institution.name}}'s Ceph storage cluster,
designed for HPC workflows requiring persistent, durable data storage.

**Storage Allocation:**
- Active storage needed: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Features:**
- ~750TB usable capacity, 3x replicated across nodes for durability
- CephFS mounted on all HPC compute nodes
- Continuous scrubbing to detect and repair silent data corruption
- Daily snapshots retained for 30 days
- Accessed via SSH/SFTP (scp) from campus

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. After the active grant period, data can be
migrated to cloud archive storage:
- Archive storage: {{number archive.estimate}} TB
- Annual archive cost: {{currency archive.annual_cost}}
- Total retention cost: {{currency archive.total_cost}}
{{/if}}

**Data Handling:**
Note that BeeGFS scratch (100TB) is included free with HPC compute but is
ephemeral - data is purged regularly. Use Ceph for any data that needs
to persist. Replication protects against hardware failure but not accidental
deletion; the 30-day snapshots are the only recovery window, so retain
independent copies of irreplaceable data.

**Access Control:**
Access is managed through Unix groups controlled by the PI. Storage quotas
are enforced per project allocation.
