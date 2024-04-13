'use server'

import { students_index } from '@/lib/algolia'
import { drizzle_orm } from '@/lib/drizzle'
import {
  parent,
  student,
  studentStayDuration,
  teacher,
  teacherStayDuration
} from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { format } from 'date-fns'
import { and, eq, isNull } from 'drizzle-orm'

export default async function deleteStudent (
  id: string
): Promise<ServerMessagePOSTType> {
  try {
    //delete stays from db
    await drizzle_orm
      .delete(studentStayDuration)
      .where(eq(studentStayDuration.studentId, id))
    //delete parent from db
    await drizzle_orm.delete(parent).where(eq(parent.studentId, id))
    //delete from db
    await drizzle_orm.delete(student).where(eq(student.studentId, id))
    //delete from algolia
    await students_index.deleteObject(id.replace('stud_', ''))
    return {
      status: 'success',
      heading: 'Student Deleted',
      description: 'Student data has been deleted successfully'
    }
  } catch (error) {
    console.log(error)

    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong.Please try again later'
    }
  }
}
