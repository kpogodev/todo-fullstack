import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { todosHandlers } from '../handlers/todos'
import { todoSchema, createTodoSchema, updateTodoSchema, todoParamsSchema, todosSchema } from '../dto/todos'

import type { FastifyInstance } from 'fastify'

// Group all the routes related to todos
const todosRoutes: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url: '/',
    handler: todosHandlers.getTodos,
    schema: {
      response: {
        200: todosSchema,
      },
    },
  })
  app.route({
    method: 'GET',
    url: '/:id',
    handler: todosHandlers.getTodoById,
    schema: {
      params: todoParamsSchema,
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
      body: createTodoSchema,
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
      params: todoParamsSchema,
      body: updateTodoSchema,
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
      params: todoParamsSchema,
    },
  })
}

export default todosRoutes
