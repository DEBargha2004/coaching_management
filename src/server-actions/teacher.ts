"use server";

import { id_prefix } from "@/constants/id-prefix";
import { teachersLimitPerBoard } from "@/constants/teacher-board";
import { teachers_index, teachers_index_salary } from "@/lib/algolia";
import { drizzle_orm } from "@/lib/drizzle";
import {
  teacher,
  teacherStayDuration,
  teachersQualification,
} from "@/schema/drizzle/schema";
import {
  TeacherEntrySchemaType,
  teacherEntrySchema,
} from "@/schema/entry-form/teacher";
import { TeacherTypeBoard } from "@/store/teachers-store";
import {
  ServerMessageGETType,
  ServerMessagePOSTType,
} from "@/types/server-message";
import { Qualification } from "@/types/teacher";
import { auth } from "@clerk/nextjs";
import { SearchIndex } from "algoliasearch";
import { asc, desc, count, eq, sql, or } from "drizzle-orm";
import { orderBy } from "lodash";
import { format } from "date-fns";
import { changeTeacherStay } from "./stay";
import { v4 } from "uuid";

const getOrderByParam = (sortParam?: string) => {
  switch (sortParam) {
    case "first_name":
      return asc(teacher.firstName);
    case "salary":
      return asc(teacher.salary);
    default:
      return desc(teacher.createdAt);
  }
};

const getSpecificAlgoliaIndex = (sortParam?: string): SearchIndex => {
  switch (sortParam) {
    case "salary":
      return teachers_index_salary;
    default:
      return teachers_index;
  }
};

export async function getTeachers({
  search,
  sortParam,
  offset,
}: {
  search: string;
  sortParam: string;
  offset?: number;
}): Promise<TeacherTypeBoard[]> {
  const orderByParam = getOrderByParam(sortParam);
  const teachers = await (search
    ? getSpecificAlgoliaIndex(sortParam)
        .search<TeacherTypeBoard>(search, {
          hitsPerPage: teachersLimitPerBoard,
          ...(offset ? { offset } : {}),
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
          membership_status: teacher.membershipStatus,
        })
        .from(teacher)
        .orderBy(orderByParam)
        .limit(teachersLimitPerBoard)
        .offset(offset || 0));

  return teachers;
}

export async function getTeachersCount(): Promise<{ count: number }[]> {
  const teachersCount = await drizzle_orm
    .select({ count: count(teacher.teacherId) })
    .from(teacher);
  console.log("teachers_count is ", teachersCount);
  return teachersCount;
}

