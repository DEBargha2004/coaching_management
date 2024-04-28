"use server";

import { studentsLimitBoard } from "@/constants/student-board";
import { weekdays } from "@/constants/weekdays";
import { students_index } from "@/lib/algolia";
import { drizzle_orm } from "@/lib/drizzle";
import {
  batch,
  batchStudents,
  batchSubjects,
  batchTeachers,
  batchTimings,
  parent,
  student,
  studentStayDuration,
  subject,
  teacher,
} from "@/schema/drizzle/schema";
import {
  StudentEntrySchemaType,
  studentEntrySchema,
} from "@/schema/entry-form/student";
import { StudentTypeBoard } from "@/store/students-store";
import {
  ServerMessageGETType,
  ServerMessagePOSTType,
} from "@/types/server-message";
import { format } from "date-fns";
import { and, count, eq, or, sql } from "drizzle-orm";
import { groupBy, orderBy } from "lodash";
import changeStudentStay from "./stay";
import { auth } from "@clerk/nextjs";
import { StudentFullInfo } from "@/types/student";
import { id_prefix } from "@/constants/id-prefix";
import { v4 } from "uuid";

export async function getStudents({
  search,
  offset,
}: {
  search: string;
  offset?: number;
}): Promise<StudentTypeBoard[]> {
  const students = await (search
    ? students_index
        .search<StudentTypeBoard>(search, {
          hitsPerPage: studentsLimitBoard,
          ...(offset ? { offset } : {}),
        })
        .then(({ hits }) => hits)
    : drizzle_orm
        .select({
          first_name: student.firstName,
          last_name: student.lastName,
          phone_number: student.phoneNumber,
          address: student.address,
          student_id: student.studentId,
          email: student.email,
          membership_status: student.membershipStatus,
          aadhar_number: student.aadharNumber,
        })
        .from(student)
        .orderBy(student.firstName)
        .limit(studentsLimitBoard)
        .offset(offset || 0));

  return students;
}

export const getStudentsCount = async (): Promise<{ count: number }[]> => {
  const studentsCount = await drizzle_orm
    .select({ count: count(student.studentId) })
    .from(student);
  return studentsCount;
};

export async function deleteStudent(
  id: string
): Promise<ServerMessagePOSTType> {
  try {
    //delete stays from db
    await drizzle_orm
      .delete(studentStayDuration)
      .where(eq(studentStayDuration.studentId, id));
    //delete parent from db
    await drizzle_orm.delete(parent).where(eq(parent.studentId, id));
    //delete from db
    await drizzle_orm.delete(student).where(eq(student.studentId, id));
    //delete from algolia
    await students_index.deleteObject(id.replace("stud_", ""));
    return {
      status: "success",
      heading: "Student Deleted",
      description: "Student data has been deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong.Please try again later",
    };
  }
}

export async function changeStudentInfo({
  student_id,
  data,
}: {
  student_id: string;
  data: Partial<StudentEntrySchemaType>;
}): Promise<ServerMessagePOSTType<typeof data>> {
  try {
    if (data.dob) {
      data.dob = data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "";
    }
    const student_update = await drizzle_orm
      .update(student)
      .set(data)
      .where(eq(student.studentId, student_id));

    if (data.membershipStatus) {
      const server_message = await changeStudentStay({
        student_id,
        date: format(new Date(), "yyyy-MM-dd"),
        membership_status: data.membershipStatus,
      });
      if (server_message.status === "success") {
        await students_index.partialUpdateObject({
          objectID: student_id.replace("stud_", ""),
          ...data,
        });
        return {
          status: "success",
          heading: "Student Info Updated",
          description: "Student info has been updated successfully",
          result: { ...data },
        };
      } else {
        await students_index.partialUpdateObject({
          objectID: student_id.replace("stud_", ""),
          ...data,
          ...(server_message.result
            ? { membership_status: server_message.result }
            : {}),
        });
        return {
          status: "success",
          heading: "Student Info Updated",
          description: "Student info has been updated successfully",
          result: {
            ...data,
            ...(server_message.result
              ? { membership_status: server_message.result }
              : {}),
          },
        };
      }
    } else {
      await students_index.partialUpdateObject({
        objectID: student_id.replace("stud_", ""),
        ...data,
      });
      return {
        status: "success",
        heading: "Student Info Updated",
        description: "Student info has been updated successfully",
        result: { ...data },
      };
    }
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong.Please try again later",
      result: {},
    };
  }
}

