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
  needs_review: 'Needs compliance review'
}

/**
 * Human-readable label for a flag slug. Acronyms come from FLAG_LABELS; anything
 * unmapped falls back to a title-cased slug so it never renders as raw_snake.
 */
export function flagLabel(slug) {
  return FLAG_LABELS[slug] || String(slug).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
