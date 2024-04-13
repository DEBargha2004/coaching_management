'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { teachersQualification } from '@/schema/drizzle/schema'
import { ServerMessageGETType } from '@/types/server-message'
import { eq } from 'drizzle-orm'

type Qualification = {
  qualification_id: string
  course_type: string
  course_name: string
  college_name: string
  major: string | null
  start_date: string
  end_date: string
}

export const getTeacherQualifications = async (
  teacher_id: string
): Promise<ServerMessageGETType<Qualification[]>> => {
  if (!teacher_id)
    return {
      status: 'error',
      heading: 'Id not found',
      description: 'Teacher Id was not passed in'
    }

  try {
    const qualifications: Qualification[] = await drizzle_orm
      .select({
        qualification_id: teachersQualification.qualificationId,
        course_type: teachersQualification.courseType,
        course_name: teachersQualification.courseName,
        college_name: teachersQualification.collegeName,
        major: teachersQualification.major,
        start_date: teachersQualification.startDate,
        end_date: teachersQualification.endDate
      })
      .from(teachersQualification)
      .where(eq(teachersQualification.teacherId, teacher_id))
      .orderBy(teachersQualification.startDate)

    return {
      status: 'success',
      heading: 'Qualifications',
      description: 'Qualifications fetched successfully',
      result: qualifications
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
