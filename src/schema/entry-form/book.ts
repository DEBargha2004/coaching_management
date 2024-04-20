import * as z from 'zod'

export const bookEntrySchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  group: z.string({
    required_error: 'Group is required'
  }),
  other: z.string().optional()
})

export type BookEntrySchemaType = z.infer<typeof bookEntrySchema>
