import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { resolveCalculatorTarget, DEFAULT_TARGET_SERVICES } from '../src/lib/calculatorTargets.js'
import { computeServiceCost } from '../src/lib/pricing.js'
import { validateConfig } from '../scripts/build-config.js'

// The CPU calculators used to default to 'hpc-cpu', a slug that never existed.
// The slate priced the unknown service at $0, so every SU estimate read as free.

let services
let calculators

beforeAll(() => {
  const load = (f) => yaml.load(fs.readFileSync(path.resolve(__dirname, '..', 'config', f), 'utf8'))
  services = load('services.yaml').services
  calculators = load('calculators.yaml')
})

const bySlug = () => Object.fromEntries(services.map((s) => [s.slug, s]))

describe('calculator slate targets', () => {
  it('every enabled calculator lands on a real service (or none, for api)', () => {
    const known = bySlug()
    for (const [category, ids] of Object.entries(calculators.enabled_calculators)) {
      for (const id of ids) {
        const target = resolveCalculatorTarget(calculators.calculator_config?.[id], category)
        if (category === 'api') {
          expect(target, id).toBeNull() // dollars-over-a-period has no matching service
        } else {
          expect(known[target], `${id} -> ${target}`).toBeDefined()
        }
      }
    }
  })

  it('a CPU calculator result costs more than $0 on its target service', () => {
    const target = bySlug()[DEFAULT_TARGET_SERVICES.cpu]
    expect(target.cost_model.unit_label).toBe('Service Unit') // calculators output SU
    expect(computeServiceCost(target.cost_model, target.subsidies, 50000).monthly).toBeGreaterThan(0)
  })

  it('build-config rejects a calculator pointed at an unknown service', () => {
    const { errors } = validateConfig({
      services: [{ slug: 'hpc-storage' }],
      calculators: {
        enabled_calculators: { cpu: ['simulations'], storage: ['video'] },
        calculator_config: {}
      }
    })
    expect(errors).toContain('Calculator "simulations" targets unknown service: "hpc-compute"')
    expect(errors.some((e) => e.includes('"video"'))).toBe(false)
  })
})
