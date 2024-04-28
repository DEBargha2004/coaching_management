"use server";

import { weekdays } from "@/constants/weekdays";
import { drizzle_orm } from "@/lib/drizzle";
import {
  batch,
  batchStudents,
  batchSubjects,
  batchTeachers,
  batchTimings,
  subject,
  teacher,
} from "@/schema/drizzle/schema";
import { BatchTiming_Teacher, BatchTimings_Student } from "@/types/schedule";
import { ServerMessageGETType } from "@/types/server-message";
import { and, eq, sql } from "drizzle-orm";
import { groupBy, orderBy } from "lodash";

type FormattedBatchTimings_Teacher = Record<string, BatchTiming_Teacher[]>;

type TeacherSchedulesReturn = {
  teacher_id: string;
  batch_timings: FormattedBatchTimings_Teacher;
  batch_timings_days: typeof weekdays;
};

export async function getTeacherSchedules(
  teacher_id: string
): Promise<ServerMessageGETType<TeacherSchedulesReturn>> {
  try {
    const teacherSchedules = await drizzle_orm
      .select({
        teacher_id: batchTimings.teacherId,
        batch_timings: sql<BatchTiming_Teacher[]>`JSON_ARRAYAGG(
          JSON_OBJECT(
            'timing_id', ${batchTimings.timingId},
            'batch_info', JSON_OBJECT(
              'batch_id', ${batchTimings.batchId},
              'batch_name', ${batch.batchName}
            ),
            'day_index', ${batchTimings.dayIndex},
            'start_time', ${batchTimings.startTime},
            'end_time', ${batchTimings.endTime},
            'subject_info', JSON_OBJECT(
              'subject_id', ${subject.subjectId},
              'subject_name', ${subject.subjectName}
            )
          )
        )`,
      })
      .from(batchTimings)
      .leftJoin(batch, eq(batch.batchId, batchTimings.batchId))
      .leftJoin(subject, eq(subject.subjectId, batchTimings.subjectId))
      .where(eq(batchTimings.teacherId, teacher_id))
      .groupBy(batchTimings.teacherId);

    if (teacherSchedules.length) {
      //[{...}] => {...}
      let teacherSchedulesObj = teacherSchedules[0];
      // remove null values from batch_timings where timing_id is null
      teacherSchedulesObj.batch_timings =
        teacherSchedulesObj.batch_timings?.filter((bt) =>
          Boolean(bt.timing_id)
        ) ?? [];

      // group by day_index
      // [{...},...] => ['key':{...},...]
      let formattedBatchTimings = groupBy(
        teacherSchedulesObj.batch_timings,
        "day_index"
      );
      // sort timings by start_time
      for (const day in formattedBatchTimings) {
        formattedBatchTimings[day] = orderBy(
          formattedBatchTimings[day],
          "start_time"
        );
      }

      let batchTimingDays = Object.keys(formattedBatchTimings);

      batchTimingDays = orderBy(batchTimingDays);

      const batchTimingsDaysObject = batchTimingDays.map((day, index) => {
        return weekdays.find((dayObj) => dayObj.index === Number(day))!;
      });

      return {
        status: "success",
        heading: "Teacher Schedules",
        description: "Teacher schedules fetched successfully",
        result: {
          teacher_id: teacherSchedulesObj.teacher_id,
          batch_timings: formattedBatchTimings,
          batch_timings_days: batchTimingsDaysObject,
        },
      };
    } else {
      return {
        status: "error",
        heading: "Teacher Not Found",
        description: "Teacher Info is either deleted or id is invalid",
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

type FormattedBatchTimings_Student = Record<string, BatchTimings_Student[]>;

type StudentSchedulesReturn = {
  student_id: string;
  batch_timings: FormattedBatchTimings_Student;
  batch_timings_days: typeof weekdays;
};

export async function getStudentSchedules(
  student_id: string
): Promise<ServerMessageGETType<StudentSchedulesReturn>> {
  try {
    const studentSchedules = await drizzle_orm
      .select({
        student_id: batchStudents.studentId,
        batch_timings: sql<BatchTimings_Student[]>`JSON_ARRAYAGG(
            JSON_OBJECT(
              'timing_id', ${batchTimings.timingId},
              'batch_info', JSON_OBJECT(
                'batch_id', ${batch.batchId},
                'batch_name', ${batch.batchName}
              ),
              'subject_info', JSON_OBJECT(
                'subject_id', ${subject.subjectId},
                'subject_name', ${subject.subjectName}
              ),
              'teacher_info', JSON_OBJECT(
                'teacher_id', ${teacher.teacherId},
                'first_name', ${teacher.firstName},
                'last_name', ${teacher.lastName}
              ),
              'day_index', ${batchTimings.dayIndex},
              'start_time', ${batchTimings.startTime},
              'end_time', ${batchTimings.endTime}
            )
          )`,
      })
      .from(batchStudents)
      .innerJoin(batch, eq(batch.batchId, batchStudents.batchId))
      .innerJoin(batchTimings, eq(batchTimings.batchId, batch.batchId))
      .innerJoin(
        batchTeachers,
        and(
          eq(batchTeachers.teacherId, batchTimings.teacherId),
          eq(batchTeachers.batchId, batchTimings.batchId)
        )
      )
      .innerJoin(teacher, eq(teacher.teacherId, batchTeachers.teacherId))
      .innerJoin(
        batchSubjects,
        and(
          eq(batchSubjects.subjectId, batchTimings.subjectId),
          eq(batchSubjects.batchId, batchTimings.batchId)
        )
      )
      .innerJoin(subject, eq(subject.subjectId, batchSubjects.subjectId))
      .where(eq(batchStudents.studentId, student_id));
    // .groupBy(batchStudents.studentId)

    console.log(JSON.stringify(studentSchedules, null, 2));
    if (studentSchedules.length) {
      //[{...}] => {...}
      let studentScheduleObj = studentSchedules[0];
      // remove null values from batch_timings where timing_id is null
      studentScheduleObj.batch_timings =
        studentScheduleObj.batch_timings?.filter((bt) =>
          Boolean(bt.timing_id)
        ) ?? [];

      // group by day_index
      // [{...},...] => ['key':{...},...]
      let formattedBatchTimings = groupBy(
        studentScheduleObj.batch_timings,
        "day_index"
      );
      // sort timings by start_time
      for (const day in formattedBatchTimings) {
        formattedBatchTimings[day] = orderBy(
          formattedBatchTimings[day],
          "start_time"
        );
      }

      let batchTimingDays = Object.keys(formattedBatchTimings);

      batchTimingDays = orderBy(batchTimingDays);

      const batchTimingsDaysObject = batchTimingDays.map((day, index) => {
        return weekdays.find((dayObj) => dayObj.index === Number(day))!;
      });

      return {
        status: "success",
        heading: "Student Schedules",
        description: "Student schedules fetched successfully",
        result: {
          student_id: studentScheduleObj.student_id,
          batch_timings: formattedBatchTimings,
          batch_timings_days: batchTimingsDaysObject,
        },
      };
    } else {
      return {
        status: "error",
        heading: "Student Not Found",
        description: "Student Info is either deleted or id is invalid",
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
