'use server'

import { teacherEntrySchema } from '@/schema/entry-form/teacher'
import * as z from 'zod'
import { v4 } from 'uuid'
import { drizzle_orm } from '@/lib/drizzle'
import { teacher } from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { TeacherTypeBoard } from '@/store/teachers-store'
import { teachers_index } from '@/lib/algolia'
import { format } from 'date-fns'
import { eq, or } from 'drizzle-orm'

export async function addTeacher (
  data: z.infer<typeof teacherEntrySchema>
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
      .select({ teacher_id: teacher.teacherId, email: teacher.email })
      .from(teacher)
      .where(
        or(
          eq(teacher.email, data.email || ''),
          eq(teacher.phoneNumber, data.phoneNumber)
        )
      )
    if (existing_Teacher.length) {
      return {
        status: 'error',
        heading: 'Duplicate Email or Phone Number',
        description: 'Teacher credentials already exists'
      }
    }

    const teacher_id = `teach_${v4()}`
    //inserting into db
    await drizzle_orm.insert(teacher).values({
      //@ts-ignore
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      dob: format(data.dob, 'yyyy-MM-dd'),
      sex: data.sex,
      primaryLanguage: data.primaryLanguage,
      teacherId: teacher_id,
      salary: data.salary
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
        salary: data.salary
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
          address: data.address,
          salary: data.salary
        }
      ]
    } as ServerMessagePOSTType<TeacherTypeBoard[]>
  } catch (error) {
    console.log(error)

    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
