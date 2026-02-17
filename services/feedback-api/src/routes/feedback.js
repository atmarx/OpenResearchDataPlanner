import { requireWriteKey, requireAdminKey } from '../middleware/auth.js'

export default async function feedbackRoutes(fastify) {
  // POST /api/v1/feedback — submit feedback (write key)
  fastify.post('/feedback', {
    preHandler: requireWriteKey,
    schema: {
      body: {
        type: 'object',
        required: ['page', 'sentiment'],
        properties: {
          page: { type: 'string', maxLength: 500 },
          sentiment: { type: 'string', enum: ['up', 'down'] },
          comment: { type: 'string', maxLength: 2000 },
          contact_name: { type: 'string', maxLength: 200 },
          contact_email: { type: 'string', maxLength: 200 },
          metadata: { type: 'object', additionalProperties: true }
        }
      }
    }
  }, async (request, reply) => {
    const { page, sentiment, comment, contact_name, contact_email, metadata } = request.body
    const userAgent = request.headers['user-agent'] || null

    const stmt = fastify.db.prepare(`
      INSERT INTO feedback (page, sentiment, comment, contact_name, contact_email, metadata, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      page,
      sentiment,
      comment || null,
      contact_name || null,
      contact_email || null,
      metadata ? JSON.stringify(metadata) : null,
      userAgent
    )

    reply.code(201).send({ id: Number(result.lastInsertRowid) })
  })

  // GET /api/v1/feedback — list feedback (admin key)
  fastify.get('/feedback', { preHandler: requireAdminKey }, async (request) => {
    const { page, sentiment, limit = '50', offset = '0', sort = 'newest' } = request.query
    const safeLimit = Math.min(parseInt(limit) || 50, 200)
    const safeOffset = parseInt(offset) || 0
    const orderDir = sort === 'oldest' ? 'ASC' : 'DESC'

    const conditions = []
    const params = []

    if (page) {
      conditions.push('page = ?')
      params.push(page)
    }
    if (sentiment) {
      conditions.push('sentiment = ?')
      params.push(sentiment)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const data = fastify.db.prepare(
      `SELECT * FROM feedback ${whereClause} ORDER BY created_at ${orderDir} LIMIT ? OFFSET ?`
    ).all(...params, safeLimit, safeOffset)

    // Parse metadata JSON back to objects
    const parsed = data.map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : null
    }))

    const total = fastify.db.prepare(
      `SELECT COUNT(*) as count FROM feedback ${whereClause}`
    ).get(...params).count

    return { data: parsed, total, limit: safeLimit, offset: safeOffset }
  })

  // GET /api/v1/feedback/stats — aggregate stats (admin key)
  fastify.get('/feedback/stats', { preHandler: requireAdminKey }, async (request) => {
    const { since } = request.query
    const sinceClause = since ? 'WHERE created_at >= ?' : ''
    const sinceParams = since ? [since] : []

    const total = fastify.db.prepare(
      `SELECT COUNT(*) as count FROM feedback ${sinceClause}`
    ).get(...sinceParams).count

    const bySentiment = fastify.db.prepare(
      `SELECT sentiment, COUNT(*) as count FROM feedback ${sinceClause} GROUP BY sentiment`
    ).all(...sinceParams)

    const byPage = fastify.db.prepare(
      `SELECT page,
              SUM(CASE WHEN sentiment = 'up' THEN 1 ELSE 0 END) as up,
              SUM(CASE WHEN sentiment = 'down' THEN 1 ELSE 0 END) as down,
              COUNT(*) as total
       FROM feedback ${sinceClause}
       GROUP BY page ORDER BY total DESC LIMIT 50`
    ).all(...sinceParams)

    const recent = fastify.db.prepare(
      `SELECT * FROM feedback ${sinceClause} ORDER BY created_at DESC LIMIT 10`
    ).all(...sinceParams)

    const recentParsed = recent.map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : null
    }))

    return {
      total,
      by_sentiment: Object.fromEntries(bySentiment.map(r => [r.sentiment, r.count])),
      by_page: byPage,
      recent: recentParsed
    }
  })
}
