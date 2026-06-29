## AI/ML Services (LibreChat)

This project will use {{institution.name}}'s self-hosted LibreChat platform for
large language models in coursework and non-regulated research.

**Service Allocation:**
- Estimated usage: {{number service.estimate}} million tokens per month
- Grant period total: {{number service.total_estimate}} million tokens
- Estimated cost: {{currency service.total_cost}} — free during the grant period (subsidized)

**Access Isolation:**
- Access is provisioned through per-user, per-context virtual API keys.
- A key created for a course cannot reach research data; a key created for a
  research project cannot run in a class context.
- No key can access data outside the silo it was created in.

**Data Handling:**
- For instructional LLM use, course assignments, and non-regulated research.
- Regulated or protected data — PHI, Social Security numbers, financial-aid records,
  transcripts, disciplinary records, or export-controlled content — is not permitted
  and requires a High-tier path.

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Cost:**
Free during the grant period. Usage is metered in millions of tokens (Mtok) and
shown at a cloud-equivalent value rate so departments can see the value received;
it is not a charge. A fair-use rate may take effect after the grant period.
