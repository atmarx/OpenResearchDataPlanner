## AI/ML Services (High-Risk Data)

This project will utilize {{institution.name}}'s Azure AI Foundry deployment
for natural language processing and AI-powered analysis of {{tier.name}} data,
operating within the institution's Business Associate Agreement (BAA) with
Microsoft.

**Service Allocation:**
- Estimated usage: {{number service.estimate}} million tokens per month
- Grant period total: {{number service.total_estimate}} million tokens
- Estimated cost: {{currency service.total_cost}}

**Data Handling (Regulated Data):**
- All API calls are processed within the university's Azure tenant under the
  institutional BAA; data does not leave the institutional cloud boundary
- Prompts and completions are not retained by the service after processing and
  are not used to train or improve foundation models
- Protected Health Information is permitted only after review and approval, and
  only for personnel authorized on the IRB-approved protocol
- Access is logged and auditable; prompt/response logging is restricted to the
  minimum necessary for operations and security

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Available Models:**
- OpenAI GPT-4o and o-series models for complex reasoning tasks
- Smaller, faster models (e.g., GPT-4o mini) for high-volume tasks
- Open models (Llama, Mistral, Phi) where a project prefers them
- Text embedding models for semantic search and RAG applications

**Access Control:**
Access to the Azure AI Foundry deployment for {{tier.name}} data requires:
- Active university credentials with MFA
- Completed cloud security assessment and required training
- Project-specific endpoint/key allocation scoped to authorized personnel
- Acceptance of the acceptable use policy and applicable BAA terms

**Compliance:**
- Use is governed by the institutional BAA with Microsoft (Azure AI Foundry)
- Suitable for HIPAA and FERPA data within the approved tenant configuration
- Not approved for Restricted (L4) data; use the Secure Enclave for L4 workloads
