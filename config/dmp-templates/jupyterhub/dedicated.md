## JupyterHub (Dedicated)

Interactive data analysis and notebook-based workflows will utilize
{{institution.name}}'s dedicated JupyterHub service, providing an isolated
Jupyter environment on VDI infrastructure approved for sensitive data.

**Resource Allocation:**
- Dedicated environments: {{number service.estimate}}
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Features:**
- Dedicated VM (8 vCPU, 32GB RAM, 200GB disk)
- Approved for L3/High tier and regulated data
- Full control over packages and configurations
- Daily automated backups with 30-day retention
- Isolated network environment
- Azure AD authentication with MFA

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

**Security Controls:**
- Runs on isolated VDI infrastructure
- Encryption at rest for all data
- No shared resources with other projects
- Session logging available if required by protocol
- Meets requirements for human subjects research data

**Data Storage:**
Local VM storage is backed up daily. For additional capacity or
collaboration, use secure network storage (NWFiles with restricted
folders) accessible from the dedicated environment.

**Access:**
Each dedicated JupyterHub environment is isolated per project. Access
requires Azure AD authentication with multi-factor authentication enabled.
PIs authorize team member access to project environments.
