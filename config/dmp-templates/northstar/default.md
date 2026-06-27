## Research Data Storage and Management (NorthStar)

Research data will be stored on {{institution.name}}'s NorthStar research data
platform — governed, Globus-connected storage on the institution's iRODS-managed
array — in a dedicated project scope created for this award.

**Storage Allocation:**
- Storage requested: {{number service.estimate}} TB
- Estimated monthly cost: {{currency service.monthly_cost}}
- Grant period cost: {{currency service.total_cost}}

**Data Organization and Metadata:**
Every dataset is described from the day it is created. The project scope carries
governed metadata — project identity, funding source, data classification, and
retention class — applied at creation and maintained by the platform, not by
ad-hoc convention. Datasets are findable, attributable, and citable for the life
of the project and beyond.

**Integrity and Provenance:**
Every change to project data is attributed to an authenticated individual and
recorded in an append-only audit log, automatically. The question "which version
of the data did this result come from" is answerable on demand from the
platform's provenance record.

**Backup and Recoverability:**
Project data is backed up on a fixed schedule, and — unlike conventional backup
practice — recoverability is *verified*: the platform performs scheduled test
restores and records a dated receipt confirming the data came back intact. A
failed restore is detected on that schedule, not at the moment the data is
needed.

**Data Retention:**
{{#if retention}}
Data subject to {{retention.name}} requirements will be retained for at least
{{retention.years}} years post-project. {{/if}}Retention is enforced by the
platform: each dataset carries a retention class tied to its governing authority
(e.g., 2 CFR 200.334 for federally funded records), the retention clock survives
personnel and account changes, and no data is ever deleted automatically or
without the investigator's explicit, recorded decision. Every disposition is
logged with the authority under which it was taken.

**Data Sharing and Public Access:**
Datasets are shared with external collaborators via Globus high-performance
transfer with integrity verification. When data is ready for public release, the
platform's publication workflow mints a DOI, applies an institutionally-reviewed
open license, generates a checksummed manifest, and registers the dataset in the
institutional catalog — satisfying funder public-access requirements with a
complete, citable record.

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

**Plan Enforcement:**
On award, this plan is bound to the project scope as machine-readable policy:
the access rules, retention commitments, and sharing terms stated here are
enforced by the platform as the data is used, and
compliance with this plan is reportable on demand for progress reports and
audits from the platform's compliance record.
