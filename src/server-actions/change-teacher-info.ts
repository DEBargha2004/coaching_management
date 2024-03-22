'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { teacher } from '@/schema/drizzle/schema'
import { teacherEntrySchema } from '@/schema/entry-form/teacher'
import { ServerMessagePOSTType } from '@/types/server-message'
import { format } from 'date-fns'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import changeTeacherStay from './change-teacher-stay'
import { teachers_index } from '@/lib/algolia'

export default async function changeTeacherInfo ({
  teacher_id,
  data
}: {
  teacher_id: string
  data: Partial<z.infer<typeof teacherEntrySchema>>
}): Promise<ServerMessagePOSTType<typeof data>> {
  try {
    const { success } = teacherEntrySchema.safeParse(data)
    console.log('success is', success)

    if (data.dob) {
      data.dob = data.dob ? format(new Date(data.dob), 'yyyy-MM-dd') : ''
    }
    const teacher_update = await drizzle_orm
      .update(teacher)
      .set(data)
      .where(eq(teacher.teacherId, teacher_id))
    console.log(teacher_update)

    if (data.membershipStatus) {
      const server_message = await changeTeacherStay({
        teacher_id,
        date: format(new Date(), 'yyyy-MM-dd'),
        membership_status: data.membershipStatus
      })
      if (server_message.status === 'success') {
        await teachers_index.partialUpdateObject({
          objectID: teacher_id.replace('teach_', ''),
          ...data
        })
        return {
          status: 'success',
          heading: 'Teacher Info Updated',
          description: 'Teacher info has been updated successfully',
          result: { ...data }
        }
      } else {
        await teachers_index.partialUpdateObject({
          objectID: teacher_id.replace('teach_', ''),
          ...data,
          ...(server_message.result
            ? { membership_status: server_message.result }
            : {})
        })
        return {
          status: 'success',
          heading: 'Teacher Info Updated',
          description: 'Teacher info has been updated successfully',
          result: {
            ...data,
            ...(server_message.result
              ? { membership_status: server_message.result }
              : {})
          }
        }
      }
    } else {
      await teachers_index.partialUpdateObject({
        objectID: teacher_id.replace('teach_', ''),
        ...data
      })
      return {
        status: 'success',
        heading: 'Teacher Info Updated',
        description: 'Teacher info has been updated successfully',
        result: { ...data }
      }
    }
  } catch (error) {
    console.log(error)

    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong.Please try again later',
      result: {}
    }
  }
}
