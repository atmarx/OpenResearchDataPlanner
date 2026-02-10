## Research Virtual Desktop

Research activities will utilize {{institution.name}}'s Research VDI service,
providing dedicated virtual desktops on the Azure Local cluster.

**Resource Allocation:**
- Virtual desktops: {{number service.estimate}}
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Features:**
- Dedicated Windows or Linux VM per user
- Daily automated backups with 30-day retention
- Azure AD authentication with MFA
- Optional domain join for managed environments
- Accessible from campus and VPN

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

**Available Tiers:**
- Silver: 4 vCPU, 16GB RAM, 100GB disk - $75/month
- Gold: 8 vCPU, 32GB RAM, 200GB disk - $150/month
- Platinum: 16 vCPU, 64GB RAM, 500GB disk - $300/month

**Data Storage:**
VDI local storage is backed up daily but has limited capacity. For research
data requiring additional space or collaboration, use network storage options
(NWFiles, Globus, or cloud storage) accessible from the VDI.

**Access Control:**
Each VM is isolated per user. PIs authorize team member access to project VDIs.
All access is authenticated through Azure AD with institutional credentials.
