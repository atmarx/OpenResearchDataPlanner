## Research Virtual Desktop (High Security)

Research activities will utilize {{institution.name}}'s Research VDI service
with enhanced security controls for sensitive data.

**Resource Allocation:**
- Virtual desktops: {{number service.estimate}}
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Security Controls:**
- Encryption at rest for all VM disks
- Azure AD MFA required for all access
- Daily automated backups with 30-day retention
- Session timeout policies enforced
- No data transfer to personal devices

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

**Available Tiers:**
- Silver: 4 vCPU, 16GB RAM, 100GB disk - $75/month
- Gold: 8 vCPU, 32GB RAM, 200GB disk - $150/month
- Platinum: 16 vCPU, 64GB RAM, 500GB disk - $300/month

{{#if retention}}
**Data Retention:**
Data subject to {{retention.name}} requirements will be retained for
{{retention.years}} years. Work with Research Computing to establish
appropriate data export and archival procedures before VDI decommissioning.
{{/if}}

**Data Handling:**
- Process sensitive data only within the VDI environment
- Use approved network storage for data that needs to persist
- Do not copy sensitive data to local workstations
- Report any suspected security incidents immediately

**Access Control:**
Access requires authorization by the PI and completion of data security
training. All access is logged and subject to audit. Annual access reviews
are required for continued authorization.
