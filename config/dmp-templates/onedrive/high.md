## Personal Cloud Storage (OneDrive)

Some project files containing {{tier.name}} data will be stored using
OneDrive for Business through {{institution.name}}'s Microsoft 365
subscription, which is covered under an institutional Business Associate
Agreement (BAA) with Microsoft.

**Storage Allocation:**
- Estimated usage: {{number service.estimate}} TB
- Cost: {{currency service.total_cost}} ({{#if (eq service.total_cost 0)}}included with institutional license{{else}}overage charges apply{{/if}})

**Security Controls:**
Given the {{tier.name}} classification of this data:
- Sharing disabled or restricted to authorized personnel only
- Microsoft sensitivity labels applied where appropriate
- External sharing prohibited
- Data remains within institutional Microsoft tenant

**Appropriate Use:**
OneDrive is used for:
- Working documents requiring easy access
- Files shared among authorized team members
- Documents not requiring high-throughput access

**Limitations:**
OneDrive is supplementary storage and not the primary repository for
research data. Large datasets, raw data, and archival copies are stored
on dedicated managed research storage infrastructure.

{{#if service.notes}}
**Additional Notes:**
{{service.notes}}
{{/if}}

**Data Protection:**
- Version history available for 30 days
- Deleted files recoverable for 93 days
- Encryption in transit and at rest
- Covered under Microsoft BAA for HIPAA compliance

**Access Control:**
Access is restricted to authorized project personnel. Sharing
permissions are managed by the PI with sharing limited to specific
{{institution.name}} accounts. No external sharing permitted for
{{tier.name}} data.
