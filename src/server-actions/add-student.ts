'use server'

import * as z from 'zod'
import { v4 } from 'uuid'
import { drizzle_orm } from '@/lib/drizzle'
import { parent, student } from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { students_index, teachers_index } from '@/lib/algolia'
import { format } from 'date-fns'
import { eq, or } from 'drizzle-orm'
import { StudentTypeBoard } from '@/store/students-store'
import { studentEntrySchema } from '@/schema/entry-form/student'
import changeStudentStay from './change-student-stay'

export async function addStudent (
  data: z.infer<typeof studentEntrySchema>
): Promise<ServerMessagePOSTType<StudentTypeBoard[]>> {
  try {
    const { success } = studentEntrySchema.safeParse(data)
    if (!success) {
      return {
        status: 'error',
        heading: 'Invalid Data',
        description: 'Please check your data and try again'
      }
    }
    const existing_student = await drizzle_orm
      .select({
        student_id: student.studentId,
        email: student.email,
        phone_number: student.phoneNumber
      })
      .from(student)
      .where(
        or(
          eq(student.email, data.email || ''),
          eq(student.phoneNumber, data.phoneNumber)
        )
      )
    if (existing_student.length) {
      //check if email or phone number already exists
      //check if email
      const existing_email = existing_student.find(
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
      const existing_phone = existing_student.find(
        info => info.phone_number === data.phoneNumber
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

    const student_id = `stud_${v4()}`
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
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    })

    await drizzle_orm.insert(parent).values(
      data.parentalInfo.map(info => ({
        parentId: `par_${v4()}`,
        relation: info.relation,
        studentId: student_id,
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        phoneNumber: info.phoneNumber
      }))
    )

    await changeStudentStay({
      student_id,
      membership_status: data.membershipStatus,
      date: format(new Date(), 'yyyy-MM-dd')
    })

    //adding to algolia
    await students_index
      .saveObject({
        objectID: student_id.replace('stud_', ''),
        student_id,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        email: data.email,
        address: data.address,
        membership_status: data.membershipStatus,
        aadhar_number: data.aadharNumber
      })
      .wait()

    return {
      status: 'success',
      heading: 'Added Student',
      description: 'Student added successfully',
      result: [
        {
          student_id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          email: data.email,
          address: data.address || '',
          membership_status: data.membershipStatus,
          aadhar_number: data.aadharNumber
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
