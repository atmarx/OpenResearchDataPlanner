## University File Storage

Research data will be stored on {{institution.name}}'s University File Server (NWFiles),
a centrally-managed storage service with automatic backups and campus-wide accessibility.

**Storage Allocation:**
- Active storage needed: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Data Protection:**
- Nightly backups retained for 30 days
- Weekly backups retained for 90 days
- Snapshots available for self-service recovery
- Encryption at rest enabled

{{#if service.notes}}
**Additional Notes:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. After the active grant period, data will be
migrated to archival storage:
- Archive storage: {{number archive.estimate}} TB
- Annual archive cost: {{currency archive.annual_cost}}
- Total retention cost: {{currency archive.total_cost}}
{{/if}}

**Access Control:**
Access is managed through university Active Directory groups. The PI
can manage group membership through the IT self-service portal.
