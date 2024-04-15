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
import { count, eq, sql } from 'drizzle-orm'

export default async function getBatchesOfTeacher (
  teacher_id: string
): Promise<ServerMessageGETType<Batch[]>> {
  try {
    const batches = await drizzle_orm
      .select({
        batch_id: batchTeachers.batchId,
        batch_name: batch.batchName,
        created_at: batch.createdAt,
        teachers: sql<Teacher[]>`(
        select JSON_ARRAYAGG(
          JSON_OBJECT(
            'teacher_id', ${teacher.teacherId},
            'first_name', ${teacher.firstName},
            'last_name', ${teacher.lastName},
            'sex', ${teacher.sex}
          )
        ) 
        from 
            ${batchTeachers}
            join ${teacher} on ${teacher.teacherId} = ${batchTeachers.teacherId}
        where ${batchTeachers.batchId} = ${batch.batchId}
        group by ${batchTeachers.batchId}
      )`,
        students_count: count(batchStudents.studentId)
      })
      .from(batchTeachers)
      .leftJoin(batch, eq(batch.batchId, batchTeachers.batchId))
      .leftJoin(teacher, eq(teacher.teacherId, batchTeachers.teacherId))
      .leftJoin(batchStudents, eq(batchStudents.batchId, batchTeachers.batchId))
      .where(eq(batchTeachers.teacherId, teacher_id))
      .groupBy(batchTeachers.batchId, batch.batchName)

    return {
      status: 'success',
      heading: 'Teacher Batches',
      description: 'Teacher batches fetched successfully',
      result: batches
    }
  } catch (error) {
    console.error(error)

    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
