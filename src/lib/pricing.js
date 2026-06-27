/**
 * Pure pricing logic for service cost estimates.
 *
 * Single source of truth for: "given a service's cost_model + subsidies and a
 * quantity, what does it cost per month?" Extracted so it can be unit-tested
 * without Pinia/config wiring — and so the slate (and, eventually, the wizard)
 * share ONE engine instead of drifting apart.
 *
 * Reads the real config/services.yaml schema:
 *   cost_model:
 *     type: unit | tiered | consultation
 *     price: <number>                       # unit price (per unit_label)
 *     tiers: [{ up_to: <n|null>, price: <number>, label }]   # cumulative ceilings
 *   subsidies: [{ auto_apply, discount_type: free_units|percent|fixed,
 *                 discount_value, name }]
 *
 * NOTE: an earlier version of this logic lived inline in slateStore and read
 * `price_per_unit`, `tier.price_per_unit`, and treated `subsidies` as an object
 * — none of which exist in the schema — so every slate item silently costed $0.
 * The test in tests/serviceCost.test.js loads the real YAML to guard against
 * that class of drift.
 */

/**
 * @param {object} costModel - service.cost_model
 * @param {Array}  subsidies - service.subsidies (array; tolerates undefined)
 * @param {number} quantity  - quantity in the cost model's unit
 * @param {object} [opts]
 * @param {string|null} [opts.selectedSubsidySlug] - an opt-in (non-auto) subsidy
 *        the user chose, folded in AFTER the auto subsidies. Omitting it (a
 *        3-arg call, e.g. the slate) is a no-op — output stays byte-identical.
 * @returns {{ monthly: number, annual: number, breakdown: Array,
 *             freeUnits: number, billable: number, unitLabel: string }}
 */
export function computeServiceCost(costModel, subsidies = [], quantity = 0, { selectedSubsidySlug = null } = {}) {
  if (!costModel) return { monthly: 0, annual: 0, breakdown: [], freeUnits: 0, billable: 0, unitLabel: 'units' }

  const subs = Array.isArray(subsidies) ? subsidies : []
  const unitLabel = costModel.unit_label || costModel.unit || 'units'
  const qty = Number(quantity) || 0

  // Auto-applied free allowances come off the quantity before pricing.
  let freeUnits = 0
  for (const s of subs) {
    if (s.auto_apply && s.discount_type === 'free_units') {
      freeUnits += s.discount_value || 0
    }
  }
  const billable = Math.max(0, qty - freeUnits)

  let monthly = 0
  const breakdown = []

  if (freeUnits > 0) {
    breakdown.push({
      label: `Free allocation (${freeUnits.toLocaleString()} ${unitLabel})`,
      amount: 0
    })
  }

  if (costModel.type === 'unit') {
    const price = costModel.price || 0
    monthly = billable * price
    breakdown.push({
      label: `${billable.toLocaleString()} ${unitLabel} @ $${price}/${unitLabel}`,
      amount: monthly
    })
  } else if (costModel.type === 'tiered') {
    // Marginal banding: each tier.up_to is a cumulative ceiling; the final
    // tier (up_to null/undefined) is unbounded.
    let remaining = billable
    let floor = 0
    for (const tier of costModel.tiers || []) {
      if (remaining <= 0) break
      const ceiling =
        tier.up_to === null || tier.up_to === undefined ? Infinity : tier.up_to
      const bandQty = Math.min(remaining, ceiling - floor)
      floor = ceiling
      if (bandQty <= 0) continue
      const price = tier.price || 0
      const bandCost = bandQty * price
      monthly += bandCost
      breakdown.push({
        label: `${tier.label ? tier.label + ': ' : ''}${bandQty.toLocaleString()} @ $${price}`,
        amount: bandCost
      })
      remaining -= bandQty
    }
  } else if (costModel.type === 'consultation') {
    monthly = 0
    breakdown.push({ label: 'Pricing determined during consultation', amount: null })
  }

  // Percentage / fixed subsidies apply to the computed cost.
  for (const s of subs) {
    if (!s.auto_apply) continue
    if (s.discount_type === 'percent') {
      const discount = monthly * ((s.discount_value || 0) / 100)
      monthly = Math.max(0, monthly - discount)
      breakdown.push({
        label: `${s.name || 'Subsidy'} (${s.discount_value}% off)`,
        amount: -discount
      })
    } else if (s.discount_type === 'fixed') {
      const discount = s.discount_value || 0
      monthly = Math.max(0, monthly - discount)
      breakdown.push({ label: s.name || 'Subsidy', amount: -discount })
    }
  }

  // Opt-in (user-selected, non-auto) subsidy folds in AFTER the auto loop.
  // A 3-arg call leaves selectedSubsidySlug null, so this is a no-op and the
  // slate's totals stay byte-identical. The percent form is numerically equal
  // to the old inline monthly * (1 - v/100).
  if (selectedSubsidySlug) {
    const optIn = subs.find((s) => s.slug === selectedSubsidySlug)
    if (optIn) {
      const v = optIn.discount_value || 0
      if (optIn.discount_type === 'percent') {
        const discount = monthly * (v / 100)
        monthly = Math.max(0, monthly - discount)
        breakdown.push({ label: `${optIn.name || 'Subsidy'} (${v}% off)`, amount: -discount })
      } else if (optIn.discount_type === 'fixed') {
        monthly = Math.max(0, monthly - v)
        breakdown.push({ label: optIn.name || 'Subsidy', amount: -v })
      }
    }
  }

  // freeUnits + billable are surfaced so the slate (and export) can render an
  // explicit "X free / Y billable" line instead of silently swallowing the
  // free allocation into the total.
  return { monthly, annual: monthly * 12, breakdown, freeUnits, billable, unitLabel }
}

