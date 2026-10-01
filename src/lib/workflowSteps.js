/**
 * Tier workflow step gating (config/tier-workflow.yaml).
 *
 * A step may carry:
 *   show_if: <condition> | [<condition>, ...]  — shown only when ANY is active
 *   skip_if: <condition> | [<condition>, ...]  — hidden when ANY is active
 *
 * Conditions are classification flags from the questionnaire (e.g. `fre`,
 * `hipaa`) plus derived states the caller adds (e.g. `using_preapproved_service`).
 * Ungated steps always show. Pure module so the gating is unit-tested.
 */

function asList(value) {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

export function stepApplies(step, conditions) {
  const active = new Set(conditions)
  const showIf = asList(step.show_if)
  if (showIf.length && !showIf.some((c) => active.has(c))) return false
  return !asList(step.skip_if).some((c) => active.has(c))
}

export function resolveWorkflowSteps(workflow, conditions = []) {
  return (workflow?.steps || []).filter((step) => stepApplies(step, conditions))
}
