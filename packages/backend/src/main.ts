import fastify from 'fastify'
import fastifyCors from '@fastify/cors'

import prismaClientPlugin from './plugins/prismaClientPlugin'
import todosRoutes from './routes/todos'

// Define the port and host
const PORT = process.env.API_PORT || 5000
const HOST = process.env.API_HOST || '0.0.0.0'

// Create the Fastify instance
const app = fastify({ logger: true })

// Register core plugins
app.register(fastifyCors, {
  origin: '*',
})

// Register custom plugins
app.register(prismaClientPlugin)

// Regiser a routes
app.register(todosRoutes, { prefix: '/api/todos' })

// Start the server
app.listen({ port: +PORT, host: HOST }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
})
