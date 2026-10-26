import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import guidanceRoutes from '../src/router/guidance.routes.js'

// AppletFrame's "Next" button does router.push(`/ai/${getNextApplet()}`). The
// router has no catch-all, so a slug that isn't a real child path renders a
// blank page — IrbAmendment returned 'clinical-validation' when the route is
// 'clinical/clinical-validation'. Scrape every applet's getNextApplet returns
// and check each against the /ai children.

const appletsDir = path.resolve(__dirname, '..', 'src', 'ai-guidance', 'applets')

function vueFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? vueFiles(path.join(dir, e.name)) : e.name.endsWith('.vue') ? [path.join(dir, e.name)] : []
  )
}

describe('AI guidance applet "next" targets', () => {
  const aiRoot = guidanceRoutes.find((r) => r.path === '/ai')
  const childPaths = new Set(aiRoot.children.map((c) => c.path))

  const targets = vueFiles(appletsDir).flatMap((file) => {
    const fn = fs.readFileSync(file, 'utf8').match(/function getNextApplet\([^)]*\)\s*\{[\s\S]*?\n\}/)
    if (!fn) return []
    return [...fn[0].matchAll(/return '([^']+)'/g)].map((m) => ({ file: path.basename(file), slug: m[1] }))
  })

  it('finds the applets it is meant to guard', () => {
    expect(targets.length).toBeGreaterThan(10)
  })

  it('every getNextApplet return is a real /ai route', () => {
    const broken = targets.filter((t) => !childPaths.has(t.slug))
    expect(broken).toEqual([])
  })
})
