import * as z from 'zod'

export const groupEntrySchema = z.object({
  name: z
    .string({
      required_error: 'Group name is required'
    })
    .min(1, {
      message: 'Group name is required'
    }),
  other: z.string().optional()
})

export type GroupEntrySchemaType = z.infer<typeof groupEntrySchema>
