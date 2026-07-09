#!/usr/bin/env node
/**
 * optimize-images.mjs — background image pipeline (author-time, not build-time).
 *
 * There is no backend, so whatever a source image weighs, every visitor
 * downloads. This shrinks institution-supplied hero backgrounds to a sane,
 * web-ready shape ONCE, on the machine of whoever adds them:
 *
 *   images/backgrounds/<name>.{png,jpg,jpeg,webp}   (source — committed, NOT served)
 *     -> public/images/backgrounds/<name>.webp        1920x1080, q80  (full)
 *     -> public/images/backgrounds/thumbs/<name>.webp  320x180,  q70  (modal thumb)
 *
 * The OUTPUTS are committed, so CI and `npm run build` never touch sharp or
 * these sources — this is a local step you run when backgrounds change:
 *
 *   npm run optimize:images
 *
 * Both variants are cover-cropped to 16:9 (matching the fixed bg-cover hero
 * layer) and stripped of metadata (smaller + no stray EXIF/GPS).
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT, 'images', 'backgrounds')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'backgrounds')
const THUMB_DIR = path.join(OUT_DIR, 'thumbs')

const FULL = { width: 1920, height: 1080, quality: 80 }
const THUMB = { width: 320, height: 180, quality: 70 }
const SOURCE_RE = /\.(png|jpe?g|webp)$/i

function kb(bytes) { return (bytes / 1024).toFixed(0) + ' KB' }

async function render(srcPath, outPath, { width, height, quality }) {
  await sharp(srcPath)
    .resize(width, height, { fit: 'cover', position: 'attention' })
    .webp({ quality })
    .toFile(outPath)
  return fs.statSync(outPath).size
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`No source directory at ${path.relative(ROOT, SRC_DIR)}/`)
    console.error('Create it and drop your background images in, then re-run.')
    process.exit(1)
  }
  const sources = fs.readdirSync(SRC_DIR).filter((f) => SOURCE_RE.test(f))
  if (!sources.length) {
    console.error(`No images in ${path.relative(ROOT, SRC_DIR)}/ (png, jpg, webp).`)
    process.exit(1)
  }

  fs.mkdirSync(THUMB_DIR, { recursive: true })
  console.log(`Optimizing ${sources.length} background${sources.length > 1 ? 's' : ''}...\n`)

  for (const file of sources) {
    const name = file.replace(SOURCE_RE, '')
    const srcPath = path.join(SRC_DIR, file)
    const srcSize = fs.statSync(srcPath).size
    const fullSize = await render(srcPath, path.join(OUT_DIR, `${name}.webp`), FULL)
    const thumbSize = await render(srcPath, path.join(THUMB_DIR, `${name}.webp`), THUMB)
    console.log(
      `  ${file.padEnd(28)} ${kb(srcSize).padStart(9)}  ->  ` +
      `full ${kb(fullSize).padStart(8)}   thumb ${kb(thumbSize).padStart(7)}`
    )
  }

  console.log(`\nDone. Outputs in ${path.relative(ROOT, OUT_DIR)}/ (commit them).`)
  console.log('Reference them in config/meta.yaml under branding.hero_backgrounds.')
}

main().catch((err) => {
  console.error('Image optimization failed:', err.message)
  process.exit(1)
})
