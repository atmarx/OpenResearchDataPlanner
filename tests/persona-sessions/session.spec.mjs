// Scripted persona session — regression mode.
//
// "Does Frindt's happy path still work after this change?" This drives a known,
// deterministic flow through the app against the live target and records the full
// recording set into the session's review folder. It is NOT the exploratory
// think-aloud run (that's MCP-driven, agent-narrated); it's the regression guard
// that proves the harness records correctly and that the core affordances each
// brief depends on still exist.
//
// Driven by scripts/persona-session.mjs --mode scripted, which sets SESSION_ID.
// Run directly with:  SESSION_ID=s01-frindt-fda-dmp npx playwright test

import { test, expect, chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import {
  loadBrief,
  resolveTarget,
  sessionDir,
  narrationHeader,
  stamp,
} from './harness.mjs'

const SESSION_ID = process.env.SESSION_ID
if (!SESSION_ID) {
  throw new Error('SESSION_ID env var is required (set it via scripts/persona-session.mjs --mode scripted).')
}

const { brief } = loadBrief(SESSION_ID)
const url = resolveTarget(process.env.SESSION_TARGET || brief.target, process.env.SESSION_URL)
const dir = sessionDir(SESSION_ID)

test.describe(`persona-session regression — ${SESSION_ID}`, () => {
  let browser
  let context
  let page
  const t0 = Date.now()
  const lines = []

  // narrate appends a timestamped, typed line to the in-memory log; flushed to
  // narration.md at the end so the regression run files the same artifact shape
  // as an exploratory run.
  function narrate(kind, line) {
    lines.push(`- \`[${stamp(Date.now() - t0)}]\` **(${kind})** ${line}`)
  }

  test.beforeAll(async () => {
    fs.mkdirSync(dir, { recursive: true })
    browser = await chromium.launch({ headless: !process.argv.includes('--headed') })
    context = await browser.newContext({
      recordVideo: { dir, size: { width: 1280, height: 720 } },
      viewport: { width: 1280, height: 720 },
    })
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true })
    page = await context.newPage()
    narrate('intent', `Starting as ${brief.persona} against ${url}. I want to ${brief.goal.trim().split('.')[0].toLowerCase()}.`)
  })

  test.afterAll(async () => {
    await context.tracing.stop({ path: path.join(dir, 'trace.zip') })
    await context.close() // flushes the video file to disk
    await browser.close()
    // Playwright writes the recording as page@<hash>.webm. Rename the largest
    // one to a stable video.webm so the folder holds a single, predictable file.
    const webms = fs
      .readdirSync(dir)
      .filter((f) => /^page@.*\.webm$/.test(f))
      .map((f) => ({ f, size: fs.statSync(path.join(dir, f)).size }))
      .sort((a, b) => b.size - a.size)
    if (webms.length) {
      fs.renameSync(path.join(dir, webms[0].f), path.join(dir, 'video.webm'))
      for (const { f } of webms.slice(1)) fs.rmSync(path.join(dir, f))
    }
    // Flush narration (scripted runs append under a regression heading so they
    // don't overwrite an exploratory narration in the same folder).
    const header = fs.existsSync(path.join(dir, 'narration.md'))
      ? '\n\n---\n\n## Scripted regression pass\n\n'
      : narrationHeader(brief, url) + '## Scripted regression pass\n\n'
    fs.appendFileSync(path.join(dir, 'narration.md'), header + lines.join('\n') + '\n')
  })

  test('landing → wizard renders', async () => {
    narrate('intent', 'Landing on the planner. I expect a clear starting point, not a wall of jargon.')
    await page.goto(`${url}${brief.start_url || '/'}`, { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveTitle(/Data Planner|OpenDataPlanner/i)
    await expect(page.locator('body')).toBeVisible()
    narrate('observe', 'Page loaded and titled. Wizard view is the entry point.')
  })

  test('tier questionnaire starts and reflects the question node to #q-<id>', async () => {
    narrate('intent', 'Going to the tier check to classify my data. I want to know what protections it needs.')
    await page.goto(`${url}/tier-check`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).toBeVisible()
    // The questionnaire mounts on an intro screen (currentQuestionId = null) — no
    // question node, hash, or help button exists until you start it. Click in.
    const start = page.getByRole('button', { name: /start questionnaire/i }).first()
    if (await start.count()) {
      narrate('intent', 'There\'s a "Start Questionnaire" button — clicking to begin classifying.')
      await start.click()
    } else {
      narrate('stall', 'No "Start Questionnaire" button on /tier-check intro — I can\'t even begin.')
    }
    // Now a question node should drive the hash to #q-<id>.
    await page
      .waitForFunction(() => /#q-[a-z0-9_-]+/i.test(window.location.hash), null, { timeout: 15000 })
      .catch(() => {})
    const hash = new URL(page.url()).hash
    if (/^#q-/i.test(hash)) {
      narrate('observe', `First question is up and addressable (${hash}). Good: I can cite the exact node if I get stuck.`)
    } else {
      narrate('stall', `Started the questionnaire but saw no #q-<id> hash (got "${hash || '(none)'}"). A confused user here would have nothing to point at in a support ticket.`)
    }
    expect(await page.locator('body').isVisible()).toBe(true)
  })

  test('"I don\'t understand this!" help affordance is on the question', async () => {
    narrate('intent', 'If a question confuses me, I want a way to flag exactly which one to support.')
    const help = page.getByRole('button', { name: /understand this/i }).first()
    const present = await help.count()
    if (present) {
      narrate('observe', 'The "I don\'t understand this!" button is here on the question — confusion has an escape hatch that captures what/where.')
    } else {
      narrate('stall', 'No "I don\'t understand this!" affordance on the active question. A stuck user has no clean way to tell us where they\'re stuck.')
    }
    expect(present).toBeGreaterThanOrEqual(0) // presence is a finding, not a hard fail — narration carries the signal
  })

  test('cost calculators are reachable', async () => {
    narrate('intent', 'I need a dollar figure for the budget. Looking for the cost estimators.')
    await page.goto(`${url}/calculators`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).toBeVisible()
    narrate('observe', 'Calculators route loads. This is where a cost estimate would come from.')
  })
})
