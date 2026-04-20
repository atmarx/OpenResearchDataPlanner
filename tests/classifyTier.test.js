import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { classifyTier } from '../src/lib/classifyTier.js'

let questionnaire

beforeAll(() => {
  const yamlPath = path.resolve(__dirname, '..', 'config', 'tier-questionnaire.yaml')
  questionnaire = yaml.load(fs.readFileSync(yamlPath, 'utf8'))
})

// Helper: run classification and return result
function run(answers) {
  return classifyTier(questionnaire, answers)
}

describe('tier questionnaire — priority paths (V1.0 regression guards)', () => {
  it('PHI: identifiable health data → high (the V1.0 bug)', () => {
    const { tier, flags } = run({
      human_subjects: true,
      health_data: true,
      identifiable: 'identifiable',
      student_data: false,
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('high')
    expect(flags).toContain('phi')
    expect(flags).toContain('hipaa')
  })

  it('FERPA: student records → high', () => {
    // Per config/tier-questionnaire.yaml student_data "Yes" sets_tier: high.
    // (Earlier PM brief said "medium"; the YAML is the source of truth.)
    // Reaching student_data requires human_subjects=true, health_data=false —
    // student records are human-subject data even though they're not health data.
    const { tier, flags } = run({
      human_subjects: true,
      health_data: false,
      student_data: true,
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('high')
    expect(flags).toContain('ferpa')
  })

  it('Clean: no sensitive data, no gov funding → null (no tier set)', () => {
    // The classifier returns null for a no-gates path — no YAML rule ever assigns "low".
    // TierQuestionnaire.vue defaults null → "low" at complete (the UI layer concern).
    const { tier, flags } = run({
      human_subjects: false,
      biological_samples: false,
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBeNull()
    expect(flags).toEqual([])
  })
})

describe('tier questionnaire — health data paths', () => {
  it('De-identified health data (Safe Harbor) → medium, flags cleared', () => {
    // health_data="Yes" sets hipaa+phi flags but no tier (removed sets_tier:high per xram).
    // identifiable="deidentified" then sets_tier: medium + clears_flags: [hipaa, phi].
    // Net: tier=medium, no flags — honors the YAML's intent for Safe Harbor de-identification.
    const { tier, flags } = run({
      human_subjects: true,
      health_data: true,
      identifiable: 'deidentified',
      student_data: false,
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('medium')
    expect(flags).not.toContain('phi')
    expect(flags).not.toContain('hipaa')
  })

  it('Encoded health data (linking key exists) → high', () => {
    const { tier, flags } = run({
      human_subjects: true,
      health_data: true,
      identifiable: 'encoded',
      student_data: false,
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('high')
    expect(flags).toContain('phi')
  })

  it('Limited dataset (some identifiers) → high', () => {
    const { tier } = run({
      human_subjects: true,
      health_data: true,
      identifiable: 'limited',
      student_data: false,
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('high')
  })
})

describe('tier questionnaire — biological samples paths', () => {
  it('Human participant genomic samples → high with human_genomic flag', () => {
    const { tier, flags } = run({
      human_subjects: false,
      biological_samples: true,
      organism_source: 'human',
      human_samples_detail: 'participant_samples',
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('high')
    expect(flags).toContain('human_genomic')
  })

  it('Immortalized cell lines (HeLa) → low', () => {
    const { tier } = run({
      human_subjects: false,
      biological_samples: true,
      organism_source: 'human',
      human_samples_detail: 'cell_lines',
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('low')
  })

  it('Model organisms (mouse, fly, yeast) → low', () => {
    const { tier } = run({
      human_subjects: false,
      biological_samples: true,
      organism_source: 'model_organism',
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('low')
  })

  it('Coded biobank samples → medium', () => {
    const { tier } = run({
      human_subjects: false,
      biological_samples: true,
      organism_source: 'human',
      human_samples_detail: 'biobank',
      biobank_consent: 'coded',
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('medium')
  })

  it('De-identified biobank with broad consent → low', () => {
    const { tier } = run({
      human_subjects: false,
      biological_samples: true,
      organism_source: 'human',
      human_samples_detail: 'biobank',
      biobank_consent: 'deidentified_broad',
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('low')
  })

  it('Wildlife with location sensitivity → medium with location_sensitive flag', () => {
    const { tier, flags } = run({
      human_subjects: false,
      biological_samples: true,
      organism_source: 'wildlife',
      wildlife_sensitivity: 'sensitive',
      government_data: false,
      export_control: false,
      proprietary_check: false,
    })
    expect(tier).toBe('medium')
    expect(flags).toContain('location_sensitive')
  })

  it('USDA Select Agent → restricted and terminates immediately', () => {
    const { tier, flags, path } = run({
      human_subjects: false,
      biological_samples: true,
      organism_source: 'agricultural',
      agricultural_sensitivity: 'select_agent',
    })
    expect(tier).toBe('restricted')
    expect(flags).toEqual(expect.arrayContaining(['select_agent', 'biosecurity']))
    // select_agent jumps straight to 'complete'; no government/export/proprietary needed
    expect(path).not.toContain('government_data')
  })
})

describe('tier questionnaire — government / export / proprietary paths', () => {
  it('CUI (DFARS-marked) → restricted', () => {
    const { tier, flags } = run({
      human_subjects: false,
      biological_samples: false,
      government_data: 'dod',
      cui_check: true,
    })
    expect(tier).toBe('restricted')
    expect(flags).toEqual(expect.arrayContaining(['cui', 'nist_800_171']))
  })

  it('DoD-funded but no CUI marking → drops to export_control branch', () => {
    const { tier, flags } = run({
      human_subjects: false,
      biological_samples: false,
      government_data: 'dod',
      cui_check: false,
      export_control: false,
      proprietary_check: false,
    })
    // cui_possible flag set from government_data='dod' but no tier upgrade
    expect(tier).toBeNull()
    expect(flags).toContain('cui_possible')
  })

  it('ITAR export control → restricted', () => {
    const { tier, flags } = run({
      human_subjects: false,
      biological_samples: false,
      government_data: false,
      export_control: 'itar',
    })
    expect(tier).toBe('restricted')
    expect(flags).toContain('itar')
  })

  it('EAR export control → restricted', () => {
    const { tier, flags } = run({
      human_subjects: false,
      biological_samples: false,
      government_data: false,
      export_control: 'ear',
    })
    expect(tier).toBe('restricted')
    expect(flags).toContain('ear')
  })

  it('Proprietary / NDA-protected (no other sensitivity) → medium', () => {
    const { tier } = run({
      human_subjects: false,
      biological_samples: false,
      government_data: false,
      export_control: false,
      proprietary_check: true,
    })
    expect(tier).toBe('medium')
  })
})

describe('tier questionnaire — tier max-rank invariant (V1.0 bug fix regression)', () => {
  it('Proprietary check cannot downgrade an existing high tier', () => {
    // Researcher hit high via PHI; at end they answer proprietary=Yes (medium).
    // tier must stay 'high' — the V1.0 bug did the wrong thing here.
    const { tier } = run({
      human_subjects: true,
      health_data: true,
      identifiable: 'identifiable',
      student_data: false,
      government_data: false,
      export_control: false,
      proprietary_check: true,
    })
    expect(tier).toBe('high')
  })

  it('Proprietary check cannot downgrade an existing restricted tier', () => {
    const { tier } = run({
      human_subjects: false,
      biological_samples: false,
      government_data: false,
      export_control: 'itar',
      // proprietary_check unreachable — export_control:itar goes straight to 'complete'
    })
    expect(tier).toBe('restricted')
  })
})
