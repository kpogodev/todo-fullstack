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

export type TodoDTO = z.infer<typeof todoSchema>
