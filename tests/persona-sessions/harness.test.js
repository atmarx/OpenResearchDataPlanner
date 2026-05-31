import { describe, it, expect } from 'vitest'
import {
  loadBrief,
  resolveTarget,
  sessionDir,
  buildSessionPacket,
  verdictScaffold,
  readPersona,
  stamp,
  TARGETS,
} from './harness.mjs'

// These guard the runner's pure logic so `npm test` catches a broken brief or a
// drifted target map before anyone tries to launch a browser session.

describe('persona-session harness — brief loading', () => {
  it('loads each shipped brief and validates its shape', () => {
    for (const id of ['s01-frindt-fda-dmp', 's02-bramford-openscience-dmp', 's03-vex-cost-budget']) {
      const { brief, personaDir } = loadBrief(id)
      expect(brief.session_id).toBe(id)
      expect(brief.persona).toMatch(/^\d{2}-/)
      expect(Array.isArray(brief.success_criteria)).toBe(true)
      expect(brief.success_criteria.length).toBeGreaterThan(0)
      expect(personaDir).toContain(brief.persona)
    }
  })

  it('throws on an unknown session id', () => {
    expect(() => loadBrief('s99-does-not-exist')).toThrow(/No session brief/)
  })

  it('reads the referenced persona definition', () => {
    const { personaDir } = loadBrief('s01-frindt-fda-dmp')
    const text = readPersona(personaDir)
    expect(text.length).toBeGreaterThan(50)
  })
})

describe('persona-session harness — target resolution', () => {
  it('maps staging and dev to the Northwinds dev site', () => {
    expect(resolveTarget('staging')).toBe(TARGETS.staging)
    expect(resolveTarget('dev')).toBe(TARGETS.staging) // same address
  })

  it('lets an explicit url override the target', () => {
    expect(resolveTarget('staging', 'http://localhost:5173/')).toBe('http://localhost:5173')
  })

  it('defaults to staging when target is missing', () => {
    expect(resolveTarget(undefined)).toBe(TARGETS.staging)
  })

  it('throws on an unknown target', () => {
    expect(() => resolveTarget('production')).toThrow(/Unknown target/)
  })

  it('points session artifacts into the review folder', () => {
    expect(sessionDir('s01-frindt-fda-dmp')).toMatch(/reviews\/playwright\/s01-frindt-fda-dmp$/)
  })
})

describe('persona-session harness — packet + verdict assembly', () => {
  it('folds persona, goal, and every success criterion into the packet', () => {
    const { brief, personaDir } = loadBrief('s01-frindt-fda-dmp')
    const packet = buildSessionPacket(brief, {
      url: TARGETS.staging,
      personaText: readPersona(personaDir),
    })
    expect(packet).toContain(brief.session_id)
    expect(packet).toContain('#q-')
    expect(packet).toContain("I don't understand this!")
    for (const c of brief.success_criteria) {
      expect(packet).toContain(c)
    }
  })

  it('pre-fills the verdict scaffold with the criteria as checkboxes', () => {
    const { brief } = loadBrief('s03-vex-cost-budget')
    const verdict = verdictScaffold(brief)
    expect(verdict).toContain('- [ ]')
    expect(verdict.match(/- \[ \]/g).length).toBe(brief.success_criteria.length)
  })
})

describe('persona-session harness — timestamp', () => {
  it('formats millisecond offsets as mm:ss', () => {
    expect(stamp(0)).toBe('00:00')
    expect(stamp(65000)).toBe('01:05')
    expect(stamp(3661000)).toBe('61:01')
  })
})
