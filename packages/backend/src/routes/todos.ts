import { z } from 'zod'
import { todosHandlers } from '../handlers/todos'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { todoSchema } from '../dto/todo'
import type { FastifyInstance } from 'fastify'

const todosRoutes: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url: '/',
    handler: todosHandlers.getTodos,
    schema: {
      response: {
        200: z.array(todoSchema),
      },
    },
  })
  app.route({
    method: 'GET',
    url: '/:id',
    handler: todosHandlers.getTodoById,
    schema: {
      params: todoSchema.pick({ id: true }),
      response: {
        200: todoSchema,
      },
    },
  })
  app.route({
    method: 'POST',
    url: '/',
    handler: todosHandlers.createTodo,
    schema: {
      body: todoSchema.pick({ title: true, description: true }),
      response: {
        201: todoSchema,
      },
    },
  })
  app.route({
    method: 'PUT',
    url: '/:id',
    handler: todosHandlers.updateTodo,
    schema: {
      params: todoSchema.pick({ id: true }),
      body: todoSchema.pick({ title: true, description: true, completed: true }).partial(),
      response: {
        200: todoSchema,
      },
    },
  })
  app.route({
    method: 'DELETE',
    url: '/:id',
    handler: todosHandlers.deleteTodo,
    schema: {
      params: todoSchema.pick({ id: true }),
    },
  })
}

export default todosRoutes
