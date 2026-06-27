# Cloud-Equivalent Value — Feature Spec

**Status:** greenlit (xram), spec'd, **NOT YET BUILT.** This is the next feature
build for OpenResearchDataPlanner.

## Why
Show, alongside the researcher's cost, what the equivalent *compliant* cloud
service would cost — turning "$0 / free tier" into "$0, valued at ~$35/mo." It
makes the value of institutional on-prem / subsidized infrastructure visible.
Three payoffs:
- The **researcher** sees institutional resources are worth using (vs expensing
  random cloud).
- The **PI / grants office** can write it as institutional cost-share in the
  budget justification — the killer use case, lives in the DMP/budget export.
- **The team** gets a number that quantifies the ROI of the on-prem investment.

## Hard rule — apples-to-apples WITH compliance ("no vercel")
The comparison is only honest if it's the **compliant** equivalent (BAA, isolated
tenancy, encryption, egress appropriate to the tier). A Tier-3 HIPAA workload's
cloud cost is 3–10× the naive consumer price — and that gap *is* the point. Every
number documents its basis. No non-compliant consumer prices ever.

## Pricing-model context (xram)
- Actual **cloud** service usage in the catalog is passed through **at cost, no
  markup**. So for cloud services the "value" == the real pass-through cost —
  there is no subsidy gap there.
- The value gap is for **on-prem / subsidized** services (free or below-cost),
  where the cloud-equivalent shows what you'd otherwise pay. That's where this
  feature earns its keep.

## Config schema (`services.yaml`, per service)
```yaml
cloud_equivalent:
  unit: GB-month                 # matches the service's cost_model unit
  providers:
    - { name: AWS,   per_unit: 0.023, basis: "S3 Standard-IA + BAA, us-east-1" }
    - { name: Azure, per_unit: 0.025, basis: "Blob Cool tier + BAA" }
  as_of: "2026-06"
```
- Value scales with the researcher's **full** quantity (NOT the billable
  remainder — no institutional free tier exists in the cloud, so the whole usage
  counts).
- **≥2 providers, shown as a range.** Never a single cherry-picked figure.
- Mapping: storage → warm-tier cloud storage; on-prem VMs → comparable cloud VMs;
  **GPU / high-RAM VMs are where the gap is largest.**

## Engine
`computeCloudValue(service, quantity)` in `src/lib/pricing.js`, next to
`computeServiceCost`. Returns per-provider monthly + a `{ low, high }` range.
Unit-test in `tests/serviceCost.test.js` against the real YAML (same pattern that
guards the cost engine).

## Surfaces
1. **Matrix / catalog** (`src/views/ServiceMatrix.vue`) — per-service
   "Cloud value ~$X–Y/mo," loudest on the free tiers ("$0 · valued at ~$35/mo").
2. **Slate total** (`src/components/slate/SlateFooter.vue`) — "Your cost $X/yr ·
   Cloud-equivalent ~$Y/yr · **Institution covers ~$Z/yr**."
3. **DMP / budget export** (`src/composables/useDMPGenerator.js` +
   `ResultsStep.exportBudget`) — "Institutional infrastructure contribution:
   ~$Y/yr (compliant cloud-equivalent)." ← grant-justification line, the payoff.

## OPEN DECISION — sourcing the per-unit numbers
Who seeds the values (xram to decide):
- **(a)** Marco researches a defensible first pass — conservative 2026 AWS/Azure
  *compliant* rates for the main types (warm storage GB-mo, CPU core-hr, A100
  GPU-hr), basis documented + `as_of` dated, flagged for xram review (like the
  pricing-values task); **or**
- **(b)** xram / team drops the numbers in.

Build the machinery + surfaces either way; only the values block on this.

## Credibility guardrails
Conservative estimates, documented basis, `as_of` dates, sourced from the
providers' own calculators where possible. **Underclaim slightly** — a defensible
$35 beats an impressive-but-hand-wavy $80. (See the Bramford trust-gap history in
#openresearchdataplanner.)
