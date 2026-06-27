import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { FLAG_LABELS, FLAG_GUIDANCE, flagLabel, flagGuidance } from '../src/lib/classificationFlags.js'

// Collect every flag the questionnaire can emit. A new sets_flags value without
// a matching human label should fail here, not ship a raw_snake slug into a
// formal grant document (the DMP renders these as "Compliance considerations").
let questionnaireFlags

beforeAll(() => {
  const yamlPath = path.resolve(__dirname, '..', 'config', 'tier-questionnaire.yaml')
  const q = yaml.load(fs.readFileSync(yamlPath, 'utf8'))
  const flags = new Set()
  for (const question of q.questions || []) {
    for (const option of question.options || []) {
      for (const f of option.sets_flags || []) flags.add(f)
    }
  }
  questionnaireFlags = [...flags]
})

describe('classification flag labels (DMP intent rendering)', () => {
  it('every questionnaire sets_flags value has a human-readable label', () => {
    expect(questionnaireFlags.length).toBeGreaterThan(0)
    const missing = questionnaireFlags.filter((f) => !FLAG_LABELS[f])
    expect(missing, `flags missing from FLAG_LABELS: ${missing.join(', ')}`).toEqual([])
  })

  it('acronym flags render upper-case, not title-cased', () => {
    expect(flagLabel('hipaa')).toBe('HIPAA')
    expect(flagLabel('phi')).toBe('Protected Health Information (PHI)')
    expect(flagLabel('ear')).toBe('Export Control (EAR)')
  })

  it('unmapped slugs fall back to a title-cased label (never raw_snake)', () => {
    expect(flagLabel('some_new_flag')).toBe('Some New Flag')
  })
})

describe('flag guidance (DMP compliance prose)', () => {
  it('core compliance flags carry handling guidance, not just a label', () => {
    for (const f of ['hipaa', 'phi', 'ferpa', 'cui', 'ear', 'itar', 'open_data']) {
      expect(FLAG_GUIDANCE[f], `guidance for ${f}`).toBeTruthy()
      expect(flagGuidance(f).length, `guidance for ${f} is substantive`).toBeGreaterThan(20)
    }
  })

  it('open_data carries FAIR / public-access language and a label', () => {
    expect(flagGuidance('open_data')).toMatch(/FAIR/)
    expect(FLAG_LABELS.open_data).toBeTruthy()
  })

  it('flagGuidance returns null for an unmapped flag', () => {
    expect(flagGuidance('totally_unknown_flag')).toBeNull()
  })
})
