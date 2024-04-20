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

export async function getAllBatches (): Promise<ServerMessageGETType<Batch[]>> {
  try {
    const batches = await drizzle_orm
      .select({
        batch_id: batch.batchId,
        batch_name: batch.batchName,
        created_at: batch.createdAt,
        students_count: count(batchStudents.studentId),
        teachers: sql<Teacher[]>`(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'teacher_id', ${teacher.teacherId},
                            'first_name', ${teacher.firstName},
                            'last_name', ${teacher.lastName},
                            'sex', ${teacher.sex}
                        )
                    )
                )`
      })
      .from(batch)
      .leftJoin(batchStudents, eq(batch.batchId, batchStudents.batchId))
      .leftJoin(batchTeachers, eq(batch.batchId, batchTeachers.batchId))
      .innerJoin(teacher, eq(teacher.teacherId, batchTeachers.teacherId))
      .orderBy(batch.createdAt)
      .groupBy(batch.batchId)

    return {
      status: 'success',
      heading: 'Batches',
      description: 'Batches fetched successfully',
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
