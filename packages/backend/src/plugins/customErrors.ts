import fp from 'fastify-plugin'
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod'
import { Prisma } from '@prisma/client'

import type { FastifyPluginAsync } from 'fastify'

const customErrors: FastifyPluginAsync = fp(async (app) => {
  app.setErrorHandler((error, _, res) => {
    // Check for request validation error
    if (hasZodFastifySchemaValidationErrors(error)) {
      return res.status(400).send({
        error: 'Request Validation Error',
        message: error.validation.map((issue) => issue.message).join(', '),
        statusCode: 400,
      })
    }

    // Check for Prisma known request error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 error code corresponds to "Record to update not found."
      if (error.code === 'P2025') {
        return res.status(404).send({
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        })
      }

      // P2002 error code corresponds to "Unique constraint failed on the constraint."
      if (error.code === 'P2002') {
        return res.status(400).send({
          error: 'Bad Request',
          message: 'Todo with the same title already exists',
          statusCode: 400,
        })
      }
    }

    // Check for response serialization error
    if (isResponseSerializationError(error)) {
      return res.status(500).send({
        error: 'Internal Server Error',
        message: "Response doesn't match the schema",
        statusCode: 500,
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

export default customErrors
