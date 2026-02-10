## AI/ML Services

This project will utilize {{institution.name}}'s Azure OpenAI Service
for natural language processing and AI-powered analysis.

**Service Allocation:**
- Estimated usage: {{number service.estimate}} million tokens per month
- Grant period total: {{number service.total_estimate}} million tokens
- Estimated cost: {{currency service.total_cost}}

**Data Handling:**
- All API calls processed through the university's Azure tenant
- Data does not leave the institutional cloud boundary
- No data retained by the AI service after processing
- Prompts and completions are not used for model training

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Available Models:**
- GPT-4 and GPT-4 Turbo for complex reasoning tasks
- GPT-3.5 Turbo for high-volume, lower-complexity tasks
- Text embedding models for semantic search and RAG applications

**Access Control:**
Access to the Azure OpenAI service requires:
- Active university credentials
- Project-specific API key allocation
- Acceptance of acceptable use policy