export async function getTeacherQualifications(
  teacher_id: string
): Promise<ServerMessageGETType<Qualification[]>> {
  if (!teacher_id)
    return {
      status: "error",
      heading: "Id not found",
      description: "Teacher Id was not passed in",
    };

  try {
    const qualifications: Qualification[] = await drizzle_orm
      .select({
        qualification_id: teachersQualification.qualificationId,
        course_type: teachersQualification.courseType,
        course_name: teachersQualification.courseName,
        college_name: teachersQualification.collegeName,
        major: teachersQualification.major,
        start_date: teachersQualification.startDate,
        end_date: teachersQualification.endDate,
      })
      .from(teachersQualification)
      .where(eq(teachersQualification.teacherId, teacher_id))
      .orderBy(teachersQualification.startDate);

    return {
      status: "success",
      heading: "Qualifications",
      description: "Qualifications fetched successfully",
      result: qualifications,
    };
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export default async function getTeacherInfoEntryForm(
  teacherId: string
): Promise<ServerMessageGETType<TeacherEntrySchemaType>> {
  try {
    const teacherInfo = await drizzle_orm
      .select({
        teacherId: teacher.teacherId,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        address: teacher.address,
        salary: teacher.salary,
        dob: teacher.dob,
        membershipStatus: teacher.membershipStatus,
        sex: teacher.sex,
        primaryLanguage: teacher.primaryLanguage,
        qualifications: sql<TeacherEntrySchemaType["qualifications"]>`
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'courseType', ${teachersQualification.courseType},
                  'courseName', ${teachersQualification.courseName},
                  'collegeName', ${teachersQualification.collegeName},
                  'major', ${teachersQualification.major},
                  'startDate', ${teachersQualification.startDate},
                  'endDate', ${teachersQualification.endDate}
                )
              )
            `,
      })
      .from(teacher)
      .innerJoin(
        teachersQualification,
        eq(teachersQualification.teacherId, teacher.teacherId)
      )
      .where(eq(teacher.teacherId, teacherId));

    let teacherInfoObj = teacherInfo[0] || null;

    if (!teacherInfoObj) {
      return {
        status: "error",
        heading: "No Teacher Found",
        description: "No teacher found with this id",
      };
    } else {
      teacherInfoObj.qualifications = orderBy(
        teacherInfoObj.qualifications,
        "start_date"
      );

      return {
        status: "success",
        heading: "Teacher Info",
        description: "Teacher info fetched successfully",
        // @ts-ignore
        result: teacherInfoObj,
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

export async function getFullInfoTeacher(teacher_id: string) {
  const { userId } = auth();
  if (userId) {
    const fullTeacherInfo = await drizzle_orm
      .select()
      .from(teacher)
      .where(eq(teacher.teacherId, teacher_id));
    return fullTeacherInfo;
  }
}

export async function deleteTeacher(
  id: string
): Promise<ServerMessagePOSTType> {
  try {
    //delete stays from db
    await drizzle_orm
      .delete(teacherStayDuration)
      .where(eq(teacherStayDuration.teacherId, id));
    //delete qualifications
    await drizzle_orm
      .delete(teachersQualification)
      .where(eq(teachersQualification.teacherId, id));
    //delete from db
    await drizzle_orm.delete(teacher).where(eq(teacher.teacherId, id));
    //delete from algolia
    await teachers_index.deleteObject(id.replace(id_prefix.teacher, ""));
    return {
      status: "success",
      heading: "Teacher Deleted",
      description: "Teacher data has been deleted successfully",
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

export async function changeTeacherInfo({
  teacher_id,
  data,
}: {
  teacher_id: string;
  data: Partial<TeacherEntrySchemaType>;
}): Promise<ServerMessagePOSTType<typeof data>> {
  try {
    if (data.dob) {
      data.dob = data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "";
    }
    const teacher_update = await drizzle_orm
      .update(teacher)
      .set(data)
      .where(eq(teacher.teacherId, teacher_id));
    console.log(teacher_update);

    if (data.membershipStatus) {
      const server_message = await changeTeacherStay({
        teacher_id,
        date: format(new Date(), "yyyy-MM-dd"),
        membership_status: data.membershipStatus,
      });
      if (server_message.status === "success") {
        await teachers_index.partialUpdateObject({
          objectID: teacher_id.replace("teach_", ""),
          ...data,
        });
        return {
          status: "success",
          heading: "Teacher Info Updated",
          description: "Teacher info has been updated successfully",
          result: { ...data },
        };
      } else {
        await teachers_index.partialUpdateObject({
          objectID: teacher_id.replace("teach_", ""),
          ...data,
          ...(server_message.result
            ? { membership_status: server_message.result }
            : {}),
        });
        return {
          status: "success",
          heading: "Teacher Info Updated",
          description: "Teacher info has been updated successfully",
          result: {
            ...data,
            ...(server_message.result
              ? { membership_status: server_message.result }
              : {}),
          },
        };
      }
    } else {
      await teachers_index.partialUpdateObject({
        objectID: teacher_id.replace("teach_", ""),
        ...data,
      });
      return {
        status: "success",
        heading: "Teacher Info Updated",
        description: "Teacher info has been updated successfully",
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

export async function addTeacher(
  data: TeacherEntrySchemaType
): Promise<ServerMessagePOSTType<TeacherTypeBoard[]>> {
  try {
    const { success } = teacherEntrySchema.safeParse(data);
    if (!success) {
      return {
        status: "error",
        heading: "Invalid Data",
        description: "Please check your data and try again",
      };
    }
    const existing_Teacher = await drizzle_orm
      .select({
        teacher_id: teacher.teacherId,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
      })
      .from(teacher)
      .where(
        or(
          eq(teacher.email, data.email || ""),
          eq(teacher.phoneNumber, data.phoneNumber)
        )
      );
    if (existing_Teacher.length) {
      //check if email or phone number already exists
      //check if email
      const existing_email = existing_Teacher.find(
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
      const existing_phone = existing_Teacher.find(
        (info) => info.phoneNumber === data.phoneNumber
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

    const teacher_id = `${id_prefix.teacher}${v4()}`;
    //inserting into db
    await drizzle_orm.insert(teacher).values({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      dob: format(data.dob, "yyyy-MM-dd"),
      sex: data.sex,
      primaryLanguage: data.primaryLanguage,
      teacherId: teacher_id,
      salary: data.salary,
      membershipStatus: data.membershipStatus,
      createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });

    await drizzle_orm.insert(teachersQualification).values(
      data.qualifications.map((q) => ({
        teacherId: teacher_id,
        courseType: q.courseType,
        courseName: q.courseName,
        ...(q.major ? { major: q.major } : {}),
        collegeName: q.collegeName,
        qualificationId: `${id_prefix.qualification}${v4()}`,
        startDate: format(q.startDate, "yyyy-MM-dd"),
        endDate: format(q.endDate, "yyyy-MM-dd"),
      }))
    );

    await changeTeacherStay({
      teacher_id,
      membership_status: data.membershipStatus,
      date: format(new Date(), "yyyy-MM-dd"),
    });

    //adding to algolia
    await teachers_index
      .saveObject({
        objectID: teacher_id.replace(id_prefix.teacher, ""),
        teacher_id,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        email: data.email,
        address: data.address,
        salary: data.salary,
        membership_status: data.membershipStatus,
      })
      .wait();

    return {
      status: "success",
      heading: "Added Teacher",
      description: "Teacher added successfully",
      result: [
        {
          teacher_id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          email: data.email,
          address: data.address || "",
          salary: data.salary,
          membership_status: data.membershipStatus,
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