export async function getFullInfoStudent(
  student_id: string
): Promise<ServerMessageGETType<StudentFullInfo[]>> {
  const { userId } = auth();
  try {
    if (userId) {
      const data = await drizzle_orm
        .select({
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          dob: student.dob,
          email: student.email,
          phoneNumber: student.phoneNumber,
          aadharNumber: student.aadharNumber,
          address: student.address,
          sex: student.sex,
          primaryLanguage: student.primaryLanguage,
          membershipStatus: student.membershipStatus,
          createdAt: student.createdAt,
          parentalInfo: sql<
            StudentFullInfo["parentalInfo"]
          >`JSON_ARRAYAGG(JSON_OBJECT(
              'parentId', ${parent.parentId},
              'relation', ${parent.relation},
              'phoneNumber', ${parent.phoneNumber},
              'firstName', ${parent.firstName},
              'lastName', ${parent.lastName},
              'email', ${parent.email}
            ))`,
        })
        .from(student)
        .innerJoin(parent, eq(student.studentId, parent.studentId))
        .where(eq(student.studentId, student_id))
        .groupBy(student.studentId);

      return {
        status: "success",
        heading: "Student Info",
        description: "Student info has been fetched successfully",
        result: data,
      };
    } else {
      return {
        status: "error",
        heading: "Error",
        description: "User not authenticated",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function addStudent(
  data: StudentEntrySchemaType
): Promise<ServerMessagePOSTType<StudentTypeBoard[]>> {
  try {
    const { success } = studentEntrySchema.safeParse(data);
    if (!success) {
      return {
        status: "error",
        heading: "Invalid Data",
        description: "Please check your data and try again",
      };
    }
    const existing_student = await drizzle_orm
      .select({
        student_id: student.studentId,
        email: student.email,
        phone_number: student.phoneNumber,
      })
      .from(student)
      .where(
        or(
          eq(student.email, data.email || ""),
          eq(student.phoneNumber, data.phoneNumber)
        )
      );
    if (existing_student.length) {
      //check if email or phone number already exists
      //check if email
      const existing_email = existing_student.find(
        (info) => info.email === data.email
      );
      if (existing_email) {
        return {
          status: "error",
          heading: "Duplicate Email",
          description: "Email already exists. Try with another email",
        };
      }
      //check if phone number
      const existing_phone = existing_student.find(
        (info) => info.phone_number === data.phoneNumber
      );
      if (existing_phone) {
        return {
          status: "error",
          heading: "Duplicate Phone Number",
          description:
            "Phone number already exists. Try with another phone number",
        };
      }
    }

    const student_id = `${id_prefix.student}${v4()}`;
    //inserting into db
    await drizzle_orm.insert(student).values({
      studentId: student_id,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      aadharNumber: data.aadharNumber,
      dob: data.dob,
      address: data.address,
      membershipStatus: data.membershipStatus,
      primaryLanguage: data.primaryLanguage,
      sex: data.sex,
      createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });

    await drizzle_orm.insert(parent).values(
      data.parentalInfo.map((info) => ({
        parentId: `${id_prefix.parent}${v4()}`,
        relation: info.relation,
        studentId: student_id,
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        phoneNumber: info.phoneNumber,
      }))
    );

    await changeStudentStay({
      student_id,
      membership_status: data.membershipStatus,
      date: format(new Date(), "yyyy-MM-dd"),
    });

    //adding to algolia
    await students_index
      .saveObject({
        objectID: student_id.replace(id_prefix.student, ""),
        student_id,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        email: data.email,
        address: data.address,
        membership_status: data.membershipStatus,
        aadhar_number: data.aadharNumber,
      })
      .wait();

    return {
      status: "success",
      heading: "Added Student",
      description: "Student added successfully",
      result: [
        {
          student_id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          email: data.email,
          address: data.address || "",
          membership_status: data.membershipStatus,
          aadhar_number: data.aadharNumber,
        },
      ],
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
