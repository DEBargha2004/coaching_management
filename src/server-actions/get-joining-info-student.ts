'use server'

import { drizzle_orm } from '@/lib/drizzle'
import {
  studentStayDuration,
  teacherStayDuration
} from '@/schema/drizzle/schema'
import { ServerMessageGETType } from '@/types/server-message'
import { eq } from 'drizzle-orm'

type StudentJoiningInfo = {
  createdAt: string
  studentId: string
  stayId: string
  joiningDate: string
  leavingDate: string | null
}[]

export default async function getJoiningInfoStudent (
  student_id: string
): Promise<ServerMessageGETType<StudentJoiningInfo>> {
  try {
    const studentJoiningInfo = await drizzle_orm
      .select()
      .from(studentStayDuration)
      .where(eq(studentStayDuration.studentId, student_id))
      .orderBy(studentStayDuration.joiningDate)
    return {
      status: 'success',
      heading: 'Teacher Joining Info',
      result: studentJoiningInfo
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
