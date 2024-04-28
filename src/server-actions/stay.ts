"use server";

import { weekdays } from "@/constants/weekdays";
import { drizzle_orm } from "@/lib/drizzle";
import {
  batch,
  batchStudents,
  batchSubjects,
  batchTeachers,
  batchTimings,
  studentStayDuration,
  subject,
  teacher,
  teacherStayDuration,
} from "@/schema/drizzle/schema";
import {
  ServerMessageGETType,
  ServerMessagePOSTType,
} from "@/types/server-message";
import { StudentJoiningInfo, TeacherJoiningInfo } from "@/types/stay";
import { format } from "date-fns";
import { and, eq, isNull, sql } from "drizzle-orm";
import { groupBy, orderBy } from "lodash";
import { v4 } from "uuid";

export default async function changeStudentStay({
  student_id,
  membership_status,
  date,
}: {
  student_id: string;
  membership_status: string;
  date: string;
}): Promise<ServerMessagePOSTType<"active" | "inactive" | null>> {
  try {
    const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    if (membership_status === "active") {
      const student_stays = await drizzle_orm
        .select({
          stay_id: studentStayDuration.stayId,
          joining_date: studentStayDuration.joiningDate,
        })
        .from(studentStayDuration)
        .where(
          and(
            eq(studentStayDuration.studentId, student_id),
            isNull(studentStayDuration.leavingDate)
          )
        );
      if (student_stays.length) {
        return {
          status: "error",
          heading: "Membership status already active",
          description:
            "Membership status already is already active. Make it inactive first",
          result: "active",
        };
      } else {
        await drizzle_orm.insert(studentStayDuration).values({
          stayId: `stay_${v4()}`,
          studentId: student_id,
          joiningDate: format(new Date(date), "yyyy-MM-dd"),
          createdAt,
        });

        return {
          status: "success",
          heading: "Membership status changed",
          description: `Membership status has been changed to ${membership_status} successfully`,
          result: "active",
        };
      }
    } else if (membership_status === "inactive") {
      const student_stays = await drizzle_orm
        .select({
          stay_id: studentStayDuration.stayId,
          joining_date: studentStayDuration.joiningDate,
        })
        .from(studentStayDuration)
        .where(
          and(
            eq(studentStayDuration.studentId, student_id),
            isNull(studentStayDuration.leavingDate)
          )
        );

      if (student_stays.length) {
        await drizzle_orm
          .update(studentStayDuration)
          .set({ leavingDate: format(new Date(date), "yyyy-MM-dd") })
          .where(
            and(
              eq(studentStayDuration.studentId, student_id),
              isNull(studentStayDuration.leavingDate)
            )
          );
        return {
          status: "success",
          heading: "Membership status changed",
          description: `Membership status has been changed to ${membership_status} successfully`,
          result: "inactive",
        };
      } else {
        const existing_stay = await drizzle_orm
          .select({
            stay_id: studentStayDuration.stayId,
          })
          .from(studentStayDuration)
          .where(eq(studentStayDuration.studentId, student_id));
        if (existing_stay.length) {
          console.log("existing_stay if", existing_stay);
          return {
            status: "error",
            heading: "Membership status already inactive",
            description:
              "Membership status already is already inactive. Make it active first",
            result: "inactive",
          };
        } else {
          console.log("existing_stay else", existing_stay);
          return {
            status: "success",
            heading: "Membership status set",
            description: `Membership status has been set to ${membership_status} successfully`,
            result: "inactive",
          };
        }
      }
    } else {
      return {
        status: "error",
        heading: "Invalid Data",
        description: "Membership status must be either active or inactive",
        result: null,
      };
    }
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
      result: null,
    };
  }
}

