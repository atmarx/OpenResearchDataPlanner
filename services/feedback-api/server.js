import Fastify from 'fastify'
import cors from '@fastify/cors'
import { initDb } from './src/db.js'
import feedbackRoutes from './src/routes/feedback.js'

const fastify = Fastify({ logger: true })

// CORS
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  methods: ['GET', 'POST', 'OPTIONS']
})

// SQLite
const db = initDb(process.env.DB_PATH || './data/feedback.db')
fastify.decorate('db', db)

// Graceful shutdown
fastify.addHook('onClose', () => {
  db.close()
})

// Routes
fastify.register(feedbackRoutes, { prefix: '/api/v1' })

// Health check
fastify.get('/health', async () => ({ status: 'ok' }))

// Start
const port = parseInt(process.env.PORT || '4001')
await fastify.listen({ port, host: '0.0.0.0' })
