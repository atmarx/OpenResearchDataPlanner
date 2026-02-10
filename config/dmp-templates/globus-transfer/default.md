## Data Transfer

Research data transfers will utilize {{institution.name}}'s Globus endpoint,
providing reliable high-speed data movement backed by a 5PB iRODS-managed
storage array.

**Transfer Capacity:**
- Estimated monthly transfer volume: {{number service.estimate}} TB
- Cost: {{currency service.monthly_cost}} (no charge for transfers)

**Service Features:**
- High-performance data transfer between institutions
- Automated transfer scheduling and retry
- Checksum verification for data integrity
- Detailed transfer logging and audit trail
- Integration with major research computing centers and cloud providers

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Data Handling:**
Globus transfers data between endpoints without persistent storage. For
long-term retention, data should be transferred to research storage.
The iRODS backend provides metadata management and policy-based data
organization for transferred datasets.

**Access Control:**
Globus access is controlled through institutional identity federation.
Endpoint sharing permissions are managed by the data owner. Transfer
logs are maintained for audit purposes.
