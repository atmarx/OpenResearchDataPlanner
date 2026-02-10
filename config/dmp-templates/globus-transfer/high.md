## Data Transfer

Research data transfers will utilize {{institution.name}}'s Globus endpoint
with enhanced security controls appropriate for {{tier.name}} data, backed
by a 5PB iRODS-managed storage array.

**Transfer Capacity:**
- Estimated monthly transfer volume: {{number service.estimate}} TB
- Cost: {{currency service.monthly_cost}} (no charge for transfers)

**Security Controls:**
Given the {{tier.name}} classification of this data:
- Encryption required for all transfers
- Transfer logging with complete audit trail
- Recipient institutions must have BAA or equivalent agreements
- Endpoint access restricted to authorized personnel
- Regular review of sharing permissions

**Service Features:**
- High-performance encrypted data transfer
- Automated transfer scheduling with integrity verification
- Detailed transfer logging for compliance
- Integration with institutional identity management

{{#if service.notes}}
**Special Considerations:**
{{service.notes}}
{{/if}}

**Data Handling:**
All transfers of {{tier.name}} data use encrypted channels. Transfer
records are maintained for the data retention period. Recipient
endpoints are verified for appropriate security controls before
sharing is enabled.

**Access Control:**
Globus access is controlled through institutional identity federation
with MFA required. Endpoint sharing requires PI approval and verification
of recipient security posture. All transfers are logged and auditable.
