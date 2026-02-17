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
