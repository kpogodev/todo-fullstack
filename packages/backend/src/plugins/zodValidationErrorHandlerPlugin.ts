import fp from 'fastify-plugin'
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod'

import type { FastifyPluginAsync } from 'fastify'

const zodValidationErrorHandlerPlugin: FastifyPluginAsync = fp(async (app) => {
  app.setErrorHandler((error, req, res) => {
    // Check for request validation error
    if (hasZodFastifySchemaValidationErrors(error)) {
      return res.status(400).send({
        error: 'Request Validation Error',
        message: error.validation.map((issue) => issue.message).join(', '),
        statusCode: 400,
        details: {
          issues: error.validation,
          method: req.method,
          url: req.url,
        },
      })
    }

    // Check for response serialization error
    if (isResponseSerializationError(error)) {
      return res.status(500).send({
        error: 'Internal Server Error',
        message: "Response doesn't match the schema",
        statusCode: 500,
        details: {
          issues: error.cause.issues,
          method: error.method,
          url: error.url,
        },
      })
    }

    // Fallback to the default error handler for other cases
    return res.status(error.statusCode || 500).send({
      error: error.name || 'Internal Server Error',
      message: error.message,
      statusCode: error.statusCode || 500,
    })
  })
})

export default zodValidationErrorHandlerPlugin
