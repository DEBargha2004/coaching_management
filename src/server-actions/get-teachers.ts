'use server'

import { teachersLimitPerBoard } from '@/constants/teacher-board'
import { teachers_index, teachers_index_salary } from '@/lib/algolia'
import { drizzle_orm } from '@/lib/drizzle'
import { teacher } from '@/schema/drizzle/schema'
import { TeacherTypeBoard } from '@/store/teachers-store'
import { SearchIndex } from 'algoliasearch'
import { asc, desc, count } from 'drizzle-orm'

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

const getSpecificAlgoliaIndex = (sortParam?: string): SearchIndex => {
  switch (sortParam) {
    case 'salary':
      return teachers_index_salary
    default:
      return teachers_index
  }
}

export const getTeachers = async ({
  search,
  sortParam,
  offset
}: {
  search: string
  sortParam: string
  offset?: number
}): Promise<TeacherTypeBoard[]> => {
  const orderByParam = getOrderByParam(sortParam)
  const teachers = await (search
    ? getSpecificAlgoliaIndex(sortParam)
        .search<TeacherTypeBoard>(search, {
          hitsPerPage: teachersLimitPerBoard,
          ...(offset ? { offset } : {})
        })
        .then(({ hits }) => hits)
    : drizzle_orm
        .select({
          first_name: teacher.firstName,
          last_name: teacher.lastName,
          phone_number: teacher.phoneNumber,
          address: teacher.address,
          teacher_id: teacher.teacherId,
          email: teacher.email,
          salary: teacher.salary,
          membership_status: teacher.membershipStatus
        })
        .from(teacher)
        .orderBy(orderByParam)
        .limit(teachersLimitPerBoard)
        .offset(offset || 0))

  return teachers
}

export const getTeachersCount = async (): Promise<{ count: number }[]> => {
  const teachersCount = await drizzle_orm
    .select({ count: count(teacher.teacherId) })
    .from(teacher)
  console.log('teachers_count is ', teachersCount)
  return teachersCount
}
