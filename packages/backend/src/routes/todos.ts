import type { FastifyInstance } from 'fastify'
import { todosHandlers } from '../handlers/todos'

const todosRoutes = async (app: FastifyInstance) => {
  app.get('/', { handler: todosHandlers.getTodos })
  app.get('/:id', { handler: todosHandlers.getTodoById })
}

export default todosRoutes
