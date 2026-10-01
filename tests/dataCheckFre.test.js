import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { DATA_CHECK_QUESTIONS, FRE_RESULT } from '../src/lib/dataCheckQuestions.js'
import { FLAG_LABELS } from '../src/lib/classificationFlags.js'
import { resolveWorkflowSteps, stepApplies } from '../src/lib/workflowSteps.js'

// Walk the flow exactly as DecisionFlow.vue does: setsOutput merges,
// setsFlags accumulates, `next` routes until 'complete'.
function walk(answers) {
  let id = DATA_CHECK_QUESTIONS[0].id
  let output = {}
  let flags = []
  for (const value of answers) {
    const q = DATA_CHECK_QUESTIONS.find((x) => x.id === id)
    expect(q, `no question "${id}"`).toBeTruthy()
    const opt = q.options.find((o) => o.value === value)
    expect(opt, `no option "${value}" on "${id}"`).toBeTruthy()
    output = { ...output, ...(opt.setsOutput || {}) }
    flags = [...new Set([...flags, ...(opt.setsFlags || [])])]
    id = opt.next
  }
  expect(id).toBe('complete')
  return { output, flags }
}

describe('DataCheck applet — export control has an FRE off-ramp', () => {
  it('export-controlled data no longer dead-ends at Restricted', () => {
    const exportOpt = DATA_CHECK_QUESTIONS
      .find((q) => q.id === 'data-type').options
      .find((o) => o.value === 'export')
    expect(exportOpt.next).toBe('export-fre')
    expect(exportOpt.setsOutput.sensitivity).toBeUndefined()
    expect(exportOpt.setsFlags).toBeUndefined()
  })

  it('publishable fundamental research → High with the fre flag, no export-control flag', () => {
    const { output, flags } = walk(['yes-data', 'export', 'fre'])
    expect(output.sensitivity).toBe('high')
    expect(flags).toEqual(['fre'])
  })

  it('controlled inputs stay Restricted even when results are publishable', () => {
    const { output, flags } = walk(['yes-data', 'export', 'controlled-inputs'])
    expect(output.sensitivity).toBe('restricted')
    expect(flags).toEqual(['export-control'])
  })

  it('no / not sure / CUI stays Restricted', () => {
    const { output, flags } = walk(['yes-data', 'export', 'restricted'])
    expect(output.sensitivity).toBe('restricted')
    expect(flags).toEqual(['export-control'])
  })

  it('FRE wording matches the questionnaire (ECO to confirm) and cites both regs', () => {
    expect(FRE_RESULT.label).toContain(FLAG_LABELS.fre)
    expect(FRE_RESULT.description).toMatch(/Export Control Officer/)
    expect(FRE_RESULT.description).not.toMatch(/Business Associate|BAA|HIPAA/)
    const q = DATA_CHECK_QUESTIONS.find((x) => x.id === 'export-fre')
    expect(q.learnMore.content).toContain('734.8')
    expect(q.learnMore.content).toContain('120.34(a)(8)')
  })

  it('every question an option routes to exists', () => {
    const ids = new Set(DATA_CHECK_QUESTIONS.map((q) => q.id))
    for (const q of DATA_CHECK_QUESTIONS) {
      for (const o of q.options) {
        if (o.next !== 'complete') expect(ids.has(o.next), `${q.id} → ${o.next}`).toBe(true)
      }
    }
  })
})

describe('workflow step gating (show_if / skip_if)', () => {
  it('ungated steps always apply', () => {
    expect(stepApplies({ step: 'x' }, [])).toBe(true)
  })

  it('show_if and skip_if accept a string or a list (any-of)', () => {
    expect(stepApplies({ show_if: 'fre' }, ['fre'])).toBe(true)
    expect(stepApplies({ show_if: 'fre' }, ['hipaa'])).toBe(false)
    expect(stepApplies({ show_if: ['fre', 'itar'] }, ['itar'])).toBe(true)
    expect(stepApplies({ skip_if: ['a', 'fre'] }, ['fre'])).toBe(false)
    expect(stepApplies({ skip_if: 'fre' }, [])).toBe(true)
  })
})

describe('High tier workflow — FRE path gets an ECO step, not HIPAA steps', () => {
  const wf = yaml.load(
    fs.readFileSync(path.resolve(__dirname, '..', 'config', 'tier-workflow.yaml'), 'utf8')
  ).workflows.high
  const names = (conditions) => resolveWorkflowSteps(wf, conditions).map((s) => s.step)

  it('FRE projects see the Export Control Officer review and skip BAA + HIPAA training', () => {
    const steps = names(['fre', 'needs_review'])
    expect(steps).toContain('Export Control Officer review')
    expect(steps).not.toContain('BAA verification')
    expect(steps.find((s) => /Training/.test(s))).toBeUndefined()
  })

  it('HIPAA projects are unchanged — no ECO step', () => {
    const steps = names(['hipaa', 'phi'])
    expect(steps).not.toContain('Export Control Officer review')
    expect(steps).toContain('BAA verification')
    expect(steps).toContain('Training')
  })

  it('every gate names a known flag or derived condition', () => {
    const derived = new Set(['using_preapproved_service'])
    for (const step of wf.steps) {
      for (const c of [step.show_if, step.skip_if].flat().filter(Boolean)) {
        expect(FLAG_LABELS[c] || derived.has(c), `${step.step}: unknown gate "${c}"`).toBeTruthy()
      }
    }
  })
})
