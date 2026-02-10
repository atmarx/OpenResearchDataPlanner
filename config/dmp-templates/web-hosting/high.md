## Web Application Hosting

Research web applications will be hosted on {{institution.name}}'s managed
Azure platform with enhanced security controls appropriate for {{tier.name}}
data, providing secure containerized hosting with compliant infrastructure.

**Resource Allocation:**
- Estimated monthly Azure spend: {{currency service.estimate}}
- Grant period total: {{currency service.total_cost}}

**Security Controls:**
Given the {{tier.name}} classification of this data:
- Private endpoints only (no public internet access)
- Azure Web Application Firewall (WAF) enabled
- DDoS protection enabled
- Data encryption with customer-managed keys
- Security assessment required before deployment
- Network isolation via Virtual Network integration

**Service Features:**
- Azure DevOps for source control and CI/CD pipelines
- Azure Container Apps in isolated environment
- Managed PostgreSQL with private endpoints
- Application monitoring and security logging
- Incident response integration

{{#if service.notes}}
**Special Considerations:**
{{service.notes}}
{{/if}}

**Data Handling:**
Application data is stored in managed Azure database services with
encryption at rest using customer-managed keys. All data access is
logged and auditable. Backups are encrypted and retained per
compliance requirements.

**Access Control:**
Application authentication requires Azure AD with MFA. Administrative
access is restricted to authorized personnel with security training.
All access is logged and subject to periodic review.
