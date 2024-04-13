'use server'

import { drizzle_orm } from '@/lib/drizzle'
import {
  studentStayDuration,
  teacherStayDuration
} from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { format } from 'date-fns'
import { and, eq, isNull } from 'drizzle-orm'
import { v4 } from 'uuid'

export default async function changeStudentStay ({
  student_id,
  membership_status,
  date
}: {
  student_id: string
  membership_status: string
  date: string
}): Promise<ServerMessagePOSTType<'active' | 'inactive' | null>> {
  try {
    const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

    if (membership_status === 'active') {
      const student_stays = await drizzle_orm
        .select({
          stay_id: studentStayDuration.stayId,
          joining_date: studentStayDuration.joiningDate
        })
        .from(studentStayDuration)
        .where(
          and(
            eq(studentStayDuration.studentId, student_id),
            isNull(teacherStayDuration.leavingDate)
          )
        )
      if (student_stays.length) {
        return {
          status: 'error',
          heading: 'Membership status already active',
          description:
            'Membership status already is already active. Make it inactive first',
          result: 'active'
        }
      } else {
        await drizzle_orm.insert(studentStayDuration).values({
          stayId: `stay_${v4()}`,
          studentId: student_id,
          joiningDate: format(new Date(date), 'yyyy-MM-dd'),
          createdAt
        })

        return {
          status: 'success',
          heading: 'Membership status changed',
          description: `Membership status has been changed to ${membership_status} successfully`,
          result: 'active'
        }
      }
    } else if (membership_status === 'inactive') {
      const student_stays = await drizzle_orm
        .select({
          stay_id: studentStayDuration.stayId,
          joining_date: studentStayDuration.joiningDate
        })
        .from(studentStayDuration)
        .where(
          and(
            eq(studentStayDuration.studentId, student_id),
            isNull(studentStayDuration.leavingDate)
          )
        )

      if (student_stays.length) {
        await drizzle_orm
          .update(studentStayDuration)
          .set({ leavingDate: format(new Date(date), 'yyyy-MM-dd') })
          .where(
            and(
              eq(studentStayDuration.studentId, student_id),
              isNull(studentStayDuration.leavingDate)
            )
          )
        return {
          status: 'success',
          heading: 'Membership status changed',
          description: `Membership status has been changed to ${membership_status} successfully`,
          result: 'inactive'
        }
      } else {
        const existing_stay = await drizzle_orm
          .select({
            stay_id: studentStayDuration.stayId
          })
          .from(studentStayDuration)
          .where(eq(studentStayDuration.studentId, student_id))
        if (existing_stay.length) {
          console.log('existing_stay if', existing_stay)
          return {
            status: 'error',
            heading: 'Membership status already inactive',
            description:
              'Membership status already is already inactive. Make it active first',
            result: 'inactive'
          }
        } else {
          console.log('existing_stay else', existing_stay)
          return {
            status: 'success',
            heading: 'Membership status set',
            description: `Membership status has been set to ${membership_status} successfully`,
            result: 'inactive'
          }
        }
      }
    } else {
      return {
        status: 'error',
        heading: 'Invalid Data',
        description: 'Membership status must be either active or inactive',
        result: null
      }
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later',
      result: null
    }
  }
}