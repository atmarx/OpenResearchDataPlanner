#!/usr/bin/env node
// persona-session — the runner CLI.
//
// Prepares a recorded think-aloud usability session from a brief in
// docs/ux/sessions/. Two modes (per the spec's two tracks):
//
//   mcp (default)  Exploratory "let them loose." Scaffolds the review folder,
//                  writes the agent's session packet, and prints the exact
//                  @playwright/mcp command — video + trace land in the folder,
//                  the agent drives the browser tool-by-tool and narrates.
//
//   scripted       Regression. Hands off to the @playwright/test runner
//                  (session.spec.mjs) which drives a known path and records.
//
// Usage:
//   node scripts/persona-session.mjs <session_id> [--target staging|dev|local]
//                                     [--url <override>] [--mode mcp|scripted]
//   node scripts/persona-session.mjs --list
//
// The browser tooling is not invoked from here for mcp mode — it prints the
// command so the operator (or the /persona-session skill) runs it. That keeps
// the runner honest: one command in, a fully-scaffolded session out.

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  REPO_ROOT,
  SESSIONS_DIR,
  loadBrief,
  resolveTarget,
  sessionDir,
  readPersona,
  buildSessionPacket,
  narrationHeader,
  verdictScaffold,
} from '../tests/persona-sessions/harness.mjs'

function parseArgs(argv) {
  const args = { _: [], mode: 'mcp' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--list') args.list = true
    else if (a === '--target') args.target = argv[++i]
    else if (a === '--url') args.url = argv[++i]
    else if (a === '--mode') args.mode = argv[++i]
    else if (a === '--headed') args.headed = true
    else if (a === '--help' || a === '-h') args.help = true
    else args._.push(a)
  }
  return args
}

function listBriefs() {
  const files = fs
    .readdirSync(SESSIONS_DIR)
    .filter((f) => f.endsWith('.yaml') && !f.startsWith('_'))
    .map((f) => f.replace(/\.yaml$/, ''))
  console.log('Available session briefs:\n')
  for (const id of files) {
    try {
      const { brief } = loadBrief(id)
      const firstLine = brief.goal.trim().split('\n')[0].slice(0, 80)
      console.log(`  ${id}\n    persona ${brief.persona} · ${firstLine}…\n`)
    } catch (e) {
      console.log(`  ${id}  (⚠ ${e.message})\n`)
    }
  }
}

function rel(p) {
  return path.relative(REPO_ROOT, p)
}

function prepare(sessionId, args) {
  const { brief, personaDir } = loadBrief(sessionId)
  const url = resolveTarget(args.target || brief.target, args.url)
  const dir = sessionDir(sessionId)
  fs.mkdirSync(dir, { recursive: true })

  const personaText = readPersona(personaDir)
  const packet = buildSessionPacket(brief, { url, personaText })
  fs.writeFileSync(path.join(dir, 'session-packet.md'), packet)

  // Don't clobber a narration/verdict from a prior real run — scaffold only if absent.
  const narrationPath = path.join(dir, 'narration.md')
  if (!fs.existsSync(narrationPath)) fs.writeFileSync(narrationPath, narrationHeader(brief, url))
  const verdictPath = path.join(dir, 'verdict.md')
  if (!fs.existsSync(verdictPath)) fs.writeFileSync(verdictPath, verdictScaffold(brief))

  return { brief, url, dir, narrationPath }
}

function runMcp(sessionId, args) {
  const { url, dir } = prepare(sessionId, args)
  const startUrl = `${url}${(args.startPath || '/')}`
  const mcpCmd = [
    'npx',
    '@playwright/mcp@latest',
    `--output-dir ${rel(dir)}`,
    '--save-trace',
    '--save-video 1280x720',
    '--isolated',
    args.headed ? '' : '--headless',
    `--browser chromium`,
  ]
    .filter(Boolean)
    .join(' ')

  console.log(`
✅ Session ${sessionId} prepared.

  folder    ${rel(dir)}/
  target    ${url}
  packet    ${rel(path.join(dir, 'session-packet.md'))}

Exploratory (MCP) run — drive the browser as the persona and narrate:

  1. Load the session packet as your context:
       cat ${rel(path.join(dir, 'session-packet.md'))}

  2. Start a Playwright-MCP browser that records into the session folder:
       ${mcpCmd}

  3. Navigate to ${startUrl} and pursue the goal in character, narrating
     think-aloud into ${rel(path.join(dir, 'narration.md'))} as you go.

  4. Score against the success criteria in ${rel(path.join(dir, 'verdict.md'))}.

video.webm + trace.zip land in the folder automatically. Open the trace with:
  npx playwright show-trace ${rel(path.join(dir, 'trace.zip'))}
`)
}

function runScripted(sessionId, args) {
  // Hand off to @playwright/test. The spec resolves URL itself from the same
  // harness, so we only pass through the session id + overrides via env.
  prepare(sessionId, args)
  const env = { ...process.env, SESSION_ID: sessionId }
  if (args.target) env.SESSION_TARGET = args.target
  if (args.url) env.SESSION_URL = args.url
  const pwArgs = ['playwright', 'test', 'tests/persona-sessions/session.spec.mjs']
  if (args.headed) pwArgs.push('--headed')
  console.log(`Running scripted regression for ${sessionId} via @playwright/test…\n`)
  const res = spawnSync('npx', pwArgs, { cwd: REPO_ROOT, stdio: 'inherit', env })
  process.exit(res.status ?? 1)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(fs.readFileSync(new URL(import.meta.url)).toString().split('\n').slice(1, 23).join('\n').replace(/^\/\/ ?/gm, ''))
    return
  }
  if (args.list) return listBriefs()

  const sessionId = args._[0]
  if (!sessionId) {
    console.error('Usage: node scripts/persona-session.mjs <session_id> [--target …] [--mode mcp|scripted]')
    console.error('       node scripts/persona-session.mjs --list')
    process.exit(2)
  }

  try {
    if (args.mode === 'scripted') runScripted(sessionId, args)
    else runMcp(sessionId, args)
  } catch (e) {
    console.error(`✗ ${e.message}`)
    process.exit(1)
  }
}

main()
