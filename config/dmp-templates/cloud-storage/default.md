## Cloud Storage

Research data will be stored using {{institution.name}}'s managed cloud
storage infrastructure with pass-through pricing and no overhead.

**Storage Allocation:**
- Storage requested: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Features:**
- Encryption at rest (platform-managed keys)
- High durability (99.999999999% for standard tiers)
- Versioning available for data protection
- Access logging for audit compliance
- Integration with cloud compute resources

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. Consider archive storage tiers for cost-effective
long-term retention after the active project period.
{{/if}}

**Data Transfer:**
Data can be transferred via standard cloud tools (aws s3, azcopy) or through
Globus for large-scale transfers. Contact Research Computing for assistance
with bulk data migration.

**Access Control:**
Access is managed through cloud IAM policies. PIs are responsible for
maintaining appropriate access controls and conducting periodic access reviews.
