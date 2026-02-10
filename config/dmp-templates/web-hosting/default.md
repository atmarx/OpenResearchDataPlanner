## Web Application Hosting

Research web applications will be hosted on {{institution.name}}'s managed
Azure platform, providing containerized application hosting with CI/CD
pipelines and managed database services.

**Resource Allocation:**
- Estimated monthly Azure spend: {{currency service.estimate}}
- Grant period total: {{currency service.total_cost}}

**Service Features:**
- Azure DevOps for source control and CI/CD pipelines
- Azure Container Apps for scalable application hosting
- Managed PostgreSQL (or other Azure database services)
- Custom domain and SSL certificate management
- Application monitoring and logging
- Pipeline setup consultation included

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Data Handling:**
Application data is stored in managed Azure database services with
automatic backups. Static assets and uploads can be stored in Azure
Storage or institutional file servers. All data in Azure is covered
by the university's enterprise agreement.

**Access Control:**
Application authentication integrates with Azure AD and campus SSO.
Administrative access to infrastructure is managed through the
Research Computing team. Developers receive appropriate permissions
through the Azure DevOps project.
