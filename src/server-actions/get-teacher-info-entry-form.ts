'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { teacher, teachersQualification } from '@/schema/drizzle/schema'
import { TeacherEntrySchemaType } from '@/schema/entry-form/teacher'
import { ServerMessageGETType } from '@/types/server-message'
import { eq, sql } from 'drizzle-orm'
import { orderBy } from 'lodash'
import * as z from 'zod'

export default async function getTeacherInfoEntryForm (
  teacherId: string
): Promise<ServerMessageGETType<TeacherEntrySchemaType>> {
  try {
    const teacherInfo = await drizzle_orm
      .select({
        teacherId: teacher.teacherId,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        address: teacher.address,
        salary: teacher.salary,
        dob: teacher.dob,
        membershipStatus: teacher.membershipStatus,
        sex: teacher.sex,
        primaryLanguage: teacher.primaryLanguage,
        qualifications: sql<TeacherEntrySchemaType['qualifications']>`
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'courseType', ${teachersQualification.courseType},
                'courseName', ${teachersQualification.courseName},
                'collegeName', ${teachersQualification.collegeName},
                'major', ${teachersQualification.major},
                'startDate', ${teachersQualification.startDate},
                'endDate', ${teachersQualification.endDate}
              )
            )
          `
      })
      .from(teacher)
      .innerJoin(
        teachersQualification,
        eq(teachersQualification.teacherId, teacher.teacherId)
      )
      .where(eq(teacher.teacherId, teacherId))

    let teacherInfoObj = teacherInfo[0] || null

    if (!teacherInfoObj) {
      return {
        status: 'error',
        heading: 'No Teacher Found',
        description: 'No teacher found with this id'
      }
    } else {
      teacherInfoObj.qualifications = orderBy(
        teacherInfoObj.qualifications,
        'start_date'
      )

      return {
        status: 'success',
        heading: 'Teacher Info',
        description: 'Teacher info fetched successfully',
        // @ts-ignore
        result: teacherInfoObj
      }
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
