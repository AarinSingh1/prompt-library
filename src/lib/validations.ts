import { z } from 'zod'

export const promptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  description: z.string().max(300).optional(),
  folderId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
})

export type PromptFormData = z.infer<typeof promptSchema>
