'use server'

import { teachers_index } from '@/lib/algolia'
import { drizzle_orm } from '@/lib/drizzle'
import { teacher } from '@/schema/drizzle/schema'
import { TeacherTypeBoard } from '@/store/teachers-store'
import { asc, desc, eq, or, lte } from 'drizzle-orm'

const getOrderByParam = (sortParam?: string) => {
  switch (sortParam) {
    case 'first_name':
      return asc(teacher.firstName)
    case 'salary':
      return asc(teacher.salary)
    default:
      return desc(teacher.createdAt)
  }
}

export const getTeachers = async ({
  search,
  sortParam
}: {
  search: string
  sortParam: string
}): Promise<TeacherTypeBoard[]> => {
  const orderByParam = getOrderByParam(sortParam)
  const teachers = await (search
    ? teachers_index
        .search<TeacherTypeBoard>(search, {})
        .then(({ hits }) => hits)
    : drizzle_orm
        .select({
          first_name: teacher.firstName,
          last_name: teacher.lastName,
          phone_number: teacher.phoneNumber,
          address: teacher.address,
          teacher_id: teacher.teacherId,
          email: teacher.email,
          salary: teacher.salary
        })
        .from(teacher)
        .orderBy(orderByParam)
        .limit(20))

  return teachers
}
