import * as z from 'zod'

export const batchEntrySchema = z.object({
    batch_name: z.string({
        required_error: 'Batch name is required'
    }).min(1,{
        message: 'Batch name is required'
    }),
    description: z.string().optional(),
    medium: z.string().optional(),
    group_id: z.string({
        required_error: 'Group is required'
    })
})


export type BatchEntrySchemaType = z.infer<typeof batchEntrySchema>