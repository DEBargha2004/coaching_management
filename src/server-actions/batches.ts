"use server";

import { id_prefix } from "@/constants/id-prefix";
import { drizzle_orm } from "@/lib/drizzle";
import {
  batch,
  batchStudents,
  batchTeachers,
  teacher,
} from "@/schema/drizzle/schema";
import {
  BatchEntrySchemaType,
  batchEntrySchema,
} from "@/schema/entry-form/batch";
import { Batch, Teacher } from "@/types/batch";
import {
  ServerMessageGETType,
  ServerMessagePOSTType,
} from "@/types/server-message";
import { count, eq, isNotNull, sql } from "drizzle-orm";
import { v4 } from "uuid";

export async function getBatches(
  batch_id?: string
): Promise<ServerMessageGETType<Batch[]>> {
  try {
    const batches = await drizzle_orm
      .select({
        batch_id: batch.batchId,
        batch_name: batch.batchName,
        created_at: batch.createdAt,
        description: batch.description,
        medium: batch.medium,
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
                )`,
      })
      .from(batch)
      .leftJoin(batchStudents, eq(batch.batchId, batchStudents.batchId))
      .leftJoin(batchTeachers, eq(batch.batchId, batchTeachers.batchId))
      .innerJoin(teacher, eq(teacher.teacherId, batchTeachers.teacherId))
      .orderBy(batch.createdAt)
      .groupBy(batch.batchId)
      .where(batch_id ? eq(batch.batchId, batch_id) : isNotNull(batch.batchId));

    return {
      status: "success",
      heading: "Batches",
      description: "Batches fetched successfully",
      result: batches,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function createBatch({
  batch_name,
  group_id,
  description,
  medium,
}: BatchEntrySchemaType): Promise<
  ServerMessagePOSTType<Batch> & { trashed?: boolean }
> {
  try {
    const { success } = batchEntrySchema.safeParse({
      batch_name,
      group_id,
      description,
      medium,
    });
    if (!success) {
      return {
        status: "error",
        heading: "Invalid Form Data",
        description: "Please check all fields and try again",
      };
    }
    const existing_batch = await drizzle_orm
      .select()
      .from(batch)
      .where(eq(batch.batchName, batch_name));
    if (existing_batch.length > 0) {
      return {
        status: "error",
        heading: "Batch Already Exists",
        description: existing_batch[0].trashed
          ? "Batch with this name already exists in Trash. Please try again with a different name or delete the batch from Trash if you want to use the same name."
          : "Batch with this name already exists. Please try again with a different name.",
        trashed: existing_batch[0].trashed,
      };
    } else {
      const batch_id = `${id_prefix.batch}${v4()}`;
      await drizzle_orm.insert(batch).values({
        batchId: batch_id,
        batchName: batch_name,
        groupId: group_id,
        description: description,
        medium: medium,
      });
      return {
        status: "success",
        heading: "Batch Created",
        description: "Batch has been created successfully",
        result: {
          batch_id: batch_id,
          batch_name: batch_name,
          description: description,
          medium: medium,
          created_at: new Date().toUTCString(),
          students_count: 0,
          teachers: [],
        },
      };
    }
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function restoreBatch(
  batch_id: string
): Promise<ServerMessagePOSTType<Batch>> {
  try {
    await drizzle_orm
      .update(batch)
      .set({ trashed: false })
      .where(eq(batch.batchId, batch_id));
    const serverMessage_restoredBatch = await getBatches(batch_id);
    return {
      status: "success",
      heading: "Batch Restored",
      description: "Batch has been restored successfully",
      result: serverMessage_restoredBatch.result![0],
    };
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function getBatchesOfStudent(
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
        )`,
      })
      .from(batchStudents)
      .innerJoin(batch, eq(batch.batchId, batchStudents.batchId))
      .innerJoin(batchTeachers, eq(batchTeachers.batchId, batch.batchId))
      .innerJoin(teacher, eq(batchTeachers.teacherId, teacher.teacherId))
      .where(eq(batchStudents.studentId, studentId))
      .groupBy(batchStudents.batchId);

    console.log(JSON.stringify(batches, null, 2));
    return {
      status: "success",
      heading: "Batches of Student",
      result: batches,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function getBatchesOfTeacher(
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
        students_count: count(batchStudents.studentId),
      })
      .from(batchTeachers)
      .leftJoin(batch, eq(batch.batchId, batchTeachers.batchId))
      .leftJoin(teacher, eq(teacher.teacherId, batchTeachers.teacherId))
      .leftJoin(batchStudents, eq(batchStudents.batchId, batchTeachers.batchId))
      .where(eq(batchTeachers.teacherId, teacher_id))
      .groupBy(batchTeachers.batchId, batch.batchName);

    return {
      status: "success",
      heading: "Teacher Batches",
      description: "Teacher batches fetched successfully",
      result: batches,
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}
