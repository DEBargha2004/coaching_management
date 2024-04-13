'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { student, teacher } from '@/schema/drizzle/schema'
import { teacherEntrySchema } from '@/schema/entry-form/teacher'
import { ServerMessagePOSTType } from '@/types/server-message'
import { format } from 'date-fns'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import changeTeacherStay from './change-teacher-stay'
import { students_index, teachers_index } from '@/lib/algolia'
import { studentEntrySchema } from '@/schema/entry-form/student'
import changeStudentStay from './change-student-stay'

export default async function changeStudentInfo ({
  student_id,
  data
}: {
  student_id: string
  data: Partial<z.infer<typeof studentEntrySchema>>
}): Promise<ServerMessagePOSTType<typeof data>> {
  try {
    if (data.dob) {
      data.dob = data.dob ? format(new Date(data.dob), 'yyyy-MM-dd') : ''
    }
    const student_update = await drizzle_orm
      .update(student)
      .set(data)
      .where(eq(student.studentId, student_id))

    if (data.membershipStatus) {
      const server_message = await changeStudentStay({
        student_id,
        date: format(new Date(), 'yyyy-MM-dd'),
        membership_status: data.membershipStatus
      })
      if (server_message.status === 'success') {
        await students_index.partialUpdateObject({
          objectID: student_id.replace('stud_', ''),
          ...data
        })
        return {
          status: 'success',
          heading: 'Student Info Updated',
          description: 'Student info has been updated successfully',
          result: { ...data }
        }
      } else {
        await students_index.partialUpdateObject({
          objectID: student_id.replace('stud_', ''),
          ...data,
          ...(server_message.result
            ? { membership_status: server_message.result }
            : {})
        })
        return {
          status: 'success',
          heading: 'Student Info Updated',
          description: 'Student info has been updated successfully',
          result: {
            ...data,
            ...(server_message.result
              ? { membership_status: server_message.result }
              : {})
          }
        }
      }
    } else {
      await students_index.partialUpdateObject({
        objectID: student_id.replace('stud_', ''),
        ...data
      })
      return {
        status: 'success',
        heading: 'Student Info Updated',
        description: 'Student info has been updated successfully',
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
