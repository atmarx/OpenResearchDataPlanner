/**
 * Classification flags — the compliance/intent signals the tier questionnaire
 * (config/tier-questionnaire.yaml → classifyTier.js) attaches to a session, and
 * how to render them in human-facing output like the DMP.
 *
 * Pure module (no Vue/store deps) so it's shared by the DMP generator and
 * unit-tested directly. When a new `sets_flags` value is added to the
 * questionnaire, add its label here too — tests/classificationFlags.test.js
 * guards against an unlabeled flag leaking a raw_snake slug into a grant doc.
 */

export const FLAG_LABELS = {
  hipaa: 'HIPAA',
  phi: 'Protected Health Information (PHI)',
  ferpa: 'FERPA (student records)',
  cui: 'Controlled Unclassified Information (CUI)',
  cui_possible: 'Possible CUI — review required',
  nist_800_171: 'NIST SP 800-171 controls',
  ear: 'Export Control (EAR)',
  itar: 'Export Control (ITAR)',
  human_genomic: 'Human genomic data',
  select_agent: 'Select Agent / biosecurity',
  biosecurity: 'Biosecurity concern',
  location_sensitive: 'Location-sensitive data',
  proprietary: 'Proprietary / commercial',
  open_data: 'Open data / public access (FAIR)',
  needs_review: 'Needs compliance review'
}

/**
 * DMP-ready handling language per flag. This is what turns a flag from a label
 * ("HIPAA") into a sentence of actual compliance prose in the generated plan.
 * One sentence, written in DMP grammar (impersonal, forward-looking). A flag
 * with no entry simply contributes its label but no expanded guidance.
 */
export const FLAG_GUIDANCE = {
  hipaa: 'Protected Health Information will be handled under HIPAA: a Business Associate Agreement will be in place with any third-party service, access will be limited to authorized study personnel, and access will be logged.',
  phi: 'Identifiable health information will be treated as Protected Health Information — minimized, encrypted at rest and in transit, and disclosed only as permitted by the IRB-approved protocol.',
  ferpa: 'Student education records protected under FERPA will be disclosed only to personnel with a legitimate educational interest, consistent with the applicable data use agreement.',
  cui: 'Controlled Unclassified Information will be safeguarded under NIST SP 800-171, with marking, access control, and dissemination following the governing contract.',
  cui_possible: 'This project may involve Controlled Unclassified Information; the controlling agency or contract will be consulted before data is collected to confirm CUI status and required controls.',
  nist_800_171: 'Security controls will follow NIST SP 800-171, including access control, audit logging, and configuration management appropriate to controlled data.',
  ear: 'Export-controlled data (EAR) will be restricted to authorized U.S.-based personnel; access by foreign persons will be reviewed for deemed-export implications before it is granted.',
  itar: 'ITAR-controlled technical data will be restricted to authorized U.S. persons and stored only in environments approved for ITAR data; foreign-person access requires a license or exemption.',
  human_genomic: 'Human genomic data will be managed under the NIH Genomic Data Sharing Policy, with controlled-access deposition (e.g., dbGaP) and consent-consistent use.',
  select_agent: 'Select Agent and biosecurity-relevant data will be handled under the applicable institutional biosafety and security requirements, with access restricted to approved personnel.',
  proprietary: 'Proprietary or commercially sensitive data will be held under the terms of the governing data use or license agreement and not shared outside those terms.',
  open_data: 'Data intended for public release will follow FAIR principles — findable, accessible, interoperable, and reusable — with deposition in an appropriate repository, a persistent identifier (DOI), and an open license, satisfying funder public-access requirements.'
}

/**
 * One-sentence DMP handling guidance for a flag, or null if none is defined.
 */
export function flagGuidance(slug) {
  return FLAG_GUIDANCE[slug] || null
}

/**
 * Human-readable label for a flag slug. Acronyms come from FLAG_LABELS; anything
 * unmapped falls back to a title-cased slug so it never renders as raw_snake.
 */
export function flagLabel(slug) {
  return FLAG_LABELS[slug] || String(slug).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
