"use server";

import { drizzle_orm } from "@/lib/drizzle";
import { subject } from "@/schema/drizzle/schema";
import { SubjectEntrySchemaType } from "@/schema/entry-form/subject";
import {
  ServerMessageGETType,
  ServerMessagePOSTType,
} from "@/types/server-message";
import { SubjectType } from "@/types/subject-type";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";

export async function createSubject(
  data: SubjectEntrySchemaType
): Promise<ServerMessagePOSTType<SubjectType>> {
  try {
    const subject_id = `sub_${v4()}`;
    await drizzle_orm.insert(subject).values({
      subjectId: subject_id,
      subjectName: data.subject_name,
    });

    return {
      status: "success",
      heading: "Subject Created",
      description: "Subject has been created successfully",
      result: {
        subjectId: subject_id,
        subjectName: data.subject_name,
        createdAt: new Date().toUTCString(),
      },
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

export async function getSubjects(): Promise<
  ServerMessageGETType<SubjectType[]>
> {
  try {
    const subjects = await drizzle_orm
      .select({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        createdAt: subject.createdAt,
      })
      .from(subject)
      .where(eq(subject.trashed, false))
      .orderBy(subject.createdAt);
    return {
      status: "success",
      heading: "Subjects",
      description: "Subjects fetched successfully",
      result: subjects,
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

export const getSubjectInfo = async (
  subject_id: string
): Promise<ServerMessageGETType<SubjectType | null>> => {
  try {
    const res = await drizzle_orm
      .select()
      .from(subject)
      .where(eq(subject.subjectId, subject_id));
    if (res.length) {
      return {
        status: "success",
        heading: "Subject",
        description: "Subject fetched successfully",
        result: res[0],
      };
    } else {
      return {
        status: "success",
        heading: "Subject Not Found",
        description: "No Subject found with this id",
        result: null,
      };
    }
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
};

export async function changeSubjectName(
  subject_id: string,
  subject_name: string
): Promise<ServerMessagePOSTType<string>> {
  try {
    await drizzle_orm
      .update(subject)
      .set({ subjectName: subject_name })
      .where(eq(subject.subjectId, subject_id));
    return {
      status: "success",
      heading: "Subject Updated",
      description: "Subject Name has been updated successfully",
      result: subject_name,
    };
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function trashSubject(
  subject_id: string
): Promise<ServerMessagePOSTType<null>> {
  try {
    await drizzle_orm
      .update(subject)
      .set({ trashed: true })
      .where(eq(subject.subjectId, subject_id));
    return {
      status: "success",
      heading: "Subject Trashed",
      description: "Subject has been trashed successfully",
    };
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}
