import { describe, it, expect } from 'vitest'
import { deriveSkin, contrastRatio, _SKINS } from '../src/composables/useSkin.js'

/* The skin engine repaints --color-primary (a FILL) and pairs it with
   --color-on-primary text across ~94 bg-primary surfaces, in BOTH themes.
   These tests lock the WCAG 4.5:1 guarantee for that pairing so a re-skin —
   built-in or dragged-in — can never strand unreadable button text. Light
   mode darkens the fill until white passes; dark mode runs a bright fill and
   flips on-primary to dark ink. Both are contrast-guaranteed. */

const AA = 4.5

function onPrimaryContrast(map) {
  return contrastRatio(map['--color-on-primary'], map['--color-primary'])
}

describe('skin on-primary contrast (WCAG AA, both themes)', () => {
  it('every built-in skin clears 4.5:1 in light AND dark', () => {
    for (const [name, skin] of Object.entries(_SKINS)) {
      if (skin.base || !skin.tokens) continue // "default" ODP uses main.css, not deriveSkin
      const { light, dark } = deriveSkin(skin.tokens)
      expect(onPrimaryContrast(light), `${name} light`).toBeGreaterThanOrEqual(AA)
      expect(onPrimaryContrast(dark), `${name} dark`).toBeGreaterThanOrEqual(AA)
    }
  })

  it('Northwinds dark button is no longer the ~3.98:1 white-on-mid-blue failure', () => {
    const { dark } = deriveSkin(_SKINS.northwinds.tokens)
    // the regression this guards: the old dark path kept white on-primary on a
    // lightened mid-tone accent (#4677ee) and failed AA.
    expect(dark['--color-on-primary'].toLowerCase()).not.toBe('#ffffff')
    expect(onPrimaryContrast(dark)).toBeGreaterThanOrEqual(AA)
  })

  // The marquee "bring-your-own design.md" case: a pale brand accent that fails
  // white text at face value. Light mode must darken it; dark mode must carry
  // dark ink on it. Both directions covered.
  const badAccents = [
    { label: 'pale gold', hex: '#e3b341' },
    { label: 'light teal', hex: '#5eead4' },
    { label: 'lemon', hex: '#fde047' }
  ]
  for (const { label, hex } of badAccents) {
    it(`a dropped ${label} accent (${hex}) clears 4.5:1 in both themes`, () => {
      const tok = {
        colors: { primary: '#111827', secondary: '#6b7280', tertiary: hex, neutral: '#f9fafb', surface: '#ffffff', 'on-primary': '#ffffff' }
      }
      const { light, dark } = deriveSkin(tok)
      expect(onPrimaryContrast(light), `${label} light`).toBeGreaterThanOrEqual(AA)
      expect(onPrimaryContrast(dark), `${label} dark`).toBeGreaterThanOrEqual(AA)
    })
  }
})
