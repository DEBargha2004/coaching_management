'use server'

import { drizzle_orm } from '@/lib/drizzle'
import {
  batch,
  batchStudents,
  batchTeachers,
  teacher
} from '@/schema/drizzle/schema'
import { Batch, Teacher } from '@/types/batch'
import { ServerMessageGETType } from '@/types/server-message'
import { and, eq, sql } from 'drizzle-orm'

export default async function getBatchesOfStudent (
  studentId: string
): Promise<ServerMessageGETType<Batch[]>> {
  try {
    const batches = await drizzle_orm
      .select({
        batch_id: batch.batchId,
        batch_name: batch.batchName,
        created_at: batch.createdAt,
        teachers: sql<Teacher[]>`(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'teacher_id', ${teacher.teacherId},
            'first_name', ${teacher.firstName},
            'last_name', ${teacher.lastName},
            'sex', ${teacher.sex}
            )
          )
        )`,
        students_count: sql<number>`(
        select
          count(*)
        from
          ${batchStudents}
        where ${batchStudents.batchId} = ${batch.batchId}
        )`
      })
      .from(batchStudents)
      .innerJoin(batch, eq(batch.batchId, batchStudents.batchId))
      .innerJoin(batchTeachers, eq(batchTeachers.batchId, batch.batchId))
      .innerJoin(teacher, eq(batchTeachers.teacherId, teacher.teacherId))
      .where(eq(batchStudents.studentId, studentId))
      .groupBy(batchStudents.batchId)

    console.log(JSON.stringify(batches, null, 2))
    return {
      status: 'success',
      heading: 'Batches of Student',
      result: batches
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
