## Cloud Computing

Research computations involving {{tier.name}} data will be performed using
{{institution.name}}'s institutional cloud computing agreement with
enhanced security controls meeting regulatory requirements.

**Resource Allocation:**
- Estimated monthly spend: {{currency service.estimate}}
- Grant period total: {{currency service.total_cost}}

**Security Controls:**
Given the {{tier.name}} classification of this data:
- Dedicated virtual network/VPC with no public internet access
- All data encrypted with customer-managed encryption keys
- Comprehensive logging via CloudTrail/Azure Monitor
- Policy enforcement via AWS Config/Azure Policy
- Security assessment required before deployment

**Compliance:**
The cloud environment will be configured to meet applicable
regulatory requirements including:
- Data residency within approved geographic regions
- Encryption in transit and at rest
- Access logging and audit trails
- Regular security assessments

{{#if service.notes}}
**Special Considerations:**
{{service.notes}}
{{/if}}

**Data Handling:**
All data must remain within the secured cloud environment.
Data transfer outside the environment requires explicit approval
and must use encrypted channels. No data may be stored in
public cloud storage buckets or accessible endpoints.

**Access Control:**
Access to the secured cloud environment requires:
- PI approval and explicit authorization
- Completion of cloud security training
- Multi-factor authentication
- Access reviews conducted quarterly
