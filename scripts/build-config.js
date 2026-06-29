#!/usr/bin/env node

/**
 * OpenResearchDataPlanner Config Build Script
 *
 * Compiles YAML configuration files into a single JSON file for the frontend.
 * Also validates referential integrity between config files.
 *
 * Usage:
 *   node scripts/build-config.js           # Build config.json
 *   node scripts/build-config.js --validate-only  # Validate without building
 */

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

const CONFIG_DIR = path.join(ROOT_DIR, 'config')
const OUTPUT_DIR = path.join(ROOT_DIR, 'public')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'config.json')

const VALIDATE_ONLY = process.argv.includes('--validate-only')

// Config files to load (order matters for validation)
const CONFIG_FILES = [
  'meta.yaml',
  'categories.yaml',
  'tiers.yaml',
  'tier-questionnaire.yaml',
  'tier-workflow.yaml',
  'services.yaml',
  'mappings.yaml',
  'bundles.yaml',
  'retention.yaml',
  'software.yaml',
  'acronyms.yaml',
  'calculators.yaml',
  'help.yaml',
  'help-videos.yaml',
  'legal.yaml',
  'explainers.yaml'
]

/**
 * Load a YAML file and return parsed content
 */
function loadYamlFile(filename) {
  const filepath = path.join(CONFIG_DIR, filename)

  if (!fs.existsSync(filepath)) {
    throw new Error(`Config file not found: ${filepath}`)
  }

  const content = fs.readFileSync(filepath, 'utf8')
  return yaml.load(content)
}

/**
 * Load all DMP templates from the dmp-templates directory
 */
function loadDmpTemplates() {
  const templates = {}
  const templatesDir = path.join(CONFIG_DIR, 'dmp-templates')

  if (!fs.existsSync(templatesDir)) {
    console.warn('Warning: dmp-templates directory not found')
    return templates
  }

  function walkDir(dir, prefix = '') {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filepath = path.join(dir, file)
      const stat = fs.statSync(filepath)

      if (stat.isDirectory()) {
        walkDir(filepath, `${prefix}${file}/`)
      } else if (file.endsWith('.md')) {
        // Key format: "hpc-slurm/low" (without .md extension)
        const key = `${prefix}${file}`.replace(/\.md$/, '')
        templates[key] = fs.readFileSync(filepath, 'utf8')
      }
    }
  }

  walkDir(templatesDir)
  return templates
}

/**
 * Load export templates from the export-templates directory
 */
function loadExportTemplates() {
  const templates = {}
  const templatesDir = path.join(CONFIG_DIR, 'export-templates')

  if (!fs.existsSync(templatesDir)) {
    console.warn('Warning: export-templates directory not found')
    return templates
  }

  const files = fs.readdirSync(templatesDir)

  for (const file of files) {
    if (file.endsWith('.md.hbs')) {
      // Key format: "slate-export" (without .md.hbs extension)
      const key = file.replace(/\.md\.hbs$/, '')
      templates[key] = fs.readFileSync(path.join(templatesDir, file), 'utf8')
    }
  }

  return templates
}

/**
 * Load AI guidance applet configs from the ai-guidance directory (general track)
 */
function loadAiGuidance() {
  const aiGuidance = {}
  const guidanceDir = path.join(CONFIG_DIR, 'ai-guidance')

  if (!fs.existsSync(guidanceDir)) {
    console.warn('Warning: config/ai-guidance/ directory not found')
    return aiGuidance
  }

  const files = fs.readdirSync(guidanceDir)

  for (const file of files) {
    if (file.endsWith('.yaml')) {
      const key = file.replace(/\.yaml$/, '')
      const filepath = path.join(guidanceDir, file)
      const content = fs.readFileSync(filepath, 'utf8')
      aiGuidance[key] = yaml.load(content)
    }
  }

  return aiGuidance
}

/**
 * Load clinical guidance applet configs from the clinical directory
 */
function loadClinicalGuidance() {
  const clinical = {}
  const clinicalDir = path.join(CONFIG_DIR, 'clinical')

  if (!fs.existsSync(clinicalDir)) {
    console.warn('Warning: config/clinical/ directory not found')
    return clinical
  }

  const files = fs.readdirSync(clinicalDir)

  for (const file of files) {
    if (file.endsWith('.yaml')) {
      const key = file.replace(/\.yaml$/, '')
      const filepath = path.join(clinicalDir, file)
      const content = fs.readFileSync(filepath, 'utf8')
      clinical[key] = yaml.load(content)
    }
  }

  return clinical
}

