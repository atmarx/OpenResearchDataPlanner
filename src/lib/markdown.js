import { marked } from 'marked'

// Canonical markdown -> HTML for user-facing prose across the app.
//
// One place, so **bold**, links, lists, and code render the same everywhere.
// This logic used to be re-implemented per view (TierQuestionnaire had its own
// renderMarkdown; GetHelpModal hand-rolled a regex that only knew ** and \n)
// and was skipped entirely in the Glossary and a couple of accordions, which
// is why raw markdown leaked through in some places but not others.
//
// breaks: false — a single newline is a space, a blank line starts a paragraph.
// The content lives in YAML block scalars that hard-wrap at ~72 columns for the
// sake of the editor; with breaks: true every one of those wraps rendered as a
// visible <br>, so prose came out shredded into a ragged column. Authors can now
// wrap freely (one sentence per line is the nice way) without it leaking to the
// page. Anything that really is a list must be written as a markdown list.
//
// Content is app-authored config (trusted), rendered via v-html downstream —
// same trust boundary the rest of the app already relies on. Do not feed
// untrusted input through this without sanitizing.

export function renderMarkdown(content) {
  if (!content) return ''
  return marked.parse(String(content), { breaks: false })
}

// Inline variant: no wrapping <p>, for a one-line summary that sits inside an
// existing text element (e.g. a glossary term's short definition).
export function renderMarkdownInline(content) {
  if (!content) return ''
  return marked.parseInline(String(content), { breaks: false })
}
