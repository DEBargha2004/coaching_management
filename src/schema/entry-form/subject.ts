import * as z from 'zod'

export const subjectEntrySchema = z.object({
  subject_name: z.string({
    required_error: 'Subject name is required'
  })
})

export type SubjectEntrySchemaType = z.infer<typeof subjectEntrySchema>
