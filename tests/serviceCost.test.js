import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { computeServiceCost, computeServiceLineItem, computeEstimate } from '../src/lib/pricing.js'

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

// slug -> config, the same shape configStore.servicesBySlug hands the engine.
function bySlug() {
  return Object.fromEntries(services.map((s) => [s.slug, s]))
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

describe('computeServiceCost — opt-in subsidy (optional 4th arg)', () => {
  it('an opt-in percent subsidy equals the manual monthly * (1 - v/100) (aws-compute-small)', () => {
    const s = svc('aws-compute-small') // $1/USD, aws-credits = 50% off, auto_apply:false
    const base = computeServiceCost(s.cost_model, s.subsidies, 100).monthly
    expect(base).toBeCloseTo(100, 6) // not auto-applied, so the 3-arg path is untouched

    const r = computeServiceCost(s.cost_model, s.subsidies, 100, { selectedSubsidySlug: 'aws-credits' })
    expect(r.monthly).toBeCloseTo(base * (1 - 50 / 100), 6)
    expect(r.monthly).toBeCloseTo(50, 6)
    expect(r.breakdown.some((b) => /off/i.test(b.label))).toBe(true) // a discount line was pushed
  })

  it('a 3-arg call is byte-identical to a 4-arg call with selectedSubsidySlug:null (globus-storage)', () => {
    const s = svc('globus-storage')
    const three = computeServiceCost(s.cost_model, s.subsidies, 10)
    const fourNull = computeServiceCost(s.cost_model, s.subsidies, 10, { selectedSubsidySlug: null })
    expect(fourNull).toEqual(three) // deep equal incl. breakdown — the new param is a no-op
  })

  it('an opt-in fixed subsidy subtracts a flat amount, clamps at 0, and ignores unknown slugs', () => {
    const costModel = { type: 'unit', unit_label: 'GB', price: 5 }
    const subsidies = [{ slug: 'flat-50', name: 'Flat $50 off', discount_type: 'fixed', discount_value: 50, auto_apply: false }]
    expect(computeServiceCost(costModel, subsidies, 20, { selectedSubsidySlug: 'flat-50' }).monthly).toBe(50) // 100 - 50
    expect(computeServiceCost(costModel, subsidies, 5, { selectedSubsidySlug: 'flat-50' }).monthly).toBe(0)   // 25 - 50, clamped
    expect(computeServiceCost(costModel, subsidies, 20, { selectedSubsidySlug: 'nope' }).monthly).toBe(100)   // unknown slug = no-op
  })
})

describe('computeServiceLineItem — grant + archive line item', () => {
  it('prices a tiered service marginally: grant = marginal-monthly * grantMonths, no archive (hpc-compute)', () => {
    const service = svc('hpc-compute') // tiered, no subsidies, archive_option:null
    const selection = { service_slug: 'hpc-compute', estimate: 120000 }
    const li = computeServiceLineItem(service, selection, {
      grantMonths: 12,
      retentionYears: 5,
      resolveService: (slug) => bySlug()[slug]
    })
    expect(li.monthly).toBeCloseTo(7000, 2) // 10000*0.08 + 90000*0.06 + 20000*0.04
    expect(li.grant).toBeCloseTo(84000, 2)  // 7000 * 12
    expect(li.archive).toBeNull()           // no archive_option -> no archive tail
    expect(li.archiveYears).toBeCloseTo(4, 6) // max(0, 5 - 12/12)
    expect(li.total).toBeCloseTo(li.grant, 6) // total = grant when there is no archive
  })

  it('threads the opt-in subsidy into the line-item monthly (aws-compute-small)', () => {
    const service = svc('aws-compute-small')
    const without = computeServiceLineItem(service, { service_slug: 'aws-compute-small', estimate: 100 }, {
      grantMonths: 12, retentionYears: 5, resolveService: (slug) => bySlug()[slug]
    })
    const withOptIn = computeServiceLineItem(service, { service_slug: 'aws-compute-small', estimate: 100, use_subsidy: 'aws-credits' }, {
      grantMonths: 12, retentionYears: 5, resolveService: (slug) => bySlug()[slug]
    })
    expect(without.monthly).toBeCloseTo(100, 6)
    expect(withOptIn.monthly).toBeCloseTo(50, 6) // 50% opt-in folded in
    expect(withOptIn.grant).toBeCloseTo(600, 6)  // 50 * 12
  })

  it('prices the archive THROUGH the engine, honouring the archive service free floor', () => {
    // Synthetic config so the archive target carries a non-trivial free floor.
    const mainService = {
      slug: 'main-store', name: 'Main Storage',
      cost_model: { type: 'unit', unit_label: 'TB', price: 10 },
      subsidies: [],
      archive_option: { service_slug: 'cold-archive' }
    }
    const coldArchive = {
      slug: 'cold-archive', name: 'Cold Archive',
      cost_model: { type: 'unit', unit_label: 'TB', price: 2 },
      subsidies: [{ slug: 'arch-base', name: 'Free tier', discount_type: 'free_units', discount_value: 5, auto_apply: true }]
    }
    const resolveService = (slug) => ({ 'main-store': mainService, 'cold-archive': coldArchive }[slug])
    const selection = { service_slug: 'main-store', estimate: 3, archive_estimate: 10 }

    const li = computeServiceLineItem(mainService, selection, { grantMonths: 12, retentionYears: 5, resolveService })
    expect(li.monthly).toBe(30)        // 3 TB * $10
    expect(li.grant).toBe(360)         // 30 * 12
    expect(li.archiveYears).toBe(4)    // 5 - 12/12
    expect(li.archive.monthly).toBe(10) // (10 - 5 free) * $2 — floor honoured, not 10*2=20
    expect(li.archive.annual).toBe(120) // 10 * 12
    expect(li.archive.total).toBe(480)  // 120 * 4 years
    expect(li.total).toBe(840)          // 360 grant + 480 archive
  })

  it('reads archive_estimate verbatim — no archive when the user committed none', () => {
    const service = svc('hpc-storage') // has archive_option -> aws-storage-archive
    const li = computeServiceLineItem(service, { service_slug: 'hpc-storage', estimate: 10 }, {
      grantMonths: 12, retentionYears: 5, resolveService: (slug) => bySlug()[slug]
    })
    expect(li.archive).toBeNull() // archive_estimate absent -> no invented archive cost
    expect(li.total).toBeCloseTo(li.grant, 6)
  })
})

describe('computeEstimate — full budget roll-up', () => {
  it('sums byService rows and keeps grandTotal === grantTotal + archiveTotal', () => {
    const selections = [
      { service_slug: 'hpc-compute', estimate: 120000 },              // grant 84000, no archive
      { service_slug: 'hpc-storage', estimate: 10, archive_estimate: 50 } // grant + archive tail
    ]
    const est = computeEstimate(selections, { servicesBySlug: bySlug(), grantMonths: 12, retentionYears: 5 })

    expect(est.byService).toHaveLength(2)
    const sumGrant = est.byService.reduce((a, b) => a + b.grant, 0)
    const sumArchive = est.byService.reduce((a, b) => a + b.archive, 0)
    const sumMonthly = est.byService.reduce((a, b) => a + b.monthly, 0)
    expect(est.grantTotal).toBeCloseTo(sumGrant, 6)
    expect(est.archiveTotal).toBeCloseTo(sumArchive, 6)
    expect(est.monthlyTotal).toBeCloseTo(sumMonthly, 6)
    expect(est.archiveTotal).toBeGreaterThan(0) // exercises the archive accumulation path
    expect(est.grandTotal).toBeCloseTo(est.grantTotal + est.archiveTotal, 6)
  })

  it('skips unknown service slugs without disturbing the totals', () => {
    const selections = [
      { service_slug: 'hpc-compute', estimate: 1000 },
      { service_slug: 'does-not-exist', estimate: 999 }
    ]
    const est = computeEstimate(selections, { servicesBySlug: bySlug(), grantMonths: 12, retentionYears: 5 })
    expect(est.byService).toHaveLength(1)
    expect(est.byService[0].service_slug).toBe('hpc-compute')
    expect(est.monthlyTotal).toBeCloseTo(80, 6) // 1000 SU in the first band @ $0.08
  })
})
