import { describe, it, expect } from 'vitest'
import { fillDisclosureTokens } from '../src/lib/aiDisclosure.js'

// The whole point of the {assistant} token is that a fork can rebrand or REMOVE
// the AI vendor with one config edit and no source change. The blank case is the
// one that breaks grammar if mishandled, so it's the one most worth locking down.

describe('fillDisclosureTokens', () => {
  it('substitutes institution and assistant', () => {
    expect(
      fillDisclosureTokens('Built by {institution} with help from {assistant}.', {
        institution: 'Northwinds',
        assistant: 'Codex'
      })
    ).toBe('Built by Northwinds with help from Codex.')
  })

  it('keeps an assistant value that contains parentheses', () => {
    expect(
      fillDisclosureTokens('assistance from {assistant}.', { assistant: 'Claude (Anthropic)' })
    ).toBe('assistance from Claude (Anthropic).')
  })

  it('collapses "from {assistant}" cleanly when assistant is blank', () => {
    expect(
      fillDisclosureTokens(
        'Developed by {institution} with AI coding assistance from {assistant}. Reviewed by staff.',
        { institution: 'Northwinds', assistant: '' }
      )
    ).toBe('Developed by Northwinds with AI coding assistance. Reviewed by staff.')
  })

  it('drops a parenthetical "({assistant})" when blank, keeps it when set', () => {
    expect(fillDisclosureTokens('assistance ({assistant}).', { assistant: '' })).toBe('assistance.')
    expect(fillDisclosureTokens('assistance ({assistant}).', { assistant: 'Codex' })).toBe('assistance (Codex).')
  })

  it('does not strip a real institution that follows "by"', () => {
    // {institution} is filled before the blank-assistant strip runs, so "by Northwinds" survives
    expect(
      fillDisclosureTokens('Developed by {institution} from {assistant}.', {
        institution: 'Northwinds',
        assistant: ''
      })
    ).toBe('Developed by Northwinds.')
  })

  it('is null-safe', () => {
    expect(fillDisclosureTokens(null, { assistant: 'X' })).toBe('')
    expect(fillDisclosureTokens('no tokens here')).toBe('no tokens here')
  })
})
