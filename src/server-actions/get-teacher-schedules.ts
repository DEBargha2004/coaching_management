'use server'

import { weekdays } from '@/constants/weekdays'
import { drizzle_orm } from '@/lib/drizzle'
import {
  batch,
  batchTeachers,
  batchTimings,
  subject,
  teacher
} from '@/schema/drizzle/schema'
import { ServerMessageGETType } from '@/types/server-message'
import { and, eq, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/mysql-core'
import { groupBy, orderBy } from 'lodash'

type BatchTimings = {
  timing_id: string
  batch_info: {
    batch_id: string
    batch_name: string
  }
  start_time: string
  end_time: string
  day_index: number
  subject_info: {
    subject_id: string
    subject_name: string
  }
}

type FormattedBatchTimings = Record<string, BatchTimings[]>

type TeacherSchedulesFetched = {
  teacher_id: string
  batch_timings: BatchTimings[]
}

type TeacherSchedulesReturn = {
  teacher_id: string
  batch_timings: FormattedBatchTimings
  batch_timings_days: { name: string; index: number }[]
}

export default async function getTeacherSchedules (
  teacher_id: string
): Promise<ServerMessageGETType<TeacherSchedulesReturn>> {
  try {
    const teacherSchedules = await drizzle_orm
      .select({
        teacher_id: batchTimings.teacherId,
        batch_timings: sql<BatchTimings[]>`JSON_ARRAYAGG(
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
      )`
      })
      .from(batchTimings)
      .leftJoin(batch, eq(batch.batchId, batchTimings.batchId))
      .leftJoin(subject, eq(subject.subjectId, batchTimings.subjectId))
      .where(eq(batchTimings.teacherId, teacher_id))
      .groupBy(batchTimings.teacherId)

    if (teacherSchedules.length) {
      let teacherSchedulesObj = teacherSchedules[0]
      teacherSchedulesObj = teacherSchedulesObj.batch_timings[0].timing_id
        ? teacherSchedulesObj
        : { ...teacherSchedulesObj, batch_timings: [] }

      let formattedBatchTimings = groupBy(
        teacherSchedulesObj.batch_timings,
        'day_index'
      )
      for (const day in formattedBatchTimings) {
        formattedBatchTimings[day] = orderBy(
          formattedBatchTimings[day],
          'start_time'
        )
      }

      let batchTimingDays = Object.keys(formattedBatchTimings)
      batchTimingDays = orderBy(batchTimingDays)

      const batchTimingsDaysObject = batchTimingDays.map((day, index) => {
        return weekdays.find(dayObj => dayObj.index === Number(day))!
      })

      return {
        status: 'success',
        heading: 'Teacher Schedules',
        description: 'Teacher schedules fetched successfully',
        result: {
          teacher_id: teacherSchedulesObj.teacher_id,
          batch_timings: formattedBatchTimings,
          batch_timings_days: batchTimingsDaysObject
        }
      }
    } else {
      return {
        status: 'error',
        heading: 'Teacher Not Found',
        description: 'Teacher Info is either deleted or id is invalid'
      }
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