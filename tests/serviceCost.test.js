import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { computeServiceCost } from '../src/lib/pricing.js'

// Load the REAL price list so these tests fail if the cost_model / subsidies
// schema ever drifts from what the engine reads (the $0-slate regression).
let services

beforeAll(() => {
  const yamlPath = path.resolve(__dirname, '..', 'config', 'services.yaml')
  services = yaml.load(fs.readFileSync(yamlPath, 'utf8')).services
})

function svc(slug) {
  const s = services.find((x) => x.slug === slug)
  if (!s) throw new Error(`service not found in services.yaml: ${slug}`)
  return s
}

describe('service cost engine — real services.yaml schema (regression guard)', () => {
  it('unit storage applies price AND the free allocation (globus-storage)', () => {
    const s = svc('globus-storage') // $3.50/TB, first 0.5 TB free
    const { monthly, annual } = computeServiceCost(s.cost_model, s.subsidies, 10)
    expect(monthly).toBeCloseTo(33.25, 2) // (10 - 0.5) * 3.50
    expect(annual).toBeCloseTo(399, 2)
  })

  it('exposes the free-allocation split for per-item display (globus-storage)', () => {
    const s = svc('globus-storage') // first 0.5 TB free
    const r = computeServiceCost(s.cost_model, s.subsidies, 10)
    expect(r.freeUnits).toBeCloseTo(0.5, 3)
    expect(r.billable).toBeCloseTo(9.5, 3)
    expect(typeof r.unitLabel).toBe('string')
  })

  it('a request under the free floor costs $0 (onedrive, 1 TB included)', () => {
    const s = svc('onedrive') // $40/TB, first 1 TB free
    expect(computeServiceCost(s.cost_model, s.subsidies, 0.5).monthly).toBe(0)
    expect(computeServiceCost(s.cost_model, s.subsidies, 2).monthly).toBeCloseTo(40, 2)
  })

  it('tiered compute bills marginally across bands (hpc-compute)', () => {
    const s = svc('hpc-compute') // 0.08 / 0.06 / 0.04 at 10k / 100k / ∞
    const { monthly } = computeServiceCost(s.cost_model, s.subsidies, 120000)
    // 10000*0.08 + 90000*0.06 + 20000*0.04 = 800 + 5400 + 800
    expect(monthly).toBeCloseTo(7000, 2)
  })

  it('an auto-applied percent subsidy zeroes the cost (k8s beta)', () => {
    const s = svc('k8s-cluster') // 100% beta subsidy, auto_apply
    expect(computeServiceCost(s.cost_model, s.subsidies, 1).monthly).toBe(0)
  })

  it('every priced service yields a finite, non-negative cost (no NaN/undefined)', () => {
    for (const s of services) {
      const { monthly, annual } = computeServiceCost(s.cost_model, s.subsidies, 5)
      expect(Number.isFinite(monthly), `${s.slug} monthly`).toBe(true)
      expect(monthly, `${s.slug} monthly >= 0`).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(annual), `${s.slug} annual`).toBe(true)
    }
  })
})
