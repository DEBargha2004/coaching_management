'use server'

import {
  teacherEntrySchema,
  TeacherEntrySchemaType
} from '@/schema/entry-form/teacher'
import * as z from 'zod'
import { v4 } from 'uuid'
import { drizzle_orm } from '@/lib/drizzle'
import { teacher, teachersQualification } from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { TeacherTypeBoard } from '@/store/teachers-store'
import { teachers_index } from '@/lib/algolia'
import { format } from 'date-fns'
import { eq, or } from 'drizzle-orm'
import changeTeacherStay from './change-teacher-stay'

export async function addTeacher (
  data: TeacherEntrySchemaType
): Promise<ServerMessagePOSTType<TeacherTypeBoard[]>> {
  try {
    const { success } = teacherEntrySchema.safeParse(data)
    if (!success) {
      return {
        status: 'error',
        heading: 'Invalid Data',
        description: 'Please check your data and try again'
      }
    }
    const existing_Teacher = await drizzle_orm
      .select({
        teacher_id: teacher.teacherId,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber
      })
      .from(teacher)
      .where(
        or(
          eq(teacher.email, data.email || ''),
          eq(teacher.phoneNumber, data.phoneNumber)
        )
      )
    if (existing_Teacher.length) {
      //check if email or phone number already exists
      //check if email
      const existing_email = existing_Teacher.find(
        info => info.email === data.email
      )
      if (existing_email) {
        return {
          status: 'error',
          heading: 'Duplicate Email',
          description: 'Email already exists. Try with another email'
        }
      }
      //check if phone number
      const existing_phone = existing_Teacher.find(
        info => info.phoneNumber === data.phoneNumber
      )
      if (existing_phone) {
        return {
          status: 'error',
          heading: 'Duplicate Phone Number',
          description:
            'Phone number already exists. Try with another phone number'
        }
      }
    }

    const teacher_id = `teach_${v4()}`
    //inserting into db
    await drizzle_orm.insert(teacher).values({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      dob: format(data.dob, 'yyyy-MM-dd'),
      sex: data.sex,
      primaryLanguage: data.primaryLanguage,
      teacherId: teacher_id,
      salary: data.salary,
      membershipStatus: data.membershipStatus,
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    })

    await drizzle_orm.insert(teachersQualification).values(
      data.qualifications.map(q => ({
        teacherId: teacher_id,
        courseType: q.courseType,
        courseName: q.courseName,
        ...(q.major ? { major: q.major } : {}),
        collegeName: q.collegeName,
        qualificationId: `qual_${v4()}`,
        startDate: format(q.startDate, 'yyyy-MM-dd'),
        endDate: format(q.endDate, 'yyyy-MM-dd')
      }))
    )

    await changeTeacherStay({
      teacher_id,
      membership_status: data.membershipStatus,
      date: format(new Date(), 'yyyy-MM-dd')
    })

    //adding to algolia
    await teachers_index
      .saveObject({
        objectID: teacher_id.replace('teach_', ''),
        teacher_id,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        email: data.email,
        address: data.address,
        salary: data.salary,
        membership_status: data.membershipStatus
      })
      .wait()

    return {
      status: 'success',
      heading: 'Added Teacher',
      description: 'Teacher added successfully',
      result: [
        {
          teacher_id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          email: data.email,
          address: data.address || '',
          salary: data.salary,
          membership_status: data.membershipStatus
        }
      ]
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
