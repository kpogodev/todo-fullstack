import type { FastifyRequest, FastifyReply } from 'fastify'
import type { CreateTodoDTO, TodoParamsDTO, UpdateTodoDTO, TodosDTO, TodoDTO } from '../dto/todos'

export const todosHandlers = {
  // @ GET /todos
  // @desc Get all todos
  // @access Public
  getTodos: async (req: FastifyRequest, res: FastifyReply): Promise<TodosDTO> => {
    try {
      const todos = await req.server.prisma.todo.findMany()

      return res.status(200).send(todos)
    } catch (error) {
      req.server.log.error(error)
      throw error
    }
  },
  // @ GET /todos/:id
  // @desc Get todo by ID
  // @access Public
  getTodoById: async (req: FastifyRequest<{ Params: TodoParamsDTO }>, res: FastifyReply): Promise<TodoDTO> => {
    try {
      const todo = await req.server.prisma.todo.findUniqueOrThrow({ where: { id: req.params.id } })

      return res.status(200).send(todo)
    } catch (error) {
      req.server.log.error(error)
      throw error
    }
  },
  // @ POST /todos
  // @desc Create a new todo
  // @access Public (for the scope of this task)
  createTodo: async (req: FastifyRequest<{ Body: CreateTodoDTO }>, res: FastifyReply): Promise<TodoDTO> => {
    try {
      const { title, description } = req.body

      const newTodo = await req.server.prisma.todo.create({
        data: { title, description },
      })

      return res.status(201).send(newTodo)
    } catch (error) {
      req.server.log.error(error)
      throw error
    }
  },
  // @ PUT /todos/:id
  // @desc Update a todo by ID
  // @access Public (for the scope of this task)
  updateTodo: async (
    req: FastifyRequest<{ Params: TodoParamsDTO; Body: UpdateTodoDTO }>,
    res: FastifyReply,
  ): Promise<TodoDTO> => {
    try {
      const { title, description, completed } = req.body

      const updatedTodo = await req.server.prisma.todo.update({
        where: { id: req.params.id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { completed }),
        },
      })

      return res.status(200).send(updatedTodo)
    } catch (error) {
      req.server.log.error(error)
      throw error
    }
  },
  // @ DELETE /todos/:id
  // @desc Delete a todo by ID
  // @access Public (for the scope of this task)
  deleteTodo: async (req: FastifyRequest<{ Params: TodoParamsDTO }>, res: FastifyReply): Promise<void> => {
    try {
      await req.server.prisma.todo.delete({ where: { id: req.params.id } })

      return res.status(204).send()
    } catch (error) {
      req.server.log.error(error)
      throw error
    }
  },
}
