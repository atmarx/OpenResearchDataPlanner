## HPC Storage

Research data will be stored on {{institution.name}}'s Isilon storage array,
designed for HPC workflows requiring persistent data storage.

**Storage Allocation:**
- Active storage needed: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Features:**
- 500TB total cluster capacity
- Mounted on all HPC compute nodes
- Daily snapshots retained for 30 days
- Accessible via SCP/SFTP from campus

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
ephemeral - data is purged regularly. Use Isilon for any data that needs
to persist.

**Access Control:**
Access is managed through Unix groups controlled by the PI. Storage quotas
are enforced per project allocation.
