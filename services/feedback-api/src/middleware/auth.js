// Two-key model. The WRITE key is public by design — the SPA ships it to every
// browser in config.json (meta.feedback.api_key) — so it only deters drive-by
// spam. The ADMIN key guards reading feedback back (it includes contact PII)
// and must stay server-side. The admin key is also accepted for writes.
export function requireWriteKey(request, reply, done) {
  const apiKey = request.headers['x-api-key']
  const writeKey = process.env.API_KEY_WRITE
  const adminKey = process.env.API_KEY_ADMIN

  if (!apiKey || (apiKey !== writeKey && apiKey !== adminKey)) {
    reply.code(401).send({ error: 'Invalid API key' })
    return
  }
  done()
}

export function requireAdminKey(request, reply, done) {
  const apiKey = request.headers['x-api-key']
  const adminKey = process.env.API_KEY_ADMIN

  if (!apiKey || apiKey !== adminKey) {
    reply.code(401).send({ error: 'Admin access required' })
    return
  }
  done()
}
