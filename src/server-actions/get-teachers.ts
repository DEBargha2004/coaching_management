'use server'

import {
  teachers_index,
  teachers_index_first_name,
  teachers_index_salary
} from '@/lib/algolia'
import { drizzle_orm } from '@/lib/drizzle'
import { teacher } from '@/schema/drizzle/schema'
import { TeacherTypeBoard } from '@/store/teachers-store'
import { SearchIndex } from 'algoliasearch'
import { asc, desc, eq, or, lte, count } from 'drizzle-orm'

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
    case 'first_name':
      return teachers_index_first_name
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
          hitsPerPage: 10,
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
          salary: teacher.salary
        })
        .from(teacher)
        .orderBy(orderByParam)
        .limit(10)
        .offset(offset || 0))

  return teachers
}

export const getTeachersCount = async (): Promise<{ count: number }[]> => {
  const teachersCount = await drizzle_orm
    .select({ count: count(teacher.teacherId) })
    .from(teacher)
  console.log(teachersCount)
  return teachersCount
}
