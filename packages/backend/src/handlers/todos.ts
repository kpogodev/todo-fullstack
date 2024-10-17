import type { FastifyRequest, FastifyReply } from 'fastify'
import type { TodoDTO } from '../dto/todo'
import { Prisma } from '@prisma/client'

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
      Params: Pick<TodoDTO, 'id'>
    }>,
    res: FastifyReply,
  ) => {
    try {
      const todo = await req.server.prisma.todo.findUnique({ where: { id: req.params.id } })

      if (!todo) return res.status(404).send({ message: `Todo with id: ${req.params.id} not found` })

      return res.status(200).send(todo)
    } catch (error) {
      req.server.log.error(error)
      return res.status(500).send({ message: 'An error occurred while fetching todo' })
    }
  },
  // @ POST /todos
  // @desc Create a new todo
  // @access Public (for the scope of this task)
  createTodo: async (
    req: FastifyRequest<{
      Body: Pick<TodoDTO, 'title' | 'description'>
    }>,
    res: FastifyReply,
  ) => {
    try {
      const { title, description } = req.body

      const newTodo = await req.server.prisma.todo.create({
        data: { title, description },
      })

      return res.status(201).send(newTodo)
    } catch (error) {
      req.server.log.error(error)

      // P2002 error code corresponds to "Unique constraint failed on the constraint."
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(400).send({ message: 'Todo with the same title already exists' })
      }
      return res.status(500).send({ message: 'An error occurred while creating todo' })
    }
  },
  // @ PUT /todos/:id
  // @desc Update a todo by ID
  // @access Public (for the scope of this task)
  updateTodo: async (
    req: FastifyRequest<{
      Params: Pick<TodoDTO, 'id'>
      Body: Partial<Pick<TodoDTO, 'title' | 'description' | 'completed'>>
    }>,
    res: FastifyReply,
  ) => {
    try {
      const { id } = req.params
      const { title, description, completed } = req.body

      // Update the todo in the database using Prisma's update method
      const updatedTodo = await req.server.prisma.todo.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { completed }),
        },
      })

      return res.status(200).send(updatedTodo)
    } catch (error) {
      req.server.log.error(error)

      // P2025 error code corresponds to "Record to update not found."
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).send({ message: 'Todo not found' })
      }

      // P2002 error code corresponds to "Unique constraint failed on the constraint."
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(400).send({ message: 'Todo with the same title already exists' })
      }
      return res.status(500).send({ message: 'An error occurred while updating todo' })
    }
  },
}
