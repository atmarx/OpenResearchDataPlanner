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
- Network access restricted to approved private cloud networks

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
This storage configuration provides the encryption, access-logging, and
network-isolation controls commonly required for HIPAA and CUI data; specific
compliance must be confirmed with the security team before regulated data is placed
here. Export-controlled (ITAR/EAR) data is handled separately: most university
research on a controlled topic is publishable fundamental research (the Fundamental
Research Exclusion, EAR 15 CFR 734.8 / ITAR 22 CFR 120.34(a)(8)) and is not itself
controlled — but the exclusion is destroyed by any publication or personnel
restriction or controlled physical inputs, and it cannot be self-certified. Contact
the Export Control Officer before placing any export-controlled inputs here.

**Data Transfer:**
Data transfer must occur through approved channels:
- Cloud-native tools over private network connections
- Approved Globus endpoints with encryption
- No direct internet transfer permitted

**Access Control:**
Access requires completion of cloud security assessment. IAM policies enforce
least-privilege access. Quarterly access reviews are required.
