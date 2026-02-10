## Cloud Archive Storage

Research data will be archived using {{institution.name}}'s managed cloud
archive storage for cost-effective long-term retention.

**Storage Allocation:**
- Archive storage requested: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Archive Characteristics:**
- Optimized for infrequently accessed data
- Retrieval time: hours to days depending on urgency
- Significantly lower cost than active storage tiers
- Same durability guarantees as standard storage
- Encryption at rest maintained

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Retention Compliance:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. Archive storage is ideal for meeting long-term
retention requirements at minimal cost.
{{/if}}

**Use Cases:**
Archive storage is appropriate for:
- Completed project data requiring retention
- Raw data that has been processed but must be preserved
- Regulatory compliance archives
- Infrequently accessed reference datasets

**Data Retrieval:**
Archived data requires a retrieval request before access. Plan for retrieval
time when budgeting for post-project data access. Expedited retrieval is
available at additional cost.

**Access Control:**
Archive storage inherits access controls from source storage. Maintain
documentation of archived data for future retrieval needs.
