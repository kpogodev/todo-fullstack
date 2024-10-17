import type { FastifyRequest, FastifyReply } from 'fastify'

const DEFAULT_SRV_ERR_MSG = 'An error occurred while fetching todos'

export const todosHandlers = {
  getTodos: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const todos = await req.server.prisma.todo.findMany()

      if (!todos || !todos.length) return res.status(404).send({ message: 'No todos found' })

      return res.status(200).send(todos)
    } catch (error) {
      req.server.log.error(error)
      return res.status(500).send({ message: DEFAULT_SRV_ERR_MSG })
    }
  },
}
