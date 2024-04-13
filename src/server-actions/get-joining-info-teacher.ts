'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { teacherStayDuration } from '@/schema/drizzle/schema'
import { ServerMessageGETType } from '@/types/server-message'
import { eq } from 'drizzle-orm'

type TeacherJoiningInfo = {
  createdAt: string
  teacherId: string
  stayId: string
  joiningDate: string
  leavingDate: string | null
}[]

export default async function getJoiningInfoTeacher (
  teacher_id: string
): Promise<ServerMessageGETType<TeacherJoiningInfo>> {
  try {
    const teacherJoiningInfo = await drizzle_orm
      .select()
      .from(teacherStayDuration)
      .where(eq(teacherStayDuration.teacherId, teacher_id))
      .orderBy(teacherStayDuration.joiningDate)
    return {
      status: 'success',
      heading: 'Teacher Joining Info',
      result: teacherJoiningInfo
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
