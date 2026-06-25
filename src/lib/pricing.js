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
 * @returns {{ monthly: number, annual: number, breakdown: Array }}
 */
export function computeServiceCost(costModel, subsidies = [], quantity = 0) {
  if (!costModel) return { monthly: 0, annual: 0, breakdown: [] }

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

  return { monthly, annual: monthly * 12, breakdown }
}
