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
  'help-videos.yaml'
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
function validateConfig(config) {
  const errors = []

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

  return errors
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
  const errors = validateConfig(config)

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

// Run
buildConfig()
