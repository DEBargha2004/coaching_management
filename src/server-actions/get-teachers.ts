'use server'

import prisma from '@/lib/prisma'

export default async function getTeachersInitial ({
  search,
  sortParam
}: {
  search: string
  sortParam: string
}) {
  const teachers = await prisma.teacher.findMany({
    select: {
      first_name: true,
      last_name: true,
      phone_number: true,
      address: true,
      teacher_id: true,
      email: true,
      salary: true
    },
    orderBy: {
      [sortParam || 'created_at']: 'desc'
    },
    where: search
      ? {
          OR: [
            {
              first_name: {
                contains: search
              }
            },
            {
              last_name: {
                contains: search
              }
            },
            {
              email: {
                contains: search
              }
            },
            {
              address: {
                contains: search
              }
            },
            {
              phone_number: {
                contains: search
              }
            }
          ]
        }
      : undefined
  })

  return teachers
}
