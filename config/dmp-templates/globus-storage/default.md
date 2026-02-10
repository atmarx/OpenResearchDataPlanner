## Globus Storage (iRODS)

Research data will be stored on {{institution.name}}'s Globus-connected storage
infrastructure, backed by a 5PB iRODS-managed storage array.

**Storage Allocation:**
- Storage requested: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Features:**
- 5PB total capacity on iRODS array
- Native Globus connectivity for high-speed transfers
- Metadata management through iRODS
- Replication for data durability
- Checksum verification on all files

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years post-project. iRODS metadata will track retention
requirements and automate lifecycle management.
{{/if}}

**Data Sharing:**
Globus enables secure data sharing with external collaborators at other
institutions. Transfers use GridFTP with encryption and automatic integrity
verification.

**Access Control:**
Access is managed through Globus groups and iRODS permissions. PIs can
delegate access management to authorized team members.
