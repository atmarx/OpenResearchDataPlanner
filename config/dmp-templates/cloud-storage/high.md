## Cloud Storage (High Security)

Research data will be stored using {{institution.name}}'s managed cloud
storage infrastructure with enhanced security controls for sensitive data.

**Storage Allocation:**
- Storage requested: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Security Controls:**
- Encryption at rest with customer-managed keys (CMK)
- Private endpoints only (no public internet access)
- Access logging enabled and retained for audit
- Versioning enabled with deletion protection
- Network access restricted to approved VPCs/VNets

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

{{#if retention}}
**Long-Term Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. Security controls persist through the retention
period. Archive tiers maintain equivalent security posture.
{{/if}}

**Compliance:**
This storage configuration supports compliance with common research data
requirements including HIPAA, CUI, and export control regulations. Contact
the security team to verify specific compliance requirements.

**Data Transfer:**
Data transfer must occur through approved channels:
- Cloud-native tools over private network connections
- Approved Globus endpoints with encryption
- No direct internet transfer permitted

**Access Control:**
Access requires completion of cloud security assessment. IAM policies enforce
least-privilege access. Quarterly access reviews are required.
