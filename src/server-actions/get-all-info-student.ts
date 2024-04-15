'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { parent, student } from '@/schema/drizzle/schema'
import { ServerMessageGETType } from '@/types/server-message'
import { auth } from '@clerk/nextjs'
import { eq, sql } from 'drizzle-orm'

type StudentFullInfo = {
  createdAt: string
  studentId: string
  firstName: string
  lastName: string
  dob: string
  email: string | null
  phoneNumber: string
  aadharNumber: string
  address: string | null
  sex: string
  primaryLanguage: string
  membershipStatus: string
  parentalInfo: {
    parentId: string
    relation: string
    phoneNumber: string
    firstName: string
    lastName: string
    email: string | null
  }[]
}

export default async function getFullInfoStudent (
  student_id: string
): Promise<ServerMessageGETType<StudentFullInfo[]>> {
  const { userId } = auth()
  try {
    if (userId) {
      const data = await drizzle_orm
        .select({
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          dob: student.dob,
          email: student.email,
          phoneNumber: student.phoneNumber,
          aadharNumber: student.aadharNumber,
          address: student.address,
          sex: student.sex,
          primaryLanguage: student.primaryLanguage,
          membershipStatus: student.membershipStatus,
          createdAt: student.createdAt,
          parentalInfo: sql<
            StudentFullInfo['parentalInfo']
          >`JSON_ARRAYAGG(JSON_OBJECT(
            'parentId', ${parent.parentId},
            'relation', ${parent.relation},
            'phoneNumber', ${parent.phoneNumber},
            'firstName', ${parent.firstName},
            'lastName', ${parent.lastName},
            'email', ${parent.email}
          ))`
        })
        .from(student)
        .innerJoin(parent, eq(student.studentId, parent.studentId))
        .where(eq(student.studentId, student_id))
        .groupBy(student.studentId)

      return {
        status: 'success',
        heading: 'Student Info',
        description: 'Student info has been fetched successfully',
        result: data
      }
    } else {
      return {
        status: 'error',
        heading: 'Error',
        description: 'User not authenticated'
      }
    }
  } catch (error) {
    console.log(error)
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
