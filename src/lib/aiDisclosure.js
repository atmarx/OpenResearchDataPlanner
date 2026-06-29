/**
 * AI-disclosure copy tokenizer.
 *
 * The AI vendor/assistant name is meant to be a SINGLE config knob
 * (meta.ai_disclosure.assistant) so an institution adopting this tool can
 * rebrand it ("Codex") or strip the vendor entirely ("") without editing any
 * source. Disclosure copy (banner, citation, About page) therefore refers to it
 * as the {assistant} token, plus {institution}, and this fills them in.
 *
 * The hard part is the empty case: if someone blanks the assistant, a template
 * that reads "...assistance from {assistant}." must collapse to a clean
 * "...assistance." — not "...assistance from ." So when assistant is empty we
 * drop the common connective patterns ("from/by/with {assistant}", "({assistant})")
 * before the plain replace. That lets a fork remove the brand with one config edit
 * and no broken grammar.
 */
export function fillDisclosureTokens(template, { institution = '', assistant = '' } = {}) {
  let out = String(template == null ? '' : template).replaceAll('{institution}', institution)

  if (assistant) {
    out = out.replaceAll('{assistant}', assistant)
  } else {
    out = out
      .replace(/\s*\(\s*\{assistant\}\s*\)/g, '')            // " ({assistant})" -> ""
      .replace(/\s+(?:from|by|with)\s+\{assistant\}/gi, '')  // " from {assistant}" -> ""
      .replaceAll('{assistant}', '')                          // any stragglers
  }

  return out
}
