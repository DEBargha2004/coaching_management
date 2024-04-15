'use server'

import { studentsLimitBoard } from '@/constants/student-board'
import { students_index } from '@/lib/algolia'
import { drizzle_orm } from '@/lib/drizzle'
import { student, teacher } from '@/schema/drizzle/schema'
import { StudentTypeBoard } from '@/store/students-store'
import { count } from 'drizzle-orm'

export const getStudents = async ({
  search,
  offset
}: {
  search: string
  offset?: number
}): Promise<StudentTypeBoard[]> => {
  const students = await (search
    ? students_index
        .search<StudentTypeBoard>(search, {
          hitsPerPage: studentsLimitBoard,
          ...(offset ? { offset } : {})
        })
        .then(({ hits }) => hits)
    : drizzle_orm
        .select({
          first_name: student.firstName,
          last_name: student.lastName,
          phone_number: student.phoneNumber,
          address: student.address,
          student_id: student.studentId,
          email: student.email,
          membership_status: student.membershipStatus,
          aadhar_number: student.aadharNumber
        })
        .from(student)
        .orderBy(student.firstName)
        .limit(studentsLimitBoard)
        .offset(offset || 0))

  return students
}

export const getStudentsCount = async (): Promise<{ count: number }[]> => {
  const studentsCount = await drizzle_orm
    .select({ count: count(student.studentId) })
    .from(student)
  return studentsCount
}
