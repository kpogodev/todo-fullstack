import { z } from 'zod'

export const todoSchema = z.object({
  id: z.string().cuid('ID must be a valid CUID'),
  title: z
    .string()
    .min(1, 'Title must be at least 1 character long')
    .max(255, 'Title must be at most 255 characters long'),
  description: z.string().nullish(),
  completed: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const todosSchema = z.array(todoSchema)
export const createTodoSchema = todoSchema.pick({ title: true, description: true })
export const updateTodoSchema = todoSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()

export const todoParamsSchema = todoSchema.pick({ id: true })

export type TodoDTO = z.infer<typeof todoSchema>
export type TodosDTO = z.infer<typeof todosSchema>
export type CreateTodoDTO = z.infer<typeof createTodoSchema>
export type UpdateTodoDTO = z.infer<typeof updateTodoSchema>
export type TodoParamsDTO = z.infer<typeof todoParamsSchema>
