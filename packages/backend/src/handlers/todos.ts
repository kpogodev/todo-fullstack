import type { FastifyRequest, FastifyReply } from 'fastify'

type ParamId = { id: string }

export const todosHandlers = {
  // @ GET /todos
  // @desc Get all todos
  // @access Public
  getTodos: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const todos = await req.server.prisma.todo.findMany()

      if (!todos || !todos.length) return res.status(404).send({ message: 'No todos found' })

      return res.status(200).send(todos)
    } catch (error) {
      req.server.log.error(error)
      return res.status(500).send({ message: 'An error occurred while fetching todos' })
    }
  },
  // @ GET /todos/:id
  // @desc Get todo by ID
  // @access Public
  getTodoById: async (
    req: FastifyRequest<{
      Params: ParamId
    }>,
    res: FastifyReply,
  ) => {
    try {
      const todoId = req.params.id
      if (!todoId) return res.status(400).send({ message: 'Todo ID is required' })

      const todo = await req.server.prisma.todo.findUnique({ where: { id: todoId } })

      if (!todo) return res.status(404).send({ message: `Todo with id: ${todoId} not found` })

      return res.status(200).send(todo)
    } catch (error) {
      req.server.log.error(error)
      return res.status(500).send({ message: 'An error occurred while fetching todo' })
    }
  },
}
