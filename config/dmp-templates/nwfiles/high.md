## University File Storage

Research data containing {{tier.name}} information will be stored on
{{institution.name}}'s University File Server (NWFiles) with enhanced
security controls appropriate for regulated data.

**Storage Allocation:**
- Active storage needed: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Security Controls:**
Given the {{tier.name}} classification of this data:
- Isolated project folder with restricted access
- Encryption at rest and in transit
- Comprehensive access logging and audit trail
- Annual access review required
- No shared folders with other projects

**Data Protection:**
- Automatic backups on the university's standard schedule for regulated data
- Snapshots available for self-service recovery
- Backup data protected with the same controls as the source data

{{#if service.notes}}
**Special Considerations:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. After the active grant period, data will be
migrated to archival storage with maintained access controls:
- Archive storage: {{number archive.estimate}} TB
- Annual archive cost: {{currency archive.annual_cost}}
- Total retention cost: {{currency archive.total_cost}}
{{/if}}

**Access Control:**
Access is managed through dedicated security groups with PI approval
required for all additions. All access is logged and subject to
periodic review by the data steward.
