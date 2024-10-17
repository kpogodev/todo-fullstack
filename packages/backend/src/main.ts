// Import Fastify and fastify-cors
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'

// Define the port and host
const PORT = process.env.API_PORT || 5000
const HOST = process.env.API_HOST || '0.0.0.0'

// Create Fastify instance
const app = fastify({ logger: true })

// Register fastify-cors with options
app.register(fastifyCors, {
  origin: '*',
})

// Define a route
app.get('/', async (_, res) => {
  return res.send({ hello: 'world' })
})

// Start the server
app.listen({ port: +PORT, host: HOST }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
})
