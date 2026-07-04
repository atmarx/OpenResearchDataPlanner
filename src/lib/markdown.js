import { marked } from 'marked'

// Canonical markdown -> HTML for user-facing prose across the app.
//
// One place, so **bold**, links, lists, and code render the same everywhere.
// This logic used to be re-implemented per view (TierQuestionnaire had its own
// renderMarkdown; GetHelpModal hand-rolled a regex that only knew ** and \n)
// and was skipped entirely in the Glossary and a couple of accordions, which
// is why raw markdown leaked through in some places but not others.
//
// breaks: true keeps a single newline as <br>, matching how the YAML content
// is authored (line breaks in definitions/answers are meaningful).
//
// Content is app-authored config (trusted), rendered via v-html downstream —
// same trust boundary the rest of the app already relies on. Do not feed
// untrusted input through this without sanitizing.

export function renderMarkdown(content) {
  if (!content) return ''
  return marked.parse(String(content), { breaks: true })
}

// Inline variant: no wrapping <p>, for a one-line summary that sits inside an
// existing text element (e.g. a glossary term's short definition).
export function renderMarkdownInline(content) {
  if (!content) return ''
  return marked.parseInline(String(content), { breaks: true })
}
