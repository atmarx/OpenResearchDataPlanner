import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { validateConfig } from '../scripts/build-config.js'

// These guard the compliance-block invariants in build-config.js (section 5).
// A validation rule with no test is exactly the bug it's meant to prevent: it
// can silently stop firing and nobody notices. So we assert both that the rules
// catch contradictions and that the shipped config stays clean.

// Minimal, referentially-valid config so ONLY the compliance rule under test can
// fire (no stray errors from unknown service/tier/category/template).
function configWith(compliance, frameworksMapping = {}) {
  return {
    tiers: [{ slug: 'high' }],
    categories: [{ slug: 'compute' }],
    services: [{ slug: 'svc', category: 'compute' }],
    dmpTemplates: {},
    bundles: [],
    retention: { schedules: [] },
    mappings: [{ service: 'svc', tier: 'high', compliance, ...frameworksMapping }],
  }
}

describe('compliance invariants (build-config validateConfig)', () => {
  it('the shipped config.json passes with zero errors', () => {
    const configPath = path.resolve(__dirname, '..', 'public', 'config.json')
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    const { errors } = validateConfig(config)
    expect(errors, `shipped config has validation errors:\n${errors.join('\n')}`).toEqual([])
  })

  it('rejects a HIPAA framework without a secured BAA (the AWS bug)', () => {
    const { errors } = validateConfig(
      configWith({ frameworks: ['hipaa', 'ferpa'], baa_status: 'not_available' })
    )
    expect(errors.some((e) => e.includes('hipaa') && e.includes('BAA'))).toBe(true)
  })

  it('allows HIPAA with an in-place BAA', () => {
    const { errors } = validateConfig(
      configWith({ frameworks: ['hipaa'], baa_status: 'in_place', baa_reference: 'Some BAA' })
    )
    expect(errors).toEqual([])
  })

  it('allows HIPAA with not_applicable (on-prem service, no business associate)', () => {
    const { errors } = validateConfig(
      configWith({ frameworks: ['hipaa'], baa_status: 'not_applicable' })
    )
    expect(errors).toEqual([])
  })

  it('does not fire the HIPAA rule for non-HIPAA frameworks (FERPA-only is fine)', () => {
    const { errors } = validateConfig(
      configWith({ frameworks: ['ferpa'], baa_status: 'not_available' })
    )
    expect(errors).toEqual([])
  })

  it('rejects an unknown baa_status value (typo fails closed otherwise)', () => {
    const { errors } = validateConfig(
      configWith({ frameworks: [], baa_status: 'in-place' })
    )
    expect(errors.some((e) => e.includes('unknown baa_status'))).toBe(true)
  })

  it('warns (does not error) when an in-place BAA has no reference', () => {
    const { errors, warnings } = validateConfig(
      configWith({ frameworks: ['hipaa'], baa_status: 'in_place' })
    )
    expect(errors).toEqual([])
    expect(warnings.some((w) => w.includes('baa_reference'))).toBe(true)
  })
})
