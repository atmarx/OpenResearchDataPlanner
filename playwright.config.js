// Playwright config for persona sessions.
//
// Persona-session specs record video + trace into each session's own review
// folder (docs/ux/reviews/playwright/<id>/), so artifact paths are set per-run
// in the spec rather than globally here. This config carries the shared defaults:
// where specs live, generous timeouts for a live remote target, and Chromium.
//
// This is intentionally separate from vitest (tests/**/*.test.js) — vitest runs
// the unit suite, Playwright runs the browser sessions. They do not overlap.

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/persona-sessions',
  testMatch: '**/*.spec.mjs',
  // Live remote target — be patient, don't retry think-aloud runs.
  timeout: 5 * 60 * 1000,
  expect: { timeout: 15 * 1000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
    trace: 'off', // traces are started/saved manually per session so they land in the session folder
    video: 'off', // recordVideo is configured per-context in the spec for the same reason
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