export async function getJoiningInfoStudent(
  student_id: string
): Promise<ServerMessageGETType<StudentJoiningInfo[]>> {
  try {
    const studentJoiningInfo = await drizzle_orm
      .select()
      .from(studentStayDuration)
      .where(eq(studentStayDuration.studentId, student_id))
      .orderBy(studentStayDuration.joiningDate);
    return {
      status: "success",
      heading: "Teacher Joining Info",
      result: studentJoiningInfo,
    };
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function changeTeacherStay({
  teacher_id,
  membership_status,
  date,
}: {
  teacher_id: string;

  membership_status: string;
  date: string;
}): Promise<ServerMessagePOSTType<"active" | "inactive" | null>> {
  try {
    const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    if (membership_status === "active") {
      const teacher_stays = await drizzle_orm
        .select({
          stay_id: teacherStayDuration.stayId,
          joining_date: teacherStayDuration.joiningDate,
        })
        .from(teacherStayDuration)
        .where(
          and(
            eq(teacherStayDuration.teacherId, teacher_id),
            isNull(teacherStayDuration.leavingDate)
          )
        );
      if (teacher_stays.length) {
        return {
          status: "error",
          heading: "Membership status already active",
          description:
            "Membership status already is already active. Make it inactive first",
          result: "active",
        };
      } else {
        await drizzle_orm.insert(teacherStayDuration).values({
          stayId: `stay_${v4()}`,
          teacherId: teacher_id,
          joiningDate: format(new Date(date), "yyyy-MM-dd"),
          createdAt,
        });

        return {
          status: "success",
          heading: "Membership status changed",
          description: `Membership status has been changed to ${membership_status} successfully`,
          result: "active",
        };
      }
    } else if (membership_status === "inactive") {
      const teacher_stays = await drizzle_orm
        .select({
          stay_id: teacherStayDuration.stayId,
          joining_date: teacherStayDuration.joiningDate,
        })
        .from(teacherStayDuration)
        .where(
          and(
            eq(teacherStayDuration.teacherId, teacher_id),
            isNull(teacherStayDuration.leavingDate)
          )
        );
      console.log("teacher_stays", teacher_stays);
      if (teacher_stays.length) {
        await drizzle_orm
          .update(teacherStayDuration)
          .set({ leavingDate: format(new Date(date), "yyyy-MM-dd") })
          .where(
            and(
              eq(teacherStayDuration.teacherId, teacher_id),
              isNull(teacherStayDuration.leavingDate)
            )
          );
        return {
          status: "success",
          heading: "Membership status changed",
          description: `Membership status has been changed to ${membership_status} successfully`,
          result: "inactive",
        };
      } else {
        const existing_stay = await drizzle_orm
          .select({
            stay_id: teacherStayDuration.stayId,
          })
          .from(teacherStayDuration)
          .where(eq(teacherStayDuration.teacherId, teacher_id));
        if (existing_stay.length) {
          console.log("existing_stay if", existing_stay);
          return {
            status: "error",
            heading: "Membership status already inactive",
            description:
              "Membership status already is already inactive. Make it active first",
            result: "inactive",
          };
        } else {
          console.log("existing_stay else", existing_stay);
          return {
            status: "success",
            heading: "Membership status set",
            description: `Membership status has been set to ${membership_status} successfully`,
            result: "inactive",
          };
        }
      }
    } else {
      return {
        status: "error",
        heading: "Invalid Data",
        description: "Membership status must be either active or inactive",
        result: null,
      };
    }
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
      result: null,
    };
  }
}

export async function getJoiningInfoTeacher(
  teacher_id: string
): Promise<ServerMessageGETType<TeacherJoiningInfo[]>> {
  try {
    const teacherJoiningInfo = await drizzle_orm
      .select()
      .from(teacherStayDuration)
      .where(eq(teacherStayDuration.teacherId, teacher_id))
      .orderBy(teacherStayDuration.joiningDate);
    return {
      status: "success",
      heading: "Teacher Joining Info",
      result: teacherJoiningInfo,
    };
  } catch (error) {
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}
