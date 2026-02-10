## Personal Cloud Storage (OneDrive)

Some project files will be stored using OneDrive for Business through
{{institution.name}}'s Microsoft 365 subscription, providing convenient
access across devices and basic collaboration features.

**Storage Allocation:**
- Estimated usage: {{number service.estimate}} TB
- Cost: {{currency service.total_cost}} ({{#if (eq service.total_cost 0)}}included with institutional license{{else}}overage charges apply{{/if}})

**Appropriate Use:**
OneDrive is used for:
- Working documents and drafts
- Meeting notes and administrative files
- Small datasets under active editing
- Files requiring easy sharing with collaborators

**Limitations:**
OneDrive is supplementary storage and not the primary repository for
research data. Large datasets, raw data, and archival copies are stored
on dedicated research storage infrastructure.

{{#if service.notes}}
**Additional Notes:**
{{service.notes}}
{{/if}}

**Data Protection:**
- Version history available for 30 days
- Deleted files recoverable for 93 days
- Files synchronized to cloud with encryption in transit and at rest

**Access Control:**
Sharing permissions are managed by the file owner. Default sharing is
restricted to {{institution.name}} accounts. External sharing requires
explicit configuration per file/folder.