/**
 * Price one selected service into a grant-period line item: the monthly cost
 * (auto + opt-in subsidies), the grant-period total, and the optional archive
 * tail that runs from grant end through the retention horizon.
 *
 * Stays pure — the caller passes the full service config plus a resolveService
 * lookup so the archive service can be priced through the same engine.
 *
 * @param {object} service   - full service config (carries .slug/.name/.cost_model/.subsidies/.archive_option)
 * @param {object} selection - a selected-services entry { service_slug, estimate, use_subsidy, archive_estimate }
 * @param {object} ctx
 * @param {number} ctx.grantMonths    - billed months in the grant period
 * @param {number} ctx.retentionYears - total retention horizon (years)
 * @param {(slug: string) => object} ctx.resolveService - look up the archive service config
 * @returns {{ slug, name, estimate, monthly, grant, freeUnits, billable,
 *             unitLabel, breakdown, archive: object|null, archiveYears, total }}
 */
export function computeServiceLineItem(service, selection, { grantMonths, retentionYears, resolveService }) {
  const main = computeServiceCost(
    service?.cost_model,
    service?.subsidies,
    selection?.estimate || 0,
    { selectedSubsidySlug: selection?.use_subsidy || null }
  )

  const monthly = main.monthly
  const grant = monthly * grantMonths
  const archiveYears = Math.max(0, retentionYears - grantMonths / 12)

  // Archive runs only when the service offers one AND the user committed a real
  // archive estimate. No archive_ratio default here — that estimate*ratio guess
  // is UI-only and would invent cost. Priced through the engine (no opt-in).
  let archive = null
  const archiveSlug = service?.archive_option?.service_slug
  if (archiveSlug && selection?.archive_estimate) {
    const archiveConfig = resolveService(archiveSlug)
    const archiveResult = computeServiceCost(
      archiveConfig?.cost_model,
      archiveConfig?.subsidies,
      selection.archive_estimate
    )
    const annual = archiveResult.monthly * 12
    archive = {
      estimate: selection.archive_estimate,
      monthly: archiveResult.monthly,
      annual,
      total: annual * archiveYears,
      years: archiveYears
    }
  }

  return {
    slug: service?.slug,
    name: service?.name,
    estimate: selection?.estimate,
    monthly,
    grant,
    freeUnits: main.freeUnits,
    billable: main.billable,
    unitLabel: main.unitLabel,
    breakdown: main.breakdown,
    archive,
    archiveYears,
    total: grant + (archive?.total || 0)
  }
}

/**
 * Roll a full set of selections into the budget summary the ResultsStep renders:
 * per-service grant/archive rows plus the monthly / grant / archive / grand
 * totals. Unknown service slugs are skipped (config may have changed under a
 * saved session). Accumulation matches the wizard's historical loop exactly.
 *
 * @param {Array}  selections - sessionStore.session.selected_services
 * @param {object} ctx
 * @param {Object} ctx.servicesBySlug - slug -> service config
 * @param {number} ctx.grantMonths
 * @param {number} ctx.retentionYears
 * @returns {{ byService: Array, monthlyTotal: number, grantTotal: number,
 *             archiveTotal: number, grandTotal: number, grantMonths: number,
 *             archiveYears: number }}
 */
export function computeEstimate(selections, { servicesBySlug, grantMonths, retentionYears }) {
  const resolveService = (slug) => servicesBySlug[slug]

  let monthlyTotal = 0
  let grantTotal = 0
  let archiveTotal = 0
  const byService = []

  for (const s of selections) {
    const service = servicesBySlug[s.service_slug]
    if (!service) continue

    const li = computeServiceLineItem(service, s, { grantMonths, retentionYears, resolveService })
    const archive = li.archive?.total || 0

    monthlyTotal += li.monthly
    grantTotal += li.grant
    archiveTotal += archive

    byService.push({
      service_slug: s.service_slug,
      name: li.name,
      monthly: li.monthly,
      grant: li.grant,
      archive
    })
  }

  return {
    byService,
    monthlyTotal,
    grantTotal,
    archiveTotal,
    grandTotal: grantTotal + archiveTotal,
    grantMonths,
    archiveYears: Math.max(0, retentionYears - grantMonths / 12)
  }
}