/**
 * Validate referential integrity of the configuration
 */
export function validateConfig(config) {
  const errors = []
  const warnings = []

  // Build lookup sets
  const tierSlugs = new Set(config.tiers?.map(t => t.slug) || [])
  const categorySlugs = new Set(config.categories?.map(c => c.slug) || [])
  const serviceSlugs = new Set(config.services?.map(s => s.slug) || [])
  const templateKeys = new Set(Object.keys(config.dmpTemplates || {}))

  // 1. Validate services reference valid categories
  for (const service of config.services || []) {
    if (!categorySlugs.has(service.category)) {
      errors.push(`Service "${service.slug}" references unknown category: "${service.category}"`)
    }

    // Validate archive_option references valid service
    if (service.archive_option?.service_slug) {
      if (!serviceSlugs.has(service.archive_option.service_slug)) {
        errors.push(`Service "${service.slug}" archive_option references unknown service: "${service.archive_option.service_slug}"`)
      }
    }
  }

  // 2. Validate mappings reference valid services and tiers
  for (const mapping of config.mappings || []) {
    if (!serviceSlugs.has(mapping.service)) {
      errors.push(`Mapping references unknown service: "${mapping.service}"`)
    }
    if (!tierSlugs.has(mapping.tier)) {
      errors.push(`Mapping references unknown tier: "${mapping.tier}"`)
    }

    // Validate DMP template exists (if specified)
    if (mapping.dmp_template && !templateKeys.has(mapping.dmp_template.replace(/\.md$/, ''))) {
      errors.push(`Mapping "${mapping.service}:${mapping.tier}" references missing DMP template: "${mapping.dmp_template}"`)
    }
  }

  // 3. Validate bundles reference valid services
  for (const bundle of config.bundles || []) {
    for (const item of bundle.services || []) {
      if (!serviceSlugs.has(item.service)) {
        errors.push(`Bundle "${bundle.slug}" references unknown service: "${item.service}"`)
      }
    }

    // Validate recommended_tiers
    for (const tier of bundle.recommended_tiers || []) {
      if (!tierSlugs.has(tier)) {
        errors.push(`Bundle "${bundle.slug}" references unknown tier in recommended_tiers: "${tier}"`)
      }
    }
  }

  // 4. Validate retention schedules reference valid tiers
  for (const schedule of config.retention?.schedules || []) {
    for (const tier of schedule.applies_to_tiers || []) {
      if (!tierSlugs.has(tier)) {
        errors.push(`Retention schedule "${schedule.slug}" references unknown tier: "${tier}"`)
      }
    }
  }

  // 5. Validate compliance-block invariants.
  //
  //    Sections 1-4 check shapes and references. These check *meaning* — they're
  //    what makes "policy as code" enforce policy instead of just structure. Every
  //    rule here is deliberately UNIVERSAL (a regulatory or logical truth, not a
  //    Northwinds-specific rule) and carries its reasoning, so a fork whose rules
  //    genuinely differ can see what a check is for and bend it on purpose rather
  //    than trip over it. Errors block the build; warnings are advisory.
  const BAA_STATUSES = new Set(['in_place', 'available', 'not_available', 'not_applicable'])

  for (const mapping of config.mappings || []) {
    const compliance = mapping.compliance
    if (!compliance) continue
    const where = `Mapping "${mapping.service}:${mapping.tier}"`
    const frameworks = compliance.frameworks || []

    // 5a. baa_status must be a known value. The matrix lights the BAA badge only on
    //     an exact "in_place" match, so a typo fails closed — it would silently hide
    //     a real agreement. Catch the misspelling at build time instead.
    if (compliance.baa_status && !BAA_STATUSES.has(compliance.baa_status)) {
      errors.push(`${where} has unknown baa_status "${compliance.baa_status}" (expected one of: ${[...BAA_STATUSES].join(', ')})`)
    }

    // 5b. HIPAA requires a secured BAA. Processing PHI through a third party is only
    //     lawful under a signed Business Associate Agreement (45 CFR 164.502(e)). The
    //     lone exception is a service with no business associate at all — e.g. on-prem
    //     institutional infrastructure — which is why "not_applicable" is allowed
    //     alongside "in_place". Claiming "hipaa" while a BAA is only "available"
    //     (offered, unsigned) or "not_available" is a contradiction: the badge would
    //     advertise PHI capability the paperwork doesn't support.
    //     To bend: an institution that secures PHI through some instrument other than
    //     a BAA should widen the allowed set below — don't delete the check.
    if (frameworks.includes('hipaa') && !['in_place', 'not_applicable'].includes(compliance.baa_status)) {
      errors.push(`${where} lists framework "hipaa" but baa_status is "${compliance.baa_status ?? 'unset'}" — PHI needs an in-place BAA (or "not_applicable" for on-prem services with no business associate)`)
    }

    // 5c. If a BAA is in place, name it. This is an auditability convention — a
    //     reviewer should be able to find the actual contract — not a legal
    //     requirement, so it's a warning, not a red build. A fork that records
    //     agreements elsewhere can ignore it.
    if (compliance.baa_status === 'in_place' && !compliance.baa_reference) {
      warnings.push(`${where} has baa_status "in_place" but no baa_reference — name the agreement so it can be audited`)
    }
  }

  return { errors, warnings }
}

