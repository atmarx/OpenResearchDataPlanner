/**
 * Which service a Help Me Estimate calculator's result lands on in the slate.
 *
 * Default per calculator category (enabled_calculators in calculators.yaml);
 * a calculator overrides it with calculator_config.<id>.target_services.default.
 * Slugs must exist in config/services.yaml and match the calculator's output
 * unit (storage → TB, cpu → SU, gpu → GPU-hours) — build-config validates the
 * first. 'api' has no default: its result is dollars over a period, and no
 * service is priced that way, so it can't be added to the slate unless a fork
 * configures a target.
 *
 * Shared by useCalculator and scripts/build-config.js, so keep it pure.
 */
export const DEFAULT_TARGET_SERVICES = {
  storage: 'hpc-storage',
  cpu: 'hpc-compute',
  gpu: 'hpc-gpu'
}

/**
 * @param {object|null} calcConfig - calculator_config.<id>
 * @param {string|null} category   - the calculator's enabled_calculators group
 * @returns {string|null} service slug, or null when nothing is configured
 */
export function resolveCalculatorTarget(calcConfig, category) {
  return calcConfig?.target_services?.default || DEFAULT_TARGET_SERVICES[category] || null
}
