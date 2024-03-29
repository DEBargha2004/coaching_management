'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { teacher } from '@/schema/drizzle/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'

export default async function getFullInfoTeacher (teacher_id: string) {
  const { userId } = auth()
  if (userId) {
    const fullTeacherInfo = await drizzle_orm
      .select()
      .from(teacher)
      .where(eq(teacher.teacherId, teacher_id))
    return fullTeacherInfo
  }
}
