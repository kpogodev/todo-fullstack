import type { FastifyInstance } from 'fastify'
import { todosHandlers } from '../handlers/todos'

const todosRoutes = async (app: FastifyInstance) => {
  app.get('/', { handler: todosHandlers.getTodos })
}

export default todosRoutes
