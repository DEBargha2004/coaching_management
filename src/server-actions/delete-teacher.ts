'use server'

import { teachers_index } from '@/lib/algolia'
import { drizzle_orm } from '@/lib/drizzle'
import { teacher, teacherStayDuration } from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { format } from 'date-fns'
import { and, eq, isNull } from 'drizzle-orm'

export default async function removeTeacher (
  id: string
): Promise<ServerMessagePOSTType> {
  try {
    await drizzle_orm
      .delete(teacherStayDuration)
      .where(eq(teacherStayDuration.teacherId, id))
    const res = await drizzle_orm
      .delete(teacher)
      .where(eq(teacher.teacherId, id))
    await teachers_index.deleteObject(id.replace('teach_', ''))
    return {
      status: 'success',
      heading: 'Teacher Deleted',
      description: 'Teacher data has been deleted successfully'
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