/**
 * Main build function
 */
function buildConfig() {
  console.log('Building OpenResearchDataPlanner configuration...\n')

  const config = {}

  // Load each YAML config file
  for (const file of CONFIG_FILES) {
    // Convert hyphens to underscores for JS object key compatibility
    const key = path.basename(file, '.yaml').replace(/-/g, '_')
    console.log(`  Loading ${file}...`)

    try {
      const data = loadYamlFile(file)
      // Most files have a root key matching the filename (e.g., tiers.yaml has { tiers: [...] })
      // We flatten this to just the array/object
      // Exception: some YAML files have multiple root keys that need to be preserved
      // - software.yaml: software, categories, license_statuses
      // - acronyms.yaml: acronyms, annotation_config
      if (key === 'software' || key === 'acronyms') {
        config[key] = data // Keep full structure
      } else {
        config[key] = data[key] || data
      }
    } catch (e) {
      console.error(`  Error loading ${file}: ${e.message}`)
      process.exit(1)
    }
  }

  // Load DMP templates
  console.log('  Loading DMP templates...')
  config.dmpTemplates = loadDmpTemplates()
  console.log(`    Found ${Object.keys(config.dmpTemplates).length} templates`)

  // Load export templates
  console.log('  Loading export templates...')
  config.exportTemplates = loadExportTemplates()
  console.log(`    Found ${Object.keys(config.exportTemplates).length} templates`)

  // Load AI guidance configs (general track)
  console.log('  Loading AI guidance configs...')
  config.aiGuidance = loadAiGuidance()
  console.log(`    Found ${Object.keys(config.aiGuidance).length} AI guidance applets`)

  // Load clinical guidance configs
  console.log('  Loading clinical guidance configs...')
  config.clinicalGuidance = loadClinicalGuidance()
  console.log(`    Found ${Object.keys(config.clinicalGuidance).length} clinical applets`)

  // Validate configuration
  console.log('\nValidating configuration...')
  const { errors, warnings } = validateConfig(config)

  if (warnings.length > 0) {
    console.warn('\nValidation warnings (advisory — not blocking):')
    for (const warning of warnings) {
      console.warn(`  - ${warning}`)
    }
  }

  if (errors.length > 0) {
    console.error('\nValidation errors:')
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
    process.exit(1)
  }

  console.log('  All validations passed!')

  if (VALIDATE_ONLY) {
    console.log('\n--validate-only flag set, skipping build.')
    return
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Write JSON output
  console.log(`\nWriting ${OUTPUT_FILE}...`)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(config, null, 2))

  console.log('\nBuild complete!')
  console.log(`  Output: ${OUTPUT_FILE}`)
  console.log(`  Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`)
}

// Run only when executed directly, so tests can import validateConfig()
// without triggering a full build.
if (path.resolve(process.argv[1]) === __filename) {
  buildConfig()
}
