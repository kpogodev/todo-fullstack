import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import prismaClientPlugin from './plugins/prismaClientPlugin'
import customErrors from './plugins/customErrors'
import todosRoutes from './routes/todos'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

// Define the port and host
const PORT = process.env.API_PORT || 5000
const HOST = process.env.API_HOST || '0.0.0.0'

// Create the Fastify instance
const app = fastify({ logger: true })

// Apply Zod type provider
app.withTypeProvider<ZodTypeProvider>()

// Register core plugins
app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Register custom plugins
app.register(prismaClientPlugin)
app.register(customErrors)

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
